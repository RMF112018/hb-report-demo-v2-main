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
  RefreshCw,
  ChevronDown,
  ArrowRight,
  Package,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface HbiProcurementInsightsProps {
  procurementStats: {
    totalValue: number
    activeProcurements: number
    completedProcurements: number
    pendingApprovals: number
    linkedToBidTabs: number
    avgCycleTime: number
    complianceRate: number
    totalRecords: number
  }
  className?: string
}

interface ProcurementInsight {
  id: string
  type: "cost-savings" | "vendor-risk" | "market-opportunity" | "compliance-alert" | "efficiency" | "forecast"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  text: string
  action: string
  confidence: number
  impact: string
  relatedMetrics: string[]
  project_id?: string
}

export function HbiProcurementInsights({ procurementStats, className }: HbiProcurementInsightsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Procurement-specific AI insights
  const procurementInsights: ProcurementInsight[] = [
    {
      id: "proc-insight-1",
      type: "cost-savings",
      severity: "high",
      title: "Bulk Purchasing Opportunity",
      text: "AI identifies 23% cost reduction through consolidated material orders across 3 projects.",
      action: "Coordinate purchasing schedules and negotiate volume discounts with steel suppliers.",
      confidence: 94,
      impact: "$340K potential savings",
      relatedMetrics: ["Material Costs", "Volume Discounts", "Project Coordination"],
      project_id: "multiple"
    },
    {
      id: "proc-insight-2",
      type: "vendor-risk",
      severity: "critical",
      title: "Vendor Performance Alert",
      text: "AMERICAN LEAK DETECTION showing 15% schedule slippage across recent projects.",
      action: "Implement performance improvement plan and consider backup vendors.",
      confidence: 89,
      impact: "3-week potential delay",
      relatedMetrics: ["Vendor Performance", "Schedule Risk", "Quality Metrics"],
      project_id: "TW-2024"
    },
    {
      id: "proc-insight-3",
      type: "market-opportunity",
      severity: "medium",
      title: "Market Price Advantage",
      text: "Current concrete prices 8% below market forecast for Q2 2025.",
      action: "Accelerate concrete procurement for upcoming phases to lock in savings.",
        confidence: 87,
      impact: "$125K cost avoidance",
      relatedMetrics: ["Market Pricing", "Commodity Trends", "Procurement Timing"],
      project_id: "global"
    },
    {
      id: "proc-insight-4",
      type: "compliance-alert",
      severity: "medium",
      title: "Insurance Verification Gap",
      text: "2 active subcontractors have insurance expiring within 30 days.",
      action: "Initiate insurance renewal process and implement automated tracking.",
      confidence: 96,
      impact: "Compliance risk",
      relatedMetrics: ["Insurance Compliance", "Contract Status", "Risk Management"],
      project_id: "multiple"
    },
    {
      id: "proc-insight-5",
      type: "efficiency",
      severity: "low",
      title: "Bid Tab Integration Success",
      text: "92% of new procurement records successfully linked to estimating bid tabs.",
      action: "Continue current integration practices and train team on remaining 8%.",
      confidence: 98,
      impact: "Improved accuracy",
      relatedMetrics: ["Data Integration", "Process Efficiency", "Team Performance"],
      project_id: "global"
    },
    {
      id: "proc-insight-6",
      type: "forecast",
      severity: "high",
      title: "Supply Chain Disruption Risk",
      text: "Predictive models indicate 35% risk of steel delivery delays in March.",
      action: "Diversify suppliers and advance steel orders by 2 weeks.",
      confidence: 83,
      impact: "Schedule protection",
      relatedMetrics: ["Supply Chain", "Material Availability", "Schedule Impact"],
      project_id: "global"
    }
  ]

  const visibleInsights = showAll ? procurementInsights : procurementInsights.slice(0, 4)
  const avgConfidence = Math.round(
    procurementInsights.reduce((sum, insight) => sum + insight.confidence, 0) / procurementInsights.length
  )
  const criticalCount = procurementInsights.filter(insight => insight.severity === "critical" || insight.severity === "high").length
  const opportunityCount = procurementInsights.filter(insight => insight.type === "cost-savings" || insight.type === "market-opportunity").length

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "cost-savings":
        return <DollarSign className="h-3 w-3" />
      case "vendor-risk":
        return <AlertTriangle className="h-3 w-3" />
      case "market-opportunity":
        return <TrendingUp className="h-3 w-3" />
      case "compliance-alert":
        return <ShieldCheck className="h-3 w-3" />
      case "efficiency":
        return <Target className="h-3 w-3" />
      case "forecast":
        return <BarChart3 className="h-3 w-3" />
      default:
        return <Sparkles className="h-3 w-3" />
    }
  }

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-300 bg-red-50 dark:bg-red-950/30 hover:bg-red-100"
      case "high":
        return "border-orange-200 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100"
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100"
      case "low":
        return "border-green-200 bg-green-50 dark:bg-green-950/30 hover:bg-green-100"
      default:
        return "border-border bg-muted/50"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-700 bg-red-100 border-red-200"
      case "high":
        return "text-orange-700 bg-orange-100 border-orange-200"
      case "medium":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "low":
        return "text-green-700 bg-green-100 border-green-200"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-200">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-white/50 dark:hover:bg-black/20 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#FF6B35]" />
                  <span>HBI Procurement Insights</span>
                  <Badge className="bg-purple-600 text-white border-purple-600 text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
            </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-700">
                    {avgConfidence}% Confidence
                  </Badge>
                  {isOpen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDrillDown(!showDrillDown);
                      }}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md transition-all duration-200",
                        showDrillDown 
                          ? "bg-purple-600 text-white shadow-md" 
                          : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                      )}
                    >
                      <Brain className="h-3 w-3" />
                      {showDrillDown ? "Close" : "Drill Down"}
                    </button>
                  )}
                  <ChevronDown className={cn("h-4 w-4 transition-transform text-[#FF6B35]", isOpen && "rotate-180")} />
                </div>
          </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent 
              className="relative"
            >
              {/* AI Stats Header */}
              <div className="mb-4 p-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg border border-purple-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                    <div className="font-bold text-lg text-red-700">{criticalCount}</div>
                    <div className="text-xs text-red-600">Critical/High</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
                    <div className="font-bold text-lg text-green-700">{opportunityCount}</div>
                    <div className="text-xs text-green-600">Opportunities</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                    <div className="font-bold text-lg text-blue-700">
                      {procurementInsights.filter(i => i.type === "forecast").length}
                    </div>
                    <div className="text-xs text-blue-600">Forecasts</div>
                  </div>
                </div>
        </div>

              {/* Insights List */}
              <div className="space-y-3">
                {visibleInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm",
                      getInsightColor(insight.severity),
                      selectedInsight === insight.id && "ring-2 ring-purple-400"
                    )}
                    onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-foreground leading-tight">
                            {insight.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs px-2 py-0.5", getSeverityColor(insight.severity))}>
                              {insight.severity}
                          </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}%
                          </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground mb-2 leading-snug">
                          {insight.text}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="font-medium text-purple-700">{insight.impact}</span>
                          <span>{insight.project_id === "global" ? "All Projects" : insight.project_id}</span>
                        </div>

                        {selectedInsight === insight.id && (
                          <div className="mt-3 p-3 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-lg border border-white/50">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <ArrowRight className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-foreground font-medium">
                                  {insight.action}
                                </p>
                              </div>
                              <div className="mt-2 pt-2 border-t border-purple-200">
                                <p className="text-xs text-muted-foreground mb-1">Related Metrics:</p>
                                <div className="flex flex-wrap gap-1">
                                  {insight.relatedMetrics.map((metric, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {metric}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {procurementInsights.length > 4 && (
                <div className="mt-4 pt-3 border-t border-purple-200">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center gap-2 font-medium py-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <span>{showAll ? "Show Less" : `+${procurementInsights.length - 4} More Insights`}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showAll && "rotate-180")} />
                  </button>
                </div>
              )}

              {/* Click-Based Drill-Down Overlay */}
              {showDrillDown && (
                <div className="absolute inset-0 bg-purple-900/95 backdrop-blur-sm rounded-lg p-4 text-white transition-all duration-300 ease-in-out overflow-y-auto z-10">
                  <div className="h-full">
                    <h3 className="text-lg font-medium mb-3 text-center">Procurement AI Intelligence Deep Dive</h3>
                    
                    <div className="grid grid-cols-2 gap-4 h-[calc(100%-60px)]">
                      {/* AI Performance Metrics */}
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded-lg p-3">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Brain className="w-4 h-4 mr-2" />
                            Procurement AI Analytics
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Model Accuracy:</span>
                              <span className="font-medium text-purple-300">{avgConfidence}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Vendor Risk Prediction:</span>
                              <span className="font-medium text-green-400">91.2%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cost Optimization:</span>
                              <span className="font-medium text-blue-400">$465K identified</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Market Intelligence:</span>
                              <span className="font-medium text-yellow-400">Real-time</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-3">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            Active Monitoring
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Vendor Performance:</span>
                                                             <span className="font-medium text-green-400">{procurementStats.totalRecords || 12} tracked</span>
                            </div>
                            <div className="text-xs text-purple-200">Last updated: 5 minutes ago</div>
                            <div className="flex justify-between">
                              <span>Market Trends:</span>
                              <span className="font-medium text-blue-400">15 indicators</span>
                            </div>
                            <div className="text-xs text-purple-200">Price volatility alerts active</div>
                          </div>
                        </div>
                      </div>

                      {/* Procurement Intelligence */}
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded-lg p-3">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            Procurement Intelligence
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Cost Savings:</span>
                              <span className="font-medium text-green-400">
                                {procurementInsights.filter(i => i.type === 'cost-savings').length} identified
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Risk Alerts:</span>
                              <span className="font-medium text-red-400">
                                {procurementInsights.filter(i => i.type === 'vendor-risk').length} active
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Compliance:</span>
                              <span className="font-medium text-yellow-400">
                                {procurementInsights.filter(i => i.type === 'compliance-alert').length} monitoring
                              </span>
                            </div>
                          </div>
                    </div>
                    
                        <div className="bg-white/10 rounded-lg p-3">
                          <h4 className="font-semibold mb-2 flex items-center">
                            <Activity className="w-4 h-4 mr-2" />
                            Strategic Recommendations
                          </h4>
                          <div className="text-sm">
                            <p className="font-medium mb-2">Priority Actions:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-purple-200">
                              <li>Address {criticalCount} critical procurement risks</li>
                              <li>Capitalize on {opportunityCount} cost optimization opportunities</li>
                              <li>Monitor market trends for strategic timing</li>
                              <li>Enhance vendor performance tracking</li>
                            </ul>
                            
                            <div className="pt-2 mt-2 border-t border-white/20">
                              <p className="text-xs text-purple-200">
                                                                 AI analyzing {procurementStats.totalRecords || 'multiple'} procurement records 
                                with {avgConfidence}% confidence across vendor performance, 
                                market intelligence, and cost optimization patterns.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
            </div>
                    </div>
              )}
                  </CardContent>
          </CollapsibleContent>
                </Card>
      </Collapsible>
            </div>
  )
} 