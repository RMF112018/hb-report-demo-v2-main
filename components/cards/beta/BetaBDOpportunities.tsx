"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Building2,
  Activity,
  Timer,
  Bell,
  Sparkles,
  Clock,
  Users,
  MapPin,
  Calendar,
  Star,
  Award,
  Briefcase,
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
  ComposedChart,
  ScatterChart,
  Scatter,
} from "recharts"

// Import pursuits data
import pursuitsData from "@/data/mock/pursuits.json"

interface BetaBDOpportunitiesProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDOpportunities({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDOpportunitiesProps) {
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

  const [activeTab, setActiveTab] = useState("pipeline")
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

  // Process BD opportunities data
  const bdData = React.useMemo(() => {
    // Use pursuits data as the base
    const opportunities = pursuitsData.map((pursuit) => ({
      ...pursuit,
      stage: pursuit.currentStage,
      probability: pursuit.confidence,
      value: pursuit.estimatedCost,
      client: pursuit.client,
      location: pursuit.location,
      bidDue: pursuit.bidDueDate,
      projectType: pursuit.deliverable,
      team: pursuit.lead,
      riskLevel: pursuit.riskLevel,
    }))

    // Add some additional mock opportunities
    const additionalOps = [
      {
        id: "2525852",
        name: "Tampa Bay Medical Center",
        client: "Tampa Healthcare Systems",
        location: "Tampa, FL",
        stage: "SD",
        probability: 75,
        value: 85000000,
        bidDue: "2025-03-15",
        projectType: "GMP PACKAGE",
        team: "Jennifer Rodriguez",
        riskLevel: "Medium",
        status: "Active",
      },
      {
        id: "2525853",
        name: "Orlando Tech Campus",
        client: "Central Florida University",
        location: "Orlando, FL",
        stage: "DD",
        probability: 65,
        value: 120000000,
        bidDue: "2025-04-01",
        projectType: "DESIGN BUILD",
        team: "Michael Chen",
        riskLevel: "Low",
        status: "Open",
      },
    ]

    const allOpportunities = [...opportunities, ...additionalOps]

    // Calculate metrics
    const totalValue = allOpportunities.reduce((sum, op) => sum + op.value, 0)
    const weightedValue = allOpportunities.reduce((sum, op) => sum + (op.value * op.probability) / 100, 0)
    const avgProbability = allOpportunities.reduce((sum, op) => sum + op.probability, 0) / allOpportunities.length
    const activeCount = allOpportunities.filter((op) => op.status === "Active").length
    const openCount = allOpportunities.filter((op) => op.status === "Open").length

    // Stage distribution
    const stageData = allOpportunities.reduce((acc, op) => {
      acc[op.stage] = (acc[op.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const stageChartData = Object.entries(stageData).map(([stage, count]) => ({
      name: stage,
      value: count,
      fill: stage === "SD" ? "#3B82F6" : stage === "DD" ? "#10B981" : stage === "CD" ? "#F59E0B" : "#8B5CF6",
    }))

    // Value by stage
    const valueByStage = allOpportunities.reduce((acc, op) => {
      acc[op.stage] = (acc[op.stage] || 0) + op.value
      return acc
    }, {} as Record<string, number>)

    const valueStageData = Object.entries(valueByStage).map(([stage, value]) => ({
      stage,
      value: value / 1000000, // Convert to millions
      fill: stage === "SD" ? "#3B82F6" : stage === "DD" ? "#10B981" : stage === "CD" ? "#F59E0B" : "#8B5CF6",
    }))

    // Probability vs Value scatter
    const scatterData = allOpportunities.map((op) => ({
      x: op.probability,
      y: op.value / 1000000,
      z: op.riskLevel,
      name: op.name,
      fill: op.riskLevel === "Low" ? "#10B981" : op.riskLevel === "Medium" ? "#F59E0B" : "#EF4444",
    }))

    // Monthly trend (mock data)
    const monthlyTrend = Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      newOpportunities: Math.floor(Math.random() * 5) + 2,
      pipelineValue: Math.floor(Math.random() * 100) + 200,
      winRate: Math.floor(Math.random() * 20) + 20,
      avgProbability: Math.floor(Math.random() * 15) + 65,
    }))

    // Team performance
    const teamData = allOpportunities.reduce((acc, op) => {
      acc[op.team] = (acc[op.team] || 0) + op.value
      return acc
    }, {} as Record<string, number>)

    const teamChartData = Object.entries(teamData).map(([team, value]) => ({
      name: team,
      value: value / 1000000,
      opportunities: allOpportunities.filter((op) => op.team === team).length,
    }))

    // Risk distribution
    const riskData = allOpportunities.reduce((acc, op) => {
      acc[op.riskLevel] = (acc[op.riskLevel] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const riskChartData = Object.entries(riskData).map(([risk, count]) => ({
      name: risk,
      value: count,
      fill: risk === "Low" ? "#10B981" : risk === "Medium" ? "#F59E0B" : "#EF4444",
    }))

    return {
      opportunities: allOpportunities,
      totalValue,
      weightedValue,
      avgProbability,
      activeCount,
      openCount,
      stageChartData,
      valueStageData,
      scatterData,
      monthlyTrend,
      teamChartData,
      riskChartData,
    }
  }, [])

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "SD":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "DD":
        return "text-green-600 bg-green-50 border-green-200"
      case "CD":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-50 border-green-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "High":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMillions = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border border-[#FA4616]/20 dark:border-[#FA4616]/40 rounded-lg h-full ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FA4616] rounded-lg">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-[#FA4616] dark:text-[#FF8A67]">
                BD Opportunities
              </CardTitle>
              <CardDescription className="text-sm text-[#FA4616]/70 dark:text-[#FF8A67]/80">
                Business development pipeline and opportunity tracking
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Power BI Enhanced
            </Badge>
            <Badge
              variant="outline"
              className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
            >
              <Target className="h-3 w-3 mr-1" />
              {formatMillions(bdData.weightedValue)} Weighted
            </Badge>
            <div className="flex items-center gap-1">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-[#FA4616] scale-75"
              />
              <Label className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80">Auto</Label>
            </div>
          </div>
        </div>
        <div className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80">
          Last updated: {lastUpdated.toLocaleTimeString()} • {bdData.opportunities.length} opportunities tracked
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="pipeline" className="text-xs">
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              Analysis
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">
              Performance
            </TabsTrigger>
            <TabsTrigger value="teams" className="text-xs">
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Pipeline</p>
                    <p className="text-lg font-bold text-blue-600">{formatMillions(bdData.totalValue)}</p>
                  </div>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+18% vs last Q</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Weighted Value</p>
                    <p className="text-lg font-bold text-green-600">{formatMillions(bdData.weightedValue)}</p>
                  </div>
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">{bdData.avgProbability.toFixed(1)}% avg</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Active Pursuits</p>
                    <p className="text-lg font-bold text-orange-600">{bdData.activeCount}</p>
                  </div>
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Briefcase className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-600">{bdData.openCount} open</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-bold text-purple-600">32.5%</p>
                  </div>
                  <Award className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-purple-500" />
                  <span className="text-xs text-purple-600">Above target</span>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Active Opportunities</h4>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2 p-4">
                  {bdData.opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">{opportunity.name}</h5>
                          <Badge variant="outline" className={`text-xs ${getStageColor(opportunity.stage)}`}>
                            {opportunity.stage}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getRiskColor(opportunity.riskLevel)}`}>
                            {opportunity.riskLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {opportunity.client}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {opportunity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {opportunity.team}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {opportunity.bidDue}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">{formatCurrency(opportunity.value)}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {opportunity.probability}% probability
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {/* Stage Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Opportunities by Stage</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bdData.stageChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bdData.stageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} opportunities`, name]}
                        labelFormatter={(label) => `Stage: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Value by Stage</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bdData.valueStageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" fontSize={10} />
                      <YAxis label={{ value: "Value ($M)", angle: -90, position: "insideLeft" }} fontSize={10} />
                      <Tooltip
                        formatter={(value) => [`$${value}M`, "Total Value"]}
                        labelFormatter={(label) => `Stage: ${label}`}
                      />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Probability vs Value Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={bdData.scatterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      label={{ value: "Probability %", position: "insideBottom", offset: -5 }}
                      fontSize={10}
                    />
                    <YAxis
                      dataKey="y"
                      label={{ value: "Value ($M)", angle: -90, position: "insideLeft" }}
                      fontSize={10}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "x" ? `${value}%` : `$${value}M`,
                        name === "x" ? "Probability" : "Value",
                      ]}
                    />
                    <Scatter dataKey="y" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Monthly Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">BD Performance Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={bdData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis yAxisId="left" fontSize={10} />
                    <YAxis yAxisId="right" orientation="right" fontSize={10} />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="newOpportunities" fill="#3B82F6" name="New Opportunities" />
                    <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#10B981" name="Win Rate %" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgProbability"
                      stroke="#F59E0B"
                      name="Avg Probability %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Key Performance Indicators</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Pipeline Growth</span>
                    <span className="text-xs font-medium text-green-600">+18.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Conversion Rate</span>
                    <span className="text-xs font-medium text-blue-600">32.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Avg Deal Size</span>
                    <span className="text-xs font-medium text-purple-600">$136M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Risk Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bdData.riskChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {bdData.riskChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} opportunities`, name]}
                        labelFormatter={(label) => `Risk: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            {/* Team Performance */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Team Performance</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bdData.teamChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                    <YAxis label={{ value: "Pipeline Value ($M)", angle: -90, position: "insideLeft" }} fontSize={10} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "value" ? `$${value}M` : value,
                        name === "value" ? "Pipeline Value" : "Opportunities",
                      ]}
                    />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Team Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Top Performers</h4>
                <div className="space-y-3">
                  {bdData.teamChartData.slice(0, 3).map((team, index) => (
                    <div key={team.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                          }`}
                        />
                        <span className="text-xs font-medium">{team.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium">${team.value.toFixed(1)}M</div>
                        <div className="text-xs text-gray-500">{team.opportunities} ops</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Team Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">Top Team</div>
                      <div className="text-xs text-gray-600">
                        {bdData.teamChartData[0]?.name} leading with ${bdData.teamChartData[0]?.value.toFixed(1)}M
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-3 w-3 text-blue-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">Team Count</div>
                      <div className="text-xs text-gray-600">
                        {bdData.teamChartData.length} teams actively pursuing opportunities
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-3 w-3 text-purple-500 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium">Focus Areas</div>
                      <div className="text-xs text-gray-600">Healthcare, Education, and Mixed-Use projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
