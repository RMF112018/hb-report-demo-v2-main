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
} from "lucide-react"

// Import the new components
import { ActionItemsInbox } from "@/components/dashboard/ActionItemsInbox"
import { ActionItemsToDo } from "@/components/dashboard/ActionItemsToDo"

// Import data for quick stats
import projectsData from "@/data/mock/projects.json"
import responsibilityData from "@/data/mock/responsibility.json"

export default function ProjectExecutiveActionItemsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Calculate quick statistics for PX
  const pxProjects = projectsData.filter((p) => p.active).slice(0, 6)
  const pxResponsibilities = responsibilityData.filter((item) => item["Task Category"] === "PX")

  const quickStats = {
    activeProjects: pxProjects.length,
    totalResponsibilities: pxResponsibilities.length * pxProjects.length, // Estimated total
    totalValue: pxProjects.reduce((sum, p) => sum + (p.contract_value || 0), 0),
    completedTasks: Math.floor(pxResponsibilities.length * pxProjects.length * 0.3), // Mock completion rate
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
              <BreadcrumbLink href="/dashboard/px" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Project Executive
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
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Action Items Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Real-time accountability and activity center for project executives
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  Project Executive View
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

        {/* Main Content with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Executive Overview */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Executive Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Portfolio Projects</span>
                  <span className="font-semibold text-blue-600">{quickStats.activeProjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-semibold text-green-600">{formatCurrency(quickStats.totalValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Responsibilities</span>
                  <span className="font-semibold text-orange-600">{quickStats.totalResponsibilities}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed This Week</span>
                  <span className="font-semibold text-purple-600">{quickStats.completedTasks}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Task Completion Rate</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className="font-semibold text-blue-600">2.3 hours</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Approvals</span>
                  <span className="font-semibold text-orange-600">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Escalations This Week</span>
                  <span className="font-semibold text-red-600">3</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Pending Items
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Reviews
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
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
                    <span className="text-muted-foreground">Approved CO-2024-15</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">2 hours ago</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-muted-foreground">Reviewed Q4 Budget</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">4 hours ago</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-muted-foreground">Escalated RFI-456</span>
                  </div>
                  <div className="text-xs text-muted-foreground ml-4">1 day ago</div>
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
                <ActionItemsInbox userRole="project-executive" />
              </div>

              {/* To Do Card */}
              <div>
                <ActionItemsToDo userRole="project-executive" />
              </div>
            </div>

            {/* Additional Executive Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">87%</div>
                <div className="text-sm text-muted-foreground">Task Completion Rate</div>
              </Card>

              <Card className="text-center p-6">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">2.3h</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </Card>

              <Card className="text-center p-6">
                <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-muted-foreground">Pending Approvals</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
