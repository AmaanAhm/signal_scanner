import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db.functions-ByFGqAkO.js
/**
* Supabase REST API client using plain fetch().
* No WebSocket dependency — works on Node 20, Vercel, Cloudflare, everywhere.
*/
var _url = "";
var _key = "";
function getConfig() {
	if (!_url) {
		_url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
		_key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
	}
	if (!_url || !_key) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
	return {
		url: _url,
		key: _key
	};
}
function headers() {
	const { key } = getConfig();
	return {
		apikey: key,
		Authorization: `Bearer ${key}`,
		"Content-Type": "application/json",
		Prefer: "return=minimal"
	};
}
function restUrl(table) {
	return `${getConfig().url}/rest/v1/${table}`;
}
/** SELECT rows. Pass query params like ?timeframe=eq.30m */
async function dbSelect(table, params) {
	const url = restUrl(table) + (params ? `?${params}` : "");
	const res = await fetch(url, { headers: {
		...headers(),
		Prefer: "return=representation"
	} });
	if (!res.ok) {
		console.error(`dbSelect ${table}:`, res.status, await res.text());
		return [];
	}
	return res.json();
}
/** INSERT row(s). */
async function dbInsert(table, body) {
	const res = await fetch(restUrl(table), {
		method: "POST",
		headers: headers(),
		body: JSON.stringify(body)
	});
	if (!res.ok) console.error(`dbInsert ${table}:`, res.status, await res.text());
	return res.ok;
}
/** UPSERT row(s) on a conflict column. */
async function dbUpsert(table, body, onConflict) {
	const res = await fetch(restUrl(table), {
		method: "POST",
		headers: {
			...headers(),
			Prefer: "resolution=merge-duplicates,return=minimal"
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) console.error(`dbUpsert ${table}:`, res.status, await res.text());
	return res.ok;
}
/** UPDATE rows matching filter. filter like "trade_id=eq.abc123" */
async function dbUpdate(table, filter, body) {
	const res = await fetch(`${restUrl(table)}?${filter}`, {
		method: "PATCH",
		headers: headers(),
		body: JSON.stringify(body)
	});
	if (!res.ok) console.error(`dbUpdate ${table}:`, res.status, await res.text());
	return res.ok;
}
/** DELETE rows matching filter. */
async function dbDelete(table, filter) {
	const res = await fetch(`${restUrl(table)}?${filter}`, {
		method: "DELETE",
		headers: headers()
	});
	if (!res.ok) console.error(`dbDelete ${table}:`, res.status, await res.text());
	return res.ok;
}
var saveScanResults_createServerFn_handler = createServerRpc({
	id: "784d9f6692509a59f870d0fb62c24aa436a2a42f7cc632902ce58b2f0a7662d8",
	name: "saveScanResults",
	filename: "src/lib/db.functions.ts"
}, (opts) => saveScanResults.__executeServer(opts));
var saveScanResults = createServerFn({ method: "POST" }).validator((input) => input).handler(saveScanResults_createServerFn_handler, async ({ data }) => {
	await dbUpsert("scan_results", {
		timeframe: data.timeframe,
		results: data.results,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, "timeframe");
	return { ok: true };
});
var loadScanResults_createServerFn_handler = createServerRpc({
	id: "1da4266b0e73f9f240d869675c5f2db16e2633bd61e73c0de06a6f8e1003ce34",
	name: "loadScanResults",
	filename: "src/lib/db.functions.ts"
}, (opts) => loadScanResults.__executeServer(opts));
var loadScanResults = createServerFn({ method: "POST" }).validator((input) => input).handler(loadScanResults_createServerFn_handler, async ({ data }) => {
	const row = (await dbSelect("scan_results", `timeframe=eq.${data.timeframe}&select=results,updated_at`))[0];
	return {
		results: (row?.results ?? []).map((r) => {
			if (!r.retests && r.retest) return {
				...r,
				retests: [r.retest],
				retest: void 0
			};
			if (!r.retests) return {
				...r,
				retests: []
			};
			return r;
		}),
		updatedAt: row?.updated_at ?? null
	};
});
function toDb(t) {
	return {
		trade_id: t.tradeId,
		symbol: t.symbol,
		name: t.name,
		side: t.side,
		entry_price: t.entryPrice,
		entry_date: t.entryDate,
		holding_days: t.holdingDays ?? 5,
		exit_price: t.exitPrice ?? null,
		exit_date: t.exitDate ?? null,
		current_price: t.currentPrice ?? null,
		status: t.status ?? "Open",
		day_pnl: t.dayPnl ?? [
			null,
			null,
			null,
			null,
			null
		],
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function fromDb(row) {
	return {
		tradeId: row.trade_id,
		symbol: row.symbol,
		name: row.name,
		side: row.side,
		entryPrice: row.entry_price,
		entryDate: row.entry_date,
		holdingDays: row.holding_days,
		exitPrice: row.exit_price,
		exitDate: row.exit_date,
		currentPrice: row.current_price,
		status: row.status,
		dayPnl: row.day_pnl ?? [
			null,
			null,
			null,
			null,
			null
		]
	};
}
var savePaperTrade_createServerFn_handler = createServerRpc({
	id: "c868e702522e6fa59dbcfe18b3d2f57bc9147bb45885d310b9721a9501bf456c",
	name: "savePaperTrade",
	filename: "src/lib/db.functions.ts"
}, (opts) => savePaperTrade.__executeServer(opts));
var savePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(savePaperTrade_createServerFn_handler, async ({ data }) => {
	await dbInsert("paper_trades", toDb(data));
	return { ok: true };
});
var updatePaperTrade_createServerFn_handler = createServerRpc({
	id: "ba654d26a20b0f7860bd1e3f73a021eb72a8b0446909b9e1679e02d8c7418a4b",
	name: "updatePaperTrade",
	filename: "src/lib/db.functions.ts"
}, (opts) => updatePaperTrade.__executeServer(opts));
var updatePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(updatePaperTrade_createServerFn_handler, async ({ data }) => {
	const updates = {};
	if (data.updates.exitPrice !== void 0) updates.exit_price = data.updates.exitPrice;
	if (data.updates.exitDate !== void 0) updates.exit_date = data.updates.exitDate;
	if (data.updates.status !== void 0) updates.status = data.updates.status;
	if (data.updates.currentPrice !== void 0) updates.current_price = data.updates.currentPrice;
	if (data.updates.dayPnl !== void 0) updates.day_pnl = data.updates.dayPnl;
	await dbUpdate("paper_trades", `trade_id=eq.${data.tradeId}`, updates);
	return { ok: true };
});
var deletePaperTrade_createServerFn_handler = createServerRpc({
	id: "fdcd15c61ace0e6a5406f6b10d3bf075cff054422162ed3680e957fa67076962",
	name: "deletePaperTrade",
	filename: "src/lib/db.functions.ts"
}, (opts) => deletePaperTrade.__executeServer(opts));
var deletePaperTrade = createServerFn({ method: "POST" }).validator((input) => input).handler(deletePaperTrade_createServerFn_handler, async ({ data }) => {
	await dbDelete("paper_trades", `trade_id=eq.${data.tradeId}`);
	return { ok: true };
});
var loadPaperTrades_createServerFn_handler = createServerRpc({
	id: "0e338e5021b9c65ea7dd388aea2de1b80a8306e558799a277d055740ee087667",
	name: "loadPaperTrades",
	filename: "src/lib/db.functions.ts"
}, (opts) => loadPaperTrades.__executeServer(opts));
var loadPaperTrades = createServerFn({ method: "POST" }).validator((input) => input).handler(loadPaperTrades_createServerFn_handler, async () => {
	return (await dbSelect("paper_trades", "select=*&order=status.asc,created_at.desc")).map(fromDb);
});
var clearPaperTradeHistory_createServerFn_handler = createServerRpc({
	id: "76e2c7333194f51d5aea38142f42deafdca6e388bebe433655c34baa188fb51a",
	name: "clearPaperTradeHistory",
	filename: "src/lib/db.functions.ts"
}, (opts) => clearPaperTradeHistory.__executeServer(opts));
var clearPaperTradeHistory = createServerFn({ method: "POST" }).validator((input) => input).handler(clearPaperTradeHistory_createServerFn_handler, async () => {
	await dbDelete("paper_trades", "status=eq.Closed");
	return { ok: true };
});
var batchUpdatePaperTrades_createServerFn_handler = createServerRpc({
	id: "82cf61328754b6e2619ce8b1da6fe3b725b0ff7cb703615dab7871f2a5d69896",
	name: "batchUpdatePaperTrades",
	filename: "src/lib/db.functions.ts"
}, (opts) => batchUpdatePaperTrades.__executeServer(opts));
var batchUpdatePaperTrades = createServerFn({ method: "POST" }).validator((input) => input).handler(batchUpdatePaperTrades_createServerFn_handler, async ({ data }) => {
	await Promise.all(data.updates.map((u) => {
		const updates = { current_price: u.currentPrice };
		if (u.status) updates.status = u.status;
		if (u.exitPrice !== void 0) updates.exit_price = u.exitPrice;
		if (u.exitDate !== void 0) updates.exit_date = u.exitDate;
		return dbUpdate("paper_trades", `trade_id=eq.${u.tradeId}`, updates);
	}));
	return { ok: true };
});
//#endregion
export { batchUpdatePaperTrades_createServerFn_handler, clearPaperTradeHistory_createServerFn_handler, deletePaperTrade_createServerFn_handler, loadPaperTrades_createServerFn_handler, loadScanResults_createServerFn_handler, savePaperTrade_createServerFn_handler, saveScanResults_createServerFn_handler, updatePaperTrade_createServerFn_handler };
