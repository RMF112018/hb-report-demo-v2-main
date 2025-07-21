"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
} from "lucide-react"
import { useStaffingStore, type StaffMember, type Project } from "./useStaffingStore"
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
  eachDayOfInterval,
  isAfter,
  isBefore,
} from "date-fns"

interface InteractiveStaffingGanttProps {
  userRole: "executive" | "project-executive" | "project-manager"
  isReadOnly?: boolean
}

// Base position types with distinct colors
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

interface GanttItem {
  id: string
  staffMember: StaffMember
  project: Project
  startDate: Date
  endDate: Date
  position: number
  annotation?: string
}

interface GroupedGanttData {
  projectExecutive: StaffMember
  projects: {
    project: Project
    assignments: GanttItem[]
  }[]
}

interface NeedingAssignmentItem {
  staffMember: StaffMember
  currentAssignment: {
    project: Project
    endDate: Date
    daysUntilEnd: number
  }
  hasFollowUp: boolean
  urgency: "high" | "medium" | "low"
}

interface AnnotationModal {
  isOpen: boolean
  item: GanttItem | null
  annotation: string
}

interface AssignmentData {
  id: string
  project_id: number | ""
  startDate: string
  endDate: string
  position: string
  comments: string
}

interface AssignmentModal {
  isOpen: boolean
  staffMember: StaffMember | null
  assignments: AssignmentData[]
  isEdit: boolean
  selectedPosition: string
  selectedProject: number | null
  selectedPositionGroup: string
  searchMethod: "all" | "by-date" | null
  searchDate: string
  step: "project" | "position" | "search-method" | "staff" | "assignments"
}

// Position group mappings as specified
const POSITION_GROUPS = {
  "Assistant Project Manager": {
    title: "Assistant Project Manager",
    positions: ["Assistant Project Manager", "Project Administrator"],
  },
  "Project Accountant": {
    title: "Project Accountant",
    positions: ["Project Accountant"],
  },
  "Project Executive": {
    title: "Project Executive",
    positions: ["Project Executive"],
  },
  "Senior Project Manager": {
    title: "Senior Project Manager",
    positions: ["Senior Project Manager"],
  },
  "Project Manager": {
    title: "Project Manager",
    positions: ["Project Manager I", "Project Manager II", "Project Manager III", "Project Manager"],
  },
  "General Superintendent": {
    title: "General Superintendent",
    positions: ["General Superintendent"],
  },
  "Assistant Superintendent": {
    title: "Assistant Superintendent",
    positions: ["Assistant Superintendent", "Foreman"],
  },
  Superintendent: {
    title: "Superintendent",
    positions: ["Superintendent I", "Superintendent II", "Superintendent III", "Superintendent"],
  },
} as const

type PositionGroupKey = keyof typeof POSITION_GROUPS

export const InteractiveStaffingGantt: React.FC<InteractiveStaffingGanttProps> = ({ userRole, isReadOnly = false }) => {
  const {
    staffMembers,
    projects,
    ganttFilters,
    ganttViewMode,
    setGanttFilters,
    setGanttViewMode,
    updateStaffAssignment,
    selectedProject,
  } = useStaffingStore()

  const [sortField, setSortField] = useState<"name" | "position" | "project">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [draggedItem, setDraggedItem] = useState<GanttItem | null>(null)
  const [needingAssignmentFilter, setNeedingAssignmentFilter] = useState<string>("all")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [annotationModal, setAnnotationModal] = useState<AnnotationModal>({
    isOpen: false,
    item: null,
    annotation: "",
  })

  const [assignmentModal, setAssignmentModal] = useState<AssignmentModal>({
    isOpen: false,
    staffMember: null,
    assignments: [],
    isEdit: false,
    selectedPosition: "",
    selectedProject: null,
    selectedPositionGroup: "",
    searchMethod: null,
    searchDate: "",
    step: "position",
  })

  // Save needing assignment filter to localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("staffing-needing-filter", needingAssignmentFilter)
    } catch (error) {
      console.warn("Error saving needing assignment filter:", error)
    }
  }, [needingAssignmentFilter])

  // Load needing assignment filter from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedNeedingFilter = localStorage.getItem("staffing-needing-filter")
      if (savedNeedingFilter) {
        setNeedingAssignmentFilter(savedNeedingFilter)
      }
    } catch (error) {
      console.warn("Error loading needing assignment filter:", error)
    }
  }, [])

  // Handle escape key to exit fullscreen
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isFullscreen])

  // Helper function to create new assignment
  const createNewAssignment = (position = "", project_id: number | "" = ""): AssignmentData => ({
    id: `assignment-${Date.now()}-${Math.random()}`,
    project_id,
    startDate: "",
    endDate: "",
    position,
    comments: "",
  })

  // Helper function to get active projects
  const getActiveProjects = useMemo(() => {
    return projects.filter((project) => project.active)
  }, [projects])

  // Helper function to get staff by position group
  const getStaffByPositionGroup = useCallback(
    (positionGroup: string): StaffMember[] => {
      const groupData = POSITION_GROUPS[positionGroup as PositionGroupKey]
      if (!groupData) return []

      return staffMembers.filter((staff) => {
        const positions = groupData.positions as readonly string[]
        return positions.includes(staff.position)
      })
    },
    [staffMembers]
  )

  // Helper function to get available staff by date
  const getAvailableStaffByDate = useCallback(
    (positionGroup: string, searchDate: string): StaffMember[] => {
      if (!searchDate) return []

      const searchDateTime = new Date(searchDate)
      const thirtyDaysBefore = new Date(searchDate)
      thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30)

      const groupStaff = getStaffByPositionGroup(positionGroup)

      return groupStaff.filter((staff) => {
        // Check if staff has no assignment covering the selected date
        const hasConflictingAssignment = staff.assignments.some((assignment) => {
          const startDate = new Date(assignment.startDate)
          const endDate = new Date(assignment.endDate)
          return searchDateTime >= startDate && searchDateTime <= endDate
        })

        // Check if staff has a current assignment ending < 30 days before selected date
        const hasRecentEndingAssignment = staff.assignments.some((assignment) => {
          const endDate = new Date(assignment.endDate)
          return endDate >= thirtyDaysBefore && endDate <= searchDateTime
        })

        // Return staff who either have no conflicting assignment OR have assignments ending within 30 days
        return !hasConflictingAssignment || hasRecentEndingAssignment
      })
    },
    [getStaffByPositionGroup]
  )

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    const now = new Date()
    let start: Date, end: Date

    switch (ganttViewMode) {
      case "week":
        // Show 12 weeks (3 months) - 4 weeks before, 8 weeks after
        start = startOfWeek(addWeeks(now, -4))
        end = endOfWeek(addWeeks(now, 8))
        break
      case "month":
        // Show 12 months - 2 months before, 10 months after
        start = startOfMonth(addMonths(now, -2))
        end = endOfMonth(addMonths(now, 10))
        break
      case "quarter":
        // Show 8 quarters (2 years) - 2 quarters before, 6 quarters after
        start = startOfQuarter(addQuarters(now, -2))
        end = endOfQuarter(addQuarters(now, 6))
        break
      case "year":
        // Show 5 years - 1 year before, 4 years after
        start = startOfYear(addYears(now, -1))
        end = endOfYear(addYears(now, 4))
        break
      default:
        // Fallback to month view
        start = startOfMonth(addMonths(now, -2))
        end = endOfMonth(addMonths(now, 10))
    }

    return { start, end }
  }, [ganttViewMode])

  // Generate time periods for header
  const timePeriods = useMemo(() => {
    const { start, end } = dateRange
    const periods: Date[] = []

    switch (ganttViewMode) {
      case "week":
        // Generate weekly periods
        let weekStart = startOfWeek(start)
        while (weekStart <= end) {
          periods.push(weekStart)
          weekStart = addWeeks(weekStart, 1)
        }
        break
      case "month":
        // Generate monthly periods
        let monthStart = startOfMonth(start)
        while (monthStart <= end) {
          periods.push(monthStart)
          monthStart = addMonths(monthStart, 1)
        }
        break
      case "quarter":
        // Generate quarterly periods
        let quarterStart = startOfQuarter(start)
        while (quarterStart <= end) {
          periods.push(quarterStart)
          quarterStart = addQuarters(quarterStart, 1)
        }
        break
      case "year":
        // Generate yearly periods
        let yearStart = startOfYear(start)
        while (yearStart <= end) {
          periods.push(yearStart)
          yearStart = addYears(yearStart, 1)
        }
        break
      default:
        // Fallback to monthly
        let defaultStart = startOfMonth(start)
        while (defaultStart <= end) {
          periods.push(defaultStart)
          defaultStart = addMonths(defaultStart, 1)
        }
    }

    return periods
  }, [dateRange, ganttViewMode])

  // Get current active Project Executives for portfolio projects
  const getCurrentPEsForProjects = useMemo(() => {
    const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
    const peToProjects = new Map<string, number[]>()
    const today = new Date()

    staffMembers.forEach((staff) => {
      if (staff.position === "Project Executive") {
        staff.assignments.forEach((assignment) => {
          if (portfolioProjects.includes(assignment.project_id) && assignment.role === "PE") {
            const assignmentEnd = new Date(assignment.endDate)
            // Only include current/active assignments (not ended)
            if (isAfter(assignmentEnd, today)) {
              if (!peToProjects.has(staff.id)) {
                peToProjects.set(staff.id, [])
              }
              peToProjects.get(staff.id)!.push(assignment.project_id)
            }
          }
        })
      }
    })

    return peToProjects
  }, [staffMembers])

  // Convert staff data to grouped Gantt structure
  const groupedGanttData = useMemo((): GroupedGanttData[] => {
    const peToProjectsMap = getCurrentPEsForProjects
    const result: GroupedGanttData[] = []

    peToProjectsMap.forEach((projectIds, peId) => {
      const pe = staffMembers.find((s) => s.id === peId)
      if (!pe) return

      const peData: GroupedGanttData = {
        projectExecutive: pe,
        projects: [],
      }

      // Group by projects for this PE
      projectIds.forEach((projectId) => {
        const project = projects.find((p) => p.project_id === projectId)
        if (!project) return

        // Get all assignments for this project
        const projectAssignments: GanttItem[] = []

        staffMembers.forEach((staff, staffIndex) => {
          staff.assignments.forEach((assignment, assignmentIndex) => {
            if (assignment.project_id !== projectId) return

            // Apply role-based filtering
            if (userRole === "project-executive") {
              const portfolioProjects = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]
              if (!portfolioProjects.includes(assignment.project_id)) return
            }

            if (userRole === "project-manager" && assignment.project_id !== 2525840) return

            // Apply selected project filter
            if (selectedProject && assignment.project_id !== selectedProject) return

            // Apply filters
            if (ganttFilters.search) {
              const searchLower = ganttFilters.search.toLowerCase()
              const matchesSearch =
                staff.name.toLowerCase().includes(searchLower) ||
                staff.position.toLowerCase().includes(searchLower) ||
                project.name.toLowerCase().includes(searchLower)
              if (!matchesSearch) return
            }

            if (ganttFilters.position !== "all" && staff.position !== ganttFilters.position) return

            if (ganttFilters.project !== "all" && project.project_id.toString() !== ganttFilters.project) return

            projectAssignments.push({
              id: `${staff.id}-${assignment.project_id}-${assignmentIndex}`,
              staffMember: staff,
              project,
              startDate: new Date(assignment.startDate),
              endDate: new Date(assignment.endDate),
              position: staffIndex * 100 + assignmentIndex,
            })
          })
        })

        // Sort assignments by start date within project
        projectAssignments.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

        if (projectAssignments.length > 0) {
          peData.projects.push({
            project,
            assignments: projectAssignments,
          })
        }
      })

      if (peData.projects.length > 0) {
        result.push(peData)
      }
    })

    return result
  }, [staffMembers, projects, ganttFilters, userRole, selectedProject, getCurrentPEsForProjects])

  // Calculate staff needing assignments
  const needingAssignments = useMemo((): NeedingAssignmentItem[] => {
    const today = new Date()
    const ninetyDaysFromNow = addDays(today, 90)
    const result: NeedingAssignmentItem[] = []

    staffMembers.forEach((staff) => {
      // Find current assignments ending within 90 days
      staff.assignments.forEach((assignment) => {
        const endDate = new Date(assignment.endDate)

        // Check if assignment ends within 90 days and after today
        if (isAfter(endDate, today) && isBefore(endDate, ninetyDaysFromNow)) {
          const daysUntilEnd = differenceInDays(endDate, today)

          // Check if there's a follow-up assignment
          const hasFollowUp = staff.assignments.some((otherAssignment) => {
            const otherStart = new Date(otherAssignment.startDate)
            return (
              isAfter(otherStart, endDate) ||
              (isAfter(otherStart, addDays(endDate, -7)) && assignment !== otherAssignment)
            )
          })

          if (!hasFollowUp) {
            const project = projects.find((p) => p.project_id === assignment.project_id)
            if (project) {
              // Determine urgency
              let urgency: "high" | "medium" | "low" = "low"
              if (daysUntilEnd < 30) urgency = "high"
              else if (daysUntilEnd < 60) urgency = "medium"

              result.push({
                staffMember: staff,
                currentAssignment: {
                  project,
                  endDate,
                  daysUntilEnd,
                },
                hasFollowUp,
                urgency,
              })
            }
          }
        }
      })
    })

    // Apply position filter
    const filtered =
      needingAssignmentFilter === "all"
        ? result
        : result.filter((item) => item.staffMember.position === needingAssignmentFilter)

    // Sort by urgency and days until end
    return filtered.sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 }
      const urgencyCompare = urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
      if (urgencyCompare !== 0) return urgencyCompare
      return a.currentAssignment.daysUntilEnd - b.currentAssignment.daysUntilEnd
    })
  }, [staffMembers, projects, needingAssignmentFilter])

  // Get unique positions and projects for filters
  const uniquePositions = useMemo(() => {
    return [...new Set(staffMembers.map((staff) => staff.position))].sort()
  }, [staffMembers])

  const uniqueProjects = useMemo(() => {
    const projectIds = new Set(staffMembers.flatMap((staff) => staff.assignments.map((a) => a.project_id)))
    return projects.filter((p) => projectIds.has(p.project_id))
  }, [staffMembers, projects])

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

  // Drag handlers
  const handleDragStart = (item: GanttItem) => {
    if (isReadOnly || userRole !== "executive") return
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStaffId: string) => {
    e.preventDefault()
    if (!draggedItem || isReadOnly || userRole !== "executive") return

    // Update assignment logic would go here
    // For demo purposes, we'll just show a success message
    console.log(`Moving assignment from ${draggedItem.staffMember.name} to staff ${targetStaffId}`)
    setDraggedItem(null)
  }

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
    console.log("Exporting to PDF...") // Would implement actual PDF export
  }

  const handleExportExcel = () => {
    console.log("Exporting to Excel...") // Would implement actual Excel export
  }

  // Annotation handlers
  const handleAddAnnotation = (item: GanttItem) => {
    setAnnotationModal({
      isOpen: true,
      item,
      annotation: item.annotation || "",
    })
  }

  const handleSaveAnnotation = () => {
    if (annotationModal.item) {
      // Update annotation logic would go here
      console.log(`Saving annotation for ${annotationModal.item.staffMember.name}: ${annotationModal.annotation}`)
    }
    setAnnotationModal({ isOpen: false, item: null, annotation: "" })
  }

  // Assignment management handlers
  const handleCreateAssignment = () => {
    setAssignmentModal({
      isOpen: true,
      staffMember: null,
      assignments: [],
      isEdit: false,
      selectedPosition: "",
      selectedProject: null,
      selectedPositionGroup: "",
      searchMethod: null,
      searchDate: "",
      step: "project",
    })
  }

  const handleEditStaffAssignment = (staffMember: StaffMember) => {
    if (userRole !== "executive") return

    // Convert existing assignments to modal format
    const existingAssignments = staffMember.assignments.map((assignment, index) => ({
      id: `existing-${index}`,
      project_id: assignment.project_id,
      startDate: format(new Date(assignment.startDate), "yyyy-MM-dd"),
      endDate: format(new Date(assignment.endDate), "yyyy-MM-dd"),
      position: staffMember.position,
      comments: "",
    }))

    setAssignmentModal({
      isOpen: true,
      staffMember,
      assignments: existingAssignments.length > 0 ? existingAssignments : [createNewAssignment(staffMember.position)],
      isEdit: true,
      selectedPosition: staffMember.position,
      selectedProject: null,
      selectedPositionGroup: "",
      searchMethod: null,
      searchDate: "",
      step: "assignments",
    })
  }

  // Assignment manipulation within modal
  const addAssignment = () => {
    setAssignmentModal((prev) => ({
      ...prev,
      assignments: [...prev.assignments, createNewAssignment(prev.staffMember?.position || "")],
    }))
  }

  const removeAssignment = (assignmentId: string) => {
    setAssignmentModal((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.id !== assignmentId),
    }))
  }

  const updateAssignment = (assignmentId: string, updates: Partial<AssignmentData>) => {
    setAssignmentModal((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === assignmentId ? { ...a, ...updates } : a)),
    }))
  }

  // Position and staff selection handlers
  const handlePositionSelect = (position: string) => {
    setAssignmentModal((prev) => ({
      ...prev,
      selectedPositionGroup: position,
      step: "search-method",
    }))
  }

  const handleProjectSelect = (projectId: string) => {
    setAssignmentModal((prev) => ({
      ...prev,
      selectedProject: Number(projectId),
      step: "position",
    }))
  }

  const handleSearchMethodSelect = (method: "all" | "by-date") => {
    setAssignmentModal((prev) => ({
      ...prev,
      searchMethod: method,
      step: method === "all" ? "staff" : "search-method",
    }))
  }

  const handleSearchDateSelect = (date: string) => {
    setAssignmentModal((prev) => ({
      ...prev,
      searchDate: date,
    }))
  }

  const handleDateSearch = () => {
    if (assignmentModal.searchDate) {
      setAssignmentModal((prev) => ({
        ...prev,
        step: "staff",
      }))
    }
  }

  const handleStaffMemberSelect = (staffMemberId: string) => {
    const staff = staffMembers.find((s) => s.id === staffMemberId)
    if (!staff) return

    const initialAssignment = createNewAssignment(staff.position, assignmentModal.selectedProject || "")

    // Pre-fill start date if search by date was used
    if (assignmentModal.searchMethod === "by-date" && assignmentModal.searchDate) {
      initialAssignment.startDate = assignmentModal.searchDate
    }

    setAssignmentModal((prev) => ({
      ...prev,
      staffMember: staff,
      assignments: [initialAssignment],
      step: "assignments",
    }))
  }

  const goBackToStaffSelection = () => {
    setAssignmentModal((prev) => ({
      ...prev,
      step: "staff",
    }))
  }

  const goBackToSearchMethod = () => {
    setAssignmentModal((prev) => ({
      ...prev,
      step: "search-method",
    }))
  }

  const goBackToPositionSelection = () => {
    setAssignmentModal((prev) => ({
      ...prev,
      step: "position",
    }))
  }

  const goBackToProjectSelection = () => {
    setAssignmentModal((prev) => ({
      ...prev,
      step: "project",
    }))
  }

  // Get staff members filtered by position
  const getFilteredStaffMembers = (position: string) => {
    return staffMembers.filter((staff) => staff.position === position)
  }

  const handleSaveAssignment = () => {
    if (!assignmentModal.staffMember || assignmentModal.assignments.length === 0) return

    // Convert modal assignments back to staff format
    const updatedAssignments = assignmentModal.assignments.map((assignment) => ({
      project_id: assignment.project_id as number,
      role: assignment.position === "Project Executive" ? "PE" : "Staff",
      startDate: `${assignment.startDate}T00:00:00Z`,
      endDate: `${assignment.endDate}T23:59:59Z`,
    }))

    const updatedStaff: StaffMember = {
      ...assignmentModal.staffMember,
      assignments: updatedAssignments,
    }

    updateStaffAssignment(assignmentModal.staffMember.id, updatedStaff)
    setAssignmentModal({
      isOpen: false,
      staffMember: null,
      assignments: [],
      isEdit: false,
      selectedPosition: "",
      selectedProject: null,
      selectedPositionGroup: "",
      searchMethod: null,
      searchDate: "",
      step: "position",
    })
  }

  // Financial calculation helper
  const calculateFinancialMetrics = (staffMember: StaffMember | null, projectId: number | "") => {
    if (!staffMember || !projectId) return null

    const laborRate = staffMember.laborRate
    const laborBurden = laborRate * 0.35 // 35% burden
    const totalLaborCost = laborRate + laborBurden
    const billableRate = staffMember.billableRate

    return {
      laborRate,
      laborBurden,
      totalLaborCost,
      billableRate,
    }
  }

  // Helper components
  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
  }

  const getBasePositionType = (position: string): string => {
    // Extract base position type for color mapping
    const baseTypes = [
      "Project Executive",
      "Project Manager",
      "Superintendent",
      "Project Administrator",
      "Project Accountant",
      "Project Engineer",
      "Field Engineer",
      "Safety Manager",
      "Quality Manager",
      "Foreman",
      "Estimator",
      "Scheduler",
    ]

    for (const baseType of baseTypes) {
      if (position.includes(baseType)) {
        return baseType
      }
    }

    // If no match found, return the original position
    return position
  }

  const getPositionColor = (position: string): string => {
    const baseType = getBasePositionType(position)
    return BASE_POSITION_COLORS[baseType] || "bg-gray-500"
  }

  return (
    <div className={`w-full space-y-6 ${isFullscreen ? "fixed inset-0 z-[9999] bg-background p-6 overflow-auto" : ""}`}>
      {/* Header with Title and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Staff Management {isFullscreen && "(Fullscreen)"}
          </h3>
          <Badge variant="outline" className="ml-2">
            {groupedGanttData.length} assignments
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

          <Select value={ganttViewMode} onValueChange={(value: any) => setGanttViewMode(value)}>
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

          {userRole === "executive" && !isReadOnly && (
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" onClick={handleCreateAssignment}>
                <Plus className="h-4 w-4 mr-1" />
                Create Assignment
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          )}
          {userRole === "executive" && isReadOnly && (
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
          )}
        </div>
      </div>
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
          <SelectContent className="z-[99999]">
            <SelectItem value="all">All Positions</SelectItem>
            {uniquePositions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ganttFilters.project} onValueChange={(value) => setGanttFilters({ project: value })}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project.project_id} value={project.project_id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setGanttFilters({ search: "", position: "all", project: "all" })}
        >
          Clear Filters
        </Button>
      </div>

      {groupedGanttData.length > 0 ? (
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
                  Staff Member
                  <SortIcon field="name" />
                </button>
                <button
                  className="w-44 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                  onClick={() => handleSort("position")}
                >
                  Position
                  <SortIcon field="position" />
                </button>
                <button
                  className="w-56 flex items-center gap-1 hover:bg-muted/50 p-2 rounded justify-start"
                  onClick={() => handleSort("project")}
                >
                  <Building className="h-4 w-4" />
                  Project
                  <SortIcon field="project" />
                </button>
              </div>
              <div className="flex-1 relative">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  {timePeriods.map((period, index) => (
                    <div key={index} style={{ left: `${calculatePosition(period)}%` }} className="absolute">
                      {format(
                        period,
                        ganttViewMode === "week"
                          ? "MMM dd"
                          : ganttViewMode === "month"
                          ? "MMM yyyy"
                          : ganttViewMode === "quarter"
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
            {groupedGanttData.map((peData) => (
              <div key={peData.projectExecutive.id}>
                {/* Project Executive Header */}
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{peData.projectExecutive.name}</span>
                  <Badge variant="outline" className="ml-2">
                    PE
                  </Badge>
                </div>

                {/* Project Executive Projects */}
                <div className="ml-4">
                  <div className="space-y-2">
                    {peData.projects.map((projectData) => (
                      <div key={projectData.project.project_id}>
                        {/* Project Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4" />
                          <span className="text-sm font-medium">{projectData.project.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {projectData.assignments.length} staff
                          </Badge>
                        </div>

                        {/* Project Assignments */}
                        <div className="ml-6">
                          <div className="space-y-2">
                            {projectData.assignments.map((item) => (
                              <div key={item.id} className="flex items-center group">
                                {/* Staff Info */}
                                <div
                                  className="w-[600px] flex-shrink-0 flex gap-6 pr-4"
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, item.staffMember.id)}
                                >
                                  <div className="w-48 flex items-center gap-2">
                                    {userRole === "executive" && !isReadOnly && (
                                      <div
                                        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                                        draggable
                                        onDragStart={() => handleDragStart(item)}
                                      >
                                        <GripVertical className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                    {userRole === "executive" && !isReadOnly ? (
                                      <button
                                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate cursor-pointer"
                                        onClick={() => handleEditStaffAssignment(item.staffMember)}
                                      >
                                        {item.staffMember.name}
                                      </button>
                                    ) : (
                                      <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                                        {item.staffMember.name}
                                      </span>
                                    )}
                                  </div>
                                  <div className="w-44 flex items-center gap-2">
                                    <div
                                      className={`w-2.5 h-2.5 rounded-full ${getPositionColor(
                                        item.staffMember.position
                                      )}`}
                                    ></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                      {item.staffMember.position}
                                    </span>
                                  </div>
                                  <div className="w-56 text-xs text-gray-600 dark:text-gray-400">
                                    {item.project.name}
                                  </div>
                                </div>

                                {/* Timeline Bar */}
                                <div className="flex-1 relative h-6">
                                  <div className="absolute inset-y-0 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>

                                  {/* Assignment Bar */}
                                  <div
                                    className={`absolute inset-y-1 rounded ${getPositionColor(
                                      item.staffMember.position
                                    )} hover:opacity-80 transition-opacity cursor-pointer group/bar`}
                                    style={{
                                      left: `${calculatePosition(item.startDate)}%`,
                                      width: `${calculateWidth(item.startDate, item.endDate)}%`,
                                    }}
                                    onClick={() =>
                                      userRole === "executive" && !isReadOnly
                                        ? handleEditStaffAssignment(item.staffMember)
                                        : handleAddAnnotation(item)
                                    }
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
                                    ${item.staffMember.laborRate}/hr
                                  </div>
                                </div>
                              </div>
                            ))}
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
              {/* Position Legend */}
              {(() => {
                // Get unique base position types from current data
                const baseTypes = [...new Set(uniquePositions.map((pos) => getBasePositionType(pos)))]
                  .sort()
                  .slice(0, 8) // Show up to 8 base types

                return baseTypes.map((baseType) => (
                  <div key={baseType} className="flex items-center gap-1">
                    <div className={`w-3 h-3 ${getPositionColor(baseType)} rounded`}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{baseType}</span>
                  </div>
                ))
              })()}
              {userRole === "executive" && !isReadOnly && (
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Drag to Reassign</span>
                </div>
              )}
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

      {/* Annotation Modal */}
      <Dialog
        open={annotationModal.isOpen}
        onOpenChange={(open) => setAnnotationModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-lg z-[99999]">
          <DialogHeader>
            <DialogTitle>Add Assignment Annotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {annotationModal.item && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">{annotationModal.item.staffMember.name}</div>
                <div className="text-xs text-muted-foreground">
                  {annotationModal.item.project.name} • {format(annotationModal.item.startDate, "MMM dd")} -{" "}
                  {format(annotationModal.item.endDate, "MMM dd")}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-2 block">Annotation</label>
              <Textarea
                placeholder="Add notes about this assignment..."
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

      {/* Assignment Modal */}
      <Dialog
        open={assignmentModal.isOpen}
        onOpenChange={(open) => setAssignmentModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[99999]">
          <DialogHeader>
            <DialogTitle>
              {assignmentModal.isEdit
                ? "Edit Staff Assignments"
                : assignmentModal.step === "project"
                ? "Select Project"
                : assignmentModal.step === "position"
                ? "Select Position Group"
                : assignmentModal.step === "search-method"
                ? "Choose Search Method"
                : assignmentModal.step === "staff"
                ? "Select Staff Member"
                : "Create Staff Assignments"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Step 1: Project Selection */}
            {assignmentModal.step === "project" && !assignmentModal.isEdit && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Project</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the project for this assignment. This will be used to determine billable rate context.
                  </p>
                  <Select value={assignmentModal.selectedProject?.toString() || ""} onValueChange={handleProjectSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search or select a project..." />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      {getActiveProjects.map((project) => (
                        <SelectItem key={project.project_id} value={project.project_id.toString()}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{project.name}</span>
                            <span className="text-xs text-muted-foreground">
                              #{project.project_number} • ${project.contract_value.toLocaleString()}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Position Group Selection */}
            {assignmentModal.step === "position" && !assignmentModal.isEdit && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={goBackToProjectSelection}>
                    ← Back to Project
                  </Button>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {getActiveProjects.find((p) => p.project_id === assignmentModal.selectedProject)?.name}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Position Group</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose the position group type you want to assign someone to.
                  </p>
                  <Select value={assignmentModal.selectedPositionGroup} onValueChange={handlePositionSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Search or select a position group..." />
                    </SelectTrigger>
                    <SelectContent className="z-[99999]">
                      {Object.entries(POSITION_GROUPS).map(([key, group]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{group.title}</span>
                            <span className="text-xs text-muted-foreground">
                              Includes: {group.positions.join(", ")}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Search Method Selection */}
            {assignmentModal.step === "search-method" && !assignmentModal.isEdit && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={goBackToPositionSelection}>
                    ← Back to Position
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {POSITION_GROUPS[assignmentModal.selectedPositionGroup as PositionGroupKey]?.title}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Choose Staff Search Method</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select how you want to search for available staff members.
                  </p>

                  <div className="space-y-3">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        assignmentModal.searchMethod === "all" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleSearchMethodSelect("all")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                          {assignmentModal.searchMethod === "all" && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            Search All{" "}
                            {POSITION_GROUPS[assignmentModal.selectedPositionGroup as PositionGroupKey]?.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            View all staff members in the selected position group
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                        assignmentModal.searchMethod === "by-date" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setAssignmentModal((prev) => ({ ...prev, searchMethod: "by-date" }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                          {assignmentModal.searchMethod === "by-date" && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Search by Assignment Start Date</div>
                          <div className="text-sm text-muted-foreground">
                            Find staff available for a specific start date
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {assignmentModal.searchMethod === "by-date" && (
                    <div className="mt-4">
                      <label className="text-sm font-medium mb-2 block">Select Assignment Start Date</label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={assignmentModal.searchDate}
                          onChange={(e) => handleSearchDateSelect(e.target.value)}
                          className="flex-1"
                          placeholder="Select start date..."
                        />
                        <Button onClick={handleDateSearch} disabled={!assignmentModal.searchDate} className="px-6">
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </div>
                      {assignmentModal.searchDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          This will show staff who are available on{" "}
                          {new Date(assignmentModal.searchDate).toLocaleDateString()}
                          or have assignments ending within 30 days before this date.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Staff Member Selection */}
            {assignmentModal.step === "staff" && !assignmentModal.isEdit && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={goBackToSearchMethod}>
                    ← Back to Search Method
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {POSITION_GROUPS[assignmentModal.selectedPositionGroup as PositionGroupKey]?.title}
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="text-sm text-muted-foreground">
                      {assignmentModal.searchMethod === "all" ? "All Staff" : `Available ${assignmentModal.searchDate}`}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Staff Member</label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose which staff member to assign from the{" "}
                    {POSITION_GROUPS[assignmentModal.selectedPositionGroup as PositionGroupKey]?.title.toLowerCase()}{" "}
                    group.
                  </p>

                  {(() => {
                    const availableStaff =
                      assignmentModal.searchMethod === "all"
                        ? getStaffByPositionGroup(assignmentModal.selectedPositionGroup)
                        : getAvailableStaffByDate(assignmentModal.selectedPositionGroup, assignmentModal.searchDate)

                    if (availableStaff.length === 0) {
                      return (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <div className="text-sm">
                            {assignmentModal.searchMethod === "all"
                              ? "No staff members found for this position group"
                              : "No available staff found for the selected date"}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div className="border rounded-lg">
                        {/* Staff Grid Header */}
                        <div className="grid grid-cols-9 gap-4 p-3 bg-muted/50 text-sm font-medium border-b">
                          <div>Staff Name</div>
                          <div>Position</div>
                          <div>Salary</div>
                          <div>Burden</div>
                          <div>Total Rate</div>
                          <div>Billable Rate</div>
                          <div>DISC</div>
                          <div>Strengths</div>
                          <div>Weaknesses</div>
                        </div>

                        {/* Staff Grid Rows */}
                        <div className="max-h-96 overflow-y-auto">
                          {availableStaff.map((staff) => {
                            const burden = staff.laborRate * 0.35 // 35% burden
                            const totalRate = staff.laborRate + burden
                            const selectedProject = getActiveProjects.find(
                              (p) => p.project_id === assignmentModal.selectedProject
                            )

                            return (
                              <div
                                key={staff.id}
                                className="grid grid-cols-9 gap-4 p-3 hover:bg-muted/30 cursor-pointer border-b transition-colors"
                                onClick={() => handleStaffMemberSelect(staff.id)}
                              >
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-muted-foreground">{staff.position}</div>
                                <div className="text-sm">${staff.laborRate.toFixed(2)}/hr</div>
                                <div className="text-sm">${burden.toFixed(2)}/hr</div>
                                <div className="text-sm font-medium">${totalRate.toFixed(2)}/hr</div>
                                <div className="text-sm text-blue-600 dark:text-blue-400">
                                  ${staff.billableRate.toFixed(2)}/hr
                                </div>
                                <div className="text-sm">
                                  <Badge variant="outline" className="text-xs">
                                    {staff.discProfile || "N/A"}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {staff.strengths.slice(0, 2).join(", ")}
                                  {staff.strengths.length > 2 && "..."}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {staff.weaknesses.slice(0, 2).join(", ")}
                                  {staff.weaknesses.length > 2 && "..."}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Step 3: Assignment Details (or Edit Mode) */}
            {(assignmentModal.step === "assignments" || assignmentModal.isEdit) && (
              <>
                {!assignmentModal.isEdit && (
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={goBackToStaffSelection}>
                      ← Back to Staff
                    </Button>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${getPositionColor(assignmentModal.selectedPosition)} rounded`}></div>
                      <span className="font-medium">{assignmentModal.staffMember?.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{assignmentModal.selectedPosition}</span>
                    </div>
                  </div>
                )}

                {/* Staff Member Selection (Edit Mode Only) */}
                {assignmentModal.isEdit && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Staff Member</label>
                    <Select
                      value={assignmentModal.staffMember?.id || ""}
                      onValueChange={(value) => {
                        const staff = staffMembers.find((s) => s.id === value)
                        if (staff) {
                          setAssignmentModal((prev) => ({
                            ...prev,
                            staffMember: staff,
                            assignments: prev.assignments.map((a) => ({ ...a, position: staff.position })),
                          }))
                        }
                      }}
                      disabled={assignmentModal.isEdit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999]">
                        {staffMembers.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name} - {staff.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Assignments List */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">Assignments ({assignmentModal.assignments.length})</h4>
                    <Button onClick={addAssignment} size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Assignment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {assignmentModal.assignments.map((assignment, index) => (
                      <div key={assignment.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Assignment {index + 1}</h5>
                          {assignmentModal.assignments.length > 1 && (
                            <Button variant="outline" size="sm" onClick={() => removeAssignment(assignment.id)}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Position */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Position</label>
                            <Select
                              value={assignment.position}
                              onValueChange={(value) => updateAssignment(assignment.id, { position: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999]">
                                {uniquePositions.map((position) => (
                                  <SelectItem key={position} value={position}>
                                    {position}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Project */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">Project</label>
                            <Select
                              value={assignment.project_id.toString()}
                              onValueChange={(value) => updateAssignment(assignment.id, { project_id: Number(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999]">
                                {projects.map((project) => (
                                  <SelectItem key={project.project_id} value={project.project_id.toString()}>
                                    {project.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Start Date</label>
                            <Input
                              type="date"
                              value={assignment.startDate}
                              onChange={(e) => updateAssignment(assignment.id, { startDate: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">End Date</label>
                            <Input
                              type="date"
                              value={assignment.endDate}
                              onChange={(e) => updateAssignment(assignment.id, { endDate: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Comments */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Comments</label>
                          <Textarea
                            placeholder="Add any notes about this assignment..."
                            value={assignment.comments}
                            onChange={(e) => updateAssignment(assignment.id, { comments: e.target.value })}
                            rows={2}
                          />
                        </div>

                        {/* Financial Information */}
                        {assignmentModal.staffMember && assignment.project_id && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <h6 className="text-sm font-medium mb-2">Financial Information</h6>
                            {(() => {
                              const metrics = calculateFinancialMetrics(
                                assignmentModal.staffMember,
                                assignment.project_id
                              )
                              if (!metrics) return null

                              return (
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <div className="text-muted-foreground">Labor Rate</div>
                                    <div className="font-medium">${metrics.laborRate.toFixed(2)}/hr</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Labor Burden (35%)</div>
                                    <div className="font-medium">${metrics.laborBurden.toFixed(2)}/hr</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Total Labor Cost</div>
                                    <div className="font-medium">${metrics.totalLaborCost.toFixed(2)}/hr</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Billable Rate</div>
                                    <div className="font-medium text-blue-600 dark:text-blue-400">
                                      ${metrics.billableRate.toFixed(2)}/hr
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <div className="text-muted-foreground">Profit Margin</div>
                                    <div
                                      className={`font-medium ${
                                        metrics.billableRate > metrics.totalLaborCost
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {(
                                        ((metrics.billableRate - metrics.totalLaborCost) / metrics.billableRate) *
                                        100
                                      ).toFixed(1)}
                                      % (${(metrics.billableRate - metrics.totalLaborCost).toFixed(2)}/hr)
                                    </div>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  setAssignmentModal({
                    isOpen: false,
                    staffMember: null,
                    assignments: [],
                    isEdit: false,
                    selectedPosition: "",
                    selectedProject: null,
                    selectedPositionGroup: "",
                    searchMethod: null,
                    searchDate: "",
                    step: "position",
                  })
                }
              >
                Cancel
              </Button>

              {/* Show Save button only on assignment step */}
              {(assignmentModal.step === "assignments" || assignmentModal.isEdit) && (
                <Button onClick={handleSaveAssignment}>
                  <Save className="h-4 w-4 mr-1" />
                  Save Assignments ({assignmentModal.assignments.filter((a) => a.project_id && a.position).length})
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
