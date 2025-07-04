'use client'

import React, { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HighlightRect {
  x: number
  y: number
  width: number
  height: number
}

interface TourStepImageProps {
  src: string
  alt: string
  highlightRect?: HighlightRect
  onError?: () => void
  className?: string
}

/**
 * TourStepImage - Component for displaying tour step screenshots with optional highlights
 * 
 * Features:
 * - Displays screenshots with responsive sizing
 * - Optional highlight rectangle overlay
 * - Graceful error handling
 * - Optimized image loading
 * - Accessible alt text
 */
export const TourStepImage: React.FC<TourStepImageProps> = ({
  src,
  alt,
  highlightRect,
  onError,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    })
    setIsLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setHasError(true)
    setIsLoaded(false)
    onError?.()
  }, [onError])

  // Don't render if there's an error or no src
  if (hasError || !src) {
    return null
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse rounded-lg" />
      )}

      {/* Main Image */}
      <Image
        src={src}
        alt={alt}
        width={800}
        height={600}
        className={cn(
          'w-full h-auto object-contain transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority
      />

      {/* Dimmed Overlay with Spotlight Effect */}
      {highlightRect && isLoaded && imageDimensions.width > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark overlay with transparent window */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            style={{
              clipPath: `polygon(
                0% 0%, 
                0% 100%, 
                ${(highlightRect.x / imageDimensions.width) * 100}% 100%, 
                ${(highlightRect.x / imageDimensions.width) * 100}% ${(highlightRect.y / imageDimensions.height) * 100}%, 
                ${((highlightRect.x + highlightRect.width) / imageDimensions.width) * 100}% ${(highlightRect.y / imageDimensions.height) * 100}%, 
                ${((highlightRect.x + highlightRect.width) / imageDimensions.width) * 100}% ${((highlightRect.y + highlightRect.height) / imageDimensions.height) * 100}%, 
                ${(highlightRect.x / imageDimensions.width) * 100}% ${((highlightRect.y + highlightRect.height) / imageDimensions.height) * 100}%, 
                ${(highlightRect.x / imageDimensions.width) * 100}% 100%, 
                100% 100%, 
                100% 0%
              )`
            }}
          />
          
          {/* Subtle pulsing glow around the spotlight area */}
          <div
            className="absolute border-2 border-white/30 rounded-sm animate-pulse"
            style={{
              left: `${(highlightRect.x / imageDimensions.width) * 100}%`,
              top: `${(highlightRect.y / imageDimensions.height) * 100}%`,
              width: `${(highlightRect.width / imageDimensions.width) * 100}%`,
              height: `${(highlightRect.height / imageDimensions.height) * 100}%`,
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
          />
        </div>
      )}
    </div>
  )
} 