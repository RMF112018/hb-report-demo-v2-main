/**
 * @fileoverview Overview Panel - Schedule Overview Dashboard Content
 * @module OverviewPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Overview panel containing schedule monitor, KPI grid, and AI insights
 * for the scheduler overview dashboard
 */

"use client"

import React, { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Lazy imports for performance
const MilestoneTrends = lazy(() => import("@/components/scheduler/overview/MilestoneTrends"))

// Types
interface ScheduleMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  delta: string
  status: "good" | "warning" | "critical"
  description: string
}

interface AIInsight {
  id: string
  type: "risk" | "optimization" | "quality" | "performance"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  recommendation: string
  confidence: number
  timestamp: Date
  linkedActivities: string[]
}

interface OverviewPanelProps {
  currentKPIs: ScheduleMetric[]
  pinnedKPIs: string[]
  showAIInsights: boolean
  onToggleAIInsights: (show: boolean) => void
  onPinKPI: (kpiLabel: string) => void
  filteredInsights: AIInsight[]
}

// KPI Card Component
const KPICard: React.FC<{
  metric: ScheduleMetric
  isPinned?: boolean
  onPin?: () => void
}> = ({ metric, isPinned = false, onPin }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-700 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        "bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50",
        "border border-gray-200/60 dark:border-gray-700/60 shadow-sm",
        isPinned && "ring-2 ring-primary/60 shadow-md"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{metric.label}</CardTitle>
          {onPin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPin}
              className="h-6 w-6 p-0 hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
            >
              <span className={cn("text-sm", isPinned ? "text-primary" : "text-gray-400")}>📌</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metric.value}</span>
            <div className="flex items-center gap-1">
              <span className={cn("text-lg", getTrendColor(metric.trend))}>{getTrendIcon(metric.trend)}</span>
              <span className={cn("text-sm font-medium", getTrendColor(metric.trend))}>{metric.delta}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium border shadow-sm", getStatusColor(metric.status))}
          >
            {metric.status.toUpperCase()}
          </Badge>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{metric.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// AI Insight Card Component
const AIInsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "risk":
        return "⚠️"
      case "optimization":
        return "⚡"
      case "quality":
        return "✅"
      case "performance":
        return "📈"
      default:
        return "🧠"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-800 border-red-300 shadow-sm"
      case "medium":
        return "bg-yellow-50 text-yellow-800 border-yellow-300 shadow-sm"
      case "low":
        return "bg-green-50 text-green-800 border-green-300 shadow-sm"
      default:
        return "bg-gray-50 text-gray-800 border-gray-300 shadow-sm"
    }
  }

  const getTypeGradient = (type: string) => {
    switch (type) {
      case "risk":
        return "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
      case "optimization":
        return "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
      case "quality":
        return "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
      case "performance":
        return "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"
      default:
        return "from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20"
    }
  }

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        "bg-gradient-to-br",
        getTypeGradient(insight.type),
        "border border-gray-200/60 dark:border-gray-700/60 shadow-sm"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm">
              <span className="text-base">{getTypeIcon(insight.type)}</span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                {insight.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className={cn("text-xs font-medium", getPriorityColor(insight.priority))}>
                  {insight.priority.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{insight.description}</p>

          {isExpanded && (
            <div className="space-y-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Impact
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight.impact}</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Recommendation
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight.recommendation}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Linked Activities
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {insight.linkedActivities.map((activity) => (
                    <Badge
                      key={activity}
                      variant="secondary"
                      className="text-xs font-medium bg-white/80 dark:bg-gray-800/80 shadow-sm"
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
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

const OverviewPanel: React.FC<OverviewPanelProps> = ({
  currentKPIs,
  pinnedKPIs,
  showAIInsights,
  onToggleAIInsights,
  onPinKPI,
  filteredInsights,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Schedule Monitor - Using MilestoneTrends component */}
        <Suspense fallback={<ChartSkeleton />}>
          <MilestoneTrends />
        </Suspense>

        {/* KPI Grid */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Key Performance Indicators</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time schedule performance metrics and trends
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentKPIs.map((kpi) => (
              <KPICard
                key={kpi.label}
                metric={kpi}
                isPinned={pinnedKPIs.includes(kpi.label)}
                onPin={() => onPinKPI(kpi.label)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Sidebar */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border border-blue-200/60 dark:border-blue-700/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-sm">
                <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HBI Insights</h3>
            </div>
            <Switch
              checked={showAIInsights}
              onCheckedChange={onToggleAIInsights}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered schedule analysis and recommendations</p>
        </div>

        {showAIInsights && (
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}

        {!showAIInsights && (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Enable insights to view AI recommendations</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewPanel
