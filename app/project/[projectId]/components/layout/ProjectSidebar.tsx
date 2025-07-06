/**
 * @fileoverview Project Sidebar component
 * @module ProjectSidebar
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Sidebar component for the project control center with navigation,
 * quick actions, recent activity, and responsive collapsible design.
 *
 * @example
 * ```tsx
 * <ProjectSidebar
 *   config={sidebarConfig}
 *   navigation={navigation}
 *   userRole="project-manager"
 *   quickActions={quickActions}
 *   recentActivity={recentActivity}
 *   onStateChange={(state) => console.log('Sidebar state:', state)}
 *   onQuickAction={(actionId) => console.log('Quick action:', actionId)}
 * />
 * ```
 */

"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ProjectSidebarProps, QuickAction, ActivityItem } from "../../types/layout"
import { useLayout } from "../../hooks/useLayout"
import { useNavigation } from "../../hooks/useNavigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  User,
  Zap,
  Activity,
  TrendingUp,
  Star,
  Bookmark,
} from "lucide-react"
import { DEFAULT_QUICK_ACTIONS } from "../../constants/layout"

/**
 * Project Sidebar component
 */
export function ProjectSidebar({
  config,
  navigation,
  userRole,
  quickActions = DEFAULT_QUICK_ACTIONS,
  recentActivity = [],
  onStateChange,
  onQuickAction,
  className,
}: ProjectSidebarProps) {
  const { state: layoutState, responsive } = useLayout()
  const navigationHook = useNavigation?.() || null

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    navigation: false,
    quickActions: false,
    recentActivity: false,
  })

  // Sidebar state
  const isVisible = config?.visible ?? layoutState.config.sidebar.visible
  const sidebarState = config?.state ?? layoutState.config.sidebar.state
  const sidebarWidth = config?.width ?? layoutState.config.sidebar.width
  const isCollapsed = sidebarState === "collapsed"
  const isOverlay = sidebarState === "overlay"
  const isExpanded = sidebarState === "expanded"

  // Handle section collapse
  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Filter quick actions based on user role
  const filteredQuickActions = quickActions.filter((action) => {
    if (!action.requiredPermissions || !userRole) return true
    return action.requiredPermissions.includes(userRole)
  })

  // Group quick actions by category
  const groupedActions = filteredQuickActions.reduce((acc, action) => {
    const category = action.category || "general"
    if (!acc[category]) acc[category] = []
    acc[category].push(action)
    return acc
  }, {} as Record<string, QuickAction[]>)

  // Get activity icon
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "update":
        return TrendingUp
      case "approval":
        return CheckCircle
      case "milestone":
        return Star
      case "alert":
        return AlertTriangle
      case "completion":
        return CheckCircle
      default:
        return Activity
    }
  }

  // Format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Sidebar classes
  const sidebarClasses = cn(
    "hb-project-sidebar",
    "bg-background",
    "border-r",
    "border-border",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "flex",
    "flex-col",
    "h-full",
    {
      "w-16": isCollapsed,
      "w-64": isExpanded && !isOverlay,
      "w-72": isOverlay,
      "fixed left-0 top-16 bottom-0 z-20 shadow-lg": isOverlay,
      relative: !isOverlay,
      "transform translate-x-0": isVisible,
      "transform -translate-x-full": !isVisible && isOverlay,
    },
    className
  )

  const contentClasses = cn("flex-1", "overflow-hidden", {
    "px-2": isCollapsed,
    "px-4": !isCollapsed,
  })

  return (
    <TooltipProvider>
      <aside className={sidebarClasses} style={{ width: isCollapsed ? 64 : sidebarWidth }} id="sidebar-navigation">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm">HB Intel</div>
                <div className="text-xs text-muted-foreground">Project Control</div>
              </div>
            </div>
          )}

          {/* Collapse toggle */}
          {!isOverlay && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStateChange?.(isCollapsed ? "expanded" : "collapsed")}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Sidebar content */}
        <ScrollArea className="flex-1">
          <div className="py-4 space-y-4">
            {/* Navigation Section */}
            {navigationHook && (
              <div className="space-y-2">
                {!isCollapsed ? (
                  <Collapsible open={!collapsedSections.navigation} onOpenChange={() => toggleSection("navigation")}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between px-4 py-2 h-auto">
                        <span className="font-medium text-sm">Navigation</span>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", collapsedSections.navigation && "rotate-180")}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 px-2">
                      {/* Navigation items would go here */}
                      <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Reports
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Financial
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full h-10 p-0">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full h-10 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Reports</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full h-10 p-0">
                          <DollarSign className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Financial</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Quick Actions Section */}
            {config?.showQuickActions && (
              <div className="space-y-2">
                {!isCollapsed ? (
                  <Collapsible
                    open={!collapsedSections.quickActions}
                    onOpenChange={() => toggleSection("quickActions")}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between px-4 py-2 h-auto">
                        <span className="font-medium text-sm">Quick Actions</span>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", collapsedSections.quickActions && "rotate-180")}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 px-2">
                      {Object.entries(groupedActions).map(([category, actions]) => (
                        <div key={category} className="space-y-1">
                          {category !== "general" && (
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1">
                              {category}
                            </div>
                          )}
                          {actions.map((action) => (
                            <Button
                              key={action.id}
                              variant="ghost"
                              size="sm"
                              onClick={() => onQuickAction?.(action.id)}
                              disabled={!action.enabled}
                              className="w-full justify-start px-2 py-1 h-auto"
                              title={action.description}
                            >
                              <action.icon className="mr-2 h-4 w-4" />
                              <div className="flex-1 text-left">
                                <div className="text-sm">{action.label}</div>
                                {action.shortcut && (
                                  <div className="text-xs text-muted-foreground">{action.shortcut}</div>
                                )}
                              </div>
                            </Button>
                          ))}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <div className="space-y-1">
                    {filteredQuickActions.slice(0, 4).map((action) => (
                      <Tooltip key={action.id}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onQuickAction?.(action.id)}
                            disabled={!action.enabled}
                            className="w-full h-10 p-0"
                          >
                            <action.icon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div>
                            <div className="font-medium">{action.label}</div>
                            {action.description && (
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Recent Activity Section */}
            {config?.showRecentActivity && recentActivity.length > 0 && (
              <div className="space-y-2">
                {!isCollapsed ? (
                  <Collapsible
                    open={!collapsedSections.recentActivity}
                    onOpenChange={() => toggleSection("recentActivity")}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between px-4 py-2 h-auto">
                        <span className="font-medium text-sm">Recent Activity</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            collapsedSections.recentActivity && "rotate-180"
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 px-2">
                      {recentActivity.slice(0, 5).map((activity) => {
                        const IconComponent = getActivityIcon(activity.type)
                        return (
                          <div
                            key={activity.id}
                            className={cn(
                              "p-2 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50",
                              !activity.read && "bg-blue-50 border-blue-200"
                            )}
                            onClick={activity.onClick}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={cn(
                                  "p-1 rounded-full",
                                  activity.color === "green" && "bg-green-100 text-green-600",
                                  activity.color === "yellow" && "bg-yellow-100 text-yellow-600",
                                  activity.color === "red" && "bg-red-100 text-red-600",
                                  activity.color === "blue" && "bg-blue-100 text-blue-600",
                                  !activity.color && "bg-gray-100 text-gray-600"
                                )}
                              >
                                <IconComponent className="h-3 w-3" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{activity.title}</div>
                                <div className="text-xs text-muted-foreground truncate">{activity.description}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {formatTimeAgo(activity.timestamp)}
                                </div>
                              </div>
                              {!activity.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />}
                            </div>
                          </div>
                        )
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <div className="space-y-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full h-10 p-0 relative">
                          <Bell className="h-4 w-4" />
                          {recentActivity.some((a) => !a.read) && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{recentActivity.length} recent activities</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <div className="text-xs text-muted-foreground text-center">HB Intel v2.2.0</div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="w-full h-10 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default ProjectSidebar
