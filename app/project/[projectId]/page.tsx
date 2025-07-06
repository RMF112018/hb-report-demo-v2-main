"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Download,
  Share2,
  Upload,
  AlertCircle,
  Activity,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Brain,
  Eye,
  EyeOff,
  RotateCcw,
  RefreshCw,
  MapPin,
  Clock,
  Target,
  Briefcase,
  Database,
  Monitor,
  Network,
  Info,
  BarChart3,
  Calculator,
  GitBranch,
  PieChart,
  CreditCard,
  Banknote,
  Receipt,
  TrendingDown,
  CheckCircle2,
  Percent,
  Unlock,
  Shield,
  XCircle,
  Bot,
  Zap,
  AlertTriangle,
  History,
  Filter,
  Plus,
  Package,
  Search,
  Scale,
} from "lucide-react"

// Mock data imports
import projectsData from "@/data/mock/projects.json"
import cashFlowData from "@/data/mock/financial/cash-flow.json"
import constraintsDataRaw from "@/data/mock/logs/constraints.json"
import reportsData from "@/data/mock/reports/reports.json"
import procurementData from "@/data/mock/procurement-log.json"
import permitsData from "@/data/mock/logs/permits.json"
import staffingData from "@/data/mock/staffing/staffing.json"
import dailyLogsData from "@/data/mock/logs/daily-log-sample.json"
import qualityControlData from "@/data/mock/inspections/quality-control.json"
import safetyData from "@/data/mock/inspections/safety.json"
import type {
  DailyLog,
  ManpowerRecord,
  SafetyAudit,
  QualityInspection,
  FilterState,
  FieldMetrics,
  DashboardData,
  InsightItem,
} from "@/types/field-reports"

// Components
import { SharePointLibraryViewer } from "@/components/sharepoint/SharePointLibraryViewer"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StartUpChecklist } from "@/components/startup/StartUpChecklist"
import CloseoutChecklist from "@/components/closeout/CloseoutChecklist"

// Financial Hub Components
import FinancialOverview from "@/components/financial-hub/FinancialOverview"
import BudgetAnalysis from "@/components/financial-hub/BudgetAnalysis"
import CashFlowAnalysis from "@/components/financial-hub/CashFlowAnalysis"
import { PayApplication } from "@/components/financial-hub/PayApplication"
import ARAgingCard from "@/components/financial-hub/ARAgingCard"
import PayAuthorizations from "@/components/financial-hub/PayAuthorizations"
import JCHRCard from "@/components/financial-hub/JCHRCard"
import ChangeManagement from "@/components/financial-hub/ChangeManagement"
import CostTracking from "@/components/financial-hub/CostTracking"
import Forecasting from "@/components/financial-hub/Forecasting"
import RetentionManagement from "@/components/financial-hub/RetentionManagement"

// Procurement Components
import { ProcurementLogTable } from "@/components/procurement/ProcurementLogTable"
import { ProcurementSyncPanel } from "@/components/procurement/ProcurementSyncPanel"
import { ProcurementStatsPanel } from "@/components/procurement/ProcurementStatsPanel"
import { HbiProcurementInsights } from "@/components/procurement/HbiProcurementInsights"

// Scheduler Components
import SchedulerOverview from "@/components/scheduler/SchedulerOverview"
import ScheduleMonitor from "@/components/scheduler/ScheduleMonitor"
import HealthAnalysis from "@/components/scheduler/HealthAnalysis"
import LookAhead from "@/components/scheduler/LookAhead"
import ScheduleGenerator from "@/components/scheduler/ScheduleGenerator"

// Field Reports Components
import { FieldReportsWidgets, type FieldReportsStats } from "@/components/field-reports/FieldReportsWidgets"
import { FieldReportsExportUtils } from "@/components/field-reports/FieldReportsExportUtils"
import { HbiFieldReportsInsights } from "@/components/field-reports/HbiFieldReportsInsights"
import { ProjectFieldReportsSummary } from "@/components/field-reports/ProjectFieldReportsSummary"

// Additional Constraints Components
import { ConstraintWidgets } from "@/components/constraints/ConstraintWidgets"
import { ConstraintForm } from "@/components/constraints/ConstraintForm"
import { ProjectConstraintsSummary } from "@/components/constraints/ProjectConstraintsSummary"

// Permit Components
import { PermitAnalytics } from "@/components/permit-log/PermitAnalytics"
import { PermitForm } from "@/components/permit-log/PermitForm"
import { PermitTable } from "@/components/permit-log/PermitTable"
import { PermitCalendar } from "@/components/permit-log/PermitCalendar"
import { PermitWidgets } from "@/components/permit-log/PermitWidgets"
import { HbiPermitInsights } from "@/components/permit-log/HbiPermitInsights"

// Staffing Components
import { ProjectManagerStaffingView } from "@/components/staffing/ProjectManagerStaffingView"

// Constraints Components
import { EnhancedConstraintTable } from "@/components/constraints/EnhancedConstraintTable"
import { GanttChart } from "@/components/constraints/GanttChart"
import { HbiInsightsPanel } from "@/components/constraints/HbiInsightsPanel"

// Stage-Adaptive Components
import { StageAdaptiveContent } from "@/components/project-stages/StageAdaptiveContent"
import { StageProgressIndicator } from "@/components/project-stages/StageProgressIndicator"
import { getStageConfig, isStageTransitionValid } from "@/types/project-stage-config"

interface ProjectControlCenterPageProps {
  params: {
    projectId: string
  }
}

/**
 * PHASE 4: Stage-Adaptive Project Control Center
 * -----------------------------------------------
 * Enhanced project page with infrastructure module layout structure,
 * stage-adaptive interface, and production-ready features.
 *
 * Features:
 * - Infrastructure module layout pattern
 * - Stage-adaptive interface based on project lifecycle stage
 * - User role-based access control and permissions
 * - Responsive sidebar with project overview and quick actions
 * - Tabbed main content with stage-specific sections
 * - Integration with existing SharePoint and HBI systems
 * - Full light/dark theme compatibility
 */
export default function ProjectControlCenterPage({ params }: ProjectControlCenterPageProps) {
  const { user } = useAuth()
  const { startTour, isTourAvailable } = useTour()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [useStageAdaptive, setUseStageAdaptive] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [stageTransitionError, setStageTransitionError] = useState<string | null>(null)
  const [currentStage, setCurrentStage] = useState<string>("")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const projectId = parseInt(params.projectId)

  // Find the specific project
  const project = useMemo(() => {
    return projectsData.find((p) => p.project_id === projectId)
  }, [projectId])

  // User role and permissions management
  const userRole = useMemo(() => {
    if (!user?.email) return "viewer"

    if (user.email.includes("pm@") || user.email.includes("manager@")) return "project_manager"
    if (user.email.includes("super@") || user.email.includes("field@")) return "superintendent"
    if (user.email.includes("exec@") || user.email.includes("executive@")) return "executive"
    if (user.email.includes("estimator@")) return "estimator"
    if (user.email.includes("admin@")) return "admin"

    return "team_member"
  }, [user])

  // Stage configuration and access control
  const stageConfig = useMemo(() => {
    if (!project?.project_stage_name) return null
    return getStageConfig(project.project_stage_name)
  }, [project])

  // Check if user has access to this stage and project
  const hasStageAccess = useMemo(() => {
    if (!stageConfig || !userRole) return false

    if (userRole === "admin" || userRole === "executive") return true

    const rolePermissions = {
      "BIM Coordination": ["project_manager", "estimator", "team_member"],
      Bidding: ["project_manager", "estimator", "executive"],
      "Pre-Construction": ["project_manager", "estimator", "executive"],
      Construction: ["project_manager", "superintendent", "team_member", "executive"],
      Closeout: ["project_manager", "superintendent", "executive"],
      Warranty: ["project_manager", "executive"],
      Closed: ["project_manager", "executive", "admin"],
    }

    const allowedRoles = rolePermissions[stageConfig.stageName as keyof typeof rolePermissions] || []
    return allowedRoles.includes(userRole)
  }, [stageConfig, userRole])

  // Project-specific AI insights
  const projectInsights = useMemo(() => {
    if (!project || !stageConfig) return []

    const baseInsights = [
      {
        id: "proj-1",
        type: "performance",
        severity: "low",
        title: "Project Progress On Track",
        text: `${project.name} is progressing according to schedule in the ${stageConfig.stageName} stage.`,
        action: "Continue monitoring key milestones and resource allocation.",
        confidence: 92,
        relatedMetrics: ["Schedule Adherence", "Budget Performance", "Resource Utilization"],
      },
      {
        id: "proj-2",
        type: "alert",
        severity: "medium",
        title: "Budget Variance Alert",
        text: "Current spending rate suggests potential budget overrun by 3-5% if current trends continue.",
        action: "Review cost controls and consider value engineering opportunities.",
        confidence: 87,
        relatedMetrics: ["Cost Performance", "Budget Tracking", "Change Orders"],
      },
      {
        id: "proj-3",
        type: "opportunity",
        severity: "low",
        title: "Stage Transition Opportunity",
        text: `Project criteria met for potential advancement to next stage. Consider initiating transition process.`,
        action: "Schedule stage gate review and prepare transition documentation.",
        confidence: 78,
        relatedMetrics: ["Stage Readiness", "Deliverable Status", "Quality Metrics"],
      },
    ]

    // Add stage-specific insights
    if (stageConfig.stageName === "Construction") {
      baseInsights.push({
        id: "proj-4",
        type: "risk",
        severity: "high",
        title: "Weather Impact Risk",
        text: "Upcoming weather patterns may impact exterior work scheduled for next 2 weeks.",
        action: "Adjust schedule to prioritize weather-sensitive activities and prepare contingency plans.",
        confidence: 85,
        relatedMetrics: ["Weather Forecast", "Schedule Risk", "Work Sequencing"],
      })
    }

    return baseInsights
  }, [project, stageConfig])

  // Mock project metrics
  const projectMetrics = useMemo(() => {
    if (!project) return null

    return {
      totalBudget: project.contract_value || 0,
      spentToDate: Math.round((project.contract_value || 0) * 0.65),
      remainingBudget: Math.round((project.contract_value || 0) * 0.35),
      scheduleProgress: 72,
      budgetProgress: 65,
      activeTeamMembers: 28,
      completedMilestones: 8,
      totalMilestones: 12,
      riskItems: 3,
      activeRFIs: 7,
      changeOrders: 2,
    }
  }, [project])

  // Mock recent activity
  const recentActivity = useMemo(
    () => [
      {
        id: "act-1",
        type: "milestone",
        title: "Foundation Pour Complete",
        description: "Milestone achieved ahead of schedule",
        timestamp: "2024-01-02T10:30:00Z",
        icon: CheckCircle,
        color: "green",
      },
      {
        id: "act-2",
        type: "alert",
        title: "Material Delivery Delay",
        description: "Steel delivery postponed by 3 days",
        timestamp: "2024-01-02T08:15:00Z",
        icon: AlertCircle,
        color: "orange",
      },
      {
        id: "act-3",
        type: "update",
        title: "Design Review Completed",
        description: "Electrical plans approved by engineer",
        timestamp: "2024-01-01T16:45:00Z",
        icon: FileText,
        color: "blue",
      },
    ],
    []
  )

  // Initialize current stage
  useEffect(() => {
    if (project?.project_stage_name) {
      setCurrentStage(project.project_stage_name)
    }
    setIsLoading(false)
  }, [project])

  // Handle refresh
  const handleRefresh = () => {
    setLastRefresh(new Date())
    console.log("Refreshing project data...")
  }

  // Toggle between stage-adaptive and traditional view
  const toggleViewMode = () => {
    setUseStageAdaptive(!useStageAdaptive)
  }

  // Handle stage transitions with validation
  const handleStageChange = async (newStage: string) => {
    if (!project || !hasStageAccess) {
      setStageTransitionError("Insufficient permissions to change project stage")
      return
    }

    const isValid = isStageTransitionValid(currentStage, newStage)
    if (!isValid) {
      setStageTransitionError("Invalid stage transition")
      return
    }

    try {
      console.log(`Transitioning project ${projectId} from ${currentStage} to ${newStage}`)
      setCurrentStage(newStage)
      setStageTransitionError(null)
    } catch (error) {
      setStageTransitionError("Failed to update project stage. Please try again.")
      console.error("Stage transition error:", error)
    }
  }

  // Financial Hub Configuration
  const [activeFinancialTab, setActiveFinancialTab] = useState("overview")

  interface FinancialModuleTab {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    component: React.ComponentType<{ userRole: string; projectData: any }>
    requiredRoles?: string[]
  }

  // Define available financial modules for project view
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
      id: "pay-application",
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

  // Filter modules based on user role
  const availableFinancialModules = financialModules.filter((module) => {
    if (!module.requiredRoles) return true
    return userRole && module.requiredRoles.includes(userRole)
  })

  // Get project-specific financial summary data
  const getProjectFinancialData = () => {
    if (!project) {
      return {
        scope: "single",
        projectCount: 1,
        description: "Project View",
        projects: [],
        projectId: projectId.toString(),
        totalContractValue: 0,
        netCashFlow: 0,
        profitMargin: 0,
        pendingApprovals: 0,
        healthScore: 0,
      }
    }

    return {
      scope: "single",
      projectCount: 1,
      description: `Project View: ${project.name}`,
      projects: [project.name],
      projectId: projectId.toString(),
      totalContractValue: projectMetrics?.totalBudget || 57235491,
      netCashFlow: projectMetrics?.totalBudget ? projectMetrics.totalBudget * 0.14 : 8215006.64,
      profitMargin: 6.8,
      pendingApprovals: 3,
      healthScore: 88,
    }
  }

  // Get dynamic financial KPIs based on active financial tab
  const getFinancialKPIs = (activeTab: string) => {
    const baseData = getProjectFinancialData()

    // Core KPIs that are always present
    const coreKPIs = [
      {
        icon: Building2,
        value: `$${baseData.totalContractValue.toLocaleString()}`,
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

    // Module-specific KPIs with project-focused data
    const moduleKPIs: Record<string, any[]> = {
      overview: [
        {
          icon: DollarSign,
          value: `$${baseData.netCashFlow.toLocaleString()}`,
          label: "Net Cash Flow",
          color: "green",
        },
        {
          icon: CheckCircle,
          value: baseData.pendingApprovals,
          label: "Pending Approvals",
          color: "amber",
        },
      ],
      "budget-analysis": [
        {
          icon: Calculator,
          value: `$${(baseData.totalContractValue * 0.87).toLocaleString()}`,
          label: "Actual Costs",
          color: "green",
        },
        {
          icon: Target,
          value: "1.05",
          label: "CPI Score",
          color: "indigo",
        },
      ],
      "cash-flow": [
        {
          icon: TrendingUp,
          value: `$${(baseData.totalContractValue * 0.72).toLocaleString()}`,
          label: "Total Inflows",
          color: "green",
        },
        {
          icon: TrendingDown,
          value: `$${(baseData.totalContractValue * 0.68).toLocaleString()}`,
          label: "Total Outflows",
          color: "red",
        },
      ],
    }

    // Get module-specific KPIs and limit to 2 additional widgets (3 core + 2 = 5 total for project view)
    const moduleSpecificKPIs = (moduleKPIs[activeTab] || []).slice(0, 2)

    return [...coreKPIs, ...moduleSpecificKPIs]
  }

  // Scheduler Configuration
  const [activeSchedulerTab, setActiveSchedulerTab] = useState("overview")

  interface SchedulerModuleTab {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    component: React.ComponentType<{ userRole: string; projectData: any }>
    requiredRoles?: string[]
  }

  // Define available scheduler modules for project view
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
  const availableSchedulerModules = schedulerModules

  // Get project-specific scheduler summary data
  const getProjectSchedulerData = () => {
    if (!project) {
      return {
        scope: "single",
        projectCount: 1,
        description: "Project View",
        projects: [],
        projectId: projectId.toString(),
        totalActivities: 0,
        criticalPathDuration: 0,
        scheduleHealth: 0,
        currentVariance: 0,
        upcomingMilestones: 0,
      }
    }

    return {
      scope: "single",
      projectCount: 1,
      description: `Project View: ${project.name}`,
      projects: [project.name],
      projectId: projectId.toString(),
      totalActivities: 1247,
      criticalPathDuration: 312,
      scheduleHealth: 87,
      currentVariance: -8,
      upcomingMilestones: 5,
    }
  }

  // Get dynamic scheduler KPIs based on active scheduler tab
  const getSchedulerKPIs = (activeTab: string) => {
    const baseData = getProjectSchedulerData()

    // Core KPIs that are always present
    const coreKPIs = [
      {
        icon: FileText,
        value: baseData.totalActivities.toLocaleString(),
        label: "Total Activities",
        color: "blue",
      },
      {
        icon: Clock,
        value: `${Math.floor(baseData.criticalPathDuration / 30)}m ${baseData.criticalPathDuration % 30}d`,
        label: "Critical Path",
        color: "purple",
      },
      {
        icon: Activity,
        value: `${baseData.scheduleHealth}%`,
        label: "Schedule Health",
        color: "green",
      },
    ]

    // Module-specific KPIs with project-focused data
    const moduleKPIs: Record<string, any[]> = {
      overview: [
        {
          icon: TrendingUp,
          value: `${baseData.currentVariance > 0 ? "+" : ""}${baseData.currentVariance}d`,
          label: "Schedule Variance",
          color: baseData.currentVariance >= 0 ? "green" : "amber",
        },
        {
          icon: Target,
          value: baseData.upcomingMilestones,
          label: "Upcoming Milestones",
          color: "red",
        },
      ],
      "schedule-monitor": [
        {
          icon: Monitor,
          value: "98.5%",
          label: "Data Accuracy",
          color: "green",
        },
        {
          icon: CheckCircle,
          value: "Daily",
          label: "Update Frequency",
          color: "blue",
        },
      ],
      "health-analysis": [
        {
          icon: Activity,
          value: "87%",
          label: "Logic Health",
          color: "green",
        },
        {
          icon: AlertTriangle,
          value: "12",
          label: "Critical Issues",
          color: "amber",
        },
      ],
    }

    // Get module-specific KPIs and limit to 2 additional widgets (3 core + 2 = 5 total for project view)
    const moduleSpecificKPIs = (moduleKPIs[activeTab] || []).slice(0, 2)

    return [...coreKPIs, ...moduleSpecificKPIs]
  }

  // Team-specific sidebar data
  const teamAnalytics = useMemo(() => {
    const projectStaff = staffingData.filter(
      (staff) => staff.assignments && staff.assignments.some((assignment) => assignment.project_id === projectId)
    )

    const totalMembers = projectStaff.length
    const totalLaborCost = projectStaff.reduce((sum, staff) => sum + (staff.laborRate || 0), 0)
    const weeklyLaborCost = totalLaborCost * 40
    const avgExperience =
      projectStaff.length > 0
        ? projectStaff.reduce((sum, staff) => sum + (staff.experience || 0), 0) / projectStaff.length
        : 0
    const seniorMembers = projectStaff.filter((staff) => (staff.experience || 0) >= 5).length

    return {
      totalMembers,
      weeklyLaborCost,
      avgExperience,
      seniorMembers,
    }
  }, [projectId])

  const teamQuickActions = [
    {
      label: "Create SPCR",
      icon: FileText,
      action: () => setActiveTab("team"),
    },
    {
      label: "View Timeline",
      icon: Calendar,
      action: () => setActiveTab("team"),
    },
    {
      label: "Performance Analytics",
      icon: BarChart3,
      action: () => setActiveTab("team"),
    },
    {
      label: "Manage Team",
      icon: Users,
      action: () => setActiveTab("team"),
    },
  ]

  const teamRecentActivity = [
    {
      id: "team-1",
      title: "Team member added",
      description: "New team member assigned to project",
      color: "green",
      icon: Users,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "team-2",
      title: "SPCR submitted",
      description: "Staffing change request submitted for review",
      color: "blue",
      icon: FileText,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "team-3",
      title: "Timeline updated",
      description: "Project timeline updated with new assignments",
      color: "purple",
      icon: Calendar,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const teamKeyMetrics = [
    {
      label: "Team Productivity",
      value: "94%",
      color: "green",
    },
    {
      label: "Schedule Adherence",
      value: "97%",
      color: "blue",
    },
    {
      label: "Quality Score",
      value: "91%",
      color: "purple",
    },
  ]

  const teamInsights = [
    {
      id: "team-1",
      type: "alert",
      severity: "medium",
      title: "Team Performance Opportunity",
      text: "Junior team members showing 15% productivity increase with additional mentoring support.",
      action: "Consider pairing junior staff with senior mentors for knowledge transfer.",
      confidence: 88,
      relatedMetrics: ["Team Development", "Productivity", "Knowledge Transfer"],
    },
    {
      id: "team-2",
      type: "opportunity",
      severity: "low",
      title: "Skill Development Path",
      text: "3 team members eligible for certification advancement in Q2 2025.",
      action: "Coordinate with HR to schedule certification training programs.",
      confidence: 92,
      relatedMetrics: ["Skill Development", "Career Growth", "Team Capabilities"],
    },
    {
      id: "team-3",
      type: "performance",
      severity: "high",
      title: "Project Delivery Excellence",
      text: "Current team configuration delivering 12% ahead of schedule with quality metrics exceeding targets.",
      action: "Document successful practices for replication in future projects.",
      confidence: 95,
      relatedMetrics: ["Schedule Performance", "Quality Metrics", "Team Efficiency"],
    },
  ]

  // Tool categories and tools configuration (from app-header.tsx)
  const tools = useMemo(
    () => [
      // Checklists
      {
        name: "Start-Up Checklist",
        href: "#startup-checklist",
        category: "Checklists",
        description: "Pre-construction and project startup verification checklist",
        component: "startup-checklist",
        visibleRoles: ["project-manager", "superintendent", "executive", "admin"],
        stageRestrictions: ["Construction"],
      },
      {
        name: "Closeout Checklist",
        href: "#closeout-checklist",
        category: "Checklists",
        description: "Project completion and handover verification checklist",
        component: "closeout-checklist",
        visibleRoles: ["project-manager", "superintendent", "executive", "admin"],
        stageRestrictions: ["Construction", "Closeout"],
      },

      // Financial Management
      {
        name: "Financial Hub",
        href: "/dashboard/financial-hub",
        category: "Financial Management",
        description: "Comprehensive financial management and analysis suite",
      },
      {
        name: "Procurement",
        href: "/dashboard/procurement",
        category: "Financial Management",
        description: "Subcontractor buyout and material procurement management",
      },

      // Field Management
      {
        name: "Scheduler",
        href: "/dashboard/scheduler",
        category: "Field Management",
        description: "AI-powered project schedule generation and optimization",
      },
      {
        name: "Constraints Log",
        href: "/dashboard/constraints-log",
        category: "Field Management",
        description: "Track and manage project constraints and resolutions",
      },
      {
        name: "Permit Log",
        href: "/dashboard/permit-log",
        category: "Field Management",
        description: "Permit tracking and compliance",
      },
      {
        name: "Field Reports",
        href: "/dashboard/field-reports",
        category: "Field Management",
        description: "Daily logs, manpower, safety, and quality reporting",
      },

      // Compliance
      {
        name: "Contract Documents",
        href: "/dashboard/contract-documents",
        category: "Compliance",
        description: "Contract document management and compliance tracking",
      },
      {
        name: "Trade Partners Database",
        href: "/dashboard/trade-partners",
        category: "Compliance",
        description: "Comprehensive subcontractor and vendor management system",
      },

      // Pre-Construction
      {
        name: "Pre-Construction Dashboard",
        href: "/pre-con",
        category: "Pre-Construction",
        description: "Pre-construction command center and pipeline overview",
      },
      {
        name: "Business Development",
        href: "/pre-con#business-dev",
        category: "Pre-Construction",
        description: "Lead generation and pursuit management",
      },
      {
        name: "Estimating",
        href: "/estimating",
        category: "Pre-Construction",
        description: "Cost estimation and analysis tools",
      },
      {
        name: "Innovation & Digital Services",
        href: "/tools/coming-soon",
        category: "Pre-Construction",
        description: "BIM, VDC, and digital construction technologies",
      },

      // Warranty
      {
        name: "Warranty Management",
        href: "/tools/coming-soon",
        category: "Warranty",
        description: "Warranty management and tracking tools",
      },

      // Historical Projects
      {
        name: "Archive",
        href: "/tools/coming-soon",
        category: "Historical Projects",
        description: "Access completed project archives and historical data",
      },
    ],
    []
  )

  // Role-based category visibility
  const getVisibleCategories = useCallback(() => {
    const userRole = user?.role?.toLowerCase?.() || user?.role

    switch (userRole) {
      case "executive":
      case "project-executive":
      case "admin":
        return [
          "Checklists",
          "Pre-Construction",
          "Financial Management",
          "Field Management",
          "Compliance",
          "Warranty",
          "Historical Projects",
        ]
      case "project-manager":
        return ["Checklists", "Financial Management", "Field Management", "Compliance", "Warranty"]
      case "estimator":
        return ["Pre-Construction", "Compliance"]
      default:
        return [
          "Checklists",
          "Pre-Construction",
          "Financial Management",
          "Field Management",
          "Compliance",
          "Warranty",
          "Historical Projects",
        ]
    }
  }, [user])

  // Filtered tools with role-based filtering
  const filteredTools = useMemo(() => {
    const userRole = user?.role
    const visibleCategories = getVisibleCategories()

    return tools.filter((tool) => {
      const isDepartmentMatch = visibleCategories.includes(tool.category)
      const isRoleVisible = !tool.visibleRoles || (userRole && tool.visibleRoles.includes(userRole))
      return isDepartmentMatch && isRoleVisible
    })
  }, [tools, user, getVisibleCategories])

  // Available categories based on filtered tools
  const availableCategories = useMemo(() => {
    const visibleCategories = getVisibleCategories()
    const categoryConfig = [
      { name: "overview", color: "bg-gray-500", icon: "📊", label: "Overview" },
      { name: "Checklists", color: "bg-blue-500", icon: "✅" },
      { name: "Pre-Construction", color: "bg-indigo-500", icon: "📐" },
      { name: "Financial Management", color: "bg-green-500", icon: "💰" },
      { name: "Field Management", color: "bg-orange-500", icon: "🏗️" },
      { name: "Compliance", color: "bg-purple-500", icon: "📋" },
      { name: "Warranty", color: "bg-amber-500", icon: "🛡️" },
      { name: "Historical Projects", color: "bg-slate-500", icon: "📚" },
    ]

    // Always include overview
    const categoriesWithOverview = [categoryConfig[0]] // Overview first

    // Add other categories based on role and available tools
    const otherCategories = categoryConfig
      .slice(1)
      .filter(
        (category) =>
          visibleCategories.includes(category.name) && filteredTools.some((tool) => tool.category === category.name)
      )

    return [...categoriesWithOverview, ...otherCategories]
  }, [getVisibleCategories, filteredTools])

  // Tree navigation state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null) // Which category is expanded
  const [selectedTool, setSelectedTool] = useState<string | null>(null) // Which tool is selected
  const [selectedSubTool, setSelectedSubTool] = useState<string | null>(null) // Which sub-tool is selected

  // Tools for expanded category
  const categoryTools = useMemo(() => {
    if (!expandedCategory) return []
    return filteredTools.filter((tool) => tool.category === expandedCategory)
  }, [filteredTools, expandedCategory])

  // Tool sub-tabs configuration
  const getToolSubTabs = useCallback((toolName: string) => {
    switch (toolName) {
      case "Financial Hub":
        return [
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "budget-analysis", label: "Budget Analysis", icon: "📈" },
          { id: "jchr", label: "JCHR", icon: "📋" },
          { id: "ar-aging", label: "AR Aging", icon: "💳" },
          { id: "cash-flow", label: "Cash Flow", icon: "💰" },
          { id: "forecasting", label: "Forecasting", icon: "🔮" },
          { id: "change-management", label: "Change Management", icon: "🔄" },
          { id: "pay-authorization", label: "Pay Authorization", icon: "✅" },
          { id: "pay-application", label: "Pay Application", icon: "📄" },
          { id: "retention", label: "Retention", icon: "🔒" },
        ]
      case "Scheduler":
        return [
          { id: "overview", label: "Overview", icon: "📅" },
          { id: "monitor", label: "Schedule Monitor", icon: "👁️" },
          { id: "health", label: "Health Analysis", icon: "🏥" },
          { id: "lookahead", label: "Look Ahead", icon: "🔮" },
        ]
      case "Field Reports":
        return [
          { id: "daily", label: "Daily Reports", icon: "📋" },
          { id: "safety", label: "Safety", icon: "🦺" },
          { id: "quality", label: "Quality", icon: "✅" },
          { id: "weather", label: "Weather", icon: "🌤️" },
        ]
      case "Constraints Log":
        return [
          { id: "log", label: "Log", icon: "📝" },
          { id: "timeline", label: "Timeline", icon: "🗓️" },
          { id: "analysis", label: "Analysis", icon: "📊" },
        ]
      case "Procurement":
        return [
          { id: "log", label: "Procurement Log", icon: "📋" },
          { id: "sync", label: "Procore Sync", icon: "🔄" },
          { id: "analytics", label: "Analytics", icon: "📊" },
        ]
      case "Permit Log":
        return [
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "permits", label: "Permits", icon: "📝" },
          { id: "inspections", label: "Inspections", icon: "✅" },
          { id: "calendar", label: "Calendar", icon: "📅" },
          { id: "analytics", label: "Analytics", icon: "📈" },
          { id: "reports", label: "Reports", icon: "📄" },
        ]
      default:
        return []
    }
  }, [])

  // Financial Hub Content Component
  const FinancialHubContent = ({
    selectedSubTool,
    projectData,
    userRole,
  }: {
    selectedSubTool: string
    projectData: any
    userRole: string
  }) => {
    const getFinancialData = () => ({
      totalContractValue: projectData?.contract_value || 57235491,
      netCashFlow: 8215006.64,
      profitMargin: 6.8,
      pendingApprovals: 3,
      healthScore: 88,
    })

    const financialData = getFinancialData()

    // Get dynamic KPIs based on selected sub-tool
    const getFinancialKPIs = (subTool: string) => {
      const baseKPIs = [
        {
          icon: Building2,
          value: `$${financialData.totalContractValue.toLocaleString()}`,
          label: "Contract Value",
          color: "blue",
        },
        {
          icon: TrendingUp,
          value: `${financialData.profitMargin}%`,
          label: "Profit Margin",
          color: "purple",
        },
        {
          icon: BarChart3,
          value: `${financialData.healthScore}%`,
          label: "Financial Health",
          color: "red",
        },
      ]

      const subToolKPIs: Record<string, any[]> = {
        overview: [
          {
            icon: DollarSign,
            value: `$${financialData.netCashFlow.toLocaleString()}`,
            label: "Net Cash Flow",
            color: "green",
          },
          {
            icon: CheckCircle,
            value: financialData.pendingApprovals,
            label: "Pending Approvals",
            color: "amber",
          },
          {
            icon: Calculator,
            value: "87.3%",
            label: "Budget Used",
            color: "emerald",
          },
        ],
        "budget-analysis": [
          {
            icon: Calculator,
            value: `$${(financialData.totalContractValue * 0.87).toLocaleString()}`,
            label: "Actual Costs",
            color: "green",
          },
          {
            icon: AlertTriangle,
            value: "+2.8%",
            label: "Budget Variance",
            color: "amber",
          },
          {
            icon: TrendingDown,
            value: `$${(financialData.totalContractValue * 0.13).toLocaleString()}`,
            label: "Remaining Budget",
            color: "yellow",
          },
        ],
        "cash-flow": [
          {
            icon: TrendingUp,
            value: `$${(financialData.totalContractValue * 0.72).toLocaleString()}`,
            label: "Total Inflows",
            color: "green",
          },
          {
            icon: TrendingDown,
            value: `$${(financialData.totalContractValue * 0.68).toLocaleString()}`,
            label: "Total Outflows",
            color: "red",
          },
          {
            icon: Calendar,
            value: "45 Days",
            label: "Avg Collection",
            color: "amber",
          },
        ],
        jchr: [
          {
            icon: DollarSign,
            value: `$${(financialData.totalContractValue * 0.78).toLocaleString()}`,
            label: "Total Cost to Date",
            color: "green",
          },
          {
            icon: Calculator,
            value: `$${(financialData.totalContractValue * 0.12).toLocaleString()}`,
            label: "Current Period Spend",
            color: "amber",
          },
          {
            icon: Percent,
            value: "78.1%",
            label: "% Budget Spent",
            color: "indigo",
          },
        ],
        "ar-aging": [
          {
            icon: CreditCard,
            value: `$${(financialData.totalContractValue * 0.15).toLocaleString()}`,
            label: "Total AR",
            color: "blue",
          },
          {
            icon: TrendingUp,
            value: `$${(financialData.totalContractValue * 0.11).toLocaleString()}`,
            label: "Current",
            color: "green",
          },
          {
            icon: AlertCircle,
            value: `$${(financialData.totalContractValue * 0.015).toLocaleString()}`,
            label: "60+ Days",
            color: "red",
          },
        ],
        forecasting: [
          {
            icon: Calendar,
            value: `$${(financialData.totalContractValue * 0.95).toLocaleString()}`,
            label: "Total Forecast",
            color: "blue",
          },
          {
            icon: TrendingUp,
            value: "94.2%",
            label: "HBI Accuracy",
            color: "green",
          },
          {
            icon: AlertTriangle,
            value: `$${(financialData.totalContractValue * 0.05).toLocaleString()}`,
            label: "Forecast Variance",
            color: "amber",
          },
        ],
        "pay-authorization": [
          {
            icon: FileText,
            value: financialData.pendingApprovals,
            label: "Pending Authorizations",
            color: "amber",
          },
          {
            icon: CheckCircle,
            value: "98.2%",
            label: "Approval Rate",
            color: "green",
          },
          {
            icon: DollarSign,
            value: `$${(financialData.totalContractValue * 0.28).toLocaleString()}`,
            label: "Amount Authorized",
            color: "purple",
          },
        ],
        "pay-application": [
          {
            icon: Receipt,
            value: `$${(2280257.6).toLocaleString()}`,
            label: "Latest Pay App",
            color: "green",
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
        ],
        retention: [
          {
            icon: Shield,
            value: `$${(financialData.totalContractValue * 0.08).toLocaleString()}`,
            label: "Total Held",
            color: "blue",
          },
          {
            icon: CheckCircle,
            value: `$${(financialData.totalContractValue * 0.03).toLocaleString()}`,
            label: "Total Released",
            color: "green",
          },
          {
            icon: Unlock,
            value: "12",
            label: "Ready for Release",
            color: "emerald",
          },
        ],
        "change-management": [
          {
            icon: CheckCircle,
            value: "14",
            label: "Approved",
            color: "green",
          },
          {
            icon: Clock,
            value: "6",
            label: "Pending",
            color: "amber",
          },
          {
            icon: GitBranch,
            value: `$${(financialData.totalContractValue * 0.12).toLocaleString()}`,
            label: "Total Value",
            color: "blue",
          },
        ],
      }

      return [...baseKPIs, ...(subToolKPIs[subTool] || [])]
    }

    const renderContent = () => {
      const projectScope = {
        scope: "single",
        projectCount: 1,
        description: `Project View: ${projectData?.name || "Project"}`,
        projects: [projectData?.name || "Project"],
        projectId: projectData?.project_id,
      }

      switch (selectedSubTool) {
        case "overview":
          return <FinancialOverview userRole={userRole} projectData={projectScope} />
        case "budget-analysis":
          return <BudgetAnalysis userRole={userRole} projectData={projectScope} />
        case "jchr":
          return <JCHRCard userRole={userRole} projectData={projectScope} />
        case "ar-aging":
          return <ARAgingCard userRole={userRole} projectData={projectScope} />
        case "cash-flow":
          return <CashFlowAnalysis userRole={userRole} projectData={projectScope} />
        case "forecasting":
          return <Forecasting userRole={userRole} projectData={projectScope} />
        case "change-management":
          return <ChangeManagement userRole={userRole} projectData={projectScope} />
        case "pay-authorization":
          return <PayAuthorizations userRole={userRole} projectData={projectScope} />
        case "pay-application":
          return <PayApplication userRole={userRole} projectData={projectScope} />
        case "retention":
          return <RetentionManagement userRole={userRole} projectData={projectScope} />
        default:
          return <FinancialOverview userRole={userRole} projectData={projectScope} />
      }
    }

    return (
      <div className="space-y-6">
        {/* Financial KPI Widgets */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {getFinancialKPIs(selectedSubTool).map((kpi, index) => {
            const IconComponent = kpi.icon
            const colorClasses = {
              blue: "text-blue-600 dark:text-blue-400",
              green: "text-green-600 dark:text-green-400",
              purple: "text-purple-600 dark:text-purple-400",
              red: "text-red-600 dark:text-red-400",
              amber: "text-amber-600 dark:text-amber-400",
              emerald: "text-emerald-600 dark:text-emerald-400",
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

        {/* Financial Content */}
        <div className="min-h-96">{renderContent()}</div>
      </div>
    )
  }

  // Procurement Content Component
  const ProcurementContent = ({
    selectedSubTool,
    projectData,
    userRole,
  }: {
    selectedSubTool: string
    projectData: any
    userRole: string
  }) => {
    const [procurementRecords, setProcurementRecords] = useState<any[]>([])
    const [filteredRecords, setFilteredRecords] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [csiFilter, setCsiFilter] = useState("all")

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
        case "project_executive":
          return {
            scope: "portfolio",
            projectCount: 6,
            description: "Portfolio View - 6 Projects",
            canCreate: true,
            canApprove: true,
            canEdit: true,
            canSync: true,
          }
        case "project_manager":
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
    useEffect(() => {
      const mockRecords = [
        {
          id: "proc-001",
          procore_commitment_id: "2525840-001",
          project_id: projectData?.project_id || "proj-001",
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
          contract_type: "subcontract",
          compliance_status: "compliant",
          bonds_required: true,
          insurance_verified: true,
        },
        {
          id: "proc-002",
          procore_commitment_id: "2525840-002",
          project_id: projectData?.project_id || "proj-001",
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
          contract_type: "subcontract",
          compliance_status: "warning",
          bonds_required: false,
          insurance_verified: false,
        },
      ]
      setProcurementRecords(mockRecords)
      setFilteredRecords(mockRecords)
    }, [projectData])

    // Filter records based on search and filters
    useEffect(() => {
      let filtered = procurementRecords

      if (searchTerm) {
        filtered = filtered.filter(
          (record) =>
            record.commitment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.csi_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.csi_description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((record) => record.status === statusFilter)
      }

      if (csiFilter !== "all") {
        filtered = filtered.filter((record) => record.csi_code.startsWith(csiFilter))
      }

      setFilteredRecords(filtered)
    }, [procurementRecords, searchTerm, statusFilter, csiFilter])

    // Calculate statistics
    const stats = useMemo(() => {
      const totalValue = procurementRecords.reduce((sum, record) => sum + record.contract_amount, 0)
      const activeProcurements = procurementRecords.filter((r) =>
        ["bidding", "negotiation", "awarded", "active"].includes(r.status)
      ).length
      const completedProcurements = procurementRecords.filter((r) => r.status === "completed").length
      const pendingApprovals = procurementRecords.filter((r) => r.status === "pending_approval").length
      const vendorCount = new Set(procurementRecords.map((r) => r.vendor_name)).size
      const complianceRate =
        (procurementRecords.filter((r) => r.compliance_status === "compliant").length /
          Math.max(procurementRecords.length, 1)) *
        100
      const avgCycleTime = 28

      return {
        totalValue,
        activeProcurements,
        completedProcurements,
        pendingApprovals,
        linkedToBidTabs: procurementRecords.length,
        avgCycleTime,
        complianceRate,
        totalRecords: procurementRecords.length,
        vendorCount,
        avgSavings:
          procurementRecords.reduce((sum, r) => sum + Math.abs(r.variance_percentage), 0) /
          Math.max(procurementRecords.length, 1),
      }
    }, [procurementRecords])

    // Handle Procore sync
    const handleProcoreSync = async () => {
      setIsLoading(true)
      // Simulate sync
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsLoading(false)
    }

    const renderContent = () => {
      switch (selectedSubTool) {
        case "log":
          return (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      placeholder="Search procurement records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="all">All Status</option>
                    <option value="planning">Planning</option>
                    <option value="bidding">Bidding</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="awarded">Awarded</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Procurement Log Table */}
              <ProcurementLogTable
                records={filteredRecords}
                onRecordEdit={(record: any) => {
                  console.log("Edit record:", record)
                }}
                onRecordView={(record: any) => {
                  console.log("View record:", record)
                }}
                isLoading={isLoading}
                userRole={userRole}
              />
            </div>
          )
        case "sync":
          return (
            <ProcurementSyncPanel
              onSync={handleProcoreSync}
              isLoading={isLoading}
              lastSyncTime={new Date()}
              dataScope={dataScope}
            />
          )
        case "analytics":
          return (
            <div className="space-y-6">
              <ProcurementStatsPanel stats={stats} />
              <HbiProcurementInsights procurementStats={stats} />
            </div>
          )
        default:
          return (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      placeholder="Search procurement records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>

              {/* Procurement Log Table */}
              <ProcurementLogTable
                records={filteredRecords}
                onRecordEdit={(record: any) => {
                  console.log("Edit record:", record)
                }}
                onRecordView={(record: any) => {
                  console.log("View record:", record)
                }}
                isLoading={isLoading}
                userRole={userRole}
              />
            </div>
          )
      }
    }

    return (
      <div className="space-y-6">
        {/* Procurement Stats Widgets */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${stats.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.activeProcurements}</span>
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.completedProcurements}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingApprovals}</span>
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.vendorCount}</span>
              </div>
              <div className="text-sm text-muted-foreground">Vendors</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.complianceRate.toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-muted-foreground">Compliance</div>
            </CardContent>
          </Card>
        </div>

        {/* Procurement Content */}
        <div className="min-h-96">{renderContent()}</div>
      </div>
    )
  }

  // Scheduler Content Component
  const SchedulerContent = ({
    selectedSubTool,
    projectData,
    userRole,
  }: {
    selectedSubTool: string
    projectData: any
    userRole: string
  }) => {
    // Get project scope similar to scheduler page logic
    const getProjectScope = () => {
      if (projectData) {
        return {
          scope: "single",
          projectCount: 1,
          description: `Project View: ${projectData.name}`,
          projects: [projectData.name],
          selectedProject: projectData,
        }
      }

      switch (userRole) {
        case "project_manager":
          return {
            scope: "single",
            projectCount: 1,
            description: "Single Project View",
            projects: ["Tropical World Nursery"],
          }
        case "project_executive":
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

    // Get role-specific summary data
    const getSummaryData = () => {
      if (projectScope.scope === "single") {
        return {
          totalActivities: 1247,
          criticalPathDuration: 312,
          scheduleHealth: 87,
          currentVariance: -8,
          upcomingMilestones: 5,
        }
      }

      switch (userRole) {
        case "project_executive":
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

    const renderContent = () => {
      switch (selectedSubTool) {
        case "overview":
          return <SchedulerOverview userRole={userRole} projectData={projectScope} />
        case "monitor":
          return <ScheduleMonitor userRole={userRole} projectData={projectScope} />
        case "health":
          return <HealthAnalysis userRole={userRole} projectData={projectScope} />
        case "lookahead":
          return <LookAhead userRole={userRole} projectData={projectScope} />
        case "generator":
          return <ScheduleGenerator userRole={userRole} projectData={projectScope} />
        default:
          return <SchedulerOverview userRole={userRole} projectData={projectScope} />
      }
    }

    return (
      <div className="space-y-6">
        {/* Scheduler Statistics Widgets */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <Card className="hover:shadow-md transition-shadow">
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
          <Card className="hover:shadow-md transition-shadow">
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
          <Card className="hover:shadow-md transition-shadow">
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
          <Card className="hover:shadow-md transition-shadow">
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
          <Card className="hover:shadow-md transition-shadow">
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

        {/* Scheduler Content */}
        <div className="min-h-96">{renderContent()}</div>
      </div>
    )
  }

  // Constraints Content Component
  const ConstraintsContent = ({
    selectedSubTool,
    projectData,
    userRole,
  }: {
    selectedSubTool: string
    projectData: any
    userRole: string
  }) => {
    const [activeTab, setActiveTab] = useState("log")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingConstraint, setEditingConstraint] = useState<any>(null)
    const [deleteConstraint, setDeleteConstraint] = useState<any>(null)

    // Mock constraints data for project
    const allConstraints = useMemo(
      () =>
        [
          {
            id: "1",
            no: "C-001",
            description: "Permit approval delay for structural modifications",
            category: "Permits",
            completionStatus: "Open",
            assigned: "John Smith",
            dateIdentified: "2024-01-15",
            dueDate: "2024-02-15",
            daysElapsed: 20,
            reference: "REF-001",
            closureDocument: null,
            bic: "BIC-001",
            dateClosed: null,
            comments: "Waiting for city permit office response",
          },
          {
            id: "2",
            no: "C-002",
            description: "Material delivery delay for steel beams",
            category: "Materials",
            completionStatus: "Open",
            assigned: "Sarah Johnson",
            dateIdentified: "2024-01-18",
            dueDate: "2024-02-01",
            daysElapsed: 17,
            reference: "REF-002",
            closureDocument: null,
            bic: "BIC-002",
            dateClosed: null,
            comments: "Supplier confirmed delivery within 2 weeks",
          },
          {
            id: "3",
            no: "C-003",
            description: "Weather delay for concrete pour",
            category: "Weather",
            completionStatus: "Closed",
            assigned: "Mike Davis",
            dateIdentified: "2024-01-10",
            dueDate: "2024-01-25",
            daysElapsed: 15,
            reference: "REF-003",
            closureDocument: "Weather-Report-Final.pdf",
            bic: "BIC-003",
            dateClosed: "2024-01-25",
            comments: "Pour completed successfully after weather cleared",
          },
        ] as any[],
      []
    )

    // Filter constraints based on selected sub-tool
    const filteredConstraints = useMemo(() => {
      switch (selectedSubTool) {
        case "log":
          return allConstraints.filter((c) => c.completionStatus !== "Closed")
        case "timeline":
          return allConstraints
        case "analysis":
          return allConstraints
        default:
          return allConstraints.filter((c) => c.completionStatus !== "Closed")
      }
    }, [allConstraints, selectedSubTool])

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

      return { total, open, closed, overdue }
    }, [allConstraints])

    const renderContent = () => {
      switch (selectedSubTool) {
        case "log":
          return (
            <div className="space-y-6">
              {/* Constraints Statistics */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Total Constraints</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.open}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Open</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.closed}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Closed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Overdue</div>
                  </CardContent>
                </Card>
              </div>

              {/* Constraints Table with Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Constraints Log</CardTitle>
                </CardHeader>
                <CardContent>
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

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-medium">No.</th>
                          <th className="text-left p-2 font-medium">Description</th>
                          <th className="text-left p-2 font-medium">Category</th>
                          <th className="text-left p-2 font-medium">Status</th>
                          <th className="text-left p-2 font-medium">Assigned</th>
                          <th className="text-left p-2 font-medium">Days Elapsed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConstraints
                          .filter((c) =>
                            activeTab === "open" ? c.completionStatus !== "Closed" : c.completionStatus === "Closed"
                          )
                          .map((constraint) => (
                            <tr key={constraint.id} className="border-b hover:bg-muted/50">
                              <td className="p-2 font-mono text-sm">{constraint.no}</td>
                              <td className="p-2">{constraint.description}</td>
                              <td className="p-2">
                                <Badge variant="outline">{constraint.category}</Badge>
                              </td>
                              <td className="p-2">
                                <Badge variant={constraint.completionStatus === "Closed" ? "default" : "secondary"}>
                                  {constraint.completionStatus}
                                </Badge>
                              </td>
                              <td className="p-2">{constraint.assigned}</td>
                              <td className="p-2">{constraint.daysElapsed} days</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        case "timeline":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Constraints Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <GanttChart constraints={allConstraints} />
                </CardContent>
              </Card>
            </div>
          )
        case "analysis":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Constraints Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <HbiInsightsPanel constraints={allConstraints} />
                </CardContent>
              </Card>
            </div>
          )
        default:
          return null
      }
    }

    return <div className="space-y-6">{renderContent()}</div>
  }

  // Permit Log Content Component
  const PermitLogContent = ({
    selectedSubTool,
    projectData,
    userRole,
  }: {
    selectedSubTool: string
    projectData: any
    userRole: string
  }) => {
    const [activeTab, setActiveTab] = useState("overview")
    const [showPermitForm, setShowPermitForm] = useState(false)
    const [selectedPermit, setSelectedPermit] = useState<any>(null)

    // Mock permits data for project
    const permits = useMemo(
      () =>
        [
          {
            id: "permit-1",
            number: "BP-2024-001",
            type: "Building Permit",
            status: "approved",
            authority: "City Planning Department",
            description: "Commercial building construction permit",
            applicationDate: "2024-01-15",
            approvalDate: "2024-02-01",
            expirationDate: "2025-02-01",
            priority: "high",
            projectId: projectData?.project_id || "2525840",
            inspections: [
              {
                id: "insp-1",
                type: "Foundation",
                scheduledDate: "2024-02-15",
                result: "passed",
                inspector: "John Smith",
              },
            ],
            conditions: ["Must comply with fire safety codes", "Environmental impact assessment required"],
            tags: ["structural", "commercial"],
            createdBy: "project-manager",
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-02-01T14:30:00Z",
          },
          {
            id: "permit-2",
            number: "EP-2024-002",
            type: "Electrical Permit",
            status: "pending",
            authority: "Electrical Safety Authority",
            description: "Electrical installation permit for HVAC systems",
            applicationDate: "2024-01-20",
            approvalDate: null,
            expirationDate: "2024-12-20",
            priority: "medium",
            projectId: projectData?.project_id || "2525840",
            inspections: [],
            conditions: ["Licensed electrician required", "Code compliance inspection needed"],
            tags: ["electrical", "HVAC"],
            createdBy: "project-manager",
            createdAt: "2024-01-20T09:15:00Z",
            updatedAt: "2024-01-20T09:15:00Z",
          },
          {
            id: "permit-3",
            number: "MP-2024-003",
            type: "Mechanical Permit",
            status: "expired",
            authority: "Municipal Building Department",
            description: "HVAC system installation permit",
            applicationDate: "2023-12-01",
            approvalDate: "2023-12-15",
            expirationDate: "2024-01-15",
            priority: "low",
            projectId: projectData?.project_id || "2525840",
            inspections: [
              {
                id: "insp-2",
                type: "Mechanical",
                scheduledDate: "2024-01-10",
                result: "failed",
                inspector: "Sarah Johnson",
              },
            ],
            conditions: ["Re-inspection required", "Updated plans needed"],
            tags: ["mechanical", "expired"],
            createdBy: "superintendent",
            createdAt: "2023-12-01T11:30:00Z",
            updatedAt: "2024-01-16T16:45:00Z",
          },
        ] as any[],
      [projectData]
    )

    // Calculate permit statistics
    const stats = useMemo(() => {
      const totalPermits = permits.length
      const approvedPermits = permits.filter((p) => p.status === "approved").length
      const pendingPermits = permits.filter((p) => p.status === "pending").length
      const expiredPermits = permits.filter((p) => p.status === "expired").length
      const rejectedPermits = permits.filter((p) => p.status === "rejected").length

      const totalInspections = permits.reduce((sum, p) => sum + (p.inspections?.length || 0), 0)
      const passedInspections = permits.reduce(
        (sum, p) => sum + (p.inspections?.filter((i: any) => i.result === "passed").length || 0),
        0
      )
      const failedInspections = permits.reduce(
        (sum, p) => sum + (p.inspections?.filter((i: any) => i.result === "failed").length || 0),
        0
      )

      const approvalRate = totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0
      const inspectionPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      const expiringPermits = permits.filter((p) => {
        const expDate = new Date(p.expirationDate)
        return expDate <= thirtyDaysFromNow && expDate > new Date() && p.status === "approved"
      }).length

      return {
        totalPermits,
        approvedPermits,
        pendingPermits,
        expiredPermits,
        rejectedPermits,
        expiringPermits: expiringPermits,
        totalInspections,
        passedInspections,
        failedInspections,
        pendingInspections: totalInspections - passedInspections - failedInspections,
        approvalRate,
        inspectionPassRate,
      }
    }, [permits])

    const handleCreatePermit = () => {
      setSelectedPermit(null)
      setShowPermitForm(true)
    }

    const handleEditPermit = (permit: any) => {
      setSelectedPermit(permit)
      setShowPermitForm(true)
    }

    const handleViewPermit = (permit: any) => {
      console.log("View permit:", permit)
    }

    const handleExportPermit = (permit: any) => {
      console.log("Export permit:", permit)
    }

    const renderContent = () => {
      switch (selectedSubTool) {
        case "overview":
          return (
            <div className="space-y-6">
              {/* Permit Statistics */}
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPermits}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Total Permits</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.approvedPermits}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {stats.pendingPermits}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expiringPermits}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Expiring</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Permits Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Permits</CardTitle>
                </CardHeader>
                <CardContent>
                  <PermitTable
                    permits={permits.slice(0, 5)}
                    onEdit={handleEditPermit}
                    onView={handleViewPermit}
                    onExport={handleExportPermit}
                    userRole={userRole}
                    compact={true}
                  />
                </CardContent>
              </Card>
            </div>
          )
        case "permits":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permit Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <PermitTable
                    permits={permits}
                    onEdit={handleEditPermit}
                    onView={handleViewPermit}
                    onExport={handleExportPermit}
                    userRole={userRole}
                  />
                </CardContent>
              </Card>
            </div>
          )
        case "inspections":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inspection Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <PermitTable
                    permits={permits}
                    onEdit={handleEditPermit}
                    onView={handleViewPermit}
                    onExport={handleExportPermit}
                    userRole={userRole}
                    showInspections={true}
                  />
                </CardContent>
              </Card>
            </div>
          )
        case "calendar":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permit & Inspection Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <PermitCalendar
                    permits={permits}
                    onEditPermit={handleEditPermit}
                    onViewPermit={handleViewPermit}
                    onCreatePermit={handleCreatePermit}
                    userRole={userRole}
                  />
                </CardContent>
              </Card>
            </div>
          )
        case "analytics":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permit Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <PermitAnalytics permits={permits} detailed={true} />
                </CardContent>
              </Card>
            </div>
          )
        case "reports":
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <span>Permit Summary</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <span>Analytics Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center space-y-2">
                      <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <span>Inspection Log</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        default:
          return null
      }
    }

    return <div className="space-y-6">{renderContent()}</div>
  }

  // Field Reports Content Component
  const FieldReportsContent = ({
    selectedSubTool,
    projectData,
    userRole,
  }: {
    selectedSubTool: string
    projectData: any
    userRole: string
  }) => {
    const [fieldData, setFieldData] = useState<DashboardData>({
      dailyLogs: [],
      qualityControl: [],
      safety: [],
      manpower: [],
    })

    const [loading, setLoading] = useState(true)
    const [showExportModal, setShowExportModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState<any>(null)

    // Helper functions
    const determineLogStatus = (date: string) => {
      const logDate = new Date(date)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) return "submitted"
      if (daysDiff === 1) return "pending"
      return "overdue"
    }

    const calculateDefects = (checklist: any[]) => {
      if (!Array.isArray(checklist)) return 0
      return checklist.filter((item) => item.response === "No").length
    }

    const extractIssues = (checklist: any[]) => {
      if (!Array.isArray(checklist)) return []
      return checklist.filter((item) => item.response === "No").map((item) => item.question)
    }

    const countViolations = (responses: any[]) => {
      if (!Array.isArray(responses)) return 0
      return responses.filter((response) => response.response === "At Risk").length
    }

    const calculateComplianceScore = (responses: any[]) => {
      if (!Array.isArray(responses) || responses.length === 0) return 100
      const safeResponses = responses.filter((response) => response.response === "Safe").length
      return Math.round((safeResponses / responses.length) * 100)
    }

    const inferTradeFromCompany = (company: string) => {
      if (!company) return "General"
      const lowerCompany = company.toLowerCase()
      if (lowerCompany.includes("concrete")) return "Concrete"
      if (lowerCompany.includes("electric")) return "Electrical"
      if (lowerCompany.includes("plumb")) return "Plumbing"
      if (lowerCompany.includes("steel")) return "Structural Steel"
      if (lowerCompany.includes("roofing")) return "Roofing"
      if (lowerCompany.includes("hvac")) return "HVAC"
      return "General"
    }

    const calculateEfficiency = (entry: any) => {
      if (!entry.total_hours || !entry.workers) return 75
      const expectedHours = entry.workers * 8
      return Math.min(100, Math.round((entry.total_hours / expectedHours) * 100))
    }

    const estimateCostPerHour = (company: string) => {
      const trade = inferTradeFromCompany(company)
      const baseCosts = {
        Electrical: 85,
        Plumbing: 80,
        HVAC: 75,
        "Structural Steel": 90,
        Concrete: 70,
        Roofing: 65,
        General: 60,
      }
      return baseCosts[trade as keyof typeof baseCosts] || 60
    }

    // Calculate business days
    const calculateBusinessDays = (start: Date, end: Date): number => {
      let businessDays = 0
      const currentDate = new Date(start)

      while (currentDate <= end) {
        if (![0, 6].includes(currentDate.getDay())) {
          businessDays++
        }
        currentDate.setDate(currentDate.getDate() + 1)
      }
      return businessDays
    }

    // Load and transform data
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true)
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Transform daily logs data
          const transformedDailyLogs = Array.isArray(dailyLogsData)
            ? dailyLogsData.map((log: any) => ({
                id: `log-${log.project_id}-${log.date}`,
                projectId: log.project_id?.toString() || "unknown",
                projectName: log.project_name || "Unknown Project",
                date: log.date,
                submittedBy: log.created_by || "System",
                status: determineLogStatus(log.date) as "submitted" | "pending" | "overdue" | "draft",
                totalWorkers: log.manpower_log?.total_workers || 0,
                totalHours: log.manpower_log?.total_hours || 0,
                weatherConditions: log.weather_report,
                manpowerEntries: log.manpower_log?.entries || [],
                activities: log.activities || [],
                comments: log.comments || "",
              }))
            : []

          // Transform quality control data
          const transformedQualityControl = Array.isArray(qualityControlData)
            ? qualityControlData.map((qc: any) => ({
                id: `qc-${qc.inspection_id}`,
                projectId: qc.project_id?.toString() || "unknown",
                projectName: qc.project_name || "Unknown Project",
                date: qc.inspection_date,
                type: qc.inspection_type,
                trade: qc.trade,
                status: (qc.status?.toLowerCase() === "closed" ? "pass" : "pending") as "pending" | "pass" | "fail",
                location: qc.location,
                createdBy: qc.created_by,
                description: qc.description,
                checklist: qc.checklist || [],
                defects: calculateDefects(qc.checklist),
                issues: extractIssues(qc.checklist),
                attachments: qc.attachments || [],
              }))
            : []

          // Transform safety data
          const transformedSafety = Array.isArray(safetyData)
            ? safetyData.map((safety: any) => ({
                id: `safety-${safety.inspection_id}`,
                projectId: safety.project_id?.toString() || "unknown",
                projectName: safety.project_name || "Unknown Project",
                date: safety.inspection_date,
                type: safety.inspection_type,
                trade: safety.trade,
                status: (safety.status?.toLowerCase() === "closed"
                  ? "pass"
                  : safety.responses?.some((r: any) => r.response === "At Risk")
                  ? "fail"
                  : "pass") as "pending" | "pass" | "fail",
                location: safety.location,
                createdBy: safety.created_by,
                description: safety.description,
                responses: safety.responses || [],
                violations: countViolations(safety.responses),
                atRiskItems: countViolations(safety.responses),
                complianceScore: calculateComplianceScore(safety.responses),
                attachments: safety.attachments || [],
              }))
            : []

          // Extract manpower data from daily logs
          const transformedManpower = transformedDailyLogs.flatMap((log: any) =>
            log.manpowerEntries.map((entry: any, index: number) => ({
              id: `manpower-${log.id}-${index}`,
              projectId: log.projectId,
              projectName: log.projectName,
              date: log.date,
              contractor: entry.contact_company || "Unknown Contractor",
              workers: entry.workers || 0,
              hours: entry.hours || 0,
              totalHours: entry.total_hours || 0,
              location: entry.location || "Unknown Location",
              comments: entry.comments || "",
              trade: inferTradeFromCompany(entry.contact_company),
              efficiency: calculateEfficiency(entry),
              costPerHour: estimateCostPerHour(entry.contact_company),
            }))
          )

          setFieldData({
            dailyLogs: transformedDailyLogs,
            qualityControl: transformedQualityControl,
            safety: transformedSafety,
            manpower: transformedManpower,
          })
        } catch (error) {
          console.error("Error loading field reports data:", error)
        } finally {
          setLoading(false)
        }
      }

      loadData()
    }, [])

    // Calculate field metrics
    const fieldMetrics = useMemo<FieldReportsStats>(() => {
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      const today = new Date()

      const businessDaysInMonth = calculateBusinessDays(startDate, endDate)
      const businessDaysToDate = calculateBusinessDays(startDate, today < endDate ? today : endDate)

      const totalLogs = fieldData.dailyLogs.length
      const completedLogs = fieldData.dailyLogs.filter((log) => log.status === "submitted").length
      const expectedLogs = businessDaysToDate
      const logComplianceRate = expectedLogs > 0 ? (completedLogs / expectedLogs) * 100 : 100

      const totalWorkers = fieldData.manpower.reduce((sum, record) => sum + record.workers, 0)
      const totalEfficiency = fieldData.manpower.reduce((sum, record) => sum + record.efficiency, 0)
      const averageEfficiency = fieldData.manpower.length > 0 ? totalEfficiency / fieldData.manpower.length : 0

      const safetyViolations = fieldData.safety.reduce((sum, audit) => sum + audit.violations, 0)
      const totalSafetyResponses = fieldData.safety.reduce((sum, audit) => sum + audit.responses.length, 0)
      const safeSafetyResponses = fieldData.safety.reduce(
        (sum, audit) => sum + audit.responses.filter((r) => r.response === "Safe").length,
        0
      )
      const safetyComplianceRate = totalSafetyResponses > 0 ? (safeSafetyResponses / totalSafetyResponses) * 100 : 100

      const qualityDefects = fieldData.qualityControl.reduce((sum, inspection) => sum + inspection.defects, 0)
      const totalInspections = fieldData.qualityControl.length
      const passedInspections = fieldData.qualityControl.filter((inspection) => inspection.status === "pass").length
      const qualityPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 100

      const atRiskSafetyItems = fieldData.safety.reduce((sum, audit) => sum + audit.atRiskItems, 0)

      return {
        totalLogs,
        logComplianceRate,
        expectedLogs,
        completedLogs,
        totalWorkers,
        averageEfficiency,
        safetyViolations,
        safetyComplianceRate,
        qualityDefects,
        qualityPassRate,
        totalInspections,
        atRiskSafetyItems,
        businessDaysInMonth,
        businessDaysToDate,
      }
    }, [fieldData])

    // Handle export
    const handleExport = async (format: "pdf" | "excel" | "csv") => {
      try {
        const projectName = projectData?.name || "Project"
        const exportData = {
          dailyLogs: fieldData.dailyLogs,
          manpower: fieldData.manpower,
          safetyAudits: fieldData.safety,
          qualityInspections: fieldData.qualityControl,
        }

        switch (format) {
          case "pdf":
            FieldReportsExportUtils.exportToPDF(exportData, fieldMetrics, projectName)
            break
          case "excel":
            FieldReportsExportUtils.exportToExcel(exportData, fieldMetrics, projectName)
            break
          case "csv":
            FieldReportsExportUtils.exportToCSV(exportData, projectName)
            break
        }
      } catch (error) {
        console.error("Export failed:", error)
      }
    }

    const renderContent = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading field reports...</p>
            </div>
          </div>
        )
      }

      switch (selectedSubTool) {
        case "daily":
          return (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Daily Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{fieldMetrics.totalLogs}</div>
                    <div className="text-sm text-blue-600">Total Logs</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {fieldMetrics.logComplianceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600">Compliance Rate</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{fieldMetrics.totalWorkers}</div>
                    <div className="text-sm text-purple-600">Total Workers</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {fieldMetrics.averageEfficiency.toFixed(1)}%
                    </div>
                    <div className="text-sm text-orange-600">Avg Efficiency</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {fieldData.dailyLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{log.projectName}</div>
                        <div className="text-sm text-muted-foreground">{log.date}</div>
                      </div>
                      <Badge variant={log.status === "submitted" ? "default" : "secondary"}>{log.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        case "safety":
          return (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Safety Audits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {fieldMetrics.safetyComplianceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-green-600">Compliance Rate</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{fieldMetrics.safetyViolations}</div>
                    <div className="text-sm text-red-600">Total Violations</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{fieldMetrics.atRiskSafetyItems}</div>
                    <div className="text-sm text-amber-600">At Risk Items</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{fieldData.safety.length}</div>
                    <div className="text-sm text-blue-600">Total Audits</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {fieldData.safety.slice(0, 5).map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{audit.type}</div>
                        <div className="text-sm text-muted-foreground">{audit.location}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={audit.status === "pass" ? "default" : "destructive"}>{audit.status}</Badge>
                        <span className="text-sm text-muted-foreground">{audit.complianceScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        case "quality":
          return (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Quality Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{fieldMetrics.totalInspections}</div>
                    <div className="text-sm text-blue-600">Total Inspections</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{fieldMetrics.qualityPassRate.toFixed(1)}%</div>
                    <div className="text-sm text-green-600">Pass Rate</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{fieldMetrics.qualityDefects}</div>
                    <div className="text-sm text-red-600">Total Defects</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {fieldData.qualityControl.filter((qc) => qc.status === "pass").length}
                    </div>
                    <div className="text-sm text-purple-600">Passed Inspections</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {fieldData.qualityControl.slice(0, 5).map((inspection) => (
                    <div key={inspection.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{inspection.type}</div>
                        <div className="text-sm text-muted-foreground">{inspection.location}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={inspection.status === "pass" ? "default" : "destructive"}>
                          {inspection.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{inspection.defects} defects</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        case "weather":
          return (
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Weather Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-blue-600">Weather Days</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">3</div>
                    <div className="text-sm text-amber-600">Delay Days</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">72°F</div>
                    <div className="text-sm text-green-600">Avg Temp</div>
                  </div>
                  <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">2.3in</div>
                    <div className="text-sm text-indigo-600">Total Rain</div>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-muted-foreground">Weather tracking and impact analysis coming soon...</p>
                </div>
              </div>
            </div>
          )
        default:
          return (
            <div className="space-y-6">
              <HbiFieldReportsInsights
                data={{
                  dailyLogs: fieldData.dailyLogs,
                  manpower: fieldData.manpower,
                  safetyAudits: fieldData.safety,
                  qualityInspections: fieldData.qualityControl,
                }}
                stats={fieldMetrics}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Reports Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{fieldMetrics.totalLogs}</div>
                        <div className="text-sm text-muted-foreground">Total Logs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {fieldMetrics.logComplianceRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Compliance</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Safety & Quality Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {fieldMetrics.safetyComplianceRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Safety Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {fieldMetrics.qualityPassRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Quality Pass</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
      }
    }

    return <div className="space-y-6">{renderContent()}</div>
  }

  // Handle category click
  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      if (expandedCategory === categoryName) {
        // If clicking the same category that's already expanded
        if (selectedTool) {
          // If a tool is selected, deselect it to show the tool menu
          // But keep the current content visible
          setSelectedTool(null)
          setSelectedSubTool(null)
        } else {
          // If no tool is selected, collapse the category
          setExpandedCategory(null)
        }
      } else {
        // Switch to new category - this should NOT change content
        setExpandedCategory(categoryName)
        // Don't change selectedTool - content should persist across category switches
        // The content will only change when a new tool is explicitly selected
      }
    },
    [expandedCategory, selectedTool]
  )

  // Handle tool click
  const handleToolClick = useCallback((toolName: string) => {
    setSelectedTool(toolName)
    setSelectedSubTool(null) // Reset sub-tool when tool changes
  }, [])

  // Handle sub-tool click
  const handleSubToolClick = useCallback((subToolName: string) => {
    setSelectedSubTool(subToolName)
  }, [])

  // Constraints Configuration
  const [activeConstraintsTab, setActiveConstraintsTab] = useState("log")
  const [constraintsLogTab, setConstraintsLogTab] = useState("open")

  // Process constraints data for the specific project
  const constraintsData = useMemo(() => {
    const rawData = constraintsDataRaw as any[]
    // Find the project's constraints
    const projectConstraints = rawData.find((p) => p.project_id === projectId)
    return projectConstraints ? projectConstraints.constraints : []
  }, [projectId])

  // Calculate constraints statistics
  const constraintsStats = useMemo(() => {
    const total = constraintsData.length
    const open = constraintsData.filter((c: any) => c.completionStatus !== "Closed").length
    const closed = constraintsData.filter((c: any) => c.completionStatus === "Closed").length
    const overdue = constraintsData.filter((c: any) => {
      if (c.completionStatus === "Closed") return false
      if (!c.dueDate) return false
      return new Date(c.dueDate) < new Date()
    }).length

    const byCategory = constraintsData.reduce((acc: any, constraint: any) => {
      acc[constraint.category] = (acc[constraint.category] || 0) + 1
      return acc
    }, {})

    return { total, open, closed, overdue, byCategory }
  }, [constraintsData])

  // Constraints sidebar data
  const constraintsQuickActions = [
    {
      label: "Create Constraint",
      icon: Plus,
      action: () => setActiveTab("constraints"),
    },
    {
      label: "View Timeline",
      icon: Calendar,
      action: () => {
        setActiveTab("constraints")
        setActiveConstraintsTab("timeline")
      },
    },
    {
      label: "Export Data",
      icon: Download,
      action: () => setActiveTab("constraints"),
    },
    {
      label: "Refresh Data",
      icon: RefreshCw,
      action: () => setActiveTab("constraints"),
    },
  ]

  const constraintsRecentActivity = [
    {
      id: "constraints-1",
      title: "New constraint identified",
      description: "Weather delay constraint added to timeline",
      color: "orange",
      icon: AlertTriangle,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "constraints-2",
      title: "Constraint resolved",
      description: "Material delivery constraint marked as closed",
      color: "green",
      icon: CheckCircle,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "constraints-3",
      title: "Timeline updated",
      description: "Constraints timeline refreshed with new data",
      color: "blue",
      icon: Clock,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
  ]

  const constraintsKeyMetrics = [
    {
      label: "Open Constraints",
      value: constraintsStats.open.toString(),
      color: "orange",
    },
    {
      label: "Closed Constraints",
      value: constraintsStats.closed.toString(),
      color: "green",
    },
    {
      label: "Overdue Items",
      value: constraintsStats.overdue.toString(),
      color: "red",
    },
  ]

  const constraintsInsights = [
    {
      id: "constraints-1",
      type: "alert",
      severity: "medium",
      title: "Constraint Management Efficiency",
      text: "Current constraint resolution rate is 15% faster than project average with proactive identification methods.",
      action: "Continue current monitoring practices and consider implementing across other project phases.",
      confidence: 89,
      relatedMetrics: ["Resolution Time", "Identification Rate", "Impact Mitigation"],
    },
    {
      id: "constraints-2",
      type: "opportunity",
      severity: "low",
      title: "Weather Pattern Analysis",
      text: "Historical weather data suggests 3 high-risk periods in next quarter requiring proactive planning.",
      action: "Schedule constraint planning sessions for identified high-risk weather windows.",
      confidence: 93,
      relatedMetrics: ["Weather Risk", "Schedule Buffer", "Resource Planning"],
    },
    {
      id: "constraints-3",
      type: "performance",
      severity: "high",
      title: "Constraint Prevention Success",
      text: "Proactive constraint identification preventing an estimated 8 days of schedule delays and $45K in additional costs.",
      action: "Document successful constraint prevention methods for knowledge transfer to other projects.",
      confidence: 96,
      relatedMetrics: ["Cost Avoidance", "Schedule Protection", "Risk Mitigation"],
    },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading project data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Project not found
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project with ID {params.projectId} could not be found.</p>
            <Button onClick={() => router.push("/projects")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Access denied
  if (!hasStageAccess && useStageAdaptive) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limited Access</AlertTitle>
            <AlertDescription>
              Your role ({userRole}) has limited access to the {stageConfig?.stageName} stage. You can view basic
              project information below or contact your project manager for additional access.
            </AlertDescription>
          </Alert>

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Stage</p>
                <p className="font-medium">{project.project_stage_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="font-medium capitalize">{userRole.replace("_", " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Header Section - Sticky, following infrastructure module pattern */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/projects" className="text-muted-foreground hover:text-foreground text-sm">
                    Projects
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="font-medium text-sm">{project.name}</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Site Title and Actions - Responsive */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground truncate">
                  {project.name}
                </h1>
                <Badge variant="secondary" className={`text-xs whitespace-nowrap ${stageConfig?.stageColor}`}>
                  {currentStage}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {projectMetrics?.scheduleProgress}% Complete
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Active
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Last: {lastRefresh.toLocaleTimeString()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleViewMode}
                  className="text-sm"
                  title={useStageAdaptive ? "Switch to traditional view" : "Switch to stage-adaptive view"}
                >
                  {useStageAdaptive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="hidden sm:inline ml-1">{useStageAdaptive ? "Traditional" : "Adaptive"}</span>
                </Button>
              </div>
            </div>

            {/* Stage Transition Error Alert */}
            {stageTransitionError && (
              <Alert className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Stage Transition Error</AlertTitle>
                <AlertDescription>
                  {stageTransitionError}
                  <Button variant="ghost" size="sm" onClick={() => setStageTransitionError(null)} className="ml-2">
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout - Following infrastructure module pattern */}
      <div className="max-w-[1920px] mx-auto px-1 sm:px-2 md:px-3 lg:px-4 py-2 sm:py-3">
        {/* Mobile Priority Cards - Show at top on small screens */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Contract Value</h3>
              <div className="text-2xl font-bold text-green-600">
                ${(projectMetrics?.totalBudget || 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3 text-green-500" />
                Total budget
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Progress</h3>
              <div className="text-2xl font-bold">{projectMetrics?.scheduleProgress}%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Target className="h-3 w-3 text-blue-500" />
                Schedule complete
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Team Size</h3>
              <div className="text-2xl font-bold">{projectMetrics?.activeTeamMembers}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-purple-500" />
                Active members
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Risk Items</h3>
              <div className="text-2xl font-bold text-orange-600">{projectMetrics?.riskItems}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                Active risks
              </div>
            </div>
          </div>
        </div>

        {/* Main Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ screens */}
          <div className="hidden xl:block xl:col-span-3 space-y-4 2xl:space-y-6">
            {/* Project Overview Cards - Desktop (static across all tabs) */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Project Overview</h3>
              <div className="space-y-3">
                {/* Project Description - First Item */}
                <div className="pb-3 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Description</p>
                  <p className="text-xs text-foreground leading-relaxed max-h-24 overflow-y-auto">
                    {project.description || "No description available"}
                  </p>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Value</span>
                  <span className="font-medium">${(projectMetrics?.totalBudget || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent to Date</span>
                  <span className="font-medium">${(projectMetrics?.spentToDate || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule Progress</span>
                  <span className="font-medium text-blue-600">{projectMetrics?.scheduleProgress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Progress</span>
                  <span className="font-medium text-green-600">{projectMetrics?.budgetProgress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Team Members</span>
                  <span className="font-medium">{projectMetrics?.activeTeamMembers}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                {selectedTool === "Financial Hub" ? (
                  // Financial Hub specific quick actions
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Calculator className="h-4 w-4 mr-2" />
                      Budget Analysis
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Receipt className="h-4 w-4 mr-2" />
                      Pay Application
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </>
                ) : selectedTool === "Procurement" ? (
                  // Procurement specific quick actions
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Procore
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Package className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </>
                ) : selectedTool === "Scheduler" ? (
                  // Scheduler specific quick actions
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Schedule
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </>
                ) : selectedTool === "Constraints Log" ? (
                  // Constraints specific quick actions
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Constraint
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Screen
                    </Button>
                  </>
                ) : selectedTool === "Permit Log" ? (
                  // Permit Log specific quick actions
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Permit
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Screen
                    </Button>
                  </>
                ) : selectedTool === "Field Reports" ? (
                  // Field Reports specific quick actions
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Daily Log
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Full Screen View
                    </Button>
                  </>
                ) : activeTab === "team" ? (
                  // Team-specific quick actions
                  teamQuickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  ))
                ) : activeTab === "constraints" ? (
                  // Constraints-specific quick actions
                  constraintsQuickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  ))
                ) : (
                  // Default quick actions for other tabs
                  <>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Review
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Budget Analysis
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      Team Management
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                {(selectedTool === "Financial Hub"
                  ? [
                      {
                        id: "financial-1",
                        title: "Pay Application Approved",
                        description: "Pay Application #12 approved for $2.2M",
                        color: "green",
                        icon: CheckCircle,
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "financial-2",
                        title: "Budget Variance Alert",
                        description: "Cost overrun detected in electrical trades",
                        color: "amber",
                        icon: AlertTriangle,
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "financial-3",
                        title: "Cash Flow Update",
                        description: "Monthly cash flow report generated",
                        color: "blue",
                        icon: TrendingUp,
                        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
                      },
                    ]
                  : selectedTool === "Procurement"
                  ? [
                      {
                        id: "procurement-1",
                        title: "Procore Sync Completed",
                        description: "Successfully synchronized 15 commitment records",
                        color: "green",
                        icon: CheckCircle,
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "procurement-2",
                        title: "Contract Awarded",
                        description: "Exterior wall assemblies contract awarded to vendor",
                        color: "blue",
                        icon: Package,
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "procurement-3",
                        title: "Bid Analysis Updated",
                        description: "Price variance detected in acoustical work",
                        color: "amber",
                        icon: AlertTriangle,
                        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                      },
                    ]
                  : selectedTool === "Scheduler"
                  ? [
                      {
                        id: "scheduler-1",
                        title: "Schedule Health Improved",
                        description: "Overall schedule health increased to 87%",
                        color: "green",
                        icon: CheckCircle,
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "scheduler-2",
                        title: "Critical Path Updated",
                        description: "Critical path duration reduced by 8 days",
                        color: "blue",
                        icon: Target,
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "scheduler-3",
                        title: "Schedule Variance Alert",
                        description: "Current variance is -8 days behind baseline",
                        color: "amber",
                        icon: AlertTriangle,
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                      },
                    ]
                  : selectedTool === "Constraints Log"
                  ? [
                      {
                        id: "constraints-1",
                        title: "Constraint Resolved",
                        description: "Weather delay constraint marked as closed",
                        color: "green",
                        icon: CheckCircle,
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "constraints-2",
                        title: "New Constraint Added",
                        description: "Permit approval delay identified for structural work",
                        color: "amber",
                        icon: AlertTriangle,
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "constraints-3",
                        title: "Constraint Updated",
                        description: "Material delivery delay extended by 5 days",
                        color: "blue",
                        icon: Clock,
                        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                      },
                    ]
                  : selectedTool === "Permit Log"
                  ? [
                      {
                        id: "permit-1",
                        title: "Permit Approved",
                        description: "Building permit BP-2024-001 approved by city",
                        color: "green",
                        icon: CheckCircle,
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "permit-2",
                        title: "Inspection Scheduled",
                        description: "Foundation inspection scheduled for next week",
                        color: "blue",
                        icon: Calendar,
                        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "permit-3",
                        title: "Permit Expiring",
                        description: "Mechanical permit expiring in 30 days",
                        color: "amber",
                        icon: AlertTriangle,
                        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                      },
                    ]
                  : selectedTool === "Field Reports"
                  ? [
                      {
                        id: "field-1",
                        title: "Daily Log Submitted",
                        description: "Daily log for December 26, 2024 submitted and approved",
                        color: "green",
                        icon: CheckCircle,
                        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "field-2",
                        title: "Safety Audit Completed",
                        description: "Weekly safety audit shows 96.7% compliance rate",
                        color: "blue",
                        icon: Shield,
                        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                      },
                      {
                        id: "field-3",
                        title: "Quality Issue Identified",
                        description: "Defect found in electrical installation requires rework",
                        color: "amber",
                        icon: AlertTriangle,
                        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                      },
                    ]
                  : activeTab === "team"
                  ? teamRecentActivity
                  : activeTab === "constraints"
                  ? constraintsRecentActivity
                  : recentActivity
                ).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-1 rounded bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
                      <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Key Metrics */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">
                {selectedTool === "Financial Hub"
                  ? "Financial Metrics"
                  : selectedTool === "Procurement"
                  ? "Procurement Metrics"
                  : selectedTool === "Scheduler"
                  ? "Schedule Metrics"
                  : selectedTool === "Constraints Log"
                  ? "Constraints Metrics"
                  : selectedTool === "Permit Log"
                  ? "Permit Metrics"
                  : selectedTool === "Field Reports"
                  ? "Field Reports Metrics"
                  : activeTab === "team"
                  ? "Key Metrics"
                  : activeTab === "constraints"
                  ? "Constraints Metrics"
                  : "Project Metrics"}
              </h3>
              <div className="space-y-3">
                {selectedTool === "Financial Hub" ? (
                  // Financial Hub specific key metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Profit Margin</span>
                      <span className="font-medium text-green-600">6.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget Variance</span>
                      <span className="font-medium text-amber-600">+2.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cash Flow</span>
                      <span className="font-medium text-blue-600">$8.2M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending Approvals</span>
                      <span className="font-medium text-orange-600">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Financial Health</span>
                      <span className="font-medium text-emerald-600">88%</span>
                    </div>
                  </>
                ) : selectedTool === "Procurement" ? (
                  // Procurement specific key metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Contract Value</span>
                      <span className="font-medium text-green-600">$2.63M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active Procurements</span>
                      <span className="font-medium text-blue-600">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Cycle Time</span>
                      <span className="font-medium text-purple-600">28 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Compliance Rate</span>
                      <span className="font-medium text-emerald-600">75%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vendor Count</span>
                      <span className="font-medium text-indigo-600">2</span>
                    </div>
                  </>
                ) : selectedTool === "Scheduler" ? (
                  // Scheduler specific key metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Schedule Health</span>
                      <span className="font-medium text-green-600">87%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Critical Path</span>
                      <span className="font-medium text-purple-600">10m 12d</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Schedule Variance</span>
                      <span className="font-medium text-amber-600">-8d</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Activities</span>
                      <span className="font-medium text-blue-600">1,247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI Score</span>
                      <span className="font-medium text-orange-600">8.7/10</span>
                    </div>
                  </>
                ) : selectedTool === "Constraints Log" ? (
                  // Constraints specific key metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Constraints</span>
                      <span className="font-medium text-blue-600">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Open</span>
                      <span className="font-medium text-orange-600">2</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Closed</span>
                      <span className="font-medium text-green-600">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overdue</span>
                      <span className="font-medium text-red-600">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Resolution Time</span>
                      <span className="font-medium text-purple-600">12 days</span>
                    </div>
                  </>
                ) : selectedTool === "Permit Log" ? (
                  // Permit Log specific key metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Permits</span>
                      <span className="font-medium text-blue-600">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Approved</span>
                      <span className="font-medium text-green-600">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-orange-600">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expired</span>
                      <span className="font-medium text-red-600">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate</span>
                      <span className="font-medium text-purple-600">50%</span>
                    </div>
                  </>
                ) : selectedTool === "Field Reports" ? (
                  // Field Reports specific key metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Logs</span>
                      <span className="font-medium text-blue-600">15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Compliance Rate</span>
                      <span className="font-medium text-green-600">92.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Workers</span>
                      <span className="font-medium text-purple-600">184</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Safety Score</span>
                      <span className="font-medium text-orange-600">96.7%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quality Pass Rate</span>
                      <span className="font-medium text-emerald-600">88.9%</span>
                    </div>
                  </>
                ) : activeTab === "team" ? (
                  // Team-specific key metrics
                  teamKeyMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
                    </div>
                  ))
                ) : activeTab === "constraints" ? (
                  // Constraints-specific key metrics
                  constraintsKeyMetrics.map((metric, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
                    </div>
                  ))
                ) : (
                  // Default project metrics
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Milestones</span>
                      <span className="font-medium text-green-600">
                        {projectMetrics?.completedMilestones}/{projectMetrics?.totalMilestones}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Active RFIs</span>
                      <span className="font-medium text-blue-600">{projectMetrics?.activeRFIs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Change Orders</span>
                      <span className="font-medium text-orange-600">{projectMetrics?.changeOrders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Risk Items</span>
                      <span className="font-medium text-red-600">{projectMetrics?.riskItems}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Dynamic HBI Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">
                  {selectedTool === "Financial Hub"
                    ? "HBI Financial Insights"
                    : selectedTool === "Procurement"
                    ? "HBI Procurement Insights"
                    : selectedTool === "Scheduler"
                    ? "HBI Schedule Insights"
                    : selectedTool === "Constraints Log"
                    ? "HBI Constraints Insights"
                    : selectedTool === "Permit Log"
                    ? "HBI Permit Insights"
                    : selectedTool === "Field Reports"
                    ? "HBI Field Reports Insights"
                    : activeTab === "team"
                    ? "HBI Team Insights"
                    : activeTab === "constraints"
                    ? "HBI Constraints Insights"
                    : "HBI Project Insights"}
                </h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights
                  config={
                    selectedTool === "Financial Hub"
                      ? [
                          {
                            id: "financial-1",
                            type: "alert",
                            severity: "medium",
                            title: "Budget Variance Detected",
                            text: "Current spending rate suggests potential budget overrun by 2.8% if trends continue.",
                            action: "Review cost controls and consider value engineering opportunities.",
                            confidence: 87,
                            relatedMetrics: ["Cost Performance", "Budget Tracking", "Change Orders"],
                          },
                          {
                            id: "financial-2",
                            type: "opportunity",
                            severity: "low",
                            title: "Cash Flow Optimization",
                            text: "Current cash flow position allows for accelerated material purchases with potential savings.",
                            action: "Consider early payment discounts and bulk purchase agreements.",
                            confidence: 82,
                            relatedMetrics: ["Cash Flow", "Material Costs", "Vendor Relations"],
                          },
                          {
                            id: "financial-3",
                            type: "performance",
                            severity: "low",
                            title: "Payment Processing Efficiency",
                            text: "Average payment processing time improved by 15% this quarter.",
                            action: "Continue current payment approval workflow optimization.",
                            confidence: 94,
                            relatedMetrics: ["Process Efficiency", "Payment Cycle", "Vendor Satisfaction"],
                          },
                        ]
                      : selectedTool === "Procurement"
                      ? [
                          {
                            id: "procurement-1",
                            type: "alert",
                            severity: "medium",
                            title: "Vendor Compliance Issue",
                            text: "25% of active vendors have incomplete insurance documentation.",
                            action:
                              "Follow up with vendors to complete compliance requirements before contract execution.",
                            confidence: 91,
                            relatedMetrics: ["Vendor Compliance", "Risk Management", "Contract Execution"],
                          },
                          {
                            id: "procurement-2",
                            type: "opportunity",
                            severity: "low",
                            title: "Cost Savings Opportunity",
                            text: "Exterior wall assemblies contract shows potential 5.3% savings below budget.",
                            action: "Negotiate additional value engineering or retain savings for contingency.",
                            confidence: 78,
                            relatedMetrics: ["Cost Optimization", "Budget Performance", "Value Engineering"],
                          },
                          {
                            id: "procurement-3",
                            type: "performance",
                            severity: "low",
                            title: "Procurement Cycle Time",
                            text: "Average procurement cycle time of 28 days is within industry benchmarks.",
                            action: "Maintain current procurement processes while monitoring for further optimization.",
                            confidence: 85,
                            relatedMetrics: ["Process Efficiency", "Vendor Relations", "Timeline Management"],
                          },
                        ]
                      : selectedTool === "Scheduler"
                      ? [
                          {
                            id: "scheduler-1",
                            type: "alert",
                            severity: "medium",
                            title: "Schedule Variance Detected",
                            text: "Current schedule variance of -8 days indicates potential delays in critical path activities.",
                            action:
                              "Review critical path activities and consider resource reallocation or fast-tracking.",
                            confidence: 89,
                            relatedMetrics: ["Critical Path", "Schedule Variance", "Resource Allocation"],
                          },
                          {
                            id: "scheduler-2",
                            type: "opportunity",
                            severity: "low",
                            title: "Schedule Optimization Opportunity",
                            text: "Analysis shows potential for 5-day schedule compression through activity sequencing.",
                            action: "Implement parallel work streams and optimize predecessor relationships.",
                            confidence: 76,
                            relatedMetrics: ["Schedule Optimization", "Work Sequencing", "Efficiency"],
                          },
                          {
                            id: "scheduler-3",
                            type: "performance",
                            severity: "low",
                            title: "Schedule Health Improvement",
                            text: "Overall schedule health improved by 12% through recent optimization efforts.",
                            action: "Continue current schedule monitoring and maintenance practices.",
                            confidence: 92,
                            relatedMetrics: ["Schedule Health", "Process Improvement", "Project Performance"],
                          },
                        ]
                      : selectedTool === "Constraints Log"
                      ? [
                          {
                            id: "constraints-1",
                            type: "alert",
                            severity: "medium",
                            title: "Critical Path Impact",
                            text: "Open permit constraint has potential to delay critical path activities by 5-10 days.",
                            action: "Escalate permit approval process and prepare alternative work sequences.",
                            confidence: 83,
                            relatedMetrics: ["Critical Path", "Permit Process", "Schedule Risk"],
                          },
                          {
                            id: "constraints-2",
                            type: "opportunity",
                            severity: "low",
                            title: "Resolution Optimization",
                            text: "Material delivery delay can be mitigated by sourcing from alternative suppliers.",
                            action: "Contact backup suppliers and evaluate cost-time trade-offs.",
                            confidence: 75,
                            relatedMetrics: ["Material Management", "Supply Chain", "Cost Optimization"],
                          },
                          {
                            id: "constraints-3",
                            type: "performance",
                            severity: "low",
                            title: "Resolution Tracking",
                            text: "Average constraint resolution time of 12 days is within industry benchmarks.",
                            action: "Maintain current constraint management processes and tracking protocols.",
                            confidence: 91,
                            relatedMetrics: ["Process Efficiency", "Resolution Time", "Benchmark Comparison"],
                          },
                        ]
                      : selectedTool === "Permit Log"
                      ? [
                          {
                            id: "permit-1",
                            type: "alert",
                            severity: "medium",
                            title: "Permit Expiration Alert",
                            text: "One mechanical permit expires within 30 days and requires renewal to avoid project delays.",
                            action:
                              "Initiate permit renewal process and coordinate with municipal building department.",
                            confidence: 91,
                            relatedMetrics: ["Permit Expiration", "Renewal Process", "Project Timeline"],
                          },
                          {
                            id: "permit-2",
                            type: "opportunity",
                            severity: "low",
                            title: "Inspection Scheduling Optimization",
                            text: "Foundation inspection can be scheduled to align with other site activities for efficiency.",
                            action: "Coordinate inspection timing with construction schedule to minimize downtime.",
                            confidence: 79,
                            relatedMetrics: ["Inspection Timing", "Schedule Efficiency", "Resource Optimization"],
                          },
                          {
                            id: "permit-3",
                            type: "performance",
                            severity: "low",
                            title: "Permit Approval Rate",
                            text: "Current permit approval rate of 67% is within acceptable range for project type.",
                            action: "Continue current permit application practices while monitoring approval trends.",
                            confidence: 86,
                            relatedMetrics: ["Approval Rate", "Process Performance", "Compliance Tracking"],
                          },
                        ]
                      : activeTab === "team"
                      ? teamInsights
                      : activeTab === "constraints"
                      ? constraintsInsights
                      : projectInsights
                  }
                  cardId={`${selectedTool || activeTab}-insights-${projectId}`}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Module Header */}
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                    onClick={() => {
                      setExpandedCategory(null)
                      setSelectedTool(null)
                      setSelectedSubTool(null)
                    }}
                  >
                    Project Control Center
                  </h2>
                  <p className="text-sm text-muted-foreground">Manage project details, documents, and resources</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div className="w-full">
                {/* Level 1: Main Category Tabs - Fill space with gaps */}
                <div className="flex items-center p-1 bg-muted rounded-lg">
                  {/* Overview Tab */}
                  <Button
                    variant={!expandedCategory && !selectedTool ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setExpandedCategory(null)
                      setSelectedTool(null)
                      setSelectedSubTool(null)
                    }}
                    className="flex-1 flex items-center justify-center mx-1"
                  >
                    <span>Core</span>
                  </Button>

                  {/* Category Tabs */}
                  {availableCategories
                    .filter((cat) => cat.name !== "overview")
                    .map((category) => (
                      <Button
                        key={category.name}
                        variant={expandedCategory === category.name ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex-1 flex items-center justify-center mx-1"
                      >
                        <span>{category.label || category.name}</span>
                      </Button>
                    ))}
                </div>

                {/* Level 2: Tool Tabs (shown when category is expanded AND no tool is selected) - Centered beneath parent */}
                {expandedCategory && categoryTools.length > 0 && !selectedTool && (
                  <div className="flex justify-center mt-2">
                    <div
                      className="flex flex-wrap items-center justify-center gap-2 p-1 bg-muted/50 rounded-lg"
                      style={{
                        maxWidth: `${Math.min(100, categoryTools.length * 140 + 40)}%`,
                        minWidth: "200px",
                      }}
                    >
                      {categoryTools.map((tool) => (
                        <Button
                          key={tool.name}
                          variant={selectedTool === tool.name ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleToolClick(tool.name)}
                          className="flex items-center text-sm whitespace-nowrap"
                          disabled={tool.href === "#" || tool.href.includes("coming-soon")}
                        >
                          <span>{tool.name}</span>
                          {(tool.href === "#" || tool.href.includes("coming-soon")) && (
                            <Badge variant="secondary" className="text-xs ml-1">
                              Soon
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level 3: Sub-tool Tabs (shown when tool is selected and has sub-tabs) - Centered beneath parent */}
                {selectedTool && getToolSubTabs(selectedTool).length > 0 && (
                  <div className="flex justify-center mt-2">
                    <div
                      className="flex flex-wrap items-center justify-center gap-2 p-1 bg-muted/30 rounded-lg"
                      style={{
                        maxWidth: `${Math.min(80, getToolSubTabs(selectedTool).length * 120 + 40)}%`,
                        minWidth: "180px",
                      }}
                    >
                      {getToolSubTabs(selectedTool).map((subTool) => (
                        <Button
                          key={subTool.id}
                          variant={selectedSubTool === subTool.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleSubToolClick(subTool.id)}
                          className="flex items-center text-xs whitespace-nowrap"
                        >
                          <span>{subTool.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Area */}
                <div className="mt-6">
                  {/* Overview Content */}
                  {!selectedTool && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Project Summary Card */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Project Summary</CardTitle>
                            <CardDescription>Key project information and metrics</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Project Type</p>
                                  <p className="font-medium">{project.project_type_name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Duration</p>
                                  <p className="font-medium">{project.duration} days</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Square Feet</p>
                                  <p className="font-medium">{project.square_feet?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Location</p>
                                  <p className="font-medium">{project.address || "Not specified"}</p>
                                </div>
                              </div>

                              <div className="pt-4 border-t">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Schedule Progress</span>
                                  <span className="text-sm font-medium">{projectMetrics?.scheduleProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${projectMetrics?.scheduleProgress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Stage-Adaptive Content */}
                        {useStageAdaptive && stageConfig && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{stageConfig.stageName} Stage Tools</CardTitle>
                              <CardDescription>Tools and features for current project stage</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-64 overflow-y-auto">
                                <StageAdaptiveContent
                                  project={{
                                    ...project,
                                    project_stage_name: currentStage,
                                  }}
                                  currentStage={currentStage}
                                  userRole={userRole}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Project Status:</strong> This project is currently in the {currentStage} stage with{" "}
                          {projectMetrics?.scheduleProgress}% completion. {projectMetrics?.riskItems} risk items require
                          attention.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {/* Tool Content */}
                  {selectedTool && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTool(null)
                            setSelectedSubTool(null)
                          }}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Core
                        </Button>
                        <h4 className="text-lg font-semibold">{selectedTool}</h4>
                        {selectedSubTool && (
                          <>
                            <span className="text-muted-foreground">/</span>
                            <span className="text-base font-medium">
                              {getToolSubTabs(selectedTool).find((st) => st.id === selectedSubTool)?.label}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="min-h-96 border rounded-lg bg-card">
                        {selectedTool === "Start-Up Checklist" && (
                          <StartUpChecklist
                            projectId={projectId.toString()}
                            projectName={project?.display_name || project?.name || "Project"}
                            mode="editable"
                            onStatusChange={(
                              sectionId: string,
                              itemId: string,
                              status: "Conforming" | "Deficient" | "Neutral" | "N/A"
                            ) => {
                              console.log("Start-Up Checklist status change:", sectionId, itemId, status)
                            }}
                          />
                        )}
                        {selectedTool === "Closeout Checklist" && (
                          <CloseoutChecklist
                            projectId={projectId.toString()}
                            mode="full"
                            userRole={userRole === "project_manager" ? "pm" : "admin"}
                            onStatusChange={(
                              itemId: string,
                              status: "Conforming" | "Deficient" | "Neutral" | "N/A"
                            ) => {
                              console.log("Closeout Checklist status change:", itemId, status)
                            }}
                          />
                        )}
                        {selectedTool === "Financial Hub" && (
                          <FinancialHubContent
                            selectedSubTool={selectedSubTool || "overview"}
                            projectData={project}
                            userRole={userRole}
                          />
                        )}
                        {selectedTool === "Scheduler" && (
                          <SchedulerContent
                            selectedSubTool={selectedSubTool || "overview"}
                            projectData={project}
                            userRole={userRole}
                          />
                        )}
                        {selectedTool === "Procurement" && (
                          <ProcurementContent
                            selectedSubTool={selectedSubTool || "log"}
                            projectData={project}
                            userRole={userRole}
                          />
                        )}
                        {selectedTool === "Constraints Log" && (
                          <ConstraintsContent
                            selectedSubTool={selectedSubTool || "log"}
                            projectData={project}
                            userRole={userRole}
                          />
                        )}
                        {selectedTool === "Permit Log" && (
                          <PermitLogContent
                            selectedSubTool={selectedSubTool || "overview"}
                            projectData={project}
                            userRole={userRole}
                          />
                        )}
                        {selectedTool === "Field Reports" && (
                          <FieldReportsContent
                            selectedSubTool={selectedSubTool || "daily"}
                            projectData={project}
                            userRole={userRole}
                          />
                        )}
                        {![
                          "Start-Up Checklist",
                          "Closeout Checklist",
                          "Financial Hub",
                          "Scheduler",
                          "Procurement",
                          "Constraints Log",
                          "Permit Log",
                          "Field Reports",
                        ].includes(selectedTool) && (
                          <div className="text-center text-muted-foreground p-6">
                            {selectedTool} content would be rendered here.
                            <br />
                            <span className="text-sm">This will display the full tool interface inline.</span>
                            {selectedSubTool && (
                              <>
                                <br />
                                <span className="text-sm">Selected sub-tab: {selectedSubTool}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category tool menu removed - tools only accessible via second tab row */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Info */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integration Capabilities</CardTitle>
            <CardDescription>Project management system integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm">SharePoint Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm">HBI AI Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm">Schedule Management</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Financial Tracking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
