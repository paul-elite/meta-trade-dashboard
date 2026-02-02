import { Navbar } from '@/components/homepage/navbar'
import { HeroSection } from '@/components/homepage/hero-section'
import { FeaturesGrid } from '@/components/homepage/features-grid'
import { PlatformPreview } from '@/components/homepage/platform-preview'
import { StatsSection } from '@/components/homepage/stats-section'
import { Footer } from '@/components/homepage/footer'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <PlatformPreview />
      <StatsSection />
      <Footer />
    </main>
  )
}
