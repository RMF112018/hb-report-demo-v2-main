/**
 * @fileoverview Float Erosion Analysis Chart
 * @module FloatErosion
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays float erosion trends and negative float percentage analysis over project updates
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
  ReferenceLine,
  Legend,
} from "recharts"
import {
  TrendingDown,
  AlertTriangle,
  Download,
  Settings,
  RefreshCw,
  Eye,
  MoreVertical,
  Clock,
  Target,
  Activity,
  BarChart3,
} from "lucide-react"
import { format, parseISO } from "date-fns"

// Types
interface FloatErosionData {
  updateId: string
  updateDate: string
  averageFloat: number
  previousFloat: number
  floatChange: number
  negativeFloatCount: number
  totalActivities: number
  negativeFloatPercentage: number
  criticalActivities: number
  atRiskActivities: number
  floatErosionRate: number
}

interface FloatErosionProps {
  className?: string
  showControls?: boolean
  height?: number
}

// Mock float erosion data - 6 updates showing decline from 12 to 4
const mockFloatErosionData: FloatErosionData[] = [
  {
    updateId: "U001",
    updateDate: "2025-09-01",
    averageFloat: 12.0,
    previousFloat: 0,
    floatChange: 0,
    negativeFloatCount: 5,
    totalActivities: 150,
    negativeFloatPercentage: 3.3,
    criticalActivities: 8,
    atRiskActivities: 12,
    floatErosionRate: 0,
  },
  {
    updateId: "U002",
    updateDate: "2025-10-01",
    averageFloat: 10.2,
    previousFloat: 12.0,
    floatChange: -1.8,
    negativeFloatCount: 8,
    totalActivities: 150,
    negativeFloatPercentage: 5.3,
    criticalActivities: 10,
    atRiskActivities: 18,
    floatErosionRate: -15.0,
  },
  {
    updateId: "U003",
    updateDate: "2025-11-01",
    averageFloat: 8.1,
    previousFloat: 10.2,
    floatChange: -2.1,
    negativeFloatCount: 12,
    totalActivities: 150,
    negativeFloatPercentage: 8.0,
    criticalActivities: 12,
    atRiskActivities: 25,
    floatErosionRate: -20.6,
  },
  {
    updateId: "U004",
    updateDate: "2025-12-01",
    averageFloat: 6.8,
    previousFloat: 8.1,
    floatChange: -1.3,
    negativeFloatCount: 18,
    totalActivities: 150,
    negativeFloatPercentage: 12.0,
    criticalActivities: 15,
    atRiskActivities: 32,
    floatErosionRate: -16.0,
  },
  {
    updateId: "U005",
    updateDate: "2025-12-15",
    averageFloat: 5.4,
    previousFloat: 6.8,
    floatChange: -1.4,
    negativeFloatCount: 22,
    totalActivities: 150,
    negativeFloatPercentage: 14.7,
    criticalActivities: 18,
    atRiskActivities: 38,
    floatErosionRate: -20.6,
  },
  {
    updateId: "U006",
    updateDate: "2025-12-30",
    averageFloat: 4.0,
    previousFloat: 5.4,
    floatChange: -1.4,
    negativeFloatCount: 28,
    totalActivities: 150,
    negativeFloatPercentage: 18.7,
    criticalActivities: 22,
    atRiskActivities: 45,
    floatErosionRate: -25.9,
  },
]

// Components
const FloatErosionMetrics: React.FC<{ data: FloatErosionData[] }> = ({ data }) => {
  const latestData = data[data.length - 1]
  const initialData = data[0]
  const totalErosion = initialData.averageFloat - latestData.averageFloat
  const erosionPercentage = (totalErosion / initialData.averageFloat) * 100

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Current Avg Float</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{latestData.averageFloat} days</div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          {latestData.floatChange > 0 ? "+" : ""}
          {latestData.floatChange} from last update
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Total Erosion</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{totalErosion.toFixed(1)} days</div>
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          {erosionPercentage.toFixed(1)}% decline
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">Negative Float</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{latestData.negativeFloatPercentage}%</div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          {latestData.negativeFloatCount} activities
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">At Risk Activities</span>
        </div>
        <div className="text-2xl font-bold text-purple-600">{latestData.atRiskActivities}</div>
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
          {((latestData.atRiskActivities / latestData.totalActivities) * 100).toFixed(1)}% of total
        </Badge>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as FloatErosionData

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <div className="font-medium mb-2">{label}</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span>Average Float:</span>
            <span className="font-medium">{data.averageFloat} days</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Float Change:</span>
            <span className={cn("font-medium", data.floatChange < 0 ? "text-red-600" : "text-green-600")}>
              {data.floatChange > 0 ? "+" : ""}
              {data.floatChange} days
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Negative Float %:</span>
            <span className="font-medium text-orange-600">{data.negativeFloatPercentage}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Erosion Rate:</span>
            <span className={cn("font-medium", data.floatErosionRate < -20 ? "text-red-600" : "text-orange-600")}>
              {data.floatErosionRate}%
            </span>
          </div>
          <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
            {format(parseISO(data.updateDate), "MMM dd, yyyy")}
          </div>
        </div>
      </div>
    )
  }
  return null
}

const FloatErosion: React.FC<FloatErosionProps> = ({ className, showControls = true, height = 400 }) => {
  const [useMockData, setUseMockData] = useState(true)
  const [showNegativeFloat, setShowNegativeFloat] = useState(true)
  const [showTrendLine, setShowTrendLine] = useState(true)
  const [chartType, setChartType] = useState<"line" | "composed">("composed")

  const chartData = useMockData ? mockFloatErosionData : []

  const renderChart = () => {
    if (chartType === "composed") {
      return (
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis dataKey="updateId" fontSize={12} tick={{ fill: "#666" }} />

          <YAxis
            yAxisId="left"
            label={{ value: "Average Float (Days)", angle: -90, position: "insideLeft" }}
            fontSize={12}
            tick={{ fill: "#666" }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Negative Float %", angle: 90, position: "insideRight" }}
            fontSize={12}
            tick={{ fill: "#666" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          {/* Float erosion line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="averageFloat"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
            name="Average Float"
          />

          {/* Negative float percentage bars */}
          {showNegativeFloat && (
            <Bar
              yAxisId="right"
              dataKey="negativeFloatPercentage"
              fill="#f59e0b"
              fillOpacity={0.6}
              name="Negative Float %"
            />
          )}

          {/* Reference lines */}
          <ReferenceLine yAxisId="left" y={0} stroke="#ef4444" strokeDasharray="2,2" />
          <ReferenceLine yAxisId="right" y={15} stroke="#f59e0b" strokeDasharray="2,2" />
        </ComposedChart>
      )
    }

    return (
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis dataKey="updateId" fontSize={12} tick={{ fill: "#666" }} />

        <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} fontSize={12} tick={{ fill: "#666" }} />

        <Tooltip content={<CustomTooltip />} />

        <Legend />

        {/* Average float line */}
        <Line
          type="monotone"
          dataKey="averageFloat"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
          name="Average Float"
        />

        {/* Negative float percentage line */}
        {showNegativeFloat && (
          <Line
            type="monotone"
            dataKey="negativeFloatPercentage"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5,5"
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            name="Negative Float %"
          />
        )}

        {/* Reference line at zero */}
        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="2,2" />
      </LineChart>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <div>
              <CardTitle>Float Erosion Analysis</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Schedule float degradation and negative float trends</p>
            </div>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Select value={chartType} onValueChange={(value: "line" | "composed") => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="composed">Composed</SelectItem>
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
          <FloatErosionMetrics data={chartData} />

          {/* Main Chart */}
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">-8.0 days</div>
              <div className="text-sm text-muted-foreground">Total Float Loss</div>
              <div className="text-xs text-muted-foreground mt-1">66.7% decline over 6 updates</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">18.7%</div>
              <div className="text-sm text-muted-foreground">Peak Negative Float</div>
              <div className="text-xs text-muted-foreground mt-1">28 activities behind schedule</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">-25.9%</div>
              <div className="text-sm text-muted-foreground">Highest Erosion Rate</div>
              <div className="text-xs text-muted-foreground mt-1">Recent update period</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
              <span className="text-sm">Mock Data</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showNegativeFloat} onCheckedChange={setShowNegativeFloat} />
              <span className="text-sm">Negative Float %</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showTrendLine} onCheckedChange={setShowTrendLine} />
              <span className="text-sm">Trend Lines</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
              <Activity className="h-4 w-4" />
              <span>6 Updates • 150 Activities</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FloatErosion
