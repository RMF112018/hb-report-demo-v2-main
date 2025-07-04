"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import {
  format,
  differenceInDays,
  addMonths,
  addWeeks,
  addQuarters,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  eachWeekOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Users, Plus, Link2, Trash2, Info, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StaffingPlanActivity, StaffingAllocation, StaffingPlanMonth, StaffRole } from "@/types/staff-planning"
import type { TimeScale } from "@/components/staff-planning/StaffingPlanGantt"
import StaffingPlanGantt from "@/components/staff-planning/StaffingPlanGantt"

// Static roles matching the allocation matrix
const STATIC_ROLES = [
  "PROJECT EXECUTIVE",
  "PROJECT MANAGER",
  "ASSISTANT PROJECT MANAGER",
  "PROJECT ACCOUNTANT",
  "PROJECT ADMINISTRATOR",
  "PROCUREMENT MANAGER",
  "LEAD SUPERINTENDENT",
  "ASSISTANT SUPERINTENDENT",
  "PROJECT SUPERINTENDENT",
  "ASSISTANT SUPERINTENDENT",
  "FOREMAN",
]

interface UnifiedStaffingPlanViewProps {
  activities: StaffingPlanActivity[]
  allocations: StaffingAllocation[]
  months: StaffingPlanMonth[]
  roles: StaffRole[]
  startDate: Date
  endDate: Date
  onActivityUpdate: (activity: StaffingPlanActivity) => void
  onActivitySelect: (activity: StaffingPlanActivity) => void
  onAddActivity: (activity: StaffingPlanActivity) => void
  onActivityDelete?: (activity: StaffingPlanActivity) => void
  onAllocationChange: (roleId: string, monthKey: string, value: number) => void
  selectedActivity?: StaffingPlanActivity
  projectId?: string
  onTimeScaleChange?: (timeScale: TimeScale, periods: Date[]) => void
  timeScale?: TimeScale
  timePeriods?: Date[]
  dateRange?: { start: Date; end: Date }
  onUpdateAllocations?: (allocations: StaffingAllocation[]) => void
}

export default function UnifiedStaffingPlanView({
  activities,
  allocations,
  months,
  roles,
  startDate,
  endDate,
  onActivityUpdate,
  onActivitySelect,
  onAddActivity,
  onActivityDelete,
  onAllocationChange,
  selectedActivity,
  projectId,
  onTimeScaleChange,
  timeScale = "month",
  timePeriods = [],
  dateRange,
  onUpdateAllocations,
}: UnifiedStaffingPlanViewProps) {
  const [focusedCell, setFocusedCell] = useState<{ roleId: string; monthKey: string } | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showScheduleSelector, setShowScheduleSelector] = useState(false)
  const [showNewActivityForm, setShowNewActivityForm] = useState(false)
  const [roleDates, setRoleDates] = useState<Record<string, { startDate: string; endDate: string }>>({})

  // Internal time scale state
  const [internalTimeScale, setInternalTimeScale] = useState<TimeScale>(timeScale || "month")

  // Create unified roles from static list
  const unifiedRoles = useMemo(
    () =>
      STATIC_ROLES.map((roleName, index) => ({
        id: `role-${index}`,
        name: roleName,
        position: roleName,
        laborRate: 0,
        billableRate: 0,
        isActive: true,
      })),
    []
  )

  // Calculate dynamic date range based on activities
  const dynamicDateRange = useMemo(() => {
    if (activities.length === 0) {
      // Default range if no activities
      const now = new Date()
      let start: Date, end: Date

      switch (internalTimeScale) {
        case "week":
          start = startOfWeek(addWeeks(now, -4))
          end = endOfWeek(addWeeks(now, 8))
          break
        case "month":
          start = startOfMonth(addMonths(now, -2))
          end = endOfMonth(addMonths(now, 10))
          break
        case "quarter":
          start = startOfQuarter(addQuarters(now, -2))
          end = endOfQuarter(addQuarters(now, 6))
          break
        case "year":
          start = startOfYear(addYears(now, -1))
          end = endOfYear(addYears(now, 4))
          break
        default:
          start = startOfMonth(addMonths(now, -2))
          end = endOfMonth(addMonths(now, 10))
      }

      return { start, end }
    }

    // Find earliest and latest dates from activities
    const startDates = activities.map((activity) => activity.startDate)
    const endDates = activities.map((activity) => activity.endDate)

    const earliestStart = new Date(Math.min(...startDates.map((d) => d.getTime())))
    const latestEnd = new Date(Math.max(...endDates.map((d) => d.getTime())))

    // Align to time scale boundaries and add some padding
    let alignedStart: Date, alignedEnd: Date

    switch (internalTimeScale) {
      case "week":
        alignedStart = startOfWeek(addWeeks(earliestStart, -2))
        alignedEnd = endOfWeek(addWeeks(latestEnd, 2))
        break
      case "month":
        alignedStart = startOfMonth(addMonths(earliestStart, -1))
        alignedEnd = endOfMonth(addMonths(latestEnd, 1))
        break
      case "quarter":
        alignedStart = startOfQuarter(addQuarters(earliestStart, -1))
        alignedEnd = endOfQuarter(addQuarters(latestEnd, 1))
        break
      case "year":
        alignedStart = startOfYear(addYears(earliestStart, -1))
        alignedEnd = endOfYear(addYears(latestEnd, 1))
        break
      default:
        alignedStart = startOfMonth(addMonths(earliestStart, -1))
        alignedEnd = endOfMonth(addMonths(latestEnd, 1))
    }

    return { start: alignedStart, end: alignedEnd }
  }, [activities, internalTimeScale])

  // Generate time periods based on date range and time scale
  const dynamicTimePeriods = useMemo(() => {
    const { start, end } = dynamicDateRange

    switch (internalTimeScale) {
      case "week":
        return eachWeekOfInterval({ start, end })
      case "month":
        return eachMonthOfInterval({ start, end })
      case "quarter":
        return eachQuarterOfInterval({ start, end })
      case "year":
        return eachYearOfInterval({ start, end })
      default:
        return eachMonthOfInterval({ start, end })
    }
  }, [dynamicDateRange, internalTimeScale])

  // Use dynamic values or fallback to props
  const effectiveTimePeriods = timePeriods && timePeriods.length > 0 ? timePeriods : dynamicTimePeriods
  const effectiveDateRange = dateRange || dynamicDateRange
  const effectiveTimeScale = timeScale || internalTimeScale

  // Handle time scale changes
  const handleTimeScaleChange = (newTimeScale: TimeScale) => {
    setInternalTimeScale(newTimeScale)
    // Notify parent component if callback provided
    if (onTimeScaleChange) {
      // Calculate new periods for the new time scale
      const { start, end } = dynamicDateRange
      let newPeriods: Date[]

      switch (newTimeScale) {
        case "week":
          newPeriods = eachWeekOfInterval({ start, end })
          break
        case "month":
          newPeriods = eachMonthOfInterval({ start, end })
          break
        case "quarter":
          newPeriods = eachQuarterOfInterval({ start, end })
          break
        case "year":
          newPeriods = eachYearOfInterval({ start, end })
          break
        default:
          newPeriods = eachMonthOfInterval({ start, end })
      }

      onTimeScaleChange(newTimeScale, newPeriods)
    }
  }

  // Calculate position and width for gantt bars
  const calculatePosition = (date: Date) => {
    const totalDuration = effectiveDateRange.end.getTime() - effectiveDateRange.start.getTime()
    const dateOffset = date.getTime() - effectiveDateRange.start.getTime()
    return Math.max(0, Math.min(100, (dateOffset / totalDuration) * 100))
  }

  const calculateWidth = (start: Date, end: Date) => {
    const totalDuration = effectiveDateRange.end.getTime() - effectiveDateRange.start.getTime()
    const activityDuration = end.getTime() - start.getTime()
    return Math.max(0.5, Math.min(100, (activityDuration / totalDuration) * 100))
  }

  // Calculate monthly totals based on effective time periods
  const monthlyTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    effectiveTimePeriods.forEach((period) => {
      const monthKey = format(period, "yyyy-MM")
      totals[monthKey] = allocations.reduce((sum, allocation) => {
        return sum + (allocation.monthlyAllocations[monthKey] || 0)
      }, 0)
    })
    return totals
  }, [allocations, effectiveTimePeriods])

  const handleCellChange = (roleId: string, monthKey: string, value: string) => {
    const numericValue = parseFloat(value) || 0
    onAllocationChange(roleId, monthKey, numericValue)
  }

  const handleCellFocus = (roleId: string, monthKey: string) => {
    setFocusedCell({ roleId, monthKey })
  }

  const handleCellBlur = () => {
    setFocusedCell(null)
  }

  const handleDateChange = (roleId: string, field: "startDate" | "endDate", value: string) => {
    setRoleDates((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [field]: value,
      },
    }))
  }

  const getCellValue = (roleId: string, monthKey: string): number => {
    const allocation = allocations.find((alloc) => alloc.roleId === roleId)
    return allocation?.monthlyAllocations[monthKey] || 0
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span className="font-medium text-sm">Schedule Activities & Resource Allocation</span>
            </div>

            {/* Time Scale Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <Select value={effectiveTimeScale} onValueChange={handleTimeScaleChange}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week" className="text-xs">
                    Week
                  </SelectItem>
                  <SelectItem value="month" className="text-xs">
                    Month
                  </SelectItem>
                  <SelectItem value="quarter" className="text-xs">
                    Quarter
                  </SelectItem>
                  <SelectItem value="year" className="text-xs">
                    Year
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Popover open={showAddMenu} onOpenChange={setShowAddMenu}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Activity
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => {
                      setShowScheduleSelector(true)
                      setShowAddMenu(false)
                    }}
                  >
                    <Link2 className="h-3 w-3 mr-2" />
                    Link Schedule Activity
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => {
                      setShowNewActivityForm(true)
                      setShowAddMenu(false)
                    }}
                  >
                    <FileText className="h-3 w-3 mr-2" />
                    Create New Activity
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Unified Scrollable Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Fixed Left Columns */}
        <div className="flex-shrink-0 w-[600px] border-r bg-white dark:bg-gray-950 overflow-y-auto overflow-x-hidden">
          {/* Activities Section */}
          <div className="border-b">
            {/* Activity Header */}
            <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b sticky top-0 z-10 h-10 flex items-center">
              <div className="flex gap-6 text-xs font-medium uppercase tracking-wide">
                <div className="w-48">Activity</div>
                <div className="w-32">Start Date</div>
                <div className="w-32">End Date</div>
              </div>
            </div>

            {/* Activity Rows */}
            <div className="divide-y">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="h-8 flex items-center group bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div className="flex gap-6 items-center w-full px-3 py-1">
                    <div className="w-48 flex items-center gap-2">
                      <div className="font-medium text-xs truncate">{activity.name}</div>
                      {activity.isLinkedToSchedule && (
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          <Link2 className="h-2 w-2 mr-1" />
                          Linked
                        </Badge>
                      )}
                    </div>
                    <div className="w-32 text-xs text-muted-foreground">
                      {format(activity.startDate, "MMM dd, yyyy")}
                    </div>
                    <div className="w-32 text-xs text-muted-foreground">{format(activity.endDate, "MMM dd, yyyy")}</div>
                    {onActivityDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0 text-muted-foreground hover:text-destructive ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          onActivityDelete(activity)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Matrix Section */}
          <div className="divide-y">
            {/* Section Separator */}
            <div className="h-6 bg-gray-100 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 flex items-center">
              <div className="flex items-center w-full px-3 py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="h-3 w-3 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap">
                    RESOURCE ALLOCATION
                  </span>
                </div>
              </div>
            </div>

            {/* Role Rows */}
            {unifiedRoles.map((role) => (
              <div
                key={role.id}
                className="h-8 flex items-center bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <div className="flex gap-6 items-center w-full px-3 py-1">
                  <div className="w-48">
                    <div className="font-medium text-xs">{role.name}</div>
                  </div>
                  <div className="w-32">
                    <Input
                      type="date"
                      value={roleDates[role.id]?.startDate || ""}
                      onChange={(e) => handleDateChange(role.id, "startDate", e.target.value)}
                      className="h-6 text-xs"
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="date"
                      value={roleDates[role.id]?.endDate || ""}
                      onChange={(e) => handleDateChange(role.id, "endDate", e.target.value)}
                      className="h-6 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Monthly Totals Row */}
            <div className="h-8 flex items-center bg-muted/50 border-t">
              <div className="flex gap-6 items-center w-full px-3 py-1">
                <div className="w-48 flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  <span className="text-xs font-medium uppercase tracking-wide">Total</span>
                </div>
                <div className="w-32"></div>
                <div className="w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Scrollable Timeline */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div
            className="min-w-full"
            style={{
              minWidth: `${effectiveTimePeriods.length * 120}px`,
              width: `${Math.max(800, effectiveTimePeriods.length * 120)}px`,
            }}
          >
            {/* Timeline Header */}
            <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 border-b sticky top-0 z-10 h-10 flex items-center">
              <div
                className="flex gap-0"
                style={{
                  minWidth: `${effectiveTimePeriods.length * 120}px`,
                  width: `${effectiveTimePeriods.length * 120}px`,
                }}
              >
                {effectiveTimePeriods.map((period, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 text-center text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide"
                    style={{ width: "120px" }}
                  >
                    {format(
                      period,
                      effectiveTimeScale === "week"
                        ? "MMM dd"
                        : effectiveTimeScale === "month"
                        ? "MMM yyyy"
                        : effectiveTimeScale === "quarter"
                        ? "Qo yyyy"
                        : "yyyy"
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="border-b">
              <div className="divide-y">
                {activities.map((activity) => {
                  const isSelected = selectedActivity?.id === activity.id
                  return (
                    <div
                      key={activity.id}
                      className="px-3 py-1 h-8 flex items-center bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div
                        className="relative h-4"
                        style={{
                          minWidth: `${effectiveTimePeriods.length * 120}px`,
                          width: `${effectiveTimePeriods.length * 120}px`,
                        }}
                      >
                        <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                        <div
                          className={cn(
                            "absolute inset-y-0.5 rounded hover:opacity-80 transition-opacity cursor-pointer group/bar",
                            isSelected && "ring-2 ring-blue-500"
                          )}
                          style={{
                            left: `${calculatePosition(activity.startDate)}%`,
                            width: `${calculateWidth(activity.startDate, activity.endDate)}%`,
                            backgroundColor: activity.color || "#3B82F6",
                          }}
                          onClick={() => onActivitySelect(activity)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                            {differenceInDays(activity.endDate, activity.startDate)}d
                          </div>
                        </div>
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
                          style={{ left: `${calculatePosition(new Date())}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Allocation Matrix Timeline */}
            <div className="divide-y">
              {/* Timeline Section Separator */}
              <div className="h-6 bg-gray-100 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 flex items-center">
                <div
                  className="flex gap-0 px-3 py-1"
                  style={{
                    minWidth: `${effectiveTimePeriods.length * 120}px`,
                    width: `${effectiveTimePeriods.length * 120}px`,
                  }}
                >
                  {/* Empty space to match timeline structure */}
                </div>
              </div>

              {unifiedRoles.map((role) => (
                <div
                  key={role.id}
                  className="h-8 flex items-center bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                >
                  <div
                    className="flex gap-0 px-3 py-1"
                    style={{
                      minWidth: `${effectiveTimePeriods.length * 120}px`,
                      width: `${effectiveTimePeriods.length * 120}px`,
                    }}
                  >
                    {effectiveTimePeriods.map((period, index) => {
                      // Generate month key from the period date
                      const monthKey = format(period, "yyyy-MM")
                      const cellValue = getCellValue(role.id, monthKey)
                      const isFocused = focusedCell?.roleId === role.id && focusedCell?.monthKey === monthKey

                      return (
                        <div
                          key={monthKey}
                          className="flex-shrink-0 flex items-center justify-center px-1"
                          style={{ width: "120px" }}
                        >
                          <Input
                            type="number"
                            min="0"
                            step="0.25"
                            value={cellValue || ""}
                            onChange={(e) => handleCellChange(role.id, monthKey, e.target.value)}
                            onFocus={() => handleCellFocus(role.id, monthKey)}
                            onBlur={handleCellBlur}
                            className={`w-16 h-6 text-center text-xs rounded border ${
                              isFocused ? "ring-2 ring-blue-500" : ""
                            } ${
                              cellValue > 0
                                ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Monthly Totals Row */}
              <div className="h-8 flex items-center bg-muted/50 border-t">
                <div
                  className="flex gap-0 px-3 py-1"
                  style={{
                    minWidth: `${effectiveTimePeriods.length * 120}px`,
                    width: `${effectiveTimePeriods.length * 120}px`,
                  }}
                >
                  {effectiveTimePeriods.map((period, index) => {
                    // Generate month key from the period date
                    const monthKey = format(period, "yyyy-MM")
                    const monthTotal = monthlyTotals[monthKey] || 0

                    return (
                      <div
                        key={monthKey}
                        className="flex-shrink-0 flex items-center justify-center px-1"
                        style={{ width: "120px" }}
                      >
                        <div className="text-xs font-bold bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded border">
                          {monthTotal.toFixed(1)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="flex-shrink-0 flex items-start gap-2 px-4 py-2 bg-muted/50 border-t">
        <Info className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-0.5">Staffing Plan View:</p>
          <p className="text-xs">
            Top section shows project activities with timeline. Bottom section shows resource allocation by role and
            time period. Both sections share the same timeline for easy correlation.
          </p>
        </div>
      </div>
    </div>
  )
}
