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

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Project metrics (calculated or from data)
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
    [projectData]
  )

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setStaffingSubTab("dashboard") // Reset sub-tabs when changing main tab
    setReportsSubTab("dashboard")
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // Handle staffing sub-tab changes
  const handleStaffingSubTabChange = (tabId: string) => {
    setStaffingSubTab(tabId)
  }

  // Handle reports sub-tab changes
  const handleReportsSubTabChange = (tabId: string) => {
    setReportsSubTab(tabId)
  }

  // Handle focus mode toggle
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Render tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
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
          <ChecklistModule
            projectId={projectId}
            projectData={projectData}
            user={user}
            userRole={userRole}
            className="w-full"
          />
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
                  activeTab={reportsSubTab || "overview"}
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

            <ResponsibilityMatrixModule
              projectId={projectId}
              user={user}
              userRole={userRole}
              className="border-0 shadow-none"
            />
          </div>
        )

      case "productivity":
        return (
          <div className="w-full max-w-full">
            <ProductivityModule
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

  // Main content
  const mainContent = (
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
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
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
          <Select value={activeTab || "dashboard"} onValueChange={(value) => handleTabChange(value)}>
            <SelectTrigger className="w-full">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Core Tools</span>
                <Badge variant="secondary" className="ml-auto">
                  {coreTabsConfig.find((tab) => tab.id === activeTab)?.label || "Dashboard"}
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
          {renderTabContent()}
        </div>
      </div>
    </div>
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
