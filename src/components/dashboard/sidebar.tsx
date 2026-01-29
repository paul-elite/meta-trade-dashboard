'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Deposit', href: '/deposit', icon: ArrowDownToLine },
  { name: 'Withdraw', href: '/withdraw', icon: ArrowUpFromLine },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, toggleSidebar, profile } = useStore()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-zinc-900 p-2 text-zinc-300 hover:bg-zinc-800"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform bg-zinc-950 border-r border-zinc-800/50 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
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
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) toggleSidebar()
                  }}
                  className={cn(
                    'flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}

            {/* Admin Link - Only shown for admins */}
            {profile?.is_admin && (
              <Link
                href="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar()
                }}
                className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-6 border-t border-zinc-800/50 pt-6"
              >
                <Shield className="h-5 w-5" />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* User section */}
          <div className="border-t border-zinc-800/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 font-medium">
                {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
