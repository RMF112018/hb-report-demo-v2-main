/**
 * @fileoverview Project Tabs Shell Component
 * @module ProjectTabsShell
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Extracted from ProjectControlCenterContent.tsx to manage top-level tab state
 * and rendering for the Core Project Tools module.
 *
 * Responsibilities:
 * - Manage activeTab state (dashboard, checklists, responsibility, productivity, staffing, reports)
 * - Accept project-level props: projectId, user, userRole, projectData
 * - Render tab content conditionally based on activeTab
 * - Provide responsive tab navigation (desktop/mobile)
 * - Focus mode toggle functionality
 */

"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  CheckSquare,
  MessageSquare,
  Calendar,
  Users,
  FileText,
  Settings,
  Plus,
  Download,
  Minimize2,
  Maximize2,
} from "lucide-react"

// Import content components
import ChecklistModule from "@/components/project/checklists/ChecklistModule"
import { ReportsDashboard } from "@/components/reports/ReportsDashboard"
import { ProjectReports } from "@/components/reports/ProjectReports"
import ResponsibilityMatrixModule from "@/components/project/responsibility-matrix/ResponsibilityMatrixModule"
import ProductivityModule from "@/components/project/productivity/ProductivityModule"
import { StaffingDashboard } from "@/components/staffing/StaffingDashboard"
import { ProjectStaffingGantt } from "@/components/staffing/ProjectStaffingGantt"
import { ProjectSPCRManager } from "@/components/staffing/ProjectSPCRManager"
import { ConstructionDashboard } from "@/components/project/core/ConstructionDashboard"

// Tab configuration
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

// Interface for the component props
interface ProjectTabsShellProps {
  projectId: string
  user: any
  userRole: string
  projectData: any
  initialTab?: string
  onTabChange?: (tabId: string) => void
}

const ProjectTabsShell: React.FC<ProjectTabsShellProps> = ({
  projectId,
  user,
  userRole,
  projectData,
  initialTab = "dashboard",
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [staffingSubTab, setStaffingSubTab] = useState("dashboard")
  const [reportsSubTab, setReportsSubTab] = useState("dashboard")
  const [isFocusMode, setIsFocusMode] = useState(false)

  // Extract project name from project data - memoized
  const projectName = useMemo(() => projectData?.name || `Project ${projectId}`, [projectData?.name, projectId])

  // Project metrics (calculated or from data) - memoized
  const projectMetrics = useMemo(
    () => ({
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
    }),
    [projectData?.contract_value]
  )

  // Handle tab changes - memoized callback
  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId)
      setStaffingSubTab("dashboard") // Reset sub-tabs when changing main tab
      setReportsSubTab("dashboard")
      if (onTabChange) {
        onTabChange(tabId)
      }
    },
    [onTabChange]
  )

  // Handle staffing sub-tab changes - memoized callback
  const handleStaffingSubTabChange = useCallback((tabId: string) => {
    setStaffingSubTab(tabId)
  }, [])

  // Handle reports sub-tab changes - memoized callback
  const handleReportsSubTabChange = useCallback((tabId: string) => {
    setReportsSubTab(tabId)
  }, [])

  // Handle focus mode toggle - memoized callback
  const handleFocusToggle = useCallback(() => {
    setIsFocusMode((prev) => !prev)
  }, [])

  // Memoized dashboard content to prevent re-renders
  const dashboardContent = useMemo(() => {
    const isConstructionStage = projectData?.project_stage_name === "Construction"

    if (isConstructionStage) {
      return <ConstructionDashboard projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
    }

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
  }, [projectData, projectMetrics, projectId, userRole, user])

  // Memoized checklist content to prevent re-renders
  const checklistContent = useMemo(
    () => (
      <ChecklistModule
        projectId={projectId}
        projectData={projectData}
        user={user}
        userRole={userRole}
        className="w-full"
      />
    ),
    [projectId, projectData, user, userRole]
  )

  // Memoized responsibility matrix content to prevent re-renders
  const responsibilityMatrixContent = useMemo(
    () => (
      <div className="space-y-4 w-full max-w-full">
        <ResponsibilityMatrixModule
          projectId={projectId}
          user={user}
          userRole={userRole}
          className="border-0 shadow-none"
        />
      </div>
    ),
    [projectId, user, userRole]
  )

  // Memoized productivity content to prevent re-renders
  const productivityContent = useMemo(
    () => (
      <div className="w-full max-w-full">
        <ProductivityModule
          projectId={projectId}
          projectData={projectData}
          userRole={userRole}
          user={user}
          className="w-full"
        />
      </div>
    ),
    [projectId, projectData, userRole, user]
  )

  // Render tab content based on activeTab - memoized to prevent unnecessary re-renders
  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return dashboardContent

      case "checklists":
        return checklistContent

      case "reports":
        return (
          <div className="space-y-4 w-full max-w-full">
            {/* Card-based Reports Tab Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div
                onClick={() => setReportsSubTab("dashboard")}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  reportsSubTab === "dashboard"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "border-border hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm font-medium">Dashboard</span>
                  <span className="text-xs text-muted-foreground">Reports overview and analytics</span>
                </div>
              </div>
              <div
                onClick={() => setReportsSubTab("project-reports")}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  reportsSubTab === "project-reports"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "border-border hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm font-medium">Project Reports</span>
                  <span className="text-xs text-muted-foreground">Comprehensive project reporting</span>
                </div>
              </div>
            </div>

            {/* Conditional Content Rendering */}
            {reportsSubTab === "dashboard" && (
              <div className="w-full max-w-full overflow-hidden">
                <ReportsDashboard
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  user={user}
                  onTabChange={handleReportsSubTabChange}
                />
              </div>
            )}
            {reportsSubTab === "project-reports" && (
              <div className="w-full max-w-full overflow-hidden">
                <ProjectReports
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  user={user}
                  activeTab={reportsSubTab || "overview"}
                  onTabChange={handleReportsSubTabChange}
                />
              </div>
            )}
          </div>
        )

      case "responsibility-matrix":
        return responsibilityMatrixContent

      case "productivity":
        return productivityContent

      case "staffing":
        return (
          <div className="space-y-4 w-full max-w-full">
            {/* Tab-based Staffing Navigation */}
            <div className="flex bg-muted rounded-lg p-1 mb-6">
              <button
                onClick={() => setStaffingSubTab("dashboard")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  staffingSubTab === "dashboard"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setStaffingSubTab("timeline")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  staffingSubTab === "timeline"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setStaffingSubTab("spcr")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  staffingSubTab === "spcr"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                SPCR
              </button>
            </div>
            {/* Conditional Content Rendering */}
            {staffingSubTab === "timeline" && (
              <div className="w-full max-w-full overflow-hidden">
                <ProjectStaffingGantt
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  isReadOnly={userRole === "viewer"}
                  className="w-full"
                  height="600px"
                />
              </div>
            )}
            {staffingSubTab === "dashboard" && (
              <div className="w-full max-w-full overflow-hidden">
                <StaffingDashboard
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  className="w-full"
                  isCompact={false}
                  isFullScreen={isFocusMode}
                />
              </div>
            )}
            {staffingSubTab === "spcr" && (
              <div className="w-full max-w-full overflow-hidden">
                <ProjectSPCRManager
                  projectId={parseInt(projectId)}
                  projectData={projectData}
                  userRole={userRole}
                  className="h-full"
                />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }, [
    activeTab,
    dashboardContent,
    checklistContent,
    responsibilityMatrixContent,
    productivityContent,
    reportsSubTab,
    staffingSubTab,
    projectId,
    projectData,
    userRole,
    user,
    isFocusMode,
    handleReportsSubTabChange,
  ])

  // Main content
  const mainContent = useMemo(
    () => (
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

        {/* Card-based Core Tab Navigation */}
        <div className="mb-6 flex-shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {coreTabsConfig.map((tab) => (
              <div
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "border-border hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <tab.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  <span className="text-xs text-muted-foreground">{tab.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0 max-w-full min-h-0">
          <div className={cn("w-full min-w-0 max-w-full", isFocusMode ? "min-h-full" : "h-full overflow-hidden")}>
            {renderTabContent}
          </div>
        </div>
      </div>
    ),
    [activeTab, handleTabChange, handleFocusToggle, isFocusMode, renderTabContent]
  )

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

  return mainContent
}

export default ProjectTabsShell
