"use client"

import { useState } from "react"
import { Wrench, TrendingUp, TrendingDown, Calculator, Target, ChevronRight, Settings, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts"

interface GeneralConditionsCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function GeneralConditionsCard({ config, span, isCompact, userRole }: GeneralConditionsCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          originalGCEstimate: 2294000, // single project
          currentGCEstimate: 2050000,
          gcVariance: -244000, // savings
          gcUtilizationRate: 89,
          projectsWithSavings: 1,
          projectsOverBudget: 0,
          avgSavingsPercent: 10.6,
          totalSavings: 244000,
          drillDown: {
            categories: {
              supervision: { budget: 850000, actual: 760000, variance: -90000 },
              equipment: { budget: 620000, actual: 580000, variance: -40000 },
              temporary: { budget: 480000, actual: 420000, variance: -60000 },
            },
            topSavingsProject: "Tropical World Nursery",
            biggestOverrun: "N/A",
            efficiencyGains: ["Prefab temporary structures", "Efficient supervision", "Equipment sharing"],
            avgCostPerSqFt: 11.8,
            benchmarkComparison: 15.2, // industry average
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          originalGCEstimate: 10654000, // 7 projects
          currentGCEstimate: 9250000,
          gcVariance: -1404000, // savings
          gcUtilizationRate: 87,
          projectsWithSavings: 5,
          projectsOverBudget: 1,
          avgSavingsPercent: 13.2,
          totalSavings: 1404000,
          drillDown: {
            categories: {
              supervision: { budget: 2650000, actual: 2400000, variance: -250000 },
              equipment: { budget: 1850000, actual: 1700000, variance: -150000 },
              temporary: { budget: 1600000, actual: 1450000, variance: -150000 },
            },
            topSavingsProject: "Medical Center East",
            biggestOverrun: "Tech Campus Phase 2",
            efficiencyGains: ["Prefab temporary structures", "Shared equipment fleet", "Optimized supervision"],
            avgCostPerSqFt: 12.2,
            benchmarkComparison: 15.2, // industry average
          },
        }
      default:
        // Executive - all projects
        return {
          originalGCEstimate: 18364000, // sum across projects
          currentGCEstimate: 15943000,
          gcVariance: -2421000, // savings
          gcUtilizationRate: 87,
          projectsWithSavings: 7,
          projectsOverBudget: 2,
          avgSavingsPercent: 13.2,
          totalSavings: 2421000,
          drillDown: {
            categories: {
              supervision: { budget: 4500000, actual: 4200000, variance: -300000 },
              equipment: { budget: 3200000, actual: 2950000, variance: -250000 },
              temporary: { budget: 2800000, actual: 2600000, variance: -200000 },
            },
            topSavingsProject: "Medical Center East",
            biggestOverrun: "Tech Campus Phase 2",
            efficiencyGains: ["Prefab temporary structures", "Shared equipment fleet", "Optimized supervision"],
            avgCostPerSqFt: 12.5,
            benchmarkComparison: 15.2, // industry average
          },
        }
    }
  }

  const data = getDataByRole()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getVarianceIcon = (variance: number) => {
    return variance < 0 ? (
      <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
    ) : (
      <TrendingUp className="h-3 w-3 text-red-600 dark:text-red-400" />
    )
  }

  const getVarianceColor = (variance: number) => {
    return variance < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const getVarianceBadge = (variance: number) => {
    return variance < 0
      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
  }

  const chartData = [
    { name: "Original", value: data.originalGCEstimate },
    { name: "Current", value: data.currentGCEstimate },
  ]

  return (
    <div
      className="h-full flex flex-col bg-transparent overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPercentage(data.avgSavingsPercent)}
            </div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">Avg Savings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.gcUtilizationRate}%</div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Utilization</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Cost Chart */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Cost Overview</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Variance Analysis */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Variance Analysis</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getVarianceIcon(data.gcVariance)}
              <span className={`text-lg font-bold ${getVarianceColor(data.gcVariance)}`}>
                {formatCurrency(Math.abs(data.gcVariance))}
              </span>
            </div>
            <Badge className={getVarianceBadge(data.gcVariance)}>{data.gcVariance < 0 ? "Savings" : "Overrun"}</Badge>
          </div>
          <div>
            <Progress value={data.gcUtilizationRate} className="h-2" />
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Project Performance</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-transparent">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{data.projectsWithSavings}</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Under Budget</div>
            </div>
            <div className="text-center p-3 bg-transparent">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{data.projectsOverBudget}</div>
              <div className="text-sm font-medium text-red-700 dark:text-red-300">Over Budget</div>
            </div>
          </div>
        </div>

        {/* Total Impact */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Total Impact</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.totalSavings)}
            </div>
            <div className="text-sm text-muted-foreground mb-2">Total Portfolio Savings</div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">
              {formatPercentage((Math.abs(data.gcVariance) / data.originalGCEstimate) * 100)} Reduction
            </Badge>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gray-900/96 dark:bg-gray-950/96 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-orange-400" />
                <span className="font-semibold text-lg text-orange-400">GC/GR Deep Analysis</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Original GC Budget:</span>
                <span className="font-medium text-white">{formatCurrency(data.originalGCEstimate)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Current GC Forecast:</span>
                <span className="font-medium text-white">{formatCurrency(data.currentGCEstimate)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Projects Under Budget:</span>
                <span className="font-medium text-green-400">{data.projectsWithSavings}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Projects Over Budget:</span>
                <span className="font-medium text-red-400">{data.projectsOverBudget}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Utilization Rate:</span>
                <span className="font-medium text-white">{data.gcUtilizationRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Net Savings:</span>
                <span className="font-medium text-green-400">{formatCurrency(Math.abs(data.gcVariance))}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
