import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, fullName } = body

        // Validation
        if (!email || !password || !fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        const adminClient = createAdminClient()

        // Create user in auth
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                full_name: fullName,
            },
        })

        if (authError) {
            console.error('Auth error:', authError)
            return NextResponse.json({ error: authError.message }, { status: 400 })
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }

        const userId = authData.user.id

        // Create or update profile (upsert in case a trigger already created it)
        const { error: profileError } = await adminClient
            .from('profiles')
            .upsert({
                id: userId,
                email,
                full_name: fullName,
            }, {
                onConflict: 'id'
            })

        if (profileError) {
            console.error('Profile error:', profileError)
            // Don't delete the user - profile might have been created by trigger
            // Just log the error and continue
            console.warn('Could not upsert profile, continuing anyway...')
        }

        // Create wallet with 0 balance
        const { error: walletError } = await adminClient
            .from('wallets')
            .insert({
                user_id: userId,
                balance: 0,
                currency: 'USD',
            })

        if (walletError) {
            console.error('Wallet error:', walletError)
            // Continue anyway - wallet will be created when needed
        }

        console.log(`Created new user ${email} with wallet`)

        return NextResponse.json({
            success: true,
            user: {
                id: userId,
                email,
                full_name: fullName,
            }
        })
    } catch (err: unknown) {
        const error = err as Error
        console.error('Signup API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
