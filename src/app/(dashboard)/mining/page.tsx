'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Pickaxe,
    Cpu,
    Activity,
    Zap,
    TrendingUp,
    Clock,
    Server,
    ThermometerSun,
    Gauge,
    Bitcoin,
    ArrowRight,
    ArrowLeft,
    AlertCircle
} from 'lucide-react'
import Link from 'next/link'

// Simulated mining stats
const miningPools = [
    { name: 'Pool 1 - US East', hashrate: '125.4 TH/s', workers: 3, status: 'active' },
    { name: 'Pool 2 - EU West', hashrate: '98.7 TH/s', workers: 2, status: 'active' },
    { name: 'Pool 3 - Asia', hashrate: '156.2 TH/s', workers: 4, status: 'active' },
]

export default function MiningPage() {
    const [miningActive, setMiningActive] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hashrate, setHashrate] = useState(380.3)
    const [shares, setShares] = useState(12847)
    const [earnings, setEarnings] = useState(0.00234)
    const [temperature, setTemperature] = useState(68)
    const [power, setPower] = useState(2450)
    const [efficiency, setEfficiency] = useState(38.5)

    // Fetch user's mining status
    useEffect(() => {
        const fetchMiningStatus = async () => {
            try {
                const response = await fetch('/api/user/me')
                if (response.ok) {
                    const data = await response.json()
                    setMiningActive(data.profile?.mining_active ?? false)
                }
            } catch (error) {
                console.error('Error fetching mining status:', error)
                setMiningActive(false)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMiningStatus()
    }, [])

    // Simulate live updates only when mining is active
    useEffect(() => {
        if (!miningActive) return

        const interval = setInterval(() => {
            setHashrate(prev => prev + (Math.random() - 0.5) * 5)
            setShares(prev => prev + Math.floor(Math.random() * 3))
            setEarnings(prev => prev + Math.random() * 0.00001)
            setTemperature(prev => Math.min(85, Math.max(55, prev + (Math.random() - 0.5) * 2)))
            setPower(prev => Math.max(2200, Math.min(2600, prev + (Math.random() - 0.5) * 50)))
            setEfficiency(prev => Math.max(35, Math.min(42, prev + (Math.random() - 0.5) * 0.5)))
        }, 2000)

        return () => clearInterval(interval)
    }, [miningActive])

    // Display values - show zeros when mining is inactive
    const displayHashrate = miningActive ? hashrate : 0
    const displayShares = miningActive ? shares : 0
    const displayEarnings = miningActive ? earnings : 0
    const displayTemperature = miningActive ? temperature : 0
    const displayPower = miningActive ? power : 0
    const displayEfficiency = miningActive ? efficiency : 0

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header title="Bitcoin Mining" description="Cloud mining powered by industrial-grade hardware" />
                <main className="p-4 md:p-8 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Header title="Bitcoin Mining" description="Cloud mining powered by industrial-grade hardware" />

            <main className="p-4 md:p-8 space-y-6">
                {/* Back Button */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>

                {/* Mining Inactive Alert */}
                {!miningActive && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <AlertCircle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-500">Mining Not Active</h3>
                            <p className="text-sm text-zinc-400 mt-1">
                                Your mining is currently inactive. Please contact support or make a deposit to activate your mining capabilities.
                            </p>
                            <Link href="/deposit" className="mt-3 inline-block">
                                <Button variant="primary" size="sm">
                                    Make a Deposit
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/20 via-yellow-500/10 to-transparent border border-orange-500/20 p-6 md:p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-orange-500/20">
                                    <Bitcoin className="h-8 w-8 text-orange-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">Bitcoin Mining</h1>
                                    <p className="text-zinc-400">Cloud mining powered by industrial-grade hardware</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    {miningActive ? (
                                        <>
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-sm text-green-400">Mining Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span className="text-sm text-red-400">Mining Inactive</span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Clock className="h-4 w-4" />
                                    <span>Uptime: {miningActive ? '99.9%' : '0%'}</span>
                                </div>
                            </div>
                        </div>

                        <Link href="/deposit">
                            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                Increase Mining Power
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Hashrate */}
                    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-900/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Gauge className="h-5 w-5 text-blue-500" />
                                </div>
                                {miningActive && (
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        +2.4%
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-400 mb-1">Total Hashrate</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
                                {displayHashrate.toFixed(1)} <span className="text-sm font-normal text-zinc-400">TH/s</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Shares */}
                    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-900/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <Activity className="h-5 w-5 text-green-500" />
                                </div>
                                {miningActive && (
                                    <span className="text-xs text-green-500 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        +156
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-zinc-400 mb-1">Valid Shares</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
                                {displayShares.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Earnings */}
                    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-900/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-orange-500/10">
                                    <Bitcoin className="h-5 w-5 text-orange-500" />
                                </div>
                                <span className="text-xs text-zinc-400">24h</span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-1">Mining Earnings</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
                                {displayEarnings.toFixed(5)} <span className="text-sm font-normal text-zinc-400">BTC</span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Efficiency */}
                    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-900/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Zap className="h-5 w-5 text-purple-500" />
                                </div>
                                <span className={`text-xs ${miningActive ? 'text-green-500' : 'text-zinc-500'}`}>
                                    {miningActive ? 'Optimal' : 'Offline'}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-1">Efficiency</p>
                            <p className="text-xl md:text-2xl font-bold text-white">
                                {displayEfficiency.toFixed(1)} <span className="text-sm font-normal text-zinc-400">J/TH</span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Mining Visualization */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pickaxe className="h-5 w-5 text-orange-500" />
                            Live Mining Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-48 md:h-64 rounded-xl bg-zinc-900/50 overflow-hidden">
                            {/* Animated mining visualization */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    {/* Outer ring */}
                                    <div className={`absolute inset-0 ${miningActive ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                                        <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-dashed ${miningActive ? 'border-orange-500/30' : 'border-zinc-700/30'}`} />
                                    </div>

                                    {/* Middle ring */}
                                    <div className={`absolute inset-4 ${miningActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                                        <div className={`w-24 h-24 md:w-40 md:h-40 rounded-full border-2 border-dashed ${miningActive ? 'border-yellow-500/30' : 'border-zinc-700/30'}`} />
                                    </div>

                                    {/* Inner ring */}
                                    <div className={`absolute inset-8 ${miningActive ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                                        <div className={`w-16 h-16 md:w-32 md:h-32 rounded-full border-2 border-dashed ${miningActive ? 'border-green-500/30' : 'border-zinc-700/30'}`} />
                                    </div>

                                    {/* Center Bitcoin */}
                                    <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full ${miningActive ? 'bg-gradient-to-br from-orange-500/20 to-yellow-500/10' : 'bg-zinc-800/50'} flex items-center justify-center`}>
                                        <div className={miningActive ? 'animate-pulse' : 'opacity-30'}>
                                            <Bitcoin className={`h-12 w-12 md:h-16 md:w-16 ${miningActive ? 'text-orange-500' : 'text-zinc-600'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating particles - only when active */}
                            {miningActive && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-orange-500/50 rounded-full animate-ping"
                                            style={{
                                                top: `${20 + Math.random() * 60}%`,
                                                left: `${10 + Math.random() * 80}%`,
                                                animationDelay: `${i * 0.3}s`,
                                                animationDuration: '2s'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Stats overlay */}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs">
                                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <span className="text-zinc-400">Block Height: </span>
                                    <span className="text-white font-mono">{miningActive ? '834,291' : '---'}</span>
                                </div>
                                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <span className="text-zinc-400">Network Difficulty: </span>
                                    <span className="text-white font-mono">{miningActive ? '72.01T' : '---'}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mining Pools & Hardware */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Mining Pools */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Server className="h-5 w-5 text-blue-500" />
                                Active Mining Pools
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {miningPools.map((pool, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full ${miningActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                                            <div>
                                                <p className="text-sm font-medium text-white">{pool.name}</p>
                                                <p className="text-xs text-zinc-400">{miningActive ? pool.workers : 0} active workers</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-white">{miningActive ? pool.hashrate : '0 TH/s'}</p>
                                            <p className={`text-xs ${miningActive ? 'text-green-400' : 'text-zinc-500'}`}>
                                                {miningActive ? 'Online' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hardware Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Cpu className="h-5 w-5 text-purple-500" />
                                Hardware Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Temperature */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <ThermometerSun className="h-4 w-4 text-orange-500" />
                                            <span className="text-sm text-zinc-400">Avg. Temperature</span>
                                        </div>
                                        <span className={`text-sm font-medium ${!miningActive ? 'text-zinc-500' : displayTemperature > 75 ? 'text-orange-500' : 'text-green-500'}`}>
                                            {displayTemperature.toFixed(0)}°C
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${!miningActive ? 'bg-zinc-700' : displayTemperature > 75 ? 'bg-orange-500' : 'bg-green-500'}`}
                                            style={{ width: `${(displayTemperature / 100) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Power */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm text-zinc-400">Power Consumption</span>
                                        </div>
                                        <span className="text-sm font-medium text-white">{displayPower.toFixed(0)}W</span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${miningActive ? 'bg-yellow-500' : 'bg-zinc-700'}`}
                                            style={{ width: `${(displayPower / 3000) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Uptime */}
                                <div className={`flex items-center justify-between p-3 rounded-lg ${miningActive ? 'bg-green-500/10 border border-green-500/20' : 'bg-zinc-800/50 border border-zinc-700/20'}`}>
                                    <div className="flex items-center gap-2">
                                        <Activity className={`h-4 w-4 ${miningActive ? 'text-green-500' : 'text-zinc-500'}`} />
                                        <span className={`text-sm ${miningActive ? 'text-green-400' : 'text-zinc-500'}`}>System Uptime</span>
                                    </div>
                                    <span className={`text-sm font-medium ${miningActive ? 'text-green-400' : 'text-zinc-500'}`}>
                                        {miningActive ? '23d 14h 52m' : '0d 0h 0m'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA */}
                <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                                    {miningActive ? 'Increase Your Mining Power' : 'Activate Your Mining'}
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    {miningActive
                                        ? 'Deposit funds to upgrade your mining hashrate and earn more Bitcoin daily.'
                                        : 'Make a deposit to activate your mining and start earning Bitcoin.'}
                                </p>
                            </div>
                            <Link href="/deposit" className="shrink-0">
                                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                                    Deposit Now
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
