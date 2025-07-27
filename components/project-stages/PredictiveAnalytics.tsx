"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  LineChart,
  Zap,
  Lightbulb,
  Activity,
} from "lucide-react"

interface PredictiveAnalyticsProps {
  project: any
  currentStage: string
  userRole: string
}

interface PredictiveInsight {
  id: string
  type: "prediction" | "risk" | "opportunity" | "recommendation"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high" | "critical"
  category: string
  timeline: string
}

interface ProjectForecast {
  schedule: {
    currentIndex: number
    predictedIndex: number
    trend: "improving" | "declining" | "stable"
    completionDate: Date
    riskFactors: string[]
  }
  budget: {
    currentVariance: number
    predictedVariance: number
    trend: "improving" | "declining" | "stable"
    finalCostPrediction: number
  }
  quality: {
    currentScore: number
    predictedScore: number
    trend: "improving" | "declining" | "stable"
    keyMetrics: Array<{ name: string; value: number; target: number }>
  }
}

export const PredictiveAnalytics = ({ project, currentStage, userRole }: PredictiveAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [forecast, setForecast] = useState<ProjectForecast | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generatePredictiveInsights()
    generateProjectForecast()
    setLoading(false)
  }, [project, currentStage])

  const generatePredictiveInsights = () => {
    // AI-generated insights based on project data and stage
    const mockInsights: PredictiveInsight[] = [
      {
        id: "pred-1",
        type: "prediction",
        title: "Schedule Acceleration Opportunity",
        description:
          "HBI Analysis predicts 12-day schedule acceleration through optimized resource allocation during electrical phase.",
        confidence: 87,
        impact: "high",
        category: "Schedule",
        timeline: "Next 3 weeks",
      },
      {
        id: "risk-1",
        type: "risk",
        title: "Weather Impact Risk",
        description: "73% probability of delays due to forecasted severe weather in week 12.",
        confidence: 92,
        impact: "medium",
        category: "Weather",
        timeline: "Week 12",
      },
      {
        id: "opp-1",
        type: "opportunity",
        title: "Cost Optimization",
        description:
          "Vendor analysis suggests 8.5% potential savings on concrete materials through alternative sourcing.",
        confidence: 78,
        impact: "medium",
        category: "Cost",
        timeline: "1-2 weeks",
      },
      {
        id: "rec-1",
        type: "recommendation",
        title: "Quality Enhancement",
        description: "Implement enhanced QC protocols for mechanical systems based on historical failure analysis.",
        confidence: 85,
        impact: "high",
        category: "Quality",
        timeline: "Immediate",
      },
    ]

    setInsights(mockInsights)
  }

  const generateProjectForecast = () => {
    const mockForecast: ProjectForecast = {
      schedule: {
        currentIndex: 87.3,
        predictedIndex: 91.2,
        trend: "improving",
        completionDate: new Date(2024, 11, 15), // Dec 15, 2024
        riskFactors: ["Weather delays", "Material delivery", "Labor availability"],
      },
      budget: {
        currentVariance: -3.2,
        predictedVariance: -5.8,
        trend: "declining",
        finalCostPrediction: 2850000,
      },
      quality: {
        currentScore: 94.7,
        predictedScore: 96.2,
        trend: "improving",
        keyMetrics: [
          { name: "Inspection Pass Rate", value: 96.8, target: 95.0 },
          { name: "Rework Percentage", value: 2.1, target: 3.0 },
          { name: "Safety Score", value: 98.5, target: 95.0 },
          { name: "Client Satisfaction", value: 93.2, target: 90.0 },
        ],
      },
    }

    setForecast(mockForecast)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "prediction":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "opportunity":
        return <Lightbulb className="h-4 w-4 text-green-600" />
      case "recommendation":
        return <Target className="h-4 w-4 text-purple-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  if (loading || !forecast) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
            <p className="text-muted-foreground">Generating AI predictions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>AI-powered forecasting and insights for {project.name}</CardDescription>
          </div>
          <Badge variant="secondary">Phase 4: Advanced AI</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Forecasts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule Performance</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{forecast.schedule.currentIndex}%</p>
                        {getTrendIcon(forecast.schedule.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">Predicted: {forecast.schedule.predictedIndex}%</p>
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Variance</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{forecast.budget.currentVariance}%</p>
                        {getTrendIcon(forecast.budget.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">Predicted: {forecast.budget.predictedVariance}%</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Quality Score</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{forecast.quality.currentScore}%</p>
                        {getTrendIcon(forecast.quality.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">Predicted: {forecast.quality.predictedScore}%</p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Priority Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Priority AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.slice(0, 3).map((insight) => (
                    <div key={insight.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge className={getImpactColor(insight.impact)}>{insight.impact}</Badge>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Category: {insight.category}</span>
                          <span>Timeline: {insight.timeline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasts" className="space-y-6">
            {/* Schedule Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Schedule Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Performance</p>
                    <p className="text-2xl font-bold">{forecast.schedule.currentIndex}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Performance</p>
                    <p className="text-2xl font-bold">{forecast.schedule.predictedIndex}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Predicted Completion</p>
                  <p className="font-medium">{forecast.schedule.completionDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Risk Factors</p>
                  <div className="flex flex-wrap gap-1">
                    {forecast.schedule.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Variance</p>
                    <p className="text-2xl font-bold">{forecast.budget.currentVariance}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Variance</p>
                    <p className="text-2xl font-bold">{forecast.budget.predictedVariance}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Final Cost Prediction</p>
                  <p className="font-medium">${(forecast.budget.finalCostPrediction / 1000000).toFixed(2)}M</p>
                </div>
              </CardContent>
            </Card>

            {/* Quality Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quality Metrics Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Score</p>
                    <p className="text-2xl font-bold">{forecast.quality.currentScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Score</p>
                    <p className="text-2xl font-bold">{forecast.quality.predictedScore}%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Key Metrics Performance</p>
                  {forecast.quality.keyMetrics.map((metric, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span>
                          {metric.value}% (Target: {metric.target}%)
                        </span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge className={getImpactColor(insight.impact)}>{insight.impact} impact</Badge>
                          <Badge variant="outline">{insight.confidence}% confidence</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                          <span>Type: {insight.type}</span>
                          <span>Timeline: {insight.timeline}</span>
                          <span>Category: {insight.category}</span>
                        </div>
                      </div>
                    </div>
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
