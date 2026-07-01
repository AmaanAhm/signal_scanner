import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FULL_UNIVERSE } from "@/lib/nse500";
import { scanStock, checkRetestBatch, getQuotesBatch, simulatePaperTrade, type PaperTradeResult } from "@/lib/scanner.functions";
import { backtestStock, aggregateBacktest, type BacktestResult, type BacktestTrade, type BacktestSummary, type DateRange } from "@/lib/backtest.functions";
import {
  saveScanResults,
  loadScanResults,
  savePaperTrade,
  updatePaperTrade,
  deletePaperTrade,
  loadPaperTrades,
  clearPaperTradeHistory,
  batchUpdatePaperTrades,
} from "@/lib/db.functions";

export const Route = createFileRoute("/")({
  component: Index,
});

type Tf = "1m" | "5m" | "15m" | "30m" | "60m" | "1d";
type SignalInfo = { signal: "BUY" | "SELL"; signalDate: string; signalTime: string; signalPrice: number };

type ScanRow = {
  symbol: string;
  name: string;
  original: SignalInfo | null;
  retests: SignalInfo[];
  currentPrice: number | null;
  timeframe: Tf;
  trend: "Bullish" | "Bearish" | "Neutral";
  retestLevel: number | null;
  retestDirection: "BUY" | "SELL" | null;
};

type FlatRow = {
  symbol: string;
  name: string;
  source: string;
  signal: "BUY" | "SELL";
  signalDate: string;
  signalTime: string;
  signalPrice: number;
  currentPrice: number | null;
  changePct: number | null;
  timeframe: Tf;
  trend: "Bullish" | "Bearish" | "Neutral";
};

interface PaperTrade {
  tradeId: string;
  symbol: string;
  name: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  entryDate: string;
  holdingDays: number;
  exitPrice: number | null;
  exitDate: string | null;
  currentPrice: number | null;
  status: "Open" | "Closed";
  dayPnl: (number | null)[];
}

const CONCURRENCY = 8;

function countTradingDays(start: Date, end: Date): number {
  let count = 0;
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  while (d <= e) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

function calcPnl(trade: PaperTrade): { amount: number | null; pct: number | null } {
  const price = trade.status === "Closed" ? trade.exitPrice : trade.currentPrice;
  if (price == null) return { amount: null, pct: null };
  const raw = price - trade.entryPrice;
  const adjusted = trade.side === "BUY" ? raw : -raw;
  return { amount: adjusted, pct: (adjusted / trade.entryPrice) * 100 };
}

function PnlText({ value, prefix = "" }: { value: number | null; prefix?: string }) {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  const cls = value >= 0 ? "text-profit" : "text-loss";
  return <span className={cls}>{value >= 0 ? "+" : ""}{prefix}{value.toFixed(2)}{prefix ? "" : "%"}</span>;
}

function SignalBadge({ signal }: { signal: "BUY" | "SELL" }) {
  return <span className={signal === "BUY" ? "badge-buy" : "badge-sell"}>{signal}</span>;
}

// ── Main Page ──

function Index() {
  const scan = useServerFn(scanStock);
  const retestCheck = useServerFn(checkRetestBatch);
  const dbSaveScan = useServerFn(saveScanResults);
  const dbLoadScan = useServerFn(loadScanResults);
  const dbLoadScanRef = useRef(dbLoadScan);
  dbLoadScanRef.current = dbLoadScan;

  const [tf, setTf] = useState<Tf>("1d");
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL">("ALL");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retestRefreshing, setRetestRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("original");
  const [activeSymbols, setActiveSymbols] = useState<Set<string>>(new Set());
  const runningRef = useRef(false);
  const retestRefreshRef = useRef(false);
  const paperRef = useRef<PaperTradeRef>(null);
  const [loadingTf, setLoadingTf] = useState(false);

  // Load persisted scan results on mount / timeframe change.
  useEffect(() => {
    let cancelled = false;
    setLoadingTf(true);
    setRows([]);
    setLastUpdated(null);
    dbLoadScanRef.current({ data: { timeframe: tf } })
      .then((data: any) => {
        if (cancelled) return;
        if (data?.results?.length > 0) {
          setRows(data.results);
          if (data.updatedAt) setLastUpdated(new Date(data.updatedAt));
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingTf(false); });
    return () => { cancelled = true; };
  }, [tf]);

  const runScan = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    const list = FULL_UNIVERSE;
    setProgress({ done: 0, total: list.length });
    const queue = [...list];
    const collected: ScanRow[] = [];
    let done = 0;

    async function worker() {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        try {
          const r = (await scan({ data: { symbol: item.symbol, name: item.name, timeframe: tf as "15m" | "30m" | "60m" | "1d" } })) as ScanRow;
          if (r.original || (r.retests && r.retests.length > 0)) collected.push(r);
        } catch { /* ignore */ }
        finally {
          done++;
          setProgress({ done, total: list.length });
          if (done % 5 === 0 || done === list.length) setRows([...collected]);
        }
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
    setRows([...collected]);
    setLastUpdated(new Date());
    setRunning(false);
    runningRef.current = false;

    // Persist to MongoDB.
    try {
      await dbSaveScan({ data: { timeframe: tf, results: collected } });
    } catch { /* best-effort */ }
  }, [scan, tf, dbSaveScan]);

  // Lightweight retest refresh.
  const refreshRetests = useCallback(async () => {
    if (retestRefreshRef.current || runningRef.current) return;
    retestRefreshRef.current = true;
    setRetestRefreshing(true);
    const candidates = rows.filter((r) => r.original && r.retestLevel != null && r.retestDirection != null);
    if (candidates.length === 0) { retestRefreshRef.current = false; setRetestRefreshing(false); return; }
    try {
      const items = candidates.map((r) => ({
        symbol: r.symbol, name: r.name, level: r.retestLevel!, direction: r.retestDirection!,
        signalDate: r.original!.signalDate, signalTime: r.original!.signalTime, signalPrice: r.original!.signalPrice,
      }));
      const results = (await retestCheck({ data: { items } })) as Array<{
        symbol: string; name: string; retested: boolean; currentPrice: number | null;
        direction: "BUY" | "SELL"; level: number; signalDate: string; signalTime: string; signalPrice: number;
      }>;
      setRows((prev) => {
        const updated = [...prev];
        for (const res of results) {
          const idx = updated.findIndex((r) => r.symbol === res.symbol);
          if (idx < 0) continue;
          const row = { ...updated[idx], retests: [...updated[idx].retests] };
          if (res.currentPrice != null) row.currentPrice = res.currentPrice;
          if (res.retested) {
            const now = new Date();
            const parts = new Intl.DateTimeFormat("en-GB", {
              timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit",
              hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
            }).formatToParts(now);
            const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
            const dt = `${get("year")}-${get("month")}-${get("day")}`;
            const tm = `${get("hour")}:${get("minute")}:${get("second")}`;
            // Only add if this exact date+time combo isn't already present (avoid duplicates within same second)
            const dup = row.retests.some((r) => r.signalDate === dt && r.signalTime === tm);
            if (!dup) {
              row.retests.push({
                signal: res.direction,
                signalDate: dt,
                signalTime: tm,
                signalPrice: res.level,
              });
            }
          }
          updated[idx] = row;
        }
        return updated;
      });
      setLastUpdated(new Date());
    } catch { /* ignore */ }
    retestRefreshRef.current = false;
    setRetestRefreshing(false);
  }, [rows, retestCheck]);

  useEffect(() => {
    if (!autoRefresh) return;
    refreshRetests();
    const id = setInterval(refreshRetests, 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, refreshRetests]);

  const { originals, retests, retestBuys, retestSells } = useMemo(() => {
    const q = search.trim().toLowerCase();

    // Originals: one per row (latest signal)
    const originals: FlatRow[] = rows
      .map((r) => {
        if (!r.original) return null;
        if (filter !== "ALL" && r.original.signal !== filter) return null;
        if (q && !`${r.symbol} ${r.name}`.toLowerCase().includes(q)) return null;
        return {
          symbol: r.symbol, name: r.name, source: "Original", signal: r.original.signal,
          signalDate: r.original.signalDate, signalTime: r.original.signalTime, signalPrice: r.original.signalPrice,
          currentPrice: r.currentPrice,
          changePct: r.currentPrice != null ? ((r.currentPrice - r.original.signalPrice) / r.original.signalPrice) * 100 : null,
          timeframe: r.timeframe, trend: r.trend,
        } as FlatRow;
      })
      .filter((x): x is FlatRow => x !== null)
      .sort((a, b) => `${b.signalDate} ${b.signalTime}`.localeCompare(`${a.signalDate} ${a.signalTime}`));

    // Retests: flatMap all entries, sort most recent first, then deduplicate by symbol (one row per stock)
    const allRetests: FlatRow[] = rows
      .flatMap((r) =>
        (r.retests || []).map((rt) => {
          if (filter !== "ALL" && rt.signal !== filter) return null;
          if (q && !`${r.symbol} ${r.name}`.toLowerCase().includes(q)) return null;
          return {
            symbol: r.symbol, name: r.name, source: "Retest", signal: rt.signal,
            signalDate: rt.signalDate, signalTime: rt.signalTime, signalPrice: rt.signalPrice,
            currentPrice: r.currentPrice,
            changePct: r.currentPrice != null ? ((r.currentPrice - rt.signalPrice) / rt.signalPrice) * 100 : null,
            timeframe: "1m" as Tf, trend: r.trend,
          } as FlatRow;
        }),
      )
      .filter((x): x is FlatRow => x !== null)
      .sort((a, b) => `${b.signalDate} ${b.signalTime}`.localeCompare(`${a.signalDate} ${a.signalTime}`));

    // One row per stock — keep only the most recent retest
    const seen = new Set<string>();
    const retests = allRetests.filter((r) => {
      if (seen.has(r.symbol)) return false;
      seen.add(r.symbol);
      return true;
    });

    return {
      originals,
      retests,
      retestBuys: retests.filter((r) => r.signal === "BUY").slice(0, 10),
      retestSells: retests.filter((r) => r.signal === "SELL").slice(0, 10),
    };
  }, [rows, filter, search]);

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const buyCount = originals.filter((r) => r.signal === "BUY").length;
  const sellCount = originals.filter((r) => r.signal === "SELL").length;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.97 0.004 250)" }}>
      {/* ── Header ── */}
      <header style={{ background: "linear-gradient(180deg, oklch(1 0 0), oklch(0.97 0.004 250))", borderBottom: "1px solid oklch(0.90 0.01 255)" }}>
        <div className="mx-auto max-w-[1440px] page-pad header-pad px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-cyan">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "oklch(1 0 0)" }}>
                <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" /><polyline points="16,7 22,7 22,13" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: "oklch(0.18 0.03 260)" }}>Signal Scanner Pro</h1>
              <p className="text-xs" style={{ color: "oklch(0.50 0.03 255)" }}>NSE 500 · Lorentzian Classification · Yahoo Finance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] page-pad px-6 py-6">
        {/* ── Stat Cards ── */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="stat-card">
            <div className="text-xs font-medium" style={{ color: "oklch(0.50 0.03 255)" }}>Total Signals</div>
            <div className="mt-1 text-2xl font-bold mono" style={{ color: "oklch(0.20 0.03 260)" }}>{originals.length}</div>
          </div>
          <div className="stat-card" style={{ borderColor: "oklch(0.50 0.16 150 / 20%)" }}>
            <div className="text-xs font-medium text-profit">BUY Signals</div>
            <div className="mt-1 text-2xl font-bold mono text-profit">{buyCount}</div>
          </div>
          <div className="stat-card" style={{ borderColor: "oklch(0.55 0.22 25 / 20%)" }}>
            <div className="text-xs font-medium text-loss">SELL Signals</div>
            <div className="mt-1 text-2xl font-bold mono text-loss">{sellCount}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs font-medium" style={{ color: "oklch(0.50 0.03 255)" }}>Retests</div>
            <div className="mt-1 text-2xl font-bold mono" style={{ color: "oklch(0.50 0.16 200)" }}>{retests.length}</div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="glass-card controls-bar mb-5 flex flex-wrap items-center gap-3 px-5 py-3">
          <label className="text-xs font-semibold" style={{ color: "oklch(0.48 0.03 255)" }}>Timeframe</label>
          <select className="ctrl-select" value={tf} onChange={(e) => setTf(e.target.value as Tf)} disabled={running}>
            <option value="15m">15 min</option>
            <option value="30m">30 min</option>
            <option value="60m">1 hour</option>
            <option value="1d">1 day</option>
          </select>
          <label className="text-xs font-semibold" style={{ color: "oklch(0.48 0.03 255)" }}>Show</label>
          <select className="ctrl-select" value={filter} onChange={(e) => setFilter(e.target.value as "ALL" | "BUY" | "SELL")} disabled={running}>
            <option value="ALL">All</option>
            <option value="BUY">BUY only</option>
            <option value="SELL">SELL only</option>
          </select>
          <input className="ctrl-input w-52" placeholder="Search stock, index or crypto…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <label className="live-toggle ml-auto flex items-center gap-2 text-xs font-medium cursor-pointer" style={{ color: "oklch(0.48 0.03 255)" }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-[oklch(0.50_0.16_200)]" />
            {autoRefresh && <span className="live-dot" />}
            Live retest
          </label>
          <button className="scan-button" onClick={runScan} disabled={running}>
            {running ? "Scanning…" : "Run Scan"}
          </button>
        </div>

        {/* ── Progress ── */}
        {running && (
          <div className="mb-4">
            <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${pct}%` }} /></div>
            <div className="mt-1.5 text-xs mono" style={{ color: "oklch(0.50 0.03 255)" }}>
              Processing {progress.done} / {progress.total} symbols ({pct}%)
            </div>
          </div>
        )}

        {/* ── Status ── */}
        {!running && (
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs" style={{ color: "oklch(0.50 0.03 255)" }}>
            {retestRefreshing && <span><span className="live-dot" /> Updating retests…</span>}
            {lastUpdated && <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>}
            <span className="ml-auto">Universe: {FULL_UNIVERSE.length} symbols</span>
          </div>
        )}

        {/* ── Tab Pills ── */}
        <div className="tab-row mb-4" role="tablist">
          {[
            { id: "original", label: `Original (${originals.length})` },
            { id: "top10", label: `Top 10 Retest` },
            { id: "retests", label: `All Retests (${retests.length})` },
            { id: "paper", label: "Paper Trade" },
            { id: "backtest", label: "Backtest" },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              className={`tab-pill ${activeTab === t.id ? "tab-pill-active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Panels ── */}
        <div className="glass-card p-5">
          {loadingTf ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div style={{ width: 32, height: 32, border: "3px solid oklch(0.90 0.01 255)", borderTopColor: "oklch(0.55 0.17 200)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span className="text-sm" style={{ color: "oklch(0.50 0.03 255)" }}>Loading {tf} data…</span>
            </div>
          ) : (
            <>
              {activeTab === "original" && <SignalTable title="Original BUY / SELL Signals" subtitle="Signal candle generated directly by the Lorentzian classifier." rows={originals} />}
              {activeTab === "top10" && <Top10Panel retestBuys={retestBuys} retestSells={retestSells} />}
              {activeTab === "retests" && <SignalTable title="All Retest Entries" subtitle="Every bar where price touched the exact Buy/Sell signal price." rows={retests} onAddTrade={paperRef.current?.addTrade} activeSymbols={activeSymbols} />}
            </>
          )}
          <div style={{ display: activeTab === "paper" ? "block" : "none" }}><PaperTradePanel ref={paperRef} onActiveChange={setActiveSymbols} /></div>
          <div style={{ display: activeTab === "backtest" ? "block" : "none" }}><BacktestPanel rows={rows} /></div>
        </div>

        {/* ── Footer ── */}
        <footer className="mt-6 pb-8 text-center text-xs" style={{ color: "oklch(0.58 0.02 255)" }}>
          Source: Pine v5 "Machine Learning: Lorentzian Classification (Signals Only)" by jdehorty. MPI 2.0, OHL·C. Yahoo Finance. Times in Asia/Kolkata (IST). Information only — not investment advice.
        </footer>
      </main>
    </div>
  );
}

// ── Signal Table Component ──

function SignalTable({ title, subtitle, rows, onAddTrade, activeSymbols }: {
  title: string; subtitle: string; rows: FlatRow[];
  onAddTrade?: (row: FlatRow) => void; activeSymbols?: Set<string>;
}) {
  const colSpan = onAddTrade ? 12 : 11;

  // Per-column filter state
  const [f, setF] = useState({
    symbol: "", name: "", signal: "" as "" | "BUY" | "SELL",
    date: "", time: "",
    priceMin: "", priceMax: "",
    currentMin: "", currentMax: "",
    changeMin: "", changeMax: "",
    tf: "", trend: "" as "" | "Bullish" | "Bearish" | "Neutral",
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));
  const hasFilter = Object.values(f).some((v) => v !== "");

  // Filter rows
  const filtered = useMemo(() => {
    if (!hasFilter) return rows;
    return rows.filter((r) => {
      if (f.symbol && !r.symbol.toLowerCase().includes(f.symbol.toLowerCase())) return false;
      if (f.name && !r.name.toLowerCase().includes(f.name.toLowerCase())) return false;
      if (f.signal && r.signal !== f.signal) return false;
      if (f.date && !r.signalDate.includes(f.date)) return false;
      if (f.time && !r.signalTime.includes(f.time)) return false;
      if (f.priceMin && r.signalPrice < Number(f.priceMin)) return false;
      if (f.priceMax && r.signalPrice > Number(f.priceMax)) return false;
      if (f.currentMin && (r.currentPrice == null || r.currentPrice < Number(f.currentMin))) return false;
      if (f.currentMax && (r.currentPrice == null || r.currentPrice > Number(f.currentMax))) return false;
      if (f.changeMin && (r.changePct == null || r.changePct < Number(f.changeMin))) return false;
      if (f.changeMax && (r.changePct == null || r.changePct > Number(f.changeMax))) return false;
      if (f.tf && r.timeframe !== f.tf) return false;
      if (f.trend && r.trend !== f.trend) return false;
      return true;
    });
  }, [rows, f, hasFilter]);

  const fInput = "ctrl-input w-full text-xs";
  const fStyle: React.CSSProperties = { padding: "4px 6px", fontSize: "0.65rem", minWidth: 0 };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="section-title">{title} <span className="count">({filtered.length}{hasFilter ? ` / ${rows.length}` : ""})</span></div>
        {hasFilter && (
          <button className="btn-outline-sm" style={{ fontSize: "0.65rem" }} onClick={() => setF({ symbol: "", name: "", signal: "", date: "", time: "", priceMin: "", priceMax: "", currentMin: "", currentMax: "", changeMin: "", changeMax: "", tf: "", trend: "" })}>
            ✕ Clear Filters
          </button>
        )}
      </div>
      <p className="mt-0.5 mb-2 text-xs" style={{ color: "oklch(0.58 0.02 255)" }}>{subtitle}</p>
      <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(0.90 0.01 255)" }}>
        <table className="trading-table">
          <thead>
            <tr>
              <th className="text-left">#</th>
              <th className="text-left">Symbol</th>
              <th className="text-left">Company</th>
              <th className="text-left">Signal</th>
              <th className="text-left">Date</th>
              <th className="text-left">Time (IST)</th>
              <th className="text-right">Signal Price</th>
              <th className="text-right">Current</th>
              <th className="text-right">Change %</th>
              <th className="text-left">TF</th>
              <th className="text-left">Trend</th>
              {onAddTrade && <th className="text-center">Paper Trade</th>}
            </tr>
            {/* Filter row */}
            <tr style={{ background: "oklch(0.96 0.004 250)" }}>
              <th />
              <th><input className={fInput} style={fStyle} placeholder="Filter…" value={f.symbol} onChange={(e) => set("symbol", e.target.value)} /></th>
              <th><input className={fInput} style={fStyle} placeholder="Filter…" value={f.name} onChange={(e) => set("name", e.target.value)} /></th>
              <th>
                <select className="ctrl-select w-full" style={{ ...fStyle, minWidth: 60 }} value={f.signal} onChange={(e) => set("signal", e.target.value as any)}>
                  <option value="">All</option><option value="BUY">BUY</option><option value="SELL">SELL</option>
                </select>
              </th>
              <th><input className={fInput} style={fStyle} placeholder="YYYY-MM-DD" value={f.date} onChange={(e) => set("date", e.target.value)} /></th>
              <th><input className={fInput} style={fStyle} placeholder="HH:MM" value={f.time} onChange={(e) => set("time", e.target.value)} /></th>
              <th>
                <div className="flex gap-1">
                  <input className={fInput} style={{ ...fStyle, width: "50%" }} placeholder="Min" value={f.priceMin} onChange={(e) => set("priceMin", e.target.value)} />
                  <input className={fInput} style={{ ...fStyle, width: "50%" }} placeholder="Max" value={f.priceMax} onChange={(e) => set("priceMax", e.target.value)} />
                </div>
              </th>
              <th>
                <div className="flex gap-1">
                  <input className={fInput} style={{ ...fStyle, width: "50%" }} placeholder="Min" value={f.currentMin} onChange={(e) => set("currentMin", e.target.value)} />
                  <input className={fInput} style={{ ...fStyle, width: "50%" }} placeholder="Max" value={f.currentMax} onChange={(e) => set("currentMax", e.target.value)} />
                </div>
              </th>
              <th>
                <div className="flex gap-1">
                  <input className={fInput} style={{ ...fStyle, width: "50%" }} placeholder="Min" value={f.changeMin} onChange={(e) => set("changeMin", e.target.value)} />
                  <input className={fInput} style={{ ...fStyle, width: "50%" }} placeholder="Max" value={f.changeMax} onChange={(e) => set("changeMax", e.target.value)} />
                </div>
              </th>
              <th>
                <select className="ctrl-select w-full" style={{ ...fStyle, minWidth: 50 }} value={f.tf} onChange={(e) => set("tf", e.target.value)}>
                  <option value="">All</option><option value="1m">1m</option><option value="5m">5m</option><option value="15m">15m</option><option value="30m">30m</option><option value="60m">60m</option><option value="1d">1d</option>
                </select>
              </th>
              <th>
                <select className="ctrl-select w-full" style={{ ...fStyle, minWidth: 60 }} value={f.trend} onChange={(e) => set("trend", e.target.value as any)}>
                  <option value="">All</option><option value="Bullish">Bullish</option><option value="Bearish">Bearish</option><option value="Neutral">Neutral</option>
                </select>
              </th>
              {onAddTrade && <th />}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={colSpan} className="text-center py-12" style={{ color: "oklch(0.58 0.02 255)" }}>
                {rows.length === 0 ? "Run scan to populate." : "No matching results."}
              </td></tr>
            )}
            {filtered.map((r, i) => {
              const isActive = activeSymbols?.has(r.symbol) ?? false;
              return (
                <tr key={`${r.symbol}-${r.source}-${i}`}>
                  <td className="mono" style={{ color: "oklch(0.58 0.02 255)" }}>{i + 1}</td>
                  <td className="mono font-medium" style={{ color: "oklch(0.22 0.03 260)" }}>{r.symbol.replace(".NS", "")}</td>
                  <td>{r.name}</td>
                  <td><SignalBadge signal={r.signal} /></td>
                  <td className="mono">{r.signalDate}</td>
                  <td className="mono">{r.signalTime}</td>
                  <td className="text-right mono">{r.signalPrice.toFixed(2)}</td>
                  <td className="text-right mono">{r.currentPrice != null ? r.currentPrice.toFixed(2) : "—"}</td>
                  <td className="text-right mono"><PnlText value={r.changePct} /></td>
                  <td className="mono" style={{ color: "oklch(0.48 0.03 255)" }}>{r.timeframe}</td>
                  <td style={{ color: r.trend === "Bullish" ? "oklch(0.45 0.15 150)" : r.trend === "Bearish" ? "oklch(0.50 0.18 25)" : "oklch(0.50 0.03 255)" }}>
                    {r.trend}
                  </td>
                  {onAddTrade && (
                    <td className="text-center">
                      <button
                        onClick={() => onAddTrade(r)}
                        disabled={r.currentPrice == null || isActive}
                        className={isActive ? "btn-outline-sm opacity-40" : "btn-primary-sm"}
                      >
                        {isActive ? "Active" : "Add"}
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Top 10 Retest Panel ──

function Top10Panel({ retestBuys, retestSells }: { retestBuys: FlatRow[]; retestSells: FlatRow[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="section-title mb-3">🟢 Top BUY Retests <span className="count">({retestBuys.length})</span></div>
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(0.90 0.01 255)" }}>
          <table className="trading-table">
            <thead><tr><th className="text-left">#</th><th className="text-left">Symbol</th><th className="text-left">Company</th><th className="text-right">Signal</th><th className="text-right">Current</th><th className="text-right">Change</th><th className="text-left">Trend</th></tr></thead>
            <tbody>
              {retestBuys.length === 0 && <tr><td colSpan={7} className="text-center py-8" style={{ color: "oklch(0.58 0.02 255)" }}>No BUY retests yet.</td></tr>}
              {retestBuys.map((r, i) => (
                <tr key={r.symbol}><td className="mono" style={{ color: "oklch(0.58 0.02 255)" }}>{i + 1}</td><td className="mono font-medium" style={{ color: "oklch(0.22 0.03 260)" }}>{r.symbol.replace(".NS", "")}</td><td>{r.name}</td><td className="text-right mono">{r.signalPrice.toFixed(2)}</td><td className="text-right mono">{r.currentPrice?.toFixed(2) ?? "—"}</td><td className="text-right mono"><PnlText value={r.changePct} /></td><td style={{ color: "oklch(0.45 0.15 150)" }}>{r.trend}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="section-title mb-3">🔴 Top SELL Retests <span className="count">({retestSells.length})</span></div>
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(0.90 0.01 255)" }}>
          <table className="trading-table">
            <thead><tr><th className="text-left">#</th><th className="text-left">Symbol</th><th className="text-left">Company</th><th className="text-right">Signal</th><th className="text-right">Current</th><th className="text-right">Change</th><th className="text-left">Trend</th></tr></thead>
            <tbody>
              {retestSells.length === 0 && <tr><td colSpan={7} className="text-center py-8" style={{ color: "oklch(0.58 0.02 255)" }}>No SELL retests yet.</td></tr>}
              {retestSells.map((r, i) => (
                <tr key={r.symbol}><td className="mono" style={{ color: "oklch(0.58 0.02 255)" }}>{i + 1}</td><td className="mono font-medium" style={{ color: "oklch(0.22 0.03 260)" }}>{r.symbol.replace(".NS", "")}</td><td>{r.name}</td><td className="text-right mono">{r.signalPrice.toFixed(2)}</td><td className="text-right mono">{r.currentPrice?.toFixed(2) ?? "—"}</td><td className="text-right mono"><PnlText value={r.changePct} /></td><td style={{ color: "oklch(0.50 0.18 25)" }}>{r.trend}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Paper Trade Panel ──

export type PaperTradeRef = { addTrade: (stock: FlatRow) => void };

const PaperTradePanel = forwardRef<PaperTradeRef, { onActiveChange: (s: Set<string>) => void }>(function PaperTradePanel({ onActiveChange }, ref) {
  const fetchQuotes = useServerFn(getQuotesBatch);
  const runSimulate = useServerFn(simulatePaperTrade);
  const dbSave = useServerFn(savePaperTrade);
  const dbUpdate = useServerFn(updatePaperTrade);
  const dbDelete = useServerFn(deletePaperTrade);
  const dbLoad = useServerFn(loadPaperTrades);
  const dbClear = useServerFn(clearPaperTradeHistory);
  const dbBatchUpdate = useServerFn(batchUpdatePaperTrades);
  const dbLoadRef = useRef(dbLoad);
  dbLoadRef.current = dbLoad;

  const [trades, setTrades] = useState<PaperTrade[]>([]);
  const [updating, setUpdating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const updatingRef = useRef(false);

  const openTrades = useMemo(() => trades.filter((t) => t.status === "Open"), [trades]);
  const closedTrades = useMemo(() => trades.filter((t) => t.status === "Closed"), [trades]);

  // Load from MongoDB on mount.
  useEffect(() => {
    dbLoadRef.current({ data: {} })
      .then((data: any) => {
        const arr = Array.isArray(data) ? data : [];
        setTrades(arr.map((t: any) => ({ ...t, dayPnl: t.dayPnl || [null, null, null, null, null] })));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Add trade — always 5 trading days.
  const addTrade = useCallback(async (stock: FlatRow) => {
    if (stock.currentPrice == null) return;
    // Get the signal date in IST YYYY-MM-DD format for simulatePaperTrade
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
    const trade: PaperTrade = {
      tradeId: `${stock.symbol}-${Date.now()}`,
      symbol: stock.symbol, name: stock.name, side: stock.signal,
      entryPrice: stock.currentPrice, entryDate: parts,
      holdingDays: 5, exitPrice: null, exitDate: null, currentPrice: stock.currentPrice, status: "Open",
      dayPnl: [null, null, null, null, null],
    };
    setTrades((prev) => [trade, ...prev]);
    try { await dbSave({ data: trade }); } catch { /* best-effort */ }
  }, [dbSave]);

  // Notify parent of active symbols whenever open trades change.
  const activeSet = useMemo(() => new Set(openTrades.map((t) => t.symbol)), [openTrades]);
  useEffect(() => { onActiveChange(activeSet); }, [activeSet, onActiveChange]);
  useImperativeHandle(ref, () => ({ addTrade }), [addTrade]);

  // Close trade.
  const doCloseTrade = useCallback(async (id: string) => {
    const trade = trades.find((t) => t.tradeId === id);
    if (!trade || trade.status !== "Open") return;
    const updates = { exitPrice: trade.currentPrice, exitDate: new Date().toISOString(), status: "Closed" as const };
    setTrades((prev) => prev.map((t) => t.tradeId === id ? { ...t, ...updates } : t));
    try { await dbUpdate({ data: { tradeId: id, updates } }); } catch { /* best-effort */ }
  }, [trades, dbUpdate]);

  // Remove trade.
  const doRemoveTrade = useCallback(async (id: string) => {
    setTrades((prev) => prev.filter((t) => t.tradeId !== id));
    try { await dbDelete({ data: { tradeId: id } }); } catch { /* best-effort */ }
  }, [dbDelete]);

  // Clear history.
  const doClearHistory = useCallback(async () => {
    setTrades((prev) => prev.filter((t) => t.status === "Open"));
    try { await dbClear({ data: {} }); } catch { /* best-effort */ }
  }, [dbClear]);

  // Update prices and day 1-5 P&L.
  const updatePrices = useCallback(async () => {
    if (updatingRef.current || openTrades.length === 0) return;
    updatingRef.current = true;
    setUpdating(true);
    try {
      const symbols = [...new Set(openTrades.map((t) => t.symbol))];
      const prices = (await fetchQuotes({ data: { symbols } })) as Record<string, number | null>;

      // Fetch day 1-5 P&L for each open trade via simulatePaperTrade.
      const simResults = new Map<string, (number | null)[]>();
      await Promise.all(
        openTrades.map(async (t) => {
          try {
            const r = (await runSimulate({
              data: { symbol: t.symbol, name: t.name, side: t.side, signalDate: t.entryDate, signalPrice: t.entryPrice },
            })) as PaperTradeResult;
            simResults.set(t.tradeId, r.pnlPct);
          } catch { /* ignore */ }
        }),
      );

      const dbUpdates: Array<{ tradeId: string; currentPrice: number | null; status?: "Open" | "Closed"; exitPrice?: number | null; exitDate?: string | null }> = [];

      setTrades((prev) => prev.map((t) => {
        if (t.status !== "Open") return t;
        const price = prices[t.symbol];
        const dayPnl = [...(simResults.get(t.tradeId) || t.dayPnl || [null, null, null, null, null])];

        // Fallback: if Day 1 is still null but we have a live price, compute it.
        if (dayPnl[0] == null && price != null) {
          const raw = ((price - t.entryPrice) / t.entryPrice) * 100;
          dayPnl[0] = t.side === "BUY" ? raw : -raw;
        }

        // Auto-close if day 5 P&L is available.
        const allDaysFilled = dayPnl.length >= 5 && dayPnl[4] != null;
        if (allDaysFilled) {
          const exitP = price ?? t.currentPrice;
          const u = { ...t, currentPrice: price ?? t.currentPrice, exitPrice: exitP, exitDate: new Date().toISOString(), status: "Closed" as const, dayPnl };
          dbUpdates.push({ tradeId: t.tradeId, currentPrice: exitP, status: "Closed", exitPrice: exitP, exitDate: u.exitDate });
          return u;
        }
        if (price != null) dbUpdates.push({ tradeId: t.tradeId, currentPrice: price });
        return { ...t, currentPrice: price ?? t.currentPrice, dayPnl };
      }));

      if (dbUpdates.length > 0) {
        try { await dbBatchUpdate({ data: { updates: dbUpdates } }); } catch { /* best-effort */ }
      }
    } catch { /* ignore */ }
    updatingRef.current = false;
    setUpdating(false);
  }, [openTrades, fetchQuotes, runSimulate, dbBatchUpdate]);

  // Auto-update every 60s.
  useEffect(() => {
    if (openTrades.length === 0) return;
    updatePrices();
    const id = setInterval(updatePrices, 60_000);
    return () => clearInterval(id);
  }, [openTrades.length > 0, updatePrices]);

  // Summaries.
  const unrealized = useMemo(() => {
    let sum = 0; let n = 0;
    for (const t of openTrades) { const { amount } = calcPnl(t); if (amount != null) { sum += amount; n++; } }
    return { sum, n };
  }, [openTrades]);
  const realized = useMemo(() => {
    let sum = 0; let n = 0;
    for (const t of closedTrades) { const { amount } = calcPnl(t); if (amount != null) { sum += amount; n++; } }
    return { sum, n };
  }, [closedTrades]);

  // Day totals for columns.
  const dayTotals = useMemo(() => {
    const allTrades = [...openTrades, ...closedTrades];
    const sums = [0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0];
    for (const t of allTrades) {
      (t.dayPnl || []).forEach((p, i) => {
        if (p != null && Number.isFinite(p)) { sums[i] += p; counts[i]++; }
      });
    }
    return sums.map((s, i) => ({ total: s, avg: counts[i] ? s / counts[i] : null, n: counts[i] }));
  }, [openTrades, closedTrades]);


  if (!loaded) return <div className="py-12 text-center" style={{ color: "oklch(0.50 0.03 255)" }}>Loading trades…</div>;

  return (
    <div className="space-y-6">
      {/* Add trades from the All Retests tab using the "Add" button */}
      <p className="text-xs" style={{ color: "oklch(0.58 0.02 255)" }}>Go to the <strong>All Retests</strong> tab and click <strong>"Add"</strong> on any stock to start a paper trade. Each trade tracks P&L for 5 trading days, then auto-closes. Prices update every 60s.</p>

      {/* ── Active Trades ── */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="section-title">Active Trades <span className="count">({openTrades.length})</span></div>
          {updating && <span className="text-xs" style={{ color: "oklch(0.50 0.03 255)" }}><span className="live-dot" />Updating…</span>}
          {openTrades.length > 0 && <button onClick={updatePrices} disabled={updating} className="btn-outline-sm ml-auto">Refresh</button>}
        </div>
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(0.90 0.01 255)" }}>
          <table className="trading-table">
            <thead><tr>
              <th className="text-left">#</th>
              <th className="text-left">Symbol</th>
              <th className="text-left">Side</th>
              <th className="text-right">Entry</th>
              {[1, 2, 3, 4, 5].map((d) => <th key={d} className="text-right">Day {d} %</th>)}
              <th className="text-left">Status</th>
              <th className="text-center">Action</th>
            </tr></thead>
            <tbody>
              {openTrades.length === 0 && <tr><td colSpan={10} className="text-center py-8" style={{ color: "oklch(0.58 0.02 255)" }}>No active trades. Add stocks from the list above.</td></tr>}
              {openTrades.map((t, i) => (
                <tr key={t.tradeId}>
                  <td className="mono" style={{ color: "oklch(0.58 0.02 255)" }}>{i + 1}</td>
                  <td className="mono font-medium" style={{ color: "oklch(0.22 0.03 260)" }}>{t.symbol.replace(".NS", "")}</td>
                  <td><SignalBadge signal={t.side} /></td>
                  <td className="text-right mono">₹{t.entryPrice.toFixed(2)}</td>
                  {(t.dayPnl || [null, null, null, null, null]).map((p, idx) => (
                    <td key={idx} className="text-right mono"><PnlText value={p} /></td>
                  ))}
                  <td><span className="badge-open">Open</span></td>
                  <td className="text-center"><button onClick={() => doCloseTrade(t.tradeId)} className="btn-danger-sm">Close</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Trade History ── */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <div className="section-title">Trade History <span className="count">({closedTrades.length})</span></div>
          {closedTrades.length > 0 && <button onClick={doClearHistory} className="btn-danger-sm ml-auto">Clear history</button>}
        </div>
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(0.90 0.01 255)" }}>
          <table className="trading-table">
            <thead><tr>
              <th className="text-left">#</th>
              <th className="text-left">Symbol</th>
              <th className="text-left">Side</th>
              <th className="text-right">Entry</th>
              {[1, 2, 3, 4, 5].map((d) => <th key={d} className="text-right">Day {d} %</th>)}
              <th className="text-left">Status</th>
              <th className="text-center">Action</th>
            </tr></thead>
            <tbody>
              {closedTrades.length === 0 && <tr><td colSpan={10} className="text-center py-8" style={{ color: "oklch(0.58 0.02 255)" }}>No closed trades yet.</td></tr>}
              {closedTrades.map((t, i) => (
                <tr key={t.tradeId}>
                  <td className="mono" style={{ color: "oklch(0.58 0.02 255)" }}>{i + 1}</td>
                  <td className="mono font-medium" style={{ color: "oklch(0.22 0.03 260)" }}>{t.symbol.replace(".NS", "")}</td>
                  <td><SignalBadge signal={t.side} /></td>
                  <td className="text-right mono">₹{t.entryPrice.toFixed(2)}</td>
                  {(t.dayPnl || [null, null, null, null, null]).map((p, idx) => (
                    <td key={idx} className="text-right mono"><PnlText value={p} /></td>
                  ))}
                  <td><span className="badge-closed">Closed</span></td>
                  <td className="text-center"><button onClick={() => doRemoveTrade(t.tradeId)} className="btn-outline-sm">Remove</button></td>
                </tr>
              ))}
              {(openTrades.length + closedTrades.length) > 0 && (
                <tr style={{ background: "oklch(0.97 0.004 250)" }}>
                  <td colSpan={4} className="font-semibold" style={{ color: "oklch(0.30 0.02 260)" }}>Totals ({dayTotals[0]?.n || 0} trades) — avg · cumulative</td>
                  {dayTotals.map((dt, i) => (
                    <td key={i} className={`text-right mono ${dt.avg == null ? '' : dt.avg >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {dt.avg == null ? "—" : `${dt.avg >= 0 ? "+" : ""}${dt.avg.toFixed(2)}% · ${dt.total >= 0 ? "+" : ""}${dt.total.toFixed(2)}%`}
                    </td>
                  ))}
                  <td colSpan={2} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs" style={{ color: "oklch(0.58 0.02 255)" }}>
        Paper trades are persisted in MongoDB. P&L % is side-adjusted (BUY: up=profit, SELL: down=profit). Trades auto-close after 5 trading days.
      </p>
    </div>
  );
});

// ── Backtest Panel ──

const BT_CONCURRENCY = 4;

function BacktestPanel({ rows }: { rows: ScanRow[] }) {
  const runStock = useServerFn(backtestStock);
  const runAggregate = useServerFn(aggregateBacktest);

  const loadSaved = () => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("bt_state") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        // Invalidate stale results from old schema (summaries[] → summary{})
        if (parsed?.result && !parsed.result.summary) {
          parsed.result = null;
        }
        return parsed;
      }
    } catch { /* ignore */ }
    return null;
  };
  const saved = useRef(loadSaved());

  const [enabled, setEnabled] = useState(saved.current?.enabled ?? false);
  const [dateRangeKey, setDateRangeKey] = useState(saved.current?.dateRangeKey ?? "1y");
  const [customStart, setCustomStart] = useState(saved.current?.customStart ?? "");
  const [customEnd, setCustomEnd] = useState(saved.current?.customEnd ?? "");
  const [btTimeframe, setBtTimeframe] = useState<"15m" | "30m" | "60m" | "1d">(saved.current?.btTimeframe ?? "1d");
  const [targetPct, setTargetPct] = useState<number>(saved.current?.targetPct ?? 2);
  const [stopLossPct, setStopLossPct] = useState<number>(saved.current?.stopLossPct ?? 2);
  const [result, setResult] = useState<BacktestResult | null>(saved.current?.result ?? null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, phase: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("bt_state", JSON.stringify({
        enabled, dateRangeKey, customStart, customEnd, btTimeframe, targetPct, stopLossPct, result,
      }));
    } catch { /* quota exceeded */ }
  }, [enabled, dateRangeKey, customStart, customEnd, btTimeframe, targetPct, stopLossPct, result]);

  const effectiveDateRange: DateRange = dateRangeKey === "custom"
    ? { start: customStart, end: customEnd }
    : dateRangeKey as DateRange;

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResult(null);
    const list = FULL_UNIVERSE.filter((s) => !s.symbol.startsWith("^") && !s.symbol.endsWith("-USD"));
    setProgress({ done: 0, total: list.length, phase: "Scanning stocks…" });

    const allEntries: any[] = [];
    const queue = [...list];
    let done = 0;
    let errCount = 0;

    async function worker() {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        try {
          const res = await runStock({ data: { symbol: item.symbol, name: item.name, dateRange: effectiveDateRange, timeframe: btTimeframe, targetPct, stopLossPct } }) as any;
          if (res.entries?.length > 0) allEntries.push(...res.entries);
          if (res.error) errCount++;
        } catch { errCount++; }
        finally {
          done++;
          if (done % 5 === 0 || done === list.length) {
            setProgress({ done, total: list.length, phase: `Scanning… ${done}/${list.length} — ${allEntries.length} entries found` });
          }
        }
      }
    }

    await Promise.all(Array.from({ length: BT_CONCURRENCY }, () => worker()));

    if (allEntries.length === 0) {
      setProgress({ done: list.length, total: list.length, phase: `Scan complete. 0 retest entries found across ${list.length} stocks (${errCount} errors). Try a longer date range or daily timeframe.` });
      setRunning(false);
      return;
    }

    setProgress({ done: list.length, total: list.length, phase: `Found ${allEntries.length} entries. Aggregating…` });
    try {
      const res = await runAggregate({ data: { allEntries, dateRange: effectiveDateRange, totalScanned: list.length } }) as BacktestResult;
      setResult(res);
    } catch (e: any) {
      setProgress({ done: 0, total: 0, phase: `Error: ${e.message}` });
    } finally {
      setRunning(false);
    }
  }, [effectiveDateRange, btTimeframe, targetPct, stopLossPct, runStock, runAggregate]);

  const sortedTrades = useMemo(() => {
    if (!result) return [];
    return [...result.trades].sort((a, b) => `${b.entryDate} ${b.entryTime}`.localeCompare(`${a.entryDate} ${a.entryTime}`));
  }, [result]);

  const exportCSV = useCallback(() => {
    if (!sortedTrades.length || !result) return;
    const header = "#,Symbol,Company,Signal Date,Signal Time,Signal ₹,Entry Date,Entry Time,Entry ₹,Exit Type,Exit Date,Exit Time,Exit ₹,P&L (₹),P&L (%),Hold(min),Result";
    const rows = sortedTrades.map((t, i) =>
      `${i + 1},${t.symbol.replace(".NS", "")},"${t.name}",${t.signalDate},${t.signalTime},${t.signalPrice.toFixed(2)},${t.entryDate},${t.entryTime},${t.entryPrice.toFixed(2)},${t.exitType},${t.exitDate},${t.exitTime},${t.exitPrice.toFixed(2)},${t.pnl.toFixed(2)},${t.pnlPct}%,${t.holdingMinutes},${t.win ? "WIN" : "LOSS"}`
    );
    const s = result.summary;
    const summaryRows = [
      "", "SUMMARY", "",
      `Total Trades,${s.totalTrades}`,
      `Wins,${s.wins}`,
      `Losses,${s.losses}`,
      `Win Rate,${s.winRate}%`,
      `Avg Return,${s.avgReturn}%`,
      `Total Return,${s.totalReturn}%`,
      `Profit Factor,${s.profitFactor}`,
      `Max Drawdown,${s.maxDrawdown}%`,
      `Target Exits,${s.targetExits}`,
      `Stoploss Exits,${s.stoplossExits}`,
      `Avg Holding (min),${s.avgHoldingMinutes}`,
    ];
    const csv = [header, ...rows, ...summaryRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backtest_target_exit.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sortedTrades, result]);

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="section-title">Historical Backtest — Signal Retest Strategy</div>
        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer" style={{ color: "oklch(0.48 0.03 255)" }}>
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-[oklch(0.50_0.16_200)]" />
          Backtest Mode
        </label>
      </div>

      {!enabled && (
        <div className="py-12 text-center text-sm" style={{ color: "oklch(0.50 0.03 255)" }}>
          Enable Backtest Mode to run historical analysis.
        </div>
      )}

      {enabled && (
        <>
          <p className="mt-0.5 mb-4 text-xs" style={{ color: "oklch(0.58 0.02 255)" }}>
            Entry on first retest of signal price. Exit at <strong>+{targetPct}% profit</strong> or <strong>-{stopLossPct}% stop loss</strong>. Timeframe used only for signal generation.
          </p>

          {/* Date Range + Timeframe + Run */}
          <div className="mb-4 flex flex-wrap items-end gap-3">
            <label className="text-xs font-medium" style={{ color: "oklch(0.40 0.03 255)" }}>
              Date Range
              <select value={dateRangeKey} onChange={(e) => setDateRangeKey(e.target.value)} className="ml-2 rounded-md px-2 py-1 text-xs" style={{ border: "1px solid oklch(0.85 0.02 255)" }}>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last 1 Year</option>
                <option value="2y">Last 2 Years</option>
                <option value="3y">Last 3 Years</option>
                <option value="4y">Last 4 Years</option>
                <option value="custom">Custom Range</option>
              </select>
            </label>
            <label className="text-xs font-medium" style={{ color: "oklch(0.40 0.03 255)" }}>
              Timeframe
              <select value={btTimeframe} onChange={(e) => setBtTimeframe(e.target.value as any)} className="ml-2 rounded-md px-2 py-1 text-xs" style={{ border: "1px solid oklch(0.85 0.02 255)" }}>
                <option value="15m">15 Min</option>
                <option value="30m">30 Min</option>
                <option value="60m">1 Hour</option>
                <option value="1d">1 Day</option>
              </select>
            </label>
            <label className="text-xs font-medium" style={{ color: "oklch(0.40 0.03 255)" }}>
              Target %
              <select value={targetPct} onChange={(e) => setTargetPct(Number(e.target.value))} className="ml-2 rounded-md px-2 py-1 text-xs" style={{ border: "1px solid oklch(0.85 0.02 255)" }}>
                {[1,2,3,4,5,6,7,8,9,10].map((v) => <option key={v} value={v}>{v}%</option>)}
              </select>
            </label>
            <label className="text-xs font-medium" style={{ color: "oklch(0.40 0.03 255)" }}>
              Stop Loss %
              <select value={stopLossPct} onChange={(e) => setStopLossPct(Number(e.target.value))} className="ml-2 rounded-md px-2 py-1 text-xs" style={{ border: "1px solid oklch(0.85 0.02 255)" }}>
                {[1,2,3,4,5,6,7,8,9,10].map((v) => <option key={v} value={v}>{v}%</option>)}
              </select>
            </label>
            {dateRangeKey === "custom" && (
              <>
                <label className="text-xs font-medium" style={{ color: "oklch(0.40 0.03 255)" }}>
                  Start <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="ml-1 rounded-md px-2 py-1 text-xs" style={{ border: "1px solid oklch(0.85 0.02 255)" }} />
                </label>
                <label className="text-xs font-medium" style={{ color: "oklch(0.40 0.03 255)" }}>
                  End <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="ml-1 rounded-md px-2 py-1 text-xs" style={{ border: "1px solid oklch(0.85 0.02 255)" }} />
                </label>
              </>
            )}
            <button onClick={handleRun} disabled={running} className="rounded-md px-4 py-1.5 text-xs font-bold text-white" style={{ background: running ? "oklch(0.60 0.05 255)" : "oklch(0.50 0.18 200)" }}>
              {running ? "Running…" : "Run Backtest"}
            </button>
          </div>

          {/* Progress */}
          {running && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="animate-spin w-4 h-4 border-2 rounded-full" style={{ borderColor: "oklch(0.50 0.16 200)", borderTopColor: "transparent" }} />
                <span className="text-xs" style={{ color: "oklch(0.45 0.03 255)" }}>{progress.phase}</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.93 0.01 255)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "oklch(0.50 0.16 200)" }} />
              </div>
            </div>
          )}

          {/* No result message */}
          {!running && !result && progress.phase && (
            <div className="py-6 text-center text-xs" style={{ color: "oklch(0.55 0.03 255)" }}>{progress.phase}</div>
          )}

          {/* Results */}
          {!running && result && (
            <>
              {/* Meta */}
              <div className="mb-4 flex flex-wrap gap-4 text-xs" style={{ color: "oklch(0.50 0.03 255)" }}>
                <span>Period: {result.dateRangeUsed.start} → {result.dateRangeUsed.end}</span>
                <span>Stocks scanned: {result.totalStocksProcessed}</span>
                <span>Stocks with trades: {result.totalStocksWithSignals}</span>
              </div>

              {/* Single Summary Panel */}
              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* Card 1: Performance */}
                <div className="stat-card">
                  <div className="text-xs font-semibold mb-2" style={{ color: "oklch(0.35 0.03 260)" }}>Performance</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Total Trades</span>
                    <span className="mono font-semibold text-right" style={{ color: "oklch(0.25 0.03 260)" }}>{result.summary.totalTrades}</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Win Rate</span>
                    <span className="mono font-semibold text-right" style={{ color: result.summary.winRate >= 50 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" }}>{result.summary.winRate}%</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>W / L</span>
                    <span className="mono font-semibold text-right" style={{ color: "oklch(0.35 0.03 260)" }}>{result.summary.wins} / {result.summary.losses}</span>
                  </div>
                </div>

                {/* Card 2: Returns */}
                <div className="stat-card">
                  <div className="text-xs font-semibold mb-2" style={{ color: "oklch(0.35 0.03 260)" }}>Returns</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Avg Return</span>
                    <span className="mono font-semibold text-right" style={{ color: result.summary.avgReturn >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" }}>{result.summary.avgReturn > 0 ? "+" : ""}{result.summary.avgReturn}%</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Total Return</span>
                    <span className="mono font-semibold text-right" style={{ color: result.summary.totalReturn >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" }}>{result.summary.totalReturn > 0 ? "+" : ""}{result.summary.totalReturn}%</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Profit Factor</span>
                    <span className="mono font-semibold text-right" style={{ color: result.summary.profitFactor >= 1 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" }}>{result.summary.profitFactor === Infinity ? "∞" : result.summary.profitFactor}</span>
                  </div>
                </div>

                {/* Card 3: Risk */}
                <div className="stat-card">
                  <div className="text-xs font-semibold mb-2" style={{ color: "oklch(0.35 0.03 260)" }}>Risk</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Max Gain</span>
                    <span className="mono font-semibold text-right text-profit">{result.summary.maxGain > 0 ? "+" : ""}{result.summary.maxGain}%</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Max Loss</span>
                    <span className="mono font-semibold text-right text-loss">{result.summary.maxLoss > 0 ? "+" : ""}{result.summary.maxLoss}%</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Max DD</span>
                    <span className="mono font-semibold text-right text-loss">{result.summary.maxDrawdown > 0 ? "-" : ""}{result.summary.maxDrawdown}%</span>
                  </div>
                </div>

                {/* Card 4: Exit Breakdown */}
                <div className="stat-card">
                  <div className="text-xs font-semibold mb-2" style={{ color: "oklch(0.35 0.03 260)" }}>Exit Breakdown</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>+{targetPct}% Target</span>
                    <span className="mono font-semibold text-right text-profit">{result.summary.targetExits}</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>-{stopLossPct}% SL</span>
                    <span className="mono font-semibold text-right text-loss">{result.summary.stoplossExits}</span>
                    <span style={{ color: "oklch(0.50 0.03 255)" }}>Avg Hold</span>
                    <span className="mono font-semibold text-right" style={{ color: "oklch(0.35 0.03 260)" }}>{result.summary.avgHoldingMinutes} min</span>
                  </div>
                </div>
              </div>

              {/* Trades Table */}
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <div className="section-title">All Trades <span className="count">({sortedTrades.length})</span></div>
                <button onClick={exportCSV} className="text-xs font-semibold px-3 py-1.5 rounded-md" style={{ background: "oklch(0.45 0.16 150)", color: "#fff" }}>
                  ⬇ Export CSV
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid oklch(0.90 0.01 255)" }}>
                <table className="trading-table">
                  <thead>
                    <tr>
                      <th className="text-left">#</th>
                      <th className="text-left">Symbol</th>
                      <th className="text-left">Company</th>
                      <th className="text-left">Signal Date</th>
                      <th className="text-left">Signal Time</th>
                      <th className="text-right">Signal ₹</th>
                      <th className="text-left">Entry Date</th>
                      <th className="text-left">Entry Time</th>
                      <th className="text-right">Entry ₹</th>
                      <th className="text-center">Exit Type</th>
                      <th className="text-left">Exit Date</th>
                      <th className="text-left">Exit Time</th>
                      <th className="text-right">Exit ₹</th>
                      <th className="text-right">P&L ₹</th>
                      <th className="text-right">P&L %</th>
                      <th className="text-right">Hold</th>
                      <th className="text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTrades.length === 0 ? (
                      <tr><td colSpan={17} className="text-center py-8" style={{ color: "oklch(0.58 0.02 255)" }}>No trades found.</td></tr>
                    ) : (
                      sortedTrades.map((t, i) => (
                        <tr key={`${t.symbol}-${t.entryDate}-${i}`}>
                          <td className="mono text-xs" style={{ color: "oklch(0.50 0.03 255)" }}>{i + 1}</td>
                          <td className="font-semibold" style={{ color: "oklch(0.30 0.04 260)" }}>{t.symbol.replace(".NS", "")}</td>
                          <td className="text-xs" style={{ color: "oklch(0.45 0.02 255)" }}>{t.name}</td>
                          <td className="mono text-xs">{t.signalDate}</td>
                          <td className="mono text-xs">{t.signalTime}</td>
                          <td className="mono text-right">{t.signalPrice.toFixed(2)}</td>
                          <td className="mono text-xs">{t.entryDate}</td>
                          <td className="mono text-xs">{t.entryTime}</td>
                          <td className="mono text-right">{t.entryPrice.toFixed(2)}</td>
                          <td className="text-center">
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                              background: t.exitType === "TARGET" ? "oklch(0.90 0.10 200)" : "oklch(0.93 0.08 25)",
                              color: t.exitType === "TARGET" ? "oklch(0.25 0.14 200)" : "oklch(0.40 0.20 25)",
                            }}>{t.exitType === "TARGET" ? `+${targetPct}%` : `-${stopLossPct}%`}</span>
                          </td>
                          <td className="mono text-xs">{t.exitDate}</td>
                          <td className="mono text-xs">{t.exitTime}</td>
                          <td className="mono text-right">{t.exitPrice.toFixed(2)}</td>
                          <td className="mono text-right font-semibold" style={{ color: t.pnl >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" }}>
                            {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}
                          </td>
                          <td className="mono text-right font-semibold" style={{ color: t.pnlPct >= 0 ? "oklch(0.45 0.16 150)" : "oklch(0.55 0.22 25)" }}>
                            {t.pnlPct >= 0 ? "+" : ""}{t.pnlPct}%
                          </td>
                          <td className="mono text-right text-xs">{t.holdingMinutes}m</td>
                          <td className="text-center">
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                              background: t.win ? "oklch(0.92 0.08 150)" : "oklch(0.93 0.08 25)",
                              color: t.win ? "oklch(0.30 0.15 150)" : "oklch(0.40 0.20 25)",
                            }}>
                              {t.win ? "WIN" : "LOSS"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
