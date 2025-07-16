/**
 * @fileoverview Milestone Trends Component
 * @module MilestoneTrends
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * Power BI embedded milestone trends visualization component showing
 * Contract Schedule, Previous Update, and Current Schedule lines across
 * project milestones with monthly update tracking.
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Skeleton } from "../../ui/skeleton"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"
import {
  Calendar,
  TrendingUp,
  RefreshCw,
  Activity,
  Target,
  BarChart3,
  ExternalLink,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

// Types
interface MilestoneData {
  milestoneId: string
  description: string
  order: number
  contractDate: string
  previousDate: string
  currentDate: string
  status: "on-track" | "at-risk" | "delayed" | "complete"
  variance: number // days variance from contract
}

interface MilestoneTrendsProps {
  data?: MilestoneData[]
  loading?: boolean
  error?: string
  height?: number
  showLegend?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onMilestoneClick?: (milestone: MilestoneData) => void
  className?: string
}

// Mock milestone data for development
const mockMilestoneData: MilestoneData[] = [
  {
    milestoneId: "MS001",
    description: "Notice to Proceed",
    order: 1,
    contractDate: "2024-09-01",
    previousDate: "2024-09-01",
    currentDate: "2024-09-01",
    status: "complete",
    variance: 0,
  },
  {
    milestoneId: "MS002",
    description: "Permit Issued",
    order: 2,
    contractDate: "2024-10-15",
    previousDate: "2024-10-18",
    currentDate: "2024-10-20",
    status: "complete",
    variance: 5,
  },
  {
    milestoneId: "MS003",
    description: "Excavation Complete",
    order: 3,
    contractDate: "2024-11-30",
    previousDate: "2024-12-05",
    currentDate: "2024-12-03",
    status: "complete",
    variance: 3,
  },
  {
    milestoneId: "MS004",
    description: "Foundation Complete",
    order: 4,
    contractDate: "2025-01-15",
    previousDate: "2025-01-20",
    currentDate: "2025-01-18",
    status: "at-risk",
    variance: 3,
  },
  {
    milestoneId: "MS005",
    description: "Structural Complete",
    order: 5,
    contractDate: "2025-03-01",
    previousDate: "2025-03-08",
    currentDate: "2025-03-05",
    status: "on-track",
    variance: 4,
  },
  {
    milestoneId: "MS006",
    description: "Rough-In Complete",
    order: 6,
    contractDate: "2025-05-15",
    previousDate: "2025-05-22",
    currentDate: "2025-05-18",
    status: "on-track",
    variance: 3,
  },
  {
    milestoneId: "MS007",
    description: "Drywall Complete",
    order: 7,
    contractDate: "2025-07-01",
    previousDate: "2025-07-08",
    currentDate: "2025-07-05",
    status: "on-track",
    variance: 4,
  },
  {
    milestoneId: "MS008",
    description: "Final Inspections",
    order: 8,
    contractDate: "2025-08-15",
    previousDate: "2025-08-20",
    currentDate: "2025-08-18",
    status: "on-track",
    variance: 3,
  },
  {
    milestoneId: "MS009",
    description: "Certificate of Occupancy",
    order: 9,
    contractDate: "2025-09-01",
    previousDate: "2025-09-05",
    currentDate: "2025-09-03",
    status: "on-track",
    variance: 2,
  },
  {
    milestoneId: "MS010",
    description: "Final Completion",
    order: 10,
    contractDate: "2025-09-15",
    previousDate: "2025-09-18",
    currentDate: "2025-09-16",
    status: "on-track",
    variance: 1,
  },
]

/**
 * MilestoneTrends Component
 */
export const MilestoneTrends: React.FC<MilestoneTrendsProps> = ({
  data = mockMilestoneData,
  loading = false,
  error,
  height = 400,
  showLegend = true,
  autoRefresh = false,
  refreshInterval = 30000,
  onMilestoneClick,
  className,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Transform milestone data for chart visualization
  const chartData = useMemo(() => {
    if (!data) return []

    return data.map((milestone) => ({
      milestone: milestone.description,
      order: milestone.order,
      contractSchedule: new Date(milestone.contractDate).getTime(),
      previousUpdate: new Date(milestone.previousDate).getTime(),
      currentSchedule: new Date(milestone.currentDate).getTime(),
      status: milestone.status,
      variance: milestone.variance,
    }))
  }, [data])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!data) return { onTrack: 0, atRisk: 0, delayed: 0, complete: 0, avgVariance: 0 }

    const stats = data.reduce(
      (acc, milestone) => {
        acc[milestone.status]++
        acc.totalVariance += Math.abs(milestone.variance)
        return acc
      },
      { "on-track": 0, "at-risk": 0, delayed: 0, complete: 0, totalVariance: 0 }
    )

    return {
      onTrack: stats["on-track"],
      atRisk: stats["at-risk"],
      delayed: stats.delayed,
      complete: stats.complete,
      avgVariance: Math.round(stats.totalVariance / data.length),
    }
  }, [data])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setIsRefreshing(true)
      setTimeout(() => {
        setLastRefresh(new Date())
        setIsRefreshing(false)
      }, 1000)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Manual refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastRefresh(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.dataKey === "contractSchedule" && `Contract: ${new Date(entry.value).toLocaleDateString()}`}
              {entry.dataKey === "previousUpdate" && `Previous: ${new Date(entry.value).toLocaleDateString()}`}
              {entry.dataKey === "currentSchedule" && `Current: ${new Date(entry.value).toLocaleDateString()}`}
            </p>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Variance: {data.variance > 0 ? `+${data.variance}` : data.variance} days
          </p>
        </div>
      )
    }
    return null
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-sm text-muted-foreground">Failed to load milestone trends</p>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-[#0021A5]" />
              Schedule Monitor
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Project milestone tracking across contract, previous, and current schedules
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Power BI Badge */}
            <Badge variant="outline" className="text-xs bg-[#FFCC00]/10 text-[#FFCC00] border-[#FFCC00]/20">
              Power BI
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="h-8 w-8 p-0">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Complete</span>
            </div>
            <p className="text-xl font-bold text-green-800 dark:text-green-200">{summaryStats.complete}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">On Track</span>
            </div>
            <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{summaryStats.onTrack}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">At Risk</span>
            </div>
            <p className="text-xl font-bold text-yellow-800 dark:text-yellow-200">{summaryStats.atRisk}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg Variance</span>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{summaryStats.avgVariance}d</p>
          </div>
        </div>

        {/* Milestone Trends Chart */}
        <div style={{ height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="milestone"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={11}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                fontSize={11}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}

              {/* Contract Schedule Line */}
              <Line
                type="monotone"
                dataKey="contractSchedule"
                stroke="#0021A5"
                strokeWidth={2}
                dot={{ r: 4, fill: "#0021A5" }}
                name="Contract Schedule"
                connectNulls={false}
              />

              {/* Previous Update Line */}
              <Line
                type="monotone"
                dataKey="previousUpdate"
                stroke="#FA4616"
                strokeWidth={2}
                dot={{ r: 4, fill: "#FA4616" }}
                strokeDasharray="5 5"
                name="Previous Update"
                connectNulls={false}
              />

              {/* Current Schedule Line */}
              <Line
                type="monotone"
                dataKey="currentSchedule"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 5, fill: "#22c55e" }}
                name="Current Schedule"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Footer with Power BI Integration */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="h-3 w-3" />
            <span>Powered by Microsoft Power BI</span>
            <span>•</span>
            <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            {autoRefresh && (
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MilestoneTrends
