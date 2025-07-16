"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Bar,
} from "recharts"
import { Brain, Activity, TrendingUp, Zap, Cpu, Database, CloudLightning, Target } from "lucide-react"

// Mock Power BI data
const pipelinePerformance = [
  { time: "00:00", jobs: 12, success: 11, failures: 1, avgTime: 450 },
  { time: "04:00", jobs: 18, success: 17, failures: 1, avgTime: 420 },
  { time: "08:00", jobs: 34, success: 32, failures: 2, avgTime: 380 },
  { time: "12:00", jobs: 45, success: 43, failures: 2, avgTime: 350 },
  { time: "16:00", jobs: 52, success: 49, failures: 3, avgTime: 360 },
  { time: "20:00", jobs: 28, success: 27, failures: 1, avgTime: 390 },
]

const modelPerformance = [
  { model: "GPT-4", accuracy: 94, speed: 85, reliability: 98, cost: 72 },
  { model: "Claude-3", accuracy: 91, speed: 92, reliability: 95, cost: 68 },
  { model: "Llama-2", accuracy: 87, speed: 96, reliability: 89, cost: 45 },
  { model: "Gemini", accuracy: 89, speed: 88, reliability: 93, cost: 58 },
]

const resourceUtilization = [
  { resource: "GPU", current: 78, max: 100, cost: 45000 },
  { resource: "CPU", current: 34, max: 100, cost: 12000 },
  { resource: "Memory", current: 67, max: 100, cost: 8500 },
  { resource: "Storage", current: 23, max: 100, cost: 3200 },
]

const jobTypes = [
  { type: "Document Analysis", count: 847, avgTime: 280, successRate: 96.2 },
  { type: "Cost Estimation", count: 623, avgTime: 450, successRate: 94.8 },
  { type: "Risk Assessment", count: 445, avgTime: 620, successRate: 91.3 },
  { type: "Schedule Optimization", count: 298, avgTime: 890, successRate: 88.7 },
]

interface BetaAiPipelineStatusProps {
  className?: string
  isCompact?: boolean
}

function CardShell({ title, children, isCompact }: { title: string; children: React.ReactNode; isCompact?: boolean }) {
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

  return (
    <Card className="h-full">
      <CardHeader className={compactScale.paddingCard}>
        <CardTitle className={`flex items-center ${compactScale.gap} ${compactScale.textTitle} font-semibold`}>
          <Brain className={compactScale.iconSize} style={{ color: "#FA4616" }} />
          {title}
          <Badge variant="outline" className={`ml-auto ${compactScale.textSmall}`}>
            <Activity className={`${compactScale.iconSizeSmall} mr-0.5`} />
            Power BI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className={isCompact ? "pt-0 p-2" : "pt-0"}>{children}</CardContent>
    </Card>
  )
}

export default function BetaAiPipelineStatus({ isCompact }: BetaAiPipelineStatusProps) {
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

  const totalJobs = pipelinePerformance.reduce((acc, item) => acc + item.jobs, 0)
  const totalSuccess = pipelinePerformance.reduce((acc, item) => acc + item.success, 0)
  const successRate = ((totalSuccess / totalJobs) * 100).toFixed(1)

  return (
    <CardShell title="AI Pipeline Status" isCompact={isCompact}>
      <div className={`h-full ${isCompact ? "space-y-2" : "space-y-4"}`}>
        {/* Key Metrics */}
        <div className={`grid grid-cols-4 ${isCompact ? "gap-2" : "gap-3"}`}>
          <div
            className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg ${compactScale.padding} border border-blue-200 dark:border-blue-800`}
          >
            <div className={`flex items-center ${compactScale.gap} ${isCompact ? "mb-0.5" : "mb-1"}`}>
              <Zap className={`${compactScale.iconSizeSmall} text-blue-600`} />
              <span className={`${compactScale.textSmall} font-medium`}>Active Jobs</span>
            </div>
            <div className={`${isCompact ? "text-lg" : "text-xl"} font-bold text-blue-700 dark:text-blue-300`}>47</div>
            <div className={`${compactScale.textSmall} text-blue-600 dark:text-blue-400`}>Running now</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Success Rate</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">{successRate}%</div>
            <div className="text-xs text-green-600 dark:text-green-400">Last 24h</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">GPU Usage</span>
            </div>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-300">78%</div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Current</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-1">
              <CloudLightning className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium">Monthly Cost</span>
            </div>
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300">$68.7K</div>
            <div className="text-xs text-orange-600 dark:text-orange-400">This month</div>
          </div>
        </div>

        {/* Pipeline Performance Chart */}
        <div className={`${compactScale.chartHeight}`}>
          <div className="text-sm font-medium mb-2">Pipeline Performance (24h)</div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pipelinePerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area yAxisId="left" type="monotone" dataKey="jobs" fill="#3B82F6" fillOpacity={0.3} stroke="#3B82F6" />
              <Line yAxisId="right" type="monotone" dataKey="avgTime" stroke="#F59E0B" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Model Performance Radar Chart */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40">
            <div className="text-sm font-medium mb-2">Model Performance</div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={modelPerformance}>
                <PolarGrid />
                <PolarAngleAxis dataKey="model" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Accuracy" dataKey="accuracy" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Radar name="Speed" dataKey="speed" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Resource Utilization */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Resource Utilization</div>
            {resourceUtilization.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-blue-600" />
                  <span className="text-sm font-medium">{resource.resource}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={resource.current} className="w-16 h-2" />
                  <span className="text-xs text-muted-foreground">{resource.current}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Types */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Job Types & Performance</div>
          <div className="grid grid-cols-2 gap-2">
            {jobTypes.map((job, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                <div className="text-sm font-medium">{job.type}</div>
                <div className="text-xs text-muted-foreground">
                  {job.count} jobs • {job.successRate}% success
                </div>
                <div className="text-xs text-green-600">{job.avgTime}ms avg</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardShell>
  )
}
