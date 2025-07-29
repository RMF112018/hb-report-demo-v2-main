"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  RefreshCw,
  ExternalLink,
  Star,
  Award,
  Briefcase,
  Database,
  Zap,
  Lightbulb,
  Filter,
  User,
  Building,
  Timer,
  Bell,
  Sparkles,
  MapPin,
  Users,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface VolumeTrendData {
  monthlyEstimates: {
    month: string
    submitted: number
    awarded: number
    pending: number
    value: number
  }[]
  ytdMetrics: {
    totalSubmitted: number
    totalValue: number
    awardedCount: number
    pendingCount: number
    awardedValue: number
    pendingValue: number
  }
  projectedMetrics: {
    q3Projected: number
    q4Projected: number
    totalProjected: number
  }
  statusBreakdown: {
    status: string
    count: number
    value: number
    percentage: number
    color: string
  }[]
}

interface BetaEstimateVolumeTrendCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaEstimateVolumeTrendCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaEstimateVolumeTrendCardProps) {
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

  // Mock data for estimate volume trends
  const volumeData = useMemo(
    (): VolumeTrendData => ({
      monthlyEstimates: [
        { month: "Jan", submitted: 12, awarded: 8, pending: 4, value: 85000000 },
        { month: "Feb", submitted: 15, awarded: 10, pending: 5, value: 125000000 },
        { month: "Mar", submitted: 18, awarded: 12, pending: 6, value: 168000000 },
        { month: "Apr", submitted: 22, awarded: 15, pending: 7, value: 201000000 },
        { month: "May", submitted: 25, awarded: 18, pending: 7, value: 246000000 },
        { month: "Jun", submitted: 28, awarded: 20, pending: 8, value: 283000000 },
        { month: "Jul", submitted: 24, awarded: 16, pending: 8, value: 245000000 },
        { month: "Aug", submitted: 26, awarded: 18, pending: 8, value: 268000000 },
      ],
      ytdMetrics: {
        totalSubmitted: 166,
        totalValue: 1566000000,
        awardedCount: 107,
        pendingCount: 59,
        awardedValue: 1058000000,
        pendingValue: 508000000,
      },
      projectedMetrics: {
        q3Projected: 320000000,
        q4Projected: 380000000,
        totalProjected: 700000000,
      },
      statusBreakdown: [
        { status: "Awarded", count: 107, value: 1058000000, percentage: 64, color: "#10B981" },
        { status: "Pending", count: 59, value: 508000000, percentage: 36, color: "#F59E0B" },
      ],
    }),
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
    pending: "#F59E0B",
    awarded: "#10B981",
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <Card
      className={`bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className={`${compactScale.iconSize} text-purple-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Estimate Volume Trends
            </CardTitle>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
          >
            YTD + Projected
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Estimating workload and value trend analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-purple-600`}>
              {formatNumber(volumeData.ytdMetrics.totalSubmitted)}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Estimates YTD</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>
              {formatCurrency(volumeData.ytdMetrics.totalValue)}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total Value</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className={`${compactScale.textMedium} font-medium text-green-700 dark:text-green-300`}>
              {volumeData.ytdMetrics.awardedCount}
            </div>
            <div className={`${compactScale.textSmall} text-green-600 dark:text-green-400`}>
              Awarded ({Math.round((volumeData.ytdMetrics.awardedCount / volumeData.ytdMetrics.totalSubmitted) * 100)}%)
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
            <div className={`${compactScale.textMedium} font-medium text-yellow-700 dark:text-yellow-300`}>
              {volumeData.ytdMetrics.pendingCount}
            </div>
            <div className={`${compactScale.textSmall} text-yellow-600 dark:text-yellow-400`}>
              Pending ({Math.round((volumeData.ytdMetrics.pendingCount / volumeData.ytdMetrics.totalSubmitted) * 100)}%)
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trends" className="text-xs">
              Monthly Trends
            </TabsTrigger>
            <TabsTrigger value="projections" className="text-xs">
              Projections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            {/* Stacked Column Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData.monthlyEstimates}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={compactScale.textSmall} />
                  <YAxis stroke="#64748B" fontSize={compactScale.textSmall} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [
                      name === "awarded" ? `${value} awarded` : `${value} pending`,
                      name === "awarded" ? "Awarded" : "Pending",
                    ]}
                  />
                  <Bar dataKey="awarded" stackId="a" fill={chartColors.awarded} radius={[0, 0, 4, 4]} />
                  <Bar dataKey="pending" stackId="a" fill={chartColors.pending} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ring Chart for Status Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`${compactScale.chartHeight} w-full`}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={volumeData.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={40}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {volumeData.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        fontSize: compactScale.textSmall,
                      }}
                      formatter={(value, name) => [value, "Count"]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {volumeData.statusBreakdown.map((status) => (
                  <div
                    key={status.status}
                    className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {status.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {status.count}
                      </div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        {status.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            {/* Projected Metrics */}
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`${compactScale.iconSizeSmall} text-blue-600`} />
                  <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                    Q3 Projected
                  </span>
                </div>
                <div className={`${compactScale.textTitle} font-bold text-blue-600`}>
                  {formatCurrency(volumeData.projectedMetrics.q3Projected)}
                </div>
                <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                  Estimated volume for Q3
                </div>
              </div>

              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Target className={`${compactScale.iconSizeSmall} text-green-600`} />
                  <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                    Q4 Projected
                  </span>
                </div>
                <div className={`${compactScale.textTitle} font-bold text-green-600`}>
                  {formatCurrency(volumeData.projectedMetrics.q4Projected)}
                </div>
                <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                  Estimated volume for Q4
                </div>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`${compactScale.iconSizeSmall} text-purple-600`} />
                  <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                    Total Projected
                  </span>
                </div>
                <div className={`${compactScale.textTitle} font-bold text-purple-600`}>
                  {formatCurrency(volumeData.projectedMetrics.totalProjected)}
                </div>
                <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                  Q3 + Q4 combined projection
                </div>
              </div>
            </div>

            {/* Projection Summary */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className={`${compactScale.iconSizeSmall} text-slate-600`} />
                <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                  Projection Summary
                </span>
              </div>
              <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                Projected volume represents a{" "}
                {Math.round(
                  (volumeData.projectedMetrics.totalProjected / volumeData.ytdMetrics.totalValue) * 100 - 100
                )}
                % increase over YTD performance
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
