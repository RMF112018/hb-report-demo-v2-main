/**
 * @fileoverview Role-Based Dashboard Component
 * @module RoleDashboard
 * @version 2.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Dynamic dashboard content based on user role using the proper dashboard layout system
 */

"use client"

import React from "react"
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout"
import { useDashboardLayout } from "../../../hooks/use-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { getProjectStats, getProjectAccessDescription } from "../../../lib/project-access-utils"
import type { UserRole } from "../../project/[projectId]/types/project"

interface ProjectData {
  id: string
  name: string
  description: string
  stage: string
  project_stage_name: string
  project_type_name: string
  contract_value: number
  duration: number
  start_date?: string
  end_date?: string
  location?: string
  project_manager?: string
  client?: string
  active: boolean
  project_number: string
  metadata: {
    originalData: any
  }
}

interface User {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

interface RoleDashboardProps {
  userRole: UserRole
  user: User
  projects: ProjectData[]
  onProjectSelect: (projectId: string | null) => void
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({ userRole, user, projects, onProjectSelect }) => {
  // Use the dashboard layout hook
  const {
    layout,
    cards,
    isLoading,
    error,
    isEditing,
    layoutDensity,
    dashboards,
    currentDashboardId,
    onDashboardSelect,
    onLayoutChange,
    onCardRemove,
    onCardConfigure,
    onCardSizeChange,
    onCardAdd,
    onSave,
    onReset,
    onToggleEdit,
    onDensityChange,
  } = useDashboardLayout(userRole)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Loading Dashboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Setting up your personalized dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed to load dashboard layout: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No layout found
  if (!layout) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              No Dashboard Layout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">No dashboard layout found for role: {userRole}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role-specific welcome message with project statistics
  const getRoleWelcomeMessage = () => {
    const name = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Welcome"
    const projectStats = getProjectStats(projects, userRole)
    const accessDescription = getProjectAccessDescription(userRole)

    switch (userRole) {
      case "executive":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Executive Dashboard - ${layout.description}`,
          badge: `${projectStats.total} Projects ($${(projectStats.totalValue / 1000000).toFixed(1)}M)`,
          accessInfo: accessDescription,
        }
      case "project-executive":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Project Executive Dashboard - ${layout.description}`,
          badge: `${projectStats.total} Projects (${projectStats.active} Active)`,
          accessInfo: accessDescription,
        }
      case "project-manager":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Project Manager Dashboard - ${layout.description}`,
          badge: `${projectStats.total} Assigned Projects`,
          accessInfo: accessDescription,
        }
      case "estimator":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `Estimator Dashboard - ${layout.description}`,
          badge: `${projectStats.byStage["Pre-Construction"] || 0} Pre-Construction Projects`,
          accessInfo: accessDescription,
        }
      case "admin":
        return {
          title: `Welcome back, ${name}`,
          subtitle: `IT Command Center - ${layout.description}`,
          badge: `System Administrator`,
          accessInfo: accessDescription,
        }
      default:
        return {
          title: `Welcome back, ${name}`,
          subtitle: layout.description,
          badge: `${projectStats.total} Projects`,
          accessInfo: accessDescription,
        }
    }
  }

  const welcomeMessage = getRoleWelcomeMessage()

  return (
    <div className="h-full w-full">
      {/* Dashboard Header */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{welcomeMessage.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{welcomeMessage.subtitle}</p>
            {welcomeMessage.accessInfo && (
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">{welcomeMessage.accessInfo}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              {welcomeMessage.badge}
            </Badge>
            {/* Edit Mode Toggle */}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={onToggleEdit}
              className="text-xs h-7 px-3"
            >
              {isEditing ? "Exit Edit" : "Edit Layout"}
            </Button>
          </div>
        </div>

        {/* Layout Density Controls */}
        {isEditing && (
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2">Density:</span>
            <div className="flex gap-1">
              {(["compact", "normal", "spacious"] as const).map((density) => (
                <Button
                  key={density}
                  variant={layoutDensity === density ? "default" : "outline"}
                  size="sm"
                  onClick={() => onDensityChange(density)}
                  className="text-xs capitalize h-6 px-2"
                >
                  {density}
                </Button>
              ))}
            </div>
            <div className="ml-auto flex gap-1">
              <Button variant="outline" size="sm" onClick={onReset} className="text-xs h-6 px-2">
                Reset
              </Button>
              <Button variant="default" size="sm" onClick={onSave} className="text-xs h-6 px-2">
                Save
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <DashboardLayout
          cards={cards}
          onLayoutChange={onLayoutChange}
          onCardRemove={onCardRemove}
          onCardConfigure={onCardConfigure}
          onCardSizeChange={onCardSizeChange}
          onCardAdd={onCardAdd}
          onSave={onSave}
          onReset={onReset}
          isEditing={isEditing}
          onToggleEdit={onToggleEdit}
          layoutDensity={layoutDensity}
          userRole={userRole}
          dashboards={dashboards}
          currentDashboardId={currentDashboardId ?? undefined}
          onDashboardSelect={onDashboardSelect}
        />
      </div>
    </div>
  )
}
