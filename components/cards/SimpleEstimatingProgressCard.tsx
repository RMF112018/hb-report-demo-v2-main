/**
 * @fileoverview Simple Estimating Progress Card Component
 * @module SimpleEstimatingProgressCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing estimating progress
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calculator, TrendingUp, RefreshCw, Play, Pause, Clock, CheckCircle, AlertCircle, Users } from "lucide-react"

interface SimpleEstimatingProgressCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    verticalLayout?: boolean
  }
}

// Generate role-based estimating data
const generateEstimatingData = (userRole: string) => {
  const estimatingMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.8,
    admin: 0.0,
  }

  const multiplier = estimatingMultipliers[userRole as keyof typeof estimatingMultipliers] || 0.8

  const baseData = {
    totalEstimates: Math.floor(18 * multiplier),
    activeEstimates: Math.floor(8 * multiplier),
    completedEstimates: Math.floor(10 * multiplier),
    avgAccuracy: 87 + Math.floor(Math.random() * 8),
    avgTurnaroundTime: 12 + Math.floor(Math.random() * 6),
    totalEstimateValue: 285000000 * multiplier,
  }

  const statusData = [
    { status: "Completed", count: baseData.completedEstimates, color: "#10b981" },
    { status: "In Progress", count: Math.floor(baseData.activeEstimates * 0.6), color: "#f59e0b" },
    { status: "Under Review", count: Math.floor(baseData.activeEstimates * 0.4), color: "#3b82f6" },
    { status: "On Hold", count: Math.floor(baseData.totalEstimates * 0.1), color: "#6b7280" },
  ]

  const phaseData = [
    { phase: "Takeoff", progress: 85, estimates: Math.floor(baseData.totalEstimates * 0.3) },
    { phase: "Pricing", progress: 72, estimates: Math.floor(baseData.totalEstimates * 0.25) },
    { phase: "Review", progress: 65, estimates: Math.floor(baseData.totalEstimates * 0.2) },
    { phase: "Final", progress: 45, estimates: Math.floor(baseData.totalEstimates * 0.25) },
  ]

  const tradeBreakdown = [
    {
      trade: "Concrete",
      value: baseData.totalEstimateValue * 0.22,
      estimates: Math.floor(baseData.totalEstimates * 0.25),
    },
    { trade: "Steel", value: baseData.totalEstimateValue * 0.18, estimates: Math.floor(baseData.totalEstimates * 0.2) },
    {
      trade: "Electrical",
      value: baseData.totalEstimateValue * 0.15,
      estimates: Math.floor(baseData.totalEstimates * 0.15),
    },
    { trade: "HVAC", value: baseData.totalEstimateValue * 0.12, estimates: Math.floor(baseData.totalEstimates * 0.1) },
  ]

  return {
    ...baseData,
    statusData,
    phaseData,
    tradeBreakdown,
    completionRate: Math.round((baseData.completedEstimates / baseData.totalEstimates) * 100),
  }
}

export default function SimpleEstimatingProgressCard({
  className,
  userRole,
  config,
}: SimpleEstimatingProgressCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const estimatingData = useMemo(() => generateEstimatingData(userRole || "estimator"), [userRole])

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
      className={`${className} bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                Estimating Progress
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/50"
            >
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Estimates</p>
                <p className="text-2xl font-bold text-emerald-600">{estimatingData.totalEstimates}</p>
              </div>
              <Calculator className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-yellow-600">{estimatingData.activeEstimates}</p>
              </div>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{estimatingData.completedEstimates}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm text-muted-foreground">{estimatingData.completionRate}%</span>
          </div>
          <Progress value={estimatingData.completionRate} className="h-2" />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Accuracy</p>
                <p className="text-lg font-bold text-blue-600">{estimatingData.avgAccuracy}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Turnaround</p>
                <p className="text-lg font-bold text-purple-600">{estimatingData.avgTurnaroundTime} days</p>
              </div>
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Phase Progress</h4>
          <div className="space-y-2">
            {estimatingData.phaseData.map((phase, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs">{phase.phase}</span>
                  <span className="text-xs font-medium">{phase.progress}%</span>
                </div>
                <Progress value={phase.progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Trade Breakdown Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={estimatingData.tradeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="trade" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [formatCurrency(value as number), "Value"]} />
              <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
