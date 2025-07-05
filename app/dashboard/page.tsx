"use client"

import React from "react"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard/DashboardLayout"
import { DashboardProvider, useDashboardContext } from "@/context/dashboard-context"
import type { DashboardCard, DashboardLayout } from "@/types/dashboard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Plus,
  ChevronDown,
  LayoutDashboard,
  Layout,
  Maximize2,
  Minimize2,
  Home,
  RefreshCw,
  EllipsisVertical,
  ChevronRight,
  Building2,
  FileText,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Calculator,
  Wrench,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  Target,
  DollarSign,
  Activity,
  MapPin,
  Briefcase,
} from "lucide-react"
import { AppHeader } from "@/components/layout/app-header"
import { DashboardModuleNavigation } from "@/components/layout/DashboardModuleNavigation"
import { DueThisWeekPanel } from "@/components/dashboard/DueThisWeekPanel"
import { ResponsibilityOverview } from "@/components/dashboard/ResponsibilityOverview"

// Mock data imports for cards
import projectsData from "@/data/mock/projects.json"
import cashFlowData from "@/data/mock/financial/cash-flow.json"

/**
 * Modern Dashboard Page with Module-Based Sidebar Layout
 * ------------------------------------------------------
 * Sidebar + main content layout implementation aligned with IT Command Center
 * Features:
 * - Module-based navigation aligned with other system modules
 * - Left sidebar with key elements: overview, quick actions, recent projects, metrics
 * - Right side with existing dashboard cards
 * - Responsive design (sidebar hidden on mobile)
 * - Dynamic card sizing based on content
 * - Consistent styling with colored left borders
 */

function DashboardContent({ user }: { user: any }) {
  const { dashboards, currentDashboardId, setCurrentDashboardId, updateDashboard, loading } = useDashboardContext()
  const { startTour, isTourAvailable } = useTour()
  const [isEditing, setIsEditing] = useState(false)
  const [layoutDensity, setLayoutDensity] = useState<"compact" | "normal" | "spacious">("normal")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [dashboardViewSubmenuOpen, setDashboardViewSubmenuOpen] = useState(false)
  const [comingSoonPopoverOpen, setComingSoonPopoverOpen] = useState(false)
  const ellipsisButtonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId)

  // Get recently accessed projects (last 5 active projects)
  const recentProjects = projectsData.filter((project) => project.active).slice(0, 5)

  // Get dashboard overview stats
  const dashboardStats = {
    totalProjects: projectsData.filter((p) => p.active).length,
    activeProjects: projectsData.filter(
      (p) => p.active && ["In Progress", "Active"].includes(p.project_stage_name || "")
    ).length,
    completedThisYear: projectsData.filter((p) => p.project_stage_name === "Completed").length,
    totalValue: projectsData.filter((p) => p.active).reduce((sum, p) => sum + (p.contract_value || 0), 0),
  }

  // Auto-start dashboard tour for new visitors
  useEffect(() => {
    if (typeof window !== "undefined" && user && isTourAvailable) {
      // Check if user has disabled tours permanently
      const hasDisabledTours = localStorage.getItem("hb-tour-available") === "false"

      if (hasDisabledTours) {
        console.log("Tours disabled by user preference")
        return
      }

      // Session-based tracking for dashboard tour
      const hasShownDashboardTour = sessionStorage.getItem("hb-tour-shown-dashboard-overview")

      console.log("Dashboard tour auto-start check:", {
        isTourAvailable,
        hasShownDashboardTour,
        hasDisabledTours,
        userRole: user?.role,
      })

      // Auto-start dashboard tour once per session
      if (!hasShownDashboardTour) {
        setTimeout(() => {
          console.log("Auto-starting dashboard tour...")
          startTour("dashboard-overview", true) // true indicates auto-start
        }, 3000)
      }
    }
  }, [isTourAvailable, startTour, user])

  // Simplified data preparation
  const stage4Projects = projectsData.filter((p) => p.project_stage_id === 4)
  const targetMonth = "2024-12"
  const cashflowProject = cashFlowData.projects.find((p) => stage4Projects.some((sp) => sp.project_id === p.project_id))
  const cashflowMonth = cashflowProject?.cashFlowData.monthlyData.find((m) => m.month === targetMonth)

  // Simplified handlers
  const handleLayoutChange = (newLayout: any[]) => {
    if (!currentDashboard) return

    // Update card order based on layout
    const newCards = newLayout
      .map((layoutItem) => {
        const card = currentDashboard.cards.find((c) => c.id === layoutItem.i)
        return card ? { ...card } : null
      })
      .filter(Boolean) as DashboardCard[]

    updateDashboard({
      ...currentDashboard,
      cards: newCards,
    })
  }

  const handleCardRemove = (cardId: string) => {
    if (!currentDashboard) return
    const updatedCards = currentDashboard.cards.filter((card) => card.id !== cardId)
    updateDashboard({
      ...currentDashboard,
      cards: updatedCards,
    })
  }

  const handleCardConfigure = (cardId: string, configUpdate?: Partial<DashboardCard>) => {
    if (!currentDashboard) return

    if (configUpdate) {
      const updatedCards = currentDashboard.cards.map((card) =>
        card.id === cardId ? { ...card, ...configUpdate } : card
      )
      updateDashboard({
        ...currentDashboard,
        cards: updatedCards,
      })
    } else {
      console.log("Configure card:", cardId)
    }
  }

  const handleCardSizeChange = (cardId: string, size: string) => {
    if (!currentDashboard) return

    // Define optimized size mappings for dashboard cards
    const smartPresetSizes: Record<string, { cols: number; rows: number }> = {
      compact: { cols: 3, rows: 2 },
      small: { cols: 3, rows: 3 },
      medium: { cols: 4, rows: 3 },
      standard: { cols: 4, rows: 4 },
      large: { cols: 6, rows: 4 },
      wide: { cols: 8, rows: 3 },
      tall: { cols: 4, rows: 6 },
      "extra-wide": { cols: 12, rows: 3 },
      "extra-large": { cols: 6, rows: 6 },
    }

    // Get card type specific optimal sizing
    const getOptimalSizeForCardType = (cardType: string) => {
      switch (cardType) {
        case "portfolio-overview":
          return { cols: 12, rows: 4 }
        case "financial-review-panel":
          return { cols: 8, rows: 6 }
        case "market-intelligence":
        case "revenue-forecast":
          return { cols: 6, rows: 4 }
        case "cash-flow":
        case "budget-health":
          return { cols: 4, rows: 4 }
        case "project-health":
        case "schedule-monitor":
          return { cols: 4, rows: 3 }
        case "recent-activities":
        case "critical-dates":
          return { cols: 4, rows: 4 }
        case "staff-planning":
        case "procurement":
          return { cols: 6, rows: 3 }
        default:
          return { cols: 4, rows: 3 }
      }
    }

    let newSpan: { cols: number; rows: number }

    // Handle custom sizes (format: "custom-4x6")
    if (size.startsWith("custom-")) {
      const dimensions = size.replace("custom-", "").split("x")
      console.log("🎯 Custom size detected:", size, "dimensions:", dimensions)
      if (dimensions.length === 2) {
        const cols = parseInt(dimensions[0])
        const rows = parseInt(dimensions[1])
        if (!isNaN(cols) && !isNaN(rows)) {
          newSpan = { cols, rows }
          console.log("✅ Custom size parsed successfully:", newSpan)
        } else {
          newSpan = { cols: 4, rows: 3 } // fallback
          console.log("❌ Custom size parsing failed - using fallback")
        }
      } else {
        newSpan = { cols: 4, rows: 3 } // fallback
        console.log("❌ Custom size format invalid - using fallback")
      }
    } else if (size === "optimal") {
      // Use card type specific optimal sizing
      const card = currentDashboard.cards.find((c) => c.id === cardId)
      if (card) {
        newSpan = getOptimalSizeForCardType(card.type)
        console.log("🎯 Using optimal size for", card.type, ":", newSpan)
      } else {
        newSpan = smartPresetSizes.medium
      }
    } else {
      // Handle preset sizes
      newSpan = smartPresetSizes[size] || { cols: 4, rows: 3 }
      console.log("📋 Preset size selected:", size, "->", newSpan)
    }

    const updatedCards = currentDashboard.cards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            size: size as any,
            span: newSpan,
          }
        : card
    )

    updateDashboard({
      ...currentDashboard,
      cards: updatedCards,
    })

    console.log(`🔄 Card ${cardId} resized to ${size}:`, newSpan)
    console.log(
      "🎯 Updated card object:",
      updatedCards.find((c) => c.id === cardId)
    )
  }

  const handleCardAdd = () => {
    if (!currentDashboard) return

    // Find the next available position for the new card
    const findNextPosition = () => {
      let maxY = 0
      currentDashboard.cards.forEach((card) => {
        if (card.position && card.span) {
          maxY = Math.max(maxY, card.position.y + card.span.rows)
        }
      })
      return { x: 0, y: maxY }
    }

    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      type: "placeholder",
      title: "New Card",
      size: "medium",
      position: findNextPosition(),
      span: { cols: 4, rows: 3 }, // Optimized default size
      visible: true,
    }
    updateDashboard({
      ...currentDashboard,
      cards: [...currentDashboard.cards, newCard],
    })
  }

  const handleSave = () => {
    console.log("Saving dashboard changes...")
    setIsEditing(false)
  }

  const handleReset = () => {
    console.log("Resetting dashboard to template...")
  }

  const handleDashboardSelect = (dashboardId: string) => {
    setCurrentDashboardId(dashboardId)
  }

  const handleLayoutDensityChange = (density: "compact" | "normal" | "spacious") => {
    setLayoutDensity(density)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // ESC key handler for fullscreen mode
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [isFullscreen])

  // Format currency helper
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  // Get stage badge variant
  const getStageVariant = (stage: string | undefined) => {
    switch (stage) {
      case "Pre-Construction":
        return "secondary"
      case "Bidding":
        return "default"
      case "BIM Coordination":
        return "outline"
      case "In Progress":
        return "default"
      case "Active":
        return "default"
      default:
        return "secondary"
    }
  }

  // Get stage icon
  const getStageIcon = (stage: string | undefined) => {
    switch (stage) {
      case "Pre-Construction":
        return <Clock className="h-3 w-3" />
      case "Bidding":
        return <TrendingUp className="h-3 w-3" />
      case "BIM Coordination":
        return <CheckCircle className="h-3 w-3" />
      case "In Progress":
        return <Activity className="h-3 w-3" />
      case "Active":
        return <Activity className="h-3 w-3" />
      default:
        return <AlertTriangle className="h-3 w-3" />
    }
  }

  // Inject data into specific card types
  if (currentDashboard) {
    currentDashboard.cards = currentDashboard.cards.map((card) => {
      switch (card.type) {
        case "financial-review-panel":
          return {
            ...card,
            config: {
              ...card.config,
              panelProps: {
                forecastIndex: 8.75,
                budgetHealth: 8.2,
                cashflowData: cashflowMonth,
                scheduleHealth: 9.1,
                cashflowChartData:
                  cashflowProject?.cashFlowData.monthlyData.map((m) => ({
                    name: m.month,
                    value: m.netCashFlow,
                  })) || [],
                cashflowMetrics: cashflowMonth
                  ? [
                      { label: "Net Cash Flow", value: `$${cashflowMonth.netCashFlow.toLocaleString()}` },
                      { label: "Inflows", value: `$${cashflowMonth.inflows.total.toLocaleString()}` },
                      { label: "Outflows", value: `$${cashflowMonth.outflows.total.toLocaleString()}` },
                    ]
                  : [],
                scheduleMetrics: [
                  { label: "Delays", value: 0 },
                  { label: "Total Float", value: 6 },
                ],
              },
            },
          }
        case "portfolio-overview":
          return {
            ...card,
            config: {
              totalProjects: 24,
              activeProjects: 7,
              completedThisYear: 5,
              averageDuration: 214,
              averageContractValue: 3100000,
              totalSqFt: 880000,
              totalValue: 75000000,
              netCashFlow: 12500000,
              averageWorkingCapital: 4200000,
            },
          }
        default:
          return card
      }
    })
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="fixed inset-0 top-[80px] flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-background/95 rounded-lg shadow-lg border border-border">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading dashboards...</p>
            <p className="text-muted-foreground text-sm mt-1">Please wait while we prepare your dashboard</p>
          </div>
        </div>
      </>
    )
  }

  if (!dashboards.length) {
    return (
      <>
        <AppHeader />
        <div className="fixed inset-0 top-[80px] flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-background/95 rounded-lg shadow-lg border border-border">
            <p className="text-foreground font-medium">No dashboards found.</p>
            <p className="text-muted-foreground text-sm mt-1">Contact your administrator to set up dashboards</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="space-y-3 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3" data-tour="dashboard-page-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <LayoutDashboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {user.role === "executive"
                      ? "Executive Dashboard"
                      : user.role === "project-executive"
                      ? "PX Dashboard"
                      : user.role === "project-manager"
                      ? "PM Dashboard"
                      : "Analytics Dashboard"}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {currentDashboard?.description || "Real-time insights and project management overview"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={toggleFullscreen} data-tour="fullscreen-button">
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* More Actions Menu */}
                <Popover
                  open={moreMenuOpen}
                  onOpenChange={(open) => {
                    setMoreMenuOpen(open)
                    if (!open) {
                      setDashboardViewSubmenuOpen(false)
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      ref={ellipsisButtonRef}
                      variant="outline"
                      size="sm"
                      className="px-2"
                      data-tour="more-actions-menu"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0" align="end">
                    <div className="p-1">
                      <button
                        onClick={() => {
                          window.location.reload()
                          setMoreMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(!isEditing)
                          setMoreMenuOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {isEditing ? "Exit Edit" : "Edit Dashboard"}
                      </button>

                      {/* Dashboard View Submenu */}
                      <div className="relative">
                        <button
                          onClick={() => setDashboardViewSubmenuOpen(!dashboardViewSubmenuOpen)}
                          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Layout className="h-4 w-4" />
                            Layout Density
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${dashboardViewSubmenuOpen ? "rotate-90" : ""}`}
                          />
                        </button>

                        {dashboardViewSubmenuOpen && (
                          <div className="mt-1 ml-4 space-y-1">
                            {[
                              { value: "compact" as const, label: "Compact" },
                              { value: "normal" as const, label: "Normal" },
                              { value: "spacious" as const, label: "Spacious" },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  handleLayoutDensityChange(option.value)
                                  setDashboardViewSubmenuOpen(false)
                                  setMoreMenuOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                                  layoutDensity === option.value
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted text-muted-foreground"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    layoutDensity === option.value ? "bg-primary" : "bg-transparent"
                                  }`}
                                />
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={() => {
                            setComingSoonPopoverOpen(true)
                            setMoreMenuOpen(false)
                          }}
                          className="w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Create New Dashboard
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Coming Soon Popover */}
                {comingSoonPopoverOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                      onClick={() => setComingSoonPopoverOpen(false)}
                    />
                    <div className="fixed top-20 right-6 z-50 w-80 bg-white dark:bg-gray-950 border border-border rounded-lg shadow-lg">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Coming Soon</h3>
                            <p className="text-xs text-muted-foreground">Dashboard Creation</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Create numerous dashboard views tailored to your profile with fully customizable layouts,
                            advanced analytics, and personalized themes.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              Custom widget arrangements
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              Role-based analytics presets
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              Branded themes and colors
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              Shareable dashboard templates
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              Beta v2.2
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => setComingSoonPopoverOpen(false)}>
                              Got it
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Edit Mode Controls */}
            {isEditing && (
              <div className="flex items-center gap-3" data-tour="dashboard-edit-controls">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
                >
                  Reset to Default
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCardAdd}
                  className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Widget
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div
            className={`hidden xl:block xl:col-span-3 space-y-4 ${isFullscreen ? "opacity-20" : ""}`}
            data-tour="dashboard-sidebar"
          >
            {/* Due This Week Panel - Only for Project Executive and Project Manager */}
            {(user.role === "project-executive" || user.role === "project-manager") && (
              <DueThisWeekPanel userRole={user.role} className="mb-4" />
            )}

            {/* Responsibility Overview - Only for Project Executive and Project Manager */}
            {(user.role === "project-executive" || user.role === "project-manager") && (
              <ResponsibilityOverview className="mb-4" />
            )}

            {/* Dashboard Overview */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Dashboard Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Projects</span>
                  <span className="font-semibold">{dashboardStats.totalProjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Projects</span>
                  <span className="font-semibold text-green-600">{dashboardStats.activeProjects}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed This Year</span>
                  <span className="font-semibold text-blue-600">{dashboardStats.completedThisYear}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-semibold">{formatCurrency(dashboardStats.totalValue)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/projects")}>
                  <Building2 className="h-4 w-4 mr-2" />
                  View All Projects
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/dashboard/reports")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/dashboard/financial-hub")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial Hub
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/dashboard/staff-planning")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Staff Planning
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => router.push("/dashboard/scheduler")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Project Scheduler
                </Button>
              </CardContent>
            </Card>

            {/* Recently Accessed Projects */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentProjects.map((project, index) => (
                  <div
                    key={project.project_id || `recent-${index}`}
                    className="group flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/project/${project.project_id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {project.name || project.display_name || "Untitled Project"}
                        </p>
                        <Badge
                          variant={getStageVariant(project.project_stage_name)}
                          className="flex items-center gap-1 text-xs"
                        >
                          {getStageIcon(project.project_stage_name)}
                          {project.project_stage_name || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">
                          {`${project.city || ""} ${project.state_code || ""}`.trim() || "N/A"}
                        </span>
                      </div>
                      {project.contract_value && project.contract_value > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <DollarSign className="h-3 w-3" />
                          <span>{formatCurrency(project.contract_value)}</span>
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-l-4 border-l-[rgb(250,70,22)]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule Health</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Health</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quality Score</span>
                  <span className="font-semibold text-blue-600">91%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="font-semibold text-yellow-600">Low</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Dashboard Cards */}
          <div className={`xl:col-span-9 ${isFullscreen ? "relative" : ""}`} data-tour="dashboard-content">
            {currentDashboard && (
              <DashboardLayoutComponent
                cards={currentDashboard.cards}
                onLayoutChange={handleLayoutChange}
                onCardRemove={handleCardRemove}
                onCardConfigure={handleCardConfigure}
                onCardSizeChange={handleCardSizeChange}
                onCardAdd={handleCardAdd}
                onSave={handleSave}
                onReset={handleReset}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(!isEditing)}
                layoutDensity={layoutDensity}
                userRole={user.role}
                dashboards={dashboards}
                currentDashboardId={currentDashboardId || undefined}
                onDashboardSelect={handleDashboardSelect}
              />
            )}
          </div>
        </div>

        {/* Fullscreen Dashboard Overlay */}
        {isFullscreen && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm animate-in fade-in-0 duration-300"
            style={{ top: "80px" }} // Account for app header height
          >
            {/* Fullscreen Header */}
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Dashboard - Fullscreen View</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentDashboard?.description || "Real-time insights and project management overview"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={toggleFullscreen} className="flex items-center gap-2">
                    <Minimize2 className="h-4 w-4" />
                    Exit Fullscreen
                  </Button>
                </div>
              </div>
            </div>

            {/* Fullscreen Dashboard Content */}
            <div className="p-6 overflow-auto" style={{ height: "calc(100vh - 80px - 80px)" }}>
              {currentDashboard && (
                <DashboardLayoutComponent
                  cards={currentDashboard.cards}
                  onLayoutChange={handleLayoutChange}
                  onCardRemove={handleCardRemove}
                  onCardConfigure={handleCardConfigure}
                  onCardSizeChange={handleCardSizeChange}
                  onCardAdd={handleCardAdd}
                  onSave={handleSave}
                  onReset={handleReset}
                  isEditing={isEditing}
                  onToggleEdit={() => setIsEditing(!isEditing)}
                  layoutDensity={layoutDensity}
                  userRole={user.role}
                  dashboards={dashboards}
                  currentDashboardId={currentDashboardId || undefined}
                  onDashboardSelect={handleDashboardSelect}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return
    if (user === null) {
      router.push("/login")
      return
    }
  }, [user, router])

  if (!user) return null

  return (
    <DashboardProvider userId={user.id} role={user.role}>
      <DashboardContent user={user} />
    </DashboardProvider>
  )
}
