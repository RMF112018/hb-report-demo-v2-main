"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Filter,
  Download,
  ZoomIn,
  ZoomOut,
  GripVertical,
  Search,
  SortAsc,
  SortDesc,
  FileText,
  User,
  Users,
  Building,
  Plus,
  MessageSquare,
  Save,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Clock,
  Maximize,
  Minimize,
  CheckCircle,
  Play,
  Pause,
} from "lucide-react"
import scheduleData from "@/data/mock/schedule/schedule.json"
import {
  parseISO,
  isValid,
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
  eachDayOfInterval,
  isAfter,
  isBefore,
} from "date-fns"

interface ProjectScheduleProps {
  userRole?: string
  projectData?: any
  projectId?: string
}

// Interface for schedule activity data
interface ScheduleActivity {
  id: string
  activity_id: string
  activity_name: string
  start_date: string
  end_date: string
  status: string
  activity_type: string
  total_float: number
  primary_base_start_date?: string
  primary_base_end_date?: string
  predecessors?: string[]
}

interface ScheduleGanttItem {
  id: string
  activity: ScheduleActivity
  startDate: Date
  endDate: Date
  position: number
  annotation?: string
}

interface ScheduleGroupedData {
  activityType: string
  activities: ScheduleGanttItem[]
}

interface ScheduleFilters {
  search: string
  status: string
  activityType: string
}

interface ScheduleViewMode {
  viewMode: "week" | "month" | "quarter" | "year"
}

const ProjectSchedule: React.FC<ProjectScheduleProps> = ({ userRole, projectData, projectId }) => {
  const [activities, setActivities] = useState<ScheduleActivity[]>([])
  const [filters, setFilters] = useState<ScheduleFilters>({
    search: "",
    status: "all",
    activityType: "all",
  })
  const [viewMode, setViewMode] = useState<ScheduleViewMode["viewMode"]>("month")
  const [sortField, setSortField] = useState<"name" | "type" | "status">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [annotationModal, setAnnotationModal] = useState<{
    isOpen: boolean
    item: ScheduleGanttItem | null
    annotation: string
  }>({
    isOpen: false,
    item: null,
    annotation: "",
  })

  useEffect(() => {
    const loadedActivities: ScheduleActivity[] = []

    for (const item of scheduleData) {
      const parsedStart = item.start_date ? parseISO(item.start_date) : null
      const parsedEnd = item.end_date ? parseISO(item.end_date) : null

      if (!parsedStart || !parsedEnd || !isValid(parsedStart) || !isValid(parsedEnd)) {
        console.warn("❌ Skipping invalid activity:", item.activity_id, item.start_date, item.end_date)
        continue
      }

      loadedActivities.push({
        id: item.activity_id,
        activity_id: item.activity_id,
        activity_name: item.activity_name,
        start_date: item.start_date,
        end_date: item.end_date,
        status: item.status,
        activity_type: item.activity_type,
        total_float: item.total_float,
        primary_base_start_date: item.primary_base_start_date,
        primary_base_end_date: item.primary_base_end_date,
        predecessors: item.predecessors,
      })
    }

    console.log("✅ Loaded Activities:", loadedActivities.slice(0, 5))
    setActivities(loadedActivities)
  }, [])

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

  // Convert activities to Gantt items
  const ganttItems = useMemo((): ScheduleGanttItem[] => {
    return activities
      .filter((activity) => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          if (
            !activity.activity_name.toLowerCase().includes(searchLower) &&
            !activity.activity_type.toLowerCase().includes(searchLower)
          ) {
            return false
          }
        }
        if (filters.status !== "all" && activity.status !== filters.status) {
          return false
        }
        if (filters.activityType !== "all" && activity.activity_type !== filters.activityType) {
          return false
        }
        return true
      })
      .map((activity, index) => ({
        id: activity.activity_id,
        activity,
        startDate: new Date(activity.start_date),
        endDate: new Date(activity.end_date),
        position: index,
        annotation:
          activity.status === "Completed"
            ? "Completed"
            : activity.status === "In Progress"
            ? "In Progress"
            : activity.status === "Not Started"
            ? "Not Started"
            : undefined,
      }))
      .sort((a, b) => {
        const sortValueA =
          sortField === "name"
            ? a.activity.activity_name
            : sortField === "type"
            ? a.activity.activity_type
            : a.activity.status
        const sortValueB =
          sortField === "name"
            ? b.activity.activity_name
            : sortField === "type"
            ? b.activity.activity_type
            : b.activity.status

        const comparison = sortValueA.localeCompare(sortValueB)
        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [activities, filters, sortField, sortDirection])

  // Group activities by type
  const groupedData = useMemo((): ScheduleGroupedData[] => {
    const groups = ganttItems.reduce((acc, item) => {
      const type = item.activity.activity_type || "Task"
      if (!acc[type]) {
        acc[type] = []
      }
      acc[type].push(item)
      return acc
    }, {} as Record<string, ScheduleGanttItem[]>)

    return Object.entries(groups).map(([type, items]) => ({
      activityType: type,
      activities: items,
    }))
  }, [ganttItems])

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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600"
      case "In Progress":
        return "bg-blue-600"
      case "Not Started":
        return "bg-gray-600"
      default:
        return "bg-gray-500"
    }
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "Not Started":
        return <Pause className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  // Get unique statuses and activity types for filters
  const uniqueStatuses = useMemo(() => {
    return [...new Set(activities.map((activity) => activity.status))].sort()
  }, [activities])

  const uniqueActivityTypes = useMemo(() => {
    return [...new Set(activities.map((activity) => activity.activity_type))].sort()
  }, [activities])

  // Sort handlers
  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Export handlers
  const handleExportPDF = () => {
    console.log("Exporting schedule to PDF...")
  }

  const handleExportExcel = () => {
    console.log("Exporting schedule to Excel...")
  }

  // Annotation handlers
  const handleAddAnnotation = (item: ScheduleGanttItem) => {
    setAnnotationModal({
      isOpen: true,
      item,
      annotation: item.annotation || "",
    })
  }

  const handleSaveAnnotation = () => {
    if (annotationModal.item) {
      console.log(`Saving annotation for ${annotationModal.item.activity.activity_name}: ${annotationModal.annotation}`)
    }
    setAnnotationModal({ isOpen: false, item: null, annotation: "" })
  }

  // Helper components
  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
  }

  if (!activities.length) {
    return <div className="p-4 text-muted-foreground text-sm">Loading schedule...</div>
  }

  return (
    <div className={`w-full space-y-6 ${isFullscreen ? "fixed inset-0 z-[9999] bg-background p-6 overflow-auto" : ""}`}>
      {/* Header with Title and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Project Schedule {isFullscreen && "(Fullscreen)"}
          </h3>
          <Badge variant="outline" className="ml-2">
            {ganttItems.length} activities
          </Badge>
          {isFullscreen && (
            <Badge variant="secondary" className="ml-2">
              Press Esc to exit
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>

          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[99999]">
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
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

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-64"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            <SelectItem value="all">All Statuses</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.activityType}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, activityType: value }))}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            <SelectItem value="all">All Types</SelectItem>
            {uniqueActivityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ search: "", status: "all", activityType: "all" })}
        >
          Clear Filters
        </Button>
      </div>

      {groupedData.length > 0 ? (
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="relative border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex">
              <div className="w-[600px] flex-shrink-0 flex gap-6 text-sm font-medium text-gray-900 dark:text-gray-100">
                <button
                  className="w-48 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                  onClick={() => handleSort("name")}
                >
                  <User className="h-4 w-4" />
                  Activity Name
                  <SortIcon field="name" />
                </button>
                <button
                  className="w-44 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                  onClick={() => handleSort("type")}
                >
                  Type
                  <SortIcon field="type" />
                </button>
                <button
                  className="w-56 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                  onClick={() => handleSort("status")}
                >
                  <Building className="h-4 w-4" />
                  Status
                  <SortIcon field="status" />
                </button>
              </div>
              <div className="flex-1 relative">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
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

          {/* Timeline Rows */}
          <div className="space-y-2 h-[576px] overflow-y-auto">
            {groupedData.map((group) => (
              <div key={group.activityType}>
                {/* Activity Type Header */}
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4" />
                  <span className="text-sm font-medium">{group.activityType}</span>
                  <Badge variant="outline" className="ml-2">
                    {group.activities.length} activities
                  </Badge>
                </div>

                {/* Activities */}
                <div className="ml-4">
                  <div className="space-y-2">
                    {group.activities.map((item) => (
                      <div key={item.id} className="flex items-center group">
                        {/* Activity Info */}
                        <div className="w-[600px] flex-shrink-0 flex gap-6 pr-4">
                          <div className="w-48 flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                              {item.activity.activity_name}
                            </span>
                          </div>
                          <div className="w-44 flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(item.activity.status)}`}></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {item.activity.activity_type}
                            </span>
                          </div>
                          <div className="w-56 flex items-center gap-2">
                            {getStatusIcon(item.activity.status)}
                            <span className="text-xs text-gray-600 dark:text-gray-400">{item.activity.status}</span>
                          </div>
                        </div>

                        {/* Timeline Bar */}
                        <div className="flex-1 relative h-6">
                          <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>

                          {/* Activity Bar */}
                          <div
                            className={`absolute inset-y-1 rounded ${getStatusColor(
                              item.activity.status
                            )} hover:opacity-80 transition-opacity cursor-pointer group/bar`}
                            style={{
                              left: `${calculatePosition(item.startDate)}%`,
                              width: `${calculateWidth(item.startDate, item.endDate)}%`,
                            }}
                            onClick={() => handleAddAnnotation(item)}
                          >
                            <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-semibold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {differenceInDays(item.endDate, item.startDate)}d
                            </div>

                            {item.annotation && (
                              <MessageSquare className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 text-yellow-500" />
                            )}
                          </div>

                          {/* Today Line */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 dark:bg-red-400 z-10"
                            style={{ left: `${calculatePosition(new Date())}%` }}
                          ></div>
                        </div>

                        {/* Actions */}
                        <div className="w-16 flex-shrink-0 text-right">
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">
                            {item.activity.total_float}d float
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Has Annotation</span>
              </div>
              {/* Status Legend */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Not Started</span>
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
          <div className="text-sm">No schedule activities found</div>
          <div className="text-xs">Try adjusting your filters</div>
        </div>
      )}

      {/* Annotation Modal */}
      <Dialog
        open={annotationModal.isOpen}
        onOpenChange={(open) => setAnnotationModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-lg z-[99999]">
          <DialogHeader>
            <DialogTitle>Add Activity Annotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {annotationModal.item && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">{annotationModal.item.activity.activity_name}</div>
                <div className="text-xs text-muted-foreground">
                  {annotationModal.item.activity.activity_type} • {format(annotationModal.item.startDate, "MMM dd")} -{" "}
                  {format(annotationModal.item.endDate, "MMM dd")}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Annotation</label>
              <Textarea
                placeholder="Add notes about this activity..."
                value={annotationModal.annotation}
                onChange={(e) => setAnnotationModal((prev) => ({ ...prev, annotation: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setAnnotationModal({ isOpen: false, item: null, annotation: "" })}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveAnnotation}>
                <Save className="h-4 w-4 mr-1" />
                Save Annotation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectSchedule
