'use client'

import { cn } from '@/lib/utils'
import { X, Move, Settings2, MoreVertical, Maximize2, Minimize2 } from 'lucide-react'
import { DashboardCard } from '@/types/dashboard'
import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface DashboardCardWrapperProps {
  card: DashboardCard
  children: ReactNode
  onRemove?: (id: string) => void
  onConfigure?: (id: string) => void
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
      gradient: "from-green-50/90 to-emerald-50/90 dark:from-green-950/50 dark:to-emerald-950/50",
      border: "border-green-200/60 dark:border-green-700/60",
      shadow: "shadow-green-200/20 dark:shadow-green-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-green-500/50 dark:before:border-green-400/50 before:pointer-events-none"
    },
    operational: {
      gradient: "from-orange-50/90 to-red-50/90 dark:from-orange-950/50 dark:to-red-950/50",
      border: "border-orange-200/60 dark:border-orange-700/60",
      shadow: "shadow-orange-200/20 dark:shadow-orange-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-orange-500/50 dark:before:border-orange-400/50 before:pointer-events-none"
    },
    analytics: {
      gradient: "from-purple-50/90 to-indigo-50/90 dark:from-purple-950/50 dark:to-indigo-950/50",
      border: "border-purple-200/60 dark:border-purple-700/60",
      shadow: "shadow-purple-200/20 dark:shadow-purple-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-purple-500/50 dark:before:border-purple-400/50 before:pointer-events-none"
    },
    project: {
      gradient: "from-blue-50/90 to-cyan-50/90 dark:from-blue-950/50 dark:to-cyan-950/50",
      border: "border-blue-200/60 dark:border-blue-700/60",
      shadow: "shadow-blue-200/20 dark:shadow-blue-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-blue-500/50 dark:before:border-blue-400/50 before:pointer-events-none"
    },
    schedule: {
      gradient: "from-amber-50/90 to-yellow-50/90 dark:from-amber-950/50 dark:to-yellow-950/50",
      border: "border-amber-200/60 dark:border-amber-700/60",
      shadow: "shadow-amber-200/20 dark:shadow-amber-900/30",
      accent: "before:absolute before:inset-0 before:rounded-xl before:border-l-4 before:border-amber-500/50 dark:before:border-amber-400/50 before:pointer-events-none"
    }
  }
  
  return themes[category] || themes.project
}

export const DashboardCardWrapper = ({
  card,
  children,
  onRemove,
  onConfigure,
  dragHandleClass,
  isEditing = false,
  isCompact = false
}: DashboardCardWrapperProps) => {
  const [showActions, setShowActions] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const category = getCardCategory(card.type)
  const theme = getCategoryTheme(category)
  
  const toggleActions = () => {
    setShowActions(!showActions)
  }
  
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
                className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90 border border-border/30"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(!showActions)
                }}
              >
                <MoreVertical className="h-3 w-3 text-foreground" />
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
        "relative h-full rounded-xl overflow-hidden",
        // Better inner depth
        "shadow-inner shadow-black/5 dark:shadow-white/5",
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
