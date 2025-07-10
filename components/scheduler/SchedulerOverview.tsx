/**
 * @fileoverview HB Intel Scheduler Overview Dashboard
 * @module SchedulerOverview
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive analytical dashboard and monitoring center for project schedule
 * with advanced analytics, AI insights, and SmartPM/nPlan-inspired features
 */

"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  BarChart3,
  GitBranch,
  Zap,
  Brain,
  Eye,
  Download,
  Settings,
  RefreshCw,
  CheckCircle,
  Diamond,
  ArrowUpDown,
  Share2,
  ChevronUp,
  ChevronDown,
  MoreVertical,
} from "lucide-react"
import { format } from "date-fns"

// Types
interface SchedulerOverviewProps {
  userRole: string
  projectData: any
}

interface ScheduleMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  delta: string
  status: "good" | "warning" | "critical"
  description: string
}

interface AIInsight {
  id: string
  type: "risk" | "optimization" | "quality" | "performance"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  recommendation: string
  confidence: number
  timestamp: Date
  linkedActivities: string[]
}

// Mock AI Insights
const mockAIInsights: AIInsight[] = [
  {
    id: "insight-001",
    type: "risk",
    priority: "high",
    title: "Critical Path Shift Detected",
    description:
      "Foundation work (A007) is trending 5 days behind, potentially shifting critical path to structural steel sequence.",
    impact: "May delay project completion by 3-5 days",
    recommendation: "Consider accelerating foundation pour or parallel sequencing with steel delivery",
    confidence: 89,
    timestamp: new Date("2025-12-30"),
    linkedActivities: ["A007", "A008"],
  },
  {
    id: "insight-002",
    type: "optimization",
    priority: "medium",
    title: "Float Optimization Opportunity",
    description:
      "Site preparation activities have 8 days of free float that could be leveraged for weather contingency.",
    impact: "Improved schedule resilience without cost impact",
    recommendation: "Redistribute float to weather-dependent activities in Q1",
    confidence: 76,
    timestamp: new Date("2025-12-29"),
    linkedActivities: ["A004", "A005"],
  },
]

// KPI Calculation Functions
const calculateKPIs = (category: string): ScheduleMetric[] => {
  switch (category) {
    case "overview":
      return [
        {
          label: "Schedule Performance Index",
          value: "96.0%",
          trend: "up",
          delta: "+2.0%",
          status: "good",
          description: "Ratio of earned value to planned value",
        },
        {
          label: "Activities Completed",
          value: "8/20",
          trend: "up",
          delta: "+2",
          status: "good",
          description: "Progress against total activity count",
        },
        {
          label: "Critical Path Length",
          value: "6",
          trend: "down",
          delta: "-1",
          status: "good",
          description: "Number of activities on critical path",
        },
        {
          label: "Schedule Grade",
          value: "B+",
          trend: "stable",
          delta: "0",
          status: "good",
          description: "Overall schedule quality assessment",
        },
      ]
    case "performance":
      return [
        {
          label: "Schedule Performance Index",
          value: "96.0%",
          trend: "up",
          delta: "+2.0%",
          status: "good",
          description: "Ratio of earned value to planned value",
        },
        {
          label: "Cost Performance Index",
          value: "95.0%",
          trend: "up",
          delta: "+2.0%",
          status: "good",
          description: "Cost efficiency indicator",
        },
        {
          label: "Compression Index",
          value: "1.12",
          trend: "up",
          delta: "+0.05",
          status: "warning",
          description: "Schedule compression measurement",
        },
        {
          label: "Forecast Accuracy",
          value: "85%",
          trend: "up",
          delta: "+3%",
          status: "good",
          description: "Prediction accuracy over time",
        },
      ]
    default:
      return []
  }
}

// Components
const KPICard: React.FC<{ metric: ScheduleMetric; isPinned?: boolean; onPin?: () => void }> = ({
  metric,
  isPinned = false,
  onPin,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <ArrowUpDown className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card className={cn("relative", isPinned && "ring-2 ring-primary")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
          {onPin && (
            <Button variant="ghost" size="sm" onClick={onPin} className="h-6 w-6 p-0">
              <Target className={cn("h-3 w-3", isPinned ? "text-primary" : "text-muted-foreground")} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{metric.value}</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(metric.trend)}
              <span className="text-sm text-muted-foreground">{metric.delta}</span>
            </div>
          </div>
          <Badge variant="outline" className={cn("text-xs", getStatusColor(metric.status))}>
            {metric.status.toUpperCase()}
          </Badge>
          <p className="text-xs text-muted-foreground">{metric.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

const AIInsightCard: React.FC<{ insight: AIInsight }> = ({ insight }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "risk":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "optimization":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "quality":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "performance":
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      default:
        return <Brain className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(insight.type)}
            <div>
              <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={cn("text-xs", getPriorityColor(insight.priority))}>
                  {insight.priority.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm">{insight.description}</p>

          {isExpanded && (
            <div className="space-y-3 pt-3 border-t">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">IMPACT</h4>
                <p className="text-sm">{insight.impact}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">RECOMMENDATION</h4>
                <p className="text-sm">{insight.recommendation}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1">LINKED ACTIVITIES</h4>
                <div className="flex flex-wrap gap-1">
                  {insight.linkedActivities.map((activity) => (
                    <Badge key={activity} variant="secondary" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const ScheduleMonitor: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Schedule Monitor
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline Overview */}
          <div className="relative h-32 bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Timeline</span>
              <span className="text-sm text-muted-foreground">Sep 2025 - Mar 2026</span>
            </div>

            {/* Baseline vs Current */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs">Baseline</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div className="h-full w-full bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs">Current</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div className="h-full w-4/5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Diamond className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">On Track</span>
              </div>
              <div className="text-2xl font-bold text-green-600">5</div>
              <p className="text-xs text-muted-foreground">Milestones</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Diamond className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">At Risk</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-xs text-muted-foreground">Milestones</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Diamond className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Delayed</span>
              </div>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Milestones</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Critical Path</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">6</div>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Component
const SchedulerOverview: React.FC<SchedulerOverviewProps> = ({ userRole, projectData }) => {
  const [activeCategory, setActiveCategory] = useState("overview")
  const [pinnedKPIs, setPinnedKPIs] = useState<string[]>([])
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [dateRange, setDateRange] = useState("all")
  const [activityFilter, setActivityFilter] = useState("all")

  const currentKPIs = useMemo(() => calculateKPIs(activeCategory), [activeCategory])
  const filteredInsights = useMemo(() => {
    if (activeCategory === "overview") return mockAIInsights
    return mockAIInsights.filter((insight) => insight.type === activeCategory)
  }, [activeCategory])

  const handlePinKPI = useCallback((kpiLabel: string) => {
    setPinnedKPIs((prev) =>
      prev.includes(kpiLabel) ? prev.filter((label) => label !== kpiLabel) : [...prev, kpiLabel]
    )
  }, [])

  const categories = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "quality", label: "Schedule Quality", icon: CheckCircle },
    { id: "risk", label: "Risk & Forecast", icon: AlertTriangle },
    { id: "optimization", label: "Optimization", icon: Zap },
  ]

  const renderSelectedCategory = () => {
    const activeCategory_data = categories.find((cat) => cat.id === activeCategory)
    if (!activeCategory_data) return null
    const IconComponent = activeCategory_data.icon
    return (
      <div className="flex items-center gap-2">
        <IconComponent className="h-4 w-4" />
        {activeCategory_data.label}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">HB Intel Scheduler</h2>
          <p className="text-sm text-muted-foreground">Analytical dashboard and monitoring center</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="milestones">Milestones</SelectItem>
              <SelectItem value="critical">Critical Path</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Analytics Category:</span>
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-48">
              <SelectValue>{renderSelectedCategory()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pinned KPIs Banner */}
      {pinnedKPIs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pinned KPIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentKPIs
                .filter((kpi) => pinnedKPIs.includes(kpi.label))
                .map((kpi) => (
                  <KPICard key={kpi.label} metric={kpi} isPinned={true} onPin={() => handlePinKPI(kpi.label)} />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dynamic Content Based on Selected Category */}
      <div className="space-y-6">
        {activeCategory === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ScheduleMonitor />

              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentKPIs.map((kpi) => (
                  <KPICard
                    key={kpi.label}
                    metric={kpi}
                    isPinned={pinnedKPIs.includes(kpi.label)}
                    onPin={() => handlePinKPI(kpi.label)}
                  />
                ))}
              </div>
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">HBI Insights</h3>
                <div className="flex items-center gap-2">
                  <Switch checked={showAIInsights} onCheckedChange={setShowAIInsights} />
                  <Brain className="h-4 w-4" />
                </div>
              </div>

              {showAIInsights && (
                <div className="space-y-4">
                  {filteredInsights.map((insight) => (
                    <AIInsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeCategory === "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentKPIs.map((kpi) => (
                <KPICard
                  key={kpi.label}
                  metric={kpi}
                  isPinned={pinnedKPIs.includes(kpi.label)}
                  onPin={() => handlePinKPI(kpi.label)}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>SPI/CPI Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">SPI/CPI Chart Visualization</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progress Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">Velocity Chart Visualization</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Other categories would render similar content structures */}
        {activeCategory !== "overview" && activeCategory !== "performance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentKPIs.map((kpi) => (
                <KPICard
                  key={kpi.label}
                  metric={kpi}
                  isPinned={pinnedKPIs.includes(kpi.label)}
                  onPin={() => handlePinKPI(kpi.label)}
                />
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{categories.find((c) => c.id === activeCategory)?.label} Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    {categories.find((c) => c.id === activeCategory)?.label} content coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SchedulerOverview
