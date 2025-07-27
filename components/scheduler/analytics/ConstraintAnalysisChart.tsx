/**
 * @fileoverview Constraint Analysis Chart Component
 * @module ConstraintAnalysisChart
 * @version 3.0.0
 * @author HB Development Team
 * @since 2025-01-10
 *
 * Power BI embedded constraint analysis with donut chart visualization
 * showing activity constraints, critical path impact, and logic overrides
 * with detailed tooltips and summary statistics.
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Switch } from "../../ui/switch"
import { Progress } from "../../ui/progress"
import { cn } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  AlertTriangle,
  Clock,
  Target,
  Shield,
  RefreshCw,
  Download,
  Settings,
  Info,
  TrendingUp,
  Activity,
  GitBranch,
  Calendar,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"

// Types
interface ConstraintData {
  type: string
  code: string
  count: number
  percentage: number
  description: string
  impact: "low" | "medium" | "high"
  criticalPathAffected: number
}

interface ConstraintSummary {
  totalActivities: number
  constrainedActivities: number
  unconstrainedActivities: number
  constrainedPercentage: number
  criticalPathConstrained: number
  improperOverrides: number
  constraintTypes: ConstraintData[]
}

interface ConstraintAnalysisChartProps {
  showMockData?: boolean
  onConstraintClick?: (constraintType: string) => void
  onRefresh?: () => void
}

// Mock Data
const mockConstraintSummary: ConstraintSummary = {
  totalActivities: 150,
  constrainedActivities: 28,
  unconstrainedActivities: 122,
  constrainedPercentage: 18.7,
  criticalPathConstrained: 6,
  improperOverrides: 4,
  constraintTypes: [
    {
      type: "Must Start On",
      code: "MSO",
      count: 8,
      percentage: 28.6,
      description: "Activities must start on a specific date",
      impact: "high",
      criticalPathAffected: 2,
    },
    {
      type: "Finish No Later Than",
      code: "FNLT",
      count: 7,
      percentage: 25.0,
      description: "Activities must finish by a specific date",
      impact: "high",
      criticalPathAffected: 3,
    },
    {
      type: "Start No Earlier Than",
      code: "SNET",
      count: 6,
      percentage: 21.4,
      description: "Activities cannot start before a specific date",
      impact: "medium",
      criticalPathAffected: 1,
    },
    {
      type: "Finish No Earlier Than",
      code: "FNET",
      count: 4,
      percentage: 14.3,
      description: "Activities cannot finish before a specific date",
      impact: "medium",
      criticalPathAffected: 0,
    },
    {
      type: "As Late As Possible",
      code: "ALAP",
      count: 2,
      percentage: 7.1,
      description: "Activities scheduled as late as possible",
      impact: "low",
      criticalPathAffected: 0,
    },
    {
      type: "Start No Later Than",
      code: "SNLT",
      count: 1,
      percentage: 3.6,
      description: "Activities must start by a specific date",
      impact: "medium",
      criticalPathAffected: 0,
    },
  ],
}

// Color scheme for constraints
const constraintColors = {
  MSO: "#ef4444", // Red - High impact
  FNLT: "#dc2626", // Dark red - High impact
  SNET: "#f59e0b", // Amber - Medium impact
  FNET: "#eab308", // Yellow - Medium impact
  SNLT: "#06b6d4", // Cyan - Medium impact
  ALAP: "#10b981", // Green - Low impact
  unconstrained: "#e5e7eb", // Gray - No constraint
}

// Power BI colors for donut chart
const powerBIColors = ["#118DFF", "#12239E", "#E66C37", "#6B007B", "#E044A7", "#744EC2", "#D9B300", "#D64550"]

// Main Component
const ConstraintAnalysisChart: React.FC<ConstraintAnalysisChartProps> = ({
  showMockData = true,
  onConstraintClick,
  onRefresh,
}) => {
  const [useMockData, setUseMockData] = useState(showMockData)
  const [selectedConstraint, setSelectedConstraint] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "critical" | "overrides">("overview")

  // Prepare donut chart data
  const donutData = useMemo(
    () => [
      {
        name: "Constrained Activities",
        value: mockConstraintSummary.constrainedActivities,
        percentage: mockConstraintSummary.constrainedPercentage,
        color: "#ef4444",
      },
      {
        name: "Unconstrained Activities",
        value: mockConstraintSummary.unconstrainedActivities,
        percentage: 100 - mockConstraintSummary.constrainedPercentage,
        color: "#10b981",
      },
    ],
    []
  )

  // Prepare constraint breakdown data
  const constraintBreakdownData = useMemo(
    () =>
      mockConstraintSummary.constraintTypes.map((constraint, index) => ({
        ...constraint,
        color: powerBIColors[index % powerBIColors.length],
      })),
    []
  )

  // Calculate risk indicators
  const riskIndicators = useMemo(() => {
    const highImpactConstraints = mockConstraintSummary.constraintTypes
      .filter((c) => c.impact === "high")
      .reduce((sum, c) => sum + c.count, 0)

    const criticalPathRisk =
      (mockConstraintSummary.criticalPathConstrained / mockConstraintSummary.constrainedActivities) * 100

    const overrideRisk = (mockConstraintSummary.improperOverrides / mockConstraintSummary.constrainedActivities) * 100

    return {
      highImpactConstraints,
      criticalPathRisk,
      overrideRisk,
      overallRisk:
        criticalPathRisk > 30 || overrideRisk > 15
          ? "high"
          : criticalPathRisk > 15 || overrideRisk > 10
          ? "medium"
          : "low",
    }
  }, [])

  // Custom tooltip for donut chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <div className="font-medium text-sm mb-2">{data.name}</div>
          <div className="space-y-1 text-xs">
            <div>Count: {data.value} activities</div>
            <div>Percentage: {data.percentage.toFixed(1)}%</div>
            {data.name === "Constrained Activities" && (
              <div className="pt-2 mt-2 border-t">
                <div>Critical Path Affected: {mockConstraintSummary.criticalPathConstrained}</div>
                <div>Improper Overrides: {mockConstraintSummary.improperOverrides}</div>
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for constraint breakdown
  const ConstraintTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ConstraintData
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
          <div className="font-medium text-sm mb-2">
            {data.type} ({data.code})
          </div>
          <div className="space-y-1 text-xs">
            <div>Count: {data.count} activities</div>
            <div>Percentage: {data.percentage.toFixed(1)}% of constraints</div>
            <div>Critical Path Impact: {data.criticalPathAffected} activities</div>
            <div className="pt-2 mt-2 border-t text-muted-foreground">{data.description}</div>
            <div className="flex items-center gap-1 mt-1">
              <span>Impact Level:</span>
              <Badge
                variant="outline"
                className={cn(
                  data.impact === "high"
                    ? "text-red-600 border-red-200"
                    : data.impact === "medium"
                    ? "text-yellow-600 border-yellow-200"
                    : "text-green-600 border-green-200"
                )}
              >
                {data.impact.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Schedule Constraint Analysis
              <Badge className="bg-yellow-500 text-yellow-900 text-xs">Powered by Microsoft Power BI</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Activity constraints impact analysis with critical path and override tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Switch checked={useMockData} onCheckedChange={setUseMockData} />
            <span className="text-sm">Mock Data</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Risk Summary Alert */}
        <Card
          className={cn(
            "mb-6",
            riskIndicators.overallRisk === "high"
              ? "border-red-200 bg-red-50"
              : riskIndicators.overallRisk === "medium"
              ? "border-yellow-200 bg-yellow-50"
              : "border-green-200 bg-green-50"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {riskIndicators.overallRisk === "high" ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : riskIndicators.overallRisk === "medium" ? (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              <span className="font-medium">
                Constraint Risk:{" "}
                {riskIndicators.overallRisk.charAt(0).toUpperCase() + riskIndicators.overallRisk.slice(1)}
              </span>
            </div>
            <div className="text-sm">
              {riskIndicators.criticalPathRisk.toFixed(0)}% of constraints affect critical path •{" "}
              {mockConstraintSummary.improperOverrides} logic overrides detected •{" "}
              {riskIndicators.highImpactConstraints} high-impact constraints
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{mockConstraintSummary.constrainedActivities}</div>
              <div className="text-sm text-muted-foreground">Constrained Activities</div>
              <div className="text-xs text-muted-foreground">
                {mockConstraintSummary.constrainedPercentage.toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{mockConstraintSummary.criticalPathConstrained}</div>
              <div className="text-sm text-muted-foreground">Critical Path Constraints</div>
              <div className="text-xs text-muted-foreground">
                {(
                  (mockConstraintSummary.criticalPathConstrained / mockConstraintSummary.constrainedActivities) *
                  100
                ).toFixed(1)}
                % of constraints
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{mockConstraintSummary.improperOverrides}</div>
              <div className="text-sm text-muted-foreground">Logic Overrides</div>
              <div className="text-xs text-muted-foreground">Improper constraint applications</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mockConstraintSummary.constraintTypes.length}</div>
              <div className="text-sm text-muted-foreground">Constraint Types</div>
              <div className="text-xs text-muted-foreground">Different constraint codes</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Constraint Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>
                        {value}: {entry.payload.value} ({entry.payload.percentage.toFixed(1)}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Constraint Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Constraint Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={constraintBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="code" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip content={<ConstraintTooltip />} />
                  <Bar dataKey="count" name="Count">
                    {constraintBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Constraint List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Constraint Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockConstraintSummary.constraintTypes.map((constraint, index) => (
                <div
                  key={constraint.code}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer",
                    selectedConstraint === constraint.code && "ring-2 ring-primary",
                    "hover:bg-gray-50"
                  )}
                  onClick={() => {
                    setSelectedConstraint(selectedConstraint === constraint.code ? null : constraint.code)
                    onConstraintClick?.(constraint.code)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: powerBIColors[index % powerBIColors.length] }}
                    />
                    <div>
                      <div className="font-medium">
                        {constraint.type} ({constraint.code})
                      </div>
                      <div className="text-sm text-muted-foreground">{constraint.description}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold">{constraint.count}</div>
                    <div className="text-sm text-muted-foreground">{constraint.percentage.toFixed(1)}%</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          constraint.impact === "high"
                            ? "text-red-600 border-red-200"
                            : constraint.impact === "medium"
                            ? "text-yellow-600 border-yellow-200"
                            : "text-green-600 border-green-200"
                        )}
                      >
                        {constraint.impact}
                      </Badge>
                      {constraint.criticalPathAffected > 0 && (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                          {constraint.criticalPathAffected} CP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Power BI Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <span>Powered by Microsoft Power BI</span>
            <span>•</span>
            <span>Last updated: {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}</span>
            <span>•</span>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              View in Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ConstraintAnalysisChart
