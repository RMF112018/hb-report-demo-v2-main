/**
 * @fileoverview Critical Path Timeline Component
 * @module CriticalPathTimeline
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * Timeline visualization tracking critical path changes across update cycles
 * with activity join/leave events and float value analysis.
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Switch } from "../../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Cell,
} from "recharts"
import {
  GitBranch,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Activity,
  AlertCircle,
  Target,
  Download,
  Settings,
  Eye,
  RefreshCw,
} from "lucide-react"
import { format, parseISO } from "date-fns"

// Types
interface UpdateCycle {
  updateId: string
  date: string
  criticalActivities: string[]
  averageFloat: number
  totalActivities: number
  criticalPathDuration: number
}

interface ActivityChange {
  activityId: string
  changeType: "joined" | "left" | "remained"
  previousStatus?: boolean
  currentStatus: boolean
}

interface PeriodDiff {
  updateId: string
  date: string
  previousUpdateId?: string
  changes: ActivityChange[]
  joinedActivities: string[]
  leftActivities: string[]
  remainedActivities: string[]
  changeCount: number
  floatDelta: number
  averageFloat: number
}

interface CriticalPathTimelineProps {
  showMockData?: boolean
  onActivityClick?: (activityId: string, updateId: string) => void
  onPeriodClick?: (updateId: string) => void
}

// Mock Data
const mockUpdateCycles: UpdateCycle[] = [
  {
    updateId: "U001",
    date: "2025-01-15",
    criticalActivities: ["A001", "A002", "A003", "A004"],
    averageFloat: 0,
    totalActivities: 25,
    criticalPathDuration: 120,
  },
  {
    updateId: "U002",
    date: "2025-02-01",
    criticalActivities: ["A001", "A002", "A003", "A005", "A006"],
    averageFloat: 2.3,
    totalActivities: 25,
    criticalPathDuration: 125,
  },
  {
    updateId: "U003",
    date: "2025-02-15",
    criticalActivities: ["A002", "A003", "A005", "A006", "A007"],
    averageFloat: 1.8,
    totalActivities: 25,
    criticalPathDuration: 128,
  },
  {
    updateId: "U004",
    date: "2025-03-01",
    criticalActivities: ["A003", "A005", "A006", "A007", "A008"],
    averageFloat: 3.1,
    totalActivities: 25,
    criticalPathDuration: 130,
  },
  {
    updateId: "U005",
    date: "2025-03-15",
    criticalActivities: ["A003", "A006", "A007", "A008", "A009"],
    averageFloat: 2.7,
    totalActivities: 25,
    criticalPathDuration: 135,
  },
  {
    updateId: "U006",
    date: "2025-04-01",
    criticalActivities: ["A006", "A007", "A008", "A009", "A010"],
    averageFloat: 4.2,
    totalActivities: 25,
    criticalPathDuration: 140,
  },
]

const activityNames: Record<string, string> = {
  A001: "Site Preparation",
  A002: "Foundation Excavation",
  A003: "Foundation Pour",
  A004: "Utility Installation",
  A005: "Structural Steel",
  A006: "MEP Rough-In",
  A007: "Interior Framing",
  A008: "Interior Finishes",
  A009: "Final Inspections",
  A010: "Project Closeout",
}

// Main Component
const CriticalPathTimeline: React.FC<CriticalPathTimelineProps> = ({
  showMockData = true,
  onActivityClick,
  onPeriodClick,
}) => {
  const [viewMode, setViewMode] = useState<"timeline" | "changes" | "float">("timeline")
  const [showChangesOnly, setShowChangesOnly] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const [highlightActivity, setHighlightActivity] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(showMockData)

  // Calculate period differences and changes
  const periodDiffs = useMemo(() => {
    const diffs: PeriodDiff[] = []

    for (let i = 0; i < mockUpdateCycles.length; i++) {
      const current = mockUpdateCycles[i]
      const previous = i > 0 ? mockUpdateCycles[i - 1] : null

      const changes: ActivityChange[] = []
      const joinedActivities: string[] = []
      const leftActivities: string[] = []
      const remainedActivities: string[] = []

      if (previous) {
        // Find activities that joined
        current.criticalActivities.forEach((activityId) => {
          if (!previous.criticalActivities.includes(activityId)) {
            joinedActivities.push(activityId)
            changes.push({
              activityId,
              changeType: "joined",
              previousStatus: false,
              currentStatus: true,
            })
          } else {
            remainedActivities.push(activityId)
            changes.push({
              activityId,
              changeType: "remained",
              previousStatus: true,
              currentStatus: true,
            })
          }
        })

        // Find activities that left
        previous.criticalActivities.forEach((activityId) => {
          if (!current.criticalActivities.includes(activityId)) {
            leftActivities.push(activityId)
            changes.push({
              activityId,
              changeType: "left",
              previousStatus: true,
              currentStatus: false,
            })
          }
        })
      } else {
        // First period - all activities are "joined"
        current.criticalActivities.forEach((activityId) => {
          remainedActivities.push(activityId)
          changes.push({
            activityId,
            changeType: "remained",
            currentStatus: true,
          })
        })
      }

      const floatDelta = previous ? current.averageFloat - previous.averageFloat : 0

      diffs.push({
        updateId: current.updateId,
        date: current.date,
        previousUpdateId: previous?.updateId,
        changes,
        joinedActivities,
        leftActivities,
        remainedActivities,
        changeCount: joinedActivities.length + leftActivities.length,
        floatDelta,
        averageFloat: current.averageFloat,
      })
    }

    return diffs
  }, [])

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalChanges = periodDiffs.reduce((sum, period) => sum + period.changeCount, 0)
    const pathChangePeriods = periodDiffs.filter((period) => period.changeCount > 0).length
    const maxChangesInPeriod = Math.max(...periodDiffs.map((period) => period.changeCount))
    const avgFloatChange =
      periodDiffs.reduce((sum, period) => sum + Math.abs(period.floatDelta), 0) / periodDiffs.length

    // Activity frequency analysis
    const activityFrequency: Record<string, number> = {}
    periodDiffs.forEach((period) => {
      period.remainedActivities.concat(period.joinedActivities).forEach((activityId) => {
        activityFrequency[activityId] = (activityFrequency[activityId] || 0) + 1
      })
    })

    const mostFrequentActivity = Object.entries(activityFrequency).sort(([, a], [, b]) => b - a)[0]

    return {
      totalChanges,
      pathChangePeriods,
      maxChangesInPeriod,
      avgFloatChange,
      mostFrequentActivity: mostFrequentActivity
        ? {
            id: mostFrequentActivity[0],
            frequency: mostFrequentActivity[1],
          }
        : null,
    }
  }, [periodDiffs])

  // Activity timeline data for visualization
  const activityTimelineData = useMemo(() => {
    const allActivities = Array.from(
      new Set(periodDiffs.flatMap((period) => period.remainedActivities.concat(period.joinedActivities)))
    )

    return allActivities.map((activityId) => {
      const timeline = periodDiffs.map((period) => ({
        updateId: period.updateId,
        date: period.date,
        isOnPath: period.remainedActivities.includes(activityId) || period.joinedActivities.includes(activityId),
        changeType: period.changes.find((change) => change.activityId === activityId)?.changeType || null,
      }))

      const totalPeriods = timeline.filter((t) => t.isOnPath).length
      const joinLeaveCount = timeline.filter((t) => t.changeType === "joined" || t.changeType === "left").length

      return {
        activityId,
        name: activityNames[activityId] || activityId,
        timeline,
        totalPeriods,
        joinLeaveCount,
        stability: totalPeriods / periodDiffs.length,
      }
    })
  }, [periodDiffs])

  // Render timeline visualization
  const renderTimelineView = () => (
    <div className="space-y-6">
      {/* Period Overview */}
      <div className="grid grid-cols-6 gap-2">
        {periodDiffs.map((period, index) => (
          <Card
            key={period.updateId}
            className={cn(
              "cursor-pointer transition-all",
              selectedPeriod === period.updateId && "ring-2 ring-primary",
              period.changeCount > 0 && "border-orange-200 bg-orange-50"
            )}
            onClick={() => setSelectedPeriod(selectedPeriod === period.updateId ? null : period.updateId)}
          >
            <CardContent className="p-3">
              <div className="text-xs font-medium">{period.updateId}</div>
              <div className="text-xs text-muted-foreground mb-2">{format(parseISO(period.date), "MMM dd")}</div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span className="text-xs">{period.remainedActivities.length + period.joinedActivities.length}</span>
                </div>

                {period.changeCount > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600">{period.changeCount} changes</span>
                  </div>
                )}

                <div className="text-xs">
                  Float: {period.averageFloat.toFixed(1)}d
                  {period.floatDelta !== 0 && (
                    <span className={cn("ml-1", period.floatDelta > 0 ? "text-red-600" : "text-green-600")}>
                      ({period.floatDelta > 0 ? "+" : ""}
                      {period.floatDelta.toFixed(1)})
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Timeline Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Path Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activityTimelineData
              .filter((activity) => !showChangesOnly || activity.joinLeaveCount > 0)
              .sort((a, b) => b.stability - a.stability)
              .map((activity) => (
                <div
                  key={activity.activityId}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-colors",
                    highlightActivity === activity.activityId && "bg-blue-50 border border-blue-200"
                  )}
                  onMouseEnter={() => setHighlightActivity(activity.activityId)}
                  onMouseLeave={() => setHighlightActivity(null)}
                >
                  <div className="w-32 text-sm font-medium truncate">{activity.name}</div>

                  <div className="flex items-center gap-1 flex-1">
                    {activity.timeline.map((period, index) => (
                      <div
                        key={period.updateId}
                        className={cn(
                          "w-12 h-8 rounded flex items-center justify-center text-xs font-medium transition-all",
                          period.isOnPath
                            ? period.changeType === "joined"
                              ? "bg-green-500 text-white" // Joined
                              : period.changeType === "left"
                              ? "bg-red-500 text-white" // Left (shouldn't happen if isOnPath is true)
                              : "bg-blue-500 text-white" // Remained
                            : "bg-gray-100 text-gray-400" // Not on path
                        )}
                        title={`${period.updateId}: ${period.isOnPath ? "On Critical Path" : "Not on Path"} ${
                          period.changeType ? `(${period.changeType})` : ""
                        }`}
                      >
                        {period.changeType === "joined" && <Plus className="h-3 w-3" />}
                        {period.changeType === "left" && <Minus className="h-3 w-3" />}
                        {period.changeType === "remained" && period.isOnPath && <GitBranch className="h-3 w-3" />}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {activity.totalPeriods}/{periodDiffs.length}
                    </span>
                    <Badge
                      variant={
                        activity.stability >= 0.8 ? "default" : activity.stability >= 0.5 ? "secondary" : "outline"
                      }
                    >
                      {Math.round(activity.stability * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render changes summary
  const renderChangesView = () => (
    <div className="space-y-6">
      {periodDiffs
        .filter((period) => period.changeCount > 0)
        .map((period) => (
          <Card key={period.updateId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {period.updateId} - {format(parseISO(period.date), "MMM dd, yyyy")}
                </CardTitle>
                <Badge variant="outline">{period.changeCount} changes</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Joined Activities */}
                {period.joinedActivities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Plus className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Joined Critical Path</span>
                    </div>
                    <div className="space-y-2">
                      {period.joinedActivities.map((activityId) => (
                        <div key={activityId} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {activityId}
                          </Badge>
                          <span className="text-sm">{activityNames[activityId] || activityId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Left Activities */}
                {period.leftActivities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Minus className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Left Critical Path</span>
                    </div>
                    <div className="space-y-2">
                      {period.leftActivities.map((activityId) => (
                        <div key={activityId} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <Badge variant="outline" className="text-red-700 border-red-300">
                            {activityId}
                          </Badge>
                          <span className="text-sm">{activityNames[activityId] || activityId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Float Change */}
              {period.floatDelta !== 0 && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2">
                    {period.floatDelta > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    )}
                    <span className="font-medium">Float Change: </span>
                    <span className={cn("font-bold", period.floatDelta > 0 ? "text-red-600" : "text-green-600")}>
                      {period.floatDelta > 0 ? "+" : ""}
                      {period.floatDelta.toFixed(1)} days
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  )

  // Render float analysis
  const renderFloatView = () => {
    const floatData = periodDiffs.map((period) => ({
      updateId: period.updateId,
      date: format(parseISO(period.date), "MMM dd"),
      averageFloat: period.averageFloat,
      floatDelta: period.floatDelta,
      changeCount: period.changeCount,
    }))

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Float Analysis Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={floatData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: "Float (Days)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <div className="font-medium">{label}</div>
                          <div className="text-sm">
                            <div>Average Float: {data.averageFloat.toFixed(1)} days</div>
                            <div>
                              Float Change: {data.floatDelta > 0 ? "+" : ""}
                              {data.floatDelta.toFixed(1)} days
                            </div>
                            <div>Path Changes: {data.changeCount}</div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averageFloat"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Average Float"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                />
                <ReferenceLine y={0} stroke="#000" strokeDasharray="2,2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Critical Path Evolution
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track critical path changes and activity transitions across update cycles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timeline">Timeline View</SelectItem>
                <SelectItem value="changes">Changes Summary</SelectItem>
                <SelectItem value="float">Float Analysis</SelectItem>
              </SelectContent>
            </Select>

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

          {viewMode === "timeline" && (
            <div className="flex items-center gap-2">
              <Switch checked={showChangesOnly} onCheckedChange={setShowChangesOnly} />
              <span className="text-sm">Changes Only</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Path Changes</div>
            <div className="text-xl font-bold text-orange-600">{summaryStats.totalChanges}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Periods with Changes</div>
            <div className="text-xl font-bold text-blue-600">{summaryStats.pathChangePeriods}/6</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Max Changes/Period</div>
            <div className="text-xl font-bold text-red-600">{summaryStats.maxChangesInPeriod}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Most Frequent Activity</div>
            <div className="text-sm font-bold text-purple-600">
              {summaryStats.mostFrequentActivity ? (
                <span>
                  {summaryStats.mostFrequentActivity.id} ({summaryStats.mostFrequentActivity.frequency}x)
                </span>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {viewMode === "timeline" && renderTimelineView()}
        {viewMode === "changes" && renderChangesView()}
        {viewMode === "float" && renderFloatView()}

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-2">Legend</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <Plus className="h-3 w-3 text-white" />
              </div>
              <span>Joined Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                <Minus className="h-3 w-3 text-white" />
              </div>
              <span>Left Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <GitBranch className="h-3 w-3 text-white" />
              </div>
              <span>Remained on Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded"></div>
              <span>Not on Path</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CriticalPathTimeline
