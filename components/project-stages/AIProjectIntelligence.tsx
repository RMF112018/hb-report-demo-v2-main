"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  MessageSquare,
  Lightbulb,
  Shield,
  Clock,
  Activity,
  Gauge,
} from "lucide-react"

interface AIProjectIntelligenceProps {
  project: any
  currentStage: string
  userRole: string
  historicalData?: any[]
}

interface PredictiveInsight {
  id: string
  type: "risk" | "opportunity" | "recommendation" | "prediction"
  title: string
  description: string
  confidence: number
  impact: "low" | "medium" | "high" | "critical"
  category: string
  suggestedActions: string[]
  timeline: string
  dataPoints: string[]
}

interface ProjectMetrics {
  schedulePerformance: {
    current: number
    predicted: number
    trend: "up" | "down" | "stable"
    riskLevel: "low" | "medium" | "high"
  }
  costPerformance: {
    current: number
    predicted: number
    trend: "up" | "down" | "stable"
    variance: number
  }
  qualityMetrics: {
    score: number
    trend: "improving" | "declining" | "stable"
    keyFactors: string[]
  }
  riskAssessment: {
    overallRisk: "low" | "medium" | "high" | "critical"
    topRisks: Array<{
      risk: string
      probability: number
      impact: number
      mitigation: string
    }>
  }
}

export const AIProjectIntelligence = ({
  project,
  currentStage,
  userRole,
  historicalData = [],
}: AIProjectIntelligenceProps) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
  const [queryDialogOpen, setQueryDialogOpen] = useState(false)
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("")
  const [queryResponse, setQueryResponse] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize AI insights and predictions
  useEffect(() => {
    generateAIInsights()
    calculatePredictiveMetrics()
  }, [project, currentStage, historicalData])

  const generateAIInsights = () => {
    // Mock AI-generated insights based on project stage and data
    const mockInsights: PredictiveInsight[] = [
      {
        id: "insight-1",
        type: "prediction",
        title: "Schedule Acceleration Opportunity",
        description:
          "AI analysis suggests potential for 12-day schedule acceleration through optimized resource allocation during electrical rough-in phase.",
        confidence: 87,
        impact: "high",
        category: "Schedule Optimization",
        suggestedActions: [
          "Increase electrical crew size by 2 workers during weeks 15-18",
          "Coordinate parallel MEP rough-in activities",
          "Pre-order long-lead electrical materials",
        ],
        timeline: "2-3 weeks",
        dataPoints: ["Historical crew productivity", "Material delivery schedules", "Weather patterns"],
      },
      {
        id: "insight-2",
        type: "risk",
        title: "Weather Impact Risk",
        description:
          "Predictive weather analysis indicates 73% probability of schedule delays due to forecasted storm system in week 12.",
        confidence: 92,
        impact: "medium",
        category: "Weather Risk",
        suggestedActions: [
          "Accelerate exterior work completion before week 12",
          "Prepare interior work packages as backup",
          "Secure temporary weather protection systems",
        ],
        timeline: "Immediate",
        dataPoints: ["NOAA weather forecasts", "Historical weather impact data", "Current project timeline"],
      },
      {
        id: "insight-3",
        type: "opportunity",
        title: "Cost Savings Through Vendor Optimization",
        description:
          "Analysis of supplier performance and market conditions suggests potential 8.5% cost reduction on concrete materials.",
        confidence: 78,
        impact: "medium",
        category: "Cost Optimization",
        suggestedActions: [
          "Negotiate bulk pricing with alternative concrete supplier",
          "Optimize concrete pour scheduling for volume discounts",
          "Consider ready-mix plant proximity for delivery savings",
        ],
        timeline: "1-2 weeks",
        dataPoints: ["Market pricing trends", "Supplier performance metrics", "Transportation costs"],
      },
      {
        id: "insight-4",
        type: "recommendation",
        title: "Quality Enhancement Strategy",
        description:
          "Machine learning analysis of inspection data recommends enhanced QC protocols for mechanical systems to prevent future issues.",
        confidence: 85,
        impact: "high",
        category: "Quality Assurance",
        suggestedActions: [
          "Implement enhanced pre-installation inspections",
          "Add thermal imaging checks for HVAC systems",
          "Increase frequency of pressure testing",
        ],
        timeline: "Ongoing",
        dataPoints: ["Historical defect patterns", "Industry best practices", "Inspection failure rates"],
      },
      {
        id: "insight-5",
        type: "prediction",
        title: "Resource Demand Forecast",
        description:
          "AI workforce analytics predict 15% increase in skilled labor demand for weeks 20-24, suggesting early contractor engagement.",
        confidence: 81,
        impact: "medium",
        category: "Resource Planning",
        suggestedActions: [
          "Secure specialized contractors 4 weeks in advance",
          "Cross-train existing workers for critical skills",
          "Establish backup contractor relationships",
        ],
        timeline: "3-4 weeks",
        dataPoints: ["Labor market trends", "Subcontractor availability", "Skill requirement analysis"],
      },
    ]

    setInsights(mockInsights)
  }

  const calculatePredictiveMetrics = () => {
    // Mock predictive metrics calculation
    const mockMetrics: ProjectMetrics = {
      schedulePerformance: {
        current: 87.3,
        predicted: 91.2,
        trend: "up",
        riskLevel: "low",
      },
      costPerformance: {
        current: 82.1,
        predicted: 78.9,
        trend: "down",
        variance: -3.2,
      },
      qualityMetrics: {
        score: 94.7,
        trend: "improving",
        keyFactors: ["Enhanced inspection protocols", "Improved material quality", "Better crew training"],
      },
      riskAssessment: {
        overallRisk: "medium",
        topRisks: [
          {
            risk: "Weather delays during exterior work",
            probability: 73,
            impact: 65,
            mitigation: "Accelerate exterior phases, prepare weather protection",
          },
          {
            risk: "Skilled labor shortage in specialty trades",
            probability: 68,
            impact: 78,
            mitigation: "Early contractor engagement, cross-training programs",
          },
          {
            risk: "Material delivery delays for long-lead items",
            probability: 45,
            impact: 82,
            mitigation: "Advance ordering, alternative supplier identification",
          },
        ],
      },
    }

    setMetrics(mockMetrics)
  }

  const handleNaturalLanguageQuery = async () => {
    setLoading(true)

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock AI response based on query
      const mockResponse = generateMockResponse(naturalLanguageQuery)
      setQueryResponse(mockResponse)
    } catch (error) {
      console.error("AI query error:", error)
      setQueryResponse("I'm sorry, I couldn't process your query at this time. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("schedule") || lowerQuery.includes("timeline")) {
      return "Based on current progress and predictive modeling, your project is performing well with an 87.3% schedule performance index. I predict a potential 12-day acceleration opportunity through optimized resource allocation. The critical path shows concrete work completion by week 8, followed by MEP rough-in. Weather risk analysis suggests planning contingencies for week 12."
    }

    if (lowerQuery.includes("cost") || lowerQuery.includes("budget")) {
      return "Your project shows an 82.1% cost performance index with a predicted decline to 78.9% due to material cost increases. However, I've identified an 8.5% cost reduction opportunity through vendor optimization. Current variance is -3.2%, which is within acceptable limits. I recommend immediate action on concrete supplier negotiations."
    }

    if (lowerQuery.includes("risk")) {
      return "Current overall risk assessment is 'medium' with three primary concerns: 73% probability of weather delays (week 12), 68% probability of skilled labor shortages in specialty trades, and 45% probability of material delivery delays. I recommend implementing the suggested mitigation strategies for weather protection and early contractor engagement."
    }

    if (lowerQuery.includes("quality")) {
      return "Quality metrics show excellent performance at 94.7% with an improving trend. Key success factors include enhanced inspection protocols, improved material quality, and better crew training. My analysis recommends implementing enhanced QC protocols for mechanical systems to maintain this high standard."
    }

    return "I've analyzed your project data across multiple dimensions. Your project shows strong performance with opportunities for schedule acceleration and cost optimization. The main risks are weather-related and resource availability. Would you like me to dive deeper into any specific area - schedule, cost, quality, or risk management?"
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
        return <Brain className="h-4 w-4 text-gray-600" />
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
      case "up":
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
            <p className="text-muted-foreground">AI analyzing project data...</p>
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
              AI Project Intelligence
            </CardTitle>
            <CardDescription>Advanced analytics and predictive insights for {project.name}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={queryDialogOpen} onOpenChange={setQueryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask AI
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Natural Language Project Query</DialogTitle>
                  <DialogDescription>Ask me anything about your project using natural language</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="query">Your Question</Label>
                    <Textarea
                      id="query"
                      placeholder="e.g., 'What are the biggest risks to our schedule?' or 'How can we save money on this project?'"
                      value={naturalLanguageQuery}
                      onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                  {queryResponse && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI Response
                      </h4>
                      <p className="text-sm">{queryResponse}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQueryDialogOpen(false)
                        setQueryResponse("")
                        setNaturalLanguageQuery("")
                      }}
                    >
                      Close
                    </Button>
                    <Button onClick={handleNaturalLanguageQuery} disabled={!naturalLanguageQuery.trim() || loading}>
                      {loading ? "Analyzing..." : "Ask AI"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="secondary">{insights.length} Active Insights</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Schedule Performance</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{metrics.schedulePerformance.current}%</p>
                        {getTrendIcon(metrics.schedulePerformance.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Predicted: {metrics.schedulePerformance.predicted}%
                      </p>
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
                      <p className="text-sm text-muted-foreground">Cost Performance</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">{metrics.costPerformance.current}%</p>
                        {getTrendIcon(metrics.costPerformance.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Variance: {metrics.costPerformance.variance > 0 ? "+" : ""}
                        {metrics.costPerformance.variance}%
                      </p>
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
                        <p className="text-2xl font-bold">{metrics.qualityMetrics.score}%</p>
                        {getTrendIcon(metrics.qualityMetrics.trend)}
                      </div>
                      <p className="text-xs text-muted-foreground">{metrics.qualityMetrics.trend}</p>
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Level</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(metrics.riskAssessment.overallRisk)}>
                          {metrics.riskAssessment.overallRisk.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {metrics.riskAssessment.topRisks.length} active risks
                      </p>
                    </div>
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                      <Gauge className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Priority Insights</CardTitle>
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

          <TabsContent value="predictions" className="space-y-6">
            <div className="space-y-4">
              {insights
                .filter((i) => i.type === "prediction")
                .map((insight) => (
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

                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Suggested Actions:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {insight.suggestedActions.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 mt-0.5 text-green-600" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                              <span>Timeline: {insight.timeline}</span>
                              <span>Category: {insight.category}</span>
                              <span>Data Sources: {insight.dataPoints.length} sources</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            {/* Overall Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Risk Assessment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Overall Risk Level:</span>
                    <Badge className={getImpactColor(metrics.riskAssessment.overallRisk)}>
                      {metrics.riskAssessment.overallRisk.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Top Risk Factors</h4>
                    {metrics.riskAssessment.topRisks.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium">{risk.risk}</h5>
                          <div className="flex gap-2">
                            <Badge variant="outline">{risk.probability}% probability</Badge>
                            <Badge variant="outline">{risk.impact}% impact</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk-type Insights */}
            <div className="space-y-4">
              {insights
                .filter((i) => i.type === "risk")
                .map((insight) => (
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

                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Mitigation Actions:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {insight.suggestedActions.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Shield className="h-3 w-3 mt-0.5 text-orange-600" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                              <span>Timeline: {insight.timeline}</span>
                              <span>Category: {insight.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="space-y-4">
              {insights
                .filter((i) => i.type === "recommendation" || i.type === "opportunity")
                .map((insight) => (
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

                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium mb-1">Recommended Actions:</h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {insight.suggestedActions.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Target className="h-3 w-3 mt-0.5 text-purple-600" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                              <span>Timeline: {insight.timeline}</span>
                              <span>Category: {insight.category}</span>
                              <span>Based on: {insight.dataPoints.join(", ")}</span>
                            </div>
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
