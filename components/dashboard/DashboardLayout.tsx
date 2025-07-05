"use client"

import { DashboardCard } from "@/types/dashboard"
import { DashboardGrid } from "./DashboardGrid"
import { KPIRow } from "./KPIRow"

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
        {/* Dashboard Tabs - Show only for executive users */}
        {userRole === "executive" && dashboards.length > 0 && (
          <div data-tour="dashboard-tabs" className="mb-6">
            <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pt-0 sm:pt-0">
              <div className="mx-auto max-w-[1920px]">
                <div className="flex items-center justify-start gap-1 border-b border-border pb-2">
                  {dashboards.map((dashboard) => (
                    <button
                      key={dashboard.id}
                      onClick={() => onDashboardSelect?.(dashboard.id)}
                      className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                        currentDashboardId === dashboard.id
                          ? "text-primary border-primary bg-primary/5"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                      }`}
                    >
                      {dashboard.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
