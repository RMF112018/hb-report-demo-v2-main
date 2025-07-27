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
import {
  Calculator,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
} from "lucide-react"

interface SimpleEstimatingProgressCardProps {
  className?: string
  userRole?: string
  isCompact?: boolean
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
  isCompact = false,
  config,
}: SimpleEstimatingProgressCardProps) {
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

  const completionPercentage = estimatingData.completionRate

  return (
    <Card
      className={`${className} bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200/50 dark:border-emerald-800/50 h-full`}
    >
      <CardHeader className={compactScale.paddingCard}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg">
              <Calculator className={`${compactScale.iconSize} text-white`} />
            </div>
            <div>
              <CardTitle className={`${compactScale.textTitle} font-semibold text-emerald-900 dark:text-emerald-100`}>
                Estimating Progress
              </CardTitle>
            </div>
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

      <CardContent className={`space-y-${isCompact ? "1.5" : "3"}`}>
        {/* Row 1: Estimating Status Cards - Made wider */}
        <div className="grid grid-cols-12 gap-2">
          {/* Total & Active Estimates - 3 columns (reduced from 4) */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg p-2 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-1 mb-1">
              <Calculator className={`${compactScale.iconSizeSmall} text-emerald-600`} />
              <span className={`${compactScale.textMedium} font-medium`}>Estimates</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className={`${compactScale.textSmall} text-muted-foreground`}>Total</span>
                <span className={`${compactScale.textMedium} font-bold text-emerald-600`}>
                  {estimatingData.totalEstimates}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${compactScale.textSmall} text-muted-foreground`}>Active</span>
                <span className={`${compactScale.textMedium} font-bold text-yellow-600`}>
                  {estimatingData.activeEstimates}
                </span>
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="mt-1 flex gap-1 h-4">
              <div className="bg-emerald-500 rounded-sm flex-1" style={{ height: "60%" }}></div>
              <div className="bg-yellow-500 rounded-sm flex-1" style={{ height: "40%" }}></div>
              <div className="bg-green-500 rounded-sm flex-1" style={{ height: "80%" }}></div>
            </div>
          </div>

          {/* Completion Progress - 4 columns (reduced from 5) */}
          <div className="col-span-4 bg-white dark:bg-gray-800 rounded-lg p-2 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium">Completion</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-sm font-bold text-green-600">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-1.5" />
            </div>
            {/* Pie chart visualization */}
            <div className="mt-1 flex items-center justify-center">
              <div className="relative w-8 h-8">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${completionPercentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{completionPercentage}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy Metric - 2 columns (reduced from 3) */}
          <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium">Accuracy</span>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600">{estimatingData.avgAccuracy}%</span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${estimatingData.avgAccuracy}%` }} />
              </div>
            </div>
            {/* Mini line chart */}
            <div className="mt-1 flex items-end gap-1 h-4">
              <div className="bg-blue-300 rounded-sm w-1" style={{ height: "40%" }}></div>
              <div className="bg-blue-400 rounded-sm w-1" style={{ height: "60%" }}></div>
              <div className="bg-blue-500 rounded-sm w-1" style={{ height: "80%" }}></div>
              <div className="bg-blue-600 rounded-sm w-1" style={{ height: "70%" }}></div>
              <div className="bg-blue-700 rounded-sm w-1" style={{ height: "90%" }}></div>
            </div>
          </div>

          {/* Turnaround Time - 3 columns (new section in top row) */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="h-3 w-3 text-purple-600" />
              <span className="text-xs font-medium">Turnaround</span>
            </div>
            <div className="text-center mb-1">
              <span className="text-lg font-bold text-purple-600">{estimatingData.avgTurnaroundTime}d</span>
              <p className="text-xs text-muted-foreground">Average Time</p>
            </div>
            {/* Timeline chart */}
            <div className="flex items-center gap-1">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "70%" }} />
              </div>
              <span className="text-xs text-muted-foreground">Target: 10d</span>
            </div>
          </div>
        </div>

        {/* Row 2: Estimate Types - Made wider to use more horizontal space */}
        <div className="grid grid-cols-12 gap-2">
          {/* Estimate Types - 12 columns (full width) */}
          <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg p-2 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 className="h-3 w-3 text-orange-600" />
              <span className="text-xs font-medium">Estimate Types</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Conceptual</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 bg-gray-200 rounded-full h-1">
                    <div className="bg-orange-500 h-1 rounded-full" style={{ width: "75%" }} />
                  </div>
                  <span className="text-xs font-bold text-orange-600">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Detailed</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 bg-gray-200 rounded-full h-1">
                    <div className="bg-orange-500 h-1 rounded-full" style={{ width: "45%" }} />
                  </div>
                  <span className="text-xs font-bold text-orange-600">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Final</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 bg-gray-200 rounded-full h-1">
                    <div className="bg-orange-500 h-1 rounded-full" style={{ width: "90%" }} />
                  </div>
                  <span className="text-xs font-bold text-orange-600">90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
