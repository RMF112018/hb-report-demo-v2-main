/**
 * @fileoverview Compliance Tab Presentation Carousel
 * @module ComplianceCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Full-screen presentation carousel introducing users to Compliance functionality.
 * Displays when users in Presentation mode click to explore the Compliance tab.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { complianceSlides } from "./complianceSlides"

export interface ComplianceCarouselProps {
  onComplete?: () => void
  className?: string
}

export const ComplianceCarousel: React.FC<ComplianceCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={complianceSlides}
      onComplete={onComplete}
      className={className}
      ctaText="Transform Your Compliance Management"
    />
  )
}

export default ComplianceCarousel
