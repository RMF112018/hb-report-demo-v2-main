"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
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
  CalendarDays,
  Sparkles,
  Zap,
  Play,
  Pause,
  FastForward,
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

interface BetaScheduleMonitorProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaScheduleMonitor({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaScheduleMonitorProps) {
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
  const [isLive, setIsLive] = useState(false)

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

  // Mock schedule monitoring data
  const scheduleData = React.useMemo(() => {
    const projects = [
      {
        id: 1,
        name: "Miami Commercial Tower",
        progress: 45,
        daysVariance: -3,
        status: "ahead",
        criticalPath: ["Foundation", "Steel Frame", "Envelope"],
        milestones: { completed: 8, upcoming: 12, overdue: 0 },
      },
      {
        id: 2,
        name: "Coral Gables Luxury Condominium",
        progress: 65,
        daysVariance: 7,
        status: "delayed",
        criticalPath: ["Permits", "Concrete", "MEP"],
        milestones: { completed: 15, upcoming: 8, overdue: 2 },
      },
      {
        id: 3,
        name: "Naples Waterfront Condominium",
        progress: 30,
        daysVariance: 0,
        status: "on-track",
        criticalPath: ["Design", "Permits", "Site Prep"],
        milestones: { completed: 5, upcoming: 18, overdue: 0 },
      },
      {
        id: 4,
        name: "Tropical World",
        progress: 85,
        daysVariance: -10,
        status: "ahead",
        criticalPath: ["Finishes", "Inspections", "Closeout"],
        milestones: { completed: 22, upcoming: 3, overdue: 0 },
      },
      {
        id: 5,
        name: "Grandview Heights",
        progress: 20,
        daysVariance: 14,
        status: "delayed",
        criticalPath: ["Permits", "Utilities", "Foundation"],
        milestones: { completed: 2, upcoming: 15, overdue: 1 },
      },
    ]

    // Calculate portfolio metrics
    const totalProjects = projects.length
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects
    const onTimeProjects = projects.filter((p) => p.status === "on-track").length
    const aheadProjects = projects.filter((p) => p.status === "ahead").length
    const delayedProjects = projects.filter((p) => p.status === "delayed").length
    const totalMilestones = projects.reduce(
      (sum, p) => sum + p.milestones.completed + p.milestones.upcoming + p.milestones.overdue,
      0
    )
    const overdueMilestones = projects.reduce((sum, p) => sum + p.milestones.overdue, 0)

    // Create schedule performance trend (last 8 weeks)
    const performanceTrend = Array.from({ length: 8 }, (_, i) => ({
      week: `Week ${i - 7}`,
      onTime: Math.floor(Math.random() * 15) + 60,
      ahead: Math.floor(Math.random() * 10) + 20,
      delayed: Math.floor(Math.random() * 8) + 5,
      avgProgress: Math.floor(Math.random() * 20) + 40 + i * 5,
    }))

    // Progress distribution for chart
    const progressData = projects.map((project) => ({
      name: project.name.length > 15 ? project.name.substring(0, 15) + "..." : project.name,
      progress: project.progress,
      variance: project.daysVariance,
      fill: project.status === "ahead" ? "#10B981" : project.status === "delayed" ? "#EF4444" : "#3B82F6",
    }))

    // Status distribution
    const statusData = [
      { name: "On Track", value: onTimeProjects, fill: "#3B82F6" },
      { name: "Ahead", value: aheadProjects, fill: "#10B981" },
      { name: "Delayed", value: delayedProjects, fill: "#EF4444" },
    ]

    return {
      projects,
      totalProjects,
      avgProgress,
      onTimeProjects,
      aheadProjects,
      delayedProjects,
      totalMilestones,
      overdueMilestones,
      performanceTrend,
      progressData,
      statusData,
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead":
        return "text-green-600 bg-green-50 border-green-200"
      case "delayed":
        return "text-red-600 bg-red-50 border-red-200"
      case "on-track":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ahead":
        return <FastForward className="h-3 w-3" />
      case "delayed":
        return <AlertTriangle className="h-3 w-3" />
      case "on-track":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border border-[#0021A5]/20 dark:border-[#0021A5]/40 rounded-lg h-full ${className}`}
    >
      <CardHeader className="pb-3 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-[#0021A5] rounded-md flex-shrink-0">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold text-[#0021A5] dark:text-[#4A7FD6] leading-tight">
                Schedule Monitor
              </CardTitle>
              <CardDescription className="text-xs text-[#0021A5]/70 dark:text-[#4A7FD6]/80 leading-tight">
                Real-time portfolio schedule tracking
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-1.5 py-0.5"
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Power BI
            </Badge>
            {isLive && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-1.5 py-0.5"
              >
                <Activity className="h-2.5 w-2.5 mr-1" />
                Live
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-blue-600 scale-75"
              />
              <Label className="text-xs text-blue-700 dark:text-blue-300">Auto</Label>
            </div>
          </div>
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Last updated: {lastUpdated.toLocaleTimeString()} • {scheduleData.totalProjects} projects
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 h-8">
            <TabsTrigger value="overview" className="text-xs px-2 py-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs px-2 py-1">
              Performance
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs px-2 py-1">
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Ahead</p>
                    <p className="text-lg font-bold text-green-600">{scheduleData.aheadProjects}</p>
                  </div>
                  <FastForward className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    {((scheduleData.aheadProjects / scheduleData.totalProjects) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">On Track</p>
                    <p className="text-lg font-bold text-blue-600">{scheduleData.onTimeProjects}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600">
                    {((scheduleData.onTimeProjects / scheduleData.totalProjects) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Delayed</p>
                    <p className="text-lg font-bold text-red-600">{scheduleData.delayedProjects}</p>
                  </div>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-600">
                    {((scheduleData.delayedProjects / scheduleData.totalProjects) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Progress</p>
                    <p className="text-lg font-bold text-purple-600">{scheduleData.avgProgress.toFixed(1)}%</p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-600">Portfolio wide</span>
                </div>
              </div>
            </div>

            {/* Project Status List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Project Status Overview</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {scheduleData.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">{project.name}</h5>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                            {getStatusIcon(project.status)}
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>Progress: {project.progress}%</span>
                          <span>
                            Variance: {project.daysVariance > 0 ? "+" : ""}
                            {project.daysVariance} days
                          </span>
                          <span>
                            Milestones: {project.milestones.completed}/
                            {project.milestones.completed + project.milestones.upcoming}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              project.status === "ahead"
                                ? "bg-green-500"
                                : project.status === "delayed"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{project.progress}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Performance Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Schedule Performance Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scheduleData.performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Area type="monotone" dataKey="onTime" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                    <Area type="monotone" dataKey="ahead" stackId="1" stroke="#10B981" fill="#10B981" />
                    <Area type="monotone" dataKey="delayed" stackId="1" stroke="#EF4444" fill="#EF4444" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Progress Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Project Progress Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scheduleData.progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                    <YAxis label={{ value: "Progress %", angle: -90, position: "insideLeft" }} fontSize={10} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Progress"]}
                      labelFormatter={(label) => `Project: ${label}`}
                    />
                    <Bar dataKey="progress" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Status Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Schedule Status Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scheduleData.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scheduleData.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} projects`, name]}
                      labelFormatter={(label) => `Status: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Schedule Risk Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">On-Time Delivery Rate</span>
                    <span className="text-xs font-medium text-green-600">
                      {(
                        ((scheduleData.onTimeProjects + scheduleData.aheadProjects) / scheduleData.totalProjects) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((scheduleData.onTimeProjects + scheduleData.aheadProjects) / scheduleData.totalProjects) *
                          100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Milestone Completion</span>
                    <span className="text-xs font-medium text-blue-600">
                      {(
                        ((scheduleData.totalMilestones - scheduleData.overdueMilestones) /
                          scheduleData.totalMilestones) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((scheduleData.totalMilestones - scheduleData.overdueMilestones) /
                            scheduleData.totalMilestones) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Critical Path Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Projects at Risk</span>
                    <span className="text-xs font-medium text-red-600">{scheduleData.delayedProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Overdue Milestones</span>
                    <span className="text-xs font-medium text-orange-600">{scheduleData.overdueMilestones}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Avg Schedule Variance</span>
                    <span className="text-xs font-medium text-gray-600">
                      {(
                        scheduleData.projects.reduce((sum, p) => sum + p.daysVariance, 0) / scheduleData.projects.length
                      ).toFixed(1)}{" "}
                      days
                    </span>
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
