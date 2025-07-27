/**
 * @fileoverview Resource Efficiency Analysis Panel
 * @module ResourceEfficiencyPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays resource utilization analysis with overload and underuse identification
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
  ComposedChart,
  Line,
  Area,
  AreaChart,
  Cell,
} from "recharts"
import {
  Users,
  AlertTriangle,
  TrendingDown,
  Download,
  Settings,
  RefreshCw,
  MoreVertical,
  Target,
  Activity,
  Clock,
  Zap,
  CheckCircle,
  BarChart3,
} from "lucide-react"
import { format, addDays, parseISO } from "date-fns"

// Types
interface ResourceUtilization {
  day: number
  date: string
  trade: string
  planned: number
  available: number
  actual: number
  utilization: number // percentage
  status: "optimal" | "overload" | "underuse" | "critical"
  efficiency: number
}

interface TradeEfficiency {
  tradeId: string
  tradeName: string
  totalPlanned: number
  totalAvailable: number
  avgUtilization: number
  overloadDays: number
  underuseDays: number
  efficiency: number
  color: string
}

interface ResourceEfficiencyPanelProps {
  className?: string
  showControls?: boolean
  height?: number
}

// Mock resource utilization data - 5 trades over 10 days
const generateResourceData = (): ResourceUtilization[] => {
  const startDate = new Date("2025-01-20")
  const trades = [
    { id: "electrical", name: "Electrical", color: "#3b82f6" },
    { id: "plumbing", name: "Plumbing", color: "#10b981" },
    { id: "hvac", name: "HVAC", color: "#f59e0b" },
    { id: "drywall", name: "Drywall", color: "#8b5cf6" },
    { id: "flooring", name: "Flooring", color: "#ef4444" },
  ]

  const data: ResourceUtilization[] = []

  trades.forEach((trade) => {
    for (let day = 1; day <= 10; day++) {
      const date = addDays(startDate, day - 1)

      // Generate realistic resource allocation patterns
      let planned = 0
      let available = 0

      switch (trade.id) {
        case "electrical":
          planned = day <= 6 ? Math.floor(Math.random() * 3) + 6 : Math.floor(Math.random() * 2) + 2
          available = 8
          break
        case "plumbing":
          planned = day >= 3 && day <= 8 ? Math.floor(Math.random() * 3) + 5 : Math.floor(Math.random() * 2) + 1
          available = 6
          break
        case "hvac":
          planned = day >= 5 && day <= 10 ? Math.floor(Math.random() * 4) + 8 : Math.floor(Math.random() * 2) + 1
          available = 10
          break
        case "drywall":
          planned = day >= 7 ? Math.floor(Math.random() * 3) + 12 : Math.floor(Math.random() * 2) + 2
          available = 10
          break
        case "flooring":
          planned = day >= 8 ? Math.floor(Math.random() * 2) + 6 : Math.floor(Math.random() * 2) + 1
          available = 5
          break
      }

      const actual = Math.min(planned, available)
      const utilization = available > 0 ? (actual / available) * 100 : 0

      let status: "optimal" | "overload" | "underuse" | "critical"
      if (planned > available * 1.1) status = "critical"
      else if (planned > available) status = "overload"
      else if (utilization < 60) status = "underuse"
      else status = "optimal"

      const efficiency = planned > 0 ? (actual / planned) * 100 : 100

      data.push({
        day,
        date: date.toISOString(),
        trade: trade.name,
        planned,
        available,
        actual,
        utilization,
        status,
        efficiency,
      })
    }
  })

  return data
}

// Components
const EfficiencyMetrics: React.FC<{ data: ResourceUtilization[] }> = ({ data }) => {
  const avgUtilization = (data.reduce((sum, item) => sum + item.utilization, 0) / data.length).toFixed(1)
  const overloadDays = data.filter((item) => item.status === "overload" || item.status === "critical").length
  const underuseDays = data.filter((item) => item.status === "underuse").length
  const avgEfficiency = (data.reduce((sum, item) => sum + item.efficiency, 0) / data.length).toFixed(1)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Avg Utilization</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{avgUtilization}%</div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Resource Usage
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Overload Days</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{overloadDays}</div>
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          Capacity Issues
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">Underuse Days</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{underuseDays}</div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          Inefficiency
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Efficiency</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{avgEfficiency}%</div>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          Overall Performance
        </Badge>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ResourceUtilization

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <div className="font-medium mb-2">
          {data.trade} - Day {data.day}
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span>Date:</span>
            <span className="font-medium">{format(parseISO(data.date), "MMM dd")}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Planned:</span>
            <span className="font-medium">{data.planned} workers</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Available:</span>
            <span className="font-medium">{data.available} workers</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Actual:</span>
            <span className="font-medium">{data.actual} workers</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Utilization:</span>
            <span
              className={cn(
                "font-medium",
                data.utilization > 100 ? "text-red-600" : data.utilization < 60 ? "text-orange-600" : "text-green-600"
              )}
            >
              {data.utilization.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Status:</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                data.status === "critical"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : data.status === "overload"
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : data.status === "underuse"
                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                  : "bg-green-100 text-green-800 border-green-200"
              )}
            >
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const getBarColor = (status: string) => {
  switch (status) {
    case "critical":
      return "#dc2626"
    case "overload":
      return "#f59e0b"
    case "underuse":
      return "#84cc16"
    case "optimal":
      return "#10b981"
    default:
      return "#6b7280"
  }
}

const TradeEfficiencyCard: React.FC<{ trade: TradeEfficiency }> = ({ trade }) => {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: trade.color }} />
          <div className="font-medium">{trade.tradeName}</div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            trade.efficiency > 90
              ? "bg-green-100 text-green-800 border-green-200"
              : trade.efficiency > 75
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-red-100 text-red-800 border-red-200"
          )}
        >
          {trade.efficiency.toFixed(0)}% Efficient
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Avg Utilization</div>
          <div className="font-bold">{trade.avgUtilization.toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Available</div>
          <div className="font-bold">{trade.totalAvailable} workers</div>
        </div>
        <div>
          <div className="text-muted-foreground">Overload Days</div>
          <div className="font-bold text-red-600">{trade.overloadDays}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Underuse Days</div>
          <div className="font-bold text-orange-600">{trade.underuseDays}</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Efficiency</span>
          <span>{trade.efficiency.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${trade.efficiency}%`,
              backgroundColor: trade.efficiency > 75 ? "#10b981" : trade.efficiency > 50 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
      </div>
    </div>
  )
}

const ResourceEfficiencyPanel: React.FC<ResourceEfficiencyPanelProps> = ({
  className,
  showControls = true,
  height = 400,
}) => {
  const [useMockData, setUseMockData] = useState(true)
  const [viewMode, setViewMode] = useState<"utilization" | "comparison" | "timeline">("utilization")
  const [selectedTrade, setSelectedTrade] = useState<string>("all")

  const resourceData = useMemo(() => generateResourceData(), [])

  // Filter data by selected trade
  const filteredData = resourceData.filter((item) => selectedTrade === "all" || item.trade === selectedTrade)

  // Calculate trade efficiency summaries
  const tradeEfficiencies: TradeEfficiency[] = useMemo(() => {
    const trades = ["Electrical", "Plumbing", "HVAC", "Drywall", "Flooring"]
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]

    return trades.map((tradeName, index) => {
      const tradeData = resourceData.filter((item) => item.trade === tradeName)
      const totalPlanned = tradeData.reduce((sum, item) => sum + item.planned, 0)
      const totalAvailable = tradeData.reduce((sum, item) => sum + item.available, 0)
      const avgUtilization = tradeData.reduce((sum, item) => sum + item.utilization, 0) / tradeData.length
      const overloadDays = tradeData.filter((item) => item.status === "overload" || item.status === "critical").length
      const underuseDays = tradeData.filter((item) => item.status === "underuse").length
      const efficiency = tradeData.reduce((sum, item) => sum + item.efficiency, 0) / tradeData.length

      return {
        tradeId: tradeName.toLowerCase(),
        tradeName,
        totalPlanned,
        totalAvailable,
        avgUtilization,
        overloadDays,
        underuseDays,
        efficiency,
        color: colors[index],
      }
    })
  }, [resourceData])

  const renderChart = () => {
    if (viewMode === "comparison") {
      // Planned vs Available comparison
      const comparisonData = filteredData.map((item) => ({
        ...item,
        dayLabel: `D${item.day}`,
      }))

      return (
        <ComposedChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis dataKey="dayLabel" fontSize={12} tick={{ fill: "#666" }} />

          <YAxis
            label={{ value: "Workers", angle: -90, position: "insideLeft" }}
            fontSize={12}
            tick={{ fill: "#666" }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend />

          <Bar dataKey="available" name="Available" fill="#94a3b8" fillOpacity={0.7} />
          <Bar dataKey="planned" name="Planned" fill="#3b82f6" />
          <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
        </ComposedChart>
      )
    }

    if (viewMode === "timeline") {
      // Timeline area chart
      const timelineData = Array.from({ length: 10 }, (_, i) => {
        const day = i + 1
        const dayData = filteredData.filter((item) => item.day === day)

        return {
          day,
          dayLabel: `Day ${day}`,
          electrical: dayData.find((item) => item.trade === "Electrical")?.utilization || 0,
          plumbing: dayData.find((item) => item.trade === "Plumbing")?.utilization || 0,
          hvac: dayData.find((item) => item.trade === "HVAC")?.utilization || 0,
          drywall: dayData.find((item) => item.trade === "Drywall")?.utilization || 0,
          flooring: dayData.find((item) => item.trade === "Flooring")?.utilization || 0,
        }
      })

      return (
        <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

          <XAxis dataKey="dayLabel" fontSize={12} tick={{ fill: "#666" }} />

          <YAxis
            label={{ value: "Utilization %", angle: -90, position: "insideLeft" }}
            fontSize={12}
            tick={{ fill: "#666" }}
          />

          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Utilization"]}
            labelStyle={{ color: "#000" }}
          />

          <Legend />

          <Area
            type="monotone"
            dataKey="electrical"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Electrical"
          />
          <Area
            type="monotone"
            dataKey="plumbing"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Plumbing"
          />
          <Area
            type="monotone"
            dataKey="hvac"
            stackId="1"
            stroke="#f59e0b"
            fill="#f59e0b"
            fillOpacity={0.6}
            name="HVAC"
          />
          <Area
            type="monotone"
            dataKey="drywall"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
            name="Drywall"
          />
          <Area
            type="monotone"
            dataKey="flooring"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Flooring"
          />

          <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="2,2" />
        </AreaChart>
      )
    }

    // Default utilization chart
    return (
      <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        <XAxis dataKey="day" tickFormatter={(day) => `D${day}`} fontSize={12} tick={{ fill: "#666" }} />

        <YAxis
          label={{ value: "Utilization %", angle: -90, position: "insideLeft" }}
          fontSize={12}
          tick={{ fill: "#666" }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar dataKey="utilization" name="Utilization %" radius={[2, 2, 0, 0]}>
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
          ))}
        </Bar>

        <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="2,2" />
        <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="2,2" />
      </BarChart>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Resource Efficiency Analysis</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">5 trades • 10 days • Utilization optimization</p>
            </div>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
              <Select
                value={viewMode}
                onValueChange={(value: "utilization" | "comparison" | "timeline") => setViewMode(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utilization">Utilization</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="Drywall">Drywall</SelectItem>
                  <SelectItem value="Flooring">Flooring</SelectItem>
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
                    Export Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Resources
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
          {/* Efficiency Metrics */}
          <EfficiencyMetrics data={filteredData} />

          {/* Main Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Resource Utilization Pattern</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span>Daily Resource Analysis</span>
              </div>
            </div>
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trade Efficiency Cards */}
          <div className="space-y-4">
            <h4 className="font-medium">Trade Efficiency Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tradeEfficiencies.map((trade) => (
                <TradeEfficiencyCard key={trade.tradeId} trade={trade} />
              ))}
            </div>
          </div>

          {/* Status Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Optimal (60-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-lime-500" />
              <span className="text-sm">Underuse (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">Overload (100-110%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-sm">Critical (&gt;110%)</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
              <span className="text-sm">Mock Data</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
              <Activity className="h-4 w-4" />
              <span>5 Trades • 10 Days • Optimization Analysis</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceEfficiencyPanel
