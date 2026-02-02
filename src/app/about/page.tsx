import { Navbar } from '@/components/homepage/navbar'
import { Footer } from '@/components/homepage/footer'
import {
    Shield,
    Zap,
    Globe,
    Users,
    TrendingUp,
    Lock,
    Award,
    Clock,
    Cpu,
    BarChart3,
    CheckCircle2,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const stats = [
    { value: '$2.5B+', label: 'Total Mining Rewards Distributed' },
    { value: '150K+', label: 'Active Miners Worldwide' },
    { value: '99.9%', label: 'Platform Uptime' },
    { value: '24/7', label: 'Customer Support' },
]

const values = [
    {
        icon: Shield,
        title: 'Security First',
        description: 'Enterprise-grade security protocols protect your assets with multi-layer encryption, cold storage, and regular security audits.',
    },
    {
        icon: Zap,
        title: 'Maximum Efficiency',
        description: 'Our optimized mining algorithms and state-of-the-art hardware ensure maximum hash rates and minimal energy consumption.',
    },
    {
        icon: Globe,
        title: 'Global Infrastructure',
        description: 'Strategically located mining facilities across multiple continents provide redundancy and optimal performance.',
    },
    {
        icon: Users,
        title: 'Community Driven',
        description: 'We believe in transparency and building lasting relationships with our mining community through open communication.',
    },
]

const features = [
    {
        icon: Cpu,
        title: 'Cloud Mining Made Simple',
        description: 'No expensive hardware purchases, no technical setup, no electricity costs. Start mining Bitcoin and Ethereum with just a few clicks.',
    },
    {
        icon: TrendingUp,
        title: 'Daily Rewards Distribution',
        description: 'Watch your earnings grow in real-time. Mining profits are calculated and credited to your account every 24 hours.',
    },
    {
        icon: Lock,
        title: 'Secure Wallet Integration',
        description: 'Your funds are protected by industry-leading security measures. Withdraw your earnings anytime to your personal wallet.',
    },
    {
        icon: BarChart3,
        title: 'Transparent Operations',
        description: 'Full visibility into your mining performance, hash rates, and earnings history. No hidden fees or surprise deductions.',
    },
]

const timeline = [
    {
        year: '2019',
        title: 'Founded',
        description: 'Bitcap Mining was established with a vision to democratize cryptocurrency mining for everyone.',
    },
    {
        year: '2020',
        title: 'First Mining Facility',
        description: 'Launched our first state-of-the-art mining facility with renewable energy sources.',
    },
    {
        year: '2021',
        title: 'Global Expansion',
        description: 'Expanded operations to multiple countries, reaching 50,000 active miners.',
    },
    {
        year: '2022',
        title: 'Ethereum Mining',
        description: 'Added Ethereum mining capabilities, giving users more earning opportunities.',
    },
    {
        year: '2023',
        title: '100K Milestone',
        description: 'Celebrated 100,000 active miners and $1 billion in total rewards distributed.',
    },
    {
        year: '2024',
        title: 'Next Generation',
        description: 'Launched advanced mining algorithms and upgraded infrastructure for maximum efficiency.',
    },
]

const team = [
    {
        name: 'Michael Chen',
        role: 'Chief Executive Officer',
        bio: 'Former Goldman Sachs executive with 15+ years in fintech and blockchain technology.',
    },
    {
        name: 'Sarah Williams',
        role: 'Chief Technology Officer',
        bio: 'Ex-Google engineer specializing in distributed systems and cryptocurrency protocols.',
    },
    {
        name: 'David Rodriguez',
        role: 'Head of Mining Operations',
        bio: '10+ years experience managing large-scale mining operations across 4 continents.',
    },
    {
        name: 'Emily Thompson',
        role: 'Chief Security Officer',
        bio: 'Former cybersecurity lead at Coinbase with expertise in blockchain security.',
    },
]

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-zinc-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl opacity-20" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-500">Trusted by 150,000+ Miners Worldwide</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Powering the Future of{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            Cryptocurrency Mining
                        </span>
                    </h1>

                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Bitcap Mining is the world's leading cloud mining platform, enabling anyone to earn Bitcoin
                        and Ethereum rewards without the complexity of traditional mining operations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                        >
                            Start Mining Today
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-all"
                        >
                            View Dashboard Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6 border-y border-zinc-800">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">{stat.value}</p>
                                <p className="text-sm text-zinc-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Our Mission
                            </h2>
                            <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
                                At Bitcap Mining, we believe everyone should have access to the wealth-generating potential
                                of cryptocurrency mining. Traditional mining requires expensive hardware, technical expertise,
                                and significant electricity costs—barriers that keep most people from participating.
                            </p>
                            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                                We've built a platform that removes these barriers entirely. By pooling resources and
                                operating industrial-scale mining facilities, we can offer mining power to users at a
                                fraction of the cost, with none of the technical headaches.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'No hardware purchases required',
                                    'No technical knowledge needed',
                                    'No electricity costs',
                                    'Instant mining activation',
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        <span className="text-zinc-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800">
                            <div className="grid grid-cols-2 gap-6">
                                {values.map((value) => (
                                    <div key={value.title} className="p-4">
                                        <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4">
                                            <value.icon className="h-6 w-6 text-yellow-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                        <p className="text-sm text-zinc-400">{value.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 bg-zinc-900/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How Bitcap Mining Works
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Start earning Bitcoin and Ethereum rewards in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Create Account',
                                description: 'Sign up in seconds with just your email. No complex verification process required to get started.',
                            },
                            {
                                step: '02',
                                title: 'Request Mining Address',
                                description: 'Choose your preferred cryptocurrency and get a dedicated mining address to transfer your funds.',
                            },
                            {
                                step: '03',
                                title: 'Earn Daily Rewards',
                                description: 'Sit back and watch your mining profits accumulate. Withdraw anytime to your personal wallet.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="relative">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 h-full hover:border-yellow-500/30 transition-colors">
                                    <span className="text-5xl font-bold text-yellow-500/20 absolute top-4 right-6">{item.step}</span>
                                    <h3 className="text-xl font-semibold text-white mb-4 relative z-10">{item.title}</h3>
                                    <p className="text-zinc-400 relative z-10">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why Choose Bitcap Mining
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Industry-leading technology and security for maximum mining efficiency
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature) => (
                            <div key={feature.title} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-yellow-500/30 transition-colors">
                                <div className="h-14 w-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-6">
                                    <feature.icon className="h-7 w-7 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 px-6 bg-zinc-900/50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Our Journey
                        </h2>
                        <p className="text-lg text-zinc-400">
                            From startup to industry leader in cryptocurrency mining
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800" />

                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <div key={item.year} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                                        <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 inline-block ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                                            <span className="text-yellow-500 font-bold text-lg">{item.year}</span>
                                            <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                                            <p className="text-zinc-400 text-sm mt-2">{item.description}</p>
                                        </div>
                                    </div>

                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-yellow-500 border-4 border-zinc-950 z-10" />

                                    <div className="flex-1 md:hidden pl-16">
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                            <span className="text-yellow-500 font-bold text-lg">{item.year}</span>
                                            <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                                            <p className="text-zinc-400 text-sm mt-2">{item.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Leadership Team
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                            Experienced professionals from finance, technology, and cryptocurrency industries
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member) => (
                            <div key={member.name} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center hover:border-yellow-500/30 transition-colors">
                                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-black">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                                <p className="text-sm text-yellow-500 mb-3">{member.role}</p>
                                <p className="text-sm text-zinc-400">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supported Cryptocurrencies */}
            <section className="py-24 px-6 bg-zinc-900/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Supported Cryptocurrencies
                    </h2>
                    <p className="text-lg text-zinc-400 mb-12">
                        Mine the world's leading cryptocurrencies with Bitcap
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-orange-500/30 transition-colors">
                            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" alt="Bitcoin" className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Bitcoin (BTC)</h3>
                            <p className="text-zinc-400 mb-4">The original cryptocurrency and digital gold. Limited supply of 21 million coins.</p>
                            <div className="flex items-center justify-center gap-2 text-orange-500">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Block time: ~10 minutes</span>
                            </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-blue-500/30 transition-colors">
                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="Ethereum" className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Ethereum (ETH)</h3>
                            <p className="text-zinc-400 mb-4">The world's programmable blockchain powering DeFi and smart contracts.</p>
                            <div className="flex items-center justify-center gap-2 text-blue-400">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Block time: ~12 seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Mining?
                        </h2>
                        <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
                            Join over 150,000 miners already earning Bitcoin and Ethereum rewards with Bitcap Mining.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20"
                        >
                            Create Free Account
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <p className="text-sm text-zinc-500 mt-4">No credit card required • Start mining in minutes</p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
