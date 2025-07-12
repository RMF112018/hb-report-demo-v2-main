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
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  ClipboardCheck,
  Users,
  CalendarCheck,
  TrendingUp,
  Target,
  Award,
  FileText,
  Shield,
  Wrench,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  Flag,
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

interface BetaCloseoutProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaCloseout({ className, config, isCompact = false, userRole }: BetaCloseoutProps) {
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
          overallCompletion: 78.5,
          totalItems: 48,
          completedItems: 38,
          pendingItems: 7,
          criticalItems: 3,
          daysToCompletion: 12,
          lastActivity: "2 hours ago",
          projectPhase: "Turnover",
          riskLevel: "Medium",
          categories: [
            { name: "Tasks", total: 5, completed: 5, pending: 0, critical: 0, completion: 100 },
            { name: "Document Tracking", total: 13, completed: 11, pending: 1, critical: 1, completion: 84.6 },
            { name: "Inspections", total: 11, completed: 9, pending: 2, critical: 0, completion: 81.8 },
            { name: "Turnover", total: 15, completed: 10, pending: 3, critical: 2, completion: 66.7 },
            { name: "Post Turnover", total: 5, completed: 3, pending: 1, critical: 0, completion: 60.0 },
          ],
          projectDetails: {
            name: "Tropical World Nursery",
            phase: "Turnover",
            coDate: "2025-01-15",
            punchListItems: 12,
            warrantyStatus: "Pending",
          },
        }
      case "project-executive":
        return {
          overallCompletion: 82.3,
          totalItems: 288,
          completedItems: 237,
          pendingItems: 38,
          criticalItems: 13,
          daysToCompletion: 18,
          lastActivity: "1 hour ago",
          projectPhase: "Mixed",
          riskLevel: "Medium",
          categories: [
            { name: "Tasks", total: 30, completed: 28, pending: 2, critical: 0, completion: 93.3 },
            { name: "Document Tracking", total: 78, completed: 65, pending: 8, critical: 5, completion: 83.3 },
            { name: "Inspections", total: 66, completed: 55, pending: 8, critical: 3, completion: 83.3 },
            { name: "Turnover", total: 90, completed: 70, pending: 15, critical: 5, completion: 77.8 },
            { name: "Post Turnover", total: 30, completed: 19, pending: 5, critical: 0, completion: 63.3 },
          ],
          projectDetails: {
            name: "Portfolio Overview",
            phase: "Mixed Phases",
            coDate: "Various",
            punchListItems: 78,
            warrantyStatus: "Mixed",
          },
        }
      default:
        return {
          overallCompletion: 79.8,
          totalItems: 576,
          completedItems: 459,
          pendingItems: 85,
          criticalItems: 32,
          daysToCompletion: 25,
          lastActivity: "30 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "High",
          categories: [
            { name: "Tasks", total: 60, completed: 55, pending: 4, critical: 1, completion: 91.7 },
            { name: "Document Tracking", total: 156, completed: 125, pending: 20, critical: 11, completion: 80.1 },
            { name: "Inspections", total: 132, completed: 105, pending: 18, critical: 9, completion: 79.5 },
            { name: "Turnover", total: 180, completed: 135, pending: 32, critical: 13, completion: 75.0 },
            { name: "Post Turnover", total: 60, completed: 39, pending: 11, critical: 0, completion: 65.0 },
          ],
          projectDetails: {
            name: "Executive Portfolio",
            phase: "Mixed Phases",
            coDate: "Various",
            punchListItems: 245,
            warrantyStatus: "Mixed",
          },
        }
    }
  }

  const data = getDataByRole()

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getStatusColor = (completion: number) => {
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

  // Historical data for trend analysis
  const historicalData = [
    { month: "Oct", completion: 65.2, items: 35, critical: 8 },
    { month: "Nov", completion: 72.5, items: 42, critical: 6 },
    { month: "Dec", completion: 75.1, items: 45, critical: 4 },
    { month: "Jan", completion: data.overallCompletion, items: data.totalItems, critical: data.criticalItems },
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
              <Flag className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">Project Closeout</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Completion & Handover</p>
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
          <span>{data.lastActivity}</span>
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
                  <span className="text-sm font-medium">Overall Progress</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatPercentage(data.overallCompletion)}
                </div>
                <div className="text-xs text-orange-700 dark:text-orange-300">
                  {data.completedItems} of {data.totalItems} items
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">Days to Complete</span>
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.daysToCompletion}</div>
                <div className="text-xs text-orange-700 dark:text-orange-300">Estimated completion</div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.completedItems}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{data.pendingItems}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.criticalItems}</div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">Project Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Project:</span>
                  <span className="font-medium">{data.projectDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phase:</span>
                  <span className="font-medium">{data.projectDetails.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">CO Date:</span>
                  <span className="font-medium">{data.projectDetails.coDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Punch List:</span>
                  <span className="font-medium">{data.projectDetails.punchListItems} items</span>
                </div>
              </div>
            </div>

            {/* Warranty Status */}
            <div className="bg-orange-50 dark:bg-orange-950/50 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-sm mb-2 text-orange-700 dark:text-orange-300">Warranty Status</h4>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm">Warranty documentation: {data.projectDetails.warrantyStatus}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="flex-1 space-y-4 overflow-y-auto">
            {/* Category Progress */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Category Progress</h4>
              {data.categories.map((category, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.completion}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{formatPercentage(category.completion)}</span>
                    <div className="flex gap-2">
                      {category.pending > 0 && (
                        <span className="text-yellow-600 dark:text-yellow-400">{category.pending} pending</span>
                      )}
                      {category.critical > 0 && (
                        <span className="text-red-600 dark:text-red-400">{category.critical} critical</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Distribution Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Category Distribution</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.categories}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="total"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : "0"}%`}
                  >
                    {data.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors.primary} fillOpacity={0.8 - index * 0.15} />
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
            {/* Completion Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Completion Trend</h4>
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
                    dataKey="completion"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartColors.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Critical Items Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Critical Items Trend</h4>
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
                  <Bar dataKey="critical" fill="#ef4444" />
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
