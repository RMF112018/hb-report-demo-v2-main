"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Trophy,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  PieChart,
  BarChart3,
  Zap,
  Lightbulb,
  Brain,
  ArrowRight,
  Filter,
  Calendar,
  MapPin,
  Award,
  Star,
  Eye,
  Info,
} from "lucide-react"
import {
  ResponsiveContainer,
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

interface PipelineOverviewProps {
  pipelineData: any[]
  summaryStats: any
  userRole: string
}

const COLORS = {
  lead: "#ef4444", // Red for Lead stage
  proposal: "#f59e0b", // Amber for Proposal stage
  negotiation: "#3b82f6", // Blue for Negotiation stage
  award: "#10b981", // Green for Award stage
  residential: "#06b6d4", // Cyan for Residential
  commercial: "#8b5cf6", // Purple for Commercial
}

// Professional color palette for charts
const CHART_COLORS = {
  primary: "#2563eb", // Blue
  secondary: "#10b981", // Emerald
  accent: "#f59e0b", // Amber
  success: "#059669", // Green
  warning: "#d97706", // Orange
  danger: "#dc2626", // Red
  info: "#0891b2", // Cyan
  purple: "#7c3aed", // Purple
  gradient: {
    blue: ["#3b82f6", "#1d4ed8"],
    green: ["#10b981", "#059669"],
    purple: ["#8b5cf6", "#7c3aed"],
    orange: ["#f59e0b", "#d97706"],
  },
}

export function PipelineOverview({ pipelineData, summaryStats, userRole }: PipelineOverviewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [selectedDivision, setSelectedDivision] = useState("all")
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Monitor container size for responsive behavior
  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
        setContainerHeight(containerRef.current.offsetHeight)
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    // Use ResizeObserver for container-specific resize events
    const resizeObserver = new ResizeObserver(updateSize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener("resize", updateSize)
      resizeObserver.disconnect()
    }
  }, [])

  // Determine layout mode based on container size
  const isCompact = containerWidth < 600
  const isMini = containerWidth < 400
  const isTiny = containerWidth < 300
  const isWide = containerWidth > 1200

  // Dynamic text sizing based on container width
  const getTextSize = (baseSize: string) => {
    if (isTiny) return "text-xs"
    if (isMini) return "text-xs"
    if (isCompact) return "text-sm"
    return baseSize
  }

  const getTitleSize = () => {
    if (isTiny) return "text-xs"
    if (isMini) return "text-sm"
    if (isCompact) return "text-sm"
    return "text-base"
  }

  const getIconSize = () => {
    if (isTiny) return "h-3 w-3"
    if (isMini) return "h-3 w-3"
    if (isCompact) return "h-4 w-4"
    return "h-5 w-5"
  }

  const getSmallIconSize = () => {
    if (isTiny) return "h-2 w-2"
    if (isMini) return "h-2 w-2"
    if (isCompact) return "h-3 w-3"
    return "h-4 w-4"
  }

  const getPadding = () => {
    if (isTiny) return "p-1"
    if (isMini) return "p-2"
    if (isCompact) return "p-2"
    return "p-3"
  }

  const getGap = () => {
    if (isTiny) return "gap-1"
    if (isMini) return "gap-2"
    if (isCompact) return "gap-2"
    return "gap-3"
  }

  const getSpacing = () => {
    if (isTiny) return "2"
    if (isMini) return "2"
    if (isCompact) return "3"
    return "4"
  }

  // Process pipeline funnel data
  const funnelData = useMemo(() => {
    const stages = ["Lead", "Proposal", "Negotiation", "Award"]
    const stageColors = [CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.primary, CHART_COLORS.success]

    const processedStages = stages.map((stageName, index) => {
      const stageData = summaryStats.stageDistribution?.[stageName] || { count: 0, value: 0 }
      return {
        name: stageName,
        value: stageData.value,
        count: stageData.count,
        fill: stageColors[index],
      }
    })

    const filteredStages = processedStages.filter((stage) => stage.value > 0)

    // If no stages have value > 0, return with mock data for testing
    if (filteredStages.length === 0) {
      return stages.map((stageName, index) => ({
        name: stageName,
        value: 1000000 * (index + 1), // Mock values for testing
        count: index + 1,
        fill: stageColors[index],
      }))
    }

    return filteredStages
  }, [summaryStats])

  // Process division breakdown
  const divisionData = useMemo(() => {
    return Object.entries(summaryStats.divisionBreakdown || {}).map(([division, data]: [string, any]) => ({
      name: division,
      value: data.value,
      weightedValue: data.weightedValue,
      count: data.count,
      fill: division === "Residential" ? CHART_COLORS.info : CHART_COLORS.purple,
    }))
  }, [summaryStats])

  // Generate trend data (mock historical data)
  const trendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month, index) => ({
      month,
      pipeline: summaryStats.totalPipelineValue * (0.8 + Math.random() * 0.4),
      weighted: summaryStats.probabilityWeightedValue * (0.8 + Math.random() * 0.4),
      winRate: summaryStats.winRate * (0.9 + Math.random() * 0.2),
    }))
  }, [summaryStats])

  // Top opportunities analysis
  const topOpportunities = useMemo(() => {
    return pipelineData
      .sort((a, b) => b.config.pipelineValue - a.config.pipelineValue)
      .slice(0, 5)
      .map((item, index) => ({
        rank: index + 1,
        title: item.title,
        division: item.division,
        value: item.config.pipelineValue,
        probability: (item.config.probabilityWeighted / item.config.pipelineValue) * 100,
        location: item.location,
        type: item.type,
        expectedStart: item.anticipated_start,
      }))
  }, [pipelineData])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value.toLocaleString()}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  return (
    <>
      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div ref={containerRef} className={`space-y-${getSpacing()} overflow-hidden`}>
        {/* Pipeline Funnel Analysis */}
        <div className={`grid ${getGap()} ${isTiny || isMini || isCompact ? "grid-cols-1" : "lg:grid-cols-3"}`}>
          <Card
            className={`${
              isTiny || isMini || isCompact ? "col-span-1" : "lg:col-span-2"
            } overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm`}
          >
            <CardHeader
              className={`${isTiny ? "pb-2 px-3 pt-3" : isMini || isCompact ? "pb-3 px-4 pt-4" : "pb-4 px-5 pt-5"}`}
            >
              <CardTitle className={`flex items-center ${getGap()} ${getTitleSize()} truncate text-foreground`}>
                <Target className={`${getIconSize()} text-primary flex-shrink-0`} />
                <span className="truncate">
                  {isTiny ? "Pipeline" : isMini ? "Pipeline Funnel" : "Pipeline Funnel Analysis"}
                </span>
              </CardTitle>
              {!isTiny && !isMini && (
                <CardDescription className={`${getTextSize("text-sm")} truncate text-muted-foreground`}>
                  {isCompact ? "Sales stages" : "Opportunity progression through sales stages"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent
              className={`${isTiny ? "px-3 pb-3" : isMini || isCompact ? "px-4 pb-4" : "px-5 pb-5"} overflow-hidden`}
            >
              <ResponsiveContainer width="100%" height={isTiny ? 120 : isMini ? 150 : isCompact ? 200 : 350}>
                <RechartsFunnelChart>
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
                    </filter>
                  </defs>
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                    animationDuration={1000}
                    filter="url(#shadow)"
                  >
                    <LabelList
                      position="center"
                      fill="white"
                      fontSize={isTiny ? 8 : isMini ? 9 : isCompact ? 10 : 12}
                      fontWeight="600"
                      content={({ value, name }) => (
                        <text
                          x={0}
                          y={0}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize={isTiny ? 8 : isMini ? 9 : isCompact ? 10 : 12}
                          fontWeight="600"
                        >
                          <tspan x={0} dy="-6">
                            {name}
                          </tspan>
                          <tspan x={0} dy="12">
                            {formatCurrency(Number(value) || 0)}
                          </tspan>
                        </text>
                      )}
                    />
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="white" strokeWidth={1} />
                    ))}
                  </Funnel>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: "14px",
                    }}
                    formatter={(value: number, name: string, props: any) => [formatCurrency(value), "Pipeline Value"]}
                    labelFormatter={(label: string) => `${label} Stage`}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                </RechartsFunnelChart>
              </ResponsiveContainer>

              {/* Stage Breakdown */}
              <div className={`grid grid-cols-2 ${getGap()} mt-${getSpacing()}`}>
                {funnelData.map((stage, index) => (
                  <div
                    key={stage.name}
                    className={`text-center ${getPadding()} bg-muted/20 hover:bg-muted/30 transition-colors duration-200 rounded-lg overflow-hidden border border-border/30`}
                  >
                    <div className={`${getTextSize("text-sm")} font-medium text-muted-foreground truncate mb-1`}>
                      {isTiny ? stage.name.slice(0, 3) : isMini ? stage.name.slice(0, 4) : stage.name}
                    </div>
                    <div
                      className={`${
                        isTiny ? "text-xs" : isMini || isCompact ? "text-sm" : "text-lg"
                      } font-bold truncate mb-1`}
                      style={{ color: stage.fill }}
                    >
                      {stage.count}
                    </div>
                    <div className={`${isTiny ? "text-xs" : getTextSize("text-xs")} text-muted-foreground truncate`}>
                      {formatCurrency(stage.value)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HBI Pipeline Intelligence */}
          {!isTiny && !isMini && (
            <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 dark:from-primary/10 dark:via-primary/5 dark:to-secondary/10 border-primary/20 dark:border-primary/30 overflow-hidden backdrop-blur-sm">
              <CardHeader className={`${isCompact ? "pb-3 px-4 pt-4" : "pb-4 px-5 pt-5"}`}>
                <CardTitle
                  className={`flex items-center ${getGap()} text-primary dark:text-primary ${getTitleSize()} truncate`}
                >
                  <Brain className={`${getIconSize()} flex-shrink-0`} />
                  <span className="truncate">{isCompact ? "HBI Intelligence" : "HBI Pipeline Intelligence"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`space-y-${getSpacing()} ${isCompact ? "px-4 pb-4" : "px-5 pb-5"} overflow-hidden`}
              >
                <div className={`space-y-${getSpacing()}`}>
                  <div className={`flex items-start ${getGap()}`}>
                    <Lightbulb className={`${getIconSize()} text-warning mt-0.5 flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className={`${getTextSize("text-sm")} font-medium text-foreground truncate`}>
                        Opportunity Focus
                      </p>
                      <p className={`${getTextSize("text-xs")} text-muted-foreground line-clamp-2`}>
                        {divisionData.length > 0 && divisionData[0].name} division shows highest win probability at{" "}
                        {summaryStats.winRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start ${getGap()}`}>
                    <TrendingUp className={`${getIconSize()} text-success mt-0.5 flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className={`${getTextSize("text-sm")} font-medium text-foreground truncate`}>
                        Pipeline Momentum
                      </p>
                      <p className={`${getTextSize("text-xs")} text-muted-foreground line-clamp-2`}>
                        Weighted pipeline value at {formatCurrency(summaryStats.probabilityWeightedValue)} indicates
                        strong momentum
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start ${getGap()}`}>
                    <AlertTriangle className={`${getIconSize()} text-orange-500 mt-0.5 flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className={`${getTextSize("text-sm")} font-medium text-foreground truncate`}>
                        Action Required
                      </p>
                      <p className={`${getTextSize("text-xs")} text-muted-foreground line-clamp-2`}>
                        {funnelData.find((stage) => stage.name === "Proposal")?.count || 0} proposals need immediate
                        attention
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-start ${getGap()}`}>
                    <Target className={`${getIconSize()} text-primary mt-0.5 flex-shrink-0`} />
                    <div className="min-w-0 flex-1">
                      <p className={`${getTextSize("text-sm")} font-medium text-foreground truncate`}>
                        Conversion Optimization
                      </p>
                      <p className={`${getTextSize("text-xs")} text-muted-foreground line-clamp-2`}>
                        Focus on lead qualification to improve {summaryStats.conversionRate.toFixed(1)}% conversion rate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pipeline Health */}
                <div className={`pt-${getSpacing()} border-t border-border/30`}>
                  <div className={`flex items-center justify-between ${getTextSize("text-sm")}`}>
                    <span className="text-foreground font-medium truncate">Pipeline Health</span>
                    <Badge
                      variant={summaryStats.pipelineHealth >= 75 ? "default" : "secondary"}
                      className={`${
                        summaryStats.pipelineHealth >= 75
                          ? "bg-success/10 text-success border-success/20"
                          : summaryStats.pipelineHealth >= 50
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      } ${getTextSize("text-xs")} ml-2 flex-shrink-0 font-semibold`}
                    >
                      {summaryStats.pipelineHealth.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress
                    value={summaryStats.pipelineHealth}
                    className={`mt-3 h-${isCompact ? "2" : "3"} bg-muted/20`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Division & Size Analysis */}
        <div className={`grid ${getGap()} ${isCompact || isMini || isTiny ? "grid-cols-1" : "lg:grid-cols-2"}`}>
          {/* Division Distribution */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader
              className={`${isTiny ? "pb-2 px-3 pt-3" : isMini || isCompact ? "pb-3 px-4 pt-4" : "pb-4 px-5 pt-5"}`}
            >
              <CardTitle className={`flex items-center ${getGap()} ${getTitleSize()} truncate text-foreground`}>
                <PieChart className={`${getIconSize()} text-secondary flex-shrink-0`} />
                <span className="truncate">
                  {isTiny ? "Division" : isMini ? "Division Dist." : "Division Distribution"}
                </span>
              </CardTitle>
              {!isTiny && !isMini && (
                <CardDescription className={`${getTextSize("text-sm")} truncate text-muted-foreground`}>
                  {isCompact ? "Division breakdown" : "Pipeline breakdown by division"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent
              className={`${isTiny ? "px-3 pb-3" : isMini || isCompact ? "px-4 pb-4" : "px-5 pb-5"} overflow-hidden`}
            >
              <ResponsiveContainer width="100%" height={isTiny ? 100 : isMini ? 150 : isCompact ? 200 : 300}>
                <RechartsPieChart>
                  <defs>
                    <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  <Pie
                    data={divisionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={
                      isTiny || isMini
                        ? false
                        : ({ name, value, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={isTiny ? 30 : isMini ? 40 : isCompact ? 60 : 80}
                    innerRadius={isTiny ? 10 : isMini ? 15 : isCompact ? 20 : 25}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1000}
                    filter="url(#pie-shadow)"
                  >
                    {divisionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: "14px",
                    }}
                    formatter={(value: number, name: string, props: any) => [formatCurrency(value), "Pipeline Value"]}
                    labelFormatter={(label: string) => `${label} Division`}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Division Metrics */}
              <div className={`grid grid-cols-2 ${getGap()} mt-${getSpacing()}`}>
                {divisionData.map((division, index) => (
                  <div
                    key={division.name}
                    className={`text-center ${getPadding()} bg-muted/20 hover:bg-muted/30 transition-colors duration-200 rounded-lg overflow-hidden border border-border/30 shadow-sm`}
                  >
                    <div className={`${getTextSize("text-sm")} font-medium text-muted-foreground truncate mb-1`}>
                      {isTiny
                        ? division.name.slice(0, 4)
                        : isMini
                        ? division.name.slice(0, 6)
                        : isCompact
                        ? division.name.slice(0, 8)
                        : division.name}
                    </div>
                    <div
                      className={`${
                        isTiny ? "text-xs" : isMini || isCompact ? "text-sm" : "text-lg"
                      } font-bold truncate mb-1`}
                      style={{ color: division.fill }}
                    >
                      {division.count}
                    </div>
                    <div className={`${getTextSize("text-xs")} text-muted-foreground truncate`}>
                      {formatCurrency(division.weightedValue || 0)}{" "}
                      {!isTiny && <span className="text-xs opacity-75">weighted</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Trends */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader
              className={`${isTiny ? "pb-2 px-3 pt-3" : isMini || isCompact ? "pb-3 px-4 pt-4" : "pb-4 px-5 pt-5"}`}
            >
              <CardTitle className={`flex items-center ${getGap()} ${getTitleSize()} truncate text-foreground`}>
                <BarChart3 className={`${getIconSize()} text-primary flex-shrink-0`} />
                <span className="truncate">{isTiny ? "Trends" : isMini ? "Pipeline Trends" : "Pipeline Trends"}</span>
              </CardTitle>
              {!isTiny && !isMini && (
                <CardDescription className={`${getTextSize("text-sm")} truncate text-muted-foreground`}>
                  {isCompact ? "6-month trends" : "6-month pipeline and win rate trends"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent
              className={`${isTiny ? "px-3 pb-3" : isMini || isCompact ? "px-4 pb-4" : "px-5 pb-5"} overflow-hidden`}
            >
              <ResponsiveContainer width="100%" height={isTiny ? 100 : isMini ? 150 : isCompact ? 200 : 300}>
                <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="pipelineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="weightedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    fontSize={isTiny ? 8 : isMini || isCompact ? 10 : 12}
                    tick={{
                      fontSize: isTiny ? 8 : isMini || isCompact ? 10 : 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    fontSize={isTiny ? 8 : isMini || isCompact ? 10 : 12}
                    tick={{
                      fontSize: isTiny ? 8 : isMini || isCompact ? 10 : 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: "14px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "winRate" ? `${value.toFixed(1)}%` : formatCurrency(value),
                      name === "pipeline" ? "Total Pipeline" : name === "weighted" ? "Weighted Value" : "Win Rate",
                    ]}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  {!isTiny && !isMini && (
                    <Legend iconType="circle" wrapperStyle={{ color: "hsl(var(--muted-foreground))" }} />
                  )}
                  <Area
                    type="monotone"
                    dataKey="pipeline"
                    stackId="1"
                    stroke={CHART_COLORS.primary}
                    fill="url(#pipelineGradient)"
                    strokeWidth={isTiny ? 1 : isMini || isCompact ? 2 : 2}
                    name="Total Pipeline"
                    dot={{ r: isTiny ? 2 : 3, fill: CHART_COLORS.primary }}
                    activeDot={{ r: isTiny ? 3 : 4, fill: CHART_COLORS.primary }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weighted"
                    stackId="2"
                    stroke={CHART_COLORS.secondary}
                    fill="url(#weightedGradient)"
                    strokeWidth={isTiny ? 1 : isMini || isCompact ? 2 : 2}
                    name="Weighted Value"
                    dot={{ r: isTiny ? 2 : 3, fill: CHART_COLORS.secondary }}
                    activeDot={{ r: isTiny ? 3 : 4, fill: CHART_COLORS.secondary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke={CHART_COLORS.accent}
                    strokeWidth={isTiny ? 1 : isMini || isCompact ? 2 : 3}
                    name="Win Rate %"
                    dot={{ r: isTiny ? 2 : 3, fill: CHART_COLORS.accent }}
                    activeDot={{ r: isTiny ? 3 : 4, fill: CHART_COLORS.accent }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Opportunities */}
        <div className={`grid ${getGap()} ${isCompact || isMini || isTiny ? "grid-cols-1" : "lg:grid-cols-2"}`}>
          {/* Recent Activity */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader
              className={`${isTiny ? "pb-2 px-3 pt-3" : isMini || isCompact ? "pb-3 px-4 pt-4" : "pb-4 px-5 pt-5"}`}
            >
              <CardTitle className={`flex items-center ${getGap()} ${getTitleSize()} truncate text-foreground`}>
                <Activity className={`${getIconSize()} text-success flex-shrink-0`} />
                <span className="truncate">{isTiny ? "Activity" : isMini ? "Recent Activity" : "Recent Activity"}</span>
              </CardTitle>
              {!isTiny && !isMini && (
                <CardDescription className={`${getTextSize("text-sm")} truncate text-muted-foreground`}>
                  {isCompact ? "Latest wins/losses" : "Latest wins and losses"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent
              className={`${isTiny ? "px-3 pb-3" : isMini || isCompact ? "px-4 pb-4" : "px-5 pb-5"} overflow-hidden`}
            >
              <Tabs defaultValue="wins" className={`space-y-${getSpacing()}`}>
                <TabsList className="grid w-full grid-cols-2 bg-muted/30 border border-border/30">
                  <TabsTrigger
                    value="wins"
                    className={`flex items-center ${getGap()} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
                  >
                    <Trophy className={`${getSmallIconSize()} flex-shrink-0 text-success`} />
                    <span className={`${getTextSize("text-sm")} truncate`}>
                      {isTiny ? "Wins" : isCompact ? "Wins" : "Recent Wins"} ({summaryStats.recentWins?.length || 0})
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="losses"
                    className={`flex items-center ${getGap()} data-[state=active]:bg-background data-[state=active]:shadow-sm`}
                  >
                    <TrendingDown className={`${getSmallIconSize()} flex-shrink-0 text-destructive`} />
                    <span className={`${getTextSize("text-sm")} truncate`}>
                      {isTiny ? "Losses" : isCompact ? "Losses" : "Recent Losses"} (
                      {summaryStats.recentLosses?.length || 0})
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="wins" className={`space-y-${getSpacing()}`}>
                  {summaryStats.recentWins?.slice(0, isTiny ? 2 : isCompact ? 3 : 5).map((win: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between ${getPadding()} bg-success/5 hover:bg-success/10 transition-colors duration-200 rounded-lg border border-success/20 overflow-hidden shadow-sm`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-foreground ${getTextSize("text-sm")} truncate`}>
                          {win.name}
                        </div>
                        {!isTiny && !isMini && (
                          <div className={`${getTextSize("text-sm")} text-muted-foreground truncate`}>
                            {win.division}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={`bg-success/10 text-success border-success/20 ml-2 ${getTextSize(
                          "text-xs"
                        )} flex-shrink-0 font-semibold`}
                      >
                        {formatCurrency(win.value)}
                      </Badge>
                    </div>
                  )) || (
                    <div className={`text-center py-${isTiny ? "2" : isCompact ? "4" : "6"} text-muted-foreground`}>
                      <Trophy
                        className={`${isTiny ? "h-4 w-4" : isCompact ? "h-6 w-6" : "h-8 w-8"} mx-auto mb-2 opacity-50`}
                      />
                      <p className={getTextSize("text-sm")}>No recent wins to display</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="losses" className={`space-y-${getSpacing()}`}>
                  {summaryStats.recentLosses
                    ?.slice(0, isTiny ? 2 : isCompact ? 3 : 5)
                    .map((loss: any, index: number) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between ${getPadding()} bg-destructive/5 hover:bg-destructive/10 transition-colors duration-200 rounded-lg border border-destructive/20 overflow-hidden shadow-sm`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-foreground ${getTextSize("text-sm")} truncate`}>
                            {loss.name}
                          </div>
                          {!isTiny && !isMini && (
                            <div className={`${getTextSize("text-sm")} text-muted-foreground truncate`}>
                              {loss.division}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={`bg-destructive/10 text-destructive border-destructive/20 ml-2 ${getTextSize(
                            "text-xs"
                          )} flex-shrink-0 font-semibold`}
                        >
                          {formatCurrency(loss.value)}
                        </Badge>
                      </div>
                    )) || (
                    <div className={`text-center py-${isTiny ? "2" : isCompact ? "4" : "6"} text-muted-foreground`}>
                      <CheckCircle
                        className={`${isTiny ? "h-4 w-4" : isCompact ? "h-6 w-6" : "h-8 w-8"} mx-auto mb-2 opacity-50`}
                      />
                      <p className={getTextSize("text-sm")}>No recent losses</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Top Opportunities */}
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader
              className={`${isTiny ? "pb-2 px-3 pt-3" : isMini || isCompact ? "pb-3 px-4 pt-4" : "pb-4 px-5 pt-5"}`}
            >
              <CardTitle className={`flex items-center ${getGap()} ${getTitleSize()} truncate text-foreground`}>
                <Star className={`${getIconSize()} text-warning flex-shrink-0`} />
                <span className="truncate">
                  {isTiny ? "Top Ops" : isMini ? "Top Opportunities" : "Top Opportunities"}
                </span>
              </CardTitle>
              {!isTiny && !isMini && (
                <CardDescription className={`${getTextSize("text-sm")} truncate text-muted-foreground`}>
                  {isCompact ? "Highest value opportunities" : "Highest value opportunities in pipeline"}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent
              className={`${isTiny ? "px-3 pb-3" : isMini || isCompact ? "px-4 pb-4" : "px-5 pb-5"} overflow-hidden`}
            >
              <div className={`space-y-${getSpacing()}`}>
                {topOpportunities.slice(0, isTiny ? 2 : isCompact ? 3 : 5).map((opportunity, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${getGap()} ${getPadding()} bg-muted/20 hover:bg-muted/30 transition-colors duration-200 rounded-lg overflow-hidden border border-border/30 shadow-sm`}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        isTiny ? "w-4 h-4" : isMini || isCompact ? "w-6 h-6" : "w-8 h-8"
                      } bg-primary rounded-full flex items-center justify-center text-primary-foreground ${getTextSize(
                        "text-sm"
                      )} font-bold shadow-sm`}
                    >
                      {opportunity.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className={`font-medium text-foreground truncate ${getTextSize("text-sm")}`}>
                          {opportunity.title}
                        </div>
                        <Badge
                          variant="outline"
                          className={`ml-2 ${getTextSize(
                            "text-xs"
                          )} flex-shrink-0 bg-primary/10 text-primary border-primary/20 font-semibold`}
                        >
                          {formatCurrency(opportunity.value)}
                        </Badge>
                      </div>
                      {!isTiny && !isMini && (
                        <div
                          className={`flex items-center ${getGap()} ${getTextSize("text-xs")} text-muted-foreground`}
                        >
                          <div className="flex items-center gap-1 truncate">
                            <Building2 className={`${getSmallIconSize()} flex-shrink-0 text-muted-foreground`} />
                            <span className="truncate">
                              {isCompact ? opportunity.division.slice(0, 6) : opportunity.division}
                            </span>
                          </div>
                          {!isCompact && (
                            <>
                              <div className="flex items-center gap-1 truncate">
                                <MapPin className={`${getSmallIconSize()} flex-shrink-0 text-muted-foreground`} />
                                <span className="truncate">
                                  {opportunity.location?.city}, {opportunity.location?.state}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 truncate">
                                <Calendar className={`${getSmallIconSize()} flex-shrink-0 text-muted-foreground`} />
                                <span className="truncate">{formatDate(opportunity.expectedStart)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      <div className={`mt-${getSpacing()}`}>
                        <div className={`flex items-center justify-between ${getTextSize("text-xs")}`}>
                          <span className="truncate text-muted-foreground">Probability</span>
                          <span className="font-semibold flex-shrink-0 text-foreground">
                            {opportunity.probability.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={opportunity.probability}
                          className={`mt-2 h-${isCompact ? "2" : "2"} bg-muted/30`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
