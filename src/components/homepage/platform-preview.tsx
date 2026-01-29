'use client'

import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'

export function PlatformPreview() {
  return (
    <section id="platform" className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Trading Dashboard
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Monitor your portfolio, track market trends, and execute trades
            all from one intuitive interface.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 blur-3xl opacity-30" />

          {/* Dashboard Mockup */}
          <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                  <span className="text-black font-bold">M</span>
                </div>
                <span className="text-white font-semibold">MetaTrade Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Wallet className="h-4 w-4" />
                  Total Balance
                </div>
                <p className="text-2xl font-bold text-white">$124,582.00</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  +12.5%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <TrendingUp className="h-4 w-4" />
                  Today&apos;s Profit
                </div>
                <p className="text-2xl font-bold text-white">$2,845.00</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  +8.2%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  BTC
                </div>
                <p className="text-2xl font-bold text-white">$67,234.00</p>
                <div className="flex items-center gap-1 text-green-500 text-sm mt-1">
                  <ArrowUpRight className="h-4 w-4" />
                  +3.4%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  ETH
                </div>
                <p className="text-2xl font-bold text-white">$3,456.00</p>
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <ArrowDownRight className="h-4 w-4" />
                  -1.2%
                </div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-end gap-1 h-24">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                    <div
                      key={i}
                      className="w-4 md:w-6 bg-gradient-to-t from-yellow-500/50 to-yellow-500 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <p className="text-zinc-500 text-sm">Live Portfolio Chart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
