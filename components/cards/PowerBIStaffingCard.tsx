/**
 * @fileoverview Power BI Staffing Distribution Card Component
 * @module PowerBIStaffingCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-31
 *
 * Power BI embedded visualization showing staffing distribution and analytics
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Users,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react"

// Import the JSON data
import staffingData from "../../data/mock/staffing/staffing.json"
import spcrData from "../../data/mock/staffing/spcr.json"

interface PowerBIStaffingCardProps {
  className?: string
  userRole?: string
  config?: {
    userRole?: string
    showRealTime?: boolean
    compactView?: boolean
  }
}

export default function PowerBIStaffingCard({ className, userRole, config }: PowerBIStaffingCardProps) {
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(config?.showRealTime ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Process staffing data by role
  const staffingByRole = useMemo(() => {
    if (!staffingData || !Array.isArray(staffingData) || staffingData.length === 0) {
      // Return empty object if no data available - let the chart handle empty state
      return {}
    }

    const result = staffingData.reduce((acc: any, person: any) => {
      if (person && person.position) {
        const position = person.position.trim()
        acc[position] = (acc[position] || 0) + 1
      }
      return acc
    }, {})

    return result
  }, [staffingData])

  // Process SPCR data
  const spcrStats = useMemo(() => {
    return spcrData.reduce(
      (acc: any, spcr: any) => {
        acc.total++
        acc[spcr.status] = (acc[spcr.status] || 0) + 1
        acc[spcr.type] = (acc[spcr.type] || 0) + 1
        return acc
      },
      { total: 0 }
    )
  }, [])

  // Chart data for role distribution
  const roleChartData = useMemo(() => {
    const entries = Object.entries(staffingByRole)

    if (entries.length === 0) {
      return []
    }

    const chartData = entries
      .map(([role, count]) => ({
        role: role
          .replace(/^(Senior |Assistant |General )?/, "") // Remove prefixes
          .replace(/ (I|II|III|IV)$/, "") // Remove roman numerals
          .substring(0, 15), // Limit length for chart
        count: Number(count),
        fullRole: role,
      }))
      .filter((item) => item.count > 0) // Only include roles with staff
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    return chartData
  }, [staffingByRole])

  // SPCR status data
  const spcrStatusData = useMemo(() => {
    return [
      { name: "Approved", value: spcrStats.approved || 0, color: "#10b981" },
      { name: "Pending", value: spcrStats.pending || 0, color: "#f59e0b" },
      { name: "Rejected", value: spcrStats.rejected || 0, color: "#ef4444" },
    ]
  }, [spcrStats])

  // Experience level analysis
  const experienceLevels = useMemo(() => {
    return staffingData.reduce(
      (acc: any, person: any) => {
        if (person.experience <= 5) acc.junior++
        else if (person.experience <= 15) acc.mid++
        else acc.senior++
        return acc
      },
      { junior: 0, mid: 0, senior: 0 }
    )
  }, [])

  // Utilization rate calculation
  const utilizationRate = useMemo(() => {
    return Math.round((staffingData.filter((p: any) => p.assignments?.length > 0).length / staffingData.length) * 100)
  }, [])

  // Staffing trend data (mock trending data)
  const trendData = useMemo(() => {
    return [
      { month: "Jan", staff: 42, utilization: 87 },
      { month: "Feb", staff: 45, utilization: 92 },
      { month: "Mar", staff: 48, utilization: 89 },
      { month: "Apr", staff: 52, utilization: 94 },
      { month: "May", staff: 56, utilization: 91 },
      { month: "Jun", staff: staffingData.length, utilization: utilizationRate },
    ]
  }, [utilizationRate])

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return

    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isRealTimeEnabled])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200/50 dark:border-purple-800/50 h-full`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                Staffing Distribution
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

      <CardContent className="pt-0">
        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{staffingData.length}</div>
            <div className="text-xs text-muted-foreground">Total Staff</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{utilizationRate}%</div>
            <div className="text-xs text-muted-foreground">Utilization</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{spcrStats.total}</div>
            <div className="text-xs text-muted-foreground">Total SPCRs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{spcrStats.approved || 0}</div>
            <div className="text-xs text-muted-foreground">SPCR Approved</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Role Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <UserCheck className="h-4 w-4 mr-2 text-purple-600" />
              Staff by Role ({roleChartData.length} roles)
            </h4>
            {roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={roleChartData} layout="horizontal" margin={{ left: 5, right: 5, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, "dataMax"]} tickCount={5} />
                  <YAxis dataKey="role" type="category" tick={{ fontSize: 9 }} width={90} interval={0} />
                  <Tooltip formatter={(value, name) => [value, "Count"]} labelFormatter={(label) => `Role: ${label}`} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} minPointSize={2} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                <div className="text-center">
                  <div className="text-xs">No role data available</div>
                  <div className="text-xs mt-1">Total staff: {staffingData?.length || 0}</div>
                </div>
              </div>
            )}
          </div>

          {/* Experience & Utilization */}
          <div className="space-y-4">
            {/* Experience Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                Experience Levels
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Junior (≤5yr)</span>
                    <span className="font-medium">{experienceLevels.junior}</span>
                  </div>
                  <Progress value={(experienceLevels.junior / staffingData.length) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Mid-Level (6-15yr)</span>
                    <span className="font-medium">{experienceLevels.mid}</span>
                  </div>
                  <Progress value={(experienceLevels.mid / staffingData.length) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Senior (15+yr)</span>
                    <span className="font-medium">{experienceLevels.senior}</span>
                  </div>
                  <Progress value={(experienceLevels.senior / staffingData.length) * 100} className="h-2" />
                </div>
              </div>
            </div>

            {/* SPCR Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                SPCR Status
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <ResponsiveContainer width={80} height={80}>
                    <PieChart>
                      <Pie data={spcrStatusData} cx="50%" cy="50%" innerRadius={20} outerRadius={35} dataKey="value">
                        {spcrStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1">
                  {spcrStatusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staffing Trend */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-indigo-600" />
            Staffing Trend & Utilization
          </h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="staff" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
              <Line type="monotone" dataKey="utilization" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Power BI Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Powered by Power BI • Last refresh: {lastUpdated.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-purple-600 dark:text-purple-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              View in Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
