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
  Sun,
  Palmtree,
  Anchor,
  Building,
} from "lucide-react"

interface BetaFloridaMultifamilyRealEstateCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaFloridaMultifamilyRealEstateCard({
  className,
  config,
  isCompact,
}: BetaFloridaMultifamilyRealEstateCardProps) {
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
  const [activeTab, setActiveTab] = useState("rents")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 45000) // Update every 45 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing Florida multifamily real estate indicators
  const floridaData = React.useMemo(() => {
    return {
      // Rent growth forecasts by metro
      rentGrowth: [
        { month: "Jan", miami: 8.5, tampa: 7.2, orlando: 6.8, jacksonville: 5.9, statewide: 7.1 },
        { month: "Feb", miami: 8.8, tampa: 7.5, orlando: 7.1, jacksonville: 6.2, statewide: 7.4 },
        { month: "Mar", miami: 9.2, tampa: 7.8, orlando: 7.4, jacksonville: 6.5, statewide: 7.7 },
        { month: "Apr", miami: 9.5, tampa: 8.1, orlando: 7.7, jacksonville: 6.8, statewide: 8.0 },
        { month: "May", miami: 9.8, tampa: 8.4, orlando: 8.0, jacksonville: 7.1, statewide: 8.3 },
        { month: "Jun", miami: 10.2, tampa: 8.7, orlando: 8.3, jacksonville: 7.4, statewide: 8.6 },
      ],

      // Vacancy and occupancy rates
      vacancyOccupancy: [
        { metro: "Miami", vacancy: 4.2, occupancy: 95.8, rentGrowth: 10.2, affordability: 28.5 },
        { metro: "Tampa", vacancy: 5.1, occupancy: 94.9, rentGrowth: 8.7, affordability: 32.1 },
        { metro: "Orlando", vacancy: 5.8, occupancy: 94.2, rentGrowth: 8.3, affordability: 35.4 },
        { metro: "Jacksonville", vacancy: 6.5, occupancy: 93.5, rentGrowth: 7.4, affordability: 38.7 },
        { metro: "Fort Lauderdale", vacancy: 4.8, occupancy: 95.2, rentGrowth: 9.1, affordability: 30.2 },
        { metro: "West Palm Beach", vacancy: 4.5, occupancy: 95.5, rentGrowth: 9.8, affordability: 29.1 },
      ],

      // Affordability index data
      affordabilityIndex: [
        { quarter: "Q1 2024", rentToIncome: 28.5, medianRent: 2450, medianIncome: 68500, affordability: "moderate" },
        { quarter: "Q2 2024", rentToIncome: 29.2, medianRent: 2520, medianIncome: 69200, affordability: "moderate" },
        { quarter: "Q3 2024", rentToIncome: 30.1, medianRent: 2590, medianIncome: 69900, affordability: "moderate" },
        { quarter: "Q4 2024", rentToIncome: 31.0, medianRent: 2660, medianIncome: 70600, affordability: "challenging" },
      ],

      // Key performance indicators
      kpis: [
        { metric: "Statewide Rent Growth", value: 8.6, unit: "%", change: 1.5, trend: "up" },
        { metric: "Average Vacancy Rate", value: 5.1, unit: "%", change: -0.3, trend: "down" },
        { metric: "Rent-to-Income Ratio", value: 31.0, unit: "%", change: 2.5, trend: "up" },
        { metric: "Luxury Premium", value: 15.2, unit: "%", change: 3.1, trend: "up" },
      ],

      // Market segments
      marketSegments: [
        { segment: "Luxury Class A", growth: 12.5, vacancy: 3.2, premium: 25.0, demand: "high" },
        { segment: "Mid-Market Class B", growth: 8.7, vacancy: 5.1, premium: 12.0, demand: "moderate" },
        { segment: "Affordable Class C", growth: 6.2, vacancy: 7.8, premium: 5.0, demand: "high" },
        { segment: "Student Housing", growth: 9.8, vacancy: 4.5, premium: 18.0, demand: "high" },
        { segment: "Senior Living", growth: 7.4, vacancy: 6.2, premium: 15.0, demand: "moderate" },
        { segment: "Short-term Rentals", growth: 11.2, vacancy: 8.5, premium: 30.0, demand: "moderate" },
      ],

      // Development pipeline
      developmentPipeline: [
        { metro: "Miami", underConstruction: 12500, planned: 8900, completed: 6800, absorption: 7200 },
        { metro: "Tampa", underConstruction: 9800, planned: 7200, completed: 5400, absorption: 6100 },
        { metro: "Orlando", underConstruction: 11200, planned: 8100, completed: 6200, absorption: 6800 },
        { metro: "Jacksonville", underConstruction: 6800, planned: 5200, completed: 4100, absorption: 4500 },
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
      case "challenging":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200"
      case "low":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const COLORS = ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5", "#7209B7", "#4361EE", "#3A0CA3", "#560BAD"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#FF6B35]/5 to-[#F7931E]/10 dark:from-[#FF6B35]/20 dark:to-[#F7931E]/30 border-[#FF6B35]/20 dark:border-[#F7931E]/40 ${className}`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${compactScale.textTitle} font-semibold text-[#FF6B35] dark:text-[#FF8A65]`}>
              Florida Multifamily Real Estate
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#FF6B35]/70 dark:text-[#FF8A65]/80`}>
              Freddie Mac • Yardi Matrix • FHFA • NAR • John Burns
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.textSmall} bg-[#FF6B35]/10 text-[#FF6B35] dark:bg-[#FF6B35]/30 dark:text-[#FF8A65]`}
              >
                <Sun className={`${compactScale.iconSizeSmall} mr-0.5`} />
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
                  className={`${compactScale.textSmall} text-[#FF6B35]/70 dark:text-[#FF8A65]/80`}
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
            <TabsTrigger value="rents" className={`${isCompact ? "text-[8px] px-1" : "text-[9px] px-2"} truncate`}>
              {isCompact ? "Rents" : "Rent Growth"}
            </TabsTrigger>
            <TabsTrigger value="vacancy" className={`${isCompact ? "text-[8px] px-1" : "text-[9px] px-2"} truncate`}>
              {isCompact ? "Vacancy" : "Vacancy & Occupancy"}
            </TabsTrigger>
            <TabsTrigger
              value="affordability"
              className={`${isCompact ? "text-[8px] px-1" : "text-[9px] px-2"} truncate`}
            >
              {isCompact ? "Affordability" : "Affordability Index"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rents" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Key Performance Indicators */}
            <div className={`grid grid-cols-2 ${isCompact ? "gap-2" : "gap-3"}`}>
              {floridaData.kpis.map((kpi, index) => (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 ${compactScale.padding} rounded-lg border border-[#FF6B35]/20 dark:border-gray-700`}
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

            {/* Rent Growth Forecasts Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#FF6B35]" />
                Rent Growth Forecasts by Metro
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  Yardi Matrix
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={floridaData.rentGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Line type="monotone" dataKey="miami" stroke="#FF6B35" strokeWidth={3} name="Miami" />
                    <Line type="monotone" dataKey="tampa" stroke="#F7931E" strokeWidth={2} name="Tampa" />
                    <Line type="monotone" dataKey="orlando" stroke="#FFD23F" strokeWidth={2} name="Orlando" />
                    <Line type="monotone" dataKey="jacksonville" stroke="#06FFA5" strokeWidth={2} name="Jacksonville" />
                    <Line
                      type="monotone"
                      dataKey="statewide"
                      stroke="#7209B7"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Statewide"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Segments */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-[#FF6B35]" />
                Market Segment Performance
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {floridaData.marketSegments.map((segment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{segment.segment}</span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(segment.demand)}`}>
                        {segment.demand} demand
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                        <span className="font-medium">+{segment.growth}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Vacancy:</span>
                        <span className="font-medium">{segment.vacancy}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Premium:</span>
                        <span className="font-medium">+{segment.premium}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vacancy" className="space-y-4">
            {/* Vacancy and Occupancy Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Palmtree className="h-4 w-4 text-[#FF6B35]" />
                Vacancy & Occupancy Rates by Metro
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Freddie Mac
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floridaData.vacancyOccupancy}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metro" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <Bar dataKey="vacancy" fill="#FF6B35" name="Vacancy Rate" />
                    <Bar dataKey="occupancy" fill="#06FFA5" name="Occupancy Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metro Performance Heatmap */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#FF6B35]" />
                Metro Performance Overview
              </h4>
              <div className="space-y-2">
                {floridaData.vacancyOccupancy.map((metro, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{metro.metro}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Vacancy: {metro.vacancy}% • Rent Growth: {metro.rentGrowth}%
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                        {metro.occupancy}% occupancy
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ml-1 ${getStatusColor(
                          metro.affordability < 30 ? "low" : metro.affordability < 35 ? "moderate" : "challenging"
                        )}`}
                      >
                        {metro.affordability}% affordability
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Development Pipeline */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#FF6B35]" />
                Development Pipeline (Units)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {floridaData.developmentPipeline.map((metro, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metro.metro}</span>
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                        {metro.underConstruction + metro.planned} total
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Under Construction:</span>
                        <span className="font-medium">{metro.underConstruction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Planned:</span>
                        <span className="font-medium">{metro.planned.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Absorption:</span>
                        <span className="font-medium">{metro.absorption.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="affordability" className="space-y-4">
            {/* Affordability Index Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#FF6B35]" />
                Rent-to-Income Ratio Trends
                <Badge variant="outline" className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  FHFA & NAR
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={floridaData.affordabilityIndex}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [name === "medianRent" ? `$${value}` : `${value}%`, name]} />
                    <Area
                      type="monotone"
                      dataKey="rentToIncome"
                      stroke="#FF6B35"
                      fill="#FF6B35"
                      fillOpacity={0.3}
                      name="Rent-to-Income Ratio"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Affordability Gauge */}
            <div className="grid grid-cols-2 gap-3">
              {floridaData.affordabilityIndex.slice(-2).map((quarter, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{quarter.quarter}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(quarter.affordability)}`}>
                      {quarter.affordability}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Rent-to-Income:</span>
                      <span className="font-medium">{quarter.rentToIncome}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Median Rent:</span>
                      <span className="font-medium">${quarter.medianRent}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Median Income:</span>
                      <span className="font-medium">${quarter.medianIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-[#FF6B35]/20 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-blue-100 text-blue-800">
                    Freddie Mac
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-green-100 text-green-800">
                    Yardi Matrix
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-orange-100 text-orange-800">
                    FHFA
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-purple-100 text-purple-800">
                    NAR
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-pink-100 text-pink-800">
                    John Burns
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-cyan-100 text-cyan-800">
                    Florida HUD
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-[#FF6B35]/20 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-[#FF6B35] dark:text-[#FF8A65]">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
