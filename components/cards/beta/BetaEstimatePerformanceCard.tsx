"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Building,
  TrendingUp,
  DollarSign,
  Target,
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
  User,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building2,
  UserCheck,
  Activity as ActivityIcon,
  Timer,
  TrendingDown,
  Award as AwardIcon,
  Target as TargetIcon,
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

interface EstimatePerformance {
  id: string
  projectName: string
  clientName: string
  estimateValue: number
  submittedDate: string
  decisionDate: string
  status: "Won" | "Lost" | "Pending"
  duration: number
  feeRecovery: number
  projectedFee: number
  estimator: string
  complexity: "Low" | "Medium" | "High"
}

interface MonthlyEstimateData {
  month: string
  estimates: number
  won: number
  lost: number
  pending: number
  avgDuration: number
  avgFeeRecovery: number
}

interface BetaEstimatePerformanceCardProps {
  className?: string
  isCompact?: boolean
}

export function BetaEstimatePerformanceCard({ className, isCompact = false }: BetaEstimatePerformanceCardProps) {
  const [activeTab, setActiveTab] = useState("performance")

  const estimateData = useMemo(
    () => [
      {
        id: "1",
        projectName: "Downtown Office Tower",
        clientName: "Tampa Bay Development",
        estimateValue: 45000000,
        submittedDate: "2025-01-15",
        decisionDate: "2025-02-15",
        status: "Won",
        duration: 32,
        feeRecovery: 95,
        projectedFee: 1800000,
        estimator: "J. Smith",
        complexity: "High",
      },
      {
        id: "2",
        projectName: "Medical Center Expansion",
        clientName: "Health Systems Inc",
        estimateValue: 28000000,
        submittedDate: "2025-01-20",
        decisionDate: "2025-02-20",
        status: "Lost",
        duration: 31,
        feeRecovery: 85,
        projectedFee: 1120000,
        estimator: "M. Johnson",
        complexity: "Medium",
      },
      {
        id: "3",
        projectName: "Educational Campus",
        clientName: "University Partners",
        estimateValue: 35000000,
        submittedDate: "2025-01-25",
        decisionDate: "2025-02-25",
        status: "Won",
        duration: 30,
        feeRecovery: 92,
        projectedFee: 1400000,
        estimator: "A. Davis",
        complexity: "High",
      },
      {
        id: "4",
        projectName: "Retail Complex",
        clientName: "Commercial Properties",
        estimateValue: 18000000,
        submittedDate: "2025-02-01",
        decisionDate: "2025-03-01",
        status: "Won",
        duration: 29,
        feeRecovery: 88,
        projectedFee: 720000,
        estimator: "J. Smith",
        complexity: "Medium",
      },
      {
        id: "5",
        projectName: "Infrastructure Project",
        clientName: "City of Tampa",
        estimateValue: 65000000,
        submittedDate: "2025-02-05",
        decisionDate: "2025-03-05",
        status: "Pending",
        duration: 28,
        feeRecovery: 0,
        projectedFee: 2600000,
        estimator: "M. Johnson",
        complexity: "High",
      },
      {
        id: "6",
        projectName: "Residential Complex",
        clientName: "Housing Partners",
        estimateValue: 22000000,
        submittedDate: "2025-02-10",
        decisionDate: "2025-03-10",
        status: "Won",
        duration: 28,
        feeRecovery: 90,
        projectedFee: 880000,
        estimator: "A. Davis",
        complexity: "Medium",
      },
      {
        id: "7",
        projectName: "Industrial Facility",
        clientName: "Manufacturing Corp",
        estimateValue: 32000000,
        submittedDate: "2025-02-15",
        decisionDate: "2025-03-15",
        status: "Lost",
        duration: 28,
        feeRecovery: 75,
        projectedFee: 1280000,
        estimator: "J. Smith",
        complexity: "High",
      },
      {
        id: "8",
        projectName: "Hospitality Project",
        clientName: "Hotel Group",
        estimateValue: 25000000,
        submittedDate: "2025-02-20",
        decisionDate: "2025-03-20",
        status: "Won",
        duration: 28,
        feeRecovery: 94,
        projectedFee: 1000000,
        estimator: "M. Johnson",
        complexity: "Medium",
      },
    ],
    []
  )

  const monthlyData = useMemo(
    () => [
      { month: "Jan", estimates: 3, won: 2, lost: 1, pending: 0, avgDuration: 31, avgFeeRecovery: 90 },
      { month: "Feb", estimates: 5, won: 3, lost: 1, pending: 1, avgDuration: 28.6, avgFeeRecovery: 89.5 },
      { month: "Mar", estimates: 4, won: 2, lost: 1, pending: 1, avgDuration: 28, avgFeeRecovery: 92 },
      { month: "Apr", estimates: 6, won: 4, lost: 1, pending: 1, avgDuration: 27.5, avgFeeRecovery: 91.2 },
      { month: "May", estimates: 5, won: 3, lost: 1, pending: 1, avgDuration: 27, avgFeeRecovery: 93.5 },
      { month: "Jun", estimates: 7, won: 5, lost: 1, pending: 1, avgDuration: 26.5, avgFeeRecovery: 94.1 },
    ],
    []
  )

  const totalEstimates = estimateData.length
  const wonEstimates = estimateData.filter((e) => e.status === "Won").length
  const lostEstimates = estimateData.filter((e) => e.status === "Lost").length
  const pendingEstimates = estimateData.filter((e) => e.status === "Pending").length
  const hitRate = totalEstimates > 0 ? Math.round((wonEstimates / (wonEstimates + lostEstimates)) * 100) : 0
  const avgDuration = Math.round(estimateData.reduce((sum, e) => sum + e.duration, 0) / estimateData.length)
  const avgFeeRecovery = Math.round(
    estimateData.filter((e) => e.status !== "Pending").reduce((sum, e) => sum + e.feeRecovery, 0) /
      estimateData.filter((e) => e.status !== "Pending").length
  )
  const totalFeeRecovery = estimateData
    .filter((e) => e.status !== "Pending")
    .reduce((sum, e) => sum + (e.projectedFee * e.feeRecovery) / 100, 0)
  const totalProjectedFee = estimateData
    .filter((e) => e.status !== "Pending")
    .reduce((sum, e) => sum + e.projectedFee, 0)
  const feeRecoveryRate = totalProjectedFee > 0 ? Math.round((totalFeeRecovery / totalProjectedFee) * 100) : 0

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Won: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getComplexityColor = (complexity: string) => {
    const colors = {
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[complexity as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card
      className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
              Estimate Performance
            </CardTitle>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Win/loss analysis and fee recovery tracking
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              <TargetIcon className="h-3 w-3 mr-1" />
              YTD Performance
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{totalEstimates}</div>
            <div className="text-xs text-green-700 dark:text-green-300">Total Estimates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{hitRate}%</div>
            <div className="text-xs text-green-700 dark:text-green-300">Hit Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{avgDuration}</div>
            <div className="text-xs text-green-700 dark:text-green-300">Avg Duration (days)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{feeRecoveryRate}%</div>
            <div className="text-xs text-green-700 dark:text-green-300">Fee Recovery</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-green-100 dark:bg-green-900">
            <TabsTrigger value="performance" className="text-green-900 dark:text-green-100">
              Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-green-900 dark:text-green-100">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            {/* Status Distribution */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-900 dark:text-green-100">{wonEstimates}</div>
                <div className="text-xs text-green-700 dark:text-green-300">Won</div>
                <Progress value={(wonEstimates / totalEstimates) * 100} className="h-2 mt-2" />
              </div>
              <div className="text-center p-3 bg-white dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-900 dark:text-green-100">{lostEstimates}</div>
                <div className="text-xs text-green-700 dark:text-green-300">Lost</div>
                <Progress value={(lostEstimates / totalEstimates) * 100} className="h-2 mt-2" />
              </div>
              <div className="text-center p-3 bg-white dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-900 dark:text-green-100">{pendingEstimates}</div>
                <div className="text-xs text-green-700 dark:text-green-300">Pending</div>
                <Progress value={(pendingEstimates / totalEstimates) * 100} className="h-2 mt-2" />
              </div>
            </div>

            {/* Recent Estimates List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {estimateData.slice(0, 5).map((estimate) => (
                <div
                  key={estimate.id}
                  className="flex items-center justify-between p-2 bg-white dark:bg-green-900/20 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          estimate.status === "Won" ? "#10b981" : estimate.status === "Lost" ? "#ef4444" : "#f59e0b",
                      }}
                    ></div>
                    <div>
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">
                        {estimate.projectName}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">{estimate.clientName}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">
                        {formatCurrency(estimate.estimateValue)}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">{estimate.duration} days</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={`text-xs ${getStatusColor(estimate.status)}`}>{estimate.status}</Badge>
                      <Badge className={`text-xs ${getComplexityColor(estimate.complexity)}`}>
                        {estimate.complexity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* Monthly Trends Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />

                  <Bar dataKey="estimates" fill="#10b981" name="Estimates" />
                  <Line type="monotone" dataKey="avgDuration" stroke="#f59e0b" strokeWidth={2} name="Avg Duration" />
                  <Line
                    type="monotone"
                    dataKey="avgFeeRecovery"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Fee Recovery %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Trends */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">Duration Trend</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Days per estimate</div>
                  </div>
                  <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-lg font-bold text-green-900 dark:text-green-100 mt-2">
                  {Math.round(monthlyData[monthlyData.length - 1]?.avgDuration || 0)} days
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-800 dark:text-green-200">Fee Recovery</div>
                    <div className="text-xs text-green-600 dark:text-green-400">Average %</div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-lg font-bold text-green-900 dark:text-green-100 mt-2">
                  {Math.round(monthlyData[monthlyData.length - 1]?.avgFeeRecovery || 0)}%
                </div>
              </div>
            </div>

            {/* Estimator Performance */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Top Estimators</div>
              {["J. Smith", "M. Johnson", "A. Davis"].map((estimator, index) => {
                const estimates = estimateData.filter((e) => e.estimator === estimator)
                const won = estimates.filter((e) => e.status === "Won").length
                const total = estimates.length
                const winRate = total > 0 ? Math.round((won / total) * 100) : 0
                return (
                  <div
                    key={estimator}
                    className="flex items-center justify-between p-2 bg-white dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-800 dark:text-green-200">{estimator}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-800 dark:text-green-200">{winRate}% win rate</div>
                      <div className="text-xs text-green-600 dark:text-green-400">{total} estimates</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
