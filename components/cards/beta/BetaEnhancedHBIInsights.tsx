"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Progress } from "../../ui/progress"
import { Alert, AlertDescription } from "../../ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Switch } from "../../ui/switch"
import { Label } from "../../ui/label"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  Zap,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Info,
  Bot,
  Eye,
  Clock,
  DollarSign,
  BarChart3,
  Users,
  Globe,
  Lock,
  Shield,
  Database,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"

interface BetaEnhancedHBIInsightsProps {
  className?: string
  isCompact?: boolean
  userRole?: string
  config?: any
}

// Enhanced AI-powered insights data
const generateAIInsights = () => ({
  confidence: 94.2,
  riskScore: 12.8,
  opportunities: 8,
  predictions: [
    { month: "Jan", budget: 45.2, predicted: 44.1, actual: 43.8, confidence: 92 },
    { month: "Feb", budget: 52.1, predicted: 51.3, actual: 48.9, confidence: 89 },
    { month: "Mar", budget: 48.7, predicted: 49.2, actual: 51.3, confidence: 94 },
    { month: "Apr", budget: 56.3, predicted: 55.8, actual: 54.7, confidence: 96 },
    { month: "May", budget: 51.8, predicted: 50.9, actual: 49.2, confidence: 91 },
    { month: "Jun", budget: 59.4, predicted: 60.1, actual: 61.1, confidence: 93 },
  ],
  insights: [
    {
      id: 1,
      type: "opportunity",
      title: "Cost Optimization Opportunity",
      description: "AI detected potential 8.3% cost savings in procurement across 3 projects",
      impact: "High",
      confidence: 87,
      action: "Review supplier contracts",
      timeline: "Next 30 days",
      priority: 1,
    },
    {
      id: 2,
      type: "risk",
      title: "Schedule Risk Alert",
      description: "Delayed material delivery may impact 2 critical path activities",
      impact: "Medium",
      confidence: 94,
      action: "Activate backup suppliers",
      timeline: "Next 14 days",
      priority: 2,
    },
    {
      id: 3,
      type: "trend",
      title: "Performance Trend",
      description: "Consistent schedule adherence improvement detected across portfolio",
      impact: "Low",
      confidence: 91,
      action: "Document best practices",
      timeline: "Next 60 days",
      priority: 3,
    },
  ],
  analytics: {
    totalProjects: 17,
    activeInsights: 12,
    accuracyRate: 94.2,
    predictiveModels: 15,
    dataPoints: 127000,
    processingTime: "2.3s",
  },
  modelPerformance: [
    { model: "Schedule Prediction", accuracy: 94.2, usage: 85 },
    { model: "Cost Forecasting", accuracy: 87.6, usage: 92 },
    { model: "Risk Assessment", accuracy: 91.8, usage: 78 },
    { model: "Resource Optimization", accuracy: 89.4, usage: 65 },
  ],
})

export default function BetaEnhancedHBIInsights({
  className,
  isCompact,
  userRole,
  config,
}: BetaEnhancedHBIInsightsProps) {
  const [activeTab, setActiveTab] = useState("insights")
  const [aiEnabled, setAiEnabled] = useState(true)
  const [realTimeProcessing, setRealTimeProcessing] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastProcessed, setLastProcessed] = useState(new Date())
  const data = generateAIInsights()

  // Simulate AI processing
  useEffect(() => {
    if (realTimeProcessing) {
      const interval = setInterval(() => {
        setIsProcessing(true)
        setTimeout(() => {
          setIsProcessing(false)
          setLastProcessed(new Date())
        }, 2000)
      }, 45000) // Process every 45 seconds
      return () => clearInterval(interval)
    }
  }, [realTimeProcessing])

  const handleReprocess = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setLastProcessed(new Date())
    setIsProcessing(false)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Target className="h-4 w-4 text-green-600" />
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "trend":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      case "risk":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      case "trend":
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
    }
  }

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return (
          <Badge variant="destructive" className="text-xs">
            High Priority
          </Badge>
        )
      case 2:
        return (
          <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
            Medium Priority
          </Badge>
        )
      case 3:
        return (
          <Badge variant="outline" className="text-xs">
            Low Priority
          </Badge>
        )
      default:
        return null
    }
  }

  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-2" : "pb-3",
    gap: isCompact ? "gap-1" : "gap-2",
    gapLarge: isCompact ? "gap-2" : "gap-3",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40 shadow-lg`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${compactScale.gapLarge}`}>
            <div className={`${compactScale.padding} bg-[#FA4616] rounded-lg`}>
              <Brain className={`${compactScale.iconSize} text-white`} />
            </div>
            <div>
              <CardTitle className={`${compactScale.textTitle} font-semibold text-[#FA4616] dark:text-[#FF8A67]`}>
                HBI AI Insights
              </CardTitle>
              <div className={`flex items-center ${compactScale.gap} ${compactScale.marginTop}`}>
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]`}
                >
                  <Bot className={`${compactScale.iconSizeSmall} mr-0.5`} />
                  AI-Powered
                </Badge>
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]`}
                >
                  <Database className={`${compactScale.iconSizeSmall} mr-0.5`} />
                  Power BI
                </Badge>
                <Badge
                  variant="outline"
                  className={`${compactScale.textSmall} bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]`}
                >
                  <Activity className={`${compactScale.iconSizeSmall} mr-0.5`} />
                  {isProcessing ? "Processing..." : "Live"}
                </Badge>
              </div>
            </div>
          </div>
          <div className={`flex items-center ${compactScale.gap}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
                  <MoreVertical className={`${compactScale.iconSize} scale-150`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Switch id="ai-toggle" checked={aiEnabled} onCheckedChange={setAiEnabled} />
                  <Label htmlFor="ai-toggle" className={compactScale.textSmall}>
                    AI Processing
                  </Label>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReprocess} disabled={isProcessing}>
                  <RefreshCw className={`${compactScale.iconSize} mr-2 ${isProcessing ? "animate-spin" : ""}`} />
                  {isProcessing ? "Processing..." : "Refresh Data"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className={`flex items-center justify-between ${compactScale.textSmall} text-muted-foreground`}>
          <span>Last processed: {lastProcessed.toLocaleTimeString()}</span>
          <span>Confidence: {data.confidence}%</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* AI Status Banner */}
        {isProcessing && (
          <Alert className="mb-4 border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
            <Brain className="h-4 w-4 text-purple-600 animate-pulse" />
            <AlertDescription className="text-purple-800 dark:text-purple-200">
              AI models are analyzing project data and generating insights...
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full grid-cols-3 ${isCompact ? "mb-2" : "mb-4"}`}>
            <TabsTrigger value="insights" className={compactScale.textSmall}>
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="predictions" className={compactScale.textSmall}>
              Predictions
            </TabsTrigger>
            <TabsTrigger value="models" className={compactScale.textSmall}>
              AI Models
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className={isCompact ? "space-y-2" : "space-y-4"}>
            {/* Quick Stats */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 ${isCompact ? "gap-2" : "gap-3"}`}>
              <div
                className={`bg-white dark:bg-gray-800 rounded-lg ${
                  isCompact ? "p-2" : "p-3"
                } border border-purple-200 dark:border-purple-800`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-muted-foreground`}>Active Insights</p>
                    <p className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-purple-600`}>
                      {data.analytics.activeInsights}
                    </p>
                  </div>
                  <Eye className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-purple-600`} />
                </div>
                <div className={`flex items-center gap-1 ${isCompact ? "mt-0.5" : "mt-1"}`}>
                  <TrendingUp className={`${compactScale.iconSizeSmall} text-green-500`} />
                  <span className={`${compactScale.textSmall} text-green-600`}>+3 this week</span>
                </div>
              </div>

              <div
                className={`bg-white dark:bg-gray-800 rounded-lg ${
                  isCompact ? "p-2" : "p-3"
                } border border-green-200 dark:border-green-800`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-muted-foreground`}>Accuracy Rate</p>
                    <p className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-green-600`}>
                      {data.analytics.accuracyRate}%
                    </p>
                  </div>
                  <CheckCircle className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-green-600`} />
                </div>
                <div className={`flex items-center gap-1 ${isCompact ? "mt-0.5" : "mt-1"}`}>
                  <TrendingUp className={`${compactScale.iconSizeSmall} text-green-500`} />
                  <span className={`${compactScale.textSmall} text-green-600`}>+2.1% vs last month</span>
                </div>
              </div>

              <div
                className={`bg-white dark:bg-gray-800 rounded-lg ${
                  isCompact ? "p-2" : "p-3"
                } border border-blue-200 dark:border-blue-800`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-muted-foreground`}>Data Points</p>
                    <p className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-blue-600`}>
                      {data.analytics.dataPoints.toLocaleString()}
                    </p>
                  </div>
                  <Database className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-blue-600`} />
                </div>
                <div className={`flex items-center gap-1 ${isCompact ? "mt-0.5" : "mt-1"}`}>
                  <Clock className={`${compactScale.iconSizeSmall} text-blue-500`} />
                  <span className={`${compactScale.textSmall} text-blue-600`}>{data.analytics.processingTime}</span>
                </div>
              </div>

              <div
                className={`bg-white dark:bg-gray-800 rounded-lg ${
                  isCompact ? "p-2" : "p-3"
                } border border-orange-200 dark:border-orange-800`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${compactScale.textSmall} text-muted-foreground`}>Risk Score</p>
                    <p className={`${isCompact ? "text-sm" : "text-lg"} font-bold text-orange-600`}>
                      {data.riskScore}%
                    </p>
                  </div>
                  <Shield className={`${isCompact ? "h-3 w-3" : "h-4 w-4"} text-orange-600`} />
                </div>
                <div className={`flex items-center gap-1 ${isCompact ? "mt-0.5" : "mt-1"}`}>
                  <CheckCircle className={`${compactScale.iconSizeSmall} text-green-500`} />
                  <span className={`${compactScale.textSmall} text-green-600`}>Low Risk</span>
                </div>
              </div>
            </div>

            {/* AI Insights List */}
            <div className={isCompact ? "space-y-2" : "space-y-3"}>
              {data.insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`rounded-lg ${isCompact ? "p-2" : "p-4"} border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex items-start ${isCompact ? "gap-2" : "gap-3"}`}>
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <div
                          className={`flex items-center ${isCompact ? "gap-1" : "gap-2"} ${
                            isCompact ? "mb-0.5" : "mb-1"
                          }`}
                        >
                          <h4 className={`font-semibold ${isCompact ? "text-xs" : "text-sm"}`}>{insight.title}</h4>
                          {getPriorityBadge(insight.priority)}
                        </div>
                        <p className={`${compactScale.textSmall} text-muted-foreground ${isCompact ? "mb-1" : "mb-2"}`}>
                          {insight.description}
                        </p>
                        <div className={`flex items-center ${isCompact ? "gap-2" : "gap-4"} ${compactScale.textSmall}`}>
                          <span className="flex items-center gap-1">
                            <Target className={compactScale.iconSizeSmall} />
                            {insight.action}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className={compactScale.iconSizeSmall} />
                            {insight.timeline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Brain className={compactScale.iconSizeSmall} />
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">AI Budget Predictions vs Actual</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="budget" stroke="#6B7280" strokeWidth={2} name="Budget" />
                    <Line type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} name="AI Prediction" />
                    <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Prediction Confidence by Month</h4>
              <div className="space-y-2">
                {data.predictions.map((pred, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs font-medium w-12">{pred.month}</span>
                    <div className="flex-1 mx-3">
                      <Progress value={pred.confidence} className="h-2" />
                    </div>
                    <span className="text-xs text-muted-foreground w-12">{pred.confidence}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">AI Model Performance</h4>
              <div className="space-y-3">
                {data.modelPerformance.map((model, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-xs font-medium">{model.model}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Accuracy:</span>
                          <span className="text-xs font-medium">{model.accuracy}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Usage:</span>
                          <span className="text-xs font-medium">{model.usage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={model.accuracy} className="h-2 w-16" />
                      <Badge variant="outline" className="text-xs">
                        {model.accuracy > 90 ? "Excellent" : model.accuracy > 85 ? "Good" : "Fair"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Power BI Integration Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">AI-Powered by HBI Intelligence & Power BI</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
