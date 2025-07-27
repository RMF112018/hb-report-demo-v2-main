/**
 * @fileoverview Quality Control & Warranty Presentation Carousel
 * @module QualityWarrantyCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel showcasing Quality Control & Warranty management capabilities.
 * Uses the corrected qualitySlides from presentation/qualitySlides.tsx with proper layout structure.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "../presentation/PresentationCarousel"
import { qualitySlides } from "../presentation/qualitySlides"

export interface QualityWarrantyCarouselProps {
  onComplete?: () => void
  className?: string
}

export const QualityWarrantyCarousel: React.FC<QualityWarrantyCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={qualitySlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="Begin Quality & Warranty Oversight"
    />
  )
}

export default QualityWarrantyCarousel
