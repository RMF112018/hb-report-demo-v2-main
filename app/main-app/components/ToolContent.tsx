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
import { useRouter } from "next/navigation"
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
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Download,
  Target,
  Zap,
  CheckCircle2,
  XCircle,
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
  Ruler,
  Gavel,
  UserPlus,
  Heart,
  GraduationCap,
} from "lucide-react"
import type { UserRole } from "../../project/[projectId]/types/project"
import type { ProcurementLogRecord, ProcoreCommitment, BidTabLink } from "../../../types/procurement"
import { useToast } from "../../../hooks/use-toast"
import { useAuth } from "../../../context/auth-context"
import { cn } from "../../../lib/utils"

// Lazy-loaded staffing components for production-ready loading
const ExecutiveStaffingView = React.lazy(() =>
  import("../../../components/staffing/ExecutiveStaffingView").then((module) => ({
    default: module.ExecutiveStaffingView,
  }))
)
const ProjectExecutiveStaffingView = React.lazy(() =>
  import("../../../components/staffing/ProjectExecutiveStaffingView").then((module) => ({
    default: module.ProjectExecutiveStaffingView,
  }))
)
const ProjectManagerStaffingView = React.lazy(() =>
  import("../../../components/staffing/ProjectManagerStaffingView").then((module) => ({
    default: module.ProjectManagerStaffingView,
  }))
)

// Import staffing components
import { EnhancedHBIInsights } from "../../../components/cards/EnhancedHBIInsights"
import { EnhancedInteractiveStaffingGantt } from "../../dashboard/staff-planning/components/EnhancedInteractiveStaffingGantt"
import { SPCRInboxPanel } from "../../dashboard/staff-planning/components/SPCRInboxPanel"
import { LaborVsRevenuePanel } from "../../dashboard/staff-planning/components/LaborVsRevenuePanel"
import { useStaffingStore } from "../../dashboard/staff-planning/store/useStaffingStore"
import { ExportModal } from "../../../components/constraints/ExportModal"

// Import new modular staffing components
import { ExecutivePortfolioStats } from "../../../components/staffing/ExecutivePortfolioStats"
import { ExecutivePortfolioSidebar } from "../../../components/staffing/ExecutivePortfolioSidebar"
import { ExecutivePortfolioOverview } from "../../../components/staffing/ExecutivePortfolioOverview"
import { ExecutiveStaffingInsights } from "../../../components/staffing/ExecutiveStaffingInsights"
import { StaffTimelineChart } from "../../dashboard/staff-planning/components/StaffTimelineChart"

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

// Import Safety components
import { SafetyDashboard } from "../../../components/safety/SafetyDashboard"
import { QualityDashboard } from "../../../components/quality/QualityDashboard"

// Import estimating components
import { CostSummaryModule } from "../../../components/estimating/CostSummaryModule"
import { EstimatingProvider } from "../../../components/estimating/EstimatingProvider"

// Lazy-load HR & Payroll components for production-ready loading
const PersonnelPage = React.lazy(() =>
  import("../../../components/hr-payroll/personnel/page").then((module) => ({
    default: module.default,
  }))
)
const RecruitingPage = React.lazy(() =>
  import("../../../components/hr-payroll/recruiting/page").then((module) => ({
    default: module.default,
  }))
)
const TimesheetsPage = React.lazy(() =>
  import("../../../components/hr-payroll/timesheets/page").then((module) => ({
    default: module.default,
  }))
)
const ExpensesPage = React.lazy(() =>
  import("../../../components/hr-payroll/expenses/page").then((module) => ({
    default: module.default,
  }))
)
const PayrollPage = React.lazy(() =>
  import("../../../components/hr-payroll/payroll/page").then((module) => ({
    default: module.default,
  }))
)
const BenefitsPage = React.lazy(() =>
  import("../../../components/hr-payroll/benefits/page").then((module) => ({
    default: module.default,
  }))
)
const TrainingPage = React.lazy(() =>
  import("../../../components/hr-payroll/training/page").then((module) => ({
    default: module.default,
  }))
)
const CompliancePage = React.lazy(() =>
  import("../../../components/hr-payroll/compliance/page").then((module) => ({
    default: module.default,
  }))
)
const SettingsPage = React.lazy(() =>
  import("../../../components/hr-payroll/settings/page").then((module) => ({
    default: module.default,
  }))
)

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
  renderMode?: "leftContent" | "rightContent"
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
  Safety: {
    title: "Safety",
    description: "Safety management, incident reporting, and compliance tracking",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "certifications", label: "Certifications" },
      { id: "forms", label: "Forms" },
      { id: "programs", label: "Programs" },
      { id: "notices", label: "Notices" },
      { id: "emergency", label: "Emergency" },
    ],
  },
  "Quality Control": {
    title: "Quality Control",
    description: "Quality management, metrics tracking, warranty management, and compliance monitoring",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "metrics", label: "Quality Metrics" },
      { id: "warranty", label: "Warranty Log" },
      { id: "programs", label: "Programs & Procedures" },
      { id: "notices", label: "Notices & Updates" },
    ],
  },
  "Quality Control & Warranty": {
    title: "Quality Control & Warranty",
    description: "Quality management, metrics tracking, warranty management, and compliance monitoring",
    tabs: [
      { id: "overview", label: "Overview" },
      { id: "metrics", label: "Quality Metrics" },
      { id: "warranty", label: "Warranty Log" },
      { id: "programs", label: "Programs & Procedures" },
      { id: "notices", label: "Notices & Updates" },
    ],
  },
  "HR & Payroll": {
    title: "HR & Payroll",
    description: "Comprehensive human resources and payroll management system",
    tabs: [
      { id: "personnel", label: "Personnel" },
      { id: "recruiting", label: "Recruiting" },
      { id: "timesheets", label: "Timesheets" },
      { id: "expenses", label: "Expenses" },
      { id: "payroll", label: "Payroll" },
      { id: "benefits", label: "Benefits" },
      { id: "training", label: "Training" },
      { id: "compliance", label: "Compliance" },
      { id: "settings", label: "Settings" },
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
        <EnhancedInteractiveStaffingGantt
          userRole={userRole as "executive" | "project-executive" | "project-manager"}
        />

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

// Production-Ready Role-Based Staffing Content with ExecutiveStaffingView Integration
const ModularStaffingContent: React.FC<{
  userRole: UserRole
  user: User
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
}> = ({ userRole, user, onNavigateBack, activeTab = "overview", onTabChange, renderMode = "rightContent" }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Handle component loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading staffing content...</p>
        </div>
      </div>
    )
  }

  // Role-based content injection following v-3-0 modular architecture
  const renderRoleSpecificContent = () => {
    // For left content mode, show sidebar content based on role and tab
    if (
      renderMode === "leftContent" &&
      ((userRole === "executive" && activeTab === "overview") ||
        (userRole === "project-executive" && activeTab === "portfolio") ||
        (userRole === "project-manager" && activeTab === "team"))
    ) {
      return (
        <div className="space-y-4">
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
                <span className="font-medium">248</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Utilization Rate</span>
                <span className="font-medium text-green-600">89.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Labor Cost</span>
                <span className="font-medium">$2.03M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cash Inflow on Labor</span>
                <span className="font-medium text-blue-600">$2,819,400</span>
              </div>
            </CardContent>
          </Card>

          {/* Needing Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Needing Assignment (5)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-48 overflow-auto">
                <div className="space-y-1">
                  {[
                    { name: "Emily Davis", role: "Project Engineer", days: 7 },
                    { name: "Michael Chen", role: "Senior PM", days: 12 },
                    { name: "Sarah Johnson", role: "Project Manager II", days: 28 },
                    { name: "Alex Rodriguez", role: "Project Admin", days: 45 },
                    { name: "James Wilson", role: "Project Manager I", days: 62 },
                  ].map((staff, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 px-2 text-xs border-b border-border"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-muted-foreground text-[10px]">{staff.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            staff.days <= 14 ? "text-red-600" : staff.days <= 30 ? "text-yellow-600" : "text-green-600"
                          }`}
                        >
                          {staff.days}d
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved SPCRs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                Approved SPCRs (6)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="h-64 overflow-auto">
                <div className="space-y-3">
                  {[
                    {
                      position: "Senior Project Manager",
                      project: "Oceanfront Resort",
                      type: "increase",
                      budget: 125000,
                    },
                    { position: "Project Engineer", project: "Downtown Office", type: "increase", budget: 89000 },
                    { position: "Site Supervisor", project: "Medical Center", type: "decrease", budget: 67000 },
                  ].map((spcr, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-xs">{spcr.position}</div>
                            <div className="text-[10px] text-muted-foreground">{spcr.project}</div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-xs font-medium ${
                                spcr.type === "increase" ? "text-green-600" : "text-orange-600"
                              }`}
                            >
                              {spcr.type === "increase" ? "+" : "-"}
                            </div>
                            <div className="text-[10px] text-muted-foreground">${(spcr.budget / 1000).toFixed(0)}K</div>
                          </div>
                        </div>
                        <div className="flex gap-1 pt-1">
                          <Button size="sm" className="h-6 px-2 text-[10px] bg-green-600 hover:bg-green-700">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Assign Staff
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // For right content mode, show main content
    return (
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading staffing content...</p>
            </div>
          </div>
        }
      >
        {userRole === "executive" && <ExecutiveStaffingView activeTab={activeTab} mode="injected" />}
        {userRole === "project-executive" && <ProjectExecutiveStaffingView />}
        {userRole === "project-manager" && <ProjectManagerStaffingView />}
        {!["executive", "project-executive", "project-manager"].includes(userRole) && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Limited Access</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your current role has limited access to staffing management features. Contact your administrator for
              additional permissions.
            </p>
          </div>
        )}
      </React.Suspense>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation - Following v-3-0 standards */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {user.firstName} {user.lastName}
        </span>
        <ChevronRight className="h-4 w-4" />
        <span>Staffing</span>
      </div>

      {/* Role-Specific Content Injection */}
      {renderRoleSpecificContent()}
    </div>
  )
}

// New Role-Based Staffing Content using modular components
const StaffingLegacyContent: React.FC<{
  userRole: UserRole
  user: User
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
}> = ({ userRole, user, onNavigateBack, activeTab = "portfolio", onTabChange }) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    setIsLoading(true)
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

  const getStaffingTitle = () => {
    switch (userRole) {
      case "executive":
        return "Enterprise Staffing Management"
      case "project-executive":
        return "Portfolio Staffing Management"
      case "project-manager":
        return "Project Staffing Management"
      default:
        return "Staffing Management"
    }
  }

  const getStaffingDescription = () => {
    switch (userRole) {
      case "executive":
        return "Comprehensive enterprise-wide staffing oversight with strategic planning and resource optimization capabilities"
      case "project-executive":
        return "Portfolio staffing management with SPCR review and resource allocation oversight across your assigned projects"
      case "project-manager":
        return "Project-specific staffing management with team coordination and SPCR workflow capabilities"
      default:
        return "Staffing management and resource planning tools"
    }
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
          <span>Staffing</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getStaffingTitle()}</h1>
            <p className="text-muted-foreground">{getStaffingDescription()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)}>
              <FileText className="h-4 w-4 mr-1" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full">
        {/* Portfolio Overview Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            {/* Portfolio Statistics */}
            <ExecutivePortfolioStats userRole={userRole as "executive" | "project-executive" | "project-manager"} />

            {/* Main Content with Sidebar Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
              {/* Sidebar */}
              <div className="xl:col-span-3">
                <ExecutivePortfolioSidebar
                  userRole={userRole as "executive" | "project-executive" | "project-manager"}
                  onTabChange={onTabChange || (() => {})}
                />
              </div>

              {/* Main Content */}
              <div className="xl:col-span-9">
                <ExecutivePortfolioOverview
                  userRole={userRole as "executive" | "project-executive" | "project-manager"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resource Management Tab */}
        {activeTab === "management" && (
          <div className="space-y-6">
            {/* Staff Assignment Management */}
            <EnhancedInteractiveStaffingGantt
              userRole={userRole as "executive" | "project-executive" | "project-manager"}
            />

            {/* SPCR Management - Only for project-executive and project-manager */}
            {(userRole === "project-executive" || userRole === "project-manager") && (
              <SPCRInboxPanel userRole={userRole as "project-executive" | "project-manager"} />
            )}
          </div>
        )}

        {/* Analytics & Insights Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* HBI Insights */}
            <ExecutiveStaffingInsights userRole={userRole as "executive" | "project-executive" | "project-manager"} />

            {/* Financial Analysis */}
            <LaborVsRevenuePanel userRole={userRole as "executive" | "project-executive" | "project-manager"} />

            {/* Staff Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Staff Timeline Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(userRole === "project-executive" || userRole === "project-manager") && (
                  <StaffTimelineChart userRole={userRole as "project-executive" | "project-manager"} />
                )}
                {userRole === "executive" && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Staff Timeline Analysis available for Project Executive and Project Manager roles.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
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
  const router = useRouter()
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Use Next.js App Router refresh instead of full page reload
                // This preserves browser history and React state
                router.refresh()
              }}
            >
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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 mb-3">
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

// Safety Content Component
const SafetyContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  // Role-based access control - Executive users only
  if (userRole !== "executive") {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Safety Control Center access is restricted to Executive users only. Contact your administrator for access.
        </p>
        <Button variant="outline" onClick={onNavigateBack} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {user.firstName} {user.lastName}
        </span>
        <ChevronRight className="h-4 w-4" />
        <span>Safety Control Center</span>
      </div>

      {/* Safety Dashboard Content */}
      <SafetyDashboard user={user} />
    </div>
  )
}

// Quality Control & Warranty Content Component
const QualityControlContent: React.FC<{ userRole: UserRole; user: User; onNavigateBack?: () => void }> = ({
  userRole,
  user,
  onNavigateBack,
}) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {user.firstName} {user.lastName}
        </span>
        <ChevronRight className="h-4 w-4" />
        <span>Quality Control & Warranty</span>
      </div>

      {/* Quality Control Dashboard */}
      <QualityDashboard userRole={userRole} user={user} />
    </div>
  )
}

const EstimatingContent: React.FC<{
  userRole: UserRole
  user: User
  activeTab?: string
  onTabChange?: (tabId: string) => void
}> = ({ userRole, user, activeTab = "cost-summary", onTabChange }) => {
  // Get the selected project from localStorage
  const selectedProject = typeof window !== "undefined" ? localStorage.getItem("selectedProject") : null
  const projectName = selectedProject ? `Project ${selectedProject}` : "Untitled Project"

  return (
    <EstimatingProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Estimating Center</h1>
            <p className="text-gray-600 dark:text-gray-400">Cost analysis and project estimation tools</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {userRole}
            </Badge>
          </div>
        </div>

        {/* Estimating Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cost-summary" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Cost Summary
            </TabsTrigger>
            <TabsTrigger value="takeoff" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Takeoff
            </TabsTrigger>
            <TabsTrigger value="bidding" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              Bidding
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cost-summary" className="space-y-6">
            <CostSummaryModule projectId={selectedProject || "demo"} projectName={projectName} />
          </TabsContent>

          <TabsContent value="takeoff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quantity Takeoff</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Takeoff functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bidding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bid Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Bid management functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estimating Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics functionality coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EstimatingProvider>
  )
}

const HRPayrollContent: React.FC<{
  userRole: UserRole
  user: User
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
}> = ({ userRole, user, onNavigateBack, activeTab = "personnel", onTabChange }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "personnel":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Personnel...</div>}>
            <PersonnelPage />
          </React.Suspense>
        )
      case "recruiting":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Recruiting...</div>}>
            <RecruitingPage />
          </React.Suspense>
        )
      case "timesheets":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Timesheets...</div>}>
            <TimesheetsPage />
          </React.Suspense>
        )
      case "expenses":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Expenses...</div>}>
            <ExpensesPage />
          </React.Suspense>
        )
      case "payroll":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Payroll...</div>}>
            <PayrollPage />
          </React.Suspense>
        )
      case "benefits":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Benefits...</div>}>
            <BenefitsPage />
          </React.Suspense>
        )
      case "training":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Training...</div>}>
            <TrainingPage />
          </React.Suspense>
        )
      case "compliance":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Compliance...</div>}>
            <CompliancePage />
          </React.Suspense>
        )
      case "settings":
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Settings...</div>}>
            <SettingsPage />
          </React.Suspense>
        )
      default:
        return (
          <React.Suspense fallback={<div className="flex items-center justify-center p-8">Loading Personnel...</div>}>
            <PersonnelPage />
          </React.Suspense>
        )
    }
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
          <span>HR & Payroll Management</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">HR & Payroll Management</h1>
            <p className="text-muted-foreground">Comprehensive human resources and payroll management system</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onNavigateBack}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* HR & Payroll Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="personnel" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personnel
          </TabsTrigger>
          <TabsTrigger value="recruiting" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Recruiting
          </TabsTrigger>
          <TabsTrigger value="timesheets" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timesheets
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="payroll" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="recruiting" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {renderTabContent()}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
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
  renderMode = "rightContent",
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

  // Use modular layout for Staffing tool with proper ExecutiveStaffingView integration
  if (toolName === "Staffing") {
    return (
      <ModularStaffingContent
        userRole={userRole}
        user={user}
        onNavigateBack={onNavigateBack}
        activeTab={activeTab}
        onTabChange={onTabChange}
        renderMode={renderMode}
      />
    )
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

  // Use Safety layout for Safety tool
  if (toolName === "Safety") {
    return <SafetyContent userRole={userRole} user={user} onNavigateBack={onNavigateBack} />
  }

  // Use Quality Control layout for Quality Control & Warranty tool
  if (toolName === "Quality Control & Warranty") {
    return <QualityControlContent userRole={userRole} user={user} onNavigateBack={onNavigateBack} />
  }

  // Use Estimating layout for Estimating tool
  if (toolName === "estimating") {
    return <EstimatingContent userRole={userRole} user={user} activeTab={activeTab} onTabChange={onTabChange} />
  }

  // Use HR & Payroll layout for HR & Payroll tool
  if (toolName === "HR & Payroll") {
    // Navigate to the dedicated HR & Payroll Suite page
    window.location.href = "/hr-payroll"
    return null
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
