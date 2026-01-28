import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { Profile, Wallet, Transaction } from '@/types/database'

interface AppState {
  user: User | null
  profile: Profile | null
  wallet: Wallet | null
  transactions: Transaction[]
  isLoading: boolean
  sidebarOpen: boolean

  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setWallet: (wallet: Wallet | null) => void
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  setIsLoading: (isLoading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  wallet: null,
  transactions: [],
  isLoading: false,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setWallet: (wallet) => set({ wallet }),
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
