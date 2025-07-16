/**
 * @fileoverview Float Distribution Chart Component
 * @module FloatDistributionChart
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * Power BI embedded float distribution analysis with segmented histogram,
 * heatmap gradient visualization, and float trend tracking across updates
 * with total vs free float comparison capabilities.
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
  Area,
  AreaChart,
  Cell,
  ComposedChart,
  ReferenceLine,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Activity,
  Target,
  Zap,
} from "lucide-react"
import { format } from "date-fns"

// Types
interface FloatRange {
  range: string
  label: string
  min: number
  max: number | null
  totalFloat: number
  freeFloat: number
  color: string
  heatmapIntensity: number
}

interface FloatUpdate {
  updateId: string
  date: string
  totalFloatDistribution: {
    high: number
    medium: number
    low: number
    negative: number
  }
  freeFloatDistribution: {
    high: number
    medium: number
    low: number
    negative: number
  }
  averageTotalFloat: number
  averageFreeFloat: number
}

interface FloatDistributionChartProps {
  showMockData?: boolean
  onRangeClick?: (range: string) => void
  onRefresh?: () => void
}

// Mock Data
const mockFloatRanges: FloatRange[] = [
  {
    range: "high",
    label: "High Float (>10d)",
    min: 10,
    max: null,
    totalFloat: 40,
    freeFloat: 35,
    color: "#10b981", // Green
    heatmapIntensity: 0.27, // 40/150
  },
  {
    range: "medium",
    label: "Medium Float (5-10d)",
    min: 5,
    max: 10,
    totalFloat: 30,
    freeFloat: 28,
    color: "#3b82f6", // Blue
    heatmapIntensity: 0.2, // 30/150
  },
  {
    range: "low",
    label: "Low Float (0-5d)",
    min: 0,
    max: 5,
    totalFloat: 50,
    freeFloat: 52,
    color: "#f59e0b", // Amber
    heatmapIntensity: 0.33, // 50/150
  },
  {
    range: "negative",
    label: "Negative Float (<0d)",
    min: -Infinity,
    max: 0,
    totalFloat: 30,
    freeFloat: 35,
    color: "#ef4444", // Red
    heatmapIntensity: 0.2, // 30/150
  },
]

const mockFloatUpdates: FloatUpdate[] = [
  {
    updateId: "U001",
    date: "2025-01-15",
    totalFloatDistribution: { high: 45, medium: 35, low: 45, negative: 25 },
    freeFloatDistribution: { high: 42, medium: 33, low: 48, negative: 27 },
    averageTotalFloat: 6.2,
    averageFreeFloat: 5.8,
  },
  {
    updateId: "U002",
    date: "2025-02-01",
    totalFloatDistribution: { high: 42, medium: 33, low: 48, negative: 27 },
    freeFloatDistribution: { high: 40, medium: 31, low: 50, negative: 29 },
    averageTotalFloat: 5.9,
    averageFreeFloat: 5.5,
  },
  {
    updateId: "U003",
    date: "2025-02-15",
    totalFloatDistribution: { high: 40, medium: 30, low: 50, negative: 30 },
    freeFloatDistribution: { high: 35, medium: 28, low: 52, negative: 35 },
    averageTotalFloat: 5.3,
    averageFreeFloat: 4.9,
  },
  {
    updateId: "U004",
    date: "2025-03-01",
    totalFloatDistribution: { high: 38, medium: 28, low: 52, negative: 32 },
    freeFloatDistribution: { high: 33, medium: 26, low: 54, negative: 37 },
    averageTotalFloat: 4.8,
    averageFreeFloat: 4.3,
  },
]

// Power BI color palette
const powerBIColors = ["#118DFF", "#12239E", "#E66C37", "#6B007B", "#E044A7", "#744EC2", "#D9B300", "#D64550"]

// Main Component
const FloatDistributionChart: React.FC<FloatDistributionChartProps> = ({
  showMockData = true,
  onRangeClick,
  onRefresh,
}) => {
  const [useMockData, setUseMockData] = useState(showMockData)
  const [floatType, setFloatType] = useState<"total" | "free">("total")
  const [viewMode, setViewMode] = useState<"histogram" | "heatmap" | "trend">("histogram")
  const [selectedRange, setSelectedRange] = useState<string | null>(null)
  const [selectedUpdate, setSelectedUpdate] = useState<string>("U004")

  // Prepare histogram data
  const histogramData = useMemo(() => {
    return mockFloatRanges.map((range, index) => ({
      ...range,
      value: floatType === "total" ? range.totalFloat : range.freeFloat,
      percentage: floatType === "total" ? (range.totalFloat / 150) * 100 : (range.freeFloat / 150) * 100,
      powerBIColor: powerBIColors[index % powerBIColors.length],
    }))
  }, [floatType])

  // Prepare trend data
  const trendData = useMemo(() => {
    return mockFloatUpdates.map((update) => ({
      updateId: update.updateId,
      date: format(new Date(update.date), "MMM dd"),
      ...update.totalFloatDistribution,
      averageTotal: update.averageTotalFloat,
      averageFree: update.averageFreeFloat,
      // Add combined metrics
      positiveFloat:
        update.totalFloatDistribution.high + update.totalFloatDistribution.medium + update.totalFloatDistribution.low,
      criticalActivities: update.totalFloatDistribution.negative,
    }))
  }, [])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const currentData = histogramData
    const totalActivities = currentData.reduce((sum, range) => sum + range.value, 0)
    const criticalActivities = currentData.find((r) => r.range === "negative")?.value || 0
    const positiveFloat = totalActivities - criticalActivities
    const criticalPercentage = (criticalActivities / totalActivities) * 100

    const riskLevel = criticalPercentage > 25 ? "high" : criticalPercentage > 15 ? "medium" : "low"

    return {
      totalActivities,
      criticalActivities,
      positiveFloat,
      criticalPercentage,
      riskLevel,
      highFloatActivities: currentData.find((r) => r.range === "high")?.value || 0,
    }
  }, [histogramData])

  // Heatmap data
  const heatmapData = useMemo(() => {
    const updates = ["U001", "U002", "U003", "U004"]
    const ranges = ["high", "medium", "low", "negative"]

    return ranges.map((range) => {
      const rangeData = updates.map((updateId) => {
        const update = mockFloatUpdates.find((u) => u.updateId === updateId)
        const distribution = floatType === "total" ? update?.totalFloatDistribution : update?.freeFloatDistribution
        const value = distribution?.[range as keyof typeof distribution] || 0
        return {
          update: updateId,
          value,
          intensity: value / 60, // Normalize to 0-1 for heatmap
        }
      })

      return {
        range,
        label: mockFloatRanges.find((r) => r.range === range)?.label || range,
        data: rangeData,
      }
    })
  }, [floatType])

  // Custom tooltip for histogram
  const HistogramTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium text-sm mb-2">{data.label}</div>
          <div className="space-y-1 text-xs">
            <div>Activities: {data.value}</div>
            <div>Percentage: {data.percentage.toFixed(1)}%</div>
            <div>Float Type: {floatType === "total" ? "Total Float" : "Free Float"}</div>
            <div className="pt-2 mt-2 border-t text-muted-foreground">
              Range: {data.min === -Infinity ? "< 0" : data.min}
              {data.max ? ` to ${data.max}` : "+"} days
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for trend chart
  const TrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium text-sm mb-2">
            Update {data.updateId} - {data.date}
          </div>
          <div className="space-y-1 text-xs">
            <div>High Float: {data.high} activities</div>
            <div>Medium Float: {data.medium} activities</div>
            <div>Low Float: {data.low} activities</div>
            <div>Negative Float: {data.negative} activities</div>
            <div className="pt-2 mt-2 border-t">
              <div>Positive Float: {data.positiveFloat} activities</div>
              <div>Average Float: {data.averageTotal.toFixed(1)} days</div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Render histogram view
  const renderHistogram = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="label" angle={-45} textAnchor="end" height={100} fontSize={10} />
        <YAxis label={{ value: "Number of Activities", angle: -90, position: "insideLeft" }} fontSize={12} />
        <Tooltip content={<HistogramTooltip />} />
        <Legend />
        <Bar dataKey="value" name={`${floatType === "total" ? "Total" : "Free"} Float Activities`}>
          {histogramData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.powerBIColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  // Render heatmap view
  const renderHeatmap = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium">Float Distribution Heatmap</div>
      <div className="grid grid-cols-5 gap-2">
        <div></div>
        {["U001", "U002", "U003", "U004"].map((update) => (
          <div key={update} className="text-center text-xs font-medium p-2">
            {update}
          </div>
        ))}

        {heatmapData.map((range) => (
          <React.Fragment key={range.range}>
            <div className="text-xs font-medium p-2 text-right">{range.label.split(" ")[0]}</div>
            {range.data.map((cell) => (
              <div
                key={`${range.range}-${cell.update}`}
                className="h-12 rounded flex items-center justify-center text-xs font-bold relative transition-all cursor-pointer"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${cell.intensity})`,
                  color: cell.intensity > 0.5 ? "white" : "black",
                }}
                title={`${range.label}: ${cell.value} activities in ${cell.update}`}
              >
                {cell.value}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span>Intensity:</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-100 rounded"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  )

  // Render trend view
  const renderTrend = () => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" label={{ value: "Activities", angle: -90, position: "insideLeft" }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Avg Float (Days)", angle: 90, position: "insideRight" }}
        />
        <Tooltip content={<TrendTooltip />} />
        <Legend />

        {/* Stacked areas for float distribution */}
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="high"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.8}
          name="High Float"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="medium"
          stackId="1"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.8}
          name="Medium Float"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="low"
          stackId="1"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.8}
          name="Low Float"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="negative"
          stackId="1"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.8}
          name="Negative Float"
        />

        {/* Average float trend line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="averageTotal"
          stroke="#9333ea"
          strokeWidth={3}
          name="Average Total Float"
          dot={{ fill: "#9333ea", strokeWidth: 2, r: 5 }}
        />

        {/* Reference line at zero */}
        <ReferenceLine yAxisId="right" y={0} stroke="#000" strokeDasharray="2,2" />
      </ComposedChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Float Distribution Analysis
              <Badge className="bg-yellow-500 text-yellow-900 text-xs">Powered by Microsoft Power BI</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Activity float distribution with histogram, heatmap, and trend analysis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="histogram">Histogram</SelectItem>
                <SelectItem value="heatmap">Heatmap</SelectItem>
                <SelectItem value="trend">Trend</SelectItem>
              </SelectContent>
            </Select>

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
            <Switch
              checked={floatType === "free"}
              onCheckedChange={(checked) => setFloatType(checked ? "free" : "total")}
            />
            <span className="text-sm">{floatType === "total" ? "Total Float" : "Free Float"}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Risk Summary Alert */}
        <Card
          className={cn(
            "mb-6",
            summaryStats.riskLevel === "high"
              ? "border-red-200 bg-red-50"
              : summaryStats.riskLevel === "medium"
              ? "border-yellow-200 bg-yellow-50"
              : "border-green-200 bg-green-50"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {summaryStats.riskLevel === "high" ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium">
                Schedule Float Risk: {summaryStats.riskLevel.charAt(0).toUpperCase() + summaryStats.riskLevel.slice(1)}
              </span>
            </div>
            <div className="text-sm">
              {summaryStats.criticalActivities} activities with negative float (
              {summaryStats.criticalPercentage.toFixed(1)}%) • {summaryStats.positiveFloat} activities with positive
              float • Using {floatType} float calculations
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{summaryStats.highFloatActivities}</div>
              <div className="text-sm text-muted-foreground">High Float Activities</div>
              <div className="text-xs text-muted-foreground">
                {((summaryStats.highFloatActivities / summaryStats.totalActivities) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{summaryStats.criticalActivities}</div>
              <div className="text-sm text-muted-foreground">Negative Float</div>
              <div className="text-xs text-muted-foreground">
                {summaryStats.criticalPercentage.toFixed(1)}% critical
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{summaryStats.positiveFloat}</div>
              <div className="text-sm text-muted-foreground">Positive Float</div>
              <div className="text-xs text-muted-foreground">Safe activities</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{summaryStats.totalActivities}</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
              <div className="text-xs text-muted-foreground">Project scope</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {viewMode === "histogram" && "Float Distribution Histogram"}
              {viewMode === "heatmap" && "Float Distribution Heatmap"}
              {viewMode === "trend" && "Float Trend Analysis"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "histogram" && renderHistogram()}
            {viewMode === "heatmap" && renderHeatmap()}
            {viewMode === "trend" && renderTrend()}
          </CardContent>
        </Card>

        {/* Distribution Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Float Range Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {histogramData.map((range, index) => (
                <div
                  key={range.range}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedRange === range.range && "ring-2 ring-primary",
                    "hover:shadow-md"
                  )}
                  style={{ borderColor: range.powerBIColor }}
                  onClick={() => {
                    setSelectedRange(selectedRange === range.range ? null : range.range)
                    onRangeClick?.(range.range)
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: range.powerBIColor }} />
                    <span className="font-medium text-sm">{range.label}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{range.value}</div>
                    <div className="text-sm text-muted-foreground">{range.percentage.toFixed(1)}% of activities</div>
                    <div className="text-xs text-muted-foreground">
                      Total: {range.totalFloat} | Free: {range.freeFloat}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Power BI Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <span>Powered by Microsoft Power BI</span>
            <span>•</span>
            <span>Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}</span>
            <span>•</span>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              View in Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FloatDistributionChart
