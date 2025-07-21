"use client"

import React from "react"

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
export const Tour: React.FC<TourProps> = ({ className: _className = "" }) => {
  // TEMPORARILY DISABLED: Tour system is disabled
  // Return null to hide the tour completely
  return null
}

// Re-export TourControls for convenience
export { TourControls } from "@/components/ui/tour-controls"
