"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useProjectContext } from "@/context/project-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Trophy,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Calculator,
  Briefcase,
  Brain,
  Zap,
  Home,
  Lightbulb,
  MapPin,
  Timer,
  TrendingDown,
  Plus,
  RefreshCw,
  Download,
  Activity,
  Eye,
  Percent,
  ArrowLeft,
  EllipsisVertical,
  Maximize,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"

// Import data
import projectsData from "@/data/mock/projects.json"
import pipelineData from "@/data/mock/precon/pipeline.json"

// Import components for different sections
import { PipelineOverview } from "@/components/precon/PipelineOverview"
import { EstimatingDashboard } from "@/components/precon/EstimatingDashboard"
import { BusinessDevelopment } from "@/components/precon/BusinessDevelopment"
import { PreconAnalytics } from "@/components/precon/PreconAnalytics"
import { ProjectInsights } from "@/components/precon/ProjectInsights"
import { ProjectSpecificDashboard } from "@/components/estimating/ProjectSpecificDashboard"

export default function PreConstructionPage() {
  const { user } = useAuth()
  const { projectId } = useProjectContext()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeframe, setSelectedTimeframe] = useState("12months")
  const [isLoading, setIsLoading] = useState(false)
  const [showNewOpportunityForm, setShowNewOpportunityForm] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState("estimating")

  // Handle URL hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (hash && ["overview", "business-dev", "analytics", "projects"].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  // Filter projects for pre-construction stages
  const preconProjects = useMemo(() => {
    return projectsData.filter(
      (project) =>
        ["Pre-Construction", "Bidding", "BIM Coordination"].includes(project.project_stage_name) && project.active
    )
  }, [])

  // Calculate comprehensive summary statistics
  const summaryStats = useMemo(() => {
    // Pipeline calculations
    const totalPipelineValue = pipelineData.reduce((sum, item) => sum + item.config.pipelineValue, 0)
    const probabilityWeightedValue = pipelineData.reduce((sum, item) => sum + item.config.probabilityWeighted, 0)
    const totalOpportunities = pipelineData.reduce(
      (sum, item) => sum + item.config.stages.reduce((stageSum, stage) => stageSum + stage.count, 0),
      0
    )

    const averageProbability = totalOpportunities > 0 ? (probabilityWeightedValue / totalPipelineValue) * 100 : 0

    // Active projects calculations
    const activeProjectsValue = preconProjects.reduce((sum, project) => sum + project.contract_value, 0)

    // Win/Loss calculations
    const recentWins = pipelineData.flatMap((item) => item.config.recentWins || [])
    const recentLosses = pipelineData.flatMap((item) => item.config.recentLosses || [])
    const totalWinValue = recentWins.reduce((sum, win) => sum + win.value, 0)
    const totalLossValue = recentLosses.reduce((sum, loss) => sum + loss.value, 0)
    const winRate =
      recentWins.length + recentLosses.length > 0
        ? (recentWins.length / (recentWins.length + recentLosses.length)) * 100
        : 0

    // Stage distribution analysis
    const stageDistribution = pipelineData.reduce((acc, project) => {
      project.config.stages.forEach((stage) => {
        if (!acc[stage.stage]) {
          acc[stage.stage] = { count: 0, value: 0 }
        }
        acc[stage.stage].count += stage.count
        acc[stage.stage].value += stage.value
      })
      return acc
    }, {} as Record<string, { count: number; value: number }>)

    // Division analysis
    const divisionBreakdown = pipelineData.reduce((acc, project) => {
      if (!acc[project.division]) {
        acc[project.division] = { count: 0, value: 0, weightedValue: 0 }
      }
      acc[project.division].count += 1
      acc[project.division].value += project.config.pipelineValue
      acc[project.division].weightedValue += project.config.probabilityWeighted
      return acc
    }, {} as Record<string, { count: number; value: number; weightedValue: number }>)

    return {
      // Primary metrics
      totalPipelineValue,
      probabilityWeightedValue,
      totalOpportunities,
      averageProbability,
      activeProjectsValue,
      activeProjectsCount: preconProjects.length,
      winRate,
      pipelineItems: pipelineData.length,

      // Additional analytics
      totalWinValue,
      totalLossValue,
      stageDistribution,
      divisionBreakdown,
      recentWins: recentWins.slice(0, 5),
      recentLosses: recentLosses.slice(0, 3),

      // Derived metrics
      averageProjectValue: activeProjectsValue / Math.max(preconProjects.length, 1),
      conversionRate: totalPipelineValue > 0 ? (probabilityWeightedValue / totalPipelineValue) * 100 : 0,
      pipelineHealth: Math.min(
        100,
        Math.max(0, winRate * 0.4 + averageProbability * 0.3 + (totalOpportunities / pipelineData.length) * 10 * 0.3)
      ),
    }
  }, [preconProjects, pipelineData])

  // Get role-specific scope information
  const getProjectScope = () => {
    if (!user) return { scope: "all", description: "All Pre-Construction Projects" }

    switch (user.role) {
      case "project-manager":
        return {
          scope: "single",
          description: "Assigned Pre-Construction Projects",
          projectCount: Math.min(preconProjects.length, 2),
        }
      case "project-executive":
        return {
          scope: "portfolio",
          description: "Portfolio Pre-Construction View",
          projectCount: Math.min(preconProjects.length, 6),
        }
      case "estimator":
        return {
          scope: "estimating",
          description: "Estimating Pipeline View",
          projectCount: preconProjects.length,
        }
      case "executive":
        return {
          scope: "enterprise",
          description: "Enterprise Pre-Construction View",
          projectCount: preconProjects.length,
        }
      default:
        return {
          scope: "enterprise",
          description: "Enterprise Pre-Construction View",
          projectCount: preconProjects.length,
        }
    }
  }

  const projectScope = getProjectScope()

  // Format currency values
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  // Handle refresh action
  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  // Handle New Opportunity button click
  const handleNewOpportunity = () => {
    if (activeTab === "estimating") {
      // If we're on the estimating tab, trigger the form directly
      setShowNewOpportunityForm(true)
    } else {
      // Switch to estimating tab and then show form
      setActiveTab("estimating")
      setTimeout(() => {
        setShowNewOpportunityForm(true)
      }, 100)
    }
  }

  // Handle project selection
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId)
    setActiveTab("project-dashboard")
  }

  // Handle back to estimating
  const handleBackToEstimating = () => {
    setSelectedProjectId(null)
    setActiveTab("estimating")
  }

  // Handle fullscreen toggle
  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen)
    setMoreMenuOpen(false)
  }

  // Handle export
  const handleExport = () => {
    // Export functionality would go here
    console.log("Exporting pre-construction data...")
    setMoreMenuOpen(false)
  }

  // Determine if right panel should be shown
  const shouldShowRightPanel = () => {
    return ["overview", "business-dev", "analytics"].includes(activeTab)
  }

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
    <>
      <AppHeader />
      <div className="space-y-3 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Hedrick Brothers
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pre-Construction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Sticky Header Section */}
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pt-3 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pre-Construction Command Center</h1>
              <p className="text-muted-foreground mt-1">
                Pipeline management, estimating, and business development intelligence suite
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleFullscreenToggle}>
                <Maximize className="h-4 w-4" />
              </Button>

              <Popover open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        handleRefresh()
                        setMoreMenuOpen(false)
                      }}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        handleNewOpportunity()
                        setMoreMenuOpen(false)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Opportunity
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Pipeline Value</CardTitle>
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(summaryStats.totalPipelineValue)}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Total opportunity value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Weighted Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(summaryStats.probabilityWeightedValue)}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">Probability weighted</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Win Rate</CardTitle>
              <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {summaryStats.winRate.toFixed(1)}%
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Historical success rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Active Projects
              </CardTitle>
              <Building2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {summaryStats.activeProjectsCount}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400">In pre-construction</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Opportunities</CardTitle>
              <Eye className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-100">
                {summaryStats.totalOpportunities}
              </div>
              <p className="text-xs text-cyan-600 dark:text-cyan-400">Total pipeline items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Avg Probability
              </CardTitle>
              <Percent className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                {summaryStats.averageProbability.toFixed(1)}%
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Weighted average</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20"
            onClick={() => (window.location.href = "/projects")}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                  <Calculator className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Project Estimates</h3>
                  <p className="text-sm text-muted-foreground">View and manage project estimates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20"
            onClick={() => setActiveTab("business-dev")}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Business Development</h3>
                  <p className="text-sm text-muted-foreground">Pipeline and opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20"
            onClick={() => setActiveTab("analytics")}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Performance insights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-primary/20"
            onClick={() => setActiveTab("projects")}
          >
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">Project Insights</h3>
                  <p className="text-sm text-muted-foreground">Project portfolio overview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Container - 2 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Main Content (80% width when right panel shown, 100% otherwise) */}
          <div
            className={`${
              shouldShowRightPanel() ? "w-4/5" : "w-full"
            } overflow-y-auto overflow-x-hidden min-w-0 max-w-full flex-shrink`}
          >
            <div className="space-y-6">
              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                {activeTab !== "project-dashboard" && (
                  <TabsList className="grid w-full grid-cols-4 h-12 bg-muted border-border">
                    <TabsTrigger
                      value="overview"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <PieChart className="h-4 w-4" />
                      <span className="hidden sm:inline">Pipeline Overview</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="business-dev"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <Briefcase className="h-4 w-4" />
                      <span className="hidden sm:inline">Business Development</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="analytics"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="projects"
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Projects</span>
                    </TabsTrigger>
                  </TabsList>
                )}

                {/* Tab Content */}
                <TabsContent value="overview" className="space-y-6">
                  <PipelineOverview
                    pipelineData={pipelineData}
                    summaryStats={summaryStats}
                    userRole={user?.role || "viewer"}
                  />
                </TabsContent>

                <TabsContent value="project-dashboard" className="space-y-6">
                  {selectedProjectId && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleBackToEstimating} className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back to Estimating
                        </Button>
                        <div className="h-4 w-px bg-border" />
                        <h2 className="text-lg font-semibold">Project Dashboard</h2>
                      </div>
                      <ProjectSpecificDashboard
                        projectId={selectedProjectId}
                        onNavigateToTracker={handleBackToEstimating}
                        onNavigateToResponsibility={() => {
                          // In a full implementation, this would navigate to responsibility matrix
                          console.log("Navigate to responsibility matrix for project:", selectedProjectId)
                        }}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="business-dev" className="space-y-6">
                  <BusinessDevelopment
                    pipelineData={pipelineData}
                    summaryStats={summaryStats}
                    userRole={user?.role || "viewer"}
                  />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <PreconAnalytics
                    pipelineData={pipelineData}
                    preconProjects={preconProjects}
                    summaryStats={summaryStats}
                    userRole={user?.role || "viewer"}
                  />
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <ProjectInsights
                    projects={preconProjects}
                    pipelineData={pipelineData}
                    userRole={user?.role || "viewer"}
                    onProjectSelect={handleProjectSelect}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Panel - Pre-Construction Tools (20% width when shown) */}
          {shouldShowRightPanel() && (
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
          )}
        </div>
      </div>
    </>
  )
}
