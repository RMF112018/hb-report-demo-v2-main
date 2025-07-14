/**
 * @fileoverview Simple Market Intelligence Card Component
 * @module SimpleMarketIntelCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing AI-analyzed commercial construction market data
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Brain,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Globe,
  DollarSign,
  Building2,
  Target,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Zap,
} from "lucide-react"

interface SimpleMarketIntelCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    chartFocused?: boolean
  }
}

// Generate role-based market intelligence data
const generateMarketData = (userRole: string) => {
  const marketMultipliers = {
    executive: 1.0,
    "project-executive": 0.8,
    "project-manager": 0.6,
    estimator: 1.0,
    admin: 0.0,
  }

  const multiplier = marketMultipliers[userRole as keyof typeof marketMultipliers] || 0.8

  const marketTrends = [
    { month: "Jan", healthcare: 285, education: 220, commercial: 195, industrial: 165 },
    { month: "Feb", healthcare: 295, education: 235, commercial: 210, industrial: 175 },
    { month: "Mar", healthcare: 310, education: 245, commercial: 225, industrial: 185 },
    { month: "Apr", healthcare: 325, education: 260, commercial: 240, industrial: 195 },
    { month: "May", healthcare: 340, education: 275, commercial: 255, industrial: 205 },
    { month: "Jun", healthcare: 355, education: 290, commercial: 270, industrial: 215 },
  ].map((item) => ({
    ...item,
    healthcare: Math.floor(item.healthcare * multiplier),
    education: Math.floor(item.education * multiplier),
    commercial: Math.floor(item.commercial * multiplier),
    industrial: Math.floor(item.industrial * multiplier),
  }))

  const competitivePosition = [
    { competitor: "HBC", marketShare: 18.5, value: 285000000 * multiplier, projects: Math.floor(42 * multiplier) },
    {
      competitor: "Competitor A",
      marketShare: 15.2,
      value: 234000000 * multiplier,
      projects: Math.floor(38 * multiplier),
    },
    {
      competitor: "Competitor B",
      marketShare: 12.8,
      value: 197000000 * multiplier,
      projects: Math.floor(31 * multiplier),
    },
    {
      competitor: "Competitor C",
      marketShare: 11.3,
      value: 174000000 * multiplier,
      projects: Math.floor(28 * multiplier),
    },
    { competitor: "Others", marketShare: 42.2, value: 650000000 * multiplier, projects: Math.floor(95 * multiplier) },
  ]

  const bidSuccess = [
    { sector: "Healthcare", winRate: 72, avgMargin: 12.5, bidsSubmitted: Math.floor(28 * multiplier) },
    { sector: "Education", winRate: 68, avgMargin: 14.2, bidsSubmitted: Math.floor(22 * multiplier) },
    { sector: "Commercial", winRate: 64, avgMargin: 11.8, bidsSubmitted: Math.floor(35 * multiplier) },
    { sector: "Industrial", winRate: 58, avgMargin: 15.3, bidsSubmitted: Math.floor(18 * multiplier) },
  ]

  const marketIndicators = {
    marketGrowth: 8.3,
    competitiveIndex: 72,
    pricingTrend: 5.7,
    demandForecast: 78,
    riskLevel: 32,
    opportunityScore: 85,
  }

  const aiInsights = [
    {
      category: "Growth Opportunity",
      insight: "Healthcare sector showing 15% YoY growth",
      confidence: 92,
      impact: "high",
    },
    {
      category: "Competitive Alert",
      insight: "Competitor A aggressive pricing in education",
      confidence: 87,
      impact: "medium",
    },
    {
      category: "Market Trend",
      insight: "Sustainable construction demand rising 23%",
      confidence: 89,
      impact: "high",
    },
    {
      category: "Risk Factor",
      insight: "Material cost volatility increasing",
      confidence: 84,
      impact: "medium",
    },
  ]

  return {
    marketTrends,
    competitivePosition,
    bidSuccess,
    marketIndicators,
    aiInsights,
    totalMarketValue: competitivePosition.reduce((sum, item) => sum + item.value, 0),
    hbcMarketPosition: 1, // HBC is #1
  }
}

export default function SimpleMarketIntelCard({ className, userRole, config }: SimpleMarketIntelCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"trends" | "competitive" | "insights">("trends")

  const marketData = useMemo(() => generateMarketData(userRole || "estimator"), [userRole])

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 20000) // Update every 20 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getInsightIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Target className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 border-indigo-200/50 dark:border-indigo-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                Market Intelligence
              </CardTitle>
              <p className="text-sm text-indigo-700/70 dark:text-indigo-300/80">
                AI-powered market analysis and competitive positioning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 dark:bg-indigo-950/50">
              <Brain className="h-3 w-3 mr-1" />
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/50">
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
            <span>Live market data • Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Market Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Market Growth</p>
                <p className="text-2xl font-bold text-green-600">+{marketData.marketIndicators.marketGrowth}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Market Position</p>
                <p className="text-2xl font-bold text-blue-600">#{marketData.hbcMarketPosition}</p>
              </div>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Opportunity Score</p>
                <p className="text-2xl font-bold text-purple-600">{marketData.marketIndicators.opportunityScore}</p>
              </div>
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: "trends", label: "Market Trends" },
            { id: "competitive", label: "Competitive" },
            { id: "insights", label: "AI Insights" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "trends" && (
          <div className="space-y-4">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), "Value ($M)"]} />
                  <Area
                    type="monotone"
                    dataKey="healthcare"
                    stackId="1"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="education"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="commercial"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="industrial"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {["Healthcare", "Education", "Commercial", "Industrial"].map((sector, index) => (
                <div key={sector} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ["#059669", "#3b82f6", "#8b5cf6", "#f59e0b"][index],
                    }}
                  />
                  <span>{sector}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "competitive" && (
          <div className="space-y-4">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketData.competitivePosition}
                    cx="50%"
                    cy="50%"
                    innerRadius={15}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="marketShare"
                  >
                    {marketData.competitivePosition.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.competitor === "HBC"
                            ? "#059669"
                            : ["#3b82f6", "#8b5cf6", "#f59e0b", "#6b7280"][index - 1] || "#6b7280"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Market Share"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1">
              {marketData.competitivePosition.map((comp, index) => (
                <div key={comp.competitor} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          comp.competitor === "HBC"
                            ? "#059669"
                            : ["#3b82f6", "#8b5cf6", "#f59e0b", "#6b7280"][index - 1] || "#6b7280",
                      }}
                    />
                    <span className={comp.competitor === "HBC" ? "font-semibold text-green-600" : ""}>
                      {comp.competitor}
                    </span>
                  </div>
                  <span className="font-medium">{comp.marketShare}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-3">
            {marketData.aiInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.impact)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-indigo-600">{insight.category}</span>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          color:
                            insight.confidence >= 90 ? "#059669" : insight.confidence >= 80 ? "#f59e0b" : "#6b7280",
                          borderColor:
                            insight.confidence >= 90 ? "#059669" : insight.confidence >= 80 ? "#f59e0b" : "#6b7280",
                        }}
                      >
                        {insight.confidence}% confident
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{insight.insight}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Summary */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Total Market Value</p>
              <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                {formatCurrency(marketData.totalMarketValue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">HBC Share</p>
              <p className="text-lg font-bold text-green-600">
                {marketData.competitivePosition.find((c) => c.competitor === "HBC")?.marketShare}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
