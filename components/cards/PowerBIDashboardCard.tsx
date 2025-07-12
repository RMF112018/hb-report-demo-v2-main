/**
 * @fileoverview Power BI Dashboard Card Component
 * @module PowerBIDashboardCard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Power BI integration card for dashboard grid system
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { Alert, AlertDescription } from "../ui/alert"
import { Switch } from "../ui/switch"
import {
  BarChart3,
  Activity,
  Users,
  Database,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Eye,
  MonitorPlay,
  Zap,
  Shield,
  Info,
  Settings,
  Play,
  X,
} from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import type { DashboardCard } from "../../types/dashboard"

interface PowerBIDashboardCardProps {
  card: DashboardCard
  config?: any
  span?: any
  isCompact?: boolean
  userRole?: string
}

interface PowerBIMetrics {
  activeReports: number
  activeUsers: number
  dataRefreshed: number
  storageUsed: number
  avgLoadTime: number
  errorRate: number
  complianceScore: number
  realtimeStreams: number
}

export default function PowerBIDashboardCard({ card, config, span, isCompact, userRole }: PowerBIDashboardCardProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [metrics, setMetrics] = useState<PowerBIMetrics | null>(null)
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === "power-bi-dashboard") {
        const shouldShow = event.detail.action === "show"
        setShowDrillDown(shouldShow)

        // Notify wrapper of state change
        const stateEvent = new CustomEvent("cardDrillDownStateChange", {
          detail: {
            cardId: card.id,
            cardType: "power-bi-dashboard",
            isActive: shouldShow,
          },
        })
        window.dispatchEvent(stateEvent)
      }
    }

    window.addEventListener("cardDrillDown", handleDrillDownEvent as EventListener)

    return () => {
      window.removeEventListener("cardDrillDown", handleDrillDownEvent as EventListener)
    }
  }, [card.id])

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)

    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent("cardDrillDownStateChange", {
      detail: {
        cardId: card.id,
        cardType: "power-bi-dashboard",
        isActive: false,
      },
    })
    window.dispatchEvent(stateEvent)
  }

  // Generate role-based data
  const generateRoleBasedData = (): PowerBIMetrics => {
    const role = userRole || "executive"

    switch (role) {
      case "project-manager":
        return {
          activeReports: 8,
          activeUsers: 15,
          dataRefreshed: 94,
          storageUsed: 45,
          avgLoadTime: 2.1,
          errorRate: 0.3,
          complianceScore: 98,
          realtimeStreams: 3,
        }
      case "project-executive":
        return {
          activeReports: 18,
          activeUsers: 35,
          dataRefreshed: 96,
          storageUsed: 68,
          avgLoadTime: 2.3,
          errorRate: 0.4,
          complianceScore: 97,
          realtimeStreams: 8,
        }
      default: // executive
        return {
          activeReports: 32,
          activeUsers: 125,
          dataRefreshed: 98,
          storageUsed: 85,
          avgLoadTime: 2.5,
          errorRate: 0.5,
          complianceScore: 96,
          realtimeStreams: 15,
        }
    }
  }

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 800))

      const data = generateRoleBasedData()
      setMetrics(data)
      setIsLoading(false)
    }

    loadData()
  }, [userRole])

  // Real-time updates
  useEffect(() => {
    if (!realtimeEnabled || !metrics) return

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev
          ? {
              ...prev,
              activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 6) - 3),
              avgLoadTime: Math.max(1.5, prev.avgLoadTime + Math.random() * 0.4 - 0.2),
            }
          : null
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [realtimeEnabled, metrics])

  // Chart data
  const usageData = [
    { name: "Mon", value: 45 },
    { name: "Tue", value: 52 },
    { name: "Wed", value: 49 },
    { name: "Thu", value: 67 },
    { name: "Fri", value: 71 },
    { name: "Sat", value: 23 },
    { name: "Sun", value: 18 },
  ]

  const statusData = [
    { name: "Online", value: 28, color: "#10b981" },
    { name: "Refreshing", value: 3, color: "#3b82f6" },
    { name: "Offline", value: 1, color: "#ef4444" },
  ]

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  if (isLoading) {
    return (
      <div className="relative h-full">
        <div className="h-full flex flex-col bg-transparent overflow-hidden">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Loading Power BI...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full" data-tour="power-bi-dashboard-card">
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1 sm:mb-1.5 lg:mb-2">
            <Badge className="bg-blue-600 text-white border-blue-600 text-xs">
              <BarChart3 className="h-3 w-3 mr-1" />
              Power BI Enterprise
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta
            </Badge>
            <div className="flex items-center gap-1 ml-auto">
              <Switch
                checked={realtimeEnabled}
                onCheckedChange={setRealtimeEnabled}
                className="data-[state=checked]:bg-blue-600 scale-75"
              />
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </div>

          {/* Compact Stats */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 lg:gap-2">
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-blue-600 dark:text-blue-400">
                {metrics?.activeReports}
              </div>
              <div className="text-xs text-muted-foreground">Reports</div>
              <div className="text-xs text-blue-600 dark:text-blue-400">{metrics?.realtimeStreams} streaming</div>
            </div>
            <div className="text-center p-1.5 sm:p-2 lg:p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
              <div className="text-lg sm:text-xl lg:text-lg sm:text-xl lg:text-2xl font-medium text-green-600 dark:text-green-400">
                {metrics?.activeUsers}
              </div>
              <div className="text-xs text-muted-foreground">Users</div>
              <div className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                {realtimeEnabled && <Activity className="h-2 w-2" />}
                Live
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 overflow-y-auto">
          <div className="space-y-3">
            {/* Usage Chart */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-foreground">Usage Trend</span>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-foreground">Performance</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Data Refreshed</span>
                  <span className="font-medium text-green-600">{formatPercentage(metrics?.dataRefreshed || 0)}</span>
                </div>
                <Progress value={metrics?.dataRefreshed || 0} className="h-1" />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Storage Used</span>
                  <span className="font-medium text-blue-600">{formatPercentage(metrics?.storageUsed || 0)}</span>
                </div>
                <Progress value={metrics?.storageUsed || 0} className="h-1" />
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <MonitorPlay className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-foreground">Report Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={12} outerRadius={28} dataKey="value">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Score */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-foreground">Compliance</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(metrics?.complianceScore || 0)}
                </div>
                <div className="text-xs text-muted-foreground">Security Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-blue-900/95 backdrop-blur-sm rounded-lg p-2 sm:p-1.5 sm:p-2 lg:p-2.5 lg:p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            <h3 className="text-base sm:text-lg lg:text-base sm:text-lg lg:text-xl font-medium mb-1.5 sm:mb-2 lg:mb-1 sm:mb-1.5 lg:mb-2 text-center">
              Power BI Enterprise Dashboard
            </h3>

            <div className="grid grid-cols-1 gap-2 sm:gap-1 sm:gap-1.5 lg:gap-2 lg:gap-1.5 sm:gap-2 lg:gap-1 sm:gap-1.5 lg:gap-2 h-[calc(100%-60px)]">
              {/* Enterprise Features */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enterprise Features
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>Embedded Analytics</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>Real-time Streaming</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300">
                      {metrics?.realtimeStreams} streams
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>Row-level Security</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300">
                      Configured
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span>Premium Capacity</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300">
                      Premium
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Performance Metrics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Load Time:</span>
                    <span className="font-medium text-blue-300">{metrics?.avgLoadTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate:</span>
                    <span className="font-medium text-yellow-300">{formatPercentage(metrics?.errorRate || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Refresh:</span>
                    <span className="font-medium text-green-300">{formatPercentage(metrics?.dataRefreshed || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage Used:</span>
                    <span className="font-medium text-purple-300">{formatPercentage(metrics?.storageUsed || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-2.5 lg:p-1.5 sm:p-2 lg:p-2.5">
                <h4 className="font-semibold mb-1 sm:mb-1.5 lg:mb-2 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Quick Actions
                </h4>
                <div className="space-y-1 text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    View Reports
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Open Power BI
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleCloseDrillDown}
                className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
