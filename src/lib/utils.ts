import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateReference(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-500 bg-green-500/10'
    case 'pending':
      return 'text-yellow-500 bg-yellow-500/10'
    case 'failed':
      return 'text-red-500 bg-red-500/10'
    case 'cancelled':
      return 'text-gray-500 bg-gray-500/10'
    default:
      return 'text-gray-500 bg-gray-500/10'
  }
}

export function getTransactionTypeColor(type: string): string {
  switch (type) {
    case 'deposit':
      return 'text-green-500'
    case 'withdraw':
      return 'text-red-500'
    case 'transfer':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
  }
}
