"use client"

import { useEffect, useState, useMemo } from "react"
import {
  TrendingUp,
  DollarSign,
  Building2,
  Layers3,
  Users,
  Calendar,
  Briefcase,
  MapPin,
  Target,
  Award,
  Brain,
} from "lucide-react"
import { AreaChart } from "@/components/charts/AreaChart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { CustomBarChart } from "@/components/charts/BarChart"
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
 * Compact Portfolio Overview Card
 * ------------------------------
 * Modern, efficient design with key metrics and smart visualizations
 * Adapts content based on available space
 */

const formatCurrency = (value?: number, compact = true) => {
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0
  if (compact) {
    if (safeValue >= 1_000_000) return `$${(safeValue / 1_000_000).toFixed(1)}M`
    if (safeValue >= 1_000) return `$${(safeValue / 1_000).toFixed(1)}K`
    return `$${safeValue.toLocaleString()}`
  }
  return `$${safeValue.toLocaleString()}`
}

const formatNumber = (value?: number) => {
  const safeValue = typeof value === "number" && !isNaN(value) ? value : 0
  return safeValue.toLocaleString()
}

// Custom Pie Chart Component without border/title
function SimplePieChart({ data, scaleFactor = 1 }: { data: any[]; scaleFactor?: number }) {
  const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
  ]

  // Scale the pie chart radii based on scale factor
  const innerRadius = Math.max(6, Math.round(15 * scaleFactor))
  const outerRadius = Math.max(12, Math.round(40 * scaleFactor))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} dataKey="value">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default function PortfolioOverview({ card, config, span, isCompact = false }: PortfolioOverviewProps) {
  const [showDrillDown, setShowDrillDown] = useState(false)

  // Calculate card size categories based on span
  const cardArea = span.cols * span.rows
  const isVerySmall = cardArea <= 9 // 3x3 or smaller
  const isSmall = cardArea <= 16 // 4x4 or smaller
  const isMedium = cardArea <= 24 // 6x4 or smaller
  const isWide = span.cols >= 8 // Wide cards
  const isTall = span.rows >= 6 // Tall cards
  const isLarge = cardArea >= 36 // 6x6 or larger

  // Debug logging to see what's happening
  console.log("PortfolioOverview DEBUG:", {
    span,
    cardArea,
    sizingResults: {
      isVerySmall,
      isSmall,
      isMedium,
      isWide,
      isTall,
      isLarge,
    },
  })

  // Check if this is the optimal size for 100% content
  if (span.cols === 8 && span.rows === 6) {
    console.log("🎯 PortfolioOverview is at optimal size (8x6) for 100% content display!")
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

  // Mock trend data for the last 6 months
  const trendData = useMemo(
    () => [
      { name: "Jan", value: 18, completed: 2 },
      { name: "Feb", value: 22, completed: 1 },
      { name: "Mar", value: 28, completed: 3 },
      { name: "Apr", value: 24, completed: 2 },
      { name: "May", value: 26, completed: 1 },
      { name: "Jun", value: totalProjects, completed: completedThisYear },
    ],
    [totalProjects, completedThisYear]
  )

  // Project status distribution
  const projectStatusData = useMemo(
    () => [
      { name: "Active", value: activeProjects, color: "#3b82f6" }, // Blue
      { name: "Planning", value: 3, color: "#f59e0b" }, // Amber
      { name: "On Hold", value: 2, color: "#ef4444" }, // Red
      { name: "Completed", value: completedThisYear, color: "#10b981" }, // Green
    ],
    [activeProjects, completedThisYear]
  )

  // Regional distribution data (Florida regions only)
  const regionalData = [
    { region: "Central FL", projects: 4, value: 89.2 },
    { region: "North FL", projects: 3, value: 67.8 },
    { region: "Southeast FL", projects: 2, value: 45.3 },
    { region: "Southwest FL", projects: 2, value: 38.9 },
    { region: "Space Coast", projects: 1, value: 23.5 },
  ]

  // Dynamic scaling based on card size - SMOOTH PROPORTIONAL SCALING
  const getSizeClasses = () => {
    // Calculate scaling factor based on card area (optimal size is 8x6 = 48)
    const optimalArea = 48
    const scaleFactor = Math.min(Math.max(cardArea / optimalArea, 0.3), 1.2) // Scale between 30% and 120%

    // Base sizes that will be scaled
    const baseConfig = {
      padding: 12, // Base padding in pixels
      headerPadding: 12,
      fontSize: 14, // Base font size
      titleFontSize: 16,
      metricFontSize: 18,
      gap: 8,
      chartHeight: 112, // Base chart height in pixels
      iconSize: 16, // Base icon size
    }

    // Scale everything proportionally
    const scaledConfig = {
      padding: Math.max(4, Math.round(baseConfig.padding * scaleFactor)),
      headerPadding: Math.max(4, Math.round(baseConfig.headerPadding * scaleFactor)),
      fontSize: Math.max(8, Math.round(baseConfig.fontSize * scaleFactor)),
      titleFontSize: Math.max(10, Math.round(baseConfig.titleFontSize * scaleFactor)),
      metricFontSize: Math.max(12, Math.round(baseConfig.metricFontSize * scaleFactor)),
      gap: Math.max(2, Math.round(baseConfig.gap * scaleFactor)),
      chartHeight: Math.max(32, Math.round(baseConfig.chartHeight * scaleFactor)),
      iconSize: Math.max(8, Math.round(baseConfig.iconSize * scaleFactor)),
    }

    // Determine grid layout based on card dimensions
    const gridCols =
      span.cols >= 8 ? "grid-cols-4" : span.cols >= 6 ? "grid-cols-2" : span.cols >= 4 ? "grid-cols-2" : "grid-cols-1"

    return {
      padding: `p-[${scaledConfig.padding}px]`,
      headerPadding: `p-[${scaledConfig.headerPadding}px]`,
      text: `text-[${scaledConfig.fontSize}px]`,
      titleText: `text-[${scaledConfig.titleFontSize}px]`,
      metricText: `text-[${scaledConfig.metricFontSize}px]`,
      gap: `gap-[${scaledConfig.gap}px]`,
      gridCols,
      chartHeight: `h-[${scaledConfig.chartHeight}px]`,
      iconSize: `h-[${scaledConfig.iconSize}px] w-[${scaledConfig.iconSize}px]`,
      showFooter: span.rows >= 4, // Show footer if tall enough
      showCharts: span.rows >= 3, // Show charts if at least 3 rows
      showIcons: scaleFactor >= 0.5, // Show icons if scale factor is reasonable
      maxMetrics: 4, // Always show all metrics, just scaled
      scaleFactor, // For debugging
    }
  }

  const sizeClasses = getSizeClasses()

  // Priority metrics for small cards
  const allMetrics = [
    {
      icon: <Building2 className={`${sizeClasses.iconSize} text-blue-600 dark:text-blue-400`} />,
      label: isVerySmall ? "Projects" : "Total Projects",
      value: totalProjects,
      subtitle: `${activeProjects} active`,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <DollarSign className={`${sizeClasses.iconSize} text-green-600 dark:text-green-400`} />,
      label: isVerySmall ? "Value" : "Portfolio Value",
      value: formatCurrency(totalValue),
      subtitle: "total value",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <TrendingUp className={`${sizeClasses.iconSize} text-indigo-600 dark:text-indigo-400`} />,
      label: isVerySmall ? "Cash" : "Net Cash Flow",
      value: formatCurrency(netCashFlow),
      subtitle: "this month",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: <Layers3 className={`${sizeClasses.iconSize} text-purple-600`} />,
      label: isVerySmall ? "Sq Ft" : "Total Sq Ft",
      value: formatNumber(totalSqFt),
      subtitle: "square feet",
      color: "text-purple-600",
    },
  ]

  // Show different number of metrics based on card size
  const visibleMetrics = allMetrics.slice(0, sizeClasses.maxMetrics)

  console.log("📏 PortfolioOverview scaling:", {
    cardArea,
    scaleFactor: sizeClasses.scaleFactor.toFixed(2),
    span: `${span.cols}x${span.rows}`,
    isOptimalSize: span.cols === 8 && span.rows === 6,
  })

  return (
    <div className="relative h-full" data-tour="portfolio-overview-card">
      <div className="h-full flex flex-col bg-transparent overflow-hidden">
        {/* Key Metrics Header */}
        <div
          className={`flex-shrink-0 ${sizeClasses.headerPadding} bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700`}
        >
          <div className={`${sizeClasses.gridCols} ${sizeClasses.gap} grid`}>
            {visibleMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {sizeClasses.showIcons && metric.icon}
                  <span
                    className={`${sizeClasses.text} font-medium text-muted-foreground ${
                      sizeClasses.showIcons ? `ml-[${Math.max(2, Math.round(4 * sizeClasses.scaleFactor))}px]` : ""
                    }`}
                  >
                    {metric.label}
                  </span>
                </div>
                <div className={`${sizeClasses.metricText} font-medium text-foreground`}>{metric.value}</div>
                {!isVerySmall && <div className={`${sizeClasses.text} text-muted-foreground`}>{metric.subtitle}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section - Only show if card is large enough */}
        {sizeClasses.showCharts && (
          <div className={`flex-1 ${sizeClasses.padding} overflow-hidden`}>
            {isWide && !isVerySmall && !isSmall ? (
              // Wide layout: side-by-side charts (only for large cards)
              <div className={`grid grid-cols-2 ${sizeClasses.gap} h-full`}>
                <div
                  className={`bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-[${Math.max(
                    4,
                    Math.round(8 * sizeClasses.scaleFactor)
                  )}px]`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold text-foreground mb-1 flex items-center`}>
                    <TrendingUp
                      className={`${sizeClasses.iconSize} mr-[${Math.max(
                        2,
                        Math.round(4 * sizeClasses.scaleFactor)
                      )}px] text-blue-600 dark:text-blue-400`}
                    />
                    Growth
                  </h4>
                  <div className={sizeClasses.chartHeight}>
                    <AreaChart data={trendData} color="hsl(var(--chart-2))" compact />
                  </div>
                </div>

                <div
                  className={`bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-[${Math.max(
                    4,
                    Math.round(8 * sizeClasses.scaleFactor)
                  )}px]`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold text-foreground mb-1 flex items-center`}>
                    <Building2
                      className={`${sizeClasses.iconSize} mr-[${Math.max(
                        2,
                        Math.round(4 * sizeClasses.scaleFactor)
                      )}px] text-indigo-600 dark:text-indigo-400`}
                    />
                    Status
                  </h4>
                  <div className={`${sizeClasses.chartHeight} flex items-center`}>
                    <div
                      className={`w-[${Math.max(32, Math.round(56 * sizeClasses.scaleFactor))}px] h-[${Math.max(
                        32,
                        Math.round(56 * sizeClasses.scaleFactor)
                      )}px] flex-shrink-0`}
                    >
                      <SimplePieChart data={projectStatusData} scaleFactor={sizeClasses.scaleFactor} />
                    </div>
                    <div className={`flex-1 ml-[${Math.max(4, Math.round(8 * sizeClasses.scaleFactor))}px]`}>
                      <div className={`grid grid-cols-1 gap-1 ${sizeClasses.text}`}>
                        {projectStatusData.slice(0, 3).map((item) => (
                          <div key={item.name} className="flex items-center">
                            <div
                              className={`w-[${Math.max(4, Math.round(8 * sizeClasses.scaleFactor))}px] h-[${Math.max(
                                4,
                                Math.round(8 * sizeClasses.scaleFactor)
                              )}px] rounded-full mr-[${Math.max(
                                2,
                                Math.round(4 * sizeClasses.scaleFactor)
                              )}px] flex-shrink-0`}
                              style={{ backgroundColor: item.color }}
                            />
                            <span
                              className={`text-muted-foreground truncate text-[${Math.max(
                                8,
                                Math.round(10 * sizeClasses.scaleFactor)
                              )}px]`}
                            >
                              {item.name}: {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Stacked layout for non-wide cards
              <div className={`space-y-1 h-full`}>
                <div
                  className={`bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-[${Math.max(
                    4,
                    Math.round(8 * sizeClasses.scaleFactor)
                  )}px]`}
                >
                  <h4 className={`${sizeClasses.titleText} font-semibold text-foreground mb-1 flex items-center`}>
                    <TrendingUp
                      className={`${sizeClasses.iconSize} mr-[${Math.max(
                        2,
                        Math.round(4 * sizeClasses.scaleFactor)
                      )}px] text-blue-600 dark:text-blue-400`}
                    />
                    Growth
                  </h4>
                  <div className={sizeClasses.chartHeight}>
                    <AreaChart data={trendData.slice(-4)} color="hsl(var(--chart-2))" compact />
                  </div>
                </div>

                {/* Only show second chart if there's enough space */}
                {(isTall || isLarge) && (
                  <div
                    className={`bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-[${Math.max(
                      4,
                      Math.round(8 * sizeClasses.scaleFactor)
                    )}px]`}
                  >
                    <h4 className={`${sizeClasses.titleText} font-semibold text-foreground mb-1 flex items-center`}>
                      <Building2
                        className={`${sizeClasses.iconSize} mr-[${Math.max(
                          2,
                          Math.round(4 * sizeClasses.scaleFactor)
                        )}px] text-indigo-600 dark:text-indigo-400`}
                      />
                      Status
                    </h4>
                    <div className={`grid grid-cols-2 gap-1 ${sizeClasses.text}`}>
                      {projectStatusData.map((item) => (
                        <div key={item.name} className="flex items-center">
                          <div
                            className={`w-[${Math.max(4, Math.round(8 * sizeClasses.scaleFactor))}px] h-[${Math.max(
                              4,
                              Math.round(8 * sizeClasses.scaleFactor)
                            )}px] rounded-full mr-[${Math.max(
                              2,
                              Math.round(4 * sizeClasses.scaleFactor)
                            )}px] flex-shrink-0`}
                            style={{ backgroundColor: item.color }}
                          />
                          <span
                            className={`text-muted-foreground truncate text-[${Math.max(
                              8,
                              Math.round(10 * sizeClasses.scaleFactor)
                            )}px]`}
                          >
                            {item.name}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer - Only show if card is large enough */}
        {sizeClasses.showFooter && (
          <div
            className={`flex-shrink-0 ${sizeClasses.padding} bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700`}
          >
            <div className={`grid grid-cols-2 ${sizeClasses.gap} ${sizeClasses.text}`}>
              <div className="flex items-center">
                <Calendar
                  className={`${sizeClasses.iconSize} text-muted-foreground mr-[${Math.max(
                    2,
                    Math.round(4 * sizeClasses.scaleFactor)
                  )}px]`}
                />
                <span className="text-muted-foreground">Avg: </span>
                <span
                  className={`font-semibold text-foreground ml-[${Math.max(
                    2,
                    Math.round(4 * sizeClasses.scaleFactor)
                  )}px]`}
                >
                  {averageDuration}d
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign
                  className={`${sizeClasses.iconSize} text-muted-foreground mr-[${Math.max(
                    2,
                    Math.round(4 * sizeClasses.scaleFactor)
                  )}px]`}
                />
                <span className="text-muted-foreground">Avg: </span>
                <span
                  className={`font-semibold text-foreground ml-[${Math.max(
                    2,
                    Math.round(4 * sizeClasses.scaleFactor)
                  )}px]`}
                >
                  {formatCurrency(averageContractValue)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click-Based Drill-Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 text-white transition-all duration-300 ease-in-out overflow-y-auto z-50">
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
            <h3 className="text-lg font-medium mb-2 text-center">Portfolio Deep Dive</h3>

            <div className="grid grid-cols-2 gap-3 h-[calc(100%-60px)]">
              {/* Regional Distribution */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Florida Regional Distribution
                  </h4>
                  <div className="space-y-2 text-sm">
                    {regionalData.map((region) => (
                      <div key={region.region} className="flex justify-between items-center">
                        <span>{region.region}</span>
                        <div className="text-right">
                          <span className="font-medium">{region.projects} projects</span>
                          <div className="text-xs text-blue-200">${region.value}M</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Performance Metrics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Portfolio Health Score:</span>
                      <span className="font-medium text-green-400">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Delivery Rate:</span>
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
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Largest Projects
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="font-medium">Tropical World Nursery</div>
                      <div className="text-xs text-blue-200">Commercial • $89.2M • Central FL</div>
                      <div className="text-xs text-green-400">85% Complete</div>
                    </div>
                    <div className="border-b border-white/20 dark:border-black/20 pb-2">
                      <div className="font-medium">Grandview Heights</div>
                      <div className="text-xs text-blue-200">Residential • $67.8M • North FL</div>
                      <div className="text-xs text-yellow-400">Planning Phase</div>
                    </div>
                    <div className="pb-2">
                      <div className="font-medium">Marina Bay Plaza</div>
                      <div className="text-xs text-blue-200">Mixed-Use • $45.3M • Southeast FL</div>
                      <div className="text-xs text-green-400">95% Complete</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Portfolio Composition
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commercial Projects:</span>
                      <span className="font-medium">7 (58%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Residential Projects:</span>
                      <span className="font-medium">3 (25%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mixed-Use Projects:</span>
                      <span className="font-medium">2 (17%)</span>
                    </div>
                    <div className="pt-2 border-t border-white/20 dark:border-black/20">
                      <div className="flex justify-between text-blue-200">
                        <span>Total Portfolio Value:</span>
                        <span className="font-medium">{formatCurrency(totalValue)}</span>
                      </div>
                    </div>
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
