"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Shield,
  DollarSign,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  BarChart3,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { BuyoutRecord } from "@/types/procurement"
import type { ProcurementStats } from "./ProcurementWidgets"

interface HbiProcurementInsightsProps {
  buyouts: BuyoutRecord[]
  stats: ProcurementStats
}

interface ProcurementInsight {
  id: string
  type: "opportunity" | "risk" | "trend" | "recommendation"
  category: "cost" | "vendor" | "schedule" | "compliance" | "performance"
  title: string
  description: string
  impact: "low" | "medium" | "high" | "critical"
  confidence: number
  actionItems: string[]
  potentialSavings?: number
  riskMitigation?: string[]
}

export function HbiProcurementInsights({ buyouts, stats }: HbiProcurementInsightsProps) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Generate insights based on procurement data
  const generateInsights = (): ProcurementInsight[] => {
    const insights: ProcurementInsight[] = []

    // Cost optimization insights
    if (stats.avgSavings < 5) {
      insights.push({
        id: "cost-optimization",
        type: "opportunity",
        category: "cost",
        title: "Cost Optimization Opportunity",
        description: `Current average savings of ${stats.avgSavings.toFixed(1)}% is below industry benchmark of 8-12%. Consider implementing more competitive bidding processes.`,
        impact: "high",
        confidence: 87,
        actionItems: [
          "Expand vendor pool for competitive bidding",
          "Implement value engineering workshops",
          "Review and optimize procurement processes",
          "Consider bulk purchasing agreements"
        ],
        potentialSavings: stats.totalValue * 0.03
      })
    }

    // Vendor performance insight
    if (stats.complianceRate < 90) {
      insights.push({
        id: "vendor-compliance",
        type: "risk",
        category: "compliance",
        title: "Vendor Compliance Risk",
        description: `Compliance rate of ${stats.complianceRate.toFixed(1)}% indicates potential vendor performance issues. This could impact project delivery and quality.`,
        impact: "high",
        confidence: 92,
        actionItems: [
          "Conduct vendor performance reviews",
          "Implement compliance monitoring system",
          "Provide vendor training and support",
          "Update vendor qualification criteria"
        ],
        riskMitigation: [
          "Implement weekly compliance checks",
          "Establish clear performance metrics",
          "Create vendor improvement plans"
        ]
      })
    }

    // Schedule performance insight
    if (stats.onTimeDelivery < 85) {
      insights.push({
        id: "schedule-performance",
        type: "risk",
        category: "schedule",
        title: "Schedule Performance Concern",
        description: `On-time delivery rate of ${stats.onTimeDelivery.toFixed(1)}% may impact project timelines. Consider improving vendor coordination and monitoring.`,
        impact: "medium",
        confidence: 78,
        actionItems: [
          "Implement milestone tracking system",
          "Improve vendor communication protocols",
          "Review and optimize delivery schedules",
          "Establish contingency plans"
        ]
      })
    }

    // Vendor concentration risk
    const vendorConcentration = buyouts.reduce((acc, buyout) => {
      acc[buyout.vendorName] = (acc[buyout.vendorName] || 0) + buyout.currentAmount
      return acc
    }, {} as Record<string, number>)

    const topVendorPercentage = Math.max(...Object.values(vendorConcentration)) / stats.totalValue * 100
    if (topVendorPercentage > 30) {
      insights.push({
        id: "vendor-concentration",
        type: "risk",
        category: "vendor",
        title: "Vendor Concentration Risk",
        description: `High concentration with single vendor (${topVendorPercentage.toFixed(1)}% of total value) creates supply chain risk. Consider diversification.`,
        impact: "medium",
        confidence: 85,
        actionItems: [
          "Identify alternative vendors",
          "Implement vendor diversification strategy",
          "Negotiate backup supplier agreements",
          "Monitor vendor financial health"
        ]
      })
    }

    // Positive trend insight
    if (stats.avgSavings > 8) {
      insights.push({
        id: "cost-performance",
        type: "opportunity",
        category: "performance",
        title: "Strong Cost Performance",
        description: `Excellent average savings of ${stats.avgSavings.toFixed(1)}% exceeds industry benchmarks. Consider expanding successful strategies.`,
        impact: "medium",
        confidence: 94,
        actionItems: [
          "Document successful procurement strategies",
          "Share best practices across projects",
          "Expand successful vendor relationships",
          "Mentor other project teams"
        ]
      })
    }

    return insights
  }

  const insights = generateInsights()

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "opportunity": return <TrendingUp className="h-4 w-4" />
      case "risk": return <AlertTriangle className="h-4 w-4" />
      case "trend": return <BarChart3 className="h-4 w-4" />
      case "recommendation": return <Lightbulb className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cost": return <DollarSign className="h-4 w-4" />
      case "vendor": return <Users className="h-4 w-4" />
      case "schedule": return <Clock className="h-4 w-4" />
      case "compliance": return <Shield className="h-4 w-4" />
      case "performance": return <Target className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              HBI Procurement Insights
            </span>
            <Badge variant="outline" className="ml-2 border-purple-300 text-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-purple-200 hover:bg-purple-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
          AI-powered insights to optimize procurement performance and identify opportunities
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-4">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="border border-purple-200 bg-white/70 dark:bg-gray-800/70 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(insight.type)}
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h3>
                          <Badge variant="outline" className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                          <Badge variant="outline" className="text-purple-600 border-purple-300">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(insight.category)}
                            <span className="capitalize">{insight.category}</span>
                          </div>
                          {insight.potentialSavings && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>Potential savings: ${insight.potentialSavings.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeInsight === insight.id ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                    
                    {activeInsight === insight.id && (
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Action Items:</h4>
                            <ul className="space-y-1">
                              {insight.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {insight.riskMitigation && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Risk Mitigation:</h4>
                              <ul className="space-y-1">
                                {insight.riskMitigation.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Shield className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="mt-4">
            <div className="space-y-4">
              {insights.filter(insight => insight.type === "opportunity").map((insight) => (
                <Card key={insight.id} className="border border-green-200 bg-green-50/50 dark:bg-green-950/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-green-900 dark:text-green-100">{insight.title}</h3>
                      {insight.potentialSavings && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                          ${insight.potentialSavings.toLocaleString()} potential savings
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="mt-4">
            <div className="space-y-4">
              {insights.filter(insight => insight.type === "risk").map((insight) => (
                <Card key={insight.id} className="border border-red-200 bg-red-50/50 dark:bg-red-950/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <h3 className="font-semibold text-red-900 dark:text-red-100">{insight.title}</h3>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {insight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 