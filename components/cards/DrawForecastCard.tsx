"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, ChevronRight, Calendar, Target, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DrawForecastCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function DrawForecastCard({ config, span, isCompact, userRole }: DrawForecastCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          currentMonthForecast: 2850000,
          actualAmount: 2650000,
          variance: -200000, // under forecast
          forecastAccuracy: 93.0,
          nextMonthForecast: 3200000,
          totalYearForecast: 28500000,
          actualYTD: 24800000,
          forecastMethods: { manual: 35, bellCurve: 45, linear: 20 },
          drillDown: {
            largestVariance: { category: "General Conditions", amount: -150000 },
            bestAccuracy: { category: "MEP", accuracy: 97.5 },
            forecastTrend: "Stable",
            methodPerformance: "Bell Curve leading",
            upcomingDraw: 3200000,
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          currentMonthForecast: 15800000,
          actualAmount: 14500000,
          variance: -1300000, // under forecast
          forecastAccuracy: 91.8,
          nextMonthForecast: 17200000,
          totalYearForecast: 185000000,
          actualYTD: 168000000,
          forecastMethods: { manual: 40, bellCurve: 35, linear: 25 },
          drillDown: {
            largestVariance: { category: "Structural Steel", amount: -850000 },
            bestAccuracy: { category: "Electrical", accuracy: 95.2 },
            forecastTrend: "Improving",
            methodPerformance: "Manual leading",
            upcomingDraw: 17200000,
          },
        }
      default:
        // Executive - all projects
        return {
          currentMonthForecast: 28500000,
          actualAmount: 25800000,
          variance: -2700000, // under forecast
          forecastAccuracy: 90.5,
          nextMonthForecast: 31200000,
          totalYearForecast: 325000000,
          actualYTD: 295000000,
          forecastMethods: { manual: 42, bellCurve: 33, linear: 25 },
          drillDown: {
            largestVariance: { category: "MEP Systems", amount: -1500000 },
            bestAccuracy: { category: "Site Work", accuracy: 94.8 },
            forecastTrend: "Variable",
            methodPerformance: "Mixed results",
            upcomingDraw: 31200000,
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

  const getVarianceColor = (variance: number) => {
    return variance < 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-green-600 dark:text-green-400"
    if (accuracy >= 90) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div
      className="h-full flex flex-col bg-transparent overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-transparent border-b border-border/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              {formatCurrency(data.currentMonthForecast)}
            </div>
            <div className="text-sm text-indigo-600 dark:text-indigo-400">Current Forecast</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getAccuracyColor(data.forecastAccuracy)}`}>
              {formatPercentage(data.forecastAccuracy)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Current Month Performance */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Current Month</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Forecasted</span>
              <span className="font-medium">{formatCurrency(data.currentMonthForecast)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Actual</span>
              <span className="font-medium">{formatCurrency(data.actualAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Variance</span>
              <span className={`font-medium ${getVarianceColor(data.variance)}`}>{formatCurrency(data.variance)}</span>
            </div>
          </div>
        </div>

        {/* Next Month Forecast */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Next Month</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {formatCurrency(data.nextMonthForecast)}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Projected draw amount</div>
        </div>

        {/* Year to Date */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Year to Date</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Forecasted</span>
              <span className="font-medium">{formatCurrency(data.totalYearForecast)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Actual</span>
              <span className="font-medium">{formatCurrency(data.actualYTD)}</span>
            </div>
            <Progress value={(data.actualYTD / data.totalYearForecast) * 100} className="h-2" />
          </div>
        </div>

        {/* Forecast Methods */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Forecast Methods</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Manual</span>
              <Badge variant="outline" className="text-sm">
                {data.forecastMethods.manual}%
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bell Curve</span>
              <Badge variant="outline" className="text-sm">
                {data.forecastMethods.bellCurve}%
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Linear</span>
              <Badge variant="outline" className="text-sm">
                {data.forecastMethods.linear}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Accuracy Score */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Forecast Accuracy</span>
          </div>
          <div className="space-y-3">
            <Progress value={data.forecastAccuracy} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Performance</span>
              <Badge
                className={`${
                  getAccuracyColor(data.forecastAccuracy) === "text-green-600 dark:text-green-400"
                    ? "bg-green-100 text-green-700"
                    : getAccuracyColor(data.forecastAccuracy) === "text-yellow-600 dark:text-yellow-400"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {formatPercentage(data.forecastAccuracy)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <ChevronRight className="h-5 w-5" style={{ color: "#FA4616" }} />
              <span className="font-semibold text-lg">Forecast Deep Dive</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Best Category:</span>
                <span className="font-medium text-green-300">{data.drillDown.bestAccuracy.category}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Accuracy:</span>
                <span className="font-medium">{formatPercentage(data.drillDown.bestAccuracy.accuracy)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Largest Variance:</span>
                <span className="font-medium text-red-300">{data.drillDown.largestVariance.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Amount:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.largestVariance.amount)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <div className="text-sm font-medium text-gray-200 mb-3">Performance Insights</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Trend:</span>
                  <span className="font-medium">{data.drillDown.forecastTrend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Method Performance:</span>
                  <span className="font-medium">{data.drillDown.methodPerformance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Next Draw:</span>
                  <span className="font-medium text-blue-300">{formatCurrency(data.drillDown.upcomingDraw)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
