/**
 * @fileoverview Project Content Component for Main Application
 * @module ProjectContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Renders project-specific content using the new v3.0 modular architecture
 * - Integrates with PageHeader component for tabs/buttons/badges injection
 * - Provides left sidebar content for project panels
 * - Uses ProjectPageWrapper and ProjectPageContent for proper layout
 * - Provides role-based content filtering
 * - Implements responsive design and performance optimization
 * - Supports dynamic content loading and error boundaries
 */

"use client"

import React, { useMemo } from "react"
import { ProjectPageWrapper } from "@/app/project/[projectId]/components/ProjectPageWrapper"
import { ProjectPageContent } from "@/app/project/[projectId]/components/ProjectPageContent"
import { getProjectSidebarContent } from "@/app/project/[projectId]/components/ProjectControlCenterContent"
import type { ProjectData, UserRole } from "@/app/project/[projectId]/types/project"

interface ProjectContentProps {
  projectId: string
  projectData: ProjectData
  userRole: UserRole
  user: any
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
}

const ProjectContent: React.FC<ProjectContentProps> = ({
  projectId,
  projectData: originalProjectData,
  userRole,
  user,
  onNavigateBack,
  activeTab,
  onTabChange,
  renderMode = "rightContent",
}) => {
  // Transform data to match expected format using useMemo for performance
  const projectData = useMemo(() => {
    if (!originalProjectData) return null

    return {
      ...originalProjectData,
      id: originalProjectData.id || projectId,
      name: originalProjectData.name || `Project ${projectId}`,
      description: originalProjectData.description || "No description available",
    }
  }, [originalProjectData, projectId])

  // Generate enhanced user object with proper properties
  const enhancedUser = useMemo(() => {
    if (!user) return null

    return {
      id: user.id || "user-1",
      firstName: user.firstName || user.name?.split(" ")[0] || "John",
      lastName: user.lastName || user.name?.split(" ")[1] || "Doe",
      email: user.email || "user@example.com",
      role: userRole,
      department: user.department || "Construction",
      ...user,
    }
  }, [user, userRole])

  // Ensure projectId is a string
  const actualProjectId = useMemo(() => {
    return projectId.toString()
  }, [projectId])

  // Map activeTab to navigation state for sidebar content
  const navigationState = useMemo(() => {
    // For Core tab, use coreTab navigation
    if (activeTab === "core") {
      return {
        category: null,
        tool: null,
        subTool: null,
        coreTab: "dashboard", // Default to dashboard within core
        staffingSubTab: null,
      }
    }

    const tabToCategoryMap = {
      "pre-construction": "Pre-Construction",
      "financial-management": "Financial Management",
      "field-management": "Field Management",
      compliance: "Compliance",
      warranty: "Warranty",
    }

    return {
      category: tabToCategoryMap[activeTab as keyof typeof tabToCategoryMap] || null,
      tool: null,
      subTool: null,
      coreTab: null,
      staffingSubTab: null,
    }
  }, [activeTab])

  // Generate project metrics for sidebar
  const projectMetrics = useMemo(
    () => ({
      totalBudget: projectData?.contract_value || 75000000,
      spentToDate: projectData?.contract_value ? projectData.contract_value * 0.68 : 51000000,
      scheduleProgress: 72,
      budgetProgress: 68,
      activeTeamMembers: 24,
      completedMilestones: 8,
      totalMilestones: 12,
      activeRFIs: 5,
      changeOrders: 3,
      riskItems: 2,
    }),
    [projectData]
  )

  // Generate left sidebar content
  const leftSidebarContent = useMemo(() => {
    if (!projectData || !projectMetrics) return null
    return getProjectSidebarContent(projectData, navigationState, projectMetrics, activeTab)
  }, [projectData, navigationState, projectMetrics, activeTab])

  if (!projectData || !enhancedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project data...</p>
        </div>
      </div>
    )
  }

  // Props to pass to legacy components
  const legacyProps = {
    activeTab,
    onTabChange,
    onNavigateBack,
  }

  // Render based on mode
  if (renderMode === "leftContent") {
    return leftSidebarContent
  }

  // Render main content (rightContent mode)
  return (
    <div className="h-full w-full min-w-0 max-w-full overflow-hidden flex flex-col">
      <ProjectPageWrapper projectId={actualProjectId} projectData={projectData} userRole={userRole}>
        <ProjectPageContent
          projectId={actualProjectId}
          projectData={projectData}
          userRole={userRole}
          legacyProps={legacyProps}
        />
      </ProjectPageWrapper>
    </div>
  )
}

export default ProjectContent
