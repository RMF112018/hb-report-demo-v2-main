/**
 * @fileoverview Trade Productivity Tracker
 * @module TradeProductivityTracker
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Displays trade productivity analysis with planned vs actual performance scatter plot
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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  Download,
  Settings,
  RefreshCw,
  MoreVertical,
  Activity,
  Users,
  Clock,
  BarChart3,
  Zap,
} from "lucide-react"

// Types
interface ProductivityActivity {
  activityId: string
  activityName: string
  trade: string
  plannedDuration: number
  actualDuration: number
  plannedProductivity: number // units per day
  actualProductivity: number // units per day
  efficiency: number // percentage
  variance: number // days difference
  status: "ahead" | "ontrack" | "behind" | "outlier"
  tradeColor: string
  isOutlier: boolean
}

interface TradeCluster {
  tradeName: string
  color: string
  activities: ProductivityActivity[]
  avgEfficiency: number
  outlierCount: number
}

interface TradeProductivityTrackerProps {
  className?: string
  showControls?: boolean
  height?: number
}

// Trade color mapping
const TRADE_COLORS = {
  Electrical: "#3b82f6",
  Plumbing: "#10b981",
  HVAC: "#f59e0b",
  Drywall: "#8b5cf6",
  Flooring: "#ef4444",
  Concrete: "#6b7280",
  Steel: "#0ea5e9",
  Roofing: "#84cc16",
}

// Mock productivity data - 20 activities across trades
const mockProductivityData: ProductivityActivity[] = [
  // Electrical (4 activities)
  {
    activityId: "E001",
    activityName: "Main Panel Installation",
    trade: "Electrical",
    plannedDuration: 5,
    actualDuration: 4.5,
    plannedProductivity: 8.0,
    actualProductivity: 8.9,
    efficiency: 111,
    variance: -0.5,
    status: "ahead",
    tradeColor: TRADE_COLORS["Electrical"],
    isOutlier: false,
  },
  {
    activityId: "E002",
    activityName: "Outlet Rough-In",
    trade: "Electrical",
    plannedDuration: 8,
    actualDuration: 9.5,
    plannedProductivity: 12.0,
    actualProductivity: 10.1,
    efficiency: 84,
    variance: 1.5,
    status: "behind",
    tradeColor: TRADE_COLORS["Electrical"],
    isOutlier: false,
  },
  {
    activityId: "E003",
    activityName: "Lighting Installation",
    trade: "Electrical",
    plannedDuration: 6,
    actualDuration: 5.8,
    plannedProductivity: 15.0,
    actualProductivity: 15.5,
    efficiency: 103,
    variance: -0.2,
    status: "ontrack",
    tradeColor: TRADE_COLORS["Electrical"],
    isOutlier: false,
  },
  {
    activityId: "E004",
    activityName: "Emergency Systems",
    trade: "Electrical",
    plannedDuration: 4,
    actualDuration: 7.2,
    plannedProductivity: 6.0,
    actualProductivity: 3.3,
    efficiency: 56,
    variance: 3.2,
    status: "outlier",
    tradeColor: TRADE_COLORS["Electrical"],
    isOutlier: true,
  },

  // Plumbing (3 activities)
  {
    activityId: "P001",
    activityName: "Supply Line Installation",
    trade: "Plumbing",
    plannedDuration: 10,
    actualDuration: 9.2,
    plannedProductivity: 20.0,
    actualProductivity: 21.7,
    efficiency: 109,
    variance: -0.8,
    status: "ahead",
    tradeColor: TRADE_COLORS["Plumbing"],
    isOutlier: false,
  },
  {
    activityId: "P002",
    activityName: "Fixture Installation",
    trade: "Plumbing",
    plannedDuration: 6,
    actualDuration: 6.1,
    plannedProductivity: 8.0,
    actualProductivity: 7.9,
    efficiency: 98,
    variance: 0.1,
    status: "ontrack",
    tradeColor: TRADE_COLORS["Plumbing"],
    isOutlier: false,
  },
  {
    activityId: "P003",
    activityName: "Drain Testing",
    trade: "Plumbing",
    plannedDuration: 3,
    actualDuration: 5.8,
    plannedProductivity: 10.0,
    actualProductivity: 5.2,
    efficiency: 52,
    variance: 2.8,
    status: "outlier",
    tradeColor: TRADE_COLORS["Plumbing"],
    isOutlier: true,
  },

  // HVAC (4 activities)
  {
    activityId: "H001",
    activityName: "Ductwork Installation",
    trade: "HVAC",
    plannedDuration: 12,
    actualDuration: 11.5,
    plannedProductivity: 25.0,
    actualProductivity: 26.1,
    efficiency: 104,
    variance: -0.5,
    status: "ontrack",
    tradeColor: TRADE_COLORS["HVAC"],
    isOutlier: false,
  },
  {
    activityId: "H002",
    activityName: "Unit Installation",
    trade: "HVAC",
    plannedDuration: 8,
    actualDuration: 7.2,
    plannedProductivity: 5.0,
    actualProductivity: 5.6,
    efficiency: 111,
    variance: -0.8,
    status: "ahead",
    tradeColor: TRADE_COLORS["HVAC"],
    isOutlier: false,
  },
  {
    activityId: "H003",
    activityName: "Controls Programming",
    trade: "HVAC",
    plannedDuration: 4,
    actualDuration: 4.1,
    plannedProductivity: 3.0,
    actualProductivity: 2.9,
    efficiency: 98,
    variance: 0.1,
    status: "ontrack",
    tradeColor: TRADE_COLORS["HVAC"],
    isOutlier: false,
  },
  {
    activityId: "H004",
    activityName: "System Commissioning",
    trade: "HVAC",
    plannedDuration: 6,
    actualDuration: 9.8,
    plannedProductivity: 8.0,
    actualProductivity: 4.9,
    efficiency: 61,
    variance: 3.8,
    status: "outlier",
    tradeColor: TRADE_COLORS["HVAC"],
    isOutlier: true,
  },

  // Drywall (3 activities)
  {
    activityId: "D001",
    activityName: "Framing Installation",
    trade: "Drywall",
    plannedDuration: 14,
    actualDuration: 13.2,
    plannedProductivity: 45.0,
    actualProductivity: 47.7,
    efficiency: 106,
    variance: -0.8,
    status: "ahead",
    tradeColor: TRADE_COLORS["Drywall"],
    isOutlier: false,
  },
  {
    activityId: "D002",
    activityName: "Tape & Mud",
    trade: "Drywall",
    plannedDuration: 10,
    actualDuration: 10.5,
    plannedProductivity: 30.0,
    actualProductivity: 28.6,
    efficiency: 95,
    variance: 0.5,
    status: "ontrack",
    tradeColor: TRADE_COLORS["Drywall"],
    isOutlier: false,
  },
  {
    activityId: "D003",
    activityName: "Texture Application",
    trade: "Drywall",
    plannedDuration: 5,
    actualDuration: 5.1,
    plannedProductivity: 20.0,
    actualProductivity: 19.6,
    efficiency: 98,
    variance: 0.1,
    status: "ontrack",
    tradeColor: TRADE_COLORS["Drywall"],
    isOutlier: false,
  },

  // Flooring (3 activities)
  {
    activityId: "F001",
    activityName: "Subfloor Preparation",
    trade: "Flooring",
    plannedDuration: 7,
    actualDuration: 6.5,
    plannedProductivity: 35.0,
    actualProductivity: 37.7,
    efficiency: 108,
    variance: -0.5,
    status: "ahead",
    tradeColor: TRADE_COLORS["Flooring"],
    isOutlier: false,
  },
  {
    activityId: "F002",
    activityName: "Tile Installation",
    trade: "Flooring",
    plannedDuration: 12,
    actualDuration: 12.8,
    plannedProductivity: 25.0,
    actualProductivity: 23.4,
    efficiency: 94,
    variance: 0.8,
    status: "behind",
    tradeColor: TRADE_COLORS["Flooring"],
    isOutlier: false,
  },
  {
    activityId: "F003",
    activityName: "Carpet Installation",
    trade: "Flooring",
    plannedDuration: 4,
    actualDuration: 3.8,
    plannedProductivity: 40.0,
    actualProductivity: 42.1,
    efficiency: 105,
    variance: -0.2,
    status: "ontrack",
    tradeColor: TRADE_COLORS["Flooring"],
    isOutlier: false,
  },

  // Concrete (2 activities)
  {
    activityId: "C001",
    activityName: "Foundation Pour",
    trade: "Concrete",
    plannedDuration: 8,
    actualDuration: 8.9,
    plannedProductivity: 50.0,
    actualProductivity: 44.9,
    efficiency: 90,
    variance: 0.9,
    status: "behind",
    tradeColor: TRADE_COLORS["Concrete"],
    isOutlier: false,
  },
  {
    activityId: "C002",
    activityName: "Slab Finishing",
    trade: "Concrete",
    plannedDuration: 6,
    actualDuration: 5.7,
    plannedProductivity: 30.0,
    actualProductivity: 31.6,
    efficiency: 105,
    variance: -0.3,
    status: "ontrack",
    tradeColor: TRADE_COLORS["Concrete"],
    isOutlier: false,
  },

  // Steel (1 activity)
  {
    activityId: "S001",
    activityName: "Steel Erection",
    trade: "Steel",
    plannedDuration: 15,
    actualDuration: 13.8,
    plannedProductivity: 18.0,
    actualProductivity: 19.6,
    efficiency: 109,
    variance: -1.2,
    status: "ahead",
    tradeColor: TRADE_COLORS["Steel"],
    isOutlier: false,
  },
]

// Components
const ProductivityMetrics: React.FC<{ data: ProductivityActivity[] }> = ({ data }) => {
  const avgEfficiency = (data.reduce((sum, item) => sum + item.efficiency, 0) / data.length).toFixed(1)
  const outlierCount = data.filter((item) => item.isOutlier).length
  const aheadCount = data.filter((item) => item.status === "ahead").length
  const behindCount = data.filter((item) => item.status === "behind").length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Avg Efficiency</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{avgEfficiency}%</div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Overall Performance
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Ahead Schedule</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{aheadCount}</div>
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          High Performers
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Behind Schedule</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{behindCount}</div>
        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
          Need Attention
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">Outliers</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{outlierCount}</div>
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          Critical Issues
        </Badge>
      </div>
    </div>
  )
}

const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProductivityActivity

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-64">
        <div className="font-medium mb-2">{data.activityName}</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span>Activity ID:</span>
            <span className="font-medium">{data.activityId}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Trade:</span>
            <span className="font-medium" style={{ color: data.tradeColor }}>
              {data.trade}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Planned Duration:</span>
            <span className="font-medium">{data.plannedDuration} days</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Actual Duration:</span>
            <span
              className={cn(
                "font-medium",
                data.actualDuration > data.plannedDuration ? "text-red-600" : "text-green-600"
              )}
            >
              {data.actualDuration} days
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Efficiency:</span>
            <span
              className={cn(
                "font-medium",
                data.efficiency < 80 ? "text-red-600" : data.efficiency > 110 ? "text-green-600" : "text-blue-600"
              )}
            >
              {data.efficiency}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Variance:</span>
            <span className={cn("font-medium", data.variance > 0 ? "text-red-600" : "text-green-600")}>
              {data.variance > 0 ? "+" : ""}
              {data.variance} days
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Status:</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                data.status === "ahead"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : data.status === "behind"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : data.status === "outlier"
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              )}
            >
              {data.status.toUpperCase()}
            </Badge>
          </div>
          {data.isOutlier && (
            <div className="pt-2 mt-2 border-t text-xs text-orange-600 font-medium">⚠️ Performance Outlier</div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const TradeClusterCard: React.FC<{ cluster: TradeCluster }> = ({ cluster }) => {
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cluster.color }} />
          <div className="font-medium">{cluster.tradeName}</div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            cluster.avgEfficiency > 100
              ? "bg-green-100 text-green-800 border-green-200"
              : cluster.avgEfficiency > 90
              ? "bg-blue-100 text-blue-800 border-blue-200"
              : "bg-red-100 text-red-800 border-red-200"
          )}
        >
          {cluster.avgEfficiency.toFixed(0)}% Avg
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Activities</div>
          <div className="font-bold">{cluster.activities.length}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Outliers</div>
          <div className="font-bold text-orange-600">{cluster.outlierCount}</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Performance</span>
          <span>{cluster.avgEfficiency.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(cluster.avgEfficiency, 100)}%`,
              backgroundColor:
                cluster.avgEfficiency > 100 ? "#10b981" : cluster.avgEfficiency > 90 ? "#3b82f6" : "#ef4444",
            }}
          />
        </div>
      </div>
    </div>
  )
}

const TradeProductivityTracker: React.FC<TradeProductivityTrackerProps> = ({
  className,
  showControls = true,
  height = 500,
}) => {
  const [useMockData, setUseMockData] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<string>("all")
  const [showOutliers, setShowOutliers] = useState(true)
  const [showReferenceLine, setShowReferenceLine] = useState(true)

  const productivityData = useMockData ? mockProductivityData : []

  // Filter data by selected trade
  const filteredData = productivityData.filter((item) => selectedTrade === "all" || item.trade === selectedTrade)

  // Calculate trade clusters
  const tradeClusters: TradeCluster[] = useMemo(() => {
    const trades = Object.keys(TRADE_COLORS)

    return trades
      .map((tradeName) => {
        const tradeActivities = productivityData.filter((item) => item.trade === tradeName)
        const avgEfficiency =
          tradeActivities.length > 0
            ? tradeActivities.reduce((sum, item) => sum + item.efficiency, 0) / tradeActivities.length
            : 0
        const outlierCount = tradeActivities.filter((item) => item.isOutlier).length

        return {
          tradeName,
          color: TRADE_COLORS[tradeName as keyof typeof TRADE_COLORS],
          activities: tradeActivities,
          avgEfficiency,
          outlierCount,
        }
      })
      .filter((cluster) => cluster.activities.length > 0)
  }, [productivityData])

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Trade Productivity Tracker</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Planned vs actual performance analysis • 20 activities
              </p>
            </div>
          </div>

          {showControls && (
            <div className="flex items-center gap-2">
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
                  <SelectItem value="Concrete">Concrete</SelectItem>
                  <SelectItem value="Steel">Steel</SelectItem>
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
                    Configure Trades
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
          {/* Productivity Metrics */}
          <ProductivityMetrics data={filteredData} />

          {/* Main Scatter Plot */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Planned vs Actual Performance</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Duration Analysis (Days)</span>
              </div>
            </div>
            <div style={{ height }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                  <XAxis
                    type="number"
                    dataKey="plannedDuration"
                    name="Planned Duration"
                    unit=" days"
                    label={{ value: "Planned Duration (Days)", position: "insideBottom", offset: -5 }}
                    fontSize={12}
                    tick={{ fill: "#666" }}
                    domain={[0, 18]}
                  />

                  <YAxis
                    type="number"
                    dataKey="actualDuration"
                    name="Actual Duration"
                    unit=" days"
                    label={{ value: "Actual Duration (Days)", angle: -90, position: "insideLeft" }}
                    fontSize={12}
                    tick={{ fill: "#666" }}
                    domain={[0, 18]}
                  />

                  <Tooltip content={<CustomScatterTooltip />} />

                  <Legend />

                  {/* Reference line for perfect performance (y = x) */}
                  {showReferenceLine && (
                    <ReferenceLine
                      segment={[
                        { x: 0, y: 0 },
                        { x: 18, y: 18 },
                      ]}
                      stroke="#94a3b8"
                      strokeDasharray="3,3"
                    />
                  )}

                  {/* Scatter points for each trade */}
                  {Object.keys(TRADE_COLORS).map((tradeName) => {
                    const tradeData = filteredData.filter((item) => item.trade === tradeName)
                    if (tradeData.length === 0) return null

                    return (
                      <Scatter
                        key={tradeName}
                        name={tradeName}
                        data={tradeData}
                        fill={TRADE_COLORS[tradeName as keyof typeof TRADE_COLORS]}
                      >
                        {tradeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.tradeColor}
                            stroke={entry.isOutlier ? "#ef4444" : entry.tradeColor}
                            strokeWidth={entry.isOutlier ? 3 : 1}
                            r={entry.isOutlier ? 8 : 6}
                          />
                        ))}
                      </Scatter>
                    )
                  })}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trade Cluster Analysis */}
          <div className="space-y-4">
            <h4 className="font-medium">Trade Performance Clusters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tradeClusters.map((cluster) => (
                <TradeClusterCard key={cluster.tradeName} cluster={cluster} />
              ))}
            </div>
          </div>

          {/* Performance Legend */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Ahead Schedule (&lt; planned)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">On Track (≈ planned)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Behind Schedule ({">"} planned)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-red-500" />
              <span className="text-sm">Outliers (Critical variance)</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch checked={useMockData} onCheckedChange={setUseMockData} />
              <span className="text-sm">Mock Data</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showOutliers} onCheckedChange={setShowOutliers} />
              <span className="text-sm">Highlight Outliers</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={showReferenceLine} onCheckedChange={setShowReferenceLine} />
              <span className="text-sm">Reference Line</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
              <Activity className="h-4 w-4" />
              <span>20 Activities • 7 Trades • Scatter Analysis</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TradeProductivityTracker
