'use client'

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '$2B+', label: 'Trading Volume' },
  { value: '10K+', label: 'Active Traders' },
  { value: '99.9%', label: 'Uptime' }
]

export function StatsSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                {stat.value}
              </p>
              <p className="text-zinc-400 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
