"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import {
  Search,
  Moon,
  Sun,
  ChevronDown,
  Building,
  Wrench,
  Archive,
  Menu,
  MessageCircle,
  ChevronLeft,
  X,
} from "lucide-react"
import { ProductivityPopover } from "./ProductivityPopover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useProjectContext } from "@/context/project-context"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import projectsData from "@/data/mock/projects.json"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Calendar, Users } from "lucide-react"

/**
 * Enhanced AppHeader Component with Mega-Menu Navigation
 *
 * Features horizontal mega-menu layouts similar to Procore's interface:
 * - Department mega-menu with role-based filtering
 * - Project stage mega-menu with 4-column layout
 * - Tool category mega-menu with 4-column categorization
 * - Enhanced UX with full-width expandable menus
 *
 * @returns {JSX.Element} Enhanced navigation header with mega-menus
 */
export const AppHeader = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  // State management
  const [notifications] = useState(3)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("operations")

  // Debug selected department changes
  useEffect(() => {
    console.log("AppHeader: selectedDepartment changed to:", selectedDepartment)
  }, [selectedDepartment])

  const [showProjectMenu, setShowProjectMenu] = useState(false)
  const [showToolMenu, setShowToolMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectModalContent, setProjectModalContent] = useState({
    title: "",
    description: "",
  })

  // IT Admin menu states
  const [showITToolsMenu, setShowITToolsMenu] = useState(false)
  const [showMainMenu, setShowMainMenu] = useState(false)

  // Mobile menu states
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mobileMenuView, setMobileMenuView] = useState<"main" | "projects" | "tools" | "ittools">("main")

  // Initialize department based on current URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      console.log("AppHeader: Initializing department based on path:", currentPath)
      if (currentPath.startsWith("/pre-con")) {
        console.log("AppHeader: Setting department to pre-construction")
        setSelectedDepartment("pre-construction")
      } else if (currentPath.startsWith("/archive")) {
        console.log("AppHeader: Setting department to archive")
        setSelectedDepartment("archive")
      } else {
        console.log("AppHeader: Setting department to operations")
        setSelectedDepartment("operations")
      }
    }
  }, [])

  // Listen for route changes to update department
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname
      console.log("AppHeader: Route changed, current path:", currentPath)
      if (currentPath.startsWith("/pre-con")) {
        console.log("AppHeader: Updating department to pre-construction")
        setSelectedDepartment("pre-construction")
      } else if (currentPath.startsWith("/archive")) {
        console.log("AppHeader: Updating department to archive")
        setSelectedDepartment("archive")
      } else {
        console.log("AppHeader: Updating department to operations")
        setSelectedDepartment("operations")
      }
    }

    // Listen for popstate events (back/forward buttons)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // Refs for click outside detection
  const headerRef = useRef<HTMLElement>(null)
  const projectMenuRef = useRef<HTMLDivElement>(null)
  const toolMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const projectMenuContentRef = useRef<HTMLDivElement>(null)
  const toolMenuContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Real project data from JSON file
  const projects = useMemo(() => {
    const allProjects = {
      id: "all",
      name: "All Projects",
      status: "active",
      project_stage_name: "All",
      budget: "$0",
      completion: 0,
    }

    const realProjects = projectsData.map((project: any) => ({
      id: project.project_id.toString(),
      name: project.name,
      status: project.active ? "active" : "inactive",
      project_stage_name: project.project_stage_name,
      budget: `$${(project.contract_value / 1000000).toFixed(1)}M`,
      completion: Math.round(
        project.duration > 0
          ? Math.min(
              100,
              ((new Date().getTime() - new Date(project.start_date).getTime()) /
                (1000 * 60 * 60 * 24) /
                project.duration) *
                100
            )
          : 0
      ),
      project_number: project.project_number,
    }))

    return [allProjects, ...realProjects]
  }, [])

  // Filtered project stages based on selected department
  const projectStages = useMemo(() => {
    switch (selectedDepartment) {
      case "operations":
        return ["Construction", "Closeout", "Warranty"]
      case "pre-construction":
        return ["Bidding", "Pre-Construction"]
      case "archive":
        return ["Closed"]
      default:
        return ["Construction", "Closeout", "Warranty"]
    }
  }, [selectedDepartment])

  // Helper function to determine the dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    if (!user) return "/dashboard" // Default or loading state

    // All users go to the main dashboard which handles role-specific content
    // The main dashboard page dynamically loads appropriate content based on user role
    switch (user.role) {
      case "executive":
      case "project-executive":
      case "project-manager":
      case "estimator":
      case "admin":
        return "/dashboard"
      default:
        return "/dashboard" // Fallback for any other roles
    }
  }, [user])

  /**
   * Reorganized tool categorization into 4 columns as requested
   * @type {Array<Object>}
   */
  const tools = useMemo(
    () => [
      // Core Tools
      {
        name: "Dashboard",
        href: getDashboardPath(), // Dynamically set dashboard path
        category: "Core Tools",
        description: "Project overview and analytics",
      },
      {
        name: "Reports",
        href: "/dashboard/reports",
        category: "Core Tools",
        description: "Comprehensive reporting dashboard with approval workflows",
        visibleRoles: ["project-manager", "project-executive", "executive", "admin"],
      },
      // Removed: Analytics
      {
        name: "Staffing",
        href: "/dashboard/staff-planning",
        category: "Core Tools",
        description: "Resource planning and scheduling",
      },
      {
        name: "Responsibility Matrix",
        href: "/responsibility-matrix",
        category: "Core Tools",
        description: "Role assignments and accountability",
      },
      {
        name: "Productivity",
        href: "/tools/productivity",
        category: "Core Tools",
        description: "Threaded messaging and task management",
      },

      // Financial Management
      {
        name: "Financial Hub",
        href: "/dashboard/financial-hub",
        category: "Financial Management",
        description: "Comprehensive financial management and analysis suite",
      },
      {
        name: "Procurement",
        href: "/dashboard/procurement",
        category: "Financial Management",
        description: "Subcontractor buyout and material procurement management",
      },
      // Removed: Change Management

      // Field Management
      {
        name: "Scheduler",
        href: "/dashboard/scheduler",
        category: "Field Management",
        description: "AI-powered project schedule generation and optimization",
      },
      // Removed: Schedule Monitor
      {
        name: "Constraints Log",
        href: "/dashboard/constraints-log",
        category: "Field Management",
        description: "Track and manage project constraints and resolutions",
      },
      {
        name: "Permit Log",
        href: "/dashboard/permit-log",
        category: "Field Management",
        description: "Permit tracking and compliance",
      },
      {
        name: "Field Reports",
        href: "/dashboard/field-reports",
        category: "Field Management",
        description: "Daily logs, manpower, safety, and quality reporting",
      },
      // Removed: Safety
      // Removed: Quality Control

      // Compliance
      {
        name: "Contract Documents",
        href: "/dashboard/contract-documents",
        category: "Compliance",
        description: "Contract document management and compliance tracking",
      },
      {
        name: "Trade Partners Database",
        href: "/dashboard/trade-partners",
        category: "Compliance",
        description: "Comprehensive subcontractor and vendor management system",
      },

      // Pre-Construction (filtered by department)
      {
        name: "Pre-Construction Dashboard",
        href: "/pre-con",
        category: "Pre-Construction",
        description: "Pre-construction command center and pipeline overview",
      },
      {
        name: "Business Development",
        href: "/pre-con#business-dev",
        category: "Pre-Construction",
        description: "Lead generation and pursuit management",
      },
      {
        name: "Estimating",
        href: "/estimating",
        category: "Pre-Construction",
        description: "Cost estimation and analysis tools",
      },
      {
        name: "Innovation & Digital Services",
        href: "/tools/coming-soon",
        category: "Pre-Construction",
        description: "BIM, VDC, and digital construction technologies",
      },

      // Warranty
      {
        name: "Coming Soon",
        href: "#",
        category: "Warranty",
        description: "Warranty management and tracking tools",
      },

      // Historical Projects
      {
        name: "Archive",
        href: "#",
        category: "Historical Projects",
        description: "Access completed project archives and historical data - Coming Soon",
      },
    ],
    [getDashboardPath] // Add getDashboardPath to dependencies
  )

  // IT Tools for IT Administrator role
  const itTools = useMemo(
    () => [
      // IT Management modules
      {
        name: "IT Command Center",
        href: "/it-command-center",
        category: "IT Management",
        description: "IT system overview and monitoring dashboard",
        icon: "Shield",
      },
      {
        name: "HB Intel Management",
        href: "/it/command-center/management",
        category: "IT Management",
        description: "Centralized admin hub for application-wide controls",
        icon: "Users",
      },
      {
        name: "Infrastructure Monitor",
        href: "/it/command-center/infrastructure",
        category: "IT Management",
        description: "Server and network infrastructure monitoring",
        icon: "Monitor",
      },
      {
        name: "Endpoint Management",
        href: "/it/command-center/endpoints",
        category: "IT Management",
        description: "Device management and patch deployment",
        icon: "Laptop",
      },
      {
        name: "SIEM & Events",
        href: "/it/command-center/siem",
        category: "IT Management",
        description: "Security event monitoring and analysis",
        icon: "AlertTriangle",
      },
      {
        name: "Email Security",
        href: "/it/command-center/email",
        category: "IT Management",
        description: "Email security and threat protection",
        icon: "Mail",
      },
      {
        name: "Asset Tracker",
        href: "/it/command-center/assets",
        category: "IT Management",
        description: "Asset and license lifecycle management",
        icon: "Package",
      },
      {
        name: "Governance",
        href: "/it/command-center/governance",
        category: "IT Management",
        description: "Change management and compliance tracking",
        icon: "Settings",
      },
      {
        name: "Backup & DR",
        href: "/it/command-center/backup",
        category: "IT Management",
        description: "Backup and disaster recovery management",
        icon: "Database",
      },
      {
        name: "AI Pipelines",
        href: "/it/command-center/ai-pipelines",
        category: "IT Management",
        description: "AI and analytics pipeline control",
        icon: "Brain",
      },
      {
        name: "Consultants",
        href: "/it/command-center/consultants",
        category: "IT Management",
        description: "SOC, server, compliance, and networking vendors",
        icon: "UserCheck",
      },
      // Quick Actions
      {
        name: "Coming Soon",
        href: "#",
        category: "Quick Actions",
        description: "Additional quick actions will be available soon",
        icon: "Clock",
      },
    ],
    []
  )

  // Utility functions
  const getUserInitials = useCallback(() => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }, [user])

  const hasPreConAccess = useCallback(() => {
    if (!user) return false
    // Corrected: Replaced 'c-suite' with 'executive'
    if (["executive", "project-executive", "estimator", "admin"].includes(user.role)) return true
    if (user.role === "project-manager") return user.permissions?.preConAccess === true
    return false
  }, [user])

  // Get project status color (keeping this for status badges)
  const getProjectStatusColor = useCallback((project: any) => {
    if (!project.active) {
      return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }

    // Color based on project stage
    switch (project.project_stage_name) {
      case "Pre-Construction":
      case "Bidding":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
      case "BIM Coordination":
        return "bg-purple-100 dark:bg-purple-950/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800"
      case "Construction":
        return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
      case "Closeout":
        return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
      case "Warranty":
        return "bg-orange-100 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800"
      case "Closed":
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
      default:
        return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }
  }, [])

  // Role-based category visibility
  const getVisibleCategories = useCallback(() => {
    const userRole = user?.role?.toLowerCase?.() || user?.role // Ensure case-insensitive comparison
    console.log("Determining visible categories for role:", userRole, "(original:", user?.role, ")")

    switch (userRole) {
      case "executive":
      case "project-executive":
      case "admin":
        // All categories visible
        return [
          "Core Tools",
          "Pre-Construction",
          "Financial Management",
          "Field Management",
          "Compliance",
          "Warranty",
          "Historical Projects",
        ]

      case "project-manager":
        // No Pre-Construction or Historical Projects
        return ["Core Tools", "Financial Management", "Field Management", "Compliance", "Warranty"]

      case "estimator":
        // Only Pre-Construction and Compliance - let's be extra explicit
        console.log("ESTIMATOR ROLE DETECTED - returning Pre-Construction and Compliance categories")
        return ["Pre-Construction", "Compliance"]

      default:
        // Default to all categories for unknown roles
        console.log("Unknown or missing role, defaulting to all categories")
        return [
          "Core Tools",
          "Pre-Construction",
          "Financial Management",
          "Field Management",
          "Compliance",
          "Warranty",
          "Historical Projects",
        ]
    }
  }, [user])

  // Enhanced filtered tools with role-based filtering (department context maintained for UI only)
  const filteredTools = useMemo(() => {
    const userRole = user?.role // Get current user's role
    const visibleCategories = getVisibleCategories()
    console.log(
      "Filtering tools for department:",
      selectedDepartment,
      "user role:",
      userRole,
      "visible categories:",
      visibleCategories
    )

    const filtered = tools.filter((tool) => {
      // Always show all role-appropriate tools regardless of current page/department
      // Department context is used only for UI presentation, not tool filtering
      const isDepartmentMatch = visibleCategories.includes(tool.category)

      // Filter by role visibility for individual tools
      const isRoleVisible = !tool.visibleRoles || (userRole && tool.visibleRoles.includes(userRole))

      const shouldInclude = isDepartmentMatch && isRoleVisible

      // Enhanced debugging for estimator role
      if (userRole === "estimator") {
        console.log(
          "Tool:",
          tool.name,
          "Category:",
          tool.category,
          "Dept:",
          selectedDepartment,
          "Visible cats:",
          visibleCategories,
          "Dept match:",
          isDepartmentMatch,
          "Role visible:",
          isRoleVisible,
          "Include:",
          shouldInclude
        )
      }

      return shouldInclude
    })

    console.log("Filtered tools count:", filtered.length, "for department:", selectedDepartment, "user role:", userRole)

    // Additional debugging for estimator role
    if (userRole === "estimator") {
      const complianceTools = filtered.filter((t) => t.category === "Compliance")
      const preconTools = filtered.filter((t) => t.category === "Pre-Construction")
      console.log(
        "Estimator - Compliance tools:",
        complianceTools.length,
        complianceTools.map((t) => t.name)
      )
      console.log(
        "Estimator - Pre-Construction tools:",
        preconTools.length,
        preconTools.map((t) => t.name)
      )
    }

    return filtered
  }, [selectedDepartment, tools, user, getVisibleCategories]) // Add getVisibleCategories to dependencies

  // Utility functions
  // ... (getUserInitials, hasPreConAccess, getProjectStatusColor functions defined above)

  // Event handlers with debugging

  const { projectId, projectName, setProjectId, clearProject } = useProjectContext()

  const handleProjectChange = useCallback(
    (projectId: string) => {
      console.log("Project changed to:", projectId)
      setSelectedProject(projectId)
      setProjectId(projectId) // <-- Sync with context
      setShowProjectMenu(false)

      if (typeof window !== "undefined") {
        localStorage.setItem("selectedProject", projectId)
      }

      // Navigate to Project Control Center for specific projects
      if (projectId !== "all" && !projectId.startsWith("all-")) {
        console.log("Navigating to Project Control Center for project:", projectId)
        router.push(`/project/${projectId}`)
        return
      }

      // Show informative modal with demo explanation for "all" projects
      const getProjectDisplayInfo = () => {
        if (projectId === "all") {
          return {
            title: "All Projects Selected",
            description:
              "In the final production version of this application, selecting this option would display data from all projects across your portfolio. The current demo shows sample data that is not filtered by project selection.",
          }
        }

        if (projectId.startsWith("all-")) {
          const stageName = projectId
            .replace("all-", "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
          return {
            title: `${stageName} Projects Selected`,
            description: `In the final production version of this application, selecting this option would filter all dashboard data to show only projects in the ${stageName.toLowerCase()} stage. This filter would persist as you navigate to other pages in the application until you change the project selection or log out. The current demo shows sample data that is not filtered by project selection.`,
          }
        }

        const selectedProject = projects.find((p) => p.id === projectId)
        return {
          title: `Project Filter Applied`,
          description: `In the final production version of this application, selecting "${
            selectedProject?.name || "this project"
          }" would filter all dashboard data to show only information related to this specific project. This filter would persist as you navigate to other pages in the application until you change the project selection or log out. The current demo shows sample data that is not filtered by project selection.`,
        }
      }

      const { title, description } = getProjectDisplayInfo()

      // Show modal instead of toast
      setProjectModalContent({ title, description })
      setShowProjectModal(true)

      // Dispatch event with enhanced details
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("projectChanged", {
            detail: {
              projectId,
              projectName: projects.find((p) => p.id === projectId)?.name || "All Projects",
              timestamp: new Date().toISOString(),
            },
          })
        )
      }
    },
    [projects, setProjectId, toast, router]
  )

  const handleToolNavigation = useCallback(
    (href: string) => {
      console.log("Tool navigation triggered:", href)
      setShowToolMenu(false)
      setShowProjectMenu(false)
      setShowUserMenu(false)

      // Add a small delay to ensure menu closes before navigation
      setTimeout(() => {
        console.log("Executing navigation to:", href)
        router.push(href)
      }, 100)
    },
    [router]
  )

  const handleLogout = useCallback(() => {
    console.log("User logging out")
    // Reset local state
    setSelectedProject("all")
    clearProject()
    // Auth context will handle clearing all localStorage
    logout()
    router.push("/login")
  }, [logout, router, clearProject])

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setShowProjectMenu(false)
    setShowToolMenu(false)
    setShowUserMenu(false)
    setShowITToolsMenu(false)
    setShowMainMenu(false)
    setShowMobileMenu(false)
    setMobileMenuView("main")
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is outside project menu
      if (
        showProjectMenu &&
        projectMenuContentRef.current &&
        !projectMenuContentRef.current.contains(target) &&
        !headerRef.current?.contains(target)
      ) {
        setShowProjectMenu(false)
      }

      // Check if click is outside tool menu
      if (
        showToolMenu &&
        toolMenuContentRef.current &&
        !toolMenuContentRef.current.contains(target) &&
        !headerRef.current?.contains(target)
      ) {
        setShowToolMenu(false)
      }

      // Check if click is outside user menu
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false)
      }

      // Check if click is outside IT admin menus
      if (showITToolsMenu && !headerRef.current?.contains(target)) {
        setShowITToolsMenu(false)
      }

      if (showMainMenu && !headerRef.current?.contains(target)) {
        setShowMainMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProjectMenu, showToolMenu, showUserMenu, showITToolsMenu, showMainMenu])

  // Restore saved project selection on mount and sync with context
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProject = localStorage.getItem("selectedProject")
      if (savedProject && savedProject !== "all") {
        console.log("Restoring saved project:", savedProject)
        setSelectedProject(savedProject)
        setProjectId(savedProject) // Sync with context
      }
    }
  }, [setProjectId])

  // Sync header state with project context on initial load
  useEffect(() => {
    if (projectId && projectId !== "all" && projectId !== selectedProject) {
      console.log("Syncing header with project context:", projectId)
      setSelectedProject(projectId)
    }
  }, [projectId, selectedProject])

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[100] flex h-20 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#1e3a8a] to-[#2a5298] px-8 shadow-lg backdrop-blur-sm"
        data-tour="app-header"
      >
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img src="/images/hb_logo_white.png" alt="HB Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-tight">HB Intel</span>
              <span className="text-xs text-blue-100 font-medium">Construction Intelligence</span>
            </div>
          </div>

          {/* Navigation Pills - Role-based */}
          {user?.role === "admin" ? (
            // IT Administrator Navigation
            <nav className="hidden lg:flex items-center space-x-2">
              {/* Combined Projects/Tools Menu */}
              <Button
                variant="ghost"
                size="default"
                className={`gap-3 max-w-64 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                  showMainMenu ? "bg-white/20 shadow-md" : ""
                } rounded-lg font-medium`}
                onClick={() => {
                  setShowMainMenu(!showMainMenu)
                  setShowITToolsMenu(false)
                  setShowUserMenu(false)
                }}
                aria-label="Main menu"
                aria-expanded={showMainMenu}
              >
                <Menu className="h-4 w-4" />
                <span className="truncate">Projects & Tools</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showMainMenu ? "rotate-180" : ""}`}
                />
              </Button>

              {/* IT Tools Menu */}
              <Button
                variant="ghost"
                size="default"
                className={`gap-3 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                  showITToolsMenu ? "bg-white/20 shadow-md" : ""
                } rounded-lg font-medium`}
                onClick={() => {
                  setShowITToolsMenu(!showITToolsMenu)
                  setShowMainMenu(false)
                  setShowUserMenu(false)
                }}
                aria-label="IT Tools menu"
                aria-expanded={showITToolsMenu}
              >
                <Archive className="h-4 w-4" />
                <span>IT Tools</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showITToolsMenu ? "rotate-180" : ""}`}
                />
              </Button>
            </nav>
          ) : (
            // Regular User Navigation
            <nav className="hidden lg:flex items-center space-x-2">
              {/* Project Picker */}
              <Button
                variant="ghost"
                size="default"
                className={`gap-3 max-w-64 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                  showProjectMenu ? "bg-white/20 shadow-md" : ""
                } ${selectedProject !== "all" ? "bg-white/10" : ""} rounded-lg font-medium`}
                onClick={() => {
                  setShowProjectMenu(!showProjectMenu)
                  setShowToolMenu(false)
                  setShowUserMenu(false)
                }}
                aria-label="Select project"
                aria-expanded={showProjectMenu}
                data-tour="projects-menu"
              >
                <Building className="h-4 w-4" />
                <span className="truncate">
                  {(() => {
                    if (selectedProject.startsWith("all-")) {
                      const stageName = selectedProject
                        .replace("all-", "")
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                      return `All ${stageName} Projects`
                    }
                    if (selectedProject === "all") {
                      return "Projects"
                    }
                    // Use project name from context first, fallback to finding in projects array
                    return projectName || projects.find((p) => p.id === selectedProject)?.name || "Projects"
                  })()}
                </span>
                {selectedProject !== "all" && (
                  <Badge variant="secondary" className="ml-1 border-white/30 bg-white/20 text-xs text-white shadow-sm">
                    {selectedProject.startsWith("all-") ? "Stage Filter" : "Project Active"}
                  </Badge>
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showProjectMenu ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Tool Picker */}
              <Button
                variant="ghost"
                size="default"
                className={`gap-3 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                  showToolMenu ? "bg-white/20 shadow-md" : ""
                } rounded-lg font-medium`}
                onClick={() => {
                  setShowToolMenu(!showToolMenu)
                  setShowProjectMenu(false)
                  setShowUserMenu(false)
                }}
                aria-label="Select tool"
                aria-expanded={showToolMenu}
                data-tour="tools-menu"
              >
                <Wrench className="h-4 w-4" />
                <span>Tools</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${showToolMenu ? "rotate-180" : ""}`}
                />
              </Button>
            </nav>
          )}
        </div>

        {/* Mobile Header (sm and below) */}
        <div className="flex sm:hidden items-center justify-between w-full">
          {/* HBI Logo - Left */}
          <div className="flex items-center">
            <span className="text-lg font-bold text-white">HBI</span>
          </div>

          {/* Menu Icon - Center */}
          <Button
            variant="ghost"
            size="default"
            className="text-white hover:bg-white/20 px-3 py-2 rounded-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* User Avatar - Right */}
          {user && (
            <Avatar className="h-8 w-8 ring-2 ring-white/20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
              <AvatarFallback className="bg-white text-[#1e3a8a] font-semibold text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Right Section - Search, Actions, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Beta Badge */}
          <Badge
            variant="secondary"
            className="hidden text-xs font-medium text-blue-800 dark:text-blue-200 sm:inline-flex bg-blue-100 dark:bg-blue-950/30 px-3 py-1 rounded-full"
          >
            Beta v2.1
          </Badge>

          {/* Desktop Search */}
          <div className="relative hidden xl:block" data-tour="search-bar">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white/60" />
            <Input
              placeholder="Search projects, tools, reports..."
              className="w-80 h-10 border-white/30 bg-white/15 pl-11 pr-4 placeholder:text-white/60 focus:border-white/50 focus:bg-white/25 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value
                  router.push(`/search?q=${encodeURIComponent(query)}`)
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 xl:hidden p-2.5 rounded-lg"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {/* Productivity */}
            <ProductivityPopover notifications={notifications} />
          </div>

          {/* User Dropdown */}
          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                className="h-11 px-3 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                onClick={() => {
                  setShowUserMenu(!showUserMenu)
                  setShowProjectMenu(false)
                  setShowToolMenu(false)
                  setShowITToolsMenu(false)
                  setShowMainMenu(false)
                }}
                aria-label="User menu"
                aria-expanded={showUserMenu}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                    <AvatarFallback className="bg-white text-[#1e3a8a] font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium text-white">{user.firstName}</span>
                    <span className="text-xs text-blue-100 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </div>
              </Button>

              {showUserMenu && (
                <div className="fixed right-8 top-24 z-[110] w-72 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl backdrop-blur-lg">
                  <div className="rounded-t-xl border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm capitalize text-gray-500 dark:text-gray-400">{user.role}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Online</div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/profile")
                      }}
                      className="w-full px-6 py-3 text-left text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push("/settings")
                      }}
                      className="w-full px-6 py-3 text-left text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>Account Settings</span>
                    </button>
                    <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      className="w-full px-6 py-3 text-left text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-3"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Menu Overlay */}
      {(showProjectMenu || showToolMenu || showMainMenu || showITToolsMenu) && (
        <div className="fixed inset-0 top-20 z-[104] bg-black/20 backdrop-blur-sm" onClick={closeAllMenus} />
      )}

      {/* Project Mega Menu */}
      {showProjectMenu && (
        <div
          ref={projectMenuContentRef}
          className="fixed left-0 right-0 top-20 z-[105] border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="mx-auto max-w-7xl px-8 py-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedDepartment === "archive" ? "Project Archive" : "Select Project by Stage"}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {selectedDepartment === "archive"
                  ? "View completed and closed projects"
                  : selectedDepartment === "pre-construction"
                  ? "Choose from projects in pre-construction phases"
                  : "Choose from active projects organized by construction phase"}
              </p>
            </div>

            <div
              className={`grid gap-8 ${
                selectedDepartment === "archive"
                  ? "grid-cols-1 max-w-md"
                  : selectedDepartment === "pre-construction"
                  ? "grid-cols-2 max-w-2xl"
                  : "grid-cols-3"
              }`}
            >
              {projectStages.map((stage) => (
                <div key={stage} className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {stage}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log("All projects button clicked for stage:", stage)
                        handleProjectChange(`all-${stage.toLowerCase().replace(/\s+/g, "-")}`)
                      }}
                      className={`mt-1 text-xs transition-colors underline-offset-2 hover:underline ${
                        selectedProject === `all-${stage.toLowerCase().replace(/\s+/g, "-")}`
                          ? "text-blue-800 dark:text-blue-200 font-medium underline"
                          : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      }`}
                    >
                      All {stage} Projects
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projects
                      .filter((p) => {
                        if (p.id === "all") return false // Don't show "All Projects" in stage columns

                        // Special handling for Pre-Construction stage to include BIM Coordination
                        if (stage === "Pre-Construction") {
                          return (
                            p.project_stage_name === "Pre-Construction" || p.project_stage_name === "BIM Coordination"
                          )
                        }

                        return p.project_stage_name === stage
                      })
                      .map((project) => (
                        <button
                          key={project.id}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log("Project button clicked:", project.name, project.id)
                            handleProjectChange(project.id)
                          }}
                          className={`w-full text-left rounded-lg border p-3 transition-colors ${
                            selectedProject === project.id
                              ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="truncate font-medium text-gray-900 dark:text-gray-100">
                                {project.name}
                              </span>
                              {project.id !== "all" && (
                                <Badge variant="secondary" className={`text-xs ${getProjectStatusColor(project)}`}>
                                  {project.project_stage_name}
                                </Badge>
                              )}
                            </div>
                            {project.id !== "all" && (
                              <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                                <div>Project #{(project as any).project_number || project.id}</div>
                                <div className="flex justify-between">
                                  <span>Budget: {project.budget}</span>
                                  <span>{project.completion}% Complete</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tools Mega Menu - Now with 4 columns */}
      {showToolMenu && (
        <div
          ref={toolMenuContentRef}
          className="fixed left-0 right-0 top-20 z-[105] border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-2xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="px-8 py-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {selectedDepartment === "pre-construction"
                    ? "Pre-Construction Tools"
                    : selectedDepartment === "archive"
                    ? "Archive Tools"
                    : "Construction Tools"}
                </h2>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {selectedDepartment === "pre-construction"
                    ? "Pre-construction pipeline and business development suite"
                    : selectedDepartment === "archive"
                    ? "Access completed project tools and documentation"
                    : "Access your project management suite"}
                </p>
              </div>
              {selectedDepartment === "pre-construction" && (
                <Badge
                  variant="secondary"
                  className="text-xs text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-950/30 px-2 py-1"
                >
                  Pre-Construction Suite
                </Badge>
              )}
              {selectedDepartment === "archive" && (
                <Badge
                  variant="secondary"
                  className="text-xs text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-950/30 px-2 py-1"
                >
                  Archive View
                </Badge>
              )}
            </div>

            {selectedDepartment === "pre-construction" ? (
              // Pre-Construction Tools - Dynamic categories based on role (same as operations)
              (() => {
                const visibleCategories = getVisibleCategories()
                const categoryConfig = [
                  {
                    name: "Core Tools",
                    color: "bg-hb-blue",
                    tools: filteredTools.filter((tool) => tool.category === "Core Tools"),
                  },
                  {
                    name: "Pre-Construction",
                    color: "bg-indigo-500",
                    tools: filteredTools.filter((tool) => tool.category === "Pre-Construction"),
                  },
                  {
                    name: "Financial Management",
                    color: "bg-green-500",
                    tools: filteredTools.filter((tool) => tool.category === "Financial Management"),
                  },
                  {
                    name: "Field Management",
                    color: "bg-hb-orange",
                    tools: filteredTools.filter((tool) => tool.category === "Field Management"),
                  },
                  {
                    name: "Compliance",
                    color: "bg-purple-500",
                    tools: filteredTools.filter((tool) => tool.category === "Compliance"),
                  },
                  {
                    name: "Warranty",
                    color: "bg-amber-500",
                    tools: filteredTools.filter((tool) => tool.category === "Warranty"),
                  },
                  {
                    name: "Historical Projects",
                    color: "bg-slate-500",
                    tools: filteredTools.filter((tool) => tool.category === "Historical Projects"),
                  },
                ]

                const filteredCategories = categoryConfig.filter(
                  (category) => visibleCategories.includes(category.name) && category.tools.length > 0
                )

                const gridCols =
                  filteredCategories.length <= 2
                    ? "grid-cols-2"
                    : filteredCategories.length <= 3
                    ? "grid-cols-3"
                    : filteredCategories.length <= 4
                    ? "grid-cols-4"
                    : "grid-cols-4"

                return (
                  <div className={`grid ${gridCols} gap-6`}>
                    {filteredCategories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                          <div className={`w-2 h-2 ${category.color} rounded-full`}></div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            {category.name}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          {category.tools.map((tool) => (
                            <button
                              key={tool.href}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (tool.href === "#") {
                                  console.log(`${tool.name} tool clicked - no navigation`)
                                  return
                                }
                                console.log("Navigating to tool:", tool.name, "at", tool.href)
                                handleToolNavigation(tool.href)
                              }}
                              className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                            >
                              <div className="space-y-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                                  {tool.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                  {tool.description}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()
            ) : selectedDepartment === "archive" ? (
              // Archive Tools - Limited Options
              <div className="max-w-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Archive Tools
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {[
                      {
                        name: "Reports",
                        href: "/dashboard/reports",
                        description: "View historical project reports and documentation",
                      },
                      {
                        name: "Financial Reports",
                        href: "/dashboard/financial-hub",
                        description: "Access closed project financial data",
                      },
                      {
                        name: "Document Archive",
                        href: "/tools/coming-soon",
                        description: "Browse project documentation library",
                      },
                    ].map((tool) => (
                      <button
                        key={tool.href}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log("Navigating to tool:", tool.name, "at", tool.href)
                          handleToolNavigation(tool.href)
                        }}
                        className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {tool.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Operations Tools - Dynamic categories based on role
              (() => {
                const visibleCategories = getVisibleCategories()
                const categoryConfig = [
                  {
                    name: "Core Tools",
                    color: "bg-hb-blue",
                    tools: filteredTools.filter((tool) => tool.category === "Core Tools"),
                  },
                  {
                    name: "Pre-Construction",
                    color: "bg-indigo-500",
                    tools: filteredTools.filter((tool) => tool.category === "Pre-Construction"),
                  },
                  {
                    name: "Financial Management",
                    color: "bg-green-500",
                    tools: filteredTools.filter((tool) => tool.category === "Financial Management"),
                  },
                  {
                    name: "Field Management",
                    color: "bg-hb-orange",
                    tools: filteredTools.filter((tool) => tool.category === "Field Management"),
                  },
                  {
                    name: "Compliance",
                    color: "bg-purple-500",
                    tools: filteredTools.filter((tool) => tool.category === "Compliance"),
                  },
                  {
                    name: "Warranty",
                    color: "bg-amber-500",
                    tools: filteredTools.filter((tool) => tool.category === "Warranty"),
                  },
                  {
                    name: "Historical Projects",
                    color: "bg-slate-500",
                    tools: filteredTools.filter((tool) => tool.category === "Historical Projects"),
                  },
                ]

                // Debug category filtering for estimator
                if (user?.role === "estimator") {
                  console.log(
                    "Estimator - All categories before filtering:",
                    categoryConfig.map((c) => ({ name: c.name, toolCount: c.tools.length }))
                  )
                  console.log("Estimator - Visible categories:", visibleCategories)
                }

                const filteredCategories = categoryConfig.filter(
                  (category) => visibleCategories.includes(category.name) && category.tools.length > 0
                )

                if (user?.role === "estimator") {
                  console.log(
                    "Estimator - Final filtered categories:",
                    filteredCategories.map((c) => ({ name: c.name, toolCount: c.tools.length }))
                  )
                }

                const gridCols =
                  filteredCategories.length <= 2
                    ? "grid-cols-2"
                    : filteredCategories.length <= 3
                    ? "grid-cols-3"
                    : filteredCategories.length <= 4
                    ? "grid-cols-4"
                    : "grid-cols-4"

                return (
                  <div className={`grid ${gridCols} gap-6`}>
                    {filteredCategories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                          <div className={`w-2 h-2 ${category.color} rounded-full`}></div>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            {category.name}
                          </h3>
                        </div>
                        <div className="space-y-1">
                          {category.tools.map((tool) => (
                            <button
                              key={tool.href}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (tool.href === "#") {
                                  // Handle "Coming Soon" or "Archive" - no navigation
                                  console.log(`${tool.name} tool clicked - no navigation`)
                                  return
                                }
                                console.log("Navigating to tool:", tool.name, "at", tool.href)
                                handleToolNavigation(tool.href)
                              }}
                              className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                            >
                              <div className="space-y-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-hb-blue transition-colors">
                                  {tool.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                  {tool.description}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()
            )}
          </div>
        </div>
      )}

      {/* IT Tools Mega Menu */}
      {showITToolsMenu && (
        <div className="fixed left-0 right-0 top-20 z-[105] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">IT Tools</h2>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Access IT management modules and quick actions
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-xs text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-950/30 px-2 py-1"
              >
                IT Administrator
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* IT Management */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    IT Management
                  </h3>
                </div>
                <div className="space-y-1">
                  {itTools
                    .filter((tool) => tool.category === "IT Management")
                    .map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => {
                          if (tool.href !== "#") {
                            router.push(tool.href)
                            closeAllMenus()
                          }
                        }}
                        className="w-full group flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
                          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {tool.description}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-1">
                  {itTools
                    .filter((tool) => tool.category === "Quick Actions")
                    .map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => {
                          if (tool.href !== "#") {
                            router.push(tool.href)
                            closeAllMenus()
                          }
                        }}
                        className="w-full group flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-950/50 transition-colors">
                          <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {tool.description}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu for IT Admin (Combined Projects/Tools) */}
      {showMainMenu && (
        <div className="fixed left-0 right-0 top-20 z-[105] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects & Tools</h2>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Access project management and construction tools
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-xs text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-950/30 px-2 py-1"
              >
                IT Administrator
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Projects Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Projects
                  </h3>
                </div>
                <div className="space-y-1">
                  {projects.slice(0, 8).map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        handleProjectChange(project.id)
                        closeAllMenus()
                      }}
                      className={`w-full group flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedProject === project.id ? "bg-blue-50 dark:bg-blue-950/30" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 transition-colors">
                        <Building className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </div>
                        {project.id !== "all" && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {project.project_stage_name} • {project.budget}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    Construction Tools
                  </h3>
                </div>

                {/* Display all tool categories like the standard menu */}
                <div className="space-y-6">
                  {(() => {
                    const visibleCategories = getVisibleCategories()

                    // Apply the same filtering logic as the standard tools menu
                    const userRole = user?.role
                    const filteredToolsForCategories = tools.filter((tool: any) => {
                      // Check department match
                      const isDepartmentMatch =
                        selectedDepartment === "operations"
                          ? !["Pre-Construction", "Historical Projects"].includes(tool.category)
                          : selectedDepartment === "pre-construction"
                          ? ["Core Tools", "Pre-Construction"].includes(tool.category)
                          : selectedDepartment === "archive"
                          ? ["Historical Projects"].includes(tool.category)
                          : true

                      // Check role visibility
                      const isRoleVisible = !tool.visibleRoles || tool.visibleRoles.includes(userRole)

                      return isDepartmentMatch && isRoleVisible
                    })

                    const categoryConfig = [
                      {
                        name: "Core Tools",
                        color: "bg-blue-500",
                        tools: filteredToolsForCategories.filter((tool: any) => tool.category === "Core Tools"),
                      },
                      {
                        name: "Pre-Construction",
                        color: "bg-indigo-500",
                        tools: filteredToolsForCategories.filter((tool: any) => tool.category === "Pre-Construction"),
                      },
                      {
                        name: "Financial Management",
                        color: "bg-green-500",
                        tools: filteredToolsForCategories.filter(
                          (tool: any) => tool.category === "Financial Management"
                        ),
                      },
                      {
                        name: "Field Management",
                        color: "bg-orange-500",
                        tools: filteredToolsForCategories.filter((tool: any) => tool.category === "Field Management"),
                      },
                      {
                        name: "Compliance",
                        color: "bg-purple-500",
                        tools: filteredToolsForCategories.filter((tool: any) => tool.category === "Compliance"),
                      },
                      {
                        name: "Warranty",
                        color: "bg-amber-500",
                        tools: filteredToolsForCategories.filter((tool: any) => tool.category === "Warranty"),
                      },
                      {
                        name: "Historical Projects",
                        color: "bg-slate-500",
                        tools: filteredToolsForCategories.filter(
                          (tool: any) => tool.category === "Historical Projects"
                        ),
                      },
                    ]

                    const filteredCategories = categoryConfig.filter(
                      (category) => visibleCategories.includes(category.name) && category.tools.length > 0
                    )

                    return filteredCategories.map((category) => (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center gap-2 pb-1">
                          <div className={`w-1.5 h-1.5 ${category.color} rounded-full`}></div>
                          <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            {category.name}
                          </h4>
                        </div>
                        <div className="space-y-1 pl-3">
                          {category.tools.map((tool: any) => (
                            <button
                              key={tool.name}
                              onClick={() => {
                                if (tool.href !== "#") {
                                  router.push(tool.href)
                                  closeAllMenus()
                                }
                              }}
                              className="w-full group flex items-start space-x-2 px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                                <Wrench className="w-3 h-3 text-gray-500" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                  {tool.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                  {tool.description}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <>
          <div
            className="fixed inset-0 top-20 z-[104] bg-black/20 backdrop-blur-sm"
            onClick={() => setShowMobileSearch(false)}
          />
          <div className="fixed left-0 right-0 top-20 z-[105] border-b border-white/20 bg-gradient-to-r from-[#1e3a8a] to-[#2a5298] p-6 xl:hidden backdrop-blur-lg animate-in slide-in-from-top-2 duration-300">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/60" />
              <Input
                placeholder="Search projects, tools, reports..."
                className="w-full h-12 border-white/30 bg-white/15 pl-12 pr-4 placeholder:text-white/60 focus:border-white/50 focus:bg-white/25 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const query = (e.target as HTMLInputElement).value
                    router.push(`/search?q=${encodeURIComponent(query)}`)
                    setShowMobileSearch(false)
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 top-20 z-[104] bg-black/50 backdrop-blur-sm sm:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed left-0 right-0 top-20 z-[105] bg-white dark:bg-gray-900 sm:hidden animate-in slide-in-from-top-2 duration-300 shadow-lg rounded-b-lg">
            <div className="flex flex-col max-h-[80vh] overflow-y-auto">
              {/* Main Menu View */}
              {mobileMenuView === "main" && (
                <div className="p-4">
                  {/* Menu Items */}
                  <div className="space-y-2">
                    {/* IT Tools - Only for IT Admin */}
                    {user?.role === "admin" && (
                      <button
                        onClick={() => setMobileMenuView("ittools")}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Archive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">IT Tools</span>
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}

                    {/* Projects */}
                    <button
                      onClick={() => setMobileMenuView("projects")}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">Projects</span>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Tools */}
                    <button
                      onClick={() => setMobileMenuView("tools")}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">Tools</span>
                      </div>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 mt-4">
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                      {mounted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* IT Tools View */}
              {mobileMenuView === "ittools" && (
                <div className="p-6">
                  {/* IT Tools View Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500 rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">IT Tools</h2>
                  </div>

                  {/* IT Tools Categories */}
                  <div className="space-y-6">
                    {/* IT Management */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        IT Management
                      </h3>
                      <div className="space-y-2">
                        {itTools
                          .filter((tool) => tool.category === "IT Management")
                          .map((tool) => (
                            <button
                              key={tool.name}
                              onClick={() => {
                                if (tool.href !== "#") {
                                  router.push(tool.href)
                                  setShowMobileMenu(false)
                                }
                              }}
                              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{tool.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        {itTools
                          .filter((tool) => tool.category === "Quick Actions")
                          .map((tool) => (
                            <button
                              key={tool.name}
                              onClick={() => {
                                if (tool.href !== "#") {
                                  router.push(tool.href)
                                  setShowMobileMenu(false)
                                }
                              }}
                              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{tool.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects View */}
              {mobileMenuView === "projects" && (
                <div className="p-6">
                  {/* Projects View Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500 rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          handleProjectChange(project.id)
                          setShowMobileMenu(false)
                        }}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedProject === project.id
                            ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{project.name}</div>
                            {project.id !== "all" && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Project #{(project as any).project_number || project.id}
                              </div>
                            )}
                          </div>
                          {project.id !== "all" && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              {project.project_stage_name}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* IT Tools View */}
              {mobileMenuView === "ittools" && (
                <div className="p-4">
                  {/* IT Tools View Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-500" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">IT Tools</h2>
                  </div>

                  {/* IT Tools Categories */}
                  <div className="space-y-6">
                    {/* IT Management */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        IT Management
                      </h3>
                      <div className="space-y-2">
                        {itTools
                          .filter((tool) => tool.category === "IT Management")
                          .map((tool, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (tool.href !== "#") {
                                  router.push(tool.href)
                                  setShowMobileMenu(false)
                                  setMobileMenuView("main")
                                }
                              }}
                              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{tool.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Quick Actions
                      </h3>
                      <div className="space-y-2">
                        {itTools
                          .filter((tool) => tool.category === "Quick Actions")
                          .map((action, index) => (
                            <button
                              key={index}
                              className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              disabled={action.name === "Coming Soon"}
                            >
                              <div className="font-medium text-gray-400 mb-1">{action.name}</div>
                              <div className="text-sm text-gray-500">{action.description}</div>
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects View */}
              {mobileMenuView === "projects" && (
                <div className="p-4">
                  {/* Projects View Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-500" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          handleProjectChange(project.id)
                          setShowMobileMenu(false)
                          setMobileMenuView("main")
                        }}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedProject === project.id
                            ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{project.name}</div>
                            {project.id !== "all" && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Project #{(project as any).project_number || project.id}
                              </div>
                            )}
                          </div>
                          {project.id !== "all" && (
                            <Badge variant="secondary" className="text-xs ml-2">
                              {project.project_stage_name}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools View */}
              {mobileMenuView === "tools" && (
                <div className="p-6">
                  {/* Tools View Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <button
                      onClick={() => setMobileMenuView("main")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <svg
                        className="h-5 w-5 text-gray-500 rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Tools</h2>
                  </div>

                  {/* Tools Categories */}
                  <div className="space-y-6">
                    {(() => {
                      const visibleCategories = getVisibleCategories()
                      const userRole = user?.role
                      const filteredToolsForMobile = tools.filter((tool: any) => {
                        const isDepartmentMatch =
                          selectedDepartment === "operations"
                            ? !["Pre-Construction", "Historical Projects"].includes(tool.category)
                            : selectedDepartment === "pre-construction"
                            ? ["Core Tools", "Pre-Construction"].includes(tool.category)
                            : selectedDepartment === "archive"
                            ? ["Historical Projects"].includes(tool.category)
                            : true

                        const isRoleVisible = !tool.visibleRoles || tool.visibleRoles.includes(userRole)
                        return isDepartmentMatch && isRoleVisible
                      })

                      const categoryConfig = [
                        {
                          name: "Core Tools",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Core Tools"),
                        },
                        {
                          name: "Pre-Construction",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Pre-Construction"),
                        },
                        {
                          name: "Financial Management",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Financial Management"),
                        },
                        {
                          name: "Field Management",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Field Management"),
                        },
                        {
                          name: "Compliance",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Compliance"),
                        },
                        {
                          name: "Warranty",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Warranty"),
                        },
                        {
                          name: "Historical Projects",
                          tools: filteredToolsForMobile.filter((tool: any) => tool.category === "Historical Projects"),
                        },
                      ]

                      const filteredCategories = categoryConfig.filter(
                        (category) => visibleCategories.includes(category.name) && category.tools.length > 0
                      )

                      return filteredCategories.map((category) => (
                        <div key={category.name}>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                            {category.name}
                          </h3>
                          <div className="space-y-2">
                            {category.tools.map((tool: any) => (
                              <button
                                key={tool.name}
                                onClick={() => {
                                  if (tool.href !== "#") {
                                    router.push(tool.href)
                                    setShowMobileMenu(false)
                                  }
                                }}
                                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{tool.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
