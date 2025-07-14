/**
 * @fileoverview Enhanced Quality Metrics Panel Component with Protected Grid
 * @module QualityMetricsPanel
 * @version 2.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Component for displaying comprehensive quality metrics and performance tracking
 * Features: Protected grid data display, inspection analytics, punch item tracking, trend analysis
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ProtectedGrid, ProtectedColDef, GridRow, GridConfig } from "../ui/protected-grid"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { format } from "date-fns"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Star,
  Target,
  AlertTriangle,
  CheckCircle,
  ClipboardCheck,
  RefreshCw,
  Download,
  Filter,
  Calendar as CalendarIcon,
  PieChart,
  LineChart,
  Activity,
  Building,
  Users,
  Wrench,
  Search,
  Eye,
  FileText,
  Timer,
  XCircle,
} from "lucide-react"

interface QualityMetricsPanelProps {
  userRole?: string
}

interface InspectionData extends GridRow {
  id: string
  projectName: string
  trade: string
  area: string
  phase: string
  inspectionType: string
  inspector: string
  date: string
  status: "Passed" | "Failed" | "Conditional" | "Pending"
  score: number
  defects: number
  notes: string
  correctionDate?: string
  followUpRequired: boolean
}

interface PunchItemData extends GridRow {
  id: string
  projectName: string
  trade: string
  area: string
  category: string
  description: string
  priority: "Critical" | "High" | "Medium" | "Low"
  assignedTo: string
  createdDate: string
  dueDate: string
  status: "Open" | "In Progress" | "Resolved" | "Verified" | "Closed"
  resolvedDate?: string
  cost: number
  photos: number
}

export const QualityMetricsPanel: React.FC<QualityMetricsPanelProps> = ({ userRole = "user" }) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedTrade, setSelectedTrade] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for inspections
  const inspectionData: InspectionData[] = useMemo(
    () => [
      {
        id: "INS-001",
        projectName: "Medical Center East",
        trade: "Electrical",
        area: "OR Suite 1",
        phase: "Rough-In",
        inspectionType: "Fire Safety",
        inspector: "John Smith",
        date: "2025-01-14",
        status: "Passed",
        score: 96,
        defects: 2,
        notes: "Minor conduit spacing issues corrected on-site",
        followUpRequired: false,
      },
      {
        id: "INS-002",
        projectName: "Tech Campus Phase 2",
        trade: "HVAC",
        area: "Server Room",
        phase: "Final",
        inspectionType: "System Testing",
        inspector: "Sarah Johnson",
        date: "2025-01-13",
        status: "Failed",
        score: 72,
        defects: 8,
        notes: "Ductwork leakage exceeds tolerance. Repair required.",
        correctionDate: "2025-01-20",
        followUpRequired: true,
      },
      {
        id: "INS-003",
        projectName: "Marina Bay Plaza",
        trade: "Plumbing",
        area: "Restroom Block A",
        phase: "Rough-In",
        inspectionType: "Pressure Test",
        inspector: "Mike Davis",
        date: "2025-01-12",
        status: "Passed",
        score: 94,
        defects: 1,
        notes: "All systems within specifications",
        followUpRequired: false,
      },
      {
        id: "INS-004",
        projectName: "Tropical World Nursery",
        trade: "Concrete",
        area: "Foundation Section C",
        phase: "Pour",
        inspectionType: "Structural",
        inspector: "Lisa Brown",
        date: "2025-01-11",
        status: "Conditional",
        score: 85,
        defects: 4,
        notes: "Surface finish requires attention before proceeding",
        correctionDate: "2025-01-18",
        followUpRequired: true,
      },
      {
        id: "INS-005",
        projectName: "Grandview Heights",
        trade: "Framing",
        area: "Building 2 - Level 3",
        phase: "Structural",
        inspectionType: "Code Compliance",
        inspector: "Tom Wilson",
        date: "2025-01-10",
        status: "Passed",
        score: 98,
        defects: 0,
        notes: "Excellent workmanship. No defects identified.",
        followUpRequired: false,
      },
      {
        id: "INS-006",
        projectName: "Medical Center East",
        trade: "Electrical",
        area: "Emergency Department",
        phase: "Final",
        inspectionType: "Life Safety",
        inspector: "John Smith",
        date: "2025-01-09",
        status: "Pending",
        score: 0,
        defects: 0,
        notes: "Inspection scheduled for completion",
        followUpRequired: false,
      },
    ],
    []
  )

  // Mock data for punch items
  const punchItemData: PunchItemData[] = useMemo(
    () => [
      {
        id: "PI-001",
        projectName: "Medical Center East",
        trade: "Electrical",
        area: "OR Suite 1",
        category: "Installation",
        description: "Emergency lighting fixture not properly secured",
        priority: "High",
        assignedTo: "ABC Electric",
        createdDate: "2025-01-12",
        dueDate: "2025-01-19",
        status: "In Progress",
        cost: 250,
        photos: 3,
      },
      {
        id: "PI-002",
        projectName: "Tech Campus Phase 2",
        trade: "HVAC",
        area: "Server Room",
        category: "Performance",
        description: "Ductwork leakage at joint connections",
        priority: "Critical",
        assignedTo: "Cool Air Systems",
        createdDate: "2025-01-13",
        dueDate: "2025-01-20",
        status: "Open",
        cost: 1200,
        photos: 5,
      },
      {
        id: "PI-003",
        projectName: "Marina Bay Plaza",
        trade: "Finishes",
        area: "Lobby",
        category: "Cosmetic",
        description: "Tile grout inconsistent color",
        priority: "Medium",
        assignedTo: "Premier Tile",
        createdDate: "2025-01-08",
        dueDate: "2025-01-22",
        status: "Resolved",
        resolvedDate: "2025-01-15",
        cost: 450,
        photos: 2,
      },
      {
        id: "PI-004",
        projectName: "Tropical World Nursery",
        trade: "Concrete",
        area: "Foundation Section C",
        category: "Structural",
        description: "Surface finish texture variation",
        priority: "Low",
        assignedTo: "Solid Foundation Co",
        createdDate: "2025-01-11",
        dueDate: "2025-01-25",
        status: "Open",
        cost: 800,
        photos: 4,
      },
      {
        id: "PI-005",
        projectName: "Grandview Heights",
        trade: "Plumbing",
        area: "Building 2 - Level 1",
        category: "Installation",
        description: "Water pressure variance in test results",
        priority: "High",
        assignedTo: "Flow Pro Plumbing",
        createdDate: "2025-01-07",
        dueDate: "2025-01-17",
        status: "Verified",
        resolvedDate: "2025-01-14",
        cost: 320,
        photos: 1,
      },
      {
        id: "PI-006",
        projectName: "Medical Center East",
        trade: "Fire Protection",
        area: "Stairwell B",
        category: "Safety",
        description: "Sprinkler head clearance insufficient",
        priority: "Critical",
        assignedTo: "Fire Safe Systems",
        createdDate: "2025-01-10",
        dueDate: "2025-01-17",
        status: "Closed",
        resolvedDate: "2025-01-16",
        cost: 150,
        photos: 2,
      },
    ],
    []
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter data based on current filters
  const filteredInspectionData = useMemo(() => {
    return inspectionData.filter((item) => {
      const matchesProject = selectedProject === "all" || item.projectName === selectedProject
      const matchesTrade = selectedTrade === "all" || item.trade === selectedTrade
      const matchesSearch =
        searchTerm === "" ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.inspector.toLowerCase().includes(searchTerm.toLowerCase())

      const itemDate = new Date(item.date)
      const matchesDateRange = (!dateFrom || itemDate >= dateFrom) && (!dateTo || itemDate <= dateTo)

      return matchesProject && matchesTrade && matchesSearch && matchesDateRange
    })
  }, [inspectionData, selectedProject, selectedTrade, searchTerm, dateFrom, dateTo])

  const filteredPunchItemData = useMemo(() => {
    return punchItemData.filter((item) => {
      const matchesProject = selectedProject === "all" || item.projectName === selectedProject
      const matchesTrade = selectedTrade === "all" || item.trade === selectedTrade
      const matchesSearch =
        searchTerm === "" ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

      const itemDate = new Date(item.createdDate)
      const matchesDateRange = (!dateFrom || itemDate >= dateFrom) && (!dateTo || itemDate <= dateTo)

      return matchesProject && matchesTrade && matchesSearch && matchesDateRange
    })
  }, [punchItemData, selectedProject, selectedTrade, searchTerm, dateFrom, dateTo])

  // Get unique values for filters
  const projects = useMemo(() => {
    const allProjects = [
      ...new Set([...inspectionData.map((i) => i.projectName), ...punchItemData.map((p) => p.projectName)]),
    ]
    return allProjects.sort()
  }, [inspectionData, punchItemData])

  const trades = useMemo(() => {
    const allTrades = [...new Set([...inspectionData.map((i) => i.trade), ...punchItemData.map((p) => p.trade)])]
    return allTrades.sort()
  }, [inspectionData, punchItemData])

  // Calculate key metrics
  const qualityMetrics = useMemo(() => {
    const totalInspections = filteredInspectionData.length
    const passedInspections = filteredInspectionData.filter((i) => i.status === "Passed").length
    const failedInspections = filteredInspectionData.filter((i) => i.status === "Failed").length
    const passRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

    const totalPunchItems = filteredPunchItemData.length
    const openPunchItems = filteredPunchItemData.filter((p) => ["Open", "In Progress"].includes(p.status)).length
    const resolvedPunchItems = filteredPunchItemData.filter((p) =>
      ["Resolved", "Verified", "Closed"].includes(p.status)
    ).length
    const resolutionRate = totalPunchItems > 0 ? (resolvedPunchItems / totalPunchItems) * 100 : 0

    const avgScore =
      filteredInspectionData.length > 0
        ? filteredInspectionData.reduce((sum, i) => sum + i.score, 0) / filteredInspectionData.length
        : 0

    const totalDefects = filteredInspectionData.reduce((sum, i) => sum + i.defects, 0)
    const avgDefectsPerInspection = totalInspections > 0 ? totalDefects / totalInspections : 0

    return {
      passRate,
      resolutionRate,
      avgScore,
      avgDefectsPerInspection,
      totalInspections,
      passedInspections,
      failedInspections,
      totalPunchItems,
      openPunchItems,
      resolvedPunchItems,
    }
  }, [filteredInspectionData, filteredPunchItemData])

  // Define column definitions for inspections grid
  const inspectionColumns: ProtectedColDef[] = [
    { field: "id", headerName: "ID", width: 100, pinned: "left" },
    { field: "projectName", headerName: "Project", width: 180, pinned: "left" },
    { field: "trade", headerName: "Trade", width: 120 },
    { field: "area", headerName: "Area", width: 150 },
    { field: "phase", headerName: "Phase", width: 120 },
    { field: "inspectionType", headerName: "Type", width: 130 },
    { field: "inspector", headerName: "Inspector", width: 130 },
    { field: "date", headerName: "Date", width: 110, type: "date" },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value
        const colorMap = {
          Passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          Conditional: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          Pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        }
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${
          colorMap[status as keyof typeof colorMap] || ""
        }">${status}</span>`
      },
    },
    { field: "score", headerName: "Score", width: 100, type: "number" },
    { field: "defects", headerName: "Defects", width: 100, type: "number" },
    { field: "notes", headerName: "Notes", width: 250, wrapText: true, autoHeight: true },
    { field: "followUpRequired", headerName: "Follow-up", width: 120, type: "boolean" },
  ]

  // Define column definitions for punch items grid
  const punchItemColumns: ProtectedColDef[] = [
    { field: "id", headerName: "ID", width: 100, pinned: "left" },
    { field: "projectName", headerName: "Project", width: 180, pinned: "left" },
    { field: "trade", headerName: "Trade", width: 120 },
    { field: "area", headerName: "Area", width: 150 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "description", headerName: "Description", width: 250, wrapText: true, autoHeight: true },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      cellRenderer: (params: any) => {
        const priority = params.value
        const colorMap = {
          Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
          Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        }
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${
          colorMap[priority as keyof typeof colorMap] || ""
        }">${priority}</span>`
      },
    },
    { field: "assignedTo", headerName: "Assigned To", width: 150 },
    { field: "createdDate", headerName: "Created", width: 110, type: "date" },
    { field: "dueDate", headerName: "Due Date", width: 110, type: "date" },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value
        const colorMap = {
          Open: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          Resolved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          Verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          Closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
        }
        return `<span class="px-2 py-1 text-xs font-medium rounded-full ${
          colorMap[status as keyof typeof colorMap] || ""
        }">${status}</span>`
      },
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 120,
      type: "number",
      valueFormatter: (params: any) => `$${params.value?.toLocaleString() || 0}`,
    },
    { field: "photos", headerName: "Photos", width: 100, type: "number" },
  ]

  const gridConfig: GridConfig = {
    allowExport: true,
    allowImport: false,
    allowRowSelection: true,
    allowMultiSelection: true,
    allowColumnReordering: true,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: false,
    showToolbar: true,
    showStatusBar: true,
    enableRangeSelection: false,
    protectionEnabled: true,
    userRole: userRole,
    theme: "quartz",
    enableTotalsRow: true,
    stickyColumnsCount: 2,
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // Implementation for export functionality
    console.log("Exporting quality metrics data...")
  }

  const clearFilters = () => {
    setSelectedProject("all")
    setSelectedTrade("all")
    setSearchTerm("")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const handleResolveIssue = (issueId: string, failureReason: string) => {
    console.log(`Resolving QC issue ${issueId} with failure reason: ${failureReason}`)
    // Trigger AI-powered lessons learned generation when QC issue is resolved with failure reason
    if (failureReason && failureReason.trim() !== "") {
      triggerLessonsLearnedGeneration("qc_issue", issueId, failureReason)
    }
  }

  const triggerLessonsLearnedGeneration = (sourceType: string, sourceId: string, failureReason: string) => {
    console.log(`Triggering lessons learned generation for ${sourceType} ${sourceId}`)
    console.log(`Failure reason: ${failureReason}`)

    // This would integrate with the HBI AI model to auto-generate:
    // - Root cause analysis
    // - Recommended prevention strategies
    // - New or updated checklist items
    // - Risk mitigation recommendations

    // Mock AI generation trigger
    const aiAnalysisPrompt = {
      sourceType,
      sourceId,
      failureReason,
      projectContext: "construction quality control",
      generateRootCause: true,
      generatePrevention: true,
      generateChecklistItems: true,
      generateRiskMitigation: true,
    }

    // In a real implementation, this would call the HBI AI API
    console.log("HBI Analysis Request:", aiAnalysisPrompt)

    // Show notification that lessons learned is being generated
    // This would integrate with the LessonsLearnedNotices component
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quality Metrics & Performance Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive inspection tracking, punch item management, and quality trend analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Project Filter */}
            <div className="space-y-2">
              <Label htmlFor="project-filter">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trade Filter */}
            <div className="space-y-2">
              <Label htmlFor="trade-filter">Trade</Label>
              <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                <SelectTrigger>
                  <SelectValue placeholder="All Trades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  {trades.map((trade) => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Inspection Pass Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-600">{qualityMetrics.passRate.toFixed(1)}%</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">+2.3%</span>
                  </div>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {qualityMetrics.passedInspections} of {qualityMetrics.totalInspections} inspections passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Punch Item Resolution</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-600">{qualityMetrics.resolutionRate.toFixed(1)}%</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">+5.2%</span>
                  </div>
                </div>
              </div>
              <ClipboardCheck className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {qualityMetrics.resolvedPunchItems} of {qualityMetrics.totalPunchItems} items resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Average Quality Score</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-purple-600">{qualityMetrics.avgScore.toFixed(1)}</p>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">+1.8</span>
                  </div>
                </div>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Excellent performance rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Defects/Inspection</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-600">
                    {qualityMetrics.avgDefectsPerInspection.toFixed(1)}
                  </p>
                  <div className="flex items-center text-green-600">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-xs">-0.3</span>
                  </div>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Decreasing trend - good progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="punch-items">Punch Items</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inspection Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Inspection Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: "Passed", count: qualityMetrics.passedInspections, color: "green" },
                    { status: "Failed", count: qualityMetrics.failedInspections, color: "red" },
                    {
                      status: "Conditional",
                      count: filteredInspectionData.filter((i) => i.status === "Conditional").length,
                      color: "yellow",
                    },
                    {
                      status: "Pending",
                      count: filteredInspectionData.filter((i) => i.status === "Pending").length,
                      color: "blue",
                    },
                  ].map((item) => {
                    const percentage =
                      qualityMetrics.totalInspections > 0 ? (item.count / qualityMetrics.totalInspections) * 100 : 0
                    return (
                      <div key={item.status} className="flex items-center justify-between">
                        <span className="text-sm">{item.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-${item.color}-600`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <Badge variant="outline" className="text-xs min-w-[60px] text-center">
                            {item.count} ({percentage.toFixed(0)}%)
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Punch Item Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Punch Item Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      status: "Open",
                      count: filteredPunchItemData.filter((p) => p.status === "Open").length,
                      color: "red",
                    },
                    {
                      status: "In Progress",
                      count: filteredPunchItemData.filter((p) => p.status === "In Progress").length,
                      color: "yellow",
                    },
                    {
                      status: "Resolved",
                      count: filteredPunchItemData.filter((p) => p.status === "Resolved").length,
                      color: "blue",
                    },
                    {
                      status: "Verified",
                      count: filteredPunchItemData.filter((p) => p.status === "Verified").length,
                      color: "green",
                    },
                    {
                      status: "Closed",
                      count: filteredPunchItemData.filter((p) => p.status === "Closed").length,
                      color: "gray",
                    },
                  ].map((item) => {
                    const percentage =
                      qualityMetrics.totalPunchItems > 0 ? (item.count / qualityMetrics.totalPunchItems) * 100 : 0
                    return (
                      <div key={item.status} className="flex items-center justify-between">
                        <span className="text-sm">{item.status}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-${item.color}-600`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <Badge variant="outline" className="text-xs min-w-[60px] text-center">
                            {item.count} ({percentage.toFixed(0)}%)
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quality by Trade Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Quality Performance by Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trades.map((trade) => {
                  const tradeInspections = filteredInspectionData.filter((i) => i.trade === trade)
                  const tradePunchItems = filteredPunchItemData.filter((p) => p.trade === trade)
                  const tradePassRate =
                    tradeInspections.length > 0
                      ? (tradeInspections.filter((i) => i.status === "Passed").length / tradeInspections.length) * 100
                      : 0
                  const tradeAvgScore =
                    tradeInspections.length > 0
                      ? tradeInspections.reduce((sum, i) => sum + i.score, 0) / tradeInspections.length
                      : 0

                  return (
                    <Card key={trade} className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{trade}</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Pass Rate:</span>
                            <Badge variant="outline">{tradePassRate.toFixed(1)}%</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Avg Score:</span>
                            <Badge variant="outline">{tradeAvgScore.toFixed(1)}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Inspections:</span>
                            <Badge variant="outline">{tradeInspections.length}</Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Punch Items:</span>
                            <Badge variant="outline">{tradePunchItems.length}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Inspection Results Data Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={inspectionColumns}
                rowData={filteredInspectionData}
                config={gridConfig}
                height="600px"
                enableSearch={false}
                title="Quality Inspections"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="punch-items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Punch Items Management Grid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={punchItemColumns}
                rowData={filteredPunchItemData}
                config={gridConfig}
                height="600px"
                enableSearch={false}
                title="Punch Items"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Quality Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Quality Trend Charts</h3>
                    <p className="text-muted-foreground">Time-series quality performance analysis</p>
                    <p className="text-xs text-muted-foreground mt-2">Interactive charts coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
                    <p className="text-muted-foreground">Project-specific quality trend lines</p>
                    <p className="text-xs text-muted-foreground mt-2">Advanced analytics dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
