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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { AppHeader } from "@/components/layout/app-header"

// Import presentation components
import { PresentationCarousel } from "@/components/presentation/PresentationCarousel"
import { executiveStaffingSlides } from "@/components/presentation/executiveStaffingSlides"

// Import components
import { InteractiveStaffingGantt } from "@/app/dashboard/staff-planning/components/InteractiveStaffingGantt"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"
import { ExportModal } from "@/components/constraints/ExportModal"
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
interface StaffMember {
  id: string
  name: string
  position: string
  laborRate: number
  billableRate: number
  experience: number
  strengths: string[]
  weaknesses: string[]
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
  step: "staff" | "assignments"
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
    step: "staff",
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
      step: "staff",
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

  // Handle staff member selection in assignment modal
  const handleStaffMemberSelect = (staffMemberId: string) => {
    const staff = staffMembers.find((s) => s.id === staffMemberId)
    if (!staff || !assignmentModal.spcr) return

    const initialAssignment = createNewAssignment(assignmentModal.spcr.position, assignmentModal.spcr.project_id)

    // Set dates from SPCR
    initialAssignment.startDate = assignmentModal.spcr.startDate.split("T")[0]
    initialAssignment.endDate = assignmentModal.spcr.endDate.split("T")[0]
    initialAssignment.comments = `Assigned to fulfill SPCR ${assignmentModal.spcr.id}: ${assignmentModal.spcr.explanation}`

    setAssignmentModal((prev) => ({
      ...prev,
      staffMember: staff,
      assignments: [initialAssignment],
      step: "assignments",
    }))
  }

  // Handle assignment completion
  const handleCompleteAssignment = () => {
    if (!assignmentModal.spcr || !assignmentModal.staffMember) return

    toast({
      title: "Assignment Completed",
      description: `${assignmentModal.staffMember.name} assigned to ${assignmentModal.spcr.position}. SPCR ${assignmentModal.spcr.id} workflow closed.`,
    })

    // Close modal
    setAssignmentModal({
      isOpen: false,
      spcr: null,
      staffMember: null,
      assignments: [],
      selectedProject: null,
      selectedPosition: "",
      step: "staff",
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
      step: "staff",
      staffMember: null,
      assignments: [],
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
                <InteractiveStaffingGantt userRole="executive" />
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
                {assignmentModal.step === "staff" ? "Assign Staff to SPCR" : "Assignment Details"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
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

              {/* Step 1: Staff Selection */}
              {assignmentModal.step === "staff" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Select Staff Member</label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a staff member who matches the position requirements for this SPCR.
                    </p>

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
                        <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                          {availableStaff.map((staff) => (
                            <div
                              key={staff.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleStaffMemberSelect(staff.id)}
                            >
                              <div className="flex justify-between items-start">
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
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Step 2: Assignment Details */}
              {assignmentModal.step === "assignments" &&
                assignmentModal.staffMember &&
                assignmentModal.assignments.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Button variant="outline" size="sm" onClick={goBackToStaffSelection}>
                        ← Back to Staff Selection
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">
                          <span className="font-medium">{assignmentModal.staffMember.name}</span>
                          <span className="text-muted-foreground"> • {assignmentModal.staffMember.position}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Form */}
                    {assignmentModal.assignments.map((assignment, index) => (
                      <div key={assignment.id} className="border rounded-lg p-4 space-y-4">
                        <h5 className="font-medium">Assignment Details</h5>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Project</label>
                          <Select
                            value={assignment.project_id.toString()}
                            onValueChange={(value) => updateAssignment(assignment.id, { project_id: Number(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {projects
                                .filter((p) => p.active)
                                .map((project) => (
                                  <SelectItem key={project.project_id} value={project.project_id.toString()}>
                                    {project.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

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

                        <div>
                          <label className="text-sm font-medium mb-2 block">Comments</label>
                          <Textarea
                            placeholder="Add any notes about this assignment..."
                            value={assignment.comments}
                            onChange={(e) => updateAssignment(assignment.id, { comments: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setAssignmentModal((prev) => ({ ...prev, isOpen: false }))}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCompleteAssignment} className="bg-green-600 hover:bg-green-700">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Complete Assignment
                      </Button>
                    </div>
                  </div>
                )}
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
