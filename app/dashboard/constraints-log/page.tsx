"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useSearchParams } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ConstraintWidgets } from "@/components/constraints/ConstraintWidgets"
import { HbiInsightsPanel } from "@/components/constraints/HbiInsightsPanel"
import { GanttChart } from "@/components/constraints/GanttChart"
import { EnhancedConstraintTable } from "@/components/constraints/EnhancedConstraintTable"
import { ConstraintForm } from "@/components/constraints/ConstraintForm"
import { ConstraintExportUtils } from "@/components/constraints/ExportUtils"
import { ExportModal } from "@/components/constraints/ExportModal"
import { ProjectConstraintsSummary } from "@/components/constraints/ProjectConstraintsSummary"
import {
  Plus,
  RefreshCw,
  Download,
  Clock,
  CheckCircle,
  Home,
  Maximize,
  Minimize,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText,
  Filter,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import constraintsData from "@/data/mock/logs/constraints.json"
import type { Constraint, ConstraintProject, ConstraintStats, ConstraintFilters } from "@/types/constraint"

export default function ConstraintsLogPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // State management
  const [projects] = useState<ConstraintProject[]>(constraintsData as ConstraintProject[])
  const [allConstraints, setAllConstraints] = useState<Constraint[]>([])
  const [filteredConstraints, setFilteredConstraints] = useState<Constraint[]>([])
  const [activeTab, setActiveTab] = useState("open")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null)
  const [deleteConstraint, setDeleteConstraint] = useState<Constraint | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Filter state - Initialize with default values
  const [filters, setFilters] = useState<ConstraintFilters>({
    search: "",
    status: "all",
    category: "all",
    assigned: "all",
    project: "all",
    dateRange: { start: null, end: null },
  })

  // Handle URL parameter after component mounts to avoid hydration issues
  useEffect(() => {
    const projectIdFromUrl = searchParams.get("project_id")
    if (projectIdFromUrl) {
      setFilters((prev) => ({ ...prev, project: projectIdFromUrl }))
    }
  }, [searchParams])

  // Initialize constraints from all projects
  useEffect(() => {
    const constraints = projects.flatMap((project) => project.constraints)
    setAllConstraints(constraints)
  }, [projects])

  // Apply filters and group by category
  useEffect(() => {
    let filtered = allConstraints

    // Filter by tab (open/closed)
    if (activeTab === "open") {
      filtered = filtered.filter((c) => c.completionStatus !== "Closed")
    } else {
      filtered = filtered.filter((c) => c.completionStatus === "Closed")
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.description.toLowerCase().includes(searchLower) ||
          c.category.toLowerCase().includes(searchLower) ||
          c.assigned.toLowerCase().includes(searchLower) ||
          c.reference.toLowerCase().includes(searchLower) ||
          c.no.toLowerCase().includes(searchLower)
      )
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((c) => c.completionStatus === filters.status)
    }

    // Apply category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category)
    }

    // Apply assignee filter
    if (filters.assigned !== "all") {
      filtered = filtered.filter((c) => c.assigned === filters.assigned)
    }

    // Apply project filter
    if (filters.project !== "all") {
      const projectId = parseInt(filters.project)
      const selectedProject = projects.find((p) => p.project_id === projectId)
      if (selectedProject) {
        const selectedProjectConstraintIds = selectedProject.constraints.map((c) => c.id)
        filtered = filtered.filter((c) => selectedProjectConstraintIds.includes(c.id))
      }
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((c) => {
        if (!c.dateIdentified) return false
        const constraintDate = new Date(c.dateIdentified)

        if (filters.dateRange.start && constraintDate < filters.dateRange.start) return false
        if (filters.dateRange.end && constraintDate > filters.dateRange.end) return false

        return true
      })
    }

    setFilteredConstraints(filtered)
  }, [allConstraints, filters, activeTab])

  // Calculate statistics
  const stats = useMemo((): ConstraintStats => {
    const total = allConstraints.length
    const open = allConstraints.filter((c) => c.completionStatus !== "Closed").length
    const closed = allConstraints.filter((c) => c.completionStatus === "Closed").length
    const overdue = allConstraints.filter((c) => {
      if (c.completionStatus === "Closed") return false
      if (!c.dueDate) return false
      return new Date(c.dueDate) < new Date()
    }).length

    const byCategory = allConstraints.reduce((acc, constraint) => {
      acc[constraint.category] = (acc[constraint.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = allConstraints.reduce((acc, constraint) => {
      acc[constraint.completionStatus] = (acc[constraint.completionStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, open, closed, overdue, byCategory, byStatus }
  }, [allConstraints])

  // Get unique values for filters
  const categories = useMemo(() => {
    return [...new Set(allConstraints.map((c) => c.category))].sort()
  }, [allConstraints])

  const assignees = useMemo(() => {
    return [...new Set(allConstraints.map((c) => c.assigned).filter(Boolean))].sort()
  }, [allConstraints])

  // Handle constraint creation
  const handleCreateConstraint = (constraintData: Omit<Constraint, "id" | "no" | "daysElapsed">) => {
    const newConstraint: Constraint = {
      ...constraintData,
      id: Date.now().toString(),
      no: `C-${allConstraints.length + 1}`,
      daysElapsed: constraintData.dateIdentified
        ? Math.floor((new Date().getTime() - new Date(constraintData.dateIdentified).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    }

    setAllConstraints((prev) => [...prev, newConstraint])
    setIsCreateModalOpen(false)
    toast({
      title: "Success",
      description: "Constraint created successfully",
    })
  }

  // Handle constraint updates
  const handleUpdateConstraint = (constraintData: Omit<Constraint, "id" | "no" | "daysElapsed">) => {
    if (!editingConstraint) return

    setAllConstraints((prev) =>
      prev.map((c) =>
        c.id === editingConstraint.id
          ? {
              ...constraintData,
              id: editingConstraint.id,
              no: editingConstraint.no,
              daysElapsed: constraintData.dateIdentified
                ? Math.floor(
                    (new Date().getTime() - new Date(constraintData.dateIdentified).getTime()) / (1000 * 60 * 60 * 24)
                  )
                : 0,
            }
          : c
      )
    )
    setEditingConstraint(null)
    toast({
      title: "Success",
      description: "Constraint updated successfully",
    })
  }

  // Handle constraint deletion
  const handleDeleteConstraint = () => {
    if (deleteConstraint) {
      setAllConstraints((prev) => prev.filter((c) => c.id !== deleteConstraint.id))
      setDeleteConstraint(null)
      toast({
        title: "Success",
        description: "Constraint deleted successfully",
      })
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string, constraintIds: string[]) => {
    toast({
      title: "Bulk Action",
      description: `${action} applied to ${constraintIds.length} constraints`,
    })
  }

  // Handle project selection for filtering
  const handleProjectSelect = (projectId: string) => {
    setFilters((prev) => ({ ...prev, project: projectId }))
  }

  // Handle clearing project filter
  const handleClearProjectFilter = () => {
    setFilters((prev) => ({ ...prev, project: "all" }))
  }

  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      switch (options.format) {
        case "pdf":
          ConstraintExportUtils.exportToPDF(filteredConstraints, stats, "All Projects", options.fileName)
          break
        case "excel":
          ConstraintExportUtils.exportToExcel(filteredConstraints, stats, "All Projects", options.fileName)
          break
        case "csv":
          ConstraintExportUtils.exportToCSV(filteredConstraints, "All Projects", options.fileName)
          break
      }

      toast({
        title: "Export Started",
        description: `Constraints data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Constraints data has been updated",
      })
    }, 1000)
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

  const ConstraintsTableCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Constraints
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex space-x-1 p-1 bg-muted rounded-lg mb-6" data-tour="constraints-log-tabs">
            <button
              onClick={() => setActiveTab("open")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "open"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-tour="constraints-tab"
            >
              <Clock className="h-4 w-4" />
              Open Constraints ({stats.open})
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "closed"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-tour="overview-tab"
            >
              <CheckCircle className="h-4 w-4" />
              Closed Constraints ({stats.closed})
            </button>
          </div>

          <TabsContent value="open">
            <div data-tour="constraints-table">
              <EnhancedConstraintTable
                constraints={filteredConstraints}
                onEdit={setEditingConstraint}
                onDelete={setDeleteConstraint}
                onBulkAction={handleBulkAction}
                showClosed={false}
                groupByCategory={true}
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                assignees={assignees}
              />
            </div>
          </TabsContent>

          <TabsContent value="closed">
            <div data-tour="overview-key-metrics">
              <EnhancedConstraintTable
                constraints={filteredConstraints}
                onEdit={setEditingConstraint}
                onDelete={setDeleteConstraint}
                onBulkAction={handleBulkAction}
                showClosed={true}
                groupByCategory={true}
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
                assignees={assignees}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {!isFullScreen && (
          <>
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
                    <BreadcrumbPage>Constraints Log</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Constraints Log</h1>
                  <p className="text-muted-foreground mt-1">Track and manage project constraints and resolutions</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Constraint
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Constraint</DialogTitle>
                      </DialogHeader>
                      <ConstraintForm
                        onSubmit={handleCreateConstraint}
                        onCancel={() => setIsCreateModalOpen(false)}
                        categories={categories}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Main Layout with Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="xl:col-span-3 space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Total</span>
                      </div>
                      <span className="font-semibold">{stats.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Open</span>
                      </div>
                      <span className="font-semibold">{stats.open}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Closed</span>
                      </div>
                      <span className="font-semibold">{stats.closed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">Overdue</span>
                      </div>
                      <span className="font-semibold">{stats.overdue}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Constraint
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create New Constraint</DialogTitle>
                        </DialogHeader>
                        <ConstraintForm
                          onSubmit={handleCreateConstraint}
                          onCancel={() => setIsCreateModalOpen(false)}
                          categories={categories}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="w-full">
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh Data
                    </Button>
                    <Button variant="outline" onClick={() => setIsExportModalOpen(true)} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Project Scope */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Project Scope</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">View Type</span>
                      </div>
                      <Badge variant="outline">{projectScope.scope}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Projects</span>
                      </div>
                      <span className="font-semibold">{projectScope.projectCount}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{projectScope.description}</div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(stats.byCategory)
                      .slice(0, 5)
                      .map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-purple-500" />
                            <span className="text-sm text-muted-foreground">{category}</span>
                          </div>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-9">
                {/* HBI Insights Panel */}
                <div className="mb-6" data-tour="overview-hbi-insights">
                  <HbiInsightsPanel constraints={allConstraints} />
                </div>

                {/* Project Constraints Summary - Executive and Project Executive only */}
                {(user?.role === "executive" || user?.role === "project-executive") && (
                  <div className="mb-6" data-tour="project-constraints-summary">
                    <ProjectConstraintsSummary
                      projects={projects}
                      selectedProject={filters.project}
                      onProjectSelect={handleProjectSelect}
                      onClearFilter={handleClearProjectFilter}
                    />
                  </div>
                )}

                {/* Gantt Chart */}
                <div className="mb-6" data-tour="gantt-visualization">
                  <GanttChart constraints={allConstraints} />
                </div>

                {/* Constraints Table with Tabs */}
                <ConstraintsTableCard />
              </div>
            </div>
          </>
        )}

        {/* Fullscreen Content */}
        {isFullScreen && <ConstraintsTableCard />}

        {/* Edit Modal */}
        {editingConstraint && (
          <Dialog open={!!editingConstraint} onOpenChange={() => setEditingConstraint(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Constraint</DialogTitle>
              </DialogHeader>
              <ConstraintForm
                constraint={editingConstraint}
                onSubmit={handleUpdateConstraint}
                onCancel={() => setEditingConstraint(null)}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConstraint} onOpenChange={() => setDeleteConstraint(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Constraint</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this constraint? This action cannot be undone.
                <br />
                <strong>{deleteConstraint?.description}</strong>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConstraint} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div data-tour="reports-distribution">
          <ExportModal
            open={isExportModalOpen}
            onOpenChange={setIsExportModalOpen}
            onExport={handleExportSubmit}
            defaultFileName="ConstraintsLog"
          />
        </div>
      </div>
    </>
  )
}
