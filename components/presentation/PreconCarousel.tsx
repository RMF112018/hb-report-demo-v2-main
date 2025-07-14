/**
 * @fileoverview Pre-Construction Tab Presentation Carousel
 * @module PreconCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel introducing users to Pre-Construction functionality.
 * Displays when users in Presentation mode click to explore the Pre-Construction tab.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { preconTabSlides } from "./preconTabSlides"

export interface PreconCarouselProps {
  onComplete?: () => void
  className?: string
}

export const PreconCarousel: React.FC<PreconCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={preconTabSlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="Transform Your Pre-Construction Process"
    />
  )
}

export default PreconCarousel
