/**
 * @fileoverview Update Quality Analyzer - Schedule Update Quality Assessment
 * @module UpdateQualityAnalyzer
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Analyzes schedule update quality with trend tracking for update frequency,
 * manual progress tracking, and out-of-sequence flag monitoring
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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Flag,
  Activity,
  Calendar,
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Target,
  Zap,
} from "lucide-react"

// Types
interface UpdateQualityMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  status: "good" | "warning" | "critical"
  description: string
  target?: string | number
}

interface UpdateData {
  update: string
  date: string
  frequency: number
  manualProgress: number
  outOfSequence: number
  totalActivities: number
  dataQuality: number
  completionRate: number
}

interface QualityFlag {
  id: string
  type: "sequence" | "progress" | "logic" | "resource"
  activity: string
  description: string
  severity: "high" | "medium" | "low"
  updateNumber: string
}

// Mock Data
const updateTrendData: UpdateData[] = [
  {
    update: "U001",
    date: "2024-12-01",
    frequency: 7,
    manualProgress: 18,
    outOfSequence: 3,
    totalActivities: 120,
    dataQuality: 85,
    completionRate: 12,
  },
  {
    update: "U002",
    date: "2024-12-08",
    frequency: 7,
    manualProgress: 20,
    outOfSequence: 4,
    totalActivities: 120,
    dataQuality: 82,
    completionRate: 18,
  },
  {
    update: "U003",
    date: "2024-12-15",
    frequency: 7,
    manualProgress: 22,
    outOfSequence: 5,
    totalActivities: 120,
    dataQuality: 79,
    completionRate: 25,
  },
  {
    update: "U004",
    date: "2024-12-22",
    frequency: 10,
    manualProgress: 25,
    outOfSequence: 6,
    totalActivities: 120,
    dataQuality: 76,
    completionRate: 32,
  },
  {
    update: "U005",
    date: "2024-12-29",
    frequency: 14,
    manualProgress: 22,
    outOfSequence: 5,
    totalActivities: 120,
    dataQuality: 81,
    completionRate: 40,
  },
  {
    update: "U006",
    date: "2025-01-05",
    frequency: 7,
    manualProgress: 19,
    outOfSequence: 4,
    totalActivities: 120,
    dataQuality: 84,
    completionRate: 47,
  },
]

const qualityFlags: QualityFlag[] = [
  {
    id: "flag-001",
    type: "sequence",
    activity: "A045 - Electrical Rough-In",
    description: "Started before predecessor completion",
    severity: "high",
    updateNumber: "U006",
  },
  {
    id: "flag-002",
    type: "progress",
    activity: "A032 - Drywall Installation",
    description: "100% progress with no actual start",
    severity: "high",
    updateNumber: "U006",
  },
  {
    id: "flag-003",
    type: "logic",
    activity: "A018 - HVAC Installation",
    description: "Missing finish-to-start relationship",
    severity: "medium",
    updateNumber: "U006",
  },
  {
    id: "flag-004",
    type: "sequence",
    activity: "A067 - Final Inspections",
    description: "Out-of-sequence completion",
    severity: "medium",
    updateNumber: "U006",
  },
  {
    id: "flag-005",
    type: "resource",
    activity: "A055 - Flooring Installation",
    description: "Resource overallocation detected",
    severity: "low",
    updateNumber: "U006",
  },
]

const currentMetrics: UpdateQualityMetric[] = [
  {
    label: "Update Frequency",
    value: "7 days",
    trend: "stable",
    status: "good",
    description: "Average days between updates",
    target: "7 days",
  },
  {
    label: "Manual Progress",
    value: "22%",
    trend: "down",
    status: "warning",
    description: "Activities with manually entered progress",
    target: "15%",
  },
  {
    label: "Out-of-Sequence Flags",
    value: "5",
    trend: "down",
    status: "good",
    description: "Flags per update (current)",
    target: "< 3",
  },
  {
    label: "Data Quality Score",
    value: "81%",
    trend: "up",
    status: "good",
    description: "Overall update data quality",
    target: "85%",
  },
]

// Components
const MetricCard: React.FC<{ metric: UpdateQualityMetric }> = ({ metric }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
            {getTrendIcon(metric.trend)}
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">{metric.value}</div>
            <Badge variant="outline" className={cn("text-xs", getStatusColor(metric.status))}>
              {metric.status.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{metric.description}</p>
            {metric.target && <p className="text-xs text-blue-600">Target: {metric.target}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const UpdateFrequencyChart: React.FC<{ data: UpdateData[] }> = ({ data }) => {
  const [chartType, setChartType] = useState<"line" | "area">("line")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Update: ${label}`}</p>
          <p className="text-sm text-blue-600">{`Frequency: ${payload[0].value} days`}</p>
          <p className="text-xs text-muted-foreground">{`Date: ${data.find((d) => d.update === label)?.date}`}</p>
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
            Update Frequency Trend
          </CardTitle>
          <Select value={chartType} onValueChange={setChartType as (value: string) => void}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="update" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={7} stroke="#22c55e" strokeDasharray="5 5" label="Target" />
                <Line
                  type="monotone"
                  dataKey="frequency"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="update" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={7} stroke="#22c55e" strokeDasharray="5 5" label="Target" />
                <Area type="monotone" dataKey="frequency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Average: 8.7 days</span>
          <span className="text-muted-foreground">Variance: ±2.1 days</span>
        </div>
      </CardContent>
    </Card>
  )
}

const QualityTrendsChart: React.FC<{ data: UpdateData[] }> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Update: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name === "Manual Progress" ? "%" : ""}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quality Trends Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="update" />
              <YAxis yAxisId="left" label={{ value: "Percentage", angle: -90, position: "insideLeft" }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Count", angle: 90, position: "insideRight" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="manualProgress"
                name="Manual Progress"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
              />
              <Bar yAxisId="right" dataKey="outOfSequence" name="Out-of-Sequence Flags" fill="#ef4444" opacity={0.7} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="dataQuality"
                name="Data Quality"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />

              <ReferenceLine yAxisId="left" y={15} stroke="#f59e0b" strokeDasharray="5 5" />
              <ReferenceLine yAxisId="right" y={3} stroke="#ef4444" strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-yellow-600 font-medium">22%</div>
            <div className="text-muted-foreground">Manual Progress</div>
          </div>
          <div className="text-center">
            <div className="text-red-600 font-medium">5</div>
            <div className="text-muted-foreground">Out-of-Sequence</div>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-medium">81%</div>
            <div className="text-muted-foreground">Data Quality</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const QualityFlagsPanel: React.FC<{ flags: QualityFlag[] }> = ({ flags }) => {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sequence":
        return <Activity className="h-4 w-4 text-red-500" />
      case "progress":
        return <Edit className="h-4 w-4 text-orange-500" />
      case "logic":
        return <Zap className="h-4 w-4 text-yellow-500" />
      case "resource":
        return <Target className="h-4 w-4 text-blue-500" />
      default:
        return <Flag className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-700 bg-green-50 border-green-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const filteredFlags = flags.filter((flag) => {
    const typeMatch = filterType === "all" || flag.type === filterType
    const severityMatch = filterSeverity === "all" || flag.severity === filterSeverity
    return typeMatch && severityMatch
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Quality Flags (Current Update)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sequence">Sequence</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="logic">Logic</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredFlags.map((flag) => (
            <div key={flag.id} className="flex items-start gap-3 p-3 border rounded-lg">
              {getTypeIcon(flag.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{flag.activity}</span>
                  <Badge variant="outline" className={cn("text-xs", getSeverityColor(flag.severity))}>
                    {flag.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{flag.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="secondary" className="text-xs">
                    {flag.type}
                  </Badge>
                  <span className="text-muted-foreground">Update:</span>
                  <span className="font-medium">{flag.updateNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const UpdateQualityAnalyzer: React.FC = () => {
  const [dateRange, setDateRange] = useState("last6")
  const [analysisMode, setAnalysisMode] = useState<"trends" | "flags" | "summary">("trends")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Update Quality Analyzer</h2>
          <p className="text-sm text-muted-foreground">
            Monitor schedule update quality and identify improvement opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last6">Last 6 Updates</SelectItem>
              <SelectItem value="last12">Last 12 Updates</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={analysisMode} onValueChange={setAnalysisMode as (value: string) => void}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trends">Trends</SelectItem>
              <SelectItem value="flags">Flags</SelectItem>
              <SelectItem value="summary">Summary</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpdateFrequencyChart data={updateTrendData} />
        <QualityTrendsChart data={updateTrendData} />
      </div>

      {/* Quality Flags */}
      <QualityFlagsPanel flags={qualityFlags} />

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Quality Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">UPDATE CONSISTENCY</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Frequency</span>
                  <span className="font-medium">8.7 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Frequency Variance</span>
                  <span className="font-medium">±2.1 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">On-Time Updates</span>
                  <span className="font-medium">83%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">DATA QUALITY</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manual Progress Avg</span>
                  <span className="font-medium">22%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality Score Avg</span>
                  <span className="font-medium">81%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Flags per Update</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">IMPROVEMENT AREAS</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sequence Issues</span>
                  <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 text-xs">
                    HIGH
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manual Entry</span>
                  <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200 text-xs">
                    MEDIUM
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Logic Relationships</span>
                  <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
                    LOW
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UpdateQualityAnalyzer
