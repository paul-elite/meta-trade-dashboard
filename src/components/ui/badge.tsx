'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-800 text-zinc-300',
      success: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      danger: 'bg-red-500/10 text-red-500 border-red-500/20',
      info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
