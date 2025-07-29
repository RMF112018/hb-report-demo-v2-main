"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Building2,
  Activity,
  Timer,
  Bell,
  Sparkles,
  Clock,
  Users,
  MapPin,
  Calendar,
  Star,
  Award,
  Briefcase,
  Database,
  Zap,
  Lightbulb,
  Filter,
  User,
  Building,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  FunnelChart,
  Funnel,
} from "recharts"

interface PipelineData {
  totalActivePursuits: number
  weightedPipelineValue: number
  stageDistribution: {
    stage: string
    count: number
    value: number
    percentage: number
  }[]
  topClients: {
    name: string
    value: number
    opportunities: number
    avatar: string
  }[]
}

interface BetaBDPipelineSummaryCardProps {
  className?: string
  config?: any
  isCompact?: boolean
  userRole?: string
}

export default function BetaBDPipelineSummaryCard({
  className,
  config,
  isCompact = false,
  userRole,
}: BetaBDPipelineSummaryCardProps) {
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

  const [activeTab, setActiveTab] = useState("pipeline")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock Unanet CRM data for pipeline summary
  const pipelineData = useMemo(
    (): PipelineData => ({
      totalActivePursuits: 24,
      weightedPipelineValue: 285000000,
      stageDistribution: [
        { stage: "Prequal", count: 8, value: 85000000, percentage: 30 },
        { stage: "Proposal", count: 12, value: 145000000, percentage: 51 },
        { stage: "Interview", count: 4, value: 55000000, percentage: 19 },
      ],
      topClients: [
        {
          name: "City of Tampa",
          value: 45000000,
          opportunities: 3,
          avatar: "TB",
        },
        {
          name: "Publix Real Estate",
          value: 68000000,
          opportunities: 2,
          avatar: "PR",
        },
        {
          name: "Tampa General Hospital",
          value: 32000000,
          opportunities: 1,
          avatar: "TG",
        },
      ],
    }),
    []
  )

  // Chart colors
  const chartColors = {
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#8B5CF6",
    warning: "#F59E0B",
    danger: "#EF4444",
    success: "#22C55E",
  }

  // Helper functions
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Prequal":
        return chartColors.primary
      case "Proposal":
        return chartColors.success
      case "Interview":
        return chartColors.warning
      default:
        return chartColors.accent
    }
  }

  return (
    <Card
      className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className={`${compactScale.iconSize} text-blue-600`} />
            <CardTitle className={`${compactScale.textTitle} font-semibold text-slate-900 dark:text-slate-100`}>
              BD Pipeline Summary
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Updated via Unanet CRM
          </Badge>
        </div>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Business Development opportunity pipeline overview
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-blue-600`}>
              {pipelineData.totalActivePursuits}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Active Pursuits</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className={`${compactScale.textTitle} font-bold text-green-600`}>
              {formatCurrency(pipelineData.weightedPipelineValue)}
            </div>
            <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Pipeline Value</div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pipeline" className="text-xs">
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-xs">
              Client Breakdown
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="space-y-4">
            {/* Stage Distribution Chart */}
            <div className={`${compactScale.chartHeight} w-full`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData.stageDistribution} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={compactScale.textSmall} />
                  <YAxis dataKey="stage" type="category" stroke="#64748B" fontSize={compactScale.textSmall} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: compactScale.textSmall,
                    }}
                    formatter={(value, name) => [formatCurrency(value as number), "Value"]}
                  />
                  <Bar dataKey="value" fill={chartColors.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Distribution List */}
            <div className="space-y-2">
              {pipelineData.stageDistribution.map((stage) => (
                <div
                  key={stage.stage}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStageColor(stage.stage) }} />
                    <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {stage.stage}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {formatCurrency(stage.value)}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                      {stage.count} pursuits ({stage.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            {/* Top Clients List */}
            <div className="space-y-3">
              {pipelineData.topClients.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm`}
                      style={{ backgroundColor: Object.values(chartColors)[index % Object.values(chartColors).length] }}
                    >
                      {client.avatar}
                    </div>
                    <div>
                      <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                        {client.name}
                      </div>
                      <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>
                        {client.opportunities} opportunities
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                      {formatCurrency(client.value)}
                    </div>
                    <div className={`${compactScale.textSmall} text-slate-500 dark:text-slate-400`}>Pipeline Value</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Client Summary */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className={`${compactScale.iconSizeSmall} text-blue-600`} />
                <span className={`${compactScale.textMedium} font-medium text-slate-900 dark:text-slate-100`}>
                  Client Summary
                </span>
              </div>
              <div className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>
                Top 3 clients represent{" "}
                {(
                  (pipelineData.topClients.reduce((sum, client) => sum + client.value, 0) /
                    pipelineData.weightedPipelineValue) *
                  100
                ).toFixed(0)}
                % of total pipeline value
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Auto-refresh toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} className="scale-75" />
            <Label className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400`}>Auto-refresh</Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`${compactScale.textSmall} text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100`}
          >
            <RefreshCw className={`${compactScale.iconSizeSmall} mr-1`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
