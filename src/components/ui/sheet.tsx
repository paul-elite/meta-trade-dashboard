'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface SheetProps {
    isOpen: boolean
    onClose: () => void
    side?: 'left' | 'right'
    children: React.ReactNode
    className?: string
}

export function Sheet({ isOpen, onClose, side = 'left', children, className }: SheetProps) {
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const slideAnimation = side === 'left'
        ? {
            enter: 'translate-x-0',
            exit: '-translate-x-full',
        }
        : {
            enter: 'translate-x-0',
            exit: 'translate-x-full',
        }

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex",
                side === 'left' ? 'justify-start' : 'justify-end',
                !isOpen && "pointer-events-none"
            )}
        >
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Sheet Content */}
            <div
                className={cn(
                    "relative z-50 h-full w-3/4 max-w-sm border-zinc-800 bg-zinc-950 p-0 shadow-2xl transition-transform duration-300 ease-out",
                    side === 'left' ? "border-r" : "border-l",
                    isOpen ? slideAnimation.enter : slideAnimation.exit,
                    className
                )}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-50 rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
                {children}
            </div>
        </div>
    )
}
