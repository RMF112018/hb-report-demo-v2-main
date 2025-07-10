"use client"

import { useState } from "react"
import { Package, TrendingDown, ChevronRight, Clock, DollarSign, CheckCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ProcurementCardProps {
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

export default function ProcurementCard({ config, span, isCompact, userRole }: ProcurementCardProps) {
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
      className="h-full flex flex-col bg-transparent overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Stats */}
      <div className="flex-shrink-0 p-4 bg-transparent border-b border-border/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {data.contractsExecuted}/{data.totalContracts}
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400">Executed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
              {formatPercentage(data.executionRate)}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Rate</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Contract Value */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Contract Value</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatCurrency(data.totalContractValue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {formatCurrency(data.pendingValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Value Engineering */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Value Engineering</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(data.veSavings)}
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">Savings</Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {data.drillDown.veApproved} approved, {data.drillDown.vePending} pending
          </div>
        </div>

        {/* Allowance Management */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Allowances</span>
          </div>
          <div className="flex items-center justify-between">
            <div className={`text-2xl font-bold ${getVarianceColor(data.allowanceVariance)}`}>
              {formatCurrency(Math.abs(data.allowanceVariance))}
            </div>
            <Badge className={data.allowanceVariance < 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
              {data.allowanceVariance < 0 ? "Under" : "Over"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {data.drillDown.allowancesReconciled} reconciled items
          </div>
        </div>

        {/* Long Lead Items */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Long Lead Items</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">On Schedule</span>
              <span className={`text-lg font-bold ${getLeadTimeColor(data.longLeadOnTime, data.longLeadItems)}`}>
                {data.longLeadOnTime}/{data.longLeadItems}
              </span>
            </div>
            <Progress value={(data.longLeadOnTime / data.longLeadItems) * 100} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Lead Time</span>
              <span className="font-medium">{data.avgLeadTime} days</span>
            </div>
          </div>
        </div>

        {/* Execution Progress */}
        <div className="bg-transparent rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">Execution Progress</span>
          </div>
          <div className="space-y-3">
            <Progress value={data.executionRate} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <Badge className="bg-green-100 text-green-700">{formatPercentage(data.executionRate)}</Badge>
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
                <span className="font-medium text-amber-300">{data.drillDown.largestContract.title}</span>
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
