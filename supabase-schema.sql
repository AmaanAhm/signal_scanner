-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Creates the two tables needed by Signal Scanner Pro

-- 1. Scan results: one row per timeframe (15m, 30m, 60m, 1d)
CREATE TABLE IF NOT EXISTS scan_results (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timeframe TEXT NOT NULL UNIQUE,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Paper trades
CREATE TABLE IF NOT EXISTS paper_trades (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  trade_id TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  entry_price NUMERIC NOT NULL,
  entry_date TEXT NOT NULL,
  holding_days INTEGER NOT NULL DEFAULT 5,
  exit_price NUMERIC,
  exit_date TEXT,
  current_price NUMERIC,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  day_pnl JSONB NOT NULL DEFAULT '[null,null,null,null,null]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_paper_trades_status ON paper_trades (status, created_at DESC);

-- Enable Row Level Security (required by Supabase but we allow all for server-side access)
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;

-- Allow all operations (since we use the service role / anon key from the server)
CREATE POLICY "Allow all on scan_results" ON scan_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on paper_trades" ON paper_trades FOR ALL USING (true) WITH CHECK (true);
