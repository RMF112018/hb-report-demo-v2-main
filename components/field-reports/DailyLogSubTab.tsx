"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  FileText,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  CloudSun,
  Activity,
} from "lucide-react"
import { format, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns"
import { DailyLogTable } from "./DailyLogTable"
import { useToast } from "@/hooks/use-toast"
import type { DailyLog, ManpowerRecord } from "@/types/field-reports"

interface DailyLogSubTabProps {
  data: {
    dailyLogs: DailyLog[]
    manpower: ManpowerRecord[]
  }
  stats: {
    totalLogs: number
    logComplianceRate: number
    expectedLogs: number
    completedLogs: number
    totalWorkers: number
    averageEfficiency: number
    businessDaysInMonth: number
    businessDaysToDate: number
  }
  userRole?: string
  onRefresh?: () => void
}

export function DailyLogSubTab({ data, stats, userRole = "user", onRefresh }: DailyLogSubTabProps) {
  const { toast } = useToast()
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  // Calculate additional metrics
  const additionalMetrics = useMemo(() => {
    const logs = data.dailyLogs
    const today = new Date()

    // Recent activity (last 7 days)
    const recentLogs = logs.filter((log) => {
      const logDate = new Date(log.date)
      const daysDiff = differenceInDays(today, logDate)
      return daysDiff <= 7
    })

    // Overdue logs
    const overdueLogs = logs.filter((log) => log.status === "overdue")

    // Pending logs
    const pendingLogs = logs.filter((log) => log.status === "pending")

    // Average workers per day
    const avgWorkersPerDay = logs.length > 0 ? logs.reduce((sum, log) => sum + log.totalWorkers, 0) / logs.length : 0

    // Average hours per day
    const avgHoursPerDay = logs.length > 0 ? logs.reduce((sum, log) => sum + log.totalHours, 0) / logs.length : 0

    // Weather impact analysis
    const weatherImpactDays = logs.filter(
      (log) =>
        log.weatherConditions?.conditions?.toLowerCase().includes("rain") ||
        log.weatherConditions?.conditions?.toLowerCase().includes("snow") ||
        log.weatherConditions?.conditions?.toLowerCase().includes("storm")
    ).length

    return {
      recentActivity: recentLogs.length,
      overdueLogs: overdueLogs.length,
      pendingLogs: pendingLogs.length,
      avgWorkersPerDay: Math.round(avgWorkersPerDay),
      avgHoursPerDay: Math.round(avgHoursPerDay),
      weatherImpactDays,
    }
  }, [data.dailyLogs])

  // Filter logs based on selected filters
  const filteredLogs = useMemo(() => {
    let filtered = data.dailyLogs

    if (selectedProject !== "all") {
      filtered = filtered.filter((log) => log.projectId === selectedProject)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((log) => log.status === selectedStatus)
    }

    // Apply date range filter
    filtered = filtered.filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= dateRange.from && logDate <= dateRange.to
    })

    return filtered
  }, [data.dailyLogs, selectedProject, selectedStatus, dateRange])

  // Get unique projects for filter
  const uniqueProjects = useMemo(() => {
    const projects = new Set(data.dailyLogs.map((log) => log.projectId))
    return Array.from(projects).map((projectId) => {
      const log = data.dailyLogs.find((l) => l.projectId === projectId)
      return {
        id: projectId,
        name: log?.projectName || `Project ${projectId}`,
      }
    })
  }, [data.dailyLogs])

  // Handle log actions
  const handleViewLog = (log: DailyLog) => {
    toast({
      title: "View Daily Log",
      description: `Opening daily log for ${format(new Date(log.date), "MMM dd, yyyy")}`,
    })
  }

  const handleEditLog = (log: DailyLog) => {
    toast({
      title: "Edit Daily Log",
      description: `Editing daily log for ${format(new Date(log.date), "MMM dd, yyyy")}`,
    })
  }

  const handleExportLog = (log: DailyLog) => {
    toast({
      title: "Export Daily Log",
      description: `Exporting daily log for ${format(new Date(log.date), "MMM dd, yyyy")}`,
    })
  }

  const handleExportAll = () => {
    toast({
      title: "Export All Logs",
      description: "Exporting all daily logs...",
    })
  }

  // Get compliance status
  const getComplianceStatus = (rate: number) => {
    if (rate >= 95) return { color: "text-green-600", bg: "bg-green-50", status: "Excellent" }
    if (rate >= 85) return { color: "text-blue-600", bg: "bg-blue-50", status: "Good" }
    if (rate >= 75) return { color: "text-yellow-600", bg: "bg-yellow-50", status: "Fair" }
    return { color: "text-red-600", bg: "bg-red-50", status: "Poor" }
  }

  const complianceStatus = getComplianceStatus(stats.logComplianceRate)

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Log Compliance Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Log Compliance</p>
                <p className="text-2xl font-bold">{stats.logComplianceRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completedLogs} of {stats.expectedLogs} logs submitted
                </p>
              </div>
              <div className={`p-3 ${complianceStatus.bg} rounded-lg`}>
                <CheckCircle className={`h-6 w-6 ${complianceStatus.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Logs */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                <p className="text-2xl font-bold">{stats.totalLogs}</p>
                <p className="text-xs text-muted-foreground mt-1">{additionalMetrics.recentActivity} in last 7 days</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Workers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Workers</p>
                <p className="text-2xl font-bold">{additionalMetrics.avgWorkersPerDay}</p>
                <p className="text-xs text-muted-foreground mt-1">{additionalMetrics.avgHoursPerDay} hrs/day average</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Impact */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weather Impact</p>
                <p className="text-2xl font-bold">{additionalMetrics.weatherImpactDays}</p>
                <p className="text-xs text-muted-foreground mt-1">impacted days this month</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <CloudSun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Log Records</CardTitle>
          <CardDescription>
            View and manage daily log submissions with completion tracking and compliance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAll}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          {/* Daily Log Table */}
          <DailyLogTable
            logs={filteredLogs}
            onView={handleViewLog}
            onEdit={handleEditLog}
            onExport={handleExportLog}
            userRole={userRole}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completion Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Business Days Elapsed</span>
                <span className="font-medium">{stats.businessDaysToDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Business Days</span>
                <span className="font-medium">{stats.businessDaysInMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Logs</span>
                <span className="font-medium">{stats.expectedLogs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed Logs</span>
                <span className="font-medium">{stats.completedLogs}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manpower Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Workers</span>
                <span className="font-medium">{stats.totalWorkers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average per Day</span>
                <span className="font-medium">{additionalMetrics.avgWorkersPerDay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Hours</span>
                <span className="font-medium">{additionalMetrics.avgHoursPerDay}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-medium">{stats.averageEfficiency.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium text-green-600">{stats.completedLogs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-yellow-600">{additionalMetrics.pendingLogs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overdue</span>
                <span className="font-medium text-red-600">{additionalMetrics.overdueLogs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weather Impacted</span>
                <span className="font-medium text-blue-600">{additionalMetrics.weatherImpactDays}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
