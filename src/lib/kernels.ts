// Nadaraya-Watson kernel regressions used by jdehorty/KernelFunctions.

// Rational Quadratic kernel estimator.
// src: source series, h: lookback window, r: relative weighting, x: start regression at bar.
export function rationalQuadratic(src: number[], h: number, r: number, x: number): number[] {
  const n = src.length;
  const out = new Array(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    if (i < x) continue;
    let currentWeight = 0;
    let cumulativeWeight = 0;
    const maxBack = Math.min(i, x + 100); // sum from 0..i but Pine sums 0..(_size - 1) of recent
    // Pine loops i = 0 to _size - 1 where _size accounts for lookback; we sum back from current.
    const lookback = i; // sum across all available history below current bar (Pine: 0..size-1)
    for (let j = 0; j <= lookback; j++) {
      const v = src[i - j];
      if (isNaN(v)) continue;
      const w = Math.pow(1 + (j * j) / (h * h * 2 * r), -r);
      currentWeight += v * w;
      cumulativeWeight += w;
    }
    out[i] = cumulativeWeight === 0 ? NaN : currentWeight / cumulativeWeight;
    void maxBack;
  }
  return out;
}

// Gaussian kernel estimator.
export function gaussian(src: number[], h: number, x: number): number[] {
  const n = src.length;
  const out = new Array(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    if (i < x) continue;
    let currentWeight = 0;
    let cumulativeWeight = 0;
    for (let j = 0; j <= i; j++) {
      const v = src[i - j];
      if (isNaN(v)) continue;
      const w = Math.exp(-(j * j) / (2 * h * h));
      currentWeight += v * w;
      cumulativeWeight += w;
    }
    out[i] = cumulativeWeight === 0 ? NaN : currentWeight / cumulativeWeight;
  }
  return out;
}
