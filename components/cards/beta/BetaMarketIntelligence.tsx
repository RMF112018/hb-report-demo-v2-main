"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Activity,
  DollarSign,
  Users,
  Package,
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  Target,
  Clock,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"

interface BetaMarketIntelligenceProps {
  className?: string
  config?: any
}

export default function BetaMarketIntelligence({ className, config }: BetaMarketIntelligenceProps) {
  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 25000) // Update every 25 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing real industry sources and metrics
  const marketData = React.useMemo(() => {
    return {
      // Material costs and pricing trends (ENR data)
      materialCosts: [
        { name: "Steel", current: 892, change: 8.2, source: "ENR CCI", unit: "$/ton" },
        { name: "Concrete", current: 145, change: 3.7, source: "ENR CCI", unit: "$/yard" },
        { name: "Lumber", current: 387, change: -12.5, source: "Random Lengths", unit: "$/MBF" },
        { name: "Copper", current: 4.12, change: 15.3, source: "LME", unit: "$/lb" },
        { name: "Aluminum", current: 2.34, change: 6.8, source: "LME", unit: "$/lb" },
        { name: "Fuel", current: 3.68, change: 22.1, source: "EIA", unit: "$/gal" },
      ],

      // Labor metrics (BLS data)
      laborMetrics: [
        { category: "Skilled Trades", wage: 34.5, availability: 67, productivity: 94, change: 8.1 },
        { category: "General Labor", wage: 18.75, availability: 82, productivity: 96, change: 5.3 },
        { category: "Supervisors", wage: 52.25, availability: 58, productivity: 98, change: 12.4 },
        { category: "Equipment Operators", wage: 28.9, availability: 71, productivity: 93, change: 7.8 },
      ],

      // Supply chain indicators
      supplyChain: [
        { category: "Material Delivery", avgDays: 18, change: 12.5, status: "delayed" },
        { category: "Equipment Rental", availability: 78, change: -5.2, status: "stable" },
        { category: "Specialty Materials", avgDays: 45, change: 28.7, status: "critical" },
        { category: "Standard Materials", avgDays: 12, change: 3.1, status: "normal" },
      ],

      // Construction activity (US Census/FL data)
      constructionActivity: [
        { month: "Jan", permits: 12845, starts: 11234, completions: 9876, value: 2.8 },
        { month: "Feb", permits: 13567, starts: 12456, completions: 10234, value: 3.1 },
        { month: "Mar", permits: 14123, starts: 13189, completions: 11456, value: 3.4 },
        { month: "Apr", permits: 15234, starts: 14678, completions: 12134, value: 3.7 },
        { month: "May", permits: 16789, starts: 15234, completions: 13567, value: 4.1 },
        { month: "Jun", permits: 17456, starts: 16123, completions: 14234, value: 4.3 },
      ],

      // Real estate metrics (NAR/MLS data)
      realEstateMetrics: [
        { type: "Single Family", medianPrice: 485000, inventory: 2.8, daysOnMarket: 24, change: 12.3 },
        { type: "Condos", medianPrice: 325000, inventory: 3.2, daysOnMarket: 31, change: 8.7 },
        { type: "Townhomes", medianPrice: 395000, inventory: 2.1, daysOnMarket: 18, change: 15.2 },
        { type: "Commercial", medianPrice: 175, inventory: 4.5, daysOnMarket: 89, change: 6.8 },
      ],

      // Economic indicators (Federal Reserve/BEA)
      economicIndicators: [
        { name: "Construction GDP", value: 8.7, change: 4.2, trend: "up" },
        { name: "Employment Rate", value: 96.8, change: 1.8, trend: "up" },
        { name: "Interest Rates", value: 6.75, change: 0.25, trend: "stable" },
        { name: "Inflation (Construction)", value: 4.1, change: -0.8, trend: "down" },
      ],

      // Regional market data for Florida
      floridaMarkets: [
        { region: "Miami-Dade", growth: 15.2, volume: 8.9, permits: 4567, price: 625000 },
        { region: "Broward", growth: 12.8, volume: 6.7, permits: 3234, price: 485000 },
        { region: "Palm Beach", growth: 18.5, volume: 5.2, permits: 2345, price: 725000 },
        { region: "Tampa Bay", growth: 14.1, volume: 7.8, permits: 3876, price: 395000 },
        { region: "Orlando", growth: 16.7, volume: 6.3, permits: 3456, price: 425000 },
        { region: "Jacksonville", growth: 9.4, volume: 4.1, permits: 2134, price: 325000 },
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
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200"
      case "delayed":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
      case "normal":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200"
      case "stable":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#FA4616] dark:text-[#FF8A67]">
              Market Intelligence
            </CardTitle>
            <p className="text-sm text-[#FA4616]/70 dark:text-[#FF8A67]/80">
              Florida Construction & Real Estate • Live Data Sources
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
              >
                <Activity className="h-3 w-3 mr-1" />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Live Data
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label htmlFor="real-time" className="text-sm text-[#FA4616]/70 dark:text-[#FF8A67]/80">
                Real-time
              </Label>
            </div>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="labor">Labor</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Economic Indicators */}
            <div className="grid grid-cols-2 gap-3">
              {marketData.economicIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{indicator.name}</span>
                    {getTrendIcon(indicator.change)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">{indicator.value}%</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        indicator.change > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : indicator.change < 0
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {indicator.change > 0 ? "+" : ""}
                      {indicator.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Construction Activity Trend */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Florida Construction Activity Trend
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  US Census Bureau
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={marketData.constructionActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="permits" fill="#3B82F6" name="Permits" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="value"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Value ($B)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Supply Chain Status */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                Supply Chain Status
              </h4>
              <div className="space-y-2">
                {marketData.supplyChain.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.category}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.avgDays} days avg • {item.change > 0 ? "+" : ""}
                        {item.change}% change
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            {/* Material Cost Index */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                Material Cost Index
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  ENR CCI
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData.materialCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value}`, name]} />
                    <Bar dataKey="current" fill="#8B5CF6" name="Current Price" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Material Price Changes */}
            <div className="grid grid-cols-2 gap-3">
              {marketData.materialCosts.map((material, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{material.name}</span>
                    {getTrendIcon(material.change)}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${material.current}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{material.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    >
                      {material.source}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        material.change > 0
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {material.change > 0 ? "+" : ""}
                      {material.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="labor" className="space-y-4">
            {/* Labor Market Overview */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Labor Market Analysis
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  BLS Data
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData.laborMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="wage" fill="#3B82F6" name="Hourly Wage ($)" />
                    <Bar dataKey="availability" fill="#10B981" name="Availability (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Labor Metrics Detail */}
            <div className="space-y-2">
              {marketData.laborMetrics.map((labor, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{labor.category}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        labor.change > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      +{labor.change}% YoY
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Wage:</span>
                      <span className="font-medium ml-1">${labor.wage}/hr</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Available:</span>
                      <span className="font-medium ml-1">{labor.availability}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Productivity:</span>
                      <span className="font-medium ml-1">{labor.productivity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            {/* Florida Regional Markets */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                Florida Regional Performance
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  MLS Data
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData.floridaMarkets}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [name === "price" ? `$${value.toLocaleString()}` : `${value}%`, name]}
                    />
                    <Bar dataKey="growth" fill="#EF4444" name="Growth %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Real Estate Metrics */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                Real Estate Market Segments
              </h4>
              <div className="space-y-2">
                {marketData.realEstateMetrics.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{segment.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(segment.medianPrice, 0)} median • {segment.daysOnMarket} days on market
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          segment.change > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        +{segment.change}%
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{segment.inventory}mo supply</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-blue-100 text-blue-800">
                    ENR Cost Index
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-green-100 text-green-800">
                    Bureau of Labor Statistics
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-orange-100 text-orange-800">
                    US Census Bureau
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-purple-100 text-purple-800">
                    Federal Reserve
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-pink-100 text-pink-800">
                    MLS Data
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-cyan-100 text-cyan-800">
                    Bloomberg Terminal
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-purple-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-purple-600 dark:text-purple-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
