"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Target,
  DollarSign,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Building2,
  Activity,
  Timer,
  Bell,
  Sparkles,
  Clock,
  Users,
  Calendar,
  Star,
  Award,
  Briefcase,
  Database,
  Zap,
  Lightbulb,
  Filter,
  Map,
  Navigation,
  Globe,
  FileText,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface PursuitLocation {
  id: string
  clientName: string
  location: {
    city: string
    state: string
    lat: number
    lng: number
  }
  pursuitStage: "Prequal" | "Proposal" | "Interview"
  market: "Civic" | "Mixed-Use" | "Healthcare" | "Education" | "Commercial"
  valueEstimate: number
  bdRep: string
  lastUpdated: string
  status: "Active" | "Pending" | "On Hold"
}

interface StrategicTarget {
  id: string
  city: string
  market: string
  opportunityCount: number
  totalValue: number
  priority: "High" | "Medium" | "Low"
  bdRep: string
  notes: string
}

interface BetaBDStrategicFocusMapCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDStrategicFocusMapCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDStrategicFocusMapCardProps) {
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

  const [activeTab, setActiveTab] = useState("active-map")
  const [selectedMarket, setSelectedMarket] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock Unanet CRM data for Florida pursuit locations
  const pursuitLocations = useMemo(
    (): PursuitLocation[] => [
      {
        id: "1",
        clientName: "City of Tampa",
        location: { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
        pursuitStage: "Proposal",
        market: "Civic",
        valueEstimate: 45000000,
        bdRep: "M. Alvarez",
        lastUpdated: "2025-01-24",
        status: "Active",
      },
      {
        id: "2",
        clientName: "Publix Real Estate",
        location: { city: "Lakeland", state: "FL", lat: 28.0395, lng: -81.9498 },
        pursuitStage: "Interview",
        market: "Commercial",
        valueEstimate: 68000000,
        bdRep: "D. Chen",
        lastUpdated: "2025-01-21",
        status: "Active",
      },
      {
        id: "3",
        clientName: "Tampa General Hospital",
        location: { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
        pursuitStage: "Prequal",
        market: "Healthcare",
        valueEstimate: 32000000,
        bdRep: "M. Alvarez",
        lastUpdated: "2025-01-18",
        status: "Active",
      },
      {
        id: "4",
        clientName: "University of South Florida",
        location: { city: "Tampa", state: "FL", lat: 27.9506, lng: -82.4572 },
        pursuitStage: "Proposal",
        market: "Education",
        valueEstimate: 55000000,
        bdRep: "D. Chen",
        lastUpdated: "2025-01-15",
        status: "Active",
      },
      {
        id: "5",
        clientName: "Miami-Dade County",
        location: { city: "Miami", state: "FL", lat: 25.7617, lng: -80.1918 },
        pursuitStage: "Interview",
        market: "Civic",
        valueEstimate: 89000000,
        bdRep: "S. Rodriguez",
        lastUpdated: "2025-01-12",
        status: "Active",
      },
      {
        id: "6",
        clientName: "Jacksonville Port Authority",
        location: { city: "Jacksonville", state: "FL", lat: 30.3322, lng: -81.6557 },
        pursuitStage: "Prequal",
        market: "Mixed-Use",
        valueEstimate: 120000000,
        bdRep: "J. Thompson",
        lastUpdated: "2025-01-10",
        status: "Active",
      },
      {
        id: "7",
        clientName: "Orlando Health",
        location: { city: "Orlando", state: "FL", lat: 28.5383, lng: -81.3792 },
        pursuitStage: "Proposal",
        market: "Healthcare",
        valueEstimate: 75000000,
        bdRep: "M. Alvarez",
        lastUpdated: "2025-01-08",
        status: "Active",
      },
      {
        id: "8",
        clientName: "Florida State University",
        location: { city: "Tallahassee", state: "FL", lat: 30.4383, lng: -84.2807 },
        pursuitStage: "Interview",
        market: "Education",
        valueEstimate: 65000000,
        bdRep: "D. Chen",
        lastUpdated: "2025-01-05",
        status: "Active",
      },
      {
        id: "9",
        clientName: "Fort Lauderdale City Hall",
        location: { city: "Fort Lauderdale", state: "FL", lat: 26.1224, lng: -80.1373 },
        pursuitStage: "Prequal",
        market: "Civic",
        valueEstimate: 38000000,
        bdRep: "S. Rodriguez",
        lastUpdated: "2025-01-03",
        status: "Active",
      },
      {
        id: "10",
        clientName: "Sarasota Memorial Hospital",
        location: { city: "Sarasota", state: "FL", lat: 27.3364, lng: -82.5307 },
        pursuitStage: "Proposal",
        market: "Healthcare",
        valueEstimate: 42000000,
        bdRep: "M. Alvarez",
        lastUpdated: "2025-01-01",
        status: "Active",
      },
    ],
    []
  )

  // Mock strategic targets data
  const strategicTargets = useMemo(
    (): StrategicTarget[] => [
      {
        id: "1",
        city: "Gainesville",
        market: "Education",
        opportunityCount: 3,
        totalValue: 85000000,
        priority: "High",
        bdRep: "D. Chen",
        notes: "University of Florida expansion projects",
      },
      {
        id: "2",
        city: "St. Petersburg",
        market: "Mixed-Use",
        opportunityCount: 2,
        totalValue: 65000000,
        priority: "Medium",
        bdRep: "M. Alvarez",
        notes: "Downtown redevelopment initiatives",
      },
      {
        id: "3",
        city: "West Palm Beach",
        market: "Commercial",
        opportunityCount: 4,
        totalValue: 120000000,
        priority: "High",
        bdRep: "S. Rodriguez",
        notes: "Financial district expansion",
      },
      {
        id: "4",
        city: "Daytona Beach",
        market: "Civic",
        opportunityCount: 1,
        totalValue: 28000000,
        priority: "Low",
        bdRep: "J. Thompson",
        notes: "Municipal infrastructure projects",
      },
    ],
    []
  )

  // Filter locations by selected market
  const filteredLocations = useMemo(() => {
    if (selectedMarket === "all") return pursuitLocations
    return pursuitLocations.filter((location) => location.market === selectedMarket)
  }, [pursuitLocations, selectedMarket])

  // Get unique markets for filter
  const markets = useMemo(() => {
    const uniqueMarkets = [...new Set(pursuitLocations.map((location) => location.market))]
    return ["all", ...uniqueMarkets]
  }, [pursuitLocations])

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalValue = filteredLocations.reduce((sum, location) => sum + location.valueEstimate, 0)
    const activePursuits = filteredLocations.length
    const avgValue = totalValue / activePursuits

    return {
      totalValue,
      activePursuits,
      avgValue,
    }
  }, [filteredLocations])

  // Chart colors for different stages
  const stageColors = {
    Prequal: "#3B82F6", // Blue
    Proposal: "#10B981", // Green
    Interview: "#F59E0B", // Yellow
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "Prequal":
        return <Target className="h-4 w-4 text-blue-600" />
      case "Proposal":
        return <FileText className="h-4 w-4 text-green-600" />
      case "Interview":
        return <Users className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "Low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  return (
    <Card
      className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className={`${compactScale.iconSize} text-blue-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              Strategic Focus Map
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Source: Unanet CRM
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Geographic pursuit mapping and strategic targets across Florida
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>{metrics.activePursuits}</div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Active Pursuits</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>
              {formatCurrency(metrics.totalValue)}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Total Value</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-purple-600`}>
              {formatCurrency(metrics.avgValue)}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Avg Value</div>
          </div>
        </div>

        {/* Market Filter */}
        <div className="flex items-center gap-2">
          <Filter className={`${compactScale.iconSizeSmall} text-slate-500`} />
          <select
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className={`${compactScale.textSmall} bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-slate-100`}
          >
            {markets.map((market) => (
              <option key={market} value={market}>
                {market === "all" ? "All Markets" : market}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active-map" className="text-xs">
              Active Map
            </TabsTrigger>
            <TabsTrigger value="strategic-targets" className="text-xs">
              Strategic Targets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active-map" className="space-y-4">
            {/* Map Visualization */}
            <div
              className={`${compactScale.chartHeight} w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden`}
            >
              {/* Mock Florida Map with Pins */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Florida outline mock */}
                  <div className="absolute inset-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                    <div className="absolute top-2 left-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      FLORIDA
                    </div>
                  </div>

                  {/* Location Pins */}
                  {filteredLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{
                        left: `${20 + ((index * 15) % 60)}%`,
                        top: `${30 + ((index * 10) % 40)}%`,
                      }}
                    >
                      <div
                        className={`w-3 h-3 rounded-full border-2 border-white shadow-lg`}
                        style={{ backgroundColor: stageColors[location.pursuitStage] }}
                      />

                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div className="font-medium">{location.clientName}</div>
                        <div>
                          {location.location.city}, {location.location.state}
                        </div>
                        <div>
                          {location.pursuitStage} • {formatCurrency(location.valueEstimate)}
                        </div>
                        <div className="text-slate-300">{location.bdRep}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(stageColors).map(([stage, color]) => (
                <div
                  key={stage}
                  className="flex items-center gap-2 p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className={`${compactScale.textSmall} text-slate-700 dark:text-slate-300`}>{stage}</span>
                </div>
              ))}
            </div>

            {/* Location List */}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    {getStageIcon(location.pursuitStage)}
                    <div>
                      <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {location.clientName}
                      </div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        {location.location.city}, {location.location.state}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {formatCurrency(location.valueEstimate)}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {location.pursuitStage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="strategic-targets" className="space-y-4">
            {/* Strategic Targets List */}
            <div className="space-y-3">
              {strategicTargets.map((target) => (
                <div
                  key={target.id}
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {target.city}
                      </div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        {target.market} • {target.opportunityCount} opportunities
                      </div>
                    </div>
                    <Badge className={`text-xs ${getPriorityColor(target.priority)}`}>{target.priority}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className={`${compactScale.iconSizeSmall} text-slate-500`} />
                      <span className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                        {target.bdRep}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {formatCurrency(target.totalValue)}
                      </div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Total Value</div>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
                    {target.notes}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} className="scale-75" />
            <Label className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Auto-refresh</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100`}
          >
            <RefreshCw className={`${compactScale.iconSizeSmall} mr-1`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
