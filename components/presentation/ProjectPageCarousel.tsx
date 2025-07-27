/**
 * @fileoverview Project Page Presentation Carousel
 * @module ProjectPageCarousel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Full-screen presentation carousel introducing users to the unified project workspace.
 * Displays when users in Presentation mode navigate to a project-specific page.
 */

"use client"

import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import { projectPageSlides } from "./projectPageSlides"

export interface ProjectPageCarouselProps {
  onComplete?: () => void
  className?: string
}

export const ProjectPageCarousel: React.FC<ProjectPageCarouselProps> = ({ onComplete, className = "" }) => {
  return (
    <PresentationCarousel
      slides={projectPageSlides}
      onComplete={onComplete}
      autoPlay={false}
      className={className}
      ctaText="Explore Your Project's Story"
    />
  )
}

export default ProjectPageCarousel
