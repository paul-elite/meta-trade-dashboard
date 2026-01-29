'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { formatCurrency, generateReference } from '@/lib/utils'
import { CheckCircle2, AlertCircle, Wallet, ArrowRight } from 'lucide-react'

// Common crypto networks/coins for withdrawal
const cryptoNetworks = [
  { id: 'BTC', name: 'Bitcoin (BTC)' },
  { id: 'ETH', name: 'Ethereum (ERC20)' },
  { id: 'USDT', name: 'Tether (TRC20)' },
  { id: 'USDT_ERC20', name: 'Tether (ERC20)' },
  { id: 'LTC', name: 'Litecoin (LTC)' },
]

export function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState(cryptoNetworks[0].id)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { user, wallet, setWallet, addTransaction } = useStore()
  const supabase = createClient()

  const maxWithdraw = wallet?.balance || 0

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount)

    if (!amount || withdrawAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (withdrawAmount > maxWithdraw) {
      setError('Insufficient balance')
      return
    }

    if (!walletAddress || walletAddress.length < 10) {
      setError('Please enter a valid wallet address')
      return
    }

    if (!user || !wallet) {
      setError('Please log in to continue')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount: withdrawAmount,
          status: 'pending',
          description: `Withdrawal to ${walletAddress} (${selectedNetwork})`,
          reference: generateReference(),
        })
        .select()
        .single()

      if (txError) throw txError

      // Deduct balance immediately for withdrawals
      const newBalance = wallet.balance - withdrawAmount
      const { data: updatedWallet, error: walletError } = await supabase
        .from('wallets')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', wallet.id)
        .select()
        .single()

      if (walletError) throw walletError

      setWallet(updatedWallet)
      addTransaction(transaction)
      setSuccess(true)
      setAmount('')
      setWalletAddress('')

      // Reset success after user interaction or delay
      // setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      console.error('Withdraw error:', err)
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto bg-zinc-900/50 border-zinc-800">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Withdrawal Submitted!</h3>
            <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
              Your withdrawal request has been received and is being processed.
            </p>
            <Button
              onClick={() => setSuccess(false)}
              className="bg-zinc-800 text-white hover:bg-zinc-700 w-full sm:w-auto px-8"
              size="lg"
            >
              Back to Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-bl-full -mr-8 -mt-8" />
        <CardContent className="pt-8 pb-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-white tracking-tight">
                {formatCurrency(maxWithdraw)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAmount(maxWithdraw.toString())
                setError('')
              }}
              className="border-zinc-700 hover:bg-zinc-800 text-zinc-300 self-start sm:self-center"
            >
              Withdraw Max
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Withdraw Funds</CardTitle>
          <CardDescription className="text-zinc-400">Transfer crypto to your external wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Amount Input */}
          <div className="space-y-3">
            <Input
              label="Amount to Withdraw"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              leftIcon={<span className="text-zinc-400 font-medium">$</span>}
              error={error && error.includes('amount') || error.includes('balance') ? error : ''}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-yellow-500/50 focus:ring-yellow-500/20 text-lg py-6"
            />
          </div>

          {/* Network Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-300">
              Select Network
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cryptoNetworks.map((network) => (
                <button
                  key={network.id}
                  onClick={() => setSelectedNetwork(network.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${selectedNetwork === network.id
                      ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full ${selectedNetwork === network.id ? 'bg-yellow-500' : 'bg-zinc-600'}`} />
                  {network.name}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Address Input */}
          <div className="space-y-3">
            <Input
              label="Wallet Address"
              placeholder={`Enter your ${selectedNetwork} address`}
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value)
                setError('')
              }}
              leftIcon={<Wallet className="h-4 w-4 text-zinc-400" />}
              error={error && error.includes('address') ? error : ''}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 font-mono text-sm py-6 focus:border-yellow-500/50 focus:ring-yellow-500/20"
            />
            <p className="text-xs text-zinc-500">
              Please double-check your address. Transfers cannot be reversed.
            </p>
          </div>

          {error && !error.includes('amount') && !error.includes('balance') && !error.includes('address') && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold text-lg py-6 rounded-xl shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all"
            onClick={handleWithdraw}
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdraw || !walletAddress}
            rightIcon={<ArrowRight className="h-5 w-5 opacity-70" />}
          >
            Withdraw Funds
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
