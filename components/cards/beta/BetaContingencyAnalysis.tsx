import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Shield,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calculator,
  DollarSign,
} from "lucide-react"
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface BetaContingencyAnalysisProps {
  className?: string
  config?: any
  isCompact?: boolean
}

export default function BetaContingencyAnalysis({ className, config, isCompact }: BetaContingencyAnalysisProps) {
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

  // Mock contingency data
  const contingencyMetrics = [
    {
      title: "Total Contingency",
      value: "$2.4M",
      change: "+1.2%",
      trend: "up",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Used Contingency",
      value: "$850K",
      change: "+5.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600",
    },
    {
      title: "Remaining Budget",
      value: "$1.55M",
      change: "-4.1%",
      trend: "down",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Risk Score",
      value: "7.2/10",
      change: "+0.3",
      trend: "up",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  const contingencyByCategory = [
    { name: "Construction", value: 45, amount: 1080000, color: "#3B82F6" },
    { name: "Design Changes", value: 25, amount: 600000, color: "#10B981" },
    { name: "Weather", value: 15, amount: 360000, color: "#F59E0B" },
    { name: "Material Costs", value: 10, amount: 240000, color: "#EF4444" },
    { name: "Other", value: 5, amount: 120000, color: "#8B5CF6" },
  ]

  const contingencyTrend = [
    { month: "Jan", allocated: 2400, used: 150, remaining: 2250 },
    { month: "Feb", allocated: 2400, used: 280, remaining: 2120 },
    { month: "Mar", allocated: 2400, used: 420, remaining: 1980 },
    { month: "Apr", allocated: 2400, used: 580, remaining: 1820 },
    { month: "May", allocated: 2400, used: 650, remaining: 1750 },
    { month: "Jun", allocated: 2400, used: 730, remaining: 1670 },
    { month: "Jul", allocated: 2400, used: 800, remaining: 1600 },
    { month: "Aug", allocated: 2400, used: 850, remaining: 1550 },
  ]

  const riskFactors = [
    { factor: "Material Price Volatility", impact: "High", probability: "Medium", score: 8.5 },
    { factor: "Labor Availability", impact: "Medium", probability: "High", score: 7.2 },
    { factor: "Weather Delays", impact: "Medium", probability: "Medium", score: 6.8 },
    { factor: "Design Changes", impact: "High", probability: "Low", score: 6.5 },
    { factor: "Permitting Delays", impact: "Low", probability: "Medium", score: 4.2 },
  ]

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  return (
    <Card
      className={`h-full bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40 ${className}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-[#FA4616] dark:text-[#FF8A67]">
              Contingency Analysis
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
              >
                <Shield className="h-3 w-3 mr-1" />
                Power BI Enhanced
              </Badge>
              {isRealTime && (
                <Badge
                  variant="outline"
                  className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
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
              <Label htmlFor="real-time" className="text-sm text-[#FA4616]/70 dark:text-[#FF8A67]/80">
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
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {contingencyMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-gray-700"
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

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contingency Utilization</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Used</span>
                  <span className="font-medium">35.4%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "35.4%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>$850K used</span>
                  <span>$1.55M remaining</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Contingency by Category</h4>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={120}>
                    <RechartsPieChart>
                      <Pie
                        data={contingencyByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {contingencyByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 ml-4">
                  <div className="space-y-2">
                    {contingencyByCategory.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="font-medium">${(item.amount / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Contingency Usage Trend</h4>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={contingencyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="used" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="remaining" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Risk Factors</h4>
              <div className="space-y-3">
                {riskFactors.map((risk, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{risk.factor}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Impact: {risk.impact} | Probability: {risk.probability}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{risk.score}</div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          risk.score >= 8 ? "bg-red-500" : risk.score >= 6 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Overall Risk Score</span>
                  <span className="font-medium text-orange-600">7.2/10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">High Risk Items</span>
                  <span className="font-medium text-red-600">2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Recommended Action</span>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Monitor Closely
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t border-amber-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-amber-600 dark:text-amber-400">
              <ExternalLink className="h-3 w-3 mr-1" />
              Powered by Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
