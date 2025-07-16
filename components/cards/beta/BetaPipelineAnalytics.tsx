"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Activity,
  DollarSign,
  Target,
  Calendar,
  MapPin,
  Building2,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  PieChart,
  Users,
  Trophy,
  Zap,
  Sparkles,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"

// Import pursuits data
import pursuitsData from "@/data/mock/pursuits.json"

interface BetaPipelineAnalyticsProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

const COLORS = {
  primary: "#0021A5",
  secondary: "#FA4616",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
  indigo: "#6366F1",
  pink: "#EC4899",
  teal: "#14B8A6",
}

const STATUS_COLORS = {
  Open: COLORS.info,
  Active: COLORS.success,
  Pending: COLORS.warning,
  Closed: COLORS.danger,
}

const RISK_COLORS = {
  Low: COLORS.success,
  Medium: COLORS.warning,
  High: COLORS.danger,
}

export default function BetaPipelineAnalytics({ className, config, isCompact, userRole }: BetaPipelineAnalyticsProps) {
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

  const [isRealTime, setIsRealTime] = useState(false)
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

  // Process pursuits data
  const analytics = React.useMemo(() => {
    const totalValue = pursuitsData.reduce((sum, project) => sum + project.estimatedCost, 0)
    const totalProjects = pursuitsData.length
    const activeProjects = pursuitsData.filter((p) => p.status === "Active").length
    const avgConfidence = pursuitsData.reduce((sum, p) => sum + p.confidence, 0) / totalProjects
    const avgBidValue = totalValue / totalProjects

    // Status distribution
    const statusData = pursuitsData.reduce((acc, project) => {
      const status = project.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
      name: status,
      value: count,
      fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || COLORS.primary,
      percentage: ((count / totalProjects) * 100).toFixed(1),
    }))

    // Risk distribution
    const riskData = pursuitsData.reduce((acc, project) => {
      const risk = project.riskLevel
      acc[risk] = (acc[risk] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const riskChartData = Object.entries(riskData).map(([risk, count]) => ({
      name: risk,
      value: count,
      fill: RISK_COLORS[risk as keyof typeof RISK_COLORS] || COLORS.primary,
      percentage: ((count / totalProjects) * 100).toFixed(1),
    }))

    // Stage distribution based on deliverable
    const stageData = pursuitsData.reduce((acc, project) => {
      const stage = project.deliverable
      acc[stage] = (acc[stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const stageChartData = Object.entries(stageData).map(([stage, count]) => ({
      name: stage,
      value: count,
      fill: COLORS.primary,
      percentage: ((count / totalProjects) * 100).toFixed(1),
    }))

    // Value by project for bar chart
    const valueByProject = pursuitsData.map((project) => ({
      name: project.name.length > 20 ? project.name.substring(0, 20) + "..." : project.name,
      value: project.estimatedCost / 1000000, // Convert to millions
      confidence: project.confidence,
      status: project.status,
      fill: STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] || COLORS.primary,
    }))

    // Confidence vs Value scatter data
    const confidenceValueData = pursuitsData.map((project) => ({
      confidence: project.confidence,
      value: project.estimatedCost / 1000000,
      name: project.name,
      status: project.status,
      fill: STATUS_COLORS[project.status as keyof typeof STATUS_COLORS] || COLORS.primary,
    }))

    return {
      totalValue,
      totalProjects,
      activeProjects,
      avgConfidence,
      avgBidValue,
      statusChartData,
      riskChartData,
      stageChartData,
      valueByProject,
      confidenceValueData,
      winRate: (pursuitsData.filter((p) => p.awarded).length / totalProjects) * 100,
      avgDaysToAward: 25.5, // Mock data
      pipeline: pursuitsData.map((p) => ({
        name: p.name,
        value: p.estimatedCost,
        confidence: p.confidence,
        status: p.status,
        lead: p.lead,
        location: p.location,
        client: p.client,
        bidDueDate: p.bidDueDate,
        riskLevel: p.riskLevel,
      })),
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

  const formatMillions = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border border-[#FA4616]/20 dark:border-[#FA4616]/40 rounded-lg h-full ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FA4616] rounded-lg">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-[#FA4616] dark:text-[#FF8A67]">
                Beta Pipeline Analytics
              </CardTitle>
              <CardDescription className="text-sm text-[#FA4616]/70 dark:text-[#FF8A67]/80">
                AI-powered pipeline insights with predictive analytics
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI Enhanced
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
        <div className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>

      <CardContent className={isCompact ? "p-2" : "p-4"}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${isCompact ? "mb-2" : "mb-4"}`}>
            <TabsTrigger value="overview" className={compactScale.textSmall}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className={compactScale.textSmall}>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="pipeline" className={compactScale.textSmall}>
              Pipeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Metrics */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 ${isCompact ? "gap-2" : "gap-3"}`}>
              <div
                className={`bg-white dark:bg-gray-800 rounded-lg ${compactScale.padding} border border-blue-200 dark:border-blue-800`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-muted-foreground`}>Total Pipeline</p>
                    <p className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-blue-600`}>
                      {formatMillions(analytics.totalValue)}
                    </p>
                  </div>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+15% vs last Q</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Projects</p>
                    <p className="text-lg font-bold text-purple-600">{analytics.activeProjects}</p>
                  </div>
                  <Building2 className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{analytics.totalProjects} total</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Confidence</p>
                    <p className="text-lg font-bold text-green-600">{analytics.avgConfidence.toFixed(1)}%</p>
                  </div>
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2.3% vs last Q</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-bold text-orange-600">{analytics.winRate.toFixed(1)}%</p>
                  </div>
                  <Trophy className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">Industry avg: 25%</span>
                </div>
              </div>
            </div>

            {/* Status and Risk Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Status Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics.statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} projects`, name]}
                        labelFormatter={(label) => `Status: ${label}`}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Risk Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics.riskChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.riskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} projects`, name]}
                        labelFormatter={(label) => `Risk Level: ${label}`}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Project Value Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Project Value Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.valueByProject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                    <YAxis label={{ value: "Value ($M)", angle: -90, position: "insideLeft" }} fontSize={10} />
                    <Tooltip
                      formatter={(value) => [`$${value}M`, "Project Value"]}
                      labelFormatter={(label) => `Project: ${label}`}
                    />
                    <Bar dataKey="value" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Confidence vs Value Scatter */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Confidence vs Value Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.confidenceValueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="confidence"
                      label={{ value: "Confidence %", position: "insideBottom", offset: -5 }}
                      fontSize={10}
                    />
                    <YAxis label={{ value: "Value ($M)", angle: -90, position: "insideLeft" }} fontSize={10} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "value" ? `$${value}M` : `${value}%`,
                        name === "value" ? "Project Value" : "Confidence",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={COLORS.primary}
                      fill={COLORS.primary}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Pipeline List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Active Pipeline</h4>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {analytics.pipeline.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">{project.name}</h5>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              project.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : project.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {project.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {project.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {project.lead}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{formatCurrency(project.value)}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{project.confidence}% confidence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
