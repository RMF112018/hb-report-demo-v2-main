"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  RefreshCw,
  Download,
  History,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Import components
import { StaffTimelineChart } from "@/app/dashboard/staff-planning/components/StaffTimelineChart"
import { SPCRInboxPanel } from "@/app/dashboard/staff-planning/components/SPCRInboxPanel"
import { LaborVsRevenuePanel } from "@/app/dashboard/staff-planning/components/LaborVsRevenuePanel"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

// Import mock data
import staffingData from "@/data/mock/staffing/staffing.json"
import projectsData from "@/data/mock/projects.json"
import spcrData from "@/data/mock/staffing/spcr.json"

interface ProjectStaffing {
  project: {
    project_id: number
    name: string
    project_stage_name: string
    contract_value: number
    project_number: string
  }
  staffCount: number
  totalLaborCost: number
  avgExperience: number
  productivity: number
  pendingSpcrCount: number
  staffMembers: any[]
}

export const ProjectExecutiveStaffingView = () => {
  const { toast } = useToast()

  // State management
  const [projectStaffing, setProjectStaffing] = useState<ProjectStaffing[]>([])
  const [activeTab, setActiveTab] = useState("portfolio")
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Demo projects for PE user (6 projects)
  const demoProjectIds = [2525840, 2525841, 2525842, 2525843, 2525844, 2525845]

  useEffect(() => {
    // Calculate staffing data for each project
    const projectsWithStaffing = demoProjectIds
      .map((projectId) => {
        const project = projectsData.find((p) => p.project_id === projectId)
        if (!project) return null

        const projectStaff = staffingData.filter(
          (staff) => staff.assignments && staff.assignments.some((assignment) => assignment.project_id === projectId)
        )

        const totalLaborCost = projectStaff.reduce((sum, staff) => sum + (staff.laborRate || 0), 0)
        const avgExperience =
          projectStaff.length > 0
            ? projectStaff.reduce((sum, staff) => sum + (staff.experience || 0), 0) / projectStaff.length
            : 0

        const pendingSpcrCount = spcrData.filter(
          (spcr) => spcr.project_id === projectId && spcr.status === "submitted"
        ).length

        // Simulate productivity based on project stage and staff experience
        const productivity = Math.min(100, 75 + avgExperience * 2 + Math.random() * 10)

        return {
          project,
          staffCount: projectStaff.length,
          totalLaborCost,
          avgExperience,
          productivity,
          pendingSpcrCount,
          staffMembers: projectStaff,
        } as ProjectStaffing
      })
      .filter(Boolean) as ProjectStaffing[]

    setProjectStaffing(projectsWithStaffing)
  }, [])

  // Portfolio analytics
  const portfolioAnalytics = useMemo(() => {
    const totalStaff = projectStaffing.reduce((sum, project) => sum + project.staffCount, 0)
    const totalLaborCost = projectStaffing.reduce((sum, project) => sum + project.totalLaborCost, 0)
    const avgProductivity =
      projectStaffing.length > 0
        ? projectStaffing.reduce((sum, project) => sum + project.productivity, 0) / projectStaffing.length
        : 0
    const totalPendingSpcrCount = projectStaffing.reduce((sum, project) => sum + project.pendingSpcrCount, 0)
    const totalContractValue = projectStaffing.reduce((sum, project) => sum + (project.project.contract_value || 0), 0)

    return {
      totalStaff,
      totalLaborCost,
      avgProductivity,
      totalPendingSpcrCount,
      totalContractValue,
      projectCount: projectStaffing.length,
    }
  }, [projectStaffing])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Portfolio staffing data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Portfolio staffing report is being prepared",
    })
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const getProductivityBadge = (productivity: number) => {
    if (productivity >= 90)
      return (
        <Badge variant="default" className="bg-green-500">
          Excellent
        </Badge>
      )
    if (productivity >= 80)
      return (
        <Badge variant="default" className="bg-blue-500">
          Good
        </Badge>
      )
    if (productivity >= 70) return <Badge variant="secondary">Average</Badge>
    return <Badge variant="destructive">Needs Attention</Badge>
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Construction":
        return "#3b82f6"
      case "Bidding":
        return "#eab308"
      case "Pre-Construction":
        return "#f97316"
      case "Closeout":
        return "#22c55e"
      case "Warranty":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="h-3 w-3 text-green-500" />
    if (value < 0) return <ArrowDownRight className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-gray-500" />
  }

  // PE-specific insights
  const peInsights = [
    {
      id: "pe-1",
      type: "opportunity",
      severity: "medium",
      title: "Cross-Project Resource Sharing",
      text: "Opportunity to share specialized resources between Palm Beach and Downtown projects, reducing costs by 12%.",
      action: "Coordinate with project managers to establish shared resource schedule.",
      confidence: 86,
      relatedMetrics: ["Resource Utilization", "Cost Optimization", "Schedule Coordination"],
    },
    {
      id: "pe-2",
      type: "alert",
      severity: "high",
      title: "Portfolio Capacity Risk",
      text: "3 projects showing potential resource constraints in Q2 2025 based on current hiring pipeline.",
      action: "Review hiring plans and consider contractor augmentation for critical roles.",
      confidence: 91,
      relatedMetrics: ["Resource Planning", "Hiring Pipeline", "Project Delivery"],
    },
    {
      id: "pe-3",
      type: "performance",
      severity: "low",
      title: "Portfolio Productivity Trend",
      text: "Overall portfolio productivity increased 8.3% compared to last quarter.",
      action: "Document and replicate successful practices across remaining projects.",
      confidence: 94,
      relatedMetrics: ["Productivity", "Best Practices", "Performance Management"],
    },
  ]

  return (
    <div className={cn("space-y-6", isFullScreen && "fixed inset-0 z-[9999] bg-background p-6 overflow-auto")}>
      {/* Main Content with Sidebar Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
        {/* Sidebar - Hidden on mobile, shown on xl+ */}
        <div className="hidden xl:block xl:col-span-3 space-y-4">
          {/* Portfolio Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Portfolio Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects</span>
                <span className="font-medium">{portfolioAnalytics.projectCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Staff</span>
                <span className="font-medium text-blue-600">{portfolioAnalytics.totalStaff}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Productivity</span>
                <span className="font-medium text-green-600">{portfolioAnalytics.avgProductivity.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Value</span>
                <span className="font-medium">${(portfolioAnalytics.totalContractValue / 1000000).toFixed(1)}M</span>
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
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("spcr")}>
                <FileText className="h-4 w-4 mr-2" />
                SPCR Management
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("timeline")}>
                <Calendar className="h-4 w-4 mr-2" />
                Timeline View
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("analytics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Labor Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("portfolio")}>
                <Building2 className="h-4 w-4 mr-2" />
                Portfolio Overview
              </Button>
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Project Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Construction</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pre-Construction</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Key Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Resource Utilization</span>
                <span className="font-medium text-green-600">89%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Schedule Health</span>
                <span className="font-medium text-blue-600">92%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cost Efficiency</span>
                <span className="font-medium text-purple-600">96%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Portfolio Management Tabs */}
        <div className="xl:col-span-9">
          {/* Statistics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Portfolio Size</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{portfolioAnalytics.projectCount}</div>
                  <div className="text-xs text-muted-foreground">
                    ${(portfolioAnalytics.totalContractValue / 1000000).toFixed(1)}M Total Value
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Team Size</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{portfolioAnalytics.totalStaff}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {getTrendIcon(3)}
                    +3 this month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Avg Productivity</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{portfolioAnalytics.avgProductivity.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {getTrendIcon(2.1)}
                    +2.1% vs last month
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">SPCR Reviews</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{portfolioAnalytics.totalPendingSpcrCount}</div>
                  <div className="text-xs text-muted-foreground">Pending approval</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HBI Insights Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                Portfolio Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedHBIInsights config={peInsights} cardId="pe-staffing" />
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center gap-1 mb-6">
              <button
                onClick={() => setActiveTab("portfolio")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "portfolio"
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                Portfolio Overview
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "timeline"
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                Timeline View
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "analytics"
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                Labor Analytics
              </button>
              <button
                onClick={() => setActiveTab("spcr")}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "spcr"
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                }`}
              >
                SPCR Management
              </button>
            </div>

            {/* Portfolio Overview Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Collapsible open={isOverviewExpanded} onOpenChange={setIsOverviewExpanded}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Project Portfolio Overview
                        </CardTitle>
                        {isOverviewExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {projectStaffing.map((project) => (
                        <Card
                          key={project.project.project_id}
                          className="border-l-4"
                          style={{ borderLeftColor: getStageColor(project.project.project_stage_name) }}
                        >
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                              <div className="md:col-span-2">
                                <div className="font-medium">{project.project.name}</div>
                                <div className="text-sm text-muted-foreground">{project.project.project_number}</div>
                                <Badge variant="outline" className="mt-1">
                                  {project.project.project_stage_name}
                                </Badge>
                              </div>

                              <div className="text-center">
                                <div className="text-lg font-bold">{project.staffCount}</div>
                                <div className="text-xs text-muted-foreground">Staff</div>
                              </div>

                              <div className="text-center">
                                <div className="text-lg font-bold">
                                  ${((project.totalLaborCost * 40) / 1000).toFixed(0)}K
                                </div>
                                <div className="text-xs text-muted-foreground">Weekly Cost</div>
                              </div>

                              <div className="text-center">
                                <div className="text-lg font-bold">{project.productivity.toFixed(0)}%</div>
                                <div className="text-xs text-muted-foreground">Productivity</div>
                                {getProductivityBadge(project.productivity)}
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedProject(project.project.project_id)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Button>
                                {project.pendingSpcrCount > 0 && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {project.pendingSpcrCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </TabsContent>

            {/* Timeline View Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Portfolio Staffing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StaffTimelineChart userRole="project-executive" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Labor Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Labor vs Revenue Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LaborVsRevenuePanel userRole="project-executive" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SPCR Management Tab */}
            <TabsContent value="spcr" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    SPCR Management Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SPCRInboxPanel userRole="project-executive" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
