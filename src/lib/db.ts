/**
 * Supabase REST API client using plain fetch().
 * No WebSocket dependency — works on Node 20, Vercel, Cloudflare, everywhere.
 */

let _url = "";
let _key = "";

function getConfig() {
  if (!_url) {
    _url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    _key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  }
  if (!_url || !_key) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  return { url: _url, key: _key };
}

function headers() {
  const { key } = getConfig();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

function restUrl(table: string) {
  return `${getConfig().url}/rest/v1/${table}`;
}

/** SELECT rows. Pass query params like ?timeframe=eq.30m */
export async function dbSelect<T = any>(table: string, params?: string): Promise<T[]> {
  const url = restUrl(table) + (params ? `?${params}` : "");
  const res = await fetch(url, { headers: { ...headers(), Prefer: "return=representation" } });
  if (!res.ok) {
    console.error(`dbSelect ${table}:`, res.status, await res.text());
    return [];
  }
  return res.json();
}

/** INSERT row(s). */
export async function dbInsert(table: string, body: any): Promise<boolean> {
  const res = await fetch(restUrl(table), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`dbInsert ${table}:`, res.status, await res.text());
  return res.ok;
}

/** UPSERT row(s) on a conflict column. */
export async function dbUpsert(table: string, body: any, onConflict: string): Promise<boolean> {
  const res = await fetch(restUrl(table), {
    method: "POST",
    headers: { ...headers(), Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`dbUpsert ${table}:`, res.status, await res.text());
  return res.ok;
}

/** UPDATE rows matching filter. filter like "trade_id=eq.abc123" */
export async function dbUpdate(table: string, filter: string, body: any): Promise<boolean> {
  const res = await fetch(`${restUrl(table)}?${filter}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error(`dbUpdate ${table}:`, res.status, await res.text());
  return res.ok;
}

/** DELETE rows matching filter. */
export async function dbDelete(table: string, filter: string): Promise<boolean> {
  const res = await fetch(`${restUrl(table)}?${filter}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) console.error(`dbDelete ${table}:`, res.status, await res.text());
  return res.ok;
}
