import { createServerFn } from "@tanstack/react-start";
import { runLorentzian } from "./lorentzian";
import type { Bar } from "./indicators";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ validation: { logErrors: false } });

// ── Types ──

export type DateRange = "6m" | "1y" | "2y" | "3y" | "4y" | { start: string; end: string };

interface BacktestEntry {
  symbol: string;
  name: string;
  direction: "BUY" | "SELL";
  signalDate: string;
  signalTime: string;
  signalPrice: number;
  retestDate: string;
  retestTime: string;
  retestPrice: number;
  exitType: "TARGET" | "EOD";
  exitPrice: number;
  exitTime: string;
  pnl: number;
  pnlPct: number;
  win: boolean;
  holdingMinutes: number;
}

export interface BacktestTrade {
  symbol: string;
  name: string;
  direction: "BUY" | "SELL";
  entryDate: string;
  entryTime: string;
  entryPrice: number;
  exitType: "TARGET" | "EOD";
  exitPrice: number;
  exitTime: string;
  pnl: number;
  pnlPct: number;
  win: boolean;
  holdingMinutes: number;
}

export interface BacktestSummary {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalReturn: number;
  avgReturn: number;
  maxDrawdown: number;
  profitFactor: number;
  avgHoldingMinutes: number;
  targetExits: number;
  eodExits: number;
  maxGain: number;
  maxLoss: number;
}

export interface BacktestResult {
  trades: BacktestTrade[];
  summary: BacktestSummary;
  totalStocksProcessed: number;
  totalStocksWithSignals: number;
  dateRangeUsed: { start: string; end: string };
}

// ── Helpers ──

function dateRangeToDays(dr: DateRange): { period1: Date; period2: Date } {
  const now = new Date();
  if (typeof dr === "object") {
    return { period1: new Date(dr.start), period2: new Date(dr.end) };
  }
  const months = { "6m": 6, "1y": 12, "2y": 24, "3y": 36, "4y": 48 }[dr];
  const period1 = new Date(now);
  period1.setMonth(period1.getMonth() - months);
  return { period1, period2: now };
}

function formatIST(epochMs: number): { date: string; time: string } {
  const d = new Date(epochMs);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}:${get("second")}` };
}

function istMinutesFromTime(time: string): number {
  const h = parseInt(time.slice(0, 2), 10);
  const m = parseInt(time.slice(3, 5), 10);
  return h * 60 + m;
}

// ── Per-stock backtest ──
// Signal → store → wait for retest → entry at signal close
// Exit: +2% target OR 2:55 PM EOD same day

export const backtestStock = createServerFn({ method: "POST" })
  .validator((input: { symbol: string; name: string; dateRange: DateRange; timeframe: "15m" | "30m" | "60m" | "1d" }) => input)
  .handler(async ({ data }): Promise<{ entries: BacktestEntry[]; error?: string }> => {
    try {
      const { period1 } = dateRangeToDays(data.dateRange);
      const tf = data.timeframe || "1d";

      const tfConfig: Record<string, { maxDays: number; barsPerDay: number }> = {
        "15m": { maxDays: 55, barsPerDay: 26 },
        "30m": { maxDays: 55, barsPerDay: 13 },
        "60m": { maxDays: 700, barsPerDay: 7 },
        "1d":  { maxDays: 5 * 365, barsPerDay: 1 },
      };
      const { maxDays, barsPerDay } = tfConfig[tf] || tfConfig["1d"];

      const warmupBars = 350;
      const warmupDays = Math.ceil(warmupBars / barsPerDay) + 30;
      const fetchStart = new Date(Math.max(
        period1.getTime() - warmupDays * 86400_000,
        Date.now() - maxDays * 86400_000,
      ));

      const result = await yf.chart(data.symbol, {
        period1: fetchStart,
        interval: tf as "1d" | "15m" | "30m" | "60m",
      }, { validateResult: false }) as any;

      const bars: Bar[] = [];
      for (const q of result.quotes) {
        if (q.open == null || q.high == null || q.low == null || q.close == null) continue;
        const time = q.date instanceof Date ? q.date.getTime() : new Date(q.date as string).getTime();
        bars.push({ open: q.open, high: q.high, low: q.low, close: q.close, volume: q.volume ?? 0, time });
      }

      if (bars.length < 100) return { entries: [], error: "Not enough data" };

      // Run Lorentzian classification
      const lorentzResult = runLorentzian(bars);

      // Build signal index
      const signalAt = new Map<number, { dir: "BUY" | "SELL"; price: number }>();
      for (const sig of lorentzResult.signals) {
        if (sig.source !== "Original" || !sig.signal) continue;
        signalAt.set(sig.index, {
          dir: sig.signal as "BUY" | "SELL",
          price: bars[sig.index].close,
        });
      }

      const rangeStart = period1.getTime();
      const entries: BacktestEntry[] = [];

      // Pending signal tracker
      let pending: {
        dir: "BUY" | "SELL";
        price: number;
        date: string;
        time: string;
        barIndex: number;
      } | null = null;

      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];

        // Check retest of pending signal
        if (pending && i > pending.barIndex && bar.time >= rangeStart) {
          const touching = bar.low <= pending.price && bar.high >= pending.price;
          if (touching) {
            const { date: rtDate, time: rtTime } = formatIST(bar.time);
            const displayTime = tf === "1d" ? "Intraday" : rtTime;
            const entryPrice = pending.price;
            const TARGET_PCT = 0.02; // 2%

            // ── Calculate exit ──
            let exitType: "TARGET" | "EOD" = "EOD";
            let exitPrice = bar.close; // default: EOD close
            let exitTime = displayTime;
            let holdingMinutes = 0;

            if (tf === "1d") {
              // Daily bar: check if target was hit within the bar's range
              if (pending.dir === "BUY" && bar.high >= entryPrice * (1 + TARGET_PCT)) {
                exitType = "TARGET";
                exitPrice = Math.round(entryPrice * (1 + TARGET_PCT) * 100) / 100;
                exitTime = "Intraday";
              } else if (pending.dir === "SELL" && bar.low <= entryPrice * (1 - TARGET_PCT)) {
                exitType = "TARGET";
                exitPrice = Math.round(entryPrice * (1 - TARGET_PCT) * 100) / 100;
                exitTime = "Intraday";
              } else {
                exitPrice = bar.close;
                exitTime = "15:30";
              }
              // Estimate holding: if target hit, ~half day; if EOD, full day
              holdingMinutes = exitType === "TARGET" ? 180 : 375;
            } else {
              // Intraday TF: walk forward through same-day bars
              const entryMinutes = istMinutesFromTime(rtTime);
              const rtDateStr = rtDate;
              let found = false;

              // Check the retest bar itself first
              if (pending.dir === "BUY" && bar.high >= entryPrice * (1 + TARGET_PCT)) {
                exitType = "TARGET";
                exitPrice = Math.round(entryPrice * (1 + TARGET_PCT) * 100) / 100;
                exitTime = rtTime;
                holdingMinutes = 0;
                found = true;
              } else if (pending.dir === "SELL" && bar.low <= entryPrice * (1 - TARGET_PCT)) {
                exitType = "TARGET";
                exitPrice = Math.round(entryPrice * (1 - TARGET_PCT) * 100) / 100;
                exitTime = rtTime;
                holdingMinutes = 0;
                found = true;
              }

              if (!found) {
                // Walk forward through subsequent bars on the same date
                let lastBarOfDay = bar;
                let lastBarTime = rtTime;

                for (let k = i + 1; k < bars.length; k++) {
                  const fBar = bars[k];
                  const { date: fDate, time: fTime } = formatIST(fBar.time);
                  if (fDate !== rtDateStr) break; // Different day → stop

                  const fMinutes = istMinutesFromTime(fTime);

                  // Check target
                  if (!found) {
                    if (pending.dir === "BUY" && fBar.high >= entryPrice * (1 + TARGET_PCT)) {
                      exitType = "TARGET";
                      exitPrice = Math.round(entryPrice * (1 + TARGET_PCT) * 100) / 100;
                      exitTime = fTime;
                      holdingMinutes = fMinutes - entryMinutes;
                      found = true;
                      break;
                    } else if (pending.dir === "SELL" && fBar.low <= entryPrice * (1 - TARGET_PCT)) {
                      exitType = "TARGET";
                      exitPrice = Math.round(entryPrice * (1 - TARGET_PCT) * 100) / 100;
                      exitTime = fTime;
                      holdingMinutes = fMinutes - entryMinutes;
                      found = true;
                      break;
                    }
                  }

                  lastBarOfDay = fBar;
                  lastBarTime = fTime;
                }

                if (!found) {
                  // EOD exit at last bar of the day (closest to 2:55 PM / 14:55)
                  exitType = "EOD";
                  exitPrice = lastBarOfDay.close;
                  exitTime = lastBarTime;
                  holdingMinutes = istMinutesFromTime(lastBarTime) - entryMinutes;
                  if (holdingMinutes < 0) holdingMinutes = 0;
                }
              }
            }

            // Calculate P&L
            const pnl = pending.dir === "BUY"
              ? exitPrice - entryPrice
              : entryPrice - exitPrice;
            const pnlPct = (pnl / entryPrice) * 100;

            entries.push({
              symbol: data.symbol,
              name: data.name,
              direction: pending.dir,
              signalDate: pending.date,
              signalTime: tf === "1d" ? "Intraday" : pending.time,
              signalPrice: pending.price,
              retestDate: rtDate,
              retestTime: displayTime,
              retestPrice: entryPrice,
              exitType,
              exitPrice: Math.round(exitPrice * 100) / 100,
              exitTime,
              pnl: Math.round(pnl * 100) / 100,
              pnlPct: Math.round(pnlPct * 100) / 100,
              win: pnl > 0,
              holdingMinutes: Math.max(0, holdingMinutes),
            });

            pending = null;
          }
        }

        // Check for new signal → replace pending
        // Only consider signals after 12 PM IST (intraday TFs)
        const newSig = signalAt.get(i);
        if (newSig) {
          const { date, time } = formatIST(bar.time);
          if (tf !== "1d") {
            const hour = parseInt(time.slice(0, 2), 10);
            if (hour < 12) continue;
          }
          pending = {
            dir: newSig.dir,
            price: newSig.price,
            date,
            time,
            barIndex: i,
          };
        }
      }

      return { entries };
    } catch (e) {
      return { entries: [], error: e instanceof Error ? e.message : "Unknown" };
    }
  });

// ── Aggregate: no-overlap, compile trades, compute summary ──
// Zero API calls — all exits pre-calculated

export const aggregateBacktest = createServerFn({ method: "POST" })
  .validator((input: { allEntries: BacktestEntry[]; dateRange: DateRange; totalScanned?: number }) => input)
  .handler(async ({ data }): Promise<BacktestResult> => {
    const { allEntries, dateRange, totalScanned } = data;
    const { period1, period2 } = dateRangeToDays(dateRange);

    // 1. Sort chronologically
    allEntries.sort((a, b) => `${a.retestDate} ${a.retestTime}`.localeCompare(`${b.retestDate} ${b.retestTime}`));

    // 2. No-overlap per symbol
    const openUntil = new Map<string, string>();
    const filtered: BacktestEntry[] = [];
    for (const e of allEntries) {
      const lastExit = openUntil.get(e.symbol);
      if (lastExit && e.retestDate <= lastExit) continue;
      filtered.push(e);
      // Same-day exit, so only block the entry date
      openUntil.set(e.symbol, e.retestDate);
    }

    // 3. Build trades
    const trades: BacktestTrade[] = [];
    const symbolSet = new Set<string>();

    for (const e of filtered) {
      symbolSet.add(e.symbol);
      trades.push({
        symbol: e.symbol,
        name: e.name,
        direction: e.direction,
        entryDate: e.retestDate,
        entryTime: e.retestTime,
        entryPrice: e.retestPrice,
        exitType: e.exitType,
        exitPrice: e.exitPrice,
        exitTime: e.exitTime,
        pnl: e.pnl,
        pnlPct: e.pnlPct,
        win: e.win,
        holdingMinutes: e.holdingMinutes,
      });
    }

    // 4. Compute summary
    const wins = trades.filter((t) => t.win).length;
    const losses = trades.length - wins;
    const returns = trades.map((t) => t.pnlPct);
    const totalRet = returns.reduce((a, b) => a + b, 0);

    const sumWins = returns.filter((r) => r > 0).reduce((a, b) => a + b, 0);
    const sumLosses = Math.abs(returns.filter((r) => r < 0).reduce((a, b) => a + b, 0));
    const profitFactor = sumLosses > 0 ? Math.round((sumWins / sumLosses) * 100) / 100 : sumWins > 0 ? Infinity : 0;

    // Max drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let cumulative = 0;
    for (const r of returns) {
      cumulative += r;
      if (cumulative > peak) peak = cumulative;
      const dd = peak - cumulative;
      if (dd > maxDrawdown) maxDrawdown = dd;
    }

    const targetExits = trades.filter((t) => t.exitType === "TARGET").length;
    const eodExits = trades.filter((t) => t.exitType === "EOD").length;
    const totalHolding = trades.reduce((a, t) => a + t.holdingMinutes, 0);

    const summary: BacktestSummary = {
      totalTrades: trades.length,
      wins,
      losses,
      winRate: trades.length > 0 ? Math.round((wins / trades.length) * 10000) / 100 : 0,
      totalReturn: Math.round(totalRet * 100) / 100,
      avgReturn: returns.length > 0 ? Math.round((totalRet / returns.length) * 100) / 100 : 0,
      maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      profitFactor,
      avgHoldingMinutes: trades.length > 0 ? Math.round(totalHolding / trades.length) : 0,
      targetExits,
      eodExits,
      maxGain: returns.length > 0 ? Math.round(Math.max(...returns) * 100) / 100 : 0,
      maxLoss: returns.length > 0 ? Math.round(Math.min(...returns) * 100) / 100 : 0,
    };

    return {
      trades,
      summary,
      totalStocksProcessed: totalScanned ?? symbolSet.size,
      totalStocksWithSignals: symbolSet.size,
      dateRangeUsed: { start: period1.toISOString().slice(0, 10), end: period2.toISOString().slice(0, 10) },
    };
  });
