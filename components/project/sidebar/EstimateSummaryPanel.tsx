// EstimateSummaryPanel.tsx
// Sidebar panel for summarizing Cost SummaryModule totals
// Usage: Place after ProjectOverviewPanel in SidebarPanelRenderer when CostSummaryModule is active

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, DollarSign, TrendingUp, Calendar } from "lucide-react"

export interface EstimateSummaryPanelProps {
  totalEstimate: number
  costCategoriesTotal: number
  generalConditionsTotal: number
  generalRequirementsTotal: number
  costPerMonth: number
  projectDuration: number // in months
}

export function EstimateSummaryPanel({
  totalEstimate,
  costCategoriesTotal,
  generalConditionsTotal,
  generalRequirementsTotal,
  costPerMonth,
  projectDuration = 9.75, // Default demo project duration
}: EstimateSummaryPanelProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  const formatCurrencyWithDecimals = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Card className="w-full mb-6 border-l-4 border-l-[#FA4616] bg-gradient-to-r from-[#FA4616]/5 to-transparent">
      <CardHeader className="px-6 !py-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" style={{ color: "#FA4616" }} />
            <div>
              <div className="text-sm font-semibold">Estimate Summary</div>
              <div className="text-xs text-muted-foreground">Cost breakdown overview</div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-[#0021A5]/20 text-[#0021A5]">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-4">
        <div className="space-y-4">
          {/* Total Estimate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Estimate</span>
              <span className="text-lg font-bold text-[#0021A5]">{formatCurrency(totalEstimate)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Per Month ({projectDuration} months)</span>
              <span className="font-medium">{formatCurrencyWithDecimals(costPerMonth)}</span>
            </div>
          </div>

          {/* Cost Categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cost Categories</span>
              <span className="text-sm font-semibold text-green-600">{formatCurrency(costCategoriesTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Per Month</span>
              <span>{formatCurrencyWithDecimals(costCategoriesTotal / projectDuration)}</span>
            </div>
          </div>

          {/* General Conditions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">General Conditions</span>
              <span className="text-sm font-semibold text-blue-600">{formatCurrency(generalConditionsTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Per Month</span>
              <span>{formatCurrencyWithDecimals(generalConditionsTotal / projectDuration)}</span>
            </div>
          </div>

          {/* General Requirements */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">General Requirements</span>
              <span className="text-sm font-semibold text-purple-600">{formatCurrency(generalRequirementsTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Per Month</span>
              <span>{formatCurrencyWithDecimals(generalRequirementsTotal / projectDuration)}</span>
            </div>
          </div>

          {/* Summary Bar */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Project Duration</span>
              <span className="font-medium">{projectDuration} months</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Monthly Average</span>
              <span className="font-medium text-[#FA4616]">{formatCurrencyWithDecimals(costPerMonth)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
