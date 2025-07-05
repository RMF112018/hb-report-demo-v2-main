"use client"

import { useState } from "react"
import { Shield, TrendingDown, PiggyBank, AlertCircle, Percent, ChevronRight, Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ContingencyAnalysisCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function ContingencyAnalysisCard({ config, span, isCompact, userRole }: ContingencyAnalysisCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          originalContingency: 860000, // single project
          currentContingency: 825000,
          contingencyUsed: 35000,
          contingencyUtilization: 4.1, // percentage
          totalBuyoutSavings: 125000,
          hbcSavingsShare: 62500, // 50% share
          projectsWithSavings: 1,
          contingencyRisk: "Low", // Low, Medium, High
          avgContingencyPercent: 1.5,
          drillDown: {
            riskCategories: {
              design: { allocated: 215000, used: 15000, risk: "Low" },
              scope: { allocated: 172000, used: 20000, risk: "Low" },
              market: { allocated: 129000, used: 0, risk: "Low" },
            },
            topSavingsProject: "Tropical World Nursery",
            highestUsage: "N/A",
            buyoutCategories: ["MEP", "Steel"],
            projectedSavings: 185000,
            riskTrends: "Stable",
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          originalContingency: 2850000, // 7 projects
          currentContingency: 2750000,
          contingencyUsed: 100000,
          contingencyUtilization: 3.5, // percentage
          totalBuyoutSavings: 285000,
          hbcSavingsShare: 142500, // 50% share
          projectsWithSavings: 5,
          contingencyRisk: "Low", // Low, Medium, High
          avgContingencyPercent: 1.7,
          drillDown: {
            riskCategories: {
              design: { allocated: 712500, used: 30000, risk: "Low" },
              scope: { allocated: 570000, used: 45000, risk: "Medium" },
              market: { allocated: 427500, used: 25000, risk: "Low" },
            },
            topSavingsProject: "Medical Center East",
            highestUsage: "Tech Campus Phase 2",
            buyoutCategories: ["Steel", "MEP", "Concrete"],
            projectedSavings: 380000,
            riskTrends: "Decreasing",
          },
        }
      default:
        // Executive - all projects
        return {
          originalContingency: 4800000, // sum across projects
          currentContingency: 4650000,
          contingencyUsed: 150000,
          contingencyUtilization: 3.1, // percentage
          totalBuyoutSavings: 485000,
          hbcSavingsShare: 242500, // 50% share
          projectsWithSavings: 8,
          contingencyRisk: "Low", // Low, Medium, High
          avgContingencyPercent: 1.8,
          drillDown: {
            riskCategories: {
              design: { allocated: 1200000, used: 45000, risk: "Low" },
              scope: { allocated: 960000, used: 65000, risk: "Medium" },
              market: { allocated: 720000, used: 40000, risk: "Low" },
            },
            topSavingsProject: "Medical Center East",
            highestUsage: "Tech Campus Phase 2",
            buyoutCategories: ["Steel", "MEP", "Concrete"],
            projectedSavings: 650000,
            riskTrends: "Decreasing",
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

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
      default:
        return "bg-muted text-foreground"
    }
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
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatPercentage(data.contingencyUtilization)}
            </div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Utilized</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getRiskColor(data.contingencyRisk)}`}>{data.contingencyRisk}</div>
            <div className="text-sm font-medium text-muted-foreground">Risk Level</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Contingency Status */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Contingency Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original</span>
              <span className="font-medium">{formatCurrency(data.originalContingency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining</span>
              <span className="font-medium">{formatCurrency(data.currentContingency)}</span>
            </div>
            <Progress value={100 - data.contingencyUtilization} className="h-2" />
          </div>
        </div>

        {/* Buyout Savings */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Buyout Savings</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Savings</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(data.totalBuyoutSavings)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">HBC Share (50%)</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatCurrency(data.hbcSavingsShare)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Projects with Savings</span>
              <Badge variant="outline" className="text-xs">
                {data.projectsWithSavings}
              </Badge>
            </div>
          </div>
        </div>

        {/* Utilization Analysis */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Utilization Analysis</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Used to Date</span>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(data.contingencyUsed)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg % of Contract</span>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 text-xs">
                {formatPercentage(data.avgContingencyPercent)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Risk Assessment</span>
          </div>
          <div className="text-center">
            <Badge className={`${getRiskBadge(data.contingencyRisk)} text-sm px-3 py-1`}>
              {data.contingencyRisk} Risk
            </Badge>
            <div className="text-xs text-muted-foreground mt-2">Based on utilization rate and project complexity</div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Performance</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-transparent">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatPercentage(96.9)}</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">Available</div>
            </div>
            <div className="text-center p-3 bg-transparent">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(data.hbcSavingsShare)}
              </div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Net Benefit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Drill-Down Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gray-900/96 dark:bg-gray-950/96 backdrop-blur-sm p-4 flex flex-col justify-center text-white animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <ChevronRight className="h-5 w-5 text-orange-400" />
              <span className="font-semibold text-lg text-orange-400">Risk & Savings Analysis</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Best Savings:</span>
                <span className="font-medium text-green-400">{data.drillDown.topSavingsProject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Highest Usage:</span>
                <span className="font-medium text-yellow-400">{data.drillDown.highestUsage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Projected Savings:</span>
                <span className="font-medium text-green-400">{formatCurrency(data.drillDown.projectedSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Risk Trend:</span>
                <span className="font-medium text-green-400">{data.drillDown.riskTrends}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Risk Categories</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Design Risk:</span>
                  <span className="text-green-400">
                    {formatPercentage(
                      (data.drillDown.riskCategories.design.used / data.drillDown.riskCategories.design.allocated) * 100
                    )}{" "}
                    used
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Scope Risk:</span>
                  <span className="text-yellow-400">
                    {formatPercentage(
                      (data.drillDown.riskCategories.scope.used / data.drillDown.riskCategories.scope.allocated) * 100
                    )}{" "}
                    used
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Market Risk:</span>
                  <span className="text-green-400">
                    {formatPercentage(
                      (data.drillDown.riskCategories.market.used / data.drillDown.riskCategories.market.allocated) * 100
                    )}{" "}
                    used
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-700">
              <div className="text-sm font-medium text-orange-400 mb-3">Top Buyout Categories</div>
              <div className="space-y-2">
                {data.drillDown.buyoutCategories.map((category, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-white">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
