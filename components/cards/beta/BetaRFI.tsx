"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  Target,
  CheckCircle,
  HelpCircle,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface BetaRFIProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaRFI({ className, config, isCompact = false, userRole }: BetaRFIProps) {
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

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        return {
          totalRFIs: 24,
          pendingRFIs: 6,
          resolvedRFIs: 18,
          avgResolutionDays: 8.3,
          targetResolutionDays: 7.0,
          costImpact: 245000,
          scheduleImpact: 12,
          performanceScore: 82.5,
          overdue: 2,
          categoryBreakdown: [
            { category: "Design Clarification", count: 9, avgResolution: 7.2, costImpact: 125000, color: "#0021A5" },
            { category: "Material Specs", count: 8, avgResolution: 8.9, costImpact: 78000, color: "#0021A5CC" },
            { category: "Field Conditions", count: 4, avgResolution: 9.8, costImpact: 32000, color: "#0021A580" },
            { category: "Code Compliance", count: 3, avgResolution: 6.5, costImpact: 10000, color: "#0021A540" },
          ],
          riskLevel: "Low",
        }
      case "project-executive":
        return {
          totalRFIs: 186,
          pendingRFIs: 38,
          resolvedRFIs: 148,
          avgResolutionDays: 9.7,
          targetResolutionDays: 8.0,
          costImpact: 1850000,
          scheduleImpact: 89,
          performanceScore: 76.3,
          overdue: 15,
          categoryBreakdown: [
            { category: "Design Clarification", count: 68, avgResolution: 8.9, costImpact: 890000, color: "#0021A5" },
            { category: "Material Specs", count: 52, avgResolution: 10.2, costImpact: 625000, color: "#0021A5CC" },
            { category: "Field Conditions", count: 38, avgResolution: 11.1, costImpact: 245000, color: "#0021A580" },
            { category: "Code Compliance", count: 28, avgResolution: 7.8, costImpact: 90000, color: "#0021A540" },
          ],
          riskLevel: "Medium",
        }
      default:
        return {
          totalRFIs: 524,
          pendingRFIs: 89,
          resolvedRFIs: 435,
          avgResolutionDays: 10.8,
          targetResolutionDays: 8.5,
          costImpact: 5240000,
          scheduleImpact: 287,
          performanceScore: 71.2,
          overdue: 28,
          categoryBreakdown: [
            {
              category: "Design Clarification",
              count: 195,
              avgResolution: 10.2,
              costImpact: 2450000,
              color: "#0021A5",
            },
            { category: "Material Specs", count: 158, avgResolution: 11.8, costImpact: 1680000, color: "#0021A5CC" },
            { category: "Field Conditions", count: 102, avgResolution: 12.1, costImpact: 845000, color: "#0021A580" },
            { category: "Code Compliance", count: 69, avgResolution: 8.9, costImpact: 265000, color: "#0021A540" },
          ],
          riskLevel: "High",
        }
    }
  }

  const data = getDataByRole()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPerformanceGrade = (score: number) => {
    if (score >= 85) return "A"
    if (score >= 75) return "B"
    if (score >= 65) return "C"
    return "D"
  }

  const getGradeColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 65) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const closureRate = (data.resolvedRFIs / data.totalRFIs) * 100
  const performanceGrade = getPerformanceGrade(data.performanceScore)

  // Historical data for trend analysis
  const historicalData = [
    { month: "Oct", submitted: 42, resolved: 38, avgDays: 9.2 },
    { month: "Nov", submitted: 35, resolved: 41, avgDays: 8.8 },
    { month: "Dec", submitted: 48, resolved: 45, avgDays: 7.9 },
    {
      month: "Jan",
      submitted: Math.floor(data.totalRFIs * 0.4),
      resolved: Math.floor(data.resolvedRFIs * 0.4),
      avgDays: data.avgResolutionDays,
    },
  ]

  // Orange theme colors for charts
  const chartColors = {
    primary: "#FA4616",
    secondary: "#FA4616CC",
    tertiary: "#FA461680",
    quaternary: "#FA461640",
    gradient: "rgba(250, 70, 22, 0.1)",
  }

  return (
    <Card className={`h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex-shrink-0 space-y-0 pb-3 px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">RFI Monitor</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Request for Information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs px-1.5 py-0.5 ${getGradeColor(data.performanceScore)} border-current`}
            >
              Grade {performanceGrade}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="h-6 w-6 p-0">
              <RefreshCw className={`h-3 w-3 ${autoRefresh ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          <span>•</span>
          <span>{data.overdue} overdue</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-4 overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">Closure Rate</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{closureRate.toFixed(1)}%</div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  {data.resolvedRFIs} of {data.totalRFIs} RFIs
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">Avg Resolution</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {data.avgResolutionDays} <span className="text-sm">days</span>
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  Target: {data.targetResolutionDays} days
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{data.pendingRFIs}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.resolvedRFIs}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.overdue}</div>
              </div>
            </div>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Cost Impact</span>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(data.costImpact)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Potential cost impact</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Schedule Impact</span>
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {data.scheduleImpact} <span className="text-sm">days</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Potential delay</div>
              </div>
            </div>

            {/* Performance Score */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Performance Score</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Performance</span>
                  <span className="font-medium">{data.performanceScore.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.performanceScore}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Grade {performanceGrade} - {data.performanceScore >= 75 ? "Good" : "Needs Improvement"}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="flex-1 space-y-4 overflow-y-auto">
            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Category Breakdown</h4>
              {data.categoryBreakdown.map((category, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{category.count} RFIs</span>
                      <span className="text-sm font-medium">{category.avgResolution.toFixed(1)} days</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                    <span>Avg Resolution: {category.avgResolution.toFixed(1)} days</span>
                    <span>Impact: {formatCurrency(category.costImpact)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">RFI Distribution by Category</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, percent }) => `${category} ${percent ? (percent * 100).toFixed(0) : "0"}%`}
                  >
                    {data.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="flex-1 space-y-4 overflow-y-auto">
            {/* Resolution Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Resolution Trend</h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDays"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartColors.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Volume Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Volume Trend</h4>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="submitted" fill={chartColors.primary} />
                  <Bar dataKey="resolved" fill={chartColors.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Real-time Controls */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Real-time Updates</span>
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    className="data-[state=checked]:bg-orange-600"
                  />
                  <Label htmlFor="auto-refresh" className="text-xs">
                    Auto-refresh
                  </Label>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Activity className="h-3 w-3" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
