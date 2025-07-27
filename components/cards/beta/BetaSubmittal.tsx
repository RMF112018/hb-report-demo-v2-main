"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  XCircle,
  Calendar,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  Target,
  Send,
  Archive,
  FileCheck,
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

interface BetaSubmittalProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaSubmittal({ className, config, isCompact = false, userRole }: BetaSubmittalProps) {
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
          totalSubmittals: 42,
          approvedSubmittals: 35,
          pendingSubmittals: 5,
          rejectedSubmittals: 2,
          avgReviewDays: 12.8,
          targetReviewDays: 14.0,
          scheduleCompliance: 87.2,
          performanceScore: 89.5,
          overdue: 3,
          categoryBreakdown: [
            {
              category: "Shop Drawings",
              count: 18,
              avgReview: 14.2,
              approved: 16,
              pending: 1,
              rejected: 1,
              color: "#0021A5",
            },
            {
              category: "Material Samples",
              count: 12,
              avgReview: 10.5,
              approved: 11,
              pending: 1,
              rejected: 0,
              color: "#0021A5CC",
            },
            {
              category: "Product Data",
              count: 8,
              avgReview: 8.9,
              approved: 6,
              pending: 2,
              rejected: 0,
              color: "#0021A580",
            },
            {
              category: "Test Reports",
              count: 4,
              avgReview: 15.6,
              approved: 2,
              pending: 1,
              rejected: 1,
              color: "#0021A540",
            },
          ],
          riskLevel: "Low",
        }
      case "project-executive":
        return {
          totalSubmittals: 248,
          approvedSubmittals: 195,
          pendingSubmittals: 38,
          rejectedSubmittals: 15,
          avgReviewDays: 14.6,
          targetReviewDays: 15.0,
          scheduleCompliance: 82.8,
          performanceScore: 84.3,
          overdue: 18,
          categoryBreakdown: [
            {
              category: "Shop Drawings",
              count: 98,
              avgReview: 16.2,
              approved: 78,
              pending: 15,
              rejected: 5,
              color: "#0021A5",
            },
            {
              category: "Material Samples",
              count: 72,
              avgReview: 12.8,
              approved: 58,
              pending: 12,
              rejected: 2,
              color: "#0021A5CC",
            },
            {
              category: "Product Data",
              count: 52,
              avgReview: 11.5,
              approved: 42,
              pending: 8,
              rejected: 2,
              color: "#0021A580",
            },
            {
              category: "Test Reports",
              count: 26,
              avgReview: 18.9,
              approved: 17,
              pending: 3,
              rejected: 6,
              color: "#0021A540",
            },
          ],
          riskLevel: "Medium",
        }
      default:
        return {
          totalSubmittals: 684,
          approvedSubmittals: 512,
          pendingSubmittals: 118,
          rejectedSubmittals: 54,
          avgReviewDays: 16.2,
          targetReviewDays: 16.0,
          scheduleCompliance: 78.4,
          performanceScore: 79.8,
          overdue: 42,
          categoryBreakdown: [
            {
              category: "Shop Drawings",
              count: 268,
              avgReview: 18.2,
              approved: 198,
              pending: 48,
              rejected: 22,
              color: "#0021A5",
            },
            {
              category: "Material Samples",
              count: 195,
              avgReview: 14.8,
              approved: 152,
              pending: 32,
              rejected: 11,
              color: "#0021A5CC",
            },
            {
              category: "Product Data",
              count: 142,
              avgReview: 13.5,
              approved: 118,
              pending: 18,
              rejected: 6,
              color: "#0021A580",
            },
            {
              category: "Test Reports",
              count: 79,
              avgReview: 21.2,
              approved: 44,
              pending: 20,
              rejected: 15,
              color: "#0021A540",
            },
          ],
          riskLevel: "High",
        }
    }
  }

  const data = getDataByRole()

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    return "D"
  }

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-blue-600 dark:text-blue-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
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

  const approvalRate = (data.approvedSubmittals / data.totalSubmittals) * 100
  const performanceGrade = getPerformanceGrade(data.performanceScore)

  // Historical data for trend analysis
  const historicalData = [
    { month: "Oct", submitted: 58, approved: 45, avgDays: 15.2 },
    { month: "Nov", submitted: 42, approved: 52, avgDays: 14.1 },
    { month: "Dec", submitted: 48, approved: 44, avgDays: 13.8 },
    {
      month: "Jan",
      submitted: Math.floor(data.totalSubmittals * 0.4),
      approved: Math.floor(data.approvedSubmittals * 0.4),
      avgDays: data.avgReviewDays,
    },
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
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">Submittal Monitor</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Review & Approval</p>
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
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Approval Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{approvalRate.toFixed(1)}%</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {data.approvedSubmittals} of {data.totalSubmittals} submittals
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Avg Review Time</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.avgReviewDays} <span className="text-sm">days</span>
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Target: {data.targetReviewDays} days</div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.approvedSubmittals}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{data.pendingSubmittals}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.rejectedSubmittals}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.overdue}</div>
              </div>
            </div>

            {/* Schedule Compliance */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Schedule Compliance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">On-schedule Reviews</span>
                  <span className="font-medium">{data.scheduleCompliance.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.scheduleCompliance}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Target: 90% on-schedule compliance</div>
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
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.performanceScore}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Grade {performanceGrade} - {data.performanceScore >= 80 ? "Good" : "Needs Improvement"}
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
                      <span className="text-xs text-gray-600 dark:text-gray-400">{category.count} submittals</span>
                      <span className="text-sm font-medium">{category.avgReview.toFixed(1)} days</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded">
                      <div className="font-medium text-green-700 dark:text-green-400">{category.approved}</div>
                      <div className="text-green-600 dark:text-green-400">Approved</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded">
                      <div className="font-medium text-yellow-700 dark:text-yellow-400">{category.pending}</div>
                      <div className="text-yellow-600 dark:text-yellow-400">Pending</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded">
                      <div className="font-medium text-red-700 dark:text-red-400">{category.rejected}</div>
                      <div className="text-red-600 dark:text-red-400">Rejected</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Submittal Distribution</h4>
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
            {/* Review Time Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Review Time Trend</h4>
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
                  <Bar dataKey="approved" fill={chartColors.secondary} />
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
