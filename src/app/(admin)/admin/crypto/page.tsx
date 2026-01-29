'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Wallet } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { CryptoOption } from '@/types/database'

const STATIC_OPTIONS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    icon_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029',
    min_deposit: 50,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum (ERC20)',
    icon_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
    min_deposit: 50,
  }
]

export default function AdminCryptoPage() {
  const [addresses, setAddresses] = useState<Record<string, string>>({
    BTC: '',
    ETH: '',
  })
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [dbRecords, setDbRecords] = useState<Record<string, CryptoOption>>({})
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCryptoOptions()
  }, [])

  const fetchCryptoOptions = async () => {
    try {
      const res = await fetch('/api/admin/crypto')
      // Even if fetch fails (e.g. empty), we just want to load what we can
      if (res.ok) {
        const data: CryptoOption[] = await res.json()
        const newAddresses = { ...addresses }
        const newRecords = { ...dbRecords }

        data.forEach(opt => {
          if (addresses.hasOwnProperty(opt.symbol)) {
            newAddresses[opt.symbol] = opt.wallet_address
            newRecords[opt.symbol] = opt
          }
        })
        setAddresses(newAddresses)
        setDbRecords(newRecords)
      }
    } catch (err) {
      console.warn('Could not load existing options:', err)
      // Non-blocking error, user can still input and save
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const promises = STATIC_OPTIONS.map(async (opt) => {
        const address = addresses[opt.symbol]
        const existingRecord = dbRecords[opt.symbol]

        const payload = {
          ...opt,
          wallet_address: address,
          is_enabled: true, // Always enable if we are saving it
        }

        if (existingRecord) {
          // Update
          return fetch(`/api/admin/crypto/${existingRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        } else {
          // Create
          return fetch('/api/admin/crypto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        }
      })

      const results = await Promise.all(promises)

      // Check for failures
      for (const res of results) {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          const errorMessage = typeof data.details === 'object'
            ? JSON.stringify(data.details)
            : (data.details || data.error || 'Failed to save changes')

          throw new Error(errorMessage)
        }
      }

      setSuccess('Payment methods updated successfully')

      // Refresh to get new IDs if created
      fetchCryptoOptions()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Payment Methods</h1>
        <p className="text-zinc-400 mt-1">Set the wallet addresses for user deposits.</p>
      </div>

      <div className="space-y-4">
        {STATIC_OPTIONS.map((opt) => (
          <Card key={opt.symbol} className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <img src={opt.icon_url} alt={opt.name} className="h-10 w-10 rounded-full" />
              <div>
                <CardTitle className="text-lg text-white">{opt.name}</CardTitle>
                <p className="text-sm text-zinc-500">{opt.network}</p>
              </div>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Wallet Address
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  value={addresses[opt.symbol]}
                  onChange={(e) => setAddresses(prev => ({ ...prev, [opt.symbol]: e.target.value }))}
                  placeholder={`Enter ${opt.symbol} Address`}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {success}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black px-6 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
        Save Changes
      </button>
    </div>
  )
}
