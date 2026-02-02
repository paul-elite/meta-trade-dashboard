import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { generateReference } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()

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

  // Get current wallet balance - order by updated_at DESC to get the most recently updated wallet
  let { data: wallets, error: walletFetchError } = await adminClient
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (walletFetchError) {
    console.error('Error fetching wallet:', walletFetchError)
    return NextResponse.json({ error: `Failed to fetch wallet: ${walletFetchError.message}` }, { status: 500 })
  }

  let wallet = wallets && wallets.length > 0 ? wallets[0] : null

  // If user has multiple wallets (shouldn't happen), log it
  if (wallets && wallets.length > 1) {
    console.warn(`User ${userId} has ${wallets.length} wallets, using first one: ${wallet?.id}`)
  }

  // Create wallet if it doesn't exist
  if (!wallet) {
    if (type === 'debit') {
      return NextResponse.json({ error: 'Cannot debit - user has no wallet' }, { status: 400 })
    }

    console.log(`Creating new wallet for user ${userId}`)

    // Create a new wallet for the user
    const { data: newWallet, error: createError } = await adminClient
      .from('wallets')
      .insert({
        user_id: userId,
        balance: 0,
        currency: 'USD'
      })
      .select()
      .single()

    if (createError || !newWallet) {
      console.error('Error creating wallet:', createError)
      return NextResponse.json({ error: `Failed to create wallet: ${createError?.message || 'Unknown error'}` }, { status: 500 })
    }

    console.log(`Created wallet ${newWallet.id} for user ${userId}`)
    wallet = newWallet
  }

  // Ensure balance is a number
  const currentBalance = Number(wallet.balance) || 0

  // Check sufficient balance for debit
  if (type === 'debit' && currentBalance < numAmount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const newBalance = type === 'credit'
    ? currentBalance + numAmount
    : currentBalance - numAmount

  // Update wallet using wallet.id to ensure single row update
  const { data: updatedWallet, error: updateError } = await adminClient
    .from('wallets')
    .update({
      balance: newBalance,
      updated_at: new Date().toISOString()
    })
    .eq('id', wallet.id)
    .select()
    .maybeSingle()

  if (updateError) {
    console.error('Error updating wallet:', updateError)
    return NextResponse.json({ error: `Failed to update wallet: ${updateError.message}` }, { status: 500 })
  }

  if (!updatedWallet) {
    console.error('Wallet update returned no data for wallet id:', wallet.id)
    return NextResponse.json({ error: 'Wallet update failed - wallet not found' }, { status: 500 })
  }

  // Use the actual balance from the updated record
  const finalBalance = updatedWallet.balance

  // Create transaction record
  const transactionType = type === 'credit' ? 'admin_credit' : 'admin_debit'
  const { error: txError } = await adminClient
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
  await adminClient.from('admin_audit_logs').insert({
    admin_id: user.id,
    action_type: type,
    target_user_id: userId,
    details: {
      amount: numAmount,
      description,
      previous_balance: currentBalance,
      new_balance: finalBalance
    }
  })

  return NextResponse.json({
    success: true,
    newBalance: finalBalance,
    message: `Successfully ${type}ed $${numAmount.toFixed(2)} ${type === 'credit' ? 'to' : 'from'} user's wallet`
  })
}
