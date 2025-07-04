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
} from "lucide-react"
import { AppHeader } from "@/components/layout/app-header"

// Mock data imports for cards
import projectsData from "@/data/mock/projects.json"
import cashFlowData from "@/data/mock/financial/cash-flow.json"

/**
 * Modern Dashboard Page
 * --------------------
 * Full-width dashboard implementation with popover dashboard selector
 * Features:
 * - Full window width utilization
 * - Popover menu for dashboard selection
 * - Controls moved to second row
 * - Dynamic card sizing based on content
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

  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId)

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

    // Define size mappings to span dimensions
    const sizeToSpan = {
      small: { cols: 2, rows: 2 },
      medium: { cols: 4, rows: 4 },
      large: { cols: 6, rows: 6 },
      wide: { cols: 8, rows: 4 },
      tall: { cols: 4, rows: 8 },
      "extra-large": { cols: 8, rows: 8 },
    }

    const newSpan = sizeToSpan[size as keyof typeof sizeToSpan] || { cols: 4, rows: 4 }

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

    console.log(`Card ${cardId} resized to ${size}:`, newSpan)
  }

  const handleCardAdd = () => {
    if (!currentDashboard) return
    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      type: "placeholder",
      title: "New Card",
      size: "medium",
      position: { x: 0, y: 0 },
      span: { cols: 4, rows: 4 },
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
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboards...</p>
        </div>
      </div>
    )
  }

  if (!dashboards.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No dashboards found.</p>
        </div>
      </div>
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
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  {currentDashboard?.description || "Real-time insights and project management overview"}
                </p>
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

            {/* Dashboard Controls Row */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              data-tour="dashboard-controls"
            >
              {/* Dashboard Tabs */}
              <div className="flex items-center gap-1" data-tour="dashboard-tabs">
                {dashboards.map((dashboard) => (
                  <button
                    key={dashboard.id}
                    onClick={() => handleDashboardSelect(dashboard.id)}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      currentDashboardId === dashboard.id
                        ? "text-primary border-primary bg-primary/5"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    {dashboard.name}
                  </button>
                ))}
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
        </div>

        {/* Dashboard Content */}
        {currentDashboard && (
          <div data-tour="dashboard-content">
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
            />
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
