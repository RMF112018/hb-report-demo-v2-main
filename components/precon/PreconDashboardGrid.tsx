"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Clock,
  Users,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Zap,
  Lightbulb,
  Brain,
  Sparkles,
  Rocket,
  Shield,
  Gavel,
  Database,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"
import { BetaBDPipelineSummaryCard } from "@/components/cards/beta/BetaBDPipelineSummaryCard"
import { BetaEstimatePerformanceCard } from "@/components/cards/beta/BetaEstimatePerformanceCard"

interface PreconDashboardGridProps {
  className?: string
  isCompact?: boolean
}

export function PreconDashboardGrid({ className, isCompact = false }: PreconDashboardGridProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for the dashboard cards
  const pipelineData = [
    { month: "Jan", value: 12.5, projects: 8, winRate: 75 },
    { month: "Feb", value: 15.2, projects: 12, winRate: 78 },
    { month: "Mar", value: 18.8, projects: 15, winRate: 82 },
    { month: "Apr", value: 22.1, projects: 18, winRate: 85 },
    { month: "May", value: 25.6, projects: 22, winRate: 88 },
    { month: "Jun", value: 28.3, projects: 25, winRate: 90 },
  ]

  const estimatePerformanceData = [
    { month: "Jan", accuracy: 92, speed: 85, cost: 78 },
    { month: "Feb", accuracy: 94, speed: 88, cost: 82 },
    { month: "Mar", accuracy: 96, speed: 91, cost: 85 },
    { month: "Apr", accuracy: 95, speed: 93, cost: 88 },
    { month: "May", accuracy: 97, speed: 95, cost: 90 },
    { month: "Jun", accuracy: 98, speed: 96, cost: 92 },
  ]

  const volumeTrendData = [
    { month: "Jan", estimates: 15, value: 8.2 },
    { month: "Feb", estimates: 18, value: 12.5 },
    { month: "Mar", estimates: 22, value: 16.8 },
    { month: "Apr", estimates: 25, value: 20.1 },
    { month: "May", estimates: 28, value: 24.6 },
    { month: "Jun", estimates: 32, value: 28.3 },
  ]

  const agreementsData = [
    { type: "NDAs", count: 45, value: 12.5 },
    { type: "Teaming", count: 28, value: 18.2 },
    { type: "JVs", count: 15, value: 25.8 },
    { type: "Subcontracts", count: 62, value: 8.9 },
  ]

  const milestonesData = [
    { milestone: "Design Development", completed: 85, total: 12 },
    { milestone: "Construction Documents", completed: 72, total: 18 },
    { milestone: "Permitting", completed: 68, total: 15 },
    { milestone: "Bidding", completed: 45, total: 22 },
  ]

  const innovationData = [
    { category: "AI/ML", projects: 8, impact: 95 },
    { category: "BIM/VDC", projects: 12, impact: 88 },
    { category: "Sustainability", projects: 6, impact: 92 },
    { category: "Digital Twin", projects: 4, impact: 85 },
  ]

  const turnoverData = [
    { phase: "Design", days: 45, status: "On Track" },
    { phase: "Permitting", days: 30, status: "Delayed" },
    { phase: "Procurement", days: 60, status: "On Track" },
    { phase: "Construction", days: 90, status: "Planning" },
  ]

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Pre-Construction Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pre-Construction Summary Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive overview of all pre-construction activities and metrics
          </p>
        </div>
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
        >
          <Database className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Masonry Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* BetaBDPipelineSummaryCard */}
        <BetaBDPipelineSummaryCard />

        {/* BetaEstimatePerformanceCard */}
        <BetaEstimatePerformanceCard />

        {/* BetaEstimateVolumeTrendCard */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                Volume Trends
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {volumeTrendData[volumeTrendData.length - 1]?.estimates || 0}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300">Estimates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {formatCurrency(volumeTrendData[volumeTrendData.length - 1]?.value || 0)}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300">Value</div>
              </div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="estimates" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* BetaPreconAgreementsCard */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-orange-900 dark:text-orange-100">Agreements</CardTitle>
              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agreementsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {agreementsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#f97316", "#ea580c", "#dc2626", "#b91c1c"][index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {agreementsData.map((agreement, index) => (
                <div key={agreement.type} className="flex items-center justify-between text-sm">
                  <span className="text-orange-800 dark:text-orange-200">{agreement.type}</span>
                  <Badge variant="outline" className="text-xs">
                    {agreement.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BetaPreconMilestonesCard */}
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Milestones</CardTitle>
              <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {milestonesData.map((milestone, index) => (
                <div key={milestone.milestone} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-800 dark:text-indigo-200">{milestone.milestone}</span>
                    <span className="text-indigo-700 dark:text-indigo-300">
                      {milestone.completed}/{milestone.total}
                    </span>
                  </div>
                  <Progress value={(milestone.completed / milestone.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BetaInnovationActivityCard */}
        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                Innovation Activity
              </CardTitle>
              <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {innovationData.map((innovation, index) => (
                <div
                  key={innovation.category}
                  className="flex items-center justify-between p-2 bg-white dark:bg-pink-900/20 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-pink-800 dark:text-pink-200">{innovation.category}</div>
                    <div className="text-xs text-pink-600 dark:text-pink-400">{innovation.projects} projects</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {innovation.impact}% impact
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* BetaTurnoverScheduleCard */}
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">
                Turnover Schedule
              </CardTitle>
              <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {turnoverData.map((phase, index) => (
                <div
                  key={phase.phase}
                  className="flex items-center justify-between p-2 bg-white dark:bg-cyan-900/20 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-cyan-800 dark:text-cyan-200">{phase.phase}</div>
                    <div className="text-xs text-cyan-600 dark:text-cyan-400">{phase.days} days</div>
                  </div>
                  <Badge
                    variant={phase.status === "On Track" ? "default" : "secondary"}
                    className={`text-xs ${
                      phase.status === "On Track"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {phase.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
