import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client (bypasses RLS) to check admin status
    const adminClient = createAdminClient()

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error checking admin status:', profileError)
      return NextResponse.json({ error: 'Failed to verify admin status' }, { status: 500 })
    }

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse query params
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''

    // Fetch users with wallets using admin client (bypasses RLS)
    let query = adminClient
      .from('profiles')
      .select(`*, wallets(*)`, { count: 'exact' })

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({ users: data || [], total: count || 0, page, limit })
  } catch (err: unknown) {
    const error = err as Error
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
