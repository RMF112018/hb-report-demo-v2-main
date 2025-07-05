"use client"

import React, { useEffect, useState, useMemo } from "react"
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
} from "lucide-react"

// Mock data imports
import projectsData from "@/data/mock/projects.json"
import cashFlowData from "@/data/mock/financial/cash-flow.json"
import constraintsData from "@/data/mock/logs/constraints.json"
import reportsData from "@/data/mock/reports/reports.json"
import procurementData from "@/data/mock/procurement-log.json"
import permitsData from "@/data/mock/logs/permits.json"
import staffingData from "@/data/mock/staffing/staffing.json"

// Components
import { SharePointLibraryViewer } from "@/components/sharepoint/SharePointLibraryViewer"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StartUpChecklist } from "@/components/startup/StartUpChecklist"
import CloseoutChecklist from "@/components/closeout/CloseoutChecklist"

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
                <Button variant="outline" size="sm" className="text-sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
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
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Priority Cards - Show at top on small screens */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Contract Value</h3>
              <div className="text-2xl font-bold text-green-600">
                ${(projectMetrics?.totalBudget || 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <DollarSign className="h-3 w-3 text-green-500" />
                Total budget
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Progress</h3>
              <div className="text-2xl font-bold">{projectMetrics?.scheduleProgress}%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Target className="h-3 w-3 text-blue-500" />
                Schedule complete
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Team Size</h3>
              <div className="text-2xl font-bold">{projectMetrics?.activeTeamMembers}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Users className="h-3 w-3 text-purple-500" />
                Active members
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
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
            {/* Project Overview Cards - Desktop */}
            <div className="bg-card border border-border rounded-lg p-4">
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

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
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
              </div>
            </div>

            {/* Project Metrics */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Project Metrics</h3>
              <div className="space-y-3">
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
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
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

            {/* HBI Project Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI Project Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={projectInsights} cardId={`project-insights-${projectId}`} />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-lg p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList
                  className={`grid w-full ${
                    currentStage === "Construction"
                      ? "grid-cols-7"
                      : currentStage === "Closeout"
                      ? "grid-cols-6"
                      : "grid-cols-5"
                  }`}
                >
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  {currentStage === "Construction" && <TabsTrigger value="startup">Start-Up</TabsTrigger>}
                  {currentStage === "Construction" && <TabsTrigger value="closeout">Closeout</TabsTrigger>}
                  {currentStage === "Closeout" && <TabsTrigger value="closeout">Closeout</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
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
                </TabsContent>

                {currentStage === "Construction" && (
                  <TabsContent value="startup" className="space-y-4 mt-6">
                    <StartUpChecklist
                      projectId={projectId.toString()}
                      projectName={project.name}
                      mode={userRole === "admin" || userRole === "project_manager" ? "editable" : "review"}
                      onStatusChange={(sectionId, itemId, status) => {
                        console.log(`Status changed for ${sectionId}-${itemId}: ${status}`)
                      }}
                    />
                  </TabsContent>
                )}

                {currentStage === "Construction" && (
                  <TabsContent value="closeout" className="space-y-4 mt-6">
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">
                            Construction Phase Closeout Preparation
                          </h4>
                          <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                            Start preparing for project closeout during construction to ensure a smooth transition. Many
                            closeout items can be initiated early to avoid delays.
                          </p>
                        </div>
                      </div>
                    </div>
                    <CloseoutChecklist
                      projectId={projectId.toString()}
                      mode={userRole === "admin" || userRole === "project_manager" ? "full" : "compact"}
                      userRole={userRole === "admin" || userRole === "project_manager" ? "pm" : "viewer"}
                      onStatusChange={(itemId, status) => {
                        console.log(`Status changed for ${itemId}: ${status}`)
                      }}
                      onCommentAdd={(itemId, comment) => {
                        console.log(`Comment added for ${itemId}: ${comment}`)
                      }}
                      onTaskGenerate={(itemId) => {
                        console.log(`Task generated for ${itemId}`)
                      }}
                      onConstraintCreate={(itemId) => {
                        console.log(`Constraint created for ${itemId}`)
                      }}
                      onNotificationSend={(itemId, type) => {
                        console.log(`${type} notification sent for ${itemId}`)
                      }}
                    />
                  </TabsContent>
                )}

                {currentStage === "Closeout" && (
                  <TabsContent value="closeout" className="space-y-4 mt-6">
                    <CloseoutChecklist
                      projectId={projectId.toString()}
                      mode={userRole === "admin" || userRole === "project_manager" ? "full" : "compact"}
                      userRole={userRole === "admin" || userRole === "project_manager" ? "pm" : "viewer"}
                      onStatusChange={(itemId, status) => {
                        console.log(`Status changed for ${itemId}: ${status}`)
                      }}
                      onCommentAdd={(itemId, comment) => {
                        console.log(`Comment added for ${itemId}: ${comment}`)
                      }}
                      onTaskGenerate={(itemId) => {
                        console.log(`Task generated for ${itemId}`)
                      }}
                      onConstraintCreate={(itemId) => {
                        console.log(`Constraint created for ${itemId}`)
                      }}
                      onNotificationSend={(itemId, type) => {
                        console.log(`${type} notification sent for ${itemId}`)
                      }}
                    />
                  </TabsContent>
                )}

                <TabsContent value="schedule" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Schedule Management</h3>
                    <p className="text-sm text-muted-foreground">Project timeline and milestone tracking</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Project Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {projectMetrics?.completedMilestones}
                            </div>
                            <div className="text-sm text-muted-foreground">Completed Milestones</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{projectMetrics?.scheduleProgress}%</div>
                            <div className="text-sm text-muted-foreground">Schedule Progress</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{project.duration}</div>
                            <div className="text-sm text-muted-foreground">Total Duration (Days)</div>
                          </div>
                        </div>
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Detailed schedule view integration coming soon. Connect with your project management system.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Financial Management</h3>
                    <p className="text-sm text-muted-foreground">Budget tracking and cost analysis</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Budget Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              ${(projectMetrics?.totalBudget || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Total Budget</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              ${(projectMetrics?.spentToDate || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Spent to Date</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              ${(projectMetrics?.remainingBudget || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">Remaining Budget</div>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Budget Progress</span>
                            <span className="text-sm font-medium">{projectMetrics?.budgetProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${projectMetrics?.budgetProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Team Management</h3>
                    <p className="text-sm text-muted-foreground">Project team and resource allocation</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Team Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {projectMetrics?.activeTeamMembers}
                            </div>
                            <div className="text-sm text-muted-foreground">Active Team Members</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {userRole === "admin" || userRole === "project_manager" ? "Full" : "Limited"}
                            </div>
                            <div className="text-sm text-muted-foreground">Your Access Level</div>
                          </div>
                        </div>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Team management features integration coming soon. Connect with your HR system.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Document Management</h3>
                    <p className="text-sm text-muted-foreground">Project documents and file management</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">SharePoint Document Library</CardTitle>
                      <CardDescription>Access project documents and files</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <SharePointLibraryViewer
                          projectId={projectId.toString()}
                          projectName={project.name}
                          className="h-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
