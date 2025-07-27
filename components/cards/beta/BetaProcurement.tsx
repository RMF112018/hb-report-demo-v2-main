"use client"

import { useState } from "react"
import { Package, TrendingDown, ChevronRight, Clock, DollarSign, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface BetaProcurementProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaProcurement({ config, span, isCompact, userRole }: BetaProcurementProps) {
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

  const [isHovered, setIsHovered] = useState(false)

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        // Single project view
        return {
          totalContracts: 28,
          contractsExecuted: 18,
          totalContractValue: 57235491,
          pendingValue: 12850000,
          veSavings: 185000,
          allowanceVariance: -45000, // savings
          longLeadItems: 8,
          longLeadOnTime: 6,
          executionRate: 64.3,
          avgLeadTime: 89,
          drillDown: {
            largestContract: { title: "CONVENTIONAL FRAMING", amount: 6819886.91 },
            criticalItems: ["MEP Rough-in", "Steel Delivery"],
            veApproved: 3,
            vePending: 2,
            allowancesReconciled: 5,
            procurementTrend: "On Track",
          },
        }
      case "project-executive":
        // Limited to 7 projects
        return {
          totalContracts: 142,
          contractsExecuted: 89,
          totalContractValue: 285480000,
          pendingValue: 42800000,
          veSavings: 850000,
          allowanceVariance: -185000, // savings
          longLeadItems: 34,
          longLeadOnTime: 28,
          executionRate: 62.7,
          avgLeadTime: 95,
          drillDown: {
            largestContract: { title: "MEP SYSTEMS", amount: 28500000 },
            criticalItems: ["Steel Delivery", "Glazing Systems", "MEP Equipment"],
            veApproved: 12,
            vePending: 8,
            allowancesReconciled: 28,
            procurementTrend: "Accelerating",
          },
        }
      default:
        // Executive - all projects
        return {
          totalContracts: 285,
          contractsExecuted: 178,
          totalContractValue: 485280000,
          pendingValue: 82500000,
          veSavings: 1425000,
          allowanceVariance: -285000, // savings
          longLeadItems: 68,
          longLeadOnTime: 52,
          executionRate: 62.5,
          avgLeadTime: 98,
          drillDown: {
            largestContract: { title: "STRUCTURAL STEEL", amount: 48500000 },
            criticalItems: ["Steel Delivery", "Glazing Systems", "MEP Equipment", "Elevators"],
            veApproved: 24,
            vePending: 15,
            allowancesReconciled: 58,
            procurementTrend: "Strong Pipeline",
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

  const getLeadTimeColor = (onTime: number, total: number) => {
    const percentage = (onTime / total) * 100
    if (percentage >= 85) return "text-green-600 dark:text-green-400"
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div
      className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Compact Header with HB Orange Theme */}
      <div className="flex-shrink-0 px-4 pt-3 pb-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-b border-orange-200 dark:border-orange-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" style={{ color: "#FA4616" }} />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Procurement</span>
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400">
            {userRole === "project-manager" ? "Project Contracts" : "Portfolio Contracts"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {/* Header Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300" style={{ color: "#FA4616" }}>
              {data.contractsExecuted}/{data.totalContracts}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Executed</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
            <div className="text-xl font-bold text-orange-700 dark:text-orange-300" style={{ color: "#FA4616" }}>
              {formatPercentage(data.executionRate)}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">Rate</div>
          </div>
        </div>

        {/* Contract Value */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" style={{ color: "#FA4616" }} />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Contract Value</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-orange-600 dark:text-orange-400">Total</span>
              <span className="font-medium text-orange-800 dark:text-orange-200">
                {formatCurrency(data.totalContractValue)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-orange-600 dark:text-orange-400">Pending</span>
              <span className="font-medium text-orange-800 dark:text-orange-200">
                {formatCurrency(data.pendingValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Value Engineering */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" style={{ color: "#FA4616" }} />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Value Engineering</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">{formatCurrency(data.veSavings)}</div>
            <Badge className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5">Savings</Badge>
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {data.drillDown.veApproved} approved, {data.drillDown.vePending} pending
          </div>
        </div>

        {/* Allowance Management */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" style={{ color: "#FA4616" }} />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Allowances</span>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-lg font-bold ${getVarianceColor(data.allowanceVariance)}`}>
              {formatCurrency(Math.abs(data.allowanceVariance))}
            </div>
            <Badge
              className={`text-xs px-1.5 py-0.5 ${
                data.allowanceVariance < 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {data.allowanceVariance < 0 ? "Under" : "Over"}
            </Badge>
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {data.drillDown.allowancesReconciled} reconciled items
          </div>
        </div>

        {/* Long Lead Items */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" style={{ color: "#FA4616" }} />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Long Lead Items</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-orange-600 dark:text-orange-400">On Schedule</span>
              <span className={`text-lg font-bold ${getLeadTimeColor(data.longLeadOnTime, data.longLeadItems)}`}>
                {data.longLeadOnTime}/{data.longLeadItems}
              </span>
            </div>
            <Progress value={(data.longLeadOnTime / data.longLeadItems) * 100} className="h-2" />
            <div className="flex justify-between text-xs">
              <span className="text-orange-600 dark:text-orange-400">Avg Lead Time</span>
              <span className="font-medium text-orange-800 dark:text-orange-200">{data.avgLeadTime} days</span>
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
              <span className="font-semibold text-lg">Procurement Analysis</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Largest Contract:</span>
                <span className="font-medium text-orange-300">{data.drillDown.largestContract.title}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">Value:</span>
                <span className="font-medium">{formatCurrency(data.drillDown.largestContract.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-700/30 pb-2">
                <span className="text-gray-200">VE Savings:</span>
                <span className="font-medium text-green-300">{formatCurrency(data.veSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-200">Trend:</span>
                <span className="font-medium text-green-300">{data.drillDown.procurementTrend}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4" style={{ color: "#FA4616" }} />
                <span className="text-sm font-medium text-gray-200">Critical Items</span>
              </div>
              <div className="space-y-2">
                {data.drillDown.criticalItems.map((item, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>{item}</span>
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
