/**
 * @fileoverview Update Range Selector Component
 * @module UpdateRangeSelector
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Simplified date range selector for filtering schedule activities:
 * - All Activities (default)
 * - 6 Week (3 weeks before to 3 weeks after current date)
 * - Custom date range picker
 */

"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Filter, CalendarDays } from "lucide-react"
import { format, addWeeks, subWeeks } from "date-fns"

interface DateRange {
  start: Date
  end: Date
  label: string
}

interface UpdateRangeSelectorProps {
  selectedRange: DateRange
  onRangeChange: (range: DateRange) => void
}

const rangeOptions = [
  {
    id: "all-activities",
    label: "All Activities",
    getRange: () => ({
      start: new Date(2024, 0, 1), // January 1, 2024
      end: new Date(2026, 11, 31), // December 31, 2026
      label: "All Activities",
    }),
  },
  {
    id: "6-week",
    label: "6 Week",
    getRange: () => ({
      start: subWeeks(new Date(), 3), // 3 weeks before current date
      end: addWeeks(new Date(), 3), // 3 weeks after current date
      label: "6 Week",
    }),
  },
  {
    id: "custom",
    label: "Custom",
    getRange: () => ({
      start: new Date(),
      end: addWeeks(new Date(), 2),
      label: "Custom",
    }),
  },
]

export const UpdateRangeSelector: React.FC<UpdateRangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
  const [selectedOption, setSelectedOption] = useState("all-activities")
  const [customRangeOpen, setCustomRangeOpen] = useState(false)
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  // Initialize with "All Activities" as default
  useEffect(() => {
    if (selectedOption === "all-activities") {
      const allActivitiesRange = rangeOptions.find((r) => r.id === "all-activities")
      if (allActivitiesRange) {
        onRangeChange(allActivitiesRange.getRange())
      }
    }
  }, [])

  // Handle range selection
  const handleRangeSelection = useCallback(
    (optionId: string) => {
      setSelectedOption(optionId)

      if (optionId !== "custom") {
        const option = rangeOptions.find((r) => r.id === optionId)
        if (option) {
          onRangeChange(option.getRange())
        }
      }
    },
    [onRangeChange]
  )

  // Handle custom date range application
  const handleCustomDateChange = useCallback(() => {
    if (customStartDate && customEndDate) {
      const startDate = new Date(customStartDate)
      const endDate = new Date(customEndDate)

      if (startDate <= endDate) {
        onRangeChange({
          start: startDate,
          end: endDate,
          label: `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`,
        })
      }
    }
  }, [customStartDate, customEndDate, onRangeChange])

  // Apply custom range when dates change
  useEffect(() => {
    if (selectedOption === "custom" && customStartDate && customEndDate) {
      handleCustomDateChange()
    }
  }, [selectedOption, customStartDate, customEndDate, handleCustomDateChange])

  // Get days in range
  const getDaysInRange = useCallback((range: DateRange) => {
    const diffTime = range.end.getTime() - range.start.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }, [])

  const daysInRange = getDaysInRange(selectedRange)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Date Range Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Range Selection Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Range:</span>
            <Select value={selectedOption} onValueChange={handleRangeSelection}>
              <SelectTrigger className="w-auto min-w-32">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                {rangeOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Inputs - Only show when Custom is selected */}
          {selectedOption === "custom" && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">From:</span>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium whitespace-nowrap">To:</span>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-auto"
                  min={customStartDate}
                />
              </div>
            </>
          )}

          {/* Current Range Summary */}
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-md">
            <CalendarDays className="h-4 w-4 text-primary" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">{selectedRange.label}</span>
              <span className="text-sm text-muted-foreground">
                ({format(selectedRange.start, "MMM d")} - {format(selectedRange.end, "MMM d, yyyy")})
              </span>
              <span className="text-xs text-muted-foreground">{daysInRange} days</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
