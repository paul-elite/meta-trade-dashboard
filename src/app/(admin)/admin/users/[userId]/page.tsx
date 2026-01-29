'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { WalletActions } from '@/components/admin/wallet-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserWithWallet, Transaction } from '@/types/database'
import { formatCurrency, formatDate, getStatusColor, getTransactionTypeColor } from '@/lib/utils'
import { ArrowLeft, Mail, User, Calendar, Wallet } from 'lucide-react'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string

  const [user, setUser] = useState<UserWithWallet | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    fetchUserDetails() // Refresh transactions
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

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="User Details"
        description={user.email}
      />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/users')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Users
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-white text-2xl font-bold">
                  {user.full_name?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="flex-1 space-y-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <User className="h-4 w-4" />
                      <span>ID: {user.id.slice(0, 12)}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Wallet className="h-4 w-4" />
                      <span className="text-white font-semibold">
                        {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
                      </span>
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
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transactions.length === 0 ? (
              <p className="text-center py-8 text-zinc-400">No transactions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400 uppercase">
                        Amount
                      </th>
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
                        <td className="px-4 py-3 text-sm text-zinc-300">
                          {tx.description || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-400">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-medium ${
                          tx.type.includes('credit') || tx.type === 'deposit'
                            ? 'text-yellow-500'
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
