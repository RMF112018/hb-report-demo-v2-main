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
  isCompact?: boolean
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

export default function BetaProcurementStatsPanel({
  className,
  userRole,
  config,
  isCompact,
}: BetaProcurementStatsPanelProps) {
  // Scale classes based on isCompact prop for 50% size reduction
  const compactScale = {
    iconSize: isCompact ? "h-3 w-3" : "h-5 w-5",
    iconSizeSmall: isCompact ? "h-2 w-2" : "h-3 w-3",
    textTitle: isCompact ? "text-sm" : "text-lg",
    textSmall: isCompact ? "text-[10px]" : "text-xs",
    textMedium: isCompact ? "text-xs" : "text-sm",
    padding: isCompact ? "p-1" : "p-2",
    paddingCard: isCompact ? "pb-1" : "pb-2",
    gap: isCompact ? "gap-1" : "gap-2",
    marginTop: isCompact ? "mt-0.5" : "mt-1",
    chartHeight: isCompact ? "h-32" : "h-48",
  }

  const [activeTab, setActiveTab] = useState("overview")
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [dataStreamActive, setDataStreamActive] = useState(true)
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false)

  // Generate comprehensive Power BI procurement data
  const procurementData = useMemo(() => generatePowerBIProcurementData(userRole), [userRole])
  const { stats } = procurementData

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
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Procurement Metrics</CardTitle>
              <p className="text-sm text-muted-foreground">Executive Portfolio View • 20 Projects</p>
            </div>
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

      <CardContent className="p-3">
        {/* Row 1: Procurement Metrics */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Total Value & Cycle Time - 5 columns */}
          <div className="col-span-5 bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Value & Time</span>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.totalValue, true)}</p>
                <p className="text-xs text-green-600">+8.5% QoQ</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Cycle Time</p>
                <p className="text-lg font-bold text-green-600">{stats.avgCycleTime}d</p>
                <p className="text-xs text-red-600">-5.2d</p>
              </div>
            </div>
            {/* Bar chart for value trends */}
            <div className="mt-2 flex items-end gap-1 h-8">
              <div className="bg-blue-300 rounded-sm flex-1" style={{ height: "60%" }}></div>
              <div className="bg-blue-400 rounded-sm flex-1" style={{ height: "75%" }}></div>
              <div className="bg-blue-500 rounded-sm flex-1" style={{ height: "85%" }}></div>
              <div className="bg-blue-600 rounded-sm flex-1" style={{ height: "70%" }}></div>
              <div className="bg-blue-700 rounded-sm flex-1" style={{ height: "90%" }}></div>
            </div>
          </div>

          {/* Compliance & Savings - 7 columns */}
          <div className="col-span-7 bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Compliance</p>
                <p className="text-lg font-bold text-purple-600">{stats.complianceRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.complianceRate}%` }} />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Savings</p>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(stats.costSavings, true)}</p>
                <p className="text-xs text-green-600">+15.7%</p>
              </div>
            </div>
            {/* Donut chart for compliance */}
            <div className="mt-2 flex items-center justify-center">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray={`${stats.complianceRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{stats.complianceRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Risk Assessment */}
        <div className="grid grid-cols-12 gap-3">
          {/* Risk Score - 12 columns */}
          <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Risk Assessment</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold text-red-600">{stats.riskScore}/10</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${(stats.riskScore / 10) * 100}%` }} />
                </div>
                <p className="text-xs text-red-600 mt-1">-2.8 from last month</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Risk Level</p>
                <p className="text-lg font-bold text-orange-600">Medium</p>
                <p className="text-xs text-muted-foreground">Based on 5 factors</p>
              </div>
              <div className="text-center">
                {/* Radar chart visualization */}
                <div className="flex items-center justify-center">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12" viewBox="0 0 32 32">
                      <polygon
                        points="16,2 20,8 26,10 22,16 26,22 20,24 16,30 12,24 6,22 10,16 6,10 12,8"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1"
                        opacity="0.3"
                      />
                      <polygon
                        points="16,4 18,8 22,9 20,12 22,15 18,16 16,20 14,16 10,15 12,12 10,9 14,8"
                        fill="#ef4444"
                        opacity="0.7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
