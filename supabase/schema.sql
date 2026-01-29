-- Create crypto_options table
CREATE TABLE IF NOT EXISTS public.crypto_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    network TEXT NOT NULL,
    icon_url TEXT,
    is_enabled BOOLEAN DEFAULT true,
    min_deposit NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint on wallet_address if it doesn't exist
-- Note: We are using placeholders like "BTC_SETUP_REQUIRED" for empty ones to avoid this
ALTER TABLE public.crypto_options 
ADD CONSTRAINT crypto_options_wallet_address_key UNIQUE (wallet_address);

-- Add unique constraint on symbol
ALTER TABLE public.crypto_options 
ADD CONSTRAINT crypto_options_symbol_key UNIQUE (symbol);

-- Enable RLS
ALTER TABLE public.crypto_options ENABLE ROW LEVEL SECURITY;

-- Policies

-- Public read access (for deposit page)
CREATE POLICY "Allow public read access" ON public.crypto_options
FOR SELECT USING (true);

-- Admin full access
-- Assuming you have a way to identify admins, e.g. via specific email or public.profiles
CREATE POLICY "Allow admin full access" ON public.crypto_options
FOR ALL USING (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.is_admin = true
  )
);
