"use client"

import { DashboardCard } from "@/types/dashboard"
import { DashboardGrid } from "./DashboardGrid"
import { KPIRow } from "./KPIRow"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { ActionItemsInbox } from "./ActionItemsInbox"
import { ActionItemsToDo } from "./ActionItemsToDo"
import { ProjectActivityFeed } from "../feed/ProjectActivityFeed"

interface DashboardLayoutProps {
  cards: DashboardCard[]
  onLayoutChange?: (layout: any[]) => void
  onCardRemove?: (cardId: string) => void
  onCardConfigure?: (cardId: string, configUpdate?: Partial<DashboardCard>) => void
  onCardSizeChange?: (cardId: string, size: string) => void
  onCardAdd?: () => void
  onSave?: () => void
  onReset?: () => void
  isEditing?: boolean
  onToggleEdit?: () => void
  layoutDensity?: "compact" | "normal" | "spacious"
  userRole?: string
  // Dashboard tabs props
  dashboards?: Array<{ id: string; name: string }>
  currentDashboardId?: string
  onDashboardSelect?: (dashboardId: string) => void
}

/**
 * Enhanced Dashboard Layout
 * -------------------------
 * Modern dashboard layout with improved visual hierarchy, backgrounds, and spacing
 */

export function DashboardLayout({
  cards,
  onLayoutChange,
  onCardRemove,
  onCardConfigure,
  onCardSizeChange,
  onCardAdd,
  onSave,
  onReset,
  isEditing = false,
  onToggleEdit,
  layoutDensity = "normal",
  userRole,
  dashboards = [],
  currentDashboardId,
  onDashboardSelect,
}: DashboardLayoutProps) {
  const router = useRouter()

  // Check if user role should see Action Items tab
  const shouldShowActionItemsTab = userRole === "project-executive" || userRole === "project-manager"

  // Check if user role should see Activity Feed tab
  const shouldShowActivityFeedTab = ["executive", "project-executive", "project-manager", "estimator"].includes(
    userRole || ""
  )

  // Set Action Items as default for Project Executive and Project Manager
  const [showActionItems, setShowActionItems] = useState(shouldShowActionItemsTab)
  const [showActivityFeed, setShowActivityFeed] = useState(false)

  // Handle Action Items tab click
  const handleActionItemsClick = () => {
    setShowActionItems(true)
    setShowActivityFeed(false)
  }

  // Handle Activity Feed tab click
  const handleActivityFeedClick = () => {
    setShowActivityFeed(true)
    setShowActionItems(false)
  }

  // Handle regular dashboard tab click
  const handleDashboardTabClick = (dashboardId: string) => {
    setShowActionItems(false)
    setShowActivityFeed(false)
    onDashboardSelect?.(dashboardId)
  }
  // Determine spacing based on layout density - consistent horizontal and vertical
  const getSpacingClass = () => {
    switch (layoutDensity) {
      case "compact":
        return "gap-3 sm:gap-3 lg:gap-4"
      case "spacious":
        return "gap-6 sm:gap-6 lg:gap-8"
      default:
        return "gap-4 sm:gap-4 lg:gap-6"
    }
  }

  const isCompact = layoutDensity === "compact"

  return (
    <div className="w-full relative">
      {/* Edit mode overlay */}
      {isEditing && <div className="absolute inset-0 bg-primary/5 backdrop-blur-[0.5px] pointer-events-none" />}

      <div className="relative z-10">
        {/* Dashboard Tabs - Show for all users */}
        {(dashboards.length > 0 || shouldShowActionItemsTab || shouldShowActivityFeedTab) && (
          <div data-tour="dashboard-tabs" className="mb-6">
            <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pt-0 sm:pt-0">
              <div className="mx-auto max-w-[1920px]">
                <div className="flex items-center justify-start gap-1 border-b border-border pb-2">
                  {/* Action Items Tab - Only for Project Executive and Project Manager */}
                  {shouldShowActionItemsTab && (
                    <button
                      onClick={handleActionItemsClick}
                      className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                        showActionItems
                          ? "text-primary border-primary bg-primary/5"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      Action Items
                    </button>
                  )}

                  {/* Regular Dashboard Tabs */}
                  {dashboards.map((dashboard) => (
                    <button
                      key={dashboard.id}
                      onClick={() => handleDashboardTabClick(dashboard.id)}
                      className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                        currentDashboardId === dashboard.id && !showActionItems && !showActivityFeed
                          ? "text-primary border-primary bg-primary/5"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      {dashboard.name}
                    </button>
                  ))}

                  {/* Activity Feed Tab - For Executive, Project Executive, Project Manager, and Estimator - Final Tab */}
                  {shouldShowActivityFeedTab && (
                    <button
                      onClick={handleActivityFeedClick}
                      className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                        showActivityFeed
                          ? "text-primary border-primary bg-primary/5"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      Activity Feed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Items Content */}
        {showActionItems && shouldShowActionItemsTab && (
          <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pb-0">
            <div className="mx-auto max-w-[1920px]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Action Items - Full width layout */}
                <div>
                  <ActionItemsInbox userRole={userRole as "project-executive" | "project-manager"} />
                </div>
                <div>
                  <ActionItemsToDo userRole={userRole as "project-executive" | "project-manager"} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed Content */}
        {showActivityFeed && shouldShowActivityFeedTab && (
          <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pb-0">
            <div className="mx-auto max-w-[1920px]">
              <ProjectActivityFeed
                config={{
                  userRole: userRole as "executive" | "project-executive" | "project-manager" | "estimator",
                  showFilters: true,
                  showPagination: true,
                  itemsPerPage: 20,
                  allowExport: true,
                }}
              />
            </div>
          </div>
        )}

        {/* Regular Dashboard Content */}
        {!showActionItems && !showActivityFeed && (
          <>
            {/* KPI Row with enhanced styling */}
            <div data-tour="kpi-widgets" className="mb-6">
              <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pt-0 sm:pt-0">
                <div className="mx-auto max-w-[1920px]">
                  <KPIRow userRole={userRole} />
                </div>
              </div>
            </div>

            {/* Dashboard Content with better container */}
            <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pb-0">
              <div className="mx-auto max-w-[1920px]">
                <DashboardGrid
                  cards={cards}
                  onLayoutChange={onLayoutChange}
                  onCardRemove={onCardRemove}
                  onCardConfigure={onCardConfigure}
                  onCardSizeChange={onCardSizeChange}
                  onCardAdd={onCardAdd}
                  onSave={onSave}
                  onReset={onReset}
                  isEditing={isEditing}
                  isCompact={isCompact}
                  spacingClass={getSpacingClass()}
                  userRole={userRole}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-xl border border-primary/20 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-foreground/80 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Edit Mode Active</span>
              <span className="sm:hidden">Editing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
