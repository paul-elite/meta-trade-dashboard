import { createClient } from '@/lib/supabase/server'
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

        // Check if admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch all transactions with user info
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select(`
        *,
        profiles:user_id (
          id,
          email,
          full_name
        )
      `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json(transactions)
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
}
