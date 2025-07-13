/**
 * @fileoverview Simple Market Insights Card Component
 * @module SimpleMarketInsightsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing market insights
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Globe, TrendingUp, RefreshCw, Play, Pause, Target, ArrowUp, ArrowDown, Minus } from "lucide-react"

interface SimpleMarketInsightsCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    chartFocused?: boolean
  }
}

// Generate role-based market data
const generateMarketData = (userRole: string) => {
  const marketMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.3,
    admin: 0.0,
  }

  const multiplier = marketMultipliers[userRole as keyof typeof marketMultipliers] || 0.3

  const baseData = {
    marketGrowth: 3.2 + Math.random() * 2,
    marketShare: 18 + Math.floor(Math.random() * 8),
    avgBidSuccess: 65 + Math.floor(Math.random() * 15),
    competitorCount: Math.floor(8 * multiplier),
    pipelineValue: 125000000 * multiplier,
    opportunityScore: 85 + Math.floor(Math.random() * 10),
  }

  const monthlyData = [
    { month: "Jan", growth: baseData.marketGrowth * 0.8, opportunities: Math.floor(5 * multiplier) },
    { month: "Feb", growth: baseData.marketGrowth * 0.9, opportunities: Math.floor(7 * multiplier) },
    { month: "Mar", growth: baseData.marketGrowth * 1.1, opportunities: Math.floor(6 * multiplier) },
    { month: "Apr", growth: baseData.marketGrowth * 1.2, opportunities: Math.floor(8 * multiplier) },
    { month: "May", growth: baseData.marketGrowth * 1.0, opportunities: Math.floor(9 * multiplier) },
    { month: "Jun", growth: baseData.marketGrowth * 1.3, opportunities: Math.floor(11 * multiplier) },
  ]

  const trends = [
    { category: "Luxury Residential", trend: "up", impact: "high", change: "+12%" },
    { category: "Commercial Office", trend: "stable", impact: "medium", change: "+2%" },
    { category: "Mixed-Use", trend: "up", impact: "high", change: "+8%" },
    { category: "Industrial", trend: "down", impact: "low", change: "-3%" },
    { category: "Hospitality", trend: "up", impact: "medium", change: "+5%" },
  ]

  return {
    ...baseData,
    monthlyData,
    trends,
  }
}

export default function SimpleMarketInsightsCard({ className, userRole, config }: SimpleMarketInsightsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const marketData = useMemo(() => generateMarketData(userRole || "estimator"), [userRole])

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 15000) // Update every 15 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-green-500" />
      case "down":
        return <ArrowDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200/50 dark:border-indigo-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                Market Insights
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-950/50">
              Power BI
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="h-8 px-3"
            >
              {isRealTimeEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-8 px-3">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Real-time Status */}
        {isRealTimeEnabled && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live data • Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Market Growth</p>
                <p className="text-2xl font-bold text-indigo-600">{marketData.marketGrowth.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Market Share</p>
                <p className="text-2xl font-bold text-blue-600">{marketData.marketShare}%</p>
              </div>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bid Success</p>
                <p className="text-2xl font-bold text-green-600">{marketData.avgBidSuccess}%</p>
              </div>
              <Globe className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Market Trends</h4>
          <div className="space-y-1">
            {marketData.trends.slice(0, 4).map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTrendIcon(trend.trend)}
                  <span className="text-xs">{trend.category}</span>
                </div>
                <span className="text-xs font-medium">{trend.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pipeline Value</p>
              <p className="text-lg font-bold text-purple-600">{formatCurrency(marketData.pipelineValue)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Opportunity Score</p>
              <p className="text-lg font-bold text-indigo-600">{marketData.opportunityScore}/100</p>
            </div>
          </div>
        </div>

        {/* Growth Trend Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="growth" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
