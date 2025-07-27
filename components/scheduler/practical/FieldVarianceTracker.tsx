/**
 * @fileoverview Field Variance Tracker - Forecast vs Actual Performance Analysis
 * @module FieldVarianceTracker
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Tracks field performance variances between forecasted and actual durations
 * with detailed analysis of delay causes and variance patterns
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  CloudRain,
  FileText,
  Users,
  Target,
  BarChart3,
  PieChartIcon,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Activity,
  Calendar,
} from "lucide-react"

// Types
interface VarianceData {
  activity: string
  activityCode: string
  trade: string
  forecast: number
  actual: number
  variance: number
  variancePercent: number
  status: "ahead" | "ontime" | "delayed"
  delayCause?: "weather" | "internal" | "permit" | "none"
}

interface DelayCause {
  name: string
  value: number
  percentage: number
  color: string
  icon: React.ComponentType<any>
}

interface VarianceSummary {
  totalActivities: number
  aheadCount: number
  ontimeCount: number
  delayedCount: number
  avgVariance: number
  totalVarianceDays: number
}

// Mock Data
const varianceData: VarianceData[] = [
  {
    activity: "Foundation Excavation",
    activityCode: "A001",
    trade: "Earthwork",
    forecast: 5,
    actual: 8,
    variance: 3,
    variancePercent: 60,
    status: "delayed",
    delayCause: "weather",
  },
  {
    activity: "Concrete Pour - Foundation",
    activityCode: "A002",
    trade: "Concrete",
    forecast: 3,
    actual: 4,
    variance: 1,
    variancePercent: 33,
    status: "delayed",
    delayCause: "permit",
  },
  {
    activity: "Steel Erection - Level 1",
    activityCode: "A003",
    trade: "Steel",
    forecast: 8,
    actual: 6,
    variance: -2,
    variancePercent: -25,
    status: "ahead",
    delayCause: "none",
  },
  {
    activity: "MEP Rough-In - Level 1",
    activityCode: "A004",
    trade: "MEP",
    forecast: 12,
    actual: 17,
    variance: 5,
    variancePercent: 42,
    status: "delayed",
    delayCause: "internal",
  },
  {
    activity: "Drywall Installation",
    activityCode: "A005",
    trade: "Drywall",
    forecast: 6,
    actual: 8,
    variance: 2,
    variancePercent: 33,
    status: "delayed",
    delayCause: "internal",
  },
  {
    activity: "HVAC Installation",
    activityCode: "A006",
    trade: "HVAC",
    forecast: 10,
    actual: 17,
    variance: 7,
    variancePercent: 70,
    status: "delayed",
    delayCause: "weather",
  },
  {
    activity: "Electrical Rough-In",
    activityCode: "A007",
    trade: "Electrical",
    forecast: 8,
    actual: 10,
    variance: 2,
    variancePercent: 25,
    status: "delayed",
    delayCause: "permit",
  },
  {
    activity: "Plumbing Rough-In",
    activityCode: "A008",
    trade: "Plumbing",
    forecast: 6,
    actual: 9,
    variance: 3,
    variancePercent: 50,
    status: "delayed",
    delayCause: "internal",
  },
  {
    activity: "Roofing Installation",
    activityCode: "A009",
    trade: "Roofing",
    forecast: 7,
    actual: 11,
    variance: 4,
    variancePercent: 57,
    status: "delayed",
    delayCause: "weather",
  },
  {
    activity: "Exterior Cladding",
    activityCode: "A010",
    trade: "Exterior",
    forecast: 9,
    actual: 8,
    variance: -1,
    variancePercent: -11,
    status: "ahead",
    delayCause: "none",
  },
  {
    activity: "Interior Finishes",
    activityCode: "A011",
    trade: "Finishes",
    forecast: 15,
    actual: 16,
    variance: 1,
    variancePercent: 7,
    status: "delayed",
    delayCause: "internal",
  },
  {
    activity: "Final Inspections",
    activityCode: "A012",
    trade: "Inspection",
    forecast: 4,
    actual: 6,
    variance: 2,
    variancePercent: 50,
    status: "delayed",
    delayCause: "permit",
  },
]

const delayCauses: DelayCause[] = [
  {
    name: "Weather",
    value: 14,
    percentage: 40,
    color: "#3b82f6",
    icon: CloudRain,
  },
  {
    name: "Internal",
    value: 12,
    percentage: 35,
    color: "#f59e0b",
    icon: Users,
  },
  {
    name: "Permit",
    value: 9,
    percentage: 25,
    color: "#ef4444",
    icon: FileText,
  },
]

// Calculate summary
const calculateSummary = (data: VarianceData[]): VarianceSummary => {
  const totalActivities = data.length
  const aheadCount = data.filter((d) => d.status === "ahead").length
  const ontimeCount = data.filter((d) => d.status === "ontime").length
  const delayedCount = data.filter((d) => d.status === "delayed").length
  const totalVarianceDays = data.reduce((sum, d) => sum + Math.abs(d.variance), 0)
  const avgVariance = totalVarianceDays / totalActivities

  return {
    totalActivities,
    aheadCount,
    ontimeCount,
    delayedCount,
    avgVariance,
    totalVarianceDays,
  }
}

// Components
const VarianceBarChart: React.FC<{ data: VarianceData[] }> = ({ data }) => {
  const [chartType, setChartType] = useState<"grouped" | "stacked">("grouped")
  const [showVariance, setShowVariance] = useState(true)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const activity = data.find((d) => d.activityCode === label)
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{activity?.activity}</p>
          <p className="text-sm text-blue-600">{`Forecast: ${payload[0]?.value} days`}</p>
          <p className="text-sm text-orange-600">{`Actual: ${payload[1]?.value} days`}</p>
          <p className="text-sm text-red-600">
            {`Variance: ${activity?.variance} days (${activity?.variancePercent}%)`}
          </p>
          <p className="text-xs text-muted-foreground">{`Trade: ${activity?.trade}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Forecast vs Actual Performance
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={chartType} onValueChange={setChartType as (value: string) => void}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grouped">Grouped</SelectItem>
                <SelectItem value="stacked">Stacked</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setShowVariance(!showVariance)}>
              <Target className="h-4 w-4 mr-1" />
              Variance
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {showVariance ? (
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activityCode" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="forecast" name="Forecast" fill="#3b82f6" opacity={0.7} />
                <Bar dataKey="actual" name="Actual" fill="#f59e0b" opacity={0.7} />
                <Line
                  type="monotone"
                  dataKey="variance"
                  name="Variance (Days)"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                />
                <ReferenceLine y={0} stroke="#22c55e" strokeDasharray="3 3" />
              </ComposedChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activityCode" angle={-45} textAnchor="end" height={80} />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="forecast" name="Forecast" fill="#3b82f6" opacity={0.7} />
                <Bar dataKey="actual" name="Actual" fill="#f59e0b" opacity={0.7} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-blue-600 font-medium">8.3 days</div>
            <div className="text-muted-foreground">Avg Forecast</div>
          </div>
          <div className="text-center">
            <div className="text-orange-600 font-medium">10.0 days</div>
            <div className="text-muted-foreground">Avg Actual</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-medium">+1.7 days</div>
            <div className="text-muted-foreground">Avg Variance</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const DelayCausesPieChart: React.FC<{ data: DelayCause[] }> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <data.icon className="h-4 w-4" />
            <span className="font-medium">{data.name}</span>
          </div>
          <p className="text-sm">{`${data.value} days (${data.percentage}%)`}</p>
        </div>
      )
    }
    return null
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show labels for slices less than 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Delay Causes Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={activeIndex === index ? "#000" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-3">
          {data.map((cause, index) => {
            const IconComponent = cause.icon
            return (
              <div key={cause.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cause.color }} />
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm font-medium">{cause.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{cause.value} days</div>
                  <div className="text-xs text-muted-foreground">{cause.percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const VarianceSummaryCard: React.FC<{ summary: VarianceSummary }> = ({ summary }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Variance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold">{summary.totalActivities}</div>
              <p className="text-sm text-muted-foreground">Total Activities</p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-red-600">+{summary.avgVariance.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Avg Variance (days)</p>
            </div>
          </div>

          <Separator />

          {/* Status Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Performance Status</h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Ahead of Schedule</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{summary.aheadCount}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({((summary.aheadCount / summary.totalActivities) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">On Time</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{summary.ontimeCount}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({((summary.ontimeCount / summary.totalActivities) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Delayed</span>
                </div>
                <div className="text-right">
                  <span className="font-medium">{summary.delayedCount}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({((summary.delayedCount / summary.totalActivities) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500"
                  style={{ width: `${(summary.aheadCount / summary.totalActivities) * 100}%` }}
                />
                <div
                  className="bg-blue-500"
                  style={{ width: `${(summary.ontimeCount / summary.totalActivities) * 100}%` }}
                />
                <div
                  className="bg-red-500"
                  style={{ width: `${(summary.delayedCount / summary.totalActivities) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Variance Days</span>
              <span className="font-medium">{summary.totalVarianceDays}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Activities with Variance {">"}3 days</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Worst Performing Trade</span>
              <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200">
                HVAC
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const FieldVarianceTracker: React.FC = () => {
  const [tradeFilter, setTradeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateRange, setDateRange] = useState("month")

  const summary = calculateSummary(varianceData)

  const filteredData = varianceData.filter((item) => {
    const tradeMatch = tradeFilter === "all" || item.trade.toLowerCase().includes(tradeFilter.toLowerCase())
    const statusMatch = statusFilter === "all" || item.status === statusFilter
    return tradeMatch && statusMatch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Field Variance Tracker</h2>
          <p className="text-sm text-muted-foreground">
            Monitor forecast vs actual performance and analyze delay patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={tradeFilter} onValueChange={setTradeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trades</SelectItem>
              <SelectItem value="concrete">Concrete</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="mep">MEP</SelectItem>
              <SelectItem value="drywall">Drywall</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ahead">Ahead</SelectItem>
              <SelectItem value="ontime">On Time</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2">
          <VarianceBarChart data={filteredData} />
        </div>

        {/* Summary Card */}
        <div>
          <VarianceSummaryCard summary={summary} />
        </div>
      </div>

      {/* Delay Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DelayCausesPieChart data={delayCauses} />

        {/* Additional Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Variance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">TOP PERFORMERS</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Steel Erection</span>
                    <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
                      -2 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exterior Cladding</span>
                    <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
                      -1 day
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">WORST PERFORMERS</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HVAC Installation</span>
                    <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 text-xs">
                      +7 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">MEP Rough-In</span>
                    <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 text-xs">
                      +5 days
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Roofing Installation</span>
                    <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 text-xs">
                      +4 days
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">TRENDS</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weather Impact</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">High</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Permit Delays</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600">Medium</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trade Efficiency</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600">Improving</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FieldVarianceTracker
