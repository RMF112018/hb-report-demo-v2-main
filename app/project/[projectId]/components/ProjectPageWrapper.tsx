/**
 * @fileoverview Project Page Wrapper component
 * @module ProjectPageWrapper
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive wrapper component that integrates the new navigation and
 * layout systems with existing page content for seamless modular architecture.
 *
 * @example
 * ```tsx
 * <ProjectPageWrapper
 *   projectId="123"
 *   userRole="project-manager"
 *   projectData={projectData}
 * >
 *   <YourPageContent />
 * </ProjectPageWrapper>
 * ```
 */

"use client"

import React, { useMemo } from "react"
import { useRouter } from "next/navigation"
import { NavigationProvider } from "./navigation/NavigationProvider"
import { LayoutProvider } from "./layout/LayoutProvider"
import { ProjectLayout } from "./layout/ProjectLayout"
import { DEFAULT_QUICK_ACTIONS } from "../constants/layout"
import type { QuickAction, ActivityItem } from "../types/layout"
import type { NavigationState } from "../types/navigation"
import type { ProjectData, UserRole } from "../types/project"
import { FileText } from "lucide-react"

/**
 * Props for the ProjectPageWrapper component
 */
export interface ProjectPageWrapperProps {
  /** Project ID for context */
  projectId: string

  /** Current user role for permission handling */
  userRole: UserRole

  /** Project data for context and display */
  projectData?: ProjectData

  /** Page content to render within the layout */
  children: React.ReactNode

  /** Optional navigation initial state */
  initialNavigation?: Partial<NavigationState>

  /** Optional custom quick actions */
  quickActions?: QuickAction[]

  /** Optional recent activity items */
  recentActivity?: ActivityItem[]

  /** Optional className for additional styling */
  className?: string
}

/**
 * ProjectPageWrapper component - Integrates navigation and layout systems
 */
export function ProjectPageWrapper({
  projectId,
  userRole,
  projectData,
  children,
  initialNavigation,
  quickActions = DEFAULT_QUICK_ACTIONS,
  recentActivity = [],
  className,
}: ProjectPageWrapperProps) {
  const router = useRouter()
  // Transform project data to layout-compatible format
  const layoutProjectData = useMemo(() => {
    if (!projectData) return undefined

    return {
      id: String(projectData.id || projectId),
      name: projectData.name || "Unknown Project",
      stage: projectData.project_stage_name || "in-progress",
      project_stage_name: projectData.project_stage_name || "in-progress",
      project_type_name: projectData.project_type_name || "Unknown",
      contract_value: projectData.contract_value || 0,
      duration: projectData.duration || 0,
    }
  }, [projectData, projectId])

  // Create project stats for footer
  const projectStats = useMemo(() => {
    if (!projectData) return undefined

    return {
      budget: projectData.contract_value || 0,
      budgetTrend: determineBudgetTrend(projectData) as "up" | "down" | "stable",
      timeline: formatProjectTimeline(projectData),
      team: calculateTeamSize(projectData),
    }
  }, [projectData])

  // Generate recent activity from project data
  const enhancedRecentActivity = useMemo(() => {
    const defaultActivity: ActivityItem[] = [
      {
        id: "default-1",
        type: "update",
        title: "Project Status Updated",
        description: "Project information refreshed",
        timestamp: new Date().toISOString(),
        read: false,
        color: "blue",
        icon: FileText,
        onClick: () => console.log("Activity clicked"),
      },
    ]

    return recentActivity.length > 0 ? recentActivity : defaultActivity
  }, [recentActivity])

  // Handle layout actions
  const handleLayoutAction = (actionId: string) => {
    switch (actionId) {
      case "refresh":
        // Use Next.js App Router refresh instead of full page reload
        // This preserves browser history and React state while refreshing data
        router.refresh()
        break
      case "settings":
        console.log("Opening settings...")
        break
      case "notifications":
        console.log("Opening notifications...")
        break
      case "profile":
        console.log("Opening profile...")
        break
      case "help":
        console.log("Opening help...")
        break
      case "logout":
        console.log("Logging out...")
        break
      default:
        console.log("Layout action:", actionId)
    }
  }

  // Handle search
  const handleSearch = (query: string) => {
    console.log("Search query:", query)
    // Implement search functionality
  }

  // Handle quick actions
  const handleQuickAction = (actionId: string) => {
    console.log("Quick action:", actionId)
    // Implement quick action functionality
  }

  return (
    <NavigationProvider>
      <LayoutProvider>
        <ProjectLayout userRole={userRole} projectData={layoutProjectData} className={className}>
          {children}
        </ProjectLayout>
      </LayoutProvider>
    </NavigationProvider>
  )
}

/**
 * Helper function to determine project status from project data
 */
function determineProjectStatus(projectData: any): string {
  if (!projectData) return "unknown"

  const stage = projectData.project_stage_name?.toLowerCase()

  switch (stage) {
    case "construction":
    case "execution":
      return "on-track"
    case "bidding":
    case "pre-construction":
      return "in-progress"
    case "closeout":
    case "warranty":
      return "completing"
    case "closed":
      return "completed"
    default:
      return "on-track"
  }
}

/**
 * Helper function to calculate project progress percentage
 */
function calculateProjectProgress(projectData: any): number {
  if (!projectData) return 0

  const stage = projectData.project_stage_name?.toLowerCase()

  switch (stage) {
    case "bidding":
      return 10
    case "pre-construction":
      return 25
    case "construction":
    case "execution":
      return 65
    case "closeout":
      return 90
    case "warranty":
      return 95
    case "closed":
      return 100
    default:
      return 50
  }
}

/**
 * Helper function to determine budget trend
 */
function determineBudgetTrend(projectData: any): string {
  // Mock implementation - in real app this would analyze actual budget data
  return Math.random() > 0.5 ? "up" : "stable"
}

/**
 * Helper function to format project timeline
 */
function formatProjectTimeline(projectData: any): string {
  if (!projectData) return "TBD"

  if (projectData.duration) {
    const months = Math.ceil(projectData.duration / 30)
    return `${months} months`
  }

  return "TBD"
}

/**
 * Helper function to calculate team size
 */
function calculateTeamSize(projectData: any): number {
  // Mock implementation - in real app this would analyze actual team data
  const baseSize = projectData?.contract_value ? Math.floor(projectData.contract_value / 100000) : 10
  return Math.min(Math.max(baseSize, 5), 50)
}

export default ProjectPageWrapper
