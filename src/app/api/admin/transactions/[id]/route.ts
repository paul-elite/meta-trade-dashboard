import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// PUT update transaction status (approve/reject)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Use admin client for admin operations
        const adminClient = createAdminClient()

        // Check if admin
        const { data: profile } = await adminClient
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { status } = body // 'completed' or 'failed'

        if (!['completed', 'failed', 'cancelled'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        // Fetch the transaction first
        const { data: transaction, error: fetchError } = await adminClient
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
        }

        // If approving a deposit, credit the user's wallet
        if (status === 'completed' && transaction.type === 'deposit' && transaction.status === 'pending') {
            // Get user's wallet
            let { data: wallet, error: walletError } = await adminClient
                .from('wallets')
                .select('*')
                .eq('user_id', transaction.user_id)
                .single()

            // If wallet doesn't exist, create one
            if (walletError || !wallet) {
                console.log(`Creating wallet for user ${transaction.user_id}`)
                const { data: newWallet, error: createError } = await adminClient
                    .from('wallets')
                    .insert({
                        user_id: transaction.user_id,
                        balance: 0,
                        currency: 'USD'
                    })
                    .select()
                    .single()

                if (createError || !newWallet) {
                    console.error('Error creating wallet:', createError)
                    return NextResponse.json({ error: 'Failed to create wallet for user' }, { status: 500 })
                }
                wallet = newWallet
            }

            // Update wallet balance
            const { error: updateWalletError } = await adminClient
                .from('wallets')
                .update({ balance: wallet.balance + transaction.amount })
                .eq('id', wallet.id)

            if (updateWalletError) {
                console.error('Error updating wallet:', updateWalletError)
                return NextResponse.json({ error: 'Failed to update wallet' }, { status: 500 })
            }
        }

        // Update transaction status
        const { data: updatedTransaction, error: updateError } = await adminClient
            .from('transactions')
            .update({ status })
            .eq('id', id)
            .select()
            .single()

        if (updateError) throw updateError

        // Log the action
        await adminClient.from('admin_audit_logs').insert({
            admin_id: user.id,
            action_type: status === 'completed' ? 'credit' : 'debit',
            target_user_id: transaction.user_id,
            details: {
                action: status === 'completed' ? 'approve_transaction' : 'reject_transaction',
                transaction_id: id,
                transaction_type: transaction.type,
                amount: transaction.amount,
            }
        })

        return NextResponse.json(updatedTransaction)
    } catch (error) {
        console.error('Error updating transaction:', error)
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
    }
}
