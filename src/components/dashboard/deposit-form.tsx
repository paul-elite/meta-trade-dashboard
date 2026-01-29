'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import { generateReference } from '@/lib/utils'
import { CreditCard, Building2, Smartphone, CheckCircle2 } from 'lucide-react'

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'bank', name: 'Bank Transfer', icon: Building2 },
  { id: 'mobile', name: 'Mobile Money', icon: Smartphone },
]

const quickAmounts = [100, 250, 500, 1000, 2500, 5000]

export function DepositForm() {
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const { user, wallet, setWallet, addTransaction } = useStore()
  const supabase = createClient()

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!user || !wallet) {
      setError('Please log in to continue')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const depositAmount = parseFloat(amount)

      // Create transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: depositAmount,
          status: 'completed',
          description: `Deposit via ${selectedMethod}`,
          reference: generateReference(),
        })
        .select()
        .single()

      if (txError) throw txError

      // Update wallet balance
      const newBalance = wallet.balance + depositAmount
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

      // Reset success after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Deposit error:', err)
      setError('Failed to process deposit. Please try again.')
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
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Deposit Successful!</h3>
            <p className="text-zinc-400">Your funds have been added to your wallet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>Add money to your wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div>
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              leftIcon={<span className="text-zinc-400 font-medium">$</span>}
              error={error}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-slate-500 transition-colors"
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-1 gap-3">
              {paymentMethods.map((method) => (
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
                  <span className={`font-medium ${
                    selectedMethod === method.id ? 'text-yellow-500' : 'text-zinc-300'
                  }`}>
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details (shown when card is selected) */}
          {selectedMethod === 'card' && (
            <div className="space-y-4 pt-2">
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                />
                <Input
                  label="CVV"
                  placeholder="123"
                  type="password"
                />
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleDeposit}
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Deposit ${amount || '0.00'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
