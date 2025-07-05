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
 * Professional Dashboard Grid System
 *
 * Features:
 * - Clean CSS Grid layout with responsive breakpoints
 * - Professional styling matching application design
 * - Full drag-and-drop functionality
 * - Proper card sizing and positioning
 * - Smooth animations and transitions
 * - Industry-standard grid behavior
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

// Responsive grid configuration
const GRID_CONFIG = {
  // Column counts for different screen sizes
  columns: {
    sm: 2, // Mobile
    md: 4, // Tablet
    lg: 16, // Desktop - optimized for executive dashboard
    xl: 16, // Large desktop - optimized for executive dashboard
    "2xl": 16, // Extra large desktop - consistent 16 columns
  },
  // Base row height (in pixels)
  rowHeight: {
    compact: 60,
    normal: 80,
  },
  // Grid gaps
  gap: {
    compact: 16,
    normal: 24,
  },
}

// Get responsive grid classes
const getGridClasses = (isCompact: boolean, spacingClass: string) => {
  const gap = isCompact ? GRID_CONFIG.gap.compact : GRID_CONFIG.gap.normal

  return cn(
    "grid w-full",
    "grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-16 xl:grid-cols-16 2xl:grid-cols-16",
    spacingClass || `gap-${gap / 4}`, // Convert px to Tailwind spacing
    "transition-all duration-300 ease-in-out"
  )
}

// Calculate card grid area
const getCardGridArea = (card: DashboardCard) => {
  if (!card.span || !card.position) return {}

  const { cols, rows } = card.span
  const { x, y } = card.position

  // CSS Grid area: grid-column-start / grid-row-start / grid-column-end / grid-row-end
  return {
    gridColumnStart: x + 1,
    gridColumnEnd: x + cols + 1,
    gridRowStart: y + 1,
    gridRowEnd: y + rows + 1,
  }
}

// Get card height based on content and span
const getCardHeight = (card: DashboardCard, isCompact: boolean): number | "auto" => {
  // For pipeline-analytics, use content-driven height
  if (card.type === "pipeline-analytics") {
    return "auto"
  }

  if (card.span && card.span.rows) {
    const rowHeight = isCompact ? GRID_CONFIG.rowHeight.compact : GRID_CONFIG.rowHeight.normal
    return card.span.rows * rowHeight
  }

  // Content-aware heights for different card types
  switch (card.type) {
    case "financial-review-panel":
      return isCompact ? 400 : 500
    case "enhanced-hbi-insights":
      return isCompact ? 350 : 400
    case "portfolio-overview":
      return isCompact ? 300 : 350
    case "market-intelligence":
      return isCompact ? 450 : 500
    case "staffing-distribution":
      return isCompact ? 400 : 450
    default:
      return isCompact ? 300 : 350
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
  const [draggedCard, setDraggedCard] = useState<DashboardCard | null>(null)

  // Configure drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Calculate grid position from mouse coordinates
  const getGridPosition = (x: number, y: number, containerRect: DOMRect, isCompact: boolean) => {
    const gridColumns = 16 // Optimized grid columns for executive dashboard
    const gridRows = 50 // Allow for tall layouts

    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top

    const cellWidth = containerRect.width / gridColumns
    const cellHeight = isCompact ? GRID_CONFIG.rowHeight.compact : GRID_CONFIG.rowHeight.normal

    const gridX = Math.floor(relativeX / cellWidth)
    const gridY = Math.floor(relativeY / cellHeight)

    return {
      x: Math.max(0, Math.min(gridX, gridColumns - 1)),
      y: Math.max(0, Math.min(gridY, gridRows - 1)),
    }
  }

  // Initialize missing positions for cards
  const initializeCardPositions = (cards: DashboardCard[]): DashboardCard[] => {
    let maxY = 0
    const occupiedPositions = new Set<string>()

    // First pass: track existing positions
    cards.forEach((card) => {
      if (card.position && card.span) {
        for (let x = card.position.x; x < card.position.x + card.span.cols; x++) {
          for (let y = card.position.y; y < card.position.y + card.span.rows; y++) {
            occupiedPositions.add(`${x},${y}`)
            maxY = Math.max(maxY, y + 1)
          }
        }
      }
    })

    // Second pass: assign positions to cards without them
    return cards.map((card) => {
      if (card.position) return card

      const span = card.span || getOptimalSize(card.type)
      let foundPosition = false
      let newPosition = { x: 0, y: 0 }

      // Try to find an available position
      for (let y = 0; y <= maxY + 10 && !foundPosition; y++) {
        for (let x = 0; x <= 16 - span.cols && !foundPosition; x++) {
          let canPlace = true

          // Check if this position is available
          for (let dx = 0; dx < span.cols && canPlace; dx++) {
            for (let dy = 0; dy < span.rows && canPlace; dy++) {
              if (occupiedPositions.has(`${x + dx},${y + dy}`)) {
                canPlace = false
              }
            }
          }

          if (canPlace) {
            newPosition = { x, y }
            foundPosition = true

            // Mark this position as occupied
            for (let dx = 0; dx < span.cols; dx++) {
              for (let dy = 0; dy < span.rows; dy++) {
                occupiedPositions.add(`${x + dx},${y + dy}`)
              }
            }
          }
        }
      }

      if (!foundPosition) {
        // If no position found, place at the bottom
        newPosition = { x: 0, y: maxY }
      }

      return { ...card, position: newPosition, span }
    })
  }

  // Check if a position is available (no overlapping cards)
  const isPositionAvailable = (
    position: { x: number; y: number },
    span: { cols: number; rows: number },
    excludeCardId?: string
  ) => {
    const endX = position.x + span.cols
    const endY = position.y + span.rows

    // Check bounds
    if (position.x < 0 || position.y < 0 || endX > 16) return false

    return !cards.some((card) => {
      if (card.id === excludeCardId) return false
      if (!card.position || !card.span) return false

      const cardEndX = card.position.x + card.span.cols
      const cardEndY = card.position.y + card.span.rows

      // Check for overlap
      return !(endX <= card.position.x || position.x >= cardEndX || endY <= card.position.y || position.y >= cardEndY)
    })
  }

  // Find the nearest available position
  const findNearestAvailablePosition = (
    targetPosition: { x: number; y: number },
    span: { cols: number; rows: number },
    excludeCardId?: string
  ) => {
    // Try the exact position first
    if (isPositionAvailable(targetPosition, span, excludeCardId)) {
      return targetPosition
    }

    // Search in expanding circles around the target position
    for (let radius = 1; radius <= 10; radius++) {
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          if (Math.abs(dx) === radius || Math.abs(dy) === radius) {
            const testPosition = {
              x: Math.max(0, Math.min(targetPosition.x + dx, 16 - span.cols)),
              y: Math.max(0, targetPosition.y + dy),
            }

            if (isPositionAvailable(testPosition, span, excludeCardId)) {
              return testPosition
            }
          }
        }
      }
    }

    // Fallback to original position if no space found
    return targetPosition
  }

  // Initialize cards with positions on first render
  const initializedCards = useMemo(() => initializeCardPositions(cards), [cards])

  // Handle drag start
  const handleDragStart = useCallback(
    (event: any) => {
      const { active } = event
      setActiveId(active.id)

      const card = initializedCards.find((c) => c.id === active.id)
      setDraggedCard(card || null)
    },
    [initializedCards]
  )

  // Handle drag end with proper grid positioning
  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, delta } = event

      if (!draggedCard || !active) {
        setActiveId(null)
        setDraggedCard(null)
        return
      }

      try {
        // Get container bounds for position calculation
        const gridContainer = document.querySelector("[data-grid-container]") as HTMLElement
        if (!gridContainer) {
          console.warn("Grid container not found")
          setActiveId(null)
          setDraggedCard(null)
          return
        }

        const containerRect = gridContainer.getBoundingClientRect()

        // Calculate new grid position based on drag delta
        const currentPos = draggedCard.position || { x: 0, y: 0 }
        const cellWidth = containerRect.width / 16
        const cellHeight = isCompact ? GRID_CONFIG.rowHeight.compact : GRID_CONFIG.rowHeight.normal

        const newGridPos = {
          x: Math.round((currentPos.x * cellWidth + delta.x) / cellWidth),
          y: Math.round((currentPos.y * cellHeight + delta.y) / cellHeight),
        }

        // Find the nearest available position
        const cardSpan = draggedCard.span || getOptimalSize(draggedCard.type)
        const finalPosition = findNearestAvailablePosition(newGridPos, cardSpan, draggedCard.id)

        // Update the card with new position
        const updatedCards = initializedCards.map((card) => {
          if (card.id === draggedCard.id) {
            return {
              ...card,
              position: finalPosition,
            }
          }
          return card
        })

        // Notify parent of layout change
        onLayoutChange?.(updatedCards)
      } catch (error) {
        console.error("Error handling drag end:", error)
      }

      setActiveId(null)
      setDraggedCard(null)
    },
    [initializedCards, draggedCard, onLayoutChange, isCompact]
  )

  // Handle card focus for accessibility
  const handleCardFocus = useCallback((card: DashboardCard) => {
    // Implementation for card focus (e.g., keyboard navigation)
  }, [])

  // Get sorted cards by position for consistent rendering
  const sortedCards = useMemo(() => {
    return [...initializedCards].sort((a, b) => {
      const aPos = a.position || { x: 0, y: 0 }
      const bPos = b.position || { x: 0, y: 0 }
      if (aPos.y !== bPos.y) {
        return aPos.y - bPos.y
      }
      return aPos.x - bPos.x
    })
  }, [initializedCards])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("w-full", "rounded-xl", "p-0 sm:p-0", "transition-colors duration-300")}>
        <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
          <div
            className={getGridClasses(isCompact, spacingClass)}
            data-grid-container
            style={{
              // Ensure grid is displayed properly
              display: "grid",
              width: "100%",
            }}
          >
            {sortedCards.map((card) => (
              <SortableCard
                key={card.id}
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
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Drag overlay for smooth dragging experience */}
      <DragOverlay>
        {activeId && draggedCard ? (
          <div
            className={cn(
              "rounded-xl shadow-2xl",
              "bg-white dark:bg-gray-800",
              "border border-gray-200 dark:border-gray-700",
              "transform rotate-3 scale-105",
              "transition-transform duration-200"
            )}
          >
            <CardContent card={draggedCard} isCompact={isCompact} userRole={userRole} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

// Sortable card component with professional styling
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

  const gridArea = getCardGridArea(card)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...gridArea,
    ...(typeof height === "number" && card.type !== "pipeline-analytics" ? { minHeight: `${height}px` } : {}),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        "transition-all duration-300 ease-in-out",
        isDragging && "z-50 scale-105 shadow-2xl",
        !card.visible && "opacity-50"
      )}
      {...attributes}
      {...(isEditing ? listeners : {})}
    >
      <DashboardCardWrapper
        card={card}
        onRemove={onCardRemove}
        onConfigure={onCardConfigure}
        onSizeChange={onCardSizeChange}
        onDrillDown={onDrillDown}
        dragHandleClass="cursor-grab active:cursor-grabbing"
        isEditing={isEditing}
        isCompact={isCompact}
      >
        <CardContent card={card} isCompact={isCompact} userRole={userRole} />
      </DashboardCardWrapper>
    </div>
  )
}

// Card content renderer
function CardContent({ card, isCompact, userRole }: { card: DashboardCard; isCompact: boolean; userRole?: string }) {
  // Calculate span for components that need it
  const span = card.span || getOptimalSize(card.type)

  const commonProps = {
    className: card.type === "pipeline-analytics" ? "w-full" : "h-full w-full",
    isCompact,
    userRole,
    span,
    card,
    ...(card.config || {}),
  }

  // Default config for portfolio overview
  const defaultPortfolioConfig = {
    totalProjects: 20,
    activeProjects: 17,
    completedThisYear: 12,
    averageDuration: 8.5,
    averageContractValue: 3.2,
    totalSqFt: 485000,
    totalValue: 68.5,
    netCashFlow: 12.3,
    averageWorkingCapital: 8.7,
  }

  switch (card.type) {
    case "portfolio-overview":
      return <PortfolioOverview {...commonProps} config={card.config || defaultPortfolioConfig} />
    case "enhanced-hbi-insights":
      return <EnhancedHBIInsights {...commonProps} />
    case "financial-review-panel":
      return <FinancialReviewPanel {...commonProps} />
    case "pipeline-analytics":
      return <PipelineAnalytics {...commonProps} />
    case "market-intelligence":
      return <MarketIntelligence {...commonProps} />
    case "project-overview":
      return <ProjectOverviewCard {...commonProps} />
    case "schedule-performance":
      return <SchedulePerformanceCard {...commonProps} />
    case "financial-status":
      return <FinancialStatusCard {...commonProps} />
    case "general-conditions":
      return <GeneralConditionsCard {...commonProps} />
    case "contingency-analysis":
      return <ContingencyAnalysisCard {...commonProps} />
    case "cash-flow":
      return <CashFlowCard {...commonProps} />
    case "procurement":
      return <ProcurementCard {...commonProps} />
    case "draw-forecast":
      return <DrawForecastCard {...commonProps} />
    case "quality-control":
      return <QualityControlCard {...commonProps} />
    case "safety":
      return <SafetyCard {...commonProps} />
    case "staffing-distribution":
      return <StaffingDistributionCard {...commonProps} />
    case "change-order-analysis":
      return <ChangeOrderAnalysisCard {...commonProps} />
    case "closeout":
      return <CloseoutCard {...commonProps} />
    case "startup":
      return <StartupCard {...commonProps} />
    case "critical-dates":
      return <CriticalDatesCard {...commonProps} />
    case "field-reports":
      return <FieldReportsCard {...commonProps} />
    case "rfi":
      return <RFICard {...commonProps} />
    case "submittal":
      return <SubmittalCard {...commonProps} />
    case "health":
      return <HealthCard {...commonProps} />
    case "schedule-monitor":
      return <ScheduleMonitorCard {...commonProps} />
    case "bd-opportunities":
      return <BDOpportunitiesCard {...commonProps} />
    // IT Command Center cards
    case "user-access-summary":
      return <UserAccessSummaryCard {...commonProps} />
    case "system-logs":
      return <SystemLogsCard {...commonProps} />
    case "infrastructure-monitor":
      return <InfrastructureMonitorCard {...commonProps} />
    case "endpoint-health":
      return <EndpointHealthCard {...commonProps} />
    case "siem-log-overview":
      return <SiemLogOverviewCard {...commonProps} />
    case "email-security-health":
      return <EmailSecurityHealthCard {...commonProps} />
    case "asset-tracker":
      return <AssetTrackerCard {...commonProps} />
    case "change-governance-panel":
      return <ChangeGovernancePanelCard {...commonProps} />
    case "backup-restore-status":
      return <BackupRestoreStatusCard {...commonProps} />
    case "ai-pipeline-status":
      return <AiPipelineStatusCard {...commonProps} />
    case "consultant-dashboard":
      return <ConsultantDashboardCard {...commonProps} />
    case "hb-intel-management":
      return <HbIntelManagementCard {...commonProps} />
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <AlertTriangleIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Unknown card type: {card.type}</p>
          </div>
        </div>
      )
  }
}

// Get optimal size for cards (optimized for 16-column executive layout)
const getOptimalSize = (cardType: string): { cols: number; rows: number } => {
  switch (cardType) {
    case "financial-review-panel":
      return { cols: 16, rows: 6 }
    case "enhanced-hbi-insights":
      return { cols: 8, rows: 5 }
    case "portfolio-overview":
      return { cols: 8, rows: 5 }
    case "pipeline-analytics":
      return { cols: 10, rows: 4 }
    case "market-intelligence":
      return { cols: 6, rows: 5 }
    case "staffing-distribution":
      return { cols: 8, rows: 5 }
    case "quality-control":
      return { cols: 4, rows: 5 }
    case "safety":
      return { cols: 4, rows: 5 }
    case "cash-flow":
      return { cols: 8, rows: 4 }
    default:
      return { cols: 6, rows: 4 }
  }
}
