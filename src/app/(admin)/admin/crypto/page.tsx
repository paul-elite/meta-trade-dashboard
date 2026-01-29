'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import type { CryptoOption } from '@/types/database'

export default function AdminCryptoPage() {
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    wallet_address: '',
    network: '',
    icon_url: '',
    min_deposit: '0',
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

  const resetForm = () => {
    setFormData({
      name: '',
      symbol: '',
      wallet_address: '',
      network: '',
      icon_url: '',
      min_deposit: '0',
      is_enabled: true,
    })
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.symbol || !formData.wallet_address || !formData.network) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          min_deposit: parseFloat(formData.min_deposit) || 0,
        }),
      })

      if (!res.ok) throw new Error('Failed to create')

      const newOption = await res.json()
      setCryptoOptions([...cryptoOptions, newOption])
      setShowAddForm(false)
      resetForm()
    } catch {
      setError('Failed to create crypto option')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (crypto: CryptoOption) => {
    setEditingId(crypto.id)
    setFormData({
      name: crypto.name,
      symbol: crypto.symbol,
      wallet_address: crypto.wallet_address,
      network: crypto.network,
      icon_url: crypto.icon_url || '',
      min_deposit: crypto.min_deposit.toString(),
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
        body: JSON.stringify({
          ...formData,
          min_deposit: parseFloat(formData.min_deposit) || 0,
        }),
      })

      if (!res.ok) throw new Error('Failed to update')

      const updated = await res.json()
      setCryptoOptions(cryptoOptions.map(c => c.id === id ? updated : c))
      setEditingId(null)
      resetForm()
    } catch {
      setError('Failed to update crypto option')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this crypto option?')) return

    try {
      const res = await fetch(`/api/admin/crypto/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      setCryptoOptions(cryptoOptions.filter(c => c.id !== id))
    } catch {
      setError('Failed to delete crypto option')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Crypto Options</h1>
          <p className="text-zinc-400 mt-1">Manage deposit payment methods</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            resetForm()
          }}
          className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-xl font-medium hover:bg-zinc-100 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Crypto
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Add New Crypto Option</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Bitcoin"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Symbol *</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="BTC"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Wallet Address *</label>
              <input
                type="text"
                value={formData.wallet_address}
                onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                placeholder="Your deposit wallet address"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Network *</label>
              <input
                type="text"
                value={formData.network}
                onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                placeholder="Bitcoin Network"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Min Deposit</label>
              <input
                type="number"
                step="any"
                value={formData.min_deposit}
                onChange={(e) => setFormData({ ...formData, min_deposit: e.target.value })}
                placeholder="0.0001"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-2">Icon URL</label>
              <input
                type="text"
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="https://example.com/icon.png"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="is_enabled"
                checked={formData.is_enabled}
                onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800"
              />
              <label htmlFor="is_enabled" className="text-sm text-zinc-300">
                Enabled (visible to users)
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-xl font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save
            </button>
          </div>
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
                  No crypto options yet. Add one to get started.
                </td>
              </tr>
            ) : (
              cryptoOptions.map((crypto) => (
                <tr key={crypto.id} className="border-b border-zinc-800/50 last:border-0">
                  {editingId === crypto.id ? (
                    // Edit mode
                    <>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={formData.symbol}
                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                            placeholder="Symbol"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <input
                          type="text"
                          value={formData.wallet_address}
                          onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none"
                          placeholder="Wallet Address"
                        />
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <input
                          type="text"
                          value={formData.network}
                          onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                          placeholder="Network"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={formData.is_enabled}
                          onChange={(e) => setFormData({ ...formData, is_enabled: e.target.checked })}
                          className="h-4 w-4 rounded border-zinc-700 bg-zinc-800"
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
                            onClick={() => {
                              setEditingId(null)
                              resetForm()
                            }}
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
                        <p className="text-sm text-zinc-400 font-mono truncate max-w-xs">
                          {crypto.wallet_address || <span className="text-zinc-600">Not set</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="text-sm text-zinc-400">{crypto.network}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleEnabled(crypto)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            crypto.is_enabled
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
                          <button
                            onClick={() => handleDelete(crypto.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
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
