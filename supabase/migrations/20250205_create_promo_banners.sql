-- Create promo_banners table
CREATE TABLE promo_banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  title TEXT,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying of enabled banners
CREATE INDEX idx_promo_banners_enabled_order ON promo_banners(is_enabled, display_order);

-- Enable Row Level Security
ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view enabled banners
CREATE POLICY "Anyone can view enabled banners" ON promo_banners
  FOR SELECT USING (is_enabled = true);

-- Policy: Admins can do everything (using service role key bypasses RLS)
-- The admin routes use createAdminClient which uses the service role key

-- Create storage bucket for promo banners
-- Note: Run this in Supabase dashboard SQL editor or via Supabase CLI:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('promo-banners', 'promo-banners', true);

-- Storage policies (run in Supabase dashboard):
-- CREATE POLICY "Public can view promo banner images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'promo-banners');
-- CREATE POLICY "Authenticated users can upload promo banners" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'promo-banners' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can delete promo banners" ON storage.objects
--   FOR DELETE USING (bucket_id = 'promo-banners' AND auth.role() = 'authenticated');
