"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Progress } from "../../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Switch } from "../../ui/switch"
import { Label } from "../../ui/label"
import { Separator } from "../../ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  ComposedChart,
  Scatter,
  ScatterChart,
  Legend,
} from "recharts"
import {
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Users,
  MapPin,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  BarChart3,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Shield,
  Database,
  Globe,
  Lock,
  Eye,
  Settings,
  Play,
  Pause,
  Download,
  Share2,
  MonitorPlay,
  Info,
} from "lucide-react"

interface BetaPortfolioOverviewProps {
  className?: string
  isCompact?: boolean
  userRole?: string
  config?: any
}

// Enhanced Power BI-style data generation with realistic enterprise metrics
const generatePowerBIPortfolioData = () => {
  const currentDate = new Date()

  // Generate realistic project data
  const projects = [
    {
      id: "PRJ001",
      name: "Miami Medical Center Phase 3",
      progress: 78,
      budget: 45.2,
      actual: 43.8,
      status: "On Track",
      phase: "Construction",
      risk: "Low",
      margin: 12.5,
      clientSatisfaction: 4.8,
      completionDate: "2024-09-15",
      workforce: 125,
      region: "Southeast FL",
    },
    {
      id: "PRJ002",
      name: "Tech Campus Innovation Hub",
      progress: 45,
      budget: 67.3,
      actual: 69.1,
      status: "At Risk",
      phase: "Pre-Construction",
      risk: "Medium",
      margin: 10.2,
      clientSatisfaction: 4.2,
      completionDate: "2024-12-20",
      workforce: 89,
      region: "Central FL",
    },
    {
      id: "PRJ003",
      name: "Marina Bay Luxury Resort",
      progress: 92,
      budget: 89.7,
      actual: 87.3,
      status: "Ahead",
      phase: "Closeout",
      risk: "Low",
      margin: 15.8,
      clientSatisfaction: 4.9,
      completionDate: "2024-07-30",
      workforce: 67,
      region: "Southwest FL",
    },
    {
      id: "PRJ004",
      name: "Downtown Financial District",
      progress: 31,
      budget: 156.8,
      actual: 148.2,
      status: "On Track",
      phase: "Construction",
      risk: "Low",
      margin: 13.7,
      clientSatisfaction: 4.6,
      completionDate: "2025-03-15",
      workforce: 234,
      region: "Central FL",
    },
    {
      id: "PRJ005",
      name: "Aerospace Manufacturing Complex",
      progress: 67,
      budget: 78.9,
      actual: 82.1,
      status: "Behind",
      phase: "Construction",
      risk: "High",
      margin: 8.9,
      clientSatisfaction: 4.1,
      completionDate: "2024-11-10",
      workforce: 178,
      region: "Space Coast",
    },
  ]

  // Generate time-series performance data
  const performanceData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentDate.getFullYear(), i, 1).toLocaleDateString("en-US", { month: "short" })
    const baseValue = 45 + i * 2.5 + (Math.random() * 10 - 5)
    return {
      month,
      budget: baseValue + (Math.random() * 8 - 4),
      actual: baseValue + (Math.random() * 12 - 6),
      forecast: baseValue + (Math.random() * 6 - 3),
      completions: Math.floor(Math.random() * 8) + 1,
      newProjects: Math.floor(Math.random() * 5) + 1,
      revenue: baseValue * 1.2 + (Math.random() * 15 - 7.5),
      margin: 10 + (Math.random() * 6 - 3),
      riskScore: Math.floor(Math.random() * 30) + 10,
    }
  })

  // Regional performance breakdown
  const regionalData = [
    { name: "Central FL", projects: 12, value: 178.3, margin: 13.2, utilization: 89, color: "#0078D4" },
    { name: "Southeast FL", projects: 8, value: 145.7, margin: 14.8, utilization: 92, color: "#107C10" },
    { name: "Southwest FL", projects: 6, value: 112.4, margin: 12.1, utilization: 87, color: "#FF8C00" },
    { name: "North FL", projects: 4, value: 89.2, margin: 11.5, utilization: 83, color: "#E74856" },
    { name: "Space Coast", projects: 3, value: 67.8, margin: 9.8, utilization: 78, color: "#5C2E91" },
  ]

  // Financial metrics with Power BI-style KPIs
  const kpis = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.phase === "Construction").length,
    totalValue: projects.reduce((sum, p) => sum + p.budget, 0),
    actualSpend: projects.reduce((sum, p) => sum + p.actual, 0),
    avgMargin: projects.reduce((sum, p) => sum + p.margin, 0) / projects.length,
    onTimeDelivery: 87.3,
    clientSatisfaction: projects.reduce((sum, p) => sum + p.clientSatisfaction, 0) / projects.length,
    utilizationRate: 84.7,
    riskScore: 23.5,
    totalWorkforce: projects.reduce((sum, p) => sum + p.workforce, 0),
    completionRate: 68.9,
    profitMargin: 13.2,
    cashFlowPositive: 94.1,
    changeOrderRate: 12.8,
    safetyScore: 96.2,
    qualityScore: 91.7,
    scheduleAdherence: 89.4,
    budgetAdherence: 92.1,
    customerRetention: 96.8,
    projectVelocity: 125.6,
  }

  // Advanced analytics data
  const riskAnalysis = [
    { category: "Schedule", score: 15, trend: "improving", projects: 2 },
    { category: "Budget", score: 22, trend: "stable", projects: 3 },
    { category: "Quality", score: 8, trend: "improving", projects: 1 },
    { category: "Safety", score: 5, trend: "stable", projects: 0 },
    { category: "Resource", score: 18, trend: "declining", projects: 4 },
  ]

  return {
    projects,
    performanceData,
    regionalData,
    kpis,
    riskAnalysis,
    lastRefresh: currentDate.toISOString(),
    dataQuality: 98.7,
    systemHealth: "Excellent",
    reportingStatus: "Active",
    complianceScore: 94.2,
  }
}

// Power BI color palette
const POWER_BI_COLORS = {
  primary: "#0078D4",
  secondary: "#107C10",
  accent: "#FF8C00",
  warning: "#FFB900",
  error: "#E74856",
  info: "#00BCF2",
  success: "#107C10",
  neutral: "#605E5C",
  purple: "#5C2E91",
  teal: "#00B7C3",
}

const CHART_COLORS = [
  POWER_BI_COLORS.primary,
  POWER_BI_COLORS.secondary,
  POWER_BI_COLORS.accent,
  POWER_BI_COLORS.warning,
  POWER_BI_COLORS.purple,
  POWER_BI_COLORS.teal,
]

export default function BetaPortfolioOverview({ className, isCompact, userRole, config }: BetaPortfolioOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [dataStreamActive, setDataStreamActive] = useState(true)
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  // Generate comprehensive Power BI data
  const portfolioData = useMemo(() => generatePowerBIPortfolioData(), [])

  // Simulate real-time data streaming
  useEffect(() => {
    if (realTimeEnabled && dataStreamActive) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
        // Simulate minor data fluctuations
        if (Math.random() < 0.3) {
          // Update would trigger data refresh in real Power BI
          console.log("Power BI data stream update simulated")
        }
      }, 15000) // Update every 15 seconds for realistic feel

      return () => clearInterval(interval)
    }
  }, [realTimeEnabled, dataStreamActive])

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate Power BI report refresh
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const handleDataStreamToggle = () => {
    setDataStreamActive(!dataStreamActive)
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(1) : entry.value}
              {entry.name.includes("$") || entry.name.includes("Value") ? "M" : ""}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Calculate dynamic metrics based on data
  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "text-green-600 dark:text-green-400"
      case "Ahead":
        return "text-blue-600 dark:text-blue-400"
      case "At Risk":
        return "text-yellow-600 dark:text-yellow-400"
      case "Behind":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 shadow-lg`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Portfolio Executive Dashboard
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
              className="h-8 px-3"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Advanced
            </Button>
            <Button variant="outline" size="sm" onClick={handleDataStreamToggle} className="h-8 px-3">
              {dataStreamActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-10 w-10 p-0">
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" className="h-10 w-10 p-0">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Power BI Status Bar */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Data Quality: {portfolioData.dataQuality}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>Last Refresh: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>Workspace: Production</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">●</span>
            <span>System Health: {portfolioData.systemHealth}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="text-xs font-medium">
              <Building2 className="h-3 w-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs font-medium">
              <BarChart3 className="h-3 w-3 mr-1" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs font-medium">
              <Zap className="h-3 w-3 mr-1" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Executive KPI Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Projects</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {portfolioData.kpis.totalProjects}
                    </p>
                  </div>
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+15% YoY</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Portfolio Value</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${portfolioData.kpis.totalValue.toFixed(1)}M
                    </p>
                  </div>
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+12.3% QoQ</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Margin</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {portfolioData.kpis.avgMargin.toFixed(1)}%
                    </p>
                  </div>
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+2.1% vs target</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">On-Time Delivery</p>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {portfolioData.kpis.onTimeDelivery.toFixed(1)}%
                    </p>
                  </div>
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">Above target</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-teal-200 dark:border-teal-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Client Satisfaction</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {portfolioData.kpis.clientSatisfaction.toFixed(1)}/5
                    </p>
                  </div>
                  <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+0.3 vs last Q</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Risk Score</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {portfolioData.kpis.riskScore.toFixed(1)}
                    </p>
                  </div>
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">-3.2 (improving)</span>
                </div>
              </div>
            </div>

            {/* Advanced KPIs (shown when toggle is on) */}
            {showAdvancedMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Workforce</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {portfolioData.kpis.totalWorkforce}
                      </p>
                    </div>
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total active</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Utilization</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {portfolioData.kpis.utilizationRate.toFixed(1)}%
                      </p>
                    </div>
                    <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Resource efficiency</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Safety Score</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {portfolioData.kpis.safetyScore.toFixed(1)}
                      </p>
                    </div>
                    <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Safety rating</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quality Score</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {portfolioData.kpis.qualityScore.toFixed(1)}
                      </p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Quality rating</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Change Orders</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {portfolioData.kpis.changeOrderRate.toFixed(1)}%
                      </p>
                    </div>
                    <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Change order rate</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Velocity</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {portfolioData.kpis.projectVelocity.toFixed(1)}
                      </p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Project velocity</div>
                </div>
              </div>
            )}

            {/* Active Projects Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Active Projects</h4>
                <Badge variant="outline" className="text-xs">
                  {portfolioData.projects.length} projects
                </Badge>
              </div>
              <div className="space-y-3">
                {portfolioData.projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">{project.name}</h5>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getRiskColor(project.risk)}`}>
                            {project.risk} Risk
                          </Badge>
                          <span className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>{project.phase}</span>
                          <span>${project.budget.toFixed(1)}M budget</span>
                          <span>{project.workforce} workforce</span>
                          <span>{project.region}</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{project.progress}% complete</div>
                      </div>
                      <div className="mt-2">
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Portfolio Performance Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
                  Budget vs Actual Performance
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={portfolioData.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="budget" fill={POWER_BI_COLORS.primary} name="Budget ($M)" />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke={POWER_BI_COLORS.secondary}
                        strokeWidth={2}
                        name="Actual ($M)"
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke={POWER_BI_COLORS.accent}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Forecast ($M)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Regional Performance</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioData.regionalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill={POWER_BI_COLORS.primary} name="Value ($M)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Performance Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Schedule Adherence</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {portfolioData.kpis.scheduleAdherence.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={portfolioData.kpis.scheduleAdherence} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Budget Adherence</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {portfolioData.kpis.budgetAdherence.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={portfolioData.kpis.budgetAdherence} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Customer Retention</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {portfolioData.kpis.customerRetention.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={portfolioData.kpis.customerRetention} className="h-2" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Risk Analysis</h4>
                <div className="space-y-3">
                  {portfolioData.riskAnalysis.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{risk.category}</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                risk.trend === "improving"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : risk.trend === "declining"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {risk.trend}
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{risk.score}</span>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          {risk.projects} projects affected
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Margin Analysis</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="margin"
                        stroke={POWER_BI_COLORS.success}
                        fill={POWER_BI_COLORS.success}
                        fillOpacity={0.3}
                        name="Margin %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {/* AI-Powered Insights */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-100">
                  AI-Powered Portfolio Insights
                </h4>
                <Badge
                  variant="outline"
                  className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  Machine Learning
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      Opportunity Identified
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Resource reallocation between Central FL and Southwest FL projects could improve overall portfolio
                    efficiency by 12% and reduce costs by $2.3M.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Risk Alert</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Aerospace Manufacturing Complex shows 78% probability of schedule delay based on current progress
                    patterns. Recommend immediate resource intervention.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Forecast Prediction</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Q3 portfolio performance is forecasted to exceed targets by 8.5% based on current trajectory and
                    seasonal patterns.
                  </p>
                </div>
              </div>
            </div>

            {/* Power BI Embedded Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
                Power BI Enterprise Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Row-Level Security</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                    Users can only view data for their assigned projects and regions.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Data Refresh</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      15 min
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                    Automatic data refresh every 15 minutes during business hours.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Premium Capacity</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    >
                      P1
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                    Dedicated capacity for enterprise-grade performance and reliability.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Usage Analytics</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    >
                      Tracking
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                    Monitor report usage, performance, and user engagement metrics.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
