"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Calculator,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  Pie,
} from "recharts"

// Import projects data
import projectsData from "@/data/mock/projects.json"

interface BetaFinancialOverviewProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaFinancialOverview({ className, config, isCompact }: BetaFinancialOverviewProps) {
  // Scale classes based on isCompact prop with minimum size constraints to prevent over-compression
  const compactScale = {
    // Minimum sizes to prevent over-compression and overflow
    iconSize: isCompact ? "h-4 w-4" : "h-5 w-5", // Increased from h-3 w-3
    iconSizeSmall: isCompact ? "h-3 w-3" : "h-3 w-3", // Increased from h-2 w-2
    textTitle: isCompact ? "text-base" : "text-lg", // Increased from text-sm
    textSmall: isCompact ? "text-xs" : "text-xs", // Increased from text-[10px]
    textMedium: isCompact ? "text-sm" : "text-sm", // Increased from text-xs
    padding: isCompact ? "p-2" : "p-2", // Increased from p-1
    paddingCard: isCompact ? "pb-2" : "pb-2", // Increased from pb-1
    gap: isCompact ? "gap-2" : "gap-2", // Increased from gap-1
    marginTop: isCompact ? "mt-1" : "mt-1", // Increased from mt-0.5
    chartHeight: isCompact ? "h-32" : "h-40", // Reduced for better auto-sizing
    // Remove minimum constraints to allow automatic height
    minTextSize: isCompact ? "text-xs" : "text-sm",
    minButtonSize: isCompact ? "h-7 w-7" : "h-8 w-8",
    minBadgePadding: isCompact ? "px-2 py-1" : "px-2 py-1",
  }
  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Filter construction projects
  const constructionProjects = projectsData.filter((project) => project.project_stage_name === "Construction")

  // Calculate financial metrics from construction projects
  const financialMetrics = React.useMemo(() => {
    const totalOriginalValue = constructionProjects.reduce((sum, p) => sum + p.contract_value, 0)
    const totalApprovedChanges = constructionProjects.reduce((sum, p) => sum + p.approved_changes, 0)
    const totalCurrentValue = constructionProjects.reduce((sum, p) => sum + p.total_value, 0)
    const totalContingency = constructionProjects.reduce((sum, p) => sum + p.contingency_original, 0)
    const totalApprovedContingency = constructionProjects.reduce((sum, p) => sum + p.contingency_approved, 0)

    // Calculate profit metrics (assuming 10% original profit margin)
    const originalProfit = totalOriginalValue * 0.1
    const currentProfit = totalCurrentValue * 0.1
    const potentialProfit = currentProfit + totalContingency * 0.5 // 50% contingency benefit

    return {
      originalContractValue: totalOriginalValue,
      approvedChanges: totalApprovedChanges,
      currentApprovedValue: totalCurrentValue,
      originalProfit,
      currentProfit,
      potentialProfit,
      profitVariance: potentialProfit - originalProfit,
      totalContingency,
      totalApprovedContingency,
      projectCount: constructionProjects.length,
    }
  }, [constructionProjects])

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Key financial metrics cards
  const keyMetrics = [
    {
      title: "Original Contract Value",
      value: formatCurrency(financialMetrics.originalContractValue),
      change: "+0.0%",
      trend: "neutral",
      icon: DollarSign,
      color: "text-blue-600",
    },
    {
      title: "Approved Changes",
      value: formatCurrency(financialMetrics.approvedChanges),
      change: financialMetrics.approvedChanges > 0 ? "+100%" : "0%",
      trend: financialMetrics.approvedChanges > 0 ? "up" : "neutral",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Current Approved Value",
      value: formatCurrency(financialMetrics.currentApprovedValue),
      change: `+${(
        ((financialMetrics.currentApprovedValue - financialMetrics.originalContractValue) /
          financialMetrics.originalContractValue) *
        100
      ).toFixed(1)}%`,
      trend: "up",
      icon: Calculator,
      color: "text-purple-600",
    },
    {
      title: "Potential Total Profit",
      value: formatCurrency(financialMetrics.potentialProfit),
      change: `+${(
        ((financialMetrics.potentialProfit - financialMetrics.originalProfit) / financialMetrics.originalProfit) *
        100
      ).toFixed(1)}%`,
      trend: "up",
      icon: Target,
      color: "text-green-600",
    },
  ]

  // Project breakdown data
  const projectBreakdown = constructionProjects.map((project, index) => ({
    name: project.name.split(" ").slice(0, 2).join(" "),
    original: project.contract_value,
    current: project.total_value,
    profit: project.total_value * 0.1,
    color: `hsl(${(index * 360) / constructionProjects.length}, 70%, 50%)`,
  }))

  // Profit trend data (mock monthly data)
  const profitTrend = Array.from({ length: 8 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i],
    original: financialMetrics.originalProfit / 8,
    current: financialMetrics.currentProfit / 8,
    potential: financialMetrics.potentialProfit / 8,
  }))

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  return (
    <Card
      className={`bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#0021A5] dark:text-[#4A7FD6]`}>
              Financial Overview
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#0021A5]/70 dark:text-[#4A7FD6]/80`}>
              {constructionProjects.length} Construction Projects •{" "}
              {formatCurrency(financialMetrics.currentApprovedValue)} Total Value
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.minTextSize} ${compactScale.minBadgePadding} bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]`}
              >
                <BarChart3 className={`${compactScale.iconSizeSmall} mr-0.5`} />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className={`${compactScale.minTextSize} ${compactScale.minBadgePadding} bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]`}
                >
                  <RefreshCw className={`${compactScale.iconSizeSmall} mr-0.5`} />
                  Live Updates
                </Badge>
              )}
            </div>
          </div>
          <div className={`flex items-center ${compactScale.gap}`}>
            <div className={`flex items-center space-x-${isCompact ? "1" : "2"}`}>
              <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label
                htmlFor="real-time"
                className={`${compactScale.textMedium} text-[#0021A5]/70 dark:text-[#4A7FD6]/80`}
              >
                Real-time
              </Label>
            </div>
            <Button size="sm" variant="outline" className={`${compactScale.minButtonSize} p-0`}>
              <RefreshCw className={compactScale.iconSizeSmall} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={isCompact ? "p-2" : "p-3"}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${isCompact ? "mb-2" : "mb-4"}`}>
            <TabsTrigger value="overview" className={compactScale.textSmall}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="breakdown" className={compactScale.textSmall}>
              Breakdown
            </TabsTrigger>
            <TabsTrigger value="trends" className={compactScale.textSmall}>
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Metrics Grid */}
            <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-3"}`}>
              {keyMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-800 ${
                      isCompact ? "p-2" : "p-3"
                    } rounded-lg border border-blue-200 dark:border-gray-700`}
                  >
                    <div className={`flex items-center justify-between ${isCompact ? "mb-1" : "mb-2"}`}>
                      <Icon className={`${isCompact ? "h-3 w-3" : "h-5 w-5"} ${metric.color}`} />
                      <Badge
                        variant="outline"
                        className={`${compactScale.minTextSize} ${compactScale.minBadgePadding} ${
                          metric.trend === "up"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : metric.trend === "down"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    <p className={`${compactScale.minTextSize} font-medium text-gray-700 dark:text-gray-300`}>
                      {metric.title}
                    </p>
                    <p className={`${compactScale.textMedium} font-bold text-gray-900 dark:text-gray-100`}>
                      {metric.value}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Summary Statistics */}
            <div
              className={`bg-white dark:bg-gray-800 ${
                isCompact ? "p-2" : "p-3"
              } rounded-lg border border-blue-200 dark:border-gray-700`}
            >
              <h4
                className={`${compactScale.minTextSize} font-medium text-gray-700 dark:text-gray-300 ${
                  isCompact ? "mb-1" : "mb-2"
                }`}
              >
                Portfolio Summary
              </h4>
              <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-4"} ${compactScale.minTextSize}`}>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
                  <span className="font-medium">{constructionProjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Contract Value</span>
                  <span className="font-medium">
                    {constructionProjects.length > 0
                      ? formatCurrency(financialMetrics.originalContractValue / constructionProjects.length)
                      : formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Contingency</span>
                  <span className="font-medium">{formatCurrency(financialMetrics.totalContingency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Profit Margin</span>
                  <span className="font-medium text-green-600">
                    {((financialMetrics.potentialProfit / financialMetrics.currentApprovedValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Project Value Breakdown */}
            <div
              className={`bg-white dark:bg-gray-800 ${
                isCompact ? "p-2" : "p-3"
              } rounded-lg border border-blue-200 dark:border-gray-700`}
            >
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Value Distribution</h4>
              <div className={compactScale.chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={projectBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="current"
                      label={({ name, value }) => `${name}: ${formatCurrency(value as number)}`}
                    >
                      {projectBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Individual Project Details */}
            <div
              className={`bg-white dark:bg-gray-800 ${
                isCompact ? "p-2" : "p-3"
              } rounded-lg border border-blue-200 dark:border-gray-700`}
            >
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Details</h4>
              <div className={`space-y-2 ${isCompact ? "max-h-32" : "max-h-40"} overflow-y-auto`}>
                {constructionProjects.map((project, index) => (
                  <div
                    key={project.project_id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className={`${compactScale.minTextSize} font-medium text-gray-900 dark:text-gray-100`}>
                        {project.name}
                      </p>
                      <p className={`${compactScale.minTextSize} text-gray-500 dark:text-gray-400`}>
                        {project.project_number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${compactScale.minTextSize} font-medium text-gray-900 dark:text-gray-100`}>
                        {formatCurrency(project.total_value)}
                      </p>
                      <p className={`${compactScale.minTextSize} text-gray-500 dark:text-gray-400`}>
                        {project.project_type_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Profit Trend Chart */}
            <div
              className={`bg-white dark:bg-gray-800 ${
                isCompact ? "p-2" : "p-3"
              } rounded-lg border border-blue-200 dark:border-gray-700`}
            >
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Profit Trend Analysis</h4>
              <div className={compactScale.chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={profitTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="original" stroke="#3B82F6" strokeWidth={2} name="Original Profit" />
                    <Line type="monotone" dataKey="current" stroke="#10B981" strokeWidth={2} name="Current Profit" />
                    <Line
                      type="monotone"
                      dataKey="potential"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Potential Profit"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Indicators */}
            <div
              className={`bg-white dark:bg-gray-800 ${
                isCompact ? "p-2" : "p-3"
              } rounded-lg border border-blue-200 dark:border-gray-700`}
            >
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Financial Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${compactScale.minTextSize} text-gray-600 dark:text-gray-400`}>Revenue Growth</span>
                  <Badge
                    variant="outline"
                    className={`${compactScale.minTextSize} ${compactScale.minBadgePadding} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />+
                    {(
                      ((financialMetrics.currentApprovedValue - financialMetrics.originalContractValue) /
                        financialMetrics.originalContractValue) *
                      100
                    ).toFixed(1)}
                    %
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${compactScale.minTextSize} text-gray-600 dark:text-gray-400`}>
                    Profit Optimization
                  </span>
                  <Badge
                    variant="outline"
                    className={`${compactScale.minTextSize} ${compactScale.minBadgePadding} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}
                  >
                    <Target className="h-3 w-3 mr-1" />
                    {((financialMetrics.potentialProfit / financialMetrics.currentApprovedValue) * 100).toFixed(1)}%
                    Margin
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${compactScale.minTextSize} text-gray-600 dark:text-gray-400`}>
                    Risk Assessment
                  </span>
                  <Badge
                    variant="outline"
                    className={`${compactScale.minTextSize} ${compactScale.minBadgePadding} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Low Risk
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className={`${isCompact ? "mt-2 pt-2" : "mt-4 pt-3"} border-t border-blue-200 dark:border-gray-700`}>
          <div
            className={`flex items-center justify-between ${compactScale.minTextSize} text-gray-500 dark:text-gray-400`}
          >
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button
              variant="link"
              size="sm"
              className={`h-auto p-0 ${compactScale.minTextSize} text-blue-600 dark:text-blue-400`}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
