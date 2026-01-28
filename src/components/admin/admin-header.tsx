'use client'

interface AdminHeaderProps {
  title: string
  description?: string
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>
    </div>
  )
}
