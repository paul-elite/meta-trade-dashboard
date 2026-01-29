'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          email,
          full_name: fullName,
        })

        await supabase.from('wallets').insert({
          user_id: authData.user.id,
          balance: 0,
          currency: 'USD',
        })
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: unknown) {
      const authError = error as { message?: string }
      setError(authError.message || 'Failed to create account')
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
            Create account
          </h1>
          <p className="text-[#888] mt-2 sm:mt-3 text-base sm:text-lg">
            Start your journey with MetaTrade
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm text-[#888] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full bg-[#252525] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>

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
              placeholder="Create a password"
              required
              className="w-full bg-[#252525] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#888] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full bg-[#252525] border border-[#2a2a2a] rounded-xl px-4 py-4 text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-[#2a2a2a] bg-[#252525] text-white focus:ring-0 focus:ring-offset-0"
            />
            <label className="text-sm text-[#888]">
              I agree to the{' '}
              <Link href="#" className="text-white hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f5f5f5] hover:bg-white text-[#1a1a1a] font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#666] mt-8 sm:mt-10 text-sm sm:text-base">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
