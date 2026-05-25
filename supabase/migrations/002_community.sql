-- ── Community posts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name     TEXT        NOT NULL,
  author_avatar_url TEXT,
  destination     TEXT        NOT NULL,
  caption         TEXT        NOT NULL,
  image_url       TEXT        NOT NULL,
  likes_count     INTEGER     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Public feed — anyone (including guests) can read
CREATE POLICY "community_posts_select_all"
  ON community_posts FOR SELECT USING (true);

-- Only the author can create their own posts
CREATE POLICY "community_posts_insert_own"
  ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the author can delete their own posts
CREATE POLICY "community_posts_delete_own"
  ON community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS community_posts_user_id_idx   ON community_posts (user_id);
CREATE INDEX IF NOT EXISTS community_posts_created_at_idx ON community_posts (created_at DESC);

-- ── Post likes ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id    UUID        NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_likes_select_all"
  ON post_likes FOR SELECT USING (true);

CREATE POLICY "post_likes_insert_own"
  ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete_own"
  ON post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON post_likes (post_id);

-- ── Helper RPCs for atomic like count updates ─────────────────────────────────
CREATE OR REPLACE FUNCTION increment_post_likes(p_post_id UUID)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
$$;

CREATE OR REPLACE FUNCTION decrement_post_likes(p_post_id UUID)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE community_posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = p_post_id;
$$;
