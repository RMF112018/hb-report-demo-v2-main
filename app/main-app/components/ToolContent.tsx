/**
 * @fileoverview Tool Content Component for Main Application
 * @module ToolContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Renders tool-specific content with standardized layout:
 * - Breadcrumb navigation
 * - Module title and description
 * - Tab navigation
 * - Two-column layout with detail panels and main content
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Progress } from "../../../components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../components/ui/collapsible"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import {
  ChevronRight,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Calendar,
  CalendarDays,
  Settings,
  Building2,
  UserCheck,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Download,
  Target,
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  CheckCircle,
  Eye,
  Calculator,
  Receipt,
  CreditCard,
  GitBranch,
  Banknote,
  Percent,
  TrendingDown,
  RefreshCw,
  Package,
  PieChart,
  Scale,
  Activity,
  Shield,
  Plus,
  Maximize,
  Minimize,
  Edit,
  Search,
  Filter,
  RotateCcw,
  Monitor,
  Brain,
  MoreVertical,
  Import,
  ArrowRight,
  Home,
} from "lucide-react"
import type { UserRole } from "../../project/[projectId]/types/project"
import type { ProcurementLogRecord, ProcoreCommitment, BidTabLink } from "../../../types/procurement"
import { useToast } from "../../../hooks/use-toast"
import { useAuth } from "../../../context/auth-context"
import { cn } from "../../../lib/utils"

// Import staffing components
import { EnhancedHBIInsights } from "../../../components/cards/EnhancedHBIInsights"
import { InteractiveStaffingGantt } from "../../dashboard/staff-planning/components/InteractiveStaffingGantt"
import { SPCRInboxPanel } from "../../dashboard/staff-planning/components/SPCRInboxPanel"
import { LaborVsRevenuePanel } from "../../dashboard/staff-planning/components/LaborVsRevenuePanel"
import { useStaffingStore } from "../../dashboard/staff-planning/store/useStaffingStore"
import { ExportModal } from "../../../components/constraints/ExportModal"

// Import mock data
import staffingData from "../../../data/mock/staffing/staffing.json"
import projectsData from "../../../data/mock/projects.json"
import spcrData from "../../../data/mock/staffing/spcr.json"
import cashFlowData from "../../../data/mock/financial/cash-flow.json"

// Financial Hub Components
import FinancialOverview from "../../../components/financial-hub/FinancialOverview"
import BudgetAnalysis from "../../../components/financial-hub/BudgetAnalysis"
import CashFlowAnalysis from "../../../components/financial-hub/CashFlowAnalysis"
import { PayApplication } from "../../../components/financial-hub/PayApplication"
import ARAgingCard from "../../../components/financial-hub/ARAgingCard"
import PayAuthorizations from "../../../components/financial-hub/PayAuthorizations"
import JCHRCard from "../../../components/financial-hub/JCHRCard"
import ChangeManagement from "../../../components/financial-hub/ChangeManagement"
import CostTracking from "../../../components/financial-hub/CostTracking"
import Forecasting from "../../../components/financial-hub/Forecasting"
import RetentionManagement from "../../../components/financial-hub/RetentionManagement"

// Procurement Components
import { ProcurementLogTable } from "../../../components/procurement/ProcurementLogTable"
import { ProcurementLogForm } from "../../../components/procurement/ProcurementLogForm"
import { ProcurementSyncPanel } from "../../../components/procurement/ProcurementSyncPanel"
import { ProcurementStatsPanel } from "../../../components/procurement/ProcurementStatsPanel"
import { HbiProcurementInsights } from "../../../components/procurement/HbiProcurementInsights"

// Scheduler Components
import SchedulerOverview from "../../../components/scheduler/SchedulerOverview"
import ScheduleMonitor from "../../../components/scheduler/ScheduleMonitor"
import HealthAnalysis from "../../../components/scheduler/HealthAnalysis"
import LookAhead from "../../../components/scheduler/LookAhead"
import ScheduleGenerator from "../../../components/scheduler/ScheduleGenerator"

// Permit Components
import { PermitAnalytics } from "../../../components/permit-log/PermitAnalytics"
import { PermitFilters } from "../../../components/permit-log/PermitFilters"
import { PermitForm } from "../../../components/permit-log/PermitForm"
import { PermitExportModal } from "../../../components/permit-log/PermitExportModal"
import { PermitTable } from "../../../components/permit-log/PermitTable"
import { PermitCalendar } from "../../../components/permit-log/PermitCalendar"
import { PermitWidgets, type PermitStats } from "../../../components/permit-log/PermitWidgets"
import { HbiPermitInsights } from "../../../components/permit-log/HbiPermitInsights"
import { PermitExportUtils } from "../../../components/permit-log/PermitExportUtils"
import type { Permit, PermitFilters as PermitFiltersType } from "../../../types/permit-log"

// Import permit mock data
import permitsData from "../../../data/mock/logs/permits.json"

interface User {
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string
}

// Types from ExecutiveStaffingView
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

interface ToolContentProps {
  toolName: string
  userRole: UserRole
  user: User
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

interface ToolConfig {
  title: string
  description: string
  tabs: {
    id: string
    label: string
  }[]
}

const TOOL_CONFIGS: Record<string, ToolConfig> = {
  Staffing: {
    title: "Staffing",
    description:
      "Comprehensive staffing oversight across all projects and resources with strategic planning capabilities",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "management", label: "Staffing Plan Management" },
    ],
  },
  Reports: {
    title: "Reports",
    description: "Comprehensive reporting dashboard with approval workflows and analytics",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "reports", label: "Report Management" },
    ],
  },
  "Financial Hub": {
    title: "Financial Hub",
    description: "Comprehensive financial management and analysis suite",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "analysis", label: "Financial Analysis" },
    ],
  },
  Procurement: {
    title: "Procurement",
    description: "Track and manage subcontract procurement linked to Procore commitments and bid tabs",
    tabs: [
      { id: "log", label: "Procurement Log" },
      { id: "sync", label: "Procore Sync" },
      { id: "analytics", label: "Analytics" },
    ],
  },
  Scheduler: {
    title: "Scheduler",
    description: "AI-powered project scheduling and optimization platform",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "schedule-monitor", label: "Schedule Monitor" },
      { id: "health-analysis", label: "Health Analysis" },
      { id: "look-ahead", label: "Look Ahead" },
      { id: "generator", label: "Generator" },
    ],
  },
  "Constraints Log": {
    title: "Constraints Log",
    description: "Track and manage project constraints and resolutions",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "log", label: "Constraints Log" },
    ],
  },
}

const StaffingContent: React.FC<{ userRole: UserRole; user: User; activeTab: string }> = ({
  userRole,
  user,
  activeTab,
}) => {
  const { staffMembers, projects, spcrs, getSPCRsByRole } = useStaffingStore()

  // Calculate key metrics for executive overview
  const executiveSPCRs = getSPCRsByRole("executive")
  const pendingSPCRs = executiveSPCRs.filter((spcr) => spcr.workflowStage === "executive-review")
  const totalStaffCount = staffMembers.length
  const activeProjects = projects.filter((p) => p.active).length

  // Mock financial metrics - live labor cost vs contract inflow comparison
  const totalContractValue = projects.reduce((sum, p) => sum + p.contract_value, 0)
  const monthlyLaborCost = staffMembers.reduce((sum, staff) => sum + staff.laborRate * 40 * 4.33, 0) // Monthly cost
  const quarterlyGrowth = 12.5 // Mock percentage
  const laborToContractRatio = ((monthlyLaborCost * 12) / totalContractValue) * 100 // Annual labor as % of contract value

  if (activeTab === "overview") {
    return (
      <div className="space-y-6">
        {/* KPI Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalStaffCount}</span>
              </div>
              <div className="text-sm text-muted-foreground">Total Staff</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8% vs LQ</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${(totalContractValue / 1000000).toFixed(0)}M
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Contract Value</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Labor: ${(monthlyLaborCost / 1000).toFixed(0)}K/mo ({laborToContractRatio.toFixed(1)}%)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{activeProjects}</span>
              </div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {projects.length - activeProjects} in pipeline
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingSPCRs.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Pending SPCRs</div>
              {pendingSPCRs.length > 0 && (
                <Badge variant="destructive" className="text-xs mt-1 animate-pulse">
                  Needs Review
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interactive Gantt */}
        <InteractiveStaffingGantt userRole={userRole as "executive" | "project-executive" | "project-manager"} />

        {/* HBI Insights Integration */}
        <EnhancedHBIInsights
          config={[
            {
              id: "1",
              type: "opportunity",
              severity: "high",
              title: "Resource Reallocation Opportunity",
              text: "Analysis shows 15% efficiency gain possible by reallocating 3 superintendents from Beach Commons to Palm Beach Resort project.",
              action: "Consider reassigning Superintendents Johnson, Miller, and Davis to optimize project timelines.",
              confidence: 92,
              relatedMetrics: ["Staff Utilization", "Project Timeline", "Resource Allocation"],
              project_id: "PB-2024",
            },
            {
              id: "2",
              type: "risk",
              severity: "medium",
              title: "Labor Cost Variance Alert",
              text: "Q3 labor costs are trending 8% above budget across portfolio. Key drivers: overtime in mechanical trades.",
              action: "Implement staggered shift strategy and consider additional HVAC personnel.",
              confidence: 87,
              relatedMetrics: ["Labor Cost", "Overtime Hours", "Budget Variance"],
              project_id: "global",
            },
            {
              id: "3",
              type: "forecast",
              severity: "high",
              title: "Pipeline Staffing Readiness",
              text: "Upcoming Q4 project starts require 25% staff increase. Current talent pipeline can support 18% growth.",
              action: "Accelerate recruitment in Project Manager II and Superintendent I roles.",
              confidence: 91,
              relatedMetrics: ["Staffing Capacity", "Recruitment Pipeline", "Project Starts"],
              project_id: "global",
            },
          ]}
          cardId="executive-staffing"
        />

        {/* Bottom Row - Financial Analysis */}
        <LaborVsRevenuePanel userRole={userRole as "executive" | "project-executive" | "project-manager"} />
      </div>
    )
  }

  if (activeTab === "management") {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Staffing Plan Management</h3>
          <p className="text-muted-foreground">Advanced staffing plan management tools will be available here.</p>
        </div>
      </div>
    )
  }

  return null
}

// Legacy Staffing Content extracted from ExecutiveStaffingView
const StaffingLegacyContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  const { toast } = useToast()

  // State management extracted from ExecutiveStaffingView
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [spcrs, setSpcrs] = useState<SPCR[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [spcrFilter, setSpcrFilter] = useState<"approved" | "rejected" | "pending">("approved")
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize data
  useEffect(() => {
    setStaffMembers(staffingData as StaffMember[])
    setProjects(projectsData as Project[])
    setSpcrs(spcrData as SPCR[])
  }, [])

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

  // Helper functions
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <ChevronRight className="h-4 w-4" />
          <span>Staffing</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staffing</h1>
            <p className="text-muted-foreground">
              Comprehensive staffing oversight across all projects and resources with strategic planning capabilities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

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

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("assignments")}>
                <UserCheck className="h-4 w-4 mr-2" />
                Assignments
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("overview")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setSpcrFilter("pending")}>
                <FileText className="h-4 w-4 mr-2" />
                Pending SPCRs
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setIsExportModalOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>

          {/* SPCR Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                SPCR Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Approved</span>
                <span className="font-medium text-green-600">{overviewAnalytics.approvedSpcrs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-yellow-600">{overviewAnalytics.pendingSpcrs}</span>
              </div>
            </CardContent>
          </Card>

          {/* Key Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Key Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Staff Efficiency</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cost Control</span>
                <span className="font-medium text-blue-600">96%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Resource Planning</span>
                <span className="font-medium text-purple-600">88%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Executive Management Tabs */}
        <div className="xl:col-span-9">
          {/* Segmented Control */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
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
                        {isOverviewExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">Staff Utilization</span>
                            </div>
                            <div className="space-y-2">
                              <div className="text-2xl font-bold">{overviewAnalytics.utilizationRate.toFixed(1)}%</div>
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
                        <EnhancedHBIInsights config={staffingInsights as any} cardId="staffing-executive" />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </TabsContent>

            {/* Combined Assignments & SPCR Management Tab */}
            <TabsContent value="assignments" className="space-y-6">
              {/* Staff Assignment Management */}
              <InteractiveStaffingGantt userRole={userRole as "executive" | "project-executive" | "project-manager"} />

              {/* SPCR Integration Panel */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      SPCR Integration Workflow
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Tabs value={spcrFilter} onValueChange={(value: any) => setSpcrFilter(value)} className="w-auto">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="approved">Ready to Implement</TabsTrigger>
                          <TabsTrigger value="pending">Pending Review</TabsTrigger>
                          <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spcrFilter === "approved" && (
                      <div className="bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Ready for Implementation</span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          These approved SPCRs are ready to be converted into staff assignments. Use the "Create
                          Assignment" action to implement them.
                        </p>
                      </div>
                    )}

                    {filteredSpcrs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {spcrFilter === "approved"
                          ? "No approved SPCRs ready for implementation"
                          : `No ${spcrFilter} SPCRs found`}
                      </div>
                    ) : (
                      filteredSpcrs.map((spcr) => (
                        <Card
                          key={spcr.id}
                          className={cn(
                            "border-l-4 transition-colors hover:bg-muted/50",
                            spcr.status === "approved"
                              ? "border-l-green-500"
                              : spcr.status === "submitted"
                              ? "border-l-yellow-500"
                              : "border-l-red-500"
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  {getSpcrStatusIcon(spcr.status)}
                                  <span className="font-medium">{spcr.type}</span>
                                  {getSpcrStatusBadge(spcr.status)}
                                  {spcr.status === "approved" && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 animate-pulse">
                                      Ready to Implement
                                    </Badge>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                  <div>
                                    <div>
                                      <strong>Position:</strong> {spcr.position}
                                    </div>
                                    <div>
                                      <strong>Created by:</strong> {spcr.createdBy}
                                    </div>
                                  </div>
                                  <div>
                                    <div>
                                      <strong>Start Date:</strong> {new Date(spcr.startDate).toLocaleDateString()}
                                    </div>
                                    <div>
                                      <strong>Budget:</strong> ${spcr.budget.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm">
                                  <strong>Explanation:</strong> {spcr.explanation}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {spcr.status === "approved" ? (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() => {
                                        toast({
                                          title: "Assignment Created",
                                          description: `New assignment created for ${spcr.position} position. SPCR has been implemented.`,
                                        })
                                      }}
                                    >
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Create Assignment
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </Button>
                                  </>
                                ) : spcr.status === "submitted" ? (
                                  <>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={() => {
                                        // Update SPCR status to approved
                                        const updatedSpcrs = spcrs.map((s) =>
                                          s.id === spcr.id ? { ...s, status: "approved" as const } : s
                                        )
                                        setSpcrs(updatedSpcrs)
                                        toast({
                                          title: "SPCR Approved",
                                          description: `${spcr.type} request has been approved and is ready for implementation.`,
                                        })
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        // Update SPCR status to rejected
                                        const updatedSpcrs = spcrs.map((s) =>
                                          s.id === spcr.id ? { ...s, status: "rejected" as const } : s
                                        )
                                        setSpcrs(updatedSpcrs)
                                        toast({
                                          title: "SPCR Rejected",
                                          description: `${spcr.type} request has been rejected.`,
                                          variant: "destructive",
                                        })
                                      }}
                                    >
                                      Reject
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </Button>
                                  </>
                                ) : (
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                    View Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        onExport={handleExportSubmit}
        defaultFileName="staffing-export"
      />
    </div>
  )
}

// Financial Hub Content extracted from financial-hub/page.tsx
const FinancialHubContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  const [activeTab, setActiveTab] = useState("overview")

  // Financial module definitions
  interface FinancialModuleTab {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    component: React.ComponentType<{ userRole: string; projectData: any }>
    requiredRoles?: string[]
  }

  const financialModules: FinancialModuleTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Comprehensive financial dashboard with key metrics and insights",
      component: FinancialOverview,
    },
    {
      id: "budget-analysis",
      label: "Budget Analysis",
      icon: Calculator,
      description: "Detailed budget tracking, variance analysis, and performance metrics",
      component: BudgetAnalysis,
    },
    {
      id: "jchr",
      label: "JCHR",
      icon: Receipt,
      description: "Job Cost History Report with detailed cost breakdown and analysis",
      component: JCHRCard,
    },
    {
      id: "ar-aging",
      label: "AR Aging",
      icon: CreditCard,
      description: "Accounts receivable aging analysis and collection management",
      component: ARAgingCard,
    },
    {
      id: "cash-flow",
      label: "Cash Flow",
      icon: DollarSign,
      description: "Cash flow management, forecasting, and liquidity analysis",
      component: CashFlowAnalysis,
    },
    {
      id: "forecasting",
      label: "Forecasting",
      icon: Calendar,
      description: "AI-powered financial forecasting with GC & GR and Draw analysis",
      component: Forecasting,
    },
    {
      id: "change-management",
      label: "Change Management",
      icon: GitBranch,
      description: "Change order tracking and financial impact analysis",
      component: ChangeManagement,
    },
    {
      id: "pay-authorizations",
      label: "Pay Authorization",
      icon: FileText,
      description: "Payment authorization workflow and approval management",
      component: PayAuthorizations,
    },
    {
      id: "pay-authorization",
      label: "Pay Application",
      icon: Receipt,
      description: "Generate and manage formal AIA G702/G703 payment applications",
      component: PayApplication,
    },
    {
      id: "retention-management",
      label: "Retention",
      icon: Banknote,
      description: "Retention tracking and release management",
      component: RetentionManagement,
    },
  ]

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" }

    // Default role-based views
    switch (user.role) {
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
          projects: ["Tropical World Nursery"],
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View (6 Projects)",
          projects: [
            "Medical Center East",
            "Tech Campus Phase 2",
            "Marina Bay Plaza",
            "Tropical World",
            "Grandview Heights",
            "Riverside Plaza",
          ],
        }
      default:
        return {
          scope: "enterprise",
          projectCount: 12,
          description: "Enterprise View (All Projects)",
          projects: [],
        }
    }
  }

  const projectScope = getProjectScope()

  // Filter modules based on user role
  const availableModules = financialModules.filter((module) => {
    if (!module.requiredRoles) return true
    return user?.role && module.requiredRoles.includes(user.role)
  })

  // Get role-specific summary data based on current view
  const getSummaryData = () => {
    const scope = getProjectScope()

    // If viewing a single project (either by role or selection)
    if (scope.scope === "single") {
      return {
        totalContractValue: 57235491,
        netCashFlow: 8215006.64,
        profitMargin: 6.8,
        pendingApprovals: 3,
        healthScore: 88,
      }
    }

    // Portfolio or enterprise views
    switch (user?.role) {
      case "project-executive":
        return {
          totalContractValue: 285480000,
          netCashFlow: 42630000,
          profitMargin: 6.8,
          pendingApprovals: 12,
          healthScore: 86,
        }
      default:
        return {
          totalContractValue: 485280000,
          netCashFlow: 72830000,
          profitMargin: 6.4,
          pendingApprovals: 23,
          healthScore: 85,
        }
    }
  }

  const summaryData = getSummaryData()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Get dynamic KPIs based on active tab (max 8 widgets: 3 core + 5 module-specific)
  const getDynamicKPIs = (activeTab: string) => {
    const baseData = getSummaryData()

    // Core KPIs that are always present
    const coreKPIs = [
      {
        icon: Building2,
        value: formatCurrency(baseData.totalContractValue),
        label: "Contract Value",
        color: "blue",
      },
      {
        icon: TrendingUp,
        value: `${baseData.profitMargin}%`,
        label: "Profit Margin",
        color: "purple",
      },
      {
        icon: BarChart3,
        value: `${baseData.healthScore}%`,
        label: "Financial Health",
        color: "red",
      },
    ]

    // Enhanced module-specific KPIs with more insightful cards
    const moduleKPIs: Record<string, any[]> = {
      overview: [
        {
          icon: DollarSign,
          value: formatCurrency(baseData.netCashFlow),
          label: "Net Cash Flow",
          color: "green",
        },
        {
          icon: CheckCircle,
          value: baseData.pendingApprovals,
          label: "Pending Approvals",
          color: "amber",
        },
        {
          icon: Calculator,
          value: `${(((baseData.totalContractValue * 0.87) / baseData.totalContractValue) * 100).toFixed(1)}%`,
          label: "Budget Used",
          color: "emerald",
        },
        {
          icon: Target,
          value: "1.05",
          label: "CPI Score",
          color: "indigo",
        },
        {
          icon: AlertTriangle,
          value: "+2.8%",
          label: "Budget Variance",
          color: "yellow",
        },
      ],
      "budget-analysis": [
        {
          icon: Calculator,
          value: formatCurrency(baseData.totalContractValue * 0.87),
          label: "Actual Costs",
          color: "green",
        },
        {
          icon: Target,
          value: "1.05",
          label: "CPI Score",
          color: "indigo",
        },
        {
          icon: AlertTriangle,
          value: "+2.8%",
          label: "Budget Variance",
          color: "amber",
        },
        {
          icon: Percent,
          value: `${(((baseData.totalContractValue * 0.87) / baseData.totalContractValue) * 100).toFixed(1)}%`,
          label: "Budget Utilization",
          color: "emerald",
        },
        {
          icon: TrendingDown,
          value: formatCurrency(baseData.totalContractValue * 0.13),
          label: "Remaining Budget",
          color: "yellow",
        },
      ],
      "cash-flow": [
        {
          icon: TrendingUp,
          value: formatCurrency(baseData.totalContractValue * 0.72),
          label: "Total Inflows",
          color: "green",
        },
        {
          icon: TrendingDown,
          value: formatCurrency(baseData.totalContractValue * 0.68),
          label: "Total Outflows",
          color: "red",
        },
        {
          icon: DollarSign,
          value: formatCurrency(baseData.netCashFlow),
          label: "Net Cash Flow",
          color: "blue",
        },
        {
          icon: Building2,
          value: formatCurrency(baseData.totalContractValue * 0.15),
          label: "Working Capital",
          color: "purple",
        },
        {
          icon: Calendar,
          value: "45 Days",
          label: "Avg Collection",
          color: "amber",
        },
      ],
      "pay-authorization": [
        {
          icon: Receipt,
          value: formatCurrency(2280257.6),
          label: "Latest Pay App",
          color: "green",
        },
        {
          icon: Clock,
          value: "3 Days",
          label: "Avg Processing",
          color: "amber",
        },
        {
          icon: FileText,
          value: "12",
          label: "Total Applications",
          color: "blue",
        },
        {
          icon: CheckCircle,
          value: "8",
          label: "Approved This Month",
          color: "emerald",
        },
        {
          icon: DollarSign,
          value: formatCurrency(baseData.totalContractValue * 0.45),
          label: "Total Approved",
          color: "purple",
        },
      ],
    }

    // Get module-specific KPIs and limit to 5 additional widgets (3 core + 5 = 8 total max)
    const moduleSpecificKPIs = (moduleKPIs[activeTab] || []).slice(0, 5)

    return [...coreKPIs, ...moduleSpecificKPIs]
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <ChevronRight className="h-4 w-4" />
          <span>Financial Hub</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financial Hub</h1>
            <p className="text-muted-foreground">Comprehensive financial management and analysis suite</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Hub Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">{/* Financial Hub Tabs */}</div>

      {/* Dynamic KPI Widgets - Tab Specific */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {getDynamicKPIs(activeTab).map((kpi, index) => {
          const IconComponent = kpi.icon
          const colorClasses = {
            blue: "text-blue-600 dark:text-blue-400",
            green: "text-green-600 dark:text-green-400",
            purple: "text-purple-600 dark:text-purple-400",
            red: "text-red-600 dark:text-red-400",
            amber: "text-amber-600 dark:text-amber-400",
            emerald: "text-emerald-600 dark:text-emerald-400",
            indigo: "text-indigo-600 dark:text-indigo-400",
            yellow: "text-yellow-600 dark:text-yellow-400",
          }

          return (
            <Card key={`${kpi.label}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className={`h-5 w-5 ${colorClasses[kpi.color as keyof typeof colorClasses]} mr-2`} />
                  <span className={`text-2xl font-bold ${colorClasses[kpi.color as keyof typeof colorClasses]}`}>
                    {kpi.value}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{kpi.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Financial Modules */}
      <div className="space-y-6">
        {/* Tab Content */}
        {availableModules.map((module) => {
          const ModuleComponent = module.component

          if (module.id !== activeTab) return null

          return (
            <div key={module.id} className="space-y-6">
              {/* Module Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="p-2 rounded-lg bg-primary/10 border-primary/20">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{module.label}</h2>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              </div>

              {/* Module Content */}
              <ModuleComponent
                userRole={projectScope.scope === "single" ? "project-manager" : user?.role || "executive"}
                projectData={projectScope}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Procurement Content extracted from procurement/page.tsx
const ProcurementContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  const { toast } = useToast()

  // State management extracted from procurement page
  const [procurementRecords, setProcurementRecords] = useState<ProcurementLogRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ProcurementLogRecord[]>([])
  const [activeTab, setActiveTab] = useState("log")
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [csiFilter, setCsiFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<ProcurementLogRecord | null>(null)
  const [showRecordForm, setShowRecordForm] = useState(false)

  // Get role-specific data scope
  const getDataScope = () => {
    switch (userRole) {
      case "executive":
        return {
          scope: "enterprise",
          projectCount: 15,
          description: "Enterprise View - All Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true,
          canSync: true,
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View - 6 Projects",
          canCreate: true,
          canApprove: true,
          canEdit: true,
          canSync: true,
        }
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
          canCreate: true,
          canApprove: false,
          canEdit: true,
          canSync: false,
        }
      default:
        return {
          scope: "limited",
          projectCount: 1,
          description: "Limited View",
          canCreate: false,
          canApprove: false,
          canEdit: false,
          canSync: false,
        }
    }
  }

  const dataScope = getDataScope()

  // Mock data generation
  const generateMockProcurementRecords = (): ProcurementLogRecord[] => {
    const records: ProcurementLogRecord[] = [
      {
        id: "proc-001",
        procore_commitment_id: "2525840-001",
        project_id: "proj-001",
        commitment_title: "EXTERIOR WALL ASSEMBLIES",
        commitment_number: "2525840-001",
        vendor_name: "The City of West Palm Beach",
        vendor_contact: {
          name: "John Smith",
          email: "john.smith@cityofwestpalmbeach.com",
          phone: "(561) 822-1400",
        },
        csi_code: "07 40 00",
        csi_description: "Roofing and Siding Panels",
        status: "planning",
        contract_amount: 1609994.17,
        budget_amount: 1700000.0,
        variance: -90005.83,
        variance_percentage: -5.29,
        procurement_method: "competitive-bid",
        bid_tab_link: {
          bid_tab_id: "bid-tab-exterior-001",
          csi_match: true,
          description_match: 85,
        },
        contract_type: "subcontract",
        start_date: "2025-02-01",
        completion_date: "2025-06-30",
        milestones: [
          {
            name: "Bid Opening",
            date: "2025-01-15",
            status: "completed",
            completed: true,
          },
          {
            name: "Contract Award",
            date: "2025-01-30",
            status: "pending",
            completed: false,
          },
        ],
        compliance_status: "compliant",
        bonds_required: true,
        insurance_verified: true,
        created_at: "2025-01-10T10:00:00Z",
        updated_at: "2025-01-15T14:30:00Z",
        created_by: "System Import",
        procurement_notes: "Imported from Procore commitment. Linked to exterior wall assemblies bid tab.",
      },
      {
        id: "proc-002",
        procore_commitment_id: "2525840-002",
        project_id: "proj-001",
        commitment_title: "ACOUSTICAL SPACE UNITS",
        commitment_number: "2525840-002",
        vendor_name: "AMERICAN LEAK DETECTION",
        vendor_contact: {
          name: "Sarah Johnson",
          email: "sarah@americanleakdetection.com",
          phone: "(561) 744-6999",
        },
        csi_code: "09 50 00",
        csi_description: "Ceilings",
        status: "negotiation",
        contract_amount: 1018842.05,
        budget_amount: 1000000.0,
        variance: 18842.05,
        variance_percentage: 1.88,
        procurement_method: "competitive-bid",
        bid_tab_link: {
          bid_tab_id: "bid-tab-acoustical-001",
          csi_match: true,
          description_match: 92,
        },
        contract_type: "subcontract",
        start_date: "2025-03-01",
        completion_date: "2025-07-15",
        milestones: [
          {
            name: "Bid Analysis",
            date: "2025-01-20",
            status: "completed",
            completed: true,
          },
          {
            name: "Negotiations",
            date: "2025-02-01",
            status: "in-progress",
            completed: false,
          },
        ],
        compliance_status: "warning",
        bonds_required: false,
        insurance_verified: false,
        created_at: "2025-01-12T09:15:00Z",
        updated_at: "2025-01-20T16:45:00Z",
        created_by: "System Import",
        procurement_notes: "Insurance documentation pending. Negotiations ongoing for value engineering opportunities.",
      },
    ]
    return records
  }

  // Initialize data
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const mockRecords = generateMockProcurementRecords()
      setProcurementRecords(mockRecords)
      setFilteredRecords(mockRecords)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter records based on search and filters
  useEffect(() => {
    let filtered = procurementRecords

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.commitment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.csi_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.csi_description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    // CSI filter
    if (csiFilter !== "all") {
      filtered = filtered.filter((record) => record.csi_code.startsWith(csiFilter))
    }

    setFilteredRecords(filtered)
  }, [procurementRecords, searchTerm, statusFilter, csiFilter])

  // Handle Procore sync
  const handleProcoreSync = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const updatedRecords = generateMockProcurementRecords()
      setProcurementRecords(updatedRecords)
      toast({
        title: "Procore Sync Complete",
        description: "Commitment data has been synchronized from Procore",
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Procore. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle record creation/update
  const handleRecordSubmit = (recordData: Partial<ProcurementLogRecord>) => {
    if (selectedRecord) {
      const updatedRecords = procurementRecords.map((record) =>
        record.id === selectedRecord.id ? { ...record, ...recordData } : record
      )
      setProcurementRecords(updatedRecords)
      toast({
        title: "Record Updated",
        description: "Procurement record has been updated successfully",
      })
    } else {
      const newRecord: ProcurementLogRecord = {
        id: `proc-${Date.now()}`,
        procore_commitment_id: "",
        project_id: "proj-001",
        ...recordData,
      } as ProcurementLogRecord

      setProcurementRecords([...procurementRecords, newRecord])
      toast({
        title: "Record Created",
        description: "New procurement record has been created successfully",
      })
    }

    setShowRecordForm(false)
    setSelectedRecord(null)
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      toast({
        title: "Export Started",
        description: `Procurement log exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalValue = procurementRecords.reduce((sum, record) => sum + record.contract_amount, 0)
    const activeBuyouts = procurementRecords.filter((r) =>
      ["bidding", "negotiation", "awarded", "active"].includes(r.status)
    ).length
    const completedBuyouts = procurementRecords.filter((r) => r.status === "completed").length
    const pendingContracts = procurementRecords.filter((r) => r.status === "pending_approval").length
    const vendorCount = new Set(procurementRecords.map((r) => r.vendor_name)).size
    const complianceRate =
      (procurementRecords.filter((r) => r.compliance_status === "compliant").length /
        Math.max(procurementRecords.length, 1)) *
      100
    const avgSavings =
      procurementRecords.reduce((sum, r) => sum + Math.abs(r.variance_percentage), 0) /
      Math.max(procurementRecords.length, 1)

    return {
      totalValue,
      activeBuyouts,
      completedBuyouts,
      pendingContracts,
      vendorCount,
      complianceRate,
      avgSavings,
    }
  }, [procurementRecords])

  // Calculate procurement stats for components
  const procurementStats = useMemo(() => {
    const activeProcurements = procurementRecords.filter((r) =>
      ["bidding", "negotiation", "awarded", "active"].includes(r.status)
    ).length
    const completedProcurements = procurementRecords.filter((r) => r.status === "completed").length
    const pendingApprovals = procurementRecords.filter((r) => r.status === "pending_approval").length
    const linkedToBidTabs = procurementRecords.filter((r) => r.bid_tab_link?.bid_tab_id).length
    const avgCycleTime = 28

    return {
      totalValue: stats.totalValue,
      activeProcurements,
      completedProcurements,
      pendingApprovals,
      linkedToBidTabs,
      avgCycleTime,
      complianceRate: stats.complianceRate,
      totalRecords: procurementRecords.length,
    }
  }, [procurementRecords, stats])

  const ProcurementLogContentCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#FF6B35]" />
          Procurement Log
        </CardTitle>
        <Button variant="outline" size="sm" onClick={toggleFullScreen} className="flex items-center gap-2">
          {isFullScreen ? (
            <>
              <Minimize className="h-4 w-4" />
              Exit Full Screen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4" />
              Full Screen
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className={isFullScreen ? "h-[calc(100vh-80px)] overflow-y-auto" : ""}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex space-x-1 p-1 bg-muted rounded-lg mb-6">
            <button
              onClick={() => setActiveTab("log")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "log"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Procurement Log</span>
            </button>
            <button
              onClick={() => setActiveTab("sync")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "sync"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Procore Sync</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "analytics"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>

          <TabsContent value="log">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search procurement records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="bidding">Bidding</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="awarded">Awarded</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={csiFilter} onValueChange={setCsiFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="CSI Division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Divisions</SelectItem>
                      <SelectItem value="01">01 - General</SelectItem>
                      <SelectItem value="02">02 - Existing Conditions</SelectItem>
                      <SelectItem value="03">03 - Concrete</SelectItem>
                      <SelectItem value="04">04 - Masonry</SelectItem>
                      <SelectItem value="05">05 - Metals</SelectItem>
                      <SelectItem value="06">06 - Wood & Plastics</SelectItem>
                      <SelectItem value="07">07 - Thermal & Moisture</SelectItem>
                      <SelectItem value="08">08 - Openings</SelectItem>
                      <SelectItem value="09">09 - Finishes</SelectItem>
                      <SelectItem value="10">10 - Specialties</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Procurement Log Table */}
              <ProcurementLogTable
                records={filteredRecords}
                onRecordEdit={(record: ProcurementLogRecord) => {
                  setSelectedRecord(record)
                  setShowRecordForm(true)
                }}
                onRecordView={(record: ProcurementLogRecord) => {
                  // Handle record view
                }}
                isLoading={isLoading}
                userRole={userRole}
              />
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <ProcurementSyncPanel
              onSync={handleProcoreSync}
              isLoading={isLoading}
              lastSyncTime={new Date()}
              dataScope={dataScope}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <ProcurementStatsPanel stats={procurementStats} />
              <HbiProcurementInsights procurementStats={procurementStats} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <ChevronRight className="h-4 w-4" />
          <span>Procurement</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Procurement Log</h1>
            <p className="text-muted-foreground">
              Track and manage subcontract procurement linked to Procore commitments and bid tabs
            </p>
          </div>
          <div className="flex items-center gap-2">
            {dataScope.canSync && (
              <Button variant="outline" onClick={handleProcoreSync} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Sync Procore
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {dataScope.canCreate && (
              <Button onClick={() => setShowRecordForm(true)} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {!isFullScreen && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#FF6B35]" />
                    <span className="text-sm text-muted-foreground">Total Value</span>
                  </div>
                  <span className="font-semibold">
                    {stats.totalValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                  <span className="font-semibold">{procurementStats.activeProcurements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <span className="font-semibold">{procurementStats.completedProcurements}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Pending</span>
                  </div>
                  <span className="font-semibold">{procurementStats.pendingApprovals}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dataScope.canCreate && (
                  <Button onClick={() => setShowRecordForm(true)} className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                )}
                {dataScope.canSync && (
                  <Button variant="outline" onClick={handleProcoreSync} disabled={isLoading} className="w-full">
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Sync Procore
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsExportModalOpen(true)} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>

            {/* Procurement Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    Planning
                  </Badge>
                  <span className="text-sm font-medium">
                    {procurementRecords.filter((r) => r.status === "planning").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs bg-yellow-500">
                    Bidding
                  </Badge>
                  <span className="text-sm font-medium">
                    {procurementRecords.filter((r) => r.status === "bidding").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs bg-orange-500">
                    Negotiation
                  </Badge>
                  <span className="text-sm font-medium">
                    {procurementRecords.filter((r) => r.status === "negotiation").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="text-xs bg-green-500">
                    Awarded
                  </Badge>
                  <span className="text-sm font-medium">
                    {procurementRecords.filter((r) => r.status === "awarded").length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Compliance Rate</span>
                  </div>
                  <span className="font-semibold">{stats.complianceRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Vendors</span>
                  </div>
                  <span className="font-semibold">{stats.vendorCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Avg Cycle Time</span>
                  </div>
                  <span className="font-semibold">{procurementStats.avgCycleTime} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#FF6B35]" />
                    <span className="text-sm text-muted-foreground">Avg Savings</span>
                  </div>
                  <span className="font-semibold">{stats.avgSavings.toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-9">
            {/* HBI Insights Panel */}
            <div className="mb-6">
              <HbiProcurementInsights procurementStats={procurementStats} />
            </div>

            {/* Main Content Card */}
            <ProcurementLogContentCard />
          </div>
        </div>
      )}

      {/* Fullscreen Content */}
      {isFullScreen && <ProcurementLogContentCard />}

      {/* Record Form Modal */}
      <Dialog open={showRecordForm} onOpenChange={setShowRecordForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRecord ? "Edit Procurement Record" : "Create New Procurement Record"}</DialogTitle>
          </DialogHeader>
          <ProcurementLogForm
            record={selectedRecord}
            onSubmit={handleRecordSubmit}
            onCancel={() => {
              setShowRecordForm(false)
              setSelectedRecord(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        onExport={handleExportSubmit}
        defaultFileName="ProcurementLog"
      />
    </div>
  )
}

// Scheduler Content extracted from scheduler/page.tsx
const SchedulerContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  const { toast } = useToast()

  // State management extracted from scheduler page
  const [activeTab, setActiveTab] = useState("overview")
  const [showMenuPopover, setShowMenuPopover] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", description: "" })

  // Define scheduler module interfaces
  interface SchedulerModuleTab {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    component: React.ComponentType<{ userRole: string; projectData: any }>
    requiredRoles?: string[]
  }

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" }

    switch (user.role) {
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
          projects: ["Tropical World Nursery"],
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View (6 Projects)",
          projects: [
            "Medical Center East",
            "Tech Campus Phase 2",
            "Marina Bay Plaza",
            "Tropical World",
            "Grandview Heights",
            "Riverside Plaza",
          ],
        }
      default:
        return {
          scope: "enterprise",
          projectCount: 12,
          description: "Enterprise View (All Projects)",
          projects: [],
        }
    }
  }

  const projectScope = getProjectScope()

  // Define available scheduler modules
  const schedulerModules: SchedulerModuleTab[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      description: "Dashboard analytics and HBI insights for schedule performance analysis",
      component: SchedulerOverview,
    },
    {
      id: "schedule-monitor",
      label: "Schedule Monitor",
      icon: Monitor,
      description: "Compare current and historical schedules with milestone tracking",
      component: ScheduleMonitor,
    },
    {
      id: "health-analysis",
      label: "Health Analysis",
      icon: Activity,
      description: "Deep schedule logic analysis including ties, errors, and gaps",
      component: HealthAnalysis,
    },
    {
      id: "look-ahead",
      label: "Look Ahead",
      icon: Eye,
      description: "Create frag net schedules for detailed field execution tracking",
      component: LookAhead,
    },
    {
      id: "generator",
      label: "Generator",
      icon: Zap,
      description: "HBI-powered construction schedule generation with AI optimization",
      component: ScheduleGenerator,
    },
  ]

  // Filter modules based on user role (all users can access all scheduler modules)
  const availableModules = schedulerModules

  // Get role-specific summary data based on current view
  const getSummaryData = () => {
    const scope = getProjectScope()

    // If viewing a single project (either by role or selection)
    if (scope.scope === "single") {
      return {
        totalActivities: 1247,
        criticalPathDuration: 312,
        scheduleHealth: 87,
        currentVariance: -8,
        upcomingMilestones: 5,
      }
    }

    // Portfolio or enterprise views
    switch (user?.role) {
      case "project-executive":
        return {
          totalActivities: 7890,
          criticalPathDuration: 284,
          scheduleHealth: 84,
          currentVariance: -12,
          upcomingMilestones: 23,
        }
      default:
        return {
          totalActivities: 12456,
          criticalPathDuration: 297,
          scheduleHealth: 82,
          currentVariance: -15,
          upcomingMilestones: 47,
        }
    }
  }

  const summaryData = getSummaryData()

  const formatDuration = (days: number) => {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return `${months}m ${remainingDays}d`
  }

  const handleMenuItemClick = (item: string) => {
    setShowMenuPopover(false)

    const modalData = {
      Import: {
        title: "Import Schedules",
        description:
          "Import project schedules from popular scheduling tools like Primavera P6, Microsoft Project, and other industry-standard formats. This feature will support automatic data mapping, schedule validation, and integration with existing project data.",
      },
      Export: {
        title: "Export Schedules",
        description:
          "Export your project schedules to various formats including PDF reports, Excel spreadsheets, MS Project files, and Primavera P6 formats. Advanced export options will include custom templates, filtered data sets, and automated report generation.",
      },
      Refresh: {
        title: "Refresh Data",
        description:
          "Automatically refresh all schedule data from connected project management systems and databases. This feature will sync real-time updates, validate data integrity, and notify users of any changes or conflicts.",
      },
      Settings: {
        title: "Scheduler Settings",
        description:
          "Configure advanced scheduler preferences including default views, calculation methods, working calendars, resource allocation rules, and AI optimization parameters. Customize the interface to match your project management workflow.",
      },
    }

    setModalContent(modalData[item as keyof typeof modalData])
    setShowInfoModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <ChevronRight className="h-4 w-4" />
          <span>Scheduler</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scheduler</h1>
            <p className="text-muted-foreground">AI-powered project scheduling and optimization platform</p>
          </div>
          <div className="flex items-center gap-2">
            <Popover open={showMenuPopover} onOpenChange={setShowMenuPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleMenuItemClick("Import")}
                  >
                    <Import className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleMenuItemClick("Export")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleMenuItemClick("Refresh")}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleMenuItemClick("Settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Statistics Widgets - Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {summaryData.totalActivities.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatDuration(summaryData.criticalPathDuration)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Critical Path</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {summaryData.scheduleHealth}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Schedule Health</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {summaryData.currentVariance > 0 ? "+" : ""}
                  {summaryData.currentVariance}d
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Schedule Variance</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {summaryData.upcomingMilestones}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Upcoming Milestones</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          {/* Project Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Project Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">View Type</span>
                </div>
                <Badge variant="outline">{projectScope.scope}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Projects</span>
                </div>
                <span className="font-semibold">{projectScope.projectCount}</span>
              </div>
              <div className="text-sm text-muted-foreground">{projectScope.description}</div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleMenuItemClick("Import")}>
                <Import className="h-4 w-4 mr-2" />
                Import Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleMenuItemClick("Export")}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleMenuItemClick("Refresh")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleMenuItemClick("Settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Health */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Schedule Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Overall Health</span>
                </div>
                <span className="font-semibold text-green-600">{summaryData.scheduleHealth}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">On Track</span>
                </div>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">At Risk</span>
                </div>
                <span className="font-semibold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Behind</span>
                </div>
                <span className="font-semibold">7%</span>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Critical Path</span>
                </div>
                <span className="font-semibold">{formatDuration(summaryData.criticalPathDuration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Variance</span>
                </div>
                <span className="font-semibold">{summaryData.currentVariance}d</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[#FF6B35]" />
                  <span className="text-sm text-muted-foreground">AI Score</span>
                </div>
                <span className="font-semibold">8.7/10</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-9">
          {/* Scheduler Modules */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
              {availableModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveTab(module.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === module.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <module.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{module.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {availableModules.map((module) => {
              const ModuleComponent = module.component

              return (
                <TabsContent key={module.id} value={module.id} className="space-y-6">
                  {/* Module Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="p-2 rounded-lg bg-primary/10 border-primary/20">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{module.label}</h2>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>

                  {/* Module Content */}
                  <ModuleComponent
                    userRole={projectScope.scope === "single" ? "project-manager" : user?.role || "executive"}
                    projectData={projectScope}
                  />
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#003087] dark:text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-[#FF6B35]" />
              {modalContent.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              {modalContent.description}
            </DialogDescription>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowInfoModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Constraints Log Content Component
const ConstraintsLogContent: React.FC<{ onNavigateBack?: () => void }> = ({ onNavigateBack }) => {
  const { user } = useAuth()
  const { toast } = useToast()

  // Import constraints data
  const [constraintsData] = useState(() => {
    try {
      return require("@/data/mock/logs/constraints.json")
    } catch (error) {
      console.error("Error loading constraints data:", error)
      return []
    }
  })

  // State management
  const [projects] = useState(constraintsData)
  const [allConstraints, setAllConstraints] = useState<any[]>([])
  const [filteredConstraints, setFilteredConstraints] = useState<any[]>([])
  const [mainActiveTab, setMainActiveTab] = useState(() => {
    // Default to "projects" for executive/project-executive, "log" for others
    return user?.role === "executive" || user?.role === "project-executive" ? "projects" : "log"
  })
  const [activeTab, setActiveTab] = useState("open")
  const [categoryTab, setCategoryTab] = useState("Core")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingConstraint, setEditingConstraint] = useState<any>(null)
  const [deleteConstraint, setDeleteConstraint] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    assigned: "all",
    project: "all",
    dateRange: { start: null, end: null },
  })

  // Initialize constraints from all projects
  useEffect(() => {
    const constraints = projects.flatMap((project: any) => project.constraints || [])
    setAllConstraints(constraints)
  }, [projects])

  // Apply filters and group by category
  useEffect(() => {
    let filtered = allConstraints

    // Filter by tab (open/closed)
    if (activeTab === "open") {
      filtered = filtered.filter((c) => c.completionStatus !== "Closed")
    } else {
      filtered = filtered.filter((c) => c.completionStatus === "Closed")
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.description?.toLowerCase().includes(searchLower) ||
          c.category?.toLowerCase().includes(searchLower) ||
          c.assigned?.toLowerCase().includes(searchLower) ||
          c.reference?.toLowerCase().includes(searchLower) ||
          c.no?.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((c) => c.completionStatus === filters.status)
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category)
    }

    // Apply assignee filter
    if (filters.assigned !== "all") {
      filtered = filtered.filter((c) => c.assigned === filters.assigned)
    }

    // Apply project filter
    if (filters.project !== "all") {
      const projectId = parseInt(filters.project)
      const selectedProject = projects.find((p: any) => p.project_id === projectId)
      if (selectedProject) {
        const selectedProjectConstraintIds = selectedProject.constraints?.map((c: any) => c.id) || []
        filtered = filtered.filter((c: any) => selectedProjectConstraintIds.includes(c.id))
      }
    }

    setFilteredConstraints(filtered)
  }, [allConstraints, filters, activeTab, projects])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allConstraints.length
    const open = allConstraints.filter((c) => c.completionStatus !== "Closed").length
    const closed = allConstraints.filter((c) => c.completionStatus === "Closed").length
    const overdue = allConstraints.filter((c) => {
      if (c.completionStatus === "Closed") return false
      if (!c.dueDate) return false
      return new Date(c.dueDate) < new Date()
    }).length

    const byCategory = allConstraints.reduce((acc, constraint) => {
      acc[constraint.category] = (acc[constraint.category] || 0) + 1
      return acc
    }, {})

    const byStatus = allConstraints.reduce((acc, constraint) => {
      acc[constraint.completionStatus] = (acc[constraint.completionStatus] || 0) + 1
      return acc
    }, {})

    return { total, open, closed, overdue, byCategory, byStatus }
  }, [allConstraints])

  // Get unique values for filters
  const categories = useMemo(() => {
    return [...new Set(allConstraints.map((c) => c.category).filter(Boolean))].sort()
  }, [allConstraints])

  const assignees = useMemo(() => {
    return [...new Set(allConstraints.map((c) => c.assigned).filter(Boolean))].sort()
  }, [allConstraints])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Constraints data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExportSubmit = (options: any) => {
    try {
      toast({
        title: "Export Started",
        description: `Constraints data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  // Get role-specific scope
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" }

    switch (user.role) {
      case "project-manager":
        return {
          scope: "single",
          projectCount: 1,
          description: "Single Project View",
        }
      case "project-executive":
        return {
          scope: "portfolio",
          projectCount: 6,
          description: "Portfolio View (6 Projects)",
        }
      default:
        return {
          scope: "enterprise",
          projectCount: 12,
          description: "Enterprise View (All Projects)",
        }
    }
  }

  const projectScope = getProjectScope()

  // Category definitions for constraints
  const categoryDefinitions = [
    { id: "Core", label: "Core", icon: FileText },
    { id: "Pre-Construction", label: "Pre-Construction", icon: Building2 },
    { id: "Financial Management", label: "Financial Management", icon: DollarSign },
    { id: "Field Management", label: "Field Management", icon: Users },
    { id: "Compliance", label: "Compliance", icon: Shield },
    { id: "Warranty", label: "Warranty", icon: CheckCircle },
  ]

  // Filter constraints by selected category tab
  const categoryFilteredConstraints = useMemo(() => {
    if (categoryTab === "Core") {
      return allConstraints // Show all for Core
    }
    return allConstraints.filter((constraint) => {
      const category = constraint.category?.toLowerCase() || ""
      const tabLower = categoryTab.toLowerCase()

      // Map categories to tabs
      if (tabLower.includes("pre") && category.includes("pre")) return true
      if (
        tabLower.includes("financial") &&
        (category.includes("financial") || category.includes("budget") || category.includes("cost"))
      )
        return true
      if (
        tabLower.includes("field") &&
        (category.includes("field") || category.includes("site") || category.includes("construction"))
      )
        return true
      if (
        tabLower.includes("compliance") &&
        (category.includes("compliance") || category.includes("regulatory") || category.includes("permit"))
      )
        return true
      if (
        tabLower.includes("warranty") &&
        (category.includes("warranty") || category.includes("defect") || category.includes("closeout"))
      )
        return true

      return false
    })
  }, [allConstraints, categoryTab])

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{user?.firstName ? `${user.firstName} ${user.lastName}` : "User"}</span>
        <ArrowRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Constraints</span>
      </div>

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Constraints</h1>
          <p className="text-muted-foreground mt-1">Track and manage project constraints and resolutions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onNavigateBack} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex space-x-1 p-1 bg-muted rounded-lg">
        {/* Open Constraints by Project Tab - Only for Executive/Project Executive */}
        {(user?.role === "executive" || user?.role === "project-executive") && (
          <button
            onClick={() => setMainActiveTab("projects")}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              mainActiveTab === "projects"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Open Constraints by Project
          </button>
        )}

        {/* Constraints Log Tab */}
        <button
          onClick={() => setMainActiveTab("log")}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            mainActiveTab === "log"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-4 w-4" />
          Constraints Log
        </button>

        {/* Constraints Timeline Tab */}
        <button
          onClick={() => setMainActiveTab("timeline")}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            mainActiveTab === "timeline"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Constraints Timeline
        </button>
      </div>

      {/* Parent Container with Two Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Detail & Action Panels */}
        <div className="xl:col-span-3 space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total</span>
                </div>
                <span className="font-semibold">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Open</span>
                </div>
                <span className="font-semibold">{stats.open}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Closed</span>
                </div>
                <span className="font-semibold">{stats.closed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Overdue</span>
                </div>
                <span className="font-semibold">{stats.overdue}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => setIsCreateModalOpen(true)} className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]">
                <Plus className="h-4 w-4 mr-2" />
                Create Constraint
              </Button>
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="w-full">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
              <Button variant="outline" onClick={() => setIsExportModalOpen(true)} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>

          {/* Project Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Project Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">View Type</span>
                </div>
                <Badge variant="outline">{projectScope.scope}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Projects</span>
                </div>
                <span className="font-semibold">{projectScope.projectCount}</span>
              </div>
              <div className="text-sm text-muted-foreground">{projectScope.description}</div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(stats.byCategory)
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">{category}</span>
                    </div>
                    <span className="font-semibold">{count as number}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tab Main Content */}
        <div className="xl:col-span-9">
          {/* Open Constraints by Project Tab Content */}
          {mainActiveTab === "projects" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Open Constraints by Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Project-based constraint view coming soon.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Constraints Log Tab Content */}
          {mainActiveTab === "log" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Constraints Log
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="flex items-center gap-2"
                >
                  {isFullScreen ? (
                    <>
                      <Minimize className="h-4 w-4" />
                      Exit Full Screen
                    </>
                  ) : (
                    <>
                      <Maximize className="h-4 w-4" />
                      Full Screen
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex space-x-1 p-1 bg-muted rounded-lg mb-6">
                    <button
                      onClick={() => setActiveTab("open")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "open"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      Open Constraints ({stats.open})
                    </button>
                    <button
                      onClick={() => setActiveTab("closed")}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "closed"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Closed Constraints ({stats.closed})
                    </button>
                  </div>

                  <TabsContent value="open">
                    <div className="space-y-4">
                      {/* Search and Filter Bar */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search constraints..."
                            value={filters.search}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={filters.category}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={filters.assigned}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, assigned: value }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Assigned To" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Assignees</SelectItem>
                              {assignees.map((assignee) => (
                                <SelectItem key={assignee} value={assignee}>
                                  {assignee}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Constraints List */}
                      <div className="space-y-2">
                        {filteredConstraints.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No constraints found matching your criteria.</p>
                          </div>
                        ) : (
                          filteredConstraints.map((constraint) => (
                            <Card key={constraint.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{constraint.no}</Badge>
                                    <Badge variant={constraint.completionStatus === "Closed" ? "default" : "secondary"}>
                                      {constraint.completionStatus}
                                    </Badge>
                                    <Badge variant="outline">{constraint.category}</Badge>
                                  </div>
                                  <h3 className="font-semibold text-foreground mb-1">{constraint.description}</h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {constraint.assigned}
                                    </span>
                                    {constraint.dueDate && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(constraint.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                    {constraint.daysElapsed !== undefined && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {constraint.daysElapsed} days
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingConstraint(constraint)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="closed">
                    <div className="space-y-4">
                      {/* Search and Filter Bar */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search constraints..."
                            value={filters.search}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={filters.category}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={filters.assigned}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, assigned: value }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Assigned To" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Assignees</SelectItem>
                              {assignees.map((assignee) => (
                                <SelectItem key={assignee} value={assignee}>
                                  {assignee}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Closed Constraints List */}
                      <div className="space-y-2">
                        {filteredConstraints.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No closed constraints found matching your criteria.</p>
                          </div>
                        ) : (
                          filteredConstraints.map((constraint) => (
                            <Card key={constraint.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{constraint.no}</Badge>
                                    <Badge variant="default">{constraint.completionStatus}</Badge>
                                    <Badge variant="outline">{constraint.category}</Badge>
                                  </div>
                                  <h3 className="font-semibold text-foreground mb-1">{constraint.description}</h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {constraint.assigned}
                                    </span>
                                    {constraint.dueDate && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(constraint.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                    {constraint.daysElapsed !== undefined && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {constraint.daysElapsed} days
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingConstraint(constraint)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="closed">
                    <div className="space-y-4">
                      {/* Search and Filter Bar */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search constraints..."
                            value={filters.search}
                            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={filters.category}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={filters.assigned}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, assigned: value }))}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Assigned To" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Assignees</SelectItem>
                              {assignees.map((assignee) => (
                                <SelectItem key={assignee} value={assignee}>
                                  {assignee}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Closed Constraints List */}
                      <div className="space-y-2">
                        {filteredConstraints.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No closed constraints found matching your criteria.</p>
                          </div>
                        ) : (
                          filteredConstraints.map((constraint) => (
                            <Card key={constraint.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{constraint.no}</Badge>
                                    <Badge variant="default">{constraint.completionStatus}</Badge>
                                    <Badge variant="outline">{constraint.category}</Badge>
                                  </div>
                                  <h3 className="font-semibold text-foreground mb-1">{constraint.description}</h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {constraint.assigned}
                                    </span>
                                    {constraint.dueDate && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(constraint.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                    {constraint.daysElapsed !== undefined && (
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {constraint.daysElapsed} days
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setEditingConstraint(constraint)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Constraints Timeline Tab Content */}
          {mainActiveTab === "timeline" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Constraints Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Timeline view with constraint scheduling and dependencies coming soon.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || !!editingConstraint}
        onOpenChange={() => {
          setIsCreateModalOpen(false)
          setEditingConstraint(null)
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConstraint ? "Edit Constraint" : "Create New Constraint"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic constraint form - simplified for this integration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input placeholder="Enter constraint description" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setEditingConstraint(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setEditingConstraint(null)
                  toast({
                    title: "Success",
                    description: editingConstraint
                      ? "Constraint updated successfully"
                      : "Constraint created successfully",
                  })
                }}
              >
                {editingConstraint ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Constraints</DialogTitle>
            <DialogDescription>Choose export format and customize options</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">File Name</label>
              <Input defaultValue="ConstraintsLog" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleExportSubmit({ format: "pdf", fileName: "ConstraintsLog" })
                  setIsExportModalOpen(false)
                }}
              >
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Permit Log Content Component
const PermitLogContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  const { toast } = useToast()

  // State management
  const [permits, setPermits] = useState<Permit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([])
  const [filters, setFilters] = useState<PermitFiltersType>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showPermitForm, setShowPermitForm] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load permits data
  useEffect(() => {
    const loadPermits = async () => {
      try {
        setIsLoading(true)
        // Transform the imported data to match our interface
        const transformedPermits: Permit[] = permitsData.map((permit: any) => ({
          ...permit,
          inspections: permit.inspections || [],
          tags: permit.tags || [],
          conditions: permit.conditions || [],
          priority: permit.priority || "medium",
          authorityContact: permit.authorityContact || {},
        }))
        setPermits(transformedPermits)
      } catch (error) {
        console.error("Failed to load permits:", error)
        toast({
          title: "Error",
          description: "Failed to load permit data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPermits()
  }, [toast])

  // Role-based access control
  const hasCreateAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "project-manager", "project-executive"].includes(user.role)
  }, [user])

  const hasFullAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive"].includes(user.role)
  }, [user])

  const hasExportAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive", "project-executive", "project-manager"].includes(user.role)
  }, [user])

  // Filter permits based on user role and permissions
  const accessiblePermits = useMemo(() => {
    if (!user) return []

    let filtered = permits

    // Apply role-based filtering
    if (!hasFullAccess) {
      if (user.role === "project-executive") {
        // Show permits from assigned projects (mock data shows various project IDs)
        const assignedProjects = ["2525840", "2525841", "2525842"]
        filtered = filtered.filter((permit) => assignedProjects.includes(permit.projectId.toString()))
      } else if (user.role === "project-manager") {
        // Show permits from active project only
        const activeProject = "2525840"
        filtered = filtered.filter((permit) => permit.projectId.toString() === activeProject)
      }
    }

    return filtered
  }, [permits, user, hasFullAccess])

  // Apply filters and search
  useEffect(() => {
    let filtered = accessiblePermits

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (permit) =>
          permit.number.toLowerCase().includes(searchLower) ||
          permit.type.toLowerCase().includes(searchLower) ||
          permit.authority.toLowerCase().includes(searchLower) ||
          permit.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status) {
      filtered = filtered.filter((permit) => permit.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter((permit) => permit.type === filters.type)
    }

    if (filters.authority) {
      filtered = filtered.filter((permit) => permit.authority.toLowerCase().includes(filters.authority!.toLowerCase()))
    }

    if (filters.projectId) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === filters.projectId)
    }

    if (filters.dateRange) {
      filtered = filtered.filter((permit) => {
        const permitDate = new Date(permit.applicationDate)
        const startDate = new Date(filters.dateRange!.start)
        const endDate = new Date(filters.dateRange!.end)
        return permitDate >= startDate && permitDate <= endDate
      })
    }

    if (filters.expiringWithin) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithin)
      filtered = filtered.filter((permit) => {
        const expirationDate = new Date(permit.expirationDate)
        return expirationDate <= cutoffDate && (permit.status === "approved" || permit.status === "renewed")
      })
    }

    setFilteredPermits(filtered)
  }, [accessiblePermits, filters, searchTerm])

  // Calculate statistics
  const stats = useMemo((): PermitStats => {
    const totalPermits = filteredPermits.length
    const approvedPermits = filteredPermits.filter((p) => p.status === "approved" || p.status === "renewed").length
    const pendingPermits = filteredPermits.filter((p) => p.status === "pending").length
    const expiredPermits = filteredPermits.filter((p) => p.status === "expired").length
    const rejectedPermits = filteredPermits.filter((p) => p.status === "rejected").length

    const totalInspections = filteredPermits.reduce((sum, p) => sum + (p.inspections?.length || 0), 0)
    const passedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "passed").length || 0),
      0
    )
    const failedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "failed").length || 0),
      0
    )
    const pendingInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "pending").length || 0),
      0
    )

    const approvalRate = totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0
    const inspectionPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringPermits = filteredPermits.filter((p) => {
      const expDate = new Date(p.expirationDate)
      return expDate <= thirtyDaysFromNow && expDate > new Date() && (p.status === "approved" || p.status === "renewed")
    }).length

    const byType = filteredPermits.reduce((acc, permit) => {
      acc[permit.type] = (acc[permit.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byAuthority = filteredPermits.reduce((acc, permit) => {
      acc[permit.authority] = (acc[permit.authority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredPermits.reduce((acc, permit) => {
      acc[permit.status] = (acc[permit.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPermits,
      approvedPermits,
      pendingPermits,
      expiredPermits,
      rejectedPermits,
      expiringPermits,
      totalInspections,
      passedInspections,
      failedInspections,
      pendingInspections,
      approvalRate,
      inspectionPassRate,
      byType,
      byAuthority,
      byStatus,
    }
  }, [filteredPermits])

  // Event handlers
  const handleCreatePermit = () => {
    if (!hasCreateAccess) return
    setSelectedPermit(null)
    setShowPermitForm(true)
  }

  const handleEditPermit = (permit: Permit) => {
    setSelectedPermit(permit)
    setShowPermitForm(true)
  }

  const handleViewPermit = (permit: Permit) => {
    setSelectedPermit(permit)
    console.log("View permit:", permit)
  }

  const handleExportPermit = (permit: Permit) => {
    console.log("Export permit:", permit)
    toast({
      title: "Export Started",
      description: `Exporting permit ${permit.number}`,
    })
  }

  const handleSavePermit = (permitData: Partial<Permit>) => {
    if (selectedPermit) {
      // Update existing permit
      setPermits((prev) =>
        prev.map((p) => (p.id === selectedPermit.id ? { ...p, ...permitData, updatedAt: new Date().toISOString() } : p))
      )
      toast({
        title: "Success",
        description: "Permit updated successfully",
      })
    } else {
      // Create new permit
      const newPermit: Permit = {
        id: `perm-${Date.now()}`,
        projectId: "2525840",
        createdBy: user?.email || "current-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inspections: [],
        tags: [],
        conditions: [],
        ...permitData,
      } as Permit
      setPermits((prev) => [...prev, newPermit])
      toast({
        title: "Success",
        description: "Permit created successfully",
      })
    }
    setShowPermitForm(false)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchTerm("")
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Permit data has been updated",
      })
    }, 1000)
  }

  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      const projectName = "All Projects"

      switch (options.format) {
        case "pdf":
          PermitExportUtils.exportToPDF(filteredPermits, stats, projectName, options.fileName)
          break
        case "excel":
          PermitExportUtils.exportToExcel(filteredPermits, stats, projectName, options.fileName)
          break
        case "csv":
          PermitExportUtils.exportToCSV(filteredPermits, projectName, options.fileName)
          break
      }

      toast({
        title: "Export Started",
        description: `Permit data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const getProjectScopeDescription = () => {
    if (!user) return "All Projects"

    switch (user.role) {
      case "project-manager":
        return "Single Project View"
      case "project-executive":
        return "Portfolio View (6 Projects)"
      default:
        return "Enterprise View (All Projects)"
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground">
        <span>
          {user?.firstName} {user?.lastName}
        </span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">Permit Log</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Permit Log</h1>
          <p className="text-muted-foreground">Track and manage construction permits and inspections</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {hasCreateAccess && (
            <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]" onClick={handleCreatePermit}>
              <Plus className="h-4 w-4 mr-2" />
              Create Permit
            </Button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Permits</span>
                </div>
                <span className="font-semibold">{stats.totalPermits}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
                <span className="font-semibold">{stats.approvedPermits}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="font-semibold">{stats.pendingPermits}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Expiring</span>
                </div>
                <span className="font-semibold">{stats.expiringPermits}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hasCreateAccess && (
                <Button onClick={handleCreatePermit} className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Permit
                </Button>
              )}
              <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="w-full">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </Button>
              {hasExportAccess && (
                <Button variant="outline" onClick={() => setShowExportModal(true)} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Project Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Project Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">View Type</span>
                </div>
                <Badge variant="outline">
                  {user?.role === "project-manager"
                    ? "single"
                    : user?.role === "project-executive"
                    ? "portfolio"
                    : "enterprise"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Access Level</span>
                </div>
                <span className="font-semibold">{user?.role || "viewer"}</span>
              </div>
              <div className="text-sm text-muted-foreground">{getProjectScopeDescription()}</div>
            </CardContent>
          </Card>

          {/* Inspection Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Inspections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Passed</span>
                </div>
                <span className="font-semibold">{stats.passedInspections}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
                <span className="font-semibold">{stats.failedInspections}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="font-semibold">{stats.pendingInspections}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Pass Rate</span>
                </div>
                <span className="font-semibold">{stats.inspectionPassRate.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-9">
          {/* HBI Insights Panel */}
          <div className="mb-6">
            <HbiPermitInsights permits={filteredPermits} stats={stats} />
          </div>

          {/* Permit Content */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#003087] dark:text-blue-400" />
                Permit Management
              </CardTitle>
              <Button variant="outline" size="sm" onClick={toggleFullScreen} className="flex items-center gap-2">
                {isFullScreen ? (
                  <>
                    <Minimize className="h-4 w-4" />
                    Exit Full Screen
                  </>
                ) : (
                  <>
                    <Maximize className="h-4 w-4" />
                    Full Screen
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-lg mb-6">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "overview"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("permits")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "permits"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Permits</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("inspections")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "inspections"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Inspections</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("calendar")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "calendar"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span className="hidden sm:inline">Calendar</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "analytics"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Analytics</span>
                  </button>
                </div>

                {/* Tab Content */}
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <PermitTable
                      permits={filteredPermits.slice(0, 10)}
                      onEdit={handleEditPermit}
                      onView={handleViewPermit}
                      onExport={handleExportPermit}
                      userRole={user?.role}
                      compact={true}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="permits">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit Management</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          View and manage all construction permits and their details
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {hasCreateAccess && (
                          <Button
                            size="sm"
                            onClick={handleCreatePermit}
                            className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            New Permit
                          </Button>
                        )}
                        {hasExportAccess && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExportModal(true)}
                            className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export All
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <PermitTable
                    permits={filteredPermits}
                    onEdit={handleEditPermit}
                    onView={handleViewPermit}
                    onExport={handleExportPermit}
                    userRole={user?.role}
                  />
                </TabsContent>

                <TabsContent value="inspections">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">
                          Inspection Management
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Track inspection schedules, results, and compliance scores
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        {hasExportAccess && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowExportModal(true)}
                            className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Inspections
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <PermitTable
                    permits={filteredPermits}
                    onEdit={handleEditPermit}
                    onView={handleViewPermit}
                    onExport={handleExportPermit}
                    userRole={user?.role}
                    showInspections={true}
                  />
                </TabsContent>

                <TabsContent value="calendar">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">
                      Permit & Inspection Calendar
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Visual timeline of permits and inspections</p>
                  </div>
                  <PermitCalendar
                    permits={filteredPermits}
                    onEditPermit={handleEditPermit}
                    onViewPermit={handleViewPermit}
                    onCreatePermit={handleCreatePermit}
                    userRole={user?.role}
                  />
                </TabsContent>

                <TabsContent value="analytics">
                  <PermitAnalytics permits={filteredPermits} detailed={true} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <PermitForm
        permit={selectedPermit}
        open={showPermitForm}
        onClose={() => setShowPermitForm(false)}
        onSave={handleSavePermit}
        userRole={user?.role}
      />

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        onExport={handleExportSubmit}
        defaultFileName="PermitLogData"
      />
    </div>
  )
}

export const ToolContent: React.FC<ToolContentProps> = ({
  toolName,
  userRole,
  user,
  onNavigateBack,
  activeTab = "overview",
  onTabChange,
}) => {
  const config = TOOL_CONFIGS[toolName]
  if (!config) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-lg font-semibold mb-2">Tool Not Found</h2>
          <p className="text-muted-foreground">The requested tool "{toolName}" is not available.</p>
          <Button variant="outline" onClick={onNavigateBack} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Use legacy layout for Staffing tool
  if (toolName === "Staffing") {
    return <StaffingLegacyContent userRole={userRole} user={user} onNavigateBack={onNavigateBack} />
  }

  // Use Financial Hub layout for Financial Hub tool
  if (toolName === "Financial Hub") {
    return <FinancialHubContent userRole={userRole} user={user} onNavigateBack={onNavigateBack} />
  }

  // Use Procurement layout for Procurement tool
  if (toolName === "Procurement") {
    return <ProcurementContent userRole={userRole} user={user} onNavigateBack={onNavigateBack} />
  }

  // Use Scheduler layout for Scheduler tool
  if (toolName === "Scheduler") {
    return <SchedulerContent userRole={userRole} user={user} onNavigateBack={onNavigateBack} />
  }

  // Use Constraints Log layout for Constraints Log tool
  if (toolName === "Constraints Log") {
    return <ConstraintsLogContent onNavigateBack={onNavigateBack} />
  }

  // For other tools, use a simple layout without app-header
  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <ChevronRight className="h-4 w-4" />
          <span>{config.title}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
        <p className="text-muted-foreground">Content for this tool is coming soon.</p>
      </div>
    </div>
  )
}
