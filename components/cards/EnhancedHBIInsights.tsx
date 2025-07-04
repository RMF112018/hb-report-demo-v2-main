"use client"

import React, { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Zap,
  Target,
  Activity,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HBIInsight {
  id: string
  type: "forecast" | "risk" | "opportunity" | "performance" | "alert"
  severity: "low" | "medium" | "high"
  title: string
  text: string
  action: string
  confidence: number
  relatedMetrics: string[]
  project_id?: string
}

interface EnhancedHBIInsightsProps {
  config: HBIInsight[] | any
  cardId?: string
  span?: { cols: number; rows: number }
}

export function EnhancedHBIInsights({ config, cardId, span }: EnhancedHBIInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Calculate responsive sizing based on card dimensions
  const getResponsiveStyles = () => {
    const defaultSpan = { cols: 10, rows: 5 } // Default optimal size
    const actualSpan = span || defaultSpan
    const cardArea = actualSpan.cols * actualSpan.rows
    const defaultArea = defaultSpan.cols * defaultSpan.rows // 50
    const scaleFactor = Math.min(Math.max(cardArea / defaultArea, 0.4), 1.5) // Scale between 40% and 150%

    // Calculate layout properties
    const isVerySmall = cardArea <= 20 // 4x5 or smaller
    const isSmall = cardArea <= 30 // 6x5 or smaller
    const isMedium = cardArea <= 50 // 10x5 (default)
    const isLarge = cardArea > 50
    const isWide = actualSpan.cols >= 8
    const isTall = actualSpan.rows >= 6

    return {
      scaleFactor,
      cardArea,
      isVerySmall,
      isSmall,
      isMedium,
      isLarge,
      isWide,
      isTall,
      // Dynamic sizing
      headerPadding: Math.max(4, Math.round(8 * scaleFactor)),
      contentPadding: Math.max(4, Math.round(12 * scaleFactor)),
      itemSpacing: Math.max(2, Math.round(8 * scaleFactor)),
      iconSize: Math.max(8, Math.round(12 * scaleFactor)),
      fontSize: Math.max(10, Math.round(14 * scaleFactor)),
      titleFontSize: Math.max(12, Math.round(16 * scaleFactor)),
      badgeFontSize: Math.max(8, Math.round(10 * scaleFactor)),
      // Layout decisions
      maxVisibleInsights: isVerySmall ? 2 : isSmall ? 3 : isMedium ? 4 : 6,
      showConfidenceInHeader: !isVerySmall,
      showFullStats: !isSmall,
      useCompactStats: isVerySmall || isSmall,
      gridCols: isVerySmall ? 2 : 3,
    }
  }

  const responsive = getResponsiveStyles()

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === cardId || event.detail.cardType === "enhanced-hbi-insights") {
        const shouldShow = event.detail.action === "show"
        setShowDrillDown(shouldShow)

        // Notify wrapper of state change
        const stateEvent = new CustomEvent("cardDrillDownStateChange", {
          detail: {
            cardId: cardId,
            cardType: "enhanced-hbi-insights",
            isActive: shouldShow,
          },
        })
        window.dispatchEvent(stateEvent)
      }
    }

    window.addEventListener("cardDrillDown", handleDrillDownEvent as EventListener)

    return () => {
      window.removeEventListener("cardDrillDown", handleDrillDownEvent as EventListener)
    }
  }, [cardId])

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)

    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent("cardDrillDownStateChange", {
      detail: {
        cardId: cardId,
        cardType: "enhanced-hbi-insights",
        isActive: false,
      },
    })
    window.dispatchEvent(stateEvent)
  }

  // Handle both array and object config formats
  const insights = Array.isArray(config) ? config : []

  // Financial-specific insights if this is a financial review card
  const financialInsights: HBIInsight[] = [
    {
      id: "fin-1",
      type: "risk",
      severity: "high",
      title: "Cash Flow Risk Detected",
      text: "3 projects showing potential cash flow constraints in Q2 2025.",
      action: "Accelerate billing schedules and negotiate improved payment terms.",
      confidence: 89,
      relatedMetrics: ["Cash Flow", "Billing Schedule", "Payment Terms"],
      project_id: "global",
    },
    {
      id: "fin-2",
      type: "opportunity",
      severity: "medium",
      title: "Profit Margin Enhancement",
      text: "AI identifies $1.2M additional profit through GC optimization.",
      action: "Implement recommended general conditions adjustments.",
      confidence: 91,
      relatedMetrics: ["Profit Margin", "General Conditions", "Cost Control"],
      project_id: "global",
    },
    {
      id: "fin-3",
      type: "alert",
      severity: "high",
      title: "Contingency Utilization Alert",
      text: "Project TW-2024 has exceeded 75% contingency threshold.",
      action: "Review project scope and implement cost control measures.",
      confidence: 96,
      relatedMetrics: ["Contingency", "Cost Control", "Project Scope"],
      project_id: "TW-2024",
    },
    {
      id: "fin-4",
      type: "forecast",
      severity: "medium",
      title: "Revenue Recognition Optimization",
      text: "Predictive models suggest 8% improvement in revenue timing.",
      action: "Adjust milestone billing to optimize revenue recognition.",
      confidence: 83,
      relatedMetrics: ["Revenue Recognition", "Milestone Billing", "Contract Value"],
      project_id: "global",
    },
    {
      id: "fin-5",
      type: "performance",
      severity: "low",
      title: "Buyout Savings Trend",
      text: "Current buyout performance tracking 15% above target.",
      action: "Continue current procurement strategy and expand to similar projects.",
      confidence: 94,
      relatedMetrics: ["Buyout Savings", "Procurement", "Cost Management"],
      project_id: "global",
    },
  ]

  // Mock data for executive dashboard if no insights provided
  const mockInsights: HBIInsight[] = [
    {
      id: "exec-1",
      type: "risk",
      severity: "high",
      title: "Supply Chain Risk Alert",
      text: "Material cost volatility detected across 3 major projects.",
      action: "Diversify supplier base and implement strategic stockpiling.",
      confidence: 92,
      relatedMetrics: ["Material Costs", "Project Margins", "Supply Chain"],
      project_id: "global",
    },
    {
      id: "exec-2",
      type: "opportunity",
      severity: "medium",
      title: "Market Expansion Opportunity",
      text: "15% growth potential identified in Austin commercial sector.",
      action: "Consider expanding commercial division partnerships.",
      confidence: 88,
      relatedMetrics: ["Market Growth", "Commercial Projects", "Revenue"],
      project_id: "global",
    },
    {
      id: "exec-3",
      type: "performance",
      severity: "high",
      title: "Resource Optimization Alert",
      text: "AI analysis shows 12% efficiency gain possible through reallocation.",
      action: "Implement resource optimization across critical projects.",
      confidence: 94,
      relatedMetrics: ["Resource Allocation", "Efficiency", "Critical Path"],
      project_id: "global",
    },
    {
      id: "exec-4",
      type: "forecast",
      severity: "medium",
      title: "Cash Flow Optimization",
      text: "Predictive models suggest 18% improvement through payment scheduling.",
      action: "Implement automated payment scheduling system.",
      confidence: 79,
      relatedMetrics: ["Cash Flow", "Payment Terms", "Working Capital"],
      project_id: "global",
    },
  ]

  // Determine which insights to use based on card context
  const isFinancialReview = cardId?.includes("financial") || cardId?.includes("fin-")
  const defaultInsights = isFinancialReview ? financialInsights : mockInsights
  const displayInsights = insights.length > 0 ? insights : defaultInsights
  const visibleInsights = showAll ? displayInsights : displayInsights.slice(0, responsive.maxVisibleInsights)
  const avgConfidence = Math.round(
    displayInsights.reduce((sum, insight) => sum + insight.confidence, 0) / displayInsights.length
  )
  const highSeverityCount = displayInsights.filter((insight) => insight.severity === "high").length

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "forecast":
        return <TrendingUp className="h-3 w-3" />
      case "risk":
        return <AlertTriangle className="h-3 w-3" />
      case "opportunity":
        return <CheckCircle className="h-3 w-3" />
      case "performance":
        return <Target className="h-3 w-3" />
      default:
        return <Sparkles className="h-3 w-3" />
    }
  }

  const getInsightColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 hover:bg-red-100"
      case "medium":
        return "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100"
      case "low":
        return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 hover:bg-green-100"
      default:
        return "border-border bg-muted/50"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-100"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100"
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-100"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="relative h-full" data-tour="hbi-insights">
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* AI Stats Header */}
        <div
          className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600"
          style={{ padding: `${responsive.headerPadding}px` }}
        >
          <div
            className="flex items-center gap-2"
            style={{ marginBottom: `${Math.max(4, responsive.headerPadding / 2)}px` }}
          >
            <Badge
              className="bg-gray-600 text-white border-gray-600"
              style={{ fontSize: `${responsive.badgeFontSize}px` }}
            >
              <Activity
                className="mr-1"
                style={{
                  width: `${responsive.iconSize}px`,
                  height: `${responsive.iconSize}px`,
                }}
              />
              AI Powered
            </Badge>
            {responsive.showConfidenceInHeader && (
              <div
                className="text-gray-700 dark:text-gray-300 font-medium"
                style={{ fontSize: `${responsive.fontSize}px` }}
              >
                {avgConfidence}% Avg Confidence
              </div>
            )}
          </div>

          {/* Responsive Stats Grid */}
          {responsive.showFullStats ? (
            <div className={`grid grid-cols-${responsive.gridCols}`} style={{ gap: `${responsive.itemSpacing}px` }}>
              <div
                className="text-center bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
                style={{ padding: `${Math.max(4, responsive.contentPadding / 2)}px` }}
              >
                <div className="font-bold text-red-700" style={{ fontSize: `${responsive.titleFontSize}px` }}>
                  {highSeverityCount}
                </div>
                <div className="text-red-600 dark:text-red-400" style={{ fontSize: `${responsive.badgeFontSize}px` }}>
                  Critical
                </div>
              </div>
              <div
                className="text-center bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
                style={{ padding: `${Math.max(4, responsive.contentPadding / 2)}px` }}
              >
                <div className="font-bold text-green-700" style={{ fontSize: `${responsive.titleFontSize}px` }}>
                  {displayInsights.filter((i) => i.type === "opportunity").length}
                </div>
                <div
                  className="text-green-600 dark:text-green-400"
                  style={{ fontSize: `${responsive.badgeFontSize}px` }}
                >
                  Opportunities
                </div>
              </div>
              <div
                className="text-center bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700"
                style={{ padding: `${Math.max(4, responsive.contentPadding / 2)}px` }}
              >
                <div className="font-bold text-blue-700" style={{ fontSize: `${responsive.titleFontSize}px` }}>
                  {displayInsights.filter((i) => i.type === "forecast").length}
                </div>
                <div className="text-blue-600 dark:text-blue-400" style={{ fontSize: `${responsive.badgeFontSize}px` }}>
                  Forecasts
                </div>
              </div>
            </div>
          ) : (
            /* Compact Stats for Small Cards */
            <div className="flex justify-center gap-4">
              <span
                className="text-red-600 dark:text-red-400 font-medium"
                style={{ fontSize: `${responsive.fontSize}px` }}
              >
                {highSeverityCount} Critical
              </span>
              <span
                className="text-green-600 dark:text-green-400 font-medium"
                style={{ fontSize: `${responsive.fontSize}px` }}
              >
                {displayInsights.filter((i) => i.type === "opportunity").length} Ops
              </span>
            </div>
          )}
        </div>

        {/* Insights List */}
        <div className="flex-1 overflow-y-auto" style={{ padding: `${responsive.contentPadding}px` }}>
          <div style={{ gap: `${responsive.itemSpacing}px` }} className="space-y-2">
            {visibleInsights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "rounded-lg border cursor-pointer transition-all duration-200 shadow-sm",
                  getInsightColor(insight.severity),
                  selectedInsight === insight.id && "ring-2 ring-purple-400"
                )}
                style={{ padding: `${Math.max(4, responsive.contentPadding / 2)}px` }}
                onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {React.cloneElement(getInsightIcon(insight.type), {
                      style: {
                        width: `${responsive.iconSize}px`,
                        height: `${responsive.iconSize}px`,
                      },
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className="font-semibold text-foreground leading-tight"
                        style={{ fontSize: `${responsive.fontSize}px` }}
                      >
                        {responsive.isVerySmall
                          ? insight.title.substring(0, 20) + (insight.title.length > 20 ? "..." : "")
                          : insight.title}
                      </h4>
                      <Badge
                        className={cn("px-2 py-0.5", getSeverityColor(insight.severity))}
                        style={{ fontSize: `${responsive.badgeFontSize}px` }}
                      >
                        {insight.confidence}%
                      </Badge>
                    </div>

                    {!responsive.useCompactStats && (
                      <p
                        className="text-foreground mb-1 leading-snug"
                        style={{ fontSize: `${Math.max(10, responsive.fontSize - 2)}px` }}
                      >
                        {responsive.isSmall
                          ? insight.text.substring(0, 80) + (insight.text.length > 80 ? "..." : "")
                          : insight.text}
                      </p>
                    )}

                    {selectedInsight === insight.id && !responsive.isVerySmall && (
                      <div
                        className="mt-2 rounded-lg border border-gray-300 dark:border-gray-600"
                        style={{ padding: `${Math.max(4, responsive.contentPadding / 3)}px` }}
                      >
                        <div className="flex items-start gap-2">
                          <ArrowRight
                            className="mt-0.5 flex-shrink-0"
                            style={{
                              color: "#FA4616",
                              width: `${responsive.iconSize}px`,
                              height: `${responsive.iconSize}px`,
                            }}
                          />
                          <p
                            className="text-foreground font-medium"
                            style={{ fontSize: `${Math.max(10, responsive.fontSize - 2)}px` }}
                          >
                            {insight.action}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Show More/Less Button */}
        {displayInsights.length > responsive.maxVisibleInsights && !responsive.isVerySmall && (
          <div
            className="flex-shrink-0 border-t border-gray-200 dark:border-gray-600"
            style={{ padding: `${Math.max(4, responsive.headerPadding / 2)}px` }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center gap-2 font-medium"
              style={{
                fontSize: `${responsive.fontSize}px`,
                padding: `${Math.max(2, responsive.headerPadding / 4)}px`,
              }}
            >
              <span>
                {showAll ? "Show Less" : `+${displayInsights.length - responsive.maxVisibleInsights} More Insights`}
              </span>
              <ChevronDown
                className={cn("transition-transform", showAll && "rotate-180")}
                style={{
                  width: `${responsive.iconSize}px`,
                  height: `${responsive.iconSize}px`,
                }}
              />
            </button>
          </div>
        )}
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div
          className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg text-white transition-all duration-300 ease-in-out overflow-y-auto z-50"
          style={{ padding: `${responsive.contentPadding}px` }}
        >
          <div className="h-full">
            <h3
              className="font-medium text-center"
              style={{
                fontSize: `${Math.max(16, responsive.titleFontSize + 2)}px`,
                marginBottom: `${responsive.headerPadding}px`,
              }}
            >
              AI Intelligence Deep Analysis
            </h3>

            <div
              className={`grid ${responsive.isVerySmall ? "grid-cols-1" : "grid-cols-2"} h-[calc(100%-60px)]`}
              style={{ gap: `${responsive.itemSpacing}px` }}
            >
              {/* AI Performance Metrics */}
              <div style={{ gap: `${responsive.itemSpacing}px` }} className="space-y-4">
                <div
                  className="bg-white/10 dark:bg-black/10 rounded-lg"
                  style={{ padding: `${responsive.contentPadding}px` }}
                >
                  <h4
                    className="font-semibold flex items-center"
                    style={{
                      fontSize: `${responsive.titleFontSize}px`,
                      marginBottom: `${responsive.headerPadding}px`,
                    }}
                  >
                    <Brain
                      className="mr-2"
                      style={{
                        width: `${responsive.iconSize}px`,
                        height: `${responsive.iconSize}px`,
                      }}
                    />
                    AI Performance Analytics
                  </h4>
                  <div className="space-y-2" style={{ fontSize: `${responsive.fontSize}px` }}>
                    <div className="flex justify-between">
                      <span>Model Accuracy:</span>
                      <span className="font-medium text-purple-300">{avgConfidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prediction Reliability:</span>
                      <span className="font-medium text-green-400">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Processing Speed:</span>
                      <span className="font-medium text-blue-400">47ms avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Efficiency:</span>
                      <span className="font-medium text-yellow-400">High</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3 lg:p-4">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Real-Time Insights
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Active Monitoring:</span>
                        <span className="font-medium text-green-400">{displayInsights.length} sources</span>
                      </div>
                      <div className="text-xs text-purple-200">Last updated: 2 minutes ago</div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="flex justify-between">
                        <span>Pattern Recognition:</span>
                        <span className="font-medium text-blue-400">12 trends identified</span>
                      </div>
                      <div className="text-xs text-purple-200">Cross-project correlations detected</div>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-purple-200">
                        <span>Recommendation Engine:</span>
                        <span className="font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insight Categories Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3 lg:p-4">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Insight Categories Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Risk Alerts:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-red-400">
                          {displayInsights.filter((i) => i.type === "risk").length}
                        </span>
                        <span className="text-xs text-purple-200">({highSeverityCount} high)</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Opportunities:</span>
                      <span className="font-medium text-green-400">
                        {displayInsights.filter((i) => i.type === "opportunity").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forecasts:</span>
                      <span className="font-medium text-blue-400">
                        {displayInsights.filter((i) => i.type === "forecast").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance:</span>
                      <span className="font-medium text-yellow-400">
                        {displayInsights.filter((i) => i.type === "performance").length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3 lg:p-4">
                  <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Strategic Recommendations
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-purple-200">
                      <p className="font-medium mb-1">Priority Actions:</p>
                      <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Address {highSeverityCount} critical risk alerts immediately</li>
                        <li>
                          Capitalize on {displayInsights.filter((i) => i.type === "opportunity").length} identified
                          opportunities
                        </li>
                        <li>Monitor forecast accuracy for strategic planning</li>
                        <li>Optimize performance based on AI recommendations</li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <p className="text-xs text-purple-200">
                        AI confidence level: {avgConfidence}% average. System learning from{" "}
                        {isFinancialReview ? "financial" : "operational"} patterns across all projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div
              className="absolute"
              style={{
                bottom: `${responsive.headerPadding}px`,
                right: `${responsive.headerPadding}px`,
              }}
            >
              <button
                onClick={handleCloseDrillDown}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                style={{
                  fontSize: `${responsive.fontSize}px`,
                  padding: `${responsive.headerPadding / 2}px ${responsive.headerPadding}px`,
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
