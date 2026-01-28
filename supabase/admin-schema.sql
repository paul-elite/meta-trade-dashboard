-- MetaTrade Admin Dashboard Schema
-- Run this SQL in your Supabase SQL Editor AFTER the main schema

-- Add is_admin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- Update transaction type constraint to include admin actions
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('deposit', 'withdraw', 'transfer', 'admin_credit', 'admin_debit'));

-- Admin audit logs table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('credit', 'debit', 'profile_view')),
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target_user_id ON public.admin_audit_logs(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin policies for profiles (view all users)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop and recreate the original policy to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Admin policies for wallets (view and update all)
CREATE POLICY "Admins can view all wallets"
  ON public.wallets FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update all wallets"
  ON public.wallets FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop original wallet policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update their own wallet" ON public.wallets;

-- Admin policies for transactions (view all and insert for any user)
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert transactions for any user"
  ON public.transactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Drop original transaction policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.transactions;

-- Audit logs policies - admins only
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
