/**
 * @fileoverview Main Application Layout Page
 * @module MainApplicationPage
 * @version 2.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Primary application layout supporting all user roles with:
 * - Role-based dashboard content
 * - Enhanced project navigation sidebar with integrated header functionality
 * - Dynamic content rendering
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../context/auth-context"
import { ProjectSidebar } from "./components/ProjectSidebar"
import { RoleDashboard } from "./components/RoleDashboard"
import { ProjectContent } from "./components/ProjectContent"
import { Button } from "../../components/ui/button"
import { PanelLeftOpen } from "lucide-react"

// Mock data imports
import projectsData from "../../data/mock/projects.json"
import { filterProjectsByRole, getProjectStats } from "../../lib/project-access-utils"
import type { UserRole } from "../project/[projectId]/types/project"

/**
 * Main Application Page component
 */
export default function MainApplicationPage() {
  const { user } = useAuth()

  // State management
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if device is mobile on mount
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle sidebar with Ctrl+B (or Cmd+B on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault()
        setSidebarCollapsed(!sidebarCollapsed)
      }

      // Close sidebar with Escape key on mobile
      if (event.key === "Escape" && !sidebarCollapsed && isMobile) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sidebarCollapsed, isMobile])

  // Determine user role
  const userRole = useMemo((): UserRole => {
    if (!user?.role) return "viewer"

    // Use the role field directly from the user object
    switch (user.role) {
      case "executive":
        return "executive"
      case "project-executive":
        return "project-executive"
      case "project-manager":
        return "project-manager"
      case "estimator":
        return "estimator"
      case "admin":
        return "admin"
      default:
        return "team-member"
    }
  }, [user])

  // Transform and filter project data based on user role
  const projects = useMemo(() => {
    // First, transform all projects
    const allProjects = projectsData.map((project: any) => ({
      id: project.project_id.toString(),
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
      active: project.active,
      project_number: project.project_number,
      metadata: {
        originalData: project,
      },
    }))

    // Then filter based on user role
    return filterProjectsByRole(allProjects, userRole)
  }, [userRole])

  // Handle project selection
  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId)

    // Auto-collapse sidebar on mobile when project is selected
    if (isMobile && projectId && !sidebarCollapsed) {
      setSidebarCollapsed(true)
    }

    // Save selection to localStorage
    if (typeof window !== "undefined") {
      if (projectId) {
        localStorage.setItem("selectedProject", projectId)
      } else {
        localStorage.removeItem("selectedProject")
      }
    }
  }

  // Restore saved project selection on mount
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      const savedProject = localStorage.getItem("selectedProject")
      if (savedProject) {
        setSelectedProject(savedProject)
      }
    }
  }, [mounted])

  // Loading state
  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    )
  }

  const selectedProjectData = selectedProject ? projects.find((p) => p.id === selectedProject) : null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="flex h-screen">
        {/* Enhanced Project Sidebar with integrated header functionality */}
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          userRole={userRole}
        />

        {/* Main Content Area - Responsive to sidebar state */}
        <main
          className={`
            flex-1 
            overflow-hidden 
            transition-all 
            duration-300 
            ease-in-out
            ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-80"}
          `}
        >
          {/* Mobile sidebar toggle button - visible when collapsed on mobile */}
          {isMobile && sidebarCollapsed && (
            <div className="fixed top-4 left-4 z-30 md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="h-10 w-10 p-0 bg-white dark:bg-gray-900 shadow-lg border-gray-200 dark:border-gray-700"
                title="Open projects menu"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Content Area with Padding */}
          <div className="h-full overflow-y-auto p-6">
            {selectedProject && selectedProjectData ? (
              // Project-specific content
              <ProjectContent
                projectId={selectedProject}
                projectData={selectedProjectData}
                userRole={userRole}
                user={user}
              />
            ) : (
              // Role-based dashboard
              <RoleDashboard
                userRole={userRole}
                user={user}
                projects={projects}
                onProjectSelect={handleProjectSelect}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile overlay for sidebar */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}
