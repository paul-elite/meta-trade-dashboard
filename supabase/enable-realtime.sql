-- Enable real-time for wallets and transactions tables
-- Run this in your Supabase SQL Editor

-- Add wallets table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;

-- Add transactions table to the realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Note: If you get an error that the table is already added, that's fine - it means realtime is already enabled.
