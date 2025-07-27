/**
 * @fileoverview Project Access Control Utilities
 * @module ProjectAccessUtils
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Role-based project access control system for the demo application
 */

import type { UserRole } from "../app/project/[projectId]/types/project"

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

/**
 * Role-based project access configuration
 * Defines specific project access permissions for demo purposes
 */
const ROLE_PROJECT_ACCESS: Record<
  UserRole,
  {
    accessType: "all" | "specific" | "by-stage"
    projectIds?: string[]
    stages?: string[]
    limits?: { [stage: string]: number }
    description: string
  }
> = {
  executive: {
    accessType: "all",
    description: "Full access to all projects across all stages",
  },

  "project-executive": {
    accessType: "specific",
    // 6 Construction + 1 BIM Coordination + 2 Pre-Construction = 9 projects
    projectIds: [
      // Construction projects (5 available, take all)
      "2525840", // Palm Beach Luxury Estate
      "2525845", // Fort Lauderdale Hotel Resort
      "2525848", // Pensacola Corporate Campus
      "2525850", // Boca Raton Corporate Headquarters
      "2525855", // Aventura Retail Plaza

      // BIM Coordination projects (1 of 2)
      "2525846", // Tampa Medical Center

      // Pre-Construction projects (2 of 3)
      "2525843", // Naples Waterfront Condominium
      "2525849", // Sarasota Cultural Center

      // Add one more construction project by using a bidding project
      "2525841", // Miami Commercial Tower (Bidding stage)
    ],
    description: "Portfolio management access to strategic projects",
  },

  "project-manager": {
    accessType: "specific",
    // 1 BIM Coordination + 1 Construction = 2 projects
    projectIds: [
      "2525856", // Tallahassee Government Complex (BIM Coordination)
      "2525840", // Palm Beach Luxury Estate (Construction)
    ],
    description: "Direct project management access to assigned projects",
  },

  estimator: {
    accessType: "by-stage",
    stages: ["Pre-Construction", "BIM Coordination", "Bidding"],
    description: "Access to pre-construction and bidding projects",
  },

  admin: {
    accessType: "all",
    description: "Administrative access to all projects",
  },

  "team-member": {
    accessType: "by-stage",
    stages: ["Construction", "Closeout", "Warranty"],
    description: "Access to active construction projects",
  },

  viewer: {
    accessType: "by-stage",
    stages: ["Construction", "Closeout"],
    description: "Read-only access to construction projects",
  },

  superintendent: {
    accessType: "by-stage",
    stages: ["Construction", "Closeout", "Warranty"],
    description: "Site supervision access to construction projects",
  },

  "hr-payroll": {
    accessType: "all",
    description: "HR & Payroll management access to all projects for employee data",
  },

  presentation: {
    accessType: "all",
    description: "Presentation mode access to all projects for demonstration",
  },
}

/**
 * Filters projects based on user role permissions
 * @param projects - Array of project data
 * @param userRole - User's role
 * @returns Filtered array of projects the user has access to
 */
export function filterProjectsByRole(projects: ProjectData[], userRole: UserRole): ProjectData[] {
  const accessConfig = ROLE_PROJECT_ACCESS[userRole]

  if (!accessConfig) {
    console.warn(`No access configuration found for role: ${userRole}`)
    return []
  }

  switch (accessConfig.accessType) {
    case "all":
      return projects

    case "specific":
      if (!accessConfig.projectIds) {
        return []
      }
      return projects.filter((project) => accessConfig.projectIds!.includes(project.id))

    case "by-stage":
      if (!accessConfig.stages) {
        return []
      }
      return projects.filter((project) => accessConfig.stages!.includes(project.project_stage_name))

    default:
      return []
  }
}

/**
 * Gets project access description for a role
 * @param userRole - User's role
 * @returns Human-readable description of project access
 */
export function getProjectAccessDescription(userRole: UserRole): string {
  const accessConfig = ROLE_PROJECT_ACCESS[userRole]
  return accessConfig?.description || "No access configured"
}

/**
 * Checks if a user has access to a specific project
 * @param projectId - ID of the project to check
 * @param userRole - User's role
 * @param projects - Array of all projects (for context)
 * @returns True if user has access, false otherwise
 */
export function hasProjectAccess(projectId: string, userRole: UserRole, projects: ProjectData[]): boolean {
  const accessibleProjects = filterProjectsByRole(projects, userRole)
  return accessibleProjects.some((project) => project.id === projectId)
}

/**
 * Gets project statistics for a role
 * @param projects - Array of all projects
 * @param userRole - User's role
 * @returns Statistics about accessible projects
 */
export function getProjectStats(
  projects: ProjectData[],
  userRole: UserRole
): {
  total: number
  active: number
  byStage: Record<string, number>
  totalValue: number
} {
  const accessibleProjects = filterProjectsByRole(projects, userRole)

  const stats = {
    total: accessibleProjects.length,
    active: accessibleProjects.filter((p) => p.active).length,
    byStage: {} as Record<string, number>,
    totalValue: 0,
  }

  accessibleProjects.forEach((project) => {
    // Count by stage
    const stage = project.project_stage_name
    stats.byStage[stage] = (stats.byStage[stage] || 0) + 1

    // Sum contract values
    stats.totalValue += project.contract_value || 0
  })

  return stats
}

/**
 * Demo data - specific project assignments for role-based access
 */
export const PROJECT_ASSIGNMENTS = {
  "project-executive": {
    description: "Strategic portfolio management",
    projectCount: 9,
    stages: {
      Construction: 5,
      "BIM Coordination": 1,
      "Pre-Construction": 2,
      Bidding: 1,
    },
  },
  "project-manager": {
    description: "Active project management",
    projectCount: 2,
    stages: {
      Construction: 1,
      "BIM Coordination": 1,
    },
  },
} as const
