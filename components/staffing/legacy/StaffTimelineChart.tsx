"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, Download, Search, FileText, User, Building, MessageSquare } from "lucide-react"
import { useStaffingStore, type StaffMember, type Project } from "./useStaffingStore"
import { format, addDays, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"

interface StaffTimelineChartProps {
  userRole: "project-executive" | "project-manager"
  title?: string
}

interface TimelineItem {
  id: string
  staffMember: StaffMember
  project: Project
  startDate: Date
  endDate: Date
  annotation?: string
}

export const StaffTimelineChart: React.FC<StaffTimelineChartProps> = ({ userRole, title }) => {
  const { staffMembers, projects, ganttFilters, ganttViewMode, setGanttFilters, setGanttViewMode, selectedProject } =
    useStaffingStore()

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const now = new Date()
    const start = startOfWeek(addDays(now, -30))
    const end = endOfWeek(addDays(now, 90))
    return { start, end }
  }, [])

  // Generate time periods for header
  const timePeriods = useMemo(() => {
    const { start, end } = dateRange
    const days = eachDayOfInterval({ start, end })

    switch (ganttViewMode) {
      case "week":
        return days.filter((_, index) => index % 7 === 0)
      case "month":
        return days.filter((day) => day.getDate() === 1)
      case "quarter":
        return days.filter((day) => day.getDate() === 1 && day.getMonth() % 3 === 0)
      default:
        return days.filter((day) => day.getDate() === 1)
    }
  }, [dateRange, ganttViewMode])

  // Convert staff data to timeline items
  const timelineItems = useMemo((): TimelineItem[] => {
    let items: TimelineItem[] = []

    staffMembers.forEach((staff, staffIndex) => {
      staff.assignments.forEach((assignment, assignmentIndex) => {
        const project = projects.find((p) => p.project_id === assignment.project_id)
        if (!project) return

        // Apply project filter for Project Executive and Project Manager
        if (userRole === "project-executive") {
          const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
          if (!portfolioProjects.includes(assignment.project_id)) return
        }

        if (userRole === "project-manager" && assignment.project_id !== 2525840) return

        // Apply selected project filter
        if (selectedProject && assignment.project_id !== selectedProject) return

        items.push({
          id: `${staff.id}-${assignment.project_id}-${assignmentIndex}`,
          staffMember: staff,
          project,
          startDate: new Date(assignment.startDate),
          endDate: new Date(assignment.endDate),
        })
      })
    })

    // Apply filters
    if (ganttFilters.search) {
      const searchLower = ganttFilters.search.toLowerCase()
      items = items.filter(
        (item) =>
          item.staffMember.name.toLowerCase().includes(searchLower) ||
          item.staffMember.position.toLowerCase().includes(searchLower) ||
          item.project.name.toLowerCase().includes(searchLower)
      )
    }

    if (ganttFilters.position !== "all") {
      items = items.filter((item) => item.staffMember.position === ganttFilters.position)
    }

    if (ganttFilters.project !== "all") {
      items = items.filter((item) => item.project.project_id.toString() === ganttFilters.project)
    }

    // Sort by staff name
    return items.sort((a, b) => a.staffMember.name.localeCompare(b.staffMember.name))
  }, [staffMembers, projects, ganttFilters, userRole, selectedProject])

  // Get unique positions and projects for filters
  const uniquePositions = useMemo(() => {
    return [...new Set(staffMembers.map((staff) => staff.position))].sort()
  }, [staffMembers])

  const uniqueProjects = useMemo(() => {
    const projectIds = new Set(staffMembers.flatMap((staff) => staff.assignments.map((a) => a.project_id)))
    let filteredProjects = projects.filter((p) => projectIds.has(p.project_id))

    // Filter based on role
    if (userRole === "project-executive") {
      const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
      filteredProjects = filteredProjects.filter((p) => portfolioProjects.includes(p.project_id))
    } else if (userRole === "project-manager") {
      filteredProjects = filteredProjects.filter((p) => p.project_id === 2525840)
    }

    return filteredProjects
  }, [staffMembers, projects, userRole])

  // Calculate position and width for timeline bars
  const calculatePosition = React.useCallback(
    (date: Date) => {
      const { start, end } = dateRange
      const totalDays = differenceInDays(end, start)
      const daysSinceStart = differenceInDays(date, start)
      return Math.max(0, Math.min(100, (daysSinceStart / totalDays) * 100))
    },
    [dateRange]
  )

  const calculateWidth = React.useCallback(
    (startDate: Date, endDate: Date) => {
      const { start, end } = dateRange
      const totalDays = differenceInDays(end, start)
      const itemDays = differenceInDays(endDate, startDate)
      return Math.max(1, (itemDays / totalDays) * 100)
    },
    [dateRange]
  )

  // Export handlers (read-only - no modification capabilities)
  const handleExportPDF = () => {
    console.log("Exporting timeline to PDF...")
  }

  const handleExportExcel = () => {
    console.log("Exporting timeline to Excel...")
  }

  const getTitle = () => {
    if (title) return title

    switch (userRole) {
      case "project-executive":
        return "Portfolio Staffing Timeline"
      case "project-manager":
        return "Project Staffing Timeline"
      default:
        return "Staff Timeline"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {getTitle()}
            <Badge variant="outline" className="ml-2">
              {timelineItems.length} assignments
            </Badge>
            <Badge variant="secondary" className="ml-1">
              Read-Only
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Select value={ganttViewMode} onValueChange={(value: any) => setGanttViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff or projects..."
              value={ganttFilters.search}
              onChange={(e) => setGanttFilters({ search: e.target.value })}
              className="w-64"
            />
          </div>

          <Select value={ganttFilters.position} onValueChange={(value) => setGanttFilters({ position: value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Positions" />
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

          {uniqueProjects.length > 1 && (
            <Select value={ganttFilters.project} onValueChange={(value) => setGanttFilters({ project: value })}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map((project) => (
                  <SelectItem key={project.project_id} value={project.project_id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setGanttFilters({ search: "", position: "all", project: "all" })}
          >
            Clear Filters
          </Button>
        </div>

        {timelineItems.length > 0 ? (
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="relative border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex">
                <div className="w-80 flex-shrink-0 grid grid-cols-3 gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Staff Member
                  </div>
                  <div>Position</div>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    Project
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    {timePeriods.map((period, index) => (
                      <div key={index} style={{ left: `${calculatePosition(period)}%` }} className="absolute">
                        {format(
                          period,
                          ganttViewMode === "week" ? "MMM dd" : ganttViewMode === "month" ? "MMM yyyy" : "Qo yyyy"
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Rows */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {timelineItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  {/* Staff Info */}
                  <div className="w-80 flex-shrink-0 grid grid-cols-3 gap-2 pr-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.staffMember.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.staffMember.position}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{item.project.name}</div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="flex-1 relative h-8">
                    <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>

                    {/* Assignment Bar */}
                    <div
                      className="absolute inset-y-1 rounded bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer group"
                      style={{
                        left: `${calculatePosition(item.startDate)}%`,
                        width: `${calculateWidth(item.startDate, item.endDate)}%`,
                      }}
                      title={`${item.staffMember.name} - ${item.project.name}\n${format(
                        item.startDate,
                        "MMM dd"
                      )} - ${format(item.endDate, "MMM dd")}`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {differenceInDays(item.endDate, item.startDate)}d
                      </div>

                      {item.annotation && (
                        <MessageSquare className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500" />
                      )}
                    </div>

                    {/* Today Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
                      style={{ left: `${calculatePosition(new Date())}%` }}
                    ></div>
                  </div>

                  {/* Rate Info */}
                  <div className="w-16 flex-shrink-0 text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400">${item.staffMember.laborRate}/hr</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Assignment</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Has Annotation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Read-Only
                  </Badge>
                  <span className="text-xs text-gray-600 dark:text-gray-400">View Only Access</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing {format(dateRange.start, "MMM dd")} - {format(dateRange.end, "MMM dd, yyyy")}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No staff assignments found</div>
            <div className="text-xs">Try adjusting your filters</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
