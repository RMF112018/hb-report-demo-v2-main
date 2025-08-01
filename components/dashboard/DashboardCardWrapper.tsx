"use client"

import { cn } from "@/lib/utils"
import {
  X,
  Move,
  Settings2,
  MoreVertical,
  Eye,
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
  AlertTriangle as AlertTriangleIcon,
  Users,
  FileText,
  ClipboardCheck,
  Play,
  CalendarDays,
  MessageSquare,
  Heart,
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
import { ProjectDetailsOverlay } from "./ProjectDetailsOverlay"

interface DashboardCardWrapperProps {
  card: DashboardCard
  children: ReactNode
  onRemove?: (id: string) => void
  onConfigure?: (id: string) => void
  onSizeChange?: (id: string, size: string) => void
  dragHandleClass?: string
  isEditing?: boolean
  isCompact?: boolean
}

// Professional card category theming
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
  const analyticsCards = ["enhanced-hbi-insights", "pipeline-analytics", "market-intelligence", "power-bi-dashboard"]
  const projectCards = ["project-overview", "portfolio-overview", "bd-opportunities"]
  const scheduleCards = ["schedule-performance", "schedule-monitor", "critical-dates"]

  if (financialCards.includes(cardType)) return "financial"
  if (operationalCards.includes(cardType)) return "operational"
  if (analyticsCards.includes(cardType)) return "analytics"
  if (projectCards.includes(cardType)) return "project"
  if (scheduleCards.includes(cardType)) return "schedule"

  return "project" // default
}

// Enhanced category theming with HB brand colors (Blue: #0021A5, Orange: #FA4616)
const getCategoryTheme = (category: "financial" | "operational" | "analytics" | "project" | "schedule") => {
  const themes = {
    financial: {
      accent: "bg-gradient-to-r from-[#0021A5] to-[#0039B8]",
      border: "border-[#0021A5]/20 dark:border-[#0021A5]/40",
      shadow: "shadow-[#0021A5]/10 dark:shadow-[#0021A5]/20",
      icon: "text-[#0021A5] dark:text-[#4A7FD6]",
      headerBg: "bg-gradient-to-r from-[#0021A5]/5 to-transparent",
    },
    operational: {
      accent: "bg-gradient-to-r from-[#0021A5] to-[#1E40D0]",
      border: "border-[#0021A5]/20 dark:border-[#0021A5]/40",
      shadow: "shadow-[#0021A5]/10 dark:shadow-[#0021A5]/20",
      icon: "text-[#0021A5] dark:text-[#4A7FD6]",
      headerBg: "bg-gradient-to-r from-[#0021A5]/5 to-transparent",
    },
    analytics: {
      accent: "bg-gradient-to-r from-[#FA4616] to-[#FF6B3D]",
      border: "border-[#FA4616]/20 dark:border-[#FA4616]/40",
      shadow: "shadow-[#FA4616]/10 dark:shadow-[#FA4616]/20",
      icon: "text-[#FA4616] dark:text-[#FF8A67]",
      headerBg: "bg-gradient-to-r from-[#FA4616]/5 to-transparent",
    },
    project: {
      accent: "bg-gradient-to-r from-[#FA4616] to-[#FF5722]",
      border: "border-[#FA4616]/20 dark:border-[#FA4616]/40",
      shadow: "shadow-[#FA4616]/10 dark:shadow-[#FA4616]/20",
      icon: "text-[#FA4616] dark:text-[#FF8A67]",
      headerBg: "bg-gradient-to-r from-[#FA4616]/5 to-transparent",
    },
    schedule: {
      accent: "bg-gradient-to-r from-[#0021A5] to-[#0033C7]",
      border: "border-[#0021A5]/20 dark:border-[#0021A5]/40",
      shadow: "shadow-[#0021A5]/10 dark:shadow-[#0021A5]/20",
      icon: "text-[#0021A5] dark:text-[#4A7FD6]",
      headerBg: "bg-gradient-to-r from-[#0021A5]/5 to-transparent",
    },
  }

  return themes[category] || themes.project
}

// Professional card icons with HB brand color
const getCardIcon = (cardType: string) => {
  const iconClass = "h-4 w-4"
  const iconStyle = { color: "#FA4616" }

  switch (cardType) {
    case "portfolio-overview":
      return <Briefcase className={iconClass} style={iconStyle} />
    case "enhanced-hbi-insights":
      return <Brain className={iconClass} style={iconStyle} />
    case "financial-review-panel":
      return <BarChart3 className={iconClass} style={iconStyle} />
    case "pipeline-analytics":
      return <Target className={iconClass} style={iconStyle} />
    case "market-intelligence":
      return <TrendingUp className={iconClass} style={iconStyle} />
    case "project-overview":
      return <Building2 className={iconClass} style={iconStyle} />
    case "schedule-performance":
      return <Calendar className={iconClass} style={iconStyle} />
    case "financial-status":
      return <DollarSign className={iconClass} style={iconStyle} />
    case "general-conditions":
      return <Wrench className={iconClass} style={iconStyle} />
    case "contingency-analysis":
      return <Shield className={iconClass} style={iconStyle} />
    case "cash-flow":
      return <Droplets className={iconClass} style={iconStyle} />
    case "procurement":
      return <Package className={iconClass} style={iconStyle} />
    case "draw-forecast":
      return <BarChart3 className={iconClass} style={iconStyle} />
    case "quality-control":
      return <Eye className={iconClass} style={iconStyle} />
    case "safety":
      return <AlertTriangleIcon className={iconClass} style={iconStyle} />
    case "staffing-distribution":
      return <Users className={iconClass} style={iconStyle} />
    case "change-order-analysis":
      return <FileText className={iconClass} style={iconStyle} />
    case "closeout":
      return <ClipboardCheck className={iconClass} style={iconStyle} />
    case "startup":
      return <Play className={iconClass} style={iconStyle} />
    case "critical-dates":
      return <CalendarDays className={iconClass} style={iconStyle} />
    case "field-reports":
      return <FileText className={iconClass} style={iconStyle} />
    case "rfi":
      return <MessageSquare className={iconClass} style={iconStyle} />
    case "submittal":
      return <FileText className={iconClass} style={iconStyle} />
    case "health":
      return <Heart className={iconClass} style={iconStyle} />
    case "schedule-monitor":
      return <Calendar className={iconClass} style={iconStyle} />
    case "bd-opportunities":
      return <Building2 className={iconClass} style={iconStyle} />
    case "power-bi-dashboard":
      return <BarChart3 className={iconClass} style={iconStyle} />
    default:
      return <TrendingUp className={iconClass} style={iconStyle} />
  }
}

// Enhanced smart preset sizes
const SMART_PRESETS = [
  { value: "optimal", label: "Optimal", description: "Best size for 100% content", cols: 6, rows: 6, icon: "🎯" },
  { value: "compact", label: "Compact", description: "Small metrics & KPIs", cols: 3, rows: 3, icon: "📊" },
  { value: "standard", label: "Standard", description: "Most content types", cols: 4, rows: 4, icon: "📋" },
  { value: "wide", label: "Wide", description: "Tables & lists", cols: 8, rows: 4, icon: "📈" },
  { value: "tall", label: "Tall", description: "Detailed content", cols: 4, rows: 8, icon: "📝" },
  { value: "large", label: "Large", description: "Charts & analytics", cols: 6, rows: 6, icon: "📊" },
  { value: "extra-wide", label: "Extra Wide", description: "Dashboards & timelines", cols: 12, rows: 4, icon: "📊" },
  { value: "full-width", label: "Full Width", description: "Maximum width cards", cols: 20, rows: 6, icon: "🖥️" },
]

// Get optimal size for cards (optimized for 16-column executive layout)
const getOptimalSize = (cardType: string): { cols: number; rows: number } => {
  switch (cardType) {
    case "financial-review-panel":
      return { cols: 8, rows: 5 }
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
    case "power-bi-dashboard":
      return { cols: 8, rows: 6 }
    default:
      return { cols: 6, rows: 4 }
  }
}

// Professional grid selector component
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

  const handleApply = () => {
    onSizeChange(selectedCols, selectedRows)
    onClose()
  }

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Grid Size</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Columns</label>
          <input
            type="range"
            min="1"
            max="20"
            value={selectedCols}
            onChange={(e) => setSelectedCols(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">{selectedCols} columns</div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Rows</label>
          <input
            type="range"
            min="1"
            max="12"
            value={selectedRows}
            onChange={(e) => setSelectedRows(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">{selectedRows} rows</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {selectedCols}×{selectedRows} grid
        </span>
        <Button onClick={handleApply} size="sm" className="h-7 px-3 text-xs">
          Apply
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
  onSizeChange,
  dragHandleClass,
  isEditing = false,
  isCompact = false,
}: DashboardCardWrapperProps) => {
  const [showActions, setShowActions] = useState(false)
  const [showGridSelector, setShowGridSelector] = useState(false)
  const [showDetailsOverlay, setShowDetailsOverlay] = useState(false)
  const category = getCardCategory(card.type)
  const theme = getCategoryTheme(category)

  const getCurrentDimensions = () => {
    if (card.span) {
      return { cols: card.span.cols, rows: card.span.rows }
    }
    return getOptimalSize(card.type)
  }

  const toggleActions = () => {
    setShowActions(!showActions)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetailsOverlay(true)
  }

  const handleSizeChange = (cols: number, rows: number) => {
    onSizeChange?.(card.id, `custom-${cols}x${rows}`)
  }

  return (
    <>
      <div
        className={cn(
          "dashboard-card dashboard-card-wrapper",
          "relative group",
          "bg-white dark:bg-gray-800",
          "border border-gray-200 dark:border-gray-700",
          "rounded-xl shadow-sm",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-lg",
          "hover:-translate-y-1",
          theme.border,
          theme.shadow,
          isCompact && "text-sm",
          !card.visible && "opacity-50",
          dragHandleClass,
          card.type === "pipeline-analytics" && "pipeline-analytics"
        )}
        style={{
          boxShadow: `
            inset 4px 0 0 ${category === "analytics" || category === "project" ? "#FA4616" : "#0021A5"},
            0 1px 3px rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* HB Brand Accent Bar */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
            theme.accent,
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
        />

        {/* Professional Header with HB Brand Styling */}
        <div
          className={cn(
            "dashboard-card-header",
            "flex items-center justify-between",
            "px-4 py-3 border-b border-gray-100 dark:border-gray-700",
            "rounded-t-xl",
            theme.headerBg,
            "backdrop-blur-sm",
            isCompact && "px-3 py-2"
          )}
        >
          <div className="flex items-center gap-3">
            {/* Card Icon */}
            <div className="flex-shrink-0">{getCardIcon(card.type)}</div>

            {/* Card Title */}
            <h3
              className={cn(
                "dashboard-card-title",
                "font-semibold text-gray-900 dark:text-gray-100",
                "truncate",
                isCompact ? "text-sm" : "text-base"
              )}
            >
              {card.title}
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* View Details Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className={cn(
                "h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "text-gray-500 dark:text-gray-400",
                "text-xs font-medium"
              )}
              title="View project details"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>

            {/* Edit Mode Actions */}
            {isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      "text-gray-500 dark:text-gray-400"
                    )}
                    title="Card options"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Card Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {onConfigure && (
                    <DropdownMenuItem onClick={() => onConfigure(card.id)}>
                      <Settings2 className="h-4 w-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={() => setShowGridSelector(true)}>
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Resize
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {onRemove && (
                    <DropdownMenuItem onClick={() => onRemove(card.id)} className="text-red-600 dark:text-red-400">
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Drag Handle */}
            {isEditing && (
              <div
                className={cn(
                  "cursor-grab active:cursor-grabbing",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  "p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  "text-gray-400 dark:text-gray-500"
                )}
              >
                <Move className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className={cn("dashboard-card-content", "flex-1 overflow-hidden")}>{children}</div>

        {/* Grid Selector Overlay */}
        {showGridSelector && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
            <GridSelector
              currentCols={getCurrentDimensions().cols}
              currentRows={getCurrentDimensions().rows}
              onSizeChange={handleSizeChange}
              onClose={() => setShowGridSelector(false)}
            />
          </div>
        )}
      </div>

      {/* Project Details Overlay */}
      {showDetailsOverlay && (
        <ProjectDetailsOverlay
          cardId={card.id}
          cardType={card.type}
          cardTitle={card.title}
          onClose={() => setShowDetailsOverlay(false)}
        />
      )}
    </>
  )
}
