-- Add mining_active column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mining_active BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_mining_active ON public.profiles(mining_active);
