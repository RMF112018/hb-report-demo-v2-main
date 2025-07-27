"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  AlertTriangle,
  Clock,
  Users,
  TrendingDown,
  Eye,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  HardHat,
  AlertCircle,
  Target,
  TrendingUp,
  FileText,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface BetaSafetyProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaSafety({ className, config, isCompact = false, userRole }: BetaSafetyProps) {
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

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        return {
          totalInspections: 45,
          openInspections: 8,
          closedInspections: 37,
          safetyScore: 91.2,
          atRiskItems: 3,
          incidentRate: 0.0,
          daysWithoutIncident: 124,
          oshaCompliance: 96.8,
          trainingCurrent: 94.2,
          tradeBreakdown: [
            { name: "Concrete", inspections: 12, score: 95.8, color: "#0021A5" },
            { name: "Electrical", inspections: 8, score: 89.4, color: "#0021A5CC" },
            { name: "Flooring", inspections: 9, score: 86.3, color: "#0021A580" },
            { name: "Plumbing", inspections: 7, score: 92.1, color: "#0021A540" },
            { name: "Framing", inspections: 9, score: 88.7, color: "#0021A520" },
          ],
          safetyTrend: "Excellent",
          upcomingAudits: 3,
          riskLevel: "Low",
        }
      case "project-executive":
        return {
          totalInspections: 248,
          openInspections: 35,
          closedInspections: 213,
          safetyScore: 88.5,
          atRiskItems: 12,
          incidentRate: 0.8,
          daysWithoutIncident: 45,
          oshaCompliance: 92.3,
          trainingCurrent: 89.7,
          tradeBreakdown: [
            { name: "Concrete", inspections: 52, score: 92.3, color: "#0021A5" },
            { name: "Electrical", inspections: 38, score: 87.9, color: "#0021A5CC" },
            { name: "Flooring", inspections: 42, score: 84.6, color: "#0021A580" },
            { name: "Plumbing", inspections: 35, score: 90.2, color: "#0021A540" },
            { name: "Framing", inspections: 38, score: 86.8, color: "#0021A520" },
            { name: "Steel", inspections: 28, score: 82.1, color: "#0021A510" },
            { name: "HVAC", inspections: 15, score: 94.2, color: "#0021A508" },
          ],
          safetyTrend: "Good",
          upcomingAudits: 12,
          riskLevel: "Medium",
        }
      default:
        return {
          totalInspections: 485,
          openInspections: 68,
          closedInspections: 417,
          safetyScore: 86.8,
          atRiskItems: 25,
          incidentRate: 1.2,
          daysWithoutIncident: 28,
          oshaCompliance: 88.9,
          trainingCurrent: 85.4,
          tradeBreakdown: [
            { name: "Concrete", inspections: 85, score: 90.5, color: "#0021A5" },
            { name: "Electrical", inspections: 72, score: 86.2, color: "#0021A5CC" },
            { name: "Flooring", inspections: 68, score: 83.1, color: "#0021A580" },
            { name: "Plumbing", inspections: 58, score: 88.7, color: "#0021A540" },
            { name: "Framing", inspections: 62, score: 85.4, color: "#0021A520" },
            { name: "Steel", inspections: 48, score: 80.9, color: "#0021A510" },
            { name: "HVAC", inspections: 35, score: 93.5, color: "#0021A508" },
            { name: "Excavation", inspections: 28, score: 87.3, color: "#0021A505" },
            { name: "Roofing", inspections: 29, score: 79.8, color: "#0021A503" },
          ],
          safetyTrend: "Needs Improvement",
          upcomingAudits: 24,
          riskLevel: "High",
        }
    }
  }

  const data = getDataByRole()

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 85) return "text-blue-600 dark:text-blue-400"
    if (score >= 80) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getIncidentRateColor = (rate: number) => {
    if (rate === 0) return "text-green-600 dark:text-green-400"
    if (rate <= 1.0) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // Historical data for trend analysis
  const historicalData = [
    { month: "Oct", score: 84.2, incidents: 2, inspections: 38 },
    { month: "Nov", score: 87.5, incidents: 1, inspections: 42 },
    { month: "Dec", score: 89.1, incidents: 0, inspections: 45 },
    {
      month: "Jan",
      score: data.safetyScore,
      incidents: Math.ceil(data.incidentRate),
      inspections: data.totalInspections,
    },
  ]

  // Blue theme colors for charts
  const chartColors = {
    primary: "#0021A5",
    secondary: "#0021A5CC",
    tertiary: "#0021A580",
    quaternary: "#0021A540",
    gradient: "rgba(0, 33, 165, 0.1)",
  }

  return (
    <Card className={`h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="flex-shrink-0 space-y-0 pb-3 px-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium leading-none">Safety Monitor</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Inspections & Compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getRiskColor(data.riskLevel)} border-current`}>
              {data.riskLevel} Risk
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="h-6 w-6 p-0">
              <RefreshCw className={`h-3 w-3 ${autoRefresh ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          <span>•</span>
          <span>{data.daysWithoutIncident} days without incident</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 space-y-4 overflow-y-auto">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Safety Score</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPercentage(data.safetyScore)}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">{data.safetyTrend} trend</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Days Without Incident</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.daysWithoutIncident}</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">{data.incidentRate} incident rate</div>
              </div>
            </div>

            {/* Inspection Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.totalInspections}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Open</div>
                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{data.openInspections}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">At Risk</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.atRiskItems}</div>
              </div>
            </div>

            {/* Compliance Metrics */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Compliance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>OSHA Compliance</span>
                    <span className="font-medium">{formatPercentage(data.oshaCompliance)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.oshaCompliance}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Training Current</span>
                    <span className="font-medium">{formatPercentage(data.trainingCurrent)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.trainingCurrent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Audits */}
            <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-300">Upcoming Audits</h4>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{data.upcomingAudits} safety audits scheduled this month</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trades" className="flex-1 space-y-4 overflow-y-auto">
            {/* Trade Performance */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Trade Performance</h4>
              {data.tradeBreakdown.map((trade, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{trade.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{trade.inspections} inspections</span>
                      <span className={`text-sm font-medium ${getSafetyScoreColor(trade.score)}`}>
                        {formatPercentage(trade.score)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${trade.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Trade Distribution Chart */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Inspection Distribution</h4>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.tradeBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="inspections"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : "0"}%`}
                  >
                    {data.tradeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="flex-1 space-y-4 overflow-y-auto">
            {/* Safety Score Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Safety Score Trend</h4>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={chartColors.primary}
                    strokeWidth={2}
                    dot={{ fill: chartColors.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Incident Trend */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3">Incident Trend</h4>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="incidents" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Real-time Controls */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Real-time Updates</span>
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-refresh"
                    checked={autoRefresh}
                    onCheckedChange={setAutoRefresh}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="auto-refresh" className="text-xs">
                    Auto-refresh
                  </Label>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Activity className="h-3 w-3" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
