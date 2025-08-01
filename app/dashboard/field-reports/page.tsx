"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AppHeader } from "@/components/layout/app-header"
import { useAuth } from "@/context/auth-context"
import { FieldReportsWidgets, type FieldReportsStats } from "@/components/field-reports/FieldReportsWidgets"
import { FieldReportsExportUtils } from "@/components/field-reports/FieldReportsExportUtils"
import { HbiFieldReportsInsights } from "@/components/field-reports/HbiFieldReportsInsights"
import { ProjectFieldReportsSummary } from "@/components/field-reports/ProjectFieldReportsSummary"
import { DailyLogSubTab } from "@/components/field-reports/DailyLogSubTab"
import { SafetyAuditsSubTab } from "@/components/field-reports/SafetyAuditsSubTab"
import { QualityControlSubTab } from "@/components/field-reports/QualityControlSubTab"
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Settings,
  Search,
  Filter,
  CalendarIcon,
  X,
  FileText,
  Users,
  Shield,
  CheckCircle,
  BarChart3,
  FileSpreadsheet,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Target,
  Building,
  User,
  Brain,
  Lightbulb,
  ArrowRight,
  MoreHorizontal,
  Eye,
  Edit,
  ChevronDown,
  ChevronUp,
  DollarSign,
  RefreshCw,
  Home,
  ChevronRight as ChevronRightIcon,
  Zap,
  Maximize,
  HelpCircle,
} from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isToday, isBefore } from "date-fns"

// Mock data and types
import dailyLogsData from "@/data/mock/logs/daily-log-sample.json"
import qualityControlData from "@/data/mock/inspections/quality-control.json"
import safetyData from "@/data/mock/inspections/safety.json"
import type {
  DailyLog,
  ManpowerRecord,
  SafetyAudit,
  QualityInspection,
  FilterState,
  FieldMetrics,
  DashboardData,
  InsightItem,
} from "@/types/field-reports"

export default function FieldReportsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [reportModalType, setReportModalType] = useState<"daily-log" | "quality" | "safety" | null>(null)

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    project: "all",
    status: "all",
    dateRange: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) },
    contractor: "all",
    trade: "all",
    search: "",
  })

  // Data state
  const [fieldData, setFieldData] = useState<DashboardData>({
    dailyLogs: [],
    qualityControl: [],
    safety: [],
    manpower: [],
  })

  // Helper functions
  const determineLogStatus = (date: string) => {
    const logDate = new Date(date)
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) return "submitted"
    if (daysDiff === 1) return "pending"
    return "overdue"
  }

  const calculateDefects = (checklist: any[]) => {
    if (!Array.isArray(checklist)) return 0
    return checklist.filter((item) => item.response === "No").length
  }

  const extractIssues = (checklist: any[]) => {
    if (!Array.isArray(checklist)) return []
    return checklist.filter((item) => item.response === "No").map((item) => item.question)
  }

  const countViolations = (responses: any[]) => {
    if (!Array.isArray(responses)) return 0
    return responses.filter((response) => response.response === "At Risk").length
  }

  const countAtRiskItems = (responses: any[]) => {
    if (!Array.isArray(responses)) return 0
    return responses.filter((response) => response.response === "At Risk").length
  }

  const calculateComplianceScore = (responses: any[]) => {
    if (!Array.isArray(responses) || responses.length === 0) return 100
    const safeResponses = responses.filter((response) => response.response === "Safe").length
    return Math.round((safeResponses / responses.length) * 100)
  }

  const inferTradeFromCompany = (company: string) => {
    if (!company) return "General"
    const lowerCompany = company.toLowerCase()
    if (lowerCompany.includes("concrete")) return "Concrete"
    if (lowerCompany.includes("electric")) return "Electrical"
    if (lowerCompany.includes("plumb")) return "Plumbing"
    if (lowerCompany.includes("steel")) return "Structural Steel"
    if (lowerCompany.includes("roofing")) return "Roofing"
    if (lowerCompany.includes("hvac")) return "HVAC"
    return "General"
  }

  const calculateEfficiency = (entry: any) => {
    if (!entry.total_hours || !entry.workers) return 75
    const expectedHours = entry.workers * 8
    return Math.min(100, Math.round((entry.total_hours / expectedHours) * 100))
  }

  const estimateCostPerHour = (company: string) => {
    const trade = inferTradeFromCompany(company)
    const baseCosts = {
      Electrical: 85,
      Plumbing: 80,
      HVAC: 75,
      "Structural Steel": 90,
      Concrete: 70,
      Roofing: 65,
      General: 60,
    }
    return baseCosts[trade as keyof typeof baseCosts] || 60
  }

  // Load and transform data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Transform daily logs data
        const transformedDailyLogs = Array.isArray(dailyLogsData)
          ? dailyLogsData.map((log: any) => ({
              id: `log-${log.project_id}-${log.date}`,
              projectId: log.project_id?.toString() || "unknown",
              projectName: log.project_name || "Unknown Project",
              date: log.date,
              submittedBy: log.created_by || "System",
              status: determineLogStatus(log.date) as "submitted" | "pending" | "overdue" | "draft",
              totalWorkers: log.manpower_log?.total_workers || 0,
              totalHours: log.manpower_log?.total_hours || 0,
              weatherConditions: log.weather_report,
              manpowerEntries: log.manpower_log?.entries || [],
              activities: log.activities || [],
              comments: log.comments || "",
            }))
          : []

        // Transform quality control data
        const transformedQualityControl = Array.isArray(qualityControlData)
          ? qualityControlData.map((qc: any) => ({
              id: `qc-${qc.inspection_id}`,
              projectId: qc.project_id?.toString() || "unknown",
              projectName: qc.project_name || "Unknown Project",
              date: qc.inspection_date,
              type: qc.inspection_type,
              trade: qc.trade,
              status: (qc.status?.toLowerCase() === "closed" ? "pass" : "pending") as "pending" | "pass" | "fail",
              location: qc.location,
              createdBy: qc.created_by,
              description: qc.description,
              checklist: qc.checklist || [],
              defects: calculateDefects(qc.checklist),
              issues: extractIssues(qc.checklist),
              attachments: qc.attachments || [],
            }))
          : []

        // Transform safety data
        const transformedSafety = Array.isArray(safetyData)
          ? safetyData.map((safety: any) => ({
              id: `safety-${safety.inspection_id}`,
              projectId: safety.project_id?.toString() || "unknown",
              projectName: safety.project_name || "Unknown Project",
              date: safety.inspection_date,
              type: safety.inspection_type,
              trade: safety.trade,
              status: (safety.status?.toLowerCase() === "closed"
                ? "pass"
                : safety.responses?.some((r: any) => r.response === "At Risk")
                ? "fail"
                : "pass") as "pending" | "pass" | "fail",
              location: safety.location,
              createdBy: safety.created_by,
              description: safety.description,
              responses: safety.responses || [],
              violations: countViolations(safety.responses),
              atRiskItems: countAtRiskItems(safety.responses),
              complianceScore: calculateComplianceScore(safety.responses),
              attachments: safety.attachments || [],
            }))
          : []

        // Extract manpower data from daily logs
        const transformedManpower = transformedDailyLogs.flatMap((log: any) =>
          log.manpowerEntries.map((entry: any, index: number) => ({
            id: `manpower-${log.id}-${index}`,
            projectId: log.projectId,
            projectName: log.projectName,
            date: log.date,
            contractor: entry.contact_company || "Unknown Contractor",
            workers: entry.workers || 0,
            hours: entry.hours || 0,
            totalHours: entry.total_hours || 0,
            location: entry.location || "Unknown Location",
            comments: entry.comments || "",
            trade: inferTradeFromCompany(entry.contact_company),
            efficiency: calculateEfficiency(entry),
            costPerHour: estimateCostPerHour(entry.contact_company),
          }))
        )

        setFieldData({
          dailyLogs: transformedDailyLogs,
          qualityControl: transformedQualityControl,
          safety: transformedSafety,
          manpower: transformedManpower,
        })
      } catch (error) {
        console.error("Error loading field reports data:", error)
        toast({
          title: "Error Loading Data",
          description: "Failed to load field reports data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Calculate business days
  const calculateBusinessDays = (start: Date, end: Date): number => {
    let businessDays = 0
    const currentDate = new Date(start)

    while (currentDate <= end) {
      if (!isWeekend(currentDate)) {
        businessDays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return businessDays
  }

  // Filter field data based on current filters
  const filteredFieldData = useMemo(() => {
    let filteredData = { ...fieldData }

    // Apply project filter
    if (filters.project !== "all") {
      filteredData = {
        dailyLogs: fieldData.dailyLogs.filter((log) => log.projectId === filters.project),
        qualityControl: fieldData.qualityControl.filter((qc) => qc.projectId === filters.project),
        safety: fieldData.safety.filter((safety) => safety.projectId === filters.project),
        manpower: fieldData.manpower.filter((manpower) => manpower.projectId === filters.project),
      }
    }

    // Apply status filter
    if (filters.status !== "all") {
      filteredData.dailyLogs = filteredData.dailyLogs.filter((log) => log.status === filters.status)
      filteredData.qualityControl = filteredData.qualityControl.filter((qc) => qc.status === filters.status)
      filteredData.safety = filteredData.safety.filter((safety) => safety.status === filters.status)
    }

    // Apply contractor filter
    if (filters.contractor !== "all") {
      filteredData.manpower = filteredData.manpower.filter((manpower) => manpower.contractor === filters.contractor)
    }

    // Apply trade filter
    if (filters.trade !== "all") {
      filteredData.qualityControl = filteredData.qualityControl.filter((qc) => qc.trade === filters.trade)
      filteredData.safety = filteredData.safety.filter((safety) => safety.trade === filters.trade)
      filteredData.manpower = filteredData.manpower.filter((manpower) => manpower.trade === filters.trade)
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredData.dailyLogs = filteredData.dailyLogs.filter(
        (log) =>
          log.projectName.toLowerCase().includes(searchLower) ||
          log.submittedBy.toLowerCase().includes(searchLower) ||
          log.comments.toLowerCase().includes(searchLower)
      )
      filteredData.qualityControl = filteredData.qualityControl.filter(
        (qc) =>
          qc.projectName.toLowerCase().includes(searchLower) ||
          qc.description.toLowerCase().includes(searchLower) ||
          qc.location.toLowerCase().includes(searchLower)
      )
      filteredData.safety = filteredData.safety.filter(
        (safety) =>
          safety.projectName.toLowerCase().includes(searchLower) ||
          safety.description.toLowerCase().includes(searchLower) ||
          safety.location.toLowerCase().includes(searchLower)
      )
      filteredData.manpower = filteredData.manpower.filter(
        (manpower) =>
          manpower.projectName.toLowerCase().includes(searchLower) ||
          manpower.contractor.toLowerCase().includes(searchLower) ||
          manpower.location.toLowerCase().includes(searchLower)
      )
    }

    // Apply date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      const fromDate = filters.dateRange.from
      const toDate = filters.dateRange.to

      filteredData.dailyLogs = filteredData.dailyLogs.filter((log) => {
        const logDate = new Date(log.date)
        return logDate >= fromDate && logDate <= toDate
      })
      filteredData.qualityControl = filteredData.qualityControl.filter((qc) => {
        const qcDate = new Date(qc.date)
        return qcDate >= fromDate && qcDate <= toDate
      })
      filteredData.safety = filteredData.safety.filter((safety) => {
        const safetyDate = new Date(safety.date)
        return safetyDate >= fromDate && safetyDate <= toDate
      })
      filteredData.manpower = filteredData.manpower.filter((manpower) => {
        const manpowerDate = new Date(manpower.date)
        return manpowerDate >= fromDate && manpowerDate <= toDate
      })
    }

    return filteredData
  }, [fieldData, filters])

  // Calculate field metrics
  const fieldMetrics = useMemo<FieldReportsStats>(() => {
    if (!filters.dateRange.from || !filters.dateRange.to) {
      return {
        totalLogs: 0,
        logComplianceRate: 0,
        expectedLogs: 0,
        completedLogs: 0,
        totalWorkers: 0,
        averageEfficiency: 0,
        safetyViolations: 0,
        safetyComplianceRate: 0,
        qualityDefects: 0,
        qualityPassRate: 0,
        totalInspections: 0,
        atRiskSafetyItems: 0,
        businessDaysInMonth: 0,
        businessDaysToDate: 0,
      }
    }

    const startDate = filters.dateRange.from
    const endDate = filters.dateRange.to
    const today = new Date()

    const businessDaysInMonth = calculateBusinessDays(startDate, endDate)
    const businessDaysToDate = calculateBusinessDays(startDate, today < endDate ? today : endDate)

    const totalLogs = filteredFieldData.dailyLogs.length
    const completedLogs = filteredFieldData.dailyLogs.filter((log) => log.status === "submitted").length
    const expectedLogs = businessDaysToDate
    const logComplianceRate = expectedLogs > 0 ? (completedLogs / expectedLogs) * 100 : 100

    const totalWorkers = filteredFieldData.manpower.reduce((sum, record) => sum + record.workers, 0)
    const totalEfficiency = filteredFieldData.manpower.reduce((sum, record) => sum + record.efficiency, 0)
    const averageEfficiency =
      filteredFieldData.manpower.length > 0 ? totalEfficiency / filteredFieldData.manpower.length : 0

    const safetyViolations = filteredFieldData.safety.reduce((sum, audit) => sum + audit.violations, 0)
    const totalSafetyResponses = filteredFieldData.safety.reduce((sum, audit) => sum + audit.responses.length, 0)
    const safeSafetyResponses = filteredFieldData.safety.reduce(
      (sum, audit) => sum + audit.responses.filter((r) => r.response === "Safe").length,
      0
    )
    const safetyComplianceRate = totalSafetyResponses > 0 ? (safeSafetyResponses / totalSafetyResponses) * 100 : 100

    const qualityDefects = filteredFieldData.qualityControl.reduce((sum, inspection) => sum + inspection.defects, 0)
    const totalInspections = filteredFieldData.qualityControl.length
    const passedInspections = filteredFieldData.qualityControl.filter(
      (inspection) => inspection.status === "pass"
    ).length
    const qualityPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 100

    const atRiskSafetyItems = filteredFieldData.safety.reduce((sum, audit) => sum + audit.atRiskItems, 0)

    return {
      totalLogs,
      logComplianceRate,
      expectedLogs,
      completedLogs,
      totalWorkers,
      averageEfficiency,
      safetyViolations,
      safetyComplianceRate,
      qualityDefects,
      qualityPassRate,
      totalInspections,
      atRiskSafetyItems,
      businessDaysInMonth,
      businessDaysToDate,
    }
  }, [filteredFieldData, filters.dateRange])

  // Handle export
  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      const projectName = "Field Reports Project" // Get from context or props

      // Transform data to match expected export structure
      const exportData = {
        dailyLogs: fieldData.dailyLogs,
        manpower: fieldData.manpower,
        safetyAudits: fieldData.safety,
        qualityInspections: fieldData.qualityControl,
      }

      switch (format) {
        case "pdf":
          FieldReportsExportUtils.exportToPDF(exportData, fieldMetrics, projectName)
          break
        case "excel":
          FieldReportsExportUtils.exportToExcel(exportData, fieldMetrics, projectName)
          break
        case "csv":
          FieldReportsExportUtils.exportToCSV(exportData, projectName)
          break
      }

      toast({
        title: "Export Successful",
        description: `Field reports data exported as ${format.toUpperCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export field reports data. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    toast({
      title: "Refreshing Data",
      description: "Field reports data is being updated...",
    })
    // In a real app, this would trigger a data refresh
  }

  // Handle project selection for filtering
  const handleProjectSelect = (projectId: string) => {
    setFilters((prev) => ({ ...prev, project: projectId }))
  }

  // Handle clearing project filter
  const handleClearProjectFilter = () => {
    setFilters((prev) => ({ ...prev, project: "all" }))
  }

  // Get role-based scope description
  const getScopeDescription = (userRole: string = "project_manager") => {
    switch (userRole) {
      case "executive":
        return "Enterprise Portfolio View - All projects across the organization"
      case "portfolio_manager":
        return "Portfolio View - Multiple projects under your supervision"
      default:
        return "Single Project View - Current project field reporting"
    }
  }

  // Handle fullscreen toggle
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullscreen])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading field reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-[9999]" : ""}`}>
      <AppHeader />

      <div className="space-y-6 p-6">
        {!isFullscreen && (
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
                    <BreadcrumbPage>Field Reports</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Field Reports</h1>
                  <p className="text-muted-foreground mt-1">
                    Daily logs, safety audits, quality inspections, and manpower tracking
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setShowExportModal(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
                    <Maximize className="h-4 w-4 mr-2" />
                    {isFullscreen ? "Exit" : "Fullscreen"}
                  </Button>
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
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-muted-foreground">Total Logs</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.totalLogs}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-muted-foreground">Compliance</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.logComplianceRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-muted-foreground">Total Workers</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.totalWorkers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm text-muted-foreground">Safety Score</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.safetyComplianceRate.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-hb-orange hover:bg-hb-orange/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Daily Log
                    </Button>
                    <Button variant="outline" onClick={handleRefresh} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button variant="outline" onClick={() => setShowExportModal(true)} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)} className="w-full">
                      <Maximize className="h-4 w-4 mr-2" />
                      Fullscreen View
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
                        <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-muted-foreground">View Type</span>
                      </div>
                      <Badge variant="outline">
                        {user?.role === "executive"
                          ? "Enterprise"
                          : user?.role === "portfolio_manager"
                          ? "Portfolio"
                          : "Project"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-muted-foreground">Role</span>
                      </div>
                      <span className="font-semibold">{user?.role || "viewer"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{getScopeDescription(user?.role)}</div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm text-muted-foreground">Efficiency</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.averageEfficiency.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-muted-foreground">Safety Issues</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.safetyViolations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-muted-foreground">Quality Pass</span>
                      </div>
                      <span className="font-semibold">{fieldMetrics.qualityPassRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-muted-foreground">On Schedule</span>
                      </div>
                      <span className="font-semibold">
                        {fieldMetrics.businessDaysToDate}/{fieldMetrics.businessDaysInMonth}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-9">
                {/* HBI Insights */}
                <div className="mb-6">
                  <HbiFieldReportsInsights
                    data={{
                      dailyLogs: filteredFieldData.dailyLogs,
                      manpower: filteredFieldData.manpower,
                      safetyAudits: filteredFieldData.safety,
                      qualityInspections: filteredFieldData.qualityControl,
                    }}
                    stats={fieldMetrics}
                  />
                </div>

                {/* Project Field Reports Summary - Executive and Project Executive only */}
                {(user?.role === "executive" || user?.role === "project-executive") && (
                  <div className="mb-6" data-tour="project-field-reports-summary">
                    <ProjectFieldReportsSummary
                      data={fieldData}
                      selectedProject={filters.project}
                      onProjectSelect={handleProjectSelect}
                      onClearFilter={handleClearProjectFilter}
                    />
                  </div>
                )}

                {/* Main Content Tabs */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <div className="flex space-x-1 p-1 bg-muted rounded-lg mb-6">
                        <button
                          onClick={() => setActiveTab("overview")}
                          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "overview"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <BarChart3 className="h-4 w-4" />
                          Overview
                        </button>
                        <button
                          onClick={() => setActiveTab("daily-logs")}
                          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "daily-logs"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <FileText className="h-4 w-4" />
                          Daily Logs
                        </button>
                        <button
                          onClick={() => setActiveTab("safety")}
                          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "safety"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Shield className="h-4 w-4" />
                          Safety Audits
                        </button>
                        <button
                          onClick={() => setActiveTab("quality")}
                          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === "quality"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Quality Control
                        </button>
                      </div>

                      <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Field reports overview content would go here */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Recent Daily Logs</CardTitle>
                              <CardDescription>Latest field reporting activity</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {filteredFieldData.dailyLogs.slice(0, 5).map((log) => (
                                  <div
                                    key={log.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                                  >
                                    <div>
                                      <div className="font-medium text-sm">{log.projectName}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {format(new Date(log.date), "MMM d, yyyy")}
                                      </div>
                                    </div>
                                    <Badge
                                      variant={
                                        log.status === "submitted"
                                          ? "default"
                                          : log.status === "pending"
                                          ? "secondary"
                                          : "destructive"
                                      }
                                    >
                                      {log.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Safety Performance</CardTitle>
                              <CardDescription>Recent safety audit results</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {filteredFieldData.safety.slice(0, 5).map((safety) => (
                                  <div
                                    key={safety.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                                  >
                                    <div>
                                      <div className="font-medium text-sm">{safety.type}</div>
                                      <div className="text-xs text-muted-foreground">{safety.location}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={safety.status === "pass" ? "default" : "destructive"}>
                                        {safety.status}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">{safety.complianceScore}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="daily-logs" className="mt-0">
                        <DailyLogSubTab
                          data={{
                            dailyLogs: filteredFieldData.dailyLogs,
                            manpower: filteredFieldData.manpower,
                          }}
                          stats={fieldMetrics}
                          userRole={user?.role}
                          onRefresh={handleRefresh}
                        />
                      </TabsContent>

                      <TabsContent value="safety" className="mt-0">
                        <SafetyAuditsSubTab
                          data={{
                            safetyAudits: filteredFieldData.safety,
                          }}
                          stats={fieldMetrics}
                          userRole={user?.role}
                          onRefresh={handleRefresh}
                        />
                      </TabsContent>

                      <TabsContent value="quality" className="mt-0">
                        <QualityControlSubTab
                          data={{
                            qualityInspections: filteredFieldData.qualityControl,
                          }}
                          stats={fieldMetrics}
                          userRole={user?.role}
                          onRefresh={handleRefresh}
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Field Reports Management
                        </h3>
                        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                          <p>
                            <strong>Daily Logs:</strong> Track daily activities, manpower, weather conditions, and
                            project progress. Ensure logs are submitted daily for compliance tracking.
                          </p>
                          <p>
                            <strong>Safety Audits:</strong> Monitor safety compliance through regular inspections and
                            audits. Address at-risk items immediately to maintain safety standards.
                          </p>
                          <p>
                            <strong>Quality Control:</strong> Document quality inspections and defects to ensure project
                            quality standards. Track resolution of quality issues and maintain pass rate targets.
                          </p>
                          <p>
                            <strong>Export & Reporting:</strong> Generate comprehensive reports for stakeholders,
                            regulatory compliance, and project documentation. Use HBI insights for proactive field
                            management.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Field Reports</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => {
                  handleExport("pdf")
                  setShowExportModal(false)
                }}
                className="justify-start gap-3 h-12"
                variant="outline"
              >
                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div className="text-left">
                  <div className="font-medium">Export as PDF</div>
                  <div className="text-sm text-muted-foreground">Comprehensive report with charts</div>
                </div>
              </Button>

              <Button
                onClick={() => {
                  handleExport("excel")
                  setShowExportModal(false)
                }}
                className="justify-start gap-3 h-12"
                variant="outline"
              >
                <FileSpreadsheet className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="text-left">
                  <div className="font-medium">Export as Excel</div>
                  <div className="text-sm text-muted-foreground">Structured data for analysis</div>
                </div>
              </Button>

              <Button
                onClick={() => {
                  handleExport("csv")
                  setShowExportModal(false)
                }}
                className="justify-start gap-3 h-12"
                variant="outline"
              >
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="text-left">
                  <div className="font-medium">Export as CSV</div>
                  <div className="text-sm text-muted-foreground">Raw data for external tools</div>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
