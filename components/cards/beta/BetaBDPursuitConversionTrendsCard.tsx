"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Building2,
  Activity,
  Timer,
  Bell,
  Sparkles,
  Clock,
  Users,
  MapPin,
  Calendar,
  Star,
  Award,
  Briefcase,
  Database,
  Zap,
  Lightbulb,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  X,
  Filter,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface PursuitData {
  month: string
  pursuitVolume: number
  winRate: number
  marketType: string
  outcome: "Won" | "Lost"
  reasonLost?: string
}

interface BetaBDPursuitConversionTrendsCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDPursuitConversionTrendsCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDPursuitConversionTrendsCardProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  const [activeTab, setActiveTab] = useState("trends")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock Unanet CRM data for pursuit conversion trends
  const pursuitData = useMemo(
    () => [
      {
        month: "Oct 2024",
        pursuitVolume: 12,
        winRate: 58,
        marketType: "Commercial",
        outcome: "Won",
        reasonLost: undefined,
      },
      { month: "Nov 2024", pursuitVolume: 15, winRate: 62, marketType: "Civic", outcome: "Lost", reasonLost: "Fee" },
      {
        month: "Dec 2024",
        pursuitVolume: 18,
        winRate: 55,
        marketType: "Education",
        outcome: "Won",
        reasonLost: undefined,
      },
      {
        month: "Jan 2025",
        pursuitVolume: 14,
        winRate: 64,
        marketType: "Healthcare",
        outcome: "Lost",
        reasonLost: "Experience",
      },
      {
        month: "Feb 2025",
        pursuitVolume: 16,
        winRate: 59,
        marketType: "Commercial",
        outcome: "Won",
        reasonLost: undefined,
      },
      {
        month: "Mar 2025",
        pursuitVolume: 20,
        winRate: 67,
        marketType: "Civic",
        outcome: "Lost",
        reasonLost: "Relationship",
      },
    ],
    []
  )

  // Mock loss reasons data
  const lossReasonsData = useMemo(
    () => [
      { reason: "Fee", count: 8, percentage: 35 },
      { reason: "Relationship", count: 6, percentage: 26 },
      { reason: "Experience", count: 5, percentage: 22 },
      { reason: "Timeline", count: 3, percentage: 13 },
      { reason: "Other", count: 1, percentage: 4 },
    ],
    []
  )

  // Market sector win rates
  const marketSectorData = useMemo(
    () => [
      { sector: "Commercial", winRate: 62, pursuits: 15 },
      { sector: "Civic", winRate: 58, pursuits: 12 },
      { sector: "Education", winRate: 71, pursuits: 8 },
      { sector: "Healthcare", winRate: 55, pursuits: 10 },
      { sector: "Industrial", winRate: 65, pursuits: 6 },
    ],
    []
  )

  // Chart colors
  const chartColors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#8B5CF6",
    warning: "#F59E0B",
    danger: "#EF4444",
    success: "#22C55E",
  }

  // Helper functions
  const formatPercentage = (value: number) => `${value}%`
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const totalPursuits = pursuitData.reduce((sum, item) => sum + item.pursuitVolume, 0)
    const avgWinRate = pursuitData.reduce((sum, item) => sum + item.winRate, 0) / pursuitData.length
    const totalWins = pursuitData.filter((item) => item.outcome === "Won").length
    const totalLosses = pursuitData.filter((item) => item.outcome === "Lost").length

    return {
      totalPursuits,
      avgWinRate: Math.round(avgWinRate),
      totalWins,
      totalLosses,
    }
  }, [pursuitData])

  return (
    <Card
      className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={`${compactScale.iconSize} text-blue-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Pursuit Conversion Trends
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            CRM Insights via Unanet
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Historical win/loss conversion rates and market insights
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>{overallMetrics.avgWinRate}%</div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Avg Win Rate</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>{overallMetrics.totalPursuits}</div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total Pursuits</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trends" className="text-xs">
              Monthly Trends
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">
              Loss Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            {/* Dual Axis Chart - Volume and Win Rate */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={pursuitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={compactScale.textSmall} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    stroke="#64748B"
                    fontSize={compactScale.textSmall}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748B"
                    fontSize={compactScale.textSmall}
                    tickLine={false}
                    axisLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                  />
                  <Bar yAxisId="left" dataKey="pursuitVolume" fill={chartColors.primary} radius={[2, 2, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="winRate"
                    stroke={chartColors.success}
                    strokeWidth={2}
                    dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Market Sector Win Rates */}
            <div className="space-y-3">
              <h4 className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                Win Rate by Market Sector
              </h4>
              <div className="space-y-2">
                {marketSectorData.map((sector, index) => (
                  <div
                    key={sector.sector}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: chartColors.primary }}></div>
                      <span className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {sector.sector}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {sector.winRate}%
                      </span>
                      <span className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        ({sector.pursuits} pursuits)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {/* Loss Reasons Pie Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lossReasonsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {lossReasonsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={Object.values(chartColors)[index % Object.values(chartColors).length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [
                      `${value} (${lossReasonsData.find((item) => item.count === value)?.percentage}%)`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Loss Reasons */}
            <div className="space-y-3">
              <h4 className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                Top Loss Reasons
              </h4>
              <div className="space-y-2">
                {lossReasonsData.slice(0, 3).map((reason, index) => (
                  <div
                    key={reason.reason}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full`}
                        style={{
                          backgroundColor: Object.values(chartColors)[index % Object.values(chartColors).length],
                        }}
                      ></div>
                      <span className={`${compactScale.textMedium} text-slate-900 dark:text-slate-100`}>
                        {reason.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {reason.count}
                      </span>
                      <span className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        ({reason.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} className="scale-75" />
            <Label className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Auto-refresh</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100`}
          >
            <RefreshCw className={`${compactScale.iconSizeSmall} mr-1`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
