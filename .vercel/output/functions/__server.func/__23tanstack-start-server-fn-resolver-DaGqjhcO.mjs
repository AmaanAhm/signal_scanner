//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-DaGqjhcO.js
var manifest = {
	"0e3084ee207d8a13a5cea140a0a3288a8bbea0f5e0615518224337888b21eff1": {
		functionName: "backtestStock_createServerFn_handler",
		importer: () => import("./_ssr/backtest.functions-CT0-I0VA.mjs")
	},
	"0e338e5021b9c65ea7dd388aea2de1b80a8306e558799a277d055740ee087667": {
		functionName: "loadPaperTrades_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"1da4266b0e73f9f240d869675c5f2db16e2633bd61e73c0de06a6f8e1003ce34": {
		functionName: "loadScanResults_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"4b85a58669f02a2b7ce44f60b1b729cf8b9a073e314ed505095caa3e144da8ea": {
		functionName: "checkRetestBatch_createServerFn_handler",
		importer: () => import("./_ssr/scanner.functions-C6-k1u4c.mjs")
	},
	"76e2c7333194f51d5aea38142f42deafdca6e388bebe433655c34baa188fb51a": {
		functionName: "clearPaperTradeHistory_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"784d9f6692509a59f870d0fb62c24aa436a2a42f7cc632902ce58b2f0a7662d8": {
		functionName: "saveScanResults_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"79e8a8372b766b286ec73493b614dfc24464a79b0dfb30608d3b7490ce8b32db": {
		functionName: "getQuotesBatch_createServerFn_handler",
		importer: () => import("./_ssr/scanner.functions-C6-k1u4c.mjs")
	},
	"7c640e65587d3708c844871c50f1de5f187352f0c91127c7f8b032c548532c68": {
		functionName: "aggregateBacktest_createServerFn_handler",
		importer: () => import("./_ssr/backtest.functions-CT0-I0VA.mjs")
	},
	"82cf61328754b6e2619ce8b1da6fe3b725b0ff7cb703615dab7871f2a5d69896": {
		functionName: "batchUpdatePaperTrades_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"ab426c9010e05c56bd5585f8c5f6cd21908b9b0b85df64fcf3408a2c1bdbd134": {
		functionName: "scanStock_createServerFn_handler",
		importer: () => import("./_ssr/scanner.functions-C6-k1u4c.mjs")
	},
	"ba654d26a20b0f7860bd1e3f73a021eb72a8b0446909b9e1679e02d8c7418a4b": {
		functionName: "updatePaperTrade_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"c868e702522e6fa59dbcfe18b3d2f57bc9147bb45885d310b9721a9501bf456c": {
		functionName: "savePaperTrade_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	},
	"e65cefd224bace7eb24022dcc9ec350f18f9469e87d4c99f51e8038bc7455445": {
		functionName: "simulatePaperTrade_createServerFn_handler",
		importer: () => import("./_ssr/scanner.functions-C6-k1u4c.mjs")
	},
	"fdcd15c61ace0e6a5406f6b10d3bf075cff054422162ed3680e957fa67076962": {
		functionName: "deletePaperTrade_createServerFn_handler",
		importer: () => import("./_ssr/db.functions-ByFGqAkO.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
