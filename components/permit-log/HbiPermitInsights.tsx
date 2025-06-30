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
  Clock,
  Calendar,
  FileText,
  Building,
  CheckCircle,
  ChevronRight,
  Sparkles,
  BarChart3,
  XCircle,
  RefreshCw
} from "lucide-react"
import { Permit } from "@/types/permit-log"
import type { PermitStats } from "./PermitWidgets"

interface HbiPermitInsightsProps {
  permits: Permit[]
  stats: PermitStats
}

interface PermitInsight {
  id: string
  type: "opportunity" | "risk" | "trend" | "recommendation" | "alert"
  category: "compliance" | "timing" | "cost" | "authority" | "inspection" | "renewal"
  title: string
  description: string
  impact: "low" | "medium" | "high" | "critical"
  confidence: number
  actionItems: string[]
  affectedPermits?: string[]
  dueDate?: string
  potentialSavings?: number
  riskMitigation?: string[]
}

export function HbiPermitInsights({ permits, stats }: HbiPermitInsightsProps) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Generate insights based on permit data
  const generateInsights = (): PermitInsight[] => {
    const insights: PermitInsight[] = []

    // Expiring permits alert
    if (stats.expiringPermits > 0) {
      const expiringPermitsList = permits.filter(permit => {
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        const expDate = new Date(permit.expirationDate)
        return expDate <= thirtyDaysFromNow && expDate > new Date() && 
               (permit.status === "approved" || permit.status === "renewed")
      })

      insights.push({
        id: "expiring-permits",
        type: "alert",
        category: "renewal",
        title: "Permits Expiring Soon",
        description: `${stats.expiringPermits} permits will expire within 30 days. Immediate renewal action required to avoid project delays.`,
        impact: "critical",
        confidence: 95,
        actionItems: [
          "Schedule renewal meetings with permit authorities",
          "Prepare required documentation and fees",
          "Submit renewal applications immediately",
          "Coordinate with project schedule to minimize impact"
        ],
        affectedPermits: expiringPermitsList.map(p => p.number),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    // Low approval rate risk
    if (stats.approvalRate < 85 && stats.totalPermits > 5) {
      insights.push({
        id: "low-approval-rate",
        type: "risk",
        category: "compliance",
        title: "Below Average Approval Rate",
        description: `Current approval rate of ${stats.approvalRate.toFixed(1)}% is below industry standard of 85-90%. This may indicate application quality issues.`,
        impact: "high",
        confidence: 88,
        actionItems: [
          "Review rejected permit applications for common issues",
          "Improve application documentation quality",
          "Strengthen relationships with permit authorities",
          "Consider pre-submission consultations"
        ],
        riskMitigation: [
          "Implement application review checklist",
          "Schedule regular meetings with permit officials",
          "Hire permit expediting specialist"
        ]
      })
    }

    // Inspection performance insight
    if (stats.inspectionPassRate < 90 && stats.totalInspections > 10) {
      insights.push({
        id: "inspection-performance",
        type: "opportunity",
        category: "inspection",
        title: "Inspection Pass Rate Optimization",
        description: `${stats.inspectionPassRate.toFixed(1)}% inspection pass rate suggests room for improvement in quality control and preparation.`,
        impact: "medium",
        confidence: 82,
        actionItems: [
          "Implement pre-inspection checklists",
          "Enhance quality control procedures",
          "Provide additional training to field teams",
          "Schedule mock inspections before official ones"
        ]
      })
    }

    // Authority performance analysis
    const authorityPerformance = permits.reduce((acc, permit) => {
      if (!acc[permit.authority]) {
        acc[permit.authority] = { total: 0, approved: 0, avgProcessingTime: 0 }
      }
      acc[permit.authority].total++
      if (permit.status === "approved" || permit.status === "renewed") {
        acc[permit.authority].approved++
      }
      return acc
    }, {} as Record<string, { total: number; approved: number; avgProcessingTime: number }>)

    const problematicAuthorities = Object.entries(authorityPerformance)
      .filter(([authority, data]) => data.total > 2 && (data.approved / data.total) < 0.8)

    if (problematicAuthorities.length > 0) {
      insights.push({
        id: "authority-performance",
        type: "risk",
        category: "authority",
        title: "Challenging Permit Authorities",
        description: `${problematicAuthorities.length} permit authorities show lower than expected approval rates, requiring focused attention.`,
        impact: "medium",
        confidence: 76,
        actionItems: [
          "Schedule meetings with challenging authorities",
          "Review specific requirements and expectations",
          "Consider hiring local permit expediting services",
          "Develop authority-specific application templates"
        ]
      })
    }

    // Cost optimization opportunity
    const totalPermitCost = permits.reduce((sum, p) => sum + (p.cost || 0), 0)
    const avgCostPerPermit = totalPermitCost / permits.length

    if (avgCostPerPermit > 5000 && permits.length > 10) {
      insights.push({
        id: "cost-optimization",
        type: "opportunity",
        category: "cost",
        title: "Permit Cost Optimization",
        description: `Average permit cost of $${avgCostPerPermit.toFixed(0)} suggests potential for bulk processing and fee negotiation.`,
        impact: "low",
        confidence: 68,
        actionItems: [
          "Explore bulk permit application discounts",
          "Negotiate annual permit agreements",
          "Consider permit bundling strategies",
          "Review fee structures with authorities"
        ],
        potentialSavings: totalPermitCost * 0.15
      })
    }

    // Processing time trend
    const pendingTooLong = permits.filter(permit => {
      if (permit.status !== "pending") return false
      const applicationDate = new Date(permit.applicationDate)
      const daysPending = Math.floor((Date.now() - applicationDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysPending > 45
    })

    if (pendingTooLong.length > 0) {
      insights.push({
        id: "processing-delays",
        type: "alert",
        category: "timing",
        title: "Extended Processing Times",
        description: `${pendingTooLong.length} permits have been pending for over 45 days, indicating potential processing delays.`,
        impact: "high",
        confidence: 92,
        actionItems: [
          "Follow up with permit authorities on pending applications",
          "Escalate delayed permits to supervisory level",
          "Consider expedited processing fees where available",
          "Implement proactive follow-up schedule"
        ],
        affectedPermits: pendingTooLong.map(p => p.number)
      })
    }

    // Positive trend recognition
    if (stats.approvalRate > 90 && stats.inspectionPassRate > 90) {
      insights.push({
        id: "excellent-performance",
        type: "opportunity",
        category: "compliance",
        title: "Excellent Permit Performance",
        description: `Outstanding approval rate of ${stats.approvalRate.toFixed(1)}% and inspection pass rate of ${stats.inspectionPassRate.toFixed(1)}% exceed industry benchmarks.`,
        impact: "medium",
        confidence: 95,
        actionItems: [
          "Document successful permit strategies",
          "Share best practices across all projects",
          "Leverage strong authority relationships for future projects",
          "Consider mentoring other project teams"
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
      case "alert": return <AlertTriangle className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "compliance": return <Shield className="h-4 w-4" />
      case "timing": return <Clock className="h-4 w-4" />
      case "cost": return <TrendingDown className="h-4 w-4" />
      case "authority": return <Building className="h-4 w-4" />
      case "inspection": return <CheckCircle className="h-4 w-4" />
      case "renewal": return <Calendar className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              HBI Permit Insights
            </span>
            <Badge variant="outline" className="ml-2 border-green-300 text-green-700">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-green-200 hover:bg-green-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
          AI-powered insights to optimize permit management and compliance
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              All Insights
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Risks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-4">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="border border-green-200 bg-white/70 dark:bg-gray-800/70 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(insight.type)}
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h3>
                          <Badge variant="outline" className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                          <Badge variant="outline" className="text-green-600 border-green-300">
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
                          {insight.affectedPermits && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{insight.affectedPermits.length} permits affected</span>
                            </div>
                          )}
                          {insight.potentialSavings && (
                            <div className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              <span>Potential savings: ${insight.potentialSavings.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeInsight === insight.id ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                    
                    {activeInsight === insight.id && (
                      <div className="mt-4 pt-4 border-t border-green-200">
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
                          {insight.affectedPermits && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Affected Permits:</h4>
                              <div className="flex flex-wrap gap-1">
                                {insight.affectedPermits.slice(0, 10).map((permitNumber) => (
                                  <Badge key={permitNumber} variant="outline" className="text-xs">
                                    {permitNumber}
                                  </Badge>
                                ))}
                                {insight.affectedPermits.length > 10 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{insight.affectedPermits.length - 10} more
                                  </Badge>
                                )}
                              </div>
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

          <TabsContent value="alerts" className="mt-4">
            <div className="space-y-4">
              {insights.filter(insight => insight.type === "alert").map((insight) => (
                <Card key={insight.id} className="border border-red-200 bg-red-50/50 dark:bg-red-950/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <h3 className="font-semibold text-red-900 dark:text-red-100">{insight.title}</h3>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} priority
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
                <Card key={insight.id} className="border border-orange-200 bg-orange-50/50 dark:bg-orange-950/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100">{insight.title}</h3>
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact} risk
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
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