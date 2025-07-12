"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  DollarSign,
  Percent,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  FileText,
  Zap,
  TableIcon,
  Search,
  Filter,
  Download,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  TestTube,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"
import { CollapseWrapper } from "@/components/ui/collapse-wrapper"
import { useFinancialHubStore } from "@/hooks/use-financial-hub-store"
import {
  ProtectedGrid,
  createProtectedColumn,
  createReadOnlyColumn,
  createLockedColumn,
} from "@/components/ui/protected-grid"
import type { ProtectedColDef, GridRow } from "@/components/ui/protected-grid"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts"

// Import budget data
import budgetData from "@/data/mock/financial/budget.json"

interface BudgetAnalysisProps {
  userRole: string
  projectData: any
  initialViewMode?: string
  hideViewToggle?: boolean
  className?: string
}

// Budget item interface
interface BudgetItem {
  project_id: number
  "Sub Job": string
  "Cost Code Tier 1": string
  "Cost Code Tier 2": string
  "Cost Code Tier 3": string
  "Cost Type": string
  "Budget Code": string
  "Budget Code Description": string
  "Original Budget Amount": number
  "Budget Modifications": number
  "Approved COs": number
  "Revised Budget": number
  "Pending Budget Changes": number
  "Projected Budget": number
  "Committed Costs": number
  "Direct Costs": number
  "Job to Date Costs": number
  "Pending Cost Changes": number
  "Projected Costs": number
  "Forecast To Complete": number
  "Estimated Cost at Completion": number
  "Projected over Under": number
}

// Enhanced role-based budget data with realistic scaling
const getRoleBasedBudgetData = (role: string) => {
  const baseData = {
    "project-manager": {
      totalOriginalBudget: 57235491,
      totalRevisedBudget: 58100000,
      totalActualCosts: 45250000,
      totalCommittedCosts: 52800000,
      totalForecastToComplete: 8950000,
      totalEstimatedAtCompletion: 54200000,
      contingencyAvailable: 3900000,
      changeOrderTotal: 864509,
      budgetVariance: 3900000,
      utilizationRate: 0.785,
      completionPercentage: 0.778,
      costPerformanceIndex: 1.072,
      schedulePerformanceIndex: 0.965,
      projectCount: 1,
    },
    "project-executive": {
      totalOriginalBudget: 285476455,
      totalRevisedBudget: 290500000,
      totalActualCosts: 226250000,
      totalCommittedCosts: 264000000,
      totalForecastToComplete: 44750000,
      totalEstimatedAtCompletion: 271000000,
      contingencyAvailable: 19500000,
      changeOrderTotal: 5024509,
      budgetVariance: 19500000,
      utilizationRate: 0.778,
      completionPercentage: 0.765,
      costPerformanceIndex: 1.068,
      schedulePerformanceIndex: 0.951,
      projectCount: 6,
    },
    executive: {
      totalOriginalBudget: 485280760,
      totalRevisedBudget: 492500000,
      totalActualCosts: 384200000,
      totalCommittedCosts: 448800000,
      totalForecastToComplete: 76000000,
      totalEstimatedAtCompletion: 460200000,
      contingencyAvailable: 32300000,
      changeOrderTotal: 7219240,
      budgetVariance: 32300000,
      utilizationRate: 0.78,
      completionPercentage: 0.772,
      costPerformanceIndex: 1.07,
      schedulePerformanceIndex: 0.958,
      projectCount: 12,
    },
  }

  return baseData[role as keyof typeof baseData] || baseData["executive"]
}

// Mock budget breakdown by categories
const budgetCategories = [
  {
    category: "General Conditions",
    budgeted: 8500000,
    actual: 7200000,
    committed: 7800000,
    forecast: 8100000,
    variance: 400000,
    variancePercent: 4.7,
    color: "#3b82f6",
  },
  {
    category: "Main Construction",
    budgeted: 32500000,
    actual: 28200000,
    committed: 30800000,
    forecast: 31200000,
    variance: 1300000,
    variancePercent: 4.0,
    color: "#10b981",
  },
  {
    category: "Materials",
    budgeted: 12800000,
    actual: 10950000,
    committed: 12100000,
    forecast: 12400000,
    variance: 400000,
    variancePercent: 3.1,
    color: "#f59e0b",
  },
  {
    category: "Labor",
    budgeted: 15200000,
    actual: 13500000,
    committed: 14800000,
    forecast: 15000000,
    variance: 200000,
    variancePercent: 1.3,
    color: "#ef4444",
  },
  {
    category: "Equipment",
    budgeted: 6800000,
    actual: 5950000,
    committed: 6400000,
    forecast: 6600000,
    variance: 200000,
    variancePercent: 2.9,
    color: "#8b5cf6",
  },
  {
    category: "Subcontractors",
    budgeted: 18500000,
    actual: 16200000,
    committed: 17800000,
    forecast: 18100000,
    variance: 400000,
    variancePercent: 2.2,
    color: "#06b6d4",
  },
]

// Monthly budget performance data
const monthlyPerformance = [
  { month: "Jan", budgeted: 2800000, actual: 2650000, forecast: 2750000, variance: 150000, cpi: 1.06 },
  { month: "Feb", budgeted: 3200000, actual: 3100000, forecast: 3150000, variance: 100000, cpi: 1.03 },
  { month: "Mar", budgeted: 4100000, actual: 3950000, forecast: 4050000, variance: 150000, cpi: 1.04 },
  { month: "Apr", budgeted: 5200000, actual: 4980000, forecast: 5100000, variance: 220000, cpi: 1.04 },
  { month: "May", budgeted: 6800000, actual: 6450000, forecast: 6650000, variance: 350000, cpi: 1.05 },
  { month: "Jun", budgeted: 8500000, actual: 8100000, forecast: 8300000, variance: 400000, cpi: 1.05 },
  { month: "Jul", budgeted: 10200000, actual: 9750000, forecast: 10000000, variance: 450000, cpi: 1.05 },
  { month: "Aug", budgeted: 12100000, actual: 11600000, forecast: 11900000, variance: 500000, cpi: 1.04 },
]

type ViewMode = "overview" | "categories" | "variance" | "budget"

type SortField = keyof BudgetItem
type SortDirection = "asc" | "desc"

export default function BudgetAnalysis({
  userRole,
  projectData,
  initialViewMode = "overview",
  hideViewToggle = false,
  className,
}: BudgetAnalysisProps) {
  const { isFullscreen, toggleFullscreen } = useFinancialHubStore()

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode as ViewMode)
  const [searchTerm, setSearchTerm] = useState("")
  const [useBetaGrid, setUseBetaGrid] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Update view mode when initialViewMode changes
  useEffect(() => {
    setViewMode(initialViewMode as ViewMode)
  }, [initialViewMode])
  const [sortField, setSortField] = useState<SortField>("Budget Code")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isBudgetTableFullscreen, setIsBudgetTableFullscreen] = useState(false)

  // Filter budget data to single project (2525840 - Palm Beach Luxury Estate)
  const filteredBudgetData = useMemo(() => {
    return (budgetData as BudgetItem[]).filter((item) => item.project_id === 2525840)
  }, [])

  // Get role-based budget data
  const summaryData = getRoleBasedBudgetData(userRole)

  // Calculate key performance indicators
  const budgetUtilization = (summaryData.totalActualCosts / summaryData.totalRevisedBudget) * 100
  const remainingBudget = summaryData.totalRevisedBudget - summaryData.totalActualCosts
  const projectedVariance = summaryData.totalRevisedBudget - summaryData.totalEstimatedAtCompletion
  const changeOrderImpact = (summaryData.changeOrderTotal / summaryData.totalOriginalBudget) * 100

  // Performance status
  const getPerformanceStatus = (variance: number) => {
    if (variance > 0) return { status: "under", color: "text-green-600", icon: CheckCircle }
    if (variance > -500000) return { status: "on-track", color: "text-yellow-600", icon: AlertTriangle }
    return { status: "over", color: "text-red-600", icon: XCircle }
  }

  const performanceStatus = getPerformanceStatus(projectedVariance)

  // Risk level assessment
  const riskLevel =
    summaryData.costPerformanceIndex < 0.95 ? "high" : summaryData.costPerformanceIndex < 1.05 ? "medium" : "low"

  // Budget table search and sort functionality
  const processedBudgetData = useMemo(() => {
    let data = [...filteredBudgetData]

    // Apply search filter
    if (searchTerm) {
      data = data.filter(
        (item) =>
          item["Cost Code Tier 3"].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item["Cost Type"].toLowerCase().includes(searchTerm.toLowerCase()) ||
          item["Budget Code Description"].toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    data.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })

    return data
  }, [filteredBudgetData, searchTerm, sortField, sortDirection])

  // Transform budget data for ProtectedGrid
  const createProtectedBudgetData = useMemo(() => {
    return processedBudgetData.map((item, index) => ({
      id: `budget-${index}`,
      costCode: item["Cost Code Tier 3"],
      costType: item["Cost Type"],
      budgetCode: item["Budget Code"],
      description: item["Budget Code Description"],
      originalBudget: item["Original Budget Amount"],
      budgetModifications: item["Budget Modifications"],
      approvedCOs: item["Approved COs"],
      revisedBudget: item["Revised Budget"],
      pendingBudgetChanges: item["Pending Budget Changes"],
      projectedBudget: item["Projected Budget"],
      committedCosts: item["Committed Costs"],
      directCosts: item["Direct Costs"],
      jtdCosts: item["Job to Date Costs"],
      pendingCostChanges: item["Pending Cost Changes"],
      projectedCosts: item["Projected Costs"],
      forecastToComplete: item["Forecast To Complete"],
      estimatedAtCompletion: item["Estimated Cost at Completion"],
      projectedOverUnder: item["Projected over Under"],
    })) as GridRow[]
  }, [processedBudgetData])

  // Create column definitions for ProtectedGrid
  const createProtectedBudgetColumns = useMemo(() => {
    return [
      createReadOnlyColumn("costCode", "Cost Code", {
        pinned: "left",
        width: 200,
        cellRenderer: (params: any) => {
          const data = params.data
          return `
            <div style="display: flex; flex-direction: column; gap: 2px;">
              <div style="font-weight: 600; font-size: 14px;">${data.costCode}</div>
              <div style="font-size: 12px; color: #6b7280;">${data.costType}</div>
            </div>
          `
        },
      }),
      createLockedColumn("originalBudget", "Original Budget", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createProtectedColumn(
        "budgetModifications",
        "Modifications",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const value = params.value
            return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`
          },
          width: 140,
          cellStyle: (params: any) => ({
            fontFamily: "monospace",
            color: params.value >= 0 ? "#16a34a" : "#dc2626",
          }),
        }
      ),
      createProtectedColumn(
        "approvedCOs",
        "Approved COs",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const value = params.value
            return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`
          },
          width: 140,
          cellStyle: (params: any) => ({
            fontFamily: "monospace",
            color: params.value >= 0 ? "#16a34a" : "#dc2626",
          }),
        }
      ),
      createReadOnlyColumn("revisedBudget", "Revised Budget", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace", fontWeight: "600" },
      }),
      createProtectedColumn(
        "pendingBudgetChanges",
        "Pending Budget Changes",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const value = params.value
            return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`
          },
          width: 160,
          cellStyle: (params: any) => ({
            fontFamily: "monospace",
            color: params.value >= 0 ? "#16a34a" : "#dc2626",
          }),
        }
      ),
      createReadOnlyColumn("projectedBudget", "Projected Budget", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("committedCosts", "Committed Costs", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("directCosts", "Direct Costs", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("jtdCosts", "JTD Costs", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createProtectedColumn(
        "pendingCostChanges",
        "Pending Cost Changes",
        { level: "none" },
        {
          type: "numericColumn",
          valueFormatter: (params: any) => {
            const value = params.value
            return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`
          },
          width: 160,
          cellStyle: (params: any) => ({
            fontFamily: "monospace",
            color: params.value >= 0 ? "#16a34a" : "#dc2626",
          }),
        }
      ),
      createReadOnlyColumn("projectedCosts", "Projected Costs", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("forecastToComplete", "Forecast to Complete", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 160,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("estimatedAtCompletion", "Est. at Completion", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value),
        width: 160,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("projectedOverUnder", "Projected Over/Under", {
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return `${value >= 0 ? "+" : ""}${formatCurrency(value)}`
        },
        width: 160,
        cellStyle: (params: any) => ({
          fontFamily: "monospace",
          color: params.value >= 0 ? "#16a34a" : "#dc2626",
        }),
      }),
    ] as ProtectedColDef[]
  }, [])

  // Custom totals calculator for budget grid
  const budgetTotalsCalculator = (data: GridRow[], columnField: string): number | string => {
    const numericFields = [
      "originalBudget",
      "budgetModifications",
      "approvedCOs",
      "revisedBudget",
      "pendingBudgetChanges",
      "projectedBudget",
      "committedCosts",
      "directCosts",
      "jtdCosts",
      "pendingCostChanges",
      "projectedCosts",
      "forecastToComplete",
      "estimatedAtCompletion",
      "projectedOverUnder",
    ]

    if (numericFields.includes(columnField)) {
      const total = data.reduce((sum, row) => sum + (row[columnField] || 0), 0)
      return total
    }

    if (columnField === "costCode") {
      return "Total"
    }

    return ""
  }

  // Calculate totals for currency columns
  const columnTotals = useMemo(() => {
    return processedBudgetData.reduce(
      (totals, item) => ({
        originalBudget: totals.originalBudget + item["Original Budget Amount"],
        budgetModifications: totals.budgetModifications + item["Budget Modifications"],
        approvedCOs: totals.approvedCOs + item["Approved COs"],
        revisedBudget: totals.revisedBudget + item["Revised Budget"],
        pendingBudgetChanges: totals.pendingBudgetChanges + item["Pending Budget Changes"],
        projectedBudget: totals.projectedBudget + item["Projected Budget"],
        committedCosts: totals.committedCosts + item["Committed Costs"],
        directCosts: totals.directCosts + item["Direct Costs"],
        jtdCosts: totals.jtdCosts + item["Job to Date Costs"],
        pendingCostChanges: totals.pendingCostChanges + item["Pending Cost Changes"],
        projectedCosts: totals.projectedCosts + item["Projected Costs"],
        forecastToComplete: totals.forecastToComplete + item["Forecast To Complete"],
        estimatedAtCompletion: totals.estimatedAtCompletion + item["Estimated Cost at Completion"],
        projectedOverUnder: totals.projectedOverUnder + item["Projected over Under"],
      }),
      {
        originalBudget: 0,
        budgetModifications: 0,
        approvedCOs: 0,
        revisedBudget: 0,
        pendingBudgetChanges: 0,
        projectedBudget: 0,
        committedCosts: 0,
        directCosts: 0,
        jtdCosts: 0,
        pendingCostChanges: 0,
        projectedCosts: 0,
        forecastToComplete: 0,
        estimatedAtCompletion: 0,
        projectedOverUnder: 0,
      }
    )
  }, [processedBudgetData])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const exportToCSV = () => {
    const headers = [
      "Budget Code",
      "Description",
      "Cost Code Tier 1",
      "Cost Code Tier 2",
      "Cost Type",
      "Original Budget",
      "Budget Modifications",
      "Approved COs",
      "Revised Budget",
      "Committed Costs",
      "Job to Date Costs",
      "Forecast to Complete",
      "Estimated at Completion",
      "Projected Over/Under",
    ]

    const csvContent = [
      headers.join(","),
      ...processedBudgetData.map((item) =>
        [
          `"${item["Budget Code"]}"`,
          `"${item["Budget Code Description"]}"`,
          `"${item["Cost Code Tier 1"]}"`,
          `"${item["Cost Code Tier 2"]}"`,
          `"${item["Cost Type"]}"`,
          item["Original Budget Amount"],
          item["Budget Modifications"],
          item["Approved COs"],
          item["Revised Budget"],
          item["Committed Costs"],
          item["Job to Date Costs"],
          item["Forecast To Complete"],
          item["Estimated Cost at Completion"],
          item["Projected over Under"],
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "budget_analysis.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle grid data changes
  const handleGridChange = (event: any) => {
    console.log("Budget grid data changed:", event)
    setHasUnsavedChanges(true)
  }

  // Save grid changes
  const handleSaveChanges = () => {
    console.log("Saving budget grid changes...")
    setHasUnsavedChanges(false)
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {[
        { key: "overview", label: "Overview", icon: BarChart3 },
        { key: "categories", label: "Categories", icon: Layers },
        { key: "variance", label: "Variance", icon: TrendingUp },
        { key: "budget", label: "Budget Detail", icon: TableIcon },
      ].map((item) => (
        <Button
          key={item.key}
          variant={viewMode === item.key ? "default" : "ghost"}
          size="sm"
          onClick={() => setViewMode(item.key as ViewMode)}
          className="flex items-center gap-2"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </div>
  )

  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Budget Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Budget vs Actual Performance
                </CardTitle>
                <CardDescription>Monthly budget tracking and performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted" opacity={0.6} />
                    <Bar dataKey="actual" fill="#10b981" name="Actual" opacity={0.8} />
                    <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={3} name="Forecast" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget Utilization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-green-600" />
                  Budget Utilization
                </CardTitle>
                <CardDescription>Current budget consumption analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Utilization</span>
                    <span className="text-2xl font-bold text-green-600">{budgetUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={budgetUtilization} className="h-4" />

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining Budget</p>
                      <p className="text-lg font-semibold">${(remainingBudget / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Burn Rate</p>
                      <p className="text-lg font-semibold">
                        ${(summaryData.totalActualCosts / 8 / 1000000).toFixed(1)}M/mo
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Performance Index Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Performance Trends
                </CardTitle>
                <CardDescription>Cost and schedule performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Performance Index</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={summaryData.costPerformanceIndex >= 1 ? "default" : "destructive"}>
                        {summaryData.costPerformanceIndex.toFixed(2)}
                      </Badge>
                      {summaryData.costPerformanceIndex >= 1 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Schedule Performance Index</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={summaryData.schedulePerformanceIndex >= 1 ? "default" : "secondary"}>
                        {summaryData.schedulePerformanceIndex.toFixed(2)}
                      </Badge>
                      {summaryData.schedulePerformanceIndex >= 1 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Change Order Impact</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={changeOrderImpact <= 3 ? "default" : "destructive"}>
                        {changeOrderImpact.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "categories":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-indigo-600" />
                    Budget by Category
                  </CardTitle>
                  <CardDescription>Budget allocation across cost categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={budgetCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="budgeted"
                      >
                        {budgetCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {budgetCategories.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.category}</span>
                        </div>
                        <span className="font-medium">${(item.budgeted / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Category Performance
                  </CardTitle>
                  <CardDescription>Budget vs actual by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetCategories} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <YAxis dataKey="category" type="category" width={100} />
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]}
                      />
                      <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted" />
                      <Bar dataKey="actual" fill="#10b981" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Category Details Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Detailed Category Analysis
                </CardTitle>
                <CardDescription>Comprehensive breakdown of budget performance by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Budgeted</th>
                        <th className="text-right p-2">Actual</th>
                        <th className="text-right p-2">Forecast</th>
                        <th className="text-right p-2">Variance</th>
                        <th className="text-right p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetCategories.map((category, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{category.category}</td>
                          <td className="text-right p-2">${(category.budgeted / 1000000).toFixed(1)}M</td>
                          <td className="text-right p-2">${(category.actual / 1000000).toFixed(1)}M</td>
                          <td className="text-right p-2">${(category.forecast / 1000000).toFixed(1)}M</td>
                          <td
                            className={`text-right p-2 font-medium ${
                              category.variance >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {category.variance >= 0 ? "+" : ""}${(category.variance / 1000000).toFixed(1)}M
                          </td>
                          <td className="text-right p-2">
                            <Badge
                              variant={
                                category.variancePercent >= 0
                                  ? "default"
                                  : Math.abs(category.variancePercent) <= 5
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {category.variancePercent >= 0 ? "+" : ""}
                              {category.variancePercent.toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "variance":
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Variance Analysis Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Budget Variance Analysis
                </CardTitle>
                <CardDescription>Monthly variance tracking and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000).toFixed(0)}K`, name]} />
                    <Line type="monotone" dataKey="variance" stroke="#f59e0b" strokeWidth={3} name="Budget Variance" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* CPI Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  CPI Tracking
                </CardTitle>
                <CardDescription>Cost Performance Index over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0.8, 1.2]} />
                    <Tooltip formatter={(value: number, name: string) => [value.toFixed(2), name]} />
                    <Line type="monotone" dataKey="cpi" stroke="#3b82f6" strokeWidth={2} name="CPI" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Budget risk factors and impact analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Risk Level</span>
                    <Badge
                      variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "secondary" : "default"}
                    >
                      {riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Key Risk Factors:</div>
                    <ul className="text-sm space-y-1">
                      <li>• Material cost escalation: Medium impact</li>
                      <li>• Schedule delays: Low impact</li>
                      <li>• Labor shortage: Medium impact</li>
                      <li>• Change order frequency: Low impact</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "budget":
        return (
          <div className="space-y-6">
            {/* Budget Table Controls */}
            <Card className={isBudgetTableFullscreen ? "fixed inset-0 z-[9999] bg-background overflow-auto p-6" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TableIcon className="h-5 w-5 text-blue-600" />
                      Budget Detail - Palm Beach Luxury Estate
                    </CardTitle>
                    <CardDescription>
                      Detailed budget breakdown with {processedBudgetData.length} line items
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={exportToCSV} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={() => setUseBetaGrid(!useBetaGrid)}
                      variant={useBetaGrid ? "default" : "outline"}
                      size="sm"
                      className={useBetaGrid ? "bg-orange-500 hover:bg-orange-600" : ""}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Beta Grid
                    </Button>
                    <FullscreenToggle
                      isFullscreen={isBudgetTableFullscreen}
                      onToggle={() => setIsBudgetTableFullscreen(!isBudgetTableFullscreen)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Beta Grid Information Banner */}
                {useBetaGrid && (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TestTube className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-800">Beta Grid Mode Active</h4>
                        <p className="text-sm text-orange-700 mt-1">
                          Experience our enhanced budget grid with Excel-like functionality, including inline editing,
                          advanced sorting, totals row, and sticky columns. This new interface provides improved
                          performance and user experience.
                        </p>
                        {hasUnsavedChanges && (
                          <div className="mt-3 flex items-center gap-2">
                            <Badge variant="destructive">Unsaved Changes</Badge>
                            <Button onClick={handleSaveChanges} size="sm" variant="outline">
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Beta Grid Content */}
                {useBetaGrid ? (
                  <div className="space-y-4">
                    <ProtectedGrid
                      columnDefs={createProtectedBudgetColumns}
                      rowData={createProtectedBudgetData}
                      config={{
                        allowExport: true,
                        allowCellEditing: true,
                        allowSorting: true,
                        allowFiltering: true,
                        showToolbar: true,
                        showStatusBar: true,
                        enableRangeSelection: false, // Disabled - requires enterprise license
                        theme: "quartz", // Use quartz theme for better dark mode support
                        enableTotalsRow: true,
                        stickyColumnsCount: 1,
                        userRole: userRole,
                      }}
                      events={{
                        onCellValueChanged: handleGridChange,
                        onCellEditingStopped: handleGridChange,
                      }}
                      height={isBudgetTableFullscreen ? "calc(100vh - 200px)" : "600px"}
                      title="Budget Analysis Grid"
                      enableSearch={true}
                      totalsCalculator={budgetTotalsCalculator}
                    />
                    <div className="text-sm text-muted-foreground">
                      <Badge variant="secondary" className="mr-2">
                        Total Items: {createProtectedBudgetData.length}
                      </Badge>
                      <Badge variant="secondary" className="mr-2">
                        Totals Row: Enabled
                      </Badge>
                      <Badge variant="secondary">Sticky Columns: 1</Badge>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Search and Filter Controls */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search cost codes, types, descriptions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {processedBudgetData.length} items
                      </Badge>
                    </div>

                    {/* Budget Data Table */}
                    <div className="rounded-md border overflow-hidden">
                      <div
                        className={`overflow-x-auto w-full ${
                          isBudgetTableFullscreen ? "max-h-[calc(100vh-200px)]" : "max-h-[calc(100vh-300px)]"
                        }`}
                        style={{ maxWidth: "100%", width: "100%" }}
                      >
                        <Table className="min-w-[1200px]">
                          <TableHeader className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b-2 border-border/50 shadow-lg">
                            <TableRow className="bg-background/95 backdrop-blur-md">
                              <TableHead className="min-w-[200px] sticky left-0 bg-background/95 backdrop-blur-md z-40">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Cost Code Tier 3")}
                                >
                                  Cost Code
                                  {sortField === "Cost Code Tier 3" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Original Budget Amount")}
                                >
                                  Original Budget
                                  {sortField === "Original Budget Amount" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Budget Modifications")}
                                >
                                  Modifications
                                  {sortField === "Budget Modifications" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Approved COs")}
                                >
                                  Approved COs
                                  {sortField === "Approved COs" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Revised Budget")}
                                >
                                  Revised Budget
                                  {sortField === "Revised Budget" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Pending Budget Changes")}
                                >
                                  Pending Budget Changes
                                  {sortField === "Pending Budget Changes" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Projected Budget")}
                                >
                                  Projected Budget
                                  {sortField === "Projected Budget" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Committed Costs")}
                                >
                                  Committed Costs
                                  {sortField === "Committed Costs" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Direct Costs")}
                                >
                                  Direct Costs
                                  {sortField === "Direct Costs" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Job to Date Costs")}
                                >
                                  JTD Costs
                                  {sortField === "Job to Date Costs" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Pending Cost Changes")}
                                >
                                  Pending Cost Changes
                                  {sortField === "Pending Cost Changes" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Projected Costs")}
                                >
                                  Projected Costs
                                  {sortField === "Projected Costs" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Forecast To Complete")}
                                >
                                  Forecast to Complete
                                  {sortField === "Forecast To Complete" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Estimated Cost at Completion")}
                                >
                                  Est. at Completion
                                  {sortField === "Estimated Cost at Completion" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                              <TableHead className="text-right w-[120px]">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 font-semibold"
                                  onClick={() => handleSort("Projected over Under")}
                                >
                                  Projected Over Under
                                  {sortField === "Projected over Under" &&
                                    (sortDirection === "asc" ? (
                                      <SortAsc className="ml-2 h-4 w-4" />
                                    ) : (
                                      <SortDesc className="ml-2 h-4 w-4" />
                                    ))}
                                </Button>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {processedBudgetData.slice(0, 50).map((item, index) => (
                              <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell className="max-w-[200px] sticky left-0 bg-background z-30">
                                  <div className="space-y-1">
                                    <div className="font-medium text-sm">{item["Cost Code Tier 3"]}</div>
                                    <div className="text-xs text-muted-foreground truncate">{item["Cost Type"]}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Original Budget Amount"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  <span
                                    className={item["Budget Modifications"] >= 0 ? "text-green-600" : "text-red-600"}
                                  >
                                    {item["Budget Modifications"] >= 0 ? "+" : ""}
                                    {formatCurrency(item["Budget Modifications"])}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  <span className={item["Approved COs"] >= 0 ? "text-green-600" : "text-red-600"}>
                                    {item["Approved COs"] >= 0 ? "+" : ""}
                                    {formatCurrency(item["Approved COs"])}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm font-medium">
                                  {formatCurrency(item["Revised Budget"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  <span
                                    className={item["Pending Budget Changes"] >= 0 ? "text-green-600" : "text-red-600"}
                                  >
                                    {item["Pending Budget Changes"] >= 0 ? "+" : ""}
                                    {formatCurrency(item["Pending Budget Changes"])}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Projected Budget"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Committed Costs"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Direct Costs"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Job to Date Costs"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  <span
                                    className={item["Pending Cost Changes"] >= 0 ? "text-green-600" : "text-red-600"}
                                  >
                                    {item["Pending Cost Changes"] >= 0 ? "+" : ""}
                                    {formatCurrency(item["Pending Cost Changes"])}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Projected Costs"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Forecast To Complete"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(item["Estimated Cost at Completion"])}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  <span
                                    className={item["Projected over Under"] >= 0 ? "text-green-600" : "text-red-600"}
                                  >
                                    {item["Projected over Under"] >= 0 ? "+" : ""}
                                    {formatCurrency(item["Projected over Under"])}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow className="bg-muted/50 font-semibold">
                              <TableCell className="font-bold sticky left-0 bg-muted/50 z-30">Total</TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.originalBudget)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                <span
                                  className={columnTotals.budgetModifications >= 0 ? "text-green-600" : "text-red-600"}
                                >
                                  {columnTotals.budgetModifications >= 0 ? "+" : ""}
                                  {formatCurrency(columnTotals.budgetModifications)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                <span className={columnTotals.approvedCOs >= 0 ? "text-green-600" : "text-red-600"}>
                                  {columnTotals.approvedCOs >= 0 ? "+" : ""}
                                  {formatCurrency(columnTotals.approvedCOs)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.revisedBudget)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                <span
                                  className={columnTotals.pendingBudgetChanges >= 0 ? "text-green-600" : "text-red-600"}
                                >
                                  {columnTotals.pendingBudgetChanges >= 0 ? "+" : ""}
                                  {formatCurrency(columnTotals.pendingBudgetChanges)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.projectedBudget)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.committedCosts)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.directCosts)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.jtdCosts)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                <span
                                  className={columnTotals.pendingCostChanges >= 0 ? "text-green-600" : "text-red-600"}
                                >
                                  {columnTotals.pendingCostChanges >= 0 ? "+" : ""}
                                  {formatCurrency(columnTotals.pendingCostChanges)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.projectedCosts)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.forecastToComplete)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                {formatCurrency(columnTotals.estimatedAtCompletion)}
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm font-bold">
                                <span
                                  className={columnTotals.projectedOverUnder >= 0 ? "text-green-600" : "text-red-600"}
                                >
                                  {columnTotals.projectedOverUnder >= 0 ? "+" : ""}
                                  {formatCurrency(columnTotals.projectedOverUnder)}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </div>
                    </div>

                    {processedBudgetData.length > 50 && (
                      <div className="mt-4 text-center">
                        <Badge variant="secondary">Showing first 50 of {processedBudgetData.length} items</Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`space-y-6 w-full max-w-full overflow-hidden ${className || ""}`}>
      {/* Controls Bar */}
      {!hideViewToggle && (
        <div className="flex items-center justify-between">
          <ViewToggle />
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-full overflow-hidden">{renderContent()}</div>
    </div>
  )
}
