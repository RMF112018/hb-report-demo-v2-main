"use client"

import React, { useEffect, useRef, useState, Suspense } from "react"
import { X, ArrowLeft, ArrowRight, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTour } from "@/context/tour-context"
import { useTourPositioning } from "@/hooks/useTourPositioning"
import { TOUR_CONSTANTS, TOUR_THEMES } from "@/lib/tour-constants"
import { tourLogger, tourDOMUtils, tourAnimations, tourEventUtils, tourPerformance } from "@/lib/tour-utils"

interface TourProps {
  className?: string
}

/**
 * @deprecated This component is deprecated in favor of TourModal
 *
 * LEGACY: Standardized Tour component with Shadcn UI Card-based tooltips
 *
 * TEMPORARILY DISABLED: Tour system is disabled
 * This component now returns null to hide the tour completely
 *
 * @returns null (component is disabled)
 */
export const Tour: React.FC<TourProps> = ({ className = "" }) => {
  // TEMPORARILY DISABLED: Tour system is disabled
  // Return null to hide the tour completely
  return null
}

// Re-export TourControls for convenience
export { TourControls } from "@/components/ui/tour-controls"
