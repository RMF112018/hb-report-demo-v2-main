/**
 * @fileoverview Executive Report Panel - High-Level Schedule Summary
 * @module ExecReportPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Executive-friendly dashboard presenting critical schedule metrics
 * in clean, scannable card format for leadership consumption
 */

"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Flag,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  BarChart3,
  Download,
  RefreshCw,
  Share2,
  Eye,
  Zap,
  Shield,
} from "lucide-react"
import { format, addDays } from "date-fns"

// Types
interface ExecutiveMetric {
  id: string
  title: string
  value: string
  subtext: string
  status: "positive" | "neutral" | "warning" | "critical"
  trend?: "up" | "down" | "stable"
  icon: React.ComponentType<any>
  details?: string[]
  actionRequired?: boolean
}

interface RiskFlag {
  id: string
  title: string
  severity: "high" | "medium" | "low"
  impact: string
  owner: string
  dueDate: string
}

interface MilestoneInfo {
  name: string
  date: string
  daysUntil: number
  confidence: number
  dependencies: string[]
  criticality: "high" | "medium" | "low"
}

// Mock Data
const nextMilestone: MilestoneInfo = {
  name: "Foundation Complete",
  date: "2025-02-08",
  daysUntil: 14,
  confidence: 87,
  dependencies: ["Concrete Cure", "Inspection Approval"],
  criticality: "high",
}

const riskFlags: RiskFlag[] = [
  {
    id: "RF001",
    title: "Weather Impact on Foundation",
    severity: "high",
    impact: "3-5 day potential delay",
    owner: "Site Superintendent",
    dueDate: "2025-02-01",
  },
  {
    id: "RF002",
    title: "MEP Design Coordination",
    severity: "medium",
    impact: "Resource bottleneck",
    owner: "Design Manager",
    dueDate: "2025-02-05",
  },
]

const executiveMetrics: ExecutiveMetric[] = [
  {
    id: "milestone",
    title: "Next Critical Milestone",
    value: "14 days",
    subtext: "Foundation Complete",
    status: "neutral",
    trend: "stable",
    icon: Calendar,
    details: ["87% confidence level", "2 dependencies remaining", "Weather contingency included"],
  },
  {
    id: "risks",
    title: "Active Risk Flags",
    value: "2",
    subtext: "1 High, 1 Medium severity",
    status: "warning",
    trend: "stable",
    icon: AlertTriangle,
    details: ["Weather impact assessment", "MEP coordination required", "Mitigation plans active"],
    actionRequired: true,
  },
  {
    id: "float",
    title: "Total Float Available",
    value: "6 days",
    subtext: "Critical path buffer",
    status: "positive",
    trend: "down",
    icon: Clock,
    details: ["3 days planned contingency", "3 days schedule buffer", "Float erosion monitored"],
  },
  {
    id: "completion",
    title: "Completion Probability",
    value: "P50: Jan 30",
    subtext: "P80: Feb 4",
    status: "neutral",
    trend: "stable",
    icon: Target,
    details: ["50% chance by Jan 30", "80% chance by Feb 4", "Monte Carlo analysis"],
  },
]

// Components
const ExecutiveMetricCard: React.FC<{
  metric: ExecutiveMetric
  showDetails: boolean
  onToggleDetails: () => void
}> = ({ metric, showDetails, onToggleDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "positive":
        return "text-green-700 bg-green-50 border-green-200"
      case "neutral":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "warning":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getCardBorder = (status: string) => {
    switch (status) {
      case "positive":
        return "border-l-4 border-l-green-500"
      case "warning":
        return "border-l-4 border-l-yellow-500"
      case "critical":
        return "border-l-4 border-l-red-500"
      default:
        return "border-l-4 border-l-blue-500"
    }
  }

  const IconComponent = metric.icon

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", getCardBorder(metric.status))}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              {metric.actionRequired && (
                <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 text-xs mt-1">
                  ACTION REQUIRED
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(metric.trend)}
            <Button variant="ghost" size="sm" onClick={onToggleDetails} className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Main Value */}
          <div>
            <div className="text-3xl font-bold">{metric.value}</div>
            <p className="text-sm text-muted-foreground mt-1">{metric.subtext}</p>
          </div>

          {/* Status Badge */}
          <Badge variant="outline" className={cn("text-xs", getStatusColor(metric.status))}>
            {metric.status.toUpperCase()}
          </Badge>

          {/* Details (Expandable) */}
          {showDetails && metric.details && (
            <div className="pt-3 border-t">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">DETAILS</h4>
              <ul className="space-y-1">
                {metric.details.map((detail, index) => (
                  <li key={index} className="text-xs flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const RiskFlagsPanel: React.FC<{ flags: RiskFlag[] }> = ({ flags }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-700 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-700 bg-green-50 border-green-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Risk Flags Requiring Attention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {flags.map((flag) => (
            <div key={flag.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{flag.title}</span>
                    <Badge variant="outline" className={cn("text-xs", getSeverityColor(flag.severity))}>
                      {flag.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{flag.impact}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Owner: {flag.owner}</span>
                <span className="text-muted-foreground">Due: {flag.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const MilestoneSummary: React.FC<{ milestone: MilestoneInfo }> = ({ milestone }) => {
  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Upcoming Milestone
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Milestone Header */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{milestone.name}</h3>
            <div className="text-2xl font-bold text-blue-600">{milestone.date}</div>
            <p className="text-sm text-muted-foreground">{milestone.daysUntil} days remaining</p>
          </div>

          <Separator />

          {/* Confidence & Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence Level</span>
              <div className="flex items-center gap-2">
                <Progress value={milestone.confidence} className="w-20 h-2" />
                <span className="text-sm font-medium">{milestone.confidence}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Criticality</span>
              <Badge variant="outline" className={cn("text-xs", getCriticalityColor(milestone.criticality))}>
                {milestone.criticality.toUpperCase()}
              </Badge>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Dependencies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {milestone.dependencies.map((dep) => (
                  <Badge key={dep} variant="secondary" className="text-xs">
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ExecutiveActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Executive Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Review Weather Contingency</span>
            </div>
            <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200 text-xs">
              THIS WEEK
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">MEP Coordination Meeting</span>
            </div>
            <Badge variant="outline" className="text-blue-700 bg-blue-50 border-blue-200 text-xs">
              SCHEDULED
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Resource Reallocation</span>
            </div>
            <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">
              COMPLETED
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ExecReportPanel: React.FC = () => {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null)
  const [reportPeriod, setReportPeriod] = useState("current")

  const toggleMetricDetails = (metricId: string) => {
    setExpandedMetric(expandedMetric === metricId ? null : metricId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Executive Schedule Summary</h2>
          <p className="text-sm text-muted-foreground">High-level project status and critical decisions</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {executiveMetrics.map((metric) => (
          <ExecutiveMetricCard
            key={metric.id}
            metric={metric}
            showDetails={expandedMetric === metric.id}
            onToggleDetails={() => toggleMetricDetails(metric.id)}
          />
        ))}
      </div>

      {/* Secondary Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestone Summary */}
        <MilestoneSummary milestone={nextMilestone} />

        {/* Risk Flags */}
        <RiskFlagsPanel flags={riskFlags} />

        {/* Executive Actions */}
        <ExecutiveActions />
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm">Schedule Health: Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm">Risk Level: Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm">Confidence: 87%</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExecReportPanel
