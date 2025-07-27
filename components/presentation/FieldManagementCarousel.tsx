/**
 * @fileoverview Field Management Tab Presentation Carousel
 * @module FieldManagementCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Full-screen presentation carousel introducing users to Field Management functionality.
 * Displays when users in Presentation mode click to explore the Field Management tab.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { fieldManagementSlides } from "./fieldManagementSlides"

export interface FieldManagementCarouselProps {
  onComplete?: () => void
  className?: string
}

export const FieldManagementCarousel: React.FC<FieldManagementCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={fieldManagementSlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="Transform Your Field Operations"
    />
  )
}

export default FieldManagementCarousel
