"use client"

import { cn } from "@/lib/utils"
import {
  X,
  Move,
  Settings2,
  MoreVertical,
  Maximize2,
  Minimize2,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Brain,
  BarChart3,
  Target,
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
  Expand,
  LayoutGrid,
} from "lucide-react"
import { DashboardCard } from "@/types/dashboard"
import React, { ReactNode, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface DashboardCardWrapperProps {
  card: DashboardCard
  children: ReactNode
  onRemove?: (id: string) => void
  onConfigure?: (id: string) => void
  onDrillDown?: (id: string, cardType: string) => void
  onSizeChange?: (id: string, size: string) => void
  dragHandleClass?: string
  isEditing?: boolean
  isCompact?: boolean
}

// Define card categories for theming
const getCardCategory = (cardType: string): "financial" | "operational" | "analytics" | "project" | "schedule" => {
  const financialCards = [
    "financial-status",
    "cash-flow",
    "financial-review-panel",
    "procurement",
    "draw-forecast",
    "contingency-analysis",
  ]
  const operationalCards = ["safety", "quality-control", "field-reports", "staffing-distribution"]
  const analyticsCards = ["enhanced-hbi-insights", "pipeline-analytics", "market-intelligence"]
  const projectCards = ["project-overview", "portfolio-overview", "bd-opportunities"]
  const scheduleCards = ["schedule-performance", "schedule-monitor", "critical-dates"]

  if (financialCards.includes(cardType)) return "financial"
  if (operationalCards.includes(cardType)) return "operational"
  if (analyticsCards.includes(cardType)) return "analytics"
  if (projectCards.includes(cardType)) return "project"
  if (scheduleCards.includes(cardType)) return "schedule"

  return "project" // default
}

const getCategoryTheme = (category: "financial" | "operational" | "analytics" | "project" | "schedule") => {
  const themes = {
    financial: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent:
        "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none",
    },
    operational: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent:
        "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none",
    },
    analytics: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent:
        "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none",
    },
    project: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent:
        "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none",
    },
    schedule: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent:
        "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none",
    },
  }

  return themes[category] || themes.project
}

// Get card-specific icon
const getCardIcon = (cardType: string) => {
  switch (cardType) {
    case "portfolio-overview":
      return <Briefcase className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "enhanced-hbi-insights":
      return <Brain className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "financial-review-panel":
      return <BarChart3 className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "pipeline-analytics":
      return <Target className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "market-intelligence":
      return <TrendingUp className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "project-overview":
      return <Building2 className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "schedule-performance":
      return <Calendar className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "financial-status":
      return <DollarSign className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "general-conditions":
      return <Wrench className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "contingency-analysis":
      return <Shield className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "cash-flow":
      return <Droplets className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "procurement":
      return <Package className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "draw-forecast":
      return <BarChart3 className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "quality-control":
      return <Eye className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "safety":
      return <AlertTriangleIcon className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "staffing-distribution":
      return <Users className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "change-order-analysis":
      return <FileText className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "closeout":
      return <ClipboardCheck className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "startup":
      return <Play className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "critical-dates":
      return <CalendarDays className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "field-reports":
      return <FileText className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "rfi":
      return <MessageSquare className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "submittal":
      return <FileText className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "health":
      return <Heart className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "schedule-monitor":
      return <Calendar className="h-4 w-4" style={{ color: "#FA4616" }} />
    case "bd-opportunities":
      return <Building2 className="h-4 w-4" style={{ color: "#FA4616" }} />
    default:
      return <TrendingUp className="h-4 w-4" style={{ color: "#FA4616" }} />
  }
}

// Define smart preset sizes - much more user-friendly
const SMART_PRESETS = [
  { value: "optimal", label: "Optimal", description: "Best size for 100% content", cols: 6, rows: 6, icon: "🎯" },
  { value: "compact", label: "Compact", description: "Small metrics & KPIs", cols: 3, rows: 3, icon: "📊" },
  { value: "standard", label: "Standard", description: "Most content types", cols: 4, rows: 4, icon: "📋" },
  { value: "wide", label: "Wide", description: "Tables & lists", cols: 8, rows: 4, icon: "📈" },
  { value: "tall", label: "Tall", description: "Detailed content", cols: 4, rows: 8, icon: "📝" },
  { value: "large", label: "Large", description: "Charts & analytics", cols: 6, rows: 6, icon: "📊" },
  { value: "extra-wide", label: "Extra Wide", description: "Dashboards & timelines", cols: 12, rows: 4, icon: "📊" },
  { value: "full-width", label: "Full Width", description: "Maximum width cards", cols: 20, rows: 6, icon: "🖥️" },
  { value: "custom", label: "Custom", description: "Choose your own size", cols: 4, rows: 4, icon: "⚙️" },
]

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

// Helper function to get recommended preset based on card type
const getRecommendedPreset = (cardType: string): string => {
  const recommendations: Record<string, string> = {
    // Analytics cards that need space for charts
    "enhanced-hbi-insights": "optimal",
    "financial-review-panel": "optimal",
    "pipeline-analytics": "optimal",
    "market-intelligence": "optimal",

    // Portfolio cards benefit from optimal sizing
    "portfolio-overview": "optimal",
    "project-overview": "optimal",

    // KPI cards that work well compact
    "financial-status": "standard",
    "schedule-performance": "optimal",
    "quality-control": "optimal",
    safety: "optimal",

    // List/table cards benefit from optimal layouts
    "staffing-distribution": "optimal",
    "change-order-analysis": "optimal",
    "field-reports": "optimal",

    // Detail cards that need optimal space
    closeout: "optimal",
    startup: "optimal",
    "critical-dates": "optimal",

    // Chart-heavy cards
    "cash-flow": "optimal",
    "contingency-analysis": "optimal",
    "draw-forecast": "optimal",

    // Simple metric cards
    "general-conditions": "standard",
    procurement: "optimal",
    "bd-opportunities": "optimal",
  }

  return recommendations[cardType] || "optimal"
}

// Visual Grid Selector Component
const GridSelector = ({
  currentCols,
  currentRows,
  onSizeChange,
  onClose,
}: {
  currentCols: number
  currentRows: number
  onSizeChange: (cols: number, rows: number) => void
  onClose: () => void
}) => {
  const [selectedCols, setSelectedCols] = useState(currentCols)
  const [selectedRows, setSelectedRows] = useState(currentRows)
  const maxCols = 20 // Increased to match dashboard grid
  const maxRows = 12 // Increased for more flexibility

  return (
    <div
      className="p-4 space-y-4"
      onClick={(e) => {
        e.stopPropagation() // Prevent bubbling to card focus handler
        e.preventDefault()
      }}
    >
      <div className="text-center">
        <h3 className="font-medium text-sm mb-1">Choose Card Size</h3>
        <p className="text-xs text-muted-foreground">
          {selectedCols} × {selectedRows} grid ({selectedCols * selectedRows} units)
        </p>
      </div>

      {/* Visual Grid */}
      <div className="flex flex-col items-center space-y-2">
        <div
          className="grid gap-1 p-2 bg-muted/30 rounded-lg overflow-auto"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
            width: "400px", // Increased width for better visibility of 20 columns
            maxHeight: "200px", // Added max height with scroll for better UX
          }}
          onClick={(e) => {
            e.stopPropagation() // Prevent bubbling from grid container
            e.preventDefault()
          }}
        >
          {Array.from({ length: maxCols * maxRows }, (_, index) => {
            const col = (index % maxCols) + 1
            const row = Math.floor(index / maxCols) + 1
            const isSelected = col <= selectedCols && row <= selectedRows
            const isHovered = col <= selectedCols && row <= selectedRows

            return (
              <div
                key={index}
                className={cn(
                  "w-4 h-4 border border-border/40 rounded-sm cursor-pointer transition-all",
                  isSelected ? "bg-primary border-primary shadow-sm" : "bg-background hover:bg-muted/60"
                )}
                onMouseEnter={() => {
                  setSelectedCols(col)
                  setSelectedRows(row)
                }}
                onClick={(e) => {
                  e.stopPropagation() // Prevent bubbling from grid cell
                  e.preventDefault()
                  console.log("🎯 Grid cell clicked:", { col, row })
                  onSizeChange(col, row)
                  onClose()
                }}
              />
            )
          })}
        </div>

        {/* Size Controls */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <label className="text-muted-foreground">Width:</label>
            <input
              type="range"
              min="1"
              max={maxCols}
              value={selectedCols}
              onChange={(e) => {
                e.stopPropagation()
                setSelectedCols(Number(e.target.value))
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              className="w-16"
            />
            <span className="w-6 text-center">{selectedCols}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-muted-foreground">Height:</label>
            <input
              type="range"
              min="1"
              max={maxRows}
              value={selectedRows}
              onChange={(e) => {
                e.stopPropagation()
                setSelectedRows(Number(e.target.value))
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              className="w-16"
            />
            <span className="w-6 text-center">{selectedRows}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            console.log("🚫 Cancel button clicked")
            onClose()
          }}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            console.log("🚀 Apply Size button clicked:", { selectedCols, selectedRows })
            onSizeChange(selectedCols, selectedRows)
            onClose()
          }}
          className="text-xs"
        >
          Apply Size
        </Button>
      </div>
    </div>
  )
}

export const DashboardCardWrapper = ({
  card,
  children,
  onRemove,
  onConfigure,
  onDrillDown,
  onSizeChange,
  dragHandleClass,
  isEditing = false,
  isCompact = false,
}: DashboardCardWrapperProps) => {
  const [showActions, setShowActions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [isDrillDownActive, setIsDrillDownActive] = useState(false)
  const [showGridSelector, setShowGridSelector] = useState(false)

  // Get current card dimensions
  const getCurrentDimensions = () => {
    const currentPreset = SMART_PRESETS.find((p) => p.value === card.size)
    if (currentPreset) {
      return { cols: currentPreset.cols, rows: currentPreset.rows }
    }
    // Fallback to span if available
    return { cols: card.span?.cols || 4, rows: card.span?.rows || 4 }
  }

  const category = getCardCategory(card.type)
  const theme = getCategoryTheme(category)

  const toggleActions = () => {
    setShowActions(!showActions)
  }

  const handleDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()

    // For specific card types, dispatch custom event to let the card handle its own drill down
    if (
      card.type === "enhanced-hbi-insights" ||
      card.type === "health" ||
      card.type === "startup" ||
      card.type === "schedule-monitor" ||
      card.type === "change-order-analysis" ||
      card.type === "closeout" ||
      card.type === "bd-opportunities" ||
      card.type === "market-intelligence" ||
      card.type === "portfolio-overview" ||
      card.type === "financial-review-panel" ||
      card.type === "staffing-distribution" ||
      card.type === "pipeline-analytics"
    ) {
      const newState = !isDrillDownActive
      setIsDrillDownActive(newState)

      const event = new CustomEvent("cardDrillDown", {
        detail: {
          cardId: card.id,
          cardType: card.type,
          action: newState ? "show" : "hide",
        },
      })
      window.dispatchEvent(event)
      return
    }

    if (onDrillDown) {
      onDrillDown(card.id, card.type)
    } else {
      setShowDrillDown(true)
    }
  }

  // Listen for drill down state changes from the card itself
  React.useEffect(() => {
    const handleDrillDownStateChange = (event: CustomEvent) => {
      if (event.detail.cardId === card.id && event.detail.cardType === card.type) {
        setIsDrillDownActive(event.detail.isActive)
      }
    }

    window.addEventListener("cardDrillDownStateChange", handleDrillDownStateChange as EventListener)

    return () => {
      window.removeEventListener("cardDrillDownStateChange", handleDrillDownStateChange as EventListener)
    }
  }, [card.id, card.type])

  return (
    <div
      className={cn(
        // Enhanced base structure with better borders
        "group relative rounded-xl transition-all duration-300 ease-out",
        // Enhanced background with better contrast
        `bg-gradient-to-br ${theme.gradient}`,
        // Better border contrast for both light and dark modes
        `border-2 ${theme.border}`,
        // Enhanced shadows with better depth - removed hover shadow changes
        `shadow-lg ${theme.shadow}`,
        // More pronounced category accent
        theme.accent,
        // Removed hover scale effects to prevent scroll interference
        // Enhanced edit mode styling
        isEditing && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background/50",
        // Better focus states
        "focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2",
        // Improved sizing
        isCompact ? "min-h-[280px]" : "min-h-[320px]",
        dragHandleClass,
        // Only show pointer cursor when not in editing mode
        !isEditing && "cursor-pointer"
      )}
      onClick={(e) => {
        // Only toggle actions when not in editing mode
        if (!isEditing) {
          // Check if clicking on interactive elements
          const target = e.target as HTMLElement
          if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest('[role="button"]') ||
            target.closest("[data-dropdown-trigger]")
          ) {
            return
          }
          toggleActions()
        }
      }}
    >
      {/* Card Header with Title and Drill Down Button */}
      <div className="absolute top-4 left-4 right-16 z-20">
        <div className="flex items-center gap-2 mb-1">
          {/* Card Icon */}
          {getCardIcon(card.type)}
          {/* Card Title */}
          <h3 className="text-sm font-semibold text-foreground truncate">
            {card.title || card.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </h3>
        </div>
        {/* Drill Down Button - closer to title */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs hover:bg-transparent z-[70]"
          onClick={handleDrillDown}
        >
          <span className="mr-1">
            {(card.type === "enhanced-hbi-insights" ||
              card.type === "health" ||
              card.type === "startup" ||
              card.type === "schedule-monitor" ||
              card.type === "change-order-analysis" ||
              card.type === "closeout" ||
              card.type === "field-reports" ||
              card.type === "critical-dates" ||
              card.type === "safety" ||
              card.type === "quality-control" ||
              card.type === "rfi" ||
              card.type === "submittal" ||
              card.type === "bd-opportunities" ||
              card.type === "market-intelligence" ||
              card.type === "portfolio-overview" ||
              card.type === "financial-review-panel" ||
              card.type === "staffing-distribution" ||
              card.type === "pipeline-analytics") &&
            isDrillDownActive
              ? "Hide Drill Down"
              : card.type === "enhanced-hbi-insights"
              ? "View HBI Insights"
              : card.type === "health"
              ? "View Health Details"
              : card.type === "startup"
              ? "View Startup Details"
              : card.type === "schedule-monitor"
              ? "View Schedule Details"
              : card.type === "change-order-analysis"
              ? "View Change Order Details"
              : card.type === "closeout"
              ? "View Closeout Details"
              : card.type === "field-reports"
              ? "View Field Reports Details"
              : card.type === "critical-dates"
              ? "View Critical Dates Details"
              : card.type === "safety"
              ? "View Safety Details"
              : card.type === "quality-control"
              ? "View Quality Control Details"
              : card.type === "rfi"
              ? "View RFI Details"
              : card.type === "submittal"
              ? "View Submittal Details"
              : card.type === "bd-opportunities"
              ? "View BD Opportunities Details"
              : card.type === "market-intelligence"
              ? "View Market Intelligence Details"
              : card.type === "portfolio-overview"
              ? "View Portfolio Details"
              : card.type === "financial-review-panel"
              ? "View Financial Review Details"
              : card.type === "staffing-distribution"
              ? "View Staffing Details"
              : card.type === "pipeline-analytics"
              ? "View Pipeline Details"
              : "View Details"}
          </span>
          <ChevronRight className="h-3 w-3" style={{ color: "#FA4616" }} />
        </Button>
      </div>

      {/* Drill Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center p-6">
            <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
              {React.cloneElement(getCardIcon(card.type), { className: "h-12 w-12", style: { color: "#FA4616" } })}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {card.title || card.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Details
            </h3>
            <p className="text-gray-300 mb-6">Detailed analytics and insights would appear here</p>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation()
                setShowDrillDown(false)
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Card Controls Overlay - always visible in edit mode */}
      {isEditing && (
        <div className="absolute -top-2 -right-2 z-20 flex gap-1 transition-all duration-200 opacity-100 scale-100">
          <Button
            size="sm"
            variant="secondary"
            className="h-6 w-6 p-0 bg-background/95 backdrop-blur-sm shadow-lg border-2 border-border/60 hover:bg-accent/80"
            onClick={(e) => {
              e.stopPropagation()
              onConfigure?.(card.id)
            }}
          >
            <Settings2 className="h-3 w-3 text-foreground" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0 bg-destructive/95 backdrop-blur-sm shadow-lg hover:bg-destructive/80"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.(card.id)
            }}
          >
            <X className="h-3 w-3 text-destructive-foreground" />
          </Button>
        </div>
      )}

      {/* Enhanced Drag Handle - always visible in edit mode */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 transition-all duration-200 cursor-move opacity-100">
          <div className="p-1 rounded bg-background/60 backdrop-blur-sm border border-border/40">
            <Move className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Enhanced Card Actions Menu - show/hide on click */}
      {!isEditing && (
        <div
          className={cn(
            "absolute top-3 right-3 z-10 transition-all duration-200",
            showActions ? "opacity-100" : "opacity-60"
          )}
        >
          <DropdownMenu open={showActions} onOpenChange={setShowActions}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 bg-gray-100 dark:bg-gray-700 backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(!showActions)
                }}
              >
                <MoreVertical className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={4}
              alignOffset={-8}
              className="w-52 max-h-[400px] overflow-y-auto bg-popover/95 backdrop-blur-sm border-2 border-border/50 scrollbar-thin"
              avoidCollisions={true}
              collisionPadding={16}
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                  setShowActions(false)
                }}
                className="text-foreground hover:bg-accent/80"
              >
                {isExpanded ? (
                  <>
                    <Minimize2 className="h-3 w-3 mr-2" />
                    Minimize
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3 w-3 mr-2" />
                    Focus
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onConfigure?.(card.id)
                  setShowActions(false)
                }}
                className="text-foreground hover:bg-accent/80"
              >
                <Settings2 className="h-3 w-3 mr-2" />
                Configure
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Smart Size Presets */}
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-2 py-1.5 sticky top-0 bg-popover/95 z-10">
                Card Size {SMART_PRESETS.length > 6 && <span className="text-xs opacity-60">(Scroll for more)</span>}
              </DropdownMenuLabel>

              {/* Scrollable sizing options container */}
              <div className="relative">
                <div className="max-h-72 overflow-y-auto scrollbar-thin">
                  {/* Show recommended preset first */}
                  {(() => {
                    const recommendedPreset = getRecommendedPreset(card.type)
                    const preset = SMART_PRESETS.find((p) => p.value === recommendedPreset)

                    if (preset && preset.value !== card.size) {
                      return (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onSizeChange?.(card.id, preset.value)
                              setShowActions(false)
                            }}
                            className="text-foreground hover:bg-accent/80 px-2 py-1.5 border-l-2 border-blue-500/30"
                          >
                            <div className="flex items-center w-full">
                              <span className="mr-2 text-blue-500">{preset.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm flex items-center gap-2">
                                  {preset.label}
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                    Recommended
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">{preset.description}</div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )
                    }
                    return null
                  })()}

                  {/* Smart Presets */}
                  {SMART_PRESETS.map((preset, index) => (
                    <DropdownMenuItem
                      key={preset.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (preset.value === "custom") {
                          console.log("🎛️ Custom size option selected")
                          setShowGridSelector(true)
                          setShowActions(false)
                        } else {
                          console.log("📋 Preset size selected:", preset.value)
                          onSizeChange?.(card.id, preset.value)
                          setShowActions(false)
                        }
                      }}
                      className={cn(
                        "text-foreground hover:bg-accent/80 px-2 py-1.5",
                        card.size === preset.value && "bg-accent text-accent-foreground",
                        preset.value === "custom" && "border-t border-border/30 mt-1" // Visual separator for custom option
                      )}
                    >
                      <div className="flex items-center w-full">
                        <span className="mr-2">{preset.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{preset.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {preset.value === "custom"
                              ? preset.description
                              : `${preset.description} (${preset.cols}×${preset.rows})`}
                          </div>
                        </div>
                        {card.size === preset.value && (
                          <div className="w-2 h-2 rounded-full bg-primary ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>

                {/* Fade indicator for more content */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-popover/95 to-transparent pointer-events-none" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Enhanced content wrapper */}
      <div
        className={cn(
          "relative h-full rounded-xl overflow-hidden pt-16", // Added top padding for header
          // Enhanced expanded state
          isExpanded && "fixed inset-4 z-50 bg-background/98 backdrop-blur-lg shadow-2xl border-2 border-border/50"
        )}
      >
        {children}
      </div>

      {/* Category indicator */}
      <div className="absolute bottom-2 left-2 z-10">
        <div
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            "bg-background/60 text-foreground/70 border border-border/40"
          )}
        >
          {category}
        </div>
      </div>

      {/* Loading shimmer effect for empty states */}
      {card.type === "placeholder" && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}

      {/* Custom Grid Selector Overlay */}
      {showGridSelector && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowGridSelector(false)} />
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-background border border-border rounded-lg shadow-xl max-w-lg w-full mx-4"
            onClick={(e) => {
              e.stopPropagation() // Prevent bubbling to card focus handler
              e.preventDefault()
            }}
          >
            <GridSelector
              currentCols={getCurrentDimensions().cols}
              currentRows={getCurrentDimensions().rows}
              onSizeChange={(cols, rows) => {
                // Create a custom size identifier
                const customSize = `custom-${cols}x${rows}`
                console.log("🎯 GridSelector onSizeChange triggered:", { cols, rows, customSize, cardId: card.id })
                console.log("🔗 onSizeChange prop exists:", !!onSizeChange)
                onSizeChange?.(card.id, customSize)
                console.log("✅ onSizeChange called successfully")
              }}
              onClose={() => setShowGridSelector(false)}
            />
          </div>
        </>
      )}
    </div>
  )
}
