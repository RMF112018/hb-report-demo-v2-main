"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Progress } from "../../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
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
  Legend,
} from "recharts"
import {
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Link,
  Package,
  Target,
  Activity,
  BarChart3,
  Zap,
  Play,
  Pause,
  RefreshCw,
  Share2,
  Database,
  Globe,
  Shield,
  Users,
  Briefcase,
  Award,
  Settings,
  Eye,
} from "lucide-react"

interface BetaProcurementStatsPanelProps {
  className?: string
  userRole?: string
  config?: any
}

// Enhanced Power BI-style data generation with realistic procurement metrics
const generatePowerBIProcurementData = (userRole?: string) => {
  const currentDate = new Date()

  // Role-based project filtering
  const getProjectCount = () => {
    switch (userRole) {
      case "executive":
        return 20 // All projects
      case "project-executive":
        return 6 // Limited portfolio
      case "project-manager":
        return 1 // Single project
      default:
        return 20
    }
  }

  const projectCount = getProjectCount()
  const baseMultiplier = userRole === "project-manager" ? 1 : projectCount

  // Generate comprehensive procurement statistics
  const stats = {
    totalValue: userRole === "project-manager" ? 57235491 : userRole === "project-executive" ? 285000000 : 850000000,
    totalRecords: Math.floor(28 * baseMultiplier),
    completedProcurements: Math.floor(18 * baseMultiplier),
    activeProcurements: Math.floor(6 * baseMultiplier),
    pendingApprovals: Math.floor(4 * baseMultiplier),
    linkedToBidTabs: Math.floor(22 * baseMultiplier),
    avgCycleTime: userRole === "project-manager" ? 89 : userRole === "project-executive" ? 95 : 87,
    complianceRate: userRole === "project-manager" ? 94.2 : userRole === "project-executive" ? 92.8 : 96.5,
    onTimeDelivery: userRole === "project-manager" ? 87.3 : userRole === "project-executive" ? 89.1 : 91.7,
    costSavings: userRole === "project-manager" ? 185000 : userRole === "project-executive" ? 850000 : 2850000,
    supplierPerformance: userRole === "project-manager" ? 88.5 : userRole === "project-executive" ? 91.2 : 93.8,
    riskScore: userRole === "project-manager" ? 15.8 : userRole === "project-executive" ? 12.3 : 8.9,
    qualityScore: userRole === "project-manager" ? 92.4 : userRole === "project-executive" ? 94.1 : 96.2,
  }

  // Generate time-series procurement performance data
  const performanceData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentDate.getFullYear(), i, 1).toLocaleDateString("en-US", { month: "short" })
    const baseValue = 15 + i * 1.5 + (Math.random() * 5 - 2.5)
    return {
      month,
      procurements: Math.floor(baseValue * baseMultiplier),
      value: baseValue * 3.2 * (baseMultiplier / 20) * 1000000,
      cycleTime: 85 + (Math.random() * 20 - 10),
      compliance: 90 + Math.random() * 8,
      savings: Math.floor(Math.random() * 200000 * (baseMultiplier / 20)),
      qualityScore: 88 + Math.random() * 10,
      riskLevel: Math.floor(Math.random() * 25) + 5,
    }
  })

  // Category breakdown data
  const categoryData = [
    {
      name: "MEP Systems",
      value: 35,
      amount: stats.totalValue * 0.35,
      avgCycle: 95,
      compliance: 94.2,
      color: "#0078D4",
    },
    {
      name: "Structural",
      value: 25,
      amount: stats.totalValue * 0.25,
      avgCycle: 78,
      compliance: 96.8,
      color: "#107C10",
    },
    { name: "Finishes", value: 20, amount: stats.totalValue * 0.2, avgCycle: 65, compliance: 92.1, color: "#FF8C00" },
    { name: "Site Work", value: 12, amount: stats.totalValue * 0.12, avgCycle: 89, compliance: 91.5, color: "#E74856" },
    {
      name: "Specialties",
      value: 8,
      amount: stats.totalValue * 0.08,
      avgCycle: 102,
      compliance: 88.7,
      color: "#5C2E91",
    },
  ]

  // Supplier performance data
  const supplierData = [
    {
      name: "Tier 1 Suppliers",
      count: Math.floor(12 * baseMultiplier),
      performance: 95.2,
      onTime: 92.8,
      quality: 94.5,
    },
    {
      name: "Tier 2 Suppliers",
      count: Math.floor(18 * baseMultiplier),
      performance: 89.7,
      onTime: 87.3,
      quality: 90.1,
    },
    { name: "Local Suppliers", count: Math.floor(8 * baseMultiplier), performance: 91.4, onTime: 89.6, quality: 92.3 },
    {
      name: "Emergency Suppliers",
      count: Math.floor(3 * baseMultiplier),
      performance: 78.9,
      onTime: 72.1,
      quality: 85.6,
    },
  ]

  // Risk analysis data
  const riskAnalysis = [
    { category: "Delivery Risk", score: 12, trend: "improving", impact: "Medium", mitigation: "Diversified suppliers" },
    { category: "Quality Risk", score: 8, trend: "stable", impact: "Low", mitigation: "Enhanced QC processes" },
    { category: "Cost Risk", score: 18, trend: "declining", impact: "High", mitigation: "Contract renegotiation" },
    { category: "Compliance Risk", score: 6, trend: "improving", impact: "Low", mitigation: "Regular audits" },
    { category: "Supply Chain Risk", score: 15, trend: "stable", impact: "Medium", mitigation: "Alternative sourcing" },
  ]

  // Advanced KPIs
  const advancedKPIs = {
    procurementVelocity: (stats.completedProcurements / Math.max(stats.avgCycleTime, 1)).toFixed(1),
    valueEfficiency: stats.totalValue / Math.max(stats.totalRecords, 1),
    supplierDiversity: userRole === "project-manager" ? 78.5 : userRole === "project-executive" ? 82.3 : 87.9,
    digitalAdoption: userRole === "project-manager" ? 85.2 : userRole === "project-executive" ? 88.7 : 94.3,
    sustainabilityScore: userRole === "project-manager" ? 81.6 : userRole === "project-executive" ? 84.2 : 89.1,
    innovationIndex: userRole === "project-manager" ? 76.8 : userRole === "project-executive" ? 79.4 : 85.7,
  }

  return {
    stats,
    performanceData,
    categoryData,
    supplierData,
    riskAnalysis,
    advancedKPIs,
    lastRefresh: currentDate.toISOString(),
    dataQuality: 97.8,
    systemHealth: "Excellent",
    reportingStatus: "Active",
    projectCount,
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

export default function BetaProcurementStatsPanel({ className, userRole, config }: BetaProcurementStatsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [dataStreamActive, setDataStreamActive] = useState(true)
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)

  // Generate comprehensive Power BI procurement data
  const procurementData = useMemo(() => generatePowerBIProcurementData(userRole), [userRole])

  // Simulate real-time data streaming
  useEffect(() => {
    if (realTimeEnabled && dataStreamActive) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
        // Simulate minor data fluctuations
        if (Math.random() < 0.3) {
          console.log("Power BI procurement data stream update simulated")
        }
      }, 15000) // Update every 15 seconds

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
              {entry.name.includes("Value") || entry.name.includes("Amount") ? "M" : ""}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Format currency values
  const formatCurrency = (amount: number, compact = true) => {
    if (compact) {
      if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
      if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`
      return `$${amount.toLocaleString()}`
    }
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  const getCompletionRate = () => {
    return procurementData.stats.totalRecords > 0
      ? (procurementData.stats.completedProcurements / procurementData.stats.totalRecords) * 100
      : 0
  }

  const getLinkageRate = () => {
    return procurementData.stats.totalRecords > 0
      ? (procurementData.stats.linkedToBidTabs / procurementData.stats.totalRecords) * 100
      : 0
  }

  const getRoleDisplayName = () => {
    switch (userRole) {
      case "executive":
        return "Executive Portfolio View"
      case "project-executive":
        return "Project Executive Portfolio"
      case "project-manager":
        return "Project Manager View"
      default:
        return "Procurement Dashboard"
    }
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-800/50 shadow-lg`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-md">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                Procurement Metrics
              </CardTitle>
              <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {getRoleDisplayName()} • {procurementData.projectCount} Project
                {procurementData.projectCount !== 1 ? "s" : ""}
              </div>
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
              <span>Data Quality: {procurementData.dataQuality}%</span>
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
            <span>System Health: {procurementData.systemHealth}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="text-xs font-medium">
              <Activity className="h-3 w-3 mr-1" />
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
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(procurementData.stats.totalValue)}
                    </p>
                  </div>
                  <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+8.5% QoQ</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Records</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {procurementData.stats.totalRecords}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+12% vs target</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Avg Cycle Time</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      {procurementData.stats.avgCycleTime}d
                    </p>
                  </div>
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">-5.2d improved</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Compliance Rate</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {formatPercent(procurementData.stats.complianceRate)}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+2.3% improved</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-teal-200 dark:border-teal-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Cost Savings</p>
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                      {formatCurrency(procurementData.stats.costSavings)}
                    </p>
                  </div>
                  <Target className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">+15.7% YTD</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Risk Score</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">
                      {procurementData.stats.riskScore.toFixed(1)}
                    </p>
                  </div>
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">-2.8 (improving)</span>
                </div>
              </div>
            </div>

            {/* Advanced KPIs (shown when toggle is on) */}
            {showAdvancedMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">On-Time Delivery</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {formatPercent(procurementData.stats.onTimeDelivery)}
                      </p>
                    </div>
                    <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Supplier Performance</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {formatPercent(procurementData.stats.supplierPerformance)}
                      </p>
                    </div>
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Quality Score</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {formatPercent(procurementData.stats.qualityScore)}
                      </p>
                    </div>
                    <Award className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Digital Adoption</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {formatPercent(procurementData.advancedKPIs.digitalAdoption)}
                      </p>
                    </div>
                    <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Sustainability</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {formatPercent(procurementData.advancedKPIs.sustainabilityScore)}
                      </p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Innovation Index</p>
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {formatPercent(procurementData.advancedKPIs.innovationIndex)}
                      </p>
                    </div>
                    <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Procurement Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Procurement Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="text-sm font-medium">{procurementData.stats.completedProcurements}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Active</span>
                    </div>
                    <div className="text-sm font-medium">{procurementData.stats.activeProcurements}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm">Pending Approval</span>
                    </div>
                    <div className="text-sm font-medium">{procurementData.stats.pendingApprovals}</div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Completion Rate</span>
                      <span>{formatPercent(getCompletionRate())}</span>
                    </div>
                    <Progress value={getCompletionRate()} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Bid Tab Integration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Linked to Bid Tabs</span>
                    </div>
                    <div className="text-sm font-medium">{procurementData.stats.linkedToBidTabs}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Not Linked</span>
                    </div>
                    <div className="text-sm font-medium">
                      {procurementData.stats.totalRecords - procurementData.stats.linkedToBidTabs}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Linkage Rate</span>
                      <span>{formatPercent(getLinkageRate())}</span>
                    </div>
                    <Progress value={getLinkageRate()} className="h-2" />
                  </div>

                  <div className="pt-2">
                    <Badge variant={getLinkageRate() >= 80 ? "default" : "secondary"} className="text-xs">
                      {getLinkageRate() >= 80 ? "Good Integration" : "Needs Attention"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
                  Procurement Volume & Value
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={procurementData.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="procurements" fill={POWER_BI_COLORS.primary} name="Procurements" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={POWER_BI_COLORS.secondary}
                        strokeWidth={2}
                        name="Value ($M)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Category Breakdown</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={procurementData.categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : "0"}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {procurementData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Performance Indicators</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Compliance Rate</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatPercent(procurementData.stats.complianceRate)}
                    </span>
                  </div>
                  <Progress value={procurementData.stats.complianceRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">On-Time Delivery</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatPercent(procurementData.stats.onTimeDelivery)}
                    </span>
                  </div>
                  <Progress value={procurementData.stats.onTimeDelivery} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Supplier Performance</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatPercent(procurementData.stats.supplierPerformance)}
                    </span>
                  </div>
                  <Progress value={procurementData.stats.supplierPerformance} className="h-2" />
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
                  {procurementData.riskAnalysis.map((risk, index) => (
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
                          {risk.impact} impact • {risk.mitigation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Supplier Performance</h4>
                <div className="space-y-3">
                  {procurementData.supplierData.map((supplier, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{supplier.name}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{supplier.count}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                          Performance: {supplier.performance.toFixed(1)}% • On-Time: {supplier.onTime.toFixed(1)}% •
                          Quality: {supplier.quality.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
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
                  AI-Powered Procurement Insights
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
                      Cost Optimization Opportunity
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Consolidating MEP suppliers could reduce procurement cycle time by 18% and generate additional cost
                    savings of {formatCurrency(procurementData.stats.costSavings * 0.15)}.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Supply Chain Alert</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Specialty finishes category shows 85% probability of delivery delays based on current market
                    conditions. Recommend early procurement initiation.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Performance Prediction</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Q4 procurement performance forecasted to exceed targets by 12.5% based on current velocity and
                    supplier capacity analysis.
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
                    Role-based data filtering ensures users only see relevant procurement data.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Real-Time Sync</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      15 min
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                    Automatic synchronization with ERP and procurement systems.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Premium Capacity</span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    >
                      P1
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6">
                    Dedicated capacity for high-performance analytics and reporting.
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
                    Monitor dashboard usage, performance, and procurement insights engagement.
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
