'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate, getTransactionTypeColor } from '@/lib/utils'
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { Transaction } from '@/types/database'

interface TransactionListProps {
  transactions: Transaction[]
  limit?: number
  showViewAll?: boolean
}

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
}

export function TransactionList({ transactions, limit, showViewAll = true }: TransactionListProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        {showViewAll && transactions.length > 0 && (
          <Link
            href="/transactions"
            className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
          >
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {displayTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/50 mx-auto mb-3">
              <RefreshCw className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-400">No transactions yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTransactions.map((transaction) => {
              const Icon = typeIcons[transaction.type]
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      transaction.type === 'deposit' ? 'bg-emerald-500/10' :
                      transaction.type === 'withdraw' ? 'bg-red-500/10' : 'bg-blue-500/10'
                    }`}>
                      <Icon className={`h-5 w-5 ${getTransactionTypeColor(transaction.type)}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100 capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type === 'withdraw' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={statusVariants[transaction.status]} className="mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
