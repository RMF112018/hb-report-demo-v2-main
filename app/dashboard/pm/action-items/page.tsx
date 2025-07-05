"use client"

import React, { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Target,
  RefreshCw,
  Download,
  Settings,
  Home,
  LayoutDashboard,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Inbox,
  BarChart3,
  Building2,
} from "lucide-react"

// Import the new components
import { ActionItemsInbox } from "@/components/dashboard/ActionItemsInbox"
import { ActionItemsToDo } from "@/components/dashboard/ActionItemsToDo"

// Import data for quick stats
import projectsData from "@/data/mock/projects.json"
import responsibilityData from "@/data/mock/responsibility.json"

export default function ProjectManagerActionItemsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate quick statistics for PM (single project focus)
  const pmProject = projectsData.filter((p) => p.active)[0] // Single project for PM
  const pmResponsibilities = responsibilityData.filter((item) => item["Task Category"] === "SPM")

  const quickStats = {
    projectName: pmProject?.display_name || pmProject?.name || "Project Name",
    projectStage: pmProject?.project_stage_name || "In Progress",
    projectValue: pmProject?.contract_value || 0,
    totalResponsibilities: pmResponsibilities.length, // Single project responsibilities
    completedTasks: Math.floor(pmResponsibilities.length * 0.35), // Mock completion rate
    pendingTasks: Math.floor(pmResponsibilities.length * 0.45),
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleExport = () => {
    console.log("Export action items functionality")
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
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
              <BreadcrumbLink href="/dashboard/pm" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Project Manager
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Action Items</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Action Items Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Real-time accountability and activity center for project management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  Project Manager View
                </Badge>
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Context Banner */}
        <Card className="border-l-4 border-l-[rgb(250,70,22)] bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{quickStats.projectName}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {pmProject?.city}, {pmProject?.state_code}
                    </span>
                    <Badge variant="secondary">{quickStats.projectStage}</Badge>
                    <span>{formatCurrency(quickStats.projectValue)}</span>
                    {pmProject?.square_feet && <span>{pmProject.square_feet.toLocaleString()} SF</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{quickStats.totalResponsibilities}</div>
                <div className="text-sm text-muted-foreground">Active Responsibilities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Project Overview */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Stage</span>
                  <span className="font-semibold text-green-600">{quickStats.projectStage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Value</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(quickStats.projectValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">My Responsibilities</span>
                  <span className="font-semibold text-orange-600">{quickStats.totalResponsibilities}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed Tasks</span>
                  <span className="font-semibold text-purple-600">{quickStats.completedTasks}</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Performance */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Project Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Task Completion Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule Performance</span>
                  <span className="font-semibold text-blue-600">On Track</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Status</span>
                  <span className="font-semibold text-green-600">Under Budget</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Issues</span>
                  <span className="font-semibold text-orange-600">8</span>
                </div>
              </CardContent>
            </Card>

            {/* Daily Actions */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Daily Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Review Daily Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Update Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Team Check-ins
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Address Issues
                </Button>
              </CardContent>
            </Card>

            {/* Recent Project Activity */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-muted-foreground">Submitted Payment App</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">1 hour ago</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-muted-foreground">Updated Schedule</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">3 hours ago</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Reviewed RFI Response</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">5 hours ago</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-6">
            {/* Action Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inbox Card */}
              <div>
                <ActionItemsInbox userRole="project-manager" />
              </div>

              {/* To Do Card */}
              <div>
                <ActionItemsToDo userRole="project-manager" />
              </div>
            </div>

            {/* Project Manager Specific Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">92%</div>
                <div className="text-sm text-muted-foreground">Task Completion</div>
              </Card>

              <Card className="text-center p-6">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">1.8h</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </Card>

              <Card className="text-center p-6">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">8</div>
                <div className="text-sm text-muted-foreground">Open Issues</div>
              </Card>

              <Card className="text-center p-6">
                <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{quickStats.pendingTasks}</div>
                <div className="text-sm text-muted-foreground">Pending Tasks</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
