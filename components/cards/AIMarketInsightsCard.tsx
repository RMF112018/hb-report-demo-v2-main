/**
 * @fileoverview AI Market Insights Card Component
 * @module AIMarketInsightsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * AI-powered market insights with predictive analytics and opportunity recommendations
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Alert, AlertDescription } from "../ui/alert"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Play,
  Pause,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Eye,
  Bot,
  Sparkles,
  Activity,
  DollarSign,
  Calendar,
  Users,
} from "lucide-react"

interface AIMarketInsightsCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    aiMode?: "predictive" | "analytical" | "advisory"
  }
}

// Generate AI-powered market insights
const generateAIInsights = (userRole: string) => {
  const insightMultipliers = {
    executive: 1.0,
    "project-executive": 0.85,
    "project-manager": 0.7,
    estimator: 0.9,
    admin: 0.0,
  }

  const multiplier = insightMultipliers[userRole as keyof typeof insightMultipliers] || 0.8

  const marketPredictions = [
    { month: "Jul", predicted: 285 * multiplier, actual: 280 * multiplier, confidence: 92 },
    { month: "Aug", predicted: 295 * multiplier, actual: 290 * multiplier, confidence: 89 },
    { month: "Sep", predicted: 310 * multiplier, actual: 305 * multiplier, confidence: 94 },
    { month: "Oct", predicted: 325 * multiplier, actual: null, confidence: 87 },
    { month: "Nov", predicted: 340 * multiplier, actual: null, confidence: 85 },
    { month: "Dec", predicted: 355 * multiplier, actual: null, confidence: 83 },
  ]

  const aiRecommendations = [
    {
      id: 1,
      category: "Opportunity",
      title: "Healthcare Sector Expansion",
      insight: "AI models predict 18% growth in healthcare construction demand over next 6 months",
      confidence: 94,
      impact: "High",
      priority: "Critical",
      action: "Increase healthcare sector bidding by 25%",
      potentialValue: 45000000 * multiplier,
      timeline: "Q1 2025",
      riskLevel: "Low",
    },
    {
      id: 2,
      category: "Risk Alert",
      title: "Steel Price Volatility",
      insight: "Predictive models show 12% steel price increase likely in next 90 days",
      confidence: 88,
      impact: "Medium",
      priority: "High",
      action: "Lock in steel pricing for Q1 projects",
      potentialValue: -8500000 * multiplier,
      timeline: "Next 30 days",
      riskLevel: "Medium",
    },
    {
      id: 3,
      category: "Competitive Intelligence",
      title: "Competitor Strategy Shift",
      insight: "Major competitor reducing commercial bids by 15%, creating market opportunity",
      confidence: 79,
      impact: "High",
      priority: "Medium",
      action: "Increase commercial sector pursuit by 20%",
      potentialValue: 32000000 * multiplier,
      timeline: "Q2 2025",
      riskLevel: "Low",
    },
    {
      id: 4,
      category: "Market Trend",
      title: "Sustainable Construction Demand",
      insight: "HBI Analysis shows 35% increase in green building requirements across all sectors",
      confidence: 91,
      impact: "High",
      priority: "Medium",
      action: "Invest in sustainable construction capabilities",
      potentialValue: 28000000 * multiplier,
      timeline: "Q1-Q3 2025",
      riskLevel: "Low",
    },
  ]

  const riskFactors = [
    { factor: "Material Cost Inflation", probability: 72, impact: 8.5, mitigation: "Price lock agreements" },
    { factor: "Labor Shortage", probability: 65, impact: 6.2, mitigation: "Workforce development" },
    { factor: "Interest Rate Changes", probability: 58, impact: 7.8, mitigation: "Fixed rate financing" },
    { factor: "Regulatory Changes", probability: 45, impact: 5.5, mitigation: "Compliance monitoring" },
  ]

  const aiMetrics = {
    modelAccuracy: 89.5,
    predictionConfidence: 87.2,
    dataQuality: 94.1,
    insightsGenerated: Math.floor(127 * multiplier),
    lastModelUpdate: "2 hours ago",
    processingTime: "1.3 seconds",
  }

  const opportunityScores = [
    { sector: "Healthcare", score: 92, trend: "up", projects: Math.floor(28 * multiplier) },
    { sector: "Education", score: 78, trend: "stable", projects: Math.floor(22 * multiplier) },
    { sector: "Commercial", score: 85, trend: "up", projects: Math.floor(35 * multiplier) },
    { sector: "Industrial", score: 71, trend: "down", projects: Math.floor(15 * multiplier) },
  ]

  return {
    marketPredictions,
    aiRecommendations,
    riskFactors,
    aiMetrics,
    opportunityScores,
    totalOpportunityValue: aiRecommendations
      .filter((rec) => rec.potentialValue > 0)
      .reduce((sum, rec) => sum + rec.potentialValue, 0),
    totalRiskExposure: Math.abs(
      aiRecommendations.filter((rec) => rec.potentialValue < 0).reduce((sum, rec) => sum + rec.potentialValue, 0)
    ),
  }
}

export default function AIMarketInsightsCard({ className, userRole, config }: AIMarketInsightsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [aiMode, setAiMode] = useState<"predictive" | "analytical" | "advisory">(config?.aiMode || "predictive")

  const aiData = useMemo(() => generateAIInsights(userRole || "estimator"), [userRole])

  // Simulate real-time AI updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 18000) // Update every 18 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue >= 1000000) {
      return `${value >= 0 ? "+" : "-"}$${(absValue / 1000000).toFixed(1)}M`
    } else if (absValue >= 1000) {
      return `${value >= 0 ? "+" : "-"}$${(absValue / 1000).toFixed(0)}K`
    }
    return `${value >= 0 ? "+" : "-"}$${absValue.toLocaleString()}`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Target className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-950/20 dark:to-teal-950/20 border-cyan-200/50 dark:border-cyan-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">
                AI Market Insights
              </CardTitle>
              <p className="text-sm text-cyan-700/70 dark:text-cyan-300/80">
                Machine learning powered market analysis and predictions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-cyan-600 border-cyan-200 bg-cyan-50 dark:bg-cyan-950/50">
              <Bot className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="text-teal-600 border-teal-200 bg-teal-50 dark:bg-teal-950/50">
              <Sparkles className="h-3 w-3 mr-1" />
              ML Enhanced
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

        {/* Real-time Status & AI Performance */}
        <div className="flex items-center justify-between">
          {isRealTimeEnabled && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>AI processing • Last update: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Model accuracy: {aiData.aiMetrics.modelAccuracy}%</span>
            <span>Confidence: {aiData.aiMetrics.predictionConfidence}%</span>
            <span>Processing: {aiData.aiMetrics.processingTime}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Mode Toggle */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: "predictive", label: "Predictive", icon: TrendingUp },
            { id: "analytical", label: "Analytical", icon: BarChart },
            { id: "advisory", label: "Advisory", icon: Lightbulb },
          ].map((mode) => {
            const IconComponent = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => setAiMode(mode.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  aiMode === mode.id
                    ? "bg-white dark:bg-gray-700 text-cyan-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                }`}
              >
                <IconComponent className="h-3 w-3" />
                {mode.label}
              </button>
            )
          })}
        </div>

        {/* Key AI Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Opportunities</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(aiData.totalOpportunityValue)}</p>
              </div>
              <Zap className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Risk Exposure</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(-aiData.totalRiskExposure)}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Insights Generated</p>
                <p className="text-2xl font-bold text-blue-600">{aiData.aiMetrics.insightsGenerated}</p>
              </div>
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Mode-Based Content */}
        {aiMode === "predictive" && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Market Predictions</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiData.marketPredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {aiData.opportunityScores.map((sector, index) => (
                <div key={sector.sector} className="bg-white dark:bg-gray-800 rounded-lg p-2 border text-center">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{sector.sector}</span>
                    {getTrendIcon(sector.trend)}
                  </div>
                  <p className="text-lg font-bold text-cyan-600">{sector.score}</p>
                  <p className="text-xs text-muted-foreground">{sector.projects} projects</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiMode === "analytical" && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Risk Analysis</h4>
            <div className="space-y-3">
              {aiData.riskFactors.map((risk, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm">{risk.factor}</h5>
                    <Badge variant="outline" className="text-xs">
                      {risk.probability}% probability
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Impact Score</p>
                      <p className="text-lg font-bold text-orange-600">{risk.impact}/10</p>
                      <Progress value={risk.impact * 10} className="h-2 mt-1" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mitigation</p>
                      <p className="text-xs text-gray-600">{risk.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiMode === "advisory" && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">AI Recommendations</h4>
            {aiData.aiRecommendations.map((rec) => (
              <div key={rec.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getImpactIcon(rec.impact)}
                    <h5 className="font-semibold text-sm">{rec.title}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>{rec.priority}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.confidence}% confident
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3">{rec.insight}</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Recommended Action</p>
                    <p className="font-medium">{rec.action}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Potential Value</p>
                    <p className={`font-bold ${rec.potentialValue >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(rec.potentialValue)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs mt-2">
                  <div>
                    <p className="text-muted-foreground">Timeline</p>
                    <p className="font-medium">{rec.timeline}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Risk Level</p>
                    <p className="font-medium">{rec.riskLevel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Performance Summary */}
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription className="text-xs">
            AI models processed {aiData.aiMetrics.insightsGenerated} market data points with{" "}
            {aiData.aiMetrics.modelAccuracy}% accuracy. Last model retrain: {aiData.aiMetrics.lastModelUpdate}.
            Predictive confidence: {aiData.aiMetrics.predictionConfidence}%.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
