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
  Shield,
  Monitor,
  Server,
  Database,
  Settings,
} from "lucide-react"
import { AppHeader } from "@/components/layout/app-header"

/**
 * IT Command Center Dashboard Page
 * --------------------------------
 * Specialized dashboard for IT administrators with system monitoring,
 * security oversight, and infrastructure management capabilities.
 */

function ITCommandCenterContent({ user }: { user: any }) {
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

  // Auto-start IT Command Center tour for new visitors
  useEffect(() => {
    if (typeof window !== "undefined" && user && isTourAvailable) {
      const hasDisabledTours = localStorage.getItem("hb-tour-available") === "false"
      if (hasDisabledTours) return

      const hasShownITTour = sessionStorage.getItem("hb-tour-shown-it-command-center")
      if (!hasShownITTour) {
        setTimeout(() => {
          startTour("it-command-center", true)
        }, 3000)
      }
    }
  }, [isTourAvailable, startTour, user])

  // Dashboard handlers
  const handleLayoutChange = (newLayout: any[]) => {
    if (!currentDashboard) return
    // For IT Command Center, we'll disable layout changes for now
    console.log("Layout change disabled for IT Command Center")
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
  }

  const handleCardAdd = () => {
    console.log("Add card functionality not implemented for IT Command Center")
  }

  const handleSave = () => {
    console.log("Saving IT dashboard changes...")
    setIsEditing(false)
  }

  const handleReset = () => {
    console.log("Reset functionality not implemented for IT Command Center")
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
              <BreadcrumbPage>IT Command Center</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">IT Command Center</h1>
                  <p className="text-muted-foreground">
                    System monitoring, security oversight, and infrastructure management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  All Systems Operational
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-lg">
                <Monitor className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Servers</p>
                <p className="text-2xl font-bold text-foreground">24/25</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Database Health</p>
                <p className="text-2xl font-bold text-foreground">Optimal</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {currentDashboard && (
          <div data-tour="it-dashboard-content">
            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-2 bg-yellow-100 dark:bg-yellow-950/30 rounded text-xs">
                <strong>Debug:</strong> Dashboard ID: {currentDashboard.id}, Cards: {currentDashboard.cards.length}
              </div>
            )}

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

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading IT Command Center...</p>
            </div>
          </div>
        )}

        {/* No Dashboard Found */}
        {!loading && !currentDashboard && (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-border p-6">
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">IT Command Center</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                No IT dashboard layout found. Please contact your administrator to configure the IT Command Center
                dashboard.
              </p>

              {/* Debug Info - Remove in production */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-2 bg-red-100 dark:bg-red-950/30 rounded text-xs">
                  <strong>Debug:</strong> User Role: {user.role}, Available Dashboards: {dashboards.length}, Dashboard
                  IDs: {dashboards.map((d) => d.id).join(", ")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function ITCommandCenterPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return
    if (user === null) {
      router.push("/login")
      return
    }
    // Redirect non-admin users to regular dashboard
    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, router])

  if (!user) return null

  return (
    <DashboardProvider userId={user.id} role={user.role}>
      <ITCommandCenterContent user={user} />
    </DashboardProvider>
  )
}
