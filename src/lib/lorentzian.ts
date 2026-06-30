// Direct port of jdehorty's "Machine Learning: Lorentzian Classification (Signals Only)" Pine v5 script.
// The math, defaults, and signal-generation logic mirror the source 1:1.

import type { Bar } from "./indicators";
import { filter_adx, filter_volatility, n_adx, n_cci, n_rsi, n_wt, regime_filter } from "./indicators";
import { gaussian, rationalQuadratic } from "./kernels";

export interface LorentzianSettings {
  neighborsCount: number; // default 8
  maxBarsBack: number; // default 2000
  featureCount: number; // default 5 (2..5)
  useVolatilityFilter: boolean; // default true
  useRegimeFilter: boolean; // default true
  useAdxFilter: boolean; // default false
  regimeThreshold: number; // default -0.1
  adxThreshold: number; // default 20
  useKernelFilter: boolean; // default true
  h: number; // kernel lookback, default 8
  r: number; // relative weighting, default 8.0
  x: number; // regression level, default 25
  lag: number; // kernel lag, default 2
}

export const DEFAULT_SETTINGS: LorentzianSettings = {
  neighborsCount: 8,
  maxBarsBack: 2000,
  featureCount: 5,
  useVolatilityFilter: true,
  useRegimeFilter: true,
  useAdxFilter: false,
  regimeThreshold: -0.1,
  adxThreshold: 20,
  useKernelFilter: true,
  h: 8,
  r: 8,
  x: 25,
  lag: 2,
};

export type SignalKind = "BUY" | "SELL" | null;
export type SignalSource = "Original" | "Retest";

export interface LorentzianBarSignal {
  index: number;
  time: number;
  close: number;
  signal: SignalKind; // BUY on new long, SELL on new short, otherwise null
  source: SignalSource | null;
  trend: "Bullish" | "Bearish" | "Neutral";
}

export interface LorentzianResult {
  signals: LorentzianBarSignal[];
  // Latest signal still active (no opposing signal afterwards).
  latest: LorentzianBarSignal | null;
}

function lorentzianDistance(
  fc: number,
  f: { f1: number; f2: number; f3: number; f4: number; f5: number },
  arr: { f1: number[]; f2: number[]; f3: number[]; f4: number[]; f5: number[] },
  i: number,
): number {
  const d1 = Math.log(1 + Math.abs(f.f1 - arr.f1[i]));
  const d2 = Math.log(1 + Math.abs(f.f2 - arr.f2[i]));
  if (fc === 2) return d1 + d2;
  const d3 = Math.log(1 + Math.abs(f.f3 - arr.f3[i]));
  if (fc === 3) return d1 + d2 + d3;
  const d4 = Math.log(1 + Math.abs(f.f4 - arr.f4[i]));
  if (fc === 4) return d1 + d2 + d3 + d4;
  const d5 = Math.log(1 + Math.abs(f.f5 - arr.f5[i]));
  return d1 + d2 + d3 + d4 + d5;
}

export function runLorentzian(bars: Bar[], userSettings: Partial<LorentzianSettings> = {}): LorentzianResult {
  const s = { ...DEFAULT_SETTINGS, ...userSettings };
  const n = bars.length;
  if (n < 50) return { signals: [], latest: null };

  const close = bars.map((b) => b.close);
  const high = bars.map((b) => b.high);
  const low = bars.map((b) => b.low);
  const hlc3 = bars.map((b) => (b.high + b.low + b.close) / 3);
  const ohlc4 = bars.map((b) => (b.open + b.high + b.low + b.close) / 4);

  // Features (Pine defaults): RSI(14,1), WT(10,11), CCI(20,1), ADX(20,2), RSI(9,1)
  const f1 = n_rsi(close, 14, 1);
  const f2 = n_wt(hlc3, 10, 11);
  const f3 = n_cci(close, 20, 1);
  const f4 = n_adx(high, low, close, 20);
  const f5 = n_rsi(close, 9, 1);

  // Filters
  const fVol = filter_volatility(high, low, close, 1, 10, s.useVolatilityFilter);
  const fRegime = regime_filter(ohlc4, high, low, s.regimeThreshold, s.useRegimeFilter);
  const fAdx = filter_adx(high, low, close, 14, s.adxThreshold, s.useAdxFilter);

  // Kernel estimators
  const yhat1 = rationalQuadratic(close, s.h, s.r, s.x);
  const yhat2 = gaussian(close, s.h - s.lag, s.x);

  // y_train: 4 bars ahead direction (per script: src[4] < src[0] => short, > => long)
  // Pine: src[4] refers to value 4 bars ago; src[0] is current.
  const y = new Array(n).fill(0);
  for (let i = 4; i < n; i++) {
    if (close[i - 4] < close[i]) y[i] = -1; // short (price went up, future down? actually script: src[4]<src[0] => short)
    else if (close[i - 4] > close[i]) y[i] = 1; // long
    else y[i] = 0;
  }
  // Note: Pine logic is `src[4] < src[0] ? short : src[4] > src[0] ? long : neutral`
  // src[4] is price 4 bars ago, src[0] is current. We've matched that above.

  const featureArrays = { f1, f2, f3, f4, f5 };

  const maxBarsBackIndex = n >= s.maxBarsBack ? n - s.maxBarsBack : 0;

  const signals: LorentzianBarSignal[] = [];
  let prevSignal: -1 | 0 | 1 = 0;
  let lastDistance = -1;
  const distances: number[] = [];
  const predictions: number[] = [];

  // Retest tracking: store reference level + bar index of most recent original signal.
  let buyRetestLevel: number | null = null;
  let buyRetestBar = -1;
  let sellRetestLevel: number | null = null;
  let sellRetestBar = -1;

  for (let bar = 0; bar < n; bar++) {
    if (bar < maxBarsBackIndex) {
      signals.push({ index: bar, time: bars[bar].time, close: close[bar], signal: null, source: null, trend: "Neutral" });
      continue;
    }
    const fs = { f1: f1[bar], f2: f2[bar], f3: f3[bar], f4: f4[bar], f5: f5[bar] };
    if ([fs.f1, fs.f2, fs.f3, fs.f4, fs.f5].some((v) => isNaN(v))) {
      signals.push({ index: bar, time: bars[bar].time, close: close[bar], signal: null, source: null, trend: "Neutral" });
      continue;
    }

    // Reset per-bar ANN loop (Pine accumulates across bars but the predictions array is shifted)
    // The Pine logic actually keeps `predictions` and `distances` persistent vars across bars,
    // but the loop runs every bar over `sizeLoop` historical bars and pushes when d >= lastDistance & i%4.
    lastDistance = -1;
    distances.length = 0;
    predictions.length = 0;

    const sizeLoop = Math.min(s.maxBarsBack - 1, bar);
    for (let i = 0; i <= sizeLoop; i++) {
      const d = lorentzianDistance(s.featureCount, fs, featureArrays, i);
      if (d >= lastDistance && i % 4 !== 0) {
        lastDistance = d;
        distances.push(d);
        predictions.push(Math.round(y[i]));
        if (predictions.length > s.neighborsCount) {
          lastDistance = distances[Math.round((s.neighborsCount * 3) / 4)];
          distances.shift();
          predictions.shift();
        }
      }
    }
    const prediction = predictions.reduce((a, b) => a + b, 0);
    const filterAll = fVol[bar] && fRegime[bar] && fAdx[bar];

    let signal: -1 | 0 | 1;
    if (prediction > 0 && filterAll) signal = 1;
    else if (prediction < 0 && filterAll) signal = -1;
    else signal = prevSignal;

    const isDifferent = signal !== prevSignal;
    const isBullishSmooth = !isNaN(yhat1[bar]) && !isNaN(yhat2[bar]) && yhat2[bar] >= yhat1[bar];
    const isBearishSmooth = !isNaN(yhat1[bar]) && !isNaN(yhat2[bar]) && yhat2[bar] <= yhat1[bar];
    const isBullish = s.useKernelFilter ? isBullishSmooth : true;
    const isBearish = s.useKernelFilter ? isBearishSmooth : true;

    const startLongTrade = signal === 1 && isDifferent && isBullish;
    const startShortTrade = signal === -1 && isDifferent && isBearish;

    let kind: SignalKind = null;
    let source: SignalSource | null = null;
    if (startLongTrade) {
      kind = "BUY";
      source = "Original";
      buyRetestLevel = bars[bar].high;
      buyRetestBar = bar;
      sellRetestLevel = null;
      sellRetestBar = -1;
    } else if (startShortTrade) {
      kind = "SELL";
      source = "Original";
      sellRetestLevel = bars[bar].low;
      sellRetestBar = bar;
      buyRetestLevel = null;
      buyRetestBar = -1;
    } else {
      // Retest: purely price-based — if bar's range touches the stored level.
      // No ML prediction or filter conditions required.
      if (
        buyRetestLevel != null &&
        bar !== buyRetestBar &&
        bars[bar].low <= buyRetestLevel &&
        bars[bar].high >= buyRetestLevel
      ) {
        kind = "BUY";
        source = "Retest";
        buyRetestBar = bar;
      } else if (
        sellRetestLevel != null &&
        bar !== sellRetestBar &&
        bars[bar].low <= sellRetestLevel &&
        bars[bar].high >= sellRetestLevel
      ) {
        kind = "SELL";
        source = "Retest";
        sellRetestBar = bar;
      }
    }

    const trend: "Bullish" | "Bearish" | "Neutral" = isBullishSmooth
      ? "Bullish"
      : isBearishSmooth
        ? "Bearish"
        : "Neutral";

    signals.push({ index: bar, time: bars[bar].time, close: close[bar], signal: kind, source, trend });

    prevSignal = signal;
  }

  // Find latest signal and check if it's still "active" (no opposite signal after it).
  let latest: LorentzianBarSignal | null = null;
  for (let i = signals.length - 1; i >= 0; i--) {
    if (signals[i].signal) {
      latest = signals[i];
      break;
    }
  }
  return { signals, latest };
}
