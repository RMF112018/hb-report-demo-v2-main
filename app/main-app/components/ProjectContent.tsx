/**
 * @fileoverview Project Content Component
 * @module ProjectContent
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Project-specific content renderer using the modular project page system
 */

"use client"

import React, { useMemo } from "react"
import { ProjectPageWrapper } from "../../project/[projectId]/components/ProjectPageWrapper"
import { ProjectPageContent } from "../../project/[projectId]/components/ProjectPageContent"
import type { UserRole, ProjectData } from "../../project/[projectId]/types/project"

interface User {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
}

interface ProjectContentProps {
  projectId: string
  projectData: {
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
  userRole: UserRole
  user: User
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ projectId, projectData, userRole, user }) => {
  // Transform project data to match the modular system's expectations
  const transformedProjectData: ProjectData = useMemo(() => {
    return {
      id: parseInt(projectData.id),
      name: projectData.name,
      description: projectData.description,
      stage: projectData.stage,
      project_stage_name: projectData.project_stage_name,
      project_type_name: projectData.project_type_name,
      contract_value: projectData.contract_value,
      duration: projectData.duration,
      start_date: projectData.start_date,
      end_date: projectData.end_date,
      location: projectData.location,
      project_manager: projectData.project_manager,
      client: projectData.client,
      metadata: projectData.metadata,
    }
  }, [projectData])

  // Content components mapping (to be implemented)
  const contentComponents = useMemo(
    () => ({
      // FinancialHubContent: FinancialHubContent,
      // ProcurementContent: ProcurementContent,
      // SchedulerContent: SchedulerContent,
      // ConstraintsContent: ConstraintsContent,
      // PermitLogContent: PermitLogContent,
      // FieldReportsContent: FieldReportsContent,
      // ReportsContent: ReportsContent,
      // ChecklistsContent: ChecklistsContent,
    }),
    []
  )

  return (
    <div className="h-full w-full">
      {/* Use ProjectPageWrapper to provide necessary context providers */}
      <ProjectPageWrapper
        projectId={projectId}
        userRole={userRole}
        projectData={transformedProjectData}
        className="h-full"
      >
        {/* Custom content without duplicating headers/sidebars */}
        <div className="h-full">
          {/* Project Content */}
          <div className="h-full p-6">
            <ProjectPageContent
              projectId={projectId}
              userRole={userRole}
              projectData={transformedProjectData}
              contentComponents={contentComponents}
              legacyProps={{
                user,
                project: projectData.metadata.originalData,
                projectId: parseInt(projectId),
              }}
            />
          </div>
        </div>
      </ProjectPageWrapper>
    </div>
  )
}
