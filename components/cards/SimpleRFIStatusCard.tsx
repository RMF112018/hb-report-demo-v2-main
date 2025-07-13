/**
 * @fileoverview Simple RFI Status Card Component
 * @module SimpleRFIStatusCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing RFI status tracking
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  MessageSquare,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
} from "lucide-react"

interface SimpleRFIStatusCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    compactView?: boolean
  }
}

// Generate role-based RFI data
const generateRFIData = (userRole: string) => {
  const rfiMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.3,
    admin: 0.0,
  }

  const multiplier = rfiMultipliers[userRole as keyof typeof rfiMultipliers] || 0.3

  const baseData = {
    totalRFIs: Math.floor(45 * multiplier),
    openRFIs: Math.floor(12 * multiplier),
    respondedRFIs: Math.floor(28 * multiplier),
    overdueRFIs: Math.floor(5 * multiplier),
    avgResponseTime: 3.5 + Math.random() * 2,
    responseRate: 85 + Math.floor(Math.random() * 10),
  }

  const weeklyData = [
    { week: "Week 1", submitted: Math.floor(8 * multiplier), responded: Math.floor(6 * multiplier) },
    { week: "Week 2", submitted: Math.floor(12 * multiplier), responded: Math.floor(10 * multiplier) },
    { week: "Week 3", submitted: Math.floor(10 * multiplier), responded: Math.floor(8 * multiplier) },
    { week: "Week 4", submitted: Math.floor(15 * multiplier), responded: Math.floor(12 * multiplier) },
  ]

  const categoryData = [
    { category: "Design", count: Math.floor(baseData.totalRFIs * 0.35), avgDays: 4.2 },
    { category: "Specification", count: Math.floor(baseData.totalRFIs * 0.25), avgDays: 3.8 },
    { category: "Site Condition", count: Math.floor(baseData.totalRFIs * 0.2), avgDays: 2.5 },
    { category: "Material", count: Math.floor(baseData.totalRFIs * 0.15), avgDays: 3.2 },
    { category: "Other", count: Math.floor(baseData.totalRFIs * 0.05), avgDays: 2.8 },
  ]

  return {
    ...baseData,
    weeklyData,
    categoryData,
  }
}

export default function SimpleRFIStatusCard({ className, userRole, config }: SimpleRFIStatusCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const rfiData = useMemo(() => generateRFIData(userRole || "estimator"), [userRole])

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

  return (
    <Card
      className={`${className} bg-gradient-to-br from-cyan-50/50 to-teal-50/50 dark:from-cyan-950/20 dark:to-teal-950/20 border-cyan-200/50 dark:border-cyan-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">RFI Status</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-cyan-600 border-cyan-200 bg-cyan-50 dark:bg-cyan-950/50">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-cyan-200 dark:border-cyan-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total RFIs</p>
                <p className="text-2xl font-bold text-cyan-600">{rfiData.totalRFIs}</p>
              </div>
              <MessageSquare className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-yellow-600">{rfiData.openRFIs}</p>
              </div>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Responded</p>
                <p className="text-2xl font-bold text-green-600">{rfiData.respondedRFIs}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-lg font-bold text-blue-600">{rfiData.avgResponseTime.toFixed(1)} days</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{rfiData.overdueRFIs}</p>
              </div>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Top Categories</h4>
          <div className="space-y-1">
            {rfiData.categoryData.slice(0, 3).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs">{category.category}</span>
                <span className="text-xs font-medium">{category.count} RFIs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rfiData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="submitted"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4", r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="responded"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
