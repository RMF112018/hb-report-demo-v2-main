/**
 * @fileoverview Monte Carlo Schedule Risk Analysis Outputs
 * @module MonteCarloOutputs
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays Monte Carlo simulation results for schedule risk forecasting and analysis
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  Cell,
} from "recharts"
import {
  BarChart3,
  AlertTriangle,
  Download,
  Settings,
  RefreshCw,
  MoreVertical,
  Target,
  TrendingUp,
  Clock,
  Activity,
  Calculator,
  Zap,
} from "lucide-react"
import { format, parseISO } from "date-fns"

// Types
interface MonteCarloResult {
  simulationId: number
  completionDate: string
  projectDays: number
  delayDays: number
  frequency: number
}

interface RiskDriver {
  activityId: string
  activityName: string
  averageDelay: number
  maxDelay: number
  impactFrequency: number
  criticality: "high" | "medium" | "low"
  variance: number
  riskScore: number
}

interface MonteCarloMetrics {
  p10: string
  p50: string
  p80: string
  p90: string
  sci: number // Schedule Certainty Index
  averageDelay: number
  totalSimulations: number
  successRate: number
}

interface MonteCarloOutputsProps {
  className?: string
  showControls?: boolean
  height?: number
}

// Mock Monte Carlo simulation data - 500 simulations
const generateHistogramData = (): MonteCarloResult[] => {
  const baseDate = new Date("2025-01-25")
  const data: MonteCarloResult[] = []

  // Generate distribution around P50 = Feb 1 (7 days), P80 = Feb 6 (12 days)
  for (let i = 0; i < 20; i++) {
    const daysDelay = i - 5 // Range from -5 to +14 days
    const completionDate = new Date(baseDate)
    completionDate.setDate(baseDate.getDate() + daysDelay)

    // Normal distribution with bias toward positive delays
    let frequency = 0
    if (daysDelay < 0) frequency = Math.max(0, 30 - Math.abs(daysDelay) * 8)
    else if (daysDelay <= 7) frequency = 45 - Math.abs(daysDelay - 3) * 3
    else frequency = Math.max(0, 35 - (daysDelay - 7) * 4)

    data.push({
      simulationId: i,
      completionDate: completionDate.toISOString(),
      projectDays: 180 + daysDelay,
      delayDays: Math.max(0, daysDelay),
      frequency: frequency,
    })
  }

  return data
}

// Mock risk drivers data
const mockRiskDrivers: RiskDriver[] = [
  {
    activityId: "A007",
    activityName: "Foundation Pour",
    averageDelay: 4.2,
    maxDelay: 8,
    impactFrequency: 78,
    criticality: "high",
    variance: 2.1,
    riskScore: 95,
  },
  {
    activityId: "A012",
    activityName: "Steel Erection",
    averageDelay: 3.8,
    maxDelay: 7,
    impactFrequency: 65,
    criticality: "high",
    variance: 1.9,
    riskScore: 88,
  },
  {
    activityId: "A023",
    activityName: "MEP Rough-In",
    averageDelay: 2.9,
    maxDelay: 6,
    impactFrequency: 52,
    criticality: "medium",
    variance: 1.4,
    riskScore: 75,
  },
  {
    activityId: "A019",
    activityName: "Drywall Installation",
    averageDelay: 2.3,
    maxDelay: 5,
    impactFrequency: 43,
    criticality: "medium",
    variance: 1.2,
    riskScore: 68,
  },
  {
    activityId: "A028",
    activityName: "Weather Delays",
    averageDelay: 1.8,
    maxDelay: 4,
    impactFrequency: 35,
    criticality: "low",
    variance: 0.9,
    riskScore: 55,
  },
]

// Mock metrics
const mockMetrics: MonteCarloMetrics = {
  p10: "2025-01-28",
  p50: "2025-02-01",
  p80: "2025-02-06",
  p90: "2025-02-10",
  sci: 0.87,
  averageDelay: 3.2,
  totalSimulations: 500,
  successRate: 72,
}

// Components
const MetricsOverview: React.FC<{ metrics: MonteCarloMetrics }> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">P50 Completion</span>
        </div>
        <div className="text-lg font-bold text-blue-600">{format(parseISO(metrics.p50), "MMM dd")}</div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          50% Confidence
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">P80 Completion</span>
        </div>
        <div className="text-lg font-bold text-orange-600">{format(parseISO(metrics.p80), "MMM dd")}</div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          80% Confidence
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">SCI Score</span>
        </div>
        <div className="text-lg font-bold text-purple-600">{metrics.sci}</div>
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
          Schedule Certainty
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Avg Delay</span>
        </div>
        <div className="text-lg font-bold text-red-600">{metrics.averageDelay} days</div>
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          Expected Impact
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Success Rate</span>
        </div>
        <div className="text-lg font-bold text-green-600">{metrics.successRate}%</div>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          On-Time Delivery
        </Badge>
      </div>
    </div>
  )
}

const HistogramTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as MonteCarloResult

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <div className="font-medium mb-2">{format(parseISO(data.completionDate), "MMM dd, yyyy")}</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span>Frequency:</span>
            <span className="font-medium">{data.frequency} simulations</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Delay:</span>
            <span className={cn("font-medium", data.delayDays > 0 ? "text-red-600" : "text-green-600")}>
              {data.delayDays > 0 ? `+${data.delayDays}` : data.delayDays} days
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Project Days:</span>
            <span className="font-medium">{data.projectDays} days</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const RiskDriverCard: React.FC<{ driver: RiskDriver; rank: number }> = ({ driver, rank }) => {
  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
            {rank}
          </div>
          <div>
            <div className="font-medium">{driver.activityName}</div>
            <div className="text-sm text-muted-foreground">{driver.activityId}</div>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-xs", getCriticalityColor(driver.criticality))}>
          {driver.criticality.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Average Delay</div>
          <div className="font-bold text-red-600">{driver.averageDelay} days</div>
        </div>
        <div>
          <div className="text-muted-foreground">Max Delay</div>
          <div className="font-bold text-red-700">{driver.maxDelay} days</div>
        </div>
        <div>
          <div className="text-muted-foreground">Impact Frequency</div>
          <div className="font-bold">{driver.impactFrequency}%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Risk Score</div>
          <div className="font-bold text-purple-600">{driver.riskScore}</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Variance</span>
          <span>{driver.variance} days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(driver.riskScore / 100) * 100}%` }} />
        </div>
      </div>
    </div>
  )
}

const MonteCarloOutputs: React.FC<MonteCarloOutputsProps> = ({ className, showControls = true, height = 400 }) => {
  const [useMockData, setUseMockData] = useState(true)
  const [showConfidenceLines, setShowConfidenceLines] = useState(true)
  const [viewMode, setViewMode] = useState<"histogram" | "cumulative">("histogram")

  const histogramData = useMemo(() => generateHistogramData(), [])
  const riskDrivers = useMockData ? mockRiskDrivers : []
  const metrics = useMockData ? mockMetrics : ({} as MonteCarloMetrics)

  const renderChart = () => {
    if (viewMode === "cumulative") {
      // Cumulative probability chart
      let cumulative = 0
      const cumulativeData = histogramData.map((d) => {
        cumulative += d.frequency
        return {
          ...d,
          cumulative: (cumulative / 500) * 100,
        }
      })

      return (
        <LineChart data={cumulativeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis
            dataKey="completionDate"
            tickFormatter={(date) => format(parseISO(date), "MMM dd")}
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={10}
            tick={{ fill: "#666" }}
          />

          <YAxis
            label={{ value: "Cumulative Probability (%)", angle: -90, position: "insideLeft" }}
            fontSize={12}
            tick={{ fill: "#666" }}
            domain={[0, 100]}
          />

          <Tooltip
            labelFormatter={(date) => format(parseISO(date), "MMM dd, yyyy")}
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Probability"]}
          />

          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            name="Cumulative Probability"
          />

          {showConfidenceLines && (
            <>
              <ReferenceLine x={metrics.p50} stroke="#10b981" strokeDasharray="2,2" />
              <ReferenceLine x={metrics.p80} stroke="#f59e0b" strokeDasharray="2,2" />
            </>
          )}
        </LineChart>
      )
    }

    return (
      <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis
          dataKey="completionDate"
          tickFormatter={(date) => format(parseISO(date), "MMM dd")}
          angle={-45}
          textAnchor="end"
          height={60}
          fontSize={10}
          tick={{ fill: "#666" }}
        />

        <YAxis
          label={{ value: "Frequency (Simulations)", angle: -90, position: "insideLeft" }}
          fontSize={12}
          tick={{ fill: "#666" }}
        />

        <Tooltip content={<HistogramTooltip />} />

        <Bar dataKey="frequency" name="Simulations" radius={[2, 2, 0, 0]}>
          {histogramData.map((entry, index) => {
            const delayDays = entry.delayDays
            let color = "#10b981" // Green for early/on-time
            if (delayDays > 0 && delayDays <= 5) color = "#3b82f6" // Blue for minor delays
            else if (delayDays > 5 && delayDays <= 10) color = "#f59e0b" // Orange for moderate delays
            else if (delayDays > 10) color = "#ef4444" // Red for major delays

            return <Cell key={`cell-${index}`} fill={color} />
          })}
        </Bar>

        {/* Reference lines for P50 and P80 */}
        {showConfidenceLines && (
          <>
            <ReferenceLine x={metrics.p50} stroke="#10b981" strokeDasharray="2,2" />
            <ReferenceLine x={metrics.p80} stroke="#f59e0b" strokeDasharray="2,2" />
          </>
        )}
      </BarChart>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Monte Carlo Analysis Results</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">500 simulations • Schedule risk assessment</p>
            </div>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: "histogram" | "cumulative") => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="histogram">Histogram</SelectItem>
                  <SelectItem value="cumulative">Cumulative</SelectItem>
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
                    Export Results
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Simulation Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-run Analysis
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Key Metrics */}
          <MetricsOverview metrics={metrics} />

          {/* Main Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Completion Date Distribution</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>500 Monte Carlo Simulations</span>
              </div>
            </div>
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Drivers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Top 5 Risk Drivers</h4>
              <Badge variant="outline" className="text-xs">
                Ranked by Average Delay Impact
              </Badge>
            </div>

            <div className="space-y-3">
              {riskDrivers.map((driver, index) => (
                <RiskDriverCard key={driver.activityId} driver={driver} rank={index + 1} />
              ))}
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">Feb 1</div>
              <div className="text-sm text-muted-foreground">P50 Completion</div>
              <div className="text-xs text-muted-foreground mt-1">Most likely date</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">Feb 6</div>
              <div className="text-sm text-muted-foreground">P80 Completion</div>
              <div className="text-xs text-muted-foreground mt-1">Conservative estimate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">0.87</div>
              <div className="text-sm text-muted-foreground">SCI Score</div>
              <div className="text-xs text-muted-foreground mt-1">High confidence</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
              <span className="text-sm">Mock Data</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showConfidenceLines} onCheckedChange={setShowConfidenceLines} />
              <span className="text-sm">Confidence Lines</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
              <Activity className="h-4 w-4" />
              <span>500 Simulations • 72% Success Rate</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonteCarloOutputs
