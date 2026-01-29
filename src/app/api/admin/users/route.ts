import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse query params
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const search = url.searchParams.get('search') || ''

  // Fetch users with their wallets
  let query = supabase
    .from('profiles')
    .select(`
      *,
      wallets (*)
    `, { count: 'exact' })

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users: data || [], total: count || 0, page, limit })
}
