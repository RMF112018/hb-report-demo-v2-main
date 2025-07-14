/**
 * @fileoverview Power BI Embed Card Component
 * @module PowerBIEmbedCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Reusable component for embedding Power BI visualizations with enhanced styling and AI insights
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Progress } from "../../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import {
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Play,
  Pause,
  ExternalLink,
  Brain,
  Target,
  Zap,
  Activity,
  Calendar,
  Database,
  Globe,
  Eye,
  Lightbulb,
  Loader2,
  Monitor,
  Settings,
  Download,
  Share2,
  Maximize2,
  Filter,
  MoreHorizontal,
} from "lucide-react"

export interface PowerBIEmbedCardProps {
  className?: string
  userRole?: string
  title: string
  description?: string
  reportId?: string
  workspaceId?: string
  data?: any[]
  config?: {
    chartType?: "bar" | "line" | "area" | "pie" | "composed" | "radar" | "scatter" | "funnel"
    showRealTime?: boolean
    showPowerBIBadge?: boolean
    showExternalLink?: boolean
    primaryColor?: string
    secondaryColor?: string
    gradientColors?: [string, string]
    refreshInterval?: number
    icon?: React.ComponentType<{ className?: string }>
    showAISummary?: boolean
    embedUrl?: string
    filters?: Array<{
      table: string
      column: string
      values: any[]
    }>
    customActions?: Array<{
      label: string
      icon: React.ComponentType<{ className?: string }>
      action: () => void
    }>
    compactView?: boolean
    showTabs?: boolean
    tabsData?: Array<{
      label: string
      value: string
      data: any[]
    }>
  }
  aiSummary?: {
    insight: string
    confidence: number
    trend: "up" | "down" | "stable"
    recommendation?: string
    keyFindings?: string[]
    dataQuality?: number
  }
}

export default function PowerBIEmbedCard({
  className,
  userRole,
  title,
  description,
  reportId,
  workspaceId,
  data = [],
  config,
  aiSummary,
}: PowerBIEmbedCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isEmbedLoaded, setIsEmbedLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState(config?.tabsData?.[0]?.value || "overview")

  // Configuration defaults
  const chartType = config?.chartType || "bar"
  const primaryColor = config?.primaryColor || "#3b82f6"
  const secondaryColor = config?.secondaryColor || "#10b981"
  const gradientColors = config?.gradientColors || ["#3b82f6", "#1d4ed8"]
  const showPowerBIBadge = config?.showPowerBIBadge ?? true
  const showExternalLink = config?.showExternalLink ?? true
  const showAISummary = config?.showAISummary ?? true
  const IconComponent = config?.icon || Monitor
  const refreshInterval = config?.refreshInterval || 30000

  // Real-time data simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      // For now, just update the timestamp - we can enhance this later
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
      setIsEmbedLoaded(true)
    }, 1500)
  }

  // Handle external link
  const handleExternalLink = () => {
    if (config?.embedUrl) {
      window.open(config.embedUrl, "_blank")
    } else if (reportId && workspaceId) {
      window.open(`https://app.powerbi.com/groups/${workspaceId}/reports/${reportId}`, "_blank")
    }
  }

  // Render chart based on type
  const renderChart = (chartData: any[] = data) => {
    if (!chartData || chartData.length === 0) {
      return <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
    }

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={3}
                dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={gradientColors[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={2} fill="url(#colorGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || primaryColor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "composed":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={primaryColor} />
              <Line type="monotone" dataKey="secondary" stroke={secondaryColor} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        )

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart {...commonProps}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar dataKey="value" stroke={primaryColor} fill={primaryColor} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )

      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="x" name="X" />
              <YAxis dataKey="y" name="Y" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter dataKey="value" fill={primaryColor} />
            </ScatterChart>
          </ResponsiveContainer>
        )

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  // Render embed iframe (placeholder for real Power BI embed)
  const renderPowerBIEmbed = () => {
    if (!reportId || !workspaceId) {
      return renderChart()
    }

    return (
      <div className="relative w-full h-[300px] bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {isLoading || !isEmbedLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading Power BI Report...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Power BI Report Embed</p>
              <p className="text-xs text-gray-500">Report ID: {reportId}</p>
              <p className="text-xs text-gray-500">Workspace: {workspaceId}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    if (config?.showTabs && config.tabsData) {
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {config.tabsData.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {config.tabsData.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {renderChart(
                tab.data.map((item: any) => {
                  const normalized = { ...item }
                  // Map common key names to 'name' for consistent chart rendering
                  if (item.category && !item.name) normalized.name = item.category
                  if (item.month && !item.name) normalized.name = item.month
                  if (item.region && !item.name) normalized.name = item.region
                  if (item.metric && !item.name) normalized.name = item.metric
                  if (item.stage && !item.name) normalized.name = item.stage
                  if (item.quarter && !item.name) normalized.name = item.quarter
                  return normalized
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      )
    }

    // Normalize data directly at render time
    const renderData = data.map((item: any) => {
      const normalized = { ...item }
      // Map common key names to 'name' for consistent chart rendering
      if (item.category && !item.name) normalized.name = item.category
      if (item.month && !item.name) normalized.name = item.month
      if (item.region && !item.name) normalized.name = item.region
      if (item.metric && !item.name) normalized.name = item.metric
      if (item.stage && !item.name) normalized.name = item.stage
      if (item.quarter && !item.name) normalized.name = item.quarter
      return normalized
    })

    // Always show charts when data is available, prioritize charts over Power BI embed loading
    return data && data.length > 0 ? renderChart(renderData) : renderPowerBIEmbed()
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
            {showPowerBIBadge && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/30"
              >
                Power BI
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-gray-600 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-700 dark:bg-gray-800/50"
            >
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
            </Badge>
            {showExternalLink && (
              <Button variant="outline" size="sm" onClick={handleExternalLink} className="h-8 px-3">
                <ExternalLink className="h-4 w-4" />
              </Button>
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
            {config?.customActions && config.customActions.length > 0 && (
              <Button variant="outline" size="sm" className="h-8 px-3">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
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
          <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-950/20 dark:to-blue-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">HBI Analysis</span>
                  <Badge
                    variant="outline"
                    className="text-xs text-orange-600 border-orange-200 bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:bg-orange-950/30"
                  >
                    {aiSummary.confidence}% confidence
                  </Badge>
                  {aiSummary.dataQuality && (
                    <Badge
                      variant="outline"
                      className="text-xs text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/30"
                    >
                      {aiSummary.dataQuality}% data quality
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">{aiSummary.insight}</p>
                {aiSummary.keyFindings && aiSummary.keyFindings.length > 0 && (
                  <div className="space-y-1 mb-2">
                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Key Findings:</span>
                    {aiSummary.keyFindings.map((finding, index) => (
                      <div key={index} className="flex items-start gap-1">
                        <Target className="h-3 w-3 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-orange-700 dark:text-orange-300">{finding}</span>
                      </div>
                    ))}
                  </div>
                )}
                {aiSummary.recommendation && (
                  <div className="flex items-start gap-1 mt-2">
                    <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-700 dark:text-orange-300">{aiSummary.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pt-0">{renderContent()}</CardContent>
    </Card>
  )
}
