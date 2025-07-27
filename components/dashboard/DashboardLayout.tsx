"use client"

import { DashboardCard } from "@/types/dashboard"
import { DashboardGrid } from "./DashboardGrid"
import { KPIRow } from "./KPIRow"
import { useRouter } from "next/navigation"

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
  // Beta dashboard toggle
  useBetaDashboard?: boolean
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
  useBetaDashboard,
}: DashboardLayoutProps) {
  const router = useRouter()

  // Handle dashboard tab click
  const handleDashboardTabClick = (dashboardId: string) => {
    onDashboardSelect?.(dashboardId)
  }
  // Determine spacing based on layout density - consistent horizontal and vertical
  const getSpacingClass = () => {
    switch (layoutDensity) {
      case "compact":
        return "gap-2 sm:gap-2 lg:gap-3"
      case "spacious":
        return "gap-4 sm:gap-4 lg:gap-5"
      default:
        return "gap-3 sm:gap-3 lg:gap-4"
    }
  }

  const isCompact = layoutDensity === "compact"

  return (
    <div className="w-full relative">
      {/* Edit mode overlay */}
      {isEditing && <div className="absolute inset-0 bg-primary/5 backdrop-blur-[0.5px] pointer-events-none" />}

      <div className="relative z-10">
        {/* KPI Row with enhanced styling */}
        <div data-tour="kpi-widgets" className="mb-8">
          <div className="px-0 sm:px-0 lg:px-0 xl:px-0 2xl:px-0 pt-0 sm:pt-0">
            <div className="mx-auto max-w-[1920px]">
              <KPIRow userRole={userRole} isCompact={isCompact} />
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
              useBetaDashboard={useBetaDashboard}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Edit Mode Indicator */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-primary/80 backdrop-blur-sm text-primary-foreground px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg border border-primary/20 text-xs font-medium">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary-foreground/80 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Edit Mode</span>
              <span className="sm:hidden">Edit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
