import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateReference } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify user is admin
  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!adminProfile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { userId, amount, type, description } = body

  // Validation
  if (!userId || !amount || !type || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['credit', 'debit'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type. Must be credit or debit' }, { status: 400 })
  }

  const numAmount = parseFloat(amount)
  if (isNaN(numAmount) || numAmount <= 0) {
    return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
  }

  // Get current wallet balance
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (walletError || !wallet) {
    return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
  }

  // Check sufficient balance for debit
  if (type === 'debit' && wallet.balance < numAmount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const newBalance = type === 'credit'
    ? wallet.balance + numAmount
    : wallet.balance - numAmount

  // Update wallet
  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', wallet.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Create transaction record
  const transactionType = type === 'credit' ? 'admin_credit' : 'admin_debit'
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: transactionType,
      amount: numAmount,
      status: 'completed',
      description: `[Admin] ${description}`,
      reference: generateReference()
    })

  if (txError) {
    console.error('Transaction log error:', txError)
  }

  // Audit log
  await supabase.from('admin_audit_logs').insert({
    admin_id: user.id,
    action_type: type,
    target_user_id: userId,
    details: {
      amount: numAmount,
      description,
      previous_balance: wallet.balance,
      new_balance: newBalance
    }
  })

  return NextResponse.json({
    success: true,
    newBalance,
    message: `Successfully ${type}ed $${numAmount.toFixed(2)} ${type === 'credit' ? 'to' : 'from'} user's wallet`
  })
}
