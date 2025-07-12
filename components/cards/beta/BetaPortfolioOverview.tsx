"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Progress } from "../../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Switch } from "../../ui/switch"
import { Label } from "../../ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Users,
  MapPin,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  BarChart3,
  TrendingDown,
  RefreshCw,
  ExternalLink,
} from "lucide-react"

interface BetaPortfolioOverviewProps {
  className?: string
  isCompact?: boolean
  userRole?: string
  config?: any
}

// Enhanced mock data for Power BI integration
const generatePowerBIData = () => ({
  projects: [
    { name: "Medical Center East", progress: 78, budget: 8.5, status: "On Track", phase: "Construction" },
    { name: "Tech Campus Phase 2", progress: 45, budget: 12.3, status: "At Risk", phase: "Pre-Con" },
    { name: "Marina Bay Plaza", progress: 92, budget: 6.8, status: "Ahead", phase: "Closeout" },
    { name: "Riverside Plaza", progress: 31, budget: 15.2, status: "On Track", phase: "Construction" },
    { name: "Downtown Office", progress: 67, budget: 9.7, status: "On Track", phase: "Construction" },
  ],
  performance: [
    { month: "Jan", budget: 45.2, actual: 43.8, forecast: 46.1 },
    { month: "Feb", budget: 52.1, actual: 48.9, forecast: 53.2 },
    { month: "Mar", budget: 48.7, actual: 51.3, forecast: 49.8 },
    { month: "Apr", budget: 56.3, actual: 54.7, forecast: 57.1 },
    { month: "May", budget: 51.8, actual: 49.2, forecast: 52.9 },
    { month: "Jun", budget: 59.4, actual: 61.1, forecast: 60.2 },
  ],
  distribution: [
    { name: "Active", value: 17, color: "#0EA5E9" },
    { name: "Pre-Con", value: 8, color: "#F59E0B" },
    { name: "Closeout", value: 3, color: "#10B981" },
    { name: "On Hold", value: 2, color: "#EF4444" },
  ],
  kpis: {
    totalProjects: 30,
    activeProjects: 17,
    totalValue: 285.7,
    avgMargin: 12.8,
    onTimeDelivery: 94.2,
    clientSatisfaction: 4.7,
    utilizationRate: 87.3,
    riskScore: 15.8,
  },
})

const COLORS = ["#0EA5E9", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#F97316"]

export default function BetaPortfolioOverview({ className, isCompact, userRole, config }: BetaPortfolioOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const data = generatePowerBIData()

  // Simulate real-time updates
  useEffect(() => {
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        setLastUpdated(new Date())
      }, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [realTimeEnabled])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  return (
    <Card
      className={`${className} bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40 shadow-lg`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0021A5] rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-[#0021A5] dark:text-[#4A7FD6]">
                Portfolio Overview
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-xs bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Power BI Enhanced
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
                >
                  <Activity className="h-3 w-3 mr-1" />
                  {realTimeEnabled ? "Live" : "Static"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="realtime-toggle" className="text-xs">
                Real-time
              </Label>
              <Switch id="realtime-toggle" checked={realTimeEnabled} onCheckedChange={setRealTimeEnabled} />
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading} className="h-8 w-8 p-0">
              <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">
              Performance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Enhanced KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Projects</p>
                    <p className="text-lg font-bold text-blue-600">{data.kpis.totalProjects}</p>
                  </div>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+12% YoY</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                    <p className="text-lg font-bold text-green-600">${data.kpis.totalValue}M</p>
                  </div>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+8.3% QoQ</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Margin</p>
                    <p className="text-lg font-bold text-purple-600">{data.kpis.avgMargin}%</p>
                  </div>
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+0.7% vs target</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">On-Time Delivery</p>
                    <p className="text-lg font-bold text-orange-600">{data.kpis.onTimeDelivery}%</p>
                  </div>
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">Above target</span>
                </div>
              </div>
            </div>

            {/* Project Status Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Project Distribution</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {data.distribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-3 text-sm">Budget vs Actual Performance</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="budget"
                      stackId="1"
                      stroke="#0EA5E9"
                      fill="#0EA5E9"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                    <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Key Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Utilization Rate</span>
                    <span className="text-xs font-medium">{data.kpis.utilizationRate}%</span>
                  </div>
                  <Progress value={data.kpis.utilizationRate} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Client Satisfaction</span>
                    <span className="text-xs font-medium">{data.kpis.clientSatisfaction}/5.0</span>
                  </div>
                  <Progress value={data.kpis.clientSatisfaction * 20} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs">Risk Score</span>
                    <span className="text-xs font-medium">{data.kpis.riskScore}%</span>
                  </div>
                  <Progress value={100 - data.kpis.riskScore} className="h-2" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-3 text-sm">Top Projects</h4>
                <div className="space-y-2">
                  {data.projects.slice(0, 3).map((project, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium truncate">{project.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              project.status === "Ahead"
                                ? "bg-green-100 text-green-800"
                                : project.status === "At Risk"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {project.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">${project.budget}M</p>
                        <p className="text-xs text-muted-foreground">{project.phase}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Power BI Integration Footer */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Powered by Power BI</span>
            </div>
            <Button variant="outline" size="sm" className="h-6 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View in Power BI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
