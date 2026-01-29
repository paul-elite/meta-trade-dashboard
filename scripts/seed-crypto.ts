
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const defaultOptions = [
    {
        name: 'Bitcoin',
        symbol: 'BTC',
        wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Example address
        network: 'Bitcoin',
        icon_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029',
        min_deposit: 50,
        is_enabled: true
    },
    {
        name: 'Ethereum',
        symbol: 'ETH',
        wallet_address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // Example address
        network: 'Ethereum (ERC20)',
        icon_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
        min_deposit: 50,
        is_enabled: true
    }
]

async function seedCrypto() {
    console.log('Seeding crypto options...')

    // Delete existing options to ensure clean slate (optional, but requested "just btc and eth")
    // For safety, let's just upsert based on symbol

    for (const option of defaultOptions) {
        const { data: existing } = await supabase
            .from('crypto_options')
            .select('id')
            .eq('symbol', option.symbol)
            .single()

        if (existing) {
            console.log(`Updating ${option.name}...`)
            await supabase
                .from('crypto_options')
                .update(option)
                .eq('id', existing.id)
        } else {
            console.log(`Creating ${option.name}...`)
            await supabase
                .from('crypto_options')
                .insert(option)
        }
    }

    // Optional: Disable or delete others? 
    // For now, we'll just ensure these two exist.

    console.log('Done!')
}

seedCrypto()
