"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardProvider, useDashboardContext } from "@/context/dashboard-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Shield, Home } from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"

/**
 * IT Command Center Page
 * ---------------------
 * Central hub for IT operations and system monitoring
 */

function ITCommandCenterContent({ user }: { user: any }) {
  const { dashboards, currentDashboardId, updateDashboard, loading } = useDashboardContext()
  const { startTour, isTourAvailable } = useTour()
  const [isEditing, setIsEditing] = useState(false)
  const [layoutDensity, setLayoutDensity] = useState<"compact" | "normal" | "spacious">("normal")

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
    }
  }

  const handleCardSizeChange = (cardId: string, size: string) => {
    if (!currentDashboard) return
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
    console.log("Saving IT dashboard changes...")
    setIsEditing(false)
  }

  const handleReset = () => {
    console.log("Reset functionality not implemented for IT Command Center")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading IT Command Center...</p>
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
              <BreadcrumbPage>IT Command Center</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header Section - Made Sticky */}
        <div className="sticky top-20 z-40 bg-white dark:bg-gray-950 border-b border-border/40 -mx-6 px-6 pb-4 backdrop-blur-sm">
          <div className="flex flex-col gap-4 pt-3" data-tour="it-command-center-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">IT Command Center</h1>
                  <p className="text-muted-foreground mt-1">
                    System monitoring, security oversight, and infrastructure management
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>

            {/* Module Navigation Row */}
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              data-tour="it-module-navigation"
            >
              <ITModuleNavigation />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {currentDashboard ? (
          <div data-tour="it-dashboard-content">
            <DashboardLayout
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
        ) : (
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
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default function ITCommandCenterPage() {
  const { user } = useAuth()

  // Restrict access to admin users only
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the IT Command Center.</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardProvider userId={user.id} role={user.role}>
      <ITCommandCenterContent user={user} />
    </DashboardProvider>
  )
}
