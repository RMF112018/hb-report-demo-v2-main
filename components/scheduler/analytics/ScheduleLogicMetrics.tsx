/**
 * @fileoverview Schedule Logic Metrics Component
 * @module ScheduleLogicMetrics
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * Schedule logic analysis metrics displaying logic density, missing ties,
 * relationship types, and schedule quality indicators with threshold-based
 * color coding for schedule health assessment.
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Switch } from "../../ui/switch"
import { Progress } from "../../ui/progress"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  GitBranch,
  Target,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Settings,
  Info,
  AlertCircle,
  Zap,
  Link,
  Triangle,
  RotateCcw,
} from "lucide-react"

// Types
interface LogicMetric {
  id: string
  label: string
  value: number | string | boolean
  unit?: string
  description: string
  threshold: {
    good: number | boolean
    warning: number | boolean
    critical: number | boolean
  }
  status: "good" | "warning" | "critical"
  trend?: "up" | "down" | "stable"
  icon: React.ComponentType<{ className?: string }>
}

interface ScheduleLogicData {
  totalActivities: number
  totalLogicLinks: number
  activitiesMissingTies: number
  danglingLogic: number
  ssffPercentage: number
  fsPercentage: number
  loopsDetected: number
  redundantLinksDetected: number
  averageSuccessors: number
  averagePredecessors: number
  maxLogicDepth: number
  constrainedActivities: number
}

interface ScheduleLogicMetricsProps {
  showMockData?: boolean
  onMetricClick?: (metricId: string) => void
  onRefresh?: () => void
}

// Mock Data
const mockLogicData: ScheduleLogicData = {
  totalActivities: 150,
  totalLogicLinks: 320,
  activitiesMissingTies: 14,
  danglingLogic: 8,
  ssffPercentage: 18,
  fsPercentage: 82,
  loopsDetected: 1,
  redundantLinksDetected: 3,
  averageSuccessors: 2.1,
  averagePredecessors: 2.1,
  maxLogicDepth: 24,
  constrainedActivities: 12,
}

// Threshold definitions for schedule quality assessment
const getLogicDensityStatus = (density: number): "good" | "warning" | "critical" => {
  if (density >= 2.0 && density <= 4.0) return "good"
  if (density >= 1.5 || density <= 5.0) return "warning"
  return "critical"
}

const getMissingTiesStatus = (percentage: number): "good" | "warning" | "critical" => {
  if (percentage <= 5) return "good"
  if (percentage <= 10) return "warning"
  return "critical"
}

const getRelationshipTypeStatus = (ssffPercentage: number): "good" | "warning" | "critical" => {
  if (ssffPercentage >= 10 && ssffPercentage <= 25) return "good"
  if (ssffPercentage >= 5 && ssffPercentage <= 35) return "warning"
  return "critical"
}

const getLoopStatus = (loops: number): "good" | "warning" | "critical" => {
  if (loops === 0) return "good"
  if (loops <= 2) return "warning"
  return "critical"
}

// Main Component
const ScheduleLogicMetrics: React.FC<ScheduleLogicMetricsProps> = ({
  showMockData = true,
  onMetricClick,
  onRefresh,
}) => {
  const [useMockData, setUseMockData] = useState(showMockData)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  // Calculate derived metrics and status
  const calculatedMetrics = useMemo(() => {
    const logicDensity = mockLogicData.totalLogicLinks / mockLogicData.totalActivities
    const missingTiesPercentage = (mockLogicData.activitiesMissingTies / mockLogicData.totalActivities) * 100
    const danglingPercentage = (mockLogicData.danglingLogic / mockLogicData.totalActivities) * 100
    const constrainedPercentage = (mockLogicData.constrainedActivities / mockLogicData.totalActivities) * 100

    const metrics: LogicMetric[] = [
      {
        id: "logic-density",
        label: "Logic Density",
        value: logicDensity,
        unit: "links/activity",
        description: "Average number of logic links per activity",
        threshold: { good: 2.0, warning: 1.5, critical: 1.0 },
        status: getLogicDensityStatus(logicDensity),
        trend: "stable",
        icon: GitBranch,
      },
      {
        id: "missing-ties",
        label: "Missing Ties",
        value: mockLogicData.activitiesMissingTies,
        unit: `activities (${missingTiesPercentage.toFixed(1)}%)`,
        description: "Activities missing predecessor or successor relationships",
        threshold: { good: 0, warning: 10, critical: 20 },
        status: getMissingTiesStatus(missingTiesPercentage),
        trend: "down",
        icon: AlertTriangle,
      },
      {
        id: "dangling-logic",
        label: "Dangling Logic",
        value: mockLogicData.danglingLogic,
        unit: `activities (${danglingPercentage.toFixed(1)}%)`,
        description: "Activities with incomplete or hanging logic connections",
        threshold: { good: 0, warning: 5, critical: 10 },
        status: danglingPercentage <= 3 ? "good" : danglingPercentage <= 7 ? "warning" : "critical",
        trend: "stable",
        icon: Link,
      },
      {
        id: "relationship-types",
        label: "SS/FF Usage",
        value: mockLogicData.ssffPercentage,
        unit: "% non-FS relationships",
        description: "Percentage of Start-to-Start and Finish-to-Finish relationships",
        threshold: { good: 15, warning: 5, critical: 0 },
        status: getRelationshipTypeStatus(mockLogicData.ssffPercentage),
        trend: "up",
        icon: Target,
      },
      {
        id: "loops-detected",
        label: "Logic Loops",
        value: mockLogicData.loopsDetected > 0,
        unit: `${mockLogicData.loopsDetected} detected`,
        description: "Circular dependencies in schedule logic",
        threshold: { good: false, warning: false, critical: true },
        status: getLoopStatus(mockLogicData.loopsDetected),
        trend: "stable",
        icon: RotateCcw,
      },
      {
        id: "redundant-links",
        label: "Redundant Links",
        value: mockLogicData.redundantLinksDetected,
        unit: "redundant connections",
        description: "Duplicate or unnecessary logic relationships",
        threshold: { good: 0, warning: 3, critical: 5 },
        status:
          mockLogicData.redundantLinksDetected <= 2
            ? "good"
            : mockLogicData.redundantLinksDetected <= 4
            ? "warning"
            : "critical",
        trend: "down",
        icon: Triangle,
      },
      {
        id: "avg-successors",
        label: "Avg Successors",
        value: mockLogicData.averageSuccessors,
        unit: "per activity",
        description: "Average number of successor activities",
        threshold: { good: 2.0, warning: 1.5, critical: 1.0 },
        status:
          mockLogicData.averageSuccessors >= 2.0
            ? "good"
            : mockLogicData.averageSuccessors >= 1.5
            ? "warning"
            : "critical",
        trend: "stable",
        icon: TrendingUp,
      },
      {
        id: "logic-depth",
        label: "Logic Depth",
        value: mockLogicData.maxLogicDepth,
        unit: "max levels",
        description: "Maximum dependency chain length",
        threshold: { good: 20, warning: 30, critical: 40 },
        status: mockLogicData.maxLogicDepth <= 25 ? "good" : mockLogicData.maxLogicDepth <= 35 ? "warning" : "critical",
        trend: "stable",
        icon: Activity,
      },
      {
        id: "constrained-activities",
        label: "Constrained Activities",
        value: constrainedPercentage,
        unit: "% with constraints",
        description: "Activities with date constraints applied",
        threshold: { good: 5, warning: 10, critical: 15 },
        status: constrainedPercentage <= 8 ? "good" : constrainedPercentage <= 12 ? "warning" : "critical",
        trend: "stable",
        icon: Zap,
      },
    ]

    return metrics
  }, [])

  // Summary statistics
  const summaryStats = useMemo(() => {
    const goodMetrics = calculatedMetrics.filter((m) => m.status === "good").length
    const warningMetrics = calculatedMetrics.filter((m) => m.status === "warning").length
    const criticalMetrics = calculatedMetrics.filter((m) => m.status === "critical").length
    const totalMetrics = calculatedMetrics.length

    const overallScore = (goodMetrics * 100 + warningMetrics * 60 + criticalMetrics * 20) / totalMetrics

    let overallStatus: "good" | "warning" | "critical"
    if (overallScore >= 80) overallStatus = "good"
    else if (overallScore >= 60) overallStatus = "warning"
    else overallStatus = "critical"

    return {
      goodMetrics,
      warningMetrics,
      criticalMetrics,
      totalMetrics,
      overallScore,
      overallStatus,
    }
  }, [calculatedMetrics])

  // Metric Card Component
  const MetricCard: React.FC<{ metric: LogicMetric }> = ({ metric }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "good":
          return "text-green-600 bg-green-50 border-green-200"
        case "warning":
          return "text-yellow-600 bg-yellow-50 border-yellow-200"
        case "critical":
          return "text-red-600 bg-red-50 border-red-200"
        default:
          return "text-gray-600 bg-gray-50 border-gray-200"
      }
    }

    const getTrendIcon = (trend?: string) => {
      switch (trend) {
        case "up":
          return <TrendingUp className="h-3 w-3 text-green-600" />
        case "down":
          return <TrendingDown className="h-3 w-3 text-red-600" />
        default:
          return null
      }
    }

    const displayValue =
      typeof metric.value === "boolean"
        ? metric.value
          ? "YES"
          : "NO"
        : typeof metric.value === "number"
        ? metric.value.toFixed(metric.id === "logic-density" || metric.id === "avg-successors" ? 1 : 0)
        : metric.value

    return (
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          selectedMetric === metric.id && "ring-2 ring-primary",
          getStatusColor(metric.status)
        )}
        onClick={() => {
          setSelectedMetric(selectedMetric === metric.id ? null : metric.id)
          onMetricClick?.(metric.id)
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <metric.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{metric.label}</span>
            </div>
            {getTrendIcon(metric.trend)}
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">{displayValue}</div>

            {metric.unit && <div className="text-xs text-muted-foreground">{metric.unit}</div>}

            <Badge variant="outline" className={cn("text-xs", getStatusColor(metric.status))}>
              {metric.status.toUpperCase()}
            </Badge>

            {showDetails && <div className="text-xs text-muted-foreground pt-2 border-t">{metric.description}</div>}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Schedule Logic Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule quality metrics and logic relationship analysis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Switch checked={useMockData} onCheckedChange={setUseMockData} />
            <span className="text-sm">Mock Data</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={showDetails} onCheckedChange={setShowDetails} />
            <span className="text-sm">Show Details</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Overall Score Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Overall Schedule Logic Health</h3>
                <p className="text-sm text-muted-foreground">Based on {summaryStats.totalMetrics} quality metrics</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold">{summaryStats.overallScore.toFixed(0)}%</div>
                <Badge
                  variant="outline"
                  className={cn(
                    summaryStats.overallStatus === "good"
                      ? "text-green-600 bg-green-50 border-green-200"
                      : summaryStats.overallStatus === "warning"
                      ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                      : "text-red-600 bg-red-50 border-red-200"
                  )}
                >
                  {summaryStats.overallStatus.toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="mt-4">
              <Progress value={summaryStats.overallScore} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
              <div>
                <div className="text-green-600 font-bold">{summaryStats.goodMetrics}</div>
                <div className="text-muted-foreground">Good</div>
              </div>
              <div>
                <div className="text-yellow-600 font-bold">{summaryStats.warningMetrics}</div>
                <div className="text-muted-foreground">Warning</div>
              </div>
              <div>
                <div className="text-red-600 font-bold">{summaryStats.criticalMetrics}</div>
                <div className="text-muted-foreground">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {calculatedMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule Logic Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Activities</div>
                <div className="text-xl font-bold">{mockLogicData.totalActivities}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Total Logic Links</div>
                <div className="text-xl font-bold">{mockLogicData.totalLogicLinks}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">FS Relationships</div>
                <div className="text-xl font-bold">{mockLogicData.fsPercentage}%</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">SS/FF Relationships</div>
                <div className="text-xl font-bold">{mockLogicData.ssffPercentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Thresholds Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-3">Quality Thresholds</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium">Good Quality</span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <div>• Logic Density: 2.0-4.0 links/activity</div>
                <div>• Missing Ties: &lt;5% of activities</div>
                <div>• SS/FF Usage: 10-25%</div>
                <div>• No Logic Loops</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Needs Attention</span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <div>• Logic Density: 1.5-2.0 or 4.0-5.0</div>
                <div>• Missing Ties: 5-10% of activities</div>
                <div>• SS/FF Usage: 5-10% or 25-35%</div>
                <div>• 1-2 Logic Loops</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="font-medium">Critical Issues</span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <div>• Logic Density: &lt;1.5 or &gt;5.0</div>
                <div>• Missing Ties: &gt;10% of activities</div>
                <div>• SS/FF Usage: &lt;5% or &gt;35%</div>
                <div>• 3+ Logic Loops</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleLogicMetrics
