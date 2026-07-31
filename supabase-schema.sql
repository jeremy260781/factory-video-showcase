-- ====================================
-- Factory Video Showcase - Supabase Schema
-- 在 Supabase Dashboard → SQL Editor 运行
-- ====================================

-- 1. 视频表（如果不存在）
CREATE TABLE IF NOT EXISTS public.videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  category TEXT DEFAULT '',
  factory_name TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT true,
  duration TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取已发布的视频
CREATE POLICY "Anyone can read published videos"
  ON public.videos
  FOR SELECT
  TO anon
  USING (is_published = true);

-- 允许服务角色读写所有视频
CREATE POLICY "Service role can manage all videos"
  ON public.videos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. 支付记录表
CREATE TABLE IF NOT EXISTS public.payments (
  id BIGSERIAL PRIMARY KEY,
  video_id BIGINT REFERENCES public.videos(id),
  customer_email TEXT DEFAULT '',
  customer_name TEXT DEFAULT '',
  amount INTEGER DEFAULT 1900,
  currency TEXT DEFAULT 'USD',
  airwallex_payment_intent_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 服务角色可以管理所有支付记录
CREATE POLICY "Service role can manage payments"
  ON public.payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_payments_video_email ON public.payments(video_id, customer_email);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published);
