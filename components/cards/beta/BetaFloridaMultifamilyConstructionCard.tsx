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
  HardHat,
  Construction,
  Hammer,
  Wrench,
} from "lucide-react"

interface BetaFloridaMultifamilyConstructionCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaFloridaMultifamilyConstructionCard({
  className,
  config,
  isCompact,
}: BetaFloridaMultifamilyConstructionCardProps) {
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
  const [activeTab, setActiveTab] = useState("starts")
  const [selectedRegion, setSelectedRegion] = useState("all")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 50000) // Update every 50 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing Florida multifamily construction indicators
  const constructionData = React.useMemo(() => {
    return {
      // Project starts and permits by county
      projectStarts: [
        { county: "Miami-Dade", permits: 2450, units: 12500, value: 2850000000, yoy: 12.5 },
        { county: "Broward", permits: 1890, units: 9800, value: 2100000000, yoy: 8.7 },
        { county: "Palm Beach", permits: 1560, units: 8200, value: 1850000000, yoy: 15.2 },
        { county: "Hillsborough", permits: 1340, units: 7200, value: 1580000000, yoy: 9.8 },
        { county: "Orange", permits: 1180, units: 6500, value: 1420000000, yoy: 11.3 },
        { county: "Pinellas", permits: 920, units: 4800, value: 1080000000, yoy: 6.4 },
        { county: "Duval", permits: 780, units: 4200, value: 950000000, yoy: 13.7 },
        { county: "Sarasota", permits: 650, units: 3600, value: 820000000, yoy: 18.9 },
      ],

      // Cost trends and backlog data
      costTrends: [
        { month: "Jan", materialCost: 8.2, laborCost: 6.8, equipmentCost: 4.5, backlog: 12.4 },
        { month: "Feb", materialCost: 8.5, laborCost: 7.1, equipmentCost: 4.8, backlog: 12.8 },
        { month: "Mar", materialCost: 8.9, laborCost: 7.5, equipmentCost: 5.2, backlog: 13.2 },
        { month: "Apr", materialCost: 9.3, laborCost: 7.9, equipmentCost: 5.6, backlog: 13.7 },
        { month: "May", materialCost: 9.7, laborCost: 8.3, equipmentCost: 6.0, backlog: 14.1 },
        { month: "Jun", materialCost: 10.2, laborCost: 8.8, equipmentCost: 6.5, backlog: 14.6 },
      ],

      // Delivery pipeline forecast
      deliveryPipeline: [
        { quarter: "Q3 2024", southFL: 8500, centralFL: 6200, northFL: 3800, total: 18500 },
        { quarter: "Q4 2024", southFL: 9200, centralFL: 6800, northFL: 4200, total: 20200 },
        { quarter: "Q1 2025", southFL: 9800, centralFL: 7200, northFL: 4600, total: 21600 },
        { quarter: "Q2 2025", southFL: 10500, centralFL: 7800, northFL: 5000, total: 23300 },
        { quarter: "Q3 2025", southFL: 11200, centralFL: 8400, northFL: 5400, total: 25000 },
        { quarter: "Q4 2025", southFL: 11800, centralFL: 9000, northFL: 5800, total: 26600 },
      ],

      // Key performance indicators
      kpis: [
        { metric: "Total Permits", value: 10780, unit: "", change: 11.8, trend: "up" },
        { metric: "Construction Value", value: 12.8, unit: "B", change: 15.2, trend: "up" },
        { metric: "Labor Shortage", value: 18.5, unit: "%", change: 2.3, trend: "up" },
        { metric: "Material Inflation", value: 10.2, unit: "%", change: 1.8, trend: "up" },
      ],

      // Regional breakdown
      regionalData: [
        { region: "South Florida", permits: 5900, units: 30500, value: 6800000000, growth: 12.1 },
        { region: "Central Florida", permits: 3520, units: 18500, value: 4000000000, growth: 9.8 },
        { region: "North Florida", permits: 1360, units: 7200, value: 1580000000, growth: 11.7 },
      ],

      // Construction segments
      constructionSegments: [
        { segment: "Luxury High-Rise", permits: 420, units: 2800, value: 850000000, growth: 18.5 },
        { segment: "Mid-Rise Mixed-Use", permits: 680, units: 4200, value: 720000000, growth: 12.3 },
        { segment: "Garden-Style", permits: 890, units: 5800, value: 650000000, growth: 8.7 },
        { segment: "Student Housing", permits: 320, units: 2100, value: 380000000, growth: 15.2 },
        { segment: "Senior Living", permits: 280, units: 1800, value: 320000000, growth: 9.4 },
        { segment: "Affordable/Luxury Blend", permits: 520, units: 3400, value: 580000000, growth: 22.1 },
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

  const COLORS = ["#059669", "#2563eb", "#7c3aed", "#dc2626", "#d97706", "#0891b2", "#ec4899", "#84cc16"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#059669]/5 to-[#2563eb]/10 dark:from-[#059669]/20 dark:to-[#2563eb]/30 border-[#059669]/20 dark:border-[#2563eb]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#059669] dark:text-[#10B981]`}>
              Florida Multifamily Construction
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#059669]/70 dark:text-[#10B981]/80`}>
              U.S. Census Bureau • ConstructConnect • AGC Florida • Moody's • HUD
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.textSmall} bg-[#059669]/10 text-[#059669] dark:bg-[#059669]/30 dark:text-[#10B981]`}
              >
                <HardHat className={`${compactScale.iconSizeSmall} mr-0.5`} />
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
                  className={`${compactScale.textSmall} text-[#059669]/70 dark:text-[#10B981]/80`}
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
              value="starts"
              className={`${
                isCompact ? "text-[8px] px-1" : "text-[9px] px-2"
              } data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 truncate`}
            >
              {isCompact ? "Starts" : "Project Starts & Permits"}
            </TabsTrigger>
            <TabsTrigger
              value="costs"
              className={`${
                isCompact ? "text-[8px] px-1" : "text-[9px] px-2"
              } data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 truncate`}
            >
              {isCompact ? "Costs" : "Cost Trends & Backlog"}
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className={`${
                isCompact ? "text-[8px] px-1" : "text-[9px] px-2"
              } data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300 truncate`}
            >
              {isCompact ? "Pipeline" : "Delivery Pipeline"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="starts" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Performance Indicators */}
            <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-3"}`}>
              {constructionData.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 ${compactScale.padding} rounded-lg border border-[#059669]/20 dark:border-gray-700`}
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

            {/* Building Permits by County Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Construction className="h-4 w-4 text-[#059669]" />
                Building Permits by County (YoY)
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  U.S. Census Bureau
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={constructionData.projectStarts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [name === "value" ? `$${(value as number) / 1000000}M` : value, name]}
                    />
                    <Bar dataKey="permits" fill="#059669" name="Permits" />
                    <Bar dataKey="units" fill="#2563eb" name="Units" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#059669]" />
                Regional Construction Activity
              </h4>
              <div className="space-y-2">
                {constructionData.regionalData.map((region, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{region.region}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {region.permits.toLocaleString()} permits • {region.units.toLocaleString()} units
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
                        ${(region.value / 1000000000).toFixed(1)}B value
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            {/* Cost Trends Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#059669]" />
                Construction Cost Trends
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  Moody's & NAHB
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={constructionData.costTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Line
                      type="monotone"
                      dataKey="materialCost"
                      stroke="#dc2626"
                      strokeWidth={3}
                      name="Material Cost"
                    />
                    <Line type="monotone" dataKey="laborCost" stroke="#2563eb" strokeWidth={2} name="Labor Cost" />
                    <Line
                      type="monotone"
                      dataKey="equipmentCost"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      name="Equipment Cost"
                    />
                    <Bar dataKey="backlog" fill="#059669" name="Backlog (Months)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Construction Segments */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#059669]" />
                Construction Segments Performance
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {constructionData.constructionSegments.map((segment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{segment.segment}</span>
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        +{segment.growth}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Permits:</span>
                        <span className="font-medium">{segment.permits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Units:</span>
                        <span className="font-medium">{segment.units.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Value:</span>
                        <span className="font-medium">${(segment.value / 1000000).toFixed(0)}M</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Delivery Pipeline Forecast */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#059669]" />
                Unit Delivery Forecast (Next 12-24 Months)
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  ConstructConnect
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={constructionData.deliveryPipeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                    <Area
                      type="monotone"
                      dataKey="southFL"
                      stackId="1"
                      stroke="#059669"
                      fill="#059669"
                      fillOpacity={0.8}
                      name="South Florida"
                    />
                    <Area
                      type="monotone"
                      dataKey="centralFL"
                      stackId="1"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.8}
                      name="Central Florida"
                    />
                    <Area
                      type="monotone"
                      dataKey="northFL"
                      stackId="1"
                      stroke="#7c3aed"
                      fill="#7c3aed"
                      fillOpacity={0.8}
                      name="North Florida"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pipeline Summary */}
            <div className="grid grid-cols-2 gap-3">
              {constructionData.deliveryPipeline.slice(-2).map((quarter, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{quarter.quarter}</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {quarter.total.toLocaleString()} total
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">South FL:</span>
                      <span className="font-medium">{quarter.southFL.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Central FL:</span>
                      <span className="font-medium">{quarter.centralFL.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">North FL:</span>
                      <span className="font-medium">{quarter.northFL.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#059669]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    U.S. Census Bureau
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    ConstructConnect
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    AGC Florida
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                  >
                    Moody's CRE
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                  >
                    NAHB
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-center bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
                  >
                    HUD
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-[#059669]/20 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#059669] dark:text-[#10B981]">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
