'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Coin {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    market_cap: number
    market_cap_rank: number
    price_change_percentage_24h: number
}

export function MarketTable() {
    const [coins, setCoins] = useState<Coin[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMarketData()
    }, [])

    const fetchMarketData = async () => {
        try {
            // Fetch top 20 coins
            // Note: Coingecko free API has rate limits, be careful with reloads
            const res = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false&locale=en'
            )

            if (!res.ok) throw new Error('Failed to fetch market data')

            const data = await res.json()
            setCoins(data)
        } catch (err) {
            console.warn(err)
            setError('Unable to load market data. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
                {error}
            </div>
        )
    }

    return (
        <Card className="bg-zinc-900/30 border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider text-left">
                            <th className="px-6 py-4">Asset</th>
                            <th className="px-6 py-4 text-right">Price</th>
                            <th className="px-6 py-4 text-right">24h Change</th>
                            <th className="px-6 py-4 text-right hidden md:table-cell">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {coins.map((coin) => (
                            <tr key={coin.id} className="hover:bg-zinc-900/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <span className="text-zinc-500 w-4 text-sm">{coin.market_cap_rank}</span>
                                        <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
                                        <div>
                                            <p className="font-medium text-white">{coin.name}</p>
                                            <p className="text-xs text-zinc-500 uppercase">{coin.symbol}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-white whitespace-nowrap">
                                    {formatCurrency(coin.current_price)}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <div className={`flex items-center justify-end gap-1 ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {coin.price_change_percentage_24h >= 0 ? (
                                            <ArrowUp className="h-3 w-3" />
                                        ) : (
                                            <ArrowDown className="h-3 w-3" />
                                        )}
                                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right text-zinc-400 whitespace-nowrap hidden md:table-cell">
                                    ${(coin.market_cap / 1e9).toFixed(2)}B
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}
