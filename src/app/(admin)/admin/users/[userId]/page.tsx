'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { WalletActions } from '@/components/admin/wallet-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { UserWithWallet, Transaction } from '@/types/database'
import { formatCurrency, formatDate, getStatusColor, getTransactionTypeColor } from '@/lib/utils'
import {
  ArrowLeft,
  Mail,
  User,
  Calendar,
  Wallet,
  Trash2,
  Copy,
  Check,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string

  const [user, setUser] = useState<UserWithWallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  async function fetchUserDetails() {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletUpdate = (newBalance: number) => {
    if (user && user.wallets?.[0]) {
      setUser({
        ...user,
        wallets: [{ ...user.wallets[0], balance: newBalance }]
      })
    }
    fetchUserDetails()
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (response.ok) {
        router.push('/admin/users')
      } else {
        alert(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">User not found</p>
      </div>
    )
  }

  const wallet = user.wallets?.[0]

  // Calculate stats
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="User Details"
        description={user.email}
        showBack
        backHref="/admin/users"
      />

      <div className="p-4 md:p-8 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-end">
          {!user.is_admin && (
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete User
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Wallet className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Balance</p>
                  <p className="text-lg font-bold text-white">
                    {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Total Deposits</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(totalDeposits, 'USD')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Total Withdrawals</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(totalWithdrawals, 'USD')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Pending</p>
                  <p className="text-lg font-bold text-white">{pendingTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-white text-2xl font-bold">
                  {user.full_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {user.full_name || 'No name'}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        {user.is_admin ? (
                          <Badge variant="danger">Admin</Badge>
                        ) : (
                          <Badge variant="success">User</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    {/* Email */}
                    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="text-xs text-zinc-400">Email</p>
                          <p className="text-sm text-white">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(user.email)}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-zinc-400" />}
                      </button>
                    </div>

                    {/* User ID */}
                    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="text-xs text-zinc-400">User ID</p>
                          <p className="text-sm text-white font-mono">{user.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(user.id)}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        <Copy className="h-4 w-4 text-zinc-400" />
                      </button>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="text-xs text-zinc-400">Joined</p>
                          <p className="text-sm text-white">{formatDate(user.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <div>
                          <p className="text-xs text-zinc-400">Last Updated</p>
                          <p className="text-sm text-white">{formatDate(user.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Actions */}
          <div>
            <WalletActions
              userId={userId}
              currentBalance={wallet?.balance || 0}
              onSuccess={handleWalletUpdate}
            />
          </div>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Badge variant="default">{transactions.length} transactions</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <p className="text-center py-8 text-zinc-400">No transactions yet</p>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-zinc-800">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getTransactionTypeColor(tx.type)}>
                          {tx.type.replace('_', ' ')}
                        </Badge>
                        <span className={`text-sm font-medium ${tx.type.includes('credit') || tx.type === 'deposit'
                            ? 'text-green-500'
                            : 'text-red-500'
                          }`}>
                          {tx.type.includes('credit') || tx.type === 'deposit' ? '+' : '-'}
                          {formatCurrency(tx.amount, 'USD')}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300">{tx.description || '-'}</p>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                        <span>{formatDate(tx.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-800/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Reference</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Date</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-900/50">
                          <td className="px-4 py-3">
                            <Badge className={getTransactionTypeColor(tx.type)}>
                              {tx.type.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-300 max-w-[200px] truncate">
                            {tx.description || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-400 font-mono">
                            {tx.reference || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-zinc-400">
                            {formatDate(tx.created_at)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-medium ${tx.type.includes('credit') || tx.type === 'deposit'
                              ? 'text-green-500'
                              : 'text-red-500'
                            }`}>
                            {tx.type.includes('credit') || tx.type === 'deposit' ? '+' : '-'}
                            {formatCurrency(tx.amount, 'USD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
            <p className="text-sm text-red-200">
              This action cannot be undone. This will permanently delete the user account, wallet, and all transaction history.
            </p>
          </div>

          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-sm text-zinc-400">You are about to delete:</p>
            <p className="text-white font-medium mt-1">{user.full_name || user.email}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="flex-1"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
