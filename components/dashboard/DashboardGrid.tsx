"use client"

import React, { useState, useCallback, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { DashboardCard } from "@/types/dashboard"
import { cn } from "@/lib/utils"
import {
  GripVertical,
  X,
  Settings2,
  Briefcase,
  Brain,
  BarChart3,
  Target,
  TrendingUp,
  Building2,
  Calendar,
  DollarSign,
  Wrench,
  Shield,
  Droplets,
  Package,
  Eye,
  AlertTriangle as AlertTriangleIcon,
  Users,
  FileText,
  ClipboardCheck,
  Play,
  CalendarDays,
  MessageSquare,
  Heart,
  PieChart,
  Activity,
  Coins,
  Zap,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DashboardCardWrapper } from "./DashboardCardWrapper"

// Modern card components
import PortfolioOverview from "@/components/cards/PortfolioOverview"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"
import { FinancialReviewPanel } from "@/components/cards/FinancialReviewPanel"
import PipelineAnalytics from "@/components/cards/PipelineAnalytics"
import MarketIntelligence from "@/components/cards/MarketIntelligence"
import ProjectOverviewCard from "@/components/cards/ProjectOverviewCard"
import SchedulePerformanceCard from "@/components/cards/SchedulePerformanceCard"
import FinancialStatusCard from "@/components/cards/FinancialStatusCard"
import GeneralConditionsCard from "@/components/cards/GeneralConditionsCard"
import ContingencyAnalysisCard from "@/components/cards/ContingencyAnalysisCard"
import CashFlowCard from "@/components/cards/CashFlowCard"
import ProcurementCard from "@/components/cards/ProcurementCard"
import DrawForecastCard from "@/components/cards/DrawForecastCard"
import QualityControlCard from "@/components/cards/QualityControlCard"
import SafetyCard from "@/components/cards/SafetyCard"
import StaffingDistributionCard from "@/components/cards/StaffingDistributionCard"
import ChangeOrderAnalysisCard from "@/components/cards/ChangeOrderAnalysisCard"
import CloseoutCard from "@/components/cards/CloseoutCard"
import StartupCard from "@/components/cards/StartupCard"
import CriticalDatesCard from "@/components/cards/CriticalDatesCard"
import FieldReportsCard from "@/components/cards/FieldReportsCard"
import { RFICard } from "@/components/cards/RFICard"
import { SubmittalCard } from "@/components/cards/SubmittalCard"
import { HealthCard } from "@/components/cards/HealthCard"
import { ScheduleMonitorCard } from "@/components/cards/ScheduleMonitorCard"
import { BDOpportunitiesCard } from "@/components/cards/BDOpportunitiesCard"

// IT Command Center placeholder cards
import {
  UserAccessSummaryCard,
  SystemLogsCard,
  InfrastructureMonitorCard,
  EndpointHealthCard,
  SiemLogOverviewCard,
  EmailSecurityHealthCard,
  AssetTrackerCard,
  ChangeGovernancePanelCard,
  BackupRestoreStatusCard,
  AiPipelineStatusCard,
  ConsultantDashboardCard,
  HbIntelManagementCard,
} from "@/components/cards/ITPlaceholderCards"

/**
 * DashboardGrid
 * -------------
 * Renders dashboard cards in a modern, responsive grid layout with full editing capabilities.
 * - Responsive width using a container ref.
 * - Increased row height and card padding for a premium feel.
 * - Modern card styles: glassmorphism, soft shadow, prominent header, minHeight.
 * - Full editing features: move, resize, add, remove, configure cards.
 */

interface DashboardGridProps {
  cards: DashboardCard[]
  onLayoutChange?: (layout: any[]) => void
  onCardRemove?: (cardId: string) => void
  onCardConfigure?: (cardId: string, configUpdate?: Partial<DashboardCard>) => void
  onCardSizeChange?: (cardId: string, size: string) => void
  onDrillDown?: (cardId: string, cardType: string) => void
  onCardAdd?: () => void
  onSave?: () => void
  onReset?: () => void
  isEditing?: boolean
  isCompact?: boolean
  spacingClass?: string
  userRole?: string
}

// Define content-aware heights for different card types
const getCardHeight = (card: DashboardCard, isCompact: boolean): number | "auto" => {
  const baseHeight = isCompact ? 300 : 350

  // Use card's span rows to determine height if available
  if (card.span && card.span.rows) {
    const rows = card.span.rows
    // Map rows to actual heights (each row is roughly 80px in compact, 100px in normal)
    const rowHeight = isCompact ? 80 : 100
    const calculatedHeight = rows * rowHeight

    // For tall cards, use auto height to fit content better
    if (rows >= 8) {
      return "auto"
    }

    return calculatedHeight
  }

  // Use card's size to determine height if available
  if (card.size) {
    switch (card.size) {
      case "small":
        return isCompact ? 200 : 250
      case "medium":
        return isCompact ? 300 : 350
      case "large":
        return isCompact ? 400 : 460
      case "wide":
        return isCompact ? 300 : 350 // Wide cards don't need extra height
      case "tall":
        return "auto" // Tall cards should auto-size for content
      case "extra-large":
        return "auto" // Extra large cards should auto-size for content
      default:
        return baseHeight
    }
  }

  // Fallback to type-based height for existing cards
  switch (card.type) {
    case "portfolio-overview":
      return isCompact ? 420 : 480 // Increased height to show all content
    case "enhanced-hbi-insights":
      return "auto" // Auto height to fit content
    case "financial-review-panel":
      return isCompact ? 400 : 460 // Increased height for metrics + charts
    case "pipeline-analytics":
      return "auto" // Auto height to fit content
    case "market-intelligence":
      return "auto" // Auto height to fit content
    case "project-overview":
      return "auto" // Auto height to fit all content
    case "schedule-performance":
      return "auto" // Auto height to fit all content
    case "financial-status":
      return "auto" // Auto height to fit all content
    case "general-conditions":
      return "auto" // Auto height to fit all content
    case "contingency-analysis":
      return "auto" // Auto height to fit all content
    case "cash-flow":
      return "auto" // Auto height to fit all content
    case "procurement":
      return "auto" // Auto height to fit all content
    case "draw-forecast":
      return "auto" // Auto height to fit all content
    case "quality-control":
      return "auto" // Auto height to fit all content
    case "safety":
      return "auto" // Auto height to fit all content
    case "staffing-distribution":
      return "auto" // Auto height to fit all content
    case "change-order-analysis":
      return "auto" // Auto height to fit all content
    case "closeout":
      return "auto" // Auto height to fit all content
    case "startup":
      return "auto" // Auto height to fit all content
    case "critical-dates":
      return "auto" // Auto height to fit all content
    case "field-reports":
      return "auto" // Auto height to fit all content
    case "rfi":
      return "auto" // Auto height to fit all content
    case "submittal":
      return "auto" // Auto height to fit all content
    case "health":
      return "auto" // Auto height to fit all content
    case "schedule-monitor":
      return "auto" // Auto height to fit all content
    case "bd-opportunities":
      return "auto" // Auto height to fit all content

    default:
      return baseHeight
  }
}

// Define card widths - uses the card's actual size/span properties
const getCardGridSpan = (card: DashboardCard): string => {
  // First check if the card has a span property
  if (card.span) {
    const cols = card.span.cols
    const rows = card.span.rows

    // Map cols to responsive grid spans with proportional scaling
    // Mobile(2) -> SM(6) -> LG(12) -> XL(16) -> 2XL(20)
    const mobileSpan = Math.min(2, Math.max(1, Math.round((cols * 2) / 20))) // Scale to 2 columns
    const smSpan = Math.min(6, Math.max(1, Math.round((cols * 6) / 20))) // Scale to 6 columns
    const lgSpan = Math.min(12, Math.max(1, Math.round((cols * 12) / 20))) // Scale to 12 columns
    const xlSpan = Math.min(16, Math.max(1, Math.round((cols * 16) / 20))) // Scale to 16 columns
    const xl2Span = Math.min(20, Math.max(1, cols)) // Full scale to 20 columns

    // Helper function to get safe Tailwind class for column spans
    const getColSpanClass = (span: number, prefix: string = "") => {
      const basePrefix = prefix ? `${prefix}:` : ""
      // Use predefined classes that are safe in Tailwind
      if (span >= 20) return `${basePrefix}col-span-full`
      if (span >= 12) return `${basePrefix}col-span-12`
      if (span >= 11) return `${basePrefix}col-span-11`
      if (span >= 10) return `${basePrefix}col-span-10`
      if (span >= 9) return `${basePrefix}col-span-9`
      if (span >= 8) return `${basePrefix}col-span-8`
      if (span >= 7) return `${basePrefix}col-span-7`
      if (span >= 6) return `${basePrefix}col-span-6`
      if (span >= 5) return `${basePrefix}col-span-5`
      if (span >= 4) return `${basePrefix}col-span-4`
      if (span >= 3) return `${basePrefix}col-span-3`
      if (span >= 2) return `${basePrefix}col-span-2`
      return `${basePrefix}col-span-1`
    }

    // Helper function to get safe Tailwind class for row spans
    const getRowSpanClass = (span: number, prefix: string = "") => {
      const basePrefix = prefix ? `${prefix}:` : ""
      if (span >= 12) return `${basePrefix}row-span-12`
      if (span >= 11) return `${basePrefix}row-span-11`
      if (span >= 10) return `${basePrefix}row-span-10`
      if (span >= 9) return `${basePrefix}row-span-9`
      if (span >= 8) return `${basePrefix}row-span-8`
      if (span >= 7) return `${basePrefix}row-span-7`
      if (span >= 6) return `${basePrefix}row-span-6`
      if (span >= 5) return `${basePrefix}row-span-5`
      if (span >= 4) return `${basePrefix}row-span-4`
      if (span >= 3) return `${basePrefix}row-span-3`
      if (span >= 2) return `${basePrefix}row-span-2`
      return `${basePrefix}row-span-1`
    }

    const colSpanClasses = `${getColSpanClass(mobileSpan)} ${getColSpanClass(smSpan, "sm")} ${getColSpanClass(
      lgSpan,
      "lg"
    )} ${getColSpanClass(xlSpan, "xl")} ${getColSpanClass(xl2Span, "2xl")}`

    const rowSpanClasses = `${getRowSpanClass(rows)} ${getRowSpanClass(rows, "sm")} ${getRowSpanClass(
      rows,
      "lg"
    )} ${getRowSpanClass(rows, "xl")} ${getRowSpanClass(rows, "2xl")}`

    return `${colSpanClasses} ${rowSpanClasses}`
  }

  // Fallback to size property if no span
  if (card.size) {
    switch (card.size) {
      case "small":
        return "col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1 row-span-3"
      case "medium":
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 row-span-4"
      case "large":
        return "col-span-2 sm:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 row-span-6"
      case "wide":
      case "extra-large":
        return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-4"
      case "extra-wide":
        return "col-span-2 sm:col-span-6 lg:col-span-8 xl:col-span-10 2xl:col-span-12 row-span-3"
      case "full-width":
        return "col-span-2 sm:col-span-6 lg:col-span-12 xl:col-span-16 2xl:col-span-full row-span-6"
      case "tall":
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 row-span-8"
      default:
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 row-span-4"
    }
  }

  // Final fallback to type-based sizing for existing cards without size/span
  switch (card.type) {
    case "enhanced-hbi-insights":
    case "market-intelligence":
    case "bd-opportunities":
      return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-6"
    case "portfolio-overview":
    case "financial-review-panel":
    case "schedule-monitor":
    case "critical-dates":
      return "col-span-2 sm:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3 row-span-4"
    case "staffing-distribution":
    case "pipeline-analytics":
      return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4 row-span-8"
    default:
      return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2 row-span-4"
  }
}

export function DashboardGrid({
  cards,
  onLayoutChange,
  onCardRemove,
  onCardConfigure,
  onCardSizeChange,
  onDrillDown,
  isEditing = false,
  isCompact = false,
  spacingClass = "gap-6",
  userRole,
}: DashboardGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [items, setItems] = useState(cards)
  const [focusedCard, setFocusedCard] = useState<DashboardCard | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  React.useEffect(() => {
    setItems(cards)
  }, [cards])

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id)
  }, [])

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event
      setActiveId(null)

      if (active.id !== over?.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        setItems(newItems)

        if (onLayoutChange) {
          const layout = newItems.map((item, index) => ({
            i: item.id,
            x: 0,
            y: index,
            w: 12,
            h: 6,
          }))
          onLayoutChange(layout)
        }
      }
    },
    [items, onLayoutChange]
  )

  const activeCard = activeId ? items.find((item) => item.id === activeId) : null

  const handleCardFocus = useCallback((card: DashboardCard) => {
    setFocusedCard(card)
  }, [])

  const handleCardUnfocus = useCallback(() => {
    setFocusedCard(null)
  }, [])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        {/* Enhanced Responsive Grid Layout with consistent spacing */}
        <div
          className={cn(
            // Enhanced background with subtle pattern
            "relative",
            // Improved grid structure with consistent row sizing and dense flow
            "grid grid-rows-[repeat(auto-fit,minmax(80px,1fr))]",
            // Enhanced responsive breakpoints to support much larger cards
            "grid-cols-2", // Mobile: 2 columns (allows for 1.5x = 3 spans)
            "sm:grid-cols-6", // Small tablet: 6 columns
            "lg:grid-cols-12", // Large tablet/small desktop: 12 columns
            "xl:grid-cols-16", // Desktop: 16 columns
            "2xl:grid-cols-20", // Large desktop: 20 columns
            // Consistent spacing - same horizontal and vertical
            spacingClass
          )}
          style={{
            gridAutoFlow: "dense", // This enables automatic gap filling
            gridAutoRows: "80px", // Consistent row height
          }}
        >
          {items.map((card) => (
            <div key={card.id} className={cn("w-full", getCardGridSpan(card))}>
              <SortableCard
                card={card}
                isEditing={isEditing}
                isCompact={isCompact}
                onCardRemove={onCardRemove}
                onCardConfigure={onCardConfigure}
                onCardSizeChange={onCardSizeChange}
                onDrillDown={onDrillDown}
                onCardFocus={handleCardFocus}
                height={getCardHeight(card, isCompact)}
                userRole={userRole}
              />
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeCard ? (
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-2xl opacity-90 transform rotate-2 scale-105 border-2 border-primary/20 w-80">
            <div className="p-4 sm:p-5">
              <h3 className="font-semibold text-lg text-foreground">{activeCard.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Moving card...</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Focused Card Modal */}
      <Dialog open={!!focusedCard} onOpenChange={() => handleCardUnfocus()}>
        <DialogContent className="max-w-[60vw] max-h-[90vh] w-fit h-fit p-0 overflow-hidden border-2 border-border/50 shadow-2xl backdrop-blur-sm">
          {focusedCard && (
            <>
              <DialogHeader className="px-6 py-4 border-b border-border/50 bg-card/95 backdrop-blur-sm">
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Enhanced card icons with standardized color */}
                    {focusedCard.type === "portfolio-overview" && (
                      <Briefcase className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "enhanced-hbi-insights" && (
                      <Brain className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "financial-review-panel" && (
                      <BarChart3 className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "pipeline-analytics" && (
                      <Target className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "market-intelligence" && (
                      <TrendingUp className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "project-overview" && (
                      <Building2 className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "schedule-performance" && (
                      <Calendar className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "financial-status" && (
                      <DollarSign className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "general-conditions" && (
                      <Wrench className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "contingency-analysis" && (
                      <Shield className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "cash-flow" && <Droplets className="h-5 w-5" style={{ color: "#FA4616" }} />}
                    {focusedCard.type === "procurement" && <Package className="h-5 w-5" style={{ color: "#FA4616" }} />}
                    {focusedCard.type === "draw-forecast" && (
                      <BarChart3 className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "quality-control" && <Eye className="h-5 w-5" style={{ color: "#FA4616" }} />}
                    {focusedCard.type === "safety" && (
                      <AlertTriangleIcon className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "staffing-distribution" && (
                      <Users className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "change-order-analysis" && (
                      <FileText className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "closeout" && (
                      <ClipboardCheck className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "startup" && <Play className="h-5 w-5" style={{ color: "#FA4616" }} />}
                    {focusedCard.type === "critical-dates" && (
                      <CalendarDays className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "field-reports" && (
                      <FileText className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "rfi" && <MessageSquare className="h-5 w-5" style={{ color: "#FA4616" }} />}
                    {focusedCard.type === "submittal" && <FileText className="h-5 w-5" style={{ color: "#FA4616" }} />}

                    {focusedCard.type === "schedule-monitor" && (
                      <Calendar className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type === "bd-opportunities" && (
                      <Building2 className="h-5 w-5" style={{ color: "#FA4616" }} />
                    )}
                    {focusedCard.type !== "health" && (
                      <span className="text-lg font-semibold text-foreground">{focusedCard.title}</span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCardUnfocus}
                    className="h-8 w-8 p-0 hover:bg-muted/80 dark:hover:bg-muted/60"
                    title="Close focus view"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              {/* Enhanced modal content with better background */}
              <div className="p-6 max-h-[80vh] overflow-y-auto bg-background/50 backdrop-blur-sm">
                <div className="min-w-[600px] min-h-[400px]">
                  <CardContent card={focusedCard} isCompact={false} userRole={userRole} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}

interface SortableCardProps {
  card: DashboardCard
  isEditing: boolean
  isCompact: boolean
  onCardRemove?: (cardId: string) => void
  onCardConfigure?: (cardId: string, configUpdate?: Partial<DashboardCard>) => void
  onCardSizeChange?: (cardId: string, size: string) => void
  onDrillDown?: (cardId: string, cardType: string) => void
  onCardFocus?: (card: DashboardCard) => void
  height: number | "auto"
  userRole?: string
}

function SortableCard({
  card,
  isEditing,
  isCompact,
  onCardRemove,
  onCardConfigure,
  onCardSizeChange,
  onDrillDown,
  onCardFocus,
  height,
  userRole,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: typeof height === "number" ? `${height}px` : height,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditing ? listeners : {})}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-60 scale-105 shadow-2xl z-50",
        typeof height === "number" && `h-[${height}px]`,
        height === "auto" && "min-h-[320px]"
      )}
      onClick={(e) => {
        // Only trigger focus if not in editing mode and not clicking on interactive elements
        if (!isEditing && !e.defaultPrevented) {
          const target = e.target as HTMLElement
          // Check if clicking on control buttons or input elements
          if (target.closest("button") || target.closest("input") || target.closest('[role="button"]')) {
            return
          }
          onCardFocus?.(card)
        }
      }}
    >
      {/* Use enhanced DashboardCardWrapper */}
      <DashboardCardWrapper
        card={card}
        onRemove={onCardRemove}
        onConfigure={onCardConfigure}
        onSizeChange={onCardSizeChange}
        onDrillDown={onDrillDown}
        isEditing={isEditing}
        isCompact={isCompact}
        dragHandleClass="h-full"
      >
        <div className="h-full">
          {/* Enhanced card content area - header removed since DashboardCardWrapper handles it */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="p-2 sm:p-3 lg:p-4 h-full">
              <CardContent card={card} isCompact={isCompact} userRole={userRole} />
            </div>
          </div>
        </div>
      </DashboardCardWrapper>
    </div>
  )
}

// Helper function to calculate span based on card size
// Helper function to get optimal size for displaying 100% of card content
const getOptimalSize = (cardType: string): { cols: number; rows: number } => {
  const optimalSizes: Record<string, { cols: number; rows: number }> = {
    // Analytics cards need space for charts, metrics, and drill-down content
    "enhanced-hbi-insights": { cols: 8, rows: 6 }, // Wide for multiple charts
    "financial-review-panel": { cols: 8, rows: 3 }, // Wide for side-by-side metrics and charts
    "pipeline-analytics": { cols: 8, rows: 6 }, // Wide for pipeline stages
    "market-intelligence": { cols: 6, rows: 8 }, // Tall for detailed insights

    // Portfolio/Project cards need space for metrics + charts + footer
    "portfolio-overview": { cols: 8, rows: 6 }, // Wide to show all metrics + side-by-side charts
    "project-overview": { cols: 6, rows: 6 }, // Balanced for project details

    // KPI cards can be more compact but still readable
    "financial-status": { cols: 4, rows: 4 }, // Standard for key metrics
    "schedule-performance": { cols: 6, rows: 4 }, // Wide for timeline data

    // Status cards need moderate space for details
    "quality-control": { cols: 4, rows: 6 }, // Tall for inspection lists
    safety: { cols: 4, rows: 6 }, // Tall for safety metrics

    // List/table cards benefit from wide layouts
    "staffing-distribution": { cols: 10, rows: 6 }, // Extra wide for staff tables
    "change-order-analysis": { cols: 8, rows: 8 }, // Large for detailed analysis
    "field-reports": { cols: 6, rows: 8 }, // Tall for report lists

    // Detail cards need vertical space
    closeout: { cols: 6, rows: 8 }, // Tall for closeout checklists
    startup: { cols: 6, rows: 6 }, // Balanced for startup activities
    "critical-dates": { cols: 8, rows: 6 }, // Wide for timeline view

    // Chart-heavy cards need generous space
    "cash-flow": { cols: 8, rows: 6 }, // Wide for cash flow charts
    "contingency-analysis": { cols: 6, rows: 6 }, // Balanced for analysis
    "draw-forecast": { cols: 10, rows: 6 }, // Extra wide for forecast timeline

    // Simple metric cards
    "general-conditions": { cols: 4, rows: 4 }, // Standard for basic metrics
    procurement: { cols: 6, rows: 6 }, // Balanced for procurement data
    "bd-opportunities": { cols: 8, rows: 6 }, // Wide for opportunity pipeline
  }

  return optimalSizes[cardType] || { cols: 6, rows: 6 } // Default to large balanced size
}

const calculateSpan = (card: DashboardCard): { cols: number; rows: number } => {
  console.log("🧮 calculateSpan called for card:", card.id, "size:", card.size, "span:", card.span)

  // If the card has a direct span property, use it
  if (card.span) {
    console.log("✅ Using existing span:", card.span)
    return card.span
  }

  // Convert smart preset sizes to cols/rows
  switch (card.size) {
    case "optimal":
      const optimalSize = getOptimalSize(card.type)
      console.log("🎯 Optimal size for", card.type, ":", optimalSize)
      return optimalSize
    case "compact":
      console.log("📏 Compact size -> 3x3")
      return { cols: 3, rows: 3 }
    case "standard":
      console.log("📏 Standard size -> 4x4")
      return { cols: 4, rows: 4 }
    case "wide":
      console.log("📏 Wide size -> 8x4")
      return { cols: 8, rows: 4 }
    case "tall":
      console.log("📏 Tall size -> 4x8")
      return { cols: 4, rows: 8 }
    case "large":
      console.log("📏 Large size -> 6x6")
      return { cols: 6, rows: 6 }
    default:
      // Handle custom sizes like "custom-6x4"
      if (typeof card.size === "string" && card.size.startsWith("custom-")) {
        const sizeParts = card.size.replace("custom-", "").split("x")
        console.log("🎯 Custom size detected in calculateSpan:", card.size, "parts:", sizeParts)
        if (sizeParts.length === 2) {
          const cols = parseInt(sizeParts[0])
          const rows = parseInt(sizeParts[1])
          if (!isNaN(cols) && !isNaN(rows)) {
            console.log("✅ Custom size parsed in calculateSpan:", { cols, rows })
            return { cols, rows }
          }
        }
      }

      // Fallback to optimal size instead of standard
      console.log("⚠️ Using fallback optimal size for", card.type)
      return getOptimalSize(card.type)
  }
}

function CardContent({ card, isCompact, userRole }: { card: DashboardCard; isCompact: boolean; userRole?: string }) {
  const span = calculateSpan(card)

  switch (card.type) {
    case "portfolio-overview":
      return <PortfolioOverview config={card.config || {}} span={span} isCompact={isCompact} />
    case "enhanced-hbi-insights":
      return <EnhancedHBIInsights config={card.config || {}} cardId={card.id} />
    case "financial-review-panel":
      return card.config?.panelProps ? (
        <FinancialReviewPanel {...card.config.panelProps} card={card} span={span} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground p-4">
          <p>Configure Financial Review Panel</p>
        </div>
      )
    case "pipeline-analytics":
      return <PipelineAnalytics config={card.config || {}} span={span} isCompact={isCompact} />
    case "market-intelligence":
      return <MarketIntelligence config={card.config || {}} span={span} isCompact={isCompact} />
    case "project-overview":
      return <ProjectOverviewCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "schedule-performance":
      return (
        <SchedulePerformanceCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "financial-status":
      return <FinancialStatusCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "general-conditions":
      return <GeneralConditionsCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "contingency-analysis":
      return (
        <ContingencyAnalysisCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "cash-flow":
      return <CashFlowCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "procurement":
      return <ProcurementCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "draw-forecast":
      return <DrawForecastCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "quality-control":
      return (
        <QualityControlCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "safety":
      return <SafetyCard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "staffing-distribution":
      return (
        <StaffingDistributionCard config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "change-order-analysis":
      return (
        <ChangeOrderAnalysisCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "closeout":
      return (
        <CloseoutCard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "startup":
      return (
        <StartupCard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "critical-dates":
      return (
        <CriticalDatesCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "field-reports":
      return (
        <FieldReportsCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "rfi":
      return <RFICard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "submittal":
      return (
        <SubmittalCard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "health":
      return <HealthCard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
    case "schedule-monitor":
      return (
        <ScheduleMonitorCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "bd-opportunities":
      return (
        <BDOpportunitiesCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    // IT Command Center placeholder cards
    case "user-access-summary":
      return (
        <UserAccessSummaryCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "system-logs":
      return (
        <SystemLogsCard card={card} config={card.config || {}} span={span} isCompact={isCompact} userRole={userRole} />
      )
    case "infrastructure-monitor":
      return (
        <InfrastructureMonitorCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "endpoint-health":
      return (
        <EndpointHealthCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "siem-log-overview":
      return (
        <SiemLogOverviewCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "email-security-health":
      return (
        <EmailSecurityHealthCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "asset-tracker":
      return (
        <AssetTrackerCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "change-governance-panel":
      return (
        <ChangeGovernancePanelCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "backup-restore-status":
      return (
        <BackupRestoreStatusCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "ai-pipeline-status":
      return (
        <AiPipelineStatusCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "consultant-dashboard":
      return (
        <ConsultantDashboardCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "hb-intel-management":
      return (
        <HbIntelManagementCard
          card={card}
          config={card.config || {}}
          span={span}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground p-4">
          <div className="text-center">
            <p className="text-sm">Card Type: {card.type}</p>
            <p className="text-xs mt-1">Configure this card to display content</p>
          </div>
        </div>
      )
  }
}
