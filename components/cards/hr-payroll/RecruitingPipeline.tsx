"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  UserPlus,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  MapPin,
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  MessageSquare,
  Star,
  Filter,
} from "lucide-react"

interface RecruitingData {
  pipelineStages: {
    stage: string
    count: number
    percentage: number
    avgTime: number
    conversionRate: number
  }[]
  timeToHire: {
    average: number
    byDepartment: {
      department: string
      avgDays: number
      count: number
    }[]
    trend: number
  }
  sourceEffectiveness: {
    source: string
    applications: number
    interviews: number
    hires: number
    conversionRate: number
    costPerHire: number
  }[]
  diversityMetrics: {
    totalCandidates: number
    diverseCandidates: number
    diverseHires: number
    diversityRate: number
    byDepartment: {
      department: string
      total: number
      diverse: number
      rate: number
    }[]
  }
  activePositions: {
    title: string
    department: string
    location: string
    applications: number
    daysOpen: number
    priority: "high" | "medium" | "low"
  }[]
}

const RecruitingPipeline: React.FC = () => {
  // Mock recruiting data
  const recruitingData: RecruitingData = {
    pipelineStages: [
      { stage: "Applied", count: 156, percentage: 100, avgTime: 0, conversionRate: 100 },
      { stage: "Screening", count: 134, percentage: 85.9, avgTime: 2, conversionRate: 85.9 },
      { stage: "Interview", count: 89, percentage: 57.1, avgTime: 5, conversionRate: 66.4 },
      { stage: "Assessment", count: 67, percentage: 42.9, avgTime: 8, conversionRate: 75.3 },
      { stage: "Offer", count: 34, percentage: 21.8, avgTime: 12, conversionRate: 50.7 },
      { stage: "Hired", count: 23, percentage: 14.7, avgTime: 18, conversionRate: 67.6 },
    ],
    timeToHire: {
      average: 18,
      byDepartment: [
        { department: "Construction", avgDays: 15, count: 8 },
        { department: "Engineering", avgDays: 22, count: 5 },
        { department: "Project Management", avgDays: 20, count: 4 },
        { department: "Safety", avgDays: 16, count: 3 },
        { department: "Administration", avgDays: 12, count: 3 },
      ],
      trend: -2.5,
    },
    sourceEffectiveness: [
      { source: "LinkedIn", applications: 67, interviews: 23, hires: 8, conversionRate: 34.8, costPerHire: 2500 },
      { source: "Indeed", applications: 45, interviews: 18, hires: 6, conversionRate: 33.3, costPerHire: 1800 },
      { source: "Referrals", applications: 23, interviews: 15, hires: 5, conversionRate: 33.3, costPerHire: 500 },
      { source: "Company Website", applications: 12, interviews: 8, hires: 3, conversionRate: 37.5, costPerHire: 1200 },
      { source: "Job Boards", applications: 9, interviews: 4, hires: 1, conversionRate: 25.0, costPerHire: 3000 },
    ],
    diversityMetrics: {
      totalCandidates: 156,
      diverseCandidates: 67,
      diverseHires: 12,
      diversityRate: 52.2,
      byDepartment: [
        { department: "Construction", total: 45, diverse: 18, rate: 40.0 },
        { department: "Engineering", total: 34, diverse: 15, rate: 44.1 },
        { department: "Project Management", total: 28, diverse: 12, rate: 42.9 },
        { department: "Safety", total: 23, diverse: 11, rate: 47.8 },
        { department: "Administration", total: 26, diverse: 11, rate: 42.3 },
      ],
    },
    activePositions: [
      {
        title: "Site Superintendent",
        department: "Construction",
        location: "Miami",
        applications: 23,
        daysOpen: 12,
        priority: "high",
      },
      {
        title: "Project Engineer",
        department: "Engineering",
        location: "Orlando",
        applications: 18,
        daysOpen: 8,
        priority: "high",
      },
      {
        title: "Safety Coordinator",
        department: "Safety",
        location: "Tampa",
        applications: 15,
        daysOpen: 15,
        priority: "medium",
      },
      {
        title: "Estimator",
        department: "Preconstruction",
        location: "Miami",
        applications: 12,
        daysOpen: 20,
        priority: "medium",
      },
      {
        title: "Office Manager",
        department: "Administration",
        location: "Orlando",
        applications: 8,
        daysOpen: 25,
        priority: "low",
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
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Candidates</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {recruitingData.pipelineStages[0].count}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Active pipeline</p>
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
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Time to Hire</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {recruitingData.timeToHire.average} days
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {recruitingData.timeToHire.trend > 0 ? "+" : ""}
                  {recruitingData.timeToHire.trend} from last month
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Diversity Rate</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {recruitingData.diversityMetrics.diversityRate}%
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {recruitingData.diversityMetrics.diverseCandidates} diverse candidates
                </p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Positions</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {recruitingData.activePositions.length}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Open positions</p>
              </div>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <UserPlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" />
            Pipeline Stages
          </CardTitle>
          <CardDescription>Candidate progression through hiring stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recruitingData.pipelineStages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <span className="text-sm text-muted-foreground">({stage.count})</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{stage.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stage.avgTime} days</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{stage.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Effectiveness & Active Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Source Effectiveness
            </CardTitle>
            <CardDescription>Hiring source performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recruitingData.sourceEffectiveness.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{source.source}</span>
                      <span className="text-sm font-medium">{source.conversionRate}%</span>
                    </div>
                    <Progress value={source.conversionRate} className="h-2" />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {source.hires} hires from {source.applications} apps
                      </span>
                      <span className="text-xs text-muted-foreground">${source.costPerHire.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="h-5 w-5" />
              Active Positions
            </CardTitle>
            <CardDescription>Current open positions and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recruitingData.activePositions.map((position, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{position.title}</span>
                      <Badge className={`text-xs ${getPriorityBadge(position.priority)}`}>{position.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.applications} applications</span>
                      <span>•</span>
                      <span>{position.daysOpen} days open</span>
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

export default RecruitingPipeline
