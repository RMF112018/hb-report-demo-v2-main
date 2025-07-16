/**
 * @fileoverview Quality Panel - Schedule Quality Analysis Content
 * @module QualityPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Quality panel containing activity structure summary, schedule quality metrics,
 * and quality analytics for the scheduler dashboard
 */

"use client"

import React, { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Note: ActivityStructureSummary component will be integrated when available

// Types
interface ScheduleMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  delta: string
  status: "good" | "warning" | "critical"
  description: string
}

interface QualityPanelProps {
  currentKPIs: ScheduleMetric[]
  pinnedKPIs: string[]
  onPinKPI: (kpiLabel: string) => void
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
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className={cn("relative", isPinned && "ring-2 ring-primary")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
          {onPin && (
            <Button variant="ghost" size="sm" onClick={onPin} className="h-6 w-6 p-0">
              📌
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{metric.value}</span>
            <div className="flex items-center gap-1">
              <span>{getTrendIcon(metric.trend)}</span>
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

// Activity Structure Summary Placeholder (fallback)
const ActivityStructureSummaryPlaceholder: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Activity Structure Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
        <div className="text-center space-y-2">
          <div className="text-4xl">🏗️</div>
          <p className="text-muted-foreground">Activity Structure Analysis</p>
          <p className="text-xs text-muted-foreground">Component integration coming soon</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

// Quality Metrics Grid
const QualityMetricsGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Schedule Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">A-</div>
            <p className="text-sm text-muted-foreground">Overall Grade</p>
          </div>
          <Progress value={85} className="h-2" />
          <div className="text-xs text-center text-muted-foreground">85/100</div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Logic Integrity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">92%</div>
            <p className="text-sm text-muted-foreground">Relationship Health</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Valid Links</span>
              <span className="font-medium">184/200</span>
            </div>
            <div className="flex justify-between">
              <span>Missing Links</span>
              <span className="font-medium text-red-600">16</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Activity Naming</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">78%</div>
            <p className="text-sm text-muted-foreground">Consistency Score</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Standard Format</span>
              <span className="font-medium">156/200</span>
            </div>
            <div className="flex justify-between">
              <span>Needs Review</span>
              <span className="font-medium text-yellow-600">44</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Resource Loading</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">89%</div>
            <p className="text-sm text-muted-foreground">Assignment Rate</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Assigned</span>
              <span className="font-medium">178/200</span>
            </div>
            <div className="flex justify-between">
              <span>Unassigned</span>
              <span className="font-medium text-orange-600">22</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const QualityPanel: React.FC<QualityPanelProps> = ({ currentKPIs, pinnedKPIs, onPinKPI }) => {
  return (
    <div className="space-y-6">
      {/* Quality KPI Grid */}
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

      {/* Quality Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Structure Summary */}
        <Suspense fallback={<ChartSkeleton />}>
          <div className="[&>div]:!border-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🏗️ Activity Structure Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityStructureSummaryPlaceholder />
              </CardContent>
            </Card>
          </div>
        </Suspense>

        {/* Schedule Health Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule Health Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">145</div>
                  <p className="text-sm text-muted-foreground">Healthy Activities</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">38</div>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Critical Path Length</span>
                  <span className="font-medium">23 activities</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Float Days</span>
                  <span className="font-medium">6 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Progress Method</span>
                  <Badge variant="secondary" className="text-xs">
                    Manual (68%)
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Quality Issues</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>🔗 Missing Predecessors</span>
                    <span className="font-medium text-red-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>📅 Date Constraints</span>
                    <span className="font-medium text-yellow-600">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>⏱️ Zero Duration</span>
                    <span className="font-medium text-orange-600">5</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Metrics Grid */}
      <QualityMetricsGrid />

      {/* Quality Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm font-medium">Fix missing predecessor relationships</span>
              </div>
              <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 text-xs">
                HIGH PRIORITY
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Standardize activity naming convention</span>
              </div>
              <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200 text-xs">
                MEDIUM PRIORITY
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium">Assign resources to unallocated activities</span>
              </div>
              <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 text-xs">
                PLANNING
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QualityPanel
