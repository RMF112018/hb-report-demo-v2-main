/**
 * @fileoverview Performance Panel - Schedule Performance Analytics Content
 * @module PerformancePanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Performance panel containing earned schedule KPIs, progress velocity charts,
 * and performance analytics for the scheduler dashboard
 */

"use client"

import React, { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Bar,
} from "recharts"
import { TrendingUp, TrendingDown, Activity, Target, BarChart3 } from "lucide-react"

// Lazy imports for performance
const EarnedScheduleKPIs = lazy(() => import("@/components/scheduler/performance/EarnedScheduleKPIs"))

// Types
interface ScheduleMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  delta: string
  status: "good" | "warning" | "critical"
  description: string
}

interface PerformancePanelProps {
  currentKPIs: ScheduleMetric[]
  pinnedKPIs: string[]
  onPinKPI: (kpiLabel: string) => void
}

// Mock data for Progress Velocity Chart
const progressVelocityData = [
  { week: "Week 1", planned: 8.5, actual: 7.2, cumulative: 7.2, variance: -1.3 },
  { week: "Week 2", planned: 12.0, actual: 11.8, cumulative: 19.0, variance: -0.2 },
  { week: "Week 3", planned: 15.5, actual: 14.2, cumulative: 33.2, variance: -1.3 },
  { week: "Week 4", planned: 18.0, actual: 19.5, cumulative: 52.7, variance: 1.5 },
  { week: "Week 5", planned: 22.5, actual: 21.8, cumulative: 74.5, variance: -0.7 },
  { week: "Week 6", planned: 25.0, actual: 26.3, cumulative: 100.8, variance: 1.3 },
  { week: "Week 7", planned: 28.5, actual: 27.1, cumulative: 127.9, variance: -1.4 },
  { week: "Week 8", planned: 32.0, actual: 34.2, cumulative: 162.1, variance: 2.2 },
]

// KPI Card Component
const KPICard: React.FC<{
  metric: ScheduleMetric
  isPinned?: boolean
  onPin?: () => void
}> = ({ metric, isPinned = false, onPin }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-800"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:text-gray-300 dark:border-gray-800"
    }
  }

  return (
    <Card className={cn("relative transition-all duration-200 hover:shadow-md", isPinned && "ring-2 ring-primary")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
          {onPin && (
            <Button variant="ghost" size="sm" onClick={onPin} className="h-6 w-6 p-0">
              <Target className={cn("h-3 w-3", isPinned ? "text-primary" : "text-muted-foreground")} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{metric.value}</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(metric.trend)}
              <span className="text-sm text-muted-foreground">{metric.delta}</span>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", getStatusColor(metric.status))}>
            {metric.status.toUpperCase()}
          </Badge>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton for Charts
const ChartSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
)

// Progress Velocity Chart Component
const ProgressVelocityChart: React.FC = () => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-blue-600">Planned:</span>
              <span className="font-medium">{data.planned}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-green-600">Actual:</span>
              <span className="font-medium">{data.actual}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-purple-600">Cumulative:</span>
              <span className="font-medium">{data.cumulative}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className={data.variance >= 0 ? "text-green-600" : "text-red-600"}>Variance:</span>
              <span className="font-medium">
                {data.variance > 0 ? "+" : ""}
                {data.variance}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#0021A5]" />
          Progress Velocity Chart
        </CardTitle>
        <p className="text-sm text-muted-foreground">Weekly progress tracking with planned vs actual completion</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={progressVelocityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />

              {/* Cumulative progress area */}
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#8B5CF6"
                strokeWidth={2}
                fill="url(#cumulativeGradient)"
                name="Cumulative Progress"
              />

              {/* Planned progress bars */}
              <Bar dataKey="planned" fill="#0021A5" name="Planned Weekly" opacity={0.6} />

              {/* Actual progress line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                name="Actual Weekly"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-[#0021A5]">162.1%</div>
            <div className="text-xs text-muted-foreground">Total Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">+2.2%</div>
            <div className="text-xs text-muted-foreground">Current Variance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">20.3%</div>
            <div className="text-xs text-muted-foreground">Weekly Avg</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">1.15</div>
            <div className="text-xs text-muted-foreground">Velocity Index</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ currentKPIs, pinnedKPIs, onPinKPI }) => {
  return (
    <div className="space-y-6">
      {/* Performance KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentKPIs.map((kpi) => (
          <KPICard
            key={kpi.label}
            metric={kpi}
            isPinned={pinnedKPIs.includes(kpi.label)}
            onPin={() => onPinKPI(kpi.label)}
          />
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earned Schedule KPIs - Remove wrapper Card */}
        <Suspense fallback={<ChartSkeleton />}>
          <EarnedScheduleKPIs />
        </Suspense>

        {/* Progress Velocity Chart */}
        <ProgressVelocityChart />
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule Performance Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">0.96</div>
                <p className="text-sm text-muted-foreground">Current SPI</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target</span>
                  <span className="font-medium">1.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Variance</span>
                  <span className="font-medium text-red-600">-4%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trend</span>
                  <span className="font-medium text-green-600">Improving</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost Performance Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">1.05</div>
                <p className="text-sm text-muted-foreground">Current CPI</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target</span>
                  <span className="font-medium">1.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Variance</span>
                  <span className="font-medium text-green-600">+5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Trend</span>
                  <span className="font-medium text-green-600">Stable</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">85%</div>
                <p className="text-sm text-muted-foreground">Completion Confidence</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>On-Time Delivery</span>
                  <span className="font-medium">Feb 15, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Schedule Buffer</span>
                  <span className="font-medium">6 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200 text-xs">
                    MODERATE
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerformancePanel
