"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  FileText,
  Download,
  Upload,
  Filter,
  Play,
  Pause,
} from "lucide-react"

interface TimesheetData {
  weeklyOverview: {
    totalHours: number
    billableHours: number
    nonBillableHours: number
    overtimeHours: number
    averagePerEmployee: number
    submissionRate: number
  }
  departmentHours: {
    department: string
    totalHours: number
    billableHours: number
    nonBillableHours: number
    overtimeHours: number
    employeeCount: number
    averagePerEmployee: number
  }[]
  projectHours: {
    project: string
    totalHours: number
    billableHours: number
    budgetHours: number
    completionRate: number
    status: "on-track" | "over-budget" | "under-budget"
  }[]
  timesheetStatus: {
    status: string
    count: number
    percentage: number
  }[]
  timeTracking: {
    category: string
    hours: number
    percentage: number
    trend: number
  }[]
}

const TimesheetAnalytics: React.FC = () => {
  // Mock timesheet data
  const timesheetData: TimesheetData = {
    weeklyOverview: {
      totalHours: 12470,
      billableHours: 10890,
      nonBillableHours: 1580,
      overtimeHours: 890,
      averagePerEmployee: 265.3,
      submissionRate: 94.2,
    },
    departmentHours: [
      {
        department: "Construction",
        totalHours: 5670,
        billableHours: 5230,
        nonBillableHours: 440,
        overtimeHours: 320,
        employeeCount: 234,
        averagePerEmployee: 24.2,
      },
      {
        department: "Engineering",
        totalHours: 3450,
        billableHours: 3120,
        nonBillableHours: 330,
        overtimeHours: 210,
        employeeCount: 156,
        averagePerEmployee: 22.1,
      },
      {
        department: "Project Management",
        totalHours: 2340,
        billableHours: 2180,
        nonBillableHours: 160,
        overtimeHours: 180,
        employeeCount: 123,
        averagePerEmployee: 19.0,
      },
      {
        department: "Safety",
        totalHours: 890,
        billableHours: 820,
        nonBillableHours: 70,
        overtimeHours: 120,
        employeeCount: 45,
        averagePerEmployee: 19.8,
      },
      {
        department: "Administration",
        totalHours: 120,
        billableHours: 540,
        nonBillableHours: 580,
        overtimeHours: 60,
        employeeCount: 23,
        averagePerEmployee: 26.1,
      },
    ],
    projectHours: [
      {
        project: "Miami Office Tower",
        totalHours: 2340,
        billableHours: 2180,
        budgetHours: 2400,
        completionRate: 90.8,
        status: "on-track",
      },
      {
        project: "Orlando Shopping Center",
        totalHours: 1890,
        billableHours: 1720,
        budgetHours: 1800,
        completionRate: 95.6,
        status: "on-track",
      },
      {
        project: "Tampa Hospital",
        totalHours: 1560,
        billableHours: 1420,
        budgetHours: 1500,
        completionRate: 94.7,
        status: "on-track",
      },
      {
        project: "Jacksonville Bridge",
        totalHours: 890,
        billableHours: 780,
        budgetHours: 800,
        completionRate: 97.5,
        status: "under-budget",
      },
      {
        project: "Fort Lauderdale Resort",
        totalHours: 2340,
        billableHours: 2100,
        budgetHours: 2000,
        completionRate: 105.0,
        status: "over-budget",
      },
    ],
    timesheetStatus: [
      { status: "Submitted", count: 1172, percentage: 94.2 },
      { status: "Pending", count: 45, percentage: 3.6 },
      { status: "Overdue", count: 30, percentage: 2.4 },
    ],
    timeTracking: [
      { category: "Billable Work", hours: 10890, percentage: 87.3, trend: 2.1 },
      { category: "Non-Billable", hours: 1580, percentage: 12.7, trend: -1.5 },
      { category: "Overtime", hours: 890, percentage: 7.1, trend: 3.2 },
      { category: "Training", hours: 320, percentage: 2.6, trend: 0.8 },
      { category: "Administrative", hours: 260, percentage: 2.1, trend: -0.5 },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-600 dark:text-green-400"
      case "over-budget":
        return "text-red-600 dark:text-red-400"
      case "under-budget":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "over-budget":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "under-budget":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600 dark:text-green-400"
    if (trend < 0) return "text-red-600 dark:text-red-400"
    return "text-gray-600 dark:text-gray-400"
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4" />
    if (trend < 0) return <TrendingDown className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Hours</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {timesheetData.weeklyOverview.totalHours.toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {timesheetData.weeklyOverview.averagePerEmployee} avg per employee
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Billable Hours</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {timesheetData.weeklyOverview.billableHours.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {(
                    (timesheetData.weeklyOverview.billableHours / timesheetData.weeklyOverview.totalHours) *
                    100
                  ).toFixed(1)}
                  % utilization
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Overtime Hours</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {timesheetData.weeklyOverview.overtimeHours.toLocaleString()}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {(
                    (timesheetData.weeklyOverview.overtimeHours / timesheetData.weeklyOverview.totalHours) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Submission Rate</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {timesheetData.weeklyOverview.submissionRate}%
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {timesheetData.timesheetStatus.find((s) => s.status === "Submitted")?.count || 0} submitted
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Hours */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Department Hours
          </CardTitle>
          <CardDescription>Weekly hours by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timesheetData.departmentHours.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{dept.department}</span>
                  <span className="text-sm text-muted-foreground">({dept.employeeCount})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.totalHours.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.billableHours.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Billable</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.overtimeHours.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">OT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.averagePerEmployee}</p>
                    <p className="text-xs text-muted-foreground">Avg/Employee</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Hours & Time Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Project Hours
            </CardTitle>
            <CardDescription>Hours tracked by project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timesheetData.projectHours.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{project.project}</span>
                      <Badge className={`text-xs ${getStatusBadge(project.status)}`}>{project.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{project.totalHours.toLocaleString()} hours</span>
                      <span>•</span>
                      <span>{project.billableHours.toLocaleString()} billable</span>
                      <span>•</span>
                      <span>{project.completionRate}% complete</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.budgetHours.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5" />
              Time Tracking
            </CardTitle>
            <CardDescription>Hours by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timesheetData.timeTracking.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">({category.hours.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={category.percentage} className="w-16 h-2" />
                    <div className={`flex items-center gap-1 ${getTrendColor(category.trend)}`}>
                      {getTrendIcon(category.trend)}
                      <span className="text-sm font-medium">
                        {category.trend > 0 ? "+" : ""}
                        {category.trend}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default TimesheetAnalytics
