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

    // Fetch users
    let query = adminClient
      .from('profiles')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    const { data: profiles, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({
        error: error.message,
        details: error
      }, { status: 500 })
    }

    // Fetch wallets for these users - order by updated_at DESC to get the most recently updated
    const userIds = profiles?.map(p => p.id) || []
    const { data: wallets } = await adminClient
      .from('wallets')
      .select('*')
      .in('user_id', userIds)
      .order('updated_at', { ascending: false })

    // Create map of existing wallets - if duplicates exist, the first (most recent) wins
    // because forEach will set the first one only if the key doesn't already exist doesn't apply here
    // So we need to ensure the first wallet (most recent) is kept
    const walletsMap = new Map<string, typeof wallets extends (infer T)[] | null ? T : never>()
    if (wallets) {
      for (const w of wallets) {
        if (!walletsMap.has(w.user_id)) {
          walletsMap.set(w.user_id, w)
        }
      }
    }

    // Find users without wallets and create them
    const usersWithoutWallets = userIds.filter(id => !walletsMap.has(id))

    if (usersWithoutWallets.length > 0) {
      console.log(`Creating wallets for ${usersWithoutWallets.length} users without wallets`)

      const newWallets = usersWithoutWallets.map(userId => ({
        user_id: userId,
        balance: 0,
        currency: 'USD'
      }))

      const { data: createdWallets, error: createError } = await adminClient
        .from('wallets')
        .insert(newWallets)
        .select()

      if (createError) {
        console.error('Error creating wallets:', createError)
      } else if (createdWallets) {
        // Add newly created wallets to the map
        createdWallets.forEach(w => walletsMap.set(w.user_id, w))
        console.log(`Created ${createdWallets.length} new wallets`)
      }
    }

    // Combine profiles with their wallets
    const usersWithWallets = profiles?.map(p => ({
      ...p,
      wallets: walletsMap.get(p.id) ? [walletsMap.get(p.id)] : []
    })) || []

    return NextResponse.json(
      { users: usersWithWallets, total: count || 0, page, limit },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  } catch (err: unknown) {
    const error = err as Error
    console.error('API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
