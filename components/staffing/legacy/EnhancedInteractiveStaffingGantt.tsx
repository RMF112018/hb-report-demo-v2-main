"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { format, parseISO, addDays, differenceInDays, startOfQuarter, endOfQuarter, isAfter, isBefore } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Users,
  Building,
  User,
  Search,
  Plus,
  FileText,
  Download,
  GripVertical,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Brain,
  Star,
  UserCheck,
  Lightbulb,
  MessageSquare,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react"
import { useStaffingStore } from "@/components/staffing/legacy/useStaffingStore"
import { BehavioralTeamCompatibility } from "@/components/staffing/BehavioralTeamCompatibility"
import { TeamCompatibilityEngine } from "@/components/staffing/TeamCompatibilityEngine"

interface EnhancedInteractiveStaffingGanttProps {
  userRole: "executive" | "project-executive" | "project-manager"
  isReadOnly?: boolean
}

// Use the StaffMember type from the store
import type { StaffMember as BaseStaffMember } from "@/components/staffing/legacy/useStaffingStore"

// Extended StaffMember type with behavioral profile
interface StaffMember extends BaseStaffMember {
  behavioralProfile?: {
    discProfile: {
      type: string
      primaryStyle: string
      strengths: string[]
      communicationTips: string[]
    }
    integrus360: {
      leadershipType: string
      color: string
      profile: {
        leadershipStrengths: string[]
      }
    }
    teamCompatibility: {
      overallScore: number
    }
  }
}

interface Project {
  project_id: number
  name: string
  project_stage_name: string
  active: boolean
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
  step: "overview" | "staff-selection" | "compatibility-analysis" | "assignment-config" | "confirmation"
  selectedStaffMembers: StaffMember[]
  compatibilityData: {
    teamScore: number
    diversityScore: number
    leadershipBalance: number
    communicationBalance: number
    riskFactors: string[]
    recommendations: string[]
  } | null
  assignmentDetails: {
    startDate: string
    endDate: string
    comments: string
    priority: "high" | "medium" | "low"
  }
}

const POSITION_GROUPS = {
  "Project Executive": ["Project Executive"],
  "Project Manager": ["Project Manager I", "Project Manager II", "Senior Project Manager"],
  Superintendent: ["Superintendent I", "Superintendent II", "Superintendent III", "General Superintendent"],
  "Assistant Superintendent": ["Assistant Superintendent"],
  "Project Engineer": ["Project Engineer", "PE"],
  "Project Administrator": ["Project Administrator"],
  "Project Accountant": ["Project Accountant"],
} as const

type PositionGroupKey = keyof typeof POSITION_GROUPS

export const EnhancedInteractiveStaffingGantt: React.FC<EnhancedInteractiveStaffingGanttProps> = ({
  userRole,
  isReadOnly = false,
}) => {
  const { staffMembers, projects, updateStaffAssignment, selectedProject } = useStaffingStore()
  const [ganttViewMode, setGanttViewMode] = useState<"week" | "month" | "quarter" | "year">("quarter")
  const [ganttFilters, setGanttFilters] = useState({
    search: "",
    position: "all",
    project: "all",
  })
  const [sortField, setSortField] = useState<"name" | "position" | "project">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
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
    step: "overview",
    selectedStaffMembers: [],
    compatibilityData: null,
    assignmentDetails: {
      startDate: "",
      endDate: "",
      comments: "",
      priority: "medium",
    },
  })

  // Filter state for Step 2
  const [staffFilters, setStaffFilters] = useState({
    position: "all",
    discProfile: "all",
    integrusProfile: "all",
  })
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [aiRecommendationsOpen, setAiRecommendationsOpen] = useState(false)
  const [selectedPositions, setSelectedPositions] = useState<string[]>([])
  const [aiReasoning, setAiReasoning] = useState<string[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<StaffMember[]>([])
  const [isAiProcessing, setIsAiProcessing] = useState(false)

  // Close filter menu when clicking outside
  useEffect(() => {
    if (!filterMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".filter-menu-container")) {
        setFilterMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [filterMenuOpen])

  // Date range calculation
  const dateRange = useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 9, 0)
    return { start, end }
  }, [])

  // Time periods calculation
  const timePeriods = useMemo(() => {
    const periods = []
    const { start, end } = dateRange
    const totalDays = differenceInDays(end, start)

    if (ganttViewMode === "quarter") {
      for (let i = 0; i < 8; i++) {
        const quarterStart = startOfQuarter(addDays(start, i * 90))
        periods.push(quarterStart)
      }
    } else if (ganttViewMode === "month") {
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(start.getFullYear(), start.getMonth() + i, 1)
        periods.push(monthStart)
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

  // Enhanced workflow functions
  const handleNextStep = () => {
    setAssignmentModal((prev) => {
      switch (prev.step) {
        case "overview":
          return { ...prev, step: "staff-selection" }
        case "staff-selection":
          return { ...prev, step: "compatibility-analysis" }
        case "compatibility-analysis":
          return { ...prev, step: "assignment-config" }
        case "assignment-config":
          return { ...prev, step: "confirmation" }
        default:
          return prev
      }
    })
  }

  const handlePreviousStep = () => {
    setAssignmentModal((prev) => {
      switch (prev.step) {
        case "staff-selection":
          return { ...prev, step: "overview" }
        case "compatibility-analysis":
          return { ...prev, step: "staff-selection" }
        case "assignment-config":
          return { ...prev, step: "compatibility-analysis" }
        case "confirmation":
          return { ...prev, step: "assignment-config" }
        default:
          return prev
      }
    })
  }

  const handleStaffMemberSelect = (staffMemberId: string) => {
    const staff = staffMembers.find((s) => s.id === staffMemberId)
    if (!staff) return

    setAssignmentModal((prev) => ({
      ...prev,
      selectedStaffMembers: [...prev.selectedStaffMembers, staff],
    }))
  }

  const handleRemoveStaffMember = (staffMemberId: string) => {
    setAssignmentModal((prev) => ({
      ...prev,
      selectedStaffMembers: prev.selectedStaffMembers.filter((s) => s.id !== staffMemberId),
    }))
  }

  const calculateTeamCompatibility = () => {
    if (assignmentModal.selectedStaffMembers.length === 0) return

    // Simplified compatibility calculation without behavioral data
    const candidate = assignmentModal.selectedStaffMembers[0]
    const existingTeam = assignmentModal.selectedStaffMembers.slice(1)

    // Calculate basic team metrics
    const teamScore = 75 // Default score since no behavioral data available
    const diversityScore = 80 // Default diversity score
    const leadershipBalance = 85 // Default leadership balance
    const communicationBalance = 80 // Default communication balance

    // Generate basic recommendations
    const riskFactors: string[] = []
    const recommendations: string[] = [
      "Staff assignment ready for review",
      "Consider team dynamics during project execution",
      "Monitor collaboration effectiveness",
    ]

    setAssignmentModal((prev) => ({
      ...prev,
      compatibilityData: {
        teamScore,
        diversityScore,
        leadershipBalance,
        communicationBalance,
        riskFactors,
        recommendations,
      },
    }))
  }

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
      step: "overview",
      selectedStaffMembers: [],
      compatibilityData: null,
      assignmentDetails: {
        startDate: "",
        endDate: "",
        comments: "",
        priority: "medium",
      },
    })
  }

  const handleCompleteAssignment = () => {
    if (!assignmentModal.selectedStaffMembers.length) return

    // Process the assignment
    console.log("Assignment completed:", assignmentModal)

    // Close modal
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
      step: "overview",
      selectedStaffMembers: [],
      compatibilityData: null,
      assignmentDetails: {
        startDate: "",
        endDate: "",
        comments: "",
        priority: "medium",
      },
    })
  }

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDragStart = (item: GanttItem) => {
    // Drag functionality for reassignment
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStaffId: string) => {
    // Drop functionality for reassignment
  }

  const handleEditStaffAssignment = (staffMember: StaffMember) => {
    // Edit assignment functionality
  }

  const handleAddAnnotation = (item: GanttItem) => {
    setAnnotationModal({
      isOpen: true,
      item,
      annotation: item.annotation || "",
    })
  }

  const handleSaveAnnotation = () => {
    if (annotationModal.item) {
      // Save annotation logic
    }
    setAnnotationModal({ isOpen: false, item: null, annotation: "" })
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
  }

  const getPositionColor = (position: string): string => {
    const colors = {
      "Project Executive": "bg-purple-500",
      "Project Manager": "bg-blue-500",
      Superintendent: "bg-green-500",
      "Assistant Superintendent": "bg-cyan-500",
      "Project Engineer": "bg-orange-500",
      "Project Administrator": "bg-pink-500",
      "Project Accountant": "bg-yellow-500",
    }
    return colors[position as keyof typeof colors] || "bg-gray-500"
  }

  // Helper to get mock behavioral profile if missing
  const getBehavioralProfile = (staff: StaffMember) => {
    if ((staff as any).behavioralProfile) return (staff as any).behavioralProfile
    // Mock values
    const discTypes = ["D", "I", "S", "C"]
    const integrusTypes = ["Visionary", "Driver", "Integrator", "Analyst"]
    const disc = discTypes[Math.floor(Math.random() * discTypes.length)]
    const integrus = integrusTypes[Math.floor(Math.random() * integrusTypes.length)]
    return {
      discProfile: {
        type: disc,
        primaryStyle: disc,
        strengths: ["Leadership", "Teamwork"],
        communicationTips: ["Be direct", "Encourage feedback"],
      },
      integrus360: {
        leadershipType: integrus,
        color:
          integrus === "Visionary"
            ? "Blue"
            : integrus === "Driver"
            ? "Red"
            : integrus === "Integrator"
            ? "Green"
            : "Purple",
        profile: { leadershipStrengths: ["Inspires others"] },
      },
      teamCompatibility: { overallScore: 80 },
    }
  }

  // Helper to get best fit
  const getBestFit = (disc: string, integrus: string) => {
    if (disc === "D" && integrus === "Driver") return "Project Lead, Operations"
    if (disc === "I" && integrus === "Visionary") return "Client Relations, Innovation"
    if (disc === "S" && integrus === "Integrator") return "Team Support, Coordination"
    if (disc === "C" && integrus === "Analyst") return "Quality Control, Risk Management"
    return "Generalist, Flexible Role"
  }

  // Safe date formatting function
  const formatDateSafely = (dateString: string | Date, formatString: string) => {
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString
      if (isNaN(date.getTime())) {
        return "N/A"
      }
      return format(date, formatString)
    } catch (error) {
      return "N/A"
    }
  }

  // AI Recommendations functions
  const handleAiRecommendations = () => {
    setAiRecommendationsOpen(true)
    setSelectedPositions([])
    setAiReasoning([])
    setAiSuggestions([])
  }

  const generateAiRecommendations = async () => {
    if (selectedPositions.length === 0) return

    setIsAiProcessing(true)
    setAiReasoning([])
    setAiSuggestions([])

    // Simulate AI thinking process
    const reasoningSteps = [
      "Analyzing project requirements and position demands...",
      "Evaluating staff availability and current assignments...",
      "Assessing behavioral compatibility and team dynamics...",
      "Considering experience levels and skill matches...",
      "Analyzing DiSC and Integrus profile compatibility...",
      "Calculating optimal team combinations...",
      "Generating personalized recommendations...",
    ]

    // Simulate progressive reasoning
    for (let i = 0; i < reasoningSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setAiReasoning((prev) => [...prev, reasoningSteps[i]])
    }

    // Generate recommendations based on selected positions
    let recommendations = staffMembers
      .filter((staff) => {
        const profile = getBehavioralProfile(staff)
        return (
          selectedPositions.includes(staff.position) && profile // Has behavioral data
        )
      })
      .slice(0, 3) // Top 3 recommendations

    // If no exact matches, include staff with similar positions or any available staff
    if (recommendations.length === 0) {
      recommendations = staffMembers
        .filter((staff) => {
          const profile = getBehavioralProfile(staff)
          return profile // Has behavioral data
        })
        .slice(0, 3)
    }

    // If still no recommendations, create mock recommendations for demonstration
    if (recommendations.length === 0) {
      recommendations = staffMembers.slice(0, 3).map((staff, index) => ({
        ...staff,
        behavioralProfile: {
          discProfile: {
            type: ["D", "I", "S", "C"][index % 4],
            primaryStyle: ["Dominant", "Influential", "Steady", "Conscientious"][index % 4],
            strengths: ["Leadership", "Communication", "Teamwork", "Analytical"][index % 4],
            communicationTips: ["Direct", "Enthusiastic", "Supportive", "Precise"][index % 4],
          },
          integrus360: {
            leadershipType: ["Driver", "Visionary", "Integrator", "Analyst"][index % 4],
            color: ["Red", "Yellow", "Green", "Blue"][index % 4],
            profile: {
              leadershipStrengths: ["Strategic Thinking", "Innovation", "Collaboration", "Problem Solving"][index % 4],
            },
          },
          teamCompatibility: {
            overallScore: 85 + index * 5,
          },
        },
      }))
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setAiSuggestions(recommendations)
    setIsAiProcessing(false)
  }

  const addAiSuggestionToSelection = (staff: StaffMember) => {
    handleStaffMemberSelect(staff.id)
    setAiRecommendationsOpen(false)
  }

  // Filter logic for Step 2
  const filteredStaffMembers = useMemo(() => {
    return staffMembers.filter((staff) => {
      const profile = getBehavioralProfile(staff)

      // Position filter
      if (staffFilters.position !== "all" && staff.position !== staffFilters.position) {
        return false
      }

      // DiSC profile filter
      if (staffFilters.discProfile !== "all" && profile?.discProfile.type !== staffFilters.discProfile) {
        return false
      }

      // Integrus profile filter
      if (
        staffFilters.integrusProfile !== "all" &&
        profile?.integrus360.leadershipType !== staffFilters.integrusProfile
      ) {
        return false
      }

      return true
    })
  }, [staffMembers, staffFilters])

  // Get unique filter options for Step 2
  const uniqueStaffPositions = useMemo(() => {
    return [...new Set(staffMembers.map((staff) => staff.position))].sort()
  }, [staffMembers])

  const uniqueDiscProfiles = useMemo(() => {
    const profiles = staffMembers.map((staff) => getBehavioralProfile(staff)?.discProfile.type).filter(Boolean)
    return [...new Set(profiles)].sort()
  }, [staffMembers])

  const uniqueIntegrusProfiles = useMemo(() => {
    const profiles = staffMembers
      .map((staff) => getBehavioralProfile(staff)?.integrus360.leadershipType)
      .filter(Boolean)
    return [...new Set(profiles)].sort()
  }, [staffMembers])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">{groupedGanttData.length} project executives</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={ganttViewMode} onValueChange={(value: any) => setGanttViewMode(value)}>
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

          {userRole === "executive" && !isReadOnly && (
            <div className="flex items-center gap-1">
              <Button variant="default" size="sm" onClick={handleCreateAssignment}>
                <Plus className="h-4 w-4 mr-1" />
                Create Assignment
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
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
            onChange={(e) => setGanttFilters({ ...ganttFilters, search: e.target.value })}
            className="w-64"
          />
        </div>

        <Select
          value={ganttFilters.position}
          onValueChange={(value) => setGanttFilters({ ...ganttFilters, position: value })}
        >
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

        <Select
          value={ganttFilters.project}
          onValueChange={(value) => setGanttFilters({ ...ganttFilters, project: value })}
        >
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
                const baseTypes = [...new Set(uniquePositions.map((pos) => pos))].sort().slice(0, 8)

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
                <FileText className="h-4 w-4 mr-1" />
                Save Annotation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Assignment Modal */}
      <Dialog
        open={assignmentModal.isOpen}
        onOpenChange={(open) => setAssignmentModal((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {assignmentModal.step === "overview"
                ? "Select Project"
                : assignmentModal.step === "staff-selection"
                ? "Select Staff Members"
                : assignmentModal.step === "compatibility-analysis"
                ? "Team Compatibility Analysis"
                : assignmentModal.step === "assignment-config"
                ? "Configure Assignment"
                : "Confirm Assignment"}
            </DialogTitle>
            <DialogDescription>
              {assignmentModal.step === "overview"
                ? "Choose a project to begin the staff assignment process"
                : assignmentModal.step === "staff-selection"
                ? "Select staff members for the assignment"
                : assignmentModal.step === "compatibility-analysis"
                ? "Review team compatibility and behavioral analysis"
                : assignmentModal.step === "assignment-config"
                ? "Configure assignment details and timeline"
                : "Review and confirm the assignment"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {["overview", "staff-selection", "compatibility-analysis", "assignment-config", "confirmation"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                          assignmentModal.step === step
                            ? "bg-primary text-primary-foreground"
                            : index <
                              [
                                "overview",
                                "staff-selection",
                                "compatibility-analysis",
                                "assignment-config",
                                "confirmation",
                              ].indexOf(assignmentModal.step)
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </div>
                      {index < 4 && (
                        <div
                          className={cn(
                            "w-8 h-1 mx-2",
                            index <
                              [
                                "overview",
                                "staff-selection",
                                "compatibility-analysis",
                                "assignment-config",
                                "confirmation",
                              ].indexOf(assignmentModal.step)
                              ? "bg-green-500"
                              : "bg-muted"
                          )}
                        />
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Step{" "}
                {["overview", "staff-selection", "compatibility-analysis", "assignment-config", "confirmation"].indexOf(
                  assignmentModal.step
                ) + 1}{" "}
                of 5
              </div>
            </div>

            {/* Step 1: Project Selection & Overview */}
            {assignmentModal.step === "overview" && (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="mb-6">
                    <Building className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Create New Assignment</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Select a project and start the guided workflow for optimal staff assignments using behavioral
                      data.
                    </p>
                  </div>

                  {/* Project Selection */}
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="text-left">
                      <Label htmlFor="project-select" className="text-sm font-medium">
                        Select Project *
                      </Label>
                      <Select
                        value={assignmentModal.selectedProject?.toString() || ""}
                        onValueChange={(value) =>
                          setAssignmentModal((prev) => ({
                            ...prev,
                            selectedProject: value ? Number(value) : null,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a project for the assignment" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects
                            .filter((project) => project.active)
                            .map((project) => (
                              <SelectItem key={project.project_id} value={project.project_id.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{project.name}</span>
                                  <span className="text-xs text-muted-foreground">{project.project_stage_name}</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Project Details (when selected) */}
                    {assignmentModal.selectedProject && (
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium">Selected Project</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Name:</span>{" "}
                            {projects.find((p) => p.project_id === assignmentModal.selectedProject)?.name}
                          </div>
                          <div>
                            <span className="font-medium">Stage:</span>{" "}
                            {projects.find((p) => p.project_id === assignmentModal.selectedProject)?.project_stage_name}
                          </div>
                          <div>
                            <span className="font-medium">Current Staff:</span>{" "}
                            {
                              staffMembers.filter((s) =>
                                s.assignments.some((a) => a.project_id === assignmentModal.selectedProject)
                              ).length
                            }{" "}
                            assigned
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Workflow Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
                    <div className="text-center p-4 border rounded-lg">
                      <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <h4 className="font-medium text-sm">Smart Selection</h4>
                      <p className="text-xs text-muted-foreground">
                        AI-powered staff matching with behavioral insights
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <h4 className="font-medium text-sm">Team Analysis</h4>
                      <p className="text-xs text-muted-foreground">Comprehensive compatibility and risk assessment</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <h4 className="font-medium text-sm">Confident Assignment</h4>
                      <p className="text-xs text-muted-foreground">Data-driven decisions with clear recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Smart Staff Selection */}
            {assignmentModal.step === "staff-selection" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Select Staff Members</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose staff members who match the position requirements. Behavioral compatibility will be analyzed
                    in the next step.
                  </p>

                  {/* Selected Staff Members */}
                  {assignmentModal.selectedStaffMembers.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">
                        Selected Staff ({assignmentModal.selectedStaffMembers.length})
                      </h4>
                      <div className="space-y-2">
                        {assignmentModal.selectedStaffMembers.map((staff) => (
                          <div key={staff.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex-1">
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-muted-foreground">{staff.position}</div>
                              </div>

                              {/* Current Assignment */}
                              <div className="text-right min-w-[120px]">
                                <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  {staff.assignments.length > 0
                                    ? projects.find((p) => p.project_id === staff.assignments[0].project_id)?.name ||
                                      "Unknown Project"
                                    : "No Assignment"}
                                </div>
                                <div className="text-[10px] text-muted-foreground">Current Assignment</div>
                              </div>

                              {/* Assignment End Date */}
                              <div className="text-right min-w-[100px]">
                                <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                  {staff.assignments.length > 0
                                    ? formatDateSafely(staff.assignments[0].endDate, "MMM dd")
                                    : "N/A"}
                                </div>
                                <div className="text-[10px] text-muted-foreground">End Date</div>
                              </div>

                              {/* DiSC Profile */}
                              <div className="text-center min-w-[80px]">
                                {(() => {
                                  const profile = getBehavioralProfile(staff)
                                  return profile ? (
                                    <>
                                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                        {profile.discProfile.type}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">DiSC</div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs text-muted-foreground">N/A</div>
                                      <div className="text-[10px] text-muted-foreground">DiSC</div>
                                    </>
                                  )
                                })()}
                              </div>

                              {/* Integrus Profile */}
                              <div className="text-center min-w-[80px]">
                                {(() => {
                                  const profile = getBehavioralProfile(staff)
                                  return profile ? (
                                    <>
                                      <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                        {profile.integrus360.leadershipType}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">Integrus</div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs text-muted-foreground">N/A</div>
                                      <div className="text-[10px] text-muted-foreground">Integrus</div>
                                    </>
                                  )
                                })()}
                              </div>
                              {/* Best Fit */}
                              <div className="text-center min-w-[120px]">
                                {(() => {
                                  const profile = getBehavioralProfile(staff)
                                  return (
                                    <>
                                      <div className="text-xs font-medium text-green-700 dark:text-green-400">
                                        {getBestFit(profile.discProfile.type, profile.integrus360.leadershipType)}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">Best Fit</div>
                                    </>
                                  )
                                })()}
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleRemoveStaffMember(staff.id)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Staff */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Available Staff</h4>
                      <div className="flex items-center gap-2">
                        {/* Filter Menu */}
                        <div className="relative filter-menu-container">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                            className="flex items-center gap-2"
                          >
                            <Filter className="h-4 w-4" />
                            Filters
                            {Object.values(staffFilters).some((filter) => filter !== "all") && (
                              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                                {Object.values(staffFilters).filter((filter) => filter !== "all").length}
                              </Badge>
                            )}
                          </Button>

                          {filterMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium">Filter Options</h5>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setStaffFilters({ position: "all", discProfile: "all", integrusProfile: "all" })
                                  }
                                >
                                  Clear All
                                </Button>
                              </div>

                              <div className="space-y-4">
                                {/* Position Filter */}
                                <div>
                                  <Label className="text-sm font-medium">Position</Label>
                                  <Select
                                    value={staffFilters.position}
                                    onValueChange={(value) => setStaffFilters((prev) => ({ ...prev, position: value }))}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="All Positions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Positions</SelectItem>
                                      {uniqueStaffPositions.map((position) => (
                                        <SelectItem key={position} value={position}>
                                          {position}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* DiSC Profile Filter */}
                                <div>
                                  <Label className="text-sm font-medium">DiSC Profile</Label>
                                  <Select
                                    value={staffFilters.discProfile}
                                    onValueChange={(value) =>
                                      setStaffFilters((prev) => ({ ...prev, discProfile: value }))
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="All DiSC Profiles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All DiSC Profiles</SelectItem>
                                      {uniqueDiscProfiles.map((profile) => (
                                        <SelectItem key={profile} value={profile}>
                                          {profile}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Integrus Profile Filter */}
                                <div>
                                  <Label className="text-sm font-medium">Integrus Profile</Label>
                                  <Select
                                    value={staffFilters.integrusProfile}
                                    onValueChange={(value) =>
                                      setStaffFilters((prev) => ({ ...prev, integrusProfile: value }))
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="All Integrus Profiles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Integrus Profiles</SelectItem>
                                      {uniqueIntegrusProfiles.map((profile) => (
                                        <SelectItem key={profile} value={profile}>
                                          {profile}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <Button variant="outline" size="sm" onClick={handleAiRecommendations}>
                          <Brain className="h-4 w-4 mr-1" />
                          AI Recommendations
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredStaffMembers.map((staff) => (
                        <div
                          key={staff.id}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleStaffMemberSelect(staff.id)}
                        >
                          {/* Enhanced Staff Card Layout */}
                          <div className="flex items-center justify-between">
                            {/* Primary Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex-1">
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-muted-foreground">{staff.position}</div>
                              </div>

                              {/* Current Assignment */}
                              <div className="text-right min-w-[120px]">
                                <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                  {staff.assignments.length > 0
                                    ? projects.find((p) => p.project_id === staff.assignments[0].project_id)?.name ||
                                      "Unknown Project"
                                    : "No Assignment"}
                                </div>
                                <div className="text-[10px] text-muted-foreground">Current Assignment</div>
                              </div>

                              {/* Assignment End Date */}
                              <div className="text-right min-w-[100px]">
                                <div className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                  {staff.assignments.length > 0
                                    ? formatDateSafely(staff.assignments[0].endDate, "MMM dd")
                                    : "N/A"}
                                </div>
                                <div className="text-[10px] text-muted-foreground">End Date</div>
                              </div>

                              {/* DiSC Profile */}
                              <div className="text-center min-w-[80px]">
                                {(() => {
                                  const profile = getBehavioralProfile(staff)
                                  return profile ? (
                                    <>
                                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                        {profile.discProfile.type}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">DiSC</div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs text-muted-foreground">N/A</div>
                                      <div className="text-[10px] text-muted-foreground">DiSC</div>
                                    </>
                                  )
                                })()}
                              </div>

                              {/* Integrus Profile */}
                              <div className="text-center min-w-[80px]">
                                {(() => {
                                  const profile = getBehavioralProfile(staff)
                                  return profile ? (
                                    <>
                                      <div className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                        {profile.integrus360.leadershipType}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">Integrus</div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-xs text-muted-foreground">N/A</div>
                                      <div className="text-[10px] text-muted-foreground">Integrus</div>
                                    </>
                                  )
                                })()}
                              </div>
                              {/* Best Fit */}
                              <div className="text-center min-w-[120px]">
                                {(() => {
                                  const profile = getBehavioralProfile(staff)
                                  return (
                                    <>
                                      <div className="text-xs font-medium text-green-700 dark:text-green-400">
                                        {getBestFit(profile.discProfile.type, profile.integrus360.leadershipType)}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">Best Fit</div>
                                    </>
                                  )
                                })()}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-4">
                              {(staff as any).behavioralProfile && (
                                <Button variant="outline" size="sm" className="text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  Analyze
                                </Button>
                              )}
                              <Button size="sm">Select</Button>
                            </div>
                          </div>

                          {/* Behavioral Insights (Collapsible) */}
                          {(staff as any).behavioralProfile && (
                            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm font-medium">Behavioral Insights</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" className="text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Add to Shortlist
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-xs">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    View Full Profile
                                  </Button>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-xs">
                                {/* Strengths */}
                                <div>
                                  <div className="font-medium text-green-600 dark:text-green-400 mb-1">Strengths</div>
                                  <div className="text-muted-foreground">
                                    {(staff as any).behavioralProfile.discProfile.strengths.slice(0, 2).join(", ")}
                                  </div>
                                </div>

                                {/* Communication Style */}
                                <div>
                                  <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">Communication</div>
                                  <div className="text-muted-foreground">
                                    {(staff as any).behavioralProfile.discProfile.communicationTips[0]}
                                  </div>
                                </div>

                                {/* Leadership */}
                                <div>
                                  <div className="font-medium text-purple-600 dark:text-purple-400 mb-1">
                                    Leadership
                                  </div>
                                  <div className="text-muted-foreground">
                                    {(staff as any).behavioralProfile.integrus360.profile.leadershipStrengths[0]}
                                  </div>
                                </div>
                              </div>

                              {/* Actionable Recommendations */}
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                                  <span className="text-xs font-medium">Recommendations</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                                  >
                                    Best for: Leadership roles
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs cursor-pointer hover:bg-green-100 dark:hover:bg-green-900"
                                  >
                                    Team fit: High
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
                                  >
                                    Communication: Strong
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Compatibility Analysis */}
            {assignmentModal.step === "compatibility-analysis" && assignmentModal.selectedStaffMembers.length > 0 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Team Compatibility Analysis</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed analysis of team dynamics and behavioral compatibility.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Team Overview */}
                    <div>
                      <h4 className="font-medium mb-3">Team Overview</h4>
                      <div className="p-4 border rounded-lg space-y-3">
                        <div>
                          <span className="font-medium">Selected Staff:</span>{" "}
                          {assignmentModal.selectedStaffMembers.length}
                        </div>
                        <div>
                          <span className="font-medium">Positions:</span>{" "}
                          {Array.from(new Set(assignmentModal.selectedStaffMembers.map((s) => s.position))).join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Total Experience:</span>{" "}
                          {assignmentModal.selectedStaffMembers.reduce((sum, s) => sum + s.experience, 0)} years
                        </div>
                        <div>
                          <span className="font-medium">Average Rate:</span> $
                          {Math.round(
                            assignmentModal.selectedStaffMembers.reduce((sum, s) => sum + s.laborRate, 0) /
                              assignmentModal.selectedStaffMembers.length
                          )}
                          /hr
                        </div>
                      </div>
                    </div>

                    {/* Assignment Summary */}
                    <div>
                      <h4 className="font-medium mb-3">Assignment Summary</h4>
                      <div className="p-4 border rounded-lg space-y-3">
                        <div>
                          <span className="font-medium">Status:</span>{" "}
                          <Badge variant="secondary">Ready for Assignment</Badge>
                        </div>
                        <div>
                          <span className="font-medium">Team Size:</span> {assignmentModal.selectedStaffMembers.length}{" "}
                          members
                        </div>
                        <div>
                          <span className="font-medium">Diversity:</span>{" "}
                          {new Set(assignmentModal.selectedStaffMembers.map((s) => s.position)).size} different
                          positions
                        </div>
                        <div>
                          <span className="font-medium">Recommendation:</span>{" "}
                          <span className="text-green-600 dark:text-green-400">Proceed with assignment</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Behavioral Compatibility Analysis */}
                  {assignmentModal.selectedStaffMembers.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Behavioral Compatibility Analysis</h4>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Detailed Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-1" />
                            Team Builder
                          </Button>
                        </div>
                      </div>

                      {assignmentModal.selectedStaffMembers.map((staff, index) => {
                        if (index === 0) return null // Skip first member as they're the candidate

                        const candidate = assignmentModal.selectedStaffMembers[0]
                        const existingTeam = assignmentModal.selectedStaffMembers.slice(1)

                        return (
                          <div key={staff.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">Compatibility with {staff.name}</span>
                            </div>

                            {(candidate as any).behavioralProfile && (staff as any).behavioralProfile ? (
                              <BehavioralTeamCompatibility
                                staffMember={candidate as any}
                                existingTeamMembers={[staff as any]}
                                showDetailedAnalysis={false}
                              />
                            ) : (
                              <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm font-medium">No Behavioral Data Available</span>
                                  </div>
                                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                    Behavioral compatibility analysis requires assessment data for both team members.
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        )
                      })}

                      {/* Overall Team Analysis */}
                      {assignmentModal.selectedStaffMembers.length > 1 && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium">Overall Team Analysis</span>
                          </div>

                          <TeamCompatibilityEngine
                            candidate={assignmentModal.selectedStaffMembers[0] as any}
                            existingTeam={assignmentModal.selectedStaffMembers.slice(1) as any}
                            onTeamAnalysis={(analysis) => {
                              setAssignmentModal((prev) => ({
                                ...prev,
                                compatibilityData: {
                                  teamScore: analysis.overallCompatibility,
                                  diversityScore: analysis.teamDiversity,
                                  leadershipBalance: analysis.leadershipBalance,
                                  communicationBalance: analysis.communicationBalance,
                                  riskFactors: analysis.riskFactors,
                                  recommendations: analysis.recommendations,
                                },
                              }))
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Behavioral Decision Panel */}
                  <div className="mt-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-medium">Behavioral Decision Support</h4>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        AI-Powered
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm font-medium">Team Optimization</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          AI suggests optimal team combinations based on behavioral compatibility
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Optimize Team
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium">Role Matching</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Match staff to roles based on behavioral strengths and preferences
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Match Roles
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-medium">Risk Mitigation</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Identify potential conflicts and suggest mitigation strategies
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          Assess Risks
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Assignment Configuration */}
            {assignmentModal.step === "assignment-config" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Configure Assignment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set the final details for the assignment with behavioral context.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assignment Details */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={assignmentModal.assignmentDetails.startDate}
                          onChange={(e) =>
                            setAssignmentModal((prev) => ({
                              ...prev,
                              assignmentDetails: { ...prev.assignmentDetails, startDate: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={assignmentModal.assignmentDetails.endDate}
                          onChange={(e) =>
                            setAssignmentModal((prev) => ({
                              ...prev,
                              assignmentDetails: { ...prev.assignmentDetails, endDate: e.target.value },
                            }))
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={assignmentModal.assignmentDetails.priority}
                          onValueChange={(value: "high" | "medium" | "low") =>
                            setAssignmentModal((prev) => ({
                              ...prev,
                              assignmentDetails: { ...prev.assignmentDetails, priority: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="comments">Comments</Label>
                        <Textarea
                          id="comments"
                          placeholder="Add any notes about this assignment..."
                          value={assignmentModal.assignmentDetails.comments}
                          onChange={(e) =>
                            setAssignmentModal((prev) => ({
                              ...prev,
                              assignmentDetails: { ...prev.assignmentDetails, comments: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Behavioral Context */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Behavioral Context</h4>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Brain className="h-4 w-4 mr-1" />
                            Optimize Team
                          </Button>
                          <Button variant="outline" size="sm">
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Get Suggestions
                          </Button>
                        </div>
                      </div>
                      {assignmentModal.compatibilityData && (
                        <div className="space-y-3">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium">
                                Team Score: {assignmentModal.compatibilityData.teamScore}%
                              </span>
                            </div>
                            <Progress value={assignmentModal.compatibilityData.teamScore} className="h-2" />
                          </div>

                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium">
                                Diversity: {assignmentModal.compatibilityData.diversityScore}%
                              </span>
                            </div>
                            <Progress value={assignmentModal.compatibilityData.diversityScore} className="h-2" />
                          </div>

                          {assignmentModal.compatibilityData.riskFactors.length > 0 && (
                            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                <span className="text-sm font-medium">Risk Factors</span>
                              </div>
                              <ul className="text-xs space-y-1">
                                {assignmentModal.compatibilityData.riskFactors.map((risk, index) => (
                                  <li key={index} className="text-orange-700 dark:text-orange-300">
                                    • {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {assignmentModal.step === "confirmation" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Confirm Assignment</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review the assignment details and confirm the assignment.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assignment Summary */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Assignment Summary</h4>
                      <div className="p-4 border rounded-lg space-y-3">
                        <div>
                          <span className="font-medium">Staff Members:</span>
                          <div className="mt-1 space-y-1">
                            {assignmentModal.selectedStaffMembers.map((staff) => (
                              <div key={staff.id} className="text-sm text-muted-foreground">
                                • {staff.name} ({staff.position})
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-medium">Duration:</span>
                          <div className="text-sm text-muted-foreground">
                            {assignmentModal.assignmentDetails.startDate} to {assignmentModal.assignmentDetails.endDate}
                          </div>
                        </div>

                        <div>
                          <span className="font-medium">Priority:</span>
                          <Badge
                            variant={
                              assignmentModal.assignmentDetails.priority === "high" ? "destructive" : "secondary"
                            }
                          >
                            {assignmentModal.assignmentDetails.priority}
                          </Badge>
                        </div>

                        {assignmentModal.assignmentDetails.comments && (
                          <div>
                            <span className="font-medium">Comments:</span>
                            <div className="text-sm text-muted-foreground mt-1">
                              {assignmentModal.assignmentDetails.comments}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Behavioral Impact Assessment */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Behavioral Impact Assessment</h4>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Export Report
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Share Insights
                          </Button>
                        </div>
                      </div>
                      {assignmentModal.compatibilityData && (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-sm font-medium">Positive Impact</span>
                            </div>
                            <ul className="text-xs space-y-1">
                              {assignmentModal.compatibilityData.recommendations.map((rec, index) => (
                                <li key={index} className="text-green-700 dark:text-green-300">
                                  • {rec}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium">Recommendations</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              This assignment shows strong team compatibility with excellent potential for collaboration
                              and productivity.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <div>
                {assignmentModal.step !== "overview" && (
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAssignmentModal((prev) => ({ ...prev, isOpen: false }))}>
                  Cancel
                </Button>
                {assignmentModal.step === "confirmation" ? (
                  <Button onClick={handleCompleteAssignment}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Assignment
                  </Button>
                ) : assignmentModal.step === "overview" ? (
                  <Button onClick={handleNextStep} disabled={!assignmentModal.selectedProject}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleNextStep}>Next</Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Recommendations Modal */}
      <Dialog open={aiRecommendationsOpen} onOpenChange={setAiRecommendationsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              AI Staff Recommendations
            </DialogTitle>
            <DialogDescription>
              Get intelligent staff recommendations based on position requirements and behavioral compatibility.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Position Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Which position(s) are you looking to fill?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {uniqueStaffPositions.map((position) => (
                  <div
                    key={position}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPositions.includes(position)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => {
                      setSelectedPositions((prev) =>
                        prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position]
                      )
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{position}</span>
                      {selectedPositions.includes(position) && (
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Recommendations Button */}
            {selectedPositions.length > 0 && (
              <div className="text-center">
                <Button onClick={generateAiRecommendations} disabled={isAiProcessing} className="px-8">
                  {isAiProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Recommendations
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* AI Reasoning Process */}
            {aiReasoning.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  AI Analysis Process
                </h4>
                <div className="space-y-2">
                  {aiReasoning.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-in slide-in-from-left-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  AI Recommendations
                </h4>
                <div className="space-y-3">
                  {aiSuggestions.map((staff, index) => {
                    const profile = getBehavioralProfile(staff)
                    return (
                      <div
                        key={staff.id}
                        className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center text-white font-medium">
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium">{staff.name}</div>
                              <div className="text-sm text-muted-foreground">{staff.position}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              AI Score: {92 - index * 3}%
                            </Badge>
                            <Button size="sm" onClick={() => addAiSuggestionToSelection(staff)}>
                              Add to Selection
                            </Button>
                          </div>
                        </div>

                        {/* Behavioral Insights */}
                        {profile && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">DiSC Profile</div>
                              <div className="text-muted-foreground">{profile.discProfile.type}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {profile.discProfile.strengths.slice(0, 2).join(", ")}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-purple-600 dark:text-purple-400 mb-1">
                                Leadership Style
                              </div>
                              <div className="text-muted-foreground">{profile.integrus360.leadershipType}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {profile.integrus360.profile.leadershipStrengths[0]}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-green-600 dark:text-green-400 mb-1">Best Fit</div>
                              <div className="text-muted-foreground">
                                {getBestFit(profile.discProfile.type, profile.integrus360.leadershipType)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">Optimal team role</div>
                            </div>
                          </div>
                        )}

                        {/* AI Reasoning */}
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-sm font-medium">Why this recommendation?</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {index === 0 &&
                              "Perfect match for leadership roles with strong communication skills and proven track record. High behavioral compatibility score of 95%."}
                            {index === 1 &&
                              "Excellent technical expertise combined with collaborative team approach. Strong DiSC profile indicates ideal team dynamics."}
                            {index === 2 &&
                              "Balanced skill set with adaptability to various project requirements. Integrus leadership style complements existing team structure."}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* No Recommendations */}
            {!isAiProcessing && aiReasoning.length > 0 && aiSuggestions.length === 0 && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="font-medium mb-2">No AI Recommendations Found</h4>
                <p className="text-sm text-muted-foreground">
                  No available staff members match the selected position requirements with behavioral data.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
