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
  direction: "BUY";
  signalDate: string;
  signalTime: string;
  signalPrice: number;
  retestDate: string;
  retestTime: string;
  retestPrice: number;
  exitType: "TARGET" | "STOPLOSS";
  exitPrice: number;
  exitDate: string;
  exitTime: string;
  pnl: number;
  pnlPct: number;
  win: boolean;
  holdingMinutes: number;
}

export interface BacktestTrade {
  symbol: string;
  name: string;
  direction: "BUY";
  signalDate: string;
  signalTime: string;
  signalPrice: number;
  entryDate: string;
  entryTime: string;
  entryPrice: number;
  exitType: "TARGET" | "STOPLOSS";
  exitPrice: number;
  exitDate: string;
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
  stoplossExits: number;
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

// Helper: check if target or stoploss was hit on a bar
function checkExitOnBar(
  entryPrice: number,
  bar: { high: number; low: number },
  targetPct: number,
  slPct: number,
): { type: "TARGET" | "STOPLOSS"; price: number } | null {
  // BUY only: target = price UP, stoploss = price DOWN
  // Check stoploss first (conservative — assume worst case)
  if (bar.low <= entryPrice * (1 - slPct)) {
    return { type: "STOPLOSS", price: Math.round(entryPrice * (1 - slPct) * 100) / 100 };
  }
  if (bar.high >= entryPrice * (1 + targetPct)) {
    return { type: "TARGET", price: Math.round(entryPrice * (1 + targetPct) * 100) / 100 };
  }
  return null;
}

// Fetch bars from Yahoo Finance
async function fetchBars(symbol: string, tf: string, fetchStart: Date): Promise<Bar[]> {
  const result = await yf.chart(symbol, {
    period1: fetchStart,
    interval: tf as any,
  }, { validateResult: false }) as any;

  const bars: Bar[] = [];
  for (const q of result.quotes) {
    if (q.open == null || q.high == null || q.low == null || q.close == null) continue;
    const time = q.date instanceof Date ? q.date.getTime() : new Date(q.date as string).getTime();
    bars.push({ open: q.open, high: q.high, low: q.low, close: q.close, volume: q.volume ?? 0, time });
  }
  return bars;
}

// Determine finest available timeframe for a given period
function finestAvailableTf(periodDays: number): "15m" | "30m" | "60m" | "1d" {
  if (periodDays <= 55) return "15m";
  if (periodDays <= 700) return "60m";
  return "1d";
}

// TF ordering for comparison (lower = finer)
const TF_ORDER: Record<string, number> = { "15m": 1, "30m": 2, "60m": 3, "1d": 4 };

// ── Per-stock backtest ──
// Phase 1: Selected TF → Lorentzian → BUY signals (with timestamps)
// Phase 2: Finest available TF → price-based retest + target/SL exit

export const backtestStock = createServerFn({ method: "POST" })
  .validator((input: { symbol: string; name: string; dateRange: DateRange; timeframe: "15m" | "30m" | "60m" | "1d"; targetPct?: number; stopLossPct?: number }) => input)
  .handler(async ({ data }): Promise<{ entries: BacktestEntry[]; error?: string }> => {
    try {
      const { period1 } = dateRangeToDays(data.dateRange);
      const signalTf = data.timeframe || "1d";
      const TARGET_PCT = (data.targetPct ?? 2) / 100;
      const SL_PCT = (data.stopLossPct ?? 2) / 100;

      // ── Phase 1: Generate BUY signals on selected timeframe ──
      const tfConfig: Record<string, { maxDays: number; barsPerDay: number }> = {
        "15m": { maxDays: 55, barsPerDay: 26 },
        "30m": { maxDays: 55, barsPerDay: 13 },
        "60m": { maxDays: 700, barsPerDay: 7 },
        "1d":  { maxDays: 5 * 365, barsPerDay: 1 },
      };
      const { maxDays, barsPerDay } = tfConfig[signalTf] || tfConfig["1d"];

      const warmupBars = 350;
      const warmupDays = Math.ceil(warmupBars / barsPerDay) + 30;
      const signalFetchStart = new Date(Math.max(
        period1.getTime() - warmupDays * 86400_000,
        Date.now() - maxDays * 86400_000,
      ));

      const signalBars = await fetchBars(data.symbol, signalTf, signalFetchStart);
      if (signalBars.length < 100) return { entries: [], error: "Not enough data" };

      // Run Lorentzian on signal timeframe
      const lorentzResult = runLorentzian(signalBars);

      // Extract BUY signals with timestamps + prices
      // Apply 12 PM filter for intraday TFs
      interface StoredSignal {
        price: number;
        timestamp: number;
        date: string;
        time: string;
      }

      const signals: StoredSignal[] = [];
      for (const sig of lorentzResult.signals) {
        if (sig.source !== "Original" || sig.signal !== "BUY") continue;
        const bar = signalBars[sig.index];
        if (bar.time < period1.getTime()) continue; // Before our range

        const { date, time } = formatIST(bar.time);

        // 12 PM filter for intraday timeframes
        if (signalTf !== "1d") {
          const hour = parseInt(time.slice(0, 2), 10);
          if (hour < 12) continue;
        }

        signals.push({
          price: bar.close,
          timestamp: bar.time,
          date,
          time: signalTf === "1d" ? "Daily" : time,
        });
      }

      if (signals.length === 0) return { entries: [] };

      // ── Phase 2: Retest + Exit on finest available resolution ──
      const periodDays = Math.ceil((Date.now() - period1.getTime()) / 86400_000);
      const fineTf = finestAvailableTf(periodDays);

      // If fine TF is finer than signal TF, fetch separate data
      // Otherwise reuse signal bars (they're already the finest)
      let fineBars: Bar[];
      if (TF_ORDER[fineTf] < TF_ORDER[signalTf]) {
        // Fine TF is finer → fetch new data
        const fineMaxDays = tfConfig[fineTf].maxDays;
        const fineFetchStart = new Date(Math.max(
          period1.getTime(),
          Date.now() - fineMaxDays * 86400_000,
        ));
        fineBars = await fetchBars(data.symbol, fineTf, fineFetchStart);
      } else {
        // Signal TF is already the finest or equal → reuse
        fineBars = signalBars;
      }

      if (fineBars.length === 0) return { entries: [] };

      // ── Walk through fine bars: retest detection + exit ──
      const entries: BacktestEntry[] = [];
      let pendingSignal: StoredSignal | null = null;
      let signalIdx = 0; // Pointer into sorted signals array

      for (let i = 0; i < fineBars.length; i++) {
        const bar = fineBars[i];

        // Check if any new signals have become active (signal timestamp <= bar time)
        // Latest signal always replaces previous (per user rules)
        while (signalIdx < signals.length && signals[signalIdx].timestamp <= bar.time) {
          pendingSignal = signals[signalIdx];
          signalIdx++;
        }

        // Check for retest of pending signal
        if (pendingSignal && bar.time > pendingSignal.timestamp) {
          const touching = bar.low <= pendingSignal.price && bar.high >= pendingSignal.price;
          if (touching) {
            const { date: rtDate, time: rtTime } = formatIST(bar.time);
            const entryPrice = pendingSignal.price;
            const entryTimestamp = bar.time;

            // ── Find exit: walk forward through ALL fine bars ──
            let exitType: "TARGET" | "STOPLOSS" = "STOPLOSS";
            let exitPrice = bar.close;
            let exitDate = rtDate;
            let exitTime = rtTime;
            let holdingMinutes = 0;

            // Check retest bar itself
            const hitEntry = checkExitOnBar(entryPrice, bar, TARGET_PCT, SL_PCT);
            if (hitEntry) {
              exitType = hitEntry.type;
              exitPrice = hitEntry.price;
              exitDate = rtDate;
              exitTime = rtTime;
              holdingMinutes = 0;
            } else {
              // Walk forward through ALL subsequent bars (no day limit)
              let found = false;
              for (let k = i + 1; k < fineBars.length; k++) {
                const fBar = fineBars[k];
                const { date: fDate, time: fTime } = formatIST(fBar.time);

                const hitFwd = checkExitOnBar(entryPrice, fBar, TARGET_PCT, SL_PCT);
                if (hitFwd) {
                  exitType = hitFwd.type;
                  exitPrice = hitFwd.price;
                  exitDate = fDate;
                  exitTime = fTime;
                  holdingMinutes = Math.round((fBar.time - entryTimestamp) / 60000);
                  found = true;
                  break;
                }
              }

              if (!found) {
                // End of data — close at last bar
                const lastBar = fineBars[fineBars.length - 1];
                const { date: lDate, time: lTime } = formatIST(lastBar.time);
                exitPrice = lastBar.close;
                exitDate = lDate;
                exitTime = lTime;
                const pnlCheck = exitPrice - entryPrice;
                exitType = pnlCheck >= 0 ? "TARGET" : "STOPLOSS";
                holdingMinutes = Math.round((lastBar.time - entryTimestamp) / 60000);
              }
            }

            // Calculate P&L (BUY only)
            const pnl = exitPrice - entryPrice;
            const pnlPct = (pnl / entryPrice) * 100;

            entries.push({
              symbol: data.symbol,
              name: data.name,
              direction: "BUY",
              signalDate: pendingSignal.date,
              signalTime: pendingSignal.time,
              signalPrice: pendingSignal.price,
              retestDate: rtDate,
              retestTime: rtTime,
              retestPrice: entryPrice,
              exitType,
              exitPrice: Math.round(exitPrice * 100) / 100,
              exitDate,
              exitTime,
              pnl: Math.round(pnl * 100) / 100,
              pnlPct: Math.round(pnlPct * 100) / 100,
              win: pnl > 0,
              holdingMinutes: Math.max(0, holdingMinutes),
            });

            // Signal consumed — clear it
            pendingSignal = null;
          }
        }
      }

      return { entries };
    } catch (e) {
      return { entries: [], error: e instanceof Error ? e.message : "Unknown" };
    }
  });

// ── Aggregate: no-overlap, compile trades, compute summary ──

export const aggregateBacktest = createServerFn({ method: "POST" })
  .validator((input: { allEntries: BacktestEntry[]; dateRange: DateRange; totalScanned?: number }) => input)
  .handler(async ({ data }): Promise<BacktestResult> => {
    const { allEntries, dateRange, totalScanned } = data;
    const { period1, period2 } = dateRangeToDays(dateRange);

    allEntries.sort((a, b) => `${a.retestDate} ${a.retestTime}`.localeCompare(`${b.retestDate} ${b.retestTime}`));

    const openUntil = new Map<string, number>();
    const filtered: BacktestEntry[] = [];
    for (const e of allEntries) {
      const entryTs = new Date(`${e.retestDate}T${e.retestTime}`).getTime();
      const exitTs = new Date(`${e.exitDate}T${e.exitTime}`).getTime() || entryTs;
      const lastExit = openUntil.get(e.symbol) || 0;
      if (entryTs < lastExit) continue; // Overlapping trade
      filtered.push(e);
      openUntil.set(e.symbol, exitTs);
    }

    const trades: BacktestTrade[] = [];
    const symbolSet = new Set<string>();

    for (const e of filtered) {
      symbolSet.add(e.symbol);
      trades.push({
        symbol: e.symbol,
        name: e.name,
        direction: e.direction,
        signalDate: e.signalDate,
        signalTime: e.signalTime,
        signalPrice: e.signalPrice,
        entryDate: e.retestDate,
        entryTime: e.retestTime,
        entryPrice: e.retestPrice,
        exitType: e.exitType,
        exitPrice: e.exitPrice,
        exitDate: e.exitDate,
        exitTime: e.exitTime,
        pnl: e.pnl,
        pnlPct: e.pnlPct,
        win: e.win,
        holdingMinutes: e.holdingMinutes,
      });
    }

    const wins = trades.filter((t) => t.win).length;
    const losses = trades.length - wins;
    const returns = trades.map((t) => t.pnlPct);
    const totalRet = returns.reduce((a, b) => a + b, 0);

    const sumWins = returns.filter((r) => r > 0).reduce((a, b) => a + b, 0);
    const sumLosses = Math.abs(returns.filter((r) => r < 0).reduce((a, b) => a + b, 0));
    const profitFactor = sumLosses > 0 ? Math.round((sumWins / sumLosses) * 100) / 100 : sumWins > 0 ? Infinity : 0;

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
    const stoplossExits = trades.filter((t) => t.exitType === "STOPLOSS").length;
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
      stoplossExits,
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
