"use client"

import { useState, useMemo } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Droplets,
  PieChart as PieChartIcon,
  BarChart3,
  Target,
  Activity,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Building2,
  HandCoins,
  Timer,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Bot,
} from "lucide-react"

// Import actual cash flow data
import cashFlowDataImport from "@/data/mock/financial/cash-flow.json"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"
import { CollapseWrapper } from "@/components/ui/collapse-wrapper"
import { useFinancialHubStore } from "@/hooks/use-financial-hub-store"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedGrid, createReadOnlyColumn, GridRow, ProtectedColDef } from "@/components/ui/protected-grid"
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
} from "recharts"

interface CashFlowAnalysisProps {
  userRole: string
  projectData: any
}

// Use imported cash flow data
const cashFlowData = cashFlowDataImport

// Advanced analytics data for insights
const advancedMetrics = {
  forecastAccuracy: {
    current: 0.92,
    trend: "improving",
    target: 0.95,
  },
  liquidityRatio: 4.2,
  daysOfCashOnHand: 45,
  burnRate: 850000,
  riskFactors: [
    { factor: "Seasonal Fluctuations", impact: "medium", probability: 0.6 },
    { factor: "Payment Delays", impact: "high", probability: 0.3 },
    { factor: "Cost Overruns", impact: "medium", probability: 0.4 },
  ],
}

// Payment timing analysis metrics
const paymentTimingMetrics = {
  averageOwnerDelayDays: 19,
  averageVendorPaymentLagDays: 11,
  onTimePaymentRate: 82.5, // percentage
}

const inflowBreakdown = [
  { name: "Owner Payments", value: 4719691.76, color: "#3b82f6", percentage: 88.2 },
  { name: "Change Orders", value: 10595.76, color: "#10b981", percentage: 0.2 },
  { name: "Other", value: 614351.98, color: "#f59e0b", percentage: 11.6 },
]

const outflowBreakdown = [
  { name: "Subcontractors", value: 2023661.32, color: "#ef4444", percentage: 45.2 },
  { name: "Materials", value: 1591761.76, color: "#8b5cf6", percentage: 35.6 },
  { name: "Labor", value: 795880.88, color: "#06b6d4", percentage: 17.8 },
  { name: "Equipment", value: 530587.25, color: "#f97316", percentage: 11.9 },
  { name: "Overhead", value: 265293.62, color: "#84cc16", percentage: 5.9 },
]

// Mock data for pay applications grid
const payApplicationsData = [
  {
    id: "001",
    payAppNumber: "001",
    month: "Jan 24",
    submitted: "01/05/2024",
    approved: "01/12/2024",
    approvedTotal: 425000,
    paid: "01/20/2024",
    receivable: 382500, // 90% of approved total
    payableSub: 191250, // ~50% of receivable
    payableGCGR: 61200, // ~16% of receivable
    fee: 17993, // 4.7% of receivable
    other: 15300, // contingency/retention release
    netDelta: 96757, // receivable - (payableSub + payableGCGR + fee + other)
  },
  {
    id: "002",
    payAppNumber: "002",
    month: "Feb 24",
    submitted: "02/05/2024",
    approved: "02/13/2024",
    approvedTotal: 398000,
    paid: "02/22/2024",
    receivable: 358200,
    payableSub: 179100,
    payableGCGR: 57312,
    fee: 16836,
    other: 12500,
    netDelta: 92452,
  },
  {
    id: "003",
    payAppNumber: "003",
    month: "Mar 24",
    submitted: "03/05/2024",
    approved: "03/14/2024",
    approvedTotal: 467000,
    paid: "03/25/2024",
    receivable: 420300,
    payableSub: 210150,
    payableGCGR: 67248,
    fee: 24634,
    other: 18750,
    netDelta: 99518,
  },
  {
    id: "004",
    payAppNumber: "004",
    month: "Apr 24",
    submitted: "04/05/2024",
    approved: "04/15/2024",
    approvedTotal: 523000,
    paid: "04/24/2024",
    receivable: 470700,
    payableSub: 235350,
    payableGCGR: 75312,
    fee: 29071,
    other: 22100,
    netDelta: 108867,
  },
  {
    id: "005",
    payAppNumber: "005",
    month: "May 24",
    submitted: "05/05/2024",
    approved: "05/16/2024",
    approvedTotal: 612000,
    paid: "05/26/2024",
    receivable: 550800,
    payableSub: 275400,
    payableGCGR: 88128,
    fee: 34999,
    other: 27500,
    netDelta: 124773,
  },
  {
    id: "006",
    payAppNumber: "006",
    month: "Jun 24",
    submitted: "06/05/2024",
    approved: "06/17/2024",
    approvedTotal: 578000,
    paid: "06/27/2024",
    receivable: 520200,
    payableSub: 260100,
    payableGCGR: 83232,
    fee: 35889,
    other: 24750,
    netDelta: 116229,
  },
  {
    id: "007",
    payAppNumber: "007",
    month: "Jul 24",
    submitted: "07/05/2024",
    approved: "07/18/2024",
    approvedTotal: 634000,
    paid: "07/28/2024",
    receivable: 570600,
    payableSub: 285300,
    payableGCGR: 91296,
    fee: 28530,
    other: 31200,
    netDelta: 134274,
  },
  {
    id: "008",
    payAppNumber: "008",
    month: "Aug 24",
    submitted: "08/05/2024",
    approved: "08/19/2024",
    approvedTotal: 689000,
    paid: "08/29/2024",
    receivable: 620100,
    payableSub: 310050,
    payableGCGR: 99216,
    fee: 38246,
    other: 28900,
    netDelta: 143688,
  },
  {
    id: "009",
    payAppNumber: "009",
    month: "Sep 24",
    submitted: "09/05/2024",
    approved: "09/20/2024",
    approvedTotal: 742000,
    paid: "09/30/2024",
    receivable: 667800,
    payableSub: 333900,
    payableGCGR: 106848,
    fee: 39268,
    other: 35100,
    netDelta: 152684,
  },
  {
    id: "010",
    payAppNumber: "010",
    month: "Oct 24",
    submitted: "10/05/2024",
    approved: "10/21/2024",
    approvedTotal: 798000,
    paid: "10/31/2024",
    receivable: 718200,
    payableSub: 359100,
    payableGCGR: 114912,
    fee: 49555,
    other: 38750,
    netDelta: 155883,
  },
  {
    id: "011",
    payAppNumber: "011",
    month: "Nov 24",
    submitted: "11/05/2024",
    approved: "11/22/2024",
    approvedTotal: 856000,
    paid: "12/02/2024",
    receivable: 770400,
    payableSub: 385200,
    payableGCGR: 123264,
    fee: 53158,
    other: 42500,
    netDelta: 166278,
  },
  {
    id: "012",
    payAppNumber: "012",
    month: "Dec 24",
    submitted: "12/05/2024",
    approved: "12/23/2024",
    approvedTotal: 923000,
    paid: "01/03/2025",
    receivable: 830700,
    payableSub: 415350,
    payableGCGR: 132912,
    fee: 57318,
    other: 46250,
    netDelta: 178870,
  },
]

type ViewMode = "overview" | "inflow" | "outflow" | "forecast"

export default function CashFlowAnalysis({ userRole, projectData }: CashFlowAnalysisProps) {
  const { isFullscreen, toggleFullscreen } = useFinancialHubStore()

  const [viewMode, setViewMode] = useState<ViewMode>("overview")

  // Get project-specific data
  const projectCashFlow = cashFlowData.projects.find((p) => p.project_id === 2525840) || cashFlowData.projects[0]
  const summary = projectCashFlow.cashFlowData.summary
  const monthlyData = projectCashFlow.cashFlowData.monthlyData

  // Calculate Owner vs Vendor comparison data
  const ownerVendorComparison = useMemo(() => {
    return monthlyData.map((month) => {
      const ownerPayments = month.inflows.ownerPayments
      const vendorSubPayments = month.outflows.subcontractorPayments + month.outflows.materialCosts
      const netDelta = ownerPayments - vendorSubPayments
      const percentVariance = vendorSubPayments > 0 ? (netDelta / vendorSubPayments) * 100 : 0

      return {
        month: month.month,
        ownerPayments,
        vendorSubPayments,
        netDelta,
        percentVariance,
        isSignificantSpread: Math.abs(percentVariance) > 20,
      }
    })
  }, [monthlyData])

  // Calculate key metrics
  const totalInflows = summary.totalInflows
  const totalOutflows = summary.totalOutflows
  const netCashFlow = summary.netCashFlow
  const workingCapital = summary.workingCapital
  const peakRequirement = summary.peakCashRequirement

  // Calculate performance metrics
  const cashFlowMargin = (netCashFlow / totalInflows) * 100
  const averageMonthlyInflow = totalInflows / monthlyData.length
  const averageMonthlyOutflow = totalOutflows / monthlyData.length
  const forecastAccuracy = monthlyData.reduce((sum, m) => sum + m.forecastAccuracy, 0) / monthlyData.length

  // Transform data for charts
  const chartData = monthlyData.map((month) => ({
    month: month.month,
    inflows: month.inflows.total,
    outflows: month.outflows.total,
    net: month.netCashFlow,
    cumulative: month.cumulativeCashFlow,
    workingCapital: month.workingCapital,
  }))

  // Convert pay applications data to GridRow format
  const payApplicationsGridData: GridRow[] = useMemo(() => {
    return payApplicationsData.map((item) => ({
      id: item.id,
      payAppNumber: item.payAppNumber,
      month: item.month,
      submitted: item.submitted,
      approved: item.approved,
      approvedTotal: item.approvedTotal,
      paid: item.paid,
      receivable: item.receivable,
      payableSub: item.payableSub,
      payableGCGR: item.payableGCGR,
      fee: item.fee,
      other: item.other,
      netDelta: item.netDelta,
    }))
  }, [])

  // Create column definitions for pay applications grid
  const payApplicationsColumnDefs: ProtectedColDef[] = useMemo(
    () => [
      createReadOnlyColumn("payAppNumber", "Pay App #", {
        width: 100,
        pinned: "left",
        cellStyle: { fontFamily: "monospace", fontWeight: "500" },
      }),
      createReadOnlyColumn("month", "Month", {
        width: 100,
        pinned: "left",
      }),
      createReadOnlyColumn("submitted", "Submitted", {
        width: 120,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("approved", "Approved", {
        width: 120,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("approvedTotal", "Approved Total", {
        width: 140,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: { fontFamily: "monospace", fontWeight: "500" },
      }),
      createReadOnlyColumn("paid", "Paid", {
        width: 120,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("receivable", "Receivable", {
        width: 130,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: { fontFamily: "monospace", color: "#16a34a", fontWeight: "500" },
      }),
      createReadOnlyColumn("payableSub", "Payable - Sub", {
        width: 140,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: { fontFamily: "monospace", color: "#dc2626" },
      }),
      createReadOnlyColumn("payableGCGR", "Payable - GC GR", {
        width: 150,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: { fontFamily: "monospace", color: "#dc2626" },
      }),
      createReadOnlyColumn("fee", "Fee", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: { fontFamily: "monospace", color: "#7c3aed" },
      }),
      createReadOnlyColumn("other", "Other", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: { fontFamily: "monospace", color: "#ea580c" },
      }),
      createReadOnlyColumn("netDelta", "Net Delta", {
        width: 130,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0"
        },
        cellStyle: (params: any) => {
          const value = params.value
          const style: any = { fontFamily: "monospace", fontWeight: "bold" }
          if (typeof value === "number") {
            style.color = value >= 0 ? "#16a34a" : "#dc2626"
          }
          return style
        },
      }),
    ],
    []
  )

  // Custom totals calculator for pay applications
  const payApplicationsTotalsCalculator = (data: GridRow[], columnField: string): number | string => {
    if (columnField === "payAppNumber") return "Totals"
    if (["month", "submitted", "approved", "paid"].includes(columnField)) return ""

    const values = data
      .map((row) => {
        const value = row[columnField]
        return typeof value === "number" && !isNaN(value) ? value : 0
      })
      .filter((val) => typeof val === "number" && !isNaN(val))

    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0)
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {[
        { key: "overview", label: "Overview", icon: BarChart3 },
        { key: "inflow", label: "Inflows", icon: TrendingUp },
        { key: "outflow", label: "Outflows", icon: TrendingDown },
        { key: "forecast", label: "Forecast", icon: Calendar },
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* 1. Owner vs Vendor Payment Trends (Chart) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Owner vs Vendor Payment Trends
                </CardTitle>
                <CardDescription>Visual comparison of payment flows over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={ownerVendorComparison}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                    <Bar dataKey="ownerPayments" fill="#10b981" name="Owner Payments" />
                    <Bar dataKey="vendorSubPayments" fill="#ef4444" name="Vendor/Sub Payments" />
                    <Line type="monotone" dataKey="netDelta" stroke="#8b5cf6" strokeWidth={3} name="Net Delta" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* 2. Payment Timing Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-orange-600" />
                    Payment Timing Metrics
                  </CardTitle>
                  <CardDescription>Average processing and delay times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                          {paymentTimingMetrics.averageOwnerDelayDays}
                        </div>
                        <p className="text-sm text-muted-foreground">Days</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Owner Payment Delay</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {paymentTimingMetrics.averageVendorPaymentLagDays}
                        </div>
                        <p className="text-sm text-muted-foreground">Days</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Vendor Payment Lag</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {paymentTimingMetrics.onTimePaymentRate}%
                      </div>
                      <p className="text-sm text-muted-foreground">On-Time Payment Rate</p>
                      <Progress value={paymentTimingMetrics.onTimePaymentRate} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Payment Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-600" />
                    Payment Performance Insights
                  </CardTitle>
                  <CardDescription>Key insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <HandCoins className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Cash Flow Gap</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          {paymentTimingMetrics.averageOwnerDelayDays -
                            paymentTimingMetrics.averageVendorPaymentLagDays}{" "}
                          day gap between receiving owner payments and paying vendors
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Payment Efficiency</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          {paymentTimingMetrics.onTimePaymentRate >= 80 ? "Good" : "Needs Improvement"} payment
                          performance with {paymentTimingMetrics.onTimePaymentRate}% on-time rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                          Working Capital Impact
                        </p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          Payment timing affects working capital by approximately{" "}
                          {formatCurrency(workingCapital * 0.15)} monthly
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 4. Pay Applications Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Payment Applications
                </CardTitle>
                <CardDescription>Detailed breakdown of payment applications, receivables, and payables</CardDescription>
              </CardHeader>
              <CardContent>
                <ProtectedGrid
                  title="Payment Applications Analysis"
                  columnDefs={payApplicationsColumnDefs}
                  rowData={payApplicationsGridData}
                  height="600px"
                  config={{
                    allowExport: true,
                    allowImport: false,
                    allowRowSelection: false,
                    allowMultiSelection: false,
                    allowColumnReordering: false,
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
                    stickyColumnsCount: 2, // Pin first two columns (Pay App # and Month)
                  }}
                  events={{
                    onGridReady: (event) => {
                      // Auto-size columns to fit content
                      event.api.autoSizeAllColumns()
                    },
                  }}
                  enableSearch={true}
                  totalsCalculator={payApplicationsTotalsCalculator}
                  className="border rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Rest remains unchanged - Cash Flow Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Cash Flow Performance
                </CardTitle>
                <CardDescription>Monthly cash flow analysis and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="inflows"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Inflows"
                    />
                    <Area
                      type="monotone"
                      dataKey="outflows"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                      name="Outflows"
                    />
                    <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net Cash Flow" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Working Capital Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-purple-600" />
                    Working Capital
                  </CardTitle>
                  <CardDescription>Working capital trend analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]}
                      />
                      <Line
                        type="monotone"
                        dataKey="workingCapital"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        name="Working Capital"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key cash flow performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cash Flow Margin</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={cashFlowMargin >= 10 ? "default" : "secondary"}>
                          {cashFlowMargin.toFixed(1)}%
                        </Badge>
                        {cashFlowMargin >= 10 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Liquidity Ratio</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={advancedMetrics.liquidityRatio >= 2 ? "default" : "destructive"}>
                          {advancedMetrics.liquidityRatio.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Days Cash on Hand</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={advancedMetrics.daysOfCashOnHand >= 30 ? "default" : "destructive"}>
                          {advancedMetrics.daysOfCashOnHand} days
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "inflow":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Inflow Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-green-600" />
                    Inflow Sources
                  </CardTitle>
                  <CardDescription>Revenue stream breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={inflowBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {inflowBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {inflowBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.value)}</div>
                          <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Inflow Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Monthly Inflows
                  </CardTitle>
                  <CardDescription>Revenue trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]}
                      />
                      <Area
                        type="monotone"
                        dataKey="inflows"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Inflows"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "outflow":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Outflow Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-red-600" />
                    Expense Categories
                  </CardTitle>
                  <CardDescription>Cost breakdown analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={outflowBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {outflowBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(1)}M`, name]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {outflowBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.value)}</div>
                          <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Outflow Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Monthly Outflows
                  </CardTitle>
                  <CardDescription>Expense trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]}
                      />
                      <Area
                        type="monotone"
                        dataKey="outflows"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                        name="Outflows"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "forecast":
        return (
          <div className="space-y-6">
            {/* Cumulative Cash Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Cash Flow Forecast
                </CardTitle>
                <CardDescription>Projected cash flow performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number, name: string) => [`$${(value / 1000000).toFixed(2)}M`, name]} />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      name="Cumulative Cash Flow"
                    />
                    <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={2} name="Net Cash Flow" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Cash Flow Risks
                  </CardTitle>
                  <CardDescription>Potential risks and mitigation strategies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advancedMetrics.riskFactors.map((risk, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{risk.factor}</span>
                          <Badge
                            variant={
                              risk.impact === "high"
                                ? "destructive"
                                : risk.impact === "medium"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {risk.impact}
                          </Badge>
                        </div>
                        <Progress value={risk.probability * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {(risk.probability * 100).toFixed(0)}% probability
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Forecast Accuracy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Forecast Performance
                  </CardTitle>
                  <CardDescription>Cash flow forecasting accuracy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {(advancedMetrics.forecastAccuracy.current * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Current Accuracy</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold">
                          {(advancedMetrics.forecastAccuracy.target * 100).toFixed(0)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Target</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="default" className="capitalize">
                          {advancedMetrics.forecastAccuracy.trend}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Trend</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`space-y-6 ${isFullscreen.cashFlow ? "fixed inset-0 z-[9999] bg-background p-6 overflow-auto" : ""}`}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <ViewToggle />
        <FullscreenToggle isFullscreen={isFullscreen.cashFlow} onToggle={() => toggleFullscreen("cashFlow")} />
      </div>

      {/* Main Content Area */}
      {renderContent()}
    </div>
  )
}
