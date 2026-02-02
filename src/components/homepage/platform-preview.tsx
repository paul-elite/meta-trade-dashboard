'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface CryptoPrice {
  price: number
  change24h: number
}

export function PlatformPreview() {
  const [btcData, setBtcData] = useState<CryptoPrice>({ price: 0, change24h: 0 })
  const [ethData, setEthData] = useState<CryptoPrice>({ price: 0, change24h: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
        )
        const data = await response.json()

        setBtcData({
          price: data.bitcoin.usd,
          change24h: data.bitcoin.usd_24h_change
        })
        setEthData({
          price: data.ethereum.usd,
          change24h: data.ethereum.usd_24h_change
        })
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error)
        // Fallback to static values on error
        setBtcData({ price: 67234, change24h: 3.4 })
        setEthData({ price: 3456, change24h: -1.2 })
        setLoading(false)
      }
    }

    fetchPrices()
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
  }

  return (
    <section id="platform" className="py-24 px-4 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Mining Dashboard
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Monitor your portfolio, track market trends, and manage your mining
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
                </div>
                <span className="text-white font-semibold">Bitcap Mining Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            {/* Stats Grid - Only BTC and ETH with live prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white">₿</span>
                  BTC
                </div>
                <p className="text-2xl font-bold text-white">
                  {loading ? '...' : formatPrice(btcData.price)}
                </p>
                <div className={`flex items-center gap-1 text-sm mt-1 ${btcData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {btcData.change24h >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {loading ? '...' : formatChange(btcData.change24h)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">Ξ</span>
                  ETH
                </div>
                <p className="text-2xl font-bold text-white">
                  {loading ? '...' : formatPrice(ethData.price)}
                </p>
                <div className={`flex items-center gap-1 text-sm mt-1 ${ethData.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ethData.change24h >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {loading ? '...' : formatChange(ethData.change24h)}
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
