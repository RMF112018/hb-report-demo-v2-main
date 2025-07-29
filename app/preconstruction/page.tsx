/**
 * @fileoverview Pre-Construction Dashboard Page
 * @module PreconstructionPage
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Pre-construction dashboard supporting all user roles with:
 * - Consistent page header across all modules
 * - 2-column main content area (25% left, 75% right)
 * - Full-width footer container
 * - Role-based pre-construction content
 * - Enhanced project navigation sidebar with integrated header functionality and fluid navigation
 * - Dynamic content rendering
 * - Perpetual collapsed sidebar with expandable content panels
 * - Pre-construction specific modules and tools
 */

"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useAuth } from "../../context/auth-context"
import { ProjectSidebar } from "../main-app/components/ProjectSidebar"
import { PageHeader } from "../main-app/components/PageHeader"
import type { PageHeaderTab } from "../main-app/components/PageHeader"
import { useRouter, usePathname } from "next/navigation"
import {
  Calendar,
  Users,
  Activity,
  Building,
  MapPin,
  DollarSign,
  Calendar as CalendarIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import BetaBDCommercialPipelineCard from "../../components/cards/beta/business-dev/BetaBDCommercialPipelineCard"
import BetaBDPublicSectorOpportunitiesCard from "../../components/cards/beta/business-dev/BetaBDPublicSectorOpportunitiesCard"

// Mock data imports
import projectsData from "../../data/mock/projects.json"
import { filterProjectsByRole } from "../../lib/project-access-utils"
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
 * Pre-Construction Dashboard Component
 */
export default function PreconstructionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // State management
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("business-development")
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
    // Not used in pre-construction context
  }

  // Handle tool selection
  const handleToolSelect = (toolName: string | null) => {
    // Not used in pre-construction context
  }

  // Handle tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)

    // Update URL to reflect the selected tab
    router.push(`/preconstruction/${tabId}`)
  }

  // Set initial tab based on URL path
  useEffect(() => {
    if (mounted && !initialTabSet && pathname) {
      const pathSegments = pathname.split("/")
      const tabFromPath = pathSegments[pathSegments.length - 1]

      if (tabFromPath && tabFromPath !== "preconstruction") {
        setActiveTab(tabFromPath)
      } else {
        setActiveTab("business-development")
      }
      setInitialTabSet(true)
    }
  }, [mounted, pathname, initialTabSet])

  // Get tabs for pre-construction content
  const getTabsForContent = (): PageHeaderTab[] => {
    return [
      { id: "business-development", label: "Business Development" },
      { id: "estimating", label: "Estimating" },
      { id: "marketing", label: "Marketing" },
      { id: "innovation", label: "Innovation & Digital Solutions" },
    ]
  }

  // Get header configuration
  const getHeaderConfig = () => {
    const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "User"

    // Navigation callbacks
    const navigationCallbacks = {
      onNavigateToHome: () => {
        setSelectedProject(null)
        setActiveTab("business-development")
        localStorage.removeItem("selectedProject")
        router.push("/main-app")
      },
      onNavigateToProject: (projectId: string) => {
        setSelectedProject(projectId)
        setActiveTab("business-development")
        localStorage.setItem("selectedProject", projectId)
      },
      onNavigateToModule: (moduleId: string) => {
        // Not used in pre-construction context
      },
      onNavigateToTool: (toolName: string) => {
        // Not used in pre-construction context
      },
      onNavigateToTab: (tabId: string) => {
        setActiveTab(tabId)
        router.push(`/preconstruction/${tabId}`)
      },
    }

    return {
      userName,
      moduleTitle: "Pre-Construction Dashboard",
      subHead: "Comprehensive pre-construction tools and pipeline management",
      tabs: getTabsForContent(),
      navigationState: {
        selectedProject,
        selectedProjectName: projects.find((p) => p.id === selectedProject)?.name,
        selectedModule: null,
        selectedTool: null,
        activeTab,
        activeTabLabel: getTabsForContent().find((tab) => tab.id === activeTab)?.label,
        currentViewType: "pre-construction",
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
          {activeTab === "business-development" && (
            <div className="space-y-6">
              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="w-full">
                  <BetaBDCommercialPipelineCard />
                </div>
                <div className="w-full">
                  <BetaBDPublicSectorOpportunitiesCard />
                </div>
              </div>
            </div>
          )}

          {activeTab === "estimating" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Active Bids</CardTitle>
                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">5</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Due this week</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Bid Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">$3.8M</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Across all bids</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Avg Bid Time</CardTitle>
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">4.2 days</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Per bid</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">72%</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Last 6 months</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bids</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Commercial Office", value: "$1.2M", status: "In Progress", due: "3 days" },
                      { name: "Residential Complex", value: "$850K", status: "Review", due: "5 days" },
                      { name: "Industrial Facility", value: "$2.1M", status: "Finalizing", due: "1 day" },
                    ].map((bid, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{bid.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {bid.value} • {bid.status}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          Due in {bid.due}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "marketing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      Active Proposals
                    </CardTitle>
                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">In development</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Brand Reach</CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">+24%</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">This quarter</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Content Created</CardTitle>
                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">32</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">This month</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Engagement Rate</CardTitle>
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">68%</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">+12% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Marketing Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Q1 Brand Awareness", status: "Active", reach: "15K", engagement: "68%" },
                      { name: "Digital Transformation", status: "Planning", reach: "8K", engagement: "45%" },
                      { name: "Sustainability Focus", status: "Active", reach: "12K", engagement: "72%" },
                    ].map((campaign, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {campaign.reach} reach • {campaign.engagement} engagement
                          </p>
                        </div>
                        <Badge
                          variant={campaign.status === "Active" ? "default" : "secondary"}
                          className={
                            campaign.status === "Active"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "innovation" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">AI Projects</CardTitle>
                    <Sparkles className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">In development</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      Digital Solutions
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Deployed</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                      Innovation Score
                    </CardTitle>
                    <Sparkles className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">87%</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Industry average: 72%</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Tech Adoption</CardTitle>
                    <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">94%</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Team adoption rate</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Innovation Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "AI-Powered Estimating", status: "Beta", progress: "85%", impact: "High" },
                      { name: "Digital Twin Platform", status: "Development", progress: "60%", impact: "Medium" },
                      { name: "Smart Safety System", status: "Pilot", progress: "40%", impact: "High" },
                    ].map((project, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {project.progress} complete • {project.impact} impact
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                        >
                          {project.status}
                        </Badge>
                      </div>
                    ))}
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
          <p className="text-muted-foreground">Loading pre-construction dashboard...</p>
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
