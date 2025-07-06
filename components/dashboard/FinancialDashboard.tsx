"use client"

import React, { useState, useEffect } from "react"
import { FinancialMetricCard } from "@/components/cards/financial/FinancialMetricCard"
import { BudgetVarianceCard } from "@/components/cards/financial/BudgetVarianceCard"
import { CashFlowChartCard } from "@/components/cards/financial/CashFlowChartCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface FinancialDashboardProps {
  projectId: string
  projectData: any
  userRole: string
}

export function FinancialDashboard({ projectId, projectData, userRole }: FinancialDashboardProps) {
  const [financialData, setFinancialData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock financial data - replace with actual API call
  useEffect(() => {
    const loadFinancialData = async () => {
      // Simulate API call
      setTimeout(() => {
        setFinancialData({
          totalBudget: 2850000,
          actualSpent: 1950000,
          remainingBudget: 900000,
          monthlyBurn: 325000,
          projectedCompletion: 2750000,
          costPerformanceIndex: 0.95,
          schedulePerformanceIndex: 1.02,
          earnedValue: 1850000,
          plannedValue: 1815000,
          actualCost: 1950000,
          forecastAtCompletion: 2895000,
          varianceAtCompletion: -45000,
          payApplications: {
            pending: 3,
            approved: 12,
            totalValue: 1750000,
          },
          changeOrders: {
            pending: 2,
            approved: 8,
            totalValue: 125000,
          },
          invoices: {
            outstanding: 5,
            overdue: 1,
            totalValue: 485000,
          },
        })
        setIsLoading(false)
      }, 1000)
    }

    loadFinancialData()
  }, [projectId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Management Dashboard</h2>
          <p className="text-muted-foreground">Project #{projectId} financial overview and analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">View Details</Button>
        </div>
      </div>

      {/* Optimized Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {/* Row 1: Key Metrics - 4 equal columns on large screens */}
        <div className="lg:col-span-1 xl:col-span-1">
          <FinancialMetricCard
            title="Total Budget"
            value={`$${(financialData.totalBudget / 1000000).toFixed(1)}M`}
            subtitle="Project budget allocation"
            icon={<DollarSign className="h-4 w-4" />}
            change={{
              value: 0,
              period: "baseline",
              trend: "neutral" as const,
            }}
            projectId={projectId}
          />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <FinancialMetricCard
            title="Actual Spent"
            value={`$${(financialData.actualSpent / 1000000).toFixed(1)}M`}
            subtitle="Cumulative spending"
            icon={<BarChart3 className="h-4 w-4" />}
            change={{
              value: 12.5,
              period: "last month",
              trend: "up" as const,
            }}
            variant={financialData.actualSpent > financialData.totalBudget ? "danger" : "default"}
            projectId={projectId}
          />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <FinancialMetricCard
            title="Remaining Budget"
            value={`$${(financialData.remainingBudget / 1000000).toFixed(1)}M`}
            subtitle="Available funds"
            icon={<TrendingUp className="h-4 w-4" />}
            change={{
              value: -8.2,
              period: "last month",
              trend: "down" as const,
            }}
            variant={financialData.remainingBudget < 0 ? "danger" : "success"}
            projectId={projectId}
          />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <FinancialMetricCard
            title="Monthly Burn Rate"
            value={`$${(financialData.monthlyBurn / 1000).toFixed(0)}K`}
            subtitle="Average monthly spend"
            icon={<Clock className="h-4 w-4" />}
            change={{
              value: 5.3,
              period: "last month",
              trend: "up" as const,
            }}
            variant="warning"
            projectId={projectId}
          />
        </div>

        {/* Row 2: Status Cards on XL screens */}
        <div className="lg:col-span-2 xl:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Pay Applications</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <Badge variant="secondary">{financialData.payApplications.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved</span>
                <Badge variant="default">{financialData.payApplications.approved}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Value</span>
                  <span className="font-semibold text-sm">
                    ${(financialData.payApplications.totalValue / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 xl:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Change Orders</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <Badge variant="outline">{financialData.changeOrders.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Approved</span>
                <Badge variant="default">{financialData.changeOrders.approved}</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Value</span>
                  <span className="font-semibold text-sm">
                    ${financialData.changeOrders.totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Analysis Cards - Spanning multiple columns */}
        <div className="lg:col-span-2 xl:col-span-2">
          <BudgetVarianceCard
            budgetedAmount={financialData.totalBudget}
            actualAmount={financialData.actualSpent}
            remainingAmount={financialData.remainingBudget}
            projectId={projectId}
          />
        </div>

        <div className="lg:col-span-2 xl:col-span-2">
          <CashFlowChartCard projectId={projectId} timeframe="90d" />
        </div>
      </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cost Performance Index</span>
              <span
                className={`font-semibold ${
                  financialData.costPerformanceIndex >= 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {financialData.costPerformanceIndex.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Schedule Performance Index</span>
              <span
                className={`font-semibold ${
                  financialData.schedulePerformanceIndex >= 1 ? "text-green-600" : "text-red-600"
                }`}
              >
                {financialData.schedulePerformanceIndex.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Forecast at Completion</span>
              <span className="font-semibold">${(financialData.forecastAtCompletion / 1000000).toFixed(1)}M</span>
            </div>
          </CardContent>
        </Card>

        {/* Budget Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Budget Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projected Completion</span>
              <span className="font-semibold">${(financialData.projectedCompletion / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Variance at Completion</span>
              <span
                className={`font-semibold ${
                  financialData.varianceAtCompletion >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${(Math.abs(financialData.varianceAtCompletion) / 1000).toFixed(0)}K
                {financialData.varianceAtCompletion >= 0 ? " under" : " over"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget Utilization</span>
              <span className="font-semibold">
                {((financialData.actualSpent / financialData.totalBudget) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
