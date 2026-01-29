import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// PUT update crypto option
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
    const { name, symbol, wallet_address, network, icon_url, is_enabled, min_deposit } = body

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name
    if (symbol !== undefined) updateData.symbol = symbol.toUpperCase()
    if (wallet_address !== undefined) updateData.wallet_address = wallet_address
    if (network !== undefined) updateData.network = network
    if (icon_url !== undefined) updateData.icon_url = icon_url
    if (is_enabled !== undefined) updateData.is_enabled = is_enabled
    if (min_deposit !== undefined) updateData.min_deposit = min_deposit

    const { data: cryptoOption, error } = await supabase
      .from('crypto_options')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Update] DB Error:', error)
      throw error
    }

    return NextResponse.json(cryptoOption)
  } catch (error) {
    console.error('Error updating crypto option:', error)
    return NextResponse.json({
      error: 'Failed to update crypto option',
      details: error instanceof Error ? error.message : JSON.stringify(error)
    }, { status: 500 })
  }
}

// DELETE crypto option
export async function DELETE(
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

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('crypto_options')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting crypto option:', error)
    return NextResponse.json({ error: 'Failed to delete crypto option' }, { status: 500 })
  }
}
