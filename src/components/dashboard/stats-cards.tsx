'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, TrendingUp } from 'lucide-react'
import { useStore } from '@/store/useStore'

export function StatsCards() {
  const { transactions } = useStore()

  const stats = {
    totalDeposits: transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions
      .filter(t => t.type === 'withdraw' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    totalTransactions: transactions.length,
  }

  const statItems = [
    {
      title: 'Total Deposits',
      value: formatCurrency(stats.totalDeposits),
      icon: ArrowDownToLine,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Withdrawals',
      value: formatCurrency(stats.totalWithdrawals),
      icon: ArrowUpFromLine,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Pending',
      value: stats.pendingTransactions.toString(),
      icon: RefreshCw,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.title} className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
