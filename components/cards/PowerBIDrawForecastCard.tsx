/**
 * @fileoverview Power BI Draw Forecast Card Component
 * @module PowerBIDrawForecastCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Power BI embedded visualization showing draw forecasting analytics and performance
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
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
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import {
  DollarSign,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Calendar,
  Target,
  AlertCircle,
  BarChart3,
  ExternalLink,
  Activity,
  TrendingDown,
  ChevronRight,
} from "lucide-react"

interface PowerBIDrawForecastCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function PowerBIDrawForecastCard({ config, span, isCompact, userRole }: PowerBIDrawForecastCardProps) {
  const [isRealTime, setIsRealTime] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        return {
          currentMonthForecast: 2850000,
          actualAmount: 2650000,
          variance: -200000,
          forecastAccuracy: 93.0,
          nextMonthForecast: 3200000,
          totalYearForecast: 28500000,
          actualYTD: 24800000,
          forecastMethods: { manual: 35, bellCurve: 45, linear: 20 },
          monthlyTrend: [
            { month: "Jan", forecasted: 2400000, actual: 2300000, accuracy: 95.8 },
            { month: "Feb", forecasted: 2600000, actual: 2450000, accuracy: 94.2 },
            { month: "Mar", forecasted: 2800000, actual: 2650000, accuracy: 94.6 },
            { month: "Apr", forecasted: 2850000, actual: 2650000, accuracy: 93.0 },
          ],
          categoryBreakdown: [
            { category: "Labor", forecasted: 1200000, actual: 1150000, variance: -50000 },
            { category: "Materials", forecasted: 950000, actual: 920000, variance: -30000 },
            { category: "Equipment", forecasted: 450000, actual: 380000, variance: -70000 },
            { category: "Subcontractors", forecasted: 250000, actual: 200000, variance: -50000 },
          ],
        }
      case "project-executive":
        return {
          currentMonthForecast: 15800000,
          actualAmount: 14500000,
          variance: -1300000,
          forecastAccuracy: 91.8,
          nextMonthForecast: 17200000,
          totalYearForecast: 185000000,
          actualYTD: 168000000,
          forecastMethods: { manual: 40, bellCurve: 35, linear: 25 },
          monthlyTrend: [
            { month: "Jan", forecasted: 14200000, actual: 13800000, accuracy: 97.2 },
            { month: "Feb", forecasted: 15100000, actual: 14200000, accuracy: 94.0 },
            { month: "Mar", forecasted: 15500000, actual: 14800000, accuracy: 95.5 },
            { month: "Apr", forecasted: 15800000, actual: 14500000, accuracy: 91.8 },
          ],
          categoryBreakdown: [
            { category: "Labor", forecasted: 6800000, actual: 6200000, variance: -600000 },
            { category: "Materials", forecasted: 4200000, actual: 3900000, variance: -300000 },
            { category: "Equipment", forecasted: 2800000, actual: 2400000, variance: -400000 },
            { category: "Subcontractors", forecasted: 2000000, actual: 2000000, variance: 0 },
          ],
        }
      default:
        return {
          currentMonthForecast: 28500000,
          actualAmount: 25800000,
          variance: -2700000,
          forecastAccuracy: 90.5,
          nextMonthForecast: 31200000,
          totalYearForecast: 325000000,
          actualYTD: 295000000,
          forecastMethods: { manual: 42, bellCurve: 33, linear: 25 },
          monthlyTrend: [
            { month: "Jan", forecasted: 26200000, actual: 25100000, accuracy: 95.8 },
            { month: "Feb", forecasted: 27400000, actual: 25800000, accuracy: 94.2 },
            { month: "Mar", forecasted: 28100000, actual: 26200000, accuracy: 93.2 },
            { month: "Apr", forecasted: 28500000, actual: 25800000, accuracy: 90.5 },
          ],
          categoryBreakdown: [
            { category: "Labor", forecasted: 12500000, actual: 11200000, variance: -1300000 },
            { category: "Materials", forecasted: 8200000, actual: 7600000, variance: -600000 },
            { category: "Equipment", forecasted: 4800000, actual: 4100000, variance: -700000 },
            { category: "Subcontractors", forecasted: 3000000, actual: 2900000, variance: -100000 },
          ],
        }
    }
  }

  const data = getDataByRole()

  // Forecast methods pie chart data
  const methodsData = useMemo(
    () => [
      { name: "Manual", value: data.forecastMethods.manual, color: "#3b82f6" },
      { name: "Bell Curve", value: data.forecastMethods.bellCurve, color: "#10b981" },
      { name: "Linear", value: data.forecastMethods.linear, color: "#f59e0b" },
    ],
    [data.forecastMethods]
  )

  // Handle real-time updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setLastUpdated(new Date())
    setTimeout(() => setIsRefreshing(false), 1000)
  }

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
    <Card className="h-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Power BI Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle className="text-lg font-semibold">Draw Forecast Analytics</CardTitle>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              Power BI
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRealTime(!isRealTime)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isRealTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isRealTime ? "bg-green-400" : "bg-gray-400"}`} />
            <span className="text-xs opacity-90">{isRealTime ? "Live" : "Paused"}</span>
          </div>
          <span className="text-xs opacity-75">Updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {formatCurrency(data.currentMonthForecast)}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Current Forecast</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(data.actualAmount)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Actual Amount</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className={`text-2xl font-bold ${getVarianceColor(data.variance)}`}>
              {formatCurrency(data.variance)}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Variance</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <div className={`text-2xl font-bold ${getAccuracyColor(data.forecastAccuracy)}`}>
              {formatPercentage(data.forecastAccuracy)}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Accuracy</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Forecast vs Actual Trend */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
              Forecast vs Actual Trend
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    formatCurrency(value),
                    name === "forecasted" ? "Forecasted" : "Actual",
                  ]}
                />
                <Bar dataKey="forecasted" fill="#3b82f6" name="forecasted" opacity={0.7} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  name="actual"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Methods Distribution */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-600" />
              Forecast Methods
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={methodsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  innerRadius={30}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {methodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-orange-600" />
            Category Performance
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.categoryBreakdown} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip
                formatter={(value: any, name: string) => [
                  formatCurrency(value),
                  name === "forecasted" ? "Forecasted" : "Actual",
                ]}
              />
              <Bar dataKey="forecasted" fill="#8b5cf6" name="forecasted" opacity={0.7} />
              <Bar dataKey="actual" fill="#10b981" name="actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Next Month</span>
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {formatCurrency(data.nextMonthForecast)}
            </div>
            <div className="text-xs text-muted-foreground">Projected Draw</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">YTD Progress</span>
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {formatPercentage((data.actualYTD / data.totalYearForecast) * 100)}
            </div>
            <Progress value={(data.actualYTD / data.totalYearForecast) * 100} className="mt-2" />
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Accuracy Score</span>
            </div>
            <div className={`text-xl font-bold ${getAccuracyColor(data.forecastAccuracy)}`}>
              {formatPercentage(data.forecastAccuracy)}
            </div>
            <Progress value={data.forecastAccuracy} className="mt-2" />
          </div>
        </div>
      </CardContent>

      {/* Power BI Footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-xs text-muted-foreground">Powered by Microsoft Power BI</span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-6 px-2 hover:bg-gray-200 dark:hover:bg-gray-800">
            <ExternalLink className="h-3 w-3 mr-1" />
            Open in Power BI
          </Button>
        </div>
      </div>
    </Card>
  )
}
