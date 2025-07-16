import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Waves,
  BarChart3,
  Target,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

interface BetaCashFlowAnalysisProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaCashFlowAnalysis({ className, config, isCompact }: BetaCashFlowAnalysisProps) {
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

  const [isRealTime, setIsRealTime] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("overview")

  // Mock real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isRealTime])

  // Mock cash flow data
  const cashFlowMetrics = [
    {
      title: "Net Cash Flow",
      value: "$1.2M",
      change: "+8.3%",
      trend: "up",
      icon: Waves,
      color: "text-green-600",
    },
    {
      title: "Cash Inflows",
      value: "$5.8M",
      change: "+12.1%",
      trend: "up",
      icon: ArrowDown,
      color: "text-blue-600",
    },
    {
      title: "Cash Outflows",
      value: "$4.6M",
      change: "+4.2%",
      trend: "up",
      icon: ArrowUp,
      color: "text-red-600",
    },
    {
      title: "Working Capital",
      value: "$3.4M",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
    },
  ]

  const cashFlowTrend = [
    { month: "Jan", inflow: 4200, outflow: 3800, net: 400 },
    { month: "Feb", inflow: 4500, outflow: 3900, net: 600 },
    { month: "Mar", inflow: 4800, outflow: 4100, net: 700 },
    { month: "Apr", inflow: 5100, outflow: 4300, net: 800 },
    { month: "May", inflow: 5400, outflow: 4500, net: 900 },
    { month: "Jun", inflow: 5700, outflow: 4600, net: 1100 },
    { month: "Jul", inflow: 5900, outflow: 4700, net: 1200 },
    { month: "Aug", inflow: 5800, outflow: 4600, net: 1200 },
  ]

  const cashFlowForecast = [
    { month: "Aug", actual: 1200, forecast: 1200, variance: 0 },
    { month: "Sep", actual: null, forecast: 1350, variance: null },
    { month: "Oct", actual: null, forecast: 1500, variance: null },
    { month: "Nov", actual: null, forecast: 1400, variance: null },
    { month: "Dec", actual: null, forecast: 1600, variance: null },
  ]

  const workingCapitalTrend = [
    { month: "Jan", amount: 2800 },
    { month: "Feb", amount: 3000 },
    { month: "Mar", amount: 3100 },
    { month: "Apr", amount: 3200 },
    { month: "May", amount: 3250 },
    { month: "Jun", amount: 3300 },
    { month: "Jul", amount: 3350 },
    { month: "Aug", amount: 3400 },
  ]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#0021A5] dark:text-[#4A7FD6]">
              Cash Flow Analysis
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
              >
                <Waves className="h-3 w-3 mr-1" />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label htmlFor="real-time" className="text-sm text-[#0021A5]/70 dark:text-[#4A7FD6]/80">
                Real-time
              </Label>
            </div>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {cashFlowMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Monthly Cash Flow</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={cashFlowTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="net" stroke="#06B6D4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cash Flow Trends</h4>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={cashFlowTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="inflow"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Working Capital Trend</h4>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={workingCapitalTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cash Flow Forecast</h4>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={cashFlowForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#06B6D4" strokeWidth={2} connectNulls={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-cyan-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Forecast Insights</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Projected Q4 Cash Flow</span>
                  <span className="font-medium text-green-600">$4.5M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Forecast Accuracy</span>
                  <span className="font-medium text-blue-600">94.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Risk Assessment</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Low Risk
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-cyan-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-cyan-600 dark:text-cyan-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
