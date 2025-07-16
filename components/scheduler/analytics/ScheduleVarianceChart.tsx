/**
 * @fileoverview Schedule Variance Chart Component
 * @module ScheduleVarianceChart
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * Dual-axis line chart comparing baseline vs current start/finish dates
 * for key activities with milestone slippage analysis and variance tracking.
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ComposedChart,
  Bar,
  Area,
  AreaChart,
} from "recharts"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Eye,
  EyeOff,
  Target,
} from "lucide-react"
import { format, differenceInDays, parseISO, addDays } from "date-fns"

// Types
interface ActivityData {
  activityName: string
  activityId: string
  baselineStart: string
  baselineFinish: string
  actualStart: string
  actualFinish: string
  isMilestone: boolean
  criticalPath: boolean
  progress: number
}

interface MilestoneSlippage {
  milestone: string
  originalDate: string
  currentDate: string
  slippageDays: number
  impact: "low" | "medium" | "high"
}

interface ChartDataPoint {
  activityName: string
  activityId: string
  baselineStartDays: number
  baselineFinishDays: number
  actualStartDays: number
  actualFinishDays: number
  startVariance: number
  finishVariance: number
  isMilestone: boolean
  criticalPath: boolean
  progress: number
  hasSignificantDelay: boolean
}

interface ScheduleVarianceChartProps {
  projectStartDate?: string
  showMockData?: boolean
  onActivityClick?: (activity: ActivityData) => void
}

// Mock Data
const mockActivityData: ActivityData[] = [
  {
    activityName: "Site Preparation",
    activityId: "A001",
    baselineStart: "2025-01-15",
    baselineFinish: "2025-01-30",
    actualStart: "2025-01-15",
    actualFinish: "2025-02-05",
    isMilestone: false,
    criticalPath: true,
    progress: 100,
  },
  {
    activityName: "Foundation Excavation",
    activityId: "A002",
    baselineStart: "2025-02-01",
    baselineFinish: "2025-02-15",
    actualStart: "2025-02-06",
    actualFinish: "2025-02-22",
    isMilestone: false,
    criticalPath: true,
    progress: 100,
  },
  {
    activityName: "Foundation Pour",
    activityId: "A003",
    baselineStart: "2025-02-16",
    baselineFinish: "2025-03-01",
    actualStart: "2025-02-23",
    actualFinish: "2025-03-10",
    isMilestone: true,
    criticalPath: true,
    progress: 100,
  },
  {
    activityName: "Structural Steel",
    activityId: "A004",
    baselineStart: "2025-03-02",
    baselineFinish: "2025-03-20",
    actualStart: "2025-03-11",
    actualFinish: "2025-04-02",
    isMilestone: false,
    criticalPath: true,
    progress: 90,
  },
  {
    activityName: "Roofing Installation",
    activityId: "A005",
    baselineStart: "2025-03-21",
    baselineFinish: "2025-04-05",
    actualStart: "2025-04-03",
    actualFinish: "2025-04-20",
    isMilestone: false,
    criticalPath: false,
    progress: 75,
  },
  {
    activityName: "MEP Rough-In",
    activityId: "A006",
    baselineStart: "2025-04-06",
    baselineFinish: "2025-04-25",
    actualStart: "2025-04-21",
    actualFinish: "2025-05-15",
    isMilestone: true,
    criticalPath: true,
    progress: 60,
  },
  {
    activityName: "Interior Finishes",
    activityId: "A007",
    baselineStart: "2025-04-26",
    baselineFinish: "2025-05-20",
    actualStart: "2025-05-16",
    actualFinish: "2025-06-10",
    isMilestone: false,
    criticalPath: false,
    progress: 30,
  },
  {
    activityName: "Final Completion",
    activityId: "A008",
    baselineStart: "2025-05-21",
    baselineFinish: "2025-06-05",
    actualStart: "2025-06-11",
    actualFinish: "2025-06-30",
    isMilestone: true,
    criticalPath: true,
    progress: 0,
  },
]

const mockMilestoneSlippage: MilestoneSlippage[] = [
  {
    milestone: "Foundation Complete",
    originalDate: "2025-03-01",
    currentDate: "2025-03-10",
    slippageDays: 9,
    impact: "high",
  },
  {
    milestone: "MEP Rough-In Complete",
    originalDate: "2025-04-25",
    currentDate: "2025-05-15",
    slippageDays: 20,
    impact: "high",
  },
  {
    milestone: "Final Completion",
    originalDate: "2025-06-05",
    currentDate: "2025-06-30",
    slippageDays: 25,
    impact: "high",
  },
]

// Main Component
const ScheduleVarianceChart: React.FC<ScheduleVarianceChartProps> = ({
  projectStartDate = "2025-01-15",
  showMockData = true,
  onActivityClick,
}) => {
  const [viewMode, setViewMode] = useState<"variance" | "timeline" | "slippage">("variance")
  const [showBaseline, setShowBaseline] = useState(true)
  const [showActual, setShowActual] = useState(true)
  const [showCriticalPath, setShowCriticalPath] = useState(true)
  const [showMilestones, setShowMilestones] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [useMockData, setUseMockData] = useState(showMockData)

  // Process chart data
  const chartData = useMemo(() => {
    const startDate = parseISO(projectStartDate)

    return mockActivityData.map((activity): ChartDataPoint => {
      const baselineStartDays = differenceInDays(parseISO(activity.baselineStart), startDate)
      const baselineFinishDays = differenceInDays(parseISO(activity.baselineFinish), startDate)
      const actualStartDays = differenceInDays(parseISO(activity.actualStart), startDate)
      const actualFinishDays = differenceInDays(parseISO(activity.actualFinish), startDate)

      const startVariance = actualStartDays - baselineStartDays
      const finishVariance = actualFinishDays - baselineFinishDays
      const hasSignificantDelay = Math.abs(startVariance) > 5 || Math.abs(finishVariance) > 5

      return {
        activityName: activity.activityName,
        activityId: activity.activityId,
        baselineStartDays,
        baselineFinishDays,
        actualStartDays,
        actualFinishDays,
        startVariance,
        finishVariance,
        isMilestone: activity.isMilestone,
        criticalPath: activity.criticalPath,
        progress: activity.progress,
        hasSignificantDelay,
      }
    })
  }, [projectStartDate])

  // Slippage data for trend analysis
  const slippageData = useMemo(() => {
    return mockMilestoneSlippage.map((milestone, index) => ({
      milestone: milestone.milestone,
      slippageDays: milestone.slippageDays,
      cumulativeSlippage: mockMilestoneSlippage.slice(0, index + 1).reduce((sum, m) => sum + m.slippageDays, 0),
      impact: milestone.impact,
      originalDate: milestone.originalDate,
      currentDate: milestone.currentDate,
    }))
  }, [])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium text-sm mb-2">{label}</div>
          <div className="space-y-1 text-xs">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>
                  {entry.name}: {entry.value} days
                </span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Start Variance:</span>
                <Badge
                  variant={data.startVariance > 5 ? "destructive" : data.startVariance > 0 ? "secondary" : "default"}
                >
                  {data.startVariance > 0 ? "+" : ""}
                  {data.startVariance} days
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground">Finish Variance:</span>
                <Badge
                  variant={data.finishVariance > 5 ? "destructive" : data.finishVariance > 0 ? "secondary" : "default"}
                >
                  {data.finishVariance > 0 ? "+" : ""}
                  {data.finishVariance} days
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Render variance chart
  const renderVarianceChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis dataKey="activityName" angle={-45} textAnchor="end" height={100} interval={0} fontSize={10} />

        <YAxis yAxisId="left" label={{ value: "Project Days", angle: -90, position: "insideLeft" }} fontSize={12} />

        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Variance (Days)", angle: 90, position: "insideRight" }}
          fontSize={12}
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {/* Baseline Lines */}
        {showBaseline && (
          <>
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="baselineStartDays"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5,5"
              name="Baseline Start"
              dot={{ fill: "#94a3b8", strokeWidth: 2, r: 4 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="baselineFinishDays"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="5,5"
              name="Baseline Finish"
              dot={{ fill: "#64748b", strokeWidth: 2, r: 4 }}
            />
          </>
        )}

        {/* Actual Lines */}
        {showActual && (
          <>
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="actualStartDays"
              stroke="#3b82f6"
              strokeWidth={3}
              name="Actual Start"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="actualFinishDays"
              stroke="#1d4ed8"
              strokeWidth={3}
              name="Actual Finish"
              dot={{ fill: "#1d4ed8", strokeWidth: 2, r: 5 }}
            />
          </>
        )}

        {/* Variance Bars */}
        <Bar yAxisId="right" dataKey="finishVariance" fill="#ef4444" fillOpacity={0.6} name="Finish Variance" />

        {/* Reference line at zero variance */}
        <ReferenceLine yAxisId="right" y={0} stroke="#000" strokeDasharray="2,2" />

        {/* Annotations for significant delays */}
        {showAnnotations &&
          chartData
            .filter((d) => d.hasSignificantDelay)
            .map((data, index) => (
              <ReferenceLine key={index} x={data.activityName} stroke="#ef4444" strokeWidth={2} strokeDasharray="3,3" />
            ))}
      </ComposedChart>
    </ResponsiveContainer>
  )

  // Render slippage trend chart
  const renderSlippageChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={slippageData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis dataKey="milestone" angle={-45} textAnchor="end" height={100} interval={0} fontSize={10} />

        <YAxis label={{ value: "Slippage Days", angle: -90, position: "insideLeft" }} fontSize={12} />

        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                  <div className="font-medium text-sm mb-2">{label}</div>
                  <div className="space-y-1 text-xs">
                    <div>Individual Slippage: {data.slippageDays} days</div>
                    <div>Cumulative Slippage: {data.cumulativeSlippage} days</div>
                    <div>
                      Impact:{" "}
                      <Badge variant={data.impact === "high" ? "destructive" : "secondary"}>{data.impact}</Badge>
                    </div>
                    <div className="pt-1 text-muted-foreground">
                      Original: {format(parseISO(data.originalDate), "MMM dd")} to Current:{" "}
                      {format(parseISO(data.currentDate), "MMM dd")}
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />

        <Area
          type="monotone"
          dataKey="slippageDays"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.3}
          name="Milestone Slippage"
        />

        <Line
          type="monotone"
          dataKey="cumulativeSlippage"
          stroke="#dc2626"
          strokeWidth={3}
          name="Cumulative Slippage"
          dot={{ fill: "#dc2626", strokeWidth: 2, r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Schedule Variance Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {viewMode === "variance"
                ? "Baseline vs actual timeline comparison with variance tracking"
                : viewMode === "slippage"
                ? "Milestone slippage trend analysis"
                : "Project timeline overview"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variance">Schedule Variance</SelectItem>
                <SelectItem value="slippage">Milestone Slippage</SelectItem>
                <SelectItem value="timeline">Timeline View</SelectItem>
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

          {viewMode === "variance" && (
            <>
              <div className="flex items-center gap-2">
                <Switch checked={showBaseline} onCheckedChange={setShowBaseline} />
                <span className="text-sm">Baseline</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={showActual} onCheckedChange={setShowActual} />
                <span className="text-sm">Actual</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={showAnnotations} onCheckedChange={setShowAnnotations} />
                <span className="text-sm">Annotations</span>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Activities Delayed</div>
            <div className="text-xl font-bold text-red-600">{chartData.filter((d) => d.finishVariance > 0).length}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Significant Delays</div>
            <div className="text-xl font-bold text-red-700">
              {chartData.filter((d) => d.hasSignificantDelay).length}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Avg Variance</div>
            <div className="text-xl font-bold text-yellow-600">
              {Math.round(chartData.reduce((sum, d) => sum + d.finishVariance, 0) / chartData.length)} days
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Critical Path Impact</div>
            <div className="text-xl font-bold text-purple-600">
              {chartData.filter((d) => d.criticalPath && d.finishVariance > 0).length}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          {viewMode === "variance" && renderVarianceChart()}
          {viewMode === "slippage" && renderSlippageChart()}
          {viewMode === "timeline" && (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Timeline view coming soon</div>
          )}
        </div>

        {/* Legend for significant delays */}
        {showAnnotations && viewMode === "variance" && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Significant Delays ({">"} 5 days)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {chartData
                .filter((d) => d.hasSignificantDelay)
                .map((activity) => (
                  <div key={activity.activityId} className="text-red-700">
                    {activity.activityName}: +{activity.finishVariance} days
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ScheduleVarianceChart
