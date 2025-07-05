"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, ChevronRight, Droplets, Calendar, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts"

interface CashFlowCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function CashFlowCard({ config, span, isCompact, userRole }: CashFlowCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view - Palm Beach Luxury Estate
        return {
          totalInflows: 53476271.19,
          totalOutflows: 45261264.55,
          netCashFlow: 8215006.64,
          workingCapital: 9732503.32,
          currentMonthFlow: 347467.29,
          forecastAccuracy: 93.2,
          cashFlowAtRisk: 0,
          projectsPositive: 1,
          projectsNegative: 0,
          cashIn: 53476271.19,
          cashOut: 45261264.55,
          projectedCashFlow: 8500000,
          operatingCashFlow: 7800000,
          investmentCashFlow: 415006.64,
          daysCashOnHand: 45,
          drillDown: {
            largestInflow: { project: "Palm Beach Luxury Estate", amount: 1783577.35 },
            largestOutflow: { project: "Palm Beach Luxury Estate", amount: 1436110.06 },
            avgMonthlyFlow: 685834.22,
            peakRequirement: 132675.42,
            retentionHeld: 281284.6,
            flowTrend: "Improving",
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          totalInflows: 285480000,
          totalOutflows: 242850000,
          netCashFlow: 42630000,
          workingCapital: 48200000,
          currentMonthFlow: 2850000,
          forecastAccuracy: 91.8,
          cashFlowAtRisk: 1250000,
          projectsPositive: 5,
          projectsNegative: 2,
          cashIn: 285480000,
          cashOut: 242850000,
          projectedCashFlow: 45000000,
          operatingCashFlow: 40000000,
          investmentCashFlow: 2630000,
          daysCashOnHand: 67,
          drillDown: {
            largestInflow: { project: "Medical Center East", amount: 8500000 },
            largestOutflow: { project: "Tech Campus Phase 2", amount: 6200000 },
            avgMonthlyFlow: 3560000,
            peakRequirement: 2850000,
            retentionHeld: 8540000,
            flowTrend: "Stable",
          },
        }
      default:
        // Executive - all projects
        return {
          totalInflows: 485280000,
          totalOutflows: 412450000,
          netCashFlow: 72830000,
          workingCapital: 82500000,
          currentMonthFlow: 4850000,
          forecastAccuracy: 89.5,
          cashFlowAtRisk: 2800000,
          projectsPositive: 8,
          projectsNegative: 4,
          cashIn: 485280000,
          cashOut: 412450000,
          projectedCashFlow: 78000000,
          operatingCashFlow: 68000000,
          investmentCashFlow: 4830000,
          daysCashOnHand: 89,
          drillDown: {
            largestInflow: { project: "Medical Center East", amount: 12500000 },
            largestOutflow: { project: "Tech Campus Phase 2", amount: 8900000 },
            avgMonthlyFlow: 6080000,
            peakRequirement: 4850000,
            retentionHeld: 15200000,
            flowTrend: "Strong Growth",
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

  const getFlowColor = (flow: number) => {
    return flow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const getFlowIcon = (flow: number) => {
    return flow >= 0 ? (
      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
    )
  }

  const chartData = [
    { name: "Jan", value: 4 },
    { name: "Feb", value: 3 },
    { name: "Mar", value: 2 },
    { name: "Apr", value: 5 },
    { name: "May", value: 7 },
    { name: "Jun", value: 6 },
    { name: "Jul", value: 8 },
  ]

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
            <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
              {formatCurrency(data.netCashFlow)}
            </div>
            <div className="text-sm text-cyan-600 dark:text-cyan-400">Net Cash Flow</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{data.forecastAccuracy}%</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Chart */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Cash Flow Trend</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0891b2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Analysis */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Cash Analysis</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cash In</span>
              <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(data.cashIn)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cash Out</span>
              <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(data.cashOut)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border/20">
              <span className="text-muted-foreground">Net Flow</span>
              <span
                className={`font-medium ${
                  data.netCashFlow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatCurrency(data.netCashFlow)}
              </span>
            </div>
          </div>
        </div>

        {/* Forecast Summary */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Forecast</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-transparent rounded border border-border/20">
              <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{data.forecastAccuracy}%</div>
              <div className="text-xs text-blue-600 dark:text-blue-300">Accuracy</div>
            </div>
            <div className="text-center p-3 bg-transparent rounded border border-border/20">
              <div className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                {formatCurrency(data.projectedCashFlow)}
              </div>
              <div className="text-xs text-cyan-600 dark:text-cyan-300">Next Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-center text-white animate-in fade-in duration-200 z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" style={{ color: "#FA4616" }} />
                <span className="font-semibold text-lg">Cash Flow Analysis</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Operating Cash:</span>
                <span className="font-medium">{formatCurrency(data.operatingCashFlow)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Investment Cash:</span>
                <span className="font-medium">{formatCurrency(data.investmentCashFlow)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Days Cash on Hand:</span>
                <span className="font-medium">{data.daysCashOnHand} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Working Capital:</span>
                <span className="font-medium">{formatCurrency(data.workingCapital)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
