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
  signalDate: string;
  signalTime: string;
  signalPrice: number;   // retest level (BUY signal's high)
  retestDate: string;
  retestTime: string;
  retestPrice: number;
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

// ── Per-stock backtest: runs Lorentzian, finds all BUY signals + retests ──

export const backtestStock = createServerFn({ method: "POST" })
  .validator((input: { symbol: string; name: string; dateRange: DateRange; timeframe: "15m" | "30m" | "60m" | "1d" }) => input)
  .handler(async ({ data }): Promise<{ entries: BacktestEntry[]; error?: string }> => {
    try {
      const { period1 } = dateRangeToDays(data.dateRange);
      const tf = data.timeframe || "1d";
      // For intraday Yahoo limits history, fetch as much as possible
      const warmupDays = tf === "1d" ? 400 : 60;
      const fetchStart = new Date(period1.getTime() - warmupDays * 86400_000);

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

      // Filter date range
      const rangeStart = period1.getTime();
      const entries: BacktestEntry[] = [];

      // Find all BUY signals within the date range
      for (let si = 0; si < lorentzResult.signals.length; si++) {
        const sig = lorentzResult.signals[si];
        if (sig.signal !== "BUY" || sig.source !== "Original") continue;
        if (bars[sig.index].time < rangeStart) continue;

        const signalBar = bars[sig.index];
        const retestLevel = signalBar.high; // BUY → retest at signal candle's HIGH
        const { date: sigDate, time: sigTime } = formatIST(signalBar.time);

        // Look forward for retests: daily low <= retestLevel <= daily high
        // Skip the signal bar itself
        for (let j = sig.index + 1; j < bars.length; j++) {
          const bar = bars[j];
          const touching = bar.low <= retestLevel && bar.high >= retestLevel;
          if (touching) {
            const { date: rtDate, time: rtTime } = formatIST(bar.time);
            entries.push({
              symbol: data.symbol,
              name: data.name,
              signalDate: sigDate,
              signalTime: sigTime,
              signalPrice: retestLevel,
              retestDate: rtDate,
              retestTime: rtTime,
              retestPrice: retestLevel,
            });
            break; // Only first retest per signal
          }
          // Stop looking after 20 trading days with no retest
          if (j - sig.index > 20) break;
        }
      }

      return { entries };
    } catch (e) {
      return { entries: [], error: e instanceof Error ? e.message : "Unknown" };
    }
  });

// ── Aggregate backtest results: top-10, no-overlap, exit prices ──

export const aggregateBacktest = createServerFn({ method: "POST" })
  .validator((input: { allEntries: BacktestEntry[]; dateRange: DateRange }) => input)
  .handler(async ({ data }): Promise<BacktestResult> => {
    const { allEntries, dateRange } = data;
    const { period1, period2 } = dateRangeToDays(dateRange);

    // 1. Sort chronologically by retest date+time
    allEntries.sort((a, b) => `${a.retestDate} ${a.retestTime}`.localeCompare(`${b.retestDate} ${b.retestTime}`));

    // 2. Group by retest date, take top 10 per date (earliest first)
    const byDate = new Map<string, BacktestEntry[]>();
    for (const e of allEntries) {
      const arr = byDate.get(e.retestDate) || [];
      arr.push(e);
      byDate.set(e.retestDate, arr);
    }
    const selected: BacktestEntry[] = [];
    for (const [, group] of byDate) {
      selected.push(...group.slice(0, 10));
    }

    // 3. No-overlap rule: skip if same stock has an open trade (5-day max)
    const openUntil = new Map<string, string>();
    const filtered: BacktestEntry[] = [];
    for (const e of selected) {
      const lastExit = openUntil.get(e.symbol);
      if (lastExit && e.retestDate <= lastExit) continue;
      filtered.push(e);
      // We'll calculate actual exit dates below, for now reserve 7 calendar days
      const exitEst = new Date(new Date(e.retestDate).getTime() + 7 * 86400_000).toISOString().slice(0, 10);
      openUntil.set(e.symbol, exitEst);
    }

    // 4. Fetch daily bars for exit prices per symbol
    const symbolSet = new Set(filtered.map((e) => e.symbol));
    const dailyBars = new Map<string, Array<{ date: string; close: number }>>();

    // Batch fetch
    const symbols = [...symbolSet];
    const BATCH = 5;
    for (let i = 0; i < symbols.length; i += BATCH) {
      const batch = symbols.slice(i, i + BATCH);
      await Promise.allSettled(
        batch.map(async (sym) => {
          try {
            const r = await yf.chart(sym, {
              period1: new Date(period1.getTime() - 10 * 86400_000),
              interval: "1d",
            }, { validateResult: false }) as any;
            const bars: Array<{ date: string; close: number }> = [];
            for (const q of r.quotes) {
              if (q.close == null) continue;
              const d = q.date instanceof Date ? q.date : new Date(q.date as string);
              bars.push({ date: d.toISOString().slice(0, 10), close: q.close });
            }
            dailyBars.set(sym, bars);
          } catch { /* skip */ }
        }),
      );
    }

    // 5. Build trades with exit prices
    const trades: BacktestTrade[] = [];
    const openUntilFinal = new Map<string, string>();

    for (const e of filtered) {
      const lastExit = openUntilFinal.get(e.symbol);
      if (lastExit && e.retestDate <= lastExit) continue;

      const bars = dailyBars.get(e.symbol);
      if (!bars) continue;

      const entryIdx = bars.findIndex((b) => b.date >= e.retestDate);
      if (entryIdx < 0) continue;

      const exits: ExitInfo[] = [];
      for (let hold = 1; hold <= 5; hold++) {
        const exitIdx = entryIdx + hold;
        if (exitIdx >= bars.length) break;
        const exitBar = bars[exitIdx];
        const pnl = exitBar.close - e.retestPrice;
        const pnlPct = (pnl / e.retestPrice) * 100;
        exits.push({
          holdDays: hold,
          exitDate: exitBar.date,
          exitPrice: Math.round(exitBar.close * 100) / 100,
          pnl: Math.round(pnl * 100) / 100,
          pnlPct: Math.round(pnlPct * 100) / 100,
          win: pnl > 0,
        });
      }

      if (exits.length === 0) continue;
      openUntilFinal.set(e.symbol, exits[exits.length - 1].exitDate);

      trades.push({
        symbol: e.symbol,
        name: e.name,
        entryDate: e.retestDate,
        entryTime: e.retestTime,
        entryPrice: e.retestPrice,
        exits,
      });
    }

    // 6. Build summaries
    const summaries: HoldPeriodSummary[] = [];
    for (let hold = 1; hold <= 5; hold++) {
      const relevant = trades
        .map((t) => t.exits.find((e) => e.holdDays === hold))
        .filter((e): e is ExitInfo => e != null);

      const wins = relevant.filter((e) => e.win).length;
      const losses = relevant.length - wins;
      const returns = relevant.map((e) => e.pnlPct);
      const totalRet = returns.reduce((a, b) => a + b, 0);

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
      });
    }

    return {
      trades,
      summaries,
      totalStocksProcessed: symbolSet.size,
      totalStocksWithSignals: new Set(trades.map((t) => t.symbol)).size,
      dateRangeUsed: { start: period1.toISOString().slice(0, 10), end: period2.toISOString().slice(0, 10) },
    };
  });
