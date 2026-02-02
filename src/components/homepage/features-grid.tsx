'use client'

import {
  Shield,
  Zap,
  BarChart3,
  Wallet,
  HeadphonesIcon,
  Globe
} from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your assets are protected with military-grade encryption and multi-signature wallets.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience blazing fast mining operations with our high-performance infrastructure.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Make informed decisions with real-time charts, indicators, and market insights.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: Wallet,
    title: 'Multi-Currency Support',
    description: 'Mine Bitcoin, Ethereum, and more cryptocurrencies from a single dashboard.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our expert support team is available around the clock to assist you.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Access your mining dashboard from anywhere with our mobile-optimized platform.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10'
  }
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Mine
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Powerful features designed for miners of all experience levels.
            From beginners to professionals, we have you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
