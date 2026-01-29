'use client'

import { useEffect, useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Check, X, Loader2, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react'

interface TransactionWithUser {
    id: string
    user_id: string
    type: 'deposit' | 'withdraw' | 'transfer' | 'admin_credit' | 'admin_debit'
    amount: number
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
    description: string | null
    reference: string | null
    created_at: string
    profiles: {
        id: string
        email: string
        full_name: string | null
    }
}

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    cancelled: 'default',
}

const typeIcons = {
    deposit: ArrowDownToLine,
    withdraw: ArrowUpFromLine,
    transfer: RefreshCw,
    admin_credit: ArrowDownToLine,
    admin_debit: ArrowUpFromLine,
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<TransactionWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/admin/transactions')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setTransactions(data)
        } catch (err) {
            console.error(err)
            setError('Failed to load transactions')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: 'completed' | 'failed') => {
        setProcessingId(id)
        setError('')

        try {
            const res = await fetch(`/api/admin/transactions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to update')
            }

            // Refresh the list
            await fetchTransactions()
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : 'Failed to update transaction')
        } finally {
            setProcessingId(null)
        }
    }

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'all') return true
        return t.status === filter
    })

    const pendingCount = transactions.filter(t => t.status === 'pending').length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <AdminHeader
                title="Transaction Management"
                description={`${pendingCount} pending transaction${pendingCount !== 1 ? 's' : ''} require attention`}
            />

            <div className="p-4 lg:p-8 space-y-4 lg:space-y-6">
                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {(['all', 'pending', 'completed', 'failed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f
                                ? 'bg-yellow-500 text-black'
                                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                        >
                            {f}
                            {f === 'pending' && pendingCount > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Mobile Card View */}
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredTransactions.length === 0 ? (
                        <div className="col-span-full p-8 text-center text-zinc-500">
                            No transactions found
                        </div>
                    ) : (
                        filteredTransactions.map((tx) => {
                            const Icon = typeIcons[tx.type] || RefreshCw
                            const isProcessing = processingId === tx.id

                            return (
                                <Card key={tx.id} className="bg-zinc-900/50 border-zinc-800 p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${tx.type === 'deposit' || tx.type === 'admin_credit'
                                                ? 'bg-green-500/10'
                                                : 'bg-red-500/10'
                                                }`}>
                                                <Icon className={`h-4 w-4 ${tx.type === 'deposit' || tx.type === 'admin_credit'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white text-sm">
                                                    {tx.profiles?.full_name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-zinc-500 capitalize">{tx.type.replace('_', ' ')}</p>
                                            </div>
                                        </div>
                                        <Badge variant={statusVariants[tx.status]} className="text-xs">
                                            {tx.status}
                                        </Badge>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className={`text-lg font-bold ${tx.type === 'deposit' || tx.type === 'admin_credit'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                }`}>
                                                {tx.type === 'deposit' || tx.type === 'admin_credit' ? '+' : '-'}
                                                {formatCurrency(tx.amount)}
                                            </p>
                                            <p className="text-xs text-zinc-500">{formatDate(tx.created_at)}</p>
                                        </div>

                                        {tx.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateStatus(tx.id, 'completed')}
                                                    disabled={isProcessing}
                                                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 px-3"
                                                >
                                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateStatus(tx.id, 'failed')}
                                                    disabled={isProcessing}
                                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0 px-3"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })
                    )}
                </div>

                {/* Desktop Table View */}
                <Card className="hidden lg:block bg-zinc-900/50 border-zinc-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider text-left">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((tx) => {
                                        const Icon = typeIcons[tx.type] || RefreshCw
                                        const isProcessing = processingId === tx.id

                                        return (
                                            <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-white">
                                                            {tx.profiles?.full_name || 'Unknown'}
                                                        </p>
                                                        <p className="text-xs text-zinc-500">{tx.profiles?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`h-4 w-4 ${tx.type === 'deposit' || tx.type === 'admin_credit'
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                            }`} />
                                                        <span className="text-zinc-300 capitalize">{tx.type.replace('_', ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`font-medium ${tx.type === 'deposit' || tx.type === 'admin_credit'
                                                        ? 'text-green-500'
                                                        : 'text-red-500'
                                                        }`}>
                                                        {tx.type === 'deposit' || tx.type === 'admin_credit' ? '+' : '-'}
                                                        {formatCurrency(tx.amount)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={statusVariants[tx.status]}>
                                                        {tx.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-zinc-400 text-sm">
                                                    {formatDate(tx.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {tx.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdateStatus(tx.id, 'completed')}
                                                                    disabled={isProcessing}
                                                                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0"
                                                                >
                                                                    {isProcessing ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <Check className="h-4 w-4" />
                                                                    )}
                                                                    <span className="ml-1">Approve</span>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleUpdateStatus(tx.id, 'failed')}
                                                                    disabled={isProcessing}
                                                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                    <span className="ml-1">Reject</span>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
