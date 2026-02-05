import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET enabled banners (public)
export async function GET() {
  try {
    const supabase = await createClient()

    // RLS policy allows anyone to view enabled banners
    const { data: banners, error } = await supabase
      .from('promo_banners')
      .select('*')
      .eq('is_enabled', true)
      .order('display_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(banners)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 })
  }
}
