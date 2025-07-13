/**
 * @fileoverview Role-Based Dashboard Component
 * @module RoleDashboard
 * @version 2.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Dynamic dashboard content based on user role using the proper dashboard layout system
 */

"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout"
import { useDashboardLayout } from "../../../hooks/use-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Progress } from "../../../components/ui/progress"
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Brain,
  Activity,
  Target,
  BarChart3,
  Calculator,
  DollarSign,
  TrendingUp,
  Globe,
  Building2,
  Users,
} from "lucide-react"
import { getProjectStats, getProjectAccessDescription } from "../../../lib/project-access-utils"
import type { UserRole } from "../../project/[projectId]/types/project"
import Image from "next/image"
import { ActionItemsInbox } from "../../../components/dashboard/ActionItemsInbox"
import { ActionItemsToDo } from "../../../components/dashboard/ActionItemsToDo"
import { ProjectActivityFeed } from "../../../components/feed/ProjectActivityFeed"
import BidManagementCenter from "../../../components/estimating/bid-management/BidManagementCenter"
import BidManagementBetaTables from "../../../components/estimating/bid-management/BidManagementBetaTables"
import { EstimatingModuleWrapper } from "../../../components/estimating/wrappers/EstimatingModuleWrapper"
import { DueThisWeekPanel } from "../../../components/dashboard/DueThisWeekPanel"
import PowerBIControlBar from "../../../components/dashboard/PowerBIControlBar"
import { EnhancedHBIInsights } from "../../../components/cards/EnhancedHBIInsights"
import BetaPipelineAnalytics from "../../../components/cards/beta/BetaPipelineAnalytics"
import BetaBDOpportunities from "../../../components/cards/beta/BetaBDOpportunities"
import BetaFinancialOverview from "../../../components/cards/beta/BetaFinancialOverview"
import BetaMarketIntelligence from "../../../components/cards/beta/BetaMarketIntelligence"
import PowerBIDashboardCard from "../../../components/cards/PowerBIDashboardCard"
import { CustomBarChart } from "../../../components/charts/BarChart"
import { CustomLineChart } from "../../../components/charts/LineChart"
import { AreaChart } from "../../../components/charts/AreaChart"
import { PieChartCard } from "../../../components/charts/PieChart"
import { FunnelChart } from "../../../components/charts/FunnelChart"
import { RadarChart } from "../../../components/charts/RadarChart"
import { ComposedKPIChart } from "../../../components/charts/ComposedKPIChart"
import { HeatmapChart } from "../../../components/charts/HeatmapChart"

interface ProjectData {
  id: string
  name: string
  description: string
  stage: string
  project_stage_name: string
  project_type_name: string
  contract_value: number
  duration: number
  start_date?: string
  end_date?: string
  location?: string
  project_manager?: string
  client?: string
  active: boolean
  project_number: string
  metadata: {
    originalData: any
  }
}

interface User {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

interface RoleDashboardProps {
  userRole: UserRole
  user: User
  projects: ProjectData[]
  onProjectSelect: (projectId: string | null) => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  userRole,
  user,
  projects,
  onProjectSelect,
  activeTab = "overview",
  onTabChange,
  renderMode = "rightContent",
}) => {
  const router = useRouter()

  // Enhanced dashboard is now always enabled for Financial Review
  const isFinancialReview = activeTab === "financial-review"

  // Focus mode state for Power BI control bar
  const [isFocusMode, setIsFocusMode] = React.useState(false)

  // Handle ESC key to exit focus mode
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFocusMode) {
        setIsFocusMode(false)
      }
    }

    if (isFocusMode) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isFocusMode])

  // Use the dashboard layout hook
  const {
    layout,
    layouts,
    cards,
    isLoading,
    error,
    isEditing,
    layoutDensity,
    dashboards,
    currentDashboardId,
    onDashboardSelect,
    onLayoutChange,
    onCardRemove,
    onCardConfigure,
    onCardSizeChange,
    onCardAdd,
    onSave,
    onReset,
    onToggleEdit,
    onDensityChange,
  } = useDashboardLayout(userRole)

  // Determine if DueThisWeekPanel should be shown
  const shouldShowDueThisWeekPanel = () => {
    // Project Executive: All dashboard views
    if (userRole === "project-executive") {
      return true
    }

    // Project Manager: All dashboard views
    if (userRole === "project-manager") {
      return true
    }

    // Estimator: Only Pre-Con Overview and Activity Feed views
    if (userRole === "estimator") {
      return ["pre-con-overview", "activity-feed"].includes(activeTab)
    }

    return false
  }

  // Render left sidebar content
  const renderLeftContent = () => {
    if (!shouldShowDueThisWeekPanel()) {
      return null
    }

    // Map estimator role to project-manager for DueThisWeekPanel compatibility
    const dueThisWeekPanelRole =
      userRole === "estimator" ? "project-manager" : (userRole as "project-executive" | "project-manager")

    return (
      <div className="space-y-4">
        <DueThisWeekPanel userRole={dueThisWeekPanelRole} className="h-fit" />

        {/* Additional left sidebar content can be added here for future enhancements */}
      </div>
    )
  }

  // If rendering left content only, return it
  if (renderMode === "leftContent") {
    return renderLeftContent()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Loading Dashboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Setting up your personalized dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed to load dashboard layout: {error}</p>
            <Button
              onClick={() => {
                // Use Next.js App Router refresh method instead of full page reload
                // This preserves browser history and React state while refreshing data
                router.refresh()
              }}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No layout found
  if (!layout) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              No Dashboard Layout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">No dashboard layout found for role: {userRole}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role-specific welcome message with project statistics
  const getRoleWelcomeMessage = () => {
    const name = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Welcome"
    const projectStats = getProjectStats(projects, userRole)
    const accessDescription = getProjectAccessDescription(userRole)

    // Special handling for bid-management tab
    if (activeTab === "bid-management") {
      return {
        title: "Bid Management Dashboard",
        subtitle:
          "Comprehensive project bidding and delivery tracking system with real-time BuildingConnected integration",
        badge: `${projectStats.total} Projects`,
        accessInfo: accessDescription,
      }
    }

    switch (userRole) {
      case "executive":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Executive Dashboard - ${layout.description}`,
          badge: `${projectStats.total} Projects ($${(projectStats.totalValue / 1000000).toFixed(1)}M)`,
          accessInfo: accessDescription,
        }
      case "project-executive":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Project Executive Dashboard - ${layout.description}`,
          badge: `${projectStats.total} Projects (${projectStats.active} Active)`,
          accessInfo: accessDescription,
        }
      case "project-manager":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Project Manager Dashboard - ${layout.description}`,
          badge: `${projectStats.total} Assigned Projects`,
          accessInfo: accessDescription,
        }
      case "estimator":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Estimator Dashboard - ${layout.description}`,
          badge: `${projectStats.byStage["Pre-Construction"] || 0} Pre-Construction Projects`,
          accessInfo: accessDescription,
        }
      case "admin":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `IT Administrator Dashboard - ${layout.description}`,
          badge: `System Administrator`,
          accessInfo: accessDescription,
        }
      default:
        return {
          title: `Welcome back, ${name}`,
          subtitle: layout.description,
          badge: `${projectStats.total} Projects`,
          accessInfo: accessDescription,
        }
    }
  }

  const welcomeMessage = getRoleWelcomeMessage()

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={isFocusMode ? "fixed inset-0 z-50 bg-background" : ""}>
            {/* Power BI Control Bar */}
            <PowerBIControlBar
              userRole={userRole}
              onFocusToggle={() => setIsFocusMode(!isFocusMode)}
              isFocusMode={isFocusMode}
              className={isFocusMode ? "rounded-none" : ""}
            />

            {/* Dashboard Content */}
            <div className={isFocusMode ? "h-[calc(100vh-120px)] overflow-auto" : ""}>
              <DashboardLayout
                cards={cards}
                onLayoutChange={onLayoutChange}
                onCardRemove={onCardRemove}
                onCardConfigure={onCardConfigure}
                onCardSizeChange={onCardSizeChange}
                onCardAdd={onCardAdd}
                onSave={onSave}
                onReset={onReset}
                isEditing={isEditing}
                onToggleEdit={onToggleEdit}
                layoutDensity={layoutDensity}
                userRole={userRole}
                dashboards={dashboards}
                currentDashboardId={currentDashboardId ?? undefined}
                onDashboardSelect={onDashboardSelect}
                useBetaDashboard={
                  userRole === "project-executive" ||
                  userRole === "project-manager" ||
                  userRole === "estimator" ||
                  userRole === "admin"
                }
              />
            </div>
          </div>
        )

      case "pre-con-overview":
        // Get pre-con dashboard layout
        const preconLayout = layouts?.find((l) => l.name.toLowerCase().includes("pre-con")) || layout
        const preconCards = preconLayout?.cards || cards

        return (
          <div className={isFocusMode ? "fixed inset-0 z-50 bg-background" : ""}>
            {/* Power BI Control Bar */}
            <PowerBIControlBar
              userRole={userRole}
              onFocusToggle={() => setIsFocusMode(!isFocusMode)}
              isFocusMode={isFocusMode}
              className={isFocusMode ? "rounded-none" : ""}
            />

            {/* Dashboard Content - Enhanced Power BI Embedded Cards */}
            <div className={isFocusMode ? "h-[calc(100vh-120px)] overflow-auto p-6" : "p-6"}>
              <div className="grid grid-cols-16 gap-6 auto-rows-[100px]">
                {/* HBI Pre-Construction Intelligence - Enhanced with AI Insights */}
                <div className="col-span-8 row-span-6">
                  <Card className="h-full bg-gradient-to-br from-[#FA4616]/5 to-[#FA4616]/10 dark:from-[#FA4616]/20 dark:to-[#FA4616]/30 border-[#FA4616]/20 dark:border-[#FA4616]/40">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-[#FA4616] rounded-lg">
                            <Brain className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-[#FA4616] dark:text-[#FF8A67]">
                              HBI Pre-Construction Intelligence
                            </CardTitle>
                            <p className="text-sm text-[#FA4616]/70 dark:text-[#FF8A67]/80">
                              AI-powered insights for estimating and business development
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            AI Enhanced
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <EnhancedHBIInsights
                        config={{
                          executiveMode: true,
                          scope: "pre-construction",
                          maxVisibleInsights: 6,
                          compactMode: false,
                        }}
                        cardId="hbi-precon"
                        span={{ cols: 8, rows: 6 }}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Pipeline Funnel Analytics - Power BI Funnel Chart */}
                <div className="col-span-8 row-span-6">
                  <Card className="h-full bg-gradient-to-br from-[#0021A5]/5 to-[#0021A5]/10 dark:from-[#0021A5]/20 dark:to-[#0021A5]/30 border-[#0021A5]/20 dark:border-[#0021A5]/40">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-[#0021A5] rounded-lg">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-[#0021A5] dark:text-[#4A7FD6]">
                              Pipeline Funnel Analytics
                            </CardTitle>
                            <p className="text-sm text-[#0021A5]/70 dark:text-[#4A7FD6]/80">
                              Conversion rates and opportunity flow
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
                          >
                            <Target className="h-3 w-3 mr-1" />
                            Funnel View
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <FunnelChart
                        title=""
                        data={[
                          { name: "Leads", value: 2500000, fill: "#dc2626" },
                          { name: "Qualified", value: 1800000, fill: "#d97706" },
                          { name: "Proposals", value: 1200000, fill: "#2563eb" },
                          { name: "Negotiations", value: 850000, fill: "#059669" },
                          { name: "Awards", value: 450000, fill: "#7c3aed" },
                        ]}
                        xKey="name"
                        yKey="value"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Estimating Performance Trends - Power BI Line Chart */}
                <div className="col-span-8 row-span-5">
                  <Card className="h-full bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-300">
                              Estimating Performance Trends
                            </CardTitle>
                            <p className="text-sm text-blue-600/70 dark:text-blue-400/80">
                              Cost accuracy and timeline metrics
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending Up
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <CustomLineChart
                        title=""
                        data={[
                          { name: "Jan", value: 85, accuracy: 85, timeline: 78 },
                          { name: "Feb", value: 88, accuracy: 88, timeline: 82 },
                          { name: "Mar", value: 90, accuracy: 90, timeline: 85 },
                          { name: "Apr", value: 87, accuracy: 87, timeline: 88 },
                          { name: "May", value: 92, accuracy: 92, timeline: 90 },
                          { name: "Jun", value: 94, accuracy: 94, timeline: 92 },
                        ]}
                        dataKeys={["accuracy", "timeline"]}
                        colors={["#2563eb", "#059669"]}
                        showLegend={true}
                        compact={true}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Trade Distribution - Power BI Pie Chart */}
                <div className="col-span-8 row-span-5">
                  <Card className="h-full bg-gradient-to-br from-purple-50/80 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-purple-600 rounded-lg">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-purple-700 dark:text-purple-300">
                              Trade Distribution Analysis
                            </CardTitle>
                            <p className="text-sm text-purple-600/70 dark:text-purple-400/80">
                              Cost breakdown by trade category
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-purple-500/10 text-purple-600 dark:bg-purple-500/30 dark:text-purple-400"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#FA4616]/10 text-[#FA4616] dark:bg-[#FA4616]/30 dark:text-[#FF8A67]"
                          >
                            <Calculator className="h-3 w-3 mr-1" />
                            Cost Analysis
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <PieChartCard
                        title=""
                        data={[
                          { name: "Concrete", value: 2800000 },
                          { name: "Steel", value: 1950000 },
                          { name: "Electrical", value: 1200000 },
                          { name: "Plumbing", value: 850000 },
                          { name: "HVAC", value: 1100000 },
                          { name: "Finishes", value: 950000 },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Project Portfolio Performance - Power BI Bar Chart */}
                <div className="col-span-8 row-span-5">
                  <Card className="h-full bg-gradient-to-br from-green-50/80 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200/50 dark:border-green-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-600 rounded-lg">
                            <Globe className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-green-700 dark:text-green-300">
                              Project Portfolio Performance
                            </CardTitle>
                            <p className="text-sm text-green-600/70 dark:text-green-400/80">
                              Active projects by value and status
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
                          >
                            <Building2 className="h-3 w-3 mr-1" />
                            Portfolio
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <CustomBarChart
                        title=""
                        data={[
                          { name: "Healthcare", value: 45000000 },
                          { name: "Education", value: 32000000 },
                          { name: "Commercial", value: 28000000 },
                          { name: "Industrial", value: 22000000 },
                          { name: "Government", value: 18000000 },
                          { name: "Retail", value: 15000000 },
                        ]}
                        colors={["#059669", "#2563eb", "#7c3aed", "#dc2626", "#d97706", "#0891b2"]}
                        showValues={true}
                        compact={true}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Assessment Matrix - Power BI Heatmap */}
                <div className="col-span-8 row-span-5">
                  <Card className="h-full bg-gradient-to-br from-orange-50/80 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200/50 dark:border-orange-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-orange-600 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-orange-700 dark:text-orange-300">
                              Risk Assessment Matrix
                            </CardTitle>
                            <p className="text-sm text-orange-600/70 dark:text-orange-400/80">
                              Project risk distribution and probability
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-orange-500/10 text-orange-600 dark:bg-orange-500/30 dark:text-orange-400"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-600 dark:bg-red-500/30 dark:text-red-400"
                          >
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Risk Analysis
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <HeatmapChart
                        title=""
                        data={[
                          { x: 1, y: 1, z: 150 },
                          { x: 2, y: 1, z: 300 },
                          { x: 3, y: 1, z: 200 },
                          { x: 1, y: 2, z: 400 },
                          { x: 2, y: 2, z: 600 },
                          { x: 3, y: 2, z: 500 },
                          { x: 1, y: 3, z: 250 },
                          { x: 2, y: 3, z: 450 },
                          { x: 3, y: 3, z: 750 },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Market Positioning Radar - Power BI Radar Chart */}
                <div className="col-span-8 row-span-5">
                  <Card className="h-full bg-gradient-to-br from-cyan-50/80 to-cyan-100/50 dark:from-cyan-950/30 dark:to-cyan-900/20 border-cyan-200/50 dark:border-cyan-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-cyan-600 rounded-lg">
                            <Target className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-cyan-700 dark:text-cyan-300">
                              Market Positioning Analysis
                            </CardTitle>
                            <p className="text-sm text-cyan-600/70 dark:text-cyan-400/80">
                              Competitive positioning across key metrics
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/30 dark:text-cyan-400"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#0021A5]/10 text-[#0021A5] dark:bg-[#0021A5]/30 dark:text-[#4A7FD6]"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            Market Intel
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <RadarChart
                        title=""
                        data={[
                          { subject: "Cost", value: 85 },
                          { subject: "Quality", value: 92 },
                          { subject: "Speed", value: 78 },
                          { subject: "Innovation", value: 88 },
                          { subject: "Safety", value: 95 },
                          { subject: "Sustainability", value: 82 },
                        ]}
                        dataKey="subject"
                        valueKey="value"
                        strokeColor="#0891b2"
                        fillColor="rgba(8, 145, 178, 0.4)"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Executive KPI Dashboard - Power BI Area Chart */}
                <div className="col-span-8 row-span-5">
                  <Card className="h-full bg-gradient-to-br from-slate-50/80 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/20 border-slate-200/50 dark:border-slate-800/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-600 rounded-lg">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold text-slate-700 dark:text-slate-300">
                              Revenue & Margin Trends
                            </CardTitle>
                            <p className="text-sm text-slate-600/70 dark:text-slate-400/80">
                              Monthly revenue and profit margin analysis
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-slate-500/10 text-slate-600 dark:bg-slate-500/30 dark:text-slate-400"
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Power BI
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-600 dark:bg-green-500/30 dark:text-green-400"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Revenue Growth
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 h-[calc(100%-80px)]">
                      <AreaChart
                        title=""
                        data={[
                          { name: "Jan", value: 28000000 },
                          { name: "Feb", value: 32000000 },
                          { name: "Mar", value: 35000000 },
                          { name: "Apr", value: 38000000 },
                          { name: "May", value: 42000000 },
                          { name: "Jun", value: 45000000 },
                        ]}
                        color="#10b981"
                        compact={true}
                        showGrid={true}
                        animated={true}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )

      case "financial-review":
        // Get financial dashboard layout if available, otherwise use current layout
        const financialLayout = layouts?.find((l) => l.name.toLowerCase().includes("financial")) || layout
        const financialCards = financialLayout?.cards || cards

        return (
          <div className={isFocusMode ? "fixed inset-0 z-50 bg-background" : ""}>
            {/* Power BI Control Bar */}
            <PowerBIControlBar
              userRole={userRole}
              onFocusToggle={() => setIsFocusMode(!isFocusMode)}
              isFocusMode={isFocusMode}
              className={isFocusMode ? "rounded-none" : ""}
            />

            {/* Dashboard Content */}
            <div className={isFocusMode ? "h-[calc(100vh-120px)] overflow-auto" : ""}>
              <DashboardLayout
                cards={financialCards}
                onLayoutChange={onLayoutChange}
                onCardRemove={onCardRemove}
                onCardConfigure={onCardConfigure}
                onCardSizeChange={onCardSizeChange}
                onCardAdd={onCardAdd}
                onSave={onSave}
                onReset={onReset}
                isEditing={isEditing}
                onToggleEdit={onToggleEdit}
                layoutDensity={layoutDensity}
                userRole={userRole}
                dashboards={dashboards}
                currentDashboardId={currentDashboardId ?? undefined}
                onDashboardSelect={onDashboardSelect}
                useBetaDashboard={true}
              />
            </div>
          </div>
        )

      case "action-items":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionItemsInbox userRole={userRole as "project-executive" | "project-manager"} />
            <ActionItemsToDo userRole={userRole as "project-executive" | "project-manager"} />
          </div>
        )

      case "activity-feed":
        return (
          <ProjectActivityFeed
            config={{
              userRole: userRole as "executive" | "project-executive" | "project-manager" | "estimator" | "admin",
              showFilters: true,
              showPagination: true,
              itemsPerPage: 20,
              allowExport: true,
            }}
          />
        )

      case "analytics":
        return (
          <div>
            <DashboardLayout
              cards={cards}
              onLayoutChange={onLayoutChange}
              onCardRemove={onCardRemove}
              onCardConfigure={onCardConfigure}
              onCardSizeChange={onCardSizeChange}
              onCardAdd={onCardAdd}
              onSave={onSave}
              onReset={onReset}
              isEditing={isEditing}
              onToggleEdit={onToggleEdit}
              layoutDensity={layoutDensity}
              userRole={userRole}
              dashboards={dashboards}
              currentDashboardId={currentDashboardId ?? undefined}
              onDashboardSelect={onDashboardSelect}
              useBetaDashboard={false}
            />
          </div>
        )

      case "my-dashboard":
        // Role-specific My Dashboard customization
        let myDashboardCards: any[]

        if (userRole === "admin") {
          // Admin-specific IT dashboard with granular monitoring cards
          myDashboardCards = [
            // Top Row - System Status Overview
            {
              id: "admin-system-health",
              type: "infrastructure-monitor",
              title: "System Health Monitor",
              size: "wide",
              position: { x: 0, y: 0 },
              span: { cols: 10, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                detailLevel: "comprehensive",
                focus: "system-health",
              },
            },
            {
              id: "admin-security-status",
              type: "user-access-summary",
              title: "Security & Access",
              size: "medium",
              position: { x: 10, y: 0 },
              span: { cols: 6, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "security-overview",
              },
            },
            // Second Row - Network and Performance
            {
              id: "admin-network-performance",
              type: "system-logs",
              title: "Network Performance",
              size: "medium",
              position: { x: 0, y: 4 },
              span: { cols: 5, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "network-metrics",
                detailLevel: "operational",
              },
            },
            {
              id: "admin-ai-pipeline",
              type: "ai-pipeline-status",
              title: "AI Pipeline Status",
              size: "medium",
              position: { x: 5, y: 4 },
              span: { cols: 5, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "ai-operations",
              },
            },
            {
              id: "admin-asset-tracking",
              type: "asset-tracker",
              title: "Asset Management",
              size: "medium",
              position: { x: 10, y: 4 },
              span: { cols: 6, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "asset-overview",
              },
            },
            // Third Row - Detailed Operations
            {
              id: "admin-endpoint-health",
              type: "endpoint-health",
              title: "Endpoint Health",
              size: "medium",
              position: { x: 0, y: 8 },
              span: { cols: 5, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "endpoint-monitoring",
              },
            },
            {
              id: "admin-email-security",
              type: "email-security-health",
              title: "Email Security",
              size: "medium",
              position: { x: 5, y: 8 },
              span: { cols: 5, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "email-security",
              },
            },
            {
              id: "admin-backup-restore",
              type: "backup-restore-status",
              title: "Backup & Recovery",
              size: "medium",
              position: { x: 10, y: 8 },
              span: { cols: 6, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "backup-status",
              },
            },
            // Fourth Row - Intelligence and Analytics
            {
              id: "admin-siem-overview",
              type: "siem-log-overview",
              title: "SIEM Analytics",
              size: "wide",
              position: { x: 0, y: 12 },
              span: { cols: 8, rows: 3 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "siem-dashboard",
              },
            },
            {
              id: "admin-hb-intel",
              type: "hb-intel-management",
              title: "HB Intelligence",
              size: "medium",
              position: { x: 8, y: 12 },
              span: { cols: 8, rows: 3 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                focus: "intel-management",
              },
            },
          ]
        } else {
          // Default My Dashboard with varied card sizes for other roles
          myDashboardCards = [
            // Top Row - Wide Header Card
            {
              id: "simple-project-metrics",
              type: "simple-project-metrics",
              title: "Project Metrics Overview",
              size: "full-width",
              position: { x: 0, y: 0 },
              span: { cols: 16, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                headerMode: true,
              },
            },
            // Second Row - Two Equal Cards
            {
              id: "simple-financial-summary",
              type: "simple-financial-summary",
              title: "Financial Summary",
              size: "half-width",
              position: { x: 0, y: 4 },
              span: { cols: 8, rows: 5 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                expandedView: true,
              },
            },
            {
              id: "simple-activity-trends",
              type: "simple-activity-trends",
              title: "Activity Trends",
              size: "half-width",
              position: { x: 8, y: 4 },
              span: { cols: 8, rows: 5 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                expandedView: true,
              },
            },
            // Third Row - Three Cards (varied sizes)
            {
              id: "simple-procurement-analytics",
              type: "simple-procurement-analytics",
              title: "Procurement Analytics",
              size: "large",
              position: { x: 0, y: 9 },
              span: { cols: 6, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                detailedView: true,
              },
            },
            {
              id: "simple-permit-tracking",
              type: "simple-permit-tracking",
              title: "Permit Tracking",
              size: "medium",
              position: { x: 6, y: 9 },
              span: { cols: 5, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                compactView: true,
              },
            },
            {
              id: "simple-rfi-status",
              type: "simple-rfi-status",
              title: "RFI Status",
              size: "small",
              position: { x: 11, y: 9 },
              span: { cols: 5, rows: 4 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                compactView: true,
              },
            },
            // Fourth Row - Two Cards (different aspect ratios)
            {
              id: "simple-market-insights",
              type: "simple-market-insights",
              title: "Market Insights",
              size: "wide",
              position: { x: 0, y: 13 },
              span: { cols: 10, rows: 3 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                chartFocused: true,
              },
            },
            {
              id: "simple-estimating-progress",
              type: "simple-estimating-progress",
              title: "Estimating Progress",
              size: "tall",
              position: { x: 10, y: 13 },
              span: { cols: 6, rows: 3 },
              visible: true,
              config: {
                userRole: userRole,
                showRealTime: true,
                verticalLayout: true,
              },
            },
          ]
        }

        return (
          <div className={isFocusMode ? "fixed inset-0 z-50 bg-background" : ""}>
            {/* Power BI Control Bar */}
            <PowerBIControlBar
              userRole={userRole}
              onFocusToggle={() => setIsFocusMode(!isFocusMode)}
              isFocusMode={isFocusMode}
              className={isFocusMode ? "rounded-none" : ""}
            />

            {/* Dashboard Content */}
            <div className={isFocusMode ? "h-[calc(100vh-120px)] overflow-auto" : ""}>
              <DashboardLayout
                cards={myDashboardCards}
                onLayoutChange={onLayoutChange}
                onCardRemove={onCardRemove}
                onCardConfigure={onCardConfigure}
                onCardSizeChange={onCardSizeChange}
                onCardAdd={onCardAdd}
                onSave={onSave}
                onReset={onReset}
                isEditing={isEditing}
                onToggleEdit={onToggleEdit}
                layoutDensity={layoutDensity}
                userRole={userRole}
                dashboards={dashboards}
                currentDashboardId={currentDashboardId ?? undefined}
                onDashboardSelect={onDashboardSelect}
                useBetaDashboard={true}
              />
            </div>
          </div>
        )

      case "bid-management":
        // Map the broader UserRole to BidManagementCenter's expected UserRole
        const bidManagementUserRole = (() => {
          switch (userRole) {
            case "project-executive":
              return "executive" as const
            case "project-manager":
              return "project-manager" as const
            case "estimator":
              return "estimator" as const
            case "admin":
              return "admin" as const
            case "executive":
              return "executive" as const
            default:
              return "estimator" as const
          }
        })()

        // Show enhanced tables by default for bid management
        return (
          <div>
            <BidManagementBetaTables
              userRole={bidManagementUserRole}
              onProjectSelect={onProjectSelect}
              className="h-full"
            />
          </div>
        )

        // Fallback to legacy bid management if needed
        return (
          <EstimatingModuleWrapper
            title="Bid Management Center"
            description="Comprehensive bid management and BuildingConnected integration with real-time data and export capabilities"
            userRole={userRole}
            isEmbedded={true}
            showCard={false}
            showHeader={false}
          >
            <BidManagementCenter
              userRole={bidManagementUserRole}
              onProjectSelect={onProjectSelect}
              className="h-full"
              showHeader={false}
            />
          </EstimatingModuleWrapper>
        )

      default:
        // Default to overview if tab not recognized
        return (
          <div>
            <DashboardLayout
              cards={cards}
              onLayoutChange={onLayoutChange}
              onCardRemove={onCardRemove}
              onCardConfigure={onCardConfigure}
              onCardSizeChange={onCardSizeChange}
              onCardAdd={onCardAdd}
              onSave={onSave}
              onReset={onReset}
              isEditing={isEditing}
              onToggleEdit={onToggleEdit}
              layoutDensity={layoutDensity}
              userRole={userRole}
              dashboards={dashboards}
              currentDashboardId={currentDashboardId ?? undefined}
              onDashboardSelect={onDashboardSelect}
              useBetaDashboard={false}
            />
          </div>
        )
    }
  }

  return (
    <div className="h-full w-full">
      {/* Layout Density Controls - Show when editing and on overview tab */}
      {isEditing && (activeTab === "overview" || activeTab === "financial-review") && (
        <div className="mb-4 flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mr-2">Density:</span>
          <div className="flex gap-1">
            {(["compact", "normal", "spacious"] as const).map((density) => (
              <Button
                key={density}
                variant={layoutDensity === density ? "default" : "outline"}
                size="sm"
                onClick={() => onDensityChange(density)}
                className="text-[10px] capitalize h-5 px-1.5"
              >
                {density}
              </Button>
            ))}
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant="outline" size="sm" onClick={onReset} className="text-[10px] h-5 px-1.5">
              Reset
            </Button>
            <Button variant="default" size="sm" onClick={onSave} className="text-[10px] h-5 px-1.5">
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="dashboard-content">{renderTabContent()}</div>
    </div>
  )
}
