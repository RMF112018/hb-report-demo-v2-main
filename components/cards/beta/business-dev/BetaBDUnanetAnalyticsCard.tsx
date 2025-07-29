"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Clock,
  Building2,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  Zap,
  Users,
  Calendar,
  MapPin,
  FileText,
  Award,
  Timer,
  Signal,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import { useUnanetData, UnanetPursuit, UnanetProposal } from "@/hooks/use-unanet-data"

interface BetaBDUnanetAnalyticsCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDUnanetAnalyticsCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDUnanetAnalyticsCardProps) {
  const { pursuits, proposals, winsLosses, lastSynced, isLoading, error, refetch } = useUnanetData()
  const [liveUpdates, setLiveUpdates] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<"pipeline" | "proposals" | "performance">("pipeline")

  // Real-time animation states
  const [pulseActive, setPulseActive] = useState(false)
  const [dataStreamActive, setDataStreamActive] = useState(false)

  useEffect(() => {
    if (!isLoading && liveUpdates) {
      setPulseActive(true)
      setDataStreamActive(true)
      const timer = setTimeout(() => {
        setPulseActive(false)
        setDataStreamActive(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [lastSynced, isLoading, liveUpdates])

  // Calculate metrics
  const totalPipelineValue = pursuits.reduce((sum, p) => sum + p.value, 0)
  const activePursuits = pursuits.filter((p) => p.status === "active").length
  const averageWinRate =
    winsLosses.length > 0 ? winsLosses.reduce((sum, w) => sum + w.winRate, 0) / winsLosses.length : 0

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-500",
      submitted: "bg-blue-500",
      won: "bg-emerald-500",
      lost: "bg-red-500",
      draft: "bg-gray-500",
      under_review: "bg-yellow-500",
      shortlisted: "bg-purple-500",
      awarded: "bg-green-600",
      declined: "bg-red-600",
    }
    return colors[status as keyof typeof colors] || "bg-gray-400"
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <TooltipProvider>
      <div
        className={`bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden ${className}`}
      >
        {/* Command Center Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-xl ${
                  pulseActive ? "animate-pulse" : ""
                } bg-gradient-to-r from-blue-500 to-purple-600`}
              >
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  Unanet Business Intelligence Hub
                  {dataStreamActive && <Signal className="h-4 w-4 ml-2 text-green-500 animate-bounce" />}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time pursuit analytics & pipeline intelligence
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-3">
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    variant="outline"
                    className={`${
                      error
                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {error ? <WifiOff className="h-3 w-3 mr-1" /> : <Wifi className="h-3 w-3 mr-1" />}
                    Updated via Unanet
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last Synced: {formatDateTime(lastSynced)}</p>
                </TooltipContent>
              </Tooltip>

              <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading} className="h-8">
                {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 h-[600px]">
          {/* Left Panel: Live Data Stream */}
          <div className="lg:col-span-2 bg-gray-900 text-white p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Live Data Stream
                </h4>
                <div className={`h-2 w-2 rounded-full ${liveUpdates ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {/* Active Pursuits Stream */}
                  <div className="text-xs text-green-400 font-mono mb-2">ACTIVE PURSUITS</div>
                  {pursuits
                    .filter((p) => p.status === "active")
                    .slice(0, 3)
                    .map((pursuit) => (
                      <div key={pursuit.id} className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-blue-400">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium truncate">{pursuit.name}</span>
                          <Badge variant="secondary" className="text-xs bg-blue-900/50 text-blue-300">
                            {pursuit.stage}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div className="flex justify-between">
                            <span>{pursuit.client}</span>
                            <span className="text-green-400">{formatCurrency(pursuit.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Probability: {pursuit.probability}%</span>
                            <span>Due: {new Date(pursuit.bidDueDate).toLocaleDateString()}</span>
                          </div>
                          <Progress value={pursuit.probability} className="h-1" />
                        </div>
                      </div>
                    ))}

                  {/* Proposals Stream */}
                  <div className="text-xs text-purple-400 font-mono mb-2 mt-4">PUBLIC SECTOR RFQs</div>
                  {proposals.slice(0, 2).map((proposal) => (
                    <div key={proposal.id} className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-purple-400">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{proposal.title}</span>
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(proposal.status)}`} />
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>{proposal.agency}</div>
                        <div className="flex justify-between">
                          <span>{proposal.rfqNumber}</span>
                          <span className="text-purple-400">{formatCurrency(proposal.value)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Recent Activity */}
                  <div className="text-xs text-yellow-400 font-mono mb-2 mt-4">RECENT ACTIVITY</div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-yellow-400">
                    <div className="text-xs text-gray-400">
                      <div className="flex justify-between mb-1">
                        <span>System Status</span>
                        <span className="text-green-400">Operational</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Data Latency</span>
                        <span>~2.3ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Sync</span>
                        <span>{new Date(lastSynced.getTime() + 5 * 60 * 1000).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Panel: Analytics Dashboard */}
          <div className="lg:col-span-3 p-6 bg-white dark:bg-gray-800">
            <div className="h-full flex flex-col">
              {/* Metric Selector */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  {[
                    { key: "pipeline", label: "Pipeline", icon: Target },
                    { key: "proposals", label: "Proposals", icon: FileText },
                    { key: "performance", label: "Performance", icon: BarChart3 },
                  ].map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      variant={selectedMetric === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMetric(key as any)}
                      className="h-8"
                      style={selectedMetric === key ? { backgroundColor: "rgb(250, 70, 22)" } : {}}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Pipeline Value</p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                        {formatCurrency(totalPipelineValue)}
                      </p>
                    </div>
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Active Pursuits</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-100">{activePursuits}</p>
                    </div>
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Win Rate</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                        {averageWinRate.toFixed(0)}%
                      </p>
                    </div>
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Dynamic Chart Area */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedMetric === "performance" && winsLosses.length > 0 ? (
                    <ComposedChart data={winsLosses}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Bar dataKey="wins" fill="#10b981" name="Wins" />
                      <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                      <Line
                        type="monotone"
                        dataKey="winRate"
                        stroke="rgb(250, 70, 22)"
                        strokeWidth={3}
                        name="Win Rate %"
                      />
                    </ComposedChart>
                  ) : selectedMetric === "proposals" ? (
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Draft",
                            value: proposals.filter((p) => p.status === "draft").length,
                            color: "#6b7280",
                          },
                          {
                            name: "Submitted",
                            value: proposals.filter((p) => p.status === "submitted").length,
                            color: "#3b82f6",
                          },
                          {
                            name: "Under Review",
                            value: proposals.filter((p) => p.status === "under_review").length,
                            color: "#f59e0b",
                          },
                          {
                            name: "Shortlisted",
                            value: proposals.filter((p) => p.status === "shortlisted").length,
                            color: "#8b5cf6",
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {proposals.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#6b7280", "#3b82f6", "#f59e0b", "#8b5cf6"][index % 4]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  ) : (
                    <AreaChart
                      data={pursuits.map((p) => ({
                        name: p.name.split(" ")[0],
                        value: p.value / 1000000,
                        probability: p.probability,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stackId="1"
                        stroke="rgb(250, 70, 22)"
                        fill="rgba(250, 70, 22, 0.3)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
