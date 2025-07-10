/**
 * @fileoverview Look Ahead Window Selector Component
 * @module LookAheadWindowSelector
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Sets the 3-week rolling window for look ahead planning
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronLeft, ChevronRight, Clock, RefreshCw } from "lucide-react"

interface LookAheadWindowSelectorProps {
  onWindowChange: (window: { startDate: Date; endDate: Date; weeks: WeekWindow[] }) => void
  currentWindow?: { startDate: Date; endDate: Date; weeks: WeekWindow[] }
  className?: string
}

export interface WeekWindow {
  weekNumber: number
  startDate: Date
  endDate: Date
  label: string
  isCurrentWeek: boolean
}

const LookAheadWindowSelector: React.FC<LookAheadWindowSelectorProps> = ({
  onWindowChange,
  currentWindow,
  className = "",
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(() => {
    const today = new Date()
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    return monday
  })

  // Helper function to get week boundaries
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getWeekEnd = (date: Date): Date => {
    const start = getWeekStart(date)
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

  // Generate 3-week window
  const generateWindow = (startDate: Date): { startDate: Date; endDate: Date; weeks: WeekWindow[] } => {
    const weeks: WeekWindow[] = []
    const today = new Date()
    const currentWeekStart = getWeekStart(today)

    for (let i = 0; i < 3; i++) {
      const weekStart = new Date(startDate)
      weekStart.setDate(startDate.getDate() + i * 7)
      const weekEnd = getWeekEnd(weekStart)

      const isCurrentWeek = weekStart.getTime() === currentWeekStart.getTime()

      weeks.push({
        weekNumber: i + 1,
        startDate: weekStart,
        endDate: weekEnd,
        label: `Week ${i + 1} (${weekStart.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`,
        isCurrentWeek,
      })
    }

    return {
      startDate: weeks[0].startDate,
      endDate: weeks[2].endDate,
      weeks,
    }
  }

  const currentWindowData = currentWindow || generateWindow(selectedStartDate)

  const handlePreviousWeek = () => {
    const newStartDate = new Date(selectedStartDate)
    newStartDate.setDate(newStartDate.getDate() - 7)
    setSelectedStartDate(newStartDate)
    onWindowChange(generateWindow(newStartDate))
  }

  const handleNextWeek = () => {
    const newStartDate = new Date(selectedStartDate)
    newStartDate.setDate(newStartDate.getDate() + 7)
    setSelectedStartDate(newStartDate)
    onWindowChange(generateWindow(newStartDate))
  }

  const handleCurrentWeek = () => {
    const today = new Date()
    const monday = getWeekStart(today)
    setSelectedStartDate(monday)
    onWindowChange(generateWindow(monday))
  }

  const formatDateRange = (start: Date, end: Date): string => {
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined,
    })
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    return `${startStr} - ${endStr}`
  }

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Look Ahead Window</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCurrentWeek} className="h-8 px-3 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Current Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWindowChange(generateWindow(selectedStartDate))}
              className="h-8 px-3 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek} className="h-8 px-3">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm font-medium">
              {formatDateRange(currentWindowData.startDate, currentWindowData.endDate)}
            </p>
            <p className="text-xs text-muted-foreground">3-Week Rolling Window</p>
          </div>

          <Button variant="outline" size="sm" onClick={handleNextWeek} className="h-8 px-3">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Week Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {currentWindowData.weeks.map((week) => (
            <div
              key={week.weekNumber}
              className={`p-3 rounded-lg border ${
                week.isCurrentWeek ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Week {week.weekNumber}</span>
                {week.isCurrentWeek && (
                  <Badge variant="secondary" className="text-xs">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {week.startDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {week.endDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>

        {/* Window Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
          <span>Total Activities in Window</span>
          <Badge variant="outline">23 Activities</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

export default LookAheadWindowSelector
