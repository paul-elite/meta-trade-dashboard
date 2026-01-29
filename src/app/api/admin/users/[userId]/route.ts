import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const supabase = await createClient()
  const { userId } = await params

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use admin client for admin operations
  const adminClient = createAdminClient()

  // Check if admin
  const { data: adminProfile } = await adminClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!adminProfile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Fetch user's wallet separately
  const { data: wallets } = await adminClient
    .from('wallets')
    .select('*')
    .eq('user_id', userId)

  // Add wallets to profile
  const profileWithWallet = { ...profile, wallets: wallets || [] }

  // Fetch user transactions
  const { data: transactions, error: txError } = await adminClient
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 })
  }

  // Log admin view action
  await adminClient.from('admin_audit_logs').insert({
    admin_id: user.id,
    action_type: 'profile_view',
    target_user_id: userId,
    details: { action: 'view_user_detail' }
  })

  return NextResponse.json({ user: profileWithWallet, transactions })
}
