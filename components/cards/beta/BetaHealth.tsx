"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Shield,
  Timer,
  Bell,
  Zap,
  Sparkles,
  AlertCircle,
  Info,
  XCircle,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface BetaHealthProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaHealth({ className, config, isCompact = false, userRole }: BetaHealthProps) {
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
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Mock portfolio health data
  const healthData = React.useMemo(() => {
    const projects = [
      {
        id: 1,
        name: "Miami Commercial Tower",
        healthScore: 85,
        status: "healthy",
        risks: ["Material Delay", "Weather"],
        kpis: {
          budget: 92,
          schedule: 88,
          quality: 85,
          safety: 90,
          stakeholder: 82,
        },
      },
      {
        id: 2,
        name: "Coral Gables Luxury Condominium",
        healthScore: 65,
        status: "at-risk",
        risks: ["Schedule Delay", "Cost Overrun", "Permit Issues"],
        kpis: {
          budget: 70,
          schedule: 60,
          quality: 75,
          safety: 85,
          stakeholder: 65,
        },
      },
      {
        id: 3,
        name: "Naples Waterfront Condominium",
        healthScore: 78,
        status: "healthy",
        risks: ["Design Changes"],
        kpis: {
          budget: 85,
          schedule: 80,
          quality: 78,
          safety: 82,
          stakeholder: 75,
        },
      },
      {
        id: 4,
        name: "Tropical World",
        healthScore: 95,
        status: "excellent",
        risks: [],
        kpis: {
          budget: 98,
          schedule: 95,
          quality: 92,
          safety: 96,
          stakeholder: 94,
        },
      },
      {
        id: 5,
        name: "Grandview Heights",
        healthScore: 45,
        status: "critical",
        risks: ["Major Delays", "Budget Overrun", "Quality Issues", "Safety Concerns"],
        kpis: {
          budget: 40,
          schedule: 35,
          quality: 50,
          safety: 60,
          stakeholder: 40,
        },
      },
    ]

    // Calculate portfolio metrics
    const portfolioHealth = projects.reduce((sum, p) => sum + p.healthScore, 0) / projects.length
    const healthyProjects = projects.filter((p) => p.status === "healthy" || p.status === "excellent").length
    const atRiskProjects = projects.filter((p) => p.status === "at-risk").length
    const criticalProjects = projects.filter((p) => p.status === "critical").length
    const totalRisks = projects.reduce((sum, p) => sum + p.risks.length, 0)

    // Health trend over time (last 12 weeks)
    const healthTrend = Array.from({ length: 12 }, (_, i) => ({
      week: `W${i + 1}`,
      portfolioHealth: Math.floor(Math.random() * 15) + 65 + i * 2,
      budgetPerformance: Math.floor(Math.random() * 20) + 70,
      schedulePerformance: Math.floor(Math.random() * 25) + 60,
      qualityScore: Math.floor(Math.random() * 15) + 75,
      safetyScore: Math.floor(Math.random() * 10) + 80,
    }))

    // KPI averages across portfolio
    const avgKPIs = projects.reduce(
      (acc, project) => {
        acc.budget += project.kpis.budget
        acc.schedule += project.kpis.schedule
        acc.quality += project.kpis.quality
        acc.safety += project.kpis.safety
        acc.stakeholder += project.kpis.stakeholder
        return acc
      },
      { budget: 0, schedule: 0, quality: 0, safety: 0, stakeholder: 0 }
    )

    Object.keys(avgKPIs).forEach((key) => {
      ;(avgKPIs as any)[key] = (avgKPIs as any)[key] / projects.length
    })

    // Radar chart data
    const radarData = [
      { subject: "Budget", A: avgKPIs.budget, fullMark: 100 },
      { subject: "Schedule", A: avgKPIs.schedule, fullMark: 100 },
      { subject: "Quality", A: avgKPIs.quality, fullMark: 100 },
      { subject: "Safety", A: avgKPIs.safety, fullMark: 100 },
      { subject: "Stakeholder", A: avgKPIs.stakeholder, fullMark: 100 },
    ]

    // Health distribution
    const healthDistribution = [
      { name: "Excellent", value: projects.filter((p) => p.status === "excellent").length, fill: "#10B981" },
      { name: "Healthy", value: projects.filter((p) => p.status === "healthy").length, fill: "#3B82F6" },
      { name: "At Risk", value: atRiskProjects, fill: "#F59E0B" },
      { name: "Critical", value: criticalProjects, fill: "#EF4444" },
    ]

    return {
      projects,
      portfolioHealth,
      healthyProjects,
      atRiskProjects,
      criticalProjects,
      totalRisks,
      healthTrend,
      avgKPIs,
      radarData,
      healthDistribution,
    }
  }, [])

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getHealthIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-3 w-3" />
    if (score >= 75) return <Info className="h-3 w-3" />
    if (score >= 60) return <AlertCircle className="h-3 w-3" />
    return <XCircle className="h-3 w-3" />
  }

  const getHealthStatus = (score: number) => {
    if (score >= 90) return "excellent"
    if (score >= 75) return "healthy"
    if (score >= 60) return "at-risk"
    return "critical"
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border border-[#0021A5]/20 dark:border-[#0021A5]/40 rounded-lg h-full ${className}`}
    >
      <CardHeader className="pb-3 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-[#0021A5] rounded-md flex-shrink-0">
              <Heart className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold text-[#0021A5] dark:text-[#4A7FD6] leading-tight">
                Portfolio Health
              </CardTitle>
              <CardDescription className="text-xs text-[#0021A5]/70 dark:text-[#4A7FD6]/80 leading-tight">
                Real-time health monitoring
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge
              variant="outline"
              className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6] text-xs px-1.5 py-0.5"
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Power BI
            </Badge>
            <Badge variant="outline" className={`${getHealthColor(healthData.portfolioHealth)} text-xs px-1.5 py-0.5`}>
              <Activity className="h-2.5 w-2.5 mr-1" />
              {healthData.portfolioHealth.toFixed(0)}%
            </Badge>
            <div className="flex items-center gap-1">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-[#0021A5] scale-75"
              />
              <Label className="text-xs text-[#0021A5]/70 dark:text-[#4A7FD6]/80">Auto</Label>
            </div>
          </div>
        </div>
        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
          Last updated: {lastUpdated.toLocaleTimeString()} • {healthData.projects.length} projects
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 h-8">
            <TabsTrigger value="overview" className="text-xs px-2 py-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs px-2 py-1">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="risks" className="text-xs px-2 py-1">
              Risks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Health Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Healthy Projects</p>
                    <p className="text-lg font-bold text-green-600">{healthData.healthyProjects}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    {((healthData.healthyProjects / healthData.projects.length) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">At Risk</p>
                    <p className="text-lg font-bold text-yellow-600">{healthData.atRiskProjects}</p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Bell className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">Need attention</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Critical</p>
                    <p className="text-lg font-bold text-red-600">{healthData.criticalProjects}</p>
                  </div>
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-600">Urgent action</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Risks</p>
                    <p className="text-lg font-bold text-blue-600">{healthData.totalRisks}</p>
                  </div>
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600">Being managed</span>
                </div>
              </div>
            </div>

            {/* Project Health List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Project Health Overview</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {healthData.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">{project.name}</h5>
                          <Badge variant="outline" className={`text-xs ${getHealthColor(project.healthScore)}`}>
                            {getHealthIcon(project.healthScore)}
                            {getHealthStatus(project.healthScore)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>Health: {project.healthScore}%</span>
                          <span>Risks: {project.risks.length}</span>
                          <span>Budget: {project.kpis.budget}%</span>
                          <span>Schedule: {project.kpis.schedule}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              project.healthScore >= 90
                                ? "bg-green-500"
                                : project.healthScore >= 75
                                ? "bg-blue-500"
                                : project.healthScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${project.healthScore}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{project.healthScore}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* Health Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Portfolio Health Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthData.healthTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="portfolioHealth"
                      stroke="#10B981"
                      strokeWidth={2}
                      name="Portfolio Health"
                    />
                    <Line
                      type="monotone"
                      dataKey="budgetPerformance"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      name="Budget Performance"
                    />
                    <Line
                      type="monotone"
                      dataKey="schedulePerformance"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      name="Schedule Performance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Portfolio KPI Performance</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={healthData.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Performance" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Health Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthData.healthDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {healthData.healthDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} projects`, name]}
                        labelFormatter={(label) => `Status: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            {/* Risk Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Risk Assessment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">High Risk Projects</span>
                    <span className="text-xs font-medium text-red-600">{healthData.criticalProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Medium Risk Projects</span>
                    <span className="text-xs font-medium text-yellow-600">{healthData.atRiskProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Low Risk Projects</span>
                    <span className="text-xs font-medium text-green-600">{healthData.healthyProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Active Risk Items</span>
                    <span className="text-xs font-medium text-blue-600">{healthData.totalRisks}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Risk Mitigation</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Mitigation Plans</span>
                    <span className="text-xs font-medium text-green-600">
                      {Math.floor(healthData.totalRisks * 0.8)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Contingency Available</span>
                    <span className="text-xs font-medium text-blue-600">$2.4M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Insurance Coverage</span>
                    <span className="text-xs font-medium text-green-600">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Risk Response Time</span>
                    <span className="text-xs font-medium text-blue-600">&lt; 24hrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Active Risk Items</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {healthData.projects
                    .filter((p) => p.risks.length > 0)
                    .map((project) => (
                      <div key={project.id} className="space-y-1">
                        <div className="font-medium text-sm text-gray-700 dark:text-gray-300">{project.name}</div>
                        {project.risks.map((risk, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 pl-4 py-1 bg-gray-50 dark:bg-gray-700 rounded"
                          >
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{risk}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
