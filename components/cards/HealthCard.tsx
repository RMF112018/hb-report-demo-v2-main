"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Shield,
  Clock,
  DollarSign,
  Activity,
  Brain,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Building2,
  Globe,
  Target as TargetIcon,
} from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HealthCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export function HealthCard({ card, config, span, isCompact, userRole }: HealthCardProps) {
  // Mock portfolio health data
  const portfolioHealthData = {
    totalProjects: 12,
    healthyProjects: 7,
    atRiskProjects: 4,
    criticalProjects: 1,
    avgHealthScore: 79.4,
    healthGrade: "B-",
    trendDirection: "stable",
    trendValue: 0.2,
    totalRiskExposure: 5240000,
    avgStakeholderSatisfaction: 82.9,
    companyReputation: 87.2,
    healthDimensions: {
      schedule: 81.5,
      budget: 77.2,
      quality: 85.8,
      safety: 89.7,
      risk: 72.1,
      communication: 82.9,
    },
    portfolioBreakdown: [
      {
        project: "Medical Center East",
        health: 89.3,
        schedule: 92.1,
        budget: 87.5,
        quality: 94.2,
        risk: 82.1,
        trend: "up",
        status: "healthy",
      },
      {
        project: "Tech Campus Phase 2",
        health: 85.7,
        schedule: 88.9,
        budget: 83.2,
        quality: 91.1,
        risk: 78.5,
        trend: "stable",
        status: "healthy",
      },
      {
        project: "Marina Bay Plaza",
        health: 78.2,
        schedule: 76.8,
        budget: 74.9,
        quality: 85.3,
        risk: 71.2,
        trend: "down",
        status: "at-risk",
      },
      {
        project: "Tropical World",
        health: 84.2,
        schedule: 87.5,
        budget: 82.1,
        quality: 91.2,
        risk: 76.4,
        trend: "up",
        status: "healthy",
      },
      {
        project: "Grandview Heights",
        health: 76.9,
        schedule: 73.2,
        budget: 75.8,
        quality: 82.4,
        risk: 69.8,
        trend: "down",
        status: "at-risk",
      },
      {
        project: "Riverside Plaza",
        health: 82.8,
        schedule: 85.1,
        budget: 81.2,
        quality: 87.6,
        risk: 77.3,
        trend: "stable",
        status: "healthy",
      },
    ],
    healthTrend: [
      { month: "Jan", overall: 78.9, schedule: 81.2, budget: 76.8, quality: 85.1, safety: 89.2, risk: 71.5 },
      { month: "Feb", overall: 79.1, schedule: 81.3, budget: 77.0, quality: 85.4, safety: 89.5, risk: 71.8 },
      { month: "Mar", overall: 79.3, schedule: 81.4, budget: 77.1, quality: 85.6, safety: 89.6, risk: 72.0 },
      { month: "Apr", overall: 79.2, schedule: 81.4, budget: 77.0, quality: 85.7, safety: 89.7, risk: 72.1 },
      { month: "May", overall: 79.4, schedule: 81.5, budget: 77.2, quality: 85.8, safety: 89.7, risk: 72.1 },
    ],
  }

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600 dark:text-green-400"
    if (health >= 80) return "text-blue-600 dark:text-blue-400"
    if (health >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getHealthBgColor = (health: number) => {
    if (health >= 90) return "#10b981"
    if (health >= 80) return "#3b82f6"
    if (health >= 70) return "#f59e0b"
    return "#ef4444"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 dark:text-green-400"
      case "at-risk":
        return "text-yellow-600 dark:text-yellow-400"
      case "critical":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <div className="h-4 w-4 rounded-full bg-muted-foreground" />
    }
  }

  return (
    <>
      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Portfolio Health KPI */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Portfolio Health</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {portfolioHealthData.avgHealthScore.toFixed(1)}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{portfolioHealthData.healthGrade} Grade</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Healthy Projects KPI */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Healthy Projects</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {portfolioHealthData.healthyProjects}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {((portfolioHealthData.healthyProjects / portfolioHealthData.totalProjects) * 100).toFixed(0)}% of
                  portfolio
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* At Risk Projects KPI */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">At Risk</p>
                <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                  {portfolioHealthData.atRiskProjects}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">Need attention</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-800 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Projects KPI */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {portfolioHealthData.criticalProjects}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">Immediate action required</p>
              </div>
              <div className="h-12 w-12 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Power BI Embedded Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Portfolio Health Distribution - Pie Chart */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Portfolio Health Distribution
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Current breakdown of project health statuses across the portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              {/* Interactive Pie Chart */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Health Status Distribution</h4>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Pie Chart Visualization */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                  {/* Healthy - 58.3% */}
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 14 * 0.583} ${2 * Math.PI * 14}`}
                    className="transition-all duration-300 hover:stroke-green-600"
                  />
                  {/* At Risk - 33.3% */}
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 14 * 0.333} ${2 * Math.PI * 14}`}
                    strokeDashoffset={`-${2 * Math.PI * 14 * 0.583}`}
                    className="transition-all duration-300 hover:stroke-amber-600"
                  />
                  {/* Critical - 8.4% */}
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 14 * 0.084} ${2 * Math.PI * 14}`}
                    strokeDashoffset={`-${2 * Math.PI * 14 * 0.916}`}
                    className="transition-all duration-300 hover:stroke-red-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {portfolioHealthData.totalProjects}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Healthy</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">At Risk</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Critical</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Trend Analysis - Line Chart */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Health Trend Analysis
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Monthly health score trends across all portfolio dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              {/* Line Chart Visualization */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Monthly Health Trends</h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">Last 5 months</span>
              </div>

              <div className="relative h-40 w-full">
                <svg className="w-full h-full" viewBox="0 0 300 160">
                  {/* Grid lines */}
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="80" x2="300" y2="80" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="120" x2="300" y2="120" stroke="#e5e7eb" strokeWidth="1" />

                  {/* Y-axis labels */}
                  <text x="5" y="45" className="text-xs fill-gray-500">
                    100%
                  </text>
                  <text x="5" y="85" className="text-xs fill-gray-500">
                    75%
                  </text>
                  <text x="5" y="125" className="text-xs fill-gray-500">
                    50%
                  </text>

                  {/* X-axis labels */}
                  <text x="30" y="155" className="text-xs fill-gray-500">
                    Jan
                  </text>
                  <text x="90" y="155" className="text-xs fill-gray-500">
                    Feb
                  </text>
                  <text x="150" y="155" className="text-xs fill-gray-500">
                    Mar
                  </text>
                  <text x="210" y="155" className="text-xs fill-gray-500">
                    Apr
                  </text>
                  <text x="270" y="155" className="text-xs fill-gray-500">
                    May
                  </text>

                  {/* Overall trend line */}
                  <polyline points="30,48 90,46 150,44 210,46 270,44" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  {/* Schedule trend line */}
                  <polyline points="30,42 90,41 150,40 210,40 270,39" fill="none" stroke="#10b981" strokeWidth="2" />
                  {/* Budget trend line */}
                  <polyline points="30,52 90,50 150,49 210,50 270,48" fill="none" stroke="#f59e0b" strokeWidth="2" />

                  {/* Data points */}
                  <circle cx="30" cy="48" r="3" fill="#3b82f6" />
                  <circle cx="90" cy="46" r="3" fill="#3b82f6" />
                  <circle cx="150" cy="44" r="3" fill="#3b82f6" />
                  <circle cx="210" cy="46" r="3" fill="#3b82f6" />
                  <circle cx="270" cy="44" r="3" fill="#3b82f6" />

                  <circle cx="30" cy="42" r="3" fill="#10b981" />
                  <circle cx="90" cy="41" r="3" fill="#10b981" />
                  <circle cx="150" cy="40" r="3" fill="#10b981" />
                  <circle cx="210" cy="40" r="3" fill="#10b981" />
                  <circle cx="270" cy="39" r="3" fill="#10b981" />

                  <circle cx="30" cy="52" r="3" fill="#f59e0b" />
                  <circle cx="90" cy="50" r="3" fill="#f59e0b" />
                  <circle cx="150" cy="49" r="3" fill="#f59e0b" />
                  <circle cx="210" cy="50" r="3" fill="#f59e0b" />
                  <circle cx="270" cy="48" r="3" fill="#f59e0b" />
                </svg>

                {/* Legend */}
                <div className="flex justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Overall</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Schedule</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Budget</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Dimensions - Bar Chart */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Health Dimensions
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Performance across key health dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(portfolioHealthData.healthDimensions).map(([dimension, score]) => (
                <div key={dimension} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize text-gray-700 dark:text-gray-300">{dimension}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Health Heatmap */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Project Health Heatmap
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Health status by project across the portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">Real-time</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {portfolioHealthData.portfolioBreakdown.slice(0, 4).map((project, index) => (
                  <div
                    key={project.project}
                    className={`p-3 rounded-lg border ${
                      project.status === "healthy"
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
                        : project.status === "at-risk"
                        ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {project.project}
                      </span>
                      {getTrendIcon(project.trend)}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {project.health.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Exposure Summary */}
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Risk Exposure Summary
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Portfolio risk metrics and stakeholder satisfaction
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Total Risk Exposure */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                    ${(portfolioHealthData.totalRiskExposure / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Total Risk Exposure</div>
                </div>
              </div>

              {/* Satisfaction & Reputation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {portfolioHealthData.avgStakeholderSatisfaction.toFixed(0)}%
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Satisfaction</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-900 dark:text-green-100">
                    {portfolioHealthData.companyReputation.toFixed(0)}%
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">Reputation</div>
                </div>
              </div>

              {/* Monthly Change */}
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {portfolioHealthData.trendValue > 0 ? "+" : ""}
                  {portfolioHealthData.trendValue}% Monthly Change
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
