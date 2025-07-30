"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useAuth } from "../../../context/auth-context"
import { ProjectSidebar } from "../../main-app/components/ProjectSidebar"
import { PageHeader } from "../../main-app/components/PageHeader"
import type { PageHeaderTab } from "../../main-app/components/PageHeader"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Users, GraduationCap, MessageSquare, Award } from "lucide-react"

// Mock data imports
import projectsData from "../../../data/mock/projects.json"
import { filterProjectsByRole } from "../../../lib/project-access-utils"
import type { UserRole } from "../../project/[projectId]/types/project"

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
 * Collaboration & Coaching Page Component
 */
export default function CollaborationCoachingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // State management
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [initialTabSet, setInitialTabSet] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(64) // Default collapsed width
  const [headerHeight, setHeaderHeight] = useState(140) // Default header height

  const headerRef = useRef<HTMLDivElement>(null)

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

  // Measure header height dynamically
  useEffect(() => {
    if (headerRef.current) {
      const updateHeaderHeight = () => {
        const height = headerRef.current?.offsetHeight || 140
        setHeaderHeight(height)
      }

      updateHeaderHeight()

      // Update header height on resize
      window.addEventListener("resize", updateHeaderHeight)

      // Use ResizeObserver if available for more accurate tracking
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(updateHeaderHeight)
        resizeObserver.observe(headerRef.current)

        return () => {
          window.removeEventListener("resize", updateHeaderHeight)
          resizeObserver.disconnect()
        }
      }

      return () => window.removeEventListener("resize", updateHeaderHeight)
    }
  }, [mounted])

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
      case "presentation":
        return "presentation"
      case "hr-payroll":
        return "hr-payroll"
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

    // Filter based on user role
    let filteredProjects = filterProjectsByRole(allProjects, userRole)

    // For project executives, limit to 6 projects as specified in the layout
    if (userRole === "project-executive") {
      filteredProjects = filteredProjects.slice(0, 6)
    }

    return filteredProjects
  }, [userRole])

  // Handle project selection
  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId)

    // Save selection to localStorage
    if (typeof window !== "undefined") {
      if (projectId) {
        localStorage.setItem("selectedProject", projectId)
      } else {
        localStorage.removeItem("selectedProject")
      }
    }
  }

  // Handle module selection (for IT administrators)
  const handleModuleSelect = (moduleId: string | null) => {
    // Not used in this context
  }

  // Handle tool selection
  const handleToolSelect = (toolName: string | null) => {
    // Not used in this context
  }

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    // Don't change URL for tab changes - keep it as client-side state
  }

  // Set initial tab - always start with overview
  useEffect(() => {
    if (mounted && !initialTabSet) {
      setActiveTab("overview")
      setInitialTabSet(true)
    }
  }, [mounted, initialTabSet])

  // Get tabs for collaboration & coaching content
  const getTabsForContent = (): PageHeaderTab[] => {
    return [
      { id: "overview", label: "Overview" },
      { id: "team-collaboration", label: "Team Collaboration" },
      { id: "professional-development", label: "Professional Development" },
      { id: "mentoring", label: "Mentoring" },
    ]
  }

  // Get header configuration
  const getHeaderConfig = () => {
    const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"

    // Navigation callbacks
    const navigationCallbacks = {
      onNavigateToHome: () => {
        setSelectedProject(null)
        setActiveTab("overview")
        localStorage.removeItem("selectedProject")
        router.push("/main-app")
      },
      onNavigateToProject: (projectId: string) => {
        setSelectedProject(projectId)
        setActiveTab("overview")
        localStorage.setItem("selectedProject", projectId)
      },
      onNavigateToModule: (moduleId: string) => {
        // Not used in this context
      },
      onNavigateToTool: (toolName: string) => {
        // Not used in this context
      },
      onNavigateToTab: (tabId: string) => {
        setActiveTab(tabId)
        // Don't change URL for tab changes - keep it as client-side state
      },
    }

    return {
      userName,
      moduleTitle: "Collaboration & Coaching",
      subHead: "Team collaboration tools and professional development coaching",
      tabs: getTabsForContent(),
      navigationState: {
        selectedProject,
        selectedProjectName: projects.find((p) => p.id === selectedProject)?.name,
        selectedModule: null,
        selectedTool: null,
        activeTab,
        activeTabLabel: getTabsForContent().find((tab) => tab.id === activeTab)?.label,
        currentViewType: "collaboration-coaching",
        isProjectView: !!selectedProject,
        isToolView: false,
        isModuleView: false,
        isDashboardView: !selectedProject,
      },
      ...navigationCallbacks,
    }
  }

  // Get content configuration
  const getContentConfig = (): ModuleContentProps => {
    return {
      rightContent: (
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Coming Soon Content */}
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    Coming Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Users className="h-16 w-16 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Team collaboration tools and professional development coaching. This module will provide
                      comprehensive tools for team collaboration, professional development, and mentoring to enhance
                      team performance and growth.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 dark:text-white">Team Collaboration</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Collaborative tools and platforms</p>
                      </div>
                      <div className="text-center">
                        <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 dark:text-white">Professional Development</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Skills development and training</p>
                      </div>
                      <div className="text-center">
                        <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900 dark:text-white">Mentoring</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Mentorship and guidance programs</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "team-collaboration" && (
            <div className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Team Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Team collaboration features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "professional-development" && (
            <div className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Professional Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Professional development features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "mentoring" && (
            <div className="space-y-6">
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Mentoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Mentoring features coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
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
          <p className="text-muted-foreground">Loading collaboration & coaching...</p>
        </div>
      </div>
    )
  }

  const headerConfig = getHeaderConfig()
  const contentConfig = getContentConfig()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Enhanced Project Sidebar with fluid navigation */}
      <ProjectSidebar
        projects={projects}
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        collapsed={false}
        onToggleCollapsed={() => {}}
        userRole={userRole}
        onPanelStateChange={handleSidebarPanelStateChange}
        onModuleSelect={handleModuleSelect}
        onToolSelect={handleToolSelect}
        selectedModule={null}
        selectedTool={null}
        onLaunchProjectPageCarousel={() => {}}
      />

      {/* Sticky Page Header - Always visible at top */}
      <div
        className="fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out shadow-sm"
        style={{ left: isMobile ? "0px" : `${sidebarWidth}px` }}
        ref={headerRef}
      >
        <PageHeader
          userName={headerConfig.userName}
          moduleTitle={headerConfig.moduleTitle}
          subHead={headerConfig.subHead}
          tabs={headerConfig.tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          navigationState={headerConfig.navigationState}
          onNavigateToHome={headerConfig.onNavigateToHome}
          onNavigateToProject={headerConfig.onNavigateToProject}
          onNavigateToModule={headerConfig.onNavigateToModule}
          onNavigateToTool={headerConfig.onNavigateToTool}
          onNavigateToTab={headerConfig.onNavigateToTab}
          isPresentationMode={false}
          viewingAs={null}
          onRoleSwitch={() => {}}
          onReturnToPresentation={() => {}}
          isSticky={true}
          onLaunchCarousel={() => {}}
        />
      </div>

      {/* Main Content Area - Positioned to account for sidebar width and header height */}
      <main
        className="flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isMobile ? "0px" : `${sidebarWidth}px`,
          paddingTop: `${headerHeight}px`,
          width: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth}px)`,
          maxWidth: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth}px)`,
        }}
      >
        {/* Main Content Container - Full Width Layout */}
        <div className="flex-1 flex overflow-hidden min-w-0 max-w-full relative">
          {/* Main Content Area - Full Width */}
          <div className="w-full overflow-hidden min-w-0 max-w-full flex-shrink bg-white dark:bg-gray-950 flex flex-col scrollbar-hide">
            <div className="flex-1 p-4 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden flex flex-col">
              <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">{contentConfig.rightContent}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
