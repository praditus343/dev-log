-- Migration: Page Analytics (Portfolio Clicks)
-- Run this in Supabase SQL Editor to enable portfolio click tracking

-- 1. Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT GENERATED ALWAYS AS (
    CASE
      WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'mobile'
      WHEN user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN 'tablet'
      ELSE 'desktop'
    END
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create index for fast aggregation queries
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path_date ON page_views (path, created_at DESC);

-- 3. Allow anonymous inserts (public visitors) but only authenticated reads (admin)
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin) can read
CREATE POLICY "Only authenticated users can read page views"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);
