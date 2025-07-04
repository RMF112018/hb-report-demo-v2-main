"use client"

import React, { useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react"
import { useTour } from "@/context/tour-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TourStepImage } from "@/components/ui/TourStepImage"
import { cn } from "@/lib/utils"

/**
 * TourModal - Modal-based tour interface
 *
 * TEMPORARILY DISABLED: Tour system is disabled
 * This component now returns null to hide the tour modal completely
 *
 * @returns null (component is disabled)
 */
export const TourModal: React.FC = () => {
  // TEMPORARILY DISABLED: Tour system is disabled
  // Return null to hide the tour modal completely
  return null
}
