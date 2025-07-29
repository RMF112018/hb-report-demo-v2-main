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

interface BetaBDCommercialPipelineCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDCommercialPipelineCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDCommercialPipelineCardProps) {
  // Use Unanet data hook
  const { pursuits, lastSynced, isLoading: dataLoading, error, refetch } = useUnanetData()

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

  const [activeTab, setActiveTab] = useState("pipeline")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Helper functions - defined before useMemo to avoid hoisting issues
  const getStageColor = (stage: string) => {
    const colors = {
      SD: "#FF6B6B",
      DD: "#4ECDC4",
      CD: "#45B7D1",
      BID: "#96CEB4",
      CONSTRUCTION: "#FFEAA7",
    }
    return colors[stage as keyof typeof colors] || "#95A5A6"
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

  // Process commercial pipeline data
  const pipelineData = React.useMemo(() => {
    const commercialPursuits = pursuits.filter(
      (pursuit: UnanetPursuit) => pursuit.status === "active" || pursuit.status === "submitted"
    )

    // Calculate total active pursuits
    const totalActivePursuits = commercialPursuits.length

    // Calculate weighted pipeline value by stage
    const stageWeights = {
      SD: 0.2, // Schematic Design
      DD: 0.4, // Design Development
      CD: 0.6, // Construction Documents
      BID: 0.8, // Bidding
      CONSTRUCTION: 1.0, // Construction
    }

    const weightedPipelineValue = commercialPursuits.reduce((total: number, pursuit: UnanetPursuit) => {
      const weight = stageWeights[pursuit.stage as keyof typeof stageWeights] || 0.3
      return total + pursuit.value * weight
    }, 0)

    // Calculate win rate trend (mock data for 12 months)
    const winRateTrend = [
      { month: "Jan", winRate: 65, pursuits: 8 },
      { month: "Feb", winRate: 68, pursuits: 12 },
      { month: "Mar", winRate: 72, pursuits: 15 },
      { month: "Apr", winRate: 70, pursuits: 18 },
      { month: "May", winRate: 75, pursuits: 22 },
      { month: "Jun", winRate: 78, pursuits: 25 },
      { month: "Jul", winRate: 82, pursuits: 28 },
      { month: "Aug", winRate: 80, pursuits: 30 },
      { month: "Sep", winRate: 85, pursuits: 32 },
      { month: "Oct", winRate: 88, pursuits: 35 },
      { month: "Nov", winRate: 85, pursuits: 38 },
      { month: "Dec", winRate: 90, pursuits: 42 },
    ]

    // Top 5 clients by volume
    const clientVolume = commercialPursuits.reduce((acc: Record<string, number>, pursuit: UnanetPursuit) => {
      acc[pursuit.client] = (acc[pursuit.client] || 0) + pursuit.value
      return acc
    }, {} as Record<string, number>)

    const topClients = Object.entries(clientVolume)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([client, value]) => ({
        name: client,
        value: (value as number) / 1000000, // Convert to millions
        opportunities: commercialPursuits.filter((p: UnanetPursuit) => p.client === client).length,
      }))

    // Pursuit stage distribution
    const stageDistribution = commercialPursuits.reduce((acc: Record<string, number>, pursuit: UnanetPursuit) => {
      acc[pursuit.stage] = (acc[pursuit.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const stageChartData = Object.entries(stageDistribution).map(([stage, count]) => ({
      name: stage,
      value: count,
      fill: getStageColor(stage),
    }))

    // Market sectors (mock data based on project types)
    const marketSectors = [
      { name: "Healthcare", value: 45.2, opportunities: 8 },
      { name: "Education", value: 32.8, opportunities: 6 },
      { name: "Mixed-Use", value: 28.5, opportunities: 5 },
      { name: "Office", value: 22.1, opportunities: 4 },
      { name: "Retail", value: 18.7, opportunities: 3 },
    ]

    return {
      totalActivePursuits,
      weightedPipelineValue,
      winRateTrend,
      topClients,
      stageChartData,
      marketSectors,
      lastUpdated: new Date(),
    }
  }, [pursuits])

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
            <div className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20`}>
              <BarChartIcon className={`${compactScale.iconSize} text-blue-600 dark:text-blue-400`} />
            </div>
            <div>
              <CardTitle className={`${compactScale.textTitle} font-semibold text-gray-900 dark:text-white`}>
                Commercial Pipeline Analytics
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
              <Zap className={`${compactScale.iconSizeSmall} text-yellow-500`} />
              <span className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                {pipelineData.totalActivePursuits} active pursuits
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-refresh" className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
              Auto-refresh
            </Label>
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
          </div>
        </div>
      </CardHeader>

      <CardContent className={`${compactScale.padding} pt-4`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pipeline" className={`${compactScale.textSmall}`}>
              <BarChartIcon className={`${compactScale.iconSizeSmall} mr-1`} />
              Pipeline Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className={`${compactScale.textSmall}`}>
              <LineChartIcon className={`${compactScale.iconSizeSmall} mr-1`} />
              Win Rate Trend
            </TabsTrigger>
            <TabsTrigger value="market" className={`${compactScale.textSmall}`}>
              <PieChartIcon className={`${compactScale.iconSizeSmall} mr-1`} />
              Market Focus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4 mt-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-blue-600 dark:text-blue-400 font-medium`}>
                      Active Pursuits
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-blue-900 dark:text-blue-100`}>
                      {pipelineData.totalActivePursuits}
                    </p>
                  </div>
                  <Target className={`${compactScale.iconSize} text-blue-600 dark:text-blue-400`} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-green-600 dark:text-green-400 font-medium`}>
                      Weighted Pipeline
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-green-900 dark:text-green-100`}>
                      {formatMillions(pipelineData.weightedPipelineValue)}
                    </p>
                  </div>
                  <DollarSign className={`${compactScale.iconSize} text-green-600 dark:text-green-400`} />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-purple-600 dark:text-purple-400 font-medium`}>
                      Win Rate
                    </p>
                    <p className={`${compactScale.textTitle} font-bold text-purple-900 dark:text-purple-100`}>
                      {pipelineData.winRateTrend[pipelineData.winRateTrend.length - 1]?.winRate || 0}%
                    </p>
                  </div>
                  <TrendingUp className={`${compactScale.iconSize} text-purple-600 dark:text-purple-400`} />
                </div>
              </div>
            </div>

            {/* Top Clients Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                Top 5 Clients by Volume
              </h4>
              <div className={`${compactScale.chartHeight}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData.topClients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <YAxis
                      label={{ value: "Pipeline Value ($M)", angle: -90, position: "insideLeft" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <RechartsTooltip
                      formatter={(value: any, name: any) => [
                        name === "value" ? `$${value}M` : value,
                        name === "value" ? "Pipeline Value" : "Opportunities",
                      ]}
                    />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Stage Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Pursuit Stage Distribution
                </h4>
                <div className={`${compactScale.chartHeight}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pipelineData.stageChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pipelineData.stageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any, name: any) => [`${value} pursuits`, name]}
                        labelFormatter={(label: any) => `Stage: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Stage Insights
                </h4>
                <div className="space-y-3">
                  {pipelineData.stageChartData.map((stage, index) => (
                    <div key={stage.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.fill }} />
                        <span className={`${compactScale.textSmall} font-medium text-gray-700 dark:text-gray-300`}>
                          {stage.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                          {stage.value}
                        </div>
                        <div className={`${compactScale.textSmall} text-gray-500`}>pursuits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            {/* Win Rate Trend Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                12-Month Win Rate Trend
              </h4>
              <div className={`${compactScale.chartHeight}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={pipelineData.winRateTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10} />
                    <YAxis
                      yAxisId="left"
                      label={{ value: "Win Rate (%)", angle: -90, position: "insideLeft" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{ value: "Pursuits", angle: 90, position: "insideRight" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <RechartsTooltip
                      formatter={(value: any, name: any) => [
                        name === "winRate" ? `${value}%` : value,
                        name === "winRate" ? "Win Rate" : "Pursuits",
                      ]}
                    />
                    <Line type="monotone" dataKey="winRate" stroke="#3B82F6" strokeWidth={2} yAxisId="left" />
                    <Bar dataKey="pursuits" fill="#10B981" opacity={0.3} yAxisId="right" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Performance Insights
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className={`${compactScale.iconSizeSmall} text-green-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Win Rate Trend
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        +
                        {pipelineData.winRateTrend[pipelineData.winRateTrend.length - 1]?.winRate -
                          pipelineData.winRateTrend[0]?.winRate}
                        % improvement
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Activity className={`${compactScale.iconSizeSmall} text-blue-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Pursuit Growth
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        +
                        {pipelineData.winRateTrend[pipelineData.winRateTrend.length - 1]?.pursuits -
                          pipelineData.winRateTrend[0]?.pursuits}{" "}
                        new pursuits
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className={`${compactScale.iconSizeSmall} text-purple-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Current Target
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        95% win rate by Q2 2025
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Key Metrics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                      Average Win Rate
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      {Math.round(
                        pipelineData.winRateTrend.reduce((sum, item) => sum + item.winRate, 0) /
                          pipelineData.winRateTrend.length
                      )}
                      %
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                      Peak Performance
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      {Math.max(...pipelineData.winRateTrend.map((item) => item.winRate))}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>Total Pursuits</span>
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                    >
                      {pipelineData.winRateTrend.reduce((sum, item) => sum + item.pursuits, 0)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4 mt-4">
            {/* Market Sectors Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                Market Sector Distribution
              </h4>
              <div className={`${compactScale.chartHeight}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData.marketSectors}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <YAxis
                      label={{ value: "Pipeline Value ($M)", angle: -90, position: "insideLeft" }}
                      fontSize={compactScale.textSmall === "text-[10px]" ? 8 : 10}
                    />
                    <RechartsTooltip
                      formatter={(value: any, name: any) => [
                        name === "value" ? `$${value}M` : value,
                        name === "value" ? "Pipeline Value" : "Opportunities",
                      ]}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Top Performing Sectors
                </h4>
                <div className="space-y-3">
                  {pipelineData.marketSectors.slice(0, 3).map((sector, index) => (
                    <div key={sector.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                          }`}
                        />
                        <span className={`${compactScale.textSmall} font-medium text-gray-700 dark:text-gray-300`}>
                          {sector.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                          ${sector.value.toFixed(1)}M
                        </div>
                        <div className={`${compactScale.textSmall} text-gray-500`}>{sector.opportunities} ops</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className={`${compactScale.textMedium} font-semibold mb-3 text-gray-900 dark:text-white`}>
                  Market Intelligence
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Building2 className={`${compactScale.iconSizeSmall} text-blue-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Healthcare Focus
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        Leading sector with ${pipelineData.marketSectors[0]?.value.toFixed(1)}M pipeline
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className={`${compactScale.iconSizeSmall} text-green-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Growth Opportunity
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        Education sector showing 15% growth trend
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className={`${compactScale.iconSizeSmall} text-purple-500 mt-0.5`} />
                    <div>
                      <div className={`${compactScale.textSmall} font-medium text-gray-900 dark:text-white`}>
                        Strategic Focus
                      </div>
                      <div className={`${compactScale.textSmall} text-gray-600 dark:text-gray-400`}>
                        Mixed-use projects gaining momentum
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
