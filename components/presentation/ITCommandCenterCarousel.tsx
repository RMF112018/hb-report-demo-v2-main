/**
 * @fileoverview IT Command Center Presentation Carousel
 * @module ITCommandCenterCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel introducing users to the IT Command Center functionality.
 * Displays when users in Presentation mode click to explore the IT Command Center.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { itCommandCenterSlides } from "./itCommandCenterSlides"

export interface ITCommandCenterCarouselProps {
  onComplete?: () => void
  className?: string
}

export const ITCommandCenterCarousel: React.FC<ITCommandCenterCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={itCommandCenterSlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="Transform Your IT Operations"
    />
  )
}

export default ITCommandCenterCarousel
