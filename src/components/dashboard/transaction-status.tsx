'use client'

import { useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

interface TransactionStatusProps {
    isOpen: boolean
    status: 'success' | 'failed'
    type: 'deposit' | 'withdraw' | 'mining'
    amount: number
    message?: string
    onClose: () => void
    onRetry?: () => void
}

export function TransactionStatus({
    isOpen,
    status,
    type,
    amount,
    message,
    onClose,
    onRetry,
}: TransactionStatusProps) {
    const fireConfetti = useCallback(() => {
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
        }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            // Create confetti from both sides
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#EAB308', '#F59E0B', '#22C55E', '#10B981', '#FBBF24'],
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#EAB308', '#F59E0B', '#22C55E', '#10B981', '#FBBF24'],
            })
        }, 250)

        // Also fire special burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#EAB308', '#F59E0B', '#22C55E', '#10B981'],
            zIndex: 9999,
        })
    }, [])

    useEffect(() => {
        if (isOpen && status === 'success') {
            // Small delay for the modal to render
            const timer = setTimeout(() => {
                fireConfetti()
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [isOpen, status, fireConfetti])

    if (!isOpen) return null

    const typeLabels = {
        deposit: 'Deposit',
        withdraw: 'Withdrawal',
        mining: 'Mining Request',
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 duration-300">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Status Header */}
                    <div className={`p-8 ${status === 'success'
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10'
                        : 'bg-gradient-to-br from-red-500/20 to-rose-500/10'
                        }`}>
                        <div className="flex flex-col items-center text-center">
                            {/* Animated Icon */}
                            <div className={`relative mb-6 ${status === 'success' ? 'animate-bounce' : 'animate-pulse'}`}>
                                <div className={`absolute inset-0 rounded-full blur-2xl ${status === 'success' ? 'bg-green-500/30' : 'bg-red-500/30'
                                    }`} />
                                <div className={`relative h-24 w-24 rounded-full flex items-center justify-center ${status === 'success'
                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                                        : 'bg-gradient-to-br from-red-400 to-rose-500'
                                    }`}>
                                    {status === 'success' ? (
                                        <CheckCircle2 className="h-12 w-12 text-white" />
                                    ) : (
                                        <XCircle className="h-12 w-12 text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className={`text-2xl font-bold mb-2 ${status === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {status === 'success' ? 'Transaction Successful!' : 'Transaction Failed'}
                            </h2>

                            {/* Subtitle */}
                            <p className="text-zinc-400">
                                {status === 'success'
                                    ? `Your ${typeLabels[type].toLowerCase()} has been processed`
                                    : `We couldn't process your ${typeLabels[type].toLowerCase()}`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8 space-y-6">
                        {/* Amount Display */}
                        <div className="bg-zinc-800/50 rounded-2xl p-6 text-center">
                            <p className="text-sm text-zinc-400 mb-2">{typeLabels[type]} Amount</p>
                            <p className={`text-4xl font-bold ${status === 'success' ? 'text-white' : 'text-zinc-500'
                                }`}>
                                {formatCurrency(amount)}
                            </p>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`p-4 rounded-xl text-sm ${status === 'success'
                                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Success Details */}
                        {status === 'success' && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">Status</span>
                                    <span className="flex items-center gap-2 text-green-400">
                                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                        Confirmed
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-400">Time</span>
                                    <span className="text-white">{new Date().toLocaleTimeString()}</span>
                                </div>
                                {type === 'withdraw' && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-400">Processing</span>
                                        <span className="text-yellow-500">24-48 hours</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4">
                            {status === 'success' ? (
                                <>
                                    <Link href="/dashboard" className="w-full">
                                        <Button variant="primary" className="w-full" leftIcon={<Home className="h-4 w-4" />}>
                                            Back to Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/transactions" className="w-full">
                                        <Button variant="secondary" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                            View Transactions
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {onRetry && (
                                        <Button
                                            variant="primary"
                                            className="w-full"
                                            onClick={onRetry}
                                            leftIcon={<RotateCcw className="h-4 w-4" />}
                                        >
                                            Try Again
                                        </Button>
                                    )}
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={onClose}
                                    >
                                        Close
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
