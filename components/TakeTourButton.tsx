"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Compass, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTour } from "@/context/tour-context"
import { useAuth } from "@/context/auth-context"

import { tourLogger } from "@/lib/tour-utils"

interface TakeTourButtonProps {
  className?: string
}

/**
 * Enhanced floating "Explore This Page" button component
 *
 * TEMPORARILY DISABLED: Tour system is disabled
 * This component now returns null to hide the tour button completely
 *
 * @param className Optional additional CSS classes (unused while disabled)
 * @returns null (component is disabled)
 */
export const TakeTourButton: React.FC<TakeTourButtonProps> = ({ className = "" }) => {
  // TEMPORARILY DISABLED: Tour system is disabled
  // Return null to hide the tour button completely
  return null
}
