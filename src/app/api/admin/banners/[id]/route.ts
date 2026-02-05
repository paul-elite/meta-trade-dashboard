import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// PATCH update banner
export async function PATCH(
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
    const { title, link_url, display_order, is_enabled } = body

    const adminSupabase = createAdminClient()
    const { data: banner, error } = await adminSupabase
      .from('promo_banners')
      .update({
        title: title !== undefined ? title : undefined,
        link_url: link_url !== undefined ? link_url : undefined,
        display_order: display_order !== undefined ? display_order : undefined,
        is_enabled: is_enabled !== undefined ? is_enabled : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(banner)
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

// DELETE banner (removes from storage too)
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

    const adminSupabase = createAdminClient()

    // First get the banner to know the storage path
    const { data: banner, error: fetchError } = await adminSupabase
      .from('promo_banners')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Delete from storage
    if (banner?.storage_path) {
      const { error: storageError } = await adminSupabase.storage
        .from('promo-banners')
        .remove([banner.storage_path])

      if (storageError) {
        console.error('Storage delete error:', storageError)
        // Continue with DB delete even if storage delete fails
      }
    }

    // Delete from database
    const { error: deleteError } = await adminSupabase
      .from('promo_banners')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
