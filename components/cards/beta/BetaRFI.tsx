"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  MessageSquare,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Activity,
  Timer,
  Target,
  CheckCircle,
  HelpCircle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface BetaRFIProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaRFI({ className, config, isCompact = false, userRole }: BetaRFIProps) {
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

  const [activeTab, setActiveTab] = useState("overview")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // 30 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  // Role-based data filtering
  const getDataByRole = () => {
    switch (userRole) {
      case "project-manager":
        return {
          totalRFIs: 24,
          pendingRFIs: 6,
          resolvedRFIs: 18,
          avgResolutionDays: 8.3,
          targetResolutionDays: 7.0,
          costImpact: 245000,
          scheduleImpact: 12,
          performanceScore: 82.5,
          overdue: 2,
          categoryBreakdown: [
            { category: "Design Clarification", count: 9, avgResolution: 7.2, costImpact: 125000, color: "#0021A5" },
            { category: "Material Specs", count: 8, avgResolution: 8.9, costImpact: 78000, color: "#0021A5CC" },
            { category: "Field Conditions", count: 4, avgResolution: 9.8, costImpact: 32000, color: "#0021A580" },
            { category: "Code Compliance", count: 3, avgResolution: 6.5, costImpact: 10000, color: "#0021A540" },
          ],
          riskLevel: "Low",
        }
      case "project-executive":
        return {
          totalRFIs: 186,
          pendingRFIs: 38,
          resolvedRFIs: 148,
          avgResolutionDays: 9.7,
          targetResolutionDays: 8.0,
          costImpact: 1850000,
          scheduleImpact: 89,
          performanceScore: 76.3,
          overdue: 15,
          categoryBreakdown: [
            { category: "Design Clarification", count: 68, avgResolution: 8.9, costImpact: 890000, color: "#0021A5" },
            { category: "Material Specs", count: 52, avgResolution: 10.2, costImpact: 625000, color: "#0021A5CC" },
            { category: "Field Conditions", count: 38, avgResolution: 11.1, costImpact: 245000, color: "#0021A580" },
            { category: "Code Compliance", count: 28, avgResolution: 7.8, costImpact: 90000, color: "#0021A540" },
          ],
          riskLevel: "Medium",
        }
      default:
        return {
          totalRFIs: 524,
          pendingRFIs: 89,
          resolvedRFIs: 435,
          avgResolutionDays: 10.8,
          targetResolutionDays: 8.5,
          costImpact: 5240000,
          scheduleImpact: 287,
          performanceScore: 71.2,
          overdue: 28,
          categoryBreakdown: [
            {
              category: "Design Clarification",
              count: 195,
              avgResolution: 10.2,
              costImpact: 2450000,
              color: "#0021A5",
            },
            { category: "Material Specs", count: 158, avgResolution: 11.8, costImpact: 1680000, color: "#0021A5CC" },
            { category: "Field Conditions", count: 102, avgResolution: 12.1, costImpact: 845000, color: "#0021A580" },
            { category: "Code Compliance", count: 69, avgResolution: 8.9, costImpact: 265000, color: "#0021A540" },
          ],
          riskLevel: "High",
        }
    }
  }

  const data = getDataByRole()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getPerformanceGrade = (score: number) => {
    if (score >= 85) return "A"
    if (score >= 75) return "B"
    if (score >= 65) return "C"
    return "D"
  }

  const getGradeColor = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 65) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600 dark:text-green-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "high":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const closureRate = (data.resolvedRFIs / data.totalRFIs) * 100
  const performanceGrade = getPerformanceGrade(data.performanceScore)

  // Historical data for trend analysis
  const historicalData = [
    { month: "Oct", submitted: 42, resolved: 38, avgDays: 9.2 },
    { month: "Nov", submitted: 35, resolved: 41, avgDays: 8.8 },
    { month: "Dec", submitted: 48, resolved: 45, avgDays: 7.9 },
    {
      month: "Jan",
      submitted: Math.floor(data.totalRFIs * 0.4),
      resolved: Math.floor(data.resolvedRFIs * 0.4),
      avgDays: data.avgResolutionDays,
    },
  ]

  // Orange theme colors for charts
  const chartColors = {
    primary: "#FA4616",
    secondary: "#FA4616CC",
    tertiary: "#FA461680",
    quaternary: "#FA461640",
    gradient: "rgba(250, 70, 22, 0.1)",
  }

  return (
    <Card className={`h-full flex flex-col overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">RFI Monitor</CardTitle>
              <p className="text-sm text-muted-foreground">Request for Information</p>
              <p className="text-xs text-muted-foreground">Updated 4:07:48 PM</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        {/* Row 1: RFI Metrics */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Closure Rate - 5 columns */}
          <div className="col-span-5 bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Closure Rate</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{closureRate.toFixed(1)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${closureRate}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.resolvedRFIs} of {data.totalRFIs}
              </p>
            </div>
            {/* Pie chart visualization */}
            <div className="mt-2 flex items-center justify-center">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${closureRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{closureRate.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Time - 7 columns */}
          <div className="col-span-7 bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Resolution Time</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{data.avgResolutionDays}d</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">Target:</span>
                  <span className="text-xs font-medium text-green-600">{data.targetResolutionDays}d</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.avgResolutionDays <= data.targetResolutionDays ? "bg-green-500" : "bg-orange-500"
                    }`}
                    style={{ width: `${Math.min((data.avgResolutionDays / data.targetResolutionDays) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                {/* Line chart for resolution trends */}
                <div className="flex items-end gap-1 h-12 justify-center">
                  <div className="bg-green-300 rounded-sm w-1" style={{ height: "80%" }}></div>
                  <div className="bg-green-400 rounded-sm w-1" style={{ height: "65%" }}></div>
                  <div className="bg-green-500 rounded-sm w-1" style={{ height: "90%" }}></div>
                  <div className="bg-green-600 rounded-sm w-1" style={{ height: "75%" }}></div>
                  <div className="bg-green-700 rounded-sm w-1" style={{ height: "85%" }}></div>
                  <div className="bg-green-800 rounded-sm w-1" style={{ height: "70%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Trend</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Status Breakdown */}
        <div className="grid grid-cols-12 gap-3">
          {/* Status Breakdown - 12 columns */}
          <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Status Breakdown</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{data.pendingRFIs}</p>
                <p className="text-xs text-muted-foreground">
                  {((data.pendingRFIs / data.totalRFIs) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Resolved</p>
                <p className="text-xl font-bold text-green-600">{data.resolvedRFIs}</p>
                <p className="text-xs text-muted-foreground">
                  {((data.resolvedRFIs / data.totalRFIs) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-xl font-bold text-red-600">{data.overdue}</p>
                <p className="text-xs text-muted-foreground">{((data.overdue / data.totalRFIs) * 100).toFixed(1)}%</p>
              </div>
            </div>
            {/* Bar chart for status breakdown */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(data.pendingRFIs / data.totalRFIs) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(data.resolvedRFIs / data.totalRFIs) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(data.overdue / data.totalRFIs) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
