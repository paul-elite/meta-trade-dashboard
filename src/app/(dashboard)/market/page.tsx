'use client'

import { Header } from '@/components/dashboard/header'
import { MarketTable } from '@/components/dashboard/market-table'

export default function MarketPage() {
    return (
        <div className="min-h-full">
            <Header title="Live Market" description="Real-time crypto prices and market data" />

            <div className="p-6 lg:p-12">
                <MarketTable />
            </div>
        </div>
    )
}
