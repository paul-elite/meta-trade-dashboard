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

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-zinc-300">Trusted by 10,000+ miners worldwide</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Mine Bitcoin with
              <span className="text-yellow-500"> Confidence</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 mb-10">
              The most secure and intuitive platform for Bitcoin Mining and Ethereum.
              Advanced tools, real-time analytics, and 24/7 support to help you succeed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 lg:mb-0">
              <Link href="/signup">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Start Mining
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Desktop */}
            <div className="hidden lg:flex flex-wrap items-center gap-8 mt-12">
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

          {/* 3D Coin Animation */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />

              {/* Rotating Container */}
              <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                {/* Bitcoin Coin */}
                <div
                  className="relative w-48 h-48 md:w-64 md:h-64"
                  style={{
                    animation: 'spin3d 8s linear infinite',
                  }}
                >
                  {/* Coin Face */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/30 flex items-center justify-center border-4 border-yellow-300/30">
                    {/* Bitcoin Symbol */}
                    <span className="text-6xl md:text-8xl font-bold text-yellow-900/80">₿</span>
                  </div>

                  {/* Coin Edge Effect */}
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-600/40" style={{ transform: 'rotateY(10deg)' }} />

                  {/* Shine Effect */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                    }}
                  />
                </div>

                {/* Orbiting Elements */}
                <div
                  className="absolute w-full h-full"
                  style={{ animation: 'orbit 12s linear infinite' }}
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center border-2 border-blue-300/30">
                    <span className="text-xs font-bold text-white">Ξ</span>
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-yellow-500/60"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Mobile */}
        <div className="flex lg:hidden flex-wrap items-center justify-center gap-6 mt-12">
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin3d {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
