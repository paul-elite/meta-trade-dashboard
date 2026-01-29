
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
    console.log('Ensure you have a .env.local file with these values.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function promoteToAdmin(email: string) {
    console.log(`Attempting to promote user with email: ${email}`)

    // 1. Get user ID from auth.users (requires service role)
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
        console.error('Error listing users:', userError)
        return
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
        console.error(`No user found with email: ${email}`)
        return
    }

    console.log(`Found user: ${user.id}`)

    // 2. Update profiles table
    const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id)
        .select()

    if (error) {
        console.error('Error updating profile:', error)
        return
    }

    console.log('Successfully promoted user to admin:', data)
}

const email = process.argv[2]

if (!email) {
    console.log('Usage: npx tsx scripts/promote-admin.ts <email>')
    process.exit(1)
}

promoteToAdmin(email)
