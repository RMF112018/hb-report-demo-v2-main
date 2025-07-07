/**
 * @fileoverview Project Page Content component
 * @module ProjectPageContent
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Main content component that integrates existing page functionality
 * with the new layout and navigation systems.
 */

"use client"

import React from "react"
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
  legacyProps?: Record<string, any>
}

/**
 * ProjectPageContent component - Main content integration
 */
export function ProjectPageContent({
  projectId,
  userRole,
  projectData,
  contentComponents,
  legacyProps,
}: ProjectPageContentProps) {
  // Mock user object - in real app this would come from auth context
  const user = {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@hbbuilding.com",
    role: userRole,
  }

  return <ProjectControlCenterContent projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
}
