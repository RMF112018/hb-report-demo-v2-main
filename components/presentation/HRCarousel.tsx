"use client"

import React from "react"
import { createPortal } from "react-dom"
import { PresentationCarousel } from "./PresentationCarousel"
import { hrSlides } from "./hrSlides"

interface HRCarouselProps {
  onComplete?: () => void
}

export const HRCarousel: React.FC<HRCarouselProps> = ({ onComplete }) => {
  const handleComplete = () => {
    console.log("🏁 HR Carousel: Tour completed")
    onComplete?.()
  }

  return (
    <>
      {typeof window !== "undefined" &&
        createPortal(
          <PresentationCarousel
            slides={hrSlides}
            onComplete={handleComplete}
            ctaText="Return to HR & Payroll"
            ctaIcon={undefined}
          />,
          document.body
        )}
    </>
  )
}
