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
import { useRouter } from "next/navigation"
import { DashboardLayout } from "../../../components/dashboard/DashboardLayout"
import { useDashboardLayout } from "../../../hooks/use-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { getProjectStats, getProjectAccessDescription } from "../../../lib/project-access-utils"
import type { UserRole } from "../../project/[projectId]/types/project"
import Image from "next/image"
import { ActionItemsInbox } from "../../../components/dashboard/ActionItemsInbox"
import { ActionItemsToDo } from "../../../components/dashboard/ActionItemsToDo"
import { ProjectActivityFeed } from "../../../components/feed/ProjectActivityFeed"
import BidManagementCenter from "../../../components/estimating/bid-management/BidManagementCenter"
import { EstimatingModuleWrapper } from "../../../components/estimating/wrappers/EstimatingModuleWrapper"
import { DueThisWeekPanel } from "../../../components/dashboard/DueThisWeekPanel"

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
  activeTab?: string
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
}

export const RoleDashboard: React.FC<RoleDashboardProps> = ({
  userRole,
  user,
  projects,
  onProjectSelect,
  activeTab = "overview",
  onTabChange,
  renderMode = "rightContent",
}) => {
  const router = useRouter()

  // Use the dashboard layout hook
  const {
    layout,
    layouts,
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

  // Determine if DueThisWeekPanel should be shown
  const shouldShowDueThisWeekPanel = () => {
    // Project Executive: All dashboard views
    if (userRole === "project-executive") {
      return true
    }

    // Project Manager: All dashboard views
    if (userRole === "project-manager") {
      return true
    }

    // Estimator: Only Overview, Analytics, and Activity Feed views
    if (userRole === "estimator") {
      return ["overview", "analytics", "activity-feed"].includes(activeTab)
    }

    return false
  }

  // Render left sidebar content
  const renderLeftContent = () => {
    if (!shouldShowDueThisWeekPanel()) {
      return null
    }

    // Map estimator role to project-manager for DueThisWeekPanel compatibility
    const dueThisWeekPanelRole =
      userRole === "estimator" ? "project-manager" : (userRole as "project-executive" | "project-manager")

    return (
      <div className="space-y-4">
        <DueThisWeekPanel userRole={dueThisWeekPanelRole} className="h-fit" />

        {/* Additional left sidebar content can be added here for future enhancements */}
      </div>
    )
  }

  // If rendering left content only, return it
  if (renderMode === "leftContent") {
    return renderLeftContent()
  }

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
            <Button
              onClick={() => {
                // Use Next.js App Router refresh method instead of full page reload
                // This preserves browser history and React state while refreshing data
                router.refresh()
              }}
              variant="outline"
              className="w-full"
            >
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

    // Special handling for bid-management tab
    if (activeTab === "bid-management") {
      return {
        title: "Bid Management Dashboard",
        subtitle:
          "Comprehensive project bidding and delivery tracking system with real-time BuildingConnected integration",
        badge: `${projectStats.total} Projects`,
        accessInfo: accessDescription,
      }
    }

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
          subtitle: `IT Administrator Dashboard - ${layout.description}`,
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

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
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
        )

      case "financial-review":
        // Get financial dashboard layout if available, otherwise use current layout
        const financialLayout = layouts?.find((l) => l.name.toLowerCase().includes("financial")) || layout
        const financialCards = financialLayout?.cards || cards

        return (
          <DashboardLayout
            cards={financialCards}
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
        )

      case "action-items":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionItemsInbox userRole={userRole as "project-executive" | "project-manager"} />
            <ActionItemsToDo userRole={userRole as "project-executive" | "project-manager"} />
          </div>
        )

      case "activity-feed":
        return (
          <ProjectActivityFeed
            config={{
              userRole: userRole as "executive" | "project-executive" | "project-manager" | "estimator",
              showFilters: true,
              showPagination: true,
              itemsPerPage: 20,
              allowExport: true,
            }}
          />
        )

      case "analytics":
        return (
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
        )

      case "bid-management":
        // Map the broader UserRole to BidManagementCenter's expected UserRole
        const bidManagementUserRole = (() => {
          switch (userRole) {
            case "project-executive":
              return "executive" as const
            case "project-manager":
              return "project-manager" as const
            case "estimator":
              return "estimator" as const
            case "admin":
              return "admin" as const
            case "executive":
              return "executive" as const
            default:
              return "estimator" as const
          }
        })()

        return (
          <EstimatingModuleWrapper
            title="Bid Management Center"
            description="Comprehensive bid management and BuildingConnected integration with real-time data and export capabilities"
            userRole={userRole}
            isEmbedded={true}
            showCard={false}
            showHeader={false}
          >
            <BidManagementCenter
              userRole={bidManagementUserRole}
              onProjectSelect={onProjectSelect}
              className="h-full"
              showHeader={false}
            />
          </EstimatingModuleWrapper>
        )

      default:
        // Default to overview if tab not recognized
        return (
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
        )
    }
  }

  return (
    <div className="h-full w-full">
      {/* Layout Density Controls - Show when editing and on overview tab */}
      {isEditing && (activeTab === "overview" || activeTab === "financial-review") && (
        <div className="mb-4 flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mr-2">Density:</span>
          <div className="flex gap-1">
            {(["compact", "normal", "spacious"] as const).map((density) => (
              <Button
                key={density}
                variant={layoutDensity === density ? "default" : "outline"}
                size="sm"
                onClick={() => onDensityChange(density)}
                className="text-[10px] capitalize h-5 px-1.5"
              >
                {density}
              </Button>
            ))}
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant="outline" size="sm" onClick={onReset} className="text-[10px] h-5 px-1.5">
              Reset
            </Button>
            <Button variant="default" size="sm" onClick={onSave} className="text-[10px] h-5 px-1.5">
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="dashboard-content">{renderTabContent()}</div>
    </div>
  )
}
