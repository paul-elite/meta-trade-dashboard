import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET user's own wallet and profile data
export async function GET() {
    try {
        const supabase = await createClient()

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('Auth error:', authError)
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Use admin client to bypass any potential RLS issues
        const adminClient = createAdminClient()

        // Fetch profile
        const { data: profile, error: profileError } = await adminClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            console.error('Profile fetch error:', profileError)
        }

        // Fetch wallet - get all wallets for this user, ordered by updated_at DESC
        const { data: wallets, error: walletError } = await adminClient
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })

        if (walletError) {
            console.error('Wallet fetch error:', walletError)
        }

        // Use first (most recently updated) wallet or null
        const wallet = wallets && wallets.length > 0 ? wallets[0] : null

        // Log for debugging
        console.log(`User ${user.id} wallet fetch:`, {
            hasWallet: !!wallet,
            balance: wallet?.balance,
            walletCount: wallets?.length || 0
        })

        // Fetch transactions
        const { data: transactions, error: txError } = await adminClient
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50)

        if (txError) {
            console.error('Transactions fetch error:', txError)
        }

        return NextResponse.json(
            {
                profile,
                wallet,
                transactions: transactions || []
            },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache'
                }
            }
        )
    } catch (error) {
        console.error('Error fetching user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
