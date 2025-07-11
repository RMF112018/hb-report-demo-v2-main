/**
 * @fileoverview Construction Dashboard Component
 * @module ConstructionDashboard
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-29
 *
 * Comprehensive Construction dashboard with visualizations from Financial Management and Field Management tabs.
 * Displays critical data points including financial metrics, field operations, schedule performance, and safety metrics.
 */

"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Activity,
  FileText,
  Target,
  Calendar,
  Package,
  Settings,
  Building2,
  Wrench,
  ClipboardList,
  TrendingDown,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"

interface ConstructionDashboardProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
}

// HB Brand Colors
const BRAND_COLORS = {
  primary: "#0021A5", // HB Blue
  secondary: "#FA4616", // HB Orange
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  gray: "#6B7280",
}

const CHART_COLORS = [
  BRAND_COLORS.primary,
  BRAND_COLORS.secondary,
  BRAND_COLORS.success,
  BRAND_COLORS.warning,
  BRAND_COLORS.info,
  BRAND_COLORS.error,
  BRAND_COLORS.gray,
]

export const ConstructionDashboard: React.FC<ConstructionDashboardProps> = ({
  projectId,
  projectData,
  userRole,
  user,
}) => {
  // Generate comprehensive construction dashboard data
  const constructionData = useMemo(() => {
    const contractValue = projectData?.contract_value || 57235491
    const currentDate = new Date()
    const startDate = new Date(projectData?.start_date || "2024-01-15")
    const endDate = new Date(projectData?.end_date || "2024-12-15")
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const scheduleProgress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100)

    return {
      // Financial Metrics
      financial: {
        contractValue: contractValue,
        actualCosts: contractValue * 0.68,
        budgetProgress: 68,
        cashFlow: contractValue * 0.14,
        changeOrders: 8,
        changeOrderValue: contractValue * 0.03,
        payApplications: 12,
        pendingPayments: contractValue * 0.08,
        profitMargin: 6.8,
        costVariance: -2.1,
        forecastAtCompletion: contractValue * 1.02,
      },
      // Schedule Metrics
      schedule: {
        overallProgress: scheduleProgress,
        criticalPath: 85,
        activitiesBehindSchedule: 12,
        activitiesOnTrack: 45,
        activitiesAhead: 8,
        milestonesComplete: 8,
        milestonesTotal: 12,
        daysRemaining: Math.max(totalDays - elapsedDays, 0),
        percentComplete: Math.min(Math.max(scheduleProgress, 0), 100),
      },
      // Field Operations
      field: {
        dailyLogs: 185,
        safetyIncidents: 2,
        safetyAudits: 24,
        qualityInspections: 156,
        qualityDefects: 18,
        rfiCount: 45,
        rfiOpen: 12,
        submittals: 89,
        submittalsApproved: 76,
        manpowerToday: 142,
        manpowerPeak: 178,
        averageManpower: 125,
      },
      // Procurement
      procurement: {
        totalCommitments: 245,
        commitmentValue: contractValue * 0.75,
        pendingApprovals: 18,
        completedBuyouts: 85,
        materialDeliveries: 156,
        backlogItems: 23,
        vendorPerformance: 92,
      },
      // Risk & Issues
      risk: {
        activeConstraints: 15,
        resolvedConstraints: 45,
        highRiskItems: 5,
        mediumRiskItems: 12,
        lowRiskItems: 8,
        permitsPending: 3,
        permitsApproved: 24,
        weatherDelays: 8,
      },
    }
  }, [projectData])

  // Generate chart data
  const chartData = useMemo(() => {
    return {
      // Financial trend over time
      financialTrend: [
        { month: "Jan", budgeted: 2800, actual: 2900, forecast: 2850 },
        { month: "Feb", budgeted: 5200, actual: 5400, forecast: 5300 },
        { month: "Mar", budgeted: 7800, actual: 7600, forecast: 7700 },
        { month: "Apr", budgeted: 10400, actual: 10800, forecast: 10600 },
        { month: "May", budgeted: 13200, actual: 13500, forecast: 13350 },
        { month: "Jun", budgeted: 16000, actual: 16200, forecast: 16100 },
        { month: "Jul", budgeted: 18800, actual: 19100, forecast: 18950 },
        { month: "Aug", budgeted: 21600, actual: 21800, forecast: 21700 },
        { month: "Sep", budgeted: 24400, actual: 24200, forecast: 24300 },
        { month: "Oct", budgeted: 27200, actual: 27000, forecast: 27100 },
        { month: "Nov", budgeted: 30000, actual: 29800, forecast: 29900 },
        { month: "Dec", budgeted: 32800, actual: 32600, forecast: 32700 },
      ],
      // Schedule performance
      schedulePerformance: [
        { week: "W1", planned: 5, actual: 6 },
        { week: "W2", planned: 8, actual: 7 },
        { week: "W3", planned: 12, actual: 11 },
        { week: "W4", planned: 15, actual: 16 },
        { week: "W5", planned: 18, actual: 17 },
        { week: "W6", planned: 22, actual: 21 },
        { week: "W7", planned: 25, actual: 24 },
        { week: "W8", planned: 28, actual: 27 },
      ],
      // Cost breakdown
      costBreakdown: [
        { category: "Labor", value: 12500000, percentage: 35 },
        { category: "Materials", value: 14500000, percentage: 40 },
        { category: "Equipment", value: 5000000, percentage: 14 },
        { category: "Subcontractors", value: 3500000, percentage: 10 },
        { category: "Other", value: 500000, percentage: 1 },
      ],
      // Safety metrics
      safetyMetrics: [
        { month: "Jan", incidents: 0, nearMisses: 2, audits: 3 },
        { month: "Feb", incidents: 1, nearMisses: 1, audits: 2 },
        { month: "Mar", incidents: 0, nearMisses: 3, audits: 4 },
        { month: "Apr", incidents: 0, nearMisses: 2, audits: 3 },
        { month: "May", incidents: 1, nearMisses: 1, audits: 2 },
        { month: "Jun", incidents: 0, nearMisses: 2, audits: 3 },
        { month: "Jul", incidents: 0, nearMisses: 1, audits: 2 },
        { month: "Aug", incidents: 0, nearMisses: 2, audits: 3 },
      ],
      // Quality metrics
      qualityMetrics: [
        { category: "Structural", inspections: 45, defects: 3, rate: 93.3 },
        { category: "MEP", inspections: 38, defects: 5, rate: 86.8 },
        { category: "Finishes", inspections: 32, defects: 4, rate: 87.5 },
        { category: "Sitework", inspections: 25, defects: 2, rate: 92.0 },
        { category: "Specialty", inspections: 16, defects: 4, rate: 75.0 },
      ],
      // Manpower trends
      manpowerTrend: [
        { week: "W1", planned: 85, actual: 82 },
        { week: "W2", planned: 95, actual: 98 },
        { week: "W3", planned: 110, actual: 105 },
        { week: "W4", planned: 125, actual: 128 },
        { week: "W5", planned: 140, actual: 135 },
        { week: "W6", planned: 155, actual: 152 },
        { week: "W7", planned: 160, actual: 158 },
        { week: "W8", planned: 150, actual: 142 },
      ],
    }
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400"
      case "good":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
      case "warning":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400"
      case "danger":
        return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-600" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Construction Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive overview of project performance, financials, and field operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Building2 className="h-3 w-3 mr-1" />
            Construction
          </Badge>
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            {Math.round(constructionData.schedule.percentComplete)}% Complete
          </Badge>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Financial Health */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(constructionData.financial.contractValue)}
            </div>
            <p className="text-sm text-muted-foreground">Contract Value</p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(constructionData.financial.costVariance < 0 ? "down" : "up")}
              <span className="text-sm font-medium text-foreground">
                {Math.abs(constructionData.financial.costVariance)}% variance
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Performance */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Schedule Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(constructionData.schedule.percentComplete)}%
            </div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon("up")}
              <span className="text-sm font-medium text-foreground">
                {constructionData.schedule.activitiesOnTrack} activities on track
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Safety Performance */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Safety Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">{constructionData.field.safetyIncidents}</div>
            <p className="text-sm text-muted-foreground">Safety Incidents</p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon("neutral")}
              <span className="text-sm font-medium text-foreground">
                {constructionData.field.safetyAudits} audits completed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quality Performance */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              Quality Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(
                ((constructionData.field.qualityInspections - constructionData.field.qualityDefects) /
                  constructionData.field.qualityInspections) *
                  100
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">Quality Rate</p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon("up")}
              <span className="text-sm font-medium text-foreground">
                {constructionData.field.qualityInspections} inspections
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="field">Field Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Financial Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Financial Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.financialTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value) * 1000)} />
                      <Area
                        type="monotone"
                        dataKey="budgeted"
                        stackId="1"
                        stroke={BRAND_COLORS.primary}
                        fill={BRAND_COLORS.primary}
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stackId="2"
                        stroke={BRAND_COLORS.secondary}
                        fill={BRAND_COLORS.secondary}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Schedule Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-bold">{Math.round(constructionData.schedule.percentComplete)}%</span>
                  </div>
                  <Progress value={constructionData.schedule.percentComplete} className="h-3" />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {constructionData.schedule.activitiesOnTrack}
                      </div>
                      <div className="text-xs text-muted-foreground">On Track</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {constructionData.schedule.activitiesBehindSchedule}
                      </div>
                      <div className="text-xs text-muted-foreground">Behind</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{constructionData.schedule.activitiesAhead}</div>
                      <div className="text-xs text-muted-foreground">Ahead</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Cash Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.financialTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value) * 1000)} />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke={BRAND_COLORS.primary}
                        strokeWidth={3}
                        dot={{ fill: BRAND_COLORS.primary }}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke={BRAND_COLORS.secondary}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: BRAND_COLORS.secondary }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Budget Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Budget Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm font-bold">{constructionData.financial.budgetProgress}%</span>
                  </div>
                  <Progress value={constructionData.financial.budgetProgress} className="h-3" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Actual Costs</div>
                      <div className="text-lg font-bold text-foreground">
                        {formatCurrency(constructionData.financial.actualCosts)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Forecast at Completion</div>
                      <div className="text-lg font-bold text-foreground">
                        {formatCurrency(constructionData.financial.forecastAtCompletion)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Change Orders & Pay Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Change Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Change Orders</span>
                    <span className="text-lg font-bold">{constructionData.financial.changeOrders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Change Order Value</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(constructionData.financial.changeOrderValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">% of Contract</span>
                    <span className="text-lg font-bold">
                      {(
                        (constructionData.financial.changeOrderValue / constructionData.financial.contractValue) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Pay Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Applications Submitted</span>
                    <span className="text-lg font-bold">{constructionData.financial.payApplications}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending Payments</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(constructionData.financial.pendingPayments)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-lg font-bold">{constructionData.financial.profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Schedule Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Schedule Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.schedulePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="planned" fill={BRAND_COLORS.primary} />
                      <Bar dataKey="actual" fill={BRAND_COLORS.secondary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Milestone Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Milestone Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Milestones Completed</span>
                    <span className="text-lg font-bold">
                      {constructionData.schedule.milestonesComplete}/{constructionData.schedule.milestonesTotal}
                    </span>
                  </div>
                  <Progress
                    value={
                      (constructionData.schedule.milestonesComplete / constructionData.schedule.milestonesTotal) * 100
                    }
                    className="h-3"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Days Remaining</div>
                      <div className="text-lg font-bold text-foreground">{constructionData.schedule.daysRemaining}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Critical Path</div>
                      <div className="text-lg font-bold text-foreground">{constructionData.schedule.criticalPath}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Constraints & Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Constraints & Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{constructionData.risk.activeConstraints}</div>
                  <div className="text-sm text-muted-foreground">Active Constraints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{constructionData.risk.resolvedConstraints}</div>
                  <div className="text-sm text-muted-foreground">Resolved Constraints</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{constructionData.risk.highRiskItems}</div>
                  <div className="text-sm text-muted-foreground">High Risk Items</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Field Operations Tab */}
        <TabsContent value="field" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Safety Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Safety Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.safetyMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="incidents" stroke={BRAND_COLORS.error} strokeWidth={2} />
                      <Line type="monotone" dataKey="nearMisses" stroke={BRAND_COLORS.warning} strokeWidth={2} />
                      <Line type="monotone" dataKey="audits" stroke={BRAND_COLORS.success} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quality Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Quality Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.qualityMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill={BRAND_COLORS.primary} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Manpower Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Manpower Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.manpowerTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="planned"
                      stackId="1"
                      stroke={BRAND_COLORS.primary}
                      fill={BRAND_COLORS.primary}
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stackId="2"
                      stroke={BRAND_COLORS.secondary}
                      fill={BRAND_COLORS.secondary}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Field Operations Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{constructionData.field.dailyLogs}</div>
                  <div className="text-sm text-muted-foreground">Daily Logs</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{constructionData.field.rfiCount}</div>
                  <div className="text-sm text-muted-foreground">RFIs Processed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{constructionData.field.submittals}</div>
                  <div className="text-sm text-muted-foreground">Submittals</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{constructionData.field.manpowerToday}</div>
                  <div className="text-sm text-muted-foreground">Current Manpower</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Procurement Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Procurement Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Commitments</span>
                    <span className="text-lg font-bold">{constructionData.procurement.totalCommitments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Commitment Value</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(constructionData.procurement.commitmentValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vendor Performance</span>
                    <span className="text-lg font-bold">{constructionData.procurement.vendorPerformance}%</span>
                  </div>
                  <Progress value={constructionData.procurement.vendorPerformance} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-600">High Risk Items</span>
                    <span className="text-lg font-bold text-red-600">{constructionData.risk.highRiskItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-yellow-600">Medium Risk Items</span>
                    <span className="text-lg font-bold text-yellow-600">{constructionData.risk.mediumRiskItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">Low Risk Items</span>
                    <span className="text-lg font-bold text-green-600">{constructionData.risk.lowRiskItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Weather Delays</span>
                    <span className="text-lg font-bold">{constructionData.risk.weatherDelays} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Permits & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Permits & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Permits Approved</span>
                    <span className="text-lg font-bold text-green-600">{constructionData.risk.permitsApproved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Permits Pending</span>
                    <span className="text-lg font-bold text-yellow-600">{constructionData.risk.permitsPending}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compliance Rate</span>
                    <span className="text-lg font-bold text-green-600">
                      {Math.round(
                        (constructionData.risk.permitsApproved /
                          (constructionData.risk.permitsApproved + constructionData.risk.permitsPending)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      (constructionData.risk.permitsApproved /
                        (constructionData.risk.permitsApproved + constructionData.risk.permitsPending)) *
                        100
                    )}
                    className="h-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
