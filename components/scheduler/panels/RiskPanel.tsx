/**
 * @fileoverview Risk Panel - HBI-Powered Schedule Risk Analysis
 * @module RiskPanel
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive risk panel with HBI AI integration for Monte Carlo simulations,
 * what-if scenarios, forecasting, and critical path risk analysis
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
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Calendar,
  CloudRain,
  Users,
  Zap,
  Play,
  RefreshCw,
  Settings,
  Download,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Gauge,
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

interface RiskScenario {
  id: string
  name: string
  probability: number
  impact: number
  delayDays: number
  description: string
  mitigation: string
}

interface SimulationResult {
  scenario: string
  probability: number
  delayDays: number
  costImpact: number
  confidence: number
}

interface RiskPanelProps {
  currentKPIs: ScheduleMetric[]
  pinnedKPIs: string[]
  onPinKPI: (kpiLabel: string) => void
}

// Mock data for risk analysis
const riskScenarios: RiskScenario[] = [
  {
    id: "weather",
    name: "Extended Weather Delays",
    probability: 65,
    impact: 8,
    delayDays: 12,
    description: "Prolonged weather conditions affecting exterior work",
    mitigation: "Accelerate interior activities, weather protection",
  },
  {
    id: "resource",
    name: "Resource Shortage",
    probability: 45,
    impact: 9,
    delayDays: 18,
    description: "Critical trade shortage during peak construction",
    mitigation: "Pre-qualify backup contractors, early procurement",
  },
  {
    id: "permits",
    name: "Permit Delays",
    probability: 30,
    impact: 7,
    delayDays: 8,
    description: "Municipal approval delays for critical activities",
    mitigation: "Early permit applications, municipal liaison",
  },
  {
    id: "supply",
    name: "Supply Chain Disruption",
    probability: 55,
    impact: 6,
    delayDays: 10,
    description: "Material delivery delays from suppliers",
    mitigation: "Multiple supplier sources, early procurement",
  },
]

const monteCarloData = [
  { iteration: 1, completion: 365, probability: 15 },
  { iteration: 2, completion: 372, probability: 25 },
  { iteration: 3, completion: 368, probability: 35 },
  { iteration: 4, completion: 380, probability: 20 },
  { iteration: 5, completion: 375, probability: 30 },
  { iteration: 6, completion: 362, probability: 40 },
  { iteration: 7, completion: 385, probability: 15 },
  { iteration: 8, completion: 370, probability: 45 },
  { iteration: 9, completion: 378, probability: 25 },
  { iteration: 10, completion: 367, probability: 50 },
]

const criticalPathRisks = [
  { activity: "Foundation", baselineDays: 45, riskDays: 52, probability: 70, impact: "High" },
  { activity: "Structural Steel", baselineDays: 30, riskDays: 38, probability: 45, impact: "Critical" },
  { activity: "MEP Rough-in", baselineDays: 60, riskDays: 72, probability: 55, impact: "Medium" },
  { activity: "Exterior Envelope", baselineDays: 40, riskDays: 48, probability: 80, impact: "High" },
  { activity: "Interior Finishes", baselineDays: 35, riskDays: 39, probability: 35, impact: "Low" },
]

const weatherImpactData = [
  { month: "Jan", rainfall: 3.2, workDays: 18, riskLevel: 2 },
  { month: "Feb", rainfall: 2.8, workDays: 19, riskLevel: 1 },
  { month: "Mar", rainfall: 4.1, workDays: 20, riskLevel: 3 },
  { month: "Apr", rainfall: 3.7, workDays: 21, riskLevel: 2 },
  { month: "May", rainfall: 5.2, workDays: 19, riskLevel: 4 },
  { month: "Jun", rainfall: 4.8, workDays: 20, riskLevel: 3 },
]

// HBI Risk Analysis Component (simplified since header is now in main layout)
const HBIRiskAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Additional HBI Analysis Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Advanced Risk Analysis Tools
          </CardTitle>
          <p className="text-sm text-muted-foreground">Configure risk parameters and run custom analysis scenarios</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Risk Matrix
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Sensitivity Analysis
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Forecast
            </Button>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">HBI Recommendations</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Consider accelerating critical path activities by 5-7 days</li>
              <li>• Weather contingency buffer should be increased to 15 days</li>
              <li>• Resource allocation conflicts detected in weeks 12-16</li>
              <li>• Supply chain risk mitigation recommended for structural materials</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Monte Carlo Simulation Component
const MonteCarloSimulation: React.FC = () => {
  const [iterations, setIterations] = useState<number[]>([1000])
  const [isRunning, setIsRunning] = useState(false)

  const runMonteCarlo = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 4000)
  }

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Monte Carlo Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Iterations</label>
              <div className="space-y-2">
                <Slider
                  value={iterations}
                  onValueChange={setIterations}
                  max={10000}
                  min={100}
                  step={100}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{iterations[0].toLocaleString()} iterations</div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Risk Factors</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select factors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Factors</SelectItem>
                  <SelectItem value="weather">Weather Only</SelectItem>
                  <SelectItem value="resource">Resource Only</SelectItem>
                  <SelectItem value="supply">Supply Chain Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={runMonteCarlo} disabled={isRunning} className="w-full">
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Date Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">
            Probability distribution of project completion dates based on risk scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monteCarloData}>
                <defs>
                  <linearGradient id="probabilityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="completion" label={{ value: "Completion Day", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Probability (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Probability"]}
                  labelFormatter={(label: any) => `Day ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="probability"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fill="url(#probabilityGradient)"
                />
                <ReferenceLine x={365} stroke="#0021A5" strokeDasharray="5 5" label="Baseline" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">375d</div>
              <div className="text-xs text-muted-foreground">Mean Completion</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">365d</div>
              <div className="text-xs text-muted-foreground">P50 (Median)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">385d</div>
              <div className="text-xs text-muted-foreground">P80 Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">15d</div>
              <div className="text-xs text-muted-foreground">Risk Buffer Needed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Critical Path Risk Analysis
const CriticalPathAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            Critical Path Risk Assessment
          </CardTitle>
          <p className="text-sm text-muted-foreground">Activities with highest impact on project completion date</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalPathRisks.map((activity, index) => (
              <div key={activity.activity} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{activity.activity}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      activity.impact === "Critical"
                        ? "text-red-600 border-red-200"
                        : activity.impact === "High"
                        ? "text-orange-600 border-orange-200"
                        : activity.impact === "Medium"
                        ? "text-yellow-600 border-yellow-200"
                        : "text-green-600 border-green-200"
                    )}
                  >
                    {activity.impact} Impact
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Baseline:</span>
                    <div className="font-medium">{activity.baselineDays} days</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk Adjusted:</span>
                    <div className="font-medium text-red-600">{activity.riskDays} days</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Risk Delta:</span>
                    <div className="font-medium">+{activity.riskDays - activity.baselineDays} days</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Probability:</span>
                    <div className="font-medium">{activity.probability}%</div>
                  </div>
                </div>

                <Progress value={activity.probability} className="h-2 mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Weather Impact Forecasting
const WeatherImpactForecast: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-blue-600" />
            Weather Impact Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">Historical weather patterns and predictive impact modeling</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weatherImpactData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="workDays" fill="#0021A5" name="Work Days" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rainfall"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Rainfall (in)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="riskLevel"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Risk Level"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">18</div>
              <div className="text-xs text-muted-foreground">Avg Work Days/Month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">4.2"</div>
              <div className="text-xs text-muted-foreground">Avg Monthly Rainfall</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">25%</div>
              <div className="text-xs text-muted-foreground">Weather Risk Factor</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const RiskPanel: React.FC<RiskPanelProps> = ({ currentKPIs, pinnedKPIs, onPinKPI }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("hbi-analysis")

  // Analysis options for card navigation
  const analysisOptions = [
    {
      id: "hbi-analysis",
      title: "HBI Analysis",
      description: "AI-powered risk intelligence",
      icon: Brain,
      color: "from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      iconColor: "text-blue-600",
    },
    {
      id: "monte-carlo",
      title: "Monte Carlo",
      description: "Probabilistic simulations",
      icon: BarChart3,
      color: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      borderColor: "border-purple-200 dark:border-purple-700",
      iconColor: "text-purple-600",
    },
    {
      id: "critical-path",
      title: "Critical Path",
      description: "Activity risk assessment",
      icon: Target,
      color: "from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20",
      borderColor: "border-red-200 dark:border-red-700",
      iconColor: "text-red-600",
    },
    {
      id: "weather",
      title: "Weather Forecast",
      description: "Environmental impact modeling",
      icon: CloudRain,
      color: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      borderColor: "border-blue-200 dark:border-blue-700",
      iconColor: "text-blue-600",
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
                  "h-[100px] min-h-[100px] max-h-[100px]", // Fixed height for equal sizing
                  "flex flex-col justify-center", // Center content vertically
                  "overflow-hidden", // Prevent overflow
                  "relative" // For positioning the selection indicator
                )}
                onClick={() => setSelectedAnalysis(option.id)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  {/* Selection indicator dot */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                  <div
                    className={cn(
                      "p-2 rounded shadow-sm transition-all duration-200",
                      "flex-shrink-0", // Prevent icon container from shrinking
                      isSelected ? "bg-primary text-white shadow-md" : "bg-white/80 dark:bg-gray-800/80"
                    )}
                  >
                    <IconComponent className={cn("h-4 w-4", isSelected ? "text-white" : option.iconColor)} />
                  </div>
                  <div className="min-h-[32px] flex flex-col justify-center">
                    <div
                      className={cn(
                        "text-xs font-medium leading-tight line-clamp-2", // Limit text to 2 lines
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

        {/* Right Column: HBI Risk Intelligence Engine */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-700">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              HBI Risk Intelligence Engine
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-powered schedule risk analysis with predictive modeling and scenario planning
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <div className="text-xs text-muted-foreground">Confidence Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">12d</div>
                <div className="text-xs text-muted-foreground">Avg Risk Delay</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-xs text-muted-foreground">Mitigation Plans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2,500</div>
                <div className="text-xs text-muted-foreground">Simulations Run</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Panels */}
      <div className="space-y-6">
        {selectedAnalysis === "hbi-analysis" && (
          <div className="space-y-6">
            {/* Risk Scenarios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskScenarios.map((scenario) => (
                <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{scenario.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          scenario.probability > 60
                            ? "text-red-600 border-red-200"
                            : scenario.probability > 40
                            ? "text-yellow-600 border-yellow-200"
                            : "text-green-600 border-green-200"
                        )}
                      >
                        {scenario.probability}% Risk
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Potential Delay:</span>
                        <span className="font-medium">{scenario.delayDays} days</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Impact Level:</span>
                        <span className="font-medium">{scenario.impact}/10</span>
                      </div>
                      <Progress value={scenario.probability} className="h-2" />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-2">
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">HBI Mitigation</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">{scenario.mitigation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {selectedAnalysis === "monte-carlo" && <MonteCarloSimulation />}
        {selectedAnalysis === "critical-path" && <CriticalPathAnalysis />}
        {selectedAnalysis === "weather" && <WeatherImpactForecast />}
      </div>
    </div>
  )
}

export default RiskPanel
