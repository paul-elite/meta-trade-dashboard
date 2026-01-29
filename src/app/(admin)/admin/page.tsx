'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Wallet, TrendingUp, Activity } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface Stats {
  totalUsers: number
  totalBalance: number
  totalTransactions: number
  recentTransactions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBalance: 0,
    totalTransactions: 0,
    recentTransactions: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Fetch total balance across all wallets
        const { data: wallets } = await supabase
          .from('wallets')
          .select('balance')

        const totalBalance = wallets?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0

        // Fetch total transactions
        const { count: txCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })

        // Fetch recent transactions (last 24 hours)
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const { count: recentCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday)

        setStats({
          totalUsers: userCount || 0,
          totalBalance,
          totalTransactions: txCount || 0,
          recentTransactions: recentCount || 0
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Balance',
      value: formatCurrency(stats.totalBalance, 'USD'),
      icon: Wallet,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Recent (24h)',
      value: stats.recentTransactions.toString(),
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ]

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Admin Dashboard"
        description="Overview of platform statistics"
      />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {isLoading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-white">Manage Users</p>
                  <p className="text-sm text-zinc-400">View and manage all users</p>
                </div>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Wallet className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium text-white">Credit/Debit Wallets</p>
                  <p className="text-sm text-zinc-400">Adjust user balances</p>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium text-white">User Dashboard</p>
                  <p className="text-sm text-zinc-400">Return to user view</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
