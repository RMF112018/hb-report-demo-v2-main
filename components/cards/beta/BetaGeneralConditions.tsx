"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Wrench,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Shield,
  Activity,
  DollarSign,
  Settings,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Import projects data
import projectsData from "@/data/mock/projects.json"

interface BetaGeneralConditionsProps {
  className?: string
  config?: any
}

export default function BetaGeneralConditions({ className, config }: BetaGeneralConditionsProps) {
  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 40000) // Update every 40 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Calculate risk score based on project characteristics
  const calculateRiskScore = (project: any) => {
    let score = 0

    // Contract value risk (larger = higher risk)
    if (project.contract_value > 100000000) score += 30
    else if (project.contract_value > 50000000) score += 20
    else if (project.contract_value > 10000000) score += 10

    // Project type risk
    if (project.project_type_name === "Commercial") score += 20
    else if (project.project_type_name === "Mixed-Use") score += 15
    else if (project.project_type_name === "Residential") score += 10

    // Duration risk
    if (project.duration > 800) score += 25
    else if (project.duration > 600) score += 15
    else if (project.duration > 400) score += 10

    // Contingency usage risk
    const contingencyUsageRate = project.contingency_approved / project.contingency_original
    if (contingencyUsageRate > 0.8) score += 15
    else if (contingencyUsageRate > 0.5) score += 10
    else if (contingencyUsageRate > 0.3) score += 5

    return Math.min(score, 100) // Cap at 100
  }

  // Get risk level based on score
  const getRiskLevel = (score: number) => {
    if (score >= 70) return "High"
    if (score >= 40) return "Medium"
    return "Low"
  }

  // Filter construction projects
  const constructionProjects = projectsData.filter((project) => project.project_stage_name === "Construction")

  // Calculate general conditions metrics from construction projects
  const gcMetrics = React.useMemo(() => {
    const totalOriginalValue = constructionProjects.reduce((sum, p) => sum + p.contract_value, 0)

    // Calculate GC estimates (typically 6-12% of contract value)
    const originalGCEstimate = totalOriginalValue * 0.08 // 8% average
    const currentGCEstimate = totalOriginalValue * 0.06 // 6% current (savings)
    const gcVariance = originalGCEstimate - currentGCEstimate

    // Calculate risk factors
    const totalContingency = constructionProjects.reduce((sum, p) => sum + p.contingency_original, 0)
    const usedContingency = constructionProjects.reduce((sum, p) => sum + p.contingency_approved, 0)
    const remainingContingency = totalContingency - usedContingency

    // Risk assessment based on project types and values
    const riskAssessment = constructionProjects.map((project) => {
      const riskScore = calculateRiskScore(project)
      return {
        ...project,
        riskScore,
        riskLevel: getRiskLevel(riskScore),
      }
    })

    return {
      originalGCEstimate,
      currentGCEstimate,
      gcVariance,
      totalContingency,
      usedContingency,
      remainingContingency,
      riskAssessment,
      averageRiskScore: riskAssessment.reduce((sum, p) => sum + p.riskScore, 0) / riskAssessment.length,
      projectCount: constructionProjects.length,
    }
  }, [constructionProjects])

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Key GC metrics cards
  const keyMetrics = [
    {
      title: "Original GC Estimate",
      value: formatCurrency(gcMetrics.originalGCEstimate),
      change: "0.0%",
      trend: "neutral",
      icon: Settings,
      color: "text-blue-600",
    },
    {
      title: "Current GC Estimate",
      value: formatCurrency(gcMetrics.currentGCEstimate),
      change: `-${(
        ((gcMetrics.originalGCEstimate - gcMetrics.currentGCEstimate) / gcMetrics.originalGCEstimate) *
        100
      ).toFixed(1)}%`,
      trend: "down",
      icon: TrendingDown,
      color: "text-green-600",
    },
    {
      title: "GC Variance (Savings)",
      value: formatCurrency(gcMetrics.gcVariance),
      change: "Positive",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Average Risk Score",
      value: gcMetrics.averageRiskScore.toFixed(1),
      change: getRiskLevel(gcMetrics.averageRiskScore),
      trend: gcMetrics.averageRiskScore > 50 ? "up" : "neutral",
      icon: Shield,
      color: "text-orange-600",
    },
  ]

  // GC cost breakdown
  const gcBreakdown = [
    { name: "Site Management", value: gcMetrics.currentGCEstimate * 0.35, color: "#3B82F6" },
    { name: "Utilities & Temp", value: gcMetrics.currentGCEstimate * 0.25, color: "#10B981" },
    { name: "Insurance", value: gcMetrics.currentGCEstimate * 0.15, color: "#F59E0B" },
    { name: "Safety & Security", value: gcMetrics.currentGCEstimate * 0.15, color: "#EF4444" },
    { name: "Other", value: gcMetrics.currentGCEstimate * 0.1, color: "#8B5CF6" },
  ]

  // Risk distribution
  const riskDistribution = gcMetrics.riskAssessment.reduce((acc, project) => {
    acc[project.riskLevel] = (acc[project.riskLevel] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const riskData = Object.entries(riskDistribution).map(([level, count]) => ({
    name: level,
    value: count,
    color: level === "High" ? "#EF4444" : level === "Medium" ? "#F59E0B" : "#10B981",
  }))

  // Monthly GC trend (mock data)
  const gcTrend = Array.from({ length: 8 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][i],
    original: gcMetrics.originalGCEstimate / 8,
    current: gcMetrics.currentGCEstimate / 8,
    variance: gcMetrics.gcVariance / 8,
  }))

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-cyan-950 border-cyan-200 dark:border-cyan-800 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#0021A5] dark:text-[#4A7FD6]">
              General Conditions & Risk
            </CardTitle>
            <p className="text-sm text-[#0021A5]/70 dark:text-[#4A7FD6]/80">
              {constructionProjects.length} Construction Projects • {formatCurrency(gcMetrics.gcVariance)} Savings
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
              >
                <Wrench className="h-3 w-3 mr-1" />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Live Updates
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label htmlFor="real-time" className="text-sm text-[#0021A5]/70 dark:text-[#4A7FD6]/80">
                Real-time
              </Label>
            </div>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {keyMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          metric.trend === "up"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : metric.trend === "down"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{metric.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Summary Statistics */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GC Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Contingency</span>
                  <span className="font-medium">{formatCurrency(gcMetrics.totalContingency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Used Contingency</span>
                  <span className="font-medium text-orange-600">{formatCurrency(gcMetrics.usedContingency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                  <span className="font-medium text-green-600">{formatCurrency(gcMetrics.remainingContingency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GC Efficiency</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {((gcMetrics.gcVariance / gcMetrics.originalGCEstimate) * 100).toFixed(1)}% Savings
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            {/* GC Cost Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">GC Cost Breakdown</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gcBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatCurrency(value as number)}`}
                    >
                      {gcBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* GC Trend Chart */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">GC Cost Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gcTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Line type="monotone" dataKey="original" stroke="#3B82F6" strokeWidth={2} name="Original GC" />
                    <Line type="monotone" dataKey="current" stroke="#10B981" strokeWidth={2} name="Current GC" />
                    <Line type="monotone" dataKey="variance" stroke="#F59E0B" strokeWidth={2} name="Variance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            {/* Risk Distribution */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Risk Distribution</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value} projects`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Assessment Details */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Risk Assessment</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {gcMetrics.riskAssessment.map((project, index) => (
                  <div
                    key={project.project_id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.project_type_name} • {formatCurrency(project.contract_value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          project.riskLevel === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : project.riskLevel === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {project.riskLevel} ({project.riskScore.toFixed(0)})
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Mitigation Status */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Mitigation Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Insurance Coverage</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Contingency Utilization</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Shield className="h-3 w-3 mr-1" />
                    {((gcMetrics.usedContingency / gcMetrics.totalContingency) * 100).toFixed(1)}% Used
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Risk Level</span>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {getRiskLevel(gcMetrics.averageRiskScore)}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-cyan-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-cyan-600 dark:text-cyan-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
