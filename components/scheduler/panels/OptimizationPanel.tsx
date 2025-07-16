/**
 * @fileoverview Optimization Panel - HBI-Powered Schedule Optimization
 * @module OptimizationPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive optimization panel with HBI AI integration for schedule optimization,
 * resource leveling, fast-track analysis, and schedule compression strategies
 */

"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ReferenceLine,
  Legend,
} from "recharts"
import {
  Brain,
  Zap,
  TrendingUp,
  Target,
  Activity,
  Calendar,
  Users,
  Clock,
  Gauge,
  Settings,
  Play,
  RefreshCw,
  Download,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Shield,
  Layers,
  FastForward,
  Maximize2,
  Route,
  Sparkles,
} from "lucide-react"

// Types
interface ScheduleMetric {
  label: string
  value: string | number
  trend: "up" | "down" | "stable"
  delta: string
  status: "good" | "warning" | "critical"
  description: string
}

interface OptimizationOpportunity {
  id: string
  title: string
  type: "resource" | "schedule" | "critical-path" | "fast-track"
  impact: number
  effort: number
  savingsDays: number
  savingsCost: number
  feasibility: "high" | "medium" | "low"
  description: string
  recommendation: string
}

interface ResourceOptimization {
  resource: string
  currentAllocation: number
  optimizedAllocation: number
  efficiency: number
  conflicts: number
  recommendations: string[]
}

interface OptimizationPanelProps {
  currentKPIs: ScheduleMetric[]
  pinnedKPIs: string[]
  onPinKPI: (kpiLabel: string) => void
}

// Mock data for optimization analysis
const optimizationOpportunities: OptimizationOpportunity[] = [
  {
    id: "fast-track-1",
    title: "Parallel MEP & Drywall",
    type: "fast-track",
    impact: 8,
    effort: 6,
    savingsDays: 12,
    savingsCost: 85000,
    feasibility: "high",
    description: "Execute MEP rough-in and drywall installation in parallel zones",
    recommendation: "Coordinate trades for zone-based parallel execution",
  },
  {
    id: "resource-1",
    title: "Resource Leveling Optimization",
    type: "resource",
    impact: 7,
    effort: 4,
    savingsDays: 8,
    savingsCost: 45000,
    feasibility: "high",
    description: "Smooth resource allocation to eliminate peaks and valleys",
    recommendation: "Redistribute crew assignments across activities",
  },
  {
    id: "critical-1",
    title: "Critical Path Compression",
    type: "critical-path",
    impact: 9,
    effort: 7,
    savingsDays: 15,
    savingsCost: 120000,
    feasibility: "medium",
    description: "Compress critical path activities through resource acceleration",
    recommendation: "Add crews to foundation and structural steel activities",
  },
  {
    id: "schedule-1",
    title: "Schedule Optimization",
    type: "schedule",
    impact: 6,
    effort: 3,
    savingsDays: 5,
    savingsCost: 32000,
    feasibility: "high",
    description: "Optimize activity sequencing and dependencies",
    recommendation: "Resequence non-critical activities for better flow",
  },
]

const resourceOptimization: ResourceOptimization[] = [
  {
    resource: "Concrete Crew",
    currentAllocation: 85,
    optimizedAllocation: 92,
    efficiency: 78,
    conflicts: 3,
    recommendations: ["Stagger pour schedules", "Add weekend crew", "Optimize concrete plant delivery"],
  },
  {
    resource: "Steel Erection",
    currentAllocation: 95,
    optimizedAllocation: 88,
    efficiency: 82,
    conflicts: 1,
    recommendations: ["Coordinate crane usage", "Pre-fabricate assemblies", "Weather contingency"],
  },
  {
    resource: "MEP Trades",
    currentAllocation: 72,
    optimizedAllocation: 85,
    efficiency: 69,
    conflicts: 5,
    recommendations: ["Zone-based coordination", "BIM clash resolution", "Prefab installations"],
  },
  {
    resource: "Finishing Crews",
    currentAllocation: 60,
    optimizedAllocation: 78,
    efficiency: 88,
    conflicts: 2,
    recommendations: ["Sequence optimization", "Material staging", "Quality checkpoints"],
  },
]

const optimizationScenarios = [
  { scenario: "Current Baseline", duration: 365, cost: 2800000, resources: 100 },
  { scenario: "Resource Optimization", duration: 357, cost: 2750000, resources: 105 },
  { scenario: "Fast-Track Option", duration: 340, cost: 2920000, resources: 120 },
  { scenario: "Aggressive Compression", duration: 325, cost: 3100000, resources: 135 },
]

const scheduleCompressionData = [
  { activity: "Foundation", baseline: 45, optimized: 38, savings: 7, method: "Resource Addition" },
  { activity: "Structural", baseline: 35, optimized: 28, savings: 7, method: "Fast-Track" },
  { activity: "MEP Rough", baseline: 55, optimized: 45, savings: 10, method: "Parallel Execution" },
  { activity: "Envelope", baseline: 40, optimized: 35, savings: 5, method: "Sequencing" },
  { activity: "Finishes", baseline: 50, optimized: 47, savings: 3, method: "Resource Leveling" },
]

// HBI Optimization Intelligence Component
const HBIOptimizationIntelligence: React.FC = () => {
  const [optimizationMode, setOptimizationMode] = useState<string>("balanced")
  const [isRunning, setIsRunning] = useState(false)

  const runOptimization = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-green-600" />
            HBI Optimization Engine Controls
          </CardTitle>
          <p className="text-sm text-muted-foreground">Configure optimization parameters and run analysis scenarios</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Optimization Mode</label>
              <Select value={optimizationMode} onValueChange={setOptimizationMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time Focused</SelectItem>
                  <SelectItem value="cost">Cost Focused</SelectItem>
                  <SelectItem value="balanced">Balanced Approach</SelectItem>
                  <SelectItem value="resource">Resource Optimized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Conservative</SelectItem>
                  <SelectItem value="medium">Moderate</SelectItem>
                  <SelectItem value="high">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={runOptimization} disabled={isRunning} className="w-full">
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Run HBI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">HBI Optimization Insights</h4>
            <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
              <li>• Identified 23 optimization opportunities across project phases</li>
              <li>• Potential schedule compression: 15-25 days with minimal risk</li>
              <li>• Resource leveling could improve efficiency by 12%</li>
              <li>• Fast-track opportunities available in MEP and finishing phases</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Optimization Opportunities Component
const OptimizationOpportunities: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("impact")

  const sortedOpportunities = useMemo(() => {
    return [...optimizationOpportunities].sort((a, b) => {
      switch (sortBy) {
        case "impact":
          return b.impact - a.impact
        case "effort":
          return a.effort - b.effort
        case "savings":
          return b.savingsDays - a.savingsDays
        default:
          return b.impact - a.impact
      }
    })
  }, [sortBy])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fast-track":
        return FastForward
      case "resource":
        return Users
      case "critical-path":
        return Route
      case "schedule":
        return Calendar
      default:
        return Target
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fast-track":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "resource":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "critical-path":
        return "text-red-600 bg-red-50 border-red-200"
      case "schedule":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case "high":
        return "text-green-600 border-green-200"
      case "medium":
        return "text-yellow-600 border-yellow-200"
      case "low":
        return "text-red-600 border-red-200"
      default:
        return "text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Optimization Opportunities
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                HBI-identified opportunities for schedule and resource optimization
              </p>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impact">Impact</SelectItem>
                <SelectItem value="effort">Effort</SelectItem>
                <SelectItem value="savings">Time Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedOpportunities.map((opportunity) => {
              const IconComponent = getTypeIcon(opportunity.type)
              return (
                <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded", getTypeColor(opportunity.type))}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("text-xs", getFeasibilityColor(opportunity.feasibility))}>
                        {opportunity.feasibility} feasibility
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Impact Score:</span>
                      <div className="font-medium">{opportunity.impact}/10</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time Savings:</span>
                      <div className="font-medium text-green-600">{opportunity.savingsDays} days</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost Impact:</span>
                      <div className="font-medium text-blue-600">${opportunity.savingsCost.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effort Level:</span>
                      <div className="font-medium">{opportunity.effort}/10</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">HBI Recommendation</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">{opportunity.recommendation}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">ROI Score:</span>
                      <Progress value={(opportunity.impact / opportunity.effort) * 10} className="h-2 w-20" />
                    </div>
                    <Button size="sm" variant="outline">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Simulate
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Resource Optimization Component
const ResourceOptimizationAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Resource Optimization Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Current vs. optimized resource allocation and efficiency metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resourceOptimization.map((resource, index) => (
              <div key={resource.resource} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{resource.resource}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {resource.efficiency}% Efficiency
                    </Badge>
                    {resource.conflicts > 0 && (
                      <Badge variant="outline" className="text-xs text-red-600 border-red-200">
                        {resource.conflicts} Conflicts
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Current Allocation:</span>
                    <div className="font-medium">{resource.currentAllocation}%</div>
                    <Progress value={resource.currentAllocation} className="h-2 mt-1" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Optimized Allocation:</span>
                    <div className="font-medium text-green-600">{resource.optimizedAllocation}%</div>
                    <Progress value={resource.optimizedAllocation} className="h-2 mt-1" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Improvement:</span>
                    <div
                      className={cn(
                        "font-medium",
                        resource.optimizedAllocation > resource.currentAllocation ? "text-green-600" : "text-blue-600"
                      )}
                    >
                      {resource.optimizedAllocation > resource.currentAllocation ? "+" : ""}
                      {resource.optimizedAllocation - resource.currentAllocation}%
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                    Optimization Recommendations
                  </h5>
                  <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
                    {resource.recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Schedule Compression Analysis
const ScheduleCompressionAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FastForward className="h-5 w-5 text-purple-600" />
            Schedule Compression Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Activity-level compression opportunities and potential time savings
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleCompressionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="activity" />
                <YAxis label={{ value: "Days", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="baseline" fill="#94A3B8" name="Baseline Duration" />
                <Bar dataKey="optimized" fill="#0021A5" name="Optimized Duration" />
                <Bar dataKey="savings" fill="#10B981" name="Time Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">32d</div>
              <div className="text-xs text-muted-foreground">Total Savings Potential</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">13%</div>
              <div className="text-xs text-muted-foreground">Schedule Compression</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-xs text-muted-foreground">Activities Optimized</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Scenario Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">Compare different optimization approaches and their impact</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Scenario</th>
                  <th className="text-right p-2">Duration</th>
                  <th className="text-right p-2">Cost</th>
                  <th className="text-right p-2">Resources</th>
                  <th className="text-right p-2">Time Savings</th>
                  <th className="text-right p-2">Cost Impact</th>
                </tr>
              </thead>
              <tbody>
                {optimizationScenarios.map((scenario, index) => (
                  <tr key={scenario.scenario} className="border-b">
                    <td className="p-2 font-medium">{scenario.scenario}</td>
                    <td className="p-2 text-right">{scenario.duration} days</td>
                    <td className="p-2 text-right">${(scenario.cost / 1000000).toFixed(1)}M</td>
                    <td className="p-2 text-right">{scenario.resources}%</td>
                    <td className="p-2 text-right">
                      {index === 0 ? (
                        "-"
                      ) : (
                        <span className="text-green-600">
                          -{optimizationScenarios[0].duration - scenario.duration}d
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {index === 0 ? (
                        "-"
                      ) : (
                        <span
                          className={scenario.cost > optimizationScenarios[0].cost ? "text-red-600" : "text-green-600"}
                        >
                          {scenario.cost > optimizationScenarios[0].cost ? "+" : ""}$
                          {((scenario.cost - optimizationScenarios[0].cost) / 1000).toFixed(0)}K
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({ currentKPIs, pinnedKPIs, onPinKPI }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("hbi-intelligence")

  // Analysis options for card navigation
  const analysisOptions = [
    {
      id: "hbi-intelligence",
      title: "HBI Intelligence",
      description: "AI optimization analysis",
      icon: Brain,
      color: "from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20",
      borderColor: "border-green-200 dark:border-green-700",
      iconColor: "text-green-600",
    },
    {
      id: "opportunities",
      title: "Opportunities",
      description: "Optimization recommendations",
      icon: Target,
      color: "from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20",
      borderColor: "border-orange-200 dark:border-orange-700",
      iconColor: "text-orange-600",
    },
    {
      id: "resources",
      title: "Resources",
      description: "Resource leveling analysis",
      icon: Users,
      color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      iconColor: "text-blue-600",
    },
    {
      id: "compression",
      title: "Compression",
      description: "Schedule acceleration",
      icon: FastForward,
      color: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      borderColor: "border-purple-200 dark:border-purple-700",
      iconColor: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Feature Cards in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 h-fit">
          {analysisOptions.map((option) => {
            const IconComponent = option.icon
            const isSelected = selectedAnalysis === option.id

            return (
              <div
                key={option.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                  "bg-gradient-to-r",
                  option.color,
                  "border-2 rounded-lg p-3",
                  isSelected ? "border-primary shadow-lg bg-primary/5" : option.borderColor,
                  "h-[100px] min-h-[100px] max-h-[100px]",
                  "flex flex-col justify-center",
                  "overflow-hidden",
                  "relative"
                )}
                onClick={() => setSelectedAnalysis(option.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                  <div
                    className={cn(
                      "p-2 rounded shadow-sm transition-all duration-200",
                      "flex-shrink-0",
                      isSelected ? "bg-primary text-white shadow-md" : "bg-white/80 dark:bg-gray-800/80"
                    )}
                  >
                    <IconComponent className={cn("h-4 w-4", isSelected ? "text-white" : option.iconColor)} />
                  </div>
                  <div className="min-h-[32px] flex flex-col justify-center">
                    <div
                      className={cn(
                        "text-xs font-medium leading-tight line-clamp-2",
                        isSelected ? "text-primary" : "text-gray-900 dark:text-gray-100"
                      )}
                    >
                      {option.title}
                    </div>
                    {isSelected && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse flex-shrink-0" />
                        <span className="text-[10px] text-primary font-medium leading-none">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Column: HBI Optimization Overview */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              HBI Optimization Intelligence
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-powered schedule optimization with resource leveling and fast-track analysis
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-xs text-muted-foreground">Opportunities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">25d</div>
                <div className="text-xs text-muted-foreground">Max Compression</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12%</div>
                <div className="text-xs text-muted-foreground">Efficiency Gain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">$285K</div>
                <div className="text-xs text-muted-foreground">Cost Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Panels */}
      <div className="space-y-6">
        {selectedAnalysis === "hbi-intelligence" && <HBIOptimizationIntelligence />}
        {selectedAnalysis === "opportunities" && <OptimizationOpportunities />}
        {selectedAnalysis === "resources" && <ResourceOptimizationAnalysis />}
        {selectedAnalysis === "compression" && <ScheduleCompressionAnalysis />}
      </div>
    </div>
  )
}

export default OptimizationPanel
