-- Drop old table and create new one with correct fields
DROP TABLE IF EXISTS site_settings;

CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp TEXT DEFAULT '',
  telegram TEXT DEFAULT '',
  email TEXT DEFAULT 'infobitcapmining@gmail.com',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (whatsapp, telegram, email)
VALUES ('', '', 'infobitcapmining@gmail.com');

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings
CREATE POLICY "Anyone can read site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update site_settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can insert settings
CREATE POLICY "Admins can insert site_settings"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
