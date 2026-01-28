'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setWallet, setTransactions, setIsLoading } = useStore()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      setIsLoading(true)

      try {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profile) setProfile(profile)

        // Fetch wallet
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (wallet) setWallet(wallet)

        // Fetch transactions
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (transactions) setTransactions(transactions)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchUserData(session.user.id)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          fetchUserData(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setWallet(null)
          setTransactions([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, setUser, setProfile, setWallet, setTransactions, setIsLoading])

  return <>{children}</>
}
