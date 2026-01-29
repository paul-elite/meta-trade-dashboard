'use client'

import { Header } from '@/components/dashboard/header'
import { TradingViewWidget } from '@/components/dashboard/tradingview-widget'

export default function MarketPage() {
    return (
        <div className="h-full flex flex-col">
            <Header title="Live Market" description="Real-time crypto prices and market data" />

            <div className="flex-1 p-6 lg:p-12 overflow-hidden">
                <div className="h-[600px] lg:h-full w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/30">
                    <TradingViewWidget />
                </div>
            </div>
        </div>
    )
}
