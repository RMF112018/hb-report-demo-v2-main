"use client"

import React, { useState, useMemo, RefObject } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calculator, TrendingUp, DollarSign, Info, Calendar } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import type { StaffingMatrixProps } from "@/types/staff-planning"
import type { TimeScale } from "./StaffingPlanGantt"

interface StaffingPlanMatrixProps extends StaffingMatrixProps {
  timeScale?: TimeScale
  timelineScrollRef?: RefObject<HTMLDivElement | null>
  onTimelineScroll?: () => void
  dateRange?: { start: Date; end: Date }
  timePeriods?: Date[]
}

// Define static roles in specified order
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

export const StaffingPlanMatrix: React.FC<StaffingPlanMatrixProps> = ({
  allocations,
  months,
  roles: _roles, // Ignore passed roles, use static ones
  onAllocationChange,
  readOnly = false,
  timeScale = "month",
  timelineScrollRef,
  onTimelineScroll,
  dateRange,
  timePeriods = [],
}) => {
  const [focusedCell, setFocusedCell] = useState<{ roleId: string; monthKey: string } | null>(null)
  const [roleDates, setRoleDates] = useState<Record<string, { startDate: string; endDate: string }>>({})

  // Create roles from static list
  const roles = useMemo(
    () =>
      STATIC_ROLES.map((roleName, index) => ({
        id: `role-${index}`,
        name: roleName,
        position: roleName,
        laborRate: 0, // Remove labor rate
        billableRate: 0, // Remove billable rate
        isActive: true,
      })),
    []
  )

  // Calculate monthly totals
  const monthlyTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    months.forEach((month) => {
      const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
      totals[monthKey] = allocations.reduce((sum, allocation) => {
        return sum + (allocation.monthlyAllocations[monthKey] || 0)
      }, 0)
    })
    return totals
  }, [allocations, months])

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
    <div>
      {/* Allocation Matrix */}
      <div className="border rounded-lg bg-white dark:bg-gray-950 overflow-hidden flex">
        {months.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground w-full">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2">No Time Periods Available</p>
            <p className="text-sm">
              Add activities to the schedule above to generate time period columns for resource allocation.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed/Sticky Columns Section - 3 columns like Gantt chart */}
            <div className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
              {/* Fixed Header */}
              <div className="border-b bg-gray-50 dark:bg-gray-900 p-2 sticky top-0 z-20">
                <div className="flex gap-4 items-center text-sm font-medium">
                  <div className="w-48">Role</div>
                  <div className="w-32">Start Date</div>
                  <div className="w-32">End Date</div>
                </div>
              </div>

              {/* Fixed Content */}
              <div className="divide-y">
                {roles.map((role) => (
                  <div key={role.id} className="p-3 h-10 flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <div className="flex gap-4 items-center w-full">
                      <div className="w-48">
                        <div className="font-medium text-sm">{role.name}</div>
                      </div>
                      <div className="w-32">
                        <Input
                          type="date"
                          value={roleDates[role.id]?.startDate || ""}
                          onChange={(e) => handleDateChange(role.id, "startDate", e.target.value)}
                          className="h-8 text-xs"
                          disabled={readOnly}
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          type="date"
                          value={roleDates[role.id]?.endDate || ""}
                          onChange={(e) => handleDateChange(role.id, "endDate", e.target.value)}
                          className="h-8 text-xs"
                          disabled={readOnly}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Monthly Totals Row */}
                <div className="p-3 h-10 flex items-center bg-muted/50 border-t-2">
                  <div className="flex gap-4 items-center w-full">
                    <div className="w-48 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">Total</span>
                    </div>
                    <div className="w-32"></div>
                    <div className="w-32"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Timeline Section */}
            <div
              className="flex-1 overflow-x-auto overflow-y-hidden"
              style={{
                scrollbarWidth: "auto",
                msOverflowStyle: "scrollbar",
                minWidth: 0, // Ensure flex child can shrink
              }}
              ref={timelineScrollRef}
              onScroll={onTimelineScroll}
            >
              <div
                style={{
                  width: `${Math.max(800, timePeriods.length * 120)}px`,
                  minWidth: `${Math.max(800, timePeriods.length * 120)}px`,
                }}
              >
                {/* Timeline Header - Fixed width columns */}
                <div className="border-b bg-gray-50 dark:bg-gray-900 p-2 sticky top-0 z-20 h-12 flex items-center">
                  <div className="flex gap-0" style={{ width: `${timePeriods.length * 120}px` }}>
                    {timePeriods.map((period, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 text-center text-xs text-gray-500 dark:text-gray-400 font-medium"
                        style={{ width: "120px" }}
                      >
                        {format(
                          period,
                          timeScale === "week"
                            ? "MMM dd"
                            : timeScale === "month"
                            ? "MMM yyyy"
                            : timeScale === "quarter"
                            ? "Qo yyyy"
                            : "yyyy"
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Content */}
                <div className="divide-y">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="p-3 h-10 flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/50"
                    >
                      <div className="flex gap-0" style={{ width: `${months.length * 120}px` }}>
                        {months.map((month) => {
                          const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
                          const cellValue = getCellValue(role.id, monthKey)
                          const isFocused = focusedCell?.roleId === role.id && focusedCell?.monthKey === monthKey

                          return (
                            <div
                              key={monthKey}
                              className="flex-shrink-0 flex items-center justify-center"
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
                                className={`w-16 h-7 text-center text-xs rounded ${
                                  isFocused ? "ring-2 ring-blue-500" : ""
                                } ${
                                  cellValue > 0
                                    ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                                    : "bg-white dark:bg-gray-800"
                                }`}
                                disabled={readOnly}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {/* Monthly Totals Row */}
                  <div className="p-3 h-10 flex items-center bg-muted/50 border-t-2">
                    <div className="flex gap-0" style={{ width: `${months.length * 120}px` }}>
                      {months.map((month) => {
                        const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
                        const monthTotal = monthlyTotals[monthKey] || 0

                        return (
                          <div
                            key={monthKey}
                            className="flex-shrink-0 flex items-center justify-center"
                            style={{ width: "120px" }}
                          >
                            <div className="text-xs font-bold bg-white dark:bg-gray-800 px-2 py-1 rounded border">
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
          </>
        )}
      </div>

      {/* Help Text */}
      <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg mt-4">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">How to use the allocation matrix:</p>
          <ul className="space-y-1 text-xs">
            <li>• Enter the number of FTE (Full-Time Equivalent) staff needed for each role by time period</li>
            <li>• Values are automatically totaled by time period</li>
            <li>• Set start and end dates for each role to define their involvement period</li>
            <li>• Use 0.5 for half-time positions, 1.0 for full-time, 2.0 for two people, etc.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
