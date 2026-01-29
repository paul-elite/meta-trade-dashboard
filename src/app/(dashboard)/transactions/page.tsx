'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatCurrency, formatDate, getTransactionTypeColor } from '@/lib/utils'
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, Search, Filter, Plus, Minus } from 'lucide-react'
import { useStore } from '@/store/useStore'

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
  cancelled: 'default',
}

const typeIcons = {
  deposit: ArrowDownToLine,
  withdraw: ArrowUpFromLine,
  transfer: RefreshCw,
  admin_credit: Plus,
  admin_debit: Minus,
}

export default function TransactionsPage() {
  const { transactions } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-full">
      <Header title="Transactions" description="View your transaction history" />

      <div className="p-6 lg:p-12 space-y-8">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-1">
                <Input
                  placeholder="Search by reference or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-8">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'deposit', label: 'Deposits' },
                    { value: 'withdraw', label: 'Withdrawals' },
                    { value: 'transfer', label: 'Transfers' },
                  ]}
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'failed', label: 'Failed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Transaction History
              <span className="ml-2 text-sm font-normal text-zinc-400">
                ({filteredTransactions.length} transactions)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50 mx-auto mb-3">
                  <RefreshCw className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-zinc-400">No transactions found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Your transaction history will appear here'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="pb-3 text-left text-sm font-medium text-zinc-400">Type</th>
                      <th className="pb-3 text-left text-sm font-medium text-zinc-400">Description</th>
                      <th className="pb-3 text-left text-sm font-medium text-zinc-400">Reference</th>
                      <th className="pb-3 text-left text-sm font-medium text-zinc-400">Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-zinc-400">Status</th>
                      <th className="pb-3 text-right text-sm font-medium text-zinc-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => {
                      const Icon = typeIcons[transaction.type]
                      return (
                        <tr
                          key={transaction.id}
                          className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                transaction.type === 'deposit' ? 'bg-yellow-500/10' :
                                transaction.type === 'withdraw' ? 'bg-red-500/10' : 'bg-blue-500/10'
                              }`}>
                                <Icon className={`h-4 w-4 ${getTransactionTypeColor(transaction.type)}`} />
                              </div>
                              <span className="text-sm font-medium text-zinc-100 capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-zinc-300">
                            {transaction.description || '-'}
                          </td>
                          <td className="py-4">
                            <code className="text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded">
                              {transaction.reference || '-'}
                            </code>
                          </td>
                          <td className="py-4 text-sm text-zinc-400">
                            {formatDate(transaction.created_at)}
                          </td>
                          <td className="py-4">
                            <Badge variant={statusVariants[transaction.status]}>
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <span className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                              {transaction.type === 'withdraw' ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
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
