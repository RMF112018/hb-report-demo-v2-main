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
  Calculator,
  PieChart,
  BarChart3,
  Target,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line,
  Pie,
} from "recharts"

interface BetaFinancialStatusProps {
  className?: string
  config?: any
}

export default function BetaFinancialStatus({ className, config }: BetaFinancialStatusProps) {
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

  // Mock financial data
  const financialMetrics = [
    {
      title: "Current Budget",
      value: "$12.4M",
      change: "+2.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Spent to Date",
      value: "$8.7M",
      change: "+5.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Remaining Budget",
      value: "$3.7M",
      change: "-2.8%",
      trend: "down",
      icon: Calculator,
      color: "text-orange-600",
    },
    {
      title: "Burn Rate",
      value: "$425K/mo",
      change: "+1.2%",
      trend: "up",
      icon: Target,
      color: "text-purple-600",
    },
  ]

  const budgetTrend = [
    { month: "Jan", budget: 12400, spent: 850, remaining: 11550 },
    { month: "Feb", budget: 12400, spent: 1650, remaining: 10750 },
    { month: "Mar", budget: 12400, spent: 2580, remaining: 9820 },
    { month: "Apr", budget: 12400, spent: 3690, remaining: 8710 },
    { month: "May", budget: 12400, spent: 4920, remaining: 7480 },
    { month: "Jun", budget: 12400, spent: 6240, remaining: 6160 },
    { month: "Jul", budget: 12400, spent: 7650, remaining: 4750 },
    { month: "Aug", budget: 12400, spent: 8700, remaining: 3700 },
  ]

  const categoryBreakdown = [
    { name: "Labor", value: 3800, color: "#3B82F6" },
    { name: "Materials", value: 2900, color: "#10B981" },
    { name: "Equipment", value: 1200, color: "#F59E0B" },
    { name: "Subcontractors", value: 800, color: "#EF4444" },
  ]

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#0021A5] dark:text-[#4A7FD6]">Financial Status</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
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
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {financialMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700"
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

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget Utilization</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Spent</span>
                  <span className="font-medium">70.2%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70.2%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>$8.7M spent</span>
                  <span>$3.7M remaining</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Budget vs Spending Trend</h4>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={budgetTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="spent" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="remaining"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cost Category Breakdown</h4>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={120}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-4">
                  <div className="space-y-2">
                    {categoryBreakdown.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="font-medium">${item.value}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
