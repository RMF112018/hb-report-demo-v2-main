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
  Warehouse,
  Truck,
  Package,
  Factory,
} from "lucide-react"

interface BetaSoutheastIndustrialRealEstateCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaSoutheastIndustrialRealEstateCard({
  className,
  config,
  isCompact,
}: BetaSoutheastIndustrialRealEstateCardProps) {
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
  const [activeTab, setActiveTab] = useState("lease")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 55000) // Update every 55 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing Southeast industrial real estate indicators
  const industrialData = React.useMemo(() => {
    return {
      // Regional lease trends by metro
      leaseTrends: [
        { metro: "Atlanta", leaseRate: 8.75, yoyGrowth: 12.5, vacancy: 4.2, absorption: 8500000 },
        { metro: "Orlando", leaseRate: 9.25, yoyGrowth: 15.8, vacancy: 3.8, absorption: 4200000 },
        { metro: "Miami", leaseRate: 10.5, yoyGrowth: 18.2, vacancy: 2.9, absorption: 3800000 },
        { metro: "Charlotte", leaseRate: 8.5, yoyGrowth: 11.3, vacancy: 4.5, absorption: 5200000 },
        { metro: "Nashville", leaseRate: 9.0, yoyGrowth: 14.7, vacancy: 3.5, absorption: 3100000 },
        { metro: "Jacksonville", leaseRate: 8.25, yoyGrowth: 13.1, vacancy: 4.8, absorption: 2800000 },
        { metro: "Birmingham", leaseRate: 7.75, yoyGrowth: 9.8, vacancy: 5.2, absorption: 1800000 },
        { metro: "Charleston", leaseRate: 8.0, yoyGrowth: 10.5, vacancy: 4.9, absorption: 2200000 },
      ],

      // Vacancy and absorption trends over time
      vacancyAbsorption: [
        { quarter: "Q1 2024", vacancy: 4.8, absorption: 12500000, completions: 8500000, preLeasing: 78 },
        { quarter: "Q2 2024", vacancy: 4.5, absorption: 13800000, completions: 9200000, preLeasing: 82 },
        { quarter: "Q3 2024", vacancy: 4.2, absorption: 15200000, completions: 10800000, preLeasing: 85 },
        { quarter: "Q4 2024", vacancy: 3.9, absorption: 16800000, completions: 12500000, preLeasing: 88 },
        { quarter: "Q1 2025", vacancy: 3.6, absorption: 18200000, completions: 14200000, preLeasing: 91 },
        { quarter: "Q2 2025", vacancy: 3.4, absorption: 19500000, completions: 15800000, preLeasing: 93 },
      ],

      // Construction pipeline data
      constructionPipeline: [
        { metro: "Atlanta", underConstruction: 12500000, planned: 8500000, completed: 6800000, preLeased: 78 },
        { metro: "Orlando", underConstruction: 8200000, planned: 6200000, completed: 4800000, preLeased: 82 },
        { metro: "Miami", underConstruction: 6800000, planned: 5200000, completed: 4200000, preLeased: 85 },
        { metro: "Charlotte", underConstruction: 9200000, planned: 7200000, completed: 5800000, preLeased: 79 },
        { metro: "Nashville", underConstruction: 5800000, planned: 4500000, completed: 3800000, preLeased: 81 },
        { metro: "Jacksonville", underConstruction: 4200000, planned: 3200000, completed: 2800000, preLeased: 76 },
      ],

      // Key performance indicators
      kpis: [
        { metric: "Average Lease Rate", value: 8.75, unit: "/SF", change: 13.2, trend: "up" },
        { metric: "Vacancy Rate", value: 3.9, unit: "%", change: -0.9, trend: "down" },
        { metric: "Absorption (Q4)", value: 16.8, unit: "MSF", change: 12.5, trend: "up" },
        { metric: "Pre-Leasing Rate", value: 88, unit: "%", change: 5.2, trend: "up" },
      ],

      // Market segments
      marketSegments: [
        { segment: "Distribution Centers", leaseRate: 8.25, vacancy: 3.2, growth: 15.8, demand: "high" },
        { segment: "Manufacturing", leaseRate: 9.5, vacancy: 4.8, growth: 12.3, demand: "moderate" },
        { segment: "Cold Storage", leaseRate: 11.75, vacancy: 2.1, growth: 22.5, demand: "high" },
        { segment: "Flex Space", leaseRate: 10.25, vacancy: 5.5, growth: 8.7, demand: "moderate" },
        { segment: "Bulk Warehouse", leaseRate: 7.75, vacancy: 4.2, growth: 18.9, demand: "high" },
        { segment: "Light Industrial", leaseRate: 9.0, vacancy: 6.1, growth: 11.4, demand: "moderate" },
      ],

      // Regional performance
      regionalPerformance: [
        { region: "Georgia", totalSF: 285000000, vacancy: 4.1, growth: 14.2, pipeline: 18500000 },
        { region: "Florida", totalSF: 245000000, vacancy: 3.8, growth: 16.8, pipeline: 15200000 },
        { region: "North Carolina", totalSF: 185000000, vacancy: 4.5, growth: 12.7, pipeline: 11800000 },
        { region: "Tennessee", totalSF: 125000000, vacancy: 3.9, growth: 15.3, pipeline: 9200000 },
        { region: "South Carolina", totalSF: 85000000, vacancy: 4.8, growth: 11.9, pipeline: 6800000 },
        { region: "Alabama", totalSF: 65000000, vacancy: 5.2, growth: 9.8, pipeline: 4200000 },
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
      case "high":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200"
      case "moderate":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const COLORS = ["#1E40AF", "#7C3AED", "#DC2626", "#059669", "#D97706", "#0891B2", "#EC4899", "#84CC16"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#1E40AF]/5 to-[#7C3AED]/10 dark:from-[#1E40AF]/20 dark:to-[#7C3AED]/30 border-[#1E40AF]/20 dark:border-[#7C3AED]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#1E40AF] dark:text-[#60A5FA]`}>
              Southeast Industrial Real Estate
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#1E40AF]/70 dark:text-[#60A5FA]/80`}>
              Prologis • CBRE • CoStar • NAIOP • Moody's
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.textSmall} bg-[#1E40AF]/10 text-[#1E40AF] dark:bg-[#1E40AF]/30 dark:text-[#60A5FA]`}
              >
                <Warehouse className={`${compactScale.iconSizeSmall} mr-0.5`} />
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
                  className={`${compactScale.textSmall} text-[#1E40AF]/70 dark:text-[#60A5FA]/80`}
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
          <TabsList className={`grid w-full grid-cols-3 ${isCompact ? "mb-2" : "mb-3"} bg-gray-100 dark:bg-gray-800`}>
            <TabsTrigger
              value="lease"
              className={`${
                isCompact ? "text-[8px] px-1" : "text-[9px] px-2"
              } data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 truncate`}
            >
              {isCompact ? "Lease" : "Regional Lease Trends"}
            </TabsTrigger>
            <TabsTrigger
              value="vacancy"
              className={`${
                isCompact ? "text-[8px] px-1" : "text-[9px] px-2"
              } data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 truncate`}
            >
              {isCompact ? "Vacancy" : "Vacancy & Absorption"}
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className={`${
                isCompact ? "text-[8px] px-1" : "text-[9px] px-2"
              } data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 truncate`}
            >
              {isCompact ? "Pipeline" : "Construction Pipeline"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lease" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Performance Indicators */}
            <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-3"}`}>
              {industrialData.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 ${compactScale.padding} rounded-lg border border-[#1E40AF]/20 dark:border-gray-700`}
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

            {/* Lease Trends by Metro Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#1E40AF]" />
                Lease Rates by Metro (YoY Growth)
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  CBRE Industrial
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industrialData.leaseTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metro" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [name === "leaseRate" ? `$${value}/SF` : `${value}%`, name]} />
                    <Bar dataKey="leaseRate" fill="#1E40AF" name="Lease Rate ($/SF)" />
                    <Bar dataKey="yoyGrowth" fill="#7C3AED" name="YoY Growth (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Segments */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Factory className="h-4 w-4 text-[#1E40AF]" />
                Market Segments Performance
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {industrialData.marketSegments.map((segment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{segment.segment}</span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(segment.demand)}`}>
                        {segment.demand} demand
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Lease Rate:</span>
                        <span className="font-medium">${segment.leaseRate}/SF</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Vacancy:</span>
                        <span className="font-medium">{segment.vacancy}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                        <span className="font-medium">+{segment.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vacancy" className="space-y-4">
            {/* Vacancy and Absorption Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-[#1E40AF]" />
                Vacancy & Absorption Trends
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  CoStar Group
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={industrialData.vacancyAbsorption}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "absorption" || name === "completions"
                          ? `${(value as number) / 1000000}M SF`
                          : `${value}%`,
                        name,
                      ]}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="vacancy"
                      stroke="#DC2626"
                      strokeWidth={3}
                      name="Vacancy Rate"
                    />
                    <Bar yAxisId="right" dataKey="absorption" fill="#1E40AF" name="Absorption (MSF)" />
                    <Bar yAxisId="right" dataKey="completions" fill="#7C3AED" name="Completions (MSF)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Performance */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#1E40AF]" />
                Regional Performance Overview
              </h4>
              <div className="space-y-2">
                {industrialData.regionalPerformance.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{region.region}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(region.totalSF / 1000000).toFixed(0)}M SF • {region.vacancy}% vacancy
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        +{region.growth}% growth
                      </Badge>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {(region.pipeline / 1000000).toFixed(1)}M SF pipeline
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Construction Pipeline Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-[#1E40AF]" />
                Construction Pipeline by Metro
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  NAIOP Research
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industrialData.constructionPipeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metro" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "preLeased" ? `${value}%` : `${(value as number) / 1000000}M SF`,
                        name,
                      ]}
                    />
                    <Bar dataKey="underConstruction" fill="#1E40AF" name="Under Construction (MSF)" />
                    <Bar dataKey="planned" fill="#7C3AED" name="Planned (MSF)" />
                    <Bar dataKey="completed" fill="#059669" name="Completed (MSF)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pipeline Summary */}
            <div className="grid grid-cols-2 gap-3">
              {industrialData.constructionPipeline.slice(-2).map((metro, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metro.metro}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {metro.preLeased}% pre-leased
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Under Construction:</span>
                      <span className="font-medium">{(metro.underConstruction / 1000000).toFixed(1)}M SF</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Planned:</span>
                      <span className="font-medium">{(metro.planned / 1000000).toFixed(1)}M SF</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                      <span className="font-medium">{(metro.completed / 1000000).toFixed(1)}M SF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#1E40AF]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    Prologis Research
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    CBRE Industrial
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    CoStar Group
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    NAIOP Research
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                  >
                    Moody's CRE
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
                  >
                    Industrial Reports
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-[#1E40AF]/20 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#1E40AF] dark:text-[#60A5FA]">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
