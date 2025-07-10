"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart } from "@/components/charts/AreaChart"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CashFlowChartCardProps {
  projectId: string
  timeframe?: "30d" | "90d" | "1y"
  className?: string
}

export function CashFlowChartCard({ projectId, timeframe = "90d", className }: CashFlowChartCardProps) {
  // Mock data - replace with actual project data
  const cashFlowData = [
    { name: "Jan", value: 130000 },
    { name: "Feb", value: 140000 },
    { name: "Mar", value: 210000 },
    { name: "Apr", value: 130000 },
    { name: "May", value: 280000 },
    { name: "Jun", value: 170000 },
  ]

  // Calculate trend
  const currentMonth = cashFlowData[cashFlowData.length - 1]?.value || 0
  const previousMonth = cashFlowData[cashFlowData.length - 2]?.value || 0
  const trend = currentMonth > previousMonth ? "up" : "down"
  const trendPercentage = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">Cash Flow Trend</CardTitle>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Last 6 months</span>
            <span>•</span>
            <span>Project #{projectId}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trendPercentage > 0 ? "+" : ""}
            {trendPercentage.toFixed(1)}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[180px] w-full">
          <AreaChart
            data={cashFlowData}
            color="rgb(59, 130, 246)"
            showGrid={true}
            showDots={false}
            animated={true}
            compact={true}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-sm font-semibold">${(currentMonth / 1000).toFixed(0)}K</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-sm font-semibold">
              ${(cashFlowData.reduce((sum, item) => sum + item.value, 0) / cashFlowData.length / 1000).toFixed(0)}K
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Peak</p>
            <p className="text-sm font-semibold">
              ${(Math.max(...cashFlowData.map((item) => item.value)) / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
