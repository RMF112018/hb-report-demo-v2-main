'use client'

import { cn } from '@/lib/utils'
import { X, Move, Settings2, MoreVertical, Maximize2, Minimize2, ChevronRight, TrendingUp, Briefcase, Brain, BarChart3, Target, Building2, Calendar, DollarSign, Wrench, Shield, Droplets, Package, Eye, AlertTriangle as AlertTriangleIcon, Users, FileText, ClipboardCheck, Play, CalendarDays, MessageSquare, Heart } from 'lucide-react'
import { DashboardCard } from '@/types/dashboard'
import React, { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface DashboardCardWrapperProps {
  card: DashboardCard
  children: ReactNode
  onRemove?: (id: string) => void
  onConfigure?: (id: string) => void
  onDrillDown?: (id: string, cardType: string) => void
  dragHandleClass?: string
  isEditing?: boolean
  isCompact?: boolean
}

// Define card categories for theming
const getCardCategory = (cardType: string): 'financial' | 'operational' | 'analytics' | 'project' | 'schedule' => {
  const financialCards = ['financial-status', 'cash-flow', 'financial-review-panel', 'procurement', 'draw-forecast', 'contingency-analysis']
  const operationalCards = ['safety', 'quality-control', 'field-reports', 'staffing-distribution']
  const analyticsCards = ['enhanced-hbi-insights', 'pipeline-analytics', 'market-intelligence']
  const projectCards = ['project-overview', 'portfolio-overview', 'bd-opportunities']
  const scheduleCards = ['schedule-performance', 'schedule-monitor', 'critical-dates']
  
  if (financialCards.includes(cardType)) return 'financial'
  if (operationalCards.includes(cardType)) return 'operational'  
  if (analyticsCards.includes(cardType)) return 'analytics'
  if (projectCards.includes(cardType)) return 'project'
  if (scheduleCards.includes(cardType)) return 'schedule'
  
  return 'project' // default
}

const getCategoryTheme = (category: 'financial' | 'operational' | 'analytics' | 'project' | 'schedule') => {
  const themes = {
    financial: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none"
    },
    operational: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none"
    },
    analytics: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none"
    },
    project: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none"
    },
    schedule: {
      gradient: "from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700",
      border: "border-gray-200 dark:border-gray-600",
      shadow: "shadow-gray-200/20 dark:shadow-gray-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-gray-300 dark:before:border-gray-500 before:pointer-events-none"
    }
  }
  
  return themes[category] || themes.project
}

// Get card-specific icon
const getCardIcon = (cardType: string) => {
  switch (cardType) {
    case "portfolio-overview":
      return <Briefcase className="h-4 w-4" style={{color: '#FA4616'}} />
    case "enhanced-hbi-insights":
      return <Brain className="h-4 w-4" style={{color: '#FA4616'}} />
    case "financial-review-panel":
      return <BarChart3 className="h-4 w-4" style={{color: '#FA4616'}} />
    case "pipeline-analytics":
      return <Target className="h-4 w-4" style={{color: '#FA4616'}} />
    case "market-intelligence":
      return <TrendingUp className="h-4 w-4" style={{color: '#FA4616'}} />
    case "project-overview":
      return <Building2 className="h-4 w-4" style={{color: '#FA4616'}} />
    case "schedule-performance":
      return <Calendar className="h-4 w-4" style={{color: '#FA4616'}} />
    case "financial-status":
      return <DollarSign className="h-4 w-4" style={{color: '#FA4616'}} />
    case "general-conditions":
      return <Wrench className="h-4 w-4" style={{color: '#FA4616'}} />
    case "contingency-analysis":
      return <Shield className="h-4 w-4" style={{color: '#FA4616'}} />
    case "cash-flow":
      return <Droplets className="h-4 w-4" style={{color: '#FA4616'}} />
    case "procurement":
      return <Package className="h-4 w-4" style={{color: '#FA4616'}} />
    case "draw-forecast":
      return <BarChart3 className="h-4 w-4" style={{color: '#FA4616'}} />
    case "quality-control":
      return <Eye className="h-4 w-4" style={{color: '#FA4616'}} />
    case "safety":
      return <AlertTriangleIcon className="h-4 w-4" style={{color: '#FA4616'}} />
    case "staffing-distribution":
      return <Users className="h-4 w-4" style={{color: '#FA4616'}} />
    case "change-order-analysis":
      return <FileText className="h-4 w-4" style={{color: '#FA4616'}} />
    case "closeout":
      return <ClipboardCheck className="h-4 w-4" style={{color: '#FA4616'}} />
    case "startup":
      return <Play className="h-4 w-4" style={{color: '#FA4616'}} />
    case "critical-dates":
      return <CalendarDays className="h-4 w-4" style={{color: '#FA4616'}} />
    case "field-reports":
      return <FileText className="h-4 w-4" style={{color: '#FA4616'}} />
    case "rfi":
      return <MessageSquare className="h-4 w-4" style={{color: '#FA4616'}} />
    case "submittal":
      return <FileText className="h-4 w-4" style={{color: '#FA4616'}} />
    case "health":
      return <Heart className="h-4 w-4" style={{color: '#FA4616'}} />
    case "schedule-monitor":
      return <Calendar className="h-4 w-4" style={{color: '#FA4616'}} />
    case "bd-opportunities":
      return <Building2 className="h-4 w-4" style={{color: '#FA4616'}} />
    default:
      return <TrendingUp className="h-4 w-4" style={{color: '#FA4616'}} />
  }
}

export const DashboardCardWrapper = ({
  card,
  children,
  onRemove,
  onConfigure,
  onDrillDown,
  dragHandleClass,
  isEditing = false,
  isCompact = false
}: DashboardCardWrapperProps) => {
  const [showActions, setShowActions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDrillDown, setShowDrillDown] = useState(false)
  const [isDrillDownActive, setIsDrillDownActive] = useState(false)
  
  const category = getCardCategory(card.type)
  const theme = getCategoryTheme(category)
  
  const toggleActions = () => {
    setShowActions(!showActions)
  }

  const handleDrillDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // For specific card types, dispatch custom event to let the card handle its own drill down
    if (card.type === 'enhanced-hbi-insights' || card.type === 'health' || card.type === 'startup' || card.type === 'schedule-monitor' || card.type === 'change-order-analysis' || card.type === 'closeout' || card.type === 'bd-opportunities') {
      const newState = !isDrillDownActive
      setIsDrillDownActive(newState)
      
      const event = new CustomEvent('cardDrillDown', { 
        detail: { 
          cardId: card.id, 
          cardType: card.type,
          action: newState ? 'show' : 'hide'
        } 
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

    window.addEventListener('cardDrillDownStateChange', handleDrillDownStateChange as EventListener)
    
    return () => {
      window.removeEventListener('cardDrillDownStateChange', handleDrillDownStateChange as EventListener)
    }
  }, [card.id, card.type])
  
  return (
    <div
      className={cn(
        // Enhanced base structure with better borders
        "group relative rounded-xl transition-all duration-300 ease-out cursor-pointer",
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
        dragHandleClass
      )}
      onClick={toggleActions}
    >
      {/* Card Header with Title and Drill Down Button */}
      <div className="absolute top-4 left-4 right-16 z-20">
        <div className="flex items-center gap-2 mb-1">
          {/* Card Icon */}
          {getCardIcon(card.type)}
          {/* Card Title */}
          <h3 className="text-sm font-semibold text-foreground truncate">
            {card.title || card.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                  {(card.type === 'enhanced-hbi-insights' || card.type === 'health' || card.type === 'startup' || card.type === 'schedule-monitor' || card.type === 'change-order-analysis' || card.type === 'closeout' || card.type === 'field-reports' || card.type === 'critical-dates' || card.type === 'safety' || card.type === 'quality-control' || card.type === 'rfi' || card.type === 'submittal' || card.type === 'bd-opportunities') && isDrillDownActive ? 'Hide Drill Down' : 
                   card.type === 'enhanced-hbi-insights' ? 'View HBI Insights' :
                   card.type === 'health' ? 'View Health Details' :
                   card.type === 'startup' ? 'View Startup Details' :
                   card.type === 'schedule-monitor' ? 'View Schedule Details' :
                   card.type === 'change-order-analysis' ? 'View Change Order Details' :
                   card.type === 'closeout' ? 'View Closeout Details' :
                   card.type === 'field-reports' ? 'View Field Reports Details' :
                   card.type === 'critical-dates' ? 'View Critical Dates Details' :
                   card.type === 'safety' ? 'View Safety Details' :
                   card.type === 'quality-control' ? 'View Quality Control Details' :
                   card.type === 'rfi' ? 'View RFI Details' :
                   card.type === 'submittal' ? 'View Submittal Details' :
                   card.type === 'bd-opportunities' ? 'View BD Opportunities Details' :
                   'View Details'}
          </span>
          <ChevronRight className="h-3 w-3" style={{ color: '#FA4616' }} />
        </Button>
      </div>

      {/* Drill Down Overlay */}
      {showDrillDown && (
        <div className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center p-6">
            <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center">
              {React.cloneElement(getCardIcon(card.type), { className: "h-12 w-12", style: { color: '#FA4616' } })}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {card.title || card.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Details
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
        <div className={cn(
          "absolute top-3 right-3 z-10 transition-all duration-200",
          showActions ? "opacity-100" : "opacity-60"
        )}>
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
            <DropdownMenuContent align="end" className="w-40 bg-popover/95 backdrop-blur-sm border-2 border-border/50">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Enhanced content wrapper */}
      <div className={cn(
        "relative h-full rounded-xl overflow-hidden pt-16", // Added top padding for header
        // Enhanced expanded state
        isExpanded && "fixed inset-4 z-50 bg-background/98 backdrop-blur-lg shadow-2xl border-2 border-border/50"
      )}>
        {children}
      </div>
      
      {/* Category indicator */}
      <div className="absolute bottom-2 left-2 z-10">
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
          "bg-background/60 text-foreground/70 border border-border/40"
        )}>
          {category}
        </div>
      </div>
      
      {/* Loading shimmer effect for empty states */}
      {card.type === 'placeholder' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}
    </div>
  )
}
