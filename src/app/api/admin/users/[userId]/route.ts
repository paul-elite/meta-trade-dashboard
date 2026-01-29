import { createClient } from '@/lib/supabase/server'
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

  // Fetch user profile with wallet
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      *,
      wallets (*)
    `)
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Fetch user transactions
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 })
  }

  // Log admin view action
  await supabase.from('admin_audit_logs').insert({
    admin_id: user.id,
    action_type: 'profile_view',
    target_user_id: userId,
    details: { action: 'view_user_detail' }
  })

  return NextResponse.json({ user: profile, transactions })
}
