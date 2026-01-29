'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="BitCap"
            width={64}
            height={64}
            className="h-14 w-auto opacity-50"
          />
        </div>

        {/* 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-zinc-700 to-zinc-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-zinc-600/20 to-transparent leading-none blur-sm select-none">
              404
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Page not found
        </h2>
        <p className="text-zinc-500 mb-10 text-base sm:text-lg max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to another location.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-xl font-medium hover:bg-zinc-100 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white px-6 py-3 rounded-xl font-medium transition-colors w-full sm:w-auto justify-center border border-zinc-800 hover:border-zinc-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}
