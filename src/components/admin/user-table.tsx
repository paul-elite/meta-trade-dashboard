'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserWithWallet } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Plus, Minus, Mail, Wallet, Send, CheckCircle2, XCircle, DollarSign, User, Clock } from 'lucide-react'

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

  // Email modal state
  const [emailUser, setEmailUser] = useState<UserWithWallet | null>(null)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
        <p>No users found</p>
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

  const openEmailModal = (user: UserWithWallet) => {
    setEmailUser(user)
    setEmailSubject('')
    setEmailBody('')
    setEmailError('')
    setEmailSuccess(false)
  }

  const closeEmailModal = () => {
    setEmailUser(null)
    setEmailSubject('')
    setEmailBody('')
    setEmailError('')
    setEmailSuccess(false)
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

    // Show loading toast
    const loadingToast = toast.loading(
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
          <DollarSign className="h-4 w-4 text-yellow-500" />
        </div>
        <div>
          <p className="font-medium">Processing {actionType}...</p>
          <p className="text-xs text-zinc-400">
            {actionType === 'credit' ? 'Adding' : 'Removing'} {formatCurrency(numAmount)} {actionType === 'credit' ? 'to' : 'from'} wallet
          </p>
        </div>
      </div>
    )

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

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success(
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-green-400">
              {actionType === 'credit' ? 'Credit' : 'Debit'} Successful!
            </p>
            <div className="text-xs text-zinc-400 space-y-1 mt-1">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{selectedUser?.full_name || selectedUser?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3" />
                <span>
                  {actionType === 'credit' ? '+' : '-'}{formatCurrency(numAmount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-3 w-3" />
                <span>New balance: {formatCurrency(data.newBalance)}</span>
              </div>
            </div>
          </div>
        </div>,
        { duration: 5000 }
      )

      closeModal()
      // Refresh data from server to get accurate balances
      onRefresh?.()
    } catch (err: unknown) {
      const error = err as Error
      toast.dismiss(loadingToast)
      toast.error(
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-red-400">Transaction Failed</p>
            <p className="text-xs text-zinc-400 mt-1">{error.message}</p>
          </div>
        </div>,
        { duration: 5000 }
      )
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendEmail = async () => {
    setEmailError('')

    if (!emailSubject.trim()) {
      setEmailError('Please enter a subject')
      return
    }

    if (!emailBody.trim()) {
      setEmailError('Please enter a message')
      return
    }

    setIsEmailSending(true)

    // Show loading toast
    const loadingToast = toast.loading(
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Mail className="h-4 w-4 text-blue-500" />
        </div>
        <div>
          <p className="font-medium">Sending email...</p>
          <p className="text-xs text-zinc-400">To: {emailUser?.email}</p>
        </div>
      </div>
    )

    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailUser?.email,
          subject: emailSubject.trim(),
          body: emailBody.trim(),
          userName: emailUser?.full_name || emailUser?.email
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast)
      toast.success(
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-green-400">Email Sent!</p>
            <div className="text-xs text-zinc-400 space-y-1 mt-1">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{emailUser?.full_name || emailUser?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{emailSubject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>,
        { duration: 5000 }
      )

      setEmailSuccess(true)
    } catch (err: unknown) {
      const error = err as Error
      toast.dismiss(loadingToast)
      toast.error(
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-red-400">Email Failed</p>
            <p className="text-xs text-zinc-400 mt-1">{error.message}</p>
          </div>
        </div>,
        { duration: 5000 }
      )
      setEmailError(error.message)
    } finally {
      setIsEmailSending(false)
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
              <div
                className="flex items-start justify-between gap-4 cursor-pointer"
                onClick={() => router.push(`/admin/users/${user.id}`)}
              >
                {/* User Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white font-semibold text-lg">
                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate hover:text-yellow-500 transition-colors">
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
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
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
                  leftIcon={<Mail className="h-4 w-4" />}
                  onClick={() => openEmailModal(user)}
                >
                  Email
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Credit/Debit Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={closeModal}
        title={`${actionType === 'credit' ? 'Credit' : 'Debit'} Wallet`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-sm text-zinc-400">User</p>
            <p className="text-white font-medium">{selectedUser?.full_name || selectedUser?.email}</p>
            <p className="text-sm text-zinc-400 mt-2">Current Balance</p>
            <p className="text-white font-medium">
              {formatCurrency(selectedUser?.wallets?.[0]?.balance || 0)}
            </p>
          </div>

          <Input
            type="number"
            label="Amount ($)"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />

          <Input
            label="Reason"
            placeholder="Enter reason for this action"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

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
              {actionType === 'credit' ? 'Credit' : 'Debit'} Wallet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Email Modal */}
      <Modal
        isOpen={!!emailUser}
        onClose={closeEmailModal}
        title="Send Email"
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-sm text-zinc-400">Sending to</p>
            <p className="text-white font-medium">{emailUser?.full_name || emailUser?.email}</p>
            <p className="text-sm text-zinc-400">{emailUser?.email}</p>
          </div>

          {emailSuccess ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-400 font-medium">Email Sent Successfully!</p>
            </div>
          ) : (
            <>
              <Input
                label="Subject"
                placeholder="Enter email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 min-h-[120px] resize-none"
                  placeholder="Enter your message..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                />
              </div>

              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={closeEmailModal} className="flex-1">
              {emailSuccess ? 'Close' : 'Cancel'}
            </Button>
            {!emailSuccess && (
              <Button
                variant="primary"
                onClick={handleSendEmail}
                isLoading={isEmailSending}
                leftIcon={<Send className="h-4 w-4" />}
                className="flex-1"
              >
                Send Email
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}
