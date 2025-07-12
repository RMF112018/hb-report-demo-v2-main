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
  Users,
  Calendar,
  TrendingUp,
  Target,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  CloudSun,
  MapPin,
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

interface BetaFieldReportsProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaFieldReports({ className, config, isCompact = false, userRole }: BetaFieldReportsProps) {
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

  // Calculate business days since start of month
  const getBusinessDaysSinceMonthStart = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    let count = 0

    for (let d = new Date(startOfMonth); d <= now; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }
    }
    return count
  }

  const businessDaysThisMonth = getBusinessDaysSinceMonthStart()

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        return {
          projectName: "Tropical World Nursery",
          totalReports: businessDaysThisMonth,
          submittedReports: Math.floor(businessDaysThisMonth * 0.91),
          completionRate: 91.3,
          avgSubmissionTime: "10:45 AM",
          lastSubmission: "Today at 9:32 AM",
          superintendent: "Mike Rodriguez",
          businessDaysThisMonth,
          keyMetrics: {
            avgCrewSize: 24.2,
            avgVisitors: 2.1,
            totalDelays: 3,
            safetyIncidents: 1,
            onTimeSubmissions: 89,
          },
          weeklyTrends: [
            { week: "Week 1", reports: 5, completion: 100 },
            { week: "Week 2", reports: 4, completion: 80 },
            { week: "Week 3", reports: 3, completion: 100 },
          ],
          riskLevel: "Low",
        }
      case "project-executive":
        return {
          projectName: "Portfolio Overview",
          totalReports: businessDaysThisMonth * 6,
          submittedReports: Math.floor(businessDaysThisMonth * 6 * 0.847),
          completionRate: 84.7,
          avgSubmissionTime: "11:12 AM",
          lastSubmission: "38 minutes ago",
          superintendent: "Portfolio Team",
          businessDaysThisMonth,
          keyMetrics: {
            avgCrewSize: 26.8,
            avgVisitors: 3.4,
            totalDelays: 18,
            safetyIncidents: 4,
            onTimeSubmissions: 82,
          },
          weeklyTrends: [
            { week: "Week 1", reports: 30, completion: 95 },
            { week: "Week 2", reports: 24, completion: 80 },
            { week: "Week 3", reports: 18, completion: 89 },
          ],
          riskLevel: "Medium",
        }
      default:
        return {
          projectName: "Executive Portfolio",
          totalReports: businessDaysThisMonth * 12,
          submittedReports: Math.floor(businessDaysThisMonth * 12 * 0.79),
          completionRate: 79.2,
          avgSubmissionTime: "11:45 AM",
          lastSubmission: "2 hours ago",
          superintendent: "Executive Team",
          businessDaysThisMonth,
          keyMetrics: {
            avgCrewSize: 28.5,
            avgVisitors: 4.2,
            totalDelays: 45,
            safetyIncidents: 12,
            onTimeSubmissions: 76,
          },
          weeklyTrends: [
            { week: "Week 1", reports: 60, completion: 88 },
            { week: "Week 2", reports: 48, completion: 75 },
            { week: "Week 3", reports: 36, completion: 81 },
          ],
          riskLevel: "High",
        }
    }
  }

  const data = getDataByRole()

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return "text-green-600 dark:text-green-400"
    if (completion >= 80) return "text-blue-600 dark:text-blue-400"
    if (completion >= 70) return "text-yellow-600 dark:text-yellow-400"
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
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">Field Reports</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Daily Progress & Activity</p>
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
          <span>{data.lastSubmission}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-4 overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatPercentage(data.completionRate)}
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  {data.submittedReports} of {data.totalReports} reports
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">Avg Submission</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.avgSubmissionTime}</div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  {data.keyMetrics.onTimeSubmissions}% on time
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Expected</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.totalReports}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.submittedReports}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Missing</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {data.totalReports - data.submittedReports}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Days</div>
                <div className="text-lg font-bold text-gray-600 dark:text-gray-400">{data.businessDaysThisMonth}</div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Project Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Project:</span>
                  <span className="font-medium">{data.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Superintendent:</span>
                  <span className="font-medium">{data.superintendent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Report:</span>
                  <span className="font-medium">{data.lastSubmission}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="flex-1 space-y-4 overflow-y-auto">
            {/* Field Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Avg Crew Size</span>
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{data.keyMetrics.avgCrewSize}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Workers per day</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Avg Visitors</span>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {data.keyMetrics.avgVisitors}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Visitors per day</div>
              </div>
            </div>

            {/* Issues & Safety */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-yellow-50 dark:bg-yellow-950/50 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium">Total Delays</span>
                </div>
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {data.keyMetrics.totalDelays}
                </div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">This month</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium">Safety Incidents</span>
                </div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {data.keyMetrics.safetyIncidents}
                </div>
                <div className="text-xs text-red-700 dark:text-red-300">This month</div>
              </div>
            </div>

            {/* Submission Performance */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Submission Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">On-time submissions</span>
                  <span className="font-medium">{data.keyMetrics.onTimeSubmissions}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${data.keyMetrics.onTimeSubmissions}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Target: 95% on-time submission rate</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="flex-1 space-y-4 overflow-y-auto">
            {/* Weekly Trends Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Weekly Submission Trends</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
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
                  <Bar dataKey="reports" fill={chartColors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Completion Rate Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Completion Rate Trend</h4>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={data.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} />
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
                    dataKey="completion"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartColors.primary, strokeWidth: 2 }}
                  />
                </LineChart>
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
