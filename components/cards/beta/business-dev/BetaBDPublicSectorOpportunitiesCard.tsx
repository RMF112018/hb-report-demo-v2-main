"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  Map,
  FileText,
  Flag,
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

// Import Unanet data hook
import { useUnanetData, UnanetPursuit } from "@/hooks/use-unanet-data"

interface BetaBDPublicSectorOpportunitiesCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDPublicSectorOpportunitiesCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDPublicSectorOpportunitiesCardProps) {
  // Use Unanet data hook
  const { pursuits, proposals, lastSynced, isLoading: dataLoading, error, refetch } = useUnanetData()

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

  const [activeTab, setActiveTab] = useState("opportunities")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        refetch()
      }, 30000) // 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh, refetch])

  // Process public sector data
  const publicSectorData = React.useMemo(() => {
    // Filter for public sector opportunities (government, municipal, etc.)
    const publicPursuits = pursuits.filter(
      (pursuit: UnanetPursuit) => pursuit.clientType === "public" || pursuit.status === "active"
    )

    // Mock Florida regional data
    const floridaRegions = [
      { county: "Miami-Dade", rfps: 12, rfqs: 8, proposals: 15, hitRate: 78, avgResponse: 3.2 },
      { county: "Broward", rfps: 9, rfqs: 6, proposals: 12, hitRate: 72, avgResponse: 2.8 },
      { county: "Palm Beach", rfps: 7, rfqs: 4, proposals: 9, hitRate: 85, avgResponse: 2.5 },
      { county: "Hillsborough", rfps: 11, rfqs: 7, proposals: 14, hitRate: 69, avgResponse: 3.5 },
      { county: "Orange", rfps: 8, rfqs: 5, proposals: 11, hitRate: 76, avgResponse: 2.9 },
      { county: "Pinellas", rfps: 6, rfqs: 3, proposals: 8, hitRate: 82, avgResponse: 2.3 },
    ]

    // Proposal activity over time (last 12 months)
    const proposalActivity = [
      { month: "Jan", rfps: 8, rfqs: 5, proposals: 12, submissions: 9 },
      { month: "Feb", rfps: 10, rfqs: 6, proposals: 15, submissions: 11 },
      { month: "Mar", rfps: 12, rfqs: 8, proposals: 18, submissions: 14 },
      { month: "Apr", rfps: 9, rfqs: 7, proposals: 16, submissions: 12 },
      { month: "May", rfps: 11, rfqs: 9, proposals: 20, submissions: 16 },
      { month: "Jun", rfps: 14, rfqs: 10, proposals: 22, submissions: 18 },
      { month: "Jul", rfps: 13, rfqs: 8, proposals: 19, submissions: 15 },
      { month: "Aug", rfps: 15, rfqs: 11, proposals: 24, submissions: 20 },
      { month: "Sep", rfps: 12, rfqs: 9, proposals: 21, submissions: 17 },
      { month: "Oct", rfps: 16, rfqs: 12, proposals: 26, submissions: 22 },
      { month: "Nov", rfps: 14, rfqs: 10, proposals: 23, submissions: 19 },
      { month: "Dec", rfps: 18, rfqs: 13, proposals: 28, submissions: 24 },
    ]

    // Hit rate trends (YOY comparison)
    const hitRateTrends = [
      { quarter: "Q1 2024", current: 72, previous: 68, target: 75 },
      { quarter: "Q2 2024", current: 75, previous: 71, target: 75 },
      { quarter: "Q3 2024", current: 78, previous: 73, target: 75 },
      { quarter: "Q4 2024", current: 82, previous: 76, target: 75 },
    ]

    // Calculate totals
    const totalRfps = floridaRegions.reduce((sum, region) => sum + region.rfps, 0)
    const totalRfqs = floridaRegions.reduce((sum, region) => sum + region.rfqs, 0)
    const totalProposals = floridaRegions.reduce((sum, region) => sum + region.proposals, 0)
    const avgHitRate = Math.round(
      floridaRegions.reduce((sum, region) => sum + region.hitRate, 0) / floridaRegions.length
    )
    const avgResponseTime = (
      floridaRegions.reduce((sum, region) => sum + region.avgResponse, 0) / floridaRegions.length
    ).toFixed(1)

    return {
      floridaRegions,
      proposalActivity,
      hitRateTrends,
      totalRfps,
      totalRfqs,
      totalProposals,
      avgHitRate,
      avgResponseTime,
      lastUpdated: new Date(),
    }
  }, [pursuits, proposals])

  const getRegionColor = (hitRate: number) => {
    if (hitRate >= 80) return "#10B981" // Green
    if (hitRate >= 70) return "#F59E0B" // Yellow
    return "#EF4444" // Red
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMillions = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`
  }

  const handleRefresh = () => {
    refetch()
  }

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      <CardHeader className={`${compactScale.paddingCard} border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20`}>
              <Building2 className={`${compactScale.iconSize} text-purple-600 dark:text-purple-400`} />
            </div>
            <div>
              <CardTitle className={`${compactScale.textTitle} font-semibold text-gray-900 dark:text-white`}>
                Public Sector Opportunities
              </CardTitle>
              <CardDescription className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                Power BI embedded insights from Unanet API
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
            >
              <Database className={`${compactScale.iconSizeSmall} mr-1`} />
              Unanet Sync
            </Badge>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={dataLoading} className="h-8">
              <RefreshCw className={`${compactScale.iconSizeSmall} ${dataLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className={`${compactScale.iconSizeSmall} text-green-500`} />
              <span className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                Last synced: {lastSynced.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Flag className={`${compactScale.iconSizeSmall} text-blue-500`} />
              <span className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>Florida Focus</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="auto-refresh-public"
              className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}
            >
              Auto-refresh
            </Label>
            <Switch id="auto-refresh-public" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
        </div>
      </CardHeader>

      <CardContent className={`${compactScale.padding} pt-4`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="opportunities" className={`${compactScale.textSmall}`}>
              <BarChartIcon className={`${compactScale.iconSizeSmall} mr-1`} />
              Active Opportunities
            </TabsTrigger>
            <TabsTrigger value="history" className={`${compactScale.textSmall}`}>
              <LineChartIcon className={`${compactScale.iconSizeSmall} mr-1`} />
              Proposal History
            </TabsTrigger>
            <TabsTrigger value="trends" className={`${compactScale.textSmall}`}>
              <PieChartIcon className={`${compactScale.iconSizeSmall} mr-1`} />
              Regional Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-purple-600 dark:text-purple-400 font-medium`}>
                      Open RFPs
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-purple-900 dark:text-purple-100`}>
                      {publicSectorData.totalRfps}
                    </p>
                  </div>
                  <FileText className={`${compactScale.iconSize} text-purple-600 dark:text-purple-400`} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-blue-600 dark:text-blue-400 font-medium`}>
                      Active RFQs
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-blue-900 dark:text-blue-100`}>
                      {publicSectorData.totalRfqs}
                    </p>
                  </div>
                  <Building2 className={`${compactScale.iconSize} text-blue-600 dark:text-blue-400`} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-green-600 dark:text-green-400 font-medium`}>
                      Hit Rate
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-green-900 dark:text-green-100`}>
                      {publicSectorData.avgHitRate}%
                    </p>
                  </div>
                  <Target className={`${compactScale.iconSize} text-green-600 dark:text-green-400`} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-orange-600 dark:text-orange-400 font-medium`}>
                      Avg Response
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-orange-900 dark:text-orange-100`}>
                      {publicSectorData.avgResponseTime} days
                    </p>
                  </div>
                  <Clock className={`${compactScale.iconSize} text-orange-600 dark:text-orange-400`} />
                </div>
              </div>
            </div>

            {/* Florida Regional Map */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4
                className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2`}
              >
                <Map className={`${compactScale.iconSizeSmall} text-purple-600`} />
                Florida Regional Opportunities
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {publicSectorData.floridaRegions.map((region, index) => (
                  <div
                    key={region.county}
                    className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getRegionColor(region.hitRate) }}
                      />
                      <span className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        {region.county}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        RFPs: {region.rfps}
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        RFQs: {region.rfqs}
                      </div>
                      <Badge
                        variant="outline"
                        className={`${compactScale.textSmall} ${
                          region.hitRate >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : region.hitRate >= 70
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {region.hitRate}% hit
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Performance Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                Regional Performance Overview
              </h4>
              <div className={`${compactScale.chartHeight}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={publicSectorData.floridaRegions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="county"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <YAxis
                      label={{ value: "Count", angle: -90, position: "insideLeft" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <RechartsTooltip />
                    <Bar dataKey="rfps" fill="#8B5CF6" name="RFPs" />
                    <Bar dataKey="rfqs" fill="#3B82F6" name="RFQs" />
                    <Bar dataKey="proposals" fill="#10B981" name="Proposals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            {/* Proposal Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4
                className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2`}
              >
                <Calendar className={`${compactScale.iconSizeSmall} text-blue-600`} />
                12-Month Proposal Activity
              </h4>
              <div className={`${compactScale.chartHeight}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={publicSectorData.proposalActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10} />
                    <YAxis
                      yAxisId="left"
                      label={{ value: "Count", angle: -90, position: "insideLeft" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{ value: "Submissions", angle: 90, position: "insideRight" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <RechartsTooltip />
                    <Bar yAxisId="left" dataKey="rfps" fill="#8B5CF6" name="RFPs" />
                    <Bar yAxisId="left" dataKey="rfqs" fill="#3B82F6" name="RFQs" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="submissions"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Submissions"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Monthly Activity Summary
                </h4>
                <div className="space-y-3">
                  {publicSectorData.proposalActivity.slice(-3).map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0 ? "bg-green-500" : index === 1 ? "bg-blue-500" : "bg-purple-500"
                          }`}
                        />
                        <span className={`${compactScale.textSmall} font-medium text-gray-700 dark:text-gray-300`}>
                          {month.month}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                          {month.submissions} submissions
                        </div>
                        <div className={`${compactScale.textSmall} text-gray-500`}>{month.proposals} proposals</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Performance Insights
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className={`${compactScale.iconSizeSmall} text-green-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Growth Trend
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        +
                        {Math.round(
                          ((publicSectorData.proposalActivity[publicSectorData.proposalActivity.length - 1]
                            .submissions -
                            publicSectorData.proposalActivity[0].submissions) /
                            publicSectorData.proposalActivity[0].submissions) *
                            100
                        )}
                        % from Jan
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className={`${compactScale.iconSizeSmall} text-blue-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Success Rate
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        {publicSectorData.avgHitRate}% average hit rate
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className={`${compactScale.iconSizeSmall} text-purple-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Response Time
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        {publicSectorData.avgResponseTime} days average
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            {/* Hit Rate Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4
                className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2`}
              >
                <Target className={`${compactScale.iconSizeSmall} text-green-600`} />
                Hit Rate Trends (YOY)
              </h4>
              <div className={`${compactScale.chartHeight}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={publicSectorData.hitRateTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10} />
                    <YAxis
                      label={{ value: "Hit Rate (%)", angle: -90, position: "insideLeft" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="current" stroke="#10B981" strokeWidth={3} name="Current Year" />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      stroke="#6B7280"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Previous Year"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      name="Target"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Top Performing Regions
                </h4>
                <div className="space-y-3">
                  {[...publicSectorData.floridaRegions]
                    .sort((a, b) => b.hitRate - a.hitRate)
                    .slice(0, 3)
                    .map((region, index) => (
                      <div key={region.county} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                            }`}
                          />
                          <span className={`${compactScale.textSmall} font-medium text-gray-700 dark:text-gray-300`}>
                            {region.county}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                            {region.hitRate}%
                          </div>
                          <div className={`${compactScale.textSmall} text-gray-500`}>{region.proposals} proposals</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Regional Insights
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className={`${compactScale.iconSizeSmall} text-blue-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Geographic Focus
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        {publicSectorData.floridaRegions.length} Florida counties
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className={`${compactScale.iconSizeSmall} text-green-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Growth Opportunity
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        Palm Beach leading with{" "}
                        {publicSectorData.floridaRegions.find((r) => r.county === "Palm Beach")?.hitRate}% hit rate
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className={`${compactScale.iconSizeSmall} text-purple-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Government Focus
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        Municipal and county-level opportunities
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
