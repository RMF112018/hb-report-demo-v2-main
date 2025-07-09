/**
 * @fileoverview Project Control Center Content Component
 * @module ProjectControlCenterContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Enhanced project control center with:
 * - Core Project Tools implementation
 * - Tab-based navigation (Dashboard, Checklists, Reports, Responsibility Matrix, Productivity)
 * - Left sidebar content injection for main app
 * - Dynamic sidebar panels (Project Overview, Quick Actions, Recent Activity, Key Metrics, HBI Insights)
 * - Role-based access control
 * - Responsive layout integration
 */

"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronRight,
  RefreshCw,
  Upload,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  Calendar,
  Activity,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  BarChart3,
  Brain,
  Monitor,
  Target,
  Zap,
  GitBranch,
  Calculator,
  CreditCard,
  Receipt,
  Percent,
  Settings,
  Info,
  Plus,
  Download,
  Eye,
  CheckSquare,
  Send,
  History,
  FileX,
  Briefcase,
  ClipboardList,
  MessageSquare,
  Shield,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

// Import content components from legacy page
import { ReportCreator } from "@/components/reports/ReportCreator"
import { ReportViewer } from "@/components/reports/ReportViewer"
import { ReportApprovalWorkflow } from "@/components/reports/ReportApprovalWorkflow"
import { ReportHistory } from "@/components/reports/ReportHistory"
import { ReportAnalytics } from "@/components/reports/ReportAnalytics"
import { ReportsDashboard } from "@/components/reports/ReportsDashboard"
import { ProjectReports } from "@/components/reports/ProjectReports"
import { StartUpChecklist } from "@/components/startup/StartUpChecklist"
import CloseoutChecklist from "@/components/closeout/CloseoutChecklist"
import ResponsibilityMatrixCore from "./ResponsibilityMatrixCore"
import FinancialHubProjectContent from "./content/FinancialHubProjectContent"
import { ProjectManagerStaffingView } from "@/components/staffing/ProjectManagerStaffingView"
import { ProjectStaffingGantt } from "@/components/staffing/ProjectStaffingGantt"
import { ProjectSPCRManager } from "@/components/staffing/ProjectSPCRManager"
import { StaffingDashboard } from "@/components/staffing/StaffingDashboard"
import { ProjectProductivityContent } from "@/components/productivity/ProjectProductivityContent"
import FieldManagementContent from "./content/FieldManagementContent"

interface ProjectControlCenterContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

interface NavigationState {
  category: string | null
  tool: string | null
  subTool: string | null
  coreTab: string | null
  staffingSubTab: string | null
  reportsSubTab: string | null
}

// Expandable Description Component
const ExpandableDescription: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className={`text-xs text-foreground leading-relaxed ${isExpanded ? "overflow-visible" : "overflow-hidden"}`}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "none" : 3,
          WebkitBoxOrient: "vertical",
          ...(isExpanded ? {} : { maxHeight: "none" }),
        }}
      >
        {description}
      </div>
      <button
        onClick={toggleExpanded}
        className="flex items-center justify-center w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  )
}

// Expandable HBI Insights Component
const ExpandableHBIInsights: React.FC<{ config: any[]; title: string }> = ({ config, title }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasMoreThanThree = config.length > 3

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const displayHeight = isExpanded ? "auto" : hasMoreThanThree ? "240px" : "auto"

  return (
    <div>
      <div
        className={`${isExpanded ? "overflow-visible" : "overflow-hidden"}`}
        style={{
          height: displayHeight,
          ...(isExpanded ? {} : { maxHeight: displayHeight }),
        }}
      >
        <EnhancedHBIInsights config={config} />
      </div>
      {hasMoreThanThree && (
        <button
          onClick={toggleExpanded}
          className="flex items-center justify-center w-full mt-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}

// Pre-Construction Content Component
const PreConstructionContent: React.FC<{
  projectId: string
  projectData: any
  userRole: string
  user: any
}> = ({ projectId, projectData, userRole, user }) => {
  const [rightPanelTab, setRightPanelTab] = useState("estimating")

  // Render right panel content
  const renderRightPanelContent = () => {
    switch (rightPanelTab) {
      case "estimating":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Estimating Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Cost Analysis
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Bid Leveling
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Estimate Builder
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Accuracy Tracking
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Estimate
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "pre-construction":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Pre-Construction Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Team Planning
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Development
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Document Management
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Risk Assessment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Project Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Updates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "bim-coordination":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  BIM Coordination Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Model Viewer
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Clash Detection
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Model Reports
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Model Updates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button size="sm" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Coordination
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Model
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

  return (
    <div className="flex-1 flex overflow-hidden min-h-[600px]">
      {/* Left Column - Main Content (80% width) */}
      <div className="w-4/5 overflow-y-auto overflow-x-hidden min-w-0 max-w-full flex-shrink">
        <div className="space-y-6 p-6">
          <div className="pb-2">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">Pre-Construction Management</h2>
              <p className="text-sm text-muted-foreground">
                Manage estimating, planning, and BIM coordination for {projectData?.name || "this project"}
              </p>
            </div>
          </div>

          {/* Main Pre-Construction Content */}
          <div className="grid gap-6">
            {/* Project Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${projectData?.contract_value ? (projectData.contract_value / 1000000).toFixed(1) : "0"}M
                    </div>
                    <p className="text-sm text-muted-foreground">Contract Value</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {projectData?.project_stage_name || "Planning"}
                    </div>
                    <p className="text-sm text-muted-foreground">Current Stage</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {projectData?.duration || "TBD"} Days
                    </div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Activities Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Key Pre-Construction Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: "Estimate Review & Validation", status: "completed", progress: 100 },
                    { task: "BIM Model Coordination", status: "in-progress", progress: 75 },
                    { task: "Subcontractor Selection", status: "in-progress", progress: 60 },
                    { task: "Permit Applications", status: "pending", progress: 30 },
                    { task: "Project Schedule Development", status: "pending", progress: 15 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === "completed"
                              ? "bg-green-500"
                              : item.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="font-medium">{item.task}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === "completed"
                                ? "bg-green-500"
                                : item.status === "in-progress"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{item.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Panel - Pre-Construction Tools (20% width) */}
      <div className="w-1/5 border-l border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50/20 dark:bg-gray-900/20">
        <div className="p-4 space-y-4">
          {/* Right Panel Header */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">Pre-Construction Tools</h3>
            <p className="text-sm text-muted-foreground">Access specialized tools and resources</p>
          </div>

          {/* Right Panel Tabs */}
          <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-9 text-xs">
              <TabsTrigger value="estimating" className="text-xs">
                Estimating
              </TabsTrigger>
              <TabsTrigger value="pre-construction" className="text-xs">
                Pre-Construction
              </TabsTrigger>
              <TabsTrigger value="bim-coordination" className="text-xs">
                BIM Coordination
              </TabsTrigger>
            </TabsList>

            <TabsContent value="estimating" className="mt-4">
              {renderRightPanelContent()}
            </TabsContent>

            <TabsContent value="pre-construction" className="mt-4">
              {renderRightPanelContent()}
            </TabsContent>

            <TabsContent value="bim-coordination" className="mt-4">
              {renderRightPanelContent()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Core tabs configuration matching the legacy page
const coreTabsConfig = [
  { id: "dashboard", label: "Dashboard", description: "Project overview and analytics", icon: BarChart3 },
  { id: "checklists", label: "Checklists", description: "Project startup and closeout checklists", icon: CheckSquare },
  {
    id: "productivity",
    label: "Productivity",
    description: "Threaded messaging and task management",
    icon: MessageSquare,
  },
  {
    id: "staffing",
    label: "Staffing",
    description: "Resource planning and scheduling",
    icon: Calendar,
  },
  {
    id: "responsibility-matrix",
    label: "Responsibility Matrix",
    description: "Role assignments and accountability",
    icon: Users,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Comprehensive reporting dashboard with approval workflows",
    icon: FileText,
  },
]

// Staffing sub-tabs configuration
const staffingSubTabsConfig = [
  { id: "dashboard", label: "Dashboard", description: "Team overview and metrics", icon: BarChart3 },
  { id: "timeline", label: "Timeline", description: "Staffing timeline and scheduling", icon: Calendar },
  { id: "spcr", label: "SPCR", description: "Staffing plan change requests", icon: FileText },
]

const ProjectControlCenterContent: React.FC<ProjectControlCenterContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  activeTab = "core",
  onTabChange,
}) => {
  const [navigation, setNavigation] = useState<NavigationState>({
    category: null,
    tool: null,
    subTool: null,
    coreTab: "dashboard", // Default to dashboard tab
    staffingSubTab: "dashboard", // Default to dashboard sub-tab
    reportsSubTab: "dashboard", // Default to dashboard sub-tab
  })
  const [mounted, setMounted] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Project metrics (calculated or from data)
  const projectMetrics = {
    totalBudget: projectData?.contract_value || 75000000,
    spentToDate: projectData?.contract_value ? projectData.contract_value * 0.68 : 51000000,
    scheduleProgress: 72,
    budgetProgress: 68,
    activeTeamMembers: 24,
    completedMilestones: 8,
    totalMilestones: 12,
    activeRFIs: 5,
    changeOrders: 3,
    riskItems: 2,
  }

  // Handle core tab changes
  const handleCoreTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      coreTab: tabId,
      staffingSubTab: "dashboard", // Reset staffing sub-tab when changing core tab
      reportsSubTab: "dashboard", // Reset reports sub-tab when changing core tab
    }))
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // Handle staffing sub-tab changes
  const handleStaffingSubTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      staffingSubTab: tabId,
    }))
  }

  // Handle reports sub-tab changes
  const handleReportsSubTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      reportsSubTab: tabId,
    }))
  }

  // Get HBI Insights title based on active tab
  const getHBIInsightsTitle = () => {
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      return "HBI Financial Hub Insights"
    }
    return "HBI Core Tools Insights"
  }

  // Get sidebar content for main app injection
  const getSidebarContent = () => {
    return (
      <div className="space-y-4">
        {/* Project Overview Panel - Always visible */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {/* Project Description */}
            <div className="pb-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2">Description</p>
              <ExpandableDescription description={projectData?.description || "No description available"} />
            </div>

            {/* Project Metrics */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract Value</span>
                <span className="font-medium">${projectMetrics.totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Spent to Date</span>
                <span className="font-medium">${projectMetrics.spentToDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schedule Progress</span>
                <span className="font-medium text-blue-600">{projectMetrics.scheduleProgress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Budget Progress</span>
                <span className="font-medium text-green-600">{projectMetrics.budgetProgress}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Team Members</span>
                <span className="font-medium">{projectMetrics.activeTeamMembers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HBI Insights Panel - Moved to second position */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{getHBIInsightsTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ExpandableHBIInsights config={getHBIInsights()} title={getHBIInsightsTitle()} />
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {getQuickActions().map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm h-8"
                onClick={action.onClick}
              >
                <action.icon className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Key Metrics Panel */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {getKeyMetrics().map((metric, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get quick actions based on current core tab
  const getQuickActions = () => {
    if (navigation.coreTab === "reports") {
      return [
        { label: "Create Report", icon: Plus, onClick: () => {} },
        { label: "View Reports", icon: Eye, onClick: () => {} },
        { label: "Report Analytics", icon: BarChart3, onClick: () => {} },
        { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Checklist", icon: CheckSquare, onClick: () => {} },
        { label: "Closeout Checklist", icon: CheckCircle, onClick: () => {} },
        { label: "Export Checklist", icon: Download, onClick: () => {} },
        { label: "Update Progress", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "New Message", icon: MessageSquare, onClick: () => {} },
        { label: "Create Task", icon: Plus, onClick: () => {} },
        { label: "View Tasks", icon: CheckSquare, onClick: () => {} },
        { label: "Team Updates", icon: Users, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "View Timeline", icon: Calendar, onClick: () => {} },
        { label: "Create SPCR", icon: FileText, onClick: () => {} },
        { label: "Assign Staff", icon: Users, onClick: () => {} },
        { label: "Export Schedule", icon: Download, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "responsibility-matrix") {
      return [
        { label: "Update Matrix", icon: Users, onClick: () => {} },
        { label: "Assign Roles", icon: Shield, onClick: () => {} },
        { label: "Export Matrix", icon: Download, onClick: () => {} },
        { label: "View History", icon: History, onClick: () => {} },
      ]
    }

    // Default dashboard actions
    return [
      { label: "Schedule Review", icon: Calendar, onClick: () => {} },
      { label: "Budget Analysis", icon: DollarSign, onClick: () => {} },
      { label: "Team Management", icon: Users, onClick: () => {} },
      { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
    ]
  }

  // Get key metrics based on current core tab
  const getKeyMetrics = () => {
    if (navigation.coreTab === "reports") {
      return [
        { label: "Total Reports", value: "0", color: "blue" },
        { label: "Pending Approval", value: "0", color: "yellow" },
        { label: "Approved", value: "0", color: "green" },
        { label: "Approval Rate", value: "0%", color: "emerald" },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Items", value: "65", color: "blue" },
        { label: "StartUp Complete", value: "78%", color: "green" },
        { label: "Closeout Items", value: "35", color: "purple" },
        { label: "Closeout Complete", value: "12%", color: "orange" },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "Active Tasks", value: "12", color: "blue" },
        { label: "Completed Today", value: "8", color: "green" },
        { label: "Unread Messages", value: "4", color: "orange" },
        { label: "Team Activity", value: "92%", color: "purple" },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "Active Staff", value: "12", color: "blue" },
        { label: "Assignments", value: "18", color: "green" },
        { label: "Positions", value: "8", color: "purple" },
        { label: "Avg Duration", value: "45d", color: "orange" },
      ]
    } else if (navigation.coreTab === "responsibility-matrix") {
      return [
        { label: "Total Roles", value: "15", color: "blue" },
        { label: "Assigned", value: "13", color: "green" },
        { label: "Unassigned", value: "2", color: "orange" },
        { label: "Coverage", value: "87%", color: "purple" },
      ]
    }

    // Default project metrics
    return [
      {
        label: "Milestones",
        value: `${projectMetrics.completedMilestones}/${projectMetrics.totalMilestones}`,
        color: "green",
      },
      { label: "Active RFIs", value: projectMetrics.activeRFIs.toString(), color: "blue" },
      { label: "Change Orders", value: projectMetrics.changeOrders.toString(), color: "orange" },
      { label: "Risk Items", value: projectMetrics.riskItems.toString(), color: "red" },
    ]
  }

  const getHBIInsights = () => {
    return [
      {
        id: "core-1",
        type: "info",
        severity: "low",
        title: "Project Status Update",
        text: "Project is progressing well with all major milestones on track.",
        action: "View details",
        timestamp: "1 day ago",
      },
      {
        id: "core-2",
        type: "opportunity",
        severity: "medium",
        title: "Process Optimization",
        text: "Current workflow efficiency is 15% above baseline with room for further improvement.",
        action: "Review optimization recommendations",
        timestamp: "2 hours ago",
      },
    ]
  }

  // Render core tab content
  const renderCoreTabContent = () => {
    switch (navigation.coreTab) {
      case "dashboard":
        return (
          <div className="space-y-6 w-full max-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Summary Card */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Project Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Project Type</p>
                        <p className="font-medium text-sm text-foreground">
                          {projectData?.project_type_name || "Commercial"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                        <p className="font-medium text-sm text-foreground">{projectData?.duration || "365"} days</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Contract Value</p>
                        <p className="font-medium text-sm text-foreground">
                          ${projectData?.contract_value?.toLocaleString() || "57,235,491"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Stage</p>
                        <p className="font-medium text-sm text-foreground">
                          {projectData?.project_stage_name || "Construction"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Metrics Card */}
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">Project Metrics</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Schedule Progress</p>
                      <p className="font-medium text-sm text-foreground">{projectMetrics.scheduleProgress}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Budget Progress</p>
                      <p className="font-medium text-sm text-foreground">{projectMetrics.budgetProgress}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Team</p>
                      <p className="font-medium text-sm text-foreground">{projectMetrics.activeTeamMembers} members</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Milestones</p>
                      <p className="font-medium text-sm text-foreground">
                        {projectMetrics.completedMilestones}/{projectMetrics.totalMilestones}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "checklists":
        return (
          <div className="space-y-4 w-full max-w-full">
            <Tabs defaultValue="startup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="startup">StartUp Checklist</TabsTrigger>
                <TabsTrigger value="closeout">Closeout Checklist</TabsTrigger>
              </TabsList>
              <TabsContent value="startup" className="w-full max-w-full overflow-hidden">
                <StartUpChecklist projectId={projectId} projectName={projectName} />
              </TabsContent>
              <TabsContent value="closeout" className="w-full max-w-full overflow-hidden">
                <CloseoutChecklist projectId={projectId} />
              </TabsContent>
            </Tabs>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-4 w-full max-w-full">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="project-reports">Project Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" className="w-full max-w-full overflow-hidden">
                <ReportsDashboard
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  user={user}
                  onTabChange={handleReportsSubTabChange}
                />
              </TabsContent>
              <TabsContent value="project-reports" className="w-full max-w-full overflow-hidden">
                <ProjectReports
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  user={user}
                  activeTab={navigation.reportsSubTab || "overview"}
                  onTabChange={handleReportsSubTabChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        )

      case "responsibility-matrix":
        return (
          <div className="space-y-4 w-full max-w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Responsibility Matrix</h3>
                <p className="text-xs text-muted-foreground">
                  Manage task assignments and accountability across project teams
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <ResponsibilityMatrixCore projectId={projectId} userRole={userRole} className="border-0 shadow-none" />
              </CardContent>
            </Card>
          </div>
        )

      case "productivity":
        return (
          <div className="w-full max-w-full">
            <ProjectProductivityContent
              projectId={projectId}
              projectData={projectData}
              userRole={userRole}
              user={user}
              className="w-full"
            />
          </div>
        )

      case "staffing":
        return (
          <div className="space-y-4 w-full max-w-full">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="spcr">SPCR</TabsTrigger>
              </TabsList>
              <TabsContent value="timeline" className="w-full max-w-full overflow-hidden">
                <ProjectStaffingGantt
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  isReadOnly={userRole === "viewer"}
                  className="w-full"
                  height="600px"
                />
              </TabsContent>
              <TabsContent value="dashboard" className="w-full max-w-full overflow-hidden">
                <StaffingDashboard
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  className="w-full"
                  isCompact={false}
                  isFullScreen={isFocusMode}
                />
              </TabsContent>
              <TabsContent value="spcr" className="w-full max-w-full overflow-hidden">
                <ProjectSPCRManager
                  projectId={parseInt(projectId)}
                  projectData={projectData}
                  userRole={userRole}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </div>
        )

      case "pre-construction":
        return (
          <PreConstructionContent projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
        )

      case "field-management":
        return getFieldManagementRightPanelContent(projectData, userRole, projectId, navigation.subTool || "scheduler")

      default:
        return null
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Handle focus mode toggle
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Render content based on activeTab prop (controlled by page header)
  const renderContent = () => {
    // Handle different module tabs from main app navigation
    switch (activeTab) {
      case "financial-management":
      case "financial-hub":
        return (
          <FinancialHubProjectContent
            projectId={projectId}
            projectData={projectData}
            userRole={userRole}
            user={user}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )

      case "pre-construction":
        return (
          <PreConstructionContent projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
        )

      case "field-management":
        return getFieldManagementRightPanelContent(projectData, userRole, projectId, navigation.subTool || "scheduler")

      case "core":
      case undefined:
      case null:
      default:
        // Render Core Project Tools content with internal navigation
        return (
          <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
            {/* Module Title with Focus Button */}
            <div className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">Core Project Tools</h2>
                  <p className="text-sm text-muted-foreground">Essential project management tools and resources</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleFocusToggle} className="h-8 px-3 text-xs">
                  {isFocusMode ? (
                    <>
                      <Minimize2 className="h-3 w-3 mr-1" />
                      Exit Focus
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3 w-3 mr-1" />
                      Focus
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Responsive Core Tab Navigation */}
            <div className="border-b border-border flex-shrink-0">
              {/* Desktop/Tablet Tab Navigation - Hidden on mobile */}
              <div className="hidden sm:block">
                <div className="flex space-x-6 overflow-x-auto">
                  {coreTabsConfig.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleCoreTabChange(tab.id)}
                      className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        navigation.coreTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Dropdown Navigation - Only visible on mobile */}
              <div className="sm:hidden py-3">
                <Select value={navigation.coreTab || "dashboard"} onValueChange={(value) => handleCoreTabChange(value)}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Core Tools</span>
                      <Badge variant="secondary" className="ml-auto">
                        {coreTabsConfig.find((tab) => tab.id === navigation.coreTab)?.label || "Dashboard"}
                      </Badge>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {coreTabsConfig.map((tab) => (
                      <SelectItem key={tab.id} value={tab.id}>
                        <div className="flex items-center space-x-2">
                          <tab.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{tab.label}</div>
                            <div className="text-xs text-muted-foreground">{tab.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0 max-w-full min-h-0">
              <div className={cn("w-full min-w-0 max-w-full", isFocusMode ? "min-h-full" : "h-full overflow-hidden")}>
                {renderCoreTabContent()}
              </div>
            </div>
          </div>
        )
    }
  }

  // Main content without module tab selector (controlled by page header)
  const mainContent = renderContent()

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
        </div>
      </div>
    )
  }

  // Return the main content with proper JSX structure
  return mainContent
}

// Export the left sidebar content as a separate function
export const getProjectSidebarContent = (
  projectData: any,
  navigation: NavigationState,
  projectMetrics: any,
  activeTab?: string
) => {
  const getQuickActions = () => {
    if (activeTab === "pre-construction") {
      return [
        { label: "Create Estimate", icon: Calculator, onClick: () => {} },
        { label: "BIM Coordination", icon: Brain, onClick: () => {} },
        { label: "Schedule Planning", icon: Calendar, onClick: () => {} },
        { label: "Team Setup", icon: Users, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "reports") {
      return [
        { label: "Create Report", icon: Plus, onClick: () => {} },
        { label: "View Reports", icon: Eye, onClick: () => {} },
        { label: "Report Analytics", icon: BarChart3, onClick: () => {} },
        { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Checklist", icon: CheckSquare, onClick: () => {} },
        { label: "Closeout Checklist", icon: CheckCircle, onClick: () => {} },
        { label: "Export Checklist", icon: Download, onClick: () => {} },
        { label: "Update Progress", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "View Timeline", icon: Calendar, onClick: () => {} },
        { label: "Create SPCR", icon: FileText, onClick: () => {} },
        { label: "Assign Staff", icon: Users, onClick: () => {} },
        { label: "Export Schedule", icon: Download, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "New Message", icon: MessageSquare, onClick: () => {} },
        { label: "Create Task", icon: CheckSquare, onClick: () => {} },
        { label: "Team Updates", icon: Users, onClick: () => {} },
        { label: "Export Activity", icon: Download, onClick: () => {} },
      ]
    }

    // Default actions
    return [
      { label: "Schedule Review", icon: Calendar, onClick: () => {} },
      { label: "Budget Analysis", icon: DollarSign, onClick: () => {} },
      { label: "Team Management", icon: Users, onClick: () => {} },
      { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
    ]
  }

  const getKeyMetrics = () => {
    if (activeTab === "pre-construction") {
      return [
        { label: "Estimate Accuracy", value: "92%", color: "green" },
        { label: "BIM Progress", value: "75%", color: "blue" },
        { label: "Permits Submitted", value: "8/12", color: "orange" },
        { label: "Team Readiness", value: "85%", color: "purple" },
      ]
    } else if (navigation.coreTab === "reports") {
      return [
        { label: "Total Reports", value: "0", color: "blue" },
        { label: "Pending Approval", value: "0", color: "yellow" },
        { label: "Approved", value: "0", color: "green" },
        { label: "Approval Rate", value: "0%", color: "emerald" },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Items", value: "65", color: "blue" },
        { label: "StartUp Complete", value: "78%", color: "green" },
        { label: "Closeout Items", value: "35", color: "purple" },
        { label: "Closeout Complete", value: "12%", color: "orange" },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "Active Staff", value: "12", color: "blue" },
        { label: "Assignments", value: "18", color: "green" },
        { label: "Positions", value: "8", color: "purple" },
        { label: "Avg Duration", value: "45d", color: "orange" },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "Active Threads", value: "5", color: "blue" },
        { label: "Tasks in Progress", value: "8", color: "orange" },
        { label: "Completed Tasks", value: "12", color: "green" },
        { label: "Team Messages", value: "24", color: "purple" },
      ]
    }

    // Add null safety for projectMetrics
    if (!projectMetrics) {
      return [
        { label: "Milestones", value: "0/0", color: "green" },
        { label: "Active RFIs", value: "0", color: "blue" },
        { label: "Change Orders", value: "0", color: "orange" },
        { label: "Risk Items", value: "0", color: "red" },
      ]
    }

    return [
      {
        label: "Milestones",
        value: `${projectMetrics.completedMilestones || 0}/${projectMetrics.totalMilestones || 0}`,
        color: "green",
      },
      { label: "Active RFIs", value: (projectMetrics.activeRFIs || 0).toString(), color: "blue" },
      { label: "Change Orders", value: (projectMetrics.changeOrders || 0).toString(), color: "orange" },
      { label: "Risk Items", value: (projectMetrics.riskItems || 0).toString(), color: "red" },
    ]
  }

  const getHBIInsights = () => {
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      // Get current financial sub-tab from navigation
      const currentFinancialTab = navigation.tool === "financial-management" ? navigation.subTool : "overview"

      // Budget Analysis insights
      if (currentFinancialTab === "budget-analysis") {
        return [
          {
            id: "budget-1",
            type: "warning",
            severity: "medium",
            title: "Budget Variance Alert",
            text: "Material costs are tracking 3.2% above budget. Steel and concrete prices have increased significantly.",
            action: "Review variance",
            timestamp: "2 hours ago",
          },
          {
            id: "budget-2",
            type: "success",
            severity: "low",
            title: "Labor Cost Efficiency",
            text: "Labor costs are running 5% under budget due to improved productivity and scheduling optimization.",
            action: "View details",
            timestamp: "4 hours ago",
          },
          {
            id: "budget-3",
            type: "alert",
            severity: "high",
            title: "Change Order Impact",
            text: "Pending change orders totaling $245K may impact current budget projections by Q3.",
            action: "Review COs",
            timestamp: "6 hours ago",
          },
          {
            id: "budget-4",
            type: "info",
            severity: "low",
            title: "Budget Milestone Achieved",
            text: "Project reached 68% budget completion, aligning with 72% schedule progress.",
            action: "View milestone",
            timestamp: "1 day ago",
          },
          {
            id: "budget-5",
            type: "warning",
            severity: "medium",
            title: "Contingency Usage",
            text: "Contingency fund is at 45% utilization. Consider reviewing remaining scope for potential risks.",
            action: "Analyze contingency",
            timestamp: "2 days ago",
          },
          {
            id: "budget-6",
            type: "info",
            severity: "low",
            title: "Cost Forecast Update",
            text: "Updated cost forecasting models show project completion within 2% of original budget.",
            action: "View forecast",
            timestamp: "3 days ago",
          },
        ]
      }

      // JCHR insights
      if (currentFinancialTab === "jchr") {
        return [
          {
            id: "jchr-1",
            type: "warning",
            severity: "medium",
            title: "Cost Variance Alert",
            text: "Division 03 showing highest variance. HBI recommends immediate cost review and mitigation planning.",
            action: "Review division",
            timestamp: "1 hour ago",
          },
          {
            id: "jchr-2",
            type: "info",
            severity: "low",
            title: "Spend Velocity",
            text: "Current burn rate at 78.1% of budget. Projected completion tracking on schedule.",
            action: "View metrics",
            timestamp: "3 hours ago",
          },
          {
            id: "jchr-3",
            type: "success",
            severity: "low",
            title: "Cost Performance Tracking",
            text: "HBI identified minor cost variance across divisions with 78.1% budget utilization.",
            action: "View performance",
            timestamp: "6 hours ago",
          },
          {
            id: "jchr-4",
            type: "info",
            severity: "low",
            title: "Profitability Analysis",
            text: "Current profit margin at 6.8% with financial health score of 88%. Strong profitability outlook.",
            action: "View analysis",
            timestamp: "1 day ago",
          },
        ]
      }

      // AR Aging insights
      if (currentFinancialTab === "ar-aging") {
        return [
          {
            id: "ar-1",
            type: "warning",
            severity: "medium",
            title: "Collection Priority Alert",
            text: "$850K in 60+ day aging. HBI recommends immediate collection action and client communication strategy.",
            action: "Review collections",
            timestamp: "2 hours ago",
          },
          {
            id: "ar-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Impact",
            text: "Total AR at $8.5M with 75.3% current. Healthy aging profile maintained.",
            action: "View details",
            timestamp: "4 hours ago",
          },
          {
            id: "ar-3",
            type: "success",
            severity: "low",
            title: "Retainage Analysis",
            text: "$2.1M in retainage held. Retainage levels within normal range for improved cash flow.",
            action: "View retainage",
            timestamp: "1 day ago",
          },
          {
            id: "ar-4",
            type: "info",
            severity: "medium",
            title: "Collection Efficiency",
            text: "Average collection period of 42 days shows strong receivables management performance.",
            action: "View efficiency",
            timestamp: "2 days ago",
          },
        ]
      }

      // Cash Flow insights
      if (currentFinancialTab === "cash-flow") {
        return [
          {
            id: "cash-1",
            type: "warning",
            severity: "medium",
            title: "Liquidity Alert",
            text: "Current burn rate of $1.2M/month with 65 days cash on hand. Monitor closely for working capital optimization.",
            action: "Review liquidity",
            timestamp: "1 hour ago",
          },
          {
            id: "cash-2",
            type: "info",
            severity: "low",
            title: "Forecast Performance",
            text: "94.1% accuracy with improving trend. Excellent predictive reliability maintained.",
            action: "View forecast",
            timestamp: "3 hours ago",
          },
          {
            id: "cash-3",
            type: "success",
            severity: "low",
            title: "Liquidity Position",
            text: "Strong liquidity ratio of 3.2 indicates healthy cash position. Excellent financial stability.",
            action: "View position",
            timestamp: "6 hours ago",
          },
          {
            id: "cash-4",
            type: "info",
            severity: "medium",
            title: "Risk Assessment",
            text: "2 high-impact risks identified. Payment delays showing 15% probability impact.",
            action: "View risks",
            timestamp: "1 day ago",
          },
        ]
      }

      // Forecasting insights
      if (currentFinancialTab === "forecasting") {
        return [
          {
            id: "forecast-1",
            type: "info",
            severity: "low",
            title: "Forecast Accuracy",
            text: "HBI forecasting model achieving 94.2% accuracy with strong predictive confidence intervals.",
            action: "View accuracy",
            timestamp: "2 hours ago",
          },
          {
            id: "forecast-2",
            type: "success",
            severity: "low",
            title: "Revenue Projection",
            text: "Project revenue forecast tracking within 2% of original projections with positive momentum.",
            action: "View projections",
            timestamp: "4 hours ago",
          },
          {
            id: "forecast-3",
            type: "warning",
            severity: "medium",
            title: "Cost Trend Analysis",
            text: "Material cost escalation trends suggest 3-5% increase in Q3. Consider procurement acceleration.",
            action: "Review trends",
            timestamp: "1 day ago",
          },
          {
            id: "forecast-4",
            type: "info",
            severity: "medium",
            title: "Schedule Impact",
            text: "Weather delays may impact Q2 forecasts by 8-12 days. Mitigation strategies available.",
            action: "View mitigation",
            timestamp: "2 days ago",
          },
        ]
      }

      // Change Management insights
      if (currentFinancialTab === "change-management") {
        return [
          {
            id: "change-1",
            type: "warning",
            severity: "medium",
            title: "Change Order Volume",
            text: "Current change order rate at 8.5% of contract value. Monitor scope creep trends carefully.",
            action: "Review volume",
            timestamp: "1 hour ago",
          },
          {
            id: "change-2",
            type: "alert",
            severity: "high",
            title: "Approval Bottleneck",
            text: "3 change orders pending approval for 10+ days. Risk of schedule impact if not resolved.",
            action: "Expedite approvals",
            timestamp: "2 hours ago",
          },
          {
            id: "change-3",
            type: "info",
            severity: "low",
            title: "Cost Impact Analysis",
            text: "Average change order processing time reduced to 5.2 days through workflow optimization.",
            action: "View optimization",
            timestamp: "1 day ago",
          },
          {
            id: "change-4",
            type: "success",
            severity: "low",
            title: "Profit Margin Protection",
            text: "98% of change orders maintained target profit margins through effective pricing strategies.",
            action: "View margins",
            timestamp: "2 days ago",
          },
        ]
      }

      // Pay Authorization insights
      if (currentFinancialTab === "pay-authorization") {
        return [
          {
            id: "pay-auth-1",
            type: "warning",
            severity: "medium",
            title: "Approval Workflow Alert",
            text: "3 payment authorizations pending with potential 2.5-day processing delay if not addressed.",
            action: "Review workflow",
            timestamp: "1 hour ago",
          },
          {
            id: "pay-auth-2",
            type: "info",
            severity: "low",
            title: "Processing Efficiency",
            text: "HBI identified 35% faster approval cycles through automated validation workflows.",
            action: "View efficiency",
            timestamp: "3 hours ago",
          },
          {
            id: "pay-auth-3",
            type: "success",
            severity: "low",
            title: "Compliance Monitoring",
            text: "97% accuracy in detecting billing discrepancies and ensuring standard compliance.",
            action: "View compliance",
            timestamp: "6 hours ago",
          },
          {
            id: "pay-auth-4",
            type: "info",
            severity: "medium",
            title: "Cash Flow Optimization",
            text: "Streamlined authorization process improving cash flow velocity by 18%.",
            action: "View optimization",
            timestamp: "1 day ago",
          },
        ]
      }

      // Pay Applications insights
      if (currentFinancialTab === "pay-application") {
        return [
          {
            id: "pay-app-1",
            type: "warning",
            severity: "medium",
            title: "Approval Workflow Alert",
            text: "3 applications pending approval with potential 2.5-day processing delay if not addressed.",
            action: "Review applications",
            timestamp: "1 hour ago",
          },
          {
            id: "pay-app-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Impact",
            text: "$2.28M in total applications can accelerate project cash flow by 18% if processed efficiently.",
            action: "View impact",
            timestamp: "2 hours ago",
          },
          {
            id: "pay-app-3",
            type: "success",
            severity: "low",
            title: "Retention Optimization",
            text: "$285K in retention showing 92% compliance rate with potential early release opportunities.",
            action: "View retention",
            timestamp: "4 hours ago",
          },
          {
            id: "pay-app-4",
            type: "info",
            severity: "medium",
            title: "Processing Efficiency",
            text: "HBI identified 35% faster approval cycles through automated G702/G703 validation.",
            action: "View efficiency",
            timestamp: "1 day ago",
          },
        ]
      }

      // Retention insights
      if (currentFinancialTab === "retention") {
        return [
          {
            id: "retention-1",
            type: "warning",
            severity: "medium",
            title: "Release Timing Alert",
            text: "$44.5K in retention pending release within 90 days. HBI recommends proactive documentation review.",
            action: "Review timing",
            timestamp: "2 hours ago",
          },
          {
            id: "retention-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Optimization",
            text: "Current retention balance represents 15.2% of total retention. Optimal release timing could improve cash flow by 12%.",
            action: "View optimization",
            timestamp: "4 hours ago",
          },
          {
            id: "retention-3",
            type: "success",
            severity: "low",
            title: "Risk Assessment",
            text: "Low retention risk across all active contracts. Average contractor performance rating of 94.2%.",
            action: "View assessment",
            timestamp: "1 day ago",
          },
          {
            id: "retention-4",
            type: "info",
            severity: "medium",
            title: "Release Optimization",
            text: "Predictive analysis indicates optimal release timing could accelerate cash flow by $86K over next quarter.",
            action: "View analysis",
            timestamp: "2 days ago",
          },
        ]
      }

      // Default Financial Overview insights
      return [
        {
          id: "financial-1",
          type: "info",
          severity: "low",
          title: "Financial Health Score",
          text: "Project financial health score of 88% indicates strong performance across all metrics.",
          action: "View details",
          timestamp: "1 hour ago",
        },
        {
          id: "financial-2",
          type: "success",
          severity: "low",
          title: "Budget Performance",
          text: "Project tracking within 2% of original budget with healthy profit margins maintained.",
          action: "View budget",
          timestamp: "3 hours ago",
        },
        {
          id: "financial-3",
          type: "warning",
          severity: "medium",
          title: "Cash Flow Monitoring",
          text: "Net cash flow at $8.2M with 65 days cash on hand. Monitor for working capital optimization.",
          action: "Review cash flow",
          timestamp: "1 day ago",
        },
        {
          id: "financial-4",
          type: "info",
          severity: "low",
          title: "Cost Control Insights",
          text: "Material costs 8.3% over budget. Consider renegotiating supplier contracts or sourcing alternatives.",
          action: "Review costs",
          timestamp: "2 days ago",
        },
      ]
    }

    if (activeTab === "pre-construction") {
      return [
        {
          id: "precon-1",
          type: "success",
          severity: "low",
          title: "Estimate Validation Complete",
          text: "Final estimate has been validated and approved by all stakeholders.",
          action: "View estimate",
          timestamp: "1 day ago",
        },
        {
          id: "precon-2",
          type: "warning",
          severity: "medium",
          title: "BIM Coordination Required",
          text: "MEP trades require coordination meeting before finalizing installation sequence.",
          action: "Schedule meeting",
          timestamp: "2 days ago",
        },
        {
          id: "precon-3",
          type: "info",
          severity: "low",
          title: "Permit Status Update",
          text: "8 of 12 permits have been submitted and are under review by local authorities.",
          action: "Check status",
          timestamp: "3 days ago",
        },
        {
          id: "precon-4",
          type: "alert",
          severity: "high",
          title: "Subcontractor Selection",
          text: "Electrical subcontractor selection deadline is approaching. 3 bids received.",
          action: "Review bids",
          timestamp: "4 days ago",
        },
        {
          id: "precon-5",
          type: "info",
          severity: "medium",
          title: "Team Mobilization",
          text: "Site team members identified and ready for project mobilization.",
          action: "View team",
          timestamp: "5 days ago",
        },
      ]
    }

    if (navigation.coreTab === "productivity") {
      return [
        {
          id: "prod-1",
          type: "success",
          severity: "low",
          title: "Team Collaboration Active",
          text: "Team communication frequency has increased 25% this week, indicating good engagement.",
          action: "View activity",
          timestamp: "1 hour ago",
        },
        {
          id: "prod-2",
          type: "warning",
          severity: "medium",
          title: "Task Completion Trend",
          text: "Task completion rate has dropped 15% from last week. Consider workload redistribution.",
          action: "Review tasks",
          timestamp: "4 hours ago",
        },
        {
          id: "prod-3",
          type: "info",
          severity: "low",
          title: "Communication Efficiency",
          text: "Average response time to messages has improved to 2.3 hours.",
          action: "View metrics",
          timestamp: "1 day ago",
        },
        {
          id: "prod-4",
          type: "alert",
          severity: "high",
          title: "Overdue Tasks Alert",
          text: "3 tasks are approaching their due dates. Immediate attention required.",
          action: "Review overdue",
          timestamp: "2 days ago",
        },
      ]
    }

    return [
      {
        id: "core-1",
        type: "info",
        severity: "low",
        title: "Project Status Update",
        text: "Project is progressing well with all major milestones on track.",
        action: "View details",
        timestamp: "1 day ago",
      },
      {
        id: "core-2",
        type: "warning",
        severity: "medium",
        title: "Budget Variance Alert",
        text: "Material costs are trending 3% above budget. Consider cost optimization measures.",
        action: "Review budget",
        timestamp: "2 days ago",
      },
      {
        id: "core-3",
        type: "success",
        severity: "low",
        title: "Safety Milestone",
        text: "Project achieved 90 consecutive days without safety incidents.",
        action: "View safety report",
        timestamp: "3 days ago",
      },
      {
        id: "core-4",
        type: "info",
        severity: "medium",
        title: "Schedule Optimization",
        text: "Weather conditions favorable for accelerated concrete pours this week.",
        action: "Update schedule",
        timestamp: "4 days ago",
      },
      {
        id: "core-5",
        type: "alert",
        severity: "high",
        title: "Permit Expiration",
        text: "Building permit expires in 30 days. Renewal required to continue work.",
        action: "Renew permit",
        timestamp: "5 days ago",
      },
    ]
  }

  // Get HBI Insights title based on active tab
  const getHBIInsightsTitle = () => {
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      return "HBI Financial Hub Insights"
    } else if (activeTab === "pre-construction") {
      return "HBI Pre-Construction Insights"
    } else if (navigation.coreTab === "productivity") {
      return "HBI Productivity Insights"
    }
    return "HBI Core Tools Insights"
  }

  return (
    <div className="space-y-4">
      {/* Project Overview Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="pb-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-2">Description</p>
            <ExpandableDescription description={projectData?.description || "No description available"} />
          </div>
          <div className="space-y-2">
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
              <span className="font-medium text-blue-600">{projectMetrics?.scheduleProgress || 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget Progress</span>
              <span className="font-medium text-green-600">{projectMetrics?.budgetProgress || 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Team Members</span>
              <span className="font-medium">{projectMetrics?.activeTeamMembers || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HBI Insights Panel - Moved to second position */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{getHBIInsightsTitle()}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ExpandableHBIInsights config={getHBIInsights()} title={getHBIInsightsTitle()} />
        </CardContent>
      </Card>

      {/* Quick Actions Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {getQuickActions().map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Key Metrics Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {getKeyMetrics().map((metric, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectControlCenterContent

// Export the Field Management content for right panel injection
export const getFieldManagementRightPanelContent = (
  projectData: any,
  userRole: string,
  projectId: string,
  selectedSubTool: string = "overview"
) => {
  return (
    <div className="h-full w-full overflow-hidden">
      <FieldManagementContent
        selectedSubTool={selectedSubTool}
        projectData={projectData}
        userRole={userRole}
        projectId={projectId}
        className="w-full h-full"
      />
    </div>
  )
}
