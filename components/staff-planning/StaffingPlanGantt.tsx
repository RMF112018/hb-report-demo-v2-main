"use client"

import React, { useState, useEffect, useMemo, useRef, RefObject } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, Plus, Link2, FileText, Search, Loader2, Calendar, Trash2 } from "lucide-react"
import {
  format,
  differenceInDays,
  parseISO,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns"
import type {
  StaffingPlanActivity,
  ScheduleActivity,
  StaffingAllocation,
  StaffingPlanMonth,
} from "@/types/staff-planning"
import { cn } from "@/lib/utils"

interface StaffingPlanGanttProps {
  activities: StaffingPlanActivity[]
  startDate: Date
  endDate: Date
  onActivityUpdate: (activity: StaffingPlanActivity) => void
  onActivitySelect: (activity: StaffingPlanActivity) => void
  onAddActivity: (activity: StaffingPlanActivity) => void
  onActivityDelete?: (activity: StaffingPlanActivity) => void
  selectedActivity?: StaffingPlanActivity
  projectId?: string
  onTimeScaleChange?: (timeScale: TimeScale, periods: Date[]) => void
  timelineScrollRef?: RefObject<HTMLDivElement | null>
  onTimelineScroll?: () => void
  allocations?: StaffingAllocation[]
  planningMonths?: StaffingPlanMonth[]
  onUpdateAllocations?: (allocations: StaffingAllocation[]) => void
}

// Time scale options
export type TimeScale = "week" | "month" | "quarter" | "year"

// Enhanced Link Activity Form Data
interface LinkActivityFormData {
  activityTitle: string
  selectedScheduleActivity: ScheduleActivity | null
  dateReference: "start" | "end" | null
  startDate: Date
  endDate: Date
  roleAllocations: { [roleId: string]: number }
  color: string
}

// Define static roles matching the allocation matrix
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

// Enhanced Schedule Activity Selector Component
const ScheduleActivitySelector = ({
  projectId,
  onSelect,
  onCancel,
  allocations = [],
  planningMonths = [],
}: {
  projectId: string
  onSelect: (formData: LinkActivityFormData) => void
  onCancel: () => void
  allocations?: StaffingAllocation[]
  planningMonths?: StaffingPlanMonth[]
}) => {
  const [scheduleActivities, setScheduleActivities] = useState<ScheduleActivity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ScheduleActivity[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState<LinkActivityFormData>({
    activityTitle: "",
    selectedScheduleActivity: null,
    dateReference: null,
    startDate: new Date(),
    endDate: addDays(new Date(), 30),
    roleAllocations: {},
    color: "#10B981",
  })

  // Create roles list
  const availableRoles = useMemo(() => {
    return STATIC_ROLES.map((roleName, index) => ({
      id: `role-${index}`,
      name: roleName,
      position: roleName,
      laborRate: 0,
      billableRate: 0,
      isActive: true,
    }))
  }, [])

  // Calculate existing allocations for date range
  const calculateExistingAllocations = (startDate: Date, endDate: Date) => {
    const existingAllocations: { [roleId: string]: number } = {}

    // Get planning months that overlap with the date range
    const overlappingMonths = planningMonths.filter((month) => {
      const monthStart = new Date(month.startDate)
      const monthEnd = new Date(month.endDate)

      // Check if month overlaps with the date range
      return monthStart <= endDate && monthEnd >= startDate
    })

    // Calculate average allocation for each role across overlapping months
    availableRoles.forEach((role) => {
      const roleAllocation = allocations.find((alloc) => alloc.roleId === role.id)

      if (roleAllocation && overlappingMonths.length > 0) {
        const totalAllocation = overlappingMonths.reduce((sum, month) => {
          const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
          return sum + (roleAllocation.monthlyAllocations[monthKey] || 0)
        }, 0)

        // Use average allocation across overlapping months
        existingAllocations[role.id] = Math.round(totalAllocation / overlappingMonths.length)
      } else {
        existingAllocations[role.id] = 0
      }
    })

    return existingAllocations
  }

  useEffect(() => {
    const loadScheduleActivities = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/data/mock/schedule/schedule.json")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Schedule data loaded:", data.length, "activities")
        console.log("Filtering for project_id:", projectId)

        // Filter activities by project_id
        const projectActivities = data.filter(
          (activity: ScheduleActivity) => activity.project_id.toString() === projectId
        )

        console.log("Filtered activities:", projectActivities.length, "activities for project", projectId)

        setScheduleActivities(projectActivities)
        setFilteredActivities(projectActivities)
      } catch (error) {
        console.error("Error loading schedule activities:", error)
        setScheduleActivities([])
        setFilteredActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    if (projectId) {
      loadScheduleActivities()
    } else {
      setScheduleActivities([])
      setFilteredActivities([])
    }
  }, [projectId])

  useEffect(() => {
    const filtered = scheduleActivities.filter((activity) =>
      activity.activity_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredActivities(filtered)
  }, [searchTerm, scheduleActivities])

  const handleScheduleActivitySelect = (activity: ScheduleActivity) => {
    setFormData((prev) => ({
      ...prev,
      selectedScheduleActivity: activity,
      dateReference: null, // Reset date reference when new activity is selected
    }))
  }

  const handleDateReferenceSelect = (reference: "start" | "end") => {
    if (!formData.selectedScheduleActivity) return

    const scheduleActivity = formData.selectedScheduleActivity
    const scheduleStartDate = parseISO(scheduleActivity.start_date)
    const scheduleEndDate = parseISO(scheduleActivity.end_date)

    const newStartDate = reference === "start" ? scheduleStartDate : formData.startDate
    const newEndDate = reference === "end" ? scheduleEndDate : formData.endDate

    // Calculate existing allocations for the new date range
    const existingAllocations = calculateExistingAllocations(newStartDate, newEndDate)

    setFormData((prev) => ({
      ...prev,
      dateReference: reference,
      startDate: newStartDate,
      endDate: newEndDate,
      roleAllocations: existingAllocations,
    }))
  }

  const handleRoleAllocationChange = (roleId: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      roleAllocations: {
        ...prev.roleAllocations,
        [roleId]: Math.max(0, value),
      },
    }))
  }

  const handleDateChange = (dateType: "start" | "end", date: Date) => {
    const newStartDate = dateType === "start" ? date : formData.startDate
    const newEndDate = dateType === "end" ? date : formData.endDate

    // Calculate existing allocations for the new date range
    const existingAllocations = calculateExistingAllocations(newStartDate, newEndDate)

    setFormData((prev) => ({
      ...prev,
      [dateType === "start" ? "startDate" : "endDate"]: date,
      roleAllocations: {
        ...existingAllocations,
        ...prev.roleAllocations, // Keep manual overrides
      },
    }))
  }

  const handleSubmit = () => {
    if (!formData.activityTitle.trim()) {
      return // Could add validation feedback here
    }
    onSelect(formData)
  }

  const canSubmit = formData.activityTitle.trim().length > 0

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading schedule activities...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Activity Phase / Summary Title */}
      <div className="space-y-2">
        <Label htmlFor="activity-title">Activity Phase / Summary Title *</Label>
        <Input
          id="activity-title"
          placeholder="Enter activity name (e.g., Foundation Phase, Structural Phase)..."
          value={formData.activityTitle}
          onChange={(e) => setFormData((prev) => ({ ...prev, activityTitle: e.target.value }))}
          className="font-medium"
        />
      </div>

      {/* Schedule Activity Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Link to Schedule Activity</Label>
          {formData.selectedScheduleActivity && (
            <Badge variant="outline" className="text-xs">
              <Link2 className="h-3 w-3 mr-1" />
              Linked
            </Badge>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedule activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Compact Activity List */}
        <ScrollArea className="h-32 border rounded-md">
          <div className="p-2 space-y-1">
            {filteredActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchTerm ? "No activities found" : "No schedule activities available for this project"}
              </p>
            ) : (
              filteredActivities.map((activity, index) => (
                <div
                  key={`${activity.project_id}-${index}`}
                  className={cn(
                    "p-2 text-xs rounded cursor-pointer transition-colors",
                    formData.selectedScheduleActivity?.activity_name === activity.activity_name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  )}
                  onClick={() => handleScheduleActivitySelect(activity)}
                >
                  <div className="font-medium truncate">{activity.activity_name}</div>
                  <div className="text-muted-foreground mt-0.5">
                    {format(parseISO(activity.start_date), "MMM dd")} -{" "}
                    {format(parseISO(activity.end_date), "MMM dd, yyyy")}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Date Reference Selection */}
      {formData.selectedScheduleActivity && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Date Reference</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={formData.dateReference === "start" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateReferenceSelect("start")}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Use Start Date
            </Button>
            <Button
              variant={formData.dateReference === "end" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateReferenceSelect("end")}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Use End Date
            </Button>
          </div>

          {formData.dateReference && (
            <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
              {formData.dateReference === "start"
                ? `Using schedule start date: ${format(
                    parseISO(formData.selectedScheduleActivity.start_date),
                    "MMM dd, yyyy"
                  )}`
                : `Using schedule end date: ${format(
                    parseISO(formData.selectedScheduleActivity.end_date),
                    "MMM dd, yyyy"
                  )}`}
            </div>
          )}
        </div>
      )}

      {/* Manual Date Override */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Date Override (Optional)</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-xs">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={format(formData.startDate, "yyyy-MM-dd")}
              onChange={(e) => handleDateChange("start", parseISO(e.target.value))}
              className="text-xs"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-xs">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={format(formData.endDate, "yyyy-MM-dd")}
              onChange={(e) => handleDateChange("end", parseISO(e.target.value))}
              className="text-xs"
            />
          </div>
        </div>
      </div>

      {/* Role Allocations */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Resource Allocation</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
          {availableRoles.map((role) => (
            <div key={role.id} className="flex items-center justify-between py-1">
              <div className="flex-1">
                <div className="text-xs font-medium">{role.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`role-${role.id}`} className="text-xs">
                  FTE:
                </Label>
                <Input
                  id={`role-${role.id}`}
                  type="number"
                  min="0"
                  step="0.25"
                  value={formData.roleAllocations[role.id] || 0}
                  onChange={(e) => handleRoleAllocationChange(role.id, parseFloat(e.target.value) || 0)}
                  className="w-16 h-7 text-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-2">
        <Label htmlFor="color" className="text-sm font-medium">
          Activity Color
        </Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
          className="w-20 h-8"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          <Link2 className="h-4 w-4 mr-2" />
          Create Activity
        </Button>
      </div>
    </div>
  )
}

// New Activity Form Component
const NewActivityForm = ({
  onSubmit,
  onCancel,
  defaultStartDate,
  defaultEndDate,
}: {
  onSubmit: (activity: Omit<StaffingPlanActivity, "id">) => void
  onCancel: () => void
  defaultStartDate: Date
  defaultEndDate: Date
}) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    description: "",
    color: "#3B82F6",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      onSubmit({
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        color: formData.color,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="activity-name">Activity Name</Label>
        <Input
          id="activity-name"
          placeholder="Enter activity name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={format(formData.startDate, "yyyy-MM-dd")}
            onChange={(e) => setFormData({ ...formData, startDate: parseISO(e.target.value) })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={format(formData.endDate, "yyyy-MM-dd")}
            onChange={(e) => setFormData({ ...formData, endDate: parseISO(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Enter activity description..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-20 h-10"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Activity</Button>
      </div>
    </form>
  )
}

export default function StaffingPlanGantt({
  activities,
  startDate,
  endDate,
  onActivityUpdate,
  onActivitySelect,
  onAddActivity,
  onActivityDelete,
  selectedActivity,
  projectId,
  onTimeScaleChange,
  timelineScrollRef,
  onTimelineScroll,
  allocations = [],
  planningMonths = [],
  onUpdateAllocations,
}: StaffingPlanGanttProps) {
  const [timeScale, setTimeScale] = useState<TimeScale>("month")
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showScheduleSelector, setShowScheduleSelector] = useState(false)
  const [showNewActivityForm, setShowNewActivityForm] = useState(false)

  const fixedScrollRef = useRef<HTMLDivElement>(null)
  const timelineScrollRef_internal = useRef<HTMLDivElement>(null)
  const effectiveTimelineScrollRef = timelineScrollRef || timelineScrollRef_internal

  const handleFixedScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (effectiveTimelineScrollRef.current) {
      effectiveTimelineScrollRef.current.scrollTop = target.scrollTop
    }
  }

  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (fixedScrollRef.current) {
      fixedScrollRef.current.scrollTop = target.scrollTop
    }
    if (onTimelineScroll) {
      onTimelineScroll()
    }
  }

  // Calculate effective date range based on activities (like InteractiveStaffingGantt)
  const dateRange = useMemo(() => {
    if (activities.length === 0) {
      // Default range if no activities
      const now = new Date()
      let start: Date, end: Date

      switch (timeScale) {
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

    // Align to time scale boundaries
    let alignedStart: Date, alignedEnd: Date

    switch (timeScale) {
      case "week":
        alignedStart = startOfWeek(earliestStart)
        alignedEnd = endOfWeek(latestEnd)
        break
      case "month":
        alignedStart = startOfMonth(earliestStart)
        alignedEnd = endOfMonth(latestEnd)
        break
      case "quarter":
        alignedStart = startOfQuarter(earliestStart)
        alignedEnd = endOfQuarter(latestEnd)
        break
      case "year":
        alignedStart = startOfYear(earliestStart)
        alignedEnd = endOfYear(latestEnd)
        break
      default:
        alignedStart = startOfMonth(earliestStart)
        alignedEnd = endOfMonth(latestEnd)
    }

    return { start: alignedStart, end: alignedEnd }
  }, [activities, timeScale])

  // Generate time periods for header (like InteractiveStaffingGantt)
  const timePeriods = useMemo(() => {
    const { start, end } = dateRange
    const periods: Date[] = []

    switch (timeScale) {
      case "week":
        let weekStart = startOfWeek(start)
        while (weekStart <= end) {
          periods.push(weekStart)
          weekStart = addWeeks(weekStart, 1)
        }
        break
      case "month":
        let monthStart = startOfMonth(start)
        while (monthStart <= end) {
          periods.push(monthStart)
          monthStart = addMonths(monthStart, 1)
        }
        break
      case "quarter":
        let quarterStart = startOfQuarter(start)
        while (quarterStart <= end) {
          periods.push(quarterStart)
          quarterStart = addQuarters(quarterStart, 1)
        }
        break
      case "year":
        let yearStart = startOfYear(start)
        while (yearStart <= end) {
          periods.push(yearStart)
          yearStart = addYears(yearStart, 1)
        }
        break
      default:
        let defaultStart = startOfMonth(start)
        while (defaultStart <= end) {
          periods.push(defaultStart)
          defaultStart = addMonths(defaultStart, 1)
        }
    }

    return periods
  }, [dateRange, timeScale])

  // Notify parent component of time scale changes
  useEffect(() => {
    if (onTimeScaleChange) {
      onTimeScaleChange(timeScale, timePeriods)
    }
  }, [timeScale, timePeriods, onTimeScaleChange])

  // Calculate position and width for Gantt bars (like InteractiveStaffingGantt)
  const calculatePosition = (date: Date) => {
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)
    const daysSinceStart = differenceInDays(date, start)
    return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100))
  }

  const calculateWidth = (startDate: Date, endDate: Date) => {
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)
    const itemDays = differenceInDays(endDate, startDate)
    return Math.max(1, (itemDays / totalDays) * 100)
  }

  const handleLinkScheduleActivity = (formData: LinkActivityFormData) => {
    const newActivity: StaffingPlanActivity = {
      id: `activity-${Date.now()}`,
      name: formData.activityTitle,
      startDate: formData.startDate,
      endDate: formData.endDate,
      linkedScheduleActivityId: formData.selectedScheduleActivity
        ? formData.selectedScheduleActivity.id ||
          `${formData.selectedScheduleActivity.project_id}-${formData.selectedScheduleActivity.activity_name}`
        : undefined,
      linkedScheduleActivity: formData.selectedScheduleActivity || undefined,
      isLinkedToSchedule: !!formData.selectedScheduleActivity,
      color: formData.color,
      description: formData.selectedScheduleActivity
        ? `Linked to schedule activity: ${formData.selectedScheduleActivity.activity_name}`
        : undefined,
    }

    // Apply role allocations to the existing allocation matrix
    if (onUpdateAllocations && Object.keys(formData.roleAllocations).length > 0) {
      // Find overlapping planning months
      const overlappingMonths = planningMonths.filter((month) => {
        const monthStart = new Date(month.startDate)
        const monthEnd = new Date(month.endDate)

        // Check if month overlaps with the activity's date range
        return monthStart <= formData.endDate && monthEnd >= formData.startDate
      })

      if (overlappingMonths.length > 0) {
        // Update allocations for each role and overlapping month
        const updatedAllocations = allocations.map((allocation) => {
          const roleAllocation = formData.roleAllocations[allocation.roleId]

          if (roleAllocation && roleAllocation > 0) {
            const updatedMonthlyAllocations = { ...allocation.monthlyAllocations }

            // Apply the new allocation to each overlapping month
            overlappingMonths.forEach((month) => {
              const monthKey = `${month.year}-${month.month.toString().padStart(2, "0")}`
              const existingValue = updatedMonthlyAllocations[monthKey] || 0

              // Add the new allocation to the existing value
              updatedMonthlyAllocations[monthKey] = existingValue + roleAllocation
            })

            return {
              ...allocation,
              monthlyAllocations: updatedMonthlyAllocations,
            }
          }

          return allocation
        })

        // Update the allocations in the parent component
        onUpdateAllocations(updatedAllocations)
      }
    }

    onAddActivity(newActivity)
    setShowScheduleSelector(false)
    setShowAddMenu(false)
  }

  const handleCreateNewActivity = (activityData: Omit<StaffingPlanActivity, "id">) => {
    const newActivity: StaffingPlanActivity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      isLinkedToSchedule: false,
    }

    onAddActivity(newActivity)
    setShowNewActivityForm(false)
    setShowAddMenu(false)
  }

  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Select value={timeScale} onValueChange={(value: TimeScale) => setTimeScale(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Popover open={showAddMenu} onOpenChange={setShowAddMenu}>
              <PopoverTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowScheduleSelector(true)
                      setShowAddMenu(false)
                    }}
                    disabled={!projectId}
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Link Schedule Activity
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowNewActivityForm(true)
                      setShowAddMenu(false)
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Activity
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No activities added yet</p>
          <p className="text-sm">Click "Add Activity" to get started</p>
        </div>

        {/* Dialogs */}
        <Dialog open={showScheduleSelector} onOpenChange={setShowScheduleSelector}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Create Activity from Schedule</DialogTitle>
            </DialogHeader>
            {projectId && (
              <ScheduleActivitySelector
                projectId={projectId}
                onSelect={handleLinkScheduleActivity}
                onCancel={() => setShowScheduleSelector(false)}
                allocations={allocations}
                planningMonths={planningMonths}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showNewActivityForm} onOpenChange={setShowNewActivityForm}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Activity</DialogTitle>
            </DialogHeader>
            <NewActivityForm
              onSubmit={handleCreateNewActivity}
              onCancel={() => setShowNewActivityForm(false)}
              defaultStartDate={dateRange.start}
              defaultEndDate={dateRange.end}
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Select value={timeScale} onValueChange={(value: TimeScale) => setTimeScale(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Popover open={showAddMenu} onOpenChange={setShowAddMenu}>
            <PopoverTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowScheduleSelector(true)
                    setShowAddMenu(false)
                  }}
                  disabled={!projectId}
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Link Schedule Activity
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowNewActivityForm(true)
                    setShowAddMenu(false)
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Activity
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Gantt Chart Container - with horizontal scrolling */}
      <div className="space-y-4">
        {/* Combined Container with synchronized scrolling */}
        <div className="border rounded-lg bg-white dark:bg-gray-950 overflow-hidden">
          <div className="flex">
            {/* Fixed Columns Section */}
            <div className="flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
              {/* Fixed Header */}
              <div className="border-b bg-gray-50 dark:bg-gray-900 p-3 h-12 flex items-center">
                <div className="flex gap-6 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <div className="w-48 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Activity
                  </div>
                  <div className="w-32">Start Date</div>
                  <div className="w-32">End Date</div>
                </div>
              </div>

              {/* Fixed Content - Activity Info */}
              <div className="divide-y max-h-[576px] overflow-y-auto" ref={fixedScrollRef} onScroll={handleFixedScroll}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 h-10 flex items-center group hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <div className="flex gap-6 items-center w-full">
                      <div className="w-48 flex items-center gap-2">
                        <div className="font-medium text-sm truncate">{activity.name}</div>
                        {activity.isLinkedToSchedule && (
                          <Badge variant="outline" className="text-xs">
                            <Link2 className="h-3 w-3 mr-1" />
                            Linked
                          </Badge>
                        )}
                      </div>
                      <div className="w-32 text-sm text-muted-foreground">
                        {format(activity.startDate, "MMM dd, yyyy")}
                      </div>
                      <div className="w-32 text-sm text-muted-foreground">
                        {format(activity.endDate, "MMM dd, yyyy")}
                      </div>

                      {/* Delete Button - appears on hover */}
                      {onActivityDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive ml-2"
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

            {/* Scrollable Timeline Section */}
            <div
              className="flex-1 overflow-x-auto overflow-y-hidden"
              ref={effectiveTimelineScrollRef}
              onScroll={handleTimelineScroll}
              style={{
                scrollbarWidth: "auto",
                msOverflowStyle: "scrollbar",
                minWidth: 0, // Ensure flex child can shrink
              }}
            >
              <div
                style={{
                  width: `${Math.max(800, timePeriods.length * 120)}px`,
                  minWidth: `${Math.max(800, timePeriods.length * 120)}px`,
                }}
              >
                {/* Timeline Header */}
                <div className="border-b bg-gray-50 dark:bg-gray-900 p-3 h-12 flex items-center sticky top-0 z-10">
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
                <div className="divide-y max-h-[576px] overflow-y-auto">
                  {activities.map((activity) => {
                    const isSelected = selectedActivity?.id === activity.id

                    return (
                      <div
                        key={activity.id}
                        className="p-3 h-10 flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <div className="relative h-6" style={{ width: `${timePeriods.length * 120}px` }}>
                          <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>

                          {/* Activity Bar */}
                          <div
                            className={cn(
                              "absolute inset-y-1 rounded hover:opacity-80 transition-opacity cursor-pointer group/bar",
                              isSelected && "ring-2 ring-blue-500"
                            )}
                            style={{
                              left: `${calculatePosition(activity.startDate)}%`,
                              width: `${calculateWidth(activity.startDate, activity.endDate)}%`,
                              backgroundColor: activity.color || "#3B82F6",
                            }}
                            onClick={() => onActivitySelect(activity)}
                          >
                            <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {differenceInDays(activity.endDate, activity.startDate)}d
                            </div>
                          </div>

                          {/* Today Line */}
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
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Showing {format(dateRange.start, "MMM dd")} - {format(dateRange.end, "MMM dd, yyyy")}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showScheduleSelector} onOpenChange={setShowScheduleSelector}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create Activity from Schedule</DialogTitle>
          </DialogHeader>
          {projectId && (
            <ScheduleActivitySelector
              projectId={projectId}
              onSelect={handleLinkScheduleActivity}
              onCancel={() => setShowScheduleSelector(false)}
              allocations={allocations}
              planningMonths={planningMonths}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showNewActivityForm} onOpenChange={setShowNewActivityForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
          </DialogHeader>
          <NewActivityForm
            onSubmit={handleCreateNewActivity}
            onCancel={() => setShowNewActivityForm(false)}
            defaultStartDate={dateRange.start}
            defaultEndDate={dateRange.end}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
