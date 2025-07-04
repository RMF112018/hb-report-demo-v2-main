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
const getCardColSpan = (card: DashboardCard): string => {
  // First check if the card has a span property
  if (card.span) {
    const cols = card.span.cols
    // Map cols to responsive grid spans
    switch (cols) {
      case 2:
        return "col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1" // Small
      case 4:
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2" // Medium
      case 6:
        return "col-span-2 sm:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3" // Large
      case 8:
        return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4" // Wide/XLarge
      default:
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2" // Default
    }
  }

  // Fallback to size property if no span
  if (card.size) {
    switch (card.size) {
      case "small":
        return "col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-1 2xl:col-span-1"
      case "medium":
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2"
      case "large":
        return "col-span-2 sm:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3"
      case "wide":
      case "extra-large":
        return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4"
      case "tall":
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2"
      default:
        return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2"
    }
  }

  // Final fallback to type-based sizing for existing cards without size/span
  switch (card.type) {
    case "enhanced-hbi-insights":
    case "market-intelligence":
    case "bd-opportunities":
      return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4"
    case "portfolio-overview":
    case "financial-review-panel":
    case "schedule-monitor":
    case "critical-dates":
      return "col-span-2 sm:col-span-3 lg:col-span-3 xl:col-span-3 2xl:col-span-3"
    case "staffing-distribution":
    case "pipeline-analytics":
      return "col-span-2 sm:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-4"
    default:
      return "col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2 2xl:col-span-2"
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
            // Improved grid structure with consistent row sizing
            "grid auto-rows-max",
            // Enhanced responsive breakpoints to support fractional widths
            "grid-cols-2", // Mobile: 2 columns (allows for 1.5x = 3 spans)
            "sm:grid-cols-4", // Small tablet: 4 columns
            "lg:grid-cols-6", // Large tablet/small desktop: 6 columns
            "xl:grid-cols-8", // Desktop: 8 columns
            "2xl:grid-cols-10", // Large desktop: 10 columns
            // Consistent spacing - same horizontal and vertical
            spacingClass
          )}
        >
          {items.map((card) => (
            <div key={card.id} className={cn("w-full", getCardColSpan(card))}>
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
      onClick={() => onCardFocus?.(card)}
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

function CardContent({ card, isCompact, userRole }: { card: DashboardCard; isCompact: boolean; userRole?: string }) {
  const baseSpan = { cols: 8, rows: 6 } // Standard size for simplified grid

  switch (card.type) {
    case "portfolio-overview":
      return <PortfolioOverview config={card.config || {}} span={baseSpan} isCompact={isCompact} />
    case "enhanced-hbi-insights":
      return <EnhancedHBIInsights config={card.config || {}} cardId={card.id} />
    case "financial-review-panel":
      return card.config?.panelProps ? (
        <FinancialReviewPanel {...card.config.panelProps} />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground p-4">
          <p>Configure Financial Review Panel</p>
        </div>
      )
    case "pipeline-analytics":
      return <PipelineAnalytics config={card.config || {}} span={baseSpan} isCompact={isCompact} />
    case "market-intelligence":
      return <MarketIntelligence config={card.config || {}} span={baseSpan} isCompact={isCompact} />
    case "project-overview":
      return (
        <ProjectOverviewCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "schedule-performance":
      return (
        <SchedulePerformanceCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "financial-status":
      return (
        <FinancialStatusCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "general-conditions":
      return (
        <GeneralConditionsCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "contingency-analysis":
      return (
        <ContingencyAnalysisCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "cash-flow":
      return <CashFlowCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
    case "procurement":
      return <ProcurementCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
    case "draw-forecast":
      return <DrawForecastCard config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
    case "quality-control":
      return (
        <QualityControlCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "safety":
      return (
        <SafetyCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "staffing-distribution":
      return (
        <StaffingDistributionCard
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "change-order-analysis":
      return (
        <ChangeOrderAnalysisCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "closeout":
      return (
        <CloseoutCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "startup":
      return (
        <StartupCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "critical-dates":
      return (
        <CriticalDatesCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "field-reports":
      return (
        <FieldReportsCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "rfi":
      return (
        <RFICard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "submittal":
      return (
        <SubmittalCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "health":
      return (
        <HealthCard card={card} config={card.config || {}} span={baseSpan} isCompact={isCompact} userRole={userRole} />
      )
    case "schedule-monitor":
      return (
        <ScheduleMonitorCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "bd-opportunities":
      return (
        <BDOpportunitiesCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
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
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "system-logs":
      return (
        <SystemLogsCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "infrastructure-monitor":
      return (
        <InfrastructureMonitorCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "endpoint-health":
      return (
        <EndpointHealthCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "siem-log-overview":
      return (
        <SiemLogOverviewCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "email-security-health":
      return (
        <EmailSecurityHealthCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "asset-tracker":
      return (
        <AssetTrackerCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "change-governance-panel":
      return (
        <ChangeGovernancePanelCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "backup-restore-status":
      return (
        <BackupRestoreStatusCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "ai-pipeline-status":
      return (
        <AiPipelineStatusCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
          isCompact={isCompact}
          userRole={userRole}
        />
      )
    case "consultant-dashboard":
      return (
        <ConsultantDashboardCard
          card={card}
          config={card.config || {}}
          span={baseSpan}
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
