/**
 * @fileoverview Market Analytics Card Component
 * @module MarketAnalyticsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Comprehensive market analytics visualization with competitive positioning and sector analysis
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  LineChart,
  ScatterChart,
  Scatter,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  Target,
  Globe,
  Activity,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  Award,
  DollarSign,
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react"

interface MarketAnalyticsCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    expandedView?: boolean
  }
}

// Generate comprehensive market analytics data
const generateMarketAnalytics = (userRole: string) => {
  const marketMultipliers = {
    executive: 1.0,
    "project-executive": 0.8,
    "project-manager": 0.6,
    estimator: 0.9,
    admin: 0.0,
  }

  const multiplier = marketMultipliers[userRole as keyof typeof marketMultipliers] || 0.8

  const sectorPerformance = [
    {
      sector: "Healthcare",
      revenue: 145000000 * multiplier,
      margin: 14.2,
      projects: Math.floor(28 * multiplier),
      growth: 12.5,
      satisfaction: 4.6,
    },
    {
      sector: "Education",
      revenue: 98000000 * multiplier,
      margin: 16.8,
      projects: Math.floor(22 * multiplier),
      growth: 8.3,
      satisfaction: 4.4,
    },
    {
      sector: "Commercial",
      revenue: 125000000 * multiplier,
      margin: 12.1,
      projects: Math.floor(35 * multiplier),
      growth: 6.7,
      satisfaction: 4.2,
    },
    {
      sector: "Industrial",
      revenue: 67000000 * multiplier,
      margin: 18.3,
      projects: Math.floor(15 * multiplier),
      growth: 15.2,
      satisfaction: 4.5,
    },
  ]

  const competitiveMetrics = [
    { metric: "Cost Efficiency", hbc: 92, industry: 78 },
    { metric: "Quality Score", hbc: 96, industry: 82 },
    { metric: "Timeline Performance", hbc: 89, industry: 75 },
    { metric: "Safety Record", hbc: 98, industry: 85 },
    { metric: "Innovation", hbc: 87, industry: 72 },
    { metric: "Client Satisfaction", hbc: 94, industry: 80 },
  ]

  const marketOpportunities = [
    {
      opportunity: "Sustainable Construction",
      value: 180000000 * multiplier,
      probability: 78,
      timeline: "Q2 2025",
      risk: "Medium",
    },
    {
      opportunity: "Healthcare Expansion",
      value: 95000000 * multiplier,
      probability: 85,
      timeline: "Q1 2025",
      risk: "Low",
    },
    {
      opportunity: "Smart Buildings",
      value: 67000000 * multiplier,
      probability: 65,
      timeline: "Q3 2025",
      risk: "High",
    },
    {
      opportunity: "Data Centers",
      value: 125000000 * multiplier,
      probability: 72,
      timeline: "Q2 2025",
      risk: "Medium",
    },
  ]

  const bidAnalytics = [
    {
      month: "Jan",
      submitted: Math.floor(15 * multiplier),
      won: Math.floor(9 * multiplier),
      value: 45000000 * multiplier,
    },
    {
      month: "Feb",
      submitted: Math.floor(18 * multiplier),
      won: Math.floor(12 * multiplier),
      value: 62000000 * multiplier,
    },
    {
      month: "Mar",
      submitted: Math.floor(22 * multiplier),
      won: Math.floor(14 * multiplier),
      value: 78000000 * multiplier,
    },
    {
      month: "Apr",
      submitted: Math.floor(19 * multiplier),
      won: Math.floor(13 * multiplier),
      value: 71000000 * multiplier,
    },
    {
      month: "May",
      submitted: Math.floor(25 * multiplier),
      won: Math.floor(17 * multiplier),
      value: 89000000 * multiplier,
    },
    {
      month: "Jun",
      submitted: Math.floor(21 * multiplier),
      won: Math.floor(15 * multiplier),
      value: 82000000 * multiplier,
    },
  ]

  const totalBidsSubmitted = bidAnalytics.reduce((sum, month) => sum + month.submitted, 0)
  const totalBidsWon = bidAnalytics.reduce((sum, month) => sum + month.won, 0)
  const winRate = Math.round((totalBidsWon / totalBidsSubmitted) * 100)

  return {
    sectorPerformance,
    competitiveMetrics,
    marketOpportunities,
    bidAnalytics,
    winRate,
    totalBidsSubmitted,
    totalBidsWon,
    totalPipelineValue: marketOpportunities.reduce((sum, opp) => sum + opp.value, 0),
    avgMargin: sectorPerformance.reduce((sum, sector) => sum + sector.margin, 0) / sectorPerformance.length,
  }
}

export default function MarketAnalyticsCard({ className, userRole, config }: MarketAnalyticsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const marketData = useMemo(() => generateMarketAnalytics(userRole || "estimator"), [userRole])

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 25000) // Update every 25 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20 border-slate-200/50 dark:border-slate-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-slate-600 to-gray-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Market Analytics
              </CardTitle>
              <p className="text-sm text-slate-700/70 dark:text-slate-300/80">
                Comprehensive market performance and competitive analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-600 border-slate-200 bg-slate-50 dark:bg-slate-950/50">
              Power BI
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="h-8 px-3"
            >
              {isRealTimeEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-8 px-3">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Real-time Status */}
        {isRealTimeEnabled && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live analytics • Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">{marketData.winRate}%</p>
              </div>
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Margin</p>
                <p className="text-2xl font-bold text-blue-600">{marketData.avgMargin.toFixed(1)}%</p>
              </div>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pipeline</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(marketData.totalPipelineValue)}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bids Won</p>
                <p className="text-2xl font-bold text-orange-600">{marketData.totalBidsWon}</p>
              </div>
              <Award className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="sectors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sectors">Sectors</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="bidding">Bidding</TabsTrigger>
          </TabsList>

          <TabsContent value="sectors" className="mt-4">
            <div className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={marketData.sectorPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "revenue") return [formatCurrency(value as number), "Revenue"]
                        if (name === "margin") return [`${value}%`, "Margin"]
                        return [value, name]
                      }}
                    />
                    <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="revenue" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="margin"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="margin"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {marketData.sectorPerformance.map((sector, index) => (
                  <div key={sector.sector} className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{sector.sector}</h4>
                      <Badge variant="outline" className="text-xs">
                        {sector.projects} projects
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Growth</p>
                        <p className="font-semibold text-green-600">+{sector.growth}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Satisfaction</p>
                        <p className="font-semibold">{sector.satisfaction}/5.0</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="competitive" className="mt-4">
            <div className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={marketData.competitiveMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="HBC" dataKey="hbc" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                    <Radar
                      name="Industry Avg"
                      dataKey="industry"
                      stroke="#6b7280"
                      fill="#6b7280"
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {marketData.competitiveMetrics.map((metric, index) => (
                  <div key={metric.metric} className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                    <h4 className="font-medium text-xs mb-2">{metric.metric}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-600">HBC</span>
                        <span className="text-xs font-semibold">{metric.hbc}</span>
                      </div>
                      <Progress value={metric.hbc} className="h-1" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Industry</span>
                        <span className="text-xs">{metric.industry}</span>
                      </div>
                      <Progress value={metric.industry} className="h-1 opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="mt-4">
            <div className="space-y-3">
              {marketData.marketOpportunities.map((opportunity, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">{opportunity.opportunity}</h4>
                    <Badge className={`text-xs ${getRiskColor(opportunity.risk)}`}>{opportunity.risk} Risk</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-bold text-green-600">{formatCurrency(opportunity.value)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Probability</p>
                      <p className="font-semibold">{opportunity.probability}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeline</p>
                      <p className="font-semibold">{opportunity.timeline}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={opportunity.probability} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bidding" className="mt-4">
            <div className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={marketData.bidAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="submitted" fill="#94a3b8" name="Submitted" />
                    <Bar yAxisId="left" dataKey="won" fill="#10b981" name="Won" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Value"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border text-center">
                  <p className="text-xs text-muted-foreground">Total Submitted</p>
                  <p className="text-2xl font-bold text-slate-600">{marketData.totalBidsSubmitted}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border text-center">
                  <p className="text-xs text-muted-foreground">Total Won</p>
                  <p className="text-2xl font-bold text-green-600">{marketData.totalBidsWon}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border text-center">
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{marketData.winRate}%</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
