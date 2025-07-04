"use client"

import { useEffect, useState } from "react"
import { AreaChart } from "@/components/charts/AreaChart"
// LineChart component will be used inline if needed
import {
  TrendingUp,
  DollarSign,
  CalendarCheck,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertTriangle,
  Target,
  TrendingDown,
  PieChart,
  Activity,
  Clock,
  Shield,
  Eye,
} from "lucide-react"
import { CustomBarChart } from "@/components/charts/BarChart"

// Import mock data
import projectsData from "@/data/mock/projects.json"
import budgetData from "@/data/mock/financial/budget.json"
import cashFlowData from "@/data/mock/financial/cash-flow.json"
import jchrData from "@/data/mock/financial/jchr.json"
import arAgingData from "@/data/mock/financial/ar-aging.json"

// Type definitions
interface BudgetSummary {
  totalBudget: number
  totalActual: number
  totalVariance: number
  commitments: number
}

interface CashFlowAnalysis {
  totalInflows: number
  totalOutflows: number
  netCashFlow: number
  workingCapital: number
  monthlyTrends: Array<{
    month: string
    inflow: number
    outflow: number
    net: number
  }>
}

interface CashFlowTrendData {
  name: string
  inflow: number
  outflow: number
  net: number
}

interface ArAnalysis {
  totalAR: number
  current: number
  days30: number
  days60: number
  days60Plus: number
  retainage: number
}

interface JobCostAnalysis {
  totalBudget: number
  totalActual: number
  totalVariance: number
  commitments: number
  concrete: number
  electrical: number
  plumbing: number
  other: number
}

interface FinancialData {
  budgetHealthScore: number
  forecastAccuracy: number
  scheduleHealthScore: number
  cashFlowRatio: number
  arHealthScore: number
  totalActiveValue: number
  budgetSummary: BudgetSummary
  cashFlowAnalysis: CashFlowAnalysis
  arAnalysis: ArAnalysis
  jobCostAnalysis: JobCostAnalysis
  activeProjects: any[]
}

interface ChartDataItem {
  name: string
  value: number
}

// Enhanced Props interface
export function FinancialReviewPanel({
  card,
  span,
}: {
  card?: { id: string; type: string; title: string }
  span: { cols: number; rows: number }
}) {
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "budget" | "cashflow" | "aging">("overview")

  // Comprehensive financial data processing
  const processFinancialData = (): FinancialData => {
    console.log("🏦 Processing comprehensive financial data...")

    // Active projects analysis
    const activeProjects = projectsData.filter((p) => p.active)
    const totalActiveValue = activeProjects.reduce((sum, p) => sum + p.total_value, 0)

    // Budget analysis from budget.json
    const budgetSummary: BudgetSummary = budgetData.reduce(
      (acc, item) => {
        acc.totalBudget += item["Revised Budget"]
        acc.totalActual += item["Job to Date Costs"]
        acc.totalVariance += item["Projected over Under"]
        acc.commitments += item["Committed Costs"]
        return acc
      },
      { totalBudget: 0, totalActual: 0, totalVariance: 0, commitments: 0 }
    )

    // Enhanced Cash flow analysis
    const cashFlowAnalysis: CashFlowAnalysis = cashFlowData.projects.reduce(
      (acc, project) => {
        acc.totalInflows += project.cashFlowData.summary.totalInflows
        acc.totalOutflows += project.cashFlowData.summary.totalOutflows
        acc.netCashFlow += project.cashFlowData.summary.netCashFlow
        acc.workingCapital += project.cashFlowData.summary.workingCapital

        // Monthly trends
        project.cashFlowData.monthlyData.forEach((month: any) => {
          acc.monthlyTrends.push({
            month: month.month,
            inflow: month.inflows.total,
            outflow: month.outflows.total,
            net: month.netCashFlow,
          })
        })
        return acc
      },
      {
        totalInflows: 0,
        totalOutflows: 0,
        netCashFlow: 0,
        workingCapital: 0,
        monthlyTrends: [] as Array<{
          month: string
          inflow: number
          outflow: number
          net: number
        }>,
      }
    )

    // AR Aging analysis
    const arAnalysis: ArAnalysis = arAgingData.reduce(
      (acc: ArAnalysis, item: any) => {
        acc.totalAR += item.total_ar
        acc.current += item.current
        acc.days30 += item.days_1_30
        acc.days60 += item.days_31_60
        acc.days60Plus += item.days_60_plus
        acc.retainage += item.retainage
        return acc
      },
      { totalAR: 0, current: 0, days30: 0, days60: 0, days60Plus: 0, retainage: 0 }
    )

    // Job Cost analysis enhanced
    const jobCostAnalysis: JobCostAnalysis = jchrData.reduce(
      (acc, project) => {
        project.jobCostItems.forEach((item: any) => {
          acc.totalBudget += item.budgetAmount
          acc.totalActual += item.actualCost
          acc.totalVariance += item.variance
          acc.commitments += item.commitments

          // Category analysis
          if (item.description.includes("CONCRETE")) acc.concrete += item.actualCost
          else if (item.description.includes("ELECTRICAL")) acc.electrical += item.actualCost
          else if (item.description.includes("PLUMBING")) acc.plumbing += item.actualCost
          else acc.other += item.actualCost
        })
        return acc
      },
      {
        totalBudget: 0,
        totalActual: 0,
        totalVariance: 0,
        commitments: 0,
        concrete: 0,
        electrical: 0,
        plumbing: 0,
        other: 0,
      }
    )

    // Calculate enhanced metrics
    const budgetHealthScore: number =
      budgetSummary.totalBudget > 0
        ? Math.max(0, Math.min(10, 10 - (Math.abs(budgetSummary.totalVariance) / budgetSummary.totalBudget) * 20))
        : 8.5

    const forecastAccuracy: number =
      cashFlowAnalysis.totalInflows > 0
        ? Math.max(0, Math.min(10, (cashFlowAnalysis.netCashFlow / cashFlowAnalysis.totalInflows) * 20 + 5))
        : 9.2

    const scheduleHealthScore: number =
      activeProjects.length > 0
        ? (activeProjects.reduce((acc, p) => acc + (p.active ? 1 : 0), 0) / activeProjects.length) * 10
        : 8.8

    const cashFlowRatio: number =
      cashFlowAnalysis.totalOutflows > 0 ? cashFlowAnalysis.totalInflows / cashFlowAnalysis.totalOutflows : 1.2

    const arHealthScore: number =
      arAnalysis.totalAR > 0 ? ((arAnalysis.current + arAnalysis.days30) / arAnalysis.totalAR) * 10 : 9.0

    return {
      budgetHealthScore,
      forecastAccuracy,
      scheduleHealthScore,
      cashFlowRatio,
      arHealthScore,
      totalActiveValue,
      budgetSummary,
      cashFlowAnalysis,
      arAnalysis,
      jobCostAnalysis,
      activeProjects,
    }
  }

  const financialData: FinancialData = processFinancialData()

  // Calculate responsive sizing
  const cardArea = span.cols * span.rows
  const getSizeClasses = () => {
    // Optimal area is 18x7 = 126
    const optimalArea = 126
    const scaleFactor = Math.min(Math.max(cardArea / optimalArea, 0.4), 1.5)

    const baseConfig = {
      padding: 12,
      headerPadding: 10,
      fontSize: 13,
      titleFontSize: 16,
      metricFontSize: 18,
      gap: 8,
      chartHeight: 140,
      iconSize: 16,
      borderRadius: 8,
    }

    const scaledConfig = {
      padding: Math.max(6, Math.round(baseConfig.padding * scaleFactor)),
      headerPadding: Math.max(4, Math.round(baseConfig.headerPadding * scaleFactor)),
      fontSize: Math.max(10, Math.round(baseConfig.fontSize * scaleFactor)),
      titleFontSize: Math.max(12, Math.round(baseConfig.titleFontSize * scaleFactor)),
      metricFontSize: Math.max(14, Math.round(baseConfig.metricFontSize * scaleFactor)),
      gap: Math.max(4, Math.round(baseConfig.gap * scaleFactor)),
      chartHeight: Math.max(80, Math.round(baseConfig.chartHeight * scaleFactor)),
      iconSize: Math.max(12, Math.round(baseConfig.iconSize * scaleFactor)),
      borderRadius: Math.max(4, Math.round(baseConfig.borderRadius * scaleFactor)),
      scaleFactor,
    }

    return {
      padding: `p-[${scaledConfig.padding}px]`,
      headerPadding: `p-[${scaledConfig.headerPadding}px]`,
      text: `text-[${scaledConfig.fontSize}px]`,
      titleText: `text-[${scaledConfig.titleFontSize}px]`,
      metricText: `text-[${scaledConfig.metricFontSize}px]`,
      gap: `gap-[${scaledConfig.gap}px]`,
      chartHeight: scaledConfig.chartHeight,
      iconSize: `h-[${scaledConfig.iconSize}px] w-[${scaledConfig.iconSize}px]`,
      borderRadius: `rounded-[${scaledConfig.borderRadius}px]`,
      showCharts: span.rows >= 4,
      showTabs: span.cols >= 12,
      columns: span.cols >= 16 ? 4 : span.cols >= 12 ? 3 : 2,
      scaleFactor,
    }
  }

  const sizeClasses = getSizeClasses()

  // Enhanced trend calculations
  const getTrendIcon = (value: number, threshold: { good: number; poor: number }) => {
    if (value >= threshold.good) return ArrowUpRight
    if (value <= threshold.poor) return ArrowDownRight
    return Minus
  }

  const getTrendColor = (value: number, threshold: { good: number; poor: number }) => {
    if (value >= threshold.good) return "text-green-600 dark:text-green-400"
    if (value <= threshold.poor) return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  const trends = {
    forecast: getTrendIcon(financialData.forecastAccuracy, { good: 8.5, poor: 7.5 }),
    budget: getTrendIcon(financialData.budgetHealthScore, { good: 8.0, poor: 7.0 }),
    schedule: getTrendIcon(financialData.scheduleHealthScore, { good: 9.0, poor: 8.0 }),
    cashflow: getTrendIcon(financialData.cashFlowRatio, { good: 1.15, poor: 1.05 }),
    ar: getTrendIcon(financialData.arHealthScore, { good: 8.5, poor: 7.0 }),
  }

  const trendColors = {
    forecast: getTrendColor(financialData.forecastAccuracy, { good: 8.5, poor: 7.5 }),
    budget: getTrendColor(financialData.budgetHealthScore, { good: 8.0, poor: 7.0 }),
    schedule: getTrendColor(financialData.scheduleHealthScore, { good: 9.0, poor: 8.0 }),
    cashflow: getTrendColor(financialData.cashFlowRatio, { good: 1.15, poor: 1.05 }),
    ar: getTrendColor(financialData.arHealthScore, { good: 8.5, poor: 7.0 }),
  }

  // Enhanced chart data
  const budgetVarianceData: ChartDataItem[] = [
    {
      name: "On Budget",
      value: Math.max(0, financialData.budgetSummary.totalBudget - Math.abs(financialData.budgetSummary.totalVariance)),
    },
    { name: "Over Budget", value: Math.max(0, financialData.budgetSummary.totalVariance) },
  ]

  const cashFlowTrendData: CashFlowTrendData[] = financialData.cashFlowAnalysis.monthlyTrends
    .slice(-6)
    .map((month: any) => ({
      name: month.month.substring(5),
      inflow: month.inflow / 1000000,
      outflow: month.outflow / 1000000,
      net: month.net / 1000000,
    }))

  const arAgingDataChart: ChartDataItem[] = [
    { name: "Current", value: financialData.arAnalysis.current },
    { name: "1-30 Days", value: financialData.arAnalysis.days30 },
    { name: "31-60 Days", value: financialData.arAnalysis.days60 },
    { name: "60+ Days", value: financialData.arAnalysis.days60Plus },
  ]

  const costBreakdownData: ChartDataItem[] = [
    { name: "Concrete", value: financialData.jobCostAnalysis.concrete / 1000000 },
    { name: "Electrical", value: financialData.jobCostAnalysis.electrical / 1000000 },
    { name: "Plumbing", value: financialData.jobCostAnalysis.plumbing / 1000000 },
    { name: "Other", value: financialData.jobCostAnalysis.other / 1000000 },
  ]

  // Format currency
  const formatCurrency = (value: number, short = false) => {
    if (short) {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  }

  return (
    <div className="relative h-full w-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Enhanced Header with Tabs */}
      {sizeClasses.showTabs && (
        <div className={`border-b border-gray-200 dark:border-gray-700 ${sizeClasses.headerPadding}`}>
          <div className="flex space-x-1">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "budget", label: "Budget", icon: Target },
              { key: "cashflow", label: "Cash Flow", icon: TrendingUp },
              { key: "aging", label: "AR Aging", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-2 ${sizeClasses.text} font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <tab.icon className={`${sizeClasses.iconSize} inline mr-2`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${sizeClasses.padding} overflow-hidden`}>
        {/* Key Metrics Row */}
        <div className={`grid grid-cols-${sizeClasses.columns} ${sizeClasses.gap} mb-4`}>
          {/* Budget Health */}
          <div
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
          >
            <div className={`flex items-center justify-between mb-2`}>
              <div className="flex items-center">
                <Target className={`${sizeClasses.iconSize} text-blue-600 dark:text-blue-400 mr-2`} />
                <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300`}>
                  Budget Health
                </span>
              </div>
              <trends.budget className={`h-4 w-4 ${trendColors.budget}`} />
            </div>
            <div className={`${sizeClasses.metricText} font-bold text-gray-900 dark:text-gray-100`}>
              {financialData.budgetHealthScore.toFixed(1)}/10
            </div>
            <div className={`${sizeClasses.text} text-gray-500 dark:text-gray-400`}>
              Variance: {formatCurrency(financialData.budgetSummary.totalVariance, true)}
            </div>
          </div>

          {/* Cash Flow Ratio */}
          <div
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
          >
            <div className={`flex items-center justify-between mb-2`}>
              <div className="flex items-center">
                <TrendingUp className={`${sizeClasses.iconSize} text-green-600 dark:text-green-400 mr-2`} />
                <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300`}>Cash Flow</span>
              </div>
              <trends.cashflow className={`h-4 w-4 ${trendColors.cashflow}`} />
            </div>
            <div className={`${sizeClasses.metricText} font-bold text-gray-900 dark:text-gray-100`}>
              {financialData.cashFlowRatio.toFixed(2)}:1
            </div>
            <div className={`${sizeClasses.text} text-gray-500 dark:text-gray-400`}>
              Net: {formatCurrency(financialData.cashFlowAnalysis.netCashFlow, true)}
            </div>
          </div>

          {/* AR Health */}
          <div
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
          >
            <div className={`flex items-center justify-between mb-2`}>
              <div className="flex items-center">
                <Clock className={`${sizeClasses.iconSize} text-purple-600 dark:text-purple-400 mr-2`} />
                <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300`}>AR Health</span>
              </div>
              <trends.ar className={`h-4 w-4 ${trendColors.ar}`} />
            </div>
            <div className={`${sizeClasses.metricText} font-bold text-gray-900 dark:text-gray-100`}>
              {financialData.arHealthScore.toFixed(1)}/10
            </div>
            <div className={`${sizeClasses.text} text-gray-500 dark:text-gray-400`}>
              Total: {formatCurrency(financialData.arAnalysis.totalAR, true)}
            </div>
          </div>

          {/* Schedule Performance */}
          {sizeClasses.columns >= 4 && (
            <div
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
            >
              <div className={`flex items-center justify-between mb-2`}>
                <div className="flex items-center">
                  <CalendarCheck className={`${sizeClasses.iconSize} text-indigo-600 dark:text-indigo-400 mr-2`} />
                  <span className={`${sizeClasses.text} font-medium text-gray-700 dark:text-gray-300`}>Schedule</span>
                </div>
                <trends.schedule className={`h-4 w-4 ${trendColors.schedule}`} />
              </div>
              <div className={`${sizeClasses.metricText} font-bold text-gray-900 dark:text-gray-100`}>
                {financialData.scheduleHealthScore.toFixed(1)}/10
              </div>
              <div className={`${sizeClasses.text} text-gray-500 dark:text-gray-400`}>
                {financialData.activeProjects.length} Active Projects
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {sizeClasses.showCharts && (
          <div className={`grid grid-cols-2 ${sizeClasses.gap} h-full`}>
            {activeTab === "overview" && (
              <>
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Budget Performance
                  </h4>
                  <div style={{ height: sizeClasses.chartHeight }}>
                    <CustomBarChart
                      data={budgetVarianceData}
                      colors={["#10b981", "#ef4444"]}
                      compact={true}
                      showGrid={true}
                      showValues={true}
                      animated={true}
                      height={sizeClasses.chartHeight}
                    />
                  </div>
                </div>

                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Cash Flow Trend
                  </h4>
                  <div style={{ height: sizeClasses.chartHeight }}>
                    <AreaChart data={cashFlowTrendData as any} color="hsl(var(--chart-2))" compact />
                  </div>
                </div>
              </>
            )}

            {activeTab === "budget" && (
              <>
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Cost Breakdown
                  </h4>
                  <div style={{ height: sizeClasses.chartHeight }}>
                    <CustomBarChart
                      data={costBreakdownData}
                      colors={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]}
                      compact={true}
                      showGrid={true}
                      showValues={true}
                      animated={true}
                      height={sizeClasses.chartHeight}
                    />
                  </div>
                </div>

                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Budget vs Actual
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Total Budget:</span>
                      <span className={`${sizeClasses.text} font-medium`}>
                        {formatCurrency(financialData.budgetSummary.totalBudget, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Actual Costs:</span>
                      <span className={`${sizeClasses.text} font-medium`}>
                        {formatCurrency(financialData.budgetSummary.totalActual, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Variance:</span>
                      <span
                        className={`${sizeClasses.text} font-medium ${
                          financialData.budgetSummary.totalVariance >= 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {formatCurrency(financialData.budgetSummary.totalVariance, true)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "cashflow" && (
              <>
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Monthly Cash Flow
                  </h4>
                  <div style={{ height: sizeClasses.chartHeight }}>
                    <AreaChart data={cashFlowTrendData as any} color="hsl(var(--chart-1))" compact />
                  </div>
                </div>

                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Cash Flow Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Total Inflows:</span>
                      <span className={`${sizeClasses.text} font-medium text-green-600`}>
                        {formatCurrency(financialData.cashFlowAnalysis.totalInflows, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Total Outflows:</span>
                      <span className={`${sizeClasses.text} font-medium text-red-600`}>
                        {formatCurrency(financialData.cashFlowAnalysis.totalOutflows, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Net Cash Flow:</span>
                      <span
                        className={`${sizeClasses.text} font-medium ${
                          financialData.cashFlowAnalysis.netCashFlow >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatCurrency(financialData.cashFlowAnalysis.netCashFlow, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Working Capital:</span>
                      <span className={`${sizeClasses.text} font-medium`}>
                        {formatCurrency(financialData.cashFlowAnalysis.workingCapital, true)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "aging" && (
              <>
                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    AR Aging Distribution
                  </h4>
                  <div style={{ height: sizeClasses.chartHeight }}>
                    <CustomBarChart
                      data={arAgingDataChart}
                      colors={["#10b981", "#f59e0b", "#ef4444", "#7c2d12"]}
                      compact={true}
                      showGrid={true}
                      showValues={true}
                      animated={true}
                      height={sizeClasses.chartHeight}
                    />
                  </div>
                </div>

                <div
                  className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${sizeClasses.borderRadius} ${sizeClasses.headerPadding}`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold mb-3 text-gray-900 dark:text-gray-100`}>
                    Collection Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Total AR:</span>
                      <span className={`${sizeClasses.text} font-medium`}>
                        {formatCurrency(financialData.arAnalysis.totalAR, true)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Current (0-30):</span>
                      <span className={`${sizeClasses.text} font-medium text-green-600`}>
                        {(
                          ((financialData.arAnalysis.current + financialData.arAnalysis.days30) /
                            financialData.arAnalysis.totalAR) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Past Due (60+):</span>
                      <span className={`${sizeClasses.text} font-medium text-red-600`}>
                        {((financialData.arAnalysis.days60Plus / financialData.arAnalysis.totalAR) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${sizeClasses.text} text-gray-600 dark:text-gray-400`}>Retainage:</span>
                      <span className={`${sizeClasses.text} font-medium`}>
                        {formatCurrency(financialData.arAnalysis.retainage, true)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
