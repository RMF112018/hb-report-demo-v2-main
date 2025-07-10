"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3 } from "lucide-react"

interface BudgetVarianceCardProps {
  budgetedAmount: number
  actualAmount: number
  remainingAmount: number
  projectId: string
  className?: string
}

export function BudgetVarianceCard({
  budgetedAmount,
  actualAmount,
  remainingAmount,
  projectId,
  className,
}: BudgetVarianceCardProps) {
  const spentPercentage = Math.min((actualAmount / budgetedAmount) * 100, 100)
  const variance = actualAmount - budgetedAmount
  const variancePercentage = (variance / budgetedAmount) * 100
  const isOverBudget = actualAmount > budgetedAmount

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium">Budget vs Actual</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Visualization */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Budget Progress</span>
            <span className="font-medium">{spentPercentage.toFixed(1)}%</span>
          </div>
          <Progress
            value={spentPercentage}
            className={`h-3 ${isOverBudget ? "[&>div]:bg-red-500" : "[&>div]:bg-blue-500"}`}
          />
        </div>

        {/* Budget Breakdown */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="text-sm font-semibold">${(budgetedAmount / 1000000).toFixed(1)}M</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Actual Spent</p>
            <p className="text-sm font-semibold">${(actualAmount / 1000000).toFixed(1)}M</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className={`text-sm font-semibold ${remainingAmount < 0 ? "text-red-600" : "text-green-600"}`}>
              ${(Math.abs(remainingAmount) / 1000000).toFixed(1)}M{remainingAmount < 0 ? " over" : ""}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Variance</p>
            <p
              className={`text-sm font-semibold ${
                variance > 0 ? "text-red-600" : variance < 0 ? "text-green-600" : "text-muted-foreground"
              }`}
            >
              {variance > 0 ? "+" : ""}${(Math.abs(variance) / 1000000).toFixed(1)}M
              <span className="ml-1 text-xs">
                ({variancePercentage > 0 ? "+" : ""}
                {variancePercentage.toFixed(1)}%)
              </span>
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isOverBudget
                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  : spentPercentage > 90
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {isOverBudget ? "Over Budget" : spentPercentage > 90 ? "Near Limit" : "On Track"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
