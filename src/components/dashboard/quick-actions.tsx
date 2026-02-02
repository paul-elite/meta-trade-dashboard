'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Pickaxe,
  QrCode,
} from 'lucide-react'

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Deposit */}
          <Link
            href="/deposit"
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors bg-yellow-500/10 hover:bg-yellow-500/20"
          >
            <ArrowDownToLine className="h-6 w-6 text-yellow-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Deposit</p>
              <p className="text-xs text-zinc-400">Add funds</p>
            </div>
          </Link>

          {/* Withdraw */}
          <Link
            href="/withdraw"
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors bg-red-500/10 hover:bg-red-500/20"
          >
            <ArrowUpFromLine className="h-6 w-6 text-red-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Withdrawal</p>
              <p className="text-xs text-zinc-400">Cash out</p>
            </div>
          </Link>

          {/* Mining */}
          <Link
            href="/mining"
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors bg-green-500/10 hover:bg-green-500/20"
          >
            <Pickaxe className="h-6 w-6 text-green-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Mining</p>
              <p className="text-xs text-zinc-400">View stats</p>
            </div>
          </Link>

          {/* Receive Money */}
          <Link
            href="/deposit"
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-colors bg-purple-500/10 hover:bg-purple-500/20"
          >
            <QrCode className="h-6 w-6 text-purple-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Receive</p>
              <p className="text-xs text-zinc-400">Get address</p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
