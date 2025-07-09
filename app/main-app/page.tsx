/**
 * @fileoverview Main Application Layout Page
 * @module MainApplicationPage
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Primary application layout supporting all user roles with:
 * - Consistent page header across all modules
 * - 2-column main content area (25% left, 75% right)
 * - Full-width footer container
 * - Role-based dashboard content
 * - Enhanced project navigation sidebar with integrated header functionality and fluid navigation
 * - Dynamic content rendering
 * - Perpetual collapsed sidebar with expandable content panels
 * - IT Administrator support with IT Command Center integration
 * - Project Control Center content injection
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../context/auth-context"
import { ProjectSidebar } from "./components/ProjectSidebar"
import { RoleDashboard } from "./components/RoleDashboard"
import ITCommandCenterContent from "./components/ITCommandCenterContent"
import { ToolContent } from "./components/ToolContent"
import ProjectContent from "./components/ProjectContent"
import { PageHeader } from "./components/PageHeader"
import type { PageHeaderTab, PageHeaderButton, PageHeaderBadge } from "./components/PageHeader"
import { useRouter } from "next/navigation"
import { Edit, Settings, RefreshCw, Download, Plus, Calendar, Users, Activity } from "lucide-react"

// Mock data imports
import projectsData from "../../data/mock/projects.json"
import { filterProjectsByRole, getProjectStats } from "../../lib/project-access-utils"
import type { UserRole } from "../project/[projectId]/types/project"

/**
 * Content wrapper interface for modules that support sidebar content
 */
interface ModuleContentProps {
  leftContent?: React.ReactNode
  rightContent: React.ReactNode
  hasLeftContent?: boolean
  tabs?: PageHeaderTab[]
}

/**
 * Main Application Page component
 */
export default function MainApplicationPage() {
  const { user } = useAuth()
  const router = useRouter()

  // State management
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [initialTabSet, setInitialTabSet] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(64) // Default collapsed width

  useEffect(() => {
    setMounted(true)

    // Check if device is mobile on mount
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle URL navigation - Clear selections when directly navigating to /main-app
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const currentPath = window.location.pathname

      // If user navigates directly to /main-app (no query params or sub-paths)
      if (currentPath === "/main-app") {
        // Clear all selections to ensure user returns to their role-based dashboard main view
        setSelectedProject(null)
        setSelectedModule(null)
        setSelectedTool(null)

        // Clear localStorage selections
        localStorage.removeItem("selectedProject")
        localStorage.removeItem("selectedModule")
        localStorage.removeItem("selectedTool")
      }
    }
  }, [mounted])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Navigate to dashboard with Ctrl+H (or Cmd+H on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === "h") {
        event.preventDefault()
        // Clear all selections to return to dashboard
        setSelectedTool(null)
        setSelectedModule(null)
        setSelectedProject(null)
        // Navigate to main-app to ensure clean URL
        router.push("/main-app")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router])

  // Handle sidebar panel state changes - updates layout to account for sidebar width
  const handleSidebarPanelStateChange = (isExpanded: boolean, totalWidth: number) => {
    setSidebarWidth(totalWidth)
  }

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

  // Check if user is IT Administrator
  const isITAdministrator = useMemo(() => {
    return userRole === "admin"
  }, [userRole])

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

    // Filter based on user role
    let filteredProjects = filterProjectsByRole(allProjects, userRole)

    // For project executives, limit to 6 projects as specified in the layout
    if (userRole === "project-executive") {
      filteredProjects = filteredProjects.slice(0, 6)
    }

    return filteredProjects
  }, [userRole])

  // Get selected project data
  const selectedProjectData = useMemo(() => {
    if (!selectedProject) return null
    return projects.find((p) => p.id === selectedProject)
  }, [selectedProject, projects])

  // Handle project selection - Keep project content inline in main app
  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId)

    // Clear other selections when a project is selected
    if (projectId) {
      setSelectedTool(null)
      setSelectedModule(null)
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

  // Handle IT module selection
  const handleModuleSelect = (moduleId: string | null) => {
    setSelectedModule(moduleId)

    // Clear other selections when a module is selected
    if (moduleId) {
      setSelectedTool(null)
      setSelectedProject(null)
    }

    // Save selection to localStorage
    if (typeof window !== "undefined") {
      if (moduleId) {
        localStorage.setItem("selectedModule", moduleId)
      } else {
        localStorage.removeItem("selectedModule")
      }
    }
  }

  // Handle tool selection
  const handleToolSelect = (toolName: string | null) => {
    setSelectedTool(toolName)

    // Clear other selections when a tool is selected
    if (toolName) {
      setSelectedModule(null)
      setSelectedProject(null)
    }

    // Save selection to localStorage
    if (typeof window !== "undefined") {
      if (toolName) {
        localStorage.setItem("selectedTool", toolName)
      } else {
        localStorage.removeItem("selectedTool")
      }
    }
  }

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  // Get tabs for different content types
  const getTabsForContent = () => {
    if (selectedTool) {
      switch (selectedTool) {
        case "staffing":
          return [
            { id: "portfolio", label: "Portfolio Overview" },
            { id: "management", label: "Resource Management" },
            { id: "analytics", label: "Analytics & Insights" },
          ]
        case "financial-hub":
          const allFinancialTabs = [
            { id: "overview", label: "Overview" },
            { id: "budget-analysis", label: "Budget Analysis" },
            { id: "cash-flow", label: "Cash Flow" },
            { id: "pay-application", label: "Pay Application" },
            { id: "ar-aging", label: "AR Aging" },
            { id: "pay-authorization", label: "Pay Authorization" },
            { id: "jchr", label: "JCHR" },
            { id: "change-management", label: "Change Management" },
            { id: "cost-tracking", label: "Cost Tracking" },
            { id: "forecasting", label: "Forecasting" },
            { id: "retention-management", label: "Retention Management" },
          ]
          // Filter tabs based on user role
          if (userRole === "executive") {
            return allFinancialTabs.filter((tab) =>
              ["overview", "budget-analysis", "cash-flow", "forecasting"].includes(tab.id)
            )
          } else if (userRole === "project-executive") {
            return allFinancialTabs.filter((tab) => !["pay-authorization", "retention-management"].includes(tab.id))
          }
          return allFinancialTabs
        case "procurement":
          const allProcurementTabs = [
            { id: "overview", label: "Overview" },
            { id: "vendor-management", label: "Vendors" },
            { id: "cost-analysis", label: "Cost Analysis" },
            { id: "sync-panel", label: "Sync Panel" },
            { id: "insights", label: "Insights" },
          ]
          // Filter tabs based on user role
          if (userRole === "executive") {
            return allProcurementTabs.filter((tab) => ["overview", "cost-analysis", "insights"].includes(tab.id))
          } else if (userRole === "project-executive") {
            return allProcurementTabs.filter((tab) => !["sync-panel"].includes(tab.id))
          }
          return allProcurementTabs
        case "scheduler":
          return [
            { id: "overview", label: "Overview" },
            { id: "monitor", label: "Monitor" },
            { id: "health", label: "Health" },
            { id: "look-ahead", label: "Look Ahead" },
            { id: "generator", label: "Generator" },
          ]
        case "permit-log":
          return [
            { id: "overview", label: "Overview" },
            { id: "table", label: "Table" },
            { id: "calendar", label: "Calendar" },
            { id: "analytics", label: "Analytics" },
          ]
        case "constraints-log":
          return [
            { id: "overview", label: "Overview" },
            { id: "table", label: "Table" },
            { id: "analytics", label: "Analytics" },
          ]
        default:
          return [
            { id: "overview", label: "Overview" },
            { id: "analytics", label: "Analytics" },
            { id: "reports", label: "Reports" },
            { id: "settings", label: "Settings" },
          ]
      }
    }

    if (selectedProject && selectedProjectData) {
      return [
        { id: "core", label: "Core" },
        { id: "pre-construction", label: "Pre-Construction" },
        { id: "financial-management", label: "Financial Management" },
        { id: "field-management", label: "Field Management" },
        { id: "compliance", label: "Compliance" },
        { id: "warranty", label: "Warranty" },
      ]
    }

    if (isITAdministrator && selectedModule) {
      return [
        { id: "overview", label: "Overview" },
        { id: "monitoring", label: "Monitoring" },
        { id: "analytics", label: "Analytics" },
        { id: "settings", label: "Settings" },
      ]
    }

    // Default dashboard tabs - role-based
    if (userRole === "admin") {
      return [
        { id: "overview", label: "Overview" },
        { id: "modules", label: "IT Modules" },
        { id: "analytics", label: "Analytics" },
        { id: "settings", label: "Settings" },
      ]
    } else if (userRole === "executive") {
      return [
        { id: "overview", label: "Overview" },
        { id: "financial-review", label: "Financial Review" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else if (userRole === "project-executive") {
      return [
        { id: "action-items", label: "Action Items" },
        { id: "overview", label: "Overview" },
        { id: "financial-review", label: "Financial Review" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else if (userRole === "project-manager") {
      return [
        { id: "action-items", label: "Action Items" },
        { id: "overview", label: "Overview" },
        { id: "financial-review", label: "Financial Review" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else {
      // Default for other roles (estimator, etc.)
      return [
        { id: "overview", label: "Overview" },
        { id: "analytics", label: "Analytics" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    }
  }

  // Handle header button clicks
  const handleHeaderButtonClick = (buttonId: string) => {
    switch (buttonId) {
      case "edit":
        // Toggle edit mode for dashboard
        // This would need to be passed down to the RoleDashboard component
        break
      case "refresh":
        // Refresh the current content
        window.location.reload()
        break
      case "settings":
        // Open settings modal or navigate to settings
        console.log("Settings clicked")
        break
      case "export":
        // Export current content
        console.log("Export clicked")
        break
      case "add":
        // Add new widget or item
        console.log("Add widget clicked")
        break

      default:
        console.log(`Button clicked: ${buttonId}`)
    }
  }

  // Set initial tab based on user role
  useEffect(() => {
    if (mounted && !initialTabSet && userRole) {
      // Set default tab based on user role and current selection
      if (selectedProject) {
        setActiveTab("core")
      } else if (selectedTool === "staffing") {
        setActiveTab("portfolio")
      } else if (userRole === "project-executive" || userRole === "project-manager") {
        setActiveTab("action-items")
      } else {
        setActiveTab("overview")
      }
      setInitialTabSet(true)
    }
  }, [mounted, userRole, initialTabSet, selectedProject, selectedTool])

  // Handle project selection changes
  useEffect(() => {
    if (selectedProject) {
      setActiveTab("core")
    }
  }, [selectedProject])

  // Handle tool selection changes
  useEffect(() => {
    if (selectedTool) {
      if (selectedTool === "staffing") {
        setActiveTab("portfolio")
      } else {
        setActiveTab("overview")
      }
    }
  }, [selectedTool])

  // Restore saved selections on mount
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      // Check for saved selections in order of priority
      const savedTool = localStorage.getItem("selectedTool")
      const savedProject = localStorage.getItem("selectedProject")
      const savedModule = localStorage.getItem("selectedModule")

      if (savedTool) {
        setSelectedTool(savedTool)
      } else if (savedProject && !isITAdministrator) {
        setSelectedProject(savedProject)
      } else if (savedModule && isITAdministrator) {
        setSelectedModule(savedModule)
      }
    }
  }, [mounted, isITAdministrator])

  // Get header configuration based on current selection
  const getHeaderConfig = () => {
    const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"

    if (selectedTool) {
      return {
        userName,
        moduleTitle: selectedTool.replace(/([A-Z])/g, " $1").trim(),
        subHead: `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} management and analysis tools`,
        tabs: getTabsForContent(),
        badges: [{ id: "role", label: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Access` }],
        buttons: [
          { id: "edit", label: "Edit Layout", icon: Edit, onClick: () => handleHeaderButtonClick("edit") },
          { id: "refresh", label: "Refresh", icon: RefreshCw, onClick: () => handleHeaderButtonClick("refresh") },
        ],
      }
    }

    if (selectedProject && selectedProjectData) {
      return {
        userName,
        moduleTitle: selectedProjectData.name,
        subHead: `${selectedProjectData.project_stage_name} • ${selectedProjectData.project_type_name}`,
        tabs: getTabsForContent(),
        badges: [
          { id: "stage", label: selectedProjectData.project_stage_name },
          { id: "value", label: `$${(selectedProjectData.contract_value / 1000000).toFixed(1)}M` },
        ],
        buttons: [
          { id: "settings", label: "Settings", icon: Settings, onClick: () => handleHeaderButtonClick("settings") },
          { id: "export", label: "Export", icon: Download, onClick: () => handleHeaderButtonClick("export") },
        ],
      }
    }

    if (isITAdministrator && selectedModule) {
      const moduleTitle = selectedModule.replace(/-/g, " ")
      return {
        userName,
        moduleTitle,
        subHead: `${moduleTitle.charAt(0).toUpperCase() + moduleTitle.slice(1)} operations and monitoring`,
        tabs: getTabsForContent(),
        badges: [
          { id: "role", label: "System Administrator" },
          { id: "status", label: "All Systems Operational" },
        ],
        buttons: [
          { id: "refresh", label: "Refresh", icon: RefreshCw, onClick: () => handleHeaderButtonClick("refresh") },
          { id: "settings", label: "Settings", icon: Settings, onClick: () => handleHeaderButtonClick("settings") },
        ],
      }
    }

    // Default dashboard (including IT administrators when no module selected)
    const roleLabel =
      userRole === "admin" ? "System Administrator" : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Access`
    const dashboardTitle = userRole === "admin" ? "IT Administrator Dashboard" : "Dashboard"
    const dashboardSubHead =
      userRole === "admin"
        ? "IT administration dashboard with system overview and module access"
        : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} dashboard with personalized insights`

    const dashboardBadges =
      userRole === "admin"
        ? [
            { id: "role", label: "System Administrator" },
            { id: "status", label: "All Systems Operational" },
          ]
        : [
            { id: "role", label: roleLabel },
            { id: "projects", label: `${projects.length} Projects` },
          ]

    return {
      userName,
      moduleTitle: dashboardTitle,
      subHead: dashboardSubHead,
      tabs: getTabsForContent(),
      badges: dashboardBadges,
      buttons: [
        { id: "edit", label: "Edit Layout", icon: Edit, onClick: () => handleHeaderButtonClick("edit") },
        { id: "add", label: "Add Widget", icon: Plus, onClick: () => handleHeaderButtonClick("add") },
      ],
    }
  }

  // Get content configuration - determines layout and content
  const getContentConfig = (): ModuleContentProps => {
    if (selectedTool) {
      // Tools can provide left sidebar content
      return {
        rightContent: (
          <ToolContent
            toolName={selectedTool}
            userRole={userRole}
            user={user!}
            onNavigateBack={() => handleToolSelect(null)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        ),
        hasLeftContent: false, // Tools don't provide left content by default
      }
    }

    if (selectedProject && selectedProjectData) {
      // Projects provide left sidebar content
      return {
        leftContent: (
          <ProjectContent
            projectId={selectedProject}
            projectData={selectedProjectData}
            userRole={userRole}
            user={user!}
            onNavigateBack={() => handleProjectSelect(null)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            renderMode="leftContent"
          />
        ),
        rightContent: (
          <ProjectContent
            projectId={selectedProject}
            projectData={selectedProjectData}
            userRole={userRole}
            user={user!}
            onNavigateBack={() => handleProjectSelect(null)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            renderMode="rightContent"
          />
        ),
        hasLeftContent: true,
      }
    }

    if (isITAdministrator && selectedModule) {
      // IT Command Center only when module is explicitly selected
      return {
        rightContent: (
          <ITCommandCenterContent
            user={user!}
            selectedModule={selectedModule}
            onModuleSelect={handleModuleSelect}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        ),
        hasLeftContent: false, // IT Command Center doesn't provide left content by default
      }
    }

    // Default dashboard for all users (including IT administrators when no module selected)
    return {
      rightContent: (
        <RoleDashboard
          userRole={userRole}
          user={user!}
          projects={projects}
          onProjectSelect={handleProjectSelect}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      ),
      hasLeftContent: false,
    }
  }

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

  const headerConfig = getHeaderConfig()
  const contentConfig = getContentConfig()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex flex-1">
        {/* Enhanced Project Sidebar with fluid navigation */}
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          collapsed={false} // Not used in new system, but kept for compatibility
          onToggleCollapsed={() => {}} // Not used in new system, but kept for compatibility
          userRole={userRole}
          onPanelStateChange={handleSidebarPanelStateChange}
          onModuleSelect={handleModuleSelect}
          onToolSelect={handleToolSelect}
          selectedModule={selectedModule}
          selectedTool={selectedTool}
        />

        {/* Main Content Area - Positioned to account for sidebar width */}
        <main
          className="flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: isMobile ? "0px" : `${sidebarWidth}px` }}
        >
          {/* Consistent Page Header */}
          <PageHeader
            userName={headerConfig.userName}
            moduleTitle={headerConfig.moduleTitle}
            subHead={headerConfig.subHead}
            tabs={headerConfig.tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            badges={headerConfig.badges}
            buttons={headerConfig.buttons}
          />

          {/* Main Content Container - 2 Column Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Column - 20% width (hidden if no content) */}
            {contentConfig.hasLeftContent && (
              <div className="w-1/5 border-r border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50/20 dark:bg-gray-900/20">
                <div className="p-4 space-y-1">{contentConfig.leftContent}</div>
              </div>
            )}

            {/* Right Column - 80% width (100% if no left content) */}
            <div
              className={`${
                contentConfig.hasLeftContent ? "w-4/5" : "w-full"
              } overflow-y-auto overflow-x-hidden min-w-0 max-w-full flex-shrink bg-white dark:bg-gray-950 flex flex-col`}
            >
              <div className="flex-1 p-4 min-w-0 w-full max-w-full overflow-hidden flex flex-col">
                <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">{contentConfig.rightContent}</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Container - Full width of window */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>© 2025 Hedrick Brothers Construction</span>
              <span className="text-gray-400">•</span>
              <span>HB Report Demo v3.0</span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                System Status: Operational
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {projects.length} Projects
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last Updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
