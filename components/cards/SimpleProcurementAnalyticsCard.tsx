/**
 * @fileoverview Simple Procurement Analytics Card Component
 * @module SimpleProcurementAnalyticsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing procurement analytics
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ShoppingCart, TrendingUp, RefreshCw, Play, Pause, DollarSign, Users, CheckCircle } from "lucide-react"

interface SimpleProcurementAnalyticsCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    detailedView?: boolean
  }
}

// Generate role-based procurement data
const generateProcurementData = (userRole: string) => {
  const procurementMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.3,
    admin: 0.0,
  }

  const multiplier = procurementMultipliers[userRole as keyof typeof procurementMultipliers] || 0.3

  const baseData = {
    totalContracts: Math.floor(45 * multiplier),
    activeVendors: Math.floor(28 * multiplier),
    totalValue: 35000000 * multiplier,
    avgContractValue: 777778 * multiplier,
    onTimeDelivery: 85 + Math.floor(Math.random() * 10),
    budgetCompliance: 92 + Math.floor(Math.random() * 5),
  }

  const categoryData = [
    { category: "Concrete", value: baseData.totalValue * 0.25, contracts: Math.floor(baseData.totalContracts * 0.2) },
    { category: "Steel", value: baseData.totalValue * 0.22, contracts: Math.floor(baseData.totalContracts * 0.15) },
    {
      category: "Electrical",
      value: baseData.totalValue * 0.18,
      contracts: Math.floor(baseData.totalContracts * 0.25),
    },
    { category: "HVAC", value: baseData.totalValue * 0.15, contracts: Math.floor(baseData.totalContracts * 0.1) },
    { category: "Plumbing", value: baseData.totalValue * 0.12, contracts: Math.floor(baseData.totalContracts * 0.15) },
    { category: "Other", value: baseData.totalValue * 0.08, contracts: Math.floor(baseData.totalContracts * 0.15) },
  ]

  return {
    ...baseData,
    categoryData,
  }
}

export default function SimpleProcurementAnalyticsCard({
  className,
  userRole,
  config,
}: SimpleProcurementAnalyticsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const procurementData = useMemo(() => generateProcurementData(userRole || "estimator"), [userRole])

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
      className={`${className} bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200/50 dark:border-orange-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                Procurement Analytics
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-950/50">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Contracts</p>
                <p className="text-2xl font-bold text-orange-600">{procurementData.totalContracts}</p>
              </div>
              <ShoppingCart className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Vendors</p>
                <p className="text-2xl font-bold text-blue-600">{procurementData.activeVendors}</p>
              </div>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(procurementData.totalValue)}</p>
              </div>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">On-Time Delivery</span>
              <span className="text-sm text-muted-foreground">{procurementData.onTimeDelivery}%</span>
            </div>
            <Progress value={procurementData.onTimeDelivery} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Budget Compliance</span>
              <span className="text-sm text-muted-foreground">{procurementData.budgetCompliance}%</span>
            </div>
            <Progress value={procurementData.budgetCompliance} className="h-2" />
          </div>
        </div>

        {/* Category Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={procurementData.categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Value"]} />
              <Bar dataKey="value" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
