"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  AlertTriangle,
  Eye,
  FileText,
  MapPin,
  Brain,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  Target,
  TrendingUp,
  Clock,
  Users,
  Award,
  Star,
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

interface BetaQualityControlProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaQualityControl({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaQualityControlProps) {
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

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        return {
          totalInspections: 32,
          openInspections: 8,
          closedInspections: 24,
          passRate: 87.5,
          avgResolutionTime: 3.2,
          criticalIssues: 2,
          tradeBreakdown: [
            { name: "Electrical", inspections: 8, passRate: 92.3, color: "#0021A5" },
            { name: "Plumbing", inspections: 6, passRate: 85.7, color: "#0021A5CC" },
            { name: "HVAC", inspections: 7, passRate: 88.9, color: "#0021A580" },
            { name: "Framing", inspections: 5, passRate: 91.2, color: "#0021A540" },
            { name: "Glazing", inspections: 6, passRate: 78.5, color: "#0021A520" },
          ],
          averageScore: 87.5,
          upcomingInspections: 5,
          qualityTrend: "Improving",
          riskLevel: "Low",
        }
      case "project-executive":
        return {
          totalInspections: 185,
          openInspections: 42,
          closedInspections: 143,
          passRate: 84.2,
          avgResolutionTime: 4.1,
          criticalIssues: 8,
          tradeBreakdown: [
            { name: "Electrical", inspections: 38, passRate: 89.5, color: "#0021A5" },
            { name: "Plumbing", inspections: 32, passRate: 82.4, color: "#0021A5CC" },
            { name: "HVAC", inspections: 35, passRate: 86.8, color: "#0021A580" },
            { name: "Framing", inspections: 28, passRate: 88.1, color: "#0021A540" },
            { name: "Glazing", inspections: 25, passRate: 76.8, color: "#0021A520" },
            { name: "Structural", inspections: 27, passRate: 91.2, color: "#0021A510" },
          ],
          averageScore: 84.2,
          upcomingInspections: 18,
          qualityTrend: "Stable",
          riskLevel: "Medium",
        }
      default:
        return {
          totalInspections: 385,
          openInspections: 85,
          closedInspections: 300,
          passRate: 82.8,
          avgResolutionTime: 4.8,
          criticalIssues: 15,
          tradeBreakdown: [
            { name: "Electrical", inspections: 68, passRate: 89.5, color: "#0021A5" },
            { name: "Plumbing", inspections: 58, passRate: 81.3, color: "#0021A5CC" },
            { name: "HVAC", inspections: 62, passRate: 85.2, color: "#0021A580" },
            { name: "Framing", inspections: 52, passRate: 87.4, color: "#0021A540" },
            { name: "Glazing", inspections: 48, passRate: 75.6, color: "#0021A520" },
            { name: "Structural", inspections: 45, passRate: 90.8, color: "#0021A510" },
            { name: "Waterproofing", inspections: 52, passRate: 74.2, color: "#0021A508" },
          ],
          averageScore: 82.8,
          upcomingInspections: 28,
          qualityTrend: "Needs Attention",
          riskLevel: "High",
        }
    }
  }

  const data = getDataByRole()

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getPassRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400"
    if (rate >= 85) return "text-blue-600 dark:text-blue-400"
    if (rate >= 80) return "text-yellow-600 dark:text-yellow-400"
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

  // Historical data for trend analysis
  const historicalData = [
    { month: "Oct", passRate: 81.2, inspections: 35, resolution: 5.2 },
    { month: "Nov", passRate: 83.5, inspections: 38, resolution: 4.8 },
    { month: "Dec", passRate: 85.1, inspections: 42, resolution: 4.2 },
    { month: "Jan", passRate: data.passRate, inspections: data.totalInspections, resolution: data.avgResolutionTime },
  ]

  // Blue theme colors for charts
  const chartColors = {
    primary: "#0021A5",
    secondary: "#0021A5CC",
    tertiary: "#0021A580",
    quaternary: "#0021A540",
    gradient: "rgba(0, 33, 165, 0.1)",
  }

  return (
    <Card className={`h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex-shrink-0 space-y-0 pb-3 px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">Quality Control</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Inspections & Standards</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getRiskColor(data.riskLevel)} border-current`}>
              {data.riskLevel} Risk
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="h-6 w-6 p-0">
              <RefreshCw className={`h-3 w-3 ${autoRefresh ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          <span>•</span>
          <span>{data.qualityTrend} trend</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-4 overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Pass Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPercentage(data.passRate)}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">{data.closedInspections} passed</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Avg Resolution</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.avgResolutionTime} <span className="text-sm">days</span>
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Resolution time</div>
              </div>
            </div>

            {/* Inspection Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.totalInspections}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{data.openInspections}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.criticalIssues}</div>
              </div>
            </div>

            {/* Quality Score */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Quality Score</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score</span>
                  <span className="font-medium">{formatPercentage(data.averageScore)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.averageScore}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Target: 90% quality score</div>
              </div>
            </div>

            {/* Upcoming Inspections */}
            <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">Upcoming Inspections</h4>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{data.upcomingInspections} quality inspections scheduled</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="flex-1 space-y-4 overflow-y-auto">
            {/* Trade Performance */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Trade Performance</h4>
              {data.tradeBreakdown.map((trade, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{trade.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{trade.inspections} inspections</span>
                      <span className={`text-sm font-medium ${getPassRateColor(trade.passRate)}`}>
                        {formatPercentage(trade.passRate)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trade.passRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Trade Distribution Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Inspection Distribution</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.tradeBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="inspections"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : "0"}%`}
                  >
                    {data.tradeBreakdown.map((entry, index) => (
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
            {/* Pass Rate Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Pass Rate Trend</h4>
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
                    dataKey="passRate"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartColors.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Resolution Time Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Resolution Time Trend</h4>
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
                  <Bar dataKey="resolution" fill={chartColors.secondary} />
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
                    className="data-[state=checked]:bg-blue-600"
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
