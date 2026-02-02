import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface SiteSettings {
    id?: string
    phone_number: string
    email: string
    support_hours: string
    address: string
    created_at?: string
    updated_at?: string
}

// Create raw admin client without types for custom tables
function createRawAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase admin credentials')
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

// GET settings (public)
export async function GET() {
    const defaultSettings: SiteSettings = {
        phone_number: '+1 (555) 123-4567',
        email: 'infobitcapmining@gmail.com',
        support_hours: '24/7',
        address: '',
    }

    try {
        const supabase = createRawAdminClient()

        const { data: settings, error } = await supabase
            .from('site_settings')
            .select('*')
            .limit(1)
            .maybeSingle()

        if (error) {
            console.error('Error fetching settings:', error)
            return NextResponse.json(defaultSettings)
        }

        return NextResponse.json(settings || defaultSettings)
    } catch (error) {
        console.error('Error in GET settings:', error)
        return NextResponse.json(defaultSettings)
    }
}

// PUT/UPDATE settings (admin only)
export async function PUT(request: Request) {
    try {
        const supabase = await createServerClient()
        const adminClient = createRawAdminClient()

        // Verify admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: profile } = await adminClient
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { phone_number, email, support_hours, address } = body

        // Check if settings exist
        const { data: existing } = await adminClient
            .from('site_settings')
            .select('id')
            .limit(1)
            .maybeSingle()

        let result
        if (existing) {
            // Update existing
            result = await adminClient
                .from('site_settings')
                .update({
                    phone_number,
                    email,
                    support_hours,
                    address,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id)
                .select()
                .single()
        } else {
            // Insert new
            result = await adminClient
                .from('site_settings')
                .insert({
                    phone_number,
                    email,
                    support_hours,
                    address,
                })
                .select()
                .single()
        }

        if (result.error) {
            console.error('Error updating settings:', result.error)
            return NextResponse.json({ error: result.error.message }, { status: 500 })
        }

        return NextResponse.json(result.data)
    } catch (error) {
        console.error('Error in PUT settings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
