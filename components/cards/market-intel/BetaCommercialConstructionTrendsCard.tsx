"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  LineChart,
  BarChart,
  PieChart,
  Cell,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Bar,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Activity,
  DollarSign,
  Building2,
  BarChart3,
  Target,
  Clock,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  MoreVertical,
} from "lucide-react"

interface BetaCommercialConstructionTrendsCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaCommercialConstructionTrendsCard({
  className,
  config,
  isCompact,
}: BetaCommercialConstructionTrendsCardProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-4 w-4",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-base",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-20" : "h-28",
  }

  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("activity")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 25000) // Update every 25 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing real commercial construction sources
  const commercialData = React.useMemo(() => {
    return {
      // Activity Index (U.S. Census Bureau)
      activityIndex: [
        { month: "Jan", spending: 125.4, permits: 89.2, starts: 112.8, index: 108.9 },
        { month: "Feb", spending: 128.7, permits: 91.5, starts: 115.3, index: 111.2 },
        { month: "Mar", spending: 132.1, permits: 94.8, starts: 118.7, index: 114.5 },
        { month: "Apr", spending: 135.6, permits: 97.2, starts: 121.4, index: 117.8 },
        { month: "May", spending: 138.9, permits: 99.5, starts: 124.1, index: 120.3 },
        { month: "Jun", spending: 142.3, permits: 102.1, starts: 127.8, index: 123.7 },
      ],

      // Forecasted Starts (ConstructConnect)
      forecastedStarts: [
        { quarter: "Q1 2025", office: 28.5, retail: 15.2, industrial: 42.8, healthcare: 18.9, total: 105.4 },
        { quarter: "Q2 2025", office: 31.2, retail: 16.8, industrial: 45.3, healthcare: 20.1, total: 113.4 },
        { quarter: "Q3 2025", office: 33.8, retail: 17.5, industrial: 47.9, healthcare: 21.4, total: 120.6 },
        { quarter: "Q4 2025", office: 36.5, retail: 18.2, industrial: 50.4, healthcare: 22.8, total: 127.9 },
      ],

      // Backlog Confidence (AGC Surveys)
      backlogConfidence: [
        { region: "Southeast", confidence: 78, backlog: 8.2, growth: 12.5, projects: 156 },
        { region: "Southwest", confidence: 72, backlog: 7.8, growth: 8.9, projects: 134 },
        { region: "Central", confidence: 68, backlog: 6.9, growth: 6.2, projects: 98 },
        { region: "North", confidence: 65, backlog: 5.4, growth: 4.1, projects: 87 },
        { region: "West", confidence: 75, backlog: 7.5, growth: 10.3, projects: 123 },
      ],

      // Key Performance Indicators
      kpis: [
        { metric: "Total Spending", value: 142.3, unit: "B", change: 8.7, trend: "up" },
        { metric: "Permit Growth", value: 14.2, unit: "%", change: 2.1, trend: "up" },
        { metric: "Starts Index", value: 127.8, unit: "", change: 5.3, trend: "up" },
        { metric: "Backlog Months", value: 8.2, unit: "", change: -0.3, trend: "down" },
      ],

      // Regional Performance
      regionalPerformance: [
        { region: "Miami-Dade", spending: 28.5, growth: 15.2, projects: 45, confidence: 82 },
        { region: "Broward", spending: 22.3, growth: 12.8, projects: 38, confidence: 78 },
        { region: "Palm Beach", spending: 18.7, growth: 18.5, projects: 32, confidence: 85 },
        { region: "Tampa Bay", spending: 25.1, growth: 14.1, projects: 41, confidence: 79 },
        { region: "Orlando", spending: 20.8, growth: 16.7, projects: 35, confidence: 81 },
      ],
    }
  }, [])

  // Format currency
  const formatCurrency = (value: number, decimals = 0) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  // Get trend icon
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "strong":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
      case "weak":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  return (
    <Card
      className={`bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#0021A5] dark:text-[#4A7FD6]`}>
              Commercial Construction Trends
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#0021A5]/70 dark:text-[#4A7FD6]/80`}>
              U.S. Census Bureau • ConstructConnect • AGC Surveys
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.textSmall} bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]`}
              >
                <Activity className={`${compactScale.iconSizeSmall} mr-0.5`} />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-green-500/10 text-green-600 dark:bg-green-500/30 dark:text-green-400`}
                >
                  <Clock className={`${compactScale.iconSizeSmall} mr-0.5`} />
                  Live Data
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
                <MoreVertical className={`${compactScale.iconSize} scale-150`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
                <Label
                  htmlFor="real-time"
                  className={`${compactScale.textSmall} text-[#0021A5]/70 dark:text-[#4A7FD6]/80`}
                >
                  Real-time
                </Label>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className={`${compactScale.iconSize} mr-2`} />
                Refresh Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pb-6">
        {/* Tabs at full width */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className={`grid w-full grid-cols-3 mb-3 ${isCompact ? "h-8" : "h-9"}`}>
            <TabsTrigger value="activity" className={`${isCompact ? "text-[8px] px-1" : "text-[9px] px-2"} truncate`}>
              {isCompact ? "Activity" : "Activity Index"}
            </TabsTrigger>
            <TabsTrigger value="forecast" className={`${isCompact ? "text-[8px] px-1" : "text-[9px] px-2"} truncate`}>
              {isCompact ? "Forecast" : "Forecasted Starts"}
            </TabsTrigger>
            <TabsTrigger value="backlog" className={`${isCompact ? "text-[8px] px-1" : "text-[9px] px-2"} truncate`}>
              {isCompact ? "Backlog" : "Backlog Confidence"}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-4">
            {/* Left Side - KPIs */}
            <div className="w-1/3 space-y-3">
              {/* Key Performance Indicators */}
              <div className="space-y-2">
                {commercialData.kpis.map((kpi, index) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-800 ${compactScale.padding} rounded-lg border border-[#0021A5]/20 dark:border-gray-700`}
                  >
                    <div className={`flex items-center justify-between ${isCompact ? "mb-1" : "mb-1"}`}>
                      <span className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300`}>
                        {kpi.metric}
                      </span>
                      {getTrendIcon(kpi.change)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {kpi.value}
                        {kpi.unit}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          kpi.change > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : kpi.change < 0
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {kpi.change > 0 ? "+" : ""}
                        {kpi.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-[#0021A5]/20 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Charts and Data */}
            <div className="flex-1">
              <TabsContent value="activity" className="space-y-3">
                {/* Activity Index Chart */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
                  <h4
                    className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 flex-wrap`}
                  >
                    <BarChart3 className="h-4 w-4 text-[#0021A5] flex-shrink-0" />
                    <span className="flex-1 min-w-0">
                      {isCompact ? "Activity Index" : "Commercial Construction Activity Index"}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${compactScale.textSmall} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex-shrink-0`}
                    >
                      {isCompact ? "Census" : "U.S. Census Bureau"}
                    </Badge>
                  </h4>
                  <div className={compactScale.chartHeight}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={commercialData.activityIndex}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Bar yAxisId="left" dataKey="spending" fill="#3B82F6" name="Spending ($B)" />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="index"
                          stroke="#10B981"
                          strokeWidth={3}
                          name="Activity Index"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Regional Performance */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
                  <h4
                    className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2`}
                  >
                    <MapPin className="h-4 w-4 text-[#0021A5] flex-shrink-0" />
                    <span className="truncate">Regional Performance</span>
                  </h4>
                  <div className={`grid ${isCompact ? "grid-cols-2" : "grid-cols-3"} gap-2`}>
                    {commercialData.regionalPerformance.slice(0, isCompact ? 2 : 3).map((region, index) => (
                      <div key={index} className="text-center p-2 bg-gray-50 dark:bg-gray-900 rounded">
                        <p
                          className={`${compactScale.textMedium} font-medium text-gray-900 dark:text-gray-100 truncate mb-1`}
                        >
                          {region.region}
                        </p>
                        <p className={`${compactScale.textSmall} text-gray-500 dark:text-gray-400 mb-1`}>
                          {formatCurrency(region.spending, 1)}B
                        </p>
                        <div
                          className={`text-green-600 font-medium ${isCompact ? "text-xs" : "text-sm"} min-w-0 truncate`}
                        >
                          {region.confidence}% confidence
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="forecast" className="space-y-3">
                {/* Forecasted Starts Chart */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
                  <h4
                    className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 flex-wrap`}
                  >
                    <Calendar className="h-4 w-4 text-[#0021A5] flex-shrink-0" />
                    <span className="flex-1 min-w-0">
                      {isCompact ? "Construction Starts" : "Forecasted Construction Starts"}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${compactScale.textSmall} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex-shrink-0`}
                    >
                      {isCompact ? "ConstructConnect" : "ConstructConnect"}
                    </Badge>
                  </h4>
                  <div className={compactScale.chartHeight}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={commercialData.forecastedStarts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quarter" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`$${value}B`, name]} />
                        <Bar dataKey="office" fill="#3B82F6" name="Office" stackId="a" />
                        <Bar dataKey="retail" fill="#10B981" name="Retail" stackId="a" />
                        <Bar dataKey="industrial" fill="#F59E0B" name="Industrial" stackId="a" />
                        <Bar dataKey="healthcare" fill="#EF4444" name="Healthcare" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Forecast Summary */}
                <div className="grid grid-cols-2 gap-2">
                  {commercialData.forecastedStarts.slice(0, 2).map((quarter, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-[#0021A5]/20 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`${compactScale.textSmall} font-medium text-gray-700 dark:text-gray-300 truncate`}
                        >
                          {quarter.quarter}
                        </span>
                        <Badge
                          variant="outline"
                          className={`${compactScale.textSmall} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex-shrink-0`}
                        >
                          {formatCurrency(quarter.total, 1)}B
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className={`flex justify-between ${compactScale.textSmall}`}>
                          <span className="text-gray-600 dark:text-gray-400 truncate">Office:</span>
                          <span className="font-medium flex-shrink-0">{formatCurrency(quarter.office, 1)}B</span>
                        </div>
                        <div className={`flex justify-between ${compactScale.textSmall}`}>
                          <span className="text-gray-600 dark:text-gray-400 truncate">Industrial:</span>
                          <span className="font-medium flex-shrink-0">{formatCurrency(quarter.industrial, 1)}B</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="backlog" className="space-y-3">
                {/* Backlog Confidence Chart */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
                  <h4
                    className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 flex-wrap`}
                  >
                    <Target className="h-4 w-4 text-[#0021A5] flex-shrink-0" />
                    <span className="flex-1 min-w-0">
                      {isCompact ? "Backlog by Region" : "Backlog Confidence by Region"}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${compactScale.textSmall} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex-shrink-0`}
                    >
                      {isCompact ? "AGC" : "AGC Surveys"}
                    </Badge>
                  </h4>
                  <div className={compactScale.chartHeight}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={commercialData.backlogConfidence}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="confidence" fill="#8B5CF6" name="Confidence %" />
                        <Bar dataKey="backlog" fill="#10B981" name="Backlog Months" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Backlog Details */}
                <div className={`grid ${isCompact ? "grid-cols-2" : "grid-cols-3"} gap-2`}>
                  {commercialData.backlogConfidence.slice(0, isCompact ? 2 : 3).map((region, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-[#0021A5]/20 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`${compactScale.textSmall} font-medium text-gray-700 dark:text-gray-300 truncate`}
                        >
                          {region.region}
                        </span>
                        <Badge
                          variant="outline"
                          className={`${compactScale.textSmall} ${
                            region.confidence >= 75
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : region.confidence >= 65
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          } flex-shrink-0`}
                        >
                          {region.confidence}%
                        </Badge>
                      </div>
                      <div className={`space-y-1 ${compactScale.textSmall}`}>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 truncate">Backlog:</span>
                          <span className="font-medium flex-shrink-0">{region.backlog} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 truncate">Projects:</span>
                          <span className="font-medium flex-shrink-0">{region.projects}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
