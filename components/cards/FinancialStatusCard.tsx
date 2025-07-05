"use client"

import { useState } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  BarChart3,
  ChevronRight,
  CreditCard,
  Eye,
  Target,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from "recharts"

interface FinancialStatusCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function FinancialStatusCard({ config, span, isCompact, userRole }: FinancialStatusCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          originalContractValue: 57235491,
          currentApprovedValue: 58100000,
          originalProfit: 3434129,
          currentProfit: 3950000,
          potentialTotalProfit: 4150000,
          profitMargin: 6.8,
          profitVariance: 515871, // profit increase
          contractVariance: 864509, // contract value increase
          profitHealthScore: 88,
          drillDown: {
            cashFlow: { positive: 1, negative: 0, neutral: 0 },
            billing: { outstanding: 2850000, overdue: 0, collected: 95.2 },
            changeOrders: { approved: 3, pending: 1, value: 864509 },
            topProfitProject: "Tropical World Nursery",
            riskProjects: [],
            workingCapital: 3200000,
            dso: 35, // days sales outstanding
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          originalContractValue: 285480000,
          currentApprovedValue: 289920000,
          originalProfit: 17128800,
          currentProfit: 19750000,
          potentialTotalProfit: 20850000,
          profitMargin: 6.8,
          profitVariance: 2621200, // profit increase
          contractVariance: 4440000, // contract value increase
          profitHealthScore: 86,
          drillDown: {
            cashFlow: { positive: 5, negative: 1, neutral: 1 },
            billing: { outstanding: 8200000, overdue: 1200000, collected: 91.8 },
            changeOrders: { approved: 9, pending: 4, value: 4440000 },
            topProfitProject: "Medical Center East",
            riskProjects: ["Tech Campus Phase 2"],
            workingCapital: 12800000,
            dso: 38, // days sales outstanding
          },
        }
      default:
        // Executive - all projects
        return {
          originalContractValue: 485280000,
          currentApprovedValue: 492150000,
          originalProfit: 28654000,
          currentProfit: 31250000,
          potentialTotalProfit: 33150000,
          profitMargin: 6.4,
          profitVariance: 2596000, // profit increase
          contractVariance: 6870000, // contract value increase
          profitHealthScore: 85,
          drillDown: {
            cashFlow: { positive: 8, negative: 2, neutral: 2 },
            billing: { outstanding: 12500000, overdue: 2800000, collected: 89.5 },
            changeOrders: { approved: 15, pending: 7, value: 6870000 },
            topProfitProject: "Medical Center East",
            riskProjects: ["Tech Campus Phase 2", "Riverside Plaza"],
            workingCapital: 18500000,
            dso: 42, // days sales outstanding
          },
        }
    }
  }

  const data = getDataByRole()

  // Chart data for performance visualization
  const chartData = [
    { name: "Q1", value: data.profitMargin * 0.8 },
    { name: "Q2", value: data.profitMargin * 0.9 },
    { name: "Q3", value: data.profitMargin * 1.1 },
    { name: "Q4", value: data.profitMargin },
  ]

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

  const getProfitChangeIcon = (variance: number) => {
    return variance >= 0 ? (
      <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
    )
  }

  const getProfitChangeColor = (variance: number) => {
    return variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div
      className="h-full flex flex-col bg-transparent overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-transparent">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPercentage(data.profitMargin)}
            </div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300 mt-1">Profit Margin</div>
          </div>
          <div className="text-center p-3 bg-transparent">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.profitHealthScore}</div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mt-1">Health Score</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Chart and Analysis */}
        <div className="bg-transparent rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Financial Performance</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-transparent rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Revenue</span>
            </div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {formatCurrency(data.currentApprovedValue)}
            </div>
            <div className="text-xs text-muted-foreground">Current Value</div>
          </div>

          <div className="bg-transparent rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Profit</span>
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(data.currentProfit)}
            </div>
            <div className="text-xs text-muted-foreground">{formatPercentage(data.profitMargin)} margin</div>
          </div>
        </div>

        {/* Contract Value */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Contract Value</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original</span>
              <span className="font-medium">{formatCurrency(data.originalContractValue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">{formatCurrency(data.currentApprovedValue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Variance</span>
              <span className={`font-medium ${getProfitChangeColor(data.contractVariance)}`}>
                +{formatCurrency(data.contractVariance)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Profit Analysis</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original</span>
              <span className="font-medium">{formatCurrency(data.originalProfit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium">{formatCurrency(data.currentProfit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(data.potentialTotalProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* Profit Variance */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Profit Change</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getProfitChangeIcon(data.profitVariance)}
              <span className={`text-lg font-bold ${getProfitChangeColor(data.profitVariance)}`}>
                {formatCurrency(data.profitVariance)}
              </span>
            </div>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 text-xs">
              +{formatPercentage((data.profitVariance / data.originalProfit) * 100)}
            </Badge>
          </div>
        </div>

        {/* Details Toggle Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDetails}
            className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Eye className="h-3 w-3 mr-1" />
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </div>

      {/* Click-triggered Detail Overlay */}
      {showDetails && (
        <div className="absolute inset-0 bg-gray-900/96 dark:bg-gray-950/96 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 text-orange-400" />
                <span className="font-semibold text-lg text-orange-400">Financial Deep Dive</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDetails}
                className="h-8 w-8 p-0 text-gray-200 hover:text-white"
              >
                ×
              </Button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Cash Flow Positive:</span>
                <span className="font-medium text-white">{data.drillDown.cashFlow.positive} Projects</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Outstanding Billing:</span>
                <span className="font-medium text-white">{formatCurrency(data.drillDown.billing.outstanding)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Collection Rate:</span>
                <span className="font-medium text-white">{formatPercentage(data.drillDown.billing.collected)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Change Orders:</span>
                <span className="font-medium text-white">
                  {data.drillDown.changeOrders.approved} Approved ({formatCurrency(data.drillDown.changeOrders.value)})
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-300">Working Capital:</span>
                <span className="font-medium text-white">{formatCurrency(data.drillDown.workingCapital)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Days Sales Outstanding:</span>
                <span className="font-medium text-white">{data.drillDown.dso} days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
