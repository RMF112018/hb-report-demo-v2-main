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

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useAuth } from "../../context/auth-context"
import { ProjectSidebar } from "./components/ProjectSidebar"
import { RoleDashboard } from "./components/RoleDashboard"
import ITCommandCenterContent from "./components/ITCommandCenterContent"
import { ToolContent } from "./components/ToolContent"
import ProjectContent from "./components/ProjectContent"
import { PageHeader } from "./components/PageHeader"
import type { PageHeaderTab } from "./components/PageHeader"
import { PresentationCarousel } from "../../components/presentation/PresentationCarousel"
import { PreconCarousel } from "../../components/presentation/PreconCarousel"
import { FinancialCarousel } from "../../components/presentation/FinancialCarousel"
import { FieldManagementCarousel } from "../../components/presentation/FieldManagementCarousel"
import { ComplianceCarousel } from "../../components/presentation/ComplianceCarousel"
import { ITCommandCenterCarousel } from "../../components/presentation/ITCommandCenterCarousel"
import intelTourSlides from "../../components/presentation/intelTourSlides"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"

// Mock data imports
import projectsData from "../../data/mock/projects.json"
import { filterProjectsByRole, getProjectStats } from "../../lib/project-access-utils"
import type { UserRole } from "../project/[projectId]/types/project"
import { ProjectPageCarousel } from "../../components/presentation/ProjectPageCarousel"

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
 * My Projects Component - Shows user's assigned projects
 */
interface MyProjectsProps {
  projects: any[]
  userRole: UserRole
  onProjectSelect: (projectId: string) => void
  selectedProject: string | null
}

const MyProjects: React.FC<MyProjectsProps> = ({ projects, userRole, onProjectSelect, selectedProject }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Get projects for the user based on role
  const userProjects = useMemo(() => {
    const activeProjects = projects.filter((p) => p.active)

    switch (userRole) {
      case "project-executive":
        return activeProjects.slice(0, 6) // First 6 active projects
      case "project-manager":
        // For PM, prioritize construction stage projects
        const constructionProjects = activeProjects.filter((p) => p.project_stage_name === "Construction")
        const otherProjects = activeProjects.filter((p) => p.project_stage_name !== "Construction")
        return [...constructionProjects, ...otherProjects].slice(0, 4) // Up to 4 projects
      default:
        return []
    }
  }, [projects, userRole])

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  // Get project status color
  const getProjectStatusColor = (project: any) => {
    if (!project.active) {
      return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200"
    }

    switch (project.project_stage_name) {
      case "Pre-Construction":
      case "Bidding":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200"
      case "BIM Coordination":
        return "bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200"
      case "Construction":
        return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200"
      case "Closeout":
        return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200"
      case "Warranty":
        return "bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200"
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200"
    }
  }

  if (userProjects.length === 0) {
    return null
  }

  return (
    <Card className="w-full mb-6 border-l-4 border-l-[#FA4616] bg-gradient-to-r from-[#FA4616]/5 to-transparent">
      <CardHeader className="px-6 !py-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" style={{ color: "#FA4616" }} />
            <div>
              <div className="text-sm font-semibold">My Projects</div>
              <div className="text-xs text-muted-foreground">{userProjects.length} active projects</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs border-[#0021A5]/20 text-[#0021A5]">
              {userProjects.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 hover:bg-[#FA4616]/10"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" style={{ color: "#FA4616" }} />
              ) : (
                <ChevronUp className="h-4 w-4" style={{ color: "#FA4616" }} />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userProjects.map((project) => (
              <Card
                key={project.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                  selectedProject === project.id
                    ? "border-[#FA4616] bg-[#FA4616]/5"
                    : "border-border hover:border-[#FA4616]/50"
                }`}
                onClick={() => onProjectSelect(project.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Project Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                        <p className="text-xs text-muted-foreground">#{project.project_number}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>

                    {/* Project Status */}
                    <Badge variant="secondary" className={`text-xs ${getProjectStatusColor(project)}`}>
                      {project.project_stage_name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

/**
 * Main Application Page component
 */
export default function MainApplicationPage() {
  const { user, isPresentationMode, viewingAs, switchRole, returnToPresentation } = useAuth()
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
  const [headerHeight, setHeaderHeight] = useState(140) // Default header height
  const [showIntelTour, setShowIntelTour] = useState(false)
  const [showPreconCarousel, setShowPreconCarousel] = useState(false)
  const [showFinancialCarousel, setShowFinancialCarousel] = useState(false)
  const [showFieldManagementCarousel, setShowFieldManagementCarousel] = useState(false)
  const [showComplianceCarousel, setShowComplianceCarousel] = useState(false)
  const [showITCommandCenterCarousel, setShowITCommandCenterCarousel] = useState(false)
  const [showProjectPageCarousel, setShowProjectPageCarousel] = useState(false)
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(320) // Default width in pixels
  const [isResizing, setIsResizing] = useState(false)
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

  // Intel Tour logic triggered by successful login
  useEffect(() => {
    if (mounted) {
      // Check if Intel tour should be triggered (set at login)
      const triggerTimestamp = localStorage.getItem("triggerIntelTour")
      const intelTourCompleted = localStorage.getItem("intelTourCompleted")
      const presentationMode = localStorage.getItem("presentationMode")

      console.log("🔍 Intel Tour check:", {
        triggerTimestamp: !!triggerTimestamp,
        intelTourCompleted: !!intelTourCompleted,
        presentationMode: !!presentationMode,
        mounted,
      })

      // Trigger Intel tour if:
      // 1. Trigger flag is set OR presentation mode is active
      // 2. Tour hasn't been completed yet
      if ((triggerTimestamp || presentationMode) && !intelTourCompleted) {
        console.log("🚀 Starting Intel Tour (3 seconds)")

        // Clean up the trigger flag
        localStorage.removeItem("triggerIntelTour")

        // Set timer for 3 seconds after main app loads
        const tourTimer = setTimeout(() => {
          setShowIntelTour(true)
          console.log("🎯 Intel Tour launched!")
        }, 3000) // 3 second delay

        return () => clearTimeout(tourTimer)
      } else {
        console.log("⏭️ Intel Tour skipped - conditions not met")
      }
    }
  }, [mounted])

  // Handle sidebar panel state changes - updates layout to account for sidebar width
  const handleSidebarPanelStateChange = (isExpanded: boolean, totalWidth: number) => {
    setSidebarWidth(totalWidth)
  }

  // Handle left panel resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
  }

  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return

    const newWidth = e.clientX - (isMobile ? 0 : sidebarWidth)
    const minWidth = 200
    const maxWidth = 600

    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setLeftPanelWidth(newWidth)
    }
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }

  // Add global mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResizeMove)
      document.addEventListener("mouseup", handleResizeEnd)

      return () => {
        document.removeEventListener("mousemove", handleResizeMove)
        document.removeEventListener("mouseup", handleResizeEnd)
      }
    }
  }, [isResizing])

  // Toggle left panel collapse
  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed(!isLeftPanelCollapsed)
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

    // Special handling for Staffing tool - trigger tour with 3-second delay
    if (toolName === "Staffing") {
      console.log("🎯 Staffing tool selected from sidebar - triggering tour with 3-second delay")

      // Set a flag to indicate the tour was triggered from sidebar navigation
      localStorage.setItem("staffingTourFromSidebar", "true")
      localStorage.setItem("staffingTourTimestamp", Date.now().toString())

      // Clear any existing tour flags to prevent conflicts
      localStorage.removeItem("execStaffingTour")

      console.log("💾 Staffing Tour: Set sidebar trigger flag and timestamp")
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

    // Check if user is in presentation mode and selected "pre-construction" tab
    if (isPresentationMode && tabId === "pre-construction") {
      // Trigger Pre-Construction carousel with 2-second delay
      setTimeout(() => {
        setShowPreconCarousel(true)
      }, 2000)
    }

    // Check if user is in presentation mode and selected "financial-management" tab
    if (isPresentationMode && tabId === "financial-management") {
      // Trigger Financial Management carousel with 2-second delay
      setTimeout(() => {
        setShowFinancialCarousel(true)
      }, 2000)
    }

    // Check if user is in presentation mode and selected "field-management" tab
    if (isPresentationMode && tabId === "field-management") {
      // Trigger Field Management carousel with 2-second delay
      setTimeout(() => {
        setShowFieldManagementCarousel(true)
      }, 2000)
    }

    // Check if user is in presentation mode and selected "compliance" tab
    if (isPresentationMode && tabId === "compliance") {
      // Trigger Compliance carousel with 2-second delay
      setTimeout(() => {
        setShowComplianceCarousel(true)
      }, 2000)
    }
  }

  const handleIntelTourComplete = () => {
    console.log("🏁 Intel Tour: Tour completed, marking as completed")
    // Mark tour as completed
    localStorage.setItem("intelTourCompleted", "true")

    // Hide the tour carousel
    setShowIntelTour(false)

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePreconCarouselComplete = () => {
    console.log("🏁 Pre-Construction Carousel: Tour completed")
    // Hide the Pre-Construction carousel
    setShowPreconCarousel(false)

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFinancialCarouselComplete = () => {
    console.log("🏁 Financial Management Carousel: Tour completed")
    // Hide the Financial Management carousel
    setShowFinancialCarousel(false)

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFieldManagementCarouselComplete = () => {
    console.log("🏁 Field Management Carousel: Tour completed")
    // Hide the Field Management carousel
    setShowFieldManagementCarousel(false)

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleComplianceCarouselComplete = () => {
    console.log("🏁 Compliance Carousel: Tour completed")
    // Hide the Compliance carousel
    setShowComplianceCarousel(false)

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleITCommandCenterCarouselComplete = () => {
    console.log("🏁 IT Command Center Carousel: Tour completed")
    // Hide the IT Command Center carousel
    setShowITCommandCenterCarousel(false)

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleProjectPageCarouselComplete = () => {
    setShowProjectPageCarousel(false)
  }

  // Handle manual carousel launch from PageHeader badge
  const handleCarouselLaunch = (carouselType: string) => {
    console.log(`🎠 Launching carousel: "${carouselType}" (length: ${carouselType.length})`)

    switch (carouselType) {
      case "hbi-intel-tour":
        // Clear any previous completion flags and launch Intel Tour
        localStorage.removeItem("intelTourCompleted")
        console.log("🧹 Intel Tour: Cleared completion flag, launching immediately")
        console.log("🎯 Intel Tour: Setting showIntelTour to true")
        setShowIntelTour(true)
        break
      case "login-presentation":
        // Navigate to login page to trigger presentation carousel
        router.push("/login?showPresentation=true")
        break
      case "executive-staffing-tour":
        console.log("✅ Executive Staffing Tour case matched!")
        // Set localStorage flag and navigate to executive staffing view
        localStorage.setItem("execStaffingTour", "true")
        console.log("💾 Executive Staffing Tour: localStorage flag set to:", localStorage.getItem("execStaffingTour"))
        // Add a timestamp to help with debugging
        localStorage.setItem("execStaffingTourTimestamp", Date.now().toString())
        console.log("⏰ Executive Staffing Tour: Timestamp set:", localStorage.getItem("execStaffingTourTimestamp"))
        // Switch to staffing tool and executive tab if not already there
        handleToolSelect("Staffing")
        handleTabChange("overview")
        console.log("🎯 Executive Staffing Tour: Navigation initiated to staffing view")
        // Log localStorage state after navigation
        setTimeout(() => {
          console.log("🕵️ Executive Staffing Tour: Post-navigation localStorage check:", {
            execStaffingTour: localStorage.getItem("execStaffingTour"),
            timestamp: localStorage.getItem("execStaffingTourTimestamp"),
          })
        }, 100)
        break
      case "it-command-center":
        console.log("✅ IT Command Center case matched!")
        setShowITCommandCenterCarousel(true)
        break
      default:
        console.log(`❌ Unknown carousel type: "${carouselType}" (length: ${carouselType.length})`)
    }
  }

  // Monitor showIntelTour state changes (for debugging if needed)
  useEffect(() => {
    console.log("🎬 Intel Tour: showIntelTour state changed to:", showIntelTour)
  }, [showIntelTour])

  // Get tabs for different content types
  const getTabsForContent = () => {
    if (selectedTool) {
      switch (selectedTool) {
        case "Staffing":
          // Role-based tab configuration for staffing tool
          if (userRole === "executive") {
            return [
              { id: "overview", label: "Overview" },
              { id: "assignments", label: "Assignments" },
            ]
          } else if (userRole === "project-executive") {
            return [
              { id: "portfolio", label: "Portfolio" },
              { id: "timeline", label: "Timeline" },
              { id: "analytics", label: "Analytics" },
              { id: "spcr", label: "SPCR Management" },
            ]
          } else if (userRole === "project-manager") {
            return [
              { id: "team", label: "Team Management" },
              { id: "timeline", label: "Timeline" },
              { id: "spcr", label: "SPCR Creation" },
              { id: "analytics", label: "Analytics" },
            ]
          } else {
            return [{ id: "overview", label: "Overview" }]
          }
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
        case "HR & Payroll":
          return [
            { id: "personnel", label: "Personnel" },
            { id: "recruiting", label: "Recruiting" },
            { id: "timesheets", label: "Timesheets" },
            { id: "expenses", label: "Expenses" },
            { id: "payroll", label: "Payroll" },
            { id: "benefits", label: "Benefits" },
            { id: "training", label: "Training" },
            { id: "compliance", label: "Compliance" },
            { id: "settings", label: "Settings" },
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
      // Check if project is in bidding stage
      const isBiddingStage = selectedProjectData.project_stage_name === "Bidding"

      if (isBiddingStage) {
        // Only show Core, Pre-Construction, Field Management, and Activity Feed tabs for bidding projects
        return [
          { id: "core", label: "Core" },
          { id: "documents", label: "Documents" },
          { id: "pre-construction", label: "Pre-Construction" },
          { id: "field-management", label: "Field Management" },
          { id: "activity-feed", label: "Activity Feed" },
        ]
      }

      // Default full tab set for non-bidding projects
      return [
        { id: "core", label: "Core" },
        { id: "documents", label: "Documents" },
        { id: "pre-construction", label: "Pre-Construction" },
        { id: "financial-management", label: "Financial Management" },
        { id: "field-management", label: "Field Management" },
        { id: "compliance", label: "Compliance" },
        { id: "warranty", label: "Warranty" },
        { id: "activity-feed", label: "Activity Feed" },
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
    // For presentation mode, use the viewing role for tab configuration
    const effectiveRole = isPresentationMode && viewingAs ? viewingAs : userRole

    if (effectiveRole === "admin") {
      return [
        { id: "overview", label: "IT Overview" },
        { id: "my-dashboard", label: "My Dashboard" },
        { id: "activity-feed", label: "Recent Activity" },
      ]
    } else if (effectiveRole === "executive" || effectiveRole === "presentation") {
      return [
        { id: "overview", label: "Ops Overview" },
        { id: "pre-con-overview", label: "Pre-Con Overview" },
        { id: "market-intelligence", label: "Market Intelligence" },
        { id: "financial-review", label: "Financial Review" },
        { id: "my-dashboard", label: "My Dashboard" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else if (effectiveRole === "project-executive") {
      return [
        { id: "action-items", label: "Action Items" },
        { id: "overview", label: "Ops Overview" },
        { id: "market-intelligence", label: "Market Intelligence" },
        { id: "financial-review", label: "Financial Review" },
        { id: "my-dashboard", label: "My Dashboard" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else if (effectiveRole === "project-manager") {
      return [
        { id: "action-items", label: "Action Items" },
        { id: "overview", label: "Ops Overview" },
        { id: "market-intelligence", label: "Market Intelligence" },
        { id: "financial-review", label: "Financial Review" },
        { id: "my-dashboard", label: "My Dashboard" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else if (effectiveRole === "hr-payroll") {
      return [
        { id: "hr-overview", label: "HR Overview" },
        { id: "my-dashboard", label: "My Dashboard" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    } else {
      // Default for other roles (estimator, etc.)
      return [
        { id: "pre-con-overview", label: "Pre-Con Overview" },
        { id: "bid-management", label: "Bid Management" },
        { id: "market-intelligence", label: "Market Intelligence" },
        { id: "my-dashboard", label: "My Dashboard" },
        { id: "activity-feed", label: "Activity Feed" },
      ]
    }
  }

  // Set initial tab based on user role
  useEffect(() => {
    if (mounted && !initialTabSet && userRole) {
      // Set default tab based on user role and current selection
      if (selectedProject) {
        // Check if project is in bidding stage
        const isBiddingStage = selectedProjectData?.project_stage_name === "Bidding"
        setActiveTab(isBiddingStage ? "pre-construction" : "core")
      } else if (selectedTool === "Staffing") {
        // Set role-specific default tab for staffing
        if (userRole === "executive") {
          setActiveTab("overview")
        } else if (userRole === "project-executive") {
          setActiveTab("portfolio")
        } else if (userRole === "project-manager") {
          setActiveTab("team")
        } else {
          setActiveTab("overview")
        }
      } else if (userRole === "project-executive" || userRole === "project-manager") {
        setActiveTab("action-items")
      } else if (userRole === "estimator") {
        setActiveTab("bid-management")
      } else if (userRole === "hr-payroll") {
        setActiveTab("hr-overview")
      } else {
        setActiveTab("overview")
      }
      setInitialTabSet(true)
    }
  }, [mounted, userRole, initialTabSet, selectedProject, selectedTool, selectedProjectData])

  // Handle project selection changes
  useEffect(() => {
    if (selectedProject) {
      // Check if project is in bidding stage
      const isBiddingStage = selectedProjectData?.project_stage_name === "Bidding"
      setActiveTab(isBiddingStage ? "pre-construction" : "core")
    }
  }, [selectedProject, selectedProjectData])

  // Handle tool selection changes
  useEffect(() => {
    if (selectedTool) {
      if (selectedTool === "Staffing") {
        // Set role-specific default tab for staffing
        if (userRole === "executive") {
          setActiveTab("overview")
        } else if (userRole === "project-executive") {
          setActiveTab("portfolio")
        } else if (userRole === "project-manager") {
          setActiveTab("team")
        } else {
          setActiveTab("overview")
        }
      } else if (selectedTool === "estimating") {
        // Set default tab for estimating tool
        setActiveTab("cost-summary")
      } else if (selectedTool === "HR & Payroll") {
        // Set default tab for HR & Payroll tool
        setActiveTab("personnel")
      } else {
        setActiveTab("overview")
      }
    }
  }, [selectedTool, userRole])

  // Restore saved selections on mount
  useEffect(() => {
    if (typeof window !== "undefined" && mounted) {
      // Check for saved selections in order of priority
      const savedTool = localStorage.getItem("selectedTool")
      const savedProject = localStorage.getItem("selectedProject")
      const savedModule = localStorage.getItem("selectedModule")
      const savedActiveTab = localStorage.getItem("activeTab")

      if (savedTool) {
        setSelectedTool(savedTool)
        // Restore activeTab if it was saved
        if (savedActiveTab) {
          setActiveTab(savedActiveTab)
        }
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

    // Build navigation state for enhanced breadcrumbs
    const navigationState = {
      selectedProject,
      selectedProjectName: selectedProjectData?.name,
      selectedModule,
      selectedTool,
      activeTab,
      activeTabLabel: getTabsForContent().find((tab) => tab.id === activeTab)?.label,
      projectStage: selectedProjectData?.project_stage_name,
      fieldManagementTool: getFieldManagementTool(),
      currentViewType: getCurrentViewType(),
      isProjectView: !!selectedProject,
      isToolView: !!selectedTool,
      isModuleView: !!selectedModule,
      isDashboardView: !selectedProject && !selectedTool && !selectedModule,
    }

    // Helper function to determine field management tool based on current state
    function getFieldManagementTool() {
      if (!selectedProject) return undefined

      // Check if we're in a field management context
      if (activeTab === "field-management") {
        // Check module title for specific tools
        if (selectedTool === "scheduler") return "scheduler"
        if (selectedTool === "constraints") return "constraints"
        if (selectedTool === "permit-log") return "permit-log"
        if (selectedTool === "field-reports") return "field-reports"

        // Default to scheduler if in field management tab
        return "scheduler"
      }

      return undefined
    }

    // Helper function to determine current view type
    function getCurrentViewType() {
      if (selectedProject && selectedProjectData) {
        switch (activeTab) {
          case "core":
            return "project-overview"
          case "field-management":
            return "field-management"
          case "financial-management":
            return "financial-management"
          case "pre-construction":
            return "pre-construction"
          case "compliance":
            return "compliance"
          case "warranty":
            return "warranty"
          default:
            return "project-view"
        }
      }

      if (selectedTool) {
        return `tool-${selectedTool}`
      }

      if (selectedModule) {
        return `module-${selectedModule}`
      }

      return "dashboard"
    }

    // Navigation callbacks
    const navigationCallbacks = {
      onNavigateToHome: () => {
        setSelectedProject(null)
        setSelectedModule(null)
        setSelectedTool(null)
        setActiveTab("overview")
        localStorage.removeItem("selectedProject")
        localStorage.removeItem("selectedModule")
        localStorage.removeItem("selectedTool")
        router.push("/main-app")
      },
      onNavigateToProject: (projectId: string) => {
        setSelectedProject(projectId)
        setSelectedModule(null)
        setSelectedTool(null)
        setActiveTab("core")
        localStorage.setItem("selectedProject", projectId)
        localStorage.removeItem("selectedModule")
        localStorage.removeItem("selectedTool")
      },
      onNavigateToModule: (moduleId: string) => {
        setSelectedProject(null)
        setSelectedModule(moduleId)
        setSelectedTool(null)
        setActiveTab("overview")
        localStorage.removeItem("selectedProject")
        localStorage.setItem("selectedModule", moduleId)
        localStorage.removeItem("selectedTool")
      },
      onNavigateToTool: (toolName: string) => {
        setSelectedProject(null)
        setSelectedModule(null)
        setSelectedTool(toolName)
        if (toolName === "Staffing") {
          setActiveTab("portfolio")
        } else if (toolName === "HR & Payroll") {
          setActiveTab("personnel")
        } else {
          setActiveTab("overview")
        }
        localStorage.removeItem("selectedProject")
        localStorage.removeItem("selectedModule")
        localStorage.setItem("selectedTool", toolName)
      },
      onNavigateToTab: (tabId: string) => {
        setActiveTab(tabId)
      },
    }

    if (selectedTool) {
      return {
        userName,
        moduleTitle: selectedTool.replace(/([A-Z])/g, " $1").trim(),
        subHead: `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)} management and analysis tools`,
        tabs: getTabsForContent(),
        navigationState,
        ...navigationCallbacks,
      }
    }

    if (selectedProject && selectedProjectData) {
      // Check if project is in bidding stage
      const isBiddingStage = selectedProjectData.project_stage_name === "Bidding"

      // Generate subHead based on project stage
      let subHead: string
      if (isBiddingStage) {
        // Calculate client bid due date (14 days from current date)
        const clientBidDueDate = new Date()
        clientBidDueDate.setDate(clientBidDueDate.getDate() + 14)
        const formattedDate = clientBidDueDate.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
        subHead = `${selectedProjectData.project_stage_name} • ${selectedProjectData.project_type_name} • Bid Due Date: ${formattedDate}`
      } else {
        subHead = `${selectedProjectData.project_stage_name} • ${selectedProjectData.project_type_name} • $${(
          selectedProjectData.contract_value / 1000000
        ).toFixed(1)}M`
      }

      return {
        userName,
        moduleTitle: selectedProjectData.name,
        subHead,
        tabs: getTabsForContent(),
        navigationState,
        ...navigationCallbacks,
      }
    }

    if (isITAdministrator && selectedModule) {
      const moduleTitle = selectedModule.replace(/-/g, " ")
      return {
        userName,
        moduleTitle,
        subHead: `${moduleTitle.charAt(0).toUpperCase() + moduleTitle.slice(1)} operations and monitoring`,
        tabs: getTabsForContent(),
        navigationState,
        ...navigationCallbacks,
      }
    }

    // Default dashboard (including IT administrators when no module selected)
    const roleLabel =
      userRole === "admin" ? "System Administrator" : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Access`

    // Check for specific tabs that need custom titles
    if (activeTab === "bid-management") {
      return {
        userName,
        moduleTitle: "Bid Management Dashboard",
        subHead:
          "Comprehensive project bidding and delivery tracking system with real-time BuildingConnected integration",
        tabs: getTabsForContent(),
        navigationState,
        ...navigationCallbacks,
      }
    }

    if (activeTab === "market-intelligence") {
      return {
        userName,
        moduleTitle: "Market Intelligence Dashboard",
        subHead:
          "HBI-powered market analysis, competitive positioning, and predictive insights for strategic decision-making",
        tabs: getTabsForContent(),
        navigationState,
        ...navigationCallbacks,
      }
    }

    // Default dashboard titles
    const dashboardTitle = userRole === "admin" ? "IT Administrator Dashboard" : "Dashboard"
    const dashboardSubHead =
      userRole === "admin"
        ? "IT administration dashboard with system overview and module access"
        : userRole === "hr-payroll"
        ? "HR & Payroll Management Dashboard"
        : `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} dashboard with personalized insights`

    return {
      userName,
      moduleTitle: userRole === "hr-payroll" ? "HR & Payroll Management Dashboard" : dashboardTitle,
      subHead: dashboardSubHead,
      tabs: getTabsForContent(),
      navigationState,
      ...navigationCallbacks,
    }
  }

  // Helper function to determine if dashboard should show left sidebar content
  const shouldShowDashboardLeftContent = (role: UserRole, tab: string): boolean => {
    // Project Executive: All dashboard views
    if (role === "project-executive") {
      return true
    }

    // Project Manager: All dashboard views
    if (role === "project-manager") {
      return true
    }

    // HR & Payroll Manager: No left panel for any dashboard views
    if (role === "hr-payroll") {
      return false
    }

    // Estimator: Only Pre-Con Overview and Activity Feed views
    if (role === "estimator") {
      return ["pre-con-overview", "activity-feed"].includes(tab)
    }

    return false
  }

  // Get content configuration - determines layout and content
  const getContentConfig = (): ModuleContentProps => {
    // Use effective role for presentation mode
    const effectiveRole = isPresentationMode && viewingAs ? (viewingAs as any) : userRole
    const isEffectiveITAdministrator = effectiveRole === "admin"

    if (selectedTool) {
      // Tools can provide left sidebar content
      return {
        rightContent: (
          <ToolContent
            toolName={selectedTool}
            userRole={effectiveRole}
            user={user!}
            onNavigateBack={() => handleToolSelect(null)}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        ),
        hasLeftContent: selectedTool === "estimating" && activeTab === "cost-summary", // Show sidebar for estimating cost-summary
      }
    }

    if (selectedProject && selectedProjectData) {
      // Projects provide left sidebar content
      return {
        leftContent: (
          <ProjectContent
            projectId={selectedProject}
            projectData={selectedProjectData}
            userRole={effectiveRole}
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
            userRole={effectiveRole}
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

    if (isEffectiveITAdministrator && selectedModule) {
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
    const dashboardHasLeftContent = shouldShowDashboardLeftContent(effectiveRole, activeTab)

    // Check if we should show My Projects section
    const shouldShowMyProjects =
      (effectiveRole === "project-executive" || effectiveRole === "project-manager") &&
      !selectedProject &&
      !selectedTool &&
      !selectedModule

    return {
      leftContent: dashboardHasLeftContent ? (
        <RoleDashboard
          userRole={effectiveRole}
          user={user!}
          projects={projects}
          onProjectSelect={handleProjectSelect}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          renderMode="leftContent"
        />
      ) : undefined,
      rightContent: (
        <div className="w-full">
          {shouldShowMyProjects && (
            <MyProjects
              projects={projects}
              userRole={effectiveRole}
              onProjectSelect={handleProjectSelect}
              selectedProject={selectedProject}
            />
          )}
          <RoleDashboard
            userRole={effectiveRole}
            user={user!}
            projects={projects}
            onProjectSelect={handleProjectSelect}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            renderMode="rightContent"
          />
        </div>
      ),
      hasLeftContent: dashboardHasLeftContent,
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
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden">
      {/* Enhanced Project Sidebar with fluid navigation */}
      <ProjectSidebar
        projects={projects}
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        collapsed={false} // Not used in new system, but kept for compatibility
        onToggleCollapsed={() => {}} // Not used in new system, but kept for compatibility
        userRole={isPresentationMode && viewingAs ? (viewingAs as any) : userRole}
        onPanelStateChange={handleSidebarPanelStateChange}
        onModuleSelect={handleModuleSelect}
        onToolSelect={handleToolSelect}
        selectedModule={selectedModule}
        selectedTool={selectedTool}
        onLaunchProjectPageCarousel={() => setShowProjectPageCarousel(true)}
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
          isPresentationMode={isPresentationMode}
          viewingAs={viewingAs}
          onRoleSwitch={switchRole}
          onReturnToPresentation={returnToPresentation}
          isSticky={true}
          onLaunchCarousel={handleCarouselLaunch}
        />
      </div>

      {/* Main Content Area - Positioned to account for sidebar width and header height */}
      <main
        className="flex-1 overflow-hidden flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isMobile ? "0px" : `${sidebarWidth}px`,
          paddingTop: `${headerHeight}px`, // Account for header height
          width: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth}px)`, // CRITICAL: Constrain width
          maxWidth: isMobile ? "100vw" : `calc(100vw - ${sidebarWidth}px)`, // CRITICAL: Prevent overflow
        }}
      >
        {/* Main Content Container - 2 Column Layout */}
        <div className="flex-1 flex overflow-hidden min-w-0 max-w-full relative">
          {/* Left Column - 20% width (hidden if no content) */}
          {contentConfig.hasLeftContent && !isLeftPanelCollapsed && (
            <div
              className="relative border-r border-gray-200 dark:border-gray-800 overflow-y-scroll overflow-x-hidden bg-gray-50/20 dark:bg-gray-900/20 scrollbar-hide min-w-0 max-w-full"
              style={{ width: `${leftPanelWidth}px` }}
            >
              <div className="p-4 space-y-1 min-w-0 max-w-full overflow-hidden">{contentConfig.leftContent}</div>

              {/* Resize Handle */}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                onMouseDown={handleResizeStart}
              />
            </div>
          )}

          {/* Collapsed Left Panel Indicator */}
          {contentConfig.hasLeftContent && isLeftPanelCollapsed && (
            <div className="relative w-8 border-r border-gray-200 dark:border-gray-800 bg-gray-50/20 dark:bg-gray-900/20"></div>
          )}

          {/* Control Buttons - Positioned over main content area */}
          {contentConfig.hasLeftContent && (
            <div className="absolute left-0 top-4 z-20 flex flex-col gap-2">
              {/* Collapse/Expand Toggle Button */}
              <button
                onClick={toggleLeftPanel}
                className="w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
                title={isLeftPanelCollapsed ? "Expand left panel" : "Collapse left panel"}
                style={{
                  left: isLeftPanelCollapsed ? "8px" : `${leftPanelWidth - 12}px`,
                }}
              >
                {isLeftPanelCollapsed ? (
                  <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronLeft className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          )}

          {/* Right Column - 80% width (100% if no left content) */}
          <div
            className={`${
              contentConfig.hasLeftContent && !isLeftPanelCollapsed ? "flex-1" : "w-full"
            } overflow-hidden min-w-0 max-w-full flex-shrink bg-white dark:bg-gray-950 flex flex-col scrollbar-hide`}
          >
            <div className="flex-1 p-4 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden flex flex-col">
              <div className="flex-1 min-w-0 w-full max-w-full overflow-hidden">{contentConfig.rightContent}</div>
            </div>
          </div>
        </div>

        {/* Footer Container - Positioned within main content area to respect sidebar width */}
        <footer
          className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-hidden min-w-0 max-w-full"
          style={{
            width: "100%", // Use full width of main content area
            maxWidth: "100%", // Prevent overflow
          }}
        >
          <div className="px-6 py-4 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center justify-between min-w-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-shrink">
                <span className="truncate">© 2025 Hedrick Brothers Construction</span>
                <span className="text-gray-400 flex-shrink-0">•</span>
                <span className="text-[#0021A5] font-medium flex-shrink-0">HB Report Demo v3.0</span>
                <span className="text-gray-400 flex-shrink-0">•</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Activity className="h-3 w-3 text-[#FA4616]" />
                  System Status: <span className="text-[#FA4616] font-medium">Operational</span>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-[#0021A5]" />
                  {projects.length} Projects
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#0021A5]" />
                  Last Updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Intel Tour Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard PresentationCarousel with Intel Tour slides for consistency */}
      {showIntelTour && (
        <>
          {(() => {
            console.log("🎬 Intel Tour: Rendering PresentationCarousel")
            return null
          })()}
          <PresentationCarousel slides={intelTourSlides} onComplete={handleIntelTourComplete} />
        </>
      )}

      {/* Pre-Construction Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard PreconCarousel with Precon slides for consistency */}
      {showPreconCarousel && (
        <>
          {(() => {
            console.log("🎬 Pre-Construction Carousel: Rendering PreconCarousel")
            return null
          })()}
          <PreconCarousel onComplete={handlePreconCarouselComplete} />
        </>
      )}

      {/* Financial Management Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard FinancialCarousel with Financial slides for consistency */}
      {showFinancialCarousel && (
        <>
          {(() => {
            console.log("🎬 Financial Management Carousel: Rendering FinancialCarousel")
            return null
          })()}
          <FinancialCarousel onComplete={handleFinancialCarouselComplete} />
        </>
      )}

      {/* Field Management Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard FieldManagementCarousel with Field Management slides for consistency */}
      {showFieldManagementCarousel && (
        <>
          {(() => {
            console.log("🎬 Field Management Carousel: Rendering FieldManagementCarousel")
            return null
          })()}
          <FieldManagementCarousel onComplete={handleFieldManagementCarouselComplete} />
        </>
      )}

      {/* Compliance Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard ComplianceCarousel with Compliance slides for consistency */}
      {showComplianceCarousel && (
        <>
          {(() => {
            console.log("🎬 Compliance Carousel: Rendering ComplianceCarousel")
            return null
          })()}
          <ComplianceCarousel onComplete={handleComplianceCarouselComplete} />
        </>
      )}

      {/* IT Command Center Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard ITCommandCenterCarousel with IT Command Center slides for consistency */}
      {showITCommandCenterCarousel && (
        <>
          {(() => {
            console.log("🎬 IT Command Center Carousel: Rendering ITCommandCenterCarousel")
            return null
          })()}
          <ITCommandCenterCarousel onComplete={handleITCommandCenterCarouselComplete} />
        </>
      )}

      {/* Project Page Carousel - Overlays entire dashboard for presentation users */}
      {/* Uses standard ProjectPageCarousel with Project Page slides for consistency */}
      {showProjectPageCarousel && (
        <>
          {(() => {
            console.log("🎬 Project Page Carousel: Rendering ProjectPageCarousel")
            return null
          })()}
          <ProjectPageCarousel onComplete={handleProjectPageCarouselComplete} />
        </>
      )}
    </div>
  )
}
