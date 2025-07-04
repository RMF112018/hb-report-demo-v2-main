"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  Zap,
  Download,
  Filter,
  Settings,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
} from "lucide-react"

interface AdvancedAnalyticsEngineProps {
  project: any
  currentStage: string
  userRole: string
  historicalData?: any[]
}

interface AnalyticsWidget {
  id: string
  name: string
  type: "chart" | "metric" | "trend" | "forecast"
  icon: React.ComponentType<any>
  category: string
  dataSource: string
  refreshRate: number
  customizable: boolean
}

interface PredictiveModel {
  id: string
  name: string
  type: "regression" | "classification" | "time_series" | "anomaly"
  accuracy: number
  lastTrained: Date
  predictions: Array<{
    metric: string
    current: number
    predicted: number
    confidence: number
    trend: "up" | "down" | "stable"
  }>
}

interface CustomReport {
  id: string
  name: string
  type: "executive" | "operational" | "compliance" | "financial"
  frequency: "daily" | "weekly" | "monthly" | "quarterly"
  recipients: string[]
  widgets: string[]
  lastGenerated: Date
  status: "active" | "draft" | "archived"
}

export const AdvancedAnalyticsEngine = ({
  project,
  currentStage,
  userRole,
  historicalData = [],
}: AdvancedAnalyticsEngineProps) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [analyticsWidgets, setAnalyticsWidgets] = useState<AnalyticsWidget[]>([])
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([])
  const [customReports, setCustomReports] = useState<CustomReport[]>([])
  const [realTimeData, setRealTimeData] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeAnalytics()
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshAnalytics()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const initializeAnalytics = async () => {
    // Initialize analytics widgets
    const widgets: AnalyticsWidget[] = [
      {
        id: "schedule-performance",
        name: "Schedule Performance",
        type: "chart",
        icon: BarChart3,
        category: "Performance",
        dataSource: "schedule",
        refreshRate: 300,
        customizable: true,
      },
      {
        id: "cost-analysis",
        name: "Cost Analysis",
        type: "trend",
        icon: DollarSign,
        category: "Financial",
        dataSource: "budget",
        refreshRate: 600,
        customizable: true,
      },
      {
        id: "quality-metrics",
        name: "Quality Metrics",
        type: "metric",
        icon: Target,
        category: "Quality",
        dataSource: "inspections",
        refreshRate: 900,
        customizable: true,
      },
      {
        id: "resource-utilization",
        name: "Resource Utilization",
        type: "chart",
        icon: Users,
        category: "Resources",
        dataSource: "staffing",
        refreshRate: 1800,
        customizable: true,
      },
      {
        id: "risk-assessment",
        name: "Risk Assessment",
        type: "forecast",
        icon: AlertTriangle,
        category: "Risk",
        dataSource: "risk",
        refreshRate: 3600,
        customizable: true,
      },
      {
        id: "productivity-trends",
        name: "Productivity Trends",
        type: "trend",
        icon: TrendingUp,
        category: "Performance",
        dataSource: "productivity",
        refreshRate: 1200,
        customizable: true,
      },
    ]

    // Initialize predictive models
    const models: PredictiveModel[] = [
      {
        id: "schedule-predictor",
        name: "Schedule Completion Predictor",
        type: "time_series",
        accuracy: 87.3,
        lastTrained: new Date(2024, 0, 15),
        predictions: [
          { metric: "Completion Date", current: 67.8, predicted: 72.5, confidence: 89, trend: "up" },
          { metric: "Critical Path Risk", current: 23.4, predicted: 28.1, confidence: 76, trend: "up" },
        ],
      },
      {
        id: "cost-forecaster",
        name: "Cost Variance Forecaster",
        type: "regression",
        accuracy: 82.7,
        lastTrained: new Date(2024, 0, 10),
        predictions: [
          { metric: "Final Cost", current: 2.75, predicted: 2.89, confidence: 84, trend: "up" },
          { metric: "Cost Variance", current: -3.2, predicted: -5.8, confidence: 91, trend: "down" },
        ],
      },
      {
        id: "quality-classifier",
        name: "Quality Issue Classifier",
        type: "classification",
        accuracy: 94.2,
        lastTrained: new Date(2024, 0, 12),
        predictions: [
          { metric: "Quality Score", current: 94.7, predicted: 96.2, confidence: 88, trend: "up" },
          { metric: "Defect Rate", current: 2.1, predicted: 1.6, confidence: 85, trend: "down" },
        ],
      },
    ]

    // Initialize custom reports
    const reports: CustomReport[] = [
      {
        id: "executive-summary",
        name: "Executive Summary",
        type: "executive",
        frequency: "weekly",
        recipients: ["exec@company.com"],
        widgets: ["schedule-performance", "cost-analysis", "quality-metrics"],
        lastGenerated: new Date(2024, 0, 8),
        status: "active",
      },
      {
        id: "operational-dashboard",
        name: "Operational Dashboard",
        type: "operational",
        frequency: "daily",
        recipients: ["ops@company.com"],
        widgets: ["resource-utilization", "productivity-trends", "risk-assessment"],
        lastGenerated: new Date(2024, 0, 14),
        status: "active",
      },
      {
        id: "compliance-report",
        name: "Compliance Report",
        type: "compliance",
        frequency: "monthly",
        recipients: ["compliance@company.com"],
        widgets: ["quality-metrics", "risk-assessment"],
        lastGenerated: new Date(2023, 11, 15),
        status: "active",
      },
    ]

    setAnalyticsWidgets(widgets)
    setPredictiveModels(models)
    setCustomReports(reports)
    setLoading(false)
  }

  const refreshAnalytics = () => {
    // Simulate real-time data refresh
    setPredictiveModels((prev) =>
      prev.map((model) => ({
        ...model,
        predictions: model.predictions.map((pred) => ({
          ...pred,
          current: pred.current + (Math.random() - 0.5) * 2,
          predicted: pred.predicted + (Math.random() - 0.5) * 2,
        })),
      }))
    )
  }

  const generateReport = async (reportId: string) => {
    const report = customReports.find((r) => r.id === reportId)
    if (!report) return

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setCustomReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, lastGenerated: new Date() } : r)))
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case "chart":
        return <BarChart3 className="h-4 w-4" />
      case "trend":
        return <LineChart className="h-4 w-4" />
      case "metric":
        return <Target className="h-4 w-4" />
      case "forecast":
        return <Brain className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const canAccessAdvancedAnalytics = userRole === "admin" || userRole === "executive" || userRole === "project_manager"

  if (!canAccessAdvancedAnalytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Advanced analytics require elevated permissions. Contact your administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-4"></div>
            <p className="text-muted-foreground">Loading advanced analytics...</p>
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
              Advanced Analytics Engine
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="realtime" className="text-sm">
                Real-time
              </Label>
              <Switch id="realtime" checked={realTimeData} onCheckedChange={setRealTimeData} />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="autorefresh" className="text-sm">
                Auto-refresh
              </Label>
              <Switch id="autorefresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
            <TabsTrigger value="models">Predictive Models</TabsTrigger>
            <TabsTrigger value="reports">Custom Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Data Points</p>
                      <p className="text-2xl font-bold">12,847</p>
                      <p className="text-xs text-green-600">+2.3% from last week</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Model Accuracy</p>
                      <p className="text-2xl font-bold">88.1%</p>
                      <p className="text-xs text-green-600">+1.2% improvement</p>
                    </div>
                    <Brain className="h-8 w-8 text-purple-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Predictions</p>
                      <p className="text-2xl font-bold">247</p>
                      <p className="text-xs text-blue-600">Active forecasts</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alerts</p>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-xs text-orange-600">Require attention</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analytics Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsWidgets.map((widget) => (
                <Card key={widget.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {getWidgetIcon(widget.type)}
                        {widget.name}
                      </CardTitle>
                      <Badge variant="secondary">{widget.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-24 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                        {widget.type === "chart" && "📊 Chart Visualization"}
                        {widget.type === "trend" && "📈 Trend Analysis"}
                        {widget.type === "metric" && "🎯 Key Metrics"}
                        {widget.type === "forecast" && "🔮 Forecast Data"}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Refresh: {widget.refreshRate}s</span>
                        <span>{widget.customizable ? "Customizable" : "Fixed"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            {/* Model Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Model Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(predictiveModels.reduce((sum, m) => sum + m.accuracy, 0) / predictiveModels.length)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Average Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{predictiveModels.length}</p>
                    <p className="text-sm text-muted-foreground">Active Models</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {predictiveModels.reduce((sum, m) => sum + m.predictions.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Predictions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Models */}
            <div className="space-y-4">
              {predictiveModels.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{model.type}</Badge>
                        <Badge variant="secondary">{model.accuracy}% accuracy</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Last trained: {model.lastTrained.toLocaleDateString()}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {model.predictions.map((prediction, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{prediction.metric}</span>
                              {getTrendIcon(prediction.trend)}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Current:</span>
                                <span className="font-mono">{prediction.current.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Predicted:</span>
                                <span className="font-mono">{prediction.predicted.toFixed(1)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Confidence:</span>
                                <span className="font-mono">{prediction.confidence}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Report Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{report.name}</h4>
                          <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.type} • {report.frequency} • {report.recipients.length} recipients
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Widgets: {report.widgets.length}</span>
                          <span>Last generated: {report.lastGenerated.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => generateReport(report.id)}>
                          Generate
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="data-retention" className="text-sm">
                      Data Retention Period
                    </Label>
                    <Select defaultValue="1y">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                        <SelectItem value="2y">2 years</SelectItem>
                        <SelectItem value="5y">5 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="model-retrain" className="text-sm">
                      Model Retraining Frequency
                    </Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Anomaly Detection</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically detect unusual patterns in project data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Predictive Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Send notifications when predictions exceed thresholds
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
