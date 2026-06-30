//#region node_modules/.nitro/vite/services/ssr/assets/lorentzian-D3YkjEbi.js
var EPS = 1e-10;
function sma(src, len) {
	const out = new Array(src.length).fill(NaN);
	for (let i = len - 1; i < src.length; i++) {
		let s = 0;
		let ok = true;
		for (let j = i - len + 1; j <= i; j++) {
			if (isNaN(src[j])) {
				ok = false;
				break;
			}
			s += src[j];
		}
		if (ok) out[i] = s / len;
	}
	return out;
}
function ema(src, len) {
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
function rma(src, len) {
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
function rsi(src, len) {
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
		return 100 - 100 / (1 + avgG[i] / avgL[i]);
	});
}
function cci(src, len) {
	const ma = sma(src, len);
	const out = new Array(src.length).fill(NaN);
	for (let i = len - 1; i < src.length; i++) {
		let md = 0;
		for (let j = i - len + 1; j <= i; j++) md += Math.abs(src[j] - ma[i]);
		md /= len;
		out[i] = md === 0 ? 0 : (src[i] - ma[i]) / (.015 * md);
	}
	return out;
}
function atr(high, low, close, len) {
	const tr = new Array(high.length).fill(NaN);
	for (let i = 0; i < high.length; i++) if (i === 0) tr[i] = high[i] - low[i];
	else tr[i] = Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1]));
	return rma(tr, len);
}
function adx(high, low, close, len) {
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
		const pdi = 100 * plusS[i] / trS[i];
		const mdi = 100 * minusS[i] / trS[i];
		const sum = pdi + mdi;
		dx[i] = sum === 0 ? 0 : 100 * Math.abs(pdi - mdi) / sum;
	}
	return rma(dx, len);
}
function rescaleSeries(src, oldMin, oldMax, newMin, newMax) {
	return src.map((v) => isNaN(v) ? NaN : newMin + (newMax - newMin) * (v - oldMin) / Math.max(oldMax - oldMin, EPS));
}
function normalizeSeries(src, min, max) {
	const out = new Array(src.length).fill(NaN);
	let hMin = 1e11;
	let hMax = -1e11;
	for (let i = 0; i < src.length; i++) {
		const v = src[i];
		if (isNaN(v)) continue;
		hMin = Math.min(v, hMin);
		hMax = Math.max(v, hMax);
		out[i] = min + (max - min) * (v - hMin) / Math.max(hMax - hMin, EPS);
	}
	return out;
}
function n_rsi(close, n1, n2) {
	return rescaleSeries(ema(rsi(close, n1), n2), 0, 100, 0, 1);
}
function n_cci(close, n1, n2) {
	return normalizeSeries(ema(cci(close, n1), n2), 0, 1);
}
function n_adx(high, low, close, n1) {
	return rescaleSeries(adx(high, low, close, n1), 0, 100, 0, 1);
}
function n_wt(hlc3, n1 = 10, n2 = 11) {
	const ema1 = ema(hlc3, n1);
	const ema2 = ema(hlc3.map((v, i) => Math.abs(v - ema1[i])), n1);
	const wt1 = ema(hlc3.map((v, i) => {
		if (isNaN(ema1[i]) || isNaN(ema2[i]) || ema2[i] === 0) return NaN;
		return (v - ema1[i]) / (.015 * ema2[i]);
	}), n2);
	const wt2 = sma(wt1, 4);
	return normalizeSeries(wt1.map((v, i) => isNaN(v) || isNaN(wt2[i]) ? NaN : v - wt2[i]), 0, 1);
}
function filter_volatility(high, low, close, minLen = 1, maxLen = 10, use = true) {
	if (!use) return new Array(high.length).fill(true);
	const recent = atr(high, low, close, minLen);
	const historic = atr(high, low, close, maxLen);
	return high.map((_, i) => isNaN(recent[i]) || isNaN(historic[i]) ? false : recent[i] > historic[i]);
}
function regime_filter(ohlc4, high, low, threshold, use = true) {
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
		value1[i] = .2 * (i > 0 ? ohlc4[i] - ohlc4[i - 1] : 0) + .8 * prevV1;
		value2[i] = .1 * (high[i] - low[i]) + .8 * prevV2;
		const omega = value2[i] === 0 ? 0 : Math.abs(value1[i] / value2[i]);
		const alpha = (-(omega * omega) + Math.sqrt(omega ** 4 + 16 * omega * omega)) / 8;
		klmf[i] = alpha * ohlc4[i] + (1 - alpha) * prevK;
		const absCurveSlope = i > 0 ? Math.abs(klmf[i] - klmf[i - 1]) : 0;
		if (i === 0) out[i] = false;
		else ema([absCurveSlope], 200);
	}
	const slope = klmf.map((v, i) => i === 0 ? 0 : Math.abs(v - klmf[i - 1]));
	const expAvgSlope = ema(slope, 200);
	for (let i = 0; i < n; i++) {
		if (isNaN(expAvgSlope[i]) || expAvgSlope[i] === 0) {
			out[i] = false;
			continue;
		}
		out[i] = (slope[i] - expAvgSlope[i]) / expAvgSlope[i] >= threshold;
	}
	return out;
}
function filter_adx(high, low, close, len, threshold, use = true) {
	if (!use) return new Array(high.length).fill(true);
	return adx(high, low, close, len).map((v) => isNaN(v) ? false : v > threshold);
}
function rationalQuadratic(src, h, r, x) {
	const n = src.length;
	const out = new Array(n).fill(NaN);
	for (let i = 0; i < n; i++) {
		if (i < x) continue;
		let currentWeight = 0;
		let cumulativeWeight = 0;
		Math.min(i, x + 100);
		const lookback = i;
		for (let j = 0; j <= lookback; j++) {
			const v = src[i - j];
			if (isNaN(v)) continue;
			const w = Math.pow(1 + j * j / (h * h * 2 * r), -r);
			currentWeight += v * w;
			cumulativeWeight += w;
		}
		out[i] = cumulativeWeight === 0 ? NaN : currentWeight / cumulativeWeight;
	}
	return out;
}
function gaussian(src, h, x) {
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
var DEFAULT_SETTINGS = {
	neighborsCount: 8,
	maxBarsBack: 2e3,
	featureCount: 5,
	useVolatilityFilter: true,
	useRegimeFilter: true,
	useAdxFilter: false,
	regimeThreshold: -.1,
	adxThreshold: 20,
	useKernelFilter: true,
	h: 8,
	r: 8,
	x: 25,
	lag: 2
};
function lorentzianDistance(fc, f, arr, i) {
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
function runLorentzian(bars, userSettings = {}) {
	const s = {
		...DEFAULT_SETTINGS,
		...userSettings
	};
	const n = bars.length;
	if (n < 50) return {
		signals: [],
		latest: null
	};
	const close = bars.map((b) => b.close);
	const high = bars.map((b) => b.high);
	const low = bars.map((b) => b.low);
	const hlc3 = bars.map((b) => (b.high + b.low + b.close) / 3);
	const ohlc4 = bars.map((b) => (b.open + b.high + b.low + b.close) / 4);
	const f1 = n_rsi(close, 14, 1);
	const f2 = n_wt(hlc3, 10, 11);
	const f3 = n_cci(close, 20, 1);
	const f4 = n_adx(high, low, close, 20);
	const f5 = n_rsi(close, 9, 1);
	const fVol = filter_volatility(high, low, close, 1, 10, s.useVolatilityFilter);
	const fRegime = regime_filter(ohlc4, high, low, s.regimeThreshold, s.useRegimeFilter);
	const fAdx = filter_adx(high, low, close, 14, s.adxThreshold, s.useAdxFilter);
	const yhat1 = rationalQuadratic(close, s.h, s.r, s.x);
	const yhat2 = gaussian(close, s.h - s.lag, s.x);
	const y = new Array(n).fill(0);
	for (let i = 4; i < n; i++) if (close[i - 4] < close[i]) y[i] = -1;
	else if (close[i - 4] > close[i]) y[i] = 1;
	else y[i] = 0;
	const featureArrays = {
		f1,
		f2,
		f3,
		f4,
		f5
	};
	const maxBarsBackIndex = n >= s.maxBarsBack ? n - s.maxBarsBack : 0;
	const signals = [];
	let prevSignal = 0;
	let lastDistance = -1;
	const distances = [];
	const predictions = [];
	let buyRetestLevel = null;
	let buyRetestBar = -1;
	let sellRetestLevel = null;
	let sellRetestBar = -1;
	for (let bar = 0; bar < n; bar++) {
		if (bar < maxBarsBackIndex) {
			signals.push({
				index: bar,
				time: bars[bar].time,
				close: close[bar],
				signal: null,
				source: null,
				trend: "Neutral"
			});
			continue;
		}
		const fs = {
			f1: f1[bar],
			f2: f2[bar],
			f3: f3[bar],
			f4: f4[bar],
			f5: f5[bar]
		};
		if ([
			fs.f1,
			fs.f2,
			fs.f3,
			fs.f4,
			fs.f5
		].some((v) => isNaN(v))) {
			signals.push({
				index: bar,
				time: bars[bar].time,
				close: close[bar],
				signal: null,
				source: null,
				trend: "Neutral"
			});
			continue;
		}
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
					lastDistance = distances[Math.round(s.neighborsCount * 3 / 4)];
					distances.shift();
					predictions.shift();
				}
			}
		}
		const prediction = predictions.reduce((a, b) => a + b, 0);
		const filterAll = fVol[bar] && fRegime[bar] && fAdx[bar];
		let signal;
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
		let kind = null;
		let source = null;
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
		} else if (buyRetestLevel != null && bar !== buyRetestBar && bars[bar].low <= buyRetestLevel && bars[bar].high >= buyRetestLevel) {
			kind = "BUY";
			source = "Retest";
			buyRetestBar = bar;
		} else if (sellRetestLevel != null && bar !== sellRetestBar && bars[bar].low <= sellRetestLevel && bars[bar].high >= sellRetestLevel) {
			kind = "SELL";
			source = "Retest";
			sellRetestBar = bar;
		}
		const trend = isBullishSmooth ? "Bullish" : isBearishSmooth ? "Bearish" : "Neutral";
		signals.push({
			index: bar,
			time: bars[bar].time,
			close: close[bar],
			signal: kind,
			source,
			trend
		});
		prevSignal = signal;
	}
	let latest = null;
	for (let i = signals.length - 1; i >= 0; i--) if (signals[i].signal) {
		latest = signals[i];
		break;
	}
	return {
		signals,
		latest
	};
}
//#endregion
export { runLorentzian as t };
