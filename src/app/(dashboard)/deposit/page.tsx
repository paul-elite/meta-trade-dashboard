'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { DepositForm } from '@/components/dashboard/deposit-form'
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
  ArrowLeft,
  Sparkles
} from 'lucide-react'

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
    tagline: 'Best for new investors getting started with crypto mining.',
    cta: 'Start Basic Plan'
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
    tagline: 'Ideal for growing portfolios.',
    cta: 'Choose Silver'
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
    tagline: 'Designed for serious investors.',
    cta: 'Go Gold'
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
    tagline: 'Exclusive tier for high-net-worth investors.',
    cta: 'Join VIP'
  }
]

const colorStyles: Record<string, { bg: string; border: string; text: string; iconBg: string; badge: string; selected: string }> = {
  green: {
    bg: 'from-green-500/10 to-green-500/5',
    border: 'border-green-500/20 hover:border-green-500/40',
    text: 'text-green-500',
    iconBg: 'bg-green-500/20',
    badge: 'bg-green-500/20 text-green-400',
    selected: 'ring-2 ring-green-500 border-green-500'
  },
  blue: {
    bg: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    text: 'text-blue-500',
    iconBg: 'bg-blue-500/20',
    badge: 'bg-blue-500/20 text-blue-400',
    selected: 'ring-2 ring-blue-500 border-blue-500'
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-500/5',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    text: 'text-purple-500',
    iconBg: 'bg-purple-500/20',
    badge: 'bg-purple-500/20 text-purple-400',
    selected: 'ring-2 ring-purple-500 border-purple-500'
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-500/5',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    text: 'text-orange-500',
    iconBg: 'bg-orange-500/20',
    badge: 'bg-orange-500/20 text-orange-400',
    selected: 'ring-2 ring-orange-500 border-orange-500'
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

export type InvestmentPlan = typeof plans[number]

export default function DepositPage() {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [step, setStep] = useState<'select-plan' | 'deposit'>('select-plan')

  const handleSelectPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan)
    setStep('deposit')
  }

  const handleBackToPlans = () => {
    setStep('select-plan')
    setSelectedPlan(null)
  }

  if (step === 'deposit' && selectedPlan) {
    return (
      <div className="min-h-full">
        <Header title="Deposit" description="Add funds to your wallet" />

        <div className="p-4 lg:p-12 space-y-6">
          {/* Selected Plan Summary */}
          <Card className="max-w-lg mx-auto bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorStyles[selectedPlan.color].iconBg}`}>
                    <selectedPlan.icon className={`h-5 w-5 ${colorStyles[selectedPlan.color].text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{selectedPlan.name}</p>
                    <p className="text-xs text-zinc-400">
                      {formatCurrency(selectedPlan.minInvestment)} - {formatCurrency(selectedPlan.maxInvestment)} | {selectedPlan.roi} ROI
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToPlans}
                  className="text-zinc-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          <DepositForm selectedPlan={selectedPlan} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <Header title="Select Investment Plan" description="Choose a mining plan to get started" />

      <div className="p-4 lg:p-12 space-y-6">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const styles = colorStyles[plan.color]
            const Icon = plan.icon

            return (
              <Card
                key={plan.tier}
                className={`relative overflow-hidden bg-gradient-to-br ${styles.bg} ${styles.border} transition-all duration-300 hover:scale-[1.02]`}
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

                  {/* CTA Button */}
                  <Button
                    variant="secondary"
                    className={`w-full ${plan.tier === 'platinum' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
