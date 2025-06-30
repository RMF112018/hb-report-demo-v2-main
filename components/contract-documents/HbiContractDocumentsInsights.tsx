"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Shield,
  FileText,
  DollarSign,
  CheckCircle,
  ChevronRight,
  Sparkles,
  BarChart3,
  RefreshCw,
  Scale,
  Target
} from "lucide-react"
import type { ContractDocument, ContractDocumentsStats } from "./ContractDocumentsExportUtils"

interface HbiContractDocumentsInsightsProps {
  documents: ContractDocument[]
  stats: ContractDocumentsStats
}

interface ContractInsight {
  id: string
  type: "opportunity" | "risk" | "compliance" | "optimization" | "alert"
  category: "cost-savings" | "risk-mitigation" | "compliance" | "process" | "negotiation" | "legal"
  title: string
  description: string
  impact: "low" | "medium" | "high" | "critical"
  confidence: number
  actionItems: string[]
  affectedDocuments?: string[]
  potentialSavings?: number
  complianceRequirement?: string
}

export function HbiContractDocumentsInsights({ documents, stats }: HbiContractDocumentsInsightsProps) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const generateInsights = (): ContractInsight[] => {
    const insights: ContractInsight[] = []

    if (stats.highRiskDocuments > 0) {
      insights.push({
        id: "high-risk-documents",
        type: "alert",
        category: "risk-mitigation",
        title: "High Risk Documents Require Immediate Attention",
        description: `${stats.highRiskDocuments} contract documents have been flagged as high risk.`,
        impact: stats.highRiskDocuments > 5 ? "critical" : "high",
        confidence: 95,
        actionItems: [
          "Schedule immediate legal review for all high-risk documents",
          "Prioritize renegotiation of problematic contract terms",
          "Implement additional approval processes for high-risk contracts",
          "Develop risk mitigation strategies for each identified risk"
        ],
        affectedDocuments: documents
          .filter(doc => doc.riskLevel === "High")
          .map(doc => doc.id)
          .slice(0, 10)
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
      case "alert": return <AlertTriangle className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cost-savings": return <DollarSign className="h-4 w-4" />
      case "risk-mitigation": return <Shield className="h-4 w-4" />
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
              HBI Contract Documents Insights
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
          AI-powered contract analysis for risk mitigation, compliance optimization, and cost savings
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
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Compliance
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
                            <span className="capitalize">{insight.category.replace("-", " ")}</span>
                          </div>
                          {insight.affectedDocuments && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{insight.affectedDocuments.length} documents affected</span>
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
        </Tabs>
      </CardContent>
    </Card>
  )
}
