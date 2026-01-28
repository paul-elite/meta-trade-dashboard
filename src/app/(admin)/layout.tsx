'use client'

import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AuthProvider } from '@/components/providers/auth-provider'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-slate-900">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
