'use client'

import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setProfile, setWallet, setTransactions, setIsLoading } = useStore()
  const supabase = createClient()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const fetchUserData = useCallback(async () => {
    try {
      // Use server-side API to fetch user data (bypasses RLS issues)
      const response = await fetch('/api/user/me')

      if (response.ok) {
        const data = await response.json()

        if (data.profile) setProfile(data.profile)
        if (data.wallet) setWallet(data.wallet)
        if (data.transactions) setTransactions(data.transactions)
      } else {
        console.error('Failed to fetch user data:', response.status)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }, [setProfile, setWallet, setTransactions])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return

    // Create a channel for real-time updates
    const channel = supabase
      .channel(`user-${user.id}-updates`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Wallet updated:', payload)
          // Fetch fresh data when wallet changes
          fetchUserData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New transaction:', payload)
          // Fetch fresh data when new transaction is added
          fetchUserData()
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [user?.id, supabase, fetchUserData])

  // Initial auth setup
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        await fetchUserData()
      }

      setIsLoading(false)
    }

    initAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          fetchUserData()
        } else {
          setUser(null)
          setProfile(null)
          setWallet(null)
          setTransactions([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, setUser, setProfile, setWallet, setTransactions, setIsLoading, fetchUserData])

  return <>{children}</>
}
