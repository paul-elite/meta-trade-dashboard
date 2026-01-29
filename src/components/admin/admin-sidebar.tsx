'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  LogOut,
  ArrowLeft,
  Coins,
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Crypto', href: '/admin/crypto', icon: Coins },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useStore()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex h-full w-72 flex-col bg-zinc-950 border-r border-zinc-800/50">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-zinc-800/50">
        <Image
          src="/logo.png"
          alt="BitCap"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-red-500/10 text-red-500'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Back to Dashboard */}
      <div className="border-t border-zinc-800/50 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-zinc-800/50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-500 font-semibold">
            {profile?.full_name?.[0] || profile?.email?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || 'Admin'}
            </p>
            <p className="text-xs text-zinc-400 truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
