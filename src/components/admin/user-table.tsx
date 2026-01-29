'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserWithWallet } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Plus, Minus, Eye, Wallet } from 'lucide-react'

interface UserTableProps {
  users: UserWithWallet[]
  isLoading?: boolean
  onRefresh?: () => void
}

export function UserTable({ users, isLoading, onRefresh }: UserTableProps) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<UserWithWallet | null>(null)
  const [actionType, setActionType] = useState<'credit' | 'debit'>('credit')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No users found
      </div>
    )
  }

  const openWalletModal = (user: UserWithWallet, type: 'credit' | 'debit') => {
    setSelectedUser(user)
    setActionType(type)
    setAmount('')
    setDescription('')
    setError('')
  }

  const closeModal = () => {
    setSelectedUser(null)
    setAmount('')
    setDescription('')
    setError('')
  }

  const handleSubmit = async () => {
    setError('')

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (!description.trim()) {
      setError('Please enter a reason')
      return
    }

    const wallet = selectedUser?.wallets?.[0]
    if (actionType === 'debit' && numAmount > (wallet?.balance || 0)) {
      setError('Amount exceeds balance')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser?.id,
          amount: numAmount,
          type: actionType,
          description: description.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process')
      }

      closeModal()
      onRefresh?.()
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {users.map((user) => {
          const wallet = user.wallets?.[0]
          return (
            <div
              key={user.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-semibold text-lg">
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.full_name || 'No name'}
                    </p>
                    <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Balance */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-zinc-400 text-xs mb-1">
                    <Wallet className="h-3 w-3" />
                    Balance
                  </div>
                  <p className="text-lg font-bold text-white">
                    {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => openWalletModal(user, 'credit')}
                >
                  Credit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  className="flex-1"
                  leftIcon={<Minus className="h-4 w-4" />}
                  onClick={() => openWalletModal(user, 'debit')}
                >
                  Debit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Eye className="h-4 w-4" />}
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Wallet Action Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={closeModal}
        title={`${actionType === 'credit' ? 'Credit' : 'Debit'} Wallet`}
      >
        {selectedUser && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white font-semibold">
                {selectedUser.full_name?.[0] || selectedUser.email[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {selectedUser.full_name || 'No name'}
                </p>
                <p className="text-xs text-zinc-400">{selectedUser.email}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-400">Current Balance</p>
                <p className="text-sm font-bold text-white">
                  {formatCurrency(selectedUser.wallets?.[0]?.balance || 0, 'USD')}
                </p>
              </div>
            </div>

            {/* Amount */}
            <Input
              type="number"
              label="Amount ($)"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />

            {/* Reason */}
            <Input
              label="Reason"
              placeholder="Enter reason for this action"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={closeModal} className="flex-1">
                Cancel
              </Button>
              <Button
                variant={actionType === 'credit' ? 'primary' : 'danger'}
                onClick={handleSubmit}
                isLoading={isSubmitting}
                className="flex-1"
              >
                {actionType === 'credit' ? 'Credit' : 'Debit'} ${amount || '0.00'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
