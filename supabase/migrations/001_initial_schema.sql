-- ─── planify: initial schema ─────────────────────────────────────────────────
-- Run this migration once in the Supabase SQL Editor (or via `supabase db push`).
-- All three tables use Row Level Security so each user can only access their own
-- data. The app never sees another user's rows.

-- ─── trips ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id                TEXT         PRIMARY KEY,
  user_id           UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property          JSONB        NOT NULL,
  criteria          JSONB        NOT NULL DEFAULT '{}',
  status            TEXT         NOT NULL DEFAULT 'confirmed',
  booked_at         TIMESTAMPTZ,
  check_in          TEXT         NOT NULL,
  check_out         TEXT         NOT NULL,
  total_price       NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency          TEXT         NOT NULL DEFAULT 'USD',
  travelers         INTEGER      NOT NULL DEFAULT 1,
  confirmation_code TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trips_select_own" ON trips
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "trips_insert_own" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trips_update_own" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "trips_delete_own" ON trips
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS trips_user_id_idx ON trips (user_id);

-- ─── saved_properties ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_properties (
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id TEXT        NOT NULL,
  saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_select_own" ON saved_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_insert_own" ON saved_properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_delete_own" ON saved_properties
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS saved_properties_user_id_idx ON saved_properties (user_id);

-- ─── user_preferences ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id       UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  currency      TEXT        NOT NULL DEFAULT 'USD',
  language      TEXT        NOT NULL DEFAULT 'es',
  notifications BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prefs_select_own" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "prefs_insert_own" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "prefs_update_own" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
