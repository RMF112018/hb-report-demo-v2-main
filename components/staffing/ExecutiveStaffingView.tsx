"use client"

import { useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Building2,
  DollarSign,
  Calendar,
  UserCheck,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Home,
  RefreshCw,
  Download,
  Settings,
  History,
  Brain,
  Star,
  Lightbulb,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/layout/app-header"

// Import presentation components
import { PresentationCarousel } from "@/components/presentation/PresentationCarousel"
import { executiveStaffingSlides } from "@/components/presentation/executiveStaffingSlides"

// Import components
import { EnhancedInteractiveStaffingGantt } from "@/app/dashboard/staff-planning/components/EnhancedInteractiveStaffingGantt"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"
import { ExportModal } from "@/components/constraints/ExportModal"
import { BehavioralTeamCompatibility } from "@/components/staffing/BehavioralTeamCompatibility"
import { TeamCompatibilityEngine } from "@/components/staffing/TeamCompatibilityEngine"
import {
  ProtectedGrid,
  createProtectedColumn,
  type ProtectedColDef,
  type GridRow,
  type GridConfig,
} from "@/components/ui/protected-grid"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import projectsData from "@/data/mock/projects.json"
import spcrData from "@/data/mock/staffing/spcr.json"
import cashFlowData from "@/data/mock/financial/cash-flow.json"

// Types
interface BehavioralProfile {
  discProfile: {
    type: string
    primaryStyle: string
    secondaryStyle: string
    summary: string
    strengths: string[]
    growthAreas: string[]
    communicationTips: string[]
    stressResponse: string
    motivators: string[]
    deMotivators: string[]
  }
  integrus360: {
    leadershipType: string
    color: string
    profile: {
      type: string
      description: string
      leadershipStrengths: string[]
      developmentAreas: string[]
      communicationStyle: string
      conflictResolution: string
      teamMotivation: string
      stressManagement: string
    }
  }
  teamCompatibility: {
    overallScore: number
    compatibilityMatrix: Record<string, { score: number; notes: string }>
    teamDynamics: string[]
    recommendations: string[]
  }
}

interface StaffMember {
  id: string
  name: string
  position: string
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
  discProfile: string
  behavioralProfile?: BehavioralProfile
  assignments: Array<{
    project_id: number
    role: string
    startDate: string
    endDate: string
  }>
}

interface Project {
  project_id: number
  name: string
  project_stage_name: string
  active: boolean
}

interface SPCR {
  id: string
  project_id: number
  type: string
  position: string
  startDate: string
  endDate: string
  schedule_activity: string
  scheduleRef: string
  budget: number
  explanation: string
  status: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface ExecutiveStaffingViewProps {
  activeTab?: string
}

interface AssignmentData {
  id: string
  project_id: number | string
  startDate: string
  endDate: string
  position: string
  comments: string
}

interface AssignmentModal {
  isOpen: boolean
  spcr: SPCR | null
  staffMember: StaffMember | null
  assignments: AssignmentData[]
  selectedProject: number | null
  selectedPosition: string
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

export const ExecutiveStaffingView: React.FC<ExecutiveStaffingViewProps> = ({ activeTab = "overview" }) => {
  console.log("🏗️ ExecutiveStaffingView: Component loading...")
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [spcrs, setSpcrs] = useState<SPCR[]>([])
  const [spcrFilter, setSpcrFilter] = useState<"approved" | "rejected" | "pending">("approved")
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Presentation mode state
  const [showTour, setShowTour] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [assignmentModal, setAssignmentModal] = useState<AssignmentModal>({
    isOpen: false,
    spcr: null,
    staffMember: null,
    assignments: [],
    selectedProject: null,
    selectedPosition: "",
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

  // Initialize data
  useEffect(() => {
    setStaffMembers(staffingData as StaffMember[])
    setProjects(projectsData as Project[])
    setSpcrs(spcrData as SPCR[])
  }, [])

  // Handle component mount
  useEffect(() => {
    console.log("🔧 Executive Staffing Tour: Setting mounted to true")
    setMounted(true)
  }, [])

  // Handle tour logic - separate useEffect that depends on mounted state
  useEffect(() => {
    console.log("🔍 Executive Staffing Tour: Checking conditions...", { mounted })
    if (mounted) {
      // Check if tour should be triggered (sidebar has priority)
      const sidebarTourFlag = localStorage.getItem("staffingTourFromSidebar")
      const regularTourFlag = localStorage.getItem("execStaffingTour")
      const timestamp = localStorage.getItem("execStaffingTourTimestamp")
      const sidebarTimestamp = localStorage.getItem("staffingTourTimestamp")

      console.log("🔍 Executive Staffing Tour: localStorage check result:", {
        sidebarTourFlag,
        regularTourFlag,
        timestamp,
        sidebarTimestamp,
      })
      console.log("🗄️ Executive Staffing Tour: All localStorage keys:", Object.keys(localStorage))

      // Check for sidebar-triggered tour first (has priority)
      if (sidebarTourFlag === "true") {
        console.log("✅ Executive Staffing Tour: Sidebar trigger flag found, launching tour in 3 seconds...")
        const timer = setTimeout(() => {
          setShowTour(true)
          console.log("🎯 Executive Staffing Tour: Tour launched from sidebar trigger!")
        }, 3000)

        return () => clearTimeout(timer)
      }
      // Check for regular tour flag (from page header carousel menu)
      else if (regularTourFlag === "true") {
        console.log("✅ Executive Staffing Tour: Regular tour flag found, launching tour in 3 seconds...")
        const timer = setTimeout(() => {
          setShowTour(true)
          console.log("🎯 Executive Staffing Tour: Tour launched from header trigger!")
        }, 3000)

        return () => clearTimeout(timer)
      } else {
        console.log("⏭️ Executive Staffing Tour: No tour flags found, skipping tour")
        // Also check for any remaining flags that might indicate a timing issue
        const allLocalStorageKeys = Object.keys(localStorage)
        const tourRelatedKeys = allLocalStorageKeys.filter((key) => key.includes("tour") || key.includes("Tour"))
        console.log("🔍 Executive Staffing Tour: Tour-related localStorage keys:", tourRelatedKeys)
      }
    }
  }, [mounted])

  // Additional check for localStorage flag that might be set after component mount
  useEffect(() => {
    if (mounted && !showTour) {
      const checkForTourFlag = () => {
        const sidebarTourFlag = localStorage.getItem("staffingTourFromSidebar")
        const regularTourFlag = localStorage.getItem("execStaffingTour")

        if (sidebarTourFlag === "true") {
          console.log("🎯 Executive Staffing Tour: Late sidebar flag detected, triggering tour now!")
          setShowTour(true)
        } else if (regularTourFlag === "true") {
          console.log("🎯 Executive Staffing Tour: Late regular flag detected, triggering tour now!")
          setShowTour(true)
        }
      }

      // Check immediately and then periodically for a few seconds
      checkForTourFlag()
      const interval = setInterval(checkForTourFlag, 500)
      const timeout = setTimeout(() => clearInterval(interval), 5000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [mounted, showTour])

  // Mock data for staff needing assignment (3-6 members with assignments ending in 4-62 days)
  const needingAssignmentData = useMemo(() => {
    const today = new Date()
    const staffNeedingAssignment = [
      {
        id: "na-1",
        name: "Michael Chen",
        position: "Senior Project Manager",
        currentProject: "Oceanfront Resort",
        endsInDays: 12,
        laborRate: 89.5,
        nextAvailable: "2025-02-15",
      },
      {
        id: "na-2",
        name: "Sarah Johnson",
        position: "Project Manager II",
        currentProject: "Downtown Office Complex",
        endsInDays: 28,
        laborRate: 76.25,
        nextAvailable: "2025-03-03",
      },
      {
        id: "na-3",
        name: "Alex Rodriguez",
        position: "Project Administrator",
        currentProject: "Medical Center Expansion",
        endsInDays: 45,
        laborRate: 52.0,
        nextAvailable: "2025-03-20",
      },
      {
        id: "na-4",
        name: "Emily Davis",
        position: "Project Engineer",
        currentProject: "Luxury Condominiums",
        endsInDays: 7,
        laborRate: 68.75,
        nextAvailable: "2025-02-10",
      },
      {
        id: "na-5",
        name: "James Wilson",
        position: "Project Manager I",
        currentProject: "Corporate Campus",
        endsInDays: 62,
        laborRate: 71.5,
        nextAvailable: "2025-04-05",
      },
    ]

    // Sort by days remaining (ascending) - most urgent first
    const sortedData = staffNeedingAssignment.sort((a, b) => a.endsInDays - b.endsInDays)
    console.log("Needing Assignment Data (sorted):", sortedData)
    return sortedData
  }, [])

  // Column definitions for the Needing Assignment grid
  const needingAssignmentColumns: ProtectedColDef[] = [
    createProtectedColumn(
      "name",
      "Name",
      { level: "read-only" },
      {
        width: 120,
        cellStyle: { fontSize: "12px", fontWeight: "600" },
      }
    ),
    createProtectedColumn(
      "position",
      "Role",
      { level: "read-only" },
      {
        width: 100,
        cellStyle: { fontSize: "12px", color: "#6b7280" },
      }
    ),
    createProtectedColumn(
      "endsInDays",
      "Ends In",
      { level: "read-only" },
      {
        width: 70,
        valueFormatter: (params: any) => `${params.value}d`,
        cellStyle: (params: any) => {
          const days = params.value
          const urgency = days <= 14 ? "urgent" : days <= 30 ? "warning" : "normal"
          return {
            fontSize: "12px",
            fontWeight: "600",
            color: urgency === "urgent" ? "#dc2626" : urgency === "warning" ? "#d97706" : "#16a34a",
          }
        },
      }
    ),
    createProtectedColumn(
      "laborRate",
      "Rate",
      { level: "read-only" },
      {
        width: 60,
        valueFormatter: (params: any) => `$${params.value}`,
        cellStyle: { fontSize: "12px", color: "#6b7280" },
      }
    ),
  ]

  // Grid configuration for compact view
  const gridConfig: GridConfig = {
    allowExport: false,
    allowImport: false,
    allowRowSelection: false,
    allowMultiSelection: false,
    allowColumnReordering: false,
    allowColumnResizing: false,
    allowSorting: false,
    allowFiltering: false,
    allowCellEditing: false,
    showToolbar: false,
    showStatusBar: false,
    enableRangeSelection: false,
    protectionEnabled: false,
    theme: "quartz",
    enableTotalsRow: false,
    stickyColumnsCount: 0,
  }

  // Calculate overview analytics
  const overviewAnalytics = useMemo(() => {
    const totalStaff = staffMembers.length
    const assignedStaff = staffMembers.filter((staff) => staff.assignments.length > 0).length
    const utilizationRate = totalStaff > 0 ? (assignedStaff / totalStaff) * 100 : 0

    // Labor cost calculations
    const totalLaborCost = staffMembers.reduce((sum, staff) => sum + staff.laborRate, 0)
    const weeklyLaborCost = totalLaborCost * 40
    const monthlyLaborCost = weeklyLaborCost * 4.33
    const burden = monthlyLaborCost * 0.35 // 35% burden rate
    const totalMonthlyWithBurden = monthlyLaborCost + burden

    // Cash flow inflows (from first project as sample)
    const firstProject = cashFlowData.projects[0]
    const totalInflows = firstProject?.cashFlowData?.summary?.totalInflows || 0
    const lastInflow = firstProject?.cashFlowData?.monthlyData?.[0]?.inflows?.total || 0

    // SPCR analytics
    const approvedSpcrs = spcrs.filter((spcr) => spcr.status === "approved").length
    const pendingSpcrs = spcrs.filter((spcr) => spcr.status === "submitted").length

    return {
      totalStaff,
      assignedStaff,
      utilizationRate,
      weeklyLaborCost,
      monthlyLaborCost: totalMonthlyWithBurden,
      burden,
      totalInflows,
      lastInflow,
      approvedSpcrs,
      pendingSpcrs,
    }
  }, [staffMembers, spcrs])

  // Filter SPCRs based on selected filter
  const filteredSpcrs = useMemo(() => {
    switch (spcrFilter) {
      case "approved":
        return spcrs.filter((spcr) => spcr.status === "approved")
      case "rejected":
        return spcrs.filter((spcr) => spcr.status === "rejected")
      case "pending":
        return spcrs.filter((spcr) => spcr.status === "submitted")
      default:
        return spcrs
    }
  }, [spcrs, spcrFilter])

  // Get approved SPCRs for executive action
  const approvedSpcrs = useMemo(() => {
    return spcrs.filter((spcr) => spcr.status === "approved").slice(0, 4) // Limit to 4 for compact display
  }, [spcrs])

  // Get project name by ID
  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.project_id === projectId)
    return project?.name || `Project ${projectId}`
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    setIsLoading(true)
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false)
      setIsExportModalOpen(false)
      toast({
        title: "Export Successful",
        description: `Staffing data exported as ${options.format.toUpperCase()}`,
      })
    }, 2000)
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Staffing data has been updated",
      })
    }, 1000)
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle SPCR assignment - opens assignment modal
  const handleSpcrAssignment = (spcr: SPCR) => {
    setAssignmentModal({
      isOpen: true,
      spcr,
      staffMember: null,
      assignments: [],
      selectedProject: spcr.project_id,
      selectedPosition: spcr.position,
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

  // Create new assignment data structure
  const createNewAssignment = (position: string, projectId?: number | string): AssignmentData => ({
    id: `assignment-${Date.now()}`,
    project_id: projectId || "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    position,
    comments: "",
  })

  // Handle assignment completion
  const handleCompleteAssignment = () => {
    if (!assignmentModal.spcr || assignmentModal.selectedStaffMembers.length === 0) return

    const staffNames = assignmentModal.selectedStaffMembers.map((s) => s.name).join(", ")

    toast({
      title: "Assignment Completed",
      description: `${staffNames} assigned to ${assignmentModal.spcr.position}. SPCR ${assignmentModal.spcr.id} workflow closed.`,
    })

    // Close modal
    setAssignmentModal({
      isOpen: false,
      spcr: null,
      staffMember: null,
      assignments: [],
      selectedProject: null,
      selectedPosition: "",
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

  // Update assignment field
  const updateAssignment = (assignmentId: string, updates: Partial<AssignmentData>) => {
    setAssignmentModal((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => (a.id === assignmentId ? { ...a, ...updates } : a)),
    }))
  }

  // Go back to staff selection
  const goBackToStaffSelection = () => {
    setAssignmentModal((prev) => ({
      ...prev,
      step: "staff-selection",
      staffMember: null,
      assignments: [],
    }))
  }

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
    if (!staff || !assignmentModal.spcr) return

    setAssignmentModal((prev) => ({
      ...prev,
      selectedStaffMembers: [...prev.selectedStaffMembers, staff],
      staffMember: staff,
    }))
  }

  const handleRemoveStaffMember = (staffMemberId: string) => {
    setAssignmentModal((prev) => ({
      ...prev,
      selectedStaffMembers: prev.selectedStaffMembers.filter((s) => s.id !== staffMemberId),
    }))
  }

  const calculateTeamCompatibility = () => {
    if (!assignmentModal.selectedStaffMembers.length || !assignmentModal.spcr) return

    const existingTeam = staffMembers.filter((s) =>
      s.assignments.some((a) => a.project_id === assignmentModal.spcr!.project_id)
    )

    const allTeamMembers = [...existingTeam, ...assignmentModal.selectedStaffMembers]

    // Calculate compatibility metrics
    const teamScore = Math.round(
      allTeamMembers.reduce((sum, member) => {
        return sum + (member.behavioralProfile?.teamCompatibility.overallScore || 70)
      }, 0) / allTeamMembers.length
    )

    const diversityScore = Math.round(
      (new Set(allTeamMembers.map((m) => m.behavioralProfile?.discProfile.type)).size / allTeamMembers.length) * 100
    )

    const leadershipTypes = allTeamMembers.map((m) => m.behavioralProfile?.integrus360.leadershipType).filter(Boolean)
    const leadershipBalance = Math.round((new Set(leadershipTypes).size / leadershipTypes.length) * 100)

    const riskFactors: string[] = []
    if (teamScore < 70) riskFactors.push("Low team compatibility score")
    if (diversityScore < 60) riskFactors.push("Limited behavioral diversity")
    if (leadershipBalance < 50) riskFactors.push("Leadership style imbalance")

    const recommendations: string[] = []
    if (teamScore < 70) recommendations.push("Consider additional team building activities")
    if (diversityScore < 60) recommendations.push("Look for candidates with different behavioral profiles")
    if (leadershipBalance < 50) recommendations.push("Balance leadership styles for better team dynamics")

    setAssignmentModal((prev) => ({
      ...prev,
      compatibilityData: {
        teamScore,
        diversityScore,
        leadershipBalance,
        communicationBalance: Math.round((teamScore + diversityScore) / 2),
        riskFactors,
        recommendations,
      },
    }))
  }

  // Get filtered staff members by position
  const getStaffByPosition = (position: string) => {
    return staffMembers.filter(
      (staff) =>
        staff.position.toLowerCase().includes(position.toLowerCase()) ||
        position.toLowerCase().includes(staff.position.toLowerCase())
    )
  }

  // HBI Insights config for staffing
  const staffingInsights = [
    {
      id: "staff-1",
      type: "alert",
      severity: "high",
      title: "Critical Staffing Gap",
      text: "Senior Project Manager shortage across 3 active projects by Q2 2025.",
      action: "Accelerate hiring or consider contractor augmentation.",
      confidence: 94,
      relatedMetrics: ["Staff Utilization", "Project Delivery", "Resource Planning"],
    },
    {
      id: "staff-2",
      type: "opportunity",
      severity: "medium",
      title: "Cross-Training Opportunity",
      text: "AI identifies 5 junior staff ready for advanced role transitions.",
      action: "Implement structured mentoring and certification programs.",
      confidence: 87,
      relatedMetrics: ["Career Development", "Skills Matrix", "Knowledge Transfer"],
    },
    {
      id: "staff-3",
      type: "performance",
      severity: "low",
      title: "Utilization Optimization",
      text: "Current staffing efficiency at 89% - exceeding industry benchmark.",
      action: "Maintain current allocation strategy and monitor for seasonal adjustments.",
      confidence: 92,
      relatedMetrics: ["Utilization Rate", "Productivity", "Cost Control"],
    },
  ]

  const getSpcrStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "submitted":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getSpcrStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "submitted":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Draft</Badge>
    }
  }

  // Handle tour completion
  const handleTourComplete = () => {
    console.log("🏁 Executive Staffing Tour: Tour completed, clearing localStorage")
    localStorage.removeItem("execStaffingTour")
    localStorage.removeItem("execStaffingTourTimestamp")
    localStorage.removeItem("staffingTourFromSidebar")
    localStorage.removeItem("staffingTourTimestamp")
    setShowTour(false)
    console.log("✅ Executive Staffing Tour: Tour completed and all localStorage flags cleared")
  }

  return (
    <>
      <div
        className={cn(
          "space-y-6 relative",
          isFullScreen && "fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-background p-6 overflow-auto"
        )}
      >
        {/* Main Content with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Staff</span>
                  <span className="font-medium">{overviewAnalytics.totalStaff}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilization Rate</span>
                  <span className="font-medium text-green-600">{overviewAnalytics.utilizationRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Labor Cost</span>
                  <span className="font-medium">${(2032000 / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cash Inflow on Labor</span>
                  <span className="font-medium text-blue-600">${(2819400).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Needing Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Needing Assignment ({needingAssignmentData.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-48 overflow-auto">
                  {/* Temporary simple table for debugging */}
                  {needingAssignmentData.length > 0 ? (
                    <div className="space-y-1">
                      {needingAssignmentData.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex justify-between items-center py-1 px-2 text-xs border-b border-border"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{staff.name}</div>
                            <div className="text-muted-foreground text-[10px]">{staff.position}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                staff.endsInDays <= 14
                                  ? "text-red-600"
                                  : staff.endsInDays <= 30
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {staff.endsInDays}d
                            </span>
                            <span className="text-muted-foreground">${staff.laborRate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground p-4 text-center">
                      No data available. Check console for debugging info.
                    </div>
                  )}
                  {/* 
                <ProtectedGrid
                  columnDefs={needingAssignmentColumns}
                  rowData={needingAssignmentData}
                  config={gridConfig}
                  height="100%"
                  className="text-xs"
                />
                */}
                </div>
              </CardContent>
            </Card>

            {/* Approved SPCRs for Executive Action */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Approved SPCRs ({approvedSpcrs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-64 overflow-auto">
                  {approvedSpcrs.length > 0 ? (
                    <div className="space-y-3">
                      {approvedSpcrs.map((spcr) => (
                        <div
                          key={spcr.id}
                          className="p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="space-y-2">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-xs">{spcr.position}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  {getProjectName(spcr.project_id)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-xs font-medium ${
                                    spcr.type === "increase" ? "text-green-600" : "text-orange-600"
                                  }`}
                                >
                                  {spcr.type === "increase" ? "+" : "-"}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  ${(spcr.budget / 1000).toFixed(0)}K
                                </div>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="text-[10px] text-muted-foreground">
                              <div>Activity: {spcr.schedule_activity}</div>
                              <div className="truncate" title={spcr.explanation}>
                                {spcr.explanation.length > 40
                                  ? `${spcr.explanation.substring(0, 40)}...`
                                  : spcr.explanation}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-1 pt-1">
                              <Button
                                size="sm"
                                className="h-6 px-2 text-[10px] bg-green-600 hover:bg-green-700"
                                onClick={() => handleSpcrAssignment(spcr)}
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assign Staff
                              </Button>
                              <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]">
                                <Eye className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground p-4 text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <div>No approved SPCRs pending assignment</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Executive Management */}
          <div className="xl:col-span-9">
            {/* Overview Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Overview Collapsible Section */}
                <Collapsible open={isOverviewExpanded} onOpenChange={setIsOverviewExpanded}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Staffing Overview
                          </CardTitle>
                          <div className="flex items-center">
                            {isOverviewExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">Staff Utilization</span>
                              </div>
                              <div className="space-y-2">
                                <div className="text-2xl font-bold">
                                  {overviewAnalytics.utilizationRate.toFixed(1)}%
                                </div>
                                <Progress value={overviewAnalytics.utilizationRate} className="h-2" />
                                <div className="text-xs text-muted-foreground">
                                  {overviewAnalytics.assignedStaff} of {overviewAnalytics.totalStaff} assigned
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium">Monthly Labor Cost</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold">${(2032000 / 1000000).toFixed(2)}M</div>
                                <div className="text-xs text-muted-foreground">
                                  +${(overviewAnalytics.burden / 1000).toFixed(0)}K burden
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium">Cash Inflow on Labor</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold">${(2819400).toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">
                                  Last: ${(overviewAnalytics.lastInflow / 1000).toFixed(0)}K
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium">SPCR Status</span>
                              </div>
                              <div className="space-y-1">
                                <div className="text-2xl font-bold">{overviewAnalytics.approvedSpcrs}</div>
                                <div className="text-xs text-muted-foreground">
                                  {overviewAnalytics.pendingSpcrs} pending review
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* HBI Insights */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-blue-600" />
                            HBI Staffing Insights
                          </h3>
                          <EnhancedHBIInsights config={staffingInsights} cardId="staffing-executive" />
                        </div>

                        {/* Behavioral Analytics */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Behavioral Analytics
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm font-medium">Team Diversity</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-2xl font-bold">
                                    {(() => {
                                      const staffWithProfiles = staffMembers.filter((s) => s.behavioralProfile)
                                      const discTypes = staffWithProfiles.map(
                                        (s) => s.behavioralProfile!.discProfile.type
                                      )
                                      const uniqueTypes = new Set(discTypes)
                                      return Math.round((uniqueTypes.size / discTypes.length) * 100)
                                    })()}
                                    %
                                  </div>
                                  <div className="text-xs text-muted-foreground">Behavioral diversity across teams</div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-medium">High Compatibility</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-2xl font-bold">
                                    {(() => {
                                      const staffWithProfiles = staffMembers.filter((s) => s.behavioralProfile)
                                      const highCompatibility = staffWithProfiles.filter(
                                        (s) => s.behavioralProfile!.teamCompatibility.overallScore >= 80
                                      )
                                      return Math.round((highCompatibility.length / staffWithProfiles.length) * 100)
                                    })()}
                                    %
                                  </div>
                                  <div className="text-xs text-muted-foreground">Staff with excellent team fit</div>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  <span className="text-sm font-medium">Risk Assessment</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-2xl font-bold">
                                    {(() => {
                                      const staffWithProfiles = staffMembers.filter((s) => s.behavioralProfile)
                                      const lowCompatibility = staffWithProfiles.filter(
                                        (s) => s.behavioralProfile!.teamCompatibility.overallScore < 60
                                      )
                                      return Math.round((lowCompatibility.length / staffWithProfiles.length) * 100)
                                    })()}
                                    %
                                  </div>
                                  <div className="text-xs text-muted-foreground">Staff needing placement review</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </div>
            )}

            {/* Assignments & SPCR Management Content */}
            {activeTab === "assignments" && (
              <div className="space-y-6">
                {/* Staff Assignment Management */}
                <EnhancedInteractiveStaffingGantt userRole="executive" />
              </div>
            )}
          </div>
        </div>

        {/* Export Modal */}
        <ExportModal
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          onExport={handleExportSubmit}
          defaultFileName="staffing-export"
        />

        {/* SPCR Assignment Modal */}
        <Dialog
          open={assignmentModal.isOpen}
          onOpenChange={(open) => setAssignmentModal((prev) => ({ ...prev, isOpen: open }))}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[99999]">
            <DialogHeader>
              <DialogTitle>
                {assignmentModal.step === "overview"
                  ? "Assignment Overview"
                  : assignmentModal.step === "staff-selection"
                  ? "Select Staff Members"
                  : assignmentModal.step === "compatibility-analysis"
                  ? "Team Compatibility Analysis"
                  : assignmentModal.step === "assignment-config"
                  ? "Configure Assignment"
                  : "Confirm Assignment"}
              </DialogTitle>
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
                  {[
                    "overview",
                    "staff-selection",
                    "compatibility-analysis",
                    "assignment-config",
                    "confirmation",
                  ].indexOf(assignmentModal.step) + 1}{" "}
                  of 5
                </div>
              </div>

              {/* SPCR Information */}
              {assignmentModal.spcr && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">SPCR ID:</span> {assignmentModal.spcr.id}
                    </div>
                    <div>
                      <span className="font-medium">Project:</span> {getProjectName(assignmentModal.spcr.project_id)}
                    </div>
                    <div>
                      <span className="font-medium">Position:</span> {assignmentModal.spcr.position}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <span
                        className={`ml-1 ${
                          assignmentModal.spcr.type === "increase" ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {assignmentModal.spcr.type === "increase" ? "Add Staff" : "Remove Staff"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Explanation:</span> {assignmentModal.spcr.explanation}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Overview & Context */}
              {assignmentModal.step === "overview" && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Assignment Overview</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        This guided workflow will help you make optimal staff assignments using behavioral data and team
                        compatibility analysis.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
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
                        <p className="text-xs text-muted-foreground">
                          Data-driven decisions with clear recommendations
                        </p>
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
                      Choose staff members who match the position requirements. Behavioral compatibility will be
                      analyzed in the next step.
                    </p>

                    {/* Selected Staff Members */}
                    {assignmentModal.selectedStaffMembers.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">
                          Selected Staff ({assignmentModal.selectedStaffMembers.length})
                        </h4>
                        <div className="space-y-2">
                          {assignmentModal.selectedStaffMembers.map((staff) => (
                            <div
                              key={staff.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-muted-foreground">{staff.position}</div>
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
                      <h4 className="font-medium mb-2">Available Staff</h4>
                      {(() => {
                        const availableStaff = getStaffByPosition(assignmentModal.selectedPosition)

                        if (availableStaff.length === 0) {
                          return (
                            <div className="text-center py-8 text-muted-foreground">
                              <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <div className="text-sm">
                                No staff members found for position: {assignmentModal.selectedPosition}
                              </div>
                              <div className="text-xs">Consider broadening the search or recruiting new staff.</div>
                            </div>
                          )
                        }

                        return (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {availableStaff.map((staff) => (
                              <div
                                key={staff.id}
                                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleStaffMemberSelect(staff.id)}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <div className="font-medium">{staff.name}</div>
                                    <div className="text-sm text-muted-foreground">{staff.position}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {staff.experience} years experience • ${staff.laborRate}/hr
                                    </div>
                                  </div>
                                  <Button size="sm" className="ml-2">
                                    Select
                                  </Button>
                                </div>

                                {/* Behavioral Profile Summary */}
                                {staff.behavioralProfile && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                      <Brain className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                      <span className="font-medium">Behavioral Profile</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">DiSC:</span>
                                        <Badge variant="outline" className="text-xs">
                                          {staff.behavioralProfile.discProfile.type}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">Leadership:</span>
                                        <Badge variant="outline" className="text-xs">
                                          {staff.behavioralProfile.integrus360.leadershipType}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {staff.behavioralProfile.discProfile.summary.substring(0, 100)}...
                                    </div>
                                  </div>
                                )}

                                {/* Team Compatibility Preview */}
                                {staff.behavioralProfile && (
                                  <div className="mt-2 pt-2 border-t">
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-muted-foreground">Team Compatibility:</span>
                                      <Badge
                                        variant="outline"
                                        className={cn(
                                          "text-xs",
                                          staff.behavioralProfile.teamCompatibility.overallScore >= 85
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : staff.behavioralProfile.teamCompatibility.overallScore >= 70
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                            : staff.behavioralProfile.teamCompatibility.overallScore >= 50
                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        )}
                                      >
                                        {staff.behavioralProfile.teamCompatibility.overallScore}%
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Compatibility Analysis */}
              {assignmentModal.step === "compatibility-analysis" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Team Compatibility Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed analysis of how selected staff members will fit with the existing team.
                    </p>

                    {assignmentModal.selectedStaffMembers.length > 0 ? (
                      <div className="space-y-6">
                        {/* Compatibility Metrics */}
                        {assignmentModal.compatibilityData && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-green-600">
                                  {assignmentModal.compatibilityData.teamScore}%
                                </div>
                                <div className="text-xs text-muted-foreground">Team Score</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-blue-600">
                                  {assignmentModal.compatibilityData.diversityScore}%
                                </div>
                                <div className="text-xs text-muted-foreground">Diversity</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-purple-600">
                                  {assignmentModal.compatibilityData.leadershipBalance}%
                                </div>
                                <div className="text-xs text-muted-foreground">Leadership Balance</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-2xl font-bold text-orange-600">
                                  {assignmentModal.compatibilityData.communicationBalance}%
                                </div>
                                <div className="text-xs text-muted-foreground">Communication</div>
                              </CardContent>
                            </Card>
                          </div>
                        )}

                        {/* Risk Assessment */}
                        {assignmentModal.compatibilityData &&
                          assignmentModal.compatibilityData.riskFactors.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                                  Risk Factors
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {assignmentModal.compatibilityData.riskFactors.map((risk, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                      <span className="text-orange-600 mt-1">•</span>
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                        {/* Recommendations */}
                        {assignmentModal.compatibilityData &&
                          assignmentModal.compatibilityData.recommendations.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-blue-600" />
                                  Recommendations
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2">
                                  {assignmentModal.compatibilityData.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                      <span className="text-blue-600 mt-1">•</span>
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          )}

                        {/* Behavioral Analysis for Each Selected Staff */}
                        <div className="space-y-4">
                          {assignmentModal.selectedStaffMembers.map((staff) => (
                            <Card key={staff.id}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  {staff.name} - Behavioral Analysis
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {staff.behavioralProfile && (
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <BehavioralTeamCompatibility
                                      staffMember={staff}
                                      existingTeamMembers={staffMembers.filter((s) =>
                                        s.assignments.some((a) => a.project_id === assignmentModal.selectedProject)
                                      )}
                                      projectId={assignmentModal.selectedProject || undefined}
                                      showDetailedAnalysis={true}
                                    />

                                    <TeamCompatibilityEngine
                                      candidate={staff}
                                      existingTeam={staffMembers.filter((s) =>
                                        s.assignments.some((a) => a.project_id === assignmentModal.selectedProject)
                                      )}
                                      projectId={assignmentModal.selectedProject || undefined}
                                      onTeamAnalysis={(analysis) => {
                                        console.log("Team analysis:", analysis)
                                      }}
                                    />
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">No staff members selected</div>
                        <div className="text-xs">Please go back and select staff members for analysis</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Assignment Configuration */}
              {assignmentModal.step === "assignment-config" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Configure Assignment Details</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set the final details for the staff assignment with behavioral context.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Assignment Details */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Start Date</label>
                          <Input
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
                          <label className="text-sm font-medium">End Date</label>
                          <Input
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
                          <label className="text-sm font-medium">Priority</label>
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
                          <label className="text-sm font-medium">Comments</label>
                          <Textarea
                            value={assignmentModal.assignmentDetails.comments}
                            onChange={(e) =>
                              setAssignmentModal((prev) => ({
                                ...prev,
                                assignmentDetails: { ...prev.assignmentDetails, comments: e.target.value },
                              }))
                            }
                            placeholder="Add any additional notes or context..."
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Behavioral Context */}
                      <div className="space-y-4">
                        <h4 className="font-medium">Behavioral Context</h4>
                        {assignmentModal.selectedStaffMembers.map((staff) => (
                          <Card key={staff.id} className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{staff.name}</span>
                            </div>
                            {staff.behavioralProfile && (
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">DiSC:</span>
                                  <Badge variant="outline">{staff.behavioralProfile.discProfile.type}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Leadership:</span>
                                  <Badge variant="outline">{staff.behavioralProfile.integrus360.leadershipType}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {staff.behavioralProfile.discProfile.summary.substring(0, 80)}...
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}
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
                      Review the final assignment details and behavioral impact assessment.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Assignment Summary */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Assignment Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <span className="text-sm font-medium">Project:</span>
                            <div className="text-sm text-muted-foreground">
                              {assignmentModal.spcr && getProjectName(assignmentModal.spcr.project_id)}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Position:</span>
                            <div className="text-sm text-muted-foreground">{assignmentModal.selectedPosition}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Staff Members:</span>
                            <div className="text-sm text-muted-foreground">
                              {assignmentModal.selectedStaffMembers.map((s) => s.name).join(", ")}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Duration:</span>
                            <div className="text-sm text-muted-foreground">
                              {assignmentModal.assignmentDetails.startDate} to{" "}
                              {assignmentModal.assignmentDetails.endDate}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Priority:</span>
                            <Badge
                              variant={
                                assignmentModal.assignmentDetails.priority === "high"
                                  ? "destructive"
                                  : assignmentModal.assignmentDetails.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {assignmentModal.assignmentDetails.priority}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Behavioral Impact */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Behavioral Impact Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {assignmentModal.compatibilityData ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">
                                    {assignmentModal.compatibilityData.teamScore}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">Team Compatibility</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {assignmentModal.compatibilityData.diversityScore}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">Behavioral Diversity</div>
                                </div>
                              </div>
                              {assignmentModal.compatibilityData.riskFactors.length > 0 && (
                                <div>
                                  <h5 className="font-medium text-sm mb-2">Risk Factors:</h5>
                                  <ul className="text-xs space-y-1">
                                    {assignmentModal.compatibilityData.riskFactors.map((risk, index) => (
                                      <li key={index} className="text-orange-600">
                                        • {risk}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <div className="text-sm">No compatibility data available</div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <div>
                  {assignmentModal.step !== "overview" && (
                    <Button variant="outline" onClick={handlePreviousStep}>
                      ← Previous
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setAssignmentModal((prev) => ({ ...prev, isOpen: false }))}>
                    Cancel
                  </Button>
                  {assignmentModal.step === "overview" && <Button onClick={handleNextStep}>Get Started →</Button>}
                  {assignmentModal.step === "staff-selection" && (
                    <Button
                      onClick={() => {
                        calculateTeamCompatibility()
                        handleNextStep()
                      }}
                      disabled={assignmentModal.selectedStaffMembers.length === 0}
                    >
                      Analyze Compatibility →
                    </Button>
                  )}
                  {assignmentModal.step === "compatibility-analysis" && (
                    <Button onClick={handleNextStep}>Configure Assignment →</Button>
                  )}
                  {assignmentModal.step === "assignment-config" && (
                    <Button onClick={handleNextStep}>Review & Confirm →</Button>
                  )}
                  {assignmentModal.step === "confirmation" && (
                    <Button onClick={handleCompleteAssignment} className="bg-green-600 hover:bg-green-700">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Complete Assignment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Presentation Carousel - Rendered outside main container for full-screen coverage */}
      {showTour && typeof window !== "undefined" && (
        <>
          {(() => {
            console.log("🎬 Executive Staffing Tour: Rendering PresentationCarousel")
            return null
          })()}
          {createPortal(
            <PresentationCarousel
              slides={executiveStaffingSlides}
              onComplete={handleTourComplete}
              ctaText="Return to Executive Staffing"
              ctaIcon={UserCheck}
            />,
            document.body
          )}
        </>
      )}
    </>
  )
}
