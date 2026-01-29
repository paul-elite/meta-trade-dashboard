'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User } from 'lucide-react'

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
            Create account
          </h1>
          <p className="text-[#888] mt-3 text-lg">
            Start your journey with MetaTrade
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-7">
          {error && (
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm text-[#888] mb-3 ml-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666]">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-2xl pl-14 pr-6 py-5 text-white text-lg placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
          </div>

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
                placeholder="Create a password"
                required
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-2xl pl-14 pr-6 py-5 text-white text-lg placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-[#888] mb-3 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#666]">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full bg-[#252525] border border-[#2a2a2a] rounded-2xl pl-14 pr-6 py-5 text-white text-lg placeholder:text-[#555] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-4 pt-2">
            <input
              type="checkbox"
              required
              className="mt-1.5 h-5 w-5 rounded border-[#2a2a2a] bg-[#252525] text-white focus:ring-0 focus:ring-offset-0"
            />
            <label className="text-base text-[#888]">
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
            className="w-full bg-[#f5f5f5] hover:bg-white text-[#1a1a1a] font-semibold text-lg py-5 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#666] mt-12 text-base">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
