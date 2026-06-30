import { createServerFn } from "@tanstack/react-start";
import { dbSelect, dbInsert, dbUpsert, dbUpdate, dbDelete } from "./db";

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
    await dbUpsert("scan_results", {
      timeframe: data.timeframe,
      results: data.results,
      updated_at: new Date().toISOString(),
    }, "timeframe");
    return { ok: true };
  });

export const loadScanResults = createServerFn({ method: "POST" })
  .validator((input: { timeframe: string }) => input)
  .handler(async ({ data }) => {
    const rows = await dbSelect("scan_results", `timeframe=eq.${data.timeframe}&select=results,updated_at`);
    const row = rows[0];
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

// Helper: convert camelCase trade from frontend → snake_case for Supabase
function toDb(t: any) {
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
    await dbInsert("paper_trades", toDb(data));
    return { ok: true };
  });

export const updatePaperTrade = createServerFn({ method: "POST" })
  .validator((input: { tradeId: string; updates: any }) => input)
  .handler(async ({ data }) => {
    const updates: any = {};
    if (data.updates.exitPrice !== undefined) updates.exit_price = data.updates.exitPrice;
    if (data.updates.exitDate !== undefined) updates.exit_date = data.updates.exitDate;
    if (data.updates.status !== undefined) updates.status = data.updates.status;
    if (data.updates.currentPrice !== undefined) updates.current_price = data.updates.currentPrice;
    if (data.updates.dayPnl !== undefined) updates.day_pnl = data.updates.dayPnl;
    await dbUpdate("paper_trades", `trade_id=eq.${data.tradeId}`, updates);
    return { ok: true };
  });

export const deletePaperTrade = createServerFn({ method: "POST" })
  .validator((input: { tradeId: string }) => input)
  .handler(async ({ data }) => {
    await dbDelete("paper_trades", `trade_id=eq.${data.tradeId}`);
    return { ok: true };
  });

export const loadPaperTrades = createServerFn({ method: "POST" })
  .validator((input: Record<string, never>) => input)
  .handler(async () => {
    const rows = await dbSelect("paper_trades", "select=*&order=status.asc,created_at.desc");
    return rows.map(fromDb);
  });

export const clearPaperTradeHistory = createServerFn({ method: "POST" })
  .validator((input: Record<string, never>) => input)
  .handler(async () => {
    await dbDelete("paper_trades", "status=eq.Closed");
    return { ok: true };
  });

export const batchUpdatePaperTrades = createServerFn({ method: "POST" })
  .validator((input: { updates: Array<{ tradeId: string; currentPrice: number | null; status?: "Open" | "Closed"; exitPrice?: number | null; exitDate?: string | null }> }) => input)
  .handler(async ({ data }) => {
    await Promise.all(
      data.updates.map((u) => {
        const updates: any = { current_price: u.currentPrice };
        if (u.status) updates.status = u.status;
        if (u.exitPrice !== undefined) updates.exit_price = u.exitPrice;
        if (u.exitDate !== undefined) updates.exit_date = u.exitDate;
        return dbUpdate("paper_trades", `trade_id=eq.${u.tradeId}`, updates);
      }),
    );
    return { ok: true };
  });
