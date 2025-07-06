/**
 * @fileoverview Project Control Center Page (Phase 3 Integration)
 * @module ProjectControlCenterPage
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Integrated project page using the new modular layout and navigation system
 * with backward compatibility for existing content components.
 */

"use client"

import React, { useMemo } from "react"
import { useAuth } from "../../../context/auth-context"
import { ProjectPageWrapper } from "./components/ProjectPageWrapper"
import { ProjectPageContent } from "./components/ProjectPageContent"

// Content components will be imported here when available
// import FinancialHubContent from "./components/content/FinancialHubContent"
// import ProcurementContent from "./components/content/ProcurementContent"
// import SchedulerContent from "./components/content/SchedulerContent"
// import ConstraintsContent from "./components/content/ConstraintsContent"
// import PermitLogContent from "./components/content/PermitLogContent"
// import FieldReportsContent from "./components/content/FieldReportsContent"
// import ReportsContent from "./components/content/ReportsContent"
// import ChecklistsContent from "./components/content/ChecklistsContent"

// Mock data imports
import projectsData from "../../../data/mock/projects.json"
import type { ProjectData, UserRole } from "./types/project"

/**
 * Props for the ProjectControlCenterPage component
 */
interface ProjectControlCenterPageProps {
  params: {
    projectId: string
  }
}

/**
 * Main Project Control Center Page component
 */
export default function ProjectControlCenterPage({ params }: ProjectControlCenterPageProps) {
  const { user } = useAuth()

  const projectId = parseInt(params.projectId)

  // Find the specific project
  const project = useMemo(() => {
    return projectsData.find((p) => p.project_id === projectId)
  }, [projectId])

  // Transform project data to match new types
  const projectData: ProjectData | undefined = useMemo(() => {
    if (!project) return undefined

    return {
      id: project.project_id,
      name: project.name,
      description: project.description || "",
      stage: project.project_stage_name,
      project_stage_name: project.project_stage_name,
      project_type_name: project.project_type_name,
      contract_value: project.contract_value,
      duration: project.duration,
      start_date: (project as Record<string, unknown>).start_date as string | undefined,
      end_date: (project as Record<string, unknown>).end_date as string | undefined,
      location: (project as Record<string, unknown>).location as string | undefined,
      project_manager: (project as Record<string, unknown>).project_manager as string | undefined,
      client: (project as Record<string, unknown>).client as string | undefined,
      metadata: {
        originalData: project,
      },
    }
  }, [project])

  // Determine user role
  const userRole = useMemo((): UserRole => {
    if (!user?.email) return "viewer"

    if (user.email.includes("pm@") || user.email.includes("manager@")) return "project-manager"
    if (user.email.includes("super@") || user.email.includes("field@")) return "superintendent"
    if (user.email.includes("exec@") || user.email.includes("executive@")) return "executive"
    if (user.email.includes("estimator@")) return "estimator"
    if (user.email.includes("admin@")) return "admin"

    return "team-member"
  }, [user])

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

  // Loading state
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Project not found</p>
          <p className="text-muted-foreground">Project ID: {projectId}</p>
        </div>
      </div>
    )
  }

  return (
    <ProjectPageWrapper
      projectId={params.projectId}
      userRole={userRole}
      projectData={projectData}
      className="min-h-screen"
    >
      <ProjectPageContent
        projectId={params.projectId}
        userRole={userRole}
        projectData={projectData}
        contentComponents={contentComponents}
        legacyProps={{
          user,
          project,
          projectId,
        }}
      />
    </ProjectPageWrapper>
  )
}
