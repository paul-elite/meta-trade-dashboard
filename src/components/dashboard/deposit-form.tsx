'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { generateReference } from '@/lib/utils'
import { CheckCircle2, Copy, Check, Loader2, Wallet, AlertCircle } from 'lucide-react'
import type { CryptoOption } from '@/types/database'

export function DepositForm() {
  const [amount, setAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null)
  const [cryptoOptions, setCryptoOptions] = useState<CryptoOption[]>([])
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { user, addTransaction } = useStore()
  const supabase = createClient()

  useEffect(() => {
    fetchCryptoOptions()
  }, [])

  const fetchCryptoOptions = async () => {
    try {
      // Fetch enabled crypto options
      const { data, error } = await supabase
        .from('crypto_options')
        .select('*')
        .eq('is_enabled', true)
        .order('name')

      if (error) throw error
      setCryptoOptions(data || [])
      if (data && data.length > 0) {
        setSelectedCrypto(data[0])
      }
    } catch (err) {
      console.error('Error fetching crypto options:', err)
      setError('Failed to load deposit options')
    } finally {
      setIsLoadingCrypto(false)
    }
  }

  const handleCopyAddress = () => {
    if (!selectedCrypto) return
    navigator.clipboard.writeText(selectedCrypto.wallet_address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!selectedCrypto) {
      setError('Please select a payment method')
      return
    }

    if (!user) {
      setError('Please log in to continue')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const depositAmount = parseFloat(amount)

      // Check min deposit
      if (selectedCrypto.min_deposit && depositAmount < selectedCrypto.min_deposit) {
        throw new Error(`Minimum deposit is $${selectedCrypto.min_deposit}`)
      }

      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending', // Pending admin approval
          description: `Deposit via ${selectedCrypto.symbol} (${selectedCrypto.network})`,
          reference: generateReference(),
        })
        .select()
        .single()

      if (txError) throw txError

      // Don't update wallet balance immediately for crypto deposits
      // It will be updated when admin approves

      addTransaction(transaction)
      setSuccess(true)
      setAmount('')

      // Reset success after user acknowledges or 5 seconds
      // setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Deposit error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process deposit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Deposit Request Submitted!</h3>
            <p className="text-zinc-400 mb-6">
              Your deposit is being processed. Your balance will be updated once the transaction is confirmed on the network.
            </p>
            <Button
              onClick={() => setSuccess(false)}
              className="bg-zinc-800 text-white hover:bg-zinc-700"
            >
              Make Another Deposit
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoadingCrypto) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (cryptoOptions.length === 0) {
    return (
      <Card className="max-w-lg mx-auto bg-zinc-900/50 border-zinc-800">
        <CardContent className="py-12 text-center">
          <Wallet className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Deposit Methods Available</h3>
          <p className="text-zinc-400">Please contact support or try again later.</p>
        </CardContent>
      </Card>
    )
  }


  return (
    <div className="max-w-lg mx-auto space-y-8">
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Deposit Funds</CardTitle>
          <CardDescription className="text-zinc-400">Send crypto to the address below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Method Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-300">
              Select Cryptocurrency
            </label>
            <div className="grid grid-cols-2 gap-3">
              {cryptoOptions.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${selectedCrypto?.id === crypto.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                >
                  {crypto.icon_url ? (
                    <img src={crypto.icon_url} alt={crypto.name} className="h-8 w-8" />
                  ) : (
                    <Wallet className={`h-8 w-8 ${selectedCrypto?.id === crypto.id ? 'text-yellow-500' : 'text-zinc-500'}`} />
                  )}
                  <div className="text-center">
                    <span className={`block font-medium ${selectedCrypto?.id === crypto.id ? 'text-yellow-500' : 'text-zinc-300'}`}>
                      {crypto.symbol}
                    </span>
                    <span className="text-xs text-zinc-500">{crypto.network}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedCrypto && (
            <>
              {/* Wallet Address Display */}
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    Deposit Address ({selectedCrypto.network})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <code className="flex-1 text-sm text-zinc-300 break-all font-mono bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    {selectedCrypto.wallet_address}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyAddress}
                    className="shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800 h-10 w-10 p-0 rounded-lg border border-zinc-800"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
                <p className="text-xs text-yellow-500/80 flex items-center gap-1.5 pt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  Only send {selectedCrypto.name} ({selectedCrypto.network}) to this address.
                </p>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <Input
                  label="Amount Sent (USD equivalent)"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-yellow-500/50 focus:ring-yellow-500/20 text-lg py-6"
                />
                {selectedCrypto.min_deposit > 0 && (
                  <p className="text-xs text-zinc-500">
                    Minimum deposit: ${selectedCrypto.min_deposit}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-lg py-6 rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all"
                size="lg"
                onClick={handleDeposit}
                isLoading={isSubmitting}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                I Have Sent the Payment
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
