import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { t as runLorentzian } from "./lorentzian-D3YkjEbi.mjs";
import { t as YahooFinance } from "../_libs/yahoo-finance2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backtest.functions-CT0-I0VA.js
var yf = new YahooFinance({ validation: { logErrors: false } });
function dateRangeToDays(dr) {
	const now = /* @__PURE__ */ new Date();
	if (typeof dr === "object") return {
		period1: new Date(dr.start),
		period2: new Date(dr.end)
	};
	const months = {
		"6m": 6,
		"1y": 12,
		"2y": 24,
		"3y": 36,
		"4y": 48
	}[dr];
	const period1 = new Date(now);
	period1.setMonth(period1.getMonth() - months);
	return {
		period1,
		period2: now
	};
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
function istMinutesFromTime(time) {
	const h = parseInt(time.slice(0, 2), 10);
	const m = parseInt(time.slice(3, 5), 10);
	return h * 60 + m;
}
var backtestStock_createServerFn_handler = createServerRpc({
	id: "0e3084ee207d8a13a5cea140a0a3288a8bbea0f5e0615518224337888b21eff1",
	name: "backtestStock",
	filename: "src/lib/backtest.functions.ts"
}, (opts) => backtestStock.__executeServer(opts));
var backtestStock = createServerFn({ method: "POST" }).validator((input) => input).handler(backtestStock_createServerFn_handler, async ({ data }) => {
	try {
		const { period1 } = dateRangeToDays(data.dateRange);
		const tf = data.timeframe || "1d";
		const tfConfig = {
			"15m": {
				maxDays: 55,
				barsPerDay: 26
			},
			"30m": {
				maxDays: 55,
				barsPerDay: 13
			},
			"60m": {
				maxDays: 700,
				barsPerDay: 7
			},
			"1d": {
				maxDays: 5 * 365,
				barsPerDay: 1
			}
		};
		const { maxDays, barsPerDay } = tfConfig[tf] || tfConfig["1d"];
		const warmupDays = Math.ceil(350 / barsPerDay) + 30;
		const fetchStart = new Date(Math.max(period1.getTime() - warmupDays * 864e5, Date.now() - maxDays * 864e5));
		const result = await yf.chart(data.symbol, {
			period1: fetchStart,
			interval: tf
		}, { validateResult: false });
		const bars = [];
		for (const q of result.quotes) {
			if (q.open == null || q.high == null || q.low == null || q.close == null) continue;
			const time = q.date instanceof Date ? q.date.getTime() : new Date(q.date).getTime();
			bars.push({
				open: q.open,
				high: q.high,
				low: q.low,
				close: q.close,
				volume: q.volume ?? 0,
				time
			});
		}
		if (bars.length < 100) return {
			entries: [],
			error: "Not enough data"
		};
		const lorentzResult = runLorentzian(bars);
		const signalAt = /* @__PURE__ */ new Map();
		for (const sig of lorentzResult.signals) {
			if (sig.source !== "Original" || !sig.signal) continue;
			signalAt.set(sig.index, {
				dir: sig.signal,
				price: bars[sig.index].close
			});
		}
		const rangeStart = period1.getTime();
		const entries = [];
		let pending = null;
		for (let i = 0; i < bars.length; i++) {
			const bar = bars[i];
			if (pending && i > pending.barIndex && bar.time >= rangeStart) {
				if (bar.low <= pending.price && bar.high >= pending.price) {
					const { date: rtDate, time: rtTime } = formatIST(bar.time);
					const displayTime = tf === "1d" ? "Intraday" : rtTime;
					const entryPrice = pending.price;
					const TARGET_PCT = .02;
					let exitType = "EOD";
					let exitPrice = bar.close;
					let exitTime = displayTime;
					let holdingMinutes = 0;
					if (tf === "1d") {
						if (pending.dir === "BUY" && bar.high >= entryPrice * 1.02) {
							exitType = "TARGET";
							exitPrice = Math.round(entryPrice * 1.02 * 100) / 100;
							exitTime = "Intraday";
						} else if (pending.dir === "SELL" && bar.low <= entryPrice * (1 - TARGET_PCT)) {
							exitType = "TARGET";
							exitPrice = Math.round(entryPrice * (1 - TARGET_PCT) * 100) / 100;
							exitTime = "Intraday";
						} else {
							exitPrice = bar.close;
							exitTime = "15:30";
						}
						holdingMinutes = exitType === "TARGET" ? 180 : 375;
					} else {
						const entryMinutes = istMinutesFromTime(rtTime);
						const rtDateStr = rtDate;
						let found = false;
						if (pending.dir === "BUY" && bar.high >= entryPrice * 1.02) {
							exitType = "TARGET";
							exitPrice = Math.round(entryPrice * 1.02 * 100) / 100;
							exitTime = rtTime;
							holdingMinutes = 0;
							found = true;
						} else if (pending.dir === "SELL" && bar.low <= entryPrice * (1 - TARGET_PCT)) {
							exitType = "TARGET";
							exitPrice = Math.round(entryPrice * (1 - TARGET_PCT) * 100) / 100;
							exitTime = rtTime;
							holdingMinutes = 0;
							found = true;
						}
						if (!found) {
							let lastBarOfDay = bar;
							let lastBarTime = rtTime;
							for (let k = i + 1; k < bars.length; k++) {
								const fBar = bars[k];
								const { date: fDate, time: fTime } = formatIST(fBar.time);
								if (fDate !== rtDateStr) break;
								const fMinutes = istMinutesFromTime(fTime);
								if (!found) {
									if (pending.dir === "BUY" && fBar.high >= entryPrice * 1.02) {
										exitType = "TARGET";
										exitPrice = Math.round(entryPrice * 1.02 * 100) / 100;
										exitTime = fTime;
										holdingMinutes = fMinutes - entryMinutes;
										found = true;
										break;
									} else if (pending.dir === "SELL" && fBar.low <= entryPrice * (1 - TARGET_PCT)) {
										exitType = "TARGET";
										exitPrice = Math.round(entryPrice * (1 - TARGET_PCT) * 100) / 100;
										exitTime = fTime;
										holdingMinutes = fMinutes - entryMinutes;
										found = true;
										break;
									}
								}
								lastBarOfDay = fBar;
								lastBarTime = fTime;
							}
							if (!found) {
								exitType = "EOD";
								exitPrice = lastBarOfDay.close;
								exitTime = lastBarTime;
								holdingMinutes = istMinutesFromTime(lastBarTime) - entryMinutes;
								if (holdingMinutes < 0) holdingMinutes = 0;
							}
						}
					}
					const pnl = pending.dir === "BUY" ? exitPrice - entryPrice : entryPrice - exitPrice;
					const pnlPct = pnl / entryPrice * 100;
					entries.push({
						symbol: data.symbol,
						name: data.name,
						direction: pending.dir,
						signalDate: pending.date,
						signalTime: tf === "1d" ? "Intraday" : pending.time,
						signalPrice: pending.price,
						retestDate: rtDate,
						retestTime: displayTime,
						retestPrice: entryPrice,
						exitType,
						exitPrice: Math.round(exitPrice * 100) / 100,
						exitTime,
						pnl: Math.round(pnl * 100) / 100,
						pnlPct: Math.round(pnlPct * 100) / 100,
						win: pnl > 0,
						holdingMinutes: Math.max(0, holdingMinutes)
					});
					pending = null;
				}
			}
			const newSig = signalAt.get(i);
			if (newSig) {
				const { date, time } = formatIST(bar.time);
				if (tf !== "1d") {
					if (parseInt(time.slice(0, 2), 10) < 12) continue;
				}
				pending = {
					dir: newSig.dir,
					price: newSig.price,
					date,
					time,
					barIndex: i
				};
			}
		}
		return { entries };
	} catch (e) {
		return {
			entries: [],
			error: e instanceof Error ? e.message : "Unknown"
		};
	}
});
var aggregateBacktest_createServerFn_handler = createServerRpc({
	id: "7c640e65587d3708c844871c50f1de5f187352f0c91127c7f8b032c548532c68",
	name: "aggregateBacktest",
	filename: "src/lib/backtest.functions.ts"
}, (opts) => aggregateBacktest.__executeServer(opts));
var aggregateBacktest = createServerFn({ method: "POST" }).validator((input) => input).handler(aggregateBacktest_createServerFn_handler, async ({ data }) => {
	const { allEntries, dateRange, totalScanned } = data;
	const { period1, period2 } = dateRangeToDays(dateRange);
	allEntries.sort((a, b) => `${a.retestDate} ${a.retestTime}`.localeCompare(`${b.retestDate} ${b.retestTime}`));
	const openUntil = /* @__PURE__ */ new Map();
	const filtered = [];
	for (const e of allEntries) {
		const lastExit = openUntil.get(e.symbol);
		if (lastExit && e.retestDate <= lastExit) continue;
		filtered.push(e);
		openUntil.set(e.symbol, e.retestDate);
	}
	const trades = [];
	const symbolSet = /* @__PURE__ */ new Set();
	for (const e of filtered) {
		symbolSet.add(e.symbol);
		trades.push({
			symbol: e.symbol,
			name: e.name,
			direction: e.direction,
			entryDate: e.retestDate,
			entryTime: e.retestTime,
			entryPrice: e.retestPrice,
			exitType: e.exitType,
			exitPrice: e.exitPrice,
			exitTime: e.exitTime,
			pnl: e.pnl,
			pnlPct: e.pnlPct,
			win: e.win,
			holdingMinutes: e.holdingMinutes
		});
	}
	const wins = trades.filter((t) => t.win).length;
	const losses = trades.length - wins;
	const returns = trades.map((t) => t.pnlPct);
	const totalRet = returns.reduce((a, b) => a + b, 0);
	const sumWins = returns.filter((r) => r > 0).reduce((a, b) => a + b, 0);
	const sumLosses = Math.abs(returns.filter((r) => r < 0).reduce((a, b) => a + b, 0));
	const profitFactor = sumLosses > 0 ? Math.round(sumWins / sumLosses * 100) / 100 : sumWins > 0 ? Infinity : 0;
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
	const eodExits = trades.filter((t) => t.exitType === "EOD").length;
	const totalHolding = trades.reduce((a, t) => a + t.holdingMinutes, 0);
	return {
		trades,
		summary: {
			totalTrades: trades.length,
			wins,
			losses,
			winRate: trades.length > 0 ? Math.round(wins / trades.length * 1e4) / 100 : 0,
			totalReturn: Math.round(totalRet * 100) / 100,
			avgReturn: returns.length > 0 ? Math.round(totalRet / returns.length * 100) / 100 : 0,
			maxDrawdown: Math.round(maxDrawdown * 100) / 100,
			profitFactor,
			avgHoldingMinutes: trades.length > 0 ? Math.round(totalHolding / trades.length) : 0,
			targetExits,
			eodExits,
			maxGain: returns.length > 0 ? Math.round(Math.max(...returns) * 100) / 100 : 0,
			maxLoss: returns.length > 0 ? Math.round(Math.min(...returns) * 100) / 100 : 0
		},
		totalStocksProcessed: totalScanned ?? symbolSet.size,
		totalStocksWithSignals: symbolSet.size,
		dateRangeUsed: {
			start: period1.toISOString().slice(0, 10),
			end: period2.toISOString().slice(0, 10)
		}
	};
});
//#endregion
export { aggregateBacktest_createServerFn_handler, backtestStock_createServerFn_handler };
