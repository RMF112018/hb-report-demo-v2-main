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
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Activity,
  DollarSign,
  Package,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  Target,
  Clock,
  Truck,
  Shield,
  Zap,
  Thermometer,
  MoreVertical,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface BetaBuildingMaterialsIndexCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaBuildingMaterialsIndexCard({
  className,
  config,
  isCompact,
}: BetaBuildingMaterialsIndexCardProps) {
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
  const [activeTab, setActiveTab] = useState("pricing")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing building materials pricing and risk metrics
  const materialsData = React.useMemo(() => {
    return {
      // ENR Cost Index data
      materialPricing: [
        {
          name: "Steel",
          current: 892,
          change: 8.2,
          volatility: 12.5,
          supply: 78,
          source: "ENR CCI",
          unit: "$/ton",
          risk: "rising",
        },
        {
          name: "Concrete",
          current: 145,
          change: 3.7,
          volatility: 6.8,
          supply: 92,
          source: "ENR CCI",
          unit: "$/yard",
          risk: "stable",
        },
        {
          name: "Lumber",
          current: 387,
          change: -12.5,
          volatility: 18.2,
          supply: 85,
          source: "Random Lengths",
          unit: "$/MBF",
          risk: "declining",
        },
        {
          name: "Copper",
          current: 4.12,
          change: 15.3,
          volatility: 22.1,
          supply: 65,
          source: "LME",
          unit: "$/lb",
          risk: "critical",
        },
        {
          name: "Aluminum",
          current: 2.34,
          change: 6.8,
          volatility: 9.4,
          supply: 88,
          source: "LME",
          unit: "$/lb",
          risk: "rising",
        },
        {
          name: "Fuel",
          current: 3.68,
          change: 22.1,
          volatility: 25.7,
          supply: 72,
          source: "EIA",
          unit: "$/gal",
          risk: "critical",
        },
        {
          name: "Cement",
          current: 98,
          change: 4.2,
          volatility: 7.1,
          supply: 90,
          source: "ENR CCI",
          unit: "$/ton",
          risk: "stable",
        },
        {
          name: "Glass",
          current: 234,
          change: 11.8,
          volatility: 14.3,
          supply: 82,
          source: "ENR CCI",
          unit: "$/sqft",
          risk: "rising",
        },
      ],

      // Delivery risk metrics
      deliveryRisk: [
        {
          material: "Steel",
          avgDays: 18,
          change: 12.5,
          reliability: 78,
          status: "delayed",
          supplier: "Primary",
          region: "Southeast",
        },
        {
          material: "Concrete",
          avgDays: 7,
          change: -5.2,
          reliability: 95,
          status: "normal",
          supplier: "Local",
          region: "Florida",
        },
        {
          material: "Lumber",
          avgDays: 14,
          change: 8.7,
          reliability: 82,
          status: "stable",
          supplier: "Regional",
          region: "Southeast",
        },
        {
          material: "Copper",
          avgDays: 45,
          change: 28.7,
          reliability: 45,
          status: "critical",
          supplier: "International",
          region: "Global",
        },
        {
          material: "Aluminum",
          avgDays: 22,
          change: 15.3,
          reliability: 68,
          status: "delayed",
          supplier: "Primary",
          region: "Southeast",
        },
        {
          material: "Fuel",
          avgDays: 3,
          change: 2.1,
          reliability: 98,
          status: "normal",
          supplier: "Local",
          region: "Florida",
        },
        {
          material: "Cement",
          avgDays: 12,
          change: 3.1,
          reliability: 88,
          status: "stable",
          supplier: "Regional",
          region: "Southeast",
        },
        {
          material: "Glass",
          avgDays: 28,
          change: 18.5,
          reliability: 72,
          status: "delayed",
          supplier: "Primary",
          region: "Southeast",
        },
      ],

      // Cost volatility trends
      costVolatility: [
        { month: "Jan", steel: 8.2, concrete: 3.7, lumber: -12.5, copper: 15.3, fuel: 22.1, cement: 4.2, glass: 11.8 },
        { month: "Feb", steel: 9.1, concrete: 4.2, lumber: -10.8, copper: 16.7, fuel: 24.3, cement: 4.8, glass: 12.5 },
        { month: "Mar", steel: 7.8, concrete: 3.9, lumber: -8.2, copper: 14.9, fuel: 21.7, cement: 4.1, glass: 11.2 },
        { month: "Apr", steel: 8.9, concrete: 4.5, lumber: -6.5, copper: 17.2, fuel: 25.8, cement: 4.6, glass: 13.1 },
        { month: "May", steel: 10.2, concrete: 5.1, lumber: -4.8, copper: 18.5, fuel: 27.3, cement: 5.2, glass: 14.7 },
        { month: "Jun", steel: 11.8, concrete: 5.8, lumber: -2.1, copper: 19.2, fuel: 28.9, cement: 5.7, glass: 15.4 },
      ],

      // Supply chain health indicators
      supplyChainHealth: [
        { category: "Steel Supply", availability: 78, reliability: 82, risk: "moderate", trend: "declining" },
        { category: "Concrete Supply", availability: 92, reliability: 95, risk: "low", trend: "stable" },
        { category: "Lumber Supply", availability: 85, reliability: 88, risk: "low", trend: "improving" },
        { category: "Copper Supply", availability: 65, reliability: 45, risk: "high", trend: "declining" },
        { category: "Aluminum Supply", availability: 88, reliability: 68, risk: "moderate", trend: "stable" },
        { category: "Fuel Supply", availability: 72, reliability: 98, risk: "moderate", trend: "volatile" },
      ],

      // Regional pricing variations
      regionalPricing: [
        { region: "Miami-Dade", steel: 925, concrete: 152, lumber: 395, copper: 4.25, fuel: 3.75, premium: 8.5 },
        { region: "Broward", steel: 892, concrete: 145, lumber: 387, copper: 4.12, fuel: 3.68, premium: 0 },
        { region: "Palm Beach", steel: 945, concrete: 158, lumber: 402, copper: 4.35, fuel: 3.82, premium: 12.3 },
        { region: "Tampa Bay", steel: 875, concrete: 138, lumber: 375, copper: 4.05, fuel: 3.62, premium: -3.2 },
        { region: "Orlando", steel: 885, concrete: 142, lumber: 382, copper: 4.08, fuel: 3.65, premium: -1.8 },
        { region: "Jacksonville", steel: 868, concrete: 135, lumber: 372, copper: 4.02, fuel: 3.58, premium: -5.1 },
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

  // Get risk status color
  const getRiskStatusColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200"
      case "rising":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
      case "stable":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200"
      case "declining":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Get delivery status color
  const getDeliveryStatusColor = (status: string) => {
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
      className={`bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#FA4616] dark:text-[#FF8A67]`}>
              Building Materials Index
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#FA4616]/70 dark:text-[#FF8A67]/80`}>
              ENR Cost Index • BLS PPI • LME Metals • EIA Fuel
            </p>
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

      <CardContent className="p-4 pb-6">
        {/* Tabs at full width */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4">
          <TabsList className={`grid w-full grid-cols-3 mb-3 ${isCompact ? "h-8" : "h-9"}`}>
            <TabsTrigger
              value="pricing"
              className={`${isCompact ? "text-[9px]" : "text-[10px]"} ${isCompact ? "px-1" : "px-2"} truncate`}
            >
              {isCompact ? "Pricing" : "Material Pricing"}
            </TabsTrigger>
            <TabsTrigger
              value="delivery"
              className={`${isCompact ? "text-[9px]" : "text-[10px]"} ${isCompact ? "px-1" : "px-2"} truncate`}
            >
              {isCompact ? "Delivery" : "Delivery Risk"}
            </TabsTrigger>
            <TabsTrigger
              value="volatility"
              className={`${isCompact ? "text-[9px]" : "text-[10px]"} ${isCompact ? "px-1" : "px-2"} truncate`}
            >
              {isCompact ? "Volatility" : "Cost Volatility"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-4">
            {/* Top Section - Main Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4
                className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 flex-wrap`}
              >
                <DollarSign className="h-4 w-4 text-[#FA4616] flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  {isCompact ? "Materials Index" : "Building Materials Pricing Index"}
                </span>
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 flex-shrink-0`}
                >
                  {isCompact ? "ENR CCI" : "ENR Cost Index"}
                </Badge>
              </h4>
              <div className={compactScale.chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialsData.materialPricing}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`$${value}`, name]} />
                    <Bar dataKey="current" fill="#8B5CF6" name="Current Price" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Section - Material Details Grid */}
            <div className={`grid ${isCompact ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
              {materialsData.materialPricing.slice(0, isCompact ? 4 : 6).map((material, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 truncate`}
                    >
                      {material.name}
                    </span>
                    {getTrendIcon(material.change)}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-gray-900 dark:text-gray-100`}>
                      ${material.current}
                    </span>
                    <span className={`${compactScale.textSmall} text-gray-500 dark:text-gray-400 flex-shrink-0`}>
                      {material.unit}
                    </span>
                  </div>
                  {!isCompact && (
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={`${compactScale.textSmall} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 flex-shrink-0`}
                      >
                        {material.source}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {!isCompact && (
                      <>
                        <span className={`${compactScale.textSmall} text-gray-500 dark:text-gray-400 truncate`}>
                          Vol: {material.volatility}%
                        </span>
                        <span className={`${compactScale.textSmall} text-gray-500 dark:text-gray-400 flex-shrink-0`}>
                          Supply: {material.supply}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            {/* Delivery Risk Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4
                className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 flex-wrap`}
              >
                <Truck className="h-4 w-4 text-[#FA4616] flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  {isCompact ? "Delivery Risk" : "Material Delivery Risk Analysis"}
                </span>
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 flex-shrink-0`}
                >
                  Supply Chain
                </Badge>
              </h4>
              <div className={compactScale.chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={materialsData.deliveryRisk}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="material" angle={-45} textAnchor="end" height={60} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="avgDays" fill="#EF4444" name="Avg Days" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="reliability"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Reliability %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delivery Details Grid */}
            <div className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
              {materialsData.deliveryRisk.slice(0, isCompact ? 3 : 6).map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 truncate`}
                    >
                      {item.material}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${compactScale.textSmall} ${getDeliveryStatusColor(item.status)} flex-shrink-0`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  <div className={`grid grid-cols-2 gap-2 ${compactScale.textSmall}`}>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Days:</span>
                      <span className="font-medium ml-1">{item.avgDays}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Reliability:</span>
                      <span className="font-medium ml-1">{item.reliability}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="volatility" className="space-y-4">
            {/* Volatility Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700">
              <h4
                className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 flex-wrap`}
              >
                <Zap className="h-4 w-4 text-[#FA4616] flex-shrink-0" />
                <span className="flex-1 min-w-0">
                  {isCompact ? "Cost Volatility" : "Material Cost Volatility Trends"}
                </span>
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 flex-shrink-0`}
                >
                  6-Month Trend
                </Badge>
              </h4>
              <div className={compactScale.chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={materialsData.costVolatility}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Line type="monotone" dataKey="steel" stroke="#EF4444" strokeWidth={2} name="Steel" />
                    <Line type="monotone" dataKey="concrete" stroke="#3B82F6" strokeWidth={2} name="Concrete" />
                    <Line type="monotone" dataKey="lumber" stroke="#10B981" strokeWidth={2} name="Lumber" />
                    <Line type="monotone" dataKey="copper" stroke="#F59E0B" strokeWidth={2} name="Copper" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Pricing Summary */}
            <div className={`grid ${isCompact ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
              {materialsData.regionalPricing.slice(0, isCompact ? 2 : 4).map((region, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FA4616]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`${compactScale.textMedium} font-medium text-gray-700 dark:text-gray-300 truncate`}
                    >
                      {region.region}
                    </span>
                    <Badge
                      variant="outline"
                      className={`${compactScale.textSmall} ${
                        region.premium > 0
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      } flex-shrink-0`}
                    >
                      {region.premium > 0 ? "+" : ""}
                      {region.premium}%
                    </Badge>
                  </div>
                  <div className={`${compactScale.textSmall} text-gray-500 dark:text-gray-400`}>
                    Steel: ${region.steel} • Concrete: ${region.concrete}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Footer */}
          <div className="pt-2 border-t border-[#FA4616]/20 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
