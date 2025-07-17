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
  Wallet,
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Contingency Analysis</CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {/* Row 1: Contingency Metrics */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {/* Total & Used Contingency - 5 columns */}
          <div className="col-span-5 bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Contingency</span>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-green-600">$2.4M</p>
                <p className="text-xs text-green-600">+1.2%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Used</p>
                <p className="text-lg font-bold text-orange-600">$850K</p>
                <p className="text-xs text-orange-600">+5.3%</p>
              </div>
            </div>
            {/* Stacked bar chart for contingency breakdown */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">Used</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "35.4%" }} />
                </div>
                <span className="text-xs font-bold text-orange-600">35.4%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8">Remaining</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "64.6%" }} />
                </div>
                <span className="text-xs font-bold text-green-600">64.6%</span>
              </div>
            </div>
          </div>

          {/* Remaining Budget - 7 columns */}
          <div className="col-span-7 bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Remaining Budget</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">$1.55M</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: "64.6%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">64.6% remaining</p>
                <p className="text-xs text-blue-600">-4.1% from last month</p>
              </div>
              <div className="text-center">
                {/* Line chart for budget trends */}
                <div className="flex items-end gap-1 h-12 justify-center">
                  <div className="bg-blue-300 rounded-sm w-1" style={{ height: "70%" }}></div>
                  <div className="bg-blue-400 rounded-sm w-1" style={{ height: "75%" }}></div>
                  <div className="bg-blue-500 rounded-sm w-1" style={{ height: "80%" }}></div>
                  <div className="bg-blue-600 rounded-sm w-1" style={{ height: "85%" }}></div>
                  <div className="bg-blue-700 rounded-sm w-1" style={{ height: "90%" }}></div>
                  <div className="bg-blue-800 rounded-sm w-1" style={{ height: "65%" }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Trend</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Risk Assessment */}
        <div className="grid grid-cols-12 gap-3">
          {/* Risk Score - 12 columns */}
          <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Risk Assessment</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold text-green-600">7.2/10</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: "72%" }} />
                </div>
                <p className="text-xs text-green-600 mt-1">+0.3 from last month</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Risk Level</p>
                <p className="text-lg font-bold text-green-600">Low</p>
                <p className="text-xs text-muted-foreground">Based on 5 factors</p>
                <p className="text-xs text-green-600">Good standing</p>
              </div>
              <div className="text-center">
                {/* Gauge chart visualization */}
                <div className="flex items-center justify-center">
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
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeDasharray="72, 100"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">7.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
