"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Shield,
  Brain,
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Download,
  Plus,
  Play,
  Pause,
  Square,
  Eye,
  RotateCcw,
  Cpu,
  Activity,
  TrendingUp,
  Zap,
  FileText,
  BarChart3,
  Home,
  Calendar,
  Users,
  Target,
  Layers,
  Globe,
  Code,
  Info,
} from "lucide-react"

import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import AiPipelineStatusCard from "@/components/cards/it/AiPipelineStatusCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * AI/Analytics Pipeline Control Module
 * ------------------------------------
 * AI model management and analytics pipeline monitoring
 */

export default function AiPipelinesPage() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedModel, setSelectedModel] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  // AI Pipelines-specific AI insights
  const aiPipelinesInsights = [
    {
      id: "ai-1",
      type: "performance",
      severity: "low",
      title: "Pipeline Performance Excellence",
      text: "12 active pipelines processing 45K+ records with 94.2% accuracy across all ML models.",
      action: "Continue current monitoring and consider expanding model training datasets.",
      confidence: 96,
      relatedMetrics: ["Pipeline Accuracy", "Data Processing", "Model Performance"],
    },
    {
      id: "ai-2",
      type: "opportunity",
      severity: "medium",
      title: "Cost Prediction Model Enhancement",
      text: "TensorFlow cost prediction model could achieve 97% accuracy with additional training data.",
      action: "Implement incremental learning pipeline and increase training data collection.",
      confidence: 89,
      relatedMetrics: ["Model Accuracy", "Cost Prediction", "Training Optimization"],
    },
    {
      id: "ai-3",
      type: "alert",
      severity: "medium",
      title: "Schedule Optimization Training Required",
      text: "Ray RLlib schedule optimization model requires training completion before deployment.",
      action: "Prioritize training completion and allocate additional GPU resources.",
      confidence: 92,
      relatedMetrics: ["Model Training", "Resource Allocation", "Deployment Timeline"],
    },
    {
      id: "ai-4",
      type: "forecast",
      severity: "low",
      title: "Data Ingestion Growth Trend",
      text: "Data ingestion increasing 22% monthly, requiring storage and processing capacity planning.",
      action: "Scale cloud storage and implement data lifecycle management policies.",
      confidence: 87,
      relatedMetrics: ["Data Growth", "Storage Capacity", "Processing Load"],
    },
    {
      id: "ai-5",
      type: "risk",
      severity: "low",
      title: "API Integration Dependency",
      text: "5 external API integrations for data sourcing, potential reliability impact on pipeline health.",
      action: "Implement circuit breakers and failover mechanisms for external API calls.",
      confidence: 84,
      relatedMetrics: ["API Reliability", "Pipeline Resilience", "Data Source Health"],
    },
  ]

  // Restrict access to admin users only
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the IT Command Center.</p>
        </div>
      </div>
    )
  }

  const pipelineData = {
    totalPipelines: 12,
    activePipelines: 8,
    idlePipelines: 3,
    trainingPipelines: 1,
    totalModels: 15,
    deployedModels: 11,
    ingestionSources: 8,
    dailyInferences: 2847,
    avgAccuracy: 92.4,
    systemLoad: 67.2,
  }

  const ingestionSources = [
    {
      id: "IS-001",
      name: "Project Daily Logs",
      type: "Structured Data",
      status: "Active",
      lastSync: "2024-12-26 15:30:00",
      recordsToday: 1547,
      totalRecords: 45829,
      dataFormat: "JSON",
      frequency: "Real-time",
      health: "Good",
    },
    {
      id: "IS-002",
      name: "Survey Response Data",
      type: "Structured Data",
      status: "Active",
      lastSync: "2024-12-26 14:45:00",
      recordsToday: 243,
      totalRecords: 12847,
      dataFormat: "CSV",
      frequency: "Hourly",
      health: "Good",
    },
    {
      id: "IS-003",
      name: "Financial Transaction Logs",
      type: "Structured Data",
      status: "Active",
      lastSync: "2024-12-26 15:25:00",
      recordsToday: 892,
      totalRecords: 78432,
      dataFormat: "JSON",
      frequency: "Every 15 min",
      health: "Excellent",
    },
    {
      id: "IS-004",
      name: "Equipment Sensor Data",
      type: "Time Series",
      status: "Active",
      lastSync: "2024-12-26 15:29:00",
      recordsToday: 5674,
      totalRecords: 234567,
      dataFormat: "MQTT",
      frequency: "Real-time",
      health: "Good",
    },
    {
      id: "IS-005",
      name: "Document OCR Pipeline",
      type: "Unstructured Data",
      status: "Processing",
      lastSync: "2024-12-26 15:15:00",
      recordsToday: 127,
      totalRecords: 8934,
      dataFormat: "PDF/Images",
      frequency: "On-demand",
      health: "Fair",
    },
    {
      id: "IS-006",
      name: "Weather Data Feed",
      type: "External API",
      status: "Idle",
      lastSync: "2024-12-26 12:00:00",
      recordsToday: 48,
      totalRecords: 23847,
      dataFormat: "JSON",
      frequency: "Hourly",
      health: "Warning",
    },
  ]

  const mlModels = [
    {
      id: "ML-001",
      name: "Cost Prediction Model",
      type: "Regression",
      status: "Scoring",
      accuracy: 94.2,
      lastTrained: "2024-12-20",
      version: "v2.1.4",
      framework: "TensorFlow",
      environment: "Production",
      dailyInferences: 847,
      endpoint: "/api/ml/cost-prediction",
    },
    {
      id: "ML-002",
      name: "Risk Assessment Classifier",
      type: "Classification",
      status: "Idle",
      accuracy: 91.7,
      lastTrained: "2024-12-18",
      version: "v1.8.2",
      framework: "PyTorch",
      environment: "Production",
      dailyInferences: 523,
      endpoint: "/api/ml/risk-assessment",
    },
    {
      id: "ML-003",
      name: "Schedule Optimization",
      type: "Reinforcement Learning",
      status: "Training",
      accuracy: 89.3,
      lastTrained: "2024-12-25",
      version: "v3.0.1-beta",
      framework: "Ray RLlib",
      environment: "Staging",
      dailyInferences: 0,
      endpoint: "/api/ml/schedule-optimization",
    },
    {
      id: "ML-004",
      name: "Quality Control Vision",
      type: "Computer Vision",
      status: "Scoring",
      accuracy: 96.8,
      lastTrained: "2024-12-22",
      version: "v1.5.7",
      framework: "TensorFlow",
      environment: "Production",
      dailyInferences: 234,
      endpoint: "/api/ml/quality-control",
    },
    {
      id: "ML-005",
      name: "Safety Incident Predictor",
      type: "Classification",
      status: "Idle",
      accuracy: 88.4,
      lastTrained: "2024-12-15",
      version: "v2.2.1",
      framework: "Scikit-learn",
      environment: "Production",
      dailyInferences: 156,
      endpoint: "/api/ml/safety-prediction",
    },
  ]

  const pipelineJobs = [
    {
      id: "PJ-2024-1789",
      name: "Daily Model Retraining",
      type: "Training Pipeline",
      status: "Running",
      startTime: "2024-12-26 14:00:00",
      estimatedCompletion: "2024-12-26 16:30:00",
      progress: 67,
      model: "Cost Prediction Model",
      dataSize: "2.4GB",
      computeNodes: 4,
    },
    {
      id: "PJ-2024-1788",
      name: "Batch Inference Process",
      type: "Scoring Pipeline",
      status: "Completed",
      startTime: "2024-12-26 13:15:00",
      estimatedCompletion: "2024-12-26 13:45:00",
      progress: 100,
      model: "Risk Assessment Classifier",
      dataSize: "847MB",
      computeNodes: 2,
    },
    {
      id: "PJ-2024-1787",
      name: "Data Validation Check",
      type: "Data Pipeline",
      status: "Failed",
      startTime: "2024-12-26 12:30:00",
      estimatedCompletion: "2024-12-26 12:35:00",
      progress: 45,
      model: "N/A",
      dataSize: "156MB",
      computeNodes: 1,
    },
  ]

  const filteredSources = useMemo(() => {
    let sources = ingestionSources

    if (selectedStatus !== "all") {
      sources = sources.filter((source) => source.status.toLowerCase().includes(selectedStatus.toLowerCase()))
    }

    return sources
  }, [selectedStatus])

  const filteredModels = useMemo(() => {
    let models = mlModels

    if (selectedModel !== "all") {
      models = models.filter((model) => model.status.toLowerCase().includes(selectedModel.toLowerCase()))
    }

    return models
  }, [selectedModel])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100"
      case "scoring":
        return "text-blue-600 bg-blue-100"
      case "training":
        return "text-purple-600 bg-purple-100"
      case "idle":
        return "text-gray-600 bg-gray-100"
      case "processing":
        return "text-orange-600 bg-orange-100"
      case "completed":
        return "text-green-600 bg-green-100"
      case "running":
        return "text-blue-600 bg-blue-100"
      case "failed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case "excellent":
        return "text-green-600 bg-green-100"
      case "good":
        return "text-green-600 bg-green-100"
      case "fair":
        return "text-orange-600 bg-orange-100"
      case "warning":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "structured data":
        return Database
      case "time series":
        return TrendingUp
      case "unstructured data":
        return FileText
      case "external api":
        return Globe
      default:
        return Database
    }
  }

  const getModelIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "regression":
        return BarChart3
      case "classification":
        return Target
      case "computer vision":
        return Eye
      case "reinforcement learning":
        return Brain
      default:
        return Cpu
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/it-command-center" className="text-muted-foreground hover:text-foreground">
                    IT Command Center
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>AI Pipelines</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">AI Pipelines</h1>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {pipelineData.activePipelines} Active
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Play className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Run Pipeline</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <RefreshCw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <Settings className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <ITModuleNavigation />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Pipeline Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Pipelines</span>
                  <span className="font-medium">{pipelineData.totalPipelines}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-green-600">{pipelineData.activePipelines}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Training</span>
                  <span className="font-medium text-purple-600">{pipelineData.trainingPipelines}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Model Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Models</span>
                  <span className="font-medium">{pipelineData.totalModels}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deployed</span>
                  <span className="font-medium text-green-600">{pipelineData.deployedModels}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Accuracy</span>
                  <span className="font-medium text-blue-600">{pipelineData.avgAccuracy}%</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">System Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Inferences</span>
                  <span className="font-medium">{pipelineData.dailyInferences.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ingestion Sources</span>
                  <span className="font-medium">{pipelineData.ingestionSources}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">System Load</span>
                  <span className="font-medium text-orange-600">{pipelineData.systemLoad}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Pipeline Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Pipelines</span>
                  <span className="font-medium">{pipelineData.totalPipelines}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active</span>
                  <span className="font-medium text-green-600">{pipelineData.activePipelines}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Idle</span>
                  <span className="font-medium text-gray-600">{pipelineData.idlePipelines}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Training</span>
                  <span className="font-medium text-purple-600">{pipelineData.trainingPipelines}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Pipeline
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Model
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Metrics
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Model Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Models</span>
                  <span className="font-medium">{pipelineData.totalModels}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deployed</span>
                  <span className="font-medium text-green-600">{pipelineData.deployedModels}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Accuracy</span>
                  <span className="font-medium text-blue-600">{pipelineData.avgAccuracy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Inferences</span>
                  <span className="font-medium">{pipelineData.dailyInferences.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">System Load</span>
                  <span className="font-medium text-orange-600">{pipelineData.systemLoad}%</span>
                </div>
                <div className="bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-500 rounded-full h-2 transition-all duration-300"
                    style={{ width: `${pipelineData.systemLoad}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ingestion Sources</span>
                  <span className="font-medium text-green-600">{pipelineData.ingestionSources}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Endpoints</span>
                  <span className="font-medium">5 Active</span>
                </div>
              </div>
            </div>

            {/* HBI AI Pipelines Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI AI Pipelines Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={aiPipelinesInsights} cardId="ai-pipelines-insights" />
              </div>
            </div>
          </div>

          <div className="xl:col-span-9">
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">AI/ML Pipeline Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="ingestion">Ingestion</TabsTrigger>
                    <TabsTrigger value="models">Models</TabsTrigger>
                    <TabsTrigger value="jobs">Pipeline Jobs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <AiPipelineStatusCard />
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Active Pipelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {pipelineJobs.slice(0, 3).map((job) => (
                              <div key={job.id} className="flex items-start gap-3">
                                <div className={`p-1 rounded ${getStatusColor(job.status)}`}>
                                  <Activity className="h-3 w-3" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{job.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {job.type} • {job.dataSize}
                                  </p>
                                  <Badge variant="outline" className={getStatusColor(job.status)}>
                                    {job.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Model Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {mlModels.slice(0, 3).map((model) => (
                              <div key={model.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{model.name}</span>
                                  <span className="text-muted-foreground">{model.accuracy}%</span>
                                </div>
                                <div className="bg-muted rounded-full h-2">
                                  <div
                                    className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                                    style={{ width: `${model.accuracy}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">API Integrations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {/* Comment blocks for custom scoring API integration */}
                            {/* 
                            TODO: Integration with Custom Scoring APIs
                            
                            1. Real-time Scoring API:
                               - Endpoint: /api/ml/realtime-score
                               - Authentication: Bearer token
                               - Rate limiting: 1000 req/min
                               
                            2. Batch Processing API:
                               - Endpoint: /api/ml/batch-process
                               - Max batch size: 10,000 records
                               - Async processing with webhook callbacks
                               
                            3. Model Management API:
                               - Endpoint: /api/ml/models
                               - CRUD operations for model lifecycle
                               - Version control and rollback capabilities
                               
                            4. Pipeline Orchestration API:
                               - Endpoint: /api/ml/pipelines
                               - Start/stop/monitor pipeline execution
                               - Job scheduling and dependency management
                            */}
                            <div className="text-center py-8 text-muted-foreground">
                              <Code className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">Custom API Integrations</p>
                              <p className="text-xs">Placeholder for scoring endpoints</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="ingestion" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="idle">Idle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Data Ingestion Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Source Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Last Sync</TableHead>
                              <TableHead>Records Today</TableHead>
                              <TableHead>Health</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSources.map((source) => {
                              const TypeIcon = getTypeIcon(source.type)
                              return (
                                <TableRow key={source.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{source.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm">{source.type}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getStatusColor(source.status)}>
                                      {source.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">{source.lastSync}</TableCell>
                                  <TableCell className="text-sm">{source.recordsToday.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getHealthColor(source.health)}>
                                      {source.health}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">{source.frequency}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="models" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Models</SelectItem>
                            <SelectItem value="scoring">Scoring</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="idle">Idle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">ML Model Registry</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Model Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Accuracy</TableHead>
                              <TableHead>Version</TableHead>
                              <TableHead>Framework</TableHead>
                              <TableHead>Daily Inferences</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredModels.map((model) => {
                              const ModelIcon = getModelIcon(model.type)
                              return (
                                <TableRow key={model.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <ModelIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">{model.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm">{model.type}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getStatusColor(model.status)}>
                                      {model.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-green-600 font-medium">
                                    {model.accuracy}%
                                  </TableCell>
                                  <TableCell className="text-sm">{model.version}</TableCell>
                                  <TableCell className="text-sm">{model.framework}</TableCell>
                                  <TableCell className="text-sm">{model.dailyInferences.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm">
                                        <Play className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Pause className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="jobs" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pipeline Execution Jobs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Job Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Progress</TableHead>
                              <TableHead>Model</TableHead>
                              <TableHead>Data Size</TableHead>
                              <TableHead>Compute Nodes</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pipelineJobs.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.name}</TableCell>
                                <TableCell className="text-sm">{job.type}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(job.status)}>
                                    {job.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="bg-muted rounded-full h-2 flex-1">
                                      <div
                                        className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                                        style={{ width: `${job.progress}%` }}
                                      />
                                    </div>
                                    <span className="text-sm text-muted-foreground">{job.progress}%</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{job.model}</TableCell>
                                <TableCell className="text-sm">{job.dataSize}</TableCell>
                                <TableCell className="text-sm">{job.computeNodes}</TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Square className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
