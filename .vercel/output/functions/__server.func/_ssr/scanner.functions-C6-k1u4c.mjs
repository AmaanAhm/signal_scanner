import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as runLorentzian } from "./lorentzian-D3YkjEbi.mjs";
import { t as YahooFinance } from "../_libs/yahoo-finance2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scanner.functions-C6-k1u4c.js
function tfToYahoo(tf) {
	switch (tf) {
		case "15m": return {
			interval: "15m",
			rangeDays: 55
		};
		case "30m": return {
			interval: "30m",
			rangeDays: 55
		};
		case "60m": return {
			interval: "60m",
			rangeDays: 700
		};
		case "1d": return {
			interval: "1d",
			rangeDays: 5 * 365
		};
	}
}
var yf = new YahooFinance({ validation: { logErrors: false } });
async function fetchYahoo(symbol, tf) {
	const { interval, rangeDays } = tfToYahoo(tf);
	const period1 = /* @__PURE__ */ new Date(Date.now() - rangeDays * 864e5);
	const result = await yf.chart(symbol, {
		period1,
		interval
	}, { validateResult: false });
	const bars = [];
	for (const q of result.quotes) {
		const o = q.open;
		const h = q.high;
		const l = q.low;
		const c = q.close;
		const v = q.volume;
		if (o == null || h == null || l == null || c == null) continue;
		const time = q.date instanceof Date ? q.date.getTime() : new Date(q.date).getTime();
		bars.push({
			open: o,
			high: h,
			low: l,
			close: c,
			volume: v ?? 0,
			time
		});
	}
	return bars;
}
function formatIST(epochMs) {
	const d = new Date(epochMs);
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Kolkata",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false
	}).formatToParts(d);
	const get = (t) => parts.find((p) => p.type === t)?.value || "";
	return {
		date: `${get("year")}-${get("month")}-${get("day")}`,
		time: `${get("hour")}:${get("minute")}:${get("second")}`
	};
}
var simulatePaperTrade_createServerFn_handler = createServerRpc({
	id: "e65cefd224bace7eb24022dcc9ec350f18f9469e87d4c99f51e8038bc7455445",
	name: "simulatePaperTrade",
	filename: "src/lib/scanner.functions.ts"
}, (opts) => simulatePaperTrade.__executeServer(opts));
var simulatePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(simulatePaperTrade_createServerFn_handler, async ({ data }) => {
	const base = {
		symbol: data.symbol,
		name: data.name,
		side: data.side,
		signalDate: data.signalDate,
		signalPrice: data.signalPrice,
		closes: [
			null,
			null,
			null,
			null,
			null
		],
		pnlPct: [
			null,
			null,
			null,
			null,
			null
		]
	};
	try {
		const bars = await fetchYahoo(data.symbol, "1d");
		if (!bars.length) return {
			...base,
			error: "No daily data"
		};
		let startIdx = -1;
		for (let i = 0; i < bars.length; i++) {
			const { date } = formatIST(bars[i].time);
			if (date >= data.signalDate) {
				startIdx = i;
				break;
			}
		}
		if (startIdx < 0) return {
			...base,
			error: "No forward bars yet"
		};
		const closes = [];
		const pnl = [];
		for (let d = 0; d < 5; d++) {
			const b = bars[startIdx + d];
			if (!b) {
				closes.push(null);
				pnl.push(null);
				continue;
			}
			closes.push(b.close);
			const raw = (b.close - data.signalPrice) / data.signalPrice * 100;
			pnl.push(data.side === "BUY" ? raw : -raw);
		}
		return {
			...base,
			closes,
			pnlPct: pnl
		};
	} catch (e) {
		return {
			...base,
			error: e instanceof Error ? e.message : "Unknown error"
		};
	}
});
var scanStock_createServerFn_handler = createServerRpc({
	id: "ab426c9010e05c56bd5585f8c5f6cd21908b9b0b85df64fcf3408a2c1bdbd134",
	name: "scanStock",
	filename: "src/lib/scanner.functions.ts"
}, (opts) => scanStock.__executeServer(opts));
var scanStock = createServerFn({ method: "POST" }).validator((input) => input).handler(scanStock_createServerFn_handler, async ({ data }) => {
	const base = {
		symbol: data.symbol,
		name: data.name,
		original: null,
		retests: [],
		currentPrice: null,
		timeframe: data.timeframe,
		trend: "Neutral",
		retestLevel: null,
		retestDirection: null
	};
	try {
		const bars = await fetchYahoo(data.symbol, data.timeframe);
		if (bars.length < 100) return {
			...base,
			error: "Not enough data"
		};
		const result = runLorentzian(bars);
		const currentPrice = bars[bars.length - 1].close;
		let latestOriginal = null;
		let signalEpoch = 0;
		let signalDirection = null;
		let retestLevel = 0;
		for (let i = result.signals.length - 1; i >= 0; i--) {
			const s = result.signals[i];
			if (s.source === "Original" && s.signal) {
				const { date, time } = formatIST(s.time);
				latestOriginal = {
					signal: s.signal,
					signalDate: date,
					signalTime: time,
					signalPrice: s.close
				};
				signalEpoch = bars[s.index].time;
				signalDirection = s.signal;
				retestLevel = s.signal === "BUY" ? bars[s.index].high : bars[s.index].low;
				break;
			}
		}
		const signalCandleEnd = signalEpoch + ({
			"1m": 6e4,
			"5m": 5 * 6e4,
			"15m": 15 * 6e4,
			"30m": 30 * 6e4,
			"60m": 60 * 6e4,
			"1d": 24 * 36e5
		}[data.timeframe] || 30 * 6e4);
		const retests = [];
		if (signalEpoch > 0 && signalDirection && retestLevel > 0) try {
			const fineInterval = Date.now() - signalEpoch < 6.5 * 864e5 ? "1m" : "5m";
			const fineResult = await yf.chart(data.symbol, {
				period1: new Date(signalEpoch),
				interval: fineInterval
			}, { validateResult: false });
			let wasTouching = false;
			for (const q of fineResult.quotes) {
				const h = q.high;
				const l = q.low;
				if (h == null || l == null) continue;
				const t = q.date instanceof Date ? q.date.getTime() : new Date(q.date).getTime();
				if (t < signalCandleEnd) continue;
				const touching = l <= retestLevel && h >= retestLevel;
				if (touching && !wasTouching) {
					const { date, time } = formatIST(t);
					retests.push({
						signal: signalDirection,
						signalDate: date,
						signalTime: time,
						signalPrice: retestLevel
					});
				}
				wasTouching = touching;
			}
		} catch {}
		const trend = result.signals[result.signals.length - 1]?.trend || "Neutral";
		return {
			...base,
			original: latestOriginal,
			retests,
			currentPrice,
			trend,
			retestLevel: retestLevel || null,
			retestDirection: signalDirection
		};
	} catch (e) {
		return {
			...base,
			error: e instanceof Error ? e.message : "Unknown error"
		};
	}
});
var checkRetestBatch_createServerFn_handler = createServerRpc({
	id: "4b85a58669f02a2b7ce44f60b1b729cf8b9a073e314ed505095caa3e144da8ea",
	name: "checkRetestBatch",
	filename: "src/lib/scanner.functions.ts"
}, (opts) => checkRetestBatch.__executeServer(opts));
var checkRetestBatch = createServerFn({ method: "POST" }).validator((input) => input).handler(checkRetestBatch_createServerFn_handler, async ({ data }) => {
	const results = [];
	const BATCH = 6;
	for (let i = 0; i < data.items.length; i += BATCH) {
		const batch = data.items.slice(i, i + BATCH);
		const settled = await Promise.allSettled(batch.map(async (item) => {
			try {
				const q = await yf.quote(item.symbol, {}, { validateResult: false });
				const dayHigh = q.regularMarketDayHigh ?? null;
				const dayLow = q.regularMarketDayLow ?? null;
				const price = q.regularMarketPrice ?? null;
				let retested = false;
				if (dayHigh != null && dayLow != null) retested = dayLow <= item.level && dayHigh >= item.level;
				else if (price != null) retested = Math.abs(price - item.level) / item.level < .003;
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
					signalPrice: item.signalPrice
				};
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
					signalPrice: item.signalPrice
				};
			}
		}));
		for (const s of settled) if (s.status === "fulfilled") results.push(s.value);
	}
	return results;
});
var getQuotesBatch_createServerFn_handler = createServerRpc({
	id: "79e8a8372b766b286ec73493b614dfc24464a79b0dfb30608d3b7490ce8b32db",
	name: "getQuotesBatch",
	filename: "src/lib/scanner.functions.ts"
}, (opts) => getQuotesBatch.__executeServer(opts));
var getQuotesBatch = createServerFn({ method: "POST" }).validator((input) => input).handler(getQuotesBatch_createServerFn_handler, async ({ data }) => {
	const prices = {};
	const BATCH = 8;
	for (let i = 0; i < data.symbols.length; i += BATCH) {
		const batch = data.symbols.slice(i, i + BATCH);
		const settled = await Promise.allSettled(batch.map(async (symbol) => {
			try {
				return {
					symbol,
					price: (await yf.quote(symbol, {}, { validateResult: false })).regularMarketPrice ?? null
				};
			} catch {
				return {
					symbol,
					price: null
				};
			}
		}));
		for (const s of settled) if (s.status === "fulfilled") prices[s.value.symbol] = s.value.price;
	}
	return prices;
});
//#endregion
export { checkRetestBatch_createServerFn_handler, getQuotesBatch_createServerFn_handler, scanStock_createServerFn_handler, simulatePaperTrade_createServerFn_handler };
