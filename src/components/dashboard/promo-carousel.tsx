'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PromoBanner } from '@/types/database'

export function PromoCarousel() {
  const [banners, setBanners] = useState<PromoBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [banners.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [banners.length, isPaused, nextSlide])

  // Don't render if no banners or loading
  if (isLoading || banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  const CarouselContent = (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-zinc-900/50 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image */}
      <div className="relative aspect-[21/9] md:aspect-[3/1]">
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title || 'Promo banner'}
          className="w-full h-full object-cover"
        />

        {/* Gradient overlay for text */}
        {currentBanner.title && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}

        {/* Title */}
        {currentBanner.title && (
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg md:text-xl font-semibold text-white">
              {currentBanner.title}
            </h3>
          </div>
        )}
      </div>

      {/* Navigation Arrows - visible on hover */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prevSlide()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              nextSlide()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToSlide(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Wrap in link if banner has a link_url
  if (currentBanner.link_url) {
    return (
      <a
        href={currentBanner.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {CarouselContent}
      </a>
    )
  }

  return CarouselContent
}
