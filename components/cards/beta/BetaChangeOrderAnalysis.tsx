"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Activity,
  Timer,
  Bell,
  Sparkles,
  Clock,
  Edit,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react"
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
  ComposedChart,
} from "recharts"

interface BetaChangeOrderAnalysisProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaChangeOrderAnalysis({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaChangeOrderAnalysisProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  const [activeTab, setActiveTab] = useState("overview")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Mock change order data
  const changeOrderData = React.useMemo(() => {
    const changeOrders = [
      {
        id: "CO-001",
        project: "Miami Commercial Tower",
        description: "Additional HVAC requirements",
        amount: 125000,
        status: "approved",
        type: "scope",
        submitDate: "2024-12-15",
        approvalDate: "2024-12-20",
        impact: "schedule",
      },
      {
        id: "CO-002",
        project: "Coral Gables Luxury Condominium",
        description: "Permit requirement changes",
        amount: 85000,
        status: "pending",
        type: "regulatory",
        submitDate: "2024-12-18",
        approvalDate: null,
        impact: "cost",
      },
      {
        id: "CO-003",
        project: "Naples Waterfront Condominium",
        description: "Design modifications",
        amount: 65000,
        status: "approved",
        type: "design",
        submitDate: "2024-12-10",
        approvalDate: "2024-12-22",
        impact: "schedule",
      },
      {
        id: "CO-004",
        project: "Miami Commercial Tower",
        description: "Material upgrade",
        amount: 45000,
        status: "rejected",
        type: "material",
        submitDate: "2024-12-12",
        approvalDate: null,
        impact: "quality",
      },
      {
        id: "CO-005",
        project: "Tropical World",
        description: "Site condition remediation",
        amount: 180000,
        status: "approved",
        type: "site",
        submitDate: "2024-12-08",
        approvalDate: "2024-12-16",
        impact: "cost",
      },
    ]

    // Calculate metrics
    const totalValue = changeOrders.reduce((sum, co) => sum + co.amount, 0)
    const approvedValue = changeOrders.filter((co) => co.status === "approved").reduce((sum, co) => sum + co.amount, 0)
    const pendingValue = changeOrders.filter((co) => co.status === "pending").reduce((sum, co) => sum + co.amount, 0)
    const rejectedValue = changeOrders.filter((co) => co.status === "rejected").reduce((sum, co) => sum + co.amount, 0)

    const approvedCount = changeOrders.filter((co) => co.status === "approved").length
    const pendingCount = changeOrders.filter((co) => co.status === "pending").length
    const rejectedCount = changeOrders.filter((co) => co.status === "rejected").length

    const approvalRate = (approvedCount / (approvedCount + rejectedCount)) * 100

    // Trend data (last 6 months)
    const trendData = Array.from({ length: 6 }, (_, i) => ({
      month: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      submitted: Math.floor(Math.random() * 8) + 3,
      approved: Math.floor(Math.random() * 6) + 2,
      value: Math.floor(Math.random() * 200000) + 100000,
      avgProcessingTime: Math.floor(Math.random() * 10) + 5,
    }))

    // By type breakdown
    const typeData = changeOrders.reduce((acc, co) => {
      acc[co.type] = (acc[co.type] || 0) + co.amount
      return acc
    }, {} as Record<string, number>)

    const typeChartData = Object.entries(typeData).map(([type, amount]) => ({
      name: type,
      value: amount,
      fill:
        type === "scope"
          ? "#3B82F6"
          : type === "design"
          ? "#10B981"
          : type === "material"
          ? "#F59E0B"
          : type === "site"
          ? "#EF4444"
          : "#8B5CF6",
    }))

    // By project breakdown
    const projectData = changeOrders.reduce((acc, co) => {
      acc[co.project] = (acc[co.project] || 0) + co.amount
      return acc
    }, {} as Record<string, number>)

    const projectChartData = Object.entries(projectData).map(([project, amount]) => ({
      name: project.length > 20 ? project.substring(0, 20) + "..." : project,
      value: amount,
      fill: "#3B82F6",
    }))

    // Status distribution
    const statusData = [
      { name: "Approved", value: approvedCount, fill: "#10B981" },
      { name: "Pending", value: pendingCount, fill: "#F59E0B" },
      { name: "Rejected", value: rejectedCount, fill: "#EF4444" },
    ]

    return {
      changeOrders,
      totalValue,
      approvedValue,
      pendingValue,
      rejectedValue,
      approvedCount,
      pendingCount,
      rejectedCount,
      approvalRate,
      trendData,
      typeChartData,
      projectChartData,
      statusData,
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "rejected":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Timer className="h-3 w-3" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border border-[#FA4616]/20 dark:border-[#FA4616]/40 rounded-lg h-full ${className}`}
    >
      <CardHeader className="pb-3 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-[#FA4616] rounded-md flex-shrink-0">
              <FileText className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold text-[#FA4616] dark:text-[#FF8A67] leading-tight">
                Change Order Analysis
              </CardTitle>
              <CardDescription className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80 leading-tight">
                Portfolio change order tracking
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge
              variant="outline"
              className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67] text-xs px-1.5 py-0.5"
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Power BI
            </Badge>
            <Badge
              variant="outline"
              className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6] text-xs px-1.5 py-0.5"
            >
              <Target className="h-2.5 w-2.5 mr-1" />
              {changeOrderData.approvalRate.toFixed(1)}%
            </Badge>
            <div className="flex items-center gap-1">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-[#FA4616] scale-75"
              />
              <Label className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80">Auto</Label>
            </div>
          </div>
        </div>
        <div className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80 mt-1">
          Last updated: {lastUpdated.toLocaleTimeString()} • {changeOrderData.changeOrders.length} change orders
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 h-8">
            <TabsTrigger value="overview" className="text-xs px-2 py-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs px-2 py-1">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs px-2 py-1">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(changeOrderData.totalValue)}</p>
                  </div>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+12% vs last month</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Approved</p>
                    <p className="text-lg font-bold text-green-600">{changeOrderData.approvedCount}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{formatCurrency(changeOrderData.approvedValue)}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-bold text-yellow-600">{changeOrderData.pendingCount}</p>
                  </div>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Timer className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">{formatCurrency(changeOrderData.pendingValue)}</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Rejected</p>
                    <p className="text-lg font-bold text-red-600">{changeOrderData.rejectedCount}</p>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownCircle className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-600">{formatCurrency(changeOrderData.rejectedValue)}</span>
                </div>
              </div>
            </div>

            {/* Change Orders List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Recent Change Orders</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {changeOrderData.changeOrders.map((co) => (
                    <div
                      key={co.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{co.id}</span>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(co.status)}`}>
                            {getStatusIcon(co.status)}
                            {co.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{co.description}</div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{co.project}</span>
                          <span>Type: {co.type}</span>
                          <span>Impact: {co.impact}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{formatCurrency(co.amount)}</div>
                        <div className="text-xs text-gray-500">{co.submitDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Type Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Change Order Types</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={changeOrderData.typeChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {changeOrderData.typeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), "Value"]}
                      labelFormatter={(label) => `Type: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Change Orders by Project</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={changeOrderData.projectChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                    <YAxis label={{ value: "Value ($)", angle: -90, position: "insideLeft" }} fontSize={10} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value as number), "Total Value"]}
                      labelFormatter={(label) => `Project: ${label}`}
                    />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* Trend Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Change Order Trends</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={changeOrderData.trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis yAxisId="left" fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" fontSize={10} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="submitted" fill="#3B82F6" name="Submitted" />
                    <Bar yAxisId="left" dataKey="approved" fill="#10B981" name="Approved" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgProcessingTime"
                      stroke="#F59E0B"
                      name="Avg Processing Time (days)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Approval Rate</span>
                    <span className="text-xs font-medium text-green-600">
                      {changeOrderData.approvalRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${changeOrderData.approvalRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Processing Efficiency</span>
                    <span className="text-xs font-medium text-blue-600">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Cost Impact</span>
                    <span className="text-xs font-medium text-orange-600">
                      {((changeOrderData.approvedValue / 50000000) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${(changeOrderData.approvedValue / 50000000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Key Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">Approval Rate Improving</div>
                      <div className="text-xs text-gray-600">Up 8% from last quarter</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">Processing Time</div>
                      <div className="text-xs text-gray-600">Avg 7.2 days (target: 5 days)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-3 w-3 text-blue-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">Cost Control</div>
                      <div className="text-xs text-gray-600">Within 2% of budget allowance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
