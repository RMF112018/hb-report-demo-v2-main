/**
 * @fileoverview Activity Trends Card Component
 * @module ActivityTrendsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Reusable component for displaying time-based charts with trend analysis
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Progress } from "../../ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Play,
  Pause,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
  Brain,
  Calendar,
  Target,
  Zap,
  BarChart3,
  LineChart as LineChartIcon,
  TrendingUpIcon,
  Lightbulb,
  Eye,
  Loader2,
} from "lucide-react"

export interface ActivityTrendsCardProps {
  className?: string
  userRole?: string
  title: string
  description?: string
  data: Array<{
    period: string
    value: number
    [key: string]: any
  }>
  config?: {
    chartType?: "line" | "area" | "bar"
    showRealTime?: boolean
    gradientColors?: [string, string]
    primaryColor?: string
    trendIndicator?: boolean
    showHBISummary?: boolean
    enableHBIForecast?: boolean
    dataFields?: string[]
    yAxisLabel?: string
    xAxisLabel?: string
    formatValue?: (value: number) => string
    refreshInterval?: number
    icon?: React.ComponentType<{ className?: string }>
    compactView?: boolean
  }
  hbiSummary?: {
    insight: string
    confidence: number
    trend: "up" | "down" | "stable"
    recommendation?: string
    keyFactors?: string[]
    dataQuality?: number
  }
}

export default function ActivityTrendsCard({
  className,
  userRole,
  title,
  description,
  data,
  config,
  hbiSummary,
}: ActivityTrendsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime ?? false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [currentData, setCurrentData] = useState(data)

  // Configuration defaults
  const chartType = config?.chartType || "line"
  const primaryColor = config?.primaryColor || "#3b82f6"
  const gradientColors = config?.gradientColors || ["#3b82f6", "#1d4ed8"]
  const showHBISummary = config?.showHBISummary ?? true
  const enableHBIForecast = config?.enableHBIForecast ?? false
  const formatValue = config?.formatValue || ((val: number) => val.toLocaleString())
  const IconComponent = config?.icon || Activity
  const refreshInterval = config?.refreshInterval || 30000

  // Calculate trend
  const trend = useMemo(() => {
    if (!currentData || currentData.length < 2) return "stable"
    const recent = currentData.slice(-2)
    const change = recent[1].value - recent[0].value
    return change > 0 ? "up" : change < 0 ? "down" : "stable"
  }, [currentData])

  // Calculate trend percentage
  const trendPercentage = useMemo(() => {
    if (!currentData || currentData.length < 2) return 0
    const recent = currentData.slice(-2)
    const change = recent[1].value - recent[0].value
    const percentage = (change / recent[0].value) * 100
    return Math.abs(percentage)
  }, [currentData])

  // Get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  // Get trend color
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Real-time data simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      setCurrentData((prev) => {
        const newData = [...prev]
        const lastPoint = newData[newData.length - 1]
        const variation = (Math.random() - 0.5) * 0.1
        const newValue = Math.max(0, lastPoint.value * (1 + variation))

        // Update last point or add new point
        if (Math.random() > 0.7) {
          newData.push({
            ...lastPoint,
            period: `${new Date().getHours()}:${new Date().getMinutes()}`,
            value: newValue,
          })
          // Keep only last 20 points
          return newData.slice(-20)
        } else {
          newData[newData.length - 1] = {
            ...lastPoint,
            value: newValue,
          }
          return newData
        }
      })
      setLastUpdated(new Date())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [isRealTimeEnabled, refreshInterval])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
      // Simulate data refresh
      setCurrentData(data)
    }, 1000)
  }

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: currentData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={gradientColors[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatValue} />
              <Tooltip
                formatter={(value: any) => [formatValue(value), "Value"]}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={2} fill="url(#colorGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatValue} />
              <Tooltip
                formatter={(value: any) => [formatValue(value), "Value"]}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      default: // line
        return (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatValue} />
              <Tooltip
                formatter={(value: any) => [formatValue(value), "Value"]}
                labelStyle={{ color: "#374151" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={3}
                dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: primaryColor, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <Card className={`${className} h-full flex flex-col`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
              {description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </Badge>
            {config?.trendIndicator && (
              <div className="flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>{trendPercentage.toFixed(1)}%</span>
              </div>
            )}
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

        {/* HBI Analysis */}
        {showHBISummary && hbiSummary && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">HBI Insight</span>
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                    {hbiSummary.confidence}% confidence
                  </Badge>
                  {hbiSummary.dataQuality && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                      {hbiSummary.dataQuality}% quality
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">{hbiSummary.insight}</p>
                {hbiSummary.keyFactors && hbiSummary.keyFactors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {hbiSummary.keyFactors.map((factor, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs text-purple-600 border-purple-200 bg-purple-50"
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                )}
                {hbiSummary.recommendation && (
                  <div className="flex items-start gap-1 mt-2">
                    <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-purple-700 dark:text-purple-300">{hbiSummary.recommendation}</p>
                  </div>
                )}
                <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 opacity-75">Powered by HBI</div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {isLoading ? (
          <div className="h-[220px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Updating data...</p>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  )
}
