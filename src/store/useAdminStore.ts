import { create } from 'zustand'
import { Profile, Wallet, Transaction, AdminAuditLog, UserWithWallet } from '@/types/database'

interface AdminState {
  users: UserWithWallet[]
  selectedUser: UserWithWallet | null
  selectedUserTransactions: Transaction[]
  auditLogs: AdminAuditLog[]
  isLoading: boolean
  usersTotal: number
  currentPage: number
  searchQuery: string

  setUsers: (users: UserWithWallet[]) => void
  setSelectedUser: (user: UserWithWallet | null) => void
  setSelectedUserTransactions: (transactions: Transaction[]) => void
  setAuditLogs: (logs: AdminAuditLog[]) => void
  setIsLoading: (loading: boolean) => void
  setUsersTotal: (total: number) => void
  setCurrentPage: (page: number) => void
  setSearchQuery: (query: string) => void
  clearSelectedUser: () => void
  updateUserWallet: (userId: string, newBalance: number) => void
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  selectedUser: null,
  selectedUserTransactions: [],
  auditLogs: [],
  isLoading: false,
  usersTotal: 0,
  currentPage: 1,
  searchQuery: '',

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedUserTransactions: (transactions) => set({ selectedUserTransactions: transactions }),
  setAuditLogs: (logs) => set({ auditLogs: logs }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setUsersTotal: (total) => set({ usersTotal: total }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSelectedUser: () => set({ selectedUser: null, selectedUserTransactions: [] }),
  updateUserWallet: (userId, newBalance) => set((state) => ({
    users: state.users.map(user =>
      user.id === userId
        ? { ...user, wallets: user.wallets.map(w => ({ ...w, balance: newBalance })) }
        : user
    ),
    selectedUser: state.selectedUser?.id === userId && state.selectedUser.wallets[0]
      ? { ...state.selectedUser, wallets: [{ ...state.selectedUser.wallets[0], balance: newBalance }] }
      : state.selectedUser
  })),
}))
