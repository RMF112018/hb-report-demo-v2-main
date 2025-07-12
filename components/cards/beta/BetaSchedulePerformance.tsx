"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"

// Import projects data
import projectsData from "@/data/mock/projects.json"

interface BetaSchedulePerformanceProps {
  className?: string
  config?: any
}

export default function BetaSchedulePerformance({ className, config }: BetaSchedulePerformanceProps) {
  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 35000) // Update every 35 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Filter construction projects
  const constructionProjects = projectsData.filter((project) => project.project_stage_name === "Construction")

  // Calculate schedule metrics from construction projects
  const scheduleMetrics = React.useMemo(() => {
    const today = new Date()

    let totalOnTimeProjects = 0
    let totalDelayedProjects = 0
    let totalAheadProjects = 0
    let totalDamagesRisk = 0

    const projectScheduleDetails = constructionProjects.map((project) => {
      const originalCompletion = new Date(project.original_completion_date || project.projected_finish_date)
      const projectedFinish = new Date(project.projected_finish_date)
      const varianceDays = Math.ceil((projectedFinish.getTime() - originalCompletion.getTime()) / (1000 * 60 * 60 * 24))

      // Calculate status
      let status = "on-time"
      if (varianceDays > 0) {
        status = "delayed"
        totalDelayedProjects++
        totalDamagesRisk += 5000 * varianceDays // Mock damages calculation
      } else if (varianceDays < 0) {
        status = "ahead"
        totalAheadProjects++
      } else {
        totalOnTimeProjects++
      }

      return {
        ...project,
        varianceDays,
        status,
        originalCompletion,
        projectedFinish,
      }
    })

    return {
      totalProjects: constructionProjects.length,
      onTimeProjects: totalOnTimeProjects,
      delayedProjects: totalDelayedProjects,
      aheadProjects: totalAheadProjects,
      totalDamagesRisk,
      averageVariance: projectScheduleDetails.reduce((sum, p) => sum + p.varianceDays, 0) / constructionProjects.length,
      projectScheduleDetails,
    }
  }, [constructionProjects])

  // Format date values
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Key schedule metrics cards
  const keyMetrics = [
    {
      title: "On-Time Projects",
      value: scheduleMetrics.onTimeProjects,
      total: scheduleMetrics.totalProjects,
      percentage: ((scheduleMetrics.onTimeProjects / scheduleMetrics.totalProjects) * 100).toFixed(1),
      trend: "neutral",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Delayed Projects",
      value: scheduleMetrics.delayedProjects,
      total: scheduleMetrics.totalProjects,
      percentage: ((scheduleMetrics.delayedProjects / scheduleMetrics.totalProjects) * 100).toFixed(1),
      trend: scheduleMetrics.delayedProjects > 0 ? "up" : "neutral",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Ahead of Schedule",
      value: scheduleMetrics.aheadProjects,
      total: scheduleMetrics.totalProjects,
      percentage: ((scheduleMetrics.aheadProjects / scheduleMetrics.totalProjects) * 100).toFixed(1),
      trend: scheduleMetrics.aheadProjects > 0 ? "up" : "neutral",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Damages Risk",
      value: scheduleMetrics.totalDamagesRisk,
      displayValue: `$${scheduleMetrics.totalDamagesRisk.toLocaleString()}`,
      percentage: scheduleMetrics.totalDamagesRisk > 0 ? "High" : "Low",
      trend: scheduleMetrics.totalDamagesRisk > 0 ? "up" : "neutral",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  // Schedule variance trend data (mock monthly data)
  const varianceTrend = Array.from({ length: 8 }, (_, i) => {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i]
    const baseVariance = scheduleMetrics.averageVariance
    const monthlyVariance = baseVariance + Math.sin(i * 0.5) * 3
    return {
      month,
      variance: monthlyVariance,
      onTime: Math.max(0, scheduleMetrics.onTimeProjects - Math.floor(Math.random() * 2)),
      delayed: Math.max(0, scheduleMetrics.delayedProjects + Math.floor(Math.random() * 2)),
    }
  })

  // Project timeline data
  const timelineData = scheduleMetrics.projectScheduleDetails.map((project, index) => ({
    name: project.name.split(" ").slice(0, 2).join(" "),
    originalDuration: project.duration,
    currentDuration: project.duration + project.varianceDays,
    variance: project.varianceDays,
    status: project.status,
    color: project.status === "ahead" ? "#10B981" : project.status === "delayed" ? "#EF4444" : "#3B82F6",
  }))

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#0021A5] dark:text-[#4A7FD6]">
              Schedule Performance
            </CardTitle>
            <p className="text-sm text-[#0021A5]/70 dark:text-[#4A7FD6]/80">
              {constructionProjects.length} Construction Projects • {scheduleMetrics.averageVariance.toFixed(1)} Days
              Avg. Variance
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Live Updates
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label htmlFor="real-time" className="text-sm text-[#0021A5]/70 dark:text-[#4A7FD6]/80">
                Real-time
              </Label>
            </div>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {keyMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-full ${metric.bgColor} dark:bg-gray-700`}>
                        <Icon className={`h-4 w-4 ${metric.color}`} />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          metric.trend === "up"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {metric.percentage}%
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {metric.displayValue || metric.value}
                      {metric.total && ` / ${metric.total}`}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Schedule Summary */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Schedule Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Data Date</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Avg. Variance</span>
                  <span
                    className={`font-medium ${scheduleMetrics.averageVariance > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {scheduleMetrics.averageVariance > 0 ? "+" : ""}
                    {scheduleMetrics.averageVariance.toFixed(1)} Days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Risk</span>
                  <span className="font-medium text-orange-600">
                    ${scheduleMetrics.totalDamagesRisk.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Performance</span>
                  <Badge
                    variant="outline"
                    className={
                      scheduleMetrics.onTimeProjects / scheduleMetrics.totalProjects > 0.7
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }
                  >
                    {scheduleMetrics.onTimeProjects / scheduleMetrics.totalProjects > 0.7 ? "Good" : "Needs Attention"}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            {/* Timeline Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Duration Analysis</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="originalDuration" fill="#3B82F6" name="Original Duration" />
                    <Bar dataKey="currentDuration" fill="#10B981" name="Current Duration" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Timeline Details</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {scheduleMetrics.projectScheduleDetails.map((project, index) => (
                  <div
                    key={project.project_id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(project.projected_finish_date)} • {project.duration} days
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          project.status === "ahead"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : project.status === "delayed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {project.varianceDays > 0 ? "+" : ""}
                        {project.varianceDays} days
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Schedule Variance Trend */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Schedule Variance Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={varianceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="variance"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      name="Avg. Variance (Days)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-indigo-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule Performance Indicators
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">On-Time Delivery Rate</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {((scheduleMetrics.onTimeProjects / scheduleMetrics.totalProjects) * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Schedule Efficiency</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Activity className="h-3 w-3 mr-1" />
                    {scheduleMetrics.averageVariance < 5
                      ? "Excellent"
                      : scheduleMetrics.averageVariance < 15
                      ? "Good"
                      : "Needs Improvement"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {scheduleMetrics.totalDamagesRisk > 100000
                      ? "High"
                      : scheduleMetrics.totalDamagesRisk > 25000
                      ? "Medium"
                      : "Low"}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-indigo-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-indigo-600 dark:text-indigo-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
