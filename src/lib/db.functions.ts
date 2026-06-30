import { createServerFn } from "@tanstack/react-start";
import { getSupabase } from "./db";

// ── Scan Results ──

interface ScanResultDoc {
  symbol: string;
  name: string;
  original: { signal: "BUY" | "SELL"; signalDate: string; signalTime: string; signalPrice: number } | null;
  retests: { signal: "BUY" | "SELL"; signalDate: string; signalTime: string; signalPrice: number }[];
  currentPrice: number | null;
  timeframe: string;
  trend: "Bullish" | "Bearish" | "Neutral";
  retestLevel: number | null;
  retestDirection: "BUY" | "SELL" | null;
  error?: string;
}

export const saveScanResults = createServerFn({ method: "POST" })
  .validator((input: { timeframe: string; results: ScanResultDoc[] }) => input)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { error } = await sb
      .from("scan_results")
      .upsert(
        { timeframe: data.timeframe, results: data.results, updated_at: new Date().toISOString() },
        { onConflict: "timeframe" },
      );
    if (error) console.error("saveScanResults:", error.message);
    return { ok: true };
  });

export const loadScanResults = createServerFn({ method: "POST" })
  .validator((input: { timeframe: string }) => input)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { data: row, error } = await sb
      .from("scan_results")
      .select("results, updated_at")
      .eq("timeframe", data.timeframe)
      .maybeSingle();
    if (error) console.error("loadScanResults:", error.message);
    // Migrate old docs: retest (singular) → retests (array)
    const results = ((row?.results as any[]) ?? []).map((r: any) => {
      if (!r.retests && r.retest) {
        return { ...r, retests: [r.retest], retest: undefined };
      }
      if (!r.retests) {
        return { ...r, retests: [] };
      }
      return r;
    });
    return { results, updatedAt: row?.updated_at ?? null };
  });

// ── Paper Trades ──

interface PaperTradeDoc {
  trade_id: string;
  symbol: string;
  name: string;
  side: "BUY" | "SELL";
  entry_price: number;
  entry_date: string;
  holding_days: number;
  exit_price: number | null;
  exit_date: string | null;
  current_price: number | null;
  status: "Open" | "Closed";
  day_pnl: (number | null)[];
  created_at: string;
}

// Helper: convert camelCase trade from frontend → snake_case for Supabase
function toDb(t: any): Partial<PaperTradeDoc> {
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
    day_pnl: t.dayPnl ?? [null, null, null, null, null],
    created_at: new Date().toISOString(),
  };
}

// Helper: convert snake_case from Supabase → camelCase for frontend
function fromDb(row: any) {
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
    dayPnl: row.day_pnl ?? [null, null, null, null, null],
  };
}

export const savePaperTrade = createServerFn({ method: "POST" })
  .validator((input: any) => input)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { error } = await sb.from("paper_trades").insert(toDb(data));
    if (error) console.error("savePaperTrade:", error.message);
    return { ok: true };
  });

export const updatePaperTrade = createServerFn({ method: "POST" })
  .validator((input: { tradeId: string; updates: any }) => input)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const updates: any = {};
    if (data.updates.exitPrice !== undefined) updates.exit_price = data.updates.exitPrice;
    if (data.updates.exitDate !== undefined) updates.exit_date = data.updates.exitDate;
    if (data.updates.status !== undefined) updates.status = data.updates.status;
    if (data.updates.currentPrice !== undefined) updates.current_price = data.updates.currentPrice;
    if (data.updates.dayPnl !== undefined) updates.day_pnl = data.updates.dayPnl;
    const { error } = await sb.from("paper_trades").update(updates).eq("trade_id", data.tradeId);
    if (error) console.error("updatePaperTrade:", error.message);
    return { ok: true };
  });

export const deletePaperTrade = createServerFn({ method: "POST" })
  .validator((input: { tradeId: string }) => input)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    const { error } = await sb.from("paper_trades").delete().eq("trade_id", data.tradeId);
    if (error) console.error("deletePaperTrade:", error.message);
    return { ok: true };
  });

export const loadPaperTrades = createServerFn({ method: "POST" })
  .validator((input: Record<string, never>) => input)
  .handler(async () => {
    const sb = getSupabase();
    const { data: rows, error } = await sb
      .from("paper_trades")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) console.error("loadPaperTrades:", error.message);
    return (rows ?? []).map(fromDb);
  });

export const clearPaperTradeHistory = createServerFn({ method: "POST" })
  .validator((input: Record<string, never>) => input)
  .handler(async () => {
    const sb = getSupabase();
    const { error } = await sb.from("paper_trades").delete().eq("status", "Closed");
    if (error) console.error("clearPaperTradeHistory:", error.message);
    return { ok: true };
  });

export const batchUpdatePaperTrades = createServerFn({ method: "POST" })
  .validator((input: { updates: Array<{ tradeId: string; currentPrice: number | null; status?: "Open" | "Closed"; exitPrice?: number | null; exitDate?: string | null }> }) => input)
  .handler(async ({ data }) => {
    const sb = getSupabase();
    // Supabase doesn't have bulkWrite, so batch with Promise.all
    await Promise.all(
      data.updates.map((u) => {
        const updates: any = { current_price: u.currentPrice };
        if (u.status) updates.status = u.status;
        if (u.exitPrice !== undefined) updates.exit_price = u.exitPrice;
        if (u.exitDate !== undefined) updates.exit_date = u.exitDate;
        return sb.from("paper_trades").update(updates).eq("trade_id", u.tradeId);
      }),
    );
    return { ok: true };
  });
