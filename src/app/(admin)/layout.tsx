'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Menu } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { createBrowserClient } from '@supabase/ssr'

function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
    }

    checkAdmin()
  }, [router, supabase])

  if (isAdmin === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="flex h-screen bg-zinc-950">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block h-full">
            <AdminSidebar />
          </div>

          {/* Mobile Sidebar & Main Content */}
          <main className="flex-1 overflow-auto flex flex-col h-full">
            <MobileHeader />
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </AdminGuard>
    </AuthProvider>
  )
}

function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-40">
      <div className="font-semibold text-white">Admin Dashboard</div>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-zinc-400 hover:text-white"
      >
        <Menu className="h-6 w-6" />
      </button>

      <Sheet isOpen={isOpen} onClose={() => setIsOpen(false)} side="left" className="p-0 border-r border-zinc-800">
        <AdminSidebar onClose={() => setIsOpen(false)} />
      </Sheet>
    </div>
  )
}
