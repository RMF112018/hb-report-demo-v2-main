import React from "react"
import { PresentationCarousel } from "./PresentationCarousel"
import hbIntelPitchSlides from "./hbIntelPitchSlides"

interface HBIntelPitchCarouselProps {
  onComplete: () => void
}

export const HBIntelPitchCarousel: React.FC<HBIntelPitchCarouselProps> = ({ onComplete }) => {
  return (
    <PresentationCarousel
      slides={hbIntelPitchSlides}
      onComplete={onComplete}
      autoPlay={false}
      ctaText="Transform Your Construction Analytics"
    />
  )
}

export default HBIntelPitchCarousel
