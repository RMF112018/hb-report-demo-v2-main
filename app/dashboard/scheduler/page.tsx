"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useProjectContext } from "@/context/project-context"
import { useSearchParams } from "next/navigation"
import {
  Calendar,
  Monitor,
  Activity,
  Eye,
  Zap,
  BarChart3,
  FileText,
  Upload,
  Download,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Clock,
  Home,
  RefreshCw,
  MoreVertical,
  Import,
  Building2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { AppHeader } from "@/components/layout/app-header"

// Scheduler Module Components
import SchedulerOverview from "@/components/scheduler/SchedulerOverview"
import ScheduleMonitor from "@/components/scheduler/ScheduleMonitor"
import HealthAnalysis from "@/components/scheduler/HealthAnalysis"
import LookAhead from "@/components/scheduler/LookAhead"
import ScheduleGenerator from "@/components/scheduler/ScheduleGenerator"

interface SchedulerModuleTab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  component: React.ComponentType<{ userRole: string; projectData: any }>
  requiredRoles?: string[]
}

export default function SchedulerPage() {
  const { user } = useAuth()
  const { projectId, getProjectById } = useProjectContext()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [showMenuPopover, setShowMenuPopover] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", description: "" })

  // Get the current project object
  const selectedProject = getProjectById(projectId)

  // Handle URL tab parameter for direct navigation
  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam && ["overview", "schedule-monitor", "health-analysis", "look-ahead", "generator"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Role-based data filtering helper
  const getProjectScope = () => {
    if (!user) return { scope: "all", projectCount: 0, description: "All Projects" }

    // If a specific project is selected, show single project view
    if (selectedProject) {
      return {
        scope: "single",
        projectCount: 1,
        description: `Project View: ${selectedProject.name}`,
        projects: [selectedProject.name],
        selectedProject,
      }
    }

    // Default role-based views when no specific project is selected
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
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Sticky Header with Breadcrumbs */}
        <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-sm border-b pb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Scheduler</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Scheduler</h1>
              <p className="text-muted-foreground mt-1">AI-powered project scheduling and optimization platform</p>
            </div>
            <div className="flex items-center gap-3">
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
            </div>
          </div>

          {/* Statistics Widgets - Single Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6" data-tour="scheduler-quick-stats">
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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMenuItemClick("Import")}
                >
                  <Import className="h-4 w-4 mr-2" />
                  Import Schedule
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMenuItemClick("Export")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleMenuItemClick("Refresh")}
                >
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
    </>
  )
}
