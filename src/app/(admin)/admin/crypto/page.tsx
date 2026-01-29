'use client'

import { useState, useEffect } from 'react'
import { Pencil, Check, X, Loader2, RefreshCcw } from 'lucide-react'
import type { CryptoOption } from '@/types/database'

const DEFAULT_OPTIONS = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin',
    icon_url: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029',
    min_deposit: 50,
    wallet_address: '', // To be filled by admin
    is_enabled: true
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Ethereum (ERC20)',
    icon_url: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=029',
    min_deposit: 50,
    wallet_address: '',
    is_enabled: true
  }
]

export default function AdminCryptoPage() {
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state only needs wallet address and status now
  const [editForm, setEditForm] = useState({
    wallet_address: '',
    is_enabled: true,
  })

  useEffect(() => {
    fetchCryptoOptions()
  }, [])

  const fetchCryptoOptions = async () => {
    try {
      const res = await fetch('/api/admin/crypto')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setCryptoOptions(data)
    } catch {
      setError('Failed to load crypto options')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitializeDefaults = async () => {
    setSaving(true)
    setError('')
    try {
      // For each default option, check if it exists (by symbol)
      // If not, create it
      for (const def of DEFAULT_OPTIONS) {
        const exists = cryptoOptions.find(c => c.symbol === def.symbol)
        if (!exists) {
          await fetch('/api/admin/crypto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(def),
          })
        }
      }
      await fetchCryptoOptions()
    } catch (err) {
      console.error(err)
      setError('Failed to initialize defaults')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (crypto: CryptoOption) => {
    setEditingId(crypto.id)
    setEditForm({
      wallet_address: crypto.wallet_address,
      is_enabled: crypto.is_enabled,
    })
  }

  const handleUpdate = async (id: string) => {
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/crypto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) throw new Error('Failed to update')

      const updated = await res.json()
      setCryptoOptions(cryptoOptions.map(c => c.id === id ? updated : c))
      setEditingId(null)
    } catch {
      setError('Failed to update crypto option')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleEnabled = async (crypto: CryptoOption) => {
    try {
      const res = await fetch(`/api/admin/crypto/${crypto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: !crypto.is_enabled }),
      })

      if (!res.ok) throw new Error('Failed to update')

      const updated = await res.json()
      setCryptoOptions(cryptoOptions.map(c => c.id === crypto.id ? updated : c))
    } catch {
      setError('Failed to update status')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  const missingDefaults = DEFAULT_OPTIONS.filter(d => !cryptoOptions.find(c => c.symbol === d.symbol))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Crypto Payment Options</h1>
          <p className="text-zinc-400 mt-1">Manage wallet addresses for user deposits</p>
        </div>
        {missingDefaults.length > 0 && (
          <button
            onClick={handleInitializeDefaults}
            disabled={saving}
            className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-xl font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
            Reset / Initialize Defaults
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Crypto List */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4">Crypto</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4 hidden md:table-cell">Wallet Address</th>
              <th className="text-left text-sm font-medium text-zinc-400 px-6 py-4 hidden sm:table-cell">Network</th>
              <th className="text-center text-sm font-medium text-zinc-400 px-6 py-4">Status</th>
              <th className="text-right text-sm font-medium text-zinc-400 px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cryptoOptions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-zinc-500 py-12">
                  No payment options configured. Click &quot;Initialize Defaults&quot; above.
                </td>
              </tr>
            ) : (
              cryptoOptions.map((crypto) => (
                <tr key={crypto.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors">
                  {editingId === crypto.id ? (
                    // Edit mode
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 opacity-50">
                          {crypto.icon_url && (
                            <img src={crypto.icon_url} alt={crypto.name} className="h-8 w-8 rounded-full" />
                          )}
                          <div>
                            <p className="font-medium text-white">{crypto.name}</p>
                            <p className="text-sm text-zinc-500">{crypto.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <input
                          type="text"
                          value={editForm.wallet_address}
                          onChange={(e) => setEditForm({ ...editForm, wallet_address: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-yellow-500/50"
                          placeholder="Paste wallet address here"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="text-sm text-zinc-500">{crypto.network}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={editForm.is_enabled}
                          onChange={(e) => setEditForm({ ...editForm, is_enabled: e.target.checked })}
                          className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 accent-yellow-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdate(crypto.id)}
                            disabled={saving}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                          >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {crypto.icon_url && (
                            <img
                              src={crypto.icon_url}
                              alt={crypto.name}
                              className="h-8 w-8 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium text-white">{crypto.name}</p>
                            <p className="text-sm text-zinc-500">{crypto.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm text-zinc-400 font-mono truncate max-w-xs cursor-pointer hover:text-white transition-colors" title={crypto.wallet_address}>
                          {crypto.wallet_address || <span className="text-yellow-500/50 italic">Set address</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="text-sm text-zinc-400">{crypto.network}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleEnabled(crypto)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${crypto.is_enabled
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                              : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                            }`}
                        >
                          {crypto.is_enabled ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(crypto)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
