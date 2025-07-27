"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Treemap,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity,
  Target,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Award,
  Zap,
  Building,
  FileText,
  MessageSquare,
  Download,
  RefreshCw,
  Settings,
  Info,
} from "lucide-react"

interface ScoreDistributionData {
  category: string
  score: number
  maxScore: number
  weight: number
  benchmark?: number
  target?: number
}

interface TrendData {
  date: string
  score: number
  reviews: number
  issues: number
  resolutionRate: number
  targetScore?: number
  benchmarkScore?: number
}

interface ReviewerPerformanceData {
  reviewer: string
  reviews: number
  averageScore: number
  completionTime: number
  issuesIdentified: number
  issuesResolved: number
  efficiency: number
}

interface StageAnalysisData {
  stage: string
  reviews: number
  averageScore: number
  averageTime: number
  issueRate: number
  successRate: number
  color: string
}

interface IssueAnalysisData {
  category: string
  count: number
  severity: {
    low: number
    medium: number
    high: number
    critical: number
  }
  avgResolutionTime: number
  resolutionRate: number
  costImpact: number
}

interface BenchmarkData {
  metric: string
  current: number
  target: number
  industry: number
  previousPeriod: number
}

interface ConstructabilityChartsProps {
  scoreDistribution?: ScoreDistributionData[]
  trendData?: TrendData[]
  reviewerPerformance?: ReviewerPerformanceData[]
  stageAnalysis?: StageAnalysisData[]
  issueAnalysis?: IssueAnalysisData[]
  benchmarkData?: BenchmarkData[]
  className?: string
}

// Color schemes for charts
const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  teal: "#14B8A6",
  orange: "#F97316",
  gray: "#6B7280",
  success: "#22C55E",
  muted: "#94A3B8",
}

const CHART_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.warning,
  COLORS.danger,
  COLORS.info,
  COLORS.purple,
  COLORS.pink,
  COLORS.indigo,
  COLORS.teal,
  COLORS.orange,
]

// Score Distribution Radar Chart
export const ScoreRadarChart: React.FC<{ data: ScoreDistributionData[] }> = ({ data }) => {
  const radarData = data.map((item) => ({
    category: item.category.replace(/([A-Z])/g, " $1").trim(),
    score: item.score,
    benchmark: item.benchmark || 7.5,
    target: item.target || 8.5,
    fullMark: item.maxScore,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Score Distribution Analysis
        </CardTitle>
        <CardDescription>Comprehensive breakdown of review scores across all categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
            <Radar
              name="Current Score"
              dataKey="score"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke={COLORS.secondary}
              fill="none"
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke={COLORS.warning}
              fill="none"
              strokeWidth={2}
              strokeDasharray="3,3"
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Trend Analysis Line Chart
export const TrendAnalysisChart: React.FC<{ data: TrendData[] }> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Trends
        </CardTitle>
        <CardDescription>Score and review volume trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" domain={[0, 10]} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="score"
              fill={COLORS.primary}
              fillOpacity={0.3}
              stroke={COLORS.primary}
              strokeWidth={2}
              name="Average Score"
            />

            <Bar yAxisId="right" dataKey="reviews" fill={COLORS.secondary} fillOpacity={0.6} name="Review Count" />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="targetScore"
              stroke={COLORS.warning}
              strokeWidth={2}
              strokeDasharray="5,5"
              name="Target Score"
              dot={false}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="benchmarkScore"
              stroke={COLORS.danger}
              strokeWidth={2}
              strokeDasharray="3,3"
              name="Industry Benchmark"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Reviewer Performance Scatter Chart
export const ReviewerPerformanceChart: React.FC<{ data: ReviewerPerformanceData[] }> = ({ data }) => {
  const scatterData = data.map((item) => ({
    ...item,
    efficiency: Math.round(item.efficiency * 100) / 100,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Reviewer Performance Matrix
        </CardTitle>
        <CardDescription>Performance analysis by reviewer (Score vs Efficiency)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="averageScore"
              name="Average Score"
              domain={[0, 10]}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis
              type="number"
              dataKey="efficiency"
              name="Efficiency"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value, name) => [
                name === "efficiency" ? `${value}%` : value,
                name === "averageScore" ? "Score" : "Efficiency",
              ]}
              labelFormatter={(label) => `Reviewer: ${label}`}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 border rounded shadow">
                      <p className="font-medium">{data.reviewer}</p>
                      <p className="text-sm">Reviews: {data.reviews}</p>
                      <p className="text-sm">Avg Score: {data.averageScore.toFixed(1)}</p>
                      <p className="text-sm">Efficiency: {data.efficiency}%</p>
                      <p className="text-sm">
                        Issues: {data.issuesIdentified}/{data.issuesResolved}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Scatter
              name="Reviewers"
              dataKey="efficiency"
              fill={COLORS.primary}
              stroke={COLORS.primary}
              strokeWidth={2}
              r={6}
            />
            <ReferenceLine x={7.5} stroke={COLORS.warning} strokeDasharray="5,5" />
            <ReferenceLine y={75} stroke={COLORS.warning} strokeDasharray="5,5" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Stage Analysis Funnel Chart
export const StageAnalysisChart: React.FC<{ data: StageAnalysisData[] }> = ({ data }) => {
  const funnelData = data.map((item, index) => ({
    ...item,
    value: item.reviews,
    fill: item.color || CHART_COLORS[index % CHART_COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Review Distribution by Stage
        </CardTitle>
        <CardDescription>Analysis of review performance across project stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList position="center" fill="#fff" stroke="none" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.stage} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color || CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium text-sm">{item.stage}</p>
                    <p className="text-xs text-muted-foreground">{item.reviews} reviews</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.averageScore.toFixed(1)}/10</p>
                  <p className="text-xs text-muted-foreground">{item.successRate}% success</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Issue Analysis Treemap
export const IssueAnalysisChart: React.FC<{ data: IssueAnalysisData[] }> = ({ data }) => {
  const treemapData = data.map((item) => ({
    name: item.category,
    size: item.count,
    count: item.count,
    resolutionRate: item.resolutionRate,
    costImpact: item.costImpact,
    fill: item.count > 10 ? COLORS.danger : item.count > 5 ? COLORS.warning : COLORS.info,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Issue Categories Analysis
        </CardTitle>
        <CardDescription>Distribution and impact of identified issues</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={({ root, depth, x, y, width, height, index, payload, colors, name }) => {
              if (depth === 1) {
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: payload.fill,
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {name}
                    </text>
                    <text x={x + width / 2} y={y + height / 2 + 15} textAnchor="middle" fill="#fff" fontSize={10}>
                      {payload.count} issues
                    </text>
                  </g>
                )
              }
              return null
            }}
          />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Benchmark Comparison Chart
export const BenchmarkComparisonChart: React.FC<{ data: BenchmarkData[] }> = ({ data }) => {
  const chartData = data.map((item) => ({
    ...item,
    currentVsTarget: ((item.current - item.target) / item.target) * 100,
    currentVsIndustry: ((item.current - item.industry) / item.industry) * 100,
    improvement: ((item.current - item.previousPeriod) / item.previousPeriod) * 100,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Performance Benchmarks
        </CardTitle>
        <CardDescription>Comparison against targets and industry standards</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="metric" width={120} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) => [
                `${value.toFixed(1)}%`,
                name === "currentVsTarget" ? "vs Target" : name === "currentVsIndustry" ? "vs Industry" : "Improvement",
              ]}
            />
            <Legend />
            <Bar dataKey="currentVsTarget" fill={COLORS.primary} name="vs Target" />
            <Bar dataKey="currentVsIndustry" fill={COLORS.secondary} name="vs Industry" />
            <Bar dataKey="improvement" fill={COLORS.warning} name="Period Improvement" />
            <ReferenceLine x={0} stroke={COLORS.gray} strokeDasharray="3,3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Score Distribution Donut Chart
export const ScoreDonutChart: React.FC<{ data: ScoreDistributionData[] }> = ({ data }) => {
  const donutData = data.map((item, index) => ({
    name: item.category.replace(/([A-Z])/g, " $1").trim(),
    value: (item.score * item.weight) / 100,
    weight: item.weight,
    actualScore: item.score,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }))

  const totalWeightedScore = donutData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Weighted Score Contribution
        </CardTitle>
        <CardDescription>How each category contributes to the overall score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value.toFixed(1)} points`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center mt-4">
              <p className="text-2xl font-bold text-primary">{totalWeightedScore.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
          <div className="space-y-2">
            {donutData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.actualScore.toFixed(1)}/10</p>
                  <p className="text-xs text-muted-foreground">{item.weight}% weight</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Resolution Time Analysis
export const ResolutionTimeChart: React.FC<{ data: IssueAnalysisData[] }> = ({ data }) => {
  const chartData = data.map((item) => ({
    category: item.category,
    avgTime: item.avgResolutionTime,
    resolutionRate: item.resolutionRate,
    count: item.count,
    costImpact: item.costImpact,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Issue Resolution Analysis
        </CardTitle>
        <CardDescription>Average resolution time and success rate by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} interval={0} />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip
              formatter={(value, name) => [
                name === "resolutionRate" ? `${value}%` : name === "avgTime" ? `${value} days` : value,
                name === "avgTime" ? "Avg Resolution Time" : name === "resolutionRate" ? "Resolution Rate" : name,
              ]}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="avgTime" fill={COLORS.primary} name="Avg Resolution Time (days)" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="resolutionRate"
              stroke={COLORS.secondary}
              strokeWidth={3}
              name="Resolution Rate (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Main Charts Container
export const ConstructabilityCharts: React.FC<ConstructabilityChartsProps> = ({
  scoreDistribution = [],
  trendData = [],
  reviewerPerformance = [],
  stageAnalysis = [],
  issueAnalysis = [],
  benchmarkData = [],
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="stages">Stages</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {scoreDistribution.length > 0 && <ScoreRadarChart data={scoreDistribution} />}
            {scoreDistribution.length > 0 && <ScoreDonutChart data={scoreDistribution} />}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {trendData.length > 0 && <TrendAnalysisChart data={trendData} />}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {reviewerPerformance.length > 0 && <ReviewerPerformanceChart data={reviewerPerformance} />}
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          {stageAnalysis.length > 0 && <StageAnalysisChart data={stageAnalysis} />}
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {issueAnalysis.length > 0 && <IssueAnalysisChart data={issueAnalysis} />}
            {issueAnalysis.length > 0 && <ResolutionTimeChart data={issueAnalysis} />}
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          {benchmarkData.length > 0 && <BenchmarkComparisonChart data={benchmarkData} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConstructabilityCharts
