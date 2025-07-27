/**
 * @fileoverview Earned Schedule KPIs Component
 * @module EarnedScheduleKPIs
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * KPI card grid displaying earned schedule performance metrics including
 * SPI, SPI(t), completion ratios, and activity tracking with status indicators.
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Target,
  Calendar,
  Activity,
  CheckCircle,
  Clock,
  BarChart3,
  AlertTriangle,
  Zap,
} from "lucide-react"

// Types
interface ScheduleMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  delta: string
  status: "good" | "warning" | "critical"
  description: string
}

interface EarnedScheduleData {
  spi: number // Schedule Performance Index
  spiT: number // SPI(t) - Time-based SPI
  actualTime: number // AT - Actual Time in days
  plannedPercent: number // Planned % Complete
  actualPercent: number // Actual % Complete
  activitiesAhead: number // Count of activities ahead
  activitiesBehind: number // Count of activities behind
  totalActivities: number // Total activities
  onTimeCompletions: number // Activities completed on time
  totalCompletions: number // Total completed activities
  currentDate: Date // Current project date
  plannedDuration: number // Original planned duration in days
}

interface EarnedScheduleKPIsProps {
  data?: EarnedScheduleData
  showPinning?: boolean
  onKPIClick?: (metric: ScheduleMetric) => void
  className?: string
}

// Mock earned schedule data for development
const mockEarnedScheduleData: EarnedScheduleData = {
  spi: 0.96,
  spiT: 0.94,
  actualTime: 145,
  plannedPercent: 72.5,
  actualPercent: 69.6,
  activitiesAhead: 12,
  activitiesBehind: 18,
  totalActivities: 247,
  onTimeCompletions: 156,
  totalCompletions: 172,
  currentDate: new Date("2025-01-10"),
  plannedDuration: 365,
}

// Status threshold configuration
const STATUS_THRESHOLDS = {
  spi: {
    good: 0.95, // >= 95%
    warning: 0.85, // 85-95%
    // < 85% = critical
  },
  spiT: {
    good: 0.95,
    warning: 0.85,
  },
  completion: {
    good: 2, // Within 2% variance
    warning: 5, // 2-5% variance
    // > 5% variance = critical
  },
  activities: {
    good: 10, // <= 10% behind
    warning: 20, // 10-20% behind
    // > 20% behind = critical
  },
  onTimeRatio: {
    good: 0.85, // >= 85%
    warning: 0.7, // 70-85%
    // < 70% = critical
  },
}

/**
 * KPICard Component - Reusable card for displaying KPI metrics
 */
const KPICard: React.FC<{ metric: ScheduleMetric; isPinned?: boolean; onPin?: () => void; onClick?: () => void }> = ({
  metric,
  isPinned = false,
  onPin,
  onClick,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <ArrowUpDown className="h-4 w-4 text-gray-600" />
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
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md",
        isPinned && "ring-2 ring-[#0021A5]",
        onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
          {onPin && (
            <Button variant="ghost" size="sm" onClick={onPin} className="h-6 w-6 p-0">
              <Target className={cn("h-3 w-3", isPinned ? "text-[#0021A5]" : "text-muted-foreground")} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">{metric.value}</span>
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

/**
 * EarnedScheduleKPIs Component
 */
export const EarnedScheduleKPIs: React.FC<EarnedScheduleKPIsProps> = ({
  data = mockEarnedScheduleData,
  showPinning = false,
  onKPIClick,
  className,
}) => {
  const [pinnedKPIs, setPinnedKPIs] = useState<string[]>([])

  // Calculate KPI metrics with status determination
  const kpiMetrics = useMemo((): ScheduleMetric[] => {
    if (!data) return []

    // Helper function to determine status based on thresholds
    const getStatus = (value: number, thresholds: any, inverted = false): "good" | "warning" | "critical" => {
      if (inverted) {
        // For metrics where lower is better (like activities behind)
        if (value <= thresholds.good) return "good"
        if (value <= thresholds.warning) return "warning"
        return "critical"
      } else {
        // For metrics where higher is better (like SPI)
        if (value >= thresholds.good) return "good"
        if (value >= thresholds.warning) return "warning"
        return "critical"
      }
    }

    // Helper function to get trend based on value comparison
    const getTrend = (current: number, baseline: number): "up" | "down" | "stable" => {
      const diff = Math.abs(current - baseline)
      if (diff < 0.01) return "stable"
      return current > baseline ? "up" : "down"
    }

    // Calculate completion variance
    const completionVariance = Math.abs(data.actualPercent - data.plannedPercent)
    const completionStatus = getStatus(completionVariance, STATUS_THRESHOLDS.completion, true)

    // Calculate activities performance
    const activitiesBehindPercent = (data.activitiesBehind / data.totalActivities) * 100
    const activitiesStatus = getStatus(activitiesBehindPercent, STATUS_THRESHOLDS.activities, true)

    // Calculate on-time completion ratio
    const onTimeRatio = data.totalCompletions > 0 ? data.onTimeCompletions / data.totalCompletions : 0
    const onTimeStatus = getStatus(onTimeRatio, STATUS_THRESHOLDS.onTimeRatio)

    return [
      // Schedule Performance Index (SPI)
      {
        label: "Schedule Performance Index",
        value: `${(data.spi * 100).toFixed(1)}%`,
        trend: getTrend(data.spi, 1.0),
        delta: `${data.spi >= 1.0 ? "+" : ""}${((data.spi - 1.0) * 100).toFixed(1)}%`,
        status: getStatus(data.spi, STATUS_THRESHOLDS.spi),
        description: "Earned value / Planned value ratio",
      },

      // SPI(t) and Actual Time
      {
        label: "Time-based SPI & Actual Time",
        value: `${(data.spiT * 100).toFixed(1)}% / ${data.actualTime}d`,
        trend: getTrend(data.spiT, 1.0),
        delta: `${data.spiT >= 1.0 ? "+" : ""}${((data.spiT - 1.0) * 100).toFixed(1)}%`,
        status: getStatus(data.spiT, STATUS_THRESHOLDS.spiT),
        description: "Time performance index and actual duration",
      },

      // Planned vs Actual % Complete
      {
        label: "Planned vs Actual Complete",
        value: `${data.plannedPercent.toFixed(1)}% / ${data.actualPercent.toFixed(1)}%`,
        trend:
          data.actualPercent > data.plannedPercent
            ? "up"
            : data.actualPercent < data.plannedPercent
            ? "down"
            : "stable",
        delta: `${data.actualPercent >= data.plannedPercent ? "+" : ""}${(
          data.actualPercent - data.plannedPercent
        ).toFixed(1)}%`,
        status: completionStatus,
        description: "Schedule completion variance analysis",
      },

      // Activities Ahead/Behind Schedule
      {
        label: "Activities Ahead/Behind",
        value: `${data.activitiesAhead} / ${data.activitiesBehind}`,
        trend:
          data.activitiesAhead > data.activitiesBehind
            ? "up"
            : data.activitiesAhead < data.activitiesBehind
            ? "down"
            : "stable",
        delta: `${activitiesBehindPercent.toFixed(1)}% behind`,
        status: activitiesStatus,
        description: `Of ${data.totalActivities} total activities`,
      },

      // On-time Completion Ratio
      {
        label: "On-Time Completion Ratio",
        value: `${(onTimeRatio * 100).toFixed(1)}%`,
        trend: onTimeRatio >= 0.85 ? "up" : onTimeRatio >= 0.7 ? "stable" : "down",
        delta: `${data.onTimeCompletions}/${data.totalCompletions}`,
        status: onTimeStatus,
        description: "Activities completed on schedule",
      },
    ]
  }, [data])

  // Handle KPI pinning
  const handlePinKPI = (kpiLabel: string) => {
    setPinnedKPIs((prev) =>
      prev.includes(kpiLabel) ? prev.filter((label) => label !== kpiLabel) : [...prev, kpiLabel]
    )
  }

  // Handle KPI click
  const handleKPIClick = (metric: ScheduleMetric) => {
    if (onKPIClick) {
      onKPIClick(metric)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#0021A5]" />
            Earned Schedule KPIs
          </h3>
          <p className="text-sm text-muted-foreground">Schedule performance indicators and variance analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {kpiMetrics.filter((k) => k.status === "good").length} Good
          </Badge>
          <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-200">
            {kpiMetrics.filter((k) => k.status === "warning").length} Warning
          </Badge>
          <Badge variant="outline" className="text-xs text-red-600 border-red-200">
            {kpiMetrics.filter((k) => k.status === "critical").length} Critical
          </Badge>
        </div>
      </div>

      {/* Pinned KPIs Banner */}
      {showPinning && pinnedKPIs.length > 0 && (
        <Card className="border-l-4 border-l-[#0021A5] bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-[#0021A5]" />
              Pinned KPIs ({pinnedKPIs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpiMetrics
                .filter((kpi) => pinnedKPIs.includes(kpi.label))
                .map((kpi) => (
                  <KPICard
                    key={kpi.label}
                    metric={kpi}
                    isPinned={true}
                    onPin={showPinning ? () => handlePinKPI(kpi.label) : undefined}
                    onClick={() => handleKPIClick(kpi)}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiMetrics.map((metric) => (
          <KPICard
            key={metric.label}
            metric={metric}
            isPinned={pinnedKPIs.includes(metric.label)}
            onPin={showPinning ? () => handlePinKPI(metric.label) : undefined}
            onClick={() => handleKPIClick(metric)}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <Card className="bg-gray-50 dark:bg-gray-900/50">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-[#0021A5]">{data.totalActivities}</div>
              <div className="text-xs text-muted-foreground">Total Activities</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{data.activitiesAhead}</div>
              <div className="text-xs text-muted-foreground">Ahead of Schedule</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">{data.activitiesBehind}</div>
              <div className="text-xs text-muted-foreground">Behind Schedule</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-[#FA4616]">{data.actualTime}d</div>
              <div className="text-xs text-muted-foreground">Actual Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EarnedScheduleKPIs
