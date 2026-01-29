'use client'

import { useRouter } from 'next/navigation'
import { UserWithWallet } from '@/types/database'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface UserTableProps {
  users: UserWithWallet[]
  isLoading?: boolean
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No users found
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-800/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {users.map((user) => {
            const wallet = user.wallets?.[0]
            return (
              <tr
                key={user.id}
                onClick={() => router.push(`/admin/users/${user.id}`)}
                className="hover:bg-zinc-900/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white font-semibold">
                      {user.full_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-xs text-zinc-400">ID: {user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-300">
                  {user.email}
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-white">
                    {wallet ? formatCurrency(wallet.balance, wallet.currency) : '$0.00'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {user.is_admin ? (
                    <Badge variant="danger">Admin</Badge>
                  ) : (
                    <Badge variant="success">User</Badge>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-zinc-400">
                  {formatDate(user.created_at)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
