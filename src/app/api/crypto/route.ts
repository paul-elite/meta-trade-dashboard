import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET enabled crypto options (public)
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: cryptoOptions, error } = await supabase
      .from('crypto_options')
      .select('id, name, symbol, wallet_address, network, icon_url, min_deposit')
      .eq('is_enabled', true)
      .order('name', { ascending: true })

    if (error) throw error

    return NextResponse.json(cryptoOptions)
  } catch (error) {
    console.error('Error fetching crypto options:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto options' }, { status: 500 })
  }
}
