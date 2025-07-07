/**
 * @fileoverview Project Content Component for Main Application
 * @module ProjectContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Renders project-specific content using the ProjectControlCenterContent component
 * - Breadcrumb navigation
 * - Project title and description
 * - Integration with existing project control center
 * - Role-based content filtering
 */

"use client"

import React from "react"
import ProjectControlCenterContent from "../../project/[projectId]/components/ProjectControlCenterContent"
import type { UserRole } from "../../project/[projectId]/types/project"

interface User {
  firstName: string
  lastName: string
  email: string
  role: string
  avatar?: string
}

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

interface ProjectContentProps {
  projectId: string
  projectData: ProjectData
  userRole: UserRole
  user: User
  onNavigateBack?: () => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export const ProjectContent: React.FC<ProjectContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  onNavigateBack,
  activeTab = "dashboard",
  onTabChange,
}) => {
  // Extract the actual numeric project_id from the original data
  const actualProjectId = projectData.metadata.originalData?.project_id || projectId

  return (
    <ProjectControlCenterContent
      projectId={actualProjectId.toString()}
      projectData={projectData.metadata.originalData}
      userRole={userRole}
      user={user}
    />
  )
}
