"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Activity,
  Timer,
  Bell,
  CalendarDays,
  Sparkles,
  Zap,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface BetaCriticalDatesProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaCriticalDates({ className, config, isCompact = false, userRole }: BetaCriticalDatesProps) {
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

  // Mock critical dates data
  const criticalDates = React.useMemo(() => {
    const today = new Date()
    const dates = [
      {
        id: 1,
        title: "Miami Tower - Foundation Complete",
        date: new Date(2025, 1, 15),
        project: "Miami Commercial Tower",
        status: "upcoming",
        priority: "high",
        daysUntil: 10,
        category: "milestone",
      },
      {
        id: 2,
        title: "Coral Gables - Permit Approval",
        date: new Date(2025, 1, 8),
        project: "Coral Gables Luxury Condominium",
        status: "overdue",
        priority: "critical",
        daysUntil: -2,
        category: "permit",
      },
      {
        id: 3,
        title: "Naples - Design Review",
        date: new Date(2025, 1, 20),
        project: "Naples Waterfront Condominium",
        status: "upcoming",
        priority: "medium",
        daysUntil: 15,
        category: "review",
      },
      {
        id: 4,
        title: "Portfolio - Quarterly Review",
        date: new Date(2025, 2, 31),
        project: "Portfolio",
        status: "scheduled",
        priority: "high",
        daysUntil: 54,
        category: "review",
      },
      {
        id: 5,
        title: "Miami Tower - Inspection",
        date: new Date(2025, 1, 25),
        project: "Miami Commercial Tower",
        status: "upcoming",
        priority: "medium",
        daysUntil: 20,
        category: "inspection",
      },
    ]

    // Calculate metrics
    const overdueCount = dates.filter((d) => d.status === "overdue").length
    const upcomingCount = dates.filter((d) => d.status === "upcoming").length
    const criticalCount = dates.filter((d) => d.priority === "critical").length
    const highPriorityCount = dates.filter((d) => d.priority === "high").length

    // Timeline data for charts
    const timelineData = dates.map((date) => ({
      name: date.title.substring(0, 15) + "...",
      daysUntil: Math.abs(date.daysUntil),
      status: date.status,
      priority: date.priority,
      fill:
        date.status === "overdue"
          ? "#EF4444"
          : date.priority === "critical"
          ? "#F59E0B"
          : date.priority === "high"
          ? "#3B82F6"
          : "#10B981",
    }))

    // Category breakdown
    const categoryData = dates.reduce((acc, date) => {
      acc[date.category] = (acc[date.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
      name: category,
      value: count,
      fill:
        category === "milestone"
          ? "#3B82F6"
          : category === "permit"
          ? "#F59E0B"
          : category === "review"
          ? "#10B981"
          : category === "inspection"
          ? "#8B5CF6"
          : "#6B7280",
    }))

    return {
      dates,
      overdueCount,
      upcomingCount,
      criticalCount,
      highPriorityCount,
      timelineData,
      categoryChartData,
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200"
      case "upcoming":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "scheduled":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div
      className={`bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border border-[#FA4616]/20 dark:border-[#FA4616]/40 rounded-lg h-full ${className}`}
    >
      <CardHeader className="pb-3 px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 bg-[#FA4616] rounded-md flex-shrink-0">
              <CalendarDays className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-semibold text-[#FA4616] dark:text-[#FF8A67] leading-tight">
                Critical Dates
              </CardTitle>
              <CardDescription className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80 leading-tight">
                Portfolio milestone tracking
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Badge
              variant="outline"
              className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67] text-xs px-1.5 py-0.5"
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Power BI
            </Badge>
            <div className="flex items-center gap-1">
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                className="data-[state=checked]:bg-[#FA4616] scale-75"
              />
              <Label className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80">Auto</Label>
            </div>
          </div>
        </div>
        <div className="text-xs text-[#FA4616]/70 dark:text-[#FF8A67]/80 mt-1">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 h-8">
            <TabsTrigger value="overview" className="text-xs px-2 py-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs px-2 py-1">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs px-2 py-1">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Overdue</p>
                    <p className="text-base font-bold text-red-600">{criticalDates.overdueCount}</p>
                  </div>
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-2.5 w-2.5 text-red-500" />
                  <span className="text-xs text-red-600">Action needed</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Upcoming</p>
                    <p className="text-base font-bold text-orange-600">{criticalDates.upcomingCount}</p>
                  </div>
                  <Clock className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Timer className="h-2.5 w-2.5 text-orange-500" />
                  <span className="text-xs text-orange-600">Next 30 days</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Critical</p>
                    <p className="text-base font-bold text-blue-600">{criticalDates.criticalCount}</p>
                  </div>
                  <Target className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Bell className="h-2.5 w-2.5 text-blue-500" />
                  <span className="text-xs text-blue-600">High priority</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-md p-2.5 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">On Track</p>
                    <p className="text-base font-bold text-green-600">
                      {criticalDates.dates.length - criticalDates.overdueCount}
                    </p>
                  </div>
                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="h-2.5 w-2.5 text-green-500" />
                  <span className="text-xs text-green-600">Progressing</span>
                </div>
              </div>
            </div>

            {/* Critical Dates List */}
            <div className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm">Upcoming Critical Dates</h4>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <div className="space-y-1 p-3">
                  {criticalDates.dates.map((date) => (
                    <div
                      key={date.id}
                      className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h5 className="font-medium text-sm truncate">{date.title}</h5>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(date.status)} px-1.5 py-0.5`}>
                            {date.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(date.priority)} px-1.5 py-0.5`}
                          >
                            {date.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {date.project} • {date.category}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="font-medium text-sm">{date.date.toLocaleDateString()}</div>
                        <div
                          className={`text-xs ${
                            date.daysUntil < 0
                              ? "text-red-600"
                              : date.daysUntil < 7
                              ? "text-orange-600"
                              : "text-gray-600"
                          }`}
                        >
                          {date.daysUntil < 0
                            ? `${Math.abs(date.daysUntil)} days overdue`
                            : date.daysUntil === 0
                            ? "Today"
                            : `${date.daysUntil} days`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-3">
            {/* Timeline Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 text-sm">Critical Dates Timeline</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={criticalDates.timelineData} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={9} />
                    <YAxis label={{ value: "Days Until Due", angle: -90, position: "insideLeft" }} fontSize={9} />
                    <Tooltip
                      formatter={(value) => [`${value} days`, "Days Until Due"]}
                      labelFormatter={(label) => `Task: ${label}`}
                      contentStyle={{ fontSize: "12px" }}
                    />
                    <Bar dataKey="daysUntil" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-3">
            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 text-sm">Category Distribution</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={criticalDates.categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {criticalDates.categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} items`, name]}
                      labelFormatter={(label) => `Category: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">On-Time Rate</span>
                    <span className="text-xs font-medium">
                      {(
                        ((criticalDates.dates.length - criticalDates.overdueCount) / criticalDates.dates.length) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((criticalDates.dates.length - criticalDates.overdueCount) / criticalDates.dates.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Critical Priority</span>
                    <span className="text-xs font-medium">
                      {((criticalDates.criticalCount / criticalDates.dates.length) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(criticalDates.criticalCount / criticalDates.dates.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Risk Assessment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">High Risk Items</span>
                    <span className="text-xs font-medium text-red-600">{criticalDates.overdueCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Medium Risk Items</span>
                    <span className="text-xs font-medium text-orange-600">{criticalDates.upcomingCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Low Risk Items</span>
                    <span className="text-xs font-medium text-green-600">
                      {criticalDates.dates.length - criticalDates.overdueCount - criticalDates.upcomingCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </div>
  )
}
