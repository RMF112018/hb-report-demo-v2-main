/**
 * @fileoverview Schedule Sensitivity Analysis Chart
 * @module ScheduleSensitivity
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays activity-level schedule sensitivity with DPI analysis and float impact visualization
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell,
  ComposedChart,
  Line,
} from "recharts"
import {
  TrendingDown,
  AlertTriangle,
  Download,
  Settings,
  RefreshCw,
  MoreVertical,
  Activity,
  Clock,
  Target,
  BarChart3,
  Layers,
  GitBranch,
} from "lucide-react"

// Types
interface SensitivityActivity {
  activityId: string
  activityName: string
  dpi: number // Duration Performance Index (0.6-1.0)
  totalFloat: number
  freeFloat: number
  plannedDuration: number
  actualDuration: number
  remainingDuration: number
  criticalPath: boolean
  sensitivity: "high" | "medium" | "low"
  impact: "critical" | "major" | "moderate" | "minor"
  riskLevel: number
}

interface ScheduleSensitivityProps {
  className?: string
  showControls?: boolean
  height?: number
  chartType?: "stacked" | "waterfall"
}

// Mock sensitivity data - 10 activities with DPI 0.6-1.0
const mockSensitivityData: SensitivityActivity[] = [
  {
    activityId: "A007",
    activityName: "Foundation Pour",
    dpi: 0.65,
    totalFloat: 2,
    freeFloat: 0,
    plannedDuration: 10,
    actualDuration: 15,
    remainingDuration: 5,
    criticalPath: true,
    sensitivity: "high",
    impact: "critical",
    riskLevel: 95,
  },
  {
    activityId: "A012",
    activityName: "Steel Erection",
    dpi: 0.72,
    totalFloat: 4,
    freeFloat: 1,
    plannedDuration: 14,
    actualDuration: 18,
    remainingDuration: 6,
    criticalPath: true,
    sensitivity: "high",
    impact: "major",
    riskLevel: 88,
  },
  {
    activityId: "A023",
    activityName: "MEP Rough-In",
    dpi: 0.78,
    totalFloat: 8,
    freeFloat: 3,
    plannedDuration: 12,
    actualDuration: 14,
    remainingDuration: 4,
    criticalPath: false,
    sensitivity: "medium",
    impact: "major",
    riskLevel: 75,
  },
  {
    activityId: "A015",
    activityName: "Concrete Slab",
    dpi: 0.82,
    totalFloat: 6,
    freeFloat: 2,
    plannedDuration: 8,
    actualDuration: 9,
    remainingDuration: 3,
    criticalPath: false,
    sensitivity: "medium",
    impact: "moderate",
    riskLevel: 68,
  },
  {
    activityId: "A019",
    activityName: "Drywall Installation",
    dpi: 0.85,
    totalFloat: 12,
    freeFloat: 5,
    plannedDuration: 16,
    actualDuration: 18,
    remainingDuration: 6,
    criticalPath: false,
    sensitivity: "medium",
    impact: "moderate",
    riskLevel: 62,
  },
  {
    activityId: "A028",
    activityName: "Flooring Installation",
    dpi: 0.88,
    totalFloat: 15,
    freeFloat: 8,
    plannedDuration: 10,
    actualDuration: 11,
    remainingDuration: 3,
    criticalPath: false,
    sensitivity: "low",
    impact: "moderate",
    riskLevel: 55,
  },
  {
    activityId: "A031",
    activityName: "Paint & Finishes",
    dpi: 0.91,
    totalFloat: 18,
    freeFloat: 12,
    plannedDuration: 14,
    actualDuration: 15,
    remainingDuration: 4,
    criticalPath: false,
    sensitivity: "low",
    impact: "minor",
    riskLevel: 48,
  },
  {
    activityId: "A034",
    activityName: "Exterior Cladding",
    dpi: 0.93,
    totalFloat: 20,
    freeFloat: 15,
    plannedDuration: 12,
    actualDuration: 13,
    remainingDuration: 3,
    criticalPath: false,
    sensitivity: "low",
    impact: "minor",
    riskLevel: 42,
  },
  {
    activityId: "A037",
    activityName: "Landscaping",
    dpi: 0.96,
    totalFloat: 25,
    freeFloat: 20,
    plannedDuration: 8,
    actualDuration: 8,
    remainingDuration: 2,
    criticalPath: false,
    sensitivity: "low",
    impact: "minor",
    riskLevel: 35,
  },
  {
    activityId: "A040",
    activityName: "Final Inspections",
    dpi: 0.98,
    totalFloat: 30,
    freeFloat: 25,
    plannedDuration: 5,
    actualDuration: 5,
    remainingDuration: 1,
    criticalPath: false,
    sensitivity: "low",
    impact: "minor",
    riskLevel: 28,
  },
]

// Components
const ActivityMetrics: React.FC<{ data: SensitivityActivity[] }> = ({ data }) => {
  const criticalCount = data.filter((a) => a.criticalPath).length
  const highSensitivityCount = data.filter((a) => a.sensitivity === "high").length
  const avgDPI = (data.reduce((sum, a) => sum + a.dpi, 0) / data.length).toFixed(2)
  const avgFloat = (data.reduce((sum, a) => sum + a.totalFloat, 0) / data.length).toFixed(1)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Average DPI</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{avgDPI}</div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Schedule Performance
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Critical Path</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          High Impact Activities
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">High Sensitivity</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{highSensitivityCount}</div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          Risk Activities
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Average Float</span>
        </div>
        <div className="text-2xl font-bold text-purple-600">{avgFloat} days</div>
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
          Schedule Buffer
        </Badge>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SensitivityActivity

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-64">
        <div className="font-medium mb-2">{data.activityName}</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span>Activity ID:</span>
            <span className="font-medium">{data.activityId}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>DPI:</span>
            <span className={cn("font-medium", data.dpi < 0.8 ? "text-red-600" : "text-blue-600")}>
              {data.dpi.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Total Float:</span>
            <span className="font-medium">{data.totalFloat} days</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Free Float:</span>
            <span className="font-medium">{data.freeFloat} days</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Sensitivity:</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                data.sensitivity === "high"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : data.sensitivity === "medium"
                  ? "bg-orange-50 text-orange-700 border-orange-200"
                  : "bg-green-50 text-green-700 border-green-200"
              )}
            >
              {data.sensitivity.toUpperCase()}
            </Badge>
          </div>
          <div className="flex justify-between gap-4">
            <span>Risk Level:</span>
            <span className={cn("font-medium", data.riskLevel > 80 ? "text-red-600" : "text-orange-600")}>
              {data.riskLevel}%
            </span>
          </div>
          {data.criticalPath && (
            <div className="pt-2 mt-2 border-t text-xs text-red-600 font-medium">⚠️ Critical Path Activity</div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const getBarColor = (activity: SensitivityActivity) => {
  if (activity.criticalPath) return "#ef4444"
  if (activity.sensitivity === "high") return "#f59e0b"
  if (activity.sensitivity === "medium") return "#3b82f6"
  return "#10b981"
}

const ScheduleSensitivity: React.FC<ScheduleSensitivityProps> = ({
  className,
  showControls = true,
  height = 500,
  chartType: initialChartType = "stacked",
}) => {
  const [useMockData, setUseMockData] = useState(true)
  const [showFloat, setShowFloat] = useState(true)
  const [chartType, setChartType] = useState<"stacked" | "waterfall">(initialChartType)
  const [sortBy, setSortBy] = useState<"dpi" | "float" | "risk">("dpi")

  const chartData = useMockData ? mockSensitivityData : []

  // Sort data based on selection
  const sortedData = [...chartData].sort((a, b) => {
    switch (sortBy) {
      case "dpi":
        return a.dpi - b.dpi
      case "float":
        return a.totalFloat - b.totalFloat
      case "risk":
        return b.riskLevel - a.riskLevel
      default:
        return 0
    }
  })

  const renderStackedBarChart = () => (
    <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

      <XAxis
        dataKey="activityId"
        angle={-45}
        textAnchor="end"
        height={80}
        interval={0}
        fontSize={10}
        tick={{ fill: "#666" }}
      />

      <YAxis
        label={{ value: "Performance Index / Float Days", angle: -90, position: "insideLeft" }}
        fontSize={12}
        tick={{ fill: "#666" }}
      />

      <Tooltip content={<CustomTooltip />} />

      <Legend />

      {/* DPI bars */}
      <Bar dataKey="dpi" name="DPI" radius={[2, 2, 0, 0]}>
        {sortedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
        ))}
      </Bar>

      {/* Float overlay if enabled */}
      {showFloat && (
        <Bar dataKey="totalFloat" name="Total Float (days)" fill="#8b5cf6" fillOpacity={0.3} radius={[2, 2, 0, 0]} />
      )}

      {/* Reference lines */}
      <ReferenceLine y={0.8} stroke="#f59e0b" strokeDasharray="2,2" />
      <ReferenceLine y={1.0} stroke="#10b981" strokeDasharray="2,2" />
    </BarChart>
  )

  const renderWaterfallChart = () => (
    <ComposedChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

      <XAxis
        dataKey="activityId"
        angle={-45}
        textAnchor="end"
        height={80}
        interval={0}
        fontSize={10}
        tick={{ fill: "#666" }}
      />

      <YAxis
        yAxisId="left"
        label={{ value: "DPI", angle: -90, position: "insideLeft" }}
        fontSize={12}
        tick={{ fill: "#666" }}
        domain={[0.5, 1.0]}
      />

      <YAxis
        yAxisId="right"
        orientation="right"
        label={{ value: "Float (Days)", angle: 90, position: "insideRight" }}
        fontSize={12}
        tick={{ fill: "#666" }}
      />

      <Tooltip content={<CustomTooltip />} />

      <Legend />

      {/* DPI bars */}
      <Bar yAxisId="left" dataKey="dpi" name="DPI" radius={[2, 2, 0, 0]}>
        {sortedData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
        ))}
      </Bar>

      {/* Float line */}
      {showFloat && (
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="totalFloat"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
          name="Total Float"
        />
      )}

      {/* Reference lines */}
      <ReferenceLine yAxisId="left" y={0.8} stroke="#f59e0b" strokeDasharray="2,2" />
      <ReferenceLine yAxisId="left" y={1.0} stroke="#10b981" strokeDasharray="2,2" />
    </ComposedChart>
  )

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Schedule Sensitivity Analysis</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Activity DPI and float impact assessment</p>
            </div>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Select value={chartType} onValueChange={(value: "stacked" | "waterfall") => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stacked">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Stacked
                    </div>
                  </SelectItem>
                  <SelectItem value="waterfall">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Waterfall
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: "dpi" | "float" | "risk") => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dpi">Sort by DPI</SelectItem>
                  <SelectItem value="float">Sort by Float</SelectItem>
                  <SelectItem value="risk">Sort by Risk</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Chart
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Metrics Summary */}
          <ActivityMetrics data={chartData} />

          {/* Main Chart */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "stacked" ? renderStackedBarChart() : renderWaterfallChart()}
            </ResponsiveContainer>
          </div>

          {/* Activity Summary Table */}
          <div className="space-y-3">
            <h4 className="font-medium">Activity Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedData.slice(0, 5).map((activity) => (
                <div key={activity.activityId} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{activity.activityName}</div>
                    <Badge variant="outline" className="text-xs">
                      {activity.activityId}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      DPI: <span className="font-medium">{activity.dpi.toFixed(2)}</span>
                    </div>
                    <div>
                      Float: <span className="font-medium">{activity.totalFloat}d</span>
                    </div>
                    <div>
                      Sensitivity:{" "}
                      <span
                        className={cn(
                          "font-medium",
                          activity.sensitivity === "high"
                            ? "text-red-600"
                            : activity.sensitivity === "medium"
                            ? "text-orange-600"
                            : "text-green-600"
                        )}
                      >
                        {activity.sensitivity}
                      </span>
                    </div>
                    <div>
                      Risk: <span className="font-medium">{activity.riskLevel}%</span>
                    </div>
                  </div>
                  {activity.criticalPath && (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      Critical Path
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
              <span className="text-sm">Mock Data</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showFloat} onCheckedChange={setShowFloat} />
              <span className="text-sm">Show Float</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
              <Activity className="h-4 w-4" />
              <span>10 Activities • DPI Range: 0.65-0.98</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduleSensitivity
