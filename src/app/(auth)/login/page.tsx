'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock } from 'lucide-react'

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
    <div className="w-full max-w-lg">
      <div className="bg-[#1a1a1a] rounded-3xl px-14 py-16 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-14">
          <Image
            src="/logo.png"
            alt="Logo"
            width={56}
            height={56}
            className="h-14 w-auto"
          />
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-[#888] mt-3 text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-8">
          {error && (
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-[#888] mb-3 ml-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666]">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-2xl pl-14 pr-6 py-5 text-white text-lg placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-[#888] mb-3 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666]">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-2xl pl-14 pr-6 py-5 text-white text-lg placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f5f5f5] hover:bg-white text-[#1a1a1a] font-semibold text-lg py-5 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#666] mt-12 text-base">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
