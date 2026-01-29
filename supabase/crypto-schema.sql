-- Crypto Options Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.crypto_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  network TEXT NOT NULL,
  icon_url TEXT,
  is_enabled BOOLEAN DEFAULT true NOT NULL,
  min_deposit DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_crypto_options_enabled ON public.crypto_options(is_enabled);
CREATE INDEX IF NOT EXISTS idx_crypto_options_symbol ON public.crypto_options(symbol);

-- Enable RLS
ALTER TABLE public.crypto_options ENABLE ROW LEVEL SECURITY;

-- Everyone can read enabled crypto options
CREATE POLICY "Anyone can view enabled crypto options"
  ON public.crypto_options FOR SELECT
  USING (is_enabled = true);

-- Admins can do everything
CREATE POLICY "Admins can manage crypto options"
  ON public.crypto_options FOR ALL
  USING (true);

-- Insert some default crypto options
INSERT INTO public.crypto_options (name, symbol, wallet_address, network, icon_url, is_enabled, min_deposit)
VALUES
  ('Bitcoin', 'BTC', '', 'Bitcoin Network', 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', true, 0.0001),
  ('Ethereum', 'ETH', '', 'Ethereum (ERC-20)', 'https://cryptologos.cc/logos/ethereum-eth-logo.png', true, 0.001),
  ('Tether', 'USDT', '', 'Ethereum (ERC-20)', 'https://cryptologos.cc/logos/tether-usdt-logo.png', true, 10),
  ('USD Coin', 'USDC', '', 'Ethereum (ERC-20)', 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', true, 10),
  ('Litecoin', 'LTC', '', 'Litecoin Network', 'https://cryptologos.cc/logos/litecoin-ltc-logo.png', true, 0.01),
  ('Bitcoin Cash', 'BCH', '', 'Bitcoin Cash Network', 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png', false, 0.001)
ON CONFLICT DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_crypto_options_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS crypto_options_updated_at ON public.crypto_options;
CREATE TRIGGER crypto_options_updated_at
  BEFORE UPDATE ON public.crypto_options
  FOR EACH ROW
  EXECUTE FUNCTION update_crypto_options_updated_at();
