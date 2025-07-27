"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, Download, Search, SortAsc, SortDesc, User, Users, RefreshCw } from "lucide-react"
import { useStaffingStore, type StaffMember, type Project } from "@/app/dashboard/staff-planning/store/useStaffingStore"
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addQuarters,
  addYears,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ProjectStaffingGanttProps {
  /** Project ID to filter staffing data */
  projectId: string | number
  /** Project data for context */
  projectData?: any
  /** User role for permission control */
  userRole: string
  /** Whether the component is in read-only mode */
  isReadOnly?: boolean
  /** Additional CSS classes */
  className?: string
  /** Height constraint for the component */
  height?: string
}

interface GanttItem {
  id: string
  staffMember: StaffMember
  project: Project
  startDate: Date
  endDate: Date
  allocation: number // Percentage of time allocated to project
  position: number
}

type ViewMode = "week" | "month" | "quarter" | "year"
type SortField = "name" | "position" | "startDate" | "endDate" | "allocation"
type SortDirection = "asc" | "desc"

// Base position colors
const BASE_POSITION_COLORS: Record<string, string> = {
  "Project Executive": "bg-violet-600",
  "Project Manager": "bg-blue-600",
  Superintendent: "bg-green-600",
  "Project Administrator": "bg-cyan-600",
  "Project Accountant": "bg-amber-600",
  "Project Engineer": "bg-indigo-600",
  "Field Engineer": "bg-emerald-600",
  "Safety Manager": "bg-red-600",
  "Quality Manager": "bg-purple-600",
  Foreman: "bg-orange-600",
  Estimator: "bg-pink-600",
  Scheduler: "bg-slate-600",
}

/**
 * Project-specific Staffing Gantt Chart Component
 */
export const ProjectStaffingGantt: React.FC<ProjectStaffingGanttProps> = ({
  projectId,
  projectData,
  userRole,
  isReadOnly = false,
  className,
  height = "500px",
}) => {
  const { toast } = useToast()

  // Staffing store
  const { staffMembers, projects, ganttViewMode, setGanttViewMode, updateStaffAssignment, reinitializeData } =
    useStaffingStore()

  // Debug: Log store state and reinitialize if needed
  useEffect(() => {
    console.log(`ProjectStaffingGantt: Store state - ${staffMembers.length} staff members, ${projects.length} projects`)
    if (staffMembers.length === 0) {
      console.warn(`ProjectStaffingGantt: No staff members in store! Reinitializing data...`)
      reinitializeData()
    }
  }, [staffMembers.length, projects.length, reinitializeData])

  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [searchTerm, setSearchTerm] = useState("")
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Convert projectId to number for consistency
  const numericProjectId = useMemo(() => {
    let converted: number

    if (typeof projectId === "string") {
      converted = parseInt(projectId, 10)
      if (isNaN(converted) || converted <= 0) {
        console.error(`ProjectStaffingGantt: Invalid projectId string "${projectId}", cannot convert to number`)
        return null
      }
    } else if (typeof projectId === "number") {
      converted = projectId
      if (isNaN(converted) || converted <= 0) {
        console.error(`ProjectStaffingGantt: Invalid projectId number ${projectId}`)
        return null
      }
    } else {
      console.error(`ProjectStaffingGantt: Invalid projectId type ${typeof projectId}:`, projectId)
      return null
    }

    return converted
  }, [projectId])

  // Get project data
  const project = useMemo(() => {
    if (numericProjectId === null) return null

    return (
      projects.find((p) => p.project_id === numericProjectId) ||
      (projectData
        ? { project_id: numericProjectId, name: projectData.name || `Project ${projectId}`, ...projectData }
        : null)
    )
  }, [projects, numericProjectId, projectData, projectId])

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const now = new Date()
    let start: Date, end: Date

    switch (viewMode) {
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
  }, [viewMode])

  // Generate time periods for header
  const timePeriods = useMemo(() => {
    const { start, end } = dateRange
    const periods: Date[] = []

    switch (viewMode) {
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
  }, [dateRange, viewMode])

  // Calculate position and width for Gantt bars
  const calculatePosition = useCallback(
    (date: Date) => {
      const { start, end } = dateRange
      const totalDays = differenceInDays(end, start)
      const daysSinceStart = differenceInDays(date, start)
      return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100))
    },
    [dateRange]
  )

  const calculateWidth = useCallback(
    (startDate: Date, endDate: Date) => {
      const { start, end } = dateRange
      const totalDays = differenceInDays(end, start)
      const itemDays = differenceInDays(endDate, startDate)
      return Math.max(1, (itemDays / totalDays) * 100)
    },
    [dateRange]
  )

  // Get base position type
  const getBasePositionType = (position: string): string => {
    const cleanPosition = position.replace(/\s+(I{1,3}|IV|V|VI{0,3}|\d+)$/, "")

    const positionMap: Record<string, string> = {
      "Project Executive": "Project Executive",
      "Project Manager": "Project Manager",
      "Senior Project Manager": "Project Manager",
      "Assistant Project Manager": "Project Manager",
      Superintendent: "Superintendent",
      "General Superintendent": "Superintendent",
      "Assistant Superintendent": "Superintendent",
      "Project Administrator": "Project Administrator",
      "Project Accountant": "Project Accountant",
      "Project Engineer": "Project Engineer",
      "Field Engineer": "Field Engineer",
      "Safety Manager": "Safety Manager",
      "Quality Manager": "Quality Manager",
      Foreman: "Foreman",
      "General Foreman": "Foreman",
      Estimator: "Estimator",
      Scheduler: "Scheduler",
    }

    return positionMap[cleanPosition] || cleanPosition
  }

  // Get position color
  const getPositionColor = (position: string): string => {
    const baseType = getBasePositionType(position)
    return BASE_POSITION_COLORS[baseType] || "bg-gray-500"
  }

  // Generate allocation percentage (mock data for now)
  const generateAllocation = (staffMember: StaffMember, assignment: any): number => {
    // Mock allocation based on position and project
    const baseAllocations: Record<string, number> = {
      "Project Executive": 25,
      "Project Manager": 100,
      "Senior Project Manager": 100,
      "Assistant Project Manager": 100,
      Superintendent: 100,
      "General Superintendent": 75,
      "Assistant Superintendent": 100,
      "Project Administrator": 100,
      "Project Accountant": 50,
      "Project Engineer": 100,
      "Field Engineer": 100,
      "Safety Manager": 75,
      "Quality Manager": 50,
      Foreman: 100,
      Estimator: 25,
      Scheduler: 50,
    }

    const baseType = getBasePositionType(staffMember.position)
    const baseAllocation = baseAllocations[baseType] || 100

    // Add some variation in increments of 5 (+/- 25%)
    const variationOptions = [-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25]
    const variation = variationOptions[Math.floor(Math.random() * variationOptions.length)]
    const result = baseAllocation + variation

    // Ensure result is within bounds and in increments of 5
    return Math.max(5, Math.min(100, Math.round(result / 5) * 5))
  }

  // Convert staff data to gantt items
  const ganttItems = useMemo((): GanttItem[] => {
    const items: GanttItem[] = []

    if (numericProjectId === null) return []

    const targetProjectIds = [numericProjectId]

    staffMembers.forEach((staff, staffIndex) => {
      staff.assignments.forEach((assignment, assignmentIndex) => {
        if (!targetProjectIds.includes(assignment.project_id)) return

        const assignmentProject = projects.find((p) => p.project_id === assignment.project_id) || {
          project_id: assignment.project_id,
          name: `Project ${assignment.project_id}`,
          project_stage_name: "Active",
          contract_value: 0,
          project_number: `P${assignment.project_id}`,
          active: true,
        }

        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase()
          const matchesSearch =
            staff.name.toLowerCase().includes(searchLower) ||
            staff.position.toLowerCase().includes(searchLower) ||
            assignmentProject.name.toLowerCase().includes(searchLower)
          if (!matchesSearch) return
        }

        // Apply position filter
        if (positionFilter !== "all" && staff.position !== positionFilter) return

        items.push({
          id: `${staff.id}-${assignment.project_id}-${assignmentIndex}`,
          staffMember: staff,
          project: assignmentProject,
          startDate: new Date(assignment.startDate),
          endDate: new Date(assignment.endDate),
          allocation: generateAllocation(staff, assignment),
          position: staffIndex * 100 + assignmentIndex,
        })
      })
    })

    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "name":
          comparison = a.staffMember.name.localeCompare(b.staffMember.name)
          break
        case "position":
          comparison = a.staffMember.position.localeCompare(b.staffMember.position)
          break
        case "startDate":
          comparison = a.startDate.getTime() - b.startDate.getTime()
          break
        case "endDate":
          comparison = a.endDate.getTime() - b.endDate.getTime()
          break
        case "allocation":
          comparison = a.allocation - b.allocation
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return items
  }, [numericProjectId, staffMembers, projects, searchTerm, positionFilter, sortField, sortDirection])

  // Get unique positions for filtering
  const uniquePositions = useMemo(() => {
    const positions = ganttItems.map((item) => item.staffMember.position)
    return [...new Set(positions)].sort()
  }, [ganttItems])

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    setGanttViewMode(mode)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Exporting staffing data for ${project?.name || "project"}`,
    })
  }

  // Handle refresh
  const handleRefresh = () => {
    reinitializeData()
    toast({
      title: "Data Refreshed",
      description: "Staffing timeline has been updated",
    })
  }

  // Auto-scroll to current date
  useEffect(() => {
    const scrollToToday = () => {
      if (typeof window !== "undefined") {
        const container = document.getElementById("project-timeline-scroll")
        if (container) {
          const todayPosition = calculatePosition(new Date())
          const containerWidth = container.clientWidth
          const scrollPosition = Math.max(0, (todayPosition / 100) * container.scrollWidth - containerWidth / 2)
          container.scrollLeft = scrollPosition
        }
      }
    }

    const timer = setTimeout(scrollToToday, 100)
    return () => clearTimeout(timer)
  }, [viewMode, calculatePosition])

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
  }

  // Handle invalid projectId case
  if (numericProjectId === null) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Invalid Project ID</div>
            <div className="text-xs">Unable to parse project ID: {projectId}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!project && !projectData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">Project not found</div>
            <div className="text-xs">Project ID: {projectId}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full min-w-0 max-w-full overflow-hidden", isReadOnly && "opacity-50 cursor-not-allowed")}>
      <Card className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg">Project Staffing Timeline</CardTitle>
              <Badge variant="outline" className="ml-2">
                {project?.name || projectData?.name || `Project ${projectId}`}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-3 min-h-0 overflow-hidden">
          {/* Controls */}
          <div className="flex items-center justify-between w-full flex-shrink-0">
            <div className="flex items-center gap-3">
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={viewMode} onValueChange={(value) => handleViewModeChange(value as ViewMode)}>
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
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40"
              />
            </div>
          </div>

          {/* Gantt Chart */}
          <div className="flex-1 border rounded-lg overflow-hidden min-h-0 w-full">
            {ganttItems.length > 0 ? (
              <div className="h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="border-b bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                  <div className="flex">
                    {/* Fixed columns */}
                    <div className="flex bg-gray-50 dark:bg-gray-900 border-r">
                      <button
                        className="flex items-center gap-1 hover:bg-muted/50 px-3 py-2 border-r text-xs font-medium w-44"
                        onClick={() => handleSort("name")}
                      >
                        <User className="h-3 w-3" />
                        Staff Member
                        <SortIcon field="name" />
                      </button>
                      <button
                        className="flex items-center gap-1 hover:bg-muted/50 px-3 py-2 border-r text-xs font-medium w-36"
                        onClick={() => handleSort("position")}
                      >
                        Position
                        <SortIcon field="position" />
                      </button>
                      <button
                        className="flex items-center gap-1 hover:bg-muted/50 px-3 py-2 border-r text-xs font-medium w-20"
                        onClick={() => handleSort("startDate")}
                      >
                        Start
                        <SortIcon field="startDate" />
                      </button>
                      <button
                        className="flex items-center gap-1 hover:bg-muted/50 px-3 py-2 border-r text-xs font-medium w-20"
                        onClick={() => handleSort("endDate")}
                      >
                        End
                        <SortIcon field="endDate" />
                      </button>
                      <button
                        className="flex items-center gap-1 hover:bg-muted/50 px-3 py-2 text-xs font-medium w-20"
                        onClick={() => handleSort("allocation")}
                      >
                        Allocation
                        <SortIcon field="allocation" />
                      </button>
                    </div>

                    {/* Timeline header */}
                    <div className="flex-1 relative overflow-hidden">
                      <div className="px-3 py-2 h-10 relative">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          {timePeriods.map((period, index) => (
                            <div key={index} style={{ left: `${calculatePosition(period)}%` }} className="absolute">
                              {format(
                                period,
                                viewMode === "week"
                                  ? "MMM dd"
                                  : viewMode === "month"
                                  ? "MMM yyyy"
                                  : viewMode === "quarter"
                                  ? "Qo yyyy"
                                  : "yyyy"
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full flex">
                    {/* Fixed columns content */}
                    <div className="bg-white dark:bg-gray-950 border-r overflow-y-auto">
                      <div className="space-y-0">
                        {ganttItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex hover:bg-muted/50 border-b border-gray-100 dark:border-gray-800"
                          >
                            <div className="flex items-center px-3 py-2 border-r w-44">
                              <span className="text-xs font-medium truncate">{item.staffMember.name}</span>
                            </div>
                            <div className="flex items-center px-3 py-2 border-r w-36">
                              <div
                                className={`w-2 h-2 rounded-full mr-2 ${getPositionColor(item.staffMember.position)}`}
                              ></div>
                              <span className="text-xs truncate">{item.staffMember.position}</span>
                            </div>
                            <div className="flex items-center px-3 py-2 border-r w-20">
                              <span className="text-xs text-muted-foreground">{format(item.startDate, "MMM dd")}</span>
                            </div>
                            <div className="flex items-center px-3 py-2 border-r w-20">
                              <span className="text-xs text-muted-foreground">{format(item.endDate, "MMM dd")}</span>
                            </div>
                            <div className="flex items-center px-3 py-2 w-20">
                              <span className="text-xs font-medium">{item.allocation}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline content */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto" id="project-timeline-scroll">
                      <div className="space-y-0" style={{ minWidth: "600px" }}>
                        {ganttItems.map((item) => (
                          <div key={item.id} className="relative h-8 border-b border-gray-100 dark:border-gray-800">
                            {/* Timeline background */}
                            <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900"></div>

                            {/* Assignment bar */}
                            <div
                              className={`absolute inset-y-1 rounded ${getPositionColor(
                                item.staffMember.position
                              )} hover:opacity-80 transition-opacity cursor-pointer`}
                              style={{
                                left: `${calculatePosition(item.startDate)}%`,
                                width: `${calculateWidth(item.startDate, item.endDate)}%`,
                              }}
                              title={`${item.staffMember.name}: ${format(item.startDate, "MMM dd")} - ${format(
                                item.endDate,
                                "MMM dd"
                              )} (${item.allocation}% allocation)`}
                            >
                              <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-medium">
                                {item.allocation}%
                              </div>
                            </div>

                            {/* Today line */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                              style={{ left: `${calculatePosition(new Date())}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-3 flex-shrink-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {(() => {
                        const baseTypes = [...new Set(uniquePositions.map((pos) => getBasePositionType(pos)))]
                          .sort()
                          .slice(0, 6)

                        return baseTypes.map((baseType) => (
                          <div key={baseType} className="flex items-center gap-1">
                            <div className={`w-2 h-2 ${getPositionColor(baseType)} rounded`}></div>
                            <span>{baseType}</span>
                          </div>
                        ))
                      })()}
                    </div>
                    <div>
                      {ganttItems.length} assignments • {format(dateRange.start, "MMM dd")} -{" "}
                      {format(dateRange.end, "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">No staff assignments found</div>
                  <div className="text-xs">Try adjusting your filters</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
