/**
 * @fileoverview Simple Financial Summary Card Component
 * @module SimpleFinancialSummaryCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing key financial metrics
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign, TrendingUp, RefreshCw, Play, Pause, CreditCard, PiggyBank, AlertCircle } from "lucide-react"

interface SimpleFinancialSummaryCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    expandedView?: boolean
  }
}

// Generate role-based financial data
const generateFinancialData = (userRole: string) => {
  const financialMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.3,
    admin: 0.0,
  }

  const multiplier = financialMultipliers[userRole as keyof typeof financialMultipliers] || 0.3

  const baseData = {
    totalRevenue: 75000000 * multiplier,
    totalCosts: 58000000 * multiplier,
    netIncome: 17000000 * multiplier,
    cashFlow: 12500000 * multiplier,
    outstandingAR: 8500000 * multiplier,
    workingCapital: 15000000 * multiplier,
  }

  const monthlyData = [
    {
      month: "Jan",
      revenue: baseData.totalRevenue * 0.12,
      costs: baseData.totalCosts * 0.11,
      profit: baseData.netIncome * 0.15,
    },
    {
      month: "Feb",
      revenue: baseData.totalRevenue * 0.14,
      costs: baseData.totalCosts * 0.13,
      profit: baseData.netIncome * 0.16,
    },
    {
      month: "Mar",
      revenue: baseData.totalRevenue * 0.16,
      costs: baseData.totalCosts * 0.15,
      profit: baseData.netIncome * 0.18,
    },
    {
      month: "Apr",
      revenue: baseData.totalRevenue * 0.18,
      costs: baseData.totalCosts * 0.17,
      profit: baseData.netIncome * 0.19,
    },
    {
      month: "May",
      revenue: baseData.totalRevenue * 0.2,
      costs: baseData.totalCosts * 0.19,
      profit: baseData.netIncome * 0.21,
    },
    {
      month: "Jun",
      revenue: baseData.totalRevenue * 0.22,
      costs: baseData.totalCosts * 0.21,
      profit: baseData.netIncome * 0.23,
    },
  ]

  return {
    ...baseData,
    profitMargin: Math.round((baseData.netIncome / baseData.totalRevenue) * 100),
    monthlyData,
  }
}

export default function SimpleFinancialSummaryCard({ className, userRole, config }: SimpleFinancialSummaryCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const financialData = useMemo(() => generateFinancialData(userRole || "estimator"), [userRole])

  // Simulate real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 15000) // Update every 15 seconds

      return () => clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
                Financial Summary
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/50">
              Power BI
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="h-8 px-3"
            >
              {isRealTimeEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-8 px-3">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Real-time Status */}
        {isRealTimeEnabled && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live data • Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(financialData.totalRevenue)}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cash Flow</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(financialData.cashFlow)}</p>
              </div>
              <PiggyBank className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Outstanding AR</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(financialData.outstandingAR)}</p>
              </div>
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Profit Margin</span>
            <span className="text-sm text-muted-foreground">{financialData.profitMargin}%</span>
          </div>
          <Progress value={financialData.profitMargin} className="h-2" />
        </div>

        {/* Monthly Financial Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
              />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
