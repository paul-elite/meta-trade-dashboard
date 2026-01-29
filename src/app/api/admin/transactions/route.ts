import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET all transactions (admin)
export async function GET() {
    try {
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

        // Fetch all transactions
        const { data: transactions, error: txError } = await adminClient
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false })

        if (txError) throw txError

        // Get unique user IDs
        const userIds = [...new Set(transactions?.map(t => t.user_id) || [])]

        // Fetch profiles for those users
        const { data: profiles, error: profileError } = await adminClient
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds)

        if (profileError) throw profileError

        // Create a map for quick lookup
        const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

        // Merge transactions with profiles
        const transactionsWithProfiles = transactions?.map(tx => ({
            ...tx,
            profiles: profileMap.get(tx.user_id) || null
        })) || []

        return NextResponse.json(transactionsWithProfiles)
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json({
            error: 'Failed to fetch transactions',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
