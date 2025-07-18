"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  MessageSquare,
  Brain,
  Heart,
  Zap,
} from "lucide-react"

interface PerformanceData {
  reviewCompletion: {
    totalReviews: number
    completed: number
    inProgress: number
    overdue: number
    completionRate: number
  }
  goalProgress: {
    totalGoals: number
    onTrack: number
    atRisk: number
    completed: number
    overdue: number
    completionRate: number
  }
  performanceDistribution: {
    excellent: number
    good: number
    average: number
    belowAverage: number
    poor: number
  }
  developmentNeeds: {
    category: string
    count: number
    percentage: number
    priority: "high" | "medium" | "low"
  }[]
  reviewCycles: {
    cycle: string
    totalEmployees: number
    completed: number
    pending: number
    overdue: number
    completionRate: number
  }[]
}

const PerformanceMetrics: React.FC = () => {
  // Mock performance data
  const performanceData: PerformanceData = {
    reviewCompletion: {
      totalReviews: 1247,
      completed: 1089,
      inProgress: 134,
      overdue: 24,
      completionRate: 87.3,
    },
    goalProgress: {
      totalGoals: 2847,
      onTrack: 1989,
      atRisk: 234,
      completed: 456,
      overdue: 168,
      completionRate: 85.9,
    },
    performanceDistribution: {
      excellent: 234,
      good: 567,
      average: 345,
      belowAverage: 78,
      poor: 23,
    },
    developmentNeeds: [
      { category: "Leadership Skills", count: 156, percentage: 12.5, priority: "high" },
      { category: "Technical Skills", count: 134, percentage: 10.7, priority: "high" },
      { category: "Communication", count: 98, percentage: 7.9, priority: "medium" },
      { category: "Time Management", count: 87, percentage: 7.0, priority: "medium" },
      { category: "Team Collaboration", count: 76, percentage: 6.1, priority: "low" },
      { category: "Problem Solving", count: 65, percentage: 5.2, priority: "medium" },
    ],
    reviewCycles: [
      {
        cycle: "Annual Reviews",
        totalEmployees: 1247,
        completed: 1089,
        pending: 134,
        overdue: 24,
        completionRate: 87.3,
      },
      {
        cycle: "Quarterly Check-ins",
        totalEmployees: 1247,
        completed: 1156,
        pending: 67,
        overdue: 24,
        completionRate: 92.7,
      },
      {
        cycle: "Probationary Reviews",
        totalEmployees: 89,
        completed: 78,
        pending: 8,
        overdue: 3,
        completionRate: 87.6,
      },
    ],
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <>
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Review Completion</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {performanceData.reviewCompletion.completionRate}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {performanceData.reviewCompletion.completed} of {performanceData.reviewCompletion.totalReviews}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Goal Progress</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {performanceData.goalProgress.completionRate}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {performanceData.goalProgress.completed} completed goals
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Excellent Performance</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {performanceData.performanceDistribution.excellent}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {((performanceData.performanceDistribution.excellent / 1247) * 100).toFixed(1)}% of workforce
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Overdue Reviews</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {performanceData.reviewCompletion.overdue}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Require attention</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Distribution */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Performance Distribution
          </CardTitle>
          <CardDescription>Employee performance ratings breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Excellent</span>
                <span className="text-sm text-muted-foreground">
                  ({performanceData.performanceDistribution.excellent})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(performanceData.performanceDistribution.excellent / 1247) * 100}
                  className="w-20 h-2"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {((performanceData.performanceDistribution.excellent / 1247) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Good</span>
                <span className="text-sm text-muted-foreground">({performanceData.performanceDistribution.good})</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(performanceData.performanceDistribution.good / 1247) * 100} className="w-20 h-2" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {((performanceData.performanceDistribution.good / 1247) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Average</span>
                <span className="text-sm text-muted-foreground">
                  ({performanceData.performanceDistribution.average})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(performanceData.performanceDistribution.average / 1247) * 100} className="w-20 h-2" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {((performanceData.performanceDistribution.average / 1247) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm font-medium">Below Average</span>
                <span className="text-sm text-muted-foreground">
                  ({performanceData.performanceDistribution.belowAverage})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(performanceData.performanceDistribution.belowAverage / 1247) * 100}
                  className="w-20 h-2"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {((performanceData.performanceDistribution.belowAverage / 1247) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Poor</span>
                <span className="text-sm text-muted-foreground">({performanceData.performanceDistribution.poor})</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(performanceData.performanceDistribution.poor / 1247) * 100} className="w-20 h-2" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {((performanceData.performanceDistribution.poor / 1247) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Needs & Review Cycles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5" />
              Development Needs
            </CardTitle>
            <CardDescription>Areas requiring development focus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.developmentNeeds.map((need, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">{need.category}</span>
                    <span className="text-sm text-muted-foreground">({need.count})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={need.percentage} className="w-16 h-2" />
                    <Badge className={`text-xs ${getPriorityBadge(need.priority)}`}>{need.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" />
              Review Cycles
            </CardTitle>
            <CardDescription>Performance review cycle status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.reviewCycles.map((cycle, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{cycle.cycle}</span>
                      <span className="text-sm font-medium">{cycle.completionRate}%</span>
                    </div>
                    <Progress value={cycle.completionRate} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {cycle.completed}/{cycle.totalEmployees} completed
                      </span>
                      <span className="text-xs text-muted-foreground">{cycle.overdue} overdue</span>
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

export default PerformanceMetrics
