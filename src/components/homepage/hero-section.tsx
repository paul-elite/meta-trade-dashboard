'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-zinc-300">Trusted by 10,000+ traders worldwide</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Trade Crypto with
          <span className="text-yellow-500"> Confidence</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          The most secure and intuitive platform for cryptocurrency trading.
          Advanced tools, real-time analytics, and 24/7 support to help you succeed.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Start Trading
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="flex items-center gap-2 text-zinc-400">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm">Bank-grade Security</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-sm">Instant Transactions</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Real-time Analytics</span>
          </div>
        </div>
      </div>
    </section>
  )
}
