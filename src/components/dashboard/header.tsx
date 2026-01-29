'use client'

import { Bell, Search } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/utils'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  const { wallet } = useStore()

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="lg:ml-0 ml-12">
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-zinc-400">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Balance display */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2">
            <span className="text-sm text-zinc-400">Balance:</span>
            <span className="text-sm font-semibold text-yellow-500">
              {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
            </span>
          </div>

          {/* Search */}
          <button className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-yellow-500" />
          </button>
        </div>
      </div>
    </header>
  )
}
