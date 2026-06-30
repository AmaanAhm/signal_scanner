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
  signalPrice: number;   // close of signal candle
  retestDate: string;
  retestTime: string;
  retestPrice: number;   // same as signalPrice
  dailyExits: Array<{ holdDays: number; exitDate: string; exitPrice: number }>;
}

interface ExitInfo {
  holdDays: number;
  exitDate: string;
  exitPrice: number;
  pnl: number;
  pnlPct: number;
  win: boolean;
}

export interface BacktestTrade {
  symbol: string;
  name: string;
  direction: "BUY" | "SELL";
  entryDate: string;
  entryTime: string;
  entryPrice: number;
  exits: ExitInfo[];
}

export interface HoldPeriodSummary {
  holdDays: number;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  avgReturn: number;
  totalReturn: number;
  maxGain: number;
  maxLoss: number;
  avgHoldingReturn: number;
  profitFactor: number;
  maxDrawdown: number;
}

export interface BacktestResult {
  trades: BacktestTrade[];
  summaries: HoldPeriodSummary[];
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

// ── Per-stock backtest ──
// Step 1: Run Lorentzian → find Original BUY/SELL signals
// Step 2: Walk bars chronologically, store latest signal, wait for retest (price touches signal close)
// Step 3: On retest → create entry with pre-calculated daily exits

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

      // Fetch daily bars for exit price calculation
      let dailyBars: Array<{ date: string; close: number }> = [];
      if (tf !== "1d") {
        try {
          const dr = await yf.chart(data.symbol, {
            period1: new Date(period1.getTime() - 10 * 86400_000),
            interval: "1d",
          }, { validateResult: false }) as any;
          for (const q of dr.quotes) {
            if (q.close == null) continue;
            const d = q.date instanceof Date ? q.date : new Date(q.date as string);
            const { date } = formatIST(d.getTime());
            dailyBars.push({ date, close: q.close });
          }
        } catch { /* skip */ }
      } else {
        for (const b of bars) {
          const { date } = formatIST(b.time);
          dailyBars.push({ date, close: b.close });
        }
      }

      // Run Lorentzian classification
      const lorentzResult = runLorentzian(bars);

      // Build signal index: bar index → signal info
      const signalAt = new Map<number, { dir: "BUY" | "SELL"; price: number }>();
      for (const sig of lorentzResult.signals) {
        if (sig.source !== "Original" || !sig.signal) continue;
        signalAt.set(sig.index, {
          dir: sig.signal as "BUY" | "SELL",
          price: bars[sig.index].close, // Entry at signal candle's CLOSE
        });
      }

      const rangeStart = period1.getTime();
      const entries: BacktestEntry[] = [];

      // Walk through bars chronologically
      // Track pending signal — newest replaces old
      let pending: {
        dir: "BUY" | "SELL";
        price: number;
        date: string;
        time: string;
        barIndex: number;
      } | null = null;

      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];

        // Check retest of pending signal BEFORE checking for new signal
        if (pending && i > pending.barIndex && bar.time >= rangeStart) {
          const touching = bar.low <= pending.price && bar.high >= pending.price;
          if (touching) {
            const { date: rtDate, time: rtTime } = formatIST(bar.time);
            // For daily bars, we can't know exact intraday time — show "Intraday"
            const displayTime = tf === "1d" ? "Intraday" : rtTime;

            // Pre-calculate exits from daily bars
            const dailyExits: Array<{ holdDays: number; exitDate: string; exitPrice: number }> = [];
            const entryDayIdx = dailyBars.findIndex((b) => b.date >= rtDate);
            if (entryDayIdx >= 0) {
              for (let hold = 1; hold <= 5; hold++) {
                const exitIdx = entryDayIdx + hold;
                if (exitIdx >= dailyBars.length) break;
                dailyExits.push({
                  holdDays: hold,
                  exitDate: dailyBars[exitIdx].date,
                  exitPrice: dailyBars[exitIdx].close,
                });
              }
            }

            entries.push({
              symbol: data.symbol,
              name: data.name,
              direction: pending.dir,
              signalDate: pending.date,
              signalTime: tf === "1d" ? "Intraday" : pending.time,
              signalPrice: pending.price,
              retestDate: rtDate,
              retestTime: displayTime,
              retestPrice: pending.price,
              dailyExits,
            });

            pending = null; // Signal consumed — delete it
          }
        }

        // Check for new Original signal on this bar → replace any pending
        const newSig = signalAt.get(i);
        if (newSig) {
          const { date, time } = formatIST(bar.time);
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

// ── Aggregate: sort, no-overlap, build trades + summaries ──
// No API calls — all exit prices are pre-calculated in Phase 1

export const aggregateBacktest = createServerFn({ method: "POST" })
  .validator((input: { allEntries: BacktestEntry[]; dateRange: DateRange; totalScanned?: number }) => input)
  .handler(async ({ data }): Promise<BacktestResult> => {
    const { allEntries, dateRange, totalScanned } = data;
    const { period1, period2 } = dateRangeToDays(dateRange);

    // 1. Sort chronologically by retest date+time
    allEntries.sort((a, b) => `${a.retestDate} ${a.retestTime}`.localeCompare(`${b.retestDate} ${b.retestTime}`));

    // 2. No-overlap rule per symbol: skip if same stock has an open trade
    const openUntil = new Map<string, string>();
    const filtered: BacktestEntry[] = [];
    for (const e of allEntries) {
      const lastExit = openUntil.get(e.symbol);
      if (lastExit && e.retestDate <= lastExit) continue;
      if (!e.dailyExits || e.dailyExits.length === 0) continue;
      filtered.push(e);
      // Reserve exit window (max 5 trading days ≈ 9 calendar days)
      const exitEst = new Date(new Date(e.retestDate).getTime() + 9 * 86400_000).toISOString().slice(0, 10);
      openUntil.set(e.symbol, exitEst);
    }

    // 3. Build trades with direction-aware P&L
    const trades: BacktestTrade[] = [];
    const symbolSet = new Set<string>();

    for (const e of filtered) {
      symbolSet.add(e.symbol);

      const exits: ExitInfo[] = [];
      for (const de of e.dailyExits) {
        // BUY: profit when price goes up.  SELL: profit when price goes down.
        const pnl = e.direction === "BUY"
          ? de.exitPrice - e.retestPrice
          : e.retestPrice - de.exitPrice;
        const pnlPct = (pnl / e.retestPrice) * 100;
        exits.push({
          holdDays: de.holdDays,
          exitDate: de.exitDate,
          exitPrice: Math.round(de.exitPrice * 100) / 100,
          pnl: Math.round(pnl * 100) / 100,
          pnlPct: Math.round(pnlPct * 100) / 100,
          win: pnl > 0,
        });
      }

      if (exits.length === 0) continue;

      trades.push({
        symbol: e.symbol,
        name: e.name,
        direction: e.direction,
        entryDate: e.retestDate,
        entryTime: e.retestTime,
        entryPrice: e.retestPrice,
        exits,
      });
    }

    // 4. Build summaries per holding period
    const summaries: HoldPeriodSummary[] = [];
    for (let hold = 1; hold <= 5; hold++) {
      const relevant = trades
        .map((t) => t.exits.find((e) => e.holdDays === hold))
        .filter((e): e is ExitInfo => e != null);

      const wins = relevant.filter((e) => e.win).length;
      const losses = relevant.length - wins;
      const returns = relevant.map((e) => e.pnlPct);
      const totalRet = returns.reduce((a, b) => a + b, 0);

      // Profit factor = sum of winning returns / |sum of losing returns|
      const sumWins = returns.filter((r) => r > 0).reduce((a, b) => a + b, 0);
      const sumLosses = Math.abs(returns.filter((r) => r < 0).reduce((a, b) => a + b, 0));
      const profitFactor = sumLosses > 0 ? Math.round((sumWins / sumLosses) * 100) / 100 : sumWins > 0 ? Infinity : 0;

      // Max drawdown: worst peak-to-trough in cumulative returns
      let maxDrawdown = 0;
      let peak = 0;
      let cumulative = 0;
      for (const r of returns) {
        cumulative += r;
        if (cumulative > peak) peak = cumulative;
        const dd = peak - cumulative;
        if (dd > maxDrawdown) maxDrawdown = dd;
      }

      summaries.push({
        holdDays: hold,
        totalTrades: relevant.length,
        wins,
        losses,
        winRate: relevant.length > 0 ? Math.round((wins / relevant.length) * 10000) / 100 : 0,
        avgReturn: returns.length > 0 ? Math.round((totalRet / returns.length) * 100) / 100 : 0,
        totalReturn: Math.round(totalRet * 100) / 100,
        maxGain: returns.length > 0 ? Math.round(Math.max(...returns) * 100) / 100 : 0,
        maxLoss: returns.length > 0 ? Math.round(Math.min(...returns) * 100) / 100 : 0,
        avgHoldingReturn: returns.length > 0 ? Math.round((totalRet / returns.length) * 100) / 100 : 0,
        profitFactor,
        maxDrawdown: Math.round(maxDrawdown * 100) / 100,
      });
    }

    return {
      trades,
      summaries,
      totalStocksProcessed: totalScanned ?? symbolSet.size,
      totalStocksWithSignals: new Set(trades.map((t) => t.symbol)).size,
      dateRangeUsed: { start: period1.toISOString().slice(0, 10), end: period2.toISOString().slice(0, 10) },
    };
  });
