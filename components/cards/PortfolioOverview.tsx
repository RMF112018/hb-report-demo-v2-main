"use client"

import { useEffect, useState, useMemo } from "react"
import {
  TrendingUp,
  DollarSign,
  Building2,
  Layers3,
  Calendar,
  MapPin,
  Target,
  Award,
  Brain,
  CheckCircle,
  Activity,
  BarChart3,
  Shield,
} from "lucide-react"
import { AreaChart } from "@/components/charts/AreaChart"
import { CustomBarChart } from "@/components/charts/BarChart"

// Import project and pipeline data
import projectsData from "@/data/mock/projects.json"
import pipelineData from "@/data/mock/precon/pipeline.json"
import { cn } from "@/lib/utils"

interface PortfolioOverviewProps {
  card?: { id: string; type: string; title: string }
  config: {
    totalProjects: number
    activeProjects: number
    completedThisYear: number
    averageDuration: number
    averageContractValue: number
    totalSqFt: number
    totalValue: number
    netCashFlow: number
    averageWorkingCapital: number
  }
  span: { cols: number; rows: number }
  isCompact?: boolean
}

/**
 * Enhanced Portfolio Overview Card
 * --------------------------------
 * Comprehensive portfolio analytics with advanced visualizations
 * Features multiple chart types and detailed portfolio insights
 */

// Process project data for charts
const processProjectData = () => {
  console.log("📊 Processing project data...")
  console.log("Projects data:", projectsData.length, "items")
  console.log("Pipeline data:", pipelineData.length, "items")

  // Group projects by stage
  const projectsByStage = projectsData.reduce((acc: any, project: any) => {
    const stage = project.project_stage_name
    if (!acc[stage]) {
      acc[stage] = { count: 0, value: 0 }
    }
    acc[stage].count += 1
    acc[stage].value += project.total_value || 0
    return acc
  }, {})

  // Group projects by type
  const projectsByType = projectsData.reduce((acc: any, project: any) => {
    const type = project.project_type_name
    if (!acc[type]) {
      acc[type] = { count: 0, value: 0 }
    }
    acc[type].count += 1
    acc[type].value += project.total_value || 0
    return acc
  }, {})

  // Process pipeline data
  const pipelineByStage = pipelineData.reduce((acc: any, pipeline: any) => {
    pipeline.config.stages.forEach((stage: any) => {
      if (!acc[stage.stage]) {
        acc[stage.stage] = { count: 0, value: 0 }
      }
      acc[stage.stage].count += stage.count
      acc[stage.stage].value += stage.value
    })
    return acc
  }, {})

  // Calculate active vs completed projects
  const activeProjects = projectsData.filter((p: any) => p.active).length
  const completedProjects = projectsData.filter((p: any) => !p.active).length
  const totalPipelineProjects = pipelineData.reduce((sum: number, p: any) => {
    return sum + p.config.stages.reduce((stageSum: number, s: any) => stageSum + s.count, 0)
  }, 0)

  const projectStageDistribution = Object.entries(projectsByStage).map(([stage, data]: [string, any]) => ({
    name: stage,
    value: data.count,
  }))

  const projectTypeDistribution = Object.entries(projectsByType).map(([type, data]: [string, any]) => ({
    name: type,
    value: data.count,
  }))

  const pipelineStageDistribution = Object.entries(pipelineByStage).map(([stage, data]: [string, any]) => ({
    name: stage,
    value: data.count,
  }))

  console.log("📈 Projects by stage:", projectsByStage)
  console.log("📊 Project stage distribution:", projectStageDistribution)
  console.log("🏗️ Project type distribution:", projectTypeDistribution)
  console.log("⚡ Pipeline stage distribution:", pipelineStageDistribution)

  // Create fallback data if processing fails
  const fallbackProjectStageDistribution = [
    { name: "Construction", value: 8 },
    { name: "Bidding", value: 3 },
    { name: "Pre-Construction", value: 4 },
    { name: "Closeout", value: 2 },
    { name: "On Hold", value: 1 },
  ]

  const fallbackProjectTypeDistribution = [
    { name: "Residential", value: 7 },
    { name: "Commercial", value: 10 },
    { name: "Mixed-Use", value: 3 },
  ]

  const fallbackPipelineStageDistribution = [
    { name: "Lead", value: 42 },
    { name: "Proposal", value: 28 },
    { name: "Negotiation", value: 18 },
    { name: "Award", value: 75 },
  ]

  // Use fallback data if processed data is empty
  const finalProjectStageDistribution =
    projectStageDistribution.length > 0 ? projectStageDistribution : fallbackProjectStageDistribution
  const finalProjectTypeDistribution =
    projectTypeDistribution.length > 0 ? projectTypeDistribution : fallbackProjectTypeDistribution
  const finalPipelineStageDistribution =
    pipelineStageDistribution.length > 0 ? pipelineStageDistribution : fallbackPipelineStageDistribution

  console.log("🎯 Final project stage distribution:", finalProjectStageDistribution)
  console.log("🎯 Final project type distribution:", finalProjectTypeDistribution)
  console.log("🎯 Final pipeline stage distribution:", finalPipelineStageDistribution)

  return {
    projectsByStage,
    projectsByType,
    pipelineByStage,
    activeProjects: activeProjects || 17,
    completedProjects: completedProjects || 3,
    totalPipelineProjects: totalPipelineProjects || 163,
    projectStageDistribution: finalProjectStageDistribution,
    projectTypeDistribution: finalProjectTypeDistribution,
    pipelineStageDistribution: finalPipelineStageDistribution,
    overallDistribution: [
      { name: "Active Projects", value: activeProjects || 17 },
      { name: "Completed Projects", value: completedProjects || 3 },
      { name: "Pipeline Projects", value: totalPipelineProjects || 163 },
    ],
  }
}

const formatCurrency = (value?: number, compact = true) => {
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0
  if (compact) {
    if (safeValue >= 1_000_000) return `$${(safeValue / 1_000_000).toFixed(1)}M`
    if (safeValue >= 1_000) return `$${(safeValue / 1_000).toFixed(1)}K`
    return `$${safeValue.toLocaleString()}`
  }
  return `$${safeValue.toLocaleString()}`
}

const formatNumber = (value?: number, compact = true) => {
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0
  if (compact) {
    if (safeValue >= 1_000_000) return `${(safeValue / 1_000_000).toFixed(1)}M`
    if (safeValue >= 1_000) return `${(safeValue / 1_000).toFixed(0)}K`
    return safeValue.toLocaleString()
  }
  return safeValue.toLocaleString()
}

export default function PortfolioOverview({ card, config, span, isCompact = false }: PortfolioOverviewProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "regional" | "cashflow">("overview")

  // Calculate card size categories based on span
  const cardArea = span.cols * span.rows
  const isVerySmall = cardArea <= 20 // 4x5 or smaller
  const isSmall = cardArea <= 32 // 6x5 or smaller
  const isMedium = cardArea <= 50 // 10x5 or smaller
  const isWide = span.cols >= 10 // Wide cards
  const isTall = span.rows >= 6 // Tall cards
  const isLarge = cardArea >= 60 // Large cards

  // Check if this is the optimal size for 100% content
  if (span.cols === 12 && span.rows === 4) {
    console.log("🎯 PortfolioOverview is at optimal size (12x4) for 100% content display!")
  }

  // Listen for drill down events from DashboardCardWrapper
  useEffect(() => {
    if (!card) return

    const handleDrillDownEvent = (event: CustomEvent) => {
      if (event.detail.cardId === card.id || event.detail.cardType === "portfolio-overview") {
        const shouldShow = event.detail.action === "show"
        setShowDrillDown(shouldShow)

        // Notify wrapper of state change
        const stateEvent = new CustomEvent("cardDrillDownStateChange", {
          detail: {
            cardId: card.id,
            cardType: "portfolio-overview",
            isActive: shouldShow,
          },
        })
        window.dispatchEvent(stateEvent)
      }
    }

    window.addEventListener("cardDrillDown", handleDrillDownEvent as EventListener)

    return () => {
      window.removeEventListener("cardDrillDown", handleDrillDownEvent as EventListener)
    }
  }, [card])

  // Function to handle closing the drill down overlay
  const handleCloseDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDrillDown(false)

    if (!card) return

    // Notify wrapper that drill down is closed
    const stateEvent = new CustomEvent("cardDrillDownStateChange", {
      detail: {
        cardId: card.id,
        cardType: "portfolio-overview",
        isActive: false,
      },
    })
    window.dispatchEvent(stateEvent)
  }

  const {
    totalProjects,
    activeProjects,
    completedThisYear,
    averageDuration,
    averageContractValue,
    totalSqFt,
    totalValue,
    netCashFlow,
    averageWorkingCapital,
  } = config

  // Process real project data for charts
  const realProjectData = useMemo(() => processProjectData(), [])

  // Enhanced Portfolio Data - Based on actual Florida construction portfolio
  const portfolioPerformanceData = useMemo(
    () => [
      { name: "Jan", portfolioValue: 68.2, netCashFlow: 8.5, projectsActive: 18, riskScore: 15 },
      { name: "Feb", portfolioValue: 69.8, netCashFlow: 9.2, projectsActive: 19, riskScore: 12 },
      { name: "Mar", portfolioValue: 71.5, netCashFlow: 10.8, projectsActive: 22, riskScore: 18 },
      { name: "Apr", portfolioValue: 72.8, netCashFlow: 11.5, projectsActive: 21, riskScore: 14 },
      { name: "May", portfolioValue: 74.1, netCashFlow: 12.1, projectsActive: 23, riskScore: 16 },
      { name: "Jun", portfolioValue: 75.0, netCashFlow: 12.5, projectsActive: 24, riskScore: 13 },
    ],
    []
  )

  // Regional Distribution - Florida regions
  const regionalData = useMemo(
    () => [
      { name: "Central FL", value: 28.5, projects: 8, color: "#3b82f6" },
      { name: "Southeast FL", value: 22.3, projects: 6, color: "#10b981" },
      { name: "North FL", value: 12.8, projects: 4, color: "#f59e0b" },
      { name: "Southwest FL", value: 8.9, projects: 3, color: "#ef4444" },
      { name: "Space Coast", value: 2.5, projects: 3, color: "#8b5cf6" },
    ],
    []
  )

  // Cash Flow Trends - Multi-series data
  const cashFlowData = useMemo(
    () => [
      { name: "Q1", inflows: 45.2, outflows: 38.7, netFlow: 6.5 },
      { name: "Q2", inflows: 52.8, outflows: 43.2, netFlow: 9.6 },
      { name: "Q3", inflows: 58.1, outflows: 47.8, netFlow: 10.3 },
      { name: "Q4", inflows: 63.5, outflows: 51.0, netFlow: 12.5 },
    ],
    []
  )

  // Budget vs Actual Performance
  const budgetActualData = useMemo(
    () => [
      { name: "Jan", budget: 12.5, actual: 11.8, variance: -0.7 },
      { name: "Feb", budget: 13.2, actual: 12.9, variance: -0.3 },
      { name: "Mar", budget: 14.1, actual: 14.5, variance: 0.4 },
      { name: "Apr", budget: 13.8, actual: 13.2, variance: -0.6 },
      { name: "May", budget: 15.2, actual: 15.1, variance: -0.1 },
      { name: "Jun", budget: 14.9, actual: 15.4, variance: 0.5 },
    ],
    []
  )

  // Risk Analysis Data
  const riskMetrics = useMemo(
    () => ({
      criticalProjects: 2,
      atRiskBudget: 8.2,
      delayedProjects: 1,
      cashFlowRisk: 5.5,
      overallRiskScore: 13, // Lower is better
    }),
    []
  )

  // Dynamic scaling based on card size
  const getSizeClasses = () => {
    const optimalArea = 48 // 12x4 optimal size
    const scaleFactor = Math.min(Math.max(cardArea / optimalArea, 0.4), 1.3)

    const baseConfig = {
      padding: 8,
      headerPadding: 8,
      fontSize: 11,
      titleFontSize: 13,
      metricFontSize: 15,
      gap: 6,
      chartHeight: 120,
      iconSize: 13,
    }

    const scaledConfig = {
      padding: Math.max(6, Math.round(baseConfig.padding * scaleFactor)),
      headerPadding: Math.max(4, Math.round(baseConfig.headerPadding * scaleFactor)),
      fontSize: Math.max(10, Math.round(baseConfig.fontSize * scaleFactor)),
      titleFontSize: Math.max(12, Math.round(baseConfig.titleFontSize * scaleFactor)),
      metricFontSize: Math.max(14, Math.round(baseConfig.metricFontSize * scaleFactor)),
      gap: Math.max(4, Math.round(baseConfig.gap * scaleFactor)),
      chartHeight: Math.max(80, Math.round(baseConfig.chartHeight * scaleFactor)),
      iconSize: Math.max(12, Math.round(baseConfig.iconSize * scaleFactor)),
    }

    return {
      ...scaledConfig,
      gridCols: isWide ? "grid-cols-4" : isSmall ? "grid-cols-2" : "grid-cols-3",
      showTabs: !isVerySmall && !isSmall,
      showCharts: !isVerySmall,
      showFooter: isTall,
      maxMetrics: isVerySmall ? 3 : isSmall ? 4 : 4,
      scaleFactor,
    }
  }

  const sizeClasses = getSizeClasses()

  // Debug chart height
  console.log(
    "📏 Chart height being used:",
    sizeClasses.chartHeight,
    "Card area:",
    cardArea,
    "Scale factor:",
    sizeClasses.scaleFactor
  )

  // Enhanced metrics with better icons and colors
  const allMetrics = [
    {
      icon: (
        <Building2
          className="text-blue-600 dark:text-blue-400"
          style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
        />
      ),
      label: isVerySmall ? "Projects" : "Total Projects",
      value: projectsData.length,
      subtitle: `${realProjectData.activeProjects} active`,
      trend: `+${realProjectData.totalPipelineProjects} in pipeline`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: (
        <DollarSign
          className="text-green-600 dark:text-green-400"
          style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
        />
      ),
      label: isVerySmall ? "Value" : "Portfolio Value",
      value: formatCurrency(totalValue),
      subtitle: "total value",
      trend: "+3.2% YTD",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: (
        <TrendingUp
          className="text-indigo-600 dark:text-indigo-400"
          style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
        />
      ),
      label: isVerySmall ? "Cash Flow" : "Net Cash Flow",
      value: formatCurrency(netCashFlow),
      subtitle: "this month",
      trend: "+8.5% vs. last month",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: (
        <Layers3
          className="text-purple-600 dark:text-purple-400"
          style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
        />
      ),
      label: isVerySmall ? "Sq Ft" : "Total Sq Ft",
      value: formatNumber(totalSqFt),
      subtitle: "square feet",
      trend: "12 projects",
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  const visibleMetrics = allMetrics.slice(0, sizeClasses.maxMetrics)

  // Tab configuration
  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "performance", label: "Performance", icon: BarChart3 },
    { id: "regional", label: "Regional", icon: MapPin },
    { id: "cashflow", label: "Cash Flow", icon: TrendingUp },
  ]

  return (
    <div className="relative h-full" data-tour="portfolio-overview-card">
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Enhanced Metrics Header */}
        <div
          className="flex-shrink-0 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"
          style={{ padding: sizeClasses.headerPadding }}
        >
          <div className={`${sizeClasses.gridCols} grid`} style={{ gap: sizeClasses.gap }}>
            {visibleMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {metric.icon}
                  <span className="ml-2 font-medium text-muted-foreground" style={{ fontSize: sizeClasses.fontSize }}>
                    {metric.label}
                  </span>
                </div>
                <div className="font-bold text-foreground" style={{ fontSize: sizeClasses.metricFontSize }}>
                  {metric.value}
                </div>
                <div className="text-muted-foreground" style={{ fontSize: sizeClasses.fontSize - 2 }}>
                  {metric.subtitle}
                </div>
                {!isVerySmall && (
                  <div
                    className="text-green-600 dark:text-green-400 font-medium mt-1"
                    style={{ fontSize: sizeClasses.fontSize - 2 }}
                  >
                    {metric.trend}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        {sizeClasses.showTabs && (
          <div
            className="flex-shrink-0 border-b border-gray-300 dark:border-gray-700"
            style={{ padding: sizeClasses.headerPadding / 2 }}
          >
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-gray-300 dark:bg-gray-700 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  style={{ fontSize: sizeClasses.fontSize }}
                >
                  <tab.icon className="mr-1" style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-hidden" style={{ padding: sizeClasses.padding }}>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-full">
              {/* Projects by Stage */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <Building2
                    className="mr-2 text-green-600 dark:text-green-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Projects by Stage
                </h4>
                <div style={{ height: sizeClasses.chartHeight }}></div>
              </div>

              {/* Projects by Type */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <Layers3
                    className="mr-2 text-purple-600 dark:text-purple-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Projects by Type
                </h4>
                <div style={{ height: sizeClasses.chartHeight }}>
                  <CustomBarChart
                    data={realProjectData.projectTypeDistribution}
                    colors={["#8b5cf6", "#10b981", "#3b82f6"]}
                    compact={true}
                    showGrid={true}
                    showValues={true}
                    animated={true}
                    height={sizeClasses.chartHeight}
                  />
                </div>
              </div>

              {/* Pipeline Distribution */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <TrendingUp
                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Pipeline by Stage
                </h4>
                <div style={{ height: sizeClasses.chartHeight }}>
                  <CustomBarChart
                    data={realProjectData.pipelineStageDistribution}
                    colors={["#6366f1", "#06b6d4", "#10b981", "#f59e0b"]}
                    compact={true}
                    showGrid={true}
                    showValues={true}
                    animated={true}
                    height={sizeClasses.chartHeight}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Budget vs Actual */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <Target
                    className="mr-2 text-indigo-600 dark:text-indigo-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Budget vs Actual
                </h4>
                <div style={{ height: sizeClasses.chartHeight }}>
                  <AreaChart
                    data={budgetActualData.map((d) => ({ name: d.name, value: d.actual }))}
                    color="#6366f1"
                    compact={true}
                    showGrid={true}
                    showDots={false}
                    animated={true}
                    height={sizeClasses.chartHeight}
                  />
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <Shield
                    className="mr-2 text-orange-600 dark:text-orange-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Risk Analysis
                </h4>
                <div className="space-y-2" style={{ fontSize: sizeClasses.fontSize }}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Critical Projects:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">{riskMetrics.criticalProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">At-Risk Budget:</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      ${riskMetrics.atRiskBudget}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delayed Projects:</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {riskMetrics.delayedProjects}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overall Risk Score:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {riskMetrics.overallRiskScore}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "regional" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Regional Performance */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <MapPin
                    className="mr-2 text-purple-600 dark:text-purple-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Projects by Type
                </h4>
                <div style={{ height: sizeClasses.chartHeight }}>
                  <CustomBarChart
                    data={realProjectData.projectTypeDistribution}
                    colors={["#8b5cf6", "#10b981", "#3b82f6"]}
                    compact={true}
                    showGrid={true}
                    showValues={true}
                    animated={true}
                    height={sizeClasses.chartHeight}
                  />
                </div>
              </div>

              {/* Regional Breakdown */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <BarChart3
                    className="mr-2 text-teal-600 dark:text-teal-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Project Type Breakdown
                </h4>
                <div className="space-y-2" style={{ fontSize: sizeClasses.fontSize }}>
                  {realProjectData.projectTypeDistribution.map((type, index) => {
                    const colors = ["#8b5cf6", "#10b981", "#3b82f6"]
                    const typeData = realProjectData.projectsByType[type.name]
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                          <span className="text-muted-foreground">{type.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{type.value} projects</div>
                          <div className="text-xs text-gray-300">${(typeData.value / 1000000).toFixed(1)}M total</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "cashflow" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Cash Flow Trends */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <TrendingUp
                    className="mr-2 text-blue-600 dark:text-blue-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Cash Flow Trends
                </h4>
                <div style={{ height: sizeClasses.chartHeight }}>
                  <AreaChart
                    data={cashFlowData.map((d) => ({ name: d.name, value: d.netFlow }))}
                    color="#06b6d4"
                    compact={true}
                    showGrid={true}
                    showDots={false}
                    animated={true}
                    height={sizeClasses.chartHeight}
                  />
                </div>
              </div>

              {/* Cash Flow Metrics */}
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                <h4
                  className="font-semibold text-foreground mb-2 flex items-center"
                  style={{ fontSize: sizeClasses.titleFontSize }}
                >
                  <DollarSign
                    className="mr-2 text-green-600 dark:text-green-400"
                    style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                  />
                  Cash Flow Metrics
                </h4>
                <div className="space-y-2" style={{ fontSize: sizeClasses.fontSize }}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Month:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">$12.5M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">3-Month Avg:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">$10.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Working Capital:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">$24.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cash Flow Risk:</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">Low</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        {sizeClasses.showFooter && (
          <div
            className="flex-shrink-0 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"
            style={{ padding: sizeClasses.padding }}
          >
            <div className="grid grid-cols-4 gap-4" style={{ fontSize: sizeClasses.fontSize }}>
              <div className="flex items-center">
                <Calendar
                  className="text-muted-foreground mr-2"
                  style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                />
                <span className="text-muted-foreground">Avg Duration: </span>
                <span className="font-semibold text-foreground ml-1">{averageDuration}d</span>
              </div>
              <div className="flex items-center">
                <DollarSign
                  className="text-muted-foreground mr-2"
                  style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                />
                <span className="text-muted-foreground">Avg Value: </span>
                <span className="font-semibold text-foreground ml-1">{formatCurrency(averageContractValue)}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle
                  className="text-green-600 dark:text-green-400 mr-2"
                  style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                />
                <span className="text-muted-foreground">Completed: </span>
                <span className="font-semibold text-foreground ml-1">{completedThisYear}</span>
              </div>
              <div className="flex items-center">
                <Shield
                  className="text-blue-600 dark:text-blue-400 mr-2"
                  style={{ width: sizeClasses.iconSize, height: sizeClasses.iconSize }}
                />
                <span className="text-muted-foreground">Health: </span>
                <span className="font-semibold text-green-600 dark:text-green-400 ml-1">Excellent</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-4 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
          <div className="h-full">
            {/* Close Button */}
            <button
              onClick={handleCloseDrillDown}
              className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close drill down"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-medium mb-4 text-center">Portfolio Intelligence Deep Dive</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-80px)]">
              {/* Advanced Analytics */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI-Powered Insights
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-blue-500/20 rounded-lg p-3">
                      <div className="font-medium text-blue-300">Portfolio Optimization</div>
                      <div className="text-blue-200">Resource reallocation could improve efficiency by 12%</div>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3">
                      <div className="font-medium text-green-300">Cash Flow Forecast</div>
                      <div className="text-green-200">Positive trend expected for next 6 months</div>
                    </div>
                    <div className="bg-orange-500/20 rounded-lg p-3">
                      <div className="font-medium text-orange-300">Risk Alert</div>
                      <div className="text-orange-200">2 projects require immediate attention</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Key Performance Indicators
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Portfolio ROI:</span>
                      <span className="font-medium text-green-400">18.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Delivery:</span>
                      <span className="font-medium text-green-400">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget Adherence:</span>
                      <span className="font-medium text-yellow-400">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Satisfaction:</span>
                      <span className="font-medium text-green-400">4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Productivity:</span>
                      <span className="font-medium text-blue-400">112%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Project Analysis */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Top Performing Projects
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Miami Commercial Tower</div>
                          <div className="text-xs text-blue-200">$250M • Commercial • On Track</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-medium">+5.2%</div>
                          <div className="text-xs">vs budget</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-white/20 pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Palm Beach Estate</div>
                          <div className="text-xs text-blue-200">$75M • Residential • 85% Complete</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-medium">+2.8%</div>
                          <div className="text-xs">vs budget</div>
                        </div>
                      </div>
                    </div>
                    <div className="pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Naples Waterfront</div>
                          <div className="text-xs text-blue-200">$95M • Mixed-Use • Planning</div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-medium">-1.2%</div>
                          <div className="text-xs">vs budget</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Regional Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    {regionalData.map((region, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: region.color }} />
                          <span>{region.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${region.value}M</div>
                          <div className="text-xs text-gray-300">{region.projects} projects</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
