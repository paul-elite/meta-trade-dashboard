'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  description?: string
  showBack?: boolean
  backHref?: string
}

export function AdminHeader({ title, description, showBack, backHref }: AdminHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h1>
            {description && (
              <p className="mt-0.5 text-sm text-zinc-400 truncate max-w-xs md:max-w-md">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
