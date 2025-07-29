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
  Building2,
  MapPin,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  Target,
  Clock,
  Building,
  Home,
  Globe,
  Shield,
  Award,
  Users,
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
} from "recharts"

interface BetaPublicSectorConstructionCardProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaPublicSectorConstructionCard({
  className,
  config,
  isCompact,
}: BetaPublicSectorConstructionCardProps) {
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
  const [activeTab, setActiveTab] = useState("municipal")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 35000) // Update every 35 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock data representing Florida local municipality construction activity
  const floridaLocalData = React.useMemo(() => {
    return {
      // Local municipal capital improvement projects
      flMunicipalProjects: [
        { city: "Miami", category: "Stormwater", value: 32500000, permits: 87, change: 6.2, status: "active" },
        {
          city: "Orlando",
          category: "Parks & Recreation",
          value: 18500000,
          permits: 33,
          change: 4.1,
          status: "active",
        },
        { city: "Tampa", category: "Transportation", value: 54000000, permits: 65, change: 7.8, status: "active" },
        {
          city: "St. Petersburg",
          category: "Public Safety",
          value: 27500000,
          permits: 22,
          change: 3.5,
          status: "active",
        },
        {
          city: "Jacksonville",
          category: "Facility Renovations",
          value: 43000000,
          permits: 41,
          change: 5.9,
          status: "active",
        },
        {
          city: "Fort Lauderdale",
          category: "Water Infrastructure",
          value: 38000000,
          permits: 28,
          change: 8.3,
          status: "active",
        },
        {
          city: "Tallahassee",
          category: "Energy Efficiency",
          value: 22000000,
          permits: 15,
          change: 2.7,
          status: "active",
        },
        {
          city: "Gainesville",
          category: "Public Transit",
          value: 18500000,
          permits: 19,
          change: 4.9,
          status: "active",
        },
      ],

      // Local affordable housing initiatives
      flAffordableHousingInitiatives: [
        { program: "Miami-Dade Affordable Bond", funding: 28000000, units: 850, change: 4.5, status: "funded" },
        { program: "Orlando Infill Housing", funding: 12500000, units: 300, change: 2.3, status: "active" },
        { program: "Tampa SHIP Program", funding: 9800000, units: 215, change: 3.1, status: "funded" },
        { program: "Broward County Housing Trust", funding: 18500000, units: 420, change: 5.7, status: "funded" },
        { program: "Palm Beach SHIP", funding: 14200000, units: 285, change: 3.8, status: "active" },
        { program: "Hillsborough Affordable Housing", funding: 16500000, units: 380, change: 6.2, status: "funded" },
        { program: "Orange County Housing Initiative", funding: 11200000, units: 245, change: 4.1, status: "active" },
        { program: "Pinellas County Housing Program", funding: 8900000, units: 195, change: 2.9, status: "funded" },
      ],

      // County-level infrastructure activity
      countyLevelActivity: [
        { county: "Palm Beach", value: 76000000, projects: 122, permits: 815, growth: 6.8, status: "active" },
        { county: "Broward", value: 88500000, projects: 148, permits: 942, growth: 5.5, status: "active" },
        { county: "Orange", value: 69000000, projects: 101, permits: 672, growth: 4.3, status: "active" },
        { county: "Hillsborough", value: 72000000, projects: 134, permits: 756, growth: 7.2, status: "active" },
        { county: "Miami-Dade", value: 95000000, projects: 167, permits: 1023, growth: 8.1, status: "active" },
        { county: "Pinellas", value: 52000000, projects: 89, permits: 445, growth: 3.9, status: "active" },
        { county: "Duval", value: 58000000, projects: 95, permits: 523, growth: 5.4, status: "active" },
        { county: "Lee", value: 42000000, projects: 67, permits: 334, growth: 4.7, status: "active" },
      ],

      // Local project trends by month
      localProjectTrends: [
        { month: "Jan", municipal: 285, housing: 189, infrastructure: 142, total: 616 },
        { month: "Feb", municipal: 298, housing: 195, infrastructure: 148, total: 641 },
        { month: "Mar", municipal: 312, housing: 202, infrastructure: 155, total: 669 },
        { month: "Apr", municipal: 325, housing: 208, infrastructure: 162, total: 695 },
        { month: "May", municipal: 338, housing: 215, infrastructure: 169, total: 722 },
        { month: "Jun", municipal: 352, housing: 222, infrastructure: 176, total: 750 },
      ],

      // Local housing delivery by quarter
      localHousingDelivery: [
        { quarter: "Q1 2024", affordable: 1250, market: 2150, mixed: 850, total: 4250 },
        { quarter: "Q2 2024", affordable: 1320, market: 2280, mixed: 920, total: 4520 },
        { quarter: "Q3 2024", affordable: 1380, market: 2410, mixed: 980, total: 4770 },
        { quarter: "Q4 2024", affordable: 1450, market: 2540, mixed: 1050, total: 5040 },
      ],

      // Local permitting activity
      localPermittingActivity: [
        { month: "Jan", residential: 1250, commercial: 890, infrastructure: 450, change: 8.5 },
        { month: "Feb", residential: 1320, commercial: 920, infrastructure: 480, change: 9.2 },
        { month: "Mar", residential: 1380, commercial: 950, infrastructure: 510, change: 7.8 },
        { month: "Apr", residential: 1450, commercial: 980, infrastructure: 540, change: 10.1 },
        { month: "May", residential: 1520, commercial: 1010, infrastructure: 570, change: 11.3 },
        { month: "Jun", residential: 1580, commercial: 1040, infrastructure: 600, change: 12.7 },
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

  // Format large numbers
  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toLocaleString()}`
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
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200"
      case "funded":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
      case "pending":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200"
      case "completed":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200"
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
              Florida Local Construction
            </CardTitle>
            <p className={`${compactScale.textMedium} text-[#0021A5]/70 dark:text-[#4A7FD6]/80`}>
              Municipal & County Projects • Local Infrastructure & Housing
            </p>
            <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
              <Badge
                variant="outline"
                className={`${compactScale.textSmall} bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]`}
              >
                <Building className={`${compactScale.iconSizeSmall} mr-0.5`} />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]`}
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
            <TabsTrigger value="municipal" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Municipal Projects
            </TabsTrigger>
            <TabsTrigger value="housing" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              Local Housing
            </TabsTrigger>
            <TabsTrigger value="county" className={`${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              County Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="municipal" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Municipal Projects Overview */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-600" />
                Local Municipal Projects
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  City Budget Office
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floridaLocalData.flMunicipalProjects}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [formatLargeNumber(value as number), name]} />
                    <Bar dataKey="value" fill="#3B82F6" name="Project Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Municipal Projects Details */}
            <div className="grid grid-cols-2 gap-3">
              {floridaLocalData.flMunicipalProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{project.city}</span>
                    {getTrendIcon(project.change)}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {formatLargeNumber(project.value)}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{project.permits} permits</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        project.change > 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {project.change > 0 ? "+" : ""}
                      {project.change}%
                    </Badge>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{project.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="housing" className="space-y-4">
            {/* Local Housing Programs Overview */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-600" />
                Local Affordable Housing Programs
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  SHIP Program
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={floridaLocalData.flAffordableHousingInitiatives}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="program" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "units" ? value.toLocaleString() : formatLargeNumber(value as number),
                        name,
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="funding" fill="#3B82F6" name="Funding" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="units"
                      stroke="#10B981"
                      strokeWidth={3}
                      name="Units"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Local Housing Delivery Trends */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Local Housing Delivery Trends
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                >
                  County Data
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={floridaLocalData.localHousingDelivery}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                    <Line type="monotone" dataKey="affordable" stroke="#3B82F6" strokeWidth={2} name="Affordable" />
                    <Line type="monotone" dataKey="market" stroke="#10B981" strokeWidth={2} name="Market Rate" />
                    <Line type="monotone" dataKey="mixed" stroke="#F59E0B" strokeWidth={2} name="Mixed Use" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Local Housing Program Details */}
            <div className="space-y-2">
              {floridaLocalData.flAffordableHousingInitiatives.map((program, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{program.program}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(program.status)}`}>
                      {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Funding:</span>
                      <span className="font-medium ml-1">{formatLargeNumber(program.funding)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Units:</span>
                      <span className="font-medium ml-1">{program.units.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Change:</span>
                      <span className="font-medium ml-1">
                        {program.change > 0 ? "+" : ""}
                        {program.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="county" className="space-y-4">
            {/* County Activity Overview */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                County-Level Infrastructure Activity
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  County CIP Tracker
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floridaLocalData.countyLevelActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="county" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "value" ? formatLargeNumber(value as number) : value.toLocaleString(),
                        name,
                      ]}
                    />
                    <Bar dataKey="value" fill="#3B82F6" name="Project Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Local Project Trends */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                Local Project Trends
                <Badge
                  variant="outline"
                  className="text-xs bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200"
                >
                  Local Data
                </Badge>
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floridaLocalData.localProjectTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                    <Bar dataKey="municipal" stackId="a" fill="#3B82F6" name="Municipal" />
                    <Bar dataKey="housing" stackId="a" fill="#10B981" name="Housing" />
                    <Bar dataKey="infrastructure" stackId="a" fill="#06B6D4" name="Infrastructure" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* County Activity Details */}
            <div className="space-y-2">
              {floridaLocalData.countyLevelActivity.map((county, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{county.county}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(county.status)}`}>
                      {county.status.charAt(0).toUpperCase() + county.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Projects:</span>
                      <span className="font-medium ml-1">{county.projects.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Value:</span>
                      <span className="font-medium ml-1">{formatLargeNumber(county.value)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Permits:</span>
                      <span className="font-medium ml-1">{county.permits.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                      <span className="font-medium ml-1">{county.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Sources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-blue-100 text-blue-800">
                    City Budget Office
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-green-100 text-green-800">
                    County CIP Tracker
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-orange-100 text-orange-800">
                    SHIP Program
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="w-full justify-center bg-purple-100 text-purple-800">
                    Local Permitting
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-cyan-100 text-cyan-800">
                    County Data
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center bg-pink-100 text-pink-800">
                    Municipal Reports
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
