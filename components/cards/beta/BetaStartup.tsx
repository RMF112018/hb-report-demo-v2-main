"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Play,
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
  Settings,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Timer,
  Activity,
  Calendar,
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

interface BetaStartupProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaStartup({ className, config, isCompact = false, userRole }: BetaStartupProps) {
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
          overallCompletion: 85.5,
          totalItems: 55,
          completedItems: 47,
          pendingItems: 6,
          criticalItems: 2,
          daysToMobilization: 5,
          lastActivity: "1 hour ago",
          projectPhase: "Pre-Construction",
          riskLevel: "Low",
          categories: [
            { name: "Contract Review", total: 4, completed: 4, pending: 0, critical: 0, completion: 100 },
            { name: "Job Start-up", total: 33, completed: 28, pending: 4, critical: 1, completion: 84.8 },
            { name: "Services & Equipment", total: 6, completed: 5, pending: 1, critical: 0, completion: 83.3 },
            { name: "Permits", total: 12, completed: 10, pending: 1, critical: 1, completion: 83.3 },
          ],
          projectDetails: {
            name: "Tropical World Nursery",
            phase: "Pre-Construction",
            mobDate: "2025-01-20",
            contractValue: 57235491,
            noticeSentDate: "2025-01-08",
          },
        }
      case "project-executive":
        return {
          overallCompletion: 78.2,
          totalItems: 330,
          completedItems: 258,
          pendingItems: 52,
          criticalItems: 20,
          daysToMobilization: 12,
          lastActivity: "45 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "Medium",
          categories: [
            { name: "Contract Review", total: 24, completed: 22, pending: 2, critical: 0, completion: 91.7 },
            { name: "Job Start-up", total: 198, completed: 155, pending: 30, critical: 13, completion: 78.3 },
            { name: "Services & Equipment", total: 36, completed: 28, pending: 6, critical: 2, completion: 77.8 },
            { name: "Permits", total: 72, completed: 53, pending: 14, critical: 5, completion: 73.6 },
          ],
          projectDetails: {
            name: "Portfolio Overview",
            phase: "Mixed Phases",
            mobDate: "Various",
            contractValue: 342000000,
            noticeSentDate: "Various",
          },
        }
      default:
        return {
          overallCompletion: 73.8,
          totalItems: 660,
          completedItems: 487,
          pendingItems: 125,
          criticalItems: 48,
          daysToMobilization: 18,
          lastActivity: "15 minutes ago",
          projectPhase: "Mixed",
          riskLevel: "High",
          categories: [
            { name: "Contract Review", total: 48, completed: 42, pending: 4, critical: 2, completion: 87.5 },
            { name: "Job Start-up", total: 396, completed: 285, pending: 75, critical: 36, completion: 72.0 },
            { name: "Services & Equipment", total: 72, completed: 52, pending: 15, critical: 5, completion: 72.2 },
            { name: "Permits", total: 144, completed: 108, pending: 31, critical: 5, completion: 75.0 },
          ],
          projectDetails: {
            name: "Executive Portfolio",
            phase: "Mixed Phases",
            mobDate: "Various",
            contractValue: 685000000,
            noticeSentDate: "Various",
          },
        }
    }
  }

  const data = getDataByRole()

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (completion: number) => {
    if (completion >= 90) return "text-green-600 dark:text-green-400"
    if (completion >= 75) return "text-blue-600 dark:text-blue-400"
    if (completion >= 50) return "text-yellow-600 dark:text-yellow-400"
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

  const categoryData = data.categories.map((cat) => ({
    name: cat.name,
    completion: cat.completion,
    total: cat.total,
    completed: cat.completed,
    pending: cat.pending,
    critical: cat.critical,
  }))

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
              <Play className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">Project Startup</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Progress & Mobilization</p>
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
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-4 overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Overall Progress</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPercentage(data.overallCompletion)}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {data.completedItems} of {data.totalItems} items
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Days to Mobilization</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.daysToMobilization}</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Target: {data.projectDetails.mobDate}</div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{data.pendingItems}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.criticalItems}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.completedItems}</div>
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
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="font-medium">{formatCurrency(data.projectDetails.contractValue)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="flex-1 space-y-4 overflow-y-auto">
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
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
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

            {/* Progress Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Category Completion</h4>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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
                  <Bar dataKey="completion" fill={chartColors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 space-y-4 overflow-y-auto">
            {/* Timeline Overview */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Mobilization Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Contract Execution</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pre-Construction Setup</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">In Progress</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Final Permits</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Site Mobilization</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Scheduled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Path */}
            <div className="bg-red-50 dark:bg-red-950/50 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-sm mb-2 text-red-700 dark:text-red-300">Critical Items</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm">Final permit approvals pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm">Subcontractor insurance documentation</span>
                </div>
              </div>
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
