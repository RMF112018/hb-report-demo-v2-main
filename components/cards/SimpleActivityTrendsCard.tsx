/**
 * @fileoverview Simple Activity Trends Card Component
 * @module SimpleActivityTrendsCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing project activity trends
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Activity, TrendingUp, RefreshCw, Play, Pause, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface SimpleActivityTrendsCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    expandedView?: boolean
  }
}

// Generate role-based activity data
const generateActivityData = (userRole: string) => {
  const activityMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.3,
    admin: 0.0,
  }

  const multiplier = activityMultipliers[userRole as keyof typeof activityMultipliers] || 0.3

  const weeklyData = [
    {
      week: "Week 1",
      submittals: Math.floor(15 * multiplier),
      rfis: Math.floor(8 * multiplier),
      changes: Math.floor(3 * multiplier),
    },
    {
      week: "Week 2",
      submittals: Math.floor(18 * multiplier),
      rfis: Math.floor(12 * multiplier),
      changes: Math.floor(5 * multiplier),
    },
    {
      week: "Week 3",
      submittals: Math.floor(22 * multiplier),
      rfis: Math.floor(10 * multiplier),
      changes: Math.floor(4 * multiplier),
    },
    {
      week: "Week 4",
      submittals: Math.floor(25 * multiplier),
      rfis: Math.floor(15 * multiplier),
      changes: Math.floor(7 * multiplier),
    },
  ]

  const activityTypes = [
    { name: "Submittals", value: Math.floor(80 * multiplier), color: "#3b82f6" },
    { name: "RFIs", value: Math.floor(45 * multiplier), color: "#10b981" },
    { name: "Change Orders", value: Math.floor(19 * multiplier), color: "#f59e0b" },
    { name: "Inspections", value: Math.floor(32 * multiplier), color: "#8b5cf6" },
  ]

  const totalActivities = activityTypes.reduce((sum, activity) => sum + activity.value, 0)

  return {
    weeklyData,
    activityTypes,
    totalActivities,
    avgPerWeek: Math.round(totalActivities / 4),
  }
}

export default function SimpleActivityTrendsCard({ className, userRole, config }: SimpleActivityTrendsCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const activityData = useMemo(() => generateActivityData(userRole || "estimator"), [userRole])

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
      className={`${className} bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/50 dark:border-purple-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                Activity Trends
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-950/50">
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
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Activities</p>
                <p className="text-2xl font-bold text-purple-600">{activityData.totalActivities}</p>
              </div>
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Per Week</p>
                <p className="text-2xl font-bold text-blue-600">{activityData.avgPerWeek}</p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Activity Types Distribution */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Activity Types</h4>
            <div className="space-y-1">
              {activityData.activityTypes.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activity.color }} />
                    <span className="text-xs">{activity.name}</span>
                  </div>
                  <span className="text-xs font-medium">{activity.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData.activityTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {activityData.activityTypes.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trends Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="submittals"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area type="monotone" dataKey="rfis" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="changes" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
