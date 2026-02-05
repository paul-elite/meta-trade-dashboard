'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Pickaxe,
    Crown,
    Zap,
    Clock,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const plans = [
    {
        name: 'Basic Mining Plan',
        tier: 'basic',
        icon: Pickaxe,
        color: 'green',
        minInvestment: 500,
        maxInvestment: 4999,
        duration: '7 Days',
        roi: '15 - 30%',
        features: [
            'Entry-level mining allocation',
            'Daily mining rewards',
            'Instant portfolio setup',
            '24/7 customer support'
        ],
        tagline: 'Best for new investors getting started with crypto mining.'
    },
    {
        name: 'Silver Mining Plan',
        tier: 'silver',
        icon: Zap,
        color: 'blue',
        minInvestment: 5000,
        maxInvestment: 49999,
        duration: '7 Days',
        roi: '30 - 60%',
        features: [
            'Enhanced hash-rate allocation',
            'Daily profit tracking',
            'Faster withdrawals',
            'Dedicated support'
        ],
        tagline: 'Ideal for growing portfolios.'
    },
    {
        name: 'Gold Mining Plan',
        tier: 'gold',
        icon: Sparkles,
        color: 'purple',
        minInvestment: 50000,
        maxInvestment: 499999,
        duration: '14 Days',
        roi: '50 - 100%',
        features: [
            'High-performance mining pools',
            'Priority withdrawals',
            'Portfolio optimization',
            'Account manager'
        ],
        tagline: 'Designed for serious investors.'
    },
    {
        name: 'Platinum / VIP Plan',
        tier: 'platinum',
        icon: Crown,
        color: 'orange',
        minInvestment: 500000,
        maxInvestment: 10000000,
        duration: '14 Days',
        roi: '80 - 160%',
        features: [
            'Maximum hash power allocation',
            'Dedicated VIP account manager',
            'Instant withdrawals',
            'Personalized mining strategy',
            'Priority customer care'
        ],
        tagline: 'Exclusive tier for high-net-worth investors.'
    }
]

const colorStyles: Record<string, { bg: string; border: string; text: string; iconBg: string; badge: string }> = {
    green: {
        bg: 'from-green-500/10 to-green-500/5',
        border: 'border-green-500/20 hover:border-green-500/40',
        text: 'text-green-500',
        iconBg: 'bg-green-500/20',
        badge: 'bg-green-500/20 text-green-400'
    },
    blue: {
        bg: 'from-blue-500/10 to-blue-500/5',
        border: 'border-blue-500/20 hover:border-blue-500/40',
        text: 'text-blue-500',
        iconBg: 'bg-blue-500/20',
        badge: 'bg-blue-500/20 text-blue-400'
    },
    purple: {
        bg: 'from-purple-500/10 to-purple-500/5',
        border: 'border-purple-500/20 hover:border-purple-500/40',
        text: 'text-purple-500',
        iconBg: 'bg-purple-500/20',
        badge: 'bg-purple-500/20 text-purple-400'
    },
    orange: {
        bg: 'from-orange-500/10 to-orange-500/5',
        border: 'border-orange-500/20 hover:border-orange-500/40',
        text: 'text-orange-500',
        iconBg: 'bg-orange-500/20',
        badge: 'bg-orange-500/20 text-orange-400'
    }
}

function formatCurrency(amount: number): string {
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(0)}M`
    }
    if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
}

export function InvestmentPlansSection() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClient()
                const { data: { session } } = await supabase.auth.getSession()
                setIsLoggedIn(!!session)
            } catch (error) {
                console.error('Auth check error:', error)
            } finally {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [])

    // Determine the CTA link based on auth status
    const getCtaLink = (tier: string) => {
        if (isLoggedIn) {
            return '/deposit'
        }
        return '/signup'
    }

    const getCtaText = (tier: string) => {
        if (tier === 'platinum') {
            return isLoggedIn ? 'Contact VIP Team' : 'Get Started'
        }
        return isLoggedIn ? 'Start Investing' : 'Get Started'
    }

    return (
        <section id="plans" className="py-24 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                        <Pickaxe className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-400 font-medium">Investment Plans</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Choose Your Mining Plan
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Select an investment plan that fits your goals. Start earning daily mining rewards
                        with our trusted platform.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {plans.map((plan) => {
                        const styles = colorStyles[plan.color]
                        const Icon = plan.icon

                        return (
                            <Card
                                key={plan.tier}
                                className={`relative overflow-hidden bg-gradient-to-br ${styles.bg} ${styles.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                            >
                                {/* Popular badge for Gold */}
                                {plan.tier === 'gold' && (
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-purple-500 text-white text-xs">Popular</Badge>
                                    </div>
                                )}

                                {/* VIP badge for Platinum */}
                                {plan.tier === 'platinum' && (
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-orange-500 text-white text-xs">VIP</Badge>
                                    </div>
                                )}

                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
                                            <Icon className={`h-5 w-5 ${styles.text}`} />
                                        </div>
                                        <CardTitle className="text-base text-white">{plan.name}</CardTitle>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Investment Range */}
                                    <div className="space-y-1">
                                        <p className="text-xs text-zinc-400">Investment Range</p>
                                        <p className="text-lg font-bold text-white">
                                            {formatCurrency(plan.minInvestment)} - {formatCurrency(plan.maxInvestment)}
                                        </p>
                                    </div>

                                    {/* Duration & ROI */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-2 rounded-lg bg-zinc-900/50">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Clock className="h-3 w-3 text-zinc-400" />
                                                <span className="text-xs text-zinc-400">Duration</span>
                                            </div>
                                            <p className="text-sm font-semibold text-white">{plan.duration}</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-zinc-900/50">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <TrendingUp className="h-3 w-3 text-zinc-400" />
                                                <span className="text-xs text-zinc-400">ROI</span>
                                            </div>
                                            <p className={`text-sm font-semibold ${styles.text}`}>{plan.roi}</p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        {plan.features.slice(0, 3).map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className={`h-4 w-4 ${styles.text} shrink-0 mt-0.5`} />
                                                <span className="text-xs text-zinc-300">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.features.length > 3 && (
                                            <p className="text-xs text-zinc-500 pl-6">
                                                +{plan.features.length - 3} more features
                                            </p>
                                        )}
                                    </div>

                                    {/* Tagline */}
                                    <p className="text-xs text-zinc-400 italic">{plan.tagline}</p>

                                    {/* CTA */}
                                    <Link href={getCtaLink(plan.tier)} className="block">
                                        <Button
                                            variant="secondary"
                                            className={`w-full ${plan.tier === 'platinum' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                                            rightIcon={<ArrowRight className="h-4 w-4" />}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Loading...' : getCtaText(plan.tier)}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12">
                    <Card className="bg-gradient-to-r from-orange-500/10 via-yellow-500/5 to-orange-500/10 border-orange-500/20">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">
                                        Ready to Start Mining?
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        {isLoggedIn
                                            ? 'Make a deposit now and start earning daily mining rewards with our trusted platform.'
                                            : 'Create an account today and start earning daily mining rewards with our trusted platform.'
                                        }
                                    </p>
                                </div>
                                <Link href={isLoggedIn ? '/deposit' : '/signup'} className="shrink-0">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        rightIcon={<ArrowRight className="h-4 w-4" />}
                                        disabled={isLoading}
                                    >
                                        {isLoggedIn ? 'Deposit Now' : 'Get Started Free'}
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
