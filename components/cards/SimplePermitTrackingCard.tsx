/**
 * @fileoverview Simple Permit Tracking Card Component
 * @module SimplePermitTrackingCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Simplified Power BI embedded visualization showing permit tracking
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  FileCheck,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react"

interface SimplePermitTrackingCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    compactView?: boolean
  }
}

// Generate role-based permit data
const generatePermitData = (userRole: string) => {
  const permitMultipliers = {
    executive: 1.0,
    "project-executive": 0.5,
    "project-manager": 0.125,
    estimator: 0.3,
    admin: 0.0,
  }

  const multiplier = permitMultipliers[userRole as keyof typeof permitMultipliers] || 0.3

  const baseData = {
    totalPermits: Math.floor(24 * multiplier),
    activePermits: Math.floor(18 * multiplier),
    approvedPermits: Math.floor(15 * multiplier),
    expiringPermits: Math.floor(3 * multiplier),
    avgProcessingTime: 14 + Math.floor(Math.random() * 7),
    complianceRate: 92 + Math.floor(Math.random() * 6),
  }

  const statusData = [
    { status: "Approved", count: baseData.approvedPermits, color: "#10b981" },
    { status: "Pending", count: Math.floor(baseData.totalPermits * 0.3), color: "#f59e0b" },
    { status: "Under Review", count: Math.floor(baseData.totalPermits * 0.15), color: "#3b82f6" },
    { status: "Expired", count: Math.floor(baseData.totalPermits * 0.05), color: "#ef4444" },
  ]

  const permitTypes = [
    { type: "Building", count: Math.floor(baseData.totalPermits * 0.4), avgDays: 18 },
    { type: "Electrical", count: Math.floor(baseData.totalPermits * 0.25), avgDays: 12 },
    { type: "Plumbing", count: Math.floor(baseData.totalPermits * 0.2), avgDays: 10 },
    { type: "Mechanical", count: Math.floor(baseData.totalPermits * 0.15), avgDays: 15 },
  ]

  return {
    ...baseData,
    statusData,
    permitTypes,
  }
}

export default function SimplePermitTrackingCard({ className, userRole, config }: SimplePermitTrackingCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  const permitData = useMemo(() => generatePermitData(userRole || "estimator"), [userRole])

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
      className={`${className} bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200/50 dark:border-red-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg">
              <FileCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-red-900 dark:text-red-100">Permit Tracking</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-950/50">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Permits</p>
                <p className="text-2xl font-bold text-red-600">{permitData.totalPermits}</p>
              </div>
              <FileCheck className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{permitData.approvedPermits}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{permitData.expiringPermits}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compliance Rate</span>
              <span className="text-sm text-muted-foreground">{permitData.complianceRate}%</span>
            </div>
            <Progress value={permitData.complianceRate} className="h-2" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Processing</p>
                <p className="text-lg font-bold text-blue-600">{permitData.avgProcessingTime} days</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status Distribution</h4>
          <div className="space-y-2">
            {permitData.statusData.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-xs">{status.status}</span>
                </div>
                <span className="text-xs font-medium">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permit Types Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={permitData.permitTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value, name) => [
                  name === "count" ? `${value} permits` : `${value} days`,
                  name === "count" ? "Count" : "Avg Days",
                ]}
              />
              <Bar dataKey="count" fill="#dc2626" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
