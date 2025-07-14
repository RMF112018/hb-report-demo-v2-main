/**
 * @fileoverview Estimating Progress Card Component
 * @module EstimatingProgressCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Reusable component for displaying summary data with AI insights and progress indicators
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Progress } from "../../ui/progress"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Play,
  Pause,
  Calculator,
  Brain,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart as PieChartIcon,
  Lightbulb,
  Loader2,
  Percent,
  DollarSign,
  TrendingUpIcon,
  Zap,
  Eye,
} from "lucide-react"

export interface EstimatingProgressCardProps {
  className?: string
  userRole?: string
  title: string
  description?: string
  data: {
    metrics: Array<{
      label: string
      value: number | string
      change?: number
      trend?: "up" | "down" | "stable"
      color?: string
      icon?: React.ComponentType<{ className?: string }>
      format?: "number" | "percentage" | "currency" | "text"
    }>
    progressData?: Array<{
      category: string
      value: number
      target?: number
      color?: string
    }>
    distributionData?: Array<{
      name: string
      value: number
      color: string
    }>
  }
  config?: {
    showRealTime?: boolean
    showDistribution?: boolean
    showProgress?: boolean
    primaryColor?: string
    compactView?: boolean
    refreshInterval?: number
    icon?: React.ComponentType<{ className?: string }>
    showHBISummary?: boolean
    enableHBIForecast?: boolean
  }
  hbiSummary?: {
    insight: string
    confidence: number
    trend: "up" | "down" | "stable"
    recommendation?: string
    keyMetrics?: string[]
    keyFactors?: string[]
    dataQuality?: number
  }
}

export default function EstimatingProgressCard({
  className,
  userRole,
  title,
  description,
  data,
  config,
  hbiSummary,
}: EstimatingProgressCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime ?? false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [currentData, setCurrentData] = useState(data)

  // Configuration defaults
  const primaryColor = config?.primaryColor || "#3b82f6"
  const showHBISummary = config?.showHBISummary ?? true
  const enableHBIForecast = config?.enableHBIForecast ?? false
  const showDistribution = config?.showDistribution ?? true
  const showProgress = config?.showProgress ?? true
  const IconComponent = config?.icon || Calculator
  const refreshInterval = config?.refreshInterval || 30000

  // Format value based on type
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === "string") return value

    switch (format) {
      case "percentage":
        return `${value.toFixed(1)}%`
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      case "number":
        return value.toLocaleString()
      default:
        return value.toString()
    }
  }

  // Get trend icon
  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  // Get trend color
  const getTrendColor = (trend?: "up" | "down" | "stable") => {
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
        const newData = { ...prev }

        // Simulate metric updates
        newData.metrics = prev.metrics.map((metric) => {
          if (typeof metric.value === "number") {
            const variation = (Math.random() - 0.5) * 0.05
            const newValue = Math.max(0, metric.value * (1 + variation))
            const change = newValue - metric.value
            const trend = change > 0 ? "up" : change < 0 ? "down" : "stable"

            return {
              ...metric,
              value: newValue,
              change: change,
              trend: trend,
            }
          }
          return metric
        })

        // Simulate progress data updates
        if (newData.progressData) {
          newData.progressData =
            prev.progressData?.map((item) => ({
              ...item,
              value: Math.max(0, Math.min(100, item.value + (Math.random() - 0.5) * 5)),
            })) || []
        }

        return newData
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
      setCurrentData(data)
    }, 1000)
  }

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    if (!currentData.progressData || currentData.progressData.length === 0) return 0
    return currentData.progressData.reduce((sum, item) => sum + item.value, 0) / currentData.progressData.length
  }, [currentData.progressData])

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
              Progress
            </Badge>
            {showProgress && (
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">{overallProgress.toFixed(1)}%</span>
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

        {/* AI Summary */}
        {showAISummary && aiSummary && (
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">AI Insight</span>
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-200 bg-purple-50">
                    {aiSummary.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">{aiSummary.insight}</p>
                {aiSummary.keyMetrics && aiSummary.keyMetrics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {aiSummary.keyMetrics.map((metric, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs text-purple-600 border-purple-200 bg-purple-50"
                      >
                        {metric}
                      </Badge>
                    ))}
                  </div>
                )}
                {aiSummary.recommendation && (
                  <div className="flex items-start gap-1 mt-2">
                    <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-purple-700 dark:text-purple-300">{aiSummary.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Updating data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Key Metrics Grid */}
            <div
              className={`grid gap-4 ${
                currentData.metrics.length <= 2
                  ? "grid-cols-2"
                  : currentData.metrics.length <= 4
                  ? "grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {currentData.metrics.map((metric, index) => {
                const MetricIcon = metric.icon || Target
                return (
                  <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MetricIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      {metric.trend && (
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          {metric.change !== undefined && (
                            <span className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                              {metric.format === "percentage"
                                ? `${Math.abs(metric.change).toFixed(1)}%`
                                : Math.abs(metric.change).toFixed(0)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${metric.color || "text-gray-900 dark:text-gray-100"}`}>
                      {formatValue(metric.value, metric.format)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Progress Data */}
            {showProgress && currentData.progressData && currentData.progressData.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Progress Overview
                </h4>
                {currentData.progressData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{item.value.toFixed(1)}%</span>
                        {item.target && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">/ {item.target.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                    <Progress
                      value={item.value}
                      className="h-2"
                      style={{
                        backgroundColor: `${item.color || primaryColor}20`,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Distribution Chart */}
            {showDistribution && currentData.distributionData && currentData.distributionData.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Distribution
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentData.distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {currentData.distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => [`${value}%`, "Percentage"]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
