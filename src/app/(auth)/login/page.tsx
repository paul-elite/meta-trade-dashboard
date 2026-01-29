'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      const authError = error as { message?: string }
      setError(authError.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg">
      <div className="bg-[#1a1a1a] rounded-2xl sm:rounded-3xl px-6 py-10 sm:px-12 sm:py-14">
        {/* Logo */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <Image
            src="/logo.png"
            alt="Logo"
            width={56}
            height={56}
            className="h-12 sm:h-14 w-auto"
          />
        </div>

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-[#888] mt-2 sm:mt-3 text-base sm:text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-[#888] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-[#252525] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[#888] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full bg-[#252525] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f5f5f5] hover:bg-white text-[#1a1a1a] font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#666] mt-8 sm:mt-10 text-sm sm:text-base">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
