'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { formatCurrency, generateReference } from '@/lib/utils'
import { Building2, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'

const withdrawMethods = [
  { id: 'bank', name: 'Bank Transfer', icon: Building2, description: '1-3 business days' },
  { id: 'card', name: 'Debit Card', icon: CreditCard, description: 'Instant' },
]

export function WithdrawForm() {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('bank')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
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

    if (selectedMethod === 'bank' && (!bankName || !accountNumber || !accountName)) {
      setError('Please fill in all bank details')
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
          status: selectedMethod === 'card' ? 'completed' : 'pending',
          description: `Withdrawal to ${selectedMethod === 'bank' ? bankName : 'Debit Card'}`,
          reference: generateReference(),
        })
        .select()
        .single()

      if (txError) throw txError

      // Update wallet balance
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
      setBankName('')
      setAccountNumber('')
      setAccountName('')

      // Reset success after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Withdraw error:', err)
      setError('Failed to process withdrawal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">
              Withdrawal {selectedMethod === 'card' ? 'Successful' : 'Submitted'}!
            </h3>
            <p className="text-zinc-400">
              {selectedMethod === 'card'
                ? 'Your funds have been sent to your card.'
                : 'Your withdrawal is being processed and will arrive in 1-3 business days.'}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-zinc-100">
                {formatCurrency(maxWithdraw)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount(maxWithdraw.toString())}
            >
              Withdraw All
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>Transfer money to your bank or card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Amount Input */}
          <div>
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError('')
              }}
              leftIcon={<span className="text-zinc-400 font-medium">$</span>}
              error={error}
            />
            {parseFloat(amount) > maxWithdraw && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                Insufficient balance
              </div>
            )}
          </div>

          {/* Withdraw Method */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Withdraw To
            </label>
            <div className="grid grid-cols-1 gap-3">
              {withdrawMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    selectedMethod === method.id
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-zinc-700 hover:border-slate-500 hover:bg-zinc-900'
                  }`}
                >
                  <method.icon className={`h-5 w-5 ${
                    selectedMethod === method.id ? 'text-yellow-500' : 'text-zinc-400'
                  }`} />
                  <div className="flex-1 text-left">
                    <span className={`font-medium block ${
                      selectedMethod === method.id ? 'text-yellow-500' : 'text-zinc-300'
                    }`}>
                      {method.name}
                    </span>
                    <span className="text-xs text-slate-500">{method.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bank Details (shown when bank is selected) */}
          {selectedMethod === 'bank' && (
            <div className="space-y-4 pt-2">
              <Input
                label="Bank Name"
                placeholder="Enter your bank name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
              <Input
                label="Account Number"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
              <Input
                label="Account Name"
                placeholder="Enter account holder name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleWithdraw}
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxWithdraw}
          >
            Withdraw ${amount || '0.00'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
