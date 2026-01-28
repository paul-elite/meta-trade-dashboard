'use client'

import { Header } from '@/components/dashboard/header'
import { WalletCard } from '@/components/dashboard/wallet-card'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { TransactionList } from '@/components/dashboard/transaction-list'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { BalanceChart } from '@/components/dashboard/balance-chart'
import { useStore } from '@/store/useStore'

export default function DashboardPage() {
  const { transactions, isLoading } = useStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <Header title="Dashboard" description="Welcome back! Here's your wallet overview." />

      <div className="p-4 lg:p-8 space-y-6">
        {/* Wallet and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WalletCard />
          </div>
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Chart and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BalanceChart />
          <TransactionList transactions={transactions} limit={5} />
        </div>
      </div>
    </div>
  )
}
