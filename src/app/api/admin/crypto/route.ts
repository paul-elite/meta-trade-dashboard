import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET all crypto options (admin)
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

    const { data: cryptoOptions, error } = await supabase
      .from('crypto_options')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(cryptoOptions)
  } catch (error) {
    console.error('Error fetching crypto options:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto options' }, { status: 500 })
  }
}

// POST create new crypto option
export async function POST(request: Request) {
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

    const body = await request.json()
    console.log('[Creation] Body:', body)
    const { name, symbol, wallet_address, network, icon_url, is_enabled, min_deposit } = body

    if (!name || !symbol || !network) {
      console.log('[Creation] Missing fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: cryptoOption, error } = await supabase
      .from('crypto_options')
      .insert({
        name,
        symbol: symbol.toUpperCase(),
        wallet_address,
        network,
        icon_url: icon_url || null,
        is_enabled: is_enabled ?? true,
        min_deposit: min_deposit || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[Creation] DB Error:', error)
      throw error
    }

    return NextResponse.json(cryptoOption)
  } catch (error) {
    console.error('Error creating crypto option:', error)
    return NextResponse.json({ error: 'Failed to create crypto option', details: String(error) }, { status: 500 })
  }
}
