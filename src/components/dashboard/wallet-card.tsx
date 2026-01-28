'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Wallet, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/store/useStore'

export function WalletCard() {
  const { wallet } = useStore()

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold text-slate-100">
              {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
            </h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
            <Wallet className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">+12.5%</span>
          </div>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/deposit">
            <Button variant="primary" className="w-full" leftIcon={<ArrowDownToLine className="h-4 w-4" />}>
              Deposit
            </Button>
          </Link>
          <Link href="/withdraw">
            <Button variant="outline" className="w-full" leftIcon={<ArrowUpFromLine className="h-4 w-4" />}>
              Withdraw
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
