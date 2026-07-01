import { createServerFn } from "@tanstack/react-start";
import { runLorentzian, type LorentzianBarSignal } from "./lorentzian";
import type { Bar } from "./indicators";
import YahooFinance from "yahoo-finance2";

export type Timeframe = "5m" | "10m" | "15m" | "30m" | "60m" | "2h" | "4h" | "1d";

interface ScanInput {
  symbol: string;
  name: string;
  timeframe: Timeframe;
}

interface SignalInfo {
  signal: "BUY" | "SELL";
  signalDate: string;
  signalTime: string;
  signalPrice: number;
}

interface ScanResult {
  symbol: string;
  name: string;
  original: SignalInfo | null;
  retests: SignalInfo[];
  currentPrice: number | null;
  timeframe: Timeframe;
  trend: "Bullish" | "Bearish" | "Neutral";
  retestLevel: number | null;
  retestDirection: "BUY" | "SELL" | null;
  error?: string;
}

// Mapping: our TF → Yahoo native interval + aggregation factor
const TF_CONFIG: Record<Timeframe, { yahooInterval: string; rangeDays: number; aggregate: number }> = {
  "5m":  { yahooInterval: "5m",  rangeDays: 55,       aggregate: 1 },
  "10m": { yahooInterval: "5m",  rangeDays: 55,       aggregate: 2 },  // 2×5m
  "15m": { yahooInterval: "15m", rangeDays: 55,       aggregate: 1 },
  "30m": { yahooInterval: "30m", rangeDays: 55,       aggregate: 1 },
  "60m": { yahooInterval: "60m", rangeDays: 700,      aggregate: 1 },
  "2h":  { yahooInterval: "60m", rangeDays: 700,      aggregate: 2 },  // 2×60m
  "4h":  { yahooInterval: "60m", rangeDays: 700,      aggregate: 4 },  // 4×60m
  "1d":  { yahooInterval: "1d",  rangeDays: 5 * 365,  aggregate: 1 },
};

// Aggregate N consecutive bars into one OHLCV bar
function aggregateBars(bars: Bar[], n: number): Bar[] {
  if (n <= 1) return bars;
  const result: Bar[] = [];
  for (let i = 0; i <= bars.length - n; i += n) {
    let high = bars[i].high;
    let low = bars[i].low;
    let vol = 0;
    for (let j = 0; j < n; j++) {
      high = Math.max(high, bars[i + j].high);
      low = Math.min(low, bars[i + j].low);
      vol += bars[i + j].volume;
    }
    result.push({
      open: bars[i].open,
      high,
      low,
      close: bars[i + n - 1].close,
      volume: vol,
      time: bars[i].time,
    });
  }
  return result;
}

// Singleton yahoo-finance2 instance (handles cookie/crumb auth internally).
// Suppress strict schema validation that rejects many valid NSE responses.
const yf = new YahooFinance({ validation: { logErrors: false } });

async function fetchYahoo(symbol: string, tf: Timeframe): Promise<Bar[]> {
  const { yahooInterval, rangeDays, aggregate } = TF_CONFIG[tf];
  const period1 = new Date(Date.now() - rangeDays * 86400_000);

  const result = await yf.chart(symbol, {
    period1,
    interval: yahooInterval as any,
  }, { validateResult: false }) as any;

  const bars: Bar[] = [];
  for (const q of result.quotes) {
    const o = q.open;
    const h = q.high;
    const l = q.low;
    const c = q.close;
    const v = q.volume;
    if (o == null || h == null || l == null || c == null) continue;
    const time = q.date instanceof Date ? q.date.getTime() : new Date(q.date as string).getTime();
    bars.push({ open: o, high: h, low: l, close: c, volume: v ?? 0, time });
  }

  return aggregateBars(bars, aggregate);
}

function formatIST(epochMs: number): { date: string; time: string } {
  const d = new Date(epochMs);
  // Convert to Asia/Kolkata using Intl
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
  };
}

interface PaperTradeInput {
  symbol: string;
  name: string;
  side: "BUY" | "SELL";
  signalDate: string; // YYYY-MM-DD (IST)
  signalPrice: number;
}

export interface PaperTradeResult {
  symbol: string;
  name: string;
  side: "BUY" | "SELL";
  signalDate: string;
  signalPrice: number;
  closes: (number | null)[]; // closes for day 1..5 after signal
  pnlPct: (number | null)[]; // pnl % for day 1..5
  error?: string;
}

export const simulatePaperTrade = createServerFn({ method: "POST" })
  .validator((input: PaperTradeInput) => input)
  .handler(async ({ data }): Promise<PaperTradeResult> => {
    const base: PaperTradeResult = {
      symbol: data.symbol,
      name: data.name,
      side: data.side,
      signalDate: data.signalDate,
      signalPrice: data.signalPrice,
      closes: [null, null, null, null, null],
      pnlPct: [null, null, null, null, null],
    };
    try {
      const bars = await fetchYahoo(data.symbol, "1d");
      if (!bars.length) return { ...base, error: "No daily data" };
      // Find index of first bar with IST date on or after signalDate.
      let startIdx = -1;
      for (let i = 0; i < bars.length; i++) {
        const { date } = formatIST(bars[i].time);
        if (date >= data.signalDate) {
          startIdx = i;
          break;
        }
      }
      if (startIdx < 0) return { ...base, error: "No forward bars yet" };
      const closes: (number | null)[] = [];
      const pnl: (number | null)[] = [];
      for (let d = 0; d < 5; d++) {
        const b = bars[startIdx + d];
        if (!b) {
          closes.push(null);
          pnl.push(null);
          continue;
        }
        closes.push(b.close);
        const raw = ((b.close - data.signalPrice) / data.signalPrice) * 100;
        pnl.push(data.side === "BUY" ? raw : -raw);
      }
      return { ...base, closes, pnlPct: pnl };
    } catch (e) {
      return { ...base, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });

export const scanStock = createServerFn({ method: "POST" })
  .validator((input: ScanInput) => input)
  .handler(async ({ data }): Promise<ScanResult> => {
    const base: ScanResult = {
      symbol: data.symbol,
      name: data.name,
      original: null,
      retests: [],
      currentPrice: null,
      timeframe: data.timeframe,
      trend: "Neutral",
      retestLevel: null,
      retestDirection: null,
    };
    try {
      // Step 1: Find signal on the selected timeframe using Lorentzian.
      const bars = await fetchYahoo(data.symbol, data.timeframe);
      if (bars.length < 100) return { ...base, error: "Not enough data" };
      const result = runLorentzian(bars);
      const currentPrice = bars[bars.length - 1].close;

      // Find the most recent Original signal.
      let latestOriginal: SignalInfo | null = null;
      let signalEpoch = 0;
      let signalDirection: "BUY" | "SELL" | null = null;
      let retestLevel = 0;

      for (let i = result.signals.length - 1; i >= 0; i--) {
        const s = result.signals[i];
        if (s.source === "Original" && s.signal) {
          const { date, time } = formatIST(s.time);
          latestOriginal = { signal: s.signal, signalDate: date, signalTime: time, signalPrice: s.close };
          signalEpoch = bars[s.index].time;
          signalDirection = s.signal;
          // BUY → retest at signal candle's HIGH; SELL → retest at signal candle's LOW
          retestLevel = s.signal === "BUY" ? bars[s.index].high : bars[s.index].low;
          break;
        }
      }

      // Step 2: Detect retests using fine-grained bars (1m or 5m),
      //         NOT the selected timeframe bars.
      // IMPORTANT: Skip all 1m bars within the signal candle itself.
      // signalEpoch = candle OPEN time. A 30m candle at 10:15 spans 10:15–10:45.
      // Retests should only count AFTER the signal candle closes.
      const tfDurationMs: Record<string, number> = {
        "1m": 60_000, "5m": 5 * 60_000, "15m": 15 * 60_000,
        "30m": 30 * 60_000, "60m": 60 * 60_000, "1d": 24 * 3600_000,
      };
      const signalCandleEnd = signalEpoch + (tfDurationMs[data.timeframe] || 30 * 60_000);

      const retests: SignalInfo[] = [];
      if (signalEpoch > 0 && signalDirection && retestLevel > 0) {
        try {
          const signalAge = Date.now() - signalEpoch;
          // 1m bars available for ~7 days, 5m for ~60 days
          const fineInterval = signalAge < 6.5 * 86400_000 ? "1m" : "5m";
          const fineResult = await yf.chart(data.symbol, {
            period1: new Date(signalEpoch),
            interval: fineInterval as "1m" | "5m",
          }, { validateResult: false }) as any;

          let wasTouching = false; // track consecutive touches
          for (const q of fineResult.quotes) {
            const h = q.high;
            const l = q.low;
            if (h == null || l == null) continue;
            const t = q.date instanceof Date ? q.date.getTime() : new Date(q.date as string).getTime();
            // Skip all bars within or before the signal candle
            if (t < signalCandleEnd) continue;

            const touching = l <= retestLevel && h >= retestLevel;
            if (touching && !wasTouching) {
              // New touch event (not a continuation of a previous touch)
              const { date, time } = formatIST(t);
              retests.push({
                signal: signalDirection,
                signalDate: date,
                signalTime: time,
                signalPrice: retestLevel,
              });
            }
            wasTouching = touching;
          }
        } catch {
          // Fine-grained fetch failed — skip retest detection, will rely on live checker
        }
      }

      const trend = result.signals[result.signals.length - 1]?.trend || "Neutral";
      return {
        ...base,
        original: latestOriginal,
        retests,
        currentPrice,
        trend,
        retestLevel: retestLevel || null,
        retestDirection: signalDirection,
      };
    } catch (e) {
      return { ...base, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });

// ── Lightweight retest checker (runs every minute, no Lorentzian needed) ──

interface RetestCheckItem {
  symbol: string;
  name: string;
  level: number;
  direction: "BUY" | "SELL";
  signalDate: string;
  signalTime: string;
  signalPrice: number;
}

interface RetestCheckResult {
  symbol: string;
  name: string;
  retested: boolean;
  currentPrice: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  direction: "BUY" | "SELL";
  level: number;
  signalDate: string;
  signalTime: string;
  signalPrice: number;
}

export const checkRetestBatch = createServerFn({ method: "POST" })
  .validator((input: { items: RetestCheckItem[] }) => input)
  .handler(async ({ data }): Promise<RetestCheckResult[]> => {
    const results: RetestCheckResult[] = [];
    const BATCH = 6;

    for (let i = 0; i < data.items.length; i += BATCH) {
      const batch = data.items.slice(i, i + BATCH);
      const settled = await Promise.allSettled(
        batch.map(async (item) => {
          try {
            const q = await yf.quote(item.symbol, {}, { validateResult: false });
            const dayHigh = (q as Record<string, unknown>).regularMarketDayHigh as number | undefined ?? null;
            const dayLow = (q as Record<string, unknown>).regularMarketDayLow as number | undefined ?? null;
            const price = (q as Record<string, unknown>).regularMarketPrice as number | undefined ?? null;

            // Retest = day's price range touched the retest level (signal candle HIGH/LOW)
            let retested = false;
            if (dayHigh != null && dayLow != null) {
              retested = dayLow <= item.level && dayHigh >= item.level;
            } else if (price != null) {
              retested = Math.abs(price - item.level) / item.level < 0.003;
            }

            return {
              symbol: item.symbol,
              name: item.name,
              retested,
              currentPrice: price,
              dayHigh,
              dayLow,
              direction: item.direction,
              level: item.level,
              signalDate: item.signalDate,
              signalTime: item.signalTime,
              signalPrice: item.signalPrice,
            } satisfies RetestCheckResult;
          } catch {
            return {
              symbol: item.symbol,
              name: item.name,
              retested: false,
              currentPrice: null,
              dayHigh: null,
              dayLow: null,
              direction: item.direction,
              level: item.level,
              signalDate: item.signalDate,
              signalTime: item.signalTime,
              signalPrice: item.signalPrice,
            } satisfies RetestCheckResult;
          }
        }),
      );
      for (const s of settled) {
        if (s.status === "fulfilled") results.push(s.value);
      }
    }
    return results;
  });

// ── Batch quote fetcher for paper trade price updates ──

export const getQuotesBatch = createServerFn({ method: "POST" })
  .validator((input: { symbols: string[] }) => input)
  .handler(async ({ data }): Promise<Record<string, number | null>> => {
    const prices: Record<string, number | null> = {};
    const BATCH = 8;
    for (let i = 0; i < data.symbols.length; i += BATCH) {
      const batch = data.symbols.slice(i, i + BATCH);
      const settled = await Promise.allSettled(
        batch.map(async (symbol) => {
          try {
            const q = await yf.quote(symbol, {}, { validateResult: false });
            const price = (q as Record<string, unknown>).regularMarketPrice as number | undefined;
            return { symbol, price: price ?? null };
          } catch {
            return { symbol, price: null };
          }
        }),
      );
      for (const s of settled) {
        if (s.status === "fulfilled") prices[s.value.symbol] = s.value.price;
      }
    }
    return prices;
  });
