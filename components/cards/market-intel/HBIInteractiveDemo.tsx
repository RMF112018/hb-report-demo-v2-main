/**
 * @fileoverview HBI Interactive Demo Component
 * @module HBIInteractiveDemo
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Interactive demonstration of HBI Market Intelligence capabilities
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import {
  Brain,
  Zap,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Info,
  CheckCircle,
  Loader2,
  Lightbulb,
  Target,
  BarChart3,
  AlertCircle,
  Clock,
} from "lucide-react"
import { useHBIAnalysis, useHBIPrompts, useHBIStatus } from "../../../hooks/use-hbi-analysis"
import ActivityTrendsCard from "./ActivityTrendsCard"

// Sample data for the demo
const marketGrowthData = [
  { period: "Jan", value: 125000 },
  { period: "Feb", value: 132000 },
  { period: "Mar", value: 128000 },
  { period: "Apr", value: 145000 },
  { period: "May", value: 138000 },
  { period: "Jun", value: 152000 },
]

const demoPrompts = [
  {
    id: "florida-commercial-trajectory",
    label: "Florida Commercial Growth",
    description: "Analyze 3-month commercial trajectory",
    complexity: "moderate" as const,
  },
  {
    id: "luxury-multifamily-risks",
    label: "Luxury Multifamily Risks",
    description: "Evaluate luxury development opportunities",
    complexity: "complex" as const,
  },
  {
    id: "emerging-construction-tech",
    label: "Construction Technology",
    description: "Identify transformative technologies",
    complexity: "simple" as const,
  },
]

export default function HBIInteractiveDemo() {
  const {
    data: hbiData,
    loading: hbiLoading,
    error: hbiError,
    runAnalysis,
    clearError,
    isHBIEnabled,
    toggleHBIMode,
  } = useHBIAnalysis()

  const { status: hbiStatus, loading: statusLoading } = useHBIStatus()
  const { prompts, categories } = useHBIPrompts()

  const [selectedPrompt, setSelectedPrompt] = useState(demoPrompts[0])
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([])
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  // Track analysis history
  useEffect(() => {
    if (hbiData && !hbiLoading) {
      setAnalysisHistory((prev) => [
        {
          ...hbiData,
          timestamp: new Date().toISOString(),
          promptLabel: selectedPrompt.label,
        },
        ...prev.slice(0, 4), // Keep last 5 analyses
      ])
    }
  }, [hbiData, hbiLoading, selectedPrompt.label])

  const handleRunAnalysis = async () => {
    await runAnalysis(selectedPrompt.id, {
      region: "Florida",
      timeframe: "3 months",
      analysisDepth:
        selectedPrompt.complexity === "complex"
          ? "comprehensive"
          : selectedPrompt.complexity === "moderate"
          ? "detailed"
          : "summary",
    })
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "text-green-600 bg-green-50 border-green-200"
      case "moderate":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "complex":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* HBI Status and Controls */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-purple-900">HBI Market Intelligence</CardTitle>
                <p className="text-sm text-purple-700">Interactive demonstration of Hedrick Brothers Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                Model: HBI-3.2.1
              </Badge>
              {hbiStatus && (
                <Badge
                  variant="outline"
                  className={
                    hbiStatus.status === "online"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : "text-red-600 border-red-200 bg-red-50"
                  }
                >
                  {hbiStatus.status === "online" ? "● Online" : "● Offline"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* HBI Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <Zap className={`h-5 w-5 ${isHBIEnabled ? "text-green-600" : "text-gray-400"}`} />
              <div>
                <h3 className="font-semibold text-gray-900">HBI Forecast Mode</h3>
                <p className="text-sm text-gray-600">
                  {isHBIEnabled
                    ? "HBI analysis enabled - Real-time market intelligence active"
                    : "Enable HBI to access advanced market analysis capabilities"}
                </p>
              </div>
            </div>
            <Button
              onClick={toggleHBIMode}
              variant={isHBIEnabled ? "default" : "outline"}
              className={
                isHBIEnabled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-purple-200 text-purple-600 hover:bg-purple-50"
              }
              onMouseEnter={() => setShowTooltip("hbi-toggle")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {isHBIEnabled ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  HBI Active
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Enable HBI Forecast
                </>
              )}
            </Button>
          </div>

          {/* HBI Analysis Controls */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Run Analysis</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Select Analysis Type</h4>
                  <div className="grid gap-2">
                    {demoPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedPrompt.id === prompt.id
                            ? "border-purple-300 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPrompt(prompt)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{prompt.label}</h5>
                            <p className="text-sm text-gray-600">{prompt.description}</p>
                          </div>
                          <Badge variant="outline" className={getComplexityColor(prompt.complexity)}>
                            {prompt.complexity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleRunAnalysis}
                  disabled={!isHBIEnabled || hbiLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onMouseEnter={() => setShowTooltip("run-analysis")}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  {hbiLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running HBI Analysis...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Run HBI Market Analysis
                    </>
                  )}
                </Button>

                {hbiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800">{hbiError}</p>
                        <Button variant="link" size="sm" onClick={clearError} className="text-red-600 p-0 h-auto">
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {hbiData ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-start gap-3 mb-3">
                      <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-purple-900">HBI Insight</h3>
                          <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                            {hbiData.confidence}% confidence
                          </Badge>
                          {hbiData.dataQuality && (
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              {hbiData.dataQuality}% quality
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-purple-800 mb-3">{hbiData.insight}</p>

                        {hbiData.keyFactors && hbiData.keyFactors.length > 0 && (
                          <div className="mb-3">
                            <h4 className="text-xs font-medium text-purple-700 mb-1">Key Factors:</h4>
                            <div className="flex flex-wrap gap-1">
                              {hbiData.keyFactors.map((factor, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs text-purple-600 border-purple-200 bg-purple-50"
                                >
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {hbiData.recommendation && (
                          <div className="flex items-start gap-2 mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                            <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-amber-800">{hbiData.recommendation}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-purple-100">
                          <div className="flex items-center gap-2 text-xs text-purple-600">
                            <Clock className="h-3 w-3" />
                            Processing: {hbiData.processingTime}ms
                          </div>
                          <div className="text-xs text-purple-600 opacity-75">Powered by HBI</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Card Demo */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Live HBI Integration</h4>
                    <ActivityTrendsCard
                      title="HBI-Powered Market Analysis"
                      description="Real-time market intelligence with HBI insights"
                      data={marketGrowthData}
                      config={{
                        chartType: "area",
                        showRealTime: true,
                        trendIndicator: true,
                        primaryColor: "#8b5cf6",
                        gradientColors: ["#8b5cf6", "#7c3aed"],
                        showHBISummary: true,
                        enableHBIForecast: true,
                        icon: Brain,
                      }}
                      hbiSummary={{
                        insight: hbiData.insight,
                        confidence: hbiData.confidence,
                        trend: hbiData.trend,
                        recommendation: hbiData.recommendation,
                        keyFactors: hbiData.keyFactors,
                        dataQuality: hbiData.dataQuality,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Yet</h3>
                  <p className="text-gray-600">Run an HBI analysis to see results here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {analysisHistory.length > 0 ? (
                <div className="space-y-3">
                  {analysisHistory.map((analysis, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{analysis.promptLabel}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">
                            {analysis.confidence}%
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(analysis.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{analysis.insight}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No History</h3>
                  <p className="text-gray-600">Analysis history will appear here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Service Status */}
          {hbiStatus && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${hbiStatus.status === "online" ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm font-medium text-gray-700">HBI Service</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Uptime: {hbiStatus.uptime}</span>
                  <span>Version: {hbiStatus.modelVersion}</span>
                  <span>Capabilities: {hbiStatus.capabilities?.length || 0}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tooltips */}
          {showTooltip && (
            <div className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg pointer-events-none">
              {showTooltip === "hbi-toggle" &&
                "Toggle HBI Forecast mode to enable advanced market intelligence analysis"}
              {showTooltip === "run-analysis" &&
                "Execute HBI analysis using advanced machine learning models for market insights"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
