'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  QrCode,
  CreditCard,
  Building2,
} from 'lucide-react'

const actions = [
  {
    name: 'Deposit',
    description: 'Add funds to wallet',
    href: '/deposit',
    icon: ArrowDownToLine,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10 hover:bg-yellow-500/20',
  },
  {
    name: 'Withdraw',
    description: 'Cash out funds',
    href: '/withdraw',
    icon: ArrowUpFromLine,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 hover:bg-red-500/20',
  },
  {
    name: 'Send',
    description: 'Transfer to others',
    href: '#',
    icon: Send,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  {
    name: 'Receive',
    description: 'Get your QR code',
    href: '#',
    icon: QrCode,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10 hover:bg-purple-500/20',
  },
  
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 grid-rows-2 sm:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${action.bgColor}`}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-100">{action.name}</p>
                <p className="text-xs text-zinc-400">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
