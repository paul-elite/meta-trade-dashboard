'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { Plus, Minus } from 'lucide-react'

interface WalletActionsProps {
  userId: string
  currentBalance: number
  onSuccess: (newBalance: number) => void
}

export function WalletActions({ userId, currentBalance, onSuccess }: WalletActionsProps) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [actionType, setActionType] = useState<'credit' | 'debit'>('credit')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = () => {
    setError('')

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!description.trim()) {
      setError('Please enter a reason/description')
      return
    }

    if (actionType === 'debit' && numAmount > currentBalance) {
      setError('Debit amount exceeds current balance')
      return
    }

    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: parseFloat(amount),
          type: actionType,
          description: description.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request')
      }

      setSuccess(data.message)
      setAmount('')
      setDescription('')
      onSuccess(data.newBalance)

      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wallet Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setActionType('credit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                actionType === 'credit'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Plus className="h-4 w-4" />
              Credit
            </button>
            <button
              onClick={() => setActionType('debit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                actionType === 'debit'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Minus className="h-4 w-4" />
              Debit
            </button>
          </div>

          {/* Amount Input */}
          <Input
            type="number"
            label="Amount ($)"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />

          {/* Description Input */}
          <Input
            label="Reason / Description"
            placeholder="Enter reason for this action"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Error/Success Messages */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-500">{success}</p>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            variant={actionType === 'credit' ? 'primary' : 'danger'}
            className="w-full"
            isLoading={isLoading}
          >
            {actionType === 'credit' ? 'Credit Wallet' : 'Debit Wallet'}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Action"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to{' '}
            <span className={actionType === 'credit' ? 'text-emerald-500' : 'text-red-500'}>
              {actionType}
            </span>{' '}
            <span className="font-bold text-white">${parseFloat(amount || '0').toFixed(2)}</span>{' '}
            {actionType === 'credit' ? 'to' : 'from'} this user's wallet?
          </p>
          <p className="text-sm text-slate-400">
            Reason: {description}
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'credit' ? 'primary' : 'danger'}
              onClick={handleConfirm}
              isLoading={isLoading}
              className="flex-1"
            >
              Confirm {actionType === 'credit' ? 'Credit' : 'Debit'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
