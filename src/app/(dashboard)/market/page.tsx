'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard/header'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, BarChart3, Clock, Activity } from 'lucide-react'

interface CoinData {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    market_cap: number
    market_cap_rank: number
    fully_diluted_valuation: number
    total_volume: number
    high_24h: number
    low_24h: number
    price_change_24h: number
    price_change_percentage_24h: number
    market_cap_change_24h: number
    market_cap_change_percentage_24h: number
    circulating_supply: number
    total_supply: number
    max_supply: number | null
    ath: number
    ath_change_percentage: number
    ath_date: string
    atl: number
    atl_change_percentage: number
    atl_date: string
    last_updated: string
}

export default function MarketPage() {
    const [coins, setCoins] = useState<CoinData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchMarketData = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false&price_change_percentage=24h'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch market data')
            }

            const data = await response.json()
            setCoins(data)
            setLastUpdated(new Date())
            setError('')
        } catch (err) {
            console.error('Error fetching market data:', err)
            setError('Unable to load market data. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchMarketData()
        // Refresh every 60 seconds
        const interval = setInterval(fetchMarketData, 60000)
        return () => clearInterval(interval)
    }, [])

    const formatNumber = (num: number, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(num)
    }

    const formatLargeNumber = (num: number) => {
        if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
        return `$${formatNumber(num)}`
    }

    const formatSupply = (num: number, symbol: string) => {
        if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M ${symbol}`
        if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K ${symbol}`
        return `${formatNumber(num, 0)} ${symbol}`
    }

    if (isLoading && coins.length === 0) {
        return (
            <div className="h-full flex flex-col">
                <Header title="Live Market" description="Real-time BTC & ETH market data" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-yellow-500 mx-auto mb-4" />
                        <p className="text-zinc-400">Loading market data...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <Header title="Live Market" description="Real-time BTC & ETH market data" />

            <div className="flex-1 p-4 lg:p-8 space-y-6 overflow-auto">
                {/* Last Updated & Refresh */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Clock className="h-4 w-4" />
                        {lastUpdated && (
                            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                        )}
                    </div>
                    <button
                        onClick={fetchMarketData}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Coin Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {coins.map((coin) => (
                        <Card key={coin.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                            {/* Header with price */}
                            <div className="p-6 border-b border-zinc-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <img src={coin.image} alt={coin.name} className="h-12 w-12 rounded-full" />
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{coin.name}</h3>
                                            <p className="text-sm text-zinc-400 uppercase">{coin.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">
                                            ${formatNumber(coin.current_price, coin.current_price > 100 ? 2 : 4)}
                                        </p>
                                        <div className={`flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                            {coin.price_change_percentage_24h >= 0 ? (
                                                <TrendingUp className="h-4 w-4" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4" />
                                            )}
                                            <span className="font-medium">
                                                {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                                {formatNumber(coin.price_change_percentage_24h)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 24h Range */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                        <span>24h Low: ${formatNumber(coin.low_24h, coin.low_24h > 100 ? 2 : 4)}</span>
                                        <span>24h High: ${formatNumber(coin.high_24h, coin.high_24h > 100 ? 2 : 4)}</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                            style={{
                                                width: `${((coin.current_price - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Market Cap */}
                                    <div className="bg-zinc-800/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                            <DollarSign className="h-4 w-4" />
                                            <span className="text-xs">Market Cap</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            {formatLargeNumber(coin.market_cap)}
                                        </p>
                                        <p className={`text-xs ${coin.market_cap_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {coin.market_cap_change_percentage_24h >= 0 ? '+' : ''}
                                            {formatNumber(coin.market_cap_change_percentage_24h)}%
                                        </p>
                                    </div>

                                    {/* 24h Volume */}
                                    <div className="bg-zinc-800/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                            <BarChart3 className="h-4 w-4" />
                                            <span className="text-xs">24h Volume</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            {formatLargeNumber(coin.total_volume)}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {formatNumber((coin.total_volume / coin.market_cap) * 100)}% of MCap
                                        </p>
                                    </div>

                                    {/* Circulating Supply */}
                                    <div className="bg-zinc-800/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                            <Activity className="h-4 w-4" />
                                            <span className="text-xs">Circulating Supply</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            {formatSupply(coin.circulating_supply, coin.symbol.toUpperCase())}
                                        </p>
                                        {coin.max_supply && (
                                            <div className="mt-2">
                                                <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-500"
                                                        style={{
                                                            width: `${(coin.circulating_supply / coin.max_supply) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    {formatNumber((coin.circulating_supply / coin.max_supply) * 100)}% of max supply
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* All-Time High */}
                                    <div className="bg-zinc-800/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-zinc-400 mb-1">
                                            <TrendingUp className="h-4 w-4" />
                                            <span className="text-xs">All-Time High</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            ${formatNumber(coin.ath, coin.ath > 100 ? 2 : 4)}
                                        </p>
                                        <p className="text-xs text-red-500">
                                            {formatNumber(coin.ath_change_percentage)}% from ATH
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Stats */}
                                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-400 mb-1">Rank</p>
                                        <p className="text-lg font-bold text-yellow-500">#{coin.market_cap_rank}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-400 mb-1">24h Change</p>
                                        <p className={`text-lg font-bold ${coin.price_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {coin.price_change_24h >= 0 ? '+' : ''}${formatNumber(Math.abs(coin.price_change_24h), 2)}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-400 mb-1">FDV</p>
                                        <p className="text-lg font-bold text-white">
                                            {formatLargeNumber(coin.fully_diluted_valuation || coin.market_cap)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Market Summary */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Market Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">Total Market Cap</p>
                                <p className="text-xl font-bold text-white">
                                    {formatLargeNumber(coins.reduce((sum, c) => sum + c.market_cap, 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">Total 24h Volume</p>
                                <p className="text-xl font-bold text-white">
                                    {formatLargeNumber(coins.reduce((sum, c) => sum + c.total_volume, 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">BTC Dominance</p>
                                <p className="text-xl font-bold text-yellow-500">
                                    {coins.length >= 2 ?
                                        formatNumber((coins[0].market_cap / (coins[0].market_cap + coins[1].market_cap)) * 100)
                                        : '0'}%
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-zinc-400 mb-1">ETH/BTC Ratio</p>
                                <p className="text-xl font-bold text-blue-400">
                                    {coins.length >= 2 ?
                                        formatNumber(coins[1].current_price / coins[0].current_price, 4)
                                        : '0'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
