/**
 * @fileoverview Financial Management Tab Presentation Carousel
 * @module FinancialCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel introducing users to Financial Management functionality.
 * Displays when users in Presentation mode click to explore the Financial Management tab.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { financialTabSlides } from "./financialTabSlides"

export interface FinancialCarouselProps {
  onComplete?: () => void
  className?: string
}

export const FinancialCarousel: React.FC<FinancialCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={financialTabSlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="Master Your Financial Operations"
    />
  )
}

export default FinancialCarousel
