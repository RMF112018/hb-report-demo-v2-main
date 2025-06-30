"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useProjectContext } from "@/context/project-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarDays,
  FileText,
  BarChart3,
  Download,
  Plus,
  Filter,
  Settings,
  Maximize,
  Minimize,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Building,
  RefreshCw,
  Home,
  Eye,
  Edit
} from "lucide-react"

// Import Permit Components
import { PermitAnalytics } from "@/components/permit-log/PermitAnalytics"
import { PermitFilters } from "@/components/permit-log/PermitFilters"
import { PermitForm } from "@/components/permit-log/PermitForm"
import { PermitExportModal } from "@/components/permit-log/PermitExportModal"
import { PermitTable } from "@/components/permit-log/PermitTable"
import { PermitCalendar } from "@/components/permit-log/PermitCalendar"

// Import new components aligned with constraints log
import { PermitWidgets, type PermitStats } from "@/components/permit-log/PermitWidgets"
import { HbiPermitInsights } from "@/components/permit-log/HbiPermitInsights"
import { PermitExportUtils } from "@/components/permit-log/PermitExportUtils"
import { ExportModal } from "@/components/constraints/ExportModal"

import type { Permit, PermitFilters as PermitFiltersType } from "@/types/permit-log"

// Import mock data
import permitsData from "@/data/mock/logs/permits.json"

export default function PermitLogPage() {
  const { user } = useAuth()
  const { selectedProject } = useProjectContext()
  const { toast } = useToast()

  // State management
  const [permits, setPermits] = useState<Permit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([])
  const [filters, setFilters] = useState<PermitFiltersType>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showPermitForm, setShowPermitForm] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load permits data
  useEffect(() => {
    const loadPermits = async () => {
      try {
        setIsLoading(true)
        // Transform the imported data to match our interface
        const transformedPermits: Permit[] = permitsData.map((permit: any) => ({
          ...permit,
          inspections: permit.inspections || [],
          tags: permit.tags || [],
          conditions: permit.conditions || [],
          priority: permit.priority || "medium",
          authorityContact: permit.authorityContact || {},
        }))
        setPermits(transformedPermits)
      } catch (error) {
        console.error("Failed to load permits:", error)
        toast({
          title: "Error",
          description: "Failed to load permit data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPermits()
  }, [toast])

  // Role-based access control
  const hasCreateAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "project-manager", "project-executive"].includes(user.role)
  }, [user])

  const hasFullAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive"].includes(user.role)
  }, [user])

  const hasExportAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive", "project-executive", "project-manager"].includes(user.role)
  }, [user])

  // Filter permits based on user role and permissions
  const accessiblePermits = useMemo(() => {
    if (!user) return []

    let filtered = permits

    // Apply project-based filtering if a specific project is selected
    if (selectedProject) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === selectedProject.id)
    } else if (!hasFullAccess) {
      // Apply role-based filtering when no specific project is selected
      if (user.role === "project-executive") {
        // Show permits from assigned projects (mock data shows various project IDs)
        const assignedProjects = ["2525840", "2525841", "2525842"]
        filtered = filtered.filter((permit) => assignedProjects.includes(permit.projectId.toString()))
      } else if (user.role === "project-manager") {
        // Show permits from active project only
        const activeProject = "2525840"
        filtered = filtered.filter((permit) => permit.projectId.toString() === activeProject)
      }
    }

    return filtered
  }, [permits, user, hasFullAccess, selectedProject])

  // Apply filters and search
  useEffect(() => {
    let filtered = accessiblePermits

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (permit) =>
          permit.number.toLowerCase().includes(searchLower) ||
          permit.type.toLowerCase().includes(searchLower) ||
          permit.authority.toLowerCase().includes(searchLower) ||
          permit.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status) {
      filtered = filtered.filter((permit) => permit.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter((permit) => permit.type === filters.type)
    }

    if (filters.authority) {
      filtered = filtered.filter((permit) => permit.authority.toLowerCase().includes(filters.authority!.toLowerCase()))
    }

    if (filters.projectId) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === filters.projectId)
    }

    if (filters.dateRange) {
      filtered = filtered.filter((permit) => {
        const permitDate = new Date(permit.applicationDate)
        const startDate = new Date(filters.dateRange!.start)
        const endDate = new Date(filters.dateRange!.end)
        return permitDate >= startDate && permitDate <= endDate
      })
    }

    if (filters.expiringWithin) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithin)
      filtered = filtered.filter((permit) => {
        const expirationDate = new Date(permit.expirationDate)
        return expirationDate <= cutoffDate && (permit.status === "approved" || permit.status === "renewed")
      })
    }

    setFilteredPermits(filtered)
  }, [accessiblePermits, filters, searchTerm])

  // Calculate statistics
  const stats = useMemo((): PermitStats => {
    const totalPermits = filteredPermits.length
    const approvedPermits = filteredPermits.filter((p) => p.status === "approved" || p.status === "renewed").length
    const pendingPermits = filteredPermits.filter((p) => p.status === "pending").length
    const expiredPermits = filteredPermits.filter((p) => p.status === "expired").length
    const rejectedPermits = filteredPermits.filter((p) => p.status === "rejected").length

    const totalInspections = filteredPermits.reduce((sum, p) => sum + (p.inspections?.length || 0), 0)
    const passedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "passed").length || 0),
      0
    )
    const failedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "failed").length || 0),
      0
    )
    const pendingInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "pending").length || 0),
      0
    )

    const approvalRate = totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0
    const inspectionPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringPermits = filteredPermits.filter((p) => {
      const expDate = new Date(p.expirationDate)
      return expDate <= thirtyDaysFromNow && expDate > new Date() && (p.status === "approved" || p.status === "renewed")
    }).length

    const byType = filteredPermits.reduce((acc, permit) => {
      acc[permit.type] = (acc[permit.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byAuthority = filteredPermits.reduce((acc, permit) => {
      acc[permit.authority] = (acc[permit.authority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredPermits.reduce((acc, permit) => {
      acc[permit.status] = (acc[permit.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPermits,
      approvedPermits,
      pendingPermits,
      expiredPermits,
      rejectedPermits,
      expiringPermits,
      totalInspections,
      passedInspections,
      failedInspections,
      pendingInspections,
      approvalRate,
      inspectionPassRate,
      byType,
      byAuthority,
      byStatus,
    }
  }, [filteredPermits])

  // Event handlers
  const handleCreatePermit = useCallback(() => {
    if (!hasCreateAccess) return
    setSelectedPermit(null)
    setShowPermitForm(true)
  }, [hasCreateAccess])

  const handleEditPermit = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    setShowPermitForm(true)
  }, [])

  const handleViewPermit = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    // For now, just log - could open a view-only modal in the future
    console.log("View permit:", permit)
  }, [])

  const handleExportPermit = useCallback((permit: Permit) => {
    console.log("Export permit:", permit)
    toast({
      title: "Export Started",
      description: `Exporting permit ${permit.number}`,
    })
  }, [toast])

  const handleSavePermit = useCallback(
    (permitData: Partial<Permit>) => {
      if (selectedPermit) {
        // Update existing permit
        setPermits((prev) =>
          prev.map((p) =>
            p.id === selectedPermit.id 
              ? { ...p, ...permitData, updatedAt: new Date().toISOString() } 
              : p
          )
        )
        toast({
          title: "Success",
          description: "Permit updated successfully",
        })
      } else {
        // Create new permit
        const newPermit: Permit = {
          id: `perm-${Date.now()}`,
          projectId: selectedProject?.id || "2525840",
          createdBy: user?.id || "current-user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          inspections: [],
          tags: [],
          conditions: [],
          ...permitData,
        } as Permit
        setPermits((prev) => [...prev, newPermit])
        toast({
          title: "Success",
          description: "Permit created successfully",
        })
      }
      setShowPermitForm(false)
    },
    [selectedPermit, user, selectedProject, toast]
  )

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchTerm("")
  }, [])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Permit data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      const projectName = selectedProject?.name || "All Projects"
      
      switch (options.format) {
        case "pdf":
          PermitExportUtils.exportToPDF(filteredPermits, stats, projectName, options.fileName)
          break
        case "excel":
          PermitExportUtils.exportToExcel(filteredPermits, stats, projectName, options.fileName)
          break
        case "csv":
          PermitExportUtils.exportToCSV(filteredPermits, projectName, options.fileName)
          break
      }

      toast({
        title: "Export Started",
        description: `Permit data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
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

  // Get role-specific project scope description
  const getProjectScopeDescription = () => {
    if (!user) return "All Projects"
    
    switch (user.role) {
      case "project-manager":
        return "Single Project View"
      case "project-executive":
        return "Portfolio View (6 Projects)"
      default:
        return "Enterprise View (All Projects)"
    }
  }

  const PermitContentCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#003087] dark:text-blue-400" />
          Permit Management
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-background shadow-sm" data-tour="permit-tabs">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-[#003087] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="permits" className="flex items-center gap-2 data-[state=active]:bg-[#003087] data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Permits</span>
            </TabsTrigger>
            <TabsTrigger value="inspections" className="flex items-center gap-2 data-[state=active]:bg-[#003087] data-[state=active]:text-white">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Inspections</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2 data-[state=active]:bg-[#003087] data-[state=active]:text-white">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#003087] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-[#003087] data-[state=active]:text-white">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <PermitTable
                permits={filteredPermits.slice(0, 10)}
                onEdit={handleEditPermit}
                onView={handleViewPermit}
                onExport={handleExportPermit}
                userRole={user?.role}
                compact={true}
              />
            </div>
          </TabsContent>

          {/* Permits Tab */}
          <TabsContent value="permits" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage all construction permits and their details
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {hasCreateAccess && (
                    <Button
                      size="sm"
                      onClick={handleCreatePermit}
                      className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Permit
                    </Button>
                  )}
                  {hasExportAccess && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExportModal(true)}
                      className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div data-tour="permits-table">
              <PermitTable
                permits={filteredPermits}
                onEdit={handleEditPermit}
                onView={handleViewPermit}
                onExport={handleExportPermit}
                userRole={user?.role}
              />
            </div>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections" className="mt-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Inspection Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track inspection schedules, results, and compliance scores
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {hasExportAccess && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExportModal(true)}
                      className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Inspections
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div data-tour="inspections-scheduling">
              <PermitTable
                permits={filteredPermits}
                onEdit={handleEditPermit}
                onView={handleViewPermit}
                onExport={handleExportPermit}
                userRole={user?.role}
                showInspections={true}
              />
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit & Inspection Calendar</h2>
              <p className="text-sm text-muted-foreground mt-1">Visual timeline of permits and inspections</p>
            </div>
            <div data-tour="calendar-events">
              <PermitCalendar
                permits={filteredPermits}
                onEditPermit={handleEditPermit}
                onViewPermit={handleViewPermit}
                onCreatePermit={handleCreatePermit}
                userRole={user?.role}
              />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div data-tour="analytics-charts">
              <PermitAnalytics permits={filteredPermits} detailed={true} />
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Export Reports</h2>
              <p className="text-sm text-muted-foreground mt-1">Generate comprehensive permit and inspection reports</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-tour="reports-templates">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowExportModal(true)}
              >
                <FileText className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                <span>Permit Summary</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowExportModal(true)}
              >
                <BarChart3 className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                <span>Analytics Report</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowExportModal(true)}
              >
                <CalendarDays className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                <span>Inspection Log</span>
              </Button>
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
                  <BreadcrumbPage>Permit Log</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="flex flex-col gap-4" data-tour="permit-log-page-header">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Permit Log</h1>
                  <p className="text-muted-foreground mt-1">Track and manage construction permits and inspections</p>
                  <div className="flex items-center gap-4 mt-2" data-tour="permit-log-scope-badges">
                    <Badge variant="outline" className="px-3 py-1">
                      {getProjectScopeDescription()}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {stats.totalPermits} Total Permits
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      {stats.approvalRate.toFixed(1)}% Approval Rate
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setShowExportModal(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  {hasCreateAccess && (
                    <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Permit
                    </Button>
                  )}
                </div>
              </div>

              {/* Statistics Widgets */}
              <div data-tour="permit-log-quick-stats">
                <PermitWidgets stats={stats} />
              </div>
            </div>

            {/* HBI Insights Panel */}
            <div data-tour="permit-log-hbi-insights">
              <HbiPermitInsights permits={filteredPermits} stats={stats} />
            </div>
          </>
        )}

        {/* Main Content */}
        <PermitContentCard />

        {/* Create/Edit Permit Modal */}
        {showPermitForm && (
          <Dialog open={showPermitForm} onOpenChange={setShowPermitForm}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedPermit ? "Edit Permit" : "Create New Permit"}</DialogTitle>
              </DialogHeader>
              <PermitForm
                permit={selectedPermit}
                onSubmit={handleSavePermit}
                onCancel={() => setShowPermitForm(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Export Modal */}
        <div data-tour="permit-export">
          <ExportModal
            open={showExportModal}
            onOpenChange={setShowExportModal}
            onExport={handleExportSubmit}
            defaultFileName="PermitLogData"
          />
        </div>

        {/* Help & Support Section */}
        {!isFullScreen && (
          <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Permit Management Help</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Access comprehensive tools for managing construction permits, inspections, and compliance with AI-powered insights.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Permit Applications
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Inspection Scheduling
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Compliance Tracking
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      Authority Relations
                    </Badge>
                    <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600">
                      HBI Insights
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
} 