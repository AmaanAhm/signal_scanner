// Technical indicator primitives and the normalization helpers used by jdehorty/MLExtensions.
// All formulas mirror Pine Script's behavior (ta.rma, ta.ema, ta.sma, ta.cci, ta.atr) and
// the n_rsi / n_wt / n_cci / n_adx normalizations used by the Lorentzian Classification script.

export type Bar = { open: number; high: number; low: number; close: number; volume: number; time: number };

const EPS = 1e-10;

export function sma(src: number[], len: number): number[] {
  const out = new Array(src.length).fill(NaN);
  for (let i = len - 1; i < src.length; i++) {
    let s = 0;
    let ok = true;
    for (let j = i - len + 1; j <= i; j++) {
      if (isNaN(src[j])) { ok = false; break; }
      s += src[j];
    }
    if (ok) out[i] = s / len;
  }
  return out;
}

export function ema(src: number[], len: number): number[] {
  const out = new Array(src.length).fill(NaN);
  const k = 2 / (len + 1);
  let prev = NaN;
  let seedSum = 0;
  let seedCount = 0;
  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    if (isNaN(v)) continue;
    if (isNaN(prev)) {
      seedSum += v;
      seedCount++;
      if (seedCount >= len) {
        prev = seedSum / len;
        out[i] = prev;
      }
    } else {
      prev = v * k + prev * (1 - k);
      out[i] = prev;
    }
  }
  return out;
}

// Wilder's RMA (used by ta.rsi, ta.atr, ta.adx)
export function rma(src: number[], len: number): number[] {
  const out = new Array(src.length).fill(NaN);
  let prev = NaN;
  let seedSum = 0;
  let seedCount = 0;
  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    if (isNaN(v)) continue;
    if (isNaN(prev)) {
      seedSum += v;
      seedCount++;
      if (seedCount >= len) {
        prev = seedSum / len;
        out[i] = prev;
      }
    } else {
      prev = (prev * (len - 1) + v) / len;
      out[i] = prev;
    }
  }
  return out;
}

export function rsi(src: number[], len: number): number[] {
  const gains = new Array(src.length).fill(0);
  const losses = new Array(src.length).fill(0);
  for (let i = 1; i < src.length; i++) {
    const ch = src[i] - src[i - 1];
    gains[i] = ch > 0 ? ch : 0;
    losses[i] = ch < 0 ? -ch : 0;
  }
  const avgG = rma(gains, len);
  const avgL = rma(losses, len);
  return src.map((_, i) => {
    if (isNaN(avgG[i]) || isNaN(avgL[i])) return NaN;
    if (avgL[i] === 0) return 100;
    const rs = avgG[i] / avgL[i];
    return 100 - 100 / (1 + rs);
  });
}

export function cci(src: number[], len: number): number[] {
  const ma = sma(src, len);
  const out = new Array(src.length).fill(NaN);
  for (let i = len - 1; i < src.length; i++) {
    let md = 0;
    for (let j = i - len + 1; j <= i; j++) md += Math.abs(src[j] - ma[i]);
    md /= len;
    out[i] = md === 0 ? 0 : (src[i] - ma[i]) / (0.015 * md);
  }
  return out;
}

export function atr(high: number[], low: number[], close: number[], len: number): number[] {
  const tr = new Array(high.length).fill(NaN);
  for (let i = 0; i < high.length; i++) {
    if (i === 0) tr[i] = high[i] - low[i];
    else {
      tr[i] = Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1]));
    }
  }
  return rma(tr, len);
}

// ta.dmi / ta.adx implementation (Wilder)
export function adx(high: number[], low: number[], close: number[], len: number): number[] {
  const n = high.length;
  const plusDM = new Array(n).fill(0);
  const minusDM = new Array(n).fill(0);
  const tr = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    const up = high[i] - high[i - 1];
    const dn = low[i - 1] - low[i];
    plusDM[i] = up > dn && up > 0 ? up : 0;
    minusDM[i] = dn > up && dn > 0 ? dn : 0;
    tr[i] = Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1]));
  }
  const trS = rma(tr, len);
  const plusS = rma(plusDM, len);
  const minusS = rma(minusDM, len);
  const dx = new Array(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    if (isNaN(trS[i]) || trS[i] === 0) continue;
    const pdi = (100 * plusS[i]) / trS[i];
    const mdi = (100 * minusS[i]) / trS[i];
    const sum = pdi + mdi;
    dx[i] = sum === 0 ? 0 : (100 * Math.abs(pdi - mdi)) / sum;
  }
  return rma(dx, len);
}

// jdehorty helpers ---------------------------------------------------

// rescale a value from [oldMin, oldMax] -> [newMin, newMax]
export function rescaleSeries(
  src: number[],
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
): number[] {
  return src.map((v) =>
    isNaN(v) ? NaN : newMin + ((newMax - newMin) * (v - oldMin)) / Math.max(oldMax - oldMin, EPS),
  );
}

// jdehorty `normalize`: track historic min/max across the series.
export function normalizeSeries(src: number[], min: number, max: number): number[] {
  const out = new Array(src.length).fill(NaN);
  let hMin = 10e10;
  let hMax = -10e10;
  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    if (isNaN(v)) continue;
    hMin = Math.min(v, hMin);
    hMax = Math.max(v, hMax);
    out[i] = min + ((max - min) * (v - hMin)) / Math.max(hMax - hMin, EPS);
  }
  return out;
}

// Normalized RSI: rescale ema(rsi(src,n1), n2) from 0..100 -> 0..1
export function n_rsi(close: number[], n1: number, n2: number): number[] {
  const r = rsi(close, n1);
  const e = ema(r, n2);
  return rescaleSeries(e, 0, 100, 0, 1);
}

// Normalized CCI
export function n_cci(close: number[], n1: number, n2: number): number[] {
  const c = cci(close, n1);
  const e = ema(c, n2);
  return normalizeSeries(e, 0, 1);
}

// Normalized ADX
export function n_adx(high: number[], low: number[], close: number[], n1: number): number[] {
  const a = adx(high, low, close, n1);
  return rescaleSeries(a, 0, 100, 0, 1);
}

// WaveTrend normalized
export function n_wt(hlc3: number[], n1 = 10, n2 = 11): number[] {
  const ema1 = ema(hlc3, n1);
  const absDiff = hlc3.map((v, i) => Math.abs(v - ema1[i]));
  const ema2 = ema(absDiff, n1);
  const ci = hlc3.map((v, i) => {
    if (isNaN(ema1[i]) || isNaN(ema2[i]) || ema2[i] === 0) return NaN;
    return (v - ema1[i]) / (0.015 * ema2[i]);
  });
  const wt1 = ema(ci, n2);
  const wt2 = sma(wt1, 4);
  const diff = wt1.map((v, i) => (isNaN(v) || isNaN(wt2[i]) ? NaN : v - wt2[i]));
  return normalizeSeries(diff, 0, 1);
}

// jdehorty filters ---------------------------------------------------

// filter_volatility: recentAtr > historicAtr (use minLen=1, maxLen=10 per script defaults)
export function filter_volatility(
  high: number[],
  low: number[],
  close: number[],
  minLen = 1,
  maxLen = 10,
  use = true,
): boolean[] {
  if (!use) return new Array(high.length).fill(true);
  const recent = atr(high, low, close, minLen);
  const historic = atr(high, low, close, maxLen);
  return high.map((_, i) => (isNaN(recent[i]) || isNaN(historic[i]) ? false : recent[i] > historic[i]));
}

// regime_filter — KLMF (Kaufman-style linear-regression smoothing) slope vs threshold
export function regime_filter(ohlc4: number[], high: number[], low: number[], threshold: number, use = true): boolean[] {
  const n = ohlc4.length;
  if (!use) return new Array(n).fill(true);
  const value1 = new Array(n).fill(0);
  const value2 = new Array(n).fill(0);
  const klmf = new Array(n).fill(0);
  const out = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    const prevV1 = i > 0 ? value1[i - 1] : 0;
    const prevV2 = i > 0 ? value2[i - 1] : 0;
    const prevK = i > 0 ? klmf[i - 1] : 0;
    const dOhlc = i > 0 ? ohlc4[i] - ohlc4[i - 1] : 0;
    value1[i] = 0.2 * dOhlc + 0.8 * prevV1;
    value2[i] = 0.1 * (high[i] - low[i]) + 0.8 * prevV2;
    const omega = value2[i] === 0 ? 0 : Math.abs(value1[i] / value2[i]);
    const alpha = (-(omega * omega) + Math.sqrt(omega ** 4 + 16 * omega * omega)) / 8;
    klmf[i] = alpha * ohlc4[i] + (1 - alpha) * prevK;
    const absCurveSlope = i > 0 ? Math.abs(klmf[i] - klmf[i - 1]) : 0;
    // exponential average of slope
    if (i === 0) out[i] = false;
    else {
      const exp = ema([absCurveSlope], 200); // not stable per-bar; use running ema below
      void exp;
    }
  }
  // Proper exponential average of |klmf - klmf[1]| with length 200
  const slope: number[] = klmf.map((v, i) => (i === 0 ? 0 : Math.abs(v - klmf[i - 1])));
  const expAvgSlope = ema(slope, 200);
  for (let i = 0; i < n; i++) {
    if (isNaN(expAvgSlope[i]) || expAvgSlope[i] === 0) {
      out[i] = false;
      continue;
    }
    const normSlope = (slope[i] - expAvgSlope[i]) / expAvgSlope[i];
    out[i] = normSlope >= threshold;
  }
  return out;
}

// filter_adx: ADX(src, length) > threshold
export function filter_adx(
  high: number[],
  low: number[],
  close: number[],
  len: number,
  threshold: number,
  use = true,
): boolean[] {
  if (!use) return new Array(high.length).fill(true);
  const a = adx(high, low, close, len);
  return a.map((v) => (isNaN(v) ? false : v > threshold));
}
