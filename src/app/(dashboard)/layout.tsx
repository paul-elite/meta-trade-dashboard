'use client'

import { Sidebar } from '@/components/dashboard/sidebar'
import { AuthProvider } from '@/components/providers/auth-provider'
import { useStore } from '@/store/useStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen } = useStore()

  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
