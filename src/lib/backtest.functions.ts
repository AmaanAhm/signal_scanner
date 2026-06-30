import { createServerFn } from "@tanstack/react-start";
import YahooFinance from "yahoo-finance2";

const yf = YahooFinance as any;

// ── Types ──

interface BacktestInput {
  retests: Array<{
    symbol: string;
    name: string;
    signalDate: string;   // YYYY-MM-DD
    signalTime: string;   // HH:MM:SS
    signalPrice: number;
  }>;
}

interface ExitInfo {
  holdDays: number;
  exitDate: string;
  exitPrice: number;
  pnl: number;
  pnlPct: number;
  win: boolean;
}

interface BacktestTrade {
  symbol: string;
  name: string;
  entryDate: string;
  entryTime: string;
  entryPrice: number;
  exits: ExitInfo[];
}

interface HoldPeriodSummary {
  holdDays: number;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  avgReturn: number;
  totalReturn: number;
  maxGain: number;
  maxLoss: number;
}

export interface BacktestResult {
  trades: BacktestTrade[];
  summaries: HoldPeriodSummary[];
}

// ── Server Function ──

export const runBacktest = createServerFn({ method: "POST" })
  .validator((input: BacktestInput) => input)
  .handler(async ({ data }): Promise<BacktestResult> => {
    const { retests } = data;

    // 1. Filter BUY retests only (should already be filtered, but safety check)
    const buyRetests = retests.filter((r) => r.signalPrice > 0);

    // 2. Group by date, take top 10 per date (by earliest time)
    const byDate = new Map<string, typeof buyRetests>();
    for (const r of buyRetests) {
      const existing = byDate.get(r.signalDate) || [];
      existing.push(r);
      byDate.set(r.signalDate, existing);
    }

    const selected: typeof buyRetests = [];
    for (const [, group] of byDate) {
      group.sort((a, b) => a.signalTime.localeCompare(b.signalTime));
      selected.push(...group.slice(0, 10));
    }

    // 3. Sort chronologically
    selected.sort((a, b) => `${a.signalDate} ${a.signalTime}`.localeCompare(`${b.signalDate} ${b.signalTime}`));

    // 4. Process each entry — fetch daily candles for exit prices
    //    Track open positions per symbol to avoid overlapping trades (5-day max hold)
    const openUntil = new Map<string, string>(); // symbol → exit date of current trade
    const trades: BacktestTrade[] = [];

    // Batch symbols for efficiency
    const symbolSet = new Set(selected.map((r) => r.symbol));

    // Fetch daily bars for each symbol (last 60 days should cover all retests)
    const dailyBars = new Map<string, Array<{ date: string; close: number }>>();

    for (const sym of symbolSet) {
      try {
        const result = await yf.chart(sym, {
          period1: new Date(Date.now() - 90 * 86400_000), // 90 days back
          interval: "1d",
        }, { validateResult: false });

        const bars: Array<{ date: string; close: number }> = [];
        for (const q of result.quotes) {
          if (q.close == null) continue;
          const d = q.date instanceof Date ? q.date : new Date(q.date as string);
          const dateStr = d.toISOString().slice(0, 10);
          bars.push({ date: dateStr, close: q.close });
        }
        dailyBars.set(sym, bars);
      } catch {
        // Skip symbol if fetch fails
      }
    }

    // 5. Build trades
    for (const entry of selected) {
      // Check for overlapping trade
      const lastExit = openUntil.get(entry.symbol);
      if (lastExit && entry.signalDate <= lastExit) continue; // skip — still in a trade

      const bars = dailyBars.get(entry.symbol);
      if (!bars || bars.length === 0) continue;

      // Find the entry date index in daily bars
      const entryIdx = bars.findIndex((b) => b.date >= entry.signalDate);
      if (entryIdx < 0) continue;

      // Get exit prices for 1-5 trading days after entry
      const exits: ExitInfo[] = [];
      for (let hold = 1; hold <= 5; hold++) {
        const exitIdx = entryIdx + hold;
        if (exitIdx >= bars.length) break; // not enough data

        const exitBar = bars[exitIdx];
        const pnl = exitBar.close - entry.signalPrice;
        const pnlPct = (pnl / entry.signalPrice) * 100;

        exits.push({
          holdDays: hold,
          exitDate: exitBar.date,
          exitPrice: exitBar.close,
          pnl: Math.round(pnl * 100) / 100,
          pnlPct: Math.round(pnlPct * 100) / 100,
          win: pnl > 0,
        });
      }

      if (exits.length === 0) continue;

      // Mark symbol as occupied until the 5-day exit (or last available)
      const maxExit = exits[exits.length - 1];
      openUntil.set(entry.symbol, maxExit.exitDate);

      trades.push({
        symbol: entry.symbol,
        name: entry.name,
        entryDate: entry.signalDate,
        entryTime: entry.signalTime,
        entryPrice: entry.signalPrice,
        exits,
      });
    }

    // 6. Build summaries per holding period
    const summaries: HoldPeriodSummary[] = [];
    for (let hold = 1; hold <= 5; hold++) {
      const relevant = trades
        .map((t) => t.exits.find((e) => e.holdDays === hold))
        .filter((e): e is ExitInfo => e != null);

      const wins = relevant.filter((e) => e.win).length;
      const losses = relevant.length - wins;
      const returns = relevant.map((e) => e.pnlPct);

      summaries.push({
        holdDays: hold,
        totalTrades: relevant.length,
        wins,
        losses,
        winRate: relevant.length > 0 ? Math.round((wins / relevant.length) * 10000) / 100 : 0,
        avgReturn: returns.length > 0 ? Math.round((returns.reduce((a, b) => a + b, 0) / returns.length) * 100) / 100 : 0,
        totalReturn: Math.round(returns.reduce((a, b) => a + b, 0) * 100) / 100,
        maxGain: returns.length > 0 ? Math.round(Math.max(...returns) * 100) / 100 : 0,
        maxLoss: returns.length > 0 ? Math.round(Math.min(...returns) * 100) / 100 : 0,
      });
    }

    return { trades, summaries };
  });
