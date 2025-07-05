"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Building2,
  Home,
  MapPin,
  Clock,
  Trophy,
  X,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ResponsiveContainer,
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Import the pipeline data
import pipelineData from "@/data/mock/precon/pipeline.json"

interface PipelineAnalyticsProps {
  card?: { id: string; type: string; title: string }
  config?: any
  span?: { cols: number; rows: number }
  isCompact?: boolean
}

const COLORS = {
  primary: "hsl(var(--chart-2))",
  secondary: "hsl(var(--chart-5))",
  success: "hsl(var(--chart-1))",
  warning: "hsl(var(--chart-3))",
  danger: "hsl(var(--chart-4))",
  residential: "#06b6d4",
  commercial: "hsl(var(--chart-5))",
}

const STAGE_COLORS = ["hsl(var(--chart-4))", "hsl(var(--chart-3))", "hsl(var(--chart-2))", "hsl(var(--chart-1))"]

export function PipelineAnalytics({ card, config = {}, span, isCompact = false }: PipelineAnalyticsProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    if (!card) return

    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === "pipeline-analytics") {
        const shouldShow = event.detail.action === "show"
        setShowDrillDown(shouldShow)

        // Notify wrapper of state change
        const stateEvent = new CustomEvent("cardDrillDownStateChange", {
          detail: {
            cardId: card.id,
            cardType: "pipeline-analytics",
            isActive: shouldShow,
          },
        })
        window.dispatchEvent(stateEvent)
      }
    }

    window.addEventListener("cardDrillDown", handleDrillDownEvent as EventListener)

    return () => {
      window.removeEventListener("cardDrillDown", handleDrillDownEvent as EventListener)
    }
  }, [card])

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)

    if (!card) return

    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent("cardDrillDownStateChange", {
      detail: {
        cardId: card.id,
        cardType: "pipeline-analytics",
        isActive: false,
      },
    })
    window.dispatchEvent(stateEvent)
  }

  const analytics = useMemo(() => {
    // Aggregate all pipeline data
    const totalValue = pipelineData.reduce((sum, project) => sum + project.config.pipelineValue, 0)
    const totalWeightedValue = pipelineData.reduce((sum, project) => sum + project.config.probabilityWeighted, 0)

    // Stage aggregation
    const stageData = pipelineData.reduce((acc, project) => {
      project.config.stages.forEach((stage) => {
        if (!acc[stage.stage]) {
          acc[stage.stage] = { count: 0, value: 0, name: stage.stage }
        }
        acc[stage.stage].count += stage.count
        acc[stage.stage].value += stage.value
      })
      return acc
    }, {} as Record<string, any>)

    const funnelData = Object.values(stageData).map((stage: any, index) => ({
      ...stage,
      fill: STAGE_COLORS[index],
    }))

    // Division breakdown
    const divisionData = pipelineData.reduce((acc, project) => {
      if (!acc[project.division]) {
        acc[project.division] = { count: 0, value: 0, weightedValue: 0 }
      }
      acc[project.division].count += 1
      acc[project.division].value += project.config.pipelineValue
      acc[project.division].weightedValue += project.config.probabilityWeighted
      return acc
    }, {} as Record<string, any>)

    const divisionChartData = Object.entries(divisionData).map(([division, data]: [string, any]) => ({
      name: division,
      value: data.value,
      weightedValue: data.weightedValue,
      count: data.count,
      fill: division === "Residential" ? COLORS.residential : COLORS.commercial,
    }))

    // Recent wins and losses
    const allWins = pipelineData.flatMap((project) => project.config.recentWins)
    const allLosses = pipelineData.flatMap((project) => project.config.recentLosses)

    const totalWins = allWins.reduce((sum, win) => sum + win.value, 0)
    const totalLosses = allLosses.reduce((sum, loss) => sum + loss.value, 0)
    const winRate = (totalWins / (totalWins + totalLosses)) * 100

    // Size distribution
    const sizeData = pipelineData.reduce((acc, project) => {
      if (!acc[project.size]) {
        acc[project.size] = { count: 0, value: 0 }
      }
      acc[project.size].count += 1
      acc[project.size].value += project.config.pipelineValue
      return acc
    }, {} as Record<string, any>)

    return {
      totalValue,
      totalWeightedValue,
      conversionRate: (totalWeightedValue / totalValue) * 100,
      projectCount: pipelineData.length,
      funnelData,
      divisionChartData,
      winRate,
      totalWins,
      totalLosses,
      recentWins: allWins.slice(0, 3),
      recentLosses: allLosses.slice(0, 3),
      sizeData,
    }
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  return (
    <div className="relative overflow-hidden" data-tour="pipeline-analytics-card">
      <div className="overflow-y-auto">
        <div className="p-0 sm:p-0 lg:p-0 space-y-2">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-1.5">
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Pipeline</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-medium text-blue-900 dark:text-blue-100">
                    {formatCurrency(analytics.totalValue)}
                  </p>
                </div>
                <Target className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Weighted Value</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-medium text-green-900 dark:text-green-100">
                    {formatCurrency(analytics.totalWeightedValue)}
                  </p>
                </div>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Win Rate</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-medium text-purple-900 dark:text-purple-100">
                    {analytics.winRate.toFixed(1)}%
                  </p>
                </div>
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Projects</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-medium text-orange-900 dark:text-orange-100">
                    {analytics.projectCount}
                  </p>
                </div>
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-2 lg:gap-1.5">
            {/* Pipeline Funnel */}
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1.5 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Pipeline Stages
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsFunnelChart>
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name === "value" ? formatCurrency(value) : value,
                        name === "value" ? "Value" : "Count",
                      ]}
                    />
                    <Funnel dataKey="value" data={analytics.funnelData} isAnimationActive>
                      <LabelList position="center" fill="hsl(var(--background))" stroke="none" fontSize={12} />
                      {analytics.funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Funnel>
                  </RechartsFunnelChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Division Breakdown */}
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1.5 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                Division Analysis
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.divisionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    <Bar dataKey="value" name="Total Value" opacity={0.8} />
                    <Bar dataKey="weightedValue" name="Weighted Value" opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Win/Loss Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-2 lg:gap-1.5">
            {/* Recent Wins */}
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1.5 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                Recent Wins
              </h3>
              <div className="space-y-2">
                {analytics.recentWins.map((win, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-1.5 sm:p-2 lg:p-2 bg-green-50 dark:bg-green-950/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{win.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {win.division}
                      </Badge>
                    </div>
                    <p className="font-semibold text-green-700">{formatCurrency(win.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Losses */}
            <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium mb-1.5 sm:mb-2 lg:mb-1.5 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                Recent Losses
              </h3>
              <div className="space-y-2">
                {analytics.recentLosses.map((loss, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-1.5 sm:p-2 lg:p-2 bg-red-50 dark:bg-red-950/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">{loss.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {loss.division}
                      </Badge>
                    </div>
                    <p className="font-semibold text-red-700">{formatCurrency(loss.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion Rate Progress */}
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 sm:p-2.5 lg:p-2">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 lg:mb-1.5">
              <h3 className="text-sm sm:text-base lg:text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Pipeline Conversion Rate
              </h3>
              <Badge variant="outline" className="text-sm">
                {analytics.conversionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={analytics.conversionRate} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Total Pipeline: {formatCurrency(analytics.totalValue)}</span>
              <span>Weighted Value: {formatCurrency(analytics.totalWeightedValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Click-Based Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 lg:p-2 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            {/* Close Button */}
            <button
              onClick={handleCloseDrillDown}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close drill down"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1.5 text-center">
              Pipeline Deep Analysis
            </h3>

            <div className="grid grid-cols-2 gap-2 sm:gap-2 lg:gap-1.5 h-[calc(100%-60px)]">
              {/* Pipeline Health */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-2">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Pipeline Health Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Conversion Efficiency:</span>
                      <span className="font-medium text-green-400">{analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Deal Size:</span>
                      <span className="font-medium">
                        {formatCurrency(analytics.totalValue / analytics.projectCount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stage Velocity:</span>
                      <span className="font-medium text-yellow-400">18 days avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quality Score:</span>
                      <span className="font-medium text-green-400">87/100</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-2">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Win/Loss Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Wins:</span>
                      <span className="font-medium text-green-400">{formatCurrency(analytics.totalWins)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Losses:</span>
                      <span className="font-medium text-red-400">{formatCurrency(analytics.totalLosses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Win Rate:</span>
                      <span className="font-medium text-green-400">{analytics.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Competitive Wins:</span>
                      <span className="font-medium text-blue-400">73%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-2">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Market Positioning
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Commercial Sector:</span>
                        <span className="font-medium">
                          {analytics.divisionChartData.find((d) => d.name === "Commercial")?.count || 0} projects
                        </span>
                      </div>
                      <div className="text-xs text-orange-200">
                        {formatCurrency(analytics.divisionChartData.find((d) => d.name === "Commercial")?.value || 0)}{" "}
                        total value
                      </div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Residential Sector:</span>
                        <span className="font-medium">
                          {analytics.divisionChartData.find((d) => d.name === "Residential")?.count || 0} projects
                        </span>
                      </div>
                      <div className="text-xs text-orange-200">
                        {formatCurrency(analytics.divisionChartData.find((d) => d.name === "Residential")?.value || 0)}{" "}
                        total value
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-orange-200">
                        <span>Pipeline Strength:</span>
                        <span className="font-medium">Strong</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-2">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Time-to-Close Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Avg Sales Cycle:</span>
                      <span className="font-medium">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fastest Close:</span>
                      <span className="font-medium text-green-400">12 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longest Active:</span>
                      <span className="font-medium text-yellow-400">89 days</span>
                    </div>
                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <p className="text-xs text-orange-200">
                        Pipeline velocity has improved 15% over last quarter. Focus on proposal stage optimization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PipelineAnalytics
