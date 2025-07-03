"use client"

import React, { useState, useMemo } from "react"
import {
  GitBranch,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Plus,
  Calendar,
  AlertTriangle,
  Shield,
  Target,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp,
  Info,
  Bot,
} from "lucide-react"

// Import exposure analysis data
import changeEventsData from "@/data/mock/financial/change-events.json"
import pcoData from "@/data/mock/financial/pco.json"
import pccoData from "@/data/mock/financial/pcco.json"
import ccoData from "@/data/mock/financial/cco.json"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle"
import { CollapseWrapper } from "@/components/ui/collapse-wrapper"
import { useFinancialHubStore } from "@/hooks/use-financial-hub-store"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChangeManagementProps {
  userRole: string
  projectData: any
}

// Mock change order data
const changeOrderData = [
  {
    id: "CO-001",
    description: "Additional electrical work - Phase 2",
    amount: 125000,
    status: "Approved",
    submittedDate: "2024-08-15",
    approvedDate: "2024-08-20",
    category: "Electrical",
    impact: "Schedule",
    reason: "Design Change",
  },
  {
    id: "CO-002",
    description: "HVAC system upgrade",
    amount: 89500,
    status: "Pending",
    submittedDate: "2024-09-01",
    approvedDate: null,
    category: "HVAC",
    impact: "Cost",
    reason: "Owner Request",
  },
  {
    id: "CO-003",
    description: "Concrete foundation modifications",
    amount: 245000,
    status: "Approved",
    submittedDate: "2024-07-10",
    approvedDate: "2024-07-18",
    category: "Structural",
    impact: "Both",
    reason: "Site Conditions",
  },
  {
    id: "CO-004",
    description: "Landscaping scope expansion",
    amount: 67000,
    status: "Rejected",
    submittedDate: "2024-08-25",
    approvedDate: null,
    category: "Site Work",
    impact: "None",
    reason: "Owner Request",
  },
  {
    id: "CO-005",
    description: "Interior finishes upgrade",
    amount: 156000,
    status: "Pending",
    submittedDate: "2024-09-10",
    approvedDate: null,
    category: "Interior",
    impact: "Cost",
    reason: "Design Change",
  },
]

const monthlyChangeData = [
  { month: "May", submitted: 2, approved: 1, rejected: 0, value: 245000 },
  { month: "Jun", submitted: 1, approved: 1, rejected: 0, value: 125000 },
  { month: "Jul", submitted: 3, approved: 2, rejected: 1, value: 312000 },
  { month: "Aug", submitted: 2, approved: 1, rejected: 0, value: 89500 },
  { month: "Sep", submitted: 1, approved: 0, rejected: 0, value: 156000 },
]

const categoryBreakdown = [
  { name: "Electrical", value: 125000, count: 1, color: "#3b82f6" },
  { name: "HVAC", value: 89500, count: 1, color: "#10b981" },
  { name: "Structural", value: 245000, count: 1, color: "#f59e0b" },
  { name: "Site Work", value: 67000, count: 1, color: "#ef4444" },
  { name: "Interior", value: 156000, count: 1, color: "#8b5cf6" },
]

type ViewMode = "overview" | "tracking" | "analysis"

export default function ChangeManagement({ userRole, projectData }: ChangeManagementProps) {
  const { isFullscreen, toggleFullscreen } = useFinancialHubStore()

  const [viewMode, setViewMode] = useState<ViewMode>("overview")
  const [isInsightsCollapsed, setIsInsightsCollapsed] = useState(false)

  const getChangeOrderData = () => {
    switch (userRole) {
      case "project-manager":
        return {
          approved: 5,
          pending: 2,
          rejected: 1,
          totalValue: 864509,
          approvedValue: 685000,
          pendingValue: 179509,
        }
      case "project-executive":
        return {
          approved: 15,
          pending: 7,
          rejected: 3,
          totalValue: 4440000,
          approvedValue: 3200000,
          pendingValue: 1240000,
        }
      default:
        return {
          approved: 28,
          pending: 12,
          rejected: 6,
          totalValue: 6870000,
          approvedValue: 5100000,
          pendingValue: 1770000,
        }
    }
  }

  const data = getChangeOrderData()

  // Exposure Analysis Calculations
  const exposureAnalysis = useMemo(() => {
    const projectId = 2525840

    // Filter data by project ID
    const changeEvents = changeEventsData.filter((event) => event.project_id === projectId)
    const pcos = pcoData.filter((pco) => pco.project_id === projectId)
    const pccos = pccoData.filter((pcco) => pcco.project_id === projectId)
    const ccos = ccoData.filter((cco) => cco.project_id === projectId)

    // Calculate totals
    const totalChangeEvents = changeEvents.reduce((sum, event) => sum + event.latest_price, 0)
    const totalPendingPCOs = pcos.filter((pco) => pco.status !== "Approved").reduce((sum, pco) => sum + pco.amount, 0)
    const totalApprovedPCCOs = pccos
      .filter((pcco) => pcco.status === "Approved")
      .reduce((sum, pcco) => sum + pcco.amount, 0)
    const totalExecutedCCOs = ccos.filter((cco) => cco.status === "Approved").reduce((sum, cco) => sum + cco.amount, 0)

    // Exposure calculations
    const totalIdentifiedExposure = totalChangeEvents + totalPendingPCOs
    const unapprovedExposure = totalIdentifiedExposure - totalApprovedPCCOs
    const ownerSubcontractorDelta = totalApprovedPCCOs - totalExecutedCCOs
    const deltaPercentage = totalExecutedCCOs > 0 ? (ownerSubcontractorDelta / totalExecutedCCOs) * 100 : 0

    // Risk scorecard metrics
    const totalPCOValue = pcos.reduce((sum, pco) => sum + pco.amount, 0)
    const pendingPCOValue = pcos.filter((pco) => pco.status !== "Approved").reduce((sum, pco) => sum + pco.amount, 0)
    const percentPendingValue = totalPCOValue > 0 ? (pendingPCOValue / totalPCOValue) * 100 : 0

    const avgDaysToExecution = 14 // Mock calculated value
    const unlinkedPCOPercentage = 25 // Mock calculated value
    const largestOpenExposure = Math.max(...pcos.filter((pco) => pco.status !== "Approved").map((pco) => pco.amount))

    return {
      changeEvents,
      pcos,
      pccos,
      ccos,
      totalChangeEvents,
      totalPendingPCOs,
      totalApprovedPCCOs,
      totalExecutedCCOs,
      totalIdentifiedExposure,
      unapprovedExposure,
      ownerSubcontractorDelta,
      deltaPercentage,
      percentPendingValue,
      avgDaysToExecution,
      unlinkedPCOPercentage,
      largestOpenExposure,
    }
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const ViewToggle = () => (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {[
        { key: "overview", label: "Overview", icon: GitBranch },
        { key: "tracking", label: "Tracking", icon: FileText },
        { key: "analysis", label: "Analysis", icon: TrendingUp },
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
          <div className="space-y-6">
            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Change Order Trends
                </CardTitle>
                <CardDescription>Submission and approval patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyChangeData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "value" ? formatCurrency(value) : value,
                        name === "value" ? "Total Value" : name,
                      ]}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="submitted"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Submitted"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="approved"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Approved"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="value"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-purple-600" />
                    Change Orders by Category
                  </CardTitle>
                  <CardDescription>Distribution by work category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.value)}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.count} item{item.count > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Process Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Process Performance
                  </CardTitle>
                  <CardDescription>Change order approval metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Approval Rate</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {((data.approved / (data.approved + data.rejected)) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Processing Time</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">5.2 days</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Impact</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{((data.totalValue / 57235491) * 100).toFixed(1)}%</Badge>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-sm text-muted-foreground mb-2">Volume Distribution</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Approved</span>
                          <span>{data.approved}</span>
                        </div>
                        <Progress
                          value={(data.approved / (data.approved + data.pending + data.rejected)) * 100}
                          className="h-2"
                        />

                        <div className="flex justify-between text-sm">
                          <span>Pending</span>
                          <span>{data.pending}</span>
                        </div>
                        <Progress
                          value={(data.pending / (data.approved + data.pending + data.rejected)) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "tracking":
        return (
          <div className="space-y-6">
            {/* Change Orders Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Change Orders
                    </CardTitle>
                    <CardDescription>Active change order tracking and management</CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Change Order
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Amount</th>
                        <th className="text-center p-2">Status</th>
                        <th className="text-center p-2">Category</th>
                        <th className="text-center p-2">Impact</th>
                        <th className="text-center p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {changeOrderData.map((co, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{co.id}</td>
                          <td className="p-2 max-w-xs">
                            <div className="truncate" title={co.description}>
                              {co.description}
                            </div>
                          </td>
                          <td className="text-right p-2 font-mono">{formatCurrency(co.amount)}</td>
                          <td className="text-center p-2">
                            <Badge
                              variant={
                                co.status === "Approved"
                                  ? "default"
                                  : co.status === "Pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {co.status}
                            </Badge>
                          </td>
                          <td className="text-center p-2">{co.category}</td>
                          <td className="text-center p-2">
                            <Badge variant="outline" className="text-xs">
                              {co.impact}
                            </Badge>
                          </td>
                          <td className="text-center p-2 text-muted-foreground">
                            {new Date(co.submittedDate).toLocaleDateString()}
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

      case "analysis":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Value Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Value Distribution
                  </CardTitle>
                  <CardDescription>Change order values by approval status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { status: "Approved", value: data.approvedValue },
                        { status: "Pending", value: data.pendingValue },
                        { status: "Rejected", value: data.totalValue - data.approvedValue - data.pendingValue },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="status" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>Change order impact analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Schedule Impact Risk</span>
                      <Badge variant="secondary">Medium</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Variance Risk</span>
                      <Badge variant="default">Low</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scope Creep Risk</span>
                      <Badge variant="destructive">High</Badge>
                    </div>

                    <div className="pt-4 space-y-2">
                      <div className="text-sm text-muted-foreground">Key Risk Factors:</div>
                      <ul className="text-sm space-y-1 pl-4">
                        <li>• 30% of changes due to design modifications</li>
                        <li>• Average value increasing by 15% per month</li>
                        <li>• 2 pending changes with schedule impact</li>
                        <li>• Owner-requested changes trending up</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Financial Impact Analysis
                </CardTitle>
                <CardDescription>Cumulative change order impact on project budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.totalValue)}</div>
                    <p className="text-sm text-muted-foreground">Total Change Orders</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {((data.totalValue / 57235491) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">% of Original Budget</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency(data.pendingValue)}</div>
                    <p className="text-sm text-muted-foreground">Pending Approval</p>
                  </div>
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
    <div
      className={`space-y-6 ${
        isFullscreen.changeOrders ? "fixed inset-0 z-[9999] bg-background p-6 overflow-auto" : ""
      }`}
    >
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        <ViewToggle />
        <FullscreenToggle isFullscreen={isFullscreen.changeOrders} onToggle={() => toggleFullscreen("changeOrders")} />
      </div>

      {/* HBI Change Management Insights - General Analysis */}
      <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                <Zap className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              HBI Change Management Insights
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                AI-Powered
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsInsightsCollapsed(!isInsightsCollapsed)}
              className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {isInsightsCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </CardTitle>
          {!isInsightsCollapsed && (
            <CardDescription className="text-gray-600 dark:text-gray-400">
              AI analysis and strategic recommendations for change order management
            </CardDescription>
          )}
        </CardHeader>
        {!isInsightsCollapsed && (
          <CardContent className="space-y-4">
            {/* Key AI Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Risk Alert:</strong>{" "}
                  {exposureAnalysis.unapprovedExposure > 50000
                    ? "High"
                    : exposureAnalysis.unapprovedExposure > 25000
                    ? "Medium"
                    : "Low"}{" "}
                  exposure with {formatCurrency(exposureAnalysis.unapprovedExposure)} unapproved changes. Scope creep
                  trending up with 30% due to design changes.
                </AlertDescription>
              </Alert>

              <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>Process Health:</strong>{" "}
                  {((data.approved / (data.approved + data.rejected)) * 100).toFixed(0)}% approval rate with 5.2 day
                  average processing time.
                  {data.pending} changes pending approval totaling {formatCurrency(data.pendingValue)}.
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>Budget Impact:</strong> {((data.totalValue / 57235491) * 100).toFixed(1)}% of original budget
                  with {formatCurrency(data.totalValue)} in total changes.
                  {data.totalValue / 57235491 < 0.1
                    ? "Minimal"
                    : data.totalValue / 57235491 < 0.2
                    ? "Moderate"
                    : "Significant"}{" "}
                  budget variance.
                </AlertDescription>
              </Alert>
            </div>

            {/* Change Management Intelligence Summary */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Change Management Intelligence
              </h4>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-sm">Exposure Management</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    HBI identified{" "}
                    {Math.abs(exposureAnalysis.deltaPercentage) > 10
                      ? "high"
                      : Math.abs(exposureAnalysis.deltaPercentage) > 5
                      ? "medium"
                      : "low"}{" "}
                    risk delta of {Math.abs(exposureAnalysis.deltaPercentage).toFixed(1)}% between owner and
                    subcontractor changes.
                    {exposureAnalysis.percentPendingValue.toFixed(1)}% of change dollars pending approval.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">Process Optimization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average {exposureAnalysis.avgDaysToExecution} days PCO to PCCO processing with{" "}
                    {exposureAnalysis.unlinkedPCOPercentage}% unlinked items. Largest open exposure at{" "}
                    {formatCurrency(exposureAnalysis.largestOpenExposure)} requires attention.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-2 w-2 rounded-full bg-gray-500 animate-pulse"></div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        Interactive Change Management Available
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use the view toggles above to explore change order tracking, exposure analysis, and risk
                      assessment for comprehensive change management oversight.
                    </p>
                  </div>
                  <div className="text-2xl">📋</div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Exposure Analysis Section */}
      <CollapseWrapper
        title="Contract Change Risk Exposure Analysis"
        subtitle="Risk metrics for change orders and commitments"
        defaultCollapsed={false}
      >
        <div className="space-y-6">
          {/* Owner vs Subcontractor Delta */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Total Approved PCCOs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(exposureAnalysis.totalApprovedPCCOs)}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Prime Contract Changes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Total Executed CCOs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {formatCurrency(exposureAnalysis.totalExecutedCCOs)}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Commitment Changes</p>
              </CardContent>
            </Card>

            <Card
              className={`bg-gradient-to-br border-2 ${
                Math.abs(exposureAnalysis.deltaPercentage) > 10
                  ? "from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-red-300 dark:border-red-700"
                  : Math.abs(exposureAnalysis.deltaPercentage) > 5
                  ? "from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30 border-yellow-300 dark:border-yellow-700"
                  : "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-300 dark:border-emerald-700"
              }`}
            >
              <CardHeader className="pb-3">
                <CardTitle
                  className={`text-sm font-medium flex items-center gap-2 ${
                    Math.abs(exposureAnalysis.deltaPercentage) > 10
                      ? "text-red-700 dark:text-red-300"
                      : Math.abs(exposureAnalysis.deltaPercentage) > 5
                      ? "text-yellow-700 dark:text-yellow-300"
                      : "text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Owner vs Sub Delta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    Math.abs(exposureAnalysis.deltaPercentage) > 10
                      ? "text-red-900 dark:text-red-100"
                      : Math.abs(exposureAnalysis.deltaPercentage) > 5
                      ? "text-yellow-900 dark:text-yellow-100"
                      : "text-emerald-900 dark:text-emerald-100"
                  }`}
                >
                  {exposureAnalysis.ownerSubcontractorDelta >= 0 ? "+" : ""}
                  {formatCurrency(exposureAnalysis.ownerSubcontractorDelta)}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-xs ${
                      Math.abs(exposureAnalysis.deltaPercentage) > 10
                        ? "text-red-600 dark:text-red-400"
                        : Math.abs(exposureAnalysis.deltaPercentage) > 5
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {Math.abs(exposureAnalysis.deltaPercentage).toFixed(1)}% variance
                  </p>
                  <Badge
                    variant={
                      Math.abs(exposureAnalysis.deltaPercentage) > 10
                        ? "destructive"
                        : Math.abs(exposureAnalysis.deltaPercentage) > 5
                        ? "secondary"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {Math.abs(exposureAnalysis.deltaPercentage) > 10
                      ? "🔴 High Risk"
                      : Math.abs(exposureAnalysis.deltaPercentage) > 5
                      ? "🟡 Medium Risk"
                      : "🟢 Low Risk"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unapproved Exposure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Unapproved Exposure Analysis
              </CardTitle>
              <CardDescription>Identified vs approved change exposure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(exposureAnalysis.totalChangeEvents)}
                  </div>
                  <p className="text-sm text-muted-foreground">Change Events</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(exposureAnalysis.totalPendingPCOs)}
                  </div>
                  <p className="text-sm text-muted-foreground">Pending PCOs</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(exposureAnalysis.totalIdentifiedExposure)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Identified</p>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div
                    className={`text-xl font-bold ${
                      exposureAnalysis.unapprovedExposure > 50000
                        ? "text-red-600"
                        : exposureAnalysis.unapprovedExposure > 25000
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {formatCurrency(exposureAnalysis.unapprovedExposure)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">Unapproved</p>
                    <Badge
                      variant={
                        exposureAnalysis.unapprovedExposure > 50000
                          ? "destructive"
                          : exposureAnalysis.unapprovedExposure > 25000
                          ? "secondary"
                          : "default"
                      }
                      className="text-xs"
                    >
                      {exposureAnalysis.unapprovedExposure > 50000
                        ? "🔴"
                        : exposureAnalysis.unapprovedExposure > 25000
                        ? "🟡"
                        : "🟢"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Scorecard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-600" />
                Risk Scorecard
              </CardTitle>
              <CardDescription>Key risk indicators and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">% Change Dollars Pending</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(exposureAnalysis.totalPendingPCOs)} of{" "}
                        {formatCurrency(exposureAnalysis.totalPendingPCOs + exposureAnalysis.totalApprovedPCCOs)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">
                        {exposureAnalysis.percentPendingValue.toFixed(1)}%
                      </div>
                      <Badge
                        variant={exposureAnalysis.percentPendingValue > 30 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {exposureAnalysis.percentPendingValue > 30 ? "High" : "Moderate"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Avg Days PCO to PCCO</p>
                      <p className="text-xs text-muted-foreground">Processing time</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{exposureAnalysis.avgDaysToExecution} days</div>
                      <Badge
                        variant={exposureAnalysis.avgDaysToExecution > 21 ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {exposureAnalysis.avgDaysToExecution > 21 ? "Slow" : "Good"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">% PCOs Unlinked to PCCO</p>
                      <p className="text-xs text-muted-foreground">Process gaps</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{exposureAnalysis.unlinkedPCOPercentage}%</div>
                      <Badge
                        variant={exposureAnalysis.unlinkedPCOPercentage > 20 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {exposureAnalysis.unlinkedPCOPercentage > 20 ? "Poor" : "Fair"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Largest Open Exposure</p>
                      <p className="text-xs text-muted-foreground">Single item risk</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(exposureAnalysis.largestOpenExposure)}
                      </div>
                      <Badge
                        variant={exposureAnalysis.largestOpenExposure > 30000 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {exposureAnalysis.largestOpenExposure > 30000 ? "High" : "Moderate"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapseWrapper>

      {/* Main Content Area */}
      {renderContent()}
    </div>
  )
}
