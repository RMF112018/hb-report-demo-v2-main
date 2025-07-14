/**
 * @fileoverview Core Tab Presentation Carousel
 * @module CoreTabCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel introducing users to the Core Tab functionality.
 * Displays when users in Presentation mode click to explore the project page.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { coreTabSlides } from "./coreTabSlides"

export interface CoreTabCarouselProps {
  onComplete?: () => void
  className?: string
}

export const CoreTabCarousel: React.FC<CoreTabCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={coreTabSlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="See How It's Structured"
    />
  )
}

export default CoreTabCarousel
