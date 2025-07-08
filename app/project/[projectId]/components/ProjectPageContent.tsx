/**
 * @fileoverview Project Page Content component
 * @module ProjectPageContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main content component that integrates existing project control center functionality
 * with the new v3.0 modular architecture and page header system.
 */

"use client"

import React, { useMemo } from "react"
import ProjectControlCenterContent from "./ProjectControlCenterContent"
import type { ProjectData, UserRole } from "../types/project"

/**
 * Props for the ProjectPageContent component
 */
export interface ProjectPageContentProps {
  /** Project ID */
  projectId: string

  /** Current user role */
  userRole: UserRole

  /** Project data */
  projectData?: ProjectData

  /** Existing page content components */
  contentComponents?: {
    FinancialHubContent?: React.ComponentType<any>
    ProcurementContent?: React.ComponentType<any>
    SchedulerContent?: React.ComponentType<any>
    ConstraintsContent?: React.ComponentType<any>
    PermitLogContent?: React.ComponentType<any>
    FieldReportsContent?: React.ComponentType<any>
    ReportsContent?: React.ComponentType<any>
    ChecklistsContent?: React.ComponentType<any>
  }

  /** Additional props for legacy content */
  legacyProps?: {
    user?: any
    project?: any
    projectId?: any
    activeTab?: string
    onTabChange?: (tabId: string) => void
    onNavigateBack?: () => void
  }
}

/**
 * ProjectPageContent component - Main content integration for v3.0 architecture
 *
 * This component serves as the bridge between the new modular architecture
 * and the existing project control center content. It ensures that all
 * project-specific content, tabs, buttons, and badges are properly
 * integrated with the main application's PageHeader system.
 */
export function ProjectPageContent({
  projectId,
  userRole,
  projectData,
  contentComponents,
  legacyProps,
}: ProjectPageContentProps) {
  // Create proper user object for legacy compatibility
  const user = useMemo(() => {
    if (legacyProps?.user) {
      return legacyProps.user
    }

    // Fallback user object
    return {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@hbbuilding.com",
      role: userRole,
    }
  }, [legacyProps?.user, userRole])

  // Extract the actual numeric project_id from the original data
  const actualProjectId = useMemo(() => {
    return projectData?.metadata?.originalData?.project_id || projectId
  }, [projectData, projectId])

  // Get the original project data for legacy compatibility
  const originalProjectData = useMemo(() => {
    return projectData?.metadata?.originalData || null
  }, [projectData])

  return (
    <div className="flex-1 w-full h-full max-w-full overflow-hidden">
      <ProjectControlCenterContent
        projectId={actualProjectId.toString()}
        projectData={originalProjectData}
        userRole={userRole}
        user={user}
        activeTab={legacyProps?.activeTab}
        onTabChange={legacyProps?.onTabChange}
      />
    </div>
  )
}

export default ProjectPageContent
