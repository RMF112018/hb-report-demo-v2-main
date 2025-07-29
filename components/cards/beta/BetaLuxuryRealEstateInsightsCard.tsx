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
} from "lucide-react"

interface BetaLuxuryRealEstateInsightsCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaLuxuryRealEstateInsightsCard({
  className,
  config,
  isCompact,
}: BetaLuxuryRealEstateInsightsCardProps) {
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
  const [activeTab, setActiveTab] = useState("price-trends")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing luxury real estate metrics
  const luxuryData = React.useMemo(() => {
    return {
      // Price trends (NAR & FHFA data)
      priceTrends: [
        { month: "Jan", medianPrice: 1250000, hpi: 285.4, change: 8.2, volume: 156 },
        { month: "Feb", medianPrice: 1285000, hpi: 289.7, change: 9.1, volume: 168 },
        { month: "Mar", medianPrice: 1320000, hpi: 294.2, change: 10.3, volume: 182 },
        { month: "Apr", medianPrice: 1355000, hpi: 298.8, change: 11.5, volume: 195 },
        { month: "May", medianPrice: 1390000, hpi: 303.5, change: 12.8, volume: 208 },
        { month: "Jun", medianPrice: 1425000, hpi: 308.2, change: 14.1, volume: 225 },
      ],

      // Inventory and velocity metrics
      inventoryVelocity: [
        { region: "Miami Beach", inventory: 2.1, dom: 18, price: 2850000, velocity: 85 },
        { region: "Palm Beach", inventory: 1.8, dom: 22, price: 3250000, velocity: 78 },
        { region: "Naples", inventory: 2.5, dom: 31, price: 1850000, velocity: 65 },
        { region: "Sarasota", inventory: 3.2, dom: 28, price: 1450000, velocity: 72 },
        { region: "Tampa Bay", inventory: 2.8, dom: 25, price: 1250000, velocity: 75 },
        { region: "Orlando", inventory: 3.5, dom: 35, price: 950000, velocity: 58 },
      ],

      // Affordability index (JBREC data)
      affordabilityIndex: [
        { quarter: "Q1 2024", luxuryIndex: 125.4, mortgageRate: 6.75, affordability: 78, demand: 85 },
        { quarter: "Q2 2024", luxuryIndex: 128.7, mortgageRate: 6.85, affordability: 75, demand: 82 },
        { quarter: "Q3 2024", luxuryIndex: 132.1, mortgageRate: 6.95, affordability: 72, demand: 79 },
        { quarter: "Q4 2024", luxuryIndex: 135.6, mortgageRate: 7.05, affordability: 68, demand: 76 },
      ],

      // Key performance indicators
      kpis: [
        { metric: "Median Price", value: 1425, unit: "K", change: 14.1, trend: "up" },
        { metric: "HPI Index", value: 308.2, unit: "", change: 8.2, trend: "up" },
        { metric: "Days on Market", value: 24, unit: "", change: -12.5, trend: "down" },
        { metric: "Inventory Months", value: 2.8, unit: "", change: -8.3, trend: "down" },
      ],

      // Regional luxury markets
      regionalMarkets: [
        { market: "Miami Beach", medianPrice: 2850000, growth: 18.5, inventory: 2.1, velocity: 85 },
        { market: "Palm Beach", medianPrice: 3250000, growth: 22.1, inventory: 1.8, velocity: 78 },
        { market: "Naples", medianPrice: 1850000, growth: 15.3, inventory: 2.5, velocity: 65 },
        { market: "Sarasota", medianPrice: 1450000, growth: 12.8, inventory: 3.2, velocity: 72 },
        { market: "Tampa Bay", medianPrice: 1250000, growth: 16.7, inventory: 2.8, velocity: 75 },
        { market: "Orlando", medianPrice: 950000, growth: 9.4, inventory: 3.5, velocity: 58 },
      ],

      // Rent forecasts (Freddie Mac data)
      rentForecasts: [
        { month: "Jul", luxuryRent: 8500, growth: 12.5, occupancy: 94, capRate: 4.2 },
        { month: "Aug", luxuryRent: 8750, growth: 13.8, occupancy: 95, capRate: 4.1 },
        { month: "Sep", luxuryRent: 9000, growth: 15.2, occupancy: 96, capRate: 4.0 },
        { month: "Oct", luxuryRent: 9250, growth: 16.7, occupancy: 97, capRate: 3.9 },
        { month: "Nov", luxuryRent: 9500, growth: 18.3, occupancy: 98, capRate: 3.8 },
        { month: "Dec", luxuryRent: 9750, growth: 20.1, occupancy: 99, capRate: 3.7 },
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
      className={`h-full bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#FA4616] dark:text-[#FF8A67]`}>
              Luxury Real Estate Insights
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#FA4616]/70 dark:text-[#FF8A67]/80`}>
              NAR • FHFA • John Burns Research • Freddie Mac
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.textSmall} bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]`}
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
                  className={`${compactScale.textSmall} text-[#FA4616]/70 dark:text-[#FF8A67]/80`}
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
            <TabsTrigger value="price-trends" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Price Trends
            </TabsTrigger>
            <TabsTrigger value="inventory" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Inventory & Velocity
            </TabsTrigger>
            <TabsTrigger value="affordability" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Affordability Index
            </TabsTrigger>
          </TabsList>

          <TabsContent value="price-trends" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Performance Indicators */}
            <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-3"}`}>
              {luxuryData.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 ${compactScale.padding} rounded-lg border border-[#FA4616]/20 dark:border-gray-700`}
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

            {/* Price Trends Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#FA4616]" />
                Luxury Price Trends & HPI
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  NAR & FHFA
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={luxuryData.priceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "medianPrice" ? formatCurrency(value as number) : value,
                        name,
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="medianPrice" fill="#FA4616" name="Median Price" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="hpi"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="HPI Index"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Markets */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FA4616]" />
                Regional Luxury Markets
              </h4>
              <div className="space-y-2">
                {luxuryData.regionalMarkets.map((market, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{market.market}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(market.medianPrice, 0)} • +{market.growth}% growth
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                        {market.velocity}% velocity
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{market.inventory}mo inventory</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            {/* Inventory & Velocity Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-[#FA4616]" />
                Inventory & Market Velocity
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  Market Data
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={luxuryData.inventoryVelocity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [name === "price" ? formatCurrency(value as number) : value, name]}
                    />
                    <Bar dataKey="dom" fill="#FA4616" name="Days on Market" />
                    <Bar dataKey="inventory" fill="#10B981" name="Inventory Months" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Details */}
            <div className="grid grid-cols-2 gap-3">
              {luxuryData.inventoryVelocity.map((region, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{region.region}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        region.velocity >= 80
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : region.velocity >= 70
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {region.velocity}% velocity
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Price:</span>
                      <span className="font-medium">{formatCurrency(region.price, 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">DOM:</span>
                      <span className="font-medium">{region.dom} days</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Inventory:</span>
                      <span className="font-medium">{region.inventory} months</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="affordability" className="space-y-4">
            {/* Affordability Index Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Percent className="h-4 w-4 text-[#FA4616]" />
                Luxury Affordability Index
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  JBREC Data
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={luxuryData.affordabilityIndex}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="luxuryIndex" stroke="#FA4616" strokeWidth={2} name="Luxury Index" />
                    <Line
                      type="monotone"
                      dataKey="affordability"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Affordability"
                    />
                    <Line type="monotone" dataKey="demand" stroke="#3B82F6" strokeWidth={2} name="Demand" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rent Forecasts */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Home className="h-4 w-4 text-[#FA4616]" />
                Luxury Rent Forecasts
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  Freddie Mac
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={luxuryData.rentForecasts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "luxuryRent" ? formatCurrency(value as number) : `${value}%`,
                        name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="luxuryRent"
                      stroke="#FA4616"
                      fill="#FA4616"
                      fillOpacity={0.3}
                      name="Luxury Rent"
                    />
                    <Line type="monotone" dataKey="capRate" stroke="#10B981" strokeWidth={2} name="Cap Rate %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Affordability Details */}
            <div className="space-y-2">
              {luxuryData.affordabilityIndex.map((quarter, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{quarter.quarter}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        quarter.affordability >= 75
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : quarter.affordability >= 65
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {quarter.affordability}% affordable
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Luxury Index:</span>
                      <span className="font-medium ml-1">{quarter.luxuryIndex}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Mortgage Rate:</span>
                      <span className="font-medium ml-1">{quarter.mortgageRate}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Demand:</span>
                      <span className="font-medium ml-1">{quarter.demand}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-[#FA4616]/20 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#FA4616] dark:text-[#FF8A67]">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
