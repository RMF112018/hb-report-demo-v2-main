"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  TrendingDown,
  Building2,
  MapPin,
  Calendar,
  Target,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Users2,
  GraduationCap,
  Briefcase,
} from "lucide-react"

interface WorkforceData {
  totalEmployees: number
  activeEmployees: number
  newHires: number
  terminations: number
  turnoverRate: number
  averageTenure: number
  departments: {
    name: string
    count: number
    percentage: number
    growth: number
  }[]
  locations: {
    name: string
    count: number
    percentage: number
  }[]
  hiringTrends: {
    month: string
    hires: number
    terminations: number
  }[]
  employeeStatus: {
    active: number
    onLeave: number
    terminated: number
    probationary: number
  }
}

const HRWorkforceOverview: React.FC = () => {
  // Mock workforce data
  const workforceData: WorkforceData = {
    totalEmployees: 1247,
    activeEmployees: 1189,
    newHires: 23,
    terminations: 8,
    turnoverRate: 12.3,
    averageTenure: 4.2,
    departments: [
      { name: "Construction", count: 456, percentage: 36.6, growth: 8.2 },
      { name: "Engineering", count: 234, percentage: 18.8, growth: 12.5 },
      { name: "Project Management", count: 189, percentage: 15.2, growth: 5.8 },
      { name: "Safety", count: 156, percentage: 12.5, growth: 15.3 },
      { name: "Administration", count: 123, percentage: 9.9, growth: 2.1 },
      { name: "Estimating", count: 89, percentage: 7.1, growth: -3.2 },
    ],
    locations: [
      { name: "Main Office", count: 567, percentage: 45.5 },
      { name: "Field Office A", count: 234, percentage: 18.8 },
      { name: "Field Office B", count: 189, percentage: 15.2 },
      { name: "Remote", count: 257, percentage: 20.6 },
    ],
    hiringTrends: [
      { month: "Jan", hires: 15, terminations: 6 },
      { month: "Feb", hires: 12, terminations: 4 },
      { month: "Mar", hires: 18, terminations: 8 },
      { month: "Apr", hires: 14, terminations: 5 },
      { month: "May", hires: 20, terminations: 7 },
      { month: "Jun", hires: 16, terminations: 6 },
    ],
    employeeStatus: {
      active: 1189,
      onLeave: 34,
      terminated: 15,
      probationary: 9,
    },
  }

  const getGrowthColor = (growth: number) => {
    if (growth > 5) return "text-green-600 dark:text-green-400"
    if (growth > 0) return "text-blue-600 dark:text-blue-400"
    return "text-red-600 dark:text-red-400"
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3" />
    return <TrendingDown className="h-3 w-3" />
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{workforceData.totalEmployees}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">+{workforceData.newHires} this month</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Active Employees</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{workforceData.activeEmployees}</p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {((workforceData.activeEmployees / workforceData.totalEmployees) * 100).toFixed(1)}% of total
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Turnover Rate</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{workforceData.turnoverRate}%</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Industry avg: 15.2%</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <UserMinus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Tenure</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {workforceData.averageTenure} years
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">+0.3 from last year</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            Department Distribution
          </CardTitle>
          <CardDescription>Employee count and growth by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workforceData.departments.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{dept.name}</span>
                  <span className="text-sm text-muted-foreground">({dept.count})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={dept.percentage} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground w-12 text-right">{dept.percentage}%</span>
                  <div className={`flex items-center gap-1 ${getGrowthColor(dept.growth)}`}>
                    {getGrowthIcon(dept.growth)}
                    <span className="text-xs">
                      {dept.growth > 0 ? "+" : ""}
                      {dept.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Employee Status & Hiring Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users2 className="h-5 w-5" />
              Employee Status
            </CardTitle>
            <CardDescription>Current employee status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{workforceData.employeeStatus.active}</span>
                  <Badge variant="secondary" className="text-xs">
                    {((workforceData.employeeStatus.active / workforceData.totalEmployees) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">On Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{workforceData.employeeStatus.onLeave}</span>
                  <Badge variant="outline" className="text-xs">
                    {((workforceData.employeeStatus.onLeave / workforceData.totalEmployees) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Probationary</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{workforceData.employeeStatus.probationary}</span>
                  <Badge variant="outline" className="text-xs">
                    {((workforceData.employeeStatus.probationary / workforceData.totalEmployees) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Terminated</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{workforceData.employeeStatus.terminated}</span>
                  <Badge variant="outline" className="text-xs">
                    {((workforceData.employeeStatus.terminated / workforceData.totalEmployees) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Hiring Trends
            </CardTitle>
            <CardDescription>Monthly hiring vs termination trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workforceData.hiringTrends.slice(-6).map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trend.month}</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <UserPlus className="h-3 w-3 text-green-600" />
                      <span className="text-sm">{trend.hires}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserMinus className="h-3 w-3 text-red-600" />
                      <span className="text-sm">{trend.terminations}</span>
                    </div>
                    <Badge variant={trend.hires > trend.terminations ? "default" : "secondary"} className="text-xs">
                      {trend.hires - trend.terminations > 0 ? "+" : ""}
                      {trend.hires - trend.terminations}
                    </Badge>
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

export default HRWorkforceOverview
