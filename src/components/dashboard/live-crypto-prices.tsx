'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CoinPrice {
    id: string
    symbol: string
    name: string
    current_price: number
    price_change_percentage_24h: number
    image: string
}

export function LiveCryptoPrices() {
    const [coins, setCoins] = useState<CoinPrice[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [animate, setAnimate] = useState<{ [key: string]: 'up' | 'down' | null }>({})

    const fetchPrices = useCallback(async () => {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum&order=market_cap_desc&per_page=2&page=1&sparkline=false'
            )

            if (!response.ok) return

            const data: CoinPrice[] = await response.json()

            // Determine price direction for animation
            if (coins.length > 0) {
                const newAnimate: { [key: string]: 'up' | 'down' | null } = {}
                data.forEach(coin => {
                    const oldCoin = coins.find(c => c.id === coin.id)
                    if (oldCoin) {
                        if (coin.current_price > oldCoin.current_price) {
                            newAnimate[coin.id] = 'up'
                        } else if (coin.current_price < oldCoin.current_price) {
                            newAnimate[coin.id] = 'down'
                        }
                    }
                })
                setAnimate(newAnimate)

                // Clear animation after 1 second
                setTimeout(() => setAnimate({}), 1000)
            }

            setCoins(data)
            setIsLoading(false)
        } catch (err) {
            console.error('Error fetching prices:', err)
        }
    }, [coins])

    useEffect(() => {
        fetchPrices()
        // Refresh every 10 seconds for more live feel
        const interval = setInterval(fetchPrices, 10000)
        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price)
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                    <Card key={i} className="p-4 bg-zinc-900/30 border-zinc-800 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-800" />
                            <div className="flex-1">
                                <div className="h-4 w-16 bg-zinc-800 rounded mb-2" />
                                <div className="h-6 w-24 bg-zinc-800 rounded" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {coins.map((coin) => {
                const isPositive = coin.price_change_percentage_24h >= 0
                const animationClass = animate[coin.id] === 'up'
                    ? 'animate-pulse ring-2 ring-green-500/50'
                    : animate[coin.id] === 'down'
                        ? 'animate-pulse ring-2 ring-red-500/50'
                        : ''

                return (
                    <Card
                        key={coin.id}
                        className={`p-4 bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 transition-all ${animationClass}`}
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={coin.image}
                                alt={coin.name}
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-zinc-400 uppercase">
                                        {coin.symbol}
                                    </span>
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {isPositive ? (
                                            <TrendingUp className="h-3 w-3" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3" />
                                        )}
                                        {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                                    </div>
                                </div>
                                <p className={`text-lg font-bold text-white transition-colors ${animate[coin.id] === 'up' ? 'text-green-400' :
                                        animate[coin.id] === 'down' ? 'text-red-400' : ''
                                    }`}>
                                    {formatPrice(coin.current_price)}
                                </p>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
