"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { ResponsibilityMatrixIntegration } from "@/components/staffing/ResponsibilityMatrixIntegration"
import {
  Plus,
  RefreshCw,
  Download,
  Users,
  CheckCircle,
  Home,
  Maximize,
  Minimize,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText,
  Filter,
  Target,
  Clock,
  Settings,
  Award,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import responsibilityRawData from "@/data/mock/responsibility.json"
import type { ResponsibilityTask, ResponsibilityRole, ResponsibilityMetrics } from "@/types/responsibility"

export default function ResponsibilityMatrixPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // State management
  const [activeTab, setActiveTab] = useState("team")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ResponsibilityTask | null>(null)
  const [deleteTask, setDeleteTask] = useState<ResponsibilityTask | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Role colors matching the component
  const roleColors: { [key: string]: string } = {
    PX: "#1890ff",
    PM1: "#52c41a",
    PM2: "#13c2c2",
    PM3: "#722ed1",
    PA: "#fa8c16",
    QAQC: "#f5222d",
    SPM: "#eb2f96",
    "Proj Acct": "#fadb14",
    O: "#a0d911",
    A: "#f57734",
    C: "#fa541c",
    S: "#722ed1",
  }

  // Transform raw data into ResponsibilityTask format
  const transformedTasks: ResponsibilityTask[] = useMemo(() => {
    return responsibilityRawData
      .filter((item) => item["Task Category"] && item["Tasks/Role"])
      .map((item, index) => {
        const randomAssignments: { [key: string]: "Approve" | "Primary" | "Support" | "None" } = {}

        const category = item["Task Category"] || "General"
        Object.keys(roleColors).forEach((role) => {
          if (role === category) {
            randomAssignments[role] = Math.random() > 0.3 ? "Primary" : "Support"
          } else if (["PX", "SPM"].includes(role)) {
            randomAssignments[role] = Math.random() > 0.7 ? "Approve" : "None"
          } else {
            randomAssignments[role] = Math.random() > 0.8 ? "Support" : "None"
          }
        })

        return {
          id: `task-${index}`,
          projectId: "palm-beach-luxury",
          type: activeTab as "team" | "prime-contract" | "subcontract",
          category: category,
          task: item["Tasks/Role"] || "",
          page: Math.random() > 0.5 ? `${Math.floor(Math.random() * 50) + 1}` : "",
          article:
            Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 20) + 1}` : "",
          responsible:
            category === "PX"
              ? "PX"
              : category === "SPM"
              ? "SPM"
              : Object.keys(randomAssignments).find((role) => randomAssignments[role] === "Primary") || "",
          assignments: randomAssignments,
          status: ["active", "pending", "completed"][Math.floor(Math.random() * 3)] as
            | "active"
            | "pending"
            | "completed",
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
          annotations: [],
        }
      })
  }, [activeTab])

  // Define roles
  const roles: ResponsibilityRole[] = useMemo(() => {
    return Object.entries(roleColors).map(([key, color]) => ({
      key,
      name:
        key === "Proj Acct"
          ? "Project Accountant"
          : key === "QAQC"
          ? "Quality Control"
          : key === "SPM"
          ? "Senior Project Manager"
          : key,
      color,
      enabled: true,
      description: `${key} role responsibilities`,
    }))
  }, [])

  // Calculate metrics
  const metrics = useMemo((): ResponsibilityMetrics => {
    const total = transformedTasks.length
    const completed = transformedTasks.filter((t) => t.status === "completed").length
    const pending = transformedTasks.filter((t) => t.status === "pending").length
    const unassigned = transformedTasks.filter((t) => !t.responsible || t.responsible === "").length

    const roleWorkload = transformedTasks.reduce((acc, task) => {
      Object.entries(task.assignments).forEach(([role, assignment]) => {
        if (assignment !== "None") {
          acc[role] = (acc[role] || 0) + 1
        }
      })
      return acc
    }, {} as { [roleKey: string]: number })

    const categoryDistribution = transformedTasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    }, {} as { [category: string]: number })

    return {
      totalTasks: total,
      unassignedTasks: unassigned,
      completedTasks: completed,
      pendingTasks: pending,
      roleWorkload,
      categoryDistribution,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageTasksPerRole:
        Object.keys(roleColors).length > 0
          ? Object.values(roleWorkload).reduce((sum, count) => sum + count, 0) / Object.keys(roleColors).length
          : 0,
    }
  }, [transformedTasks])

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

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Responsibility matrix data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Responsibility matrix exported successfully",
    })
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullScreen])

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {!isFullScreen && (
          <>
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
                  <BreadcrumbPage>Responsibility Matrix</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section - Made Sticky */}
            <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
              <div className="flex flex-col gap-4 pt-3" data-tour="responsibility-matrix-page-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Responsibility Matrix</h1>
                    <p className="text-muted-foreground mt-1">
                      Manage task assignments and accountability across project teams
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                          <p className="text-muted-foreground">Task creation form would go here.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content with Sidebar Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
              {/* Sidebar - Hidden on mobile, shown on xl+ */}
              <div className="hidden xl:block xl:col-span-3 space-y-4">
                {/* Quick Statistics */}
                <Card data-tour="responsibility-matrix-quick-stats">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Tasks</span>
                      <span className="font-medium">{metrics.totalTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium text-green-600">{metrics.completedTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-medium text-orange-600">{metrics.pendingTasks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium text-blue-600">{metrics.completionRate.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab("team")}>
                      <Users className="h-4 w-4 mr-2" />
                      Team Matrix
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setActiveTab("prime-contract")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Prime Contract
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={() => setActiveTab("subcontract")}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Subcontract
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Role Analytics */}
                <Card data-tour="role-analytics">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Role Workload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(metrics.roleWorkload)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 6)
                      .map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: roleColors[role] || "#6B7280" }}
                            />
                            <span className="text-muted-foreground">{role}</span>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Project Scope */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Project Scope
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Scope</span>
                      <span className="font-medium">{projectScope.description}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Projects</span>
                      <span className="font-medium text-blue-600">{projectScope.projectCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Load</span>
                      <span className="font-medium text-purple-600">{metrics.averageTasksPerRole.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-9">
                {/* Responsibility Matrix with Custom Tabs */}
                <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Responsibility Matrix
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
                    {/* Custom Tab Navigation */}
                    <div className="flex items-center gap-1 mb-6" data-tour="responsibility-matrix-tabs">
                      <button
                        onClick={() => setActiveTab("team")}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                          activeTab === "team"
                            ? "text-primary border-primary bg-primary/5"
                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                        }`}
                        data-tour="team-matrix-tab"
                      >
                        <Users className="h-4 w-4" />
                        Team Matrix
                      </button>
                      <button
                        onClick={() => setActiveTab("prime-contract")}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                          activeTab === "prime-contract"
                            ? "text-primary border-primary bg-primary/5"
                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                        }`}
                        data-tour="prime-contract-tab"
                      >
                        <FileText className="h-4 w-4" />
                        Prime Contract
                      </button>
                      <button
                        onClick={() => setActiveTab("subcontract")}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                          activeTab === "subcontract"
                            ? "text-primary border-primary bg-primary/5"
                            : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                        }`}
                        data-tour="subcontract-tab"
                      >
                        <Award className="h-4 w-4" />
                        Subcontract
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-6">
                      {activeTab === "team" && (
                        <div data-tour="team-responsibility-matrix">
                          <ResponsibilityMatrixIntegration
                            userRole={user?.role as any}
                            className="border-0 shadow-none p-0"
                          />
                        </div>
                      )}

                      {activeTab === "prime-contract" && (
                        <div data-tour="prime-contract-matrix">
                          <ResponsibilityMatrixIntegration
                            userRole={user?.role as any}
                            className="border-0 shadow-none p-0"
                          />
                        </div>
                      )}

                      {activeTab === "subcontract" && (
                        <div data-tour="subcontract-matrix">
                          <ResponsibilityMatrixIntegration
                            userRole={user?.role as any}
                            className="border-0 shadow-none p-0"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Fullscreen Mode - Show only the matrix */}
        {isFullScreen && (
          <Card className="fixed inset-0 z-[130] rounded-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Responsibility Matrix
              </CardTitle>
              <Button variant="outline" size="sm" onClick={toggleFullScreen} className="flex items-center gap-2">
                <Minimize className="h-4 w-4" />
                Exit Full Screen
              </Button>
            </CardHeader>
            <CardContent className="h-[calc(100vh-80px)] overflow-y-auto">
              <div className="flex items-center gap-1 mb-6">
                <button
                  onClick={() => setActiveTab("team")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "team"
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Team Matrix
                </button>
                <button
                  onClick={() => setActiveTab("prime-contract")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "prime-contract"
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Prime Contract
                </button>
                <button
                  onClick={() => setActiveTab("subcontract")}
                  className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "subcontract"
                      ? "text-primary border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  Subcontract
                </button>
              </div>

              <div className="space-y-6">
                {activeTab === "team" && (
                  <ResponsibilityMatrixIntegration userRole={user?.role as any} className="border-0 shadow-none p-0" />
                )}
                {activeTab === "prime-contract" && (
                  <ResponsibilityMatrixIntegration userRole={user?.role as any} className="border-0 shadow-none p-0" />
                )}
                {activeTab === "subcontract" && (
                  <ResponsibilityMatrixIntegration userRole={user?.role as any} className="border-0 shadow-none p-0" />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
