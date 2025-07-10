/**
 * @fileoverview Project Footer component
 * @module ProjectFooter
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Footer component for the project control center with project status,
 * quick stats, user info, and responsive design.
 *
 * @example
 * ```tsx
 * <ProjectFooter
 *   config={footerConfig}
 *   project={{ name: 'Project Alpha', status: 'on-track', progress: 75 }}
 *   stats={{ budget: '$2.5M', timeline: '12 months', team: 15 }}
 *   userRole="project-manager"
 *   onAction={(actionId) => console.log('Footer action:', actionId)}
 * />
 * ```
 */

"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { ProjectFooterProps } from "../../types/layout"
import { useLayout } from "../../hooks/useLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Settings,
  RefreshCw,
  Zap,
  Wifi,
  WifiOff,
} from "lucide-react"

/**
 * Project Footer component
 */
export function ProjectFooter({ config, project, stats, userRole, onAction, className }: ProjectFooterProps) {
  const { state: layoutState, responsive } = useLayout()

  // Footer configuration
  const footerHeight = config?.height || 56
  const showStats = config?.showStats ?? true
  const showStatus = config?.showStatus ?? true
  const showUserInfo = config?.showUserInfo ?? true
  const fixed = config?.fixed ?? false
  const compact = config?.compact ?? false

  // Connection status (mock for now)
  const [isOnline, setIsOnline] = React.useState(true)

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return { icon: CheckCircle2, color: "text-green-600" }
      case "at-risk":
        return { icon: AlertTriangle, color: "text-yellow-600" }
      case "delayed":
        return { icon: AlertTriangle, color: "text-red-600" }
      case "completed":
        return { icon: CheckCircle2, color: "text-blue-600" }
      default:
        return { icon: Minus, color: "text-gray-600" }
    }
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "on-track":
        return "default"
      case "at-risk":
        return "secondary"
      case "delayed":
        return "destructive"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
    }).format(amount)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return TrendingUp
      case "down":
        return TrendingDown
      default:
        return Minus
    }
  }

  // Footer classes
  const footerClasses = cn(
    "hb-project-footer",
    "bg-background",
    "border-t",
    "border-border",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "z-20",
    fixed && "fixed bottom-0 left-0 right-0",
    !fixed && "relative",
    compact && "px-2",
    !compact && "px-4",
    compact && "py-1",
    !compact && "py-2",
    className
  )

  const contentClasses = cn(
    "flex",
    "items-center",
    "justify-between",
    "h-full",
    "max-w-full",
    "overflow-hidden",
    compact && "text-xs",
    !compact && "text-sm"
  )

  return (
    <TooltipProvider>
      <footer className={footerClasses} style={{ height: footerHeight }}>
        <div className={contentClasses}>
          {/* Left section - Project status */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showStatus && project && (
              <div className="flex items-center gap-2">
                {/* Status indicator */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const { icon: StatusIcon, color } = getStatusIcon(project.status)
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn("flex items-center gap-1", color)}>
                            <StatusIcon className="h-4 w-4" />
                            <Badge variant={getStatusBadgeVariant(project.status)} className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Project Status: {project.status}</TooltipContent>
                      </Tooltip>
                    )
                  })()}
                </div>

                {/* Project name (mobile hidden) */}
                {!compact && (
                  <div className="hidden sm:block truncate">
                    <span className="font-medium text-xs">{project.name}</span>
                  </div>
                )}

                {/* Progress */}
                {typeof project.progress === "number" && (
                  <div className="flex items-center gap-1">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{formatPercentage(project.progress)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Connection status */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn("flex items-center", isOnline ? "text-green-600" : "text-red-600")}>
                    {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isOnline ? "Connected" : "Disconnected"}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Center section - Quick stats */}
          {showStats && stats && !responsive.is("xs") && (
            <div className="flex items-center gap-4 px-4">
              <Separator orientation="vertical" className="h-6" />

              {/* Budget */}
              {stats.budget && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium">
                        {typeof stats.budget === "number" ? formatCurrency(stats.budget) : stats.budget}
                      </span>
                      {stats.budgetTrend &&
                        (() => {
                          const TrendIcon = getTrendIcon(stats.budgetTrend)
                          return (
                            <TrendIcon
                              className={cn(
                                "h-3 w-3",
                                stats.budgetTrend === "up"
                                  ? "text-green-600"
                                  : stats.budgetTrend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              )}
                            />
                          )
                        })()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Budget: {typeof stats.budget === "number" ? formatCurrency(stats.budget) : stats.budget}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Timeline */}
              {stats.timeline && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium">{stats.timeline}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Timeline: {stats.timeline}</TooltipContent>
                </Tooltip>
              )}

              {/* Team size */}
              {stats.team && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-purple-600" />
                      <span className="text-xs font-medium">
                        {typeof stats.team === "number" ? stats.team : stats.team}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Team: {typeof stats.team === "number" ? `${stats.team} members` : stats.team}
                  </TooltipContent>
                </Tooltip>
              )}

              <Separator orientation="vertical" className="h-6" />
            </div>
          )}

          {/* Right section - User info and actions */}
          <div className="flex items-center gap-2 justify-end">
            {/* Quick actions */}
            {!compact && (
              <div className="hidden md:flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onAction?.("refresh")} className="h-6 w-6 p-0">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => onAction?.("settings")} className="h-6 w-6 p-0">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* User info */}
            {showUserInfo && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">{userRole?.replace("-", " ")}</div>
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Activity className="h-3 w-3 text-primary" />
                </div>
              </div>
            )}

            {/* Last updated */}
            <div className="text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Last updated: {new Date().toLocaleString()}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </footer>
    </TooltipProvider>
  )
}

export default ProjectFooter
