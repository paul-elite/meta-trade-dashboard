'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, Activity } from 'lucide-react'
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
    },
    {
      title: 'Total Withdrawals',
      value: formatCurrency(stats.totalWithdrawals),
      icon: ArrowUpFromLine,
    },
    {
      title: 'Pending Actions',
      value: stats.pendingTransactions.toString(),
      icon: RefreshCw,
    },
    {
      title: 'Total Activity',
      value: stats.totalTransactions.toString(),
      icon: Activity,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <Card key={stat.title} className="p-6 bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/50 transition-colors group">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{stat.title}</p>
              <p className="text-2xl font-bold text-white group-hover:text-yellow-500 transition-colors">{stat.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-yellow-500 group-hover:border-yellow-500/20 transition-colors">
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

