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
  LineChart as RechartsLineChart,
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
  ScatterChart,
  Scatter,
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
  Home,
  Users,
  Percent,
  ArrowUpDown,
  Zap,
  Globe,
  Shield,
  Gauge,
  TrendingUpIcon,
} from "lucide-react"

interface BetaMacroFinancialIndicatorsCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaMacroFinancialIndicatorsCard({
  className,
  config,
  isCompact,
}: BetaMacroFinancialIndicatorsCardProps) {
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

  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("rates")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 40000) // Update every 40 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing macro financial indicators
  const macroData = React.useMemo(() => {
    return {
      // Rates and inflation (Federal Reserve & BLS data)
      ratesInflation: [
        { month: "Jan", fedRate: 5.25, inflation: 3.1, mortgageRate: 6.75, constructionCPI: 4.2 },
        { month: "Feb", fedRate: 5.25, inflation: 3.0, mortgageRate: 6.85, constructionCPI: 4.1 },
        { month: "Mar", fedRate: 5.25, inflation: 2.9, mortgageRate: 6.95, constructionCPI: 4.0 },
        { month: "Apr", fedRate: 5.0, inflation: 2.8, mortgageRate: 7.05, constructionCPI: 3.9 },
        { month: "May", fedRate: 5.0, inflation: 2.7, mortgageRate: 7.15, constructionCPI: 3.8 },
        { month: "Jun", fedRate: 4.75, inflation: 2.6, mortgageRate: 7.25, constructionCPI: 3.7 },
      ],

      // GDP and growth indicators
      gdpGrowth: [
        { quarter: "Q1 2024", gdp: 2.1, constructionGDP: 8.7, employment: 96.8, consumerSpending: 2.3 },
        { quarter: "Q2 2024", gdp: 2.3, constructionGDP: 9.2, employment: 97.1, consumerSpending: 2.5 },
        { quarter: "Q3 2024", gdp: 2.5, constructionGDP: 9.8, employment: 97.4, consumerSpending: 2.7 },
        { quarter: "Q4 2024", gdp: 2.7, constructionGDP: 10.3, employment: 97.7, consumerSpending: 2.9 },
      ],

      // Energy and risk indicators
      energyRisk: [
        { month: "Jan", oilPrice: 78.5, volatility: 18.5, riskIndex: 65, confidence: 82 },
        { month: "Feb", oilPrice: 82.3, volatility: 19.2, riskIndex: 68, confidence: 79 },
        { month: "Mar", oilPrice: 85.7, volatility: 20.1, riskIndex: 72, confidence: 76 },
        { month: "Apr", oilPrice: 88.9, volatility: 21.3, riskIndex: 75, confidence: 73 },
        { month: "May", oilPrice: 92.4, volatility: 22.8, riskIndex: 78, confidence: 70 },
        { month: "Jun", oilPrice: 95.8, volatility: 23.5, riskIndex: 81, confidence: 67 },
      ],

      // Key performance indicators
      kpis: [
        { metric: "Fed Rate", value: 4.75, unit: "%", change: -0.5, trend: "down" },
        { metric: "Inflation", value: 2.6, unit: "%", change: -0.5, trend: "down" },
        { metric: "Construction GDP", value: 10.3, unit: "%", change: 1.6, trend: "up" },
        { metric: "Oil Price", value: 95.8, unit: "$", change: 22.1, trend: "up" },
      ],

      // Global economic indicators
      globalIndicators: [
        { region: "United States", gdp: 2.7, inflation: 2.6, confidence: 85, risk: "low" },
        { region: "Eurozone", gdp: 1.2, inflation: 2.8, confidence: 72, risk: "moderate" },
        { region: "China", gdp: 5.2, inflation: 1.8, confidence: 78, risk: "moderate" },
        { region: "Japan", gdp: 1.8, inflation: 2.1, confidence: 68, risk: "moderate" },
        { region: "United Kingdom", gdp: 1.5, inflation: 3.2, confidence: 65, risk: "high" },
        { region: "Canada", gdp: 2.1, inflation: 2.9, confidence: 82, risk: "low" },
      ],

      // Construction sector indicators
      constructionIndicators: [
        { sector: "Residential", growth: 12.5, employment: 8.2, confidence: 88, risk: "low" },
        { sector: "Commercial", growth: 8.7, employment: 6.8, confidence: 75, risk: "moderate" },
        { sector: "Infrastructure", growth: 15.3, employment: 9.1, confidence: 92, risk: "low" },
        { sector: "Industrial", growth: 18.2, employment: 7.5, confidence: 85, risk: "low" },
        { sector: "Healthcare", growth: 11.8, employment: 5.9, confidence: 79, risk: "moderate" },
        { sector: "Education", growth: 9.4, employment: 4.7, confidence: 72, risk: "moderate" },
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
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#0021A5] dark:text-[#4A7FD6]`}>
              Macro Financial Indicators
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#0021A5]/70 dark:text-[#4A7FD6]/80`}>
              Federal Reserve • BLS • World Bank • EIA • Bloomberg
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

      <CardContent className={isCompact ? "p-2" : "p-3"}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${isCompact ? "mb-2" : "mb-3"}`}>
            <TabsTrigger value="rates" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Rates & Inflation
            </TabsTrigger>
            <TabsTrigger value="gdp" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              GDP & Growth
            </TabsTrigger>
            <TabsTrigger value="energy" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Energy & Risk
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rates" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Performance Indicators */}
            <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-3"}`}>
              {macroData.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 ${compactScale.padding} rounded-lg border border-[#0021A5]/20 dark:border-gray-700`}
                >
                  <div className={`flex items-center justify-between ${isCompact ? "mb-1" : "mb-2"}`}>
                    <span className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300`}>
                      {kpi.metric}
                    </span>
                    {getTrendIcon(kpi.change)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
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

            {/* Rates and Inflation Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Percent className="h-4 w-4 text-[#0021A5]" />
                Interest Rates & Inflation Trends
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  Federal Reserve & BLS
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={macroData.ratesInflation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Bar yAxisId="left" dataKey="fedRate" fill="#3B82F6" name="Fed Rate" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="inflation"
                      stroke="#EF4444"
                      strokeWidth={3}
                      name="Inflation"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="mortgageRate"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Mortgage Rate"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Construction CPI */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0021A5]" />
                Construction Cost Inflation
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={macroData.ratesInflation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Area
                      type="monotone"
                      dataKey="constructionCPI"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                      name="Construction CPI"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gdp" className="space-y-4">
            {/* GDP and Growth Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0021A5]" />
                GDP Growth & Construction Sector
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Federal Reserve
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={macroData.gdpGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Bar dataKey="gdp" fill="#3B82F6" name="GDP Growth" />
                    <Bar dataKey="constructionGDP" fill="#10B981" name="Construction GDP" />
                    <Bar dataKey="consumerSpending" fill="#F59E0B" name="Consumer Spending" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Global Economic Indicators */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0021A5]" />
                Global Economic Indicators
              </h4>
              <div className="space-y-2">
                {macroData.globalIndicators.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{region.region}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        GDP: {region.gdp}% • Inflation: {region.inflation}%
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                        {region.confidence}% confidence
                      </Badge>
                      <Badge variant="outline" className={`text-xs ml-1 ${getStatusColor(region.risk)}`}>
                        {region.risk} risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Construction Sector Performance */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0021A5]" />
                Construction Sector Performance
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {macroData.constructionIndicators.map((sector, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sector.sector}</span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(sector.risk)}`}>
                        {sector.risk} risk
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                        <span className="font-medium">+{sector.growth}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Employment:</span>
                        <span className="font-medium">{sector.employment}M</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                        <span className="font-medium">{sector.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="energy" className="space-y-4">
            {/* Energy and Risk Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#0021A5]" />
                Energy Prices & Risk Indicators
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  EIA & Bloomberg
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={macroData.energyRisk}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [name === "oilPrice" ? `$${value}` : `${value}%`, name]} />
                    <Bar yAxisId="left" dataKey="oilPrice" fill="#F59E0B" name="Oil Price ($)" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="riskIndex"
                      stroke="#EF4444"
                      strokeWidth={3}
                      name="Risk Index"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="volatility"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      name="Volatility"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Gauge Indicators */}
            <div className="grid grid-cols-2 gap-3">
              {macroData.energyRisk.slice(-3).map((month, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{month.month}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        month.confidence >= 80
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : month.confidence >= 70
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {month.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Oil Price:</span>
                      <span className="font-medium">${month.oilPrice}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Risk Index:</span>
                      <span className="font-medium">{month.riskIndex}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Volatility:</span>
                      <span className="font-medium">{month.volatility}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#0021A5]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-blue-100 text-blue-800">
                    Federal Reserve
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-green-100 text-green-800">
                    Bureau of Labor Statistics
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-orange-100 text-orange-800">
                    Energy Information Administration
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-purple-100 text-purple-800">
                    World Bank
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-pink-100 text-pink-800">
                    Bloomberg Terminal
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-cyan-100 text-cyan-800">
                    Economic Indicators
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-[#0021A5]/20 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#0021A5] dark:text-[#4A7FD6]">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
