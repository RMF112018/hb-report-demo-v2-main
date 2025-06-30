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
  FileText,
  Users,
  CheckCircle,
  ChevronRight,
  Sparkles,
  BarChart3,
  XCircle,
  RefreshCw,
  Building,
  DollarSign
} from "lucide-react"
import { DailyLog, ManpowerRecord, SafetyAudit, QualityInspection } from "@/types/field-reports"
import type { FieldReportsStats } from "./FieldReportsWidgets"

interface HbiFieldReportsInsightsProps {
  data: {
    dailyLogs: DailyLog[]
    manpower: ManpowerRecord[]
    safetyAudits: SafetyAudit[]
    qualityInspections: QualityInspection[]
  }
  stats: FieldReportsStats
}

interface FieldReportsInsight {
  id: string
  type: "opportunity" | "risk" | "trend" | "recommendation" | "alert"
  category: "compliance" | "safety" | "quality" | "efficiency" | "manpower" | "reporting"
  title: string
  description: string
  impact: "low" | "medium" | "high" | "critical"
  confidence: number
  actionItems: string[]
  affectedReports?: string[]
  dueDate?: string
  potentialSavings?: number
  riskMitigation?: string[]
}

export function HbiFieldReportsInsights({ data, stats }: HbiFieldReportsInsightsProps) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Generate insights based on field reports data
  const generateInsights = (): FieldReportsInsight[] => {
    const insights: FieldReportsInsight[] = []

    // Log compliance alert
    if (stats.logComplianceRate < 95) {
      const missedLogs = stats.expectedLogs - stats.completedLogs
      insights.push({
        id: "log-compliance",
        type: "alert",
        category: "compliance",
        title: "Daily Log Compliance Below Target",
        description: `Current log compliance of ${stats.logComplianceRate.toFixed(1)}% is below the 95% target. ${missedLogs} logs are missing or overdue.`,
        impact: stats.logComplianceRate < 85 ? "critical" : "high",
        confidence: 95,
        actionItems: [
          "Send reminder notifications to field supervisors",
          "Review log submission process for bottlenecks",
          "Implement automated log creation templates",
          "Schedule daily check-ins with project managers"
        ],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      })
    }

    // Safety performance risk
    if (stats.safetyViolations > 5 || stats.safetyComplianceRate < 90) {
      insights.push({
        id: "safety-performance",
        type: "risk",
        category: "safety",
        title: "Safety Performance Requires Attention",
        description: `${stats.safetyViolations} safety violations detected with ${stats.atRiskSafetyItems} at-risk items requiring immediate attention.`,
        impact: stats.safetyViolations > 10 ? "critical" : "high",
        confidence: 92,
        actionItems: [
          "Conduct immediate safety stand-down meetings",
          "Review and enhance safety training programs",
          "Increase frequency of safety inspections",
          "Implement additional safety checkpoints"
        ],
        riskMitigation: [
          "Deploy additional safety officers to high-risk areas",
          "Mandate refresher safety training for all workers",
          "Implement real-time safety monitoring systems"
        ]
      })
    }

    // Quality defects trend
    if (stats.qualityDefects > 0 && stats.qualityPassRate < 85) {
      insights.push({
        id: "quality-improvement",
        type: "opportunity",
        category: "quality",
        title: "Quality Performance Improvement Opportunity",
        description: `${stats.qualityDefects} quality defects identified. Current pass rate of ${stats.qualityPassRate.toFixed(1)}% suggests systematic quality issues.`,
        impact: "medium",
        confidence: 85,
        actionItems: [
          "Implement pre-work quality checklists",
          "Increase quality control inspections",
          "Provide additional training on quality standards",
          "Review material specifications and suppliers"
        ]
      })
    }

    // Workforce efficiency analysis
    if (stats.averageEfficiency < 75) {
      const potentialSavings = data.manpower.reduce((sum, record) => sum + (record.costPerHour * record.hours), 0) * 0.15
      insights.push({
        id: "workforce-efficiency",
        type: "opportunity",
        category: "efficiency",
        title: "Workforce Efficiency Below Optimal",
        description: `Average workforce efficiency of ${stats.averageEfficiency.toFixed(1)}% indicates potential productivity improvements across ${stats.totalWorkers} workers.`,
        impact: "medium",
        confidence: 78,
        actionItems: [
          "Analyze workflow bottlenecks and delays",
          "Optimize crew sizes and skill mix",
          "Implement productivity tracking tools",
          "Review equipment availability and maintenance"
        ],
        potentialSavings: potentialSavings
      })
    }

    // Overdue daily logs pattern
    const overdueLogs = data.dailyLogs.filter(log => log.status === "overdue")
    if (overdueLogs.length > 3) {
      insights.push({
        id: "overdue-logs-pattern",
        type: "risk",
        category: "reporting",
        title: "Pattern of Overdue Daily Logs",
        description: `${overdueLogs.length} daily logs are overdue, indicating potential systemic reporting issues that could impact project documentation.`,
        impact: "medium",
        confidence: 88,
        actionItems: [
          "Identify common causes of log delays",
          "Simplify log entry process and templates",
          "Implement mobile-friendly logging solutions",
          "Establish daily submission checkpoints"
        ],
        affectedReports: overdueLogs.map(log => log.id)
      })
    }

    // Positive performance recognition
    if (stats.logComplianceRate > 98 && stats.safetyComplianceRate > 95 && stats.qualityPassRate > 90) {
      insights.push({
        id: "excellent-performance",
        type: "opportunity",
        category: "compliance",
        title: "Exceptional Field Reporting Performance",
        description: `Outstanding performance across all metrics: ${stats.logComplianceRate.toFixed(1)}% log compliance, ${stats.safetyComplianceRate.toFixed(1)}% safety score, and ${stats.qualityPassRate.toFixed(1)}% quality pass rate.`,
        impact: "medium",
        confidence: 95,
        actionItems: [
          "Document successful practices and procedures",
          "Share best practices across all project teams",
          "Consider this project as a benchmark model",
          "Recognize and reward exceptional performance"
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
      case "compliance": return <FileText className="h-4 w-4" />
      case "safety": return <Shield className="h-4 w-4" />
      case "quality": return <CheckCircle className="h-4 w-4" />
      case "efficiency": return <TrendingUp className="h-4 w-4" />
      case "manpower": return <Users className="h-4 w-4" />
      case "reporting": return <Clock className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              HBI Field Reports Insights
            </span>
            <Badge variant="outline" className="ml-2 border-blue-300 text-blue-700">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-200 hover:bg-blue-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          AI-powered insights to optimize field reporting and project performance
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
                <Card key={insight.id} className="border border-blue-200 bg-white/70 dark:bg-gray-800/70 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(insight.type)}
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h3>
                          <Badge variant="outline" className={getImpactColor(insight.impact)}>
                            {insight.impact}
                          </Badge>
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
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
                          {insight.affectedReports && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{insight.affectedReports.length} reports affected</span>
                            </div>
                          )}
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
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform ${activeInsight === insight.id ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                    
                    {activeInsight === insight.id && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Action Items:</h4>
                            <ul className="space-y-1">
                              {insight.actionItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
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
                                    <Shield className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {insight.affectedReports && (
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Affected Reports:</h4>
                              <div className="flex flex-wrap gap-1">
                                {insight.affectedReports.slice(0, 10).map((reportId) => (
                                  <Badge key={reportId} variant="outline" className="text-xs">
                                    {reportId}
                                  </Badge>
                                ))}
                                {insight.affectedReports.length > 10 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{insight.affectedReports.length - 10} more
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