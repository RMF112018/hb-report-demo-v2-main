/**
 * @fileoverview Enhanced Project Sidebar Component with Fluid Navigation
 * @module ProjectSidebar
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Enhanced sidebar navigation with perpetual collapsed state and expandable content panels
 * Mobile-friendly floating button interface for small devices
 */

"use client"

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../../components/ui/sheet"
import { useAuth } from "../../../context/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "../../../components/ui/use-toast"
import { ProductivityPopover } from "../../../components/layout/ProductivityPopover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { TeamsSlideOutPanel } from "../../../components/productivity/TeamsSlideOutPanel"
import { QualityWarrantyCarousel } from "../../../components/quality/QualityWarrantyCarousel"
import { ProjectPageCarousel } from "../../../components/presentation/ProjectPageCarousel"
import { CoreTabCarousel } from "../../../components/presentation/CoreTabCarousel"
import { HBIntelPitchCarousel } from "../../../components/presentation/HBIntelPitchCarousel"
import { PreconCarousel } from "../../../components/presentation/PreconCarousel"
import { FinancialCarousel } from "../../../components/presentation/FinancialCarousel"
import { FieldManagementCarousel } from "../../../components/presentation/FieldManagementCarousel"
import { ComplianceCarousel } from "../../../components/presentation/ComplianceCarousel"
import { ITCommandCenterCarousel } from "../../../components/presentation/ITCommandCenterCarousel"
import { HRCarousel } from "../../../components/presentation/HRCarousel"
import { PresentationCarousel } from "../../../components/presentation/PresentationCarousel"
import { slides as slideDefinitions } from "../../../components/presentation/slide-definitions"
import { intelTourSlides } from "../../../components/presentation/intelTourSlides"
import { safetySlides } from "../../../components/presentation/safetySlides"
import { qualitySlides } from "../../../components/presentation/qualitySlides"
import { executiveStaffingSlides } from "../../../components/presentation/executiveStaffingSlides"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import {
  Building,
  ChevronDown,
  ChevronRight,
  Search,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronUp,
  Menu,
  X,
  ArrowLeft,
  Bell,
  Microchip,
  Shield,
  Brain,
  Package,
  Database,
  Mail,
  Monitor,
  Gavel,
  Server,
  Drill,
  GitCompareArrows,
  MessageSquare,
  BriefcaseBusiness,
  UsersRound,
  DollarSign,
  Clock,
  UserPlus,
  GraduationCap,
  FileText,
  TrendingUp,
  Target,
  Users,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  UserCheck,
} from "lucide-react"

type UserRole =
  | "executive"
  | "project-executive"
  | "project-manager"
  | "superintendent"
  | "estimator"
  | "team-member"
  | "admin"
  | "viewer"
  | "presentation"
  | "hr-payroll"

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

interface ProjectSidebarProps {
  projects: ProjectData[]
  selectedProject: string | null
  onProjectSelect: (projectId: string | null) => void
  collapsed: boolean
  onToggleCollapsed: () => void
  userRole: UserRole
  onPanelStateChange?: (isExpanded: boolean, width: number) => void
  onModuleSelect?: (moduleId: string | null) => void
  onToolSelect?: (toolName: string | null) => void
  selectedModule?: string | null
  selectedTool?: string | null
  onLaunchProjectPageCarousel?: () => void
}

// Define sidebar categories
type SidebarCategory = "dashboard" | "projects" | "tools-menu" | "notifications" | "it-modules" | "hr-tools"

interface SidebarCategoryConfig {
  id: SidebarCategory
  label: string
  icon: React.ComponentType<{ className?: string }>
  tooltip: string
  adminOnly?: boolean
  executiveOnly?: boolean
  hrOnly?: boolean
}

const SIDEBAR_CATEGORIES: SidebarCategoryConfig[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, tooltip: "Return to Main Dashboard" },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness, tooltip: "Browse & Select Projects" },
  {
    id: "it-modules",
    label: "IT Modules",
    icon: Microchip,
    tooltip: "IT Command Center & System Management",
    adminOnly: true,
  },
  {
    id: "tools-menu",
    label: "Tools Menu",
    icon: Drill,
    tooltip: "Advanced Project Tools & Features",
    executiveOnly: true,
  },
  {
    id: "hr-tools",
    label: "HR & Payroll Tools",
    icon: UsersRound,
    tooltip: "HR & Payroll Management Tools",
    hrOnly: true,
  },
  { id: "notifications", label: "Notifications", icon: Bell, tooltip: "Messages, Tasks & System Alerts" },
]

// IT Modules configuration for IT Administrator
interface ITModuleConfig {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  status: "active" | "maintenance" | "planned"
}

// HR Tools configuration for HR & Payroll Manager
interface HRToolConfig {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  status: "active" | "maintenance" | "planned"
}

const HR_TOOLS: HRToolConfig[] = [
  {
    id: "personnel",
    label: "Personnel Management",
    description: "Employee records, org chart, and staff directory",
    icon: UsersRound,
    path: "/hr-payroll/personnel",
    status: "active",
  },
  {
    id: "recruiting",
    label: "Recruiting",
    description: "Job postings, candidate management, and hiring workflow",
    icon: UserPlus,
    path: "/hr-payroll/recruiting",
    status: "active",
  },
  {
    id: "timesheets",
    label: "Timesheets",
    description: "Time and attendance tracking, overtime management",
    icon: Clock,
    path: "/hr-payroll/timesheets",
    status: "active",
  },
  {
    id: "expenses",
    label: "Expenses",
    description: "Expense reports, reimbursements, and approvals",
    icon: DollarSign,
    path: "/hr-payroll/expenses",
    status: "active",
  },
  {
    id: "payroll",
    label: "Payroll",
    description: "Payroll processing, deductions, and payment tracking",
    icon: BriefcaseBusiness,
    path: "/hr-payroll/payroll",
    status: "active",
  },
  {
    id: "benefits",
    label: "Benefits",
    description: "Health plans, retirement, and enrollment management",
    icon: Shield,
    path: "/hr-payroll/benefits",
    status: "active",
  },
  {
    id: "training",
    label: "Training",
    description: "Certifications, training programs, and development",
    icon: GraduationCap,
    path: "/hr-payroll/training",
    status: "active",
  },
  {
    id: "compliance",
    label: "Compliance",
    description: "Regulatory requirements, audit trails, and monitoring",
    icon: FileText,
    path: "/hr-payroll/compliance",
    status: "active",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Performance reviews, goal setting, and feedback",
    icon: TrendingUp,
    path: "/hr-payroll/performance",
    status: "active",
  },
  {
    id: "settings",
    label: "Settings",
    description: "System preferences and user permissions",
    icon: Settings,
    path: "/hr-payroll/settings",
    status: "active",
  },
]

const IT_MODULES: ITModuleConfig[] = [
  {
    id: "ai-pipelines",
    label: "AI Pipelines",
    description: "AI model management and analytics pipeline monitoring",
    icon: Brain,
    path: "/it/command-center/ai-pipelines",
    status: "active",
  },
  {
    id: "assets",
    label: "Asset & License Tracker",
    description: "Hardware inventory and software license management",
    icon: Package,
    path: "/it/command-center/assets",
    status: "active",
  },
  {
    id: "backup",
    label: "Backup & Recovery",
    description: "Backup systems monitoring and disaster recovery",
    icon: Database,
    path: "/it/command-center/backup",
    status: "active",
  },
  {
    id: "consultants",
    label: "Consultants",
    description: "External vendor and consultant management",
    icon: User,
    path: "/it/command-center/consultants",
    status: "active",
  },
  {
    id: "email",
    label: "Email Security",
    description: "Email security monitoring and threat detection",
    icon: Mail,
    path: "/it/command-center/email",
    status: "active",
  },
  {
    id: "endpoints",
    label: "Endpoint Management",
    description: "Device security and endpoint protection",
    icon: Monitor,
    path: "/it/command-center/endpoints",
    status: "active",
  },
  {
    id: "governance",
    label: "Governance",
    description: "Change management and IT governance processes",
    icon: Gavel,
    path: "/it/command-center/governance",
    status: "active",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    description: "Network and server infrastructure monitoring",
    icon: Server,
    path: "/it/command-center/infrastructure",
    status: "active",
  },
  {
    id: "management",
    label: "HB Intel Management",
    description: "User and project management for HB Intel platform",
    icon: Settings,
    path: "/it/command-center/management",
    status: "active",
  },
  {
    id: "siem",
    label: "SIEM & Security",
    description: "Security event monitoring and incident response",
    icon: Shield,
    path: "/it/command-center/siem",
    status: "active",
  },
]

// Tools Menu Configuration - Based on app-header.tsx structure
interface ToolMenuConfig {
  name: string
  href: string
  category: string
  description: string
  visibleRoles?: string[]
}

const TOOLS_MENU: ToolMenuConfig[] = [
  // Core Tools
  {
    name: "Dashboard",
    href: "/dashboard",
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
  {
    name: "Market Intelligence",
    href: "/dashboard/market-intel",
    category: "Core Tools",
    description: "AI-powered market analysis, competitive positioning, and predictive insights",
    visibleRoles: ["executive", "project-executive", "project-manager", "estimator"],
  },

  // Field Management
  {
    name: "Scheduler",
    href: "/dashboard/scheduler",
    category: "Field Management",
    description: "AI-powered project schedule generation and optimization",
  },
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
  {
    name: "Safety",
    href: "/dashboard/safety",
    category: "Compliance",
    description: "Safety management, incident reporting, and compliance tracking",
  },
  {
    name: "Quality Control & Warranty",
    href: "/dashboard/quality-warranty",
    category: "Compliance",
    description: "Quality control processes, inspections, and warranty management",
  },

  // Pre-Construction
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

  // HR & Payroll Management
  {
    name: "HR & Payroll",
    href: "/hr-payroll",
    category: "HR & Payroll Management",
    description: "Comprehensive human resources and payroll management system",
    visibleRoles: ["hr-payroll", "admin"],
  },

  // Historical Projects
  {
    name: "Archive",
    href: "#",
    category: "Historical Projects",
    description: "Access completed project archives and historical data - Coming Soon",
  },
]

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  collapsed,
  onToggleCollapsed,
  userRole,
  onPanelStateChange,
  onModuleSelect,
  onToolSelect,
  selectedModule,
  selectedTool,
  onLaunchProjectPageCarousel,
}) => {
  const { user, logout, isPresentationMode, viewingAs, switchRole, returnToPresentation } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [productivityNotifications] = useState(3)
  const [showTeamsPanel, setShowTeamsPanel] = useState(false)
  const [showQualityCarousel, setShowQualityCarousel] = useState(false)
  const [qualityCarouselTimeout, setQualityCarouselTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showProjectPageCarousel, setShowProjectPageCarousel] = useState(false)
  const [projectPageCarouselTimeout, setProjectPageCarouselTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showCoreTabCarousel, setShowCoreTabCarousel] = useState(false)
  const [coreTabCarouselTimeout, setCoreTabCarouselTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showHBIntelPitchCarousel, setShowHBIntelPitchCarousel] = useState(false)

  // Additional carousel states for comprehensive presentation menu
  const [showSlideDefinitionsCarousel, setShowSlideDefinitionsCarousel] = useState(false)
  const [showIntelTourCarousel, setShowIntelTourCarousel] = useState(false)
  const [showPreconCarousel, setShowPreconCarousel] = useState(false)
  const [showFinancialCarousel, setShowFinancialCarousel] = useState(false)
  const [showFieldManagementCarousel, setShowFieldManagementCarousel] = useState(false)
  const [showComplianceCarousel, setShowComplianceCarousel] = useState(false)
  const [showExecutiveStaffingCarousel, setShowExecutiveStaffingCarousel] = useState(false)
  const [showSafetyCarousel, setShowSafetyCarousel] = useState(false)
  const [showITCommandCenterCarousel, setShowITCommandCenterCarousel] = useState(false)
  const [showHRCarousel, setShowHRCarousel] = useState(false)

  // New state for fluid navigation
  const [activeCategory, setActiveCategory] = useState<SidebarCategory | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState(false)
  const [activeSubCategory, setActiveSubCategory] = useState<SidebarCategory | "settings" | "tools" | null>(null)
  const [collapsedToolsCategories, setCollapsedToolsCategories] = useState<Set<string>>(
    new Set(["Core Tools", "Pre-Construction", "Compliance", "Warranty"])
  )

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null)
  const expandedContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // Check for mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // iPhone breakpoint
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
      // Cleanup timeouts on unmount
      if (qualityCarouselTimeout) {
        clearTimeout(qualityCarouselTimeout)
      }
      if (projectPageCarouselTimeout) {
        clearTimeout(projectPageCarouselTimeout)
      }
      if (coreTabCarouselTimeout) {
        clearTimeout(coreTabCarouselTimeout)
      }
    }
  }, [qualityCarouselTimeout, projectPageCarouselTimeout, coreTabCarouselTimeout])

  // Helper function to determine the dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    return "/main-app"
  }, [])

  // Utility functions
  const getUserInitials = useCallback(() => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error signing out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false)
      }
      if (activeCategory && expandedContentRef.current && !expandedContentRef.current.contains(target)) {
        // Check if click was on the collapsed sidebar
        const collapsedSidebar = document.getElementById("collapsed-sidebar")
        if (collapsedSidebar && !collapsedSidebar.contains(target)) {
          setActiveCategory(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu, activeCategory])

  // Get project status color
  const getProjectStatusColor = (project: ProjectData) => {
    if (!project.active) {
      return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
    }

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
  }

  // Group projects by stage
  const projectsByStage = useMemo(() => {
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project_number.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stages = new Map<string, ProjectData[]>()

    filtered.forEach((project) => {
      const stage = project.project_stage_name
      if (!stages.has(stage)) {
        stages.set(stage, [])
      }
      stages.get(stage)!.push(project)
    })

    // Sort projects within each stage by name
    stages.forEach((projects) => {
      projects.sort((a, b) => a.name.localeCompare(b.name))
    })

    return stages
  }, [projects, searchQuery])

  // Sort stages by logical order
  const sortedStages = Array.from(projectsByStage.entries()).sort(([a], [b]) => {
    const stageOrder = [
      "Pre-Construction",
      "BIM Coordination",
      "Bidding",
      "Construction",
      "Closeout",
      "Warranty",
      "Closed",
    ]
    return stageOrder.indexOf(a) - stageOrder.indexOf(b)
  })

  // Recently accessed projects (mock data based on user role)
  const recentlyAccessedProjects = useMemo(() => {
    const allProjects = projects.filter((p) => p.active)

    // Mock recently accessed based on user role and current projects
    switch (userRole) {
      case "executive":
      case "project-executive":
        return allProjects.slice(0, 2) // First 2 active projects
      case "project-manager":
        return allProjects.filter((p) => p.project_stage_name === "Construction").slice(0, 2)
      default:
        return allProjects.slice(0, 2)
    }
  }, [projects, userRole])

  // Filter categories based on user role
  const visibleCategories = useMemo(() => {
    return SIDEBAR_CATEGORIES.filter((category) => {
      // Hide notifications category (bell icon)
      if (category.id === "notifications") {
        return false
      }

      // For HR & Payroll Manager, only show dashboard and HR tools
      if (userRole === "hr-payroll") {
        return category.id === "dashboard" || category.id === "hr-tools"
      }

      if (category.adminOnly) {
        return userRole === "admin"
      }
      if (category.executiveOnly) {
        return userRole === "executive" || userRole === "project-executive"
      }
      if (category.hrOnly) {
        return false // already handled above
      }
      return true
    })
  }, [userRole])

  // Filter tools based on user role
  const filteredTools = useMemo(() => {
    return TOOLS_MENU.filter((tool) => {
      // Filter by role visibility for individual tools
      const isRoleVisible = !tool.visibleRoles || tool.visibleRoles.includes(userRole)

      // Hide specific tools
      if (tool.name === "Responsibility Matrix") {
        return false
      }

      if (tool.name === "Dashboard") {
        return false
      }

      if (tool.name === "Market Intelligence") {
        return false
      }

      if (tool.name === "Contract Documents") {
        return false
      }

      return isRoleVisible
    })
  }, [userRole])

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const categories = new Map<string, ToolMenuConfig[]>()

    // Hidden categories that should not appear in the UI
    const hiddenCategories = new Set(["Financial Management", "Field Management", "Historical Projects", "Warranty"])

    filteredTools.forEach((tool) => {
      const category = tool.category

      // Skip hidden categories
      if (hiddenCategories.has(category)) {
        return
      }

      if (!categories.has(category)) {
        categories.set(category, [])
      }
      categories.get(category)!.push(tool)
    })

    // Sort categories by logical order (excluding hidden categories)
    const categoryOrder = ["Core Tools", "Pre-Construction", "Compliance", "Warranty"]

    const sortedCategories = Array.from(categories.entries()).sort(([a], [b]) => {
      return categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
    })

    return sortedCategories
  }, [filteredTools])

  const toggleStageExpansion = (stage: string) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stage)) {
      newExpanded.delete(stage)
    } else {
      newExpanded.add(stage)
    }
    setExpandedStages(newExpanded)
  }

  const toggleToolsCategoryExpansion = (category: string) => {
    const newCollapsed = new Set(collapsedToolsCategories)
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category)
    } else {
      newCollapsed.add(category)
    }
    setCollapsedToolsCategories(newCollapsed)
  }

  // Notify parent when panel state changes
  useEffect(() => {
    if (onPanelStateChange && !isMobile) {
      // On desktop/tablet, sidebar is now fixed and doesn't affect document flow
      // Still notify parent for any layout adjustments they might need
      const isExpanded = activeCategory !== null
      const totalWidth = isExpanded ? 384 : 64 // collapsed sidebar or total width when expanded
      onPanelStateChange(isExpanded, totalWidth)
    }
  }, [activeCategory, isMobile, onPanelStateChange])

  // Handle category selection
  const handleCategorySelect = (category: SidebarCategory) => {
    if (category === "dashboard") {
      // Clear all selections to return to role-based dashboard main view
      onProjectSelect(null)
      onModuleSelect?.(null)
      onToolSelect?.(null)

      // Navigate to main-app to ensure correct URL
      router.push("/main-app")

      // Show confirmation toast
      toast({
        title: "Returned to Dashboard",
        description: "Showing your role-based dashboard main view",
        duration: 2000,
      })

      if (isMobile) {
        setMobileMenuOpen(false)
      } else {
        setActiveCategory(null)
      }
      return
    }

    if (isMobile) {
      setActiveSubCategory(category)
      setMobileSubMenuOpen(true)
    } else {
      setActiveCategory(activeCategory === category ? null : category)
    }
  }

  // Handle user avatar click
  const handleUserAvatarClick = () => {
    if (isMobile) {
      setActiveSubCategory("settings")
      setMobileSubMenuOpen(true)
    } else {
      setShowUserMenu(!showUserMenu)
    }
  }

  // Handle IT module navigation
  const handleITModuleClick = (moduleId: string) => {
    onModuleSelect?.(moduleId)

    if (isMobile) {
      setMobileMenuOpen(false)
      setMobileSubMenuOpen(false)
    } else {
      setActiveCategory(null)
    }
  }

  // Handle HR module navigation
  const handleHRModuleClick = (moduleId: string) => {
    // Navigate to HR & Payroll Suite page with module parameter
    router.push(`/hr-payroll?module=${moduleId}`)

    if (isMobile) {
      setMobileMenuOpen(false)
      setMobileSubMenuOpen(false)
    } else {
      setActiveCategory(null)
    }
  }

  // Handle quality carousel completion
  const handleQualityCarouselComplete = () => {
    setShowQualityCarousel(false)
    // Clear the timeout if it exists
    if (qualityCarouselTimeout) {
      clearTimeout(qualityCarouselTimeout)
      setQualityCarouselTimeout(null)
    }
  }

  // Handle project page carousel completion
  const handleProjectPageCarouselComplete = () => {
    setShowProjectPageCarousel(false)
    // Clear the timeout if it exists
    if (projectPageCarouselTimeout) {
      clearTimeout(projectPageCarouselTimeout)
      setProjectPageCarouselTimeout(null)
    }

    // DISABLED: Core Tab carousel trigger
    // // Trigger Core Tab carousel with 2-second delay
    // if (isPresentationMode) {
    //   const timeout = setTimeout(() => {
    //     setShowCoreTabCarousel(true)
    //   }, 2000)
    //   setCoreTabCarouselTimeout(timeout)
    // }
  }

  // Handle core tab carousel completion
  const handleCoreTabCarouselComplete = () => {
    setShowCoreTabCarousel(false)
    // Clear the timeout if it exists
    if (coreTabCarouselTimeout) {
      clearTimeout(coreTabCarouselTimeout)
      setCoreTabCarouselTimeout(null)
    }
  }

  // Handle HB Intel Pitch carousel completion
  const handleHBIntelPitchCarouselComplete = () => {
    setShowHBIntelPitchCarousel(false)
  }

  // Handle additional carousel completions
  const handleSlideDefinitionsCarouselComplete = () => {
    setShowSlideDefinitionsCarousel(false)
  }

  const handleIntelTourCarouselComplete = () => {
    setShowIntelTourCarousel(false)
  }

  const handlePreconCarouselComplete = () => {
    setShowPreconCarousel(false)
  }

  const handleFinancialCarouselComplete = () => {
    setShowFinancialCarousel(false)
  }

  const handleFieldManagementCarouselComplete = () => {
    setShowFieldManagementCarousel(false)
  }

  const handleComplianceCarouselComplete = () => {
    setShowComplianceCarousel(false)
  }

  const handleExecutiveStaffingCarouselComplete = () => {
    setShowExecutiveStaffingCarousel(false)
  }

  const handleSafetyCarouselComplete = () => {
    setShowSafetyCarousel(false)
  }

  const handleITCommandCenterCarouselComplete = () => {
    setShowITCommandCenterCarousel(false)
  }

  const handleHRCarouselComplete = () => {
    setShowHRCarousel(false)
  }

  // Helper function to handle project selection with carousel logic - DISABLED
  const handleProjectSelect = (projectId: string) => {
    // DISABLED: Project Page Carousel trigger
    // // Check if user is in presentation mode and a project is being selected
    // if (isPresentationMode && projectId) {
    //   // Clear any existing timeout
    //   if (projectPageCarouselTimeout) {
    //     clearTimeout(projectPageCarouselTimeout)
    //   }

    //   // Set 3-second delay before showing carousel
    //   const timeout = setTimeout(() => {
    //     setShowProjectPageCarousel(true)
    //   }, 3000)
    //   setProjectPageCarouselTimeout(timeout)
    // }

    // Call the original project selection function
    onProjectSelect(projectId)
  }

  // Update the carousel trigger logic to use the callback - DISABLED
  const triggerProjectPageCarousel = () => {
    // DISABLED: Project Page Carousel trigger
    // if (onLaunchProjectPageCarousel) {
    //   onLaunchProjectPageCarousel()
    // }
  }

  // Mobile floating button
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-[115]">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 z-[120]"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-full max-h-none rounded-none p-0">
            <div className="h-full flex flex-col">
              {/* Mobile Menu Header */}
              <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="text-white rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{ width: "2.5rem", height: "2.5rem", backgroundColor: "#FA4616" }}
                    >
                      HBI
                    </div>
                    <div>
                      <SheetTitle className="text-lg">HB Intel</SheetTitle>
                      <p className="text-sm text-muted-foreground">Project Control</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </SheetHeader>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {visibleCategories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={
                          category.id === "dashboard" &&
                          selectedProject === null &&
                          selectedModule === null &&
                          selectedTool === null
                            ? "default"
                            : "ghost"
                        }
                        onClick={() => handleCategorySelect(category.id)}
                        className="w-full justify-start h-12"
                      >
                        <IconComponent className="h-5 w-5 mr-3" />
                        {category.label}
                        {category.id === "notifications" && productivityNotifications > 0 && (
                          <Badge variant="destructive" className="ml-auto z-[125]">
                            {productivityNotifications}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}

                  {/* User Settings Button for Mobile */}
                  <Button variant="ghost" onClick={handleUserAvatarClick} className="w-full justify-start h-12">
                    <User className="h-5 w-5 mr-3" />
                    User Settings
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.firstName || "User"} />
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      {isPresentationMode && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {viewingAs
                            ? `Viewing as ${viewingAs.charAt(0).toUpperCase() + viewingAs.slice(1).replace("-", " ")}`
                            : "Presentation Mode"}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Show Microsoft Teams integration slide-out panel
                      setShowTeamsPanel(true)
                      setMobileMenuOpen(false)
                    }}
                    className="h-8 w-8 p-0 relative"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {productivityNotifications > 0 && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#FA4616] rounded-full z-[125]"></div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Submenu for Categories */}
        <Sheet open={mobileSubMenuOpen} onOpenChange={setMobileSubMenuOpen}>
          <SheetContent side="bottom" className="h-full max-h-none rounded-none p-0">
            <div className="h-full flex flex-col">
              {/* Submenu Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileSubMenuOpen(false)}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold">
                      {activeSubCategory === "projects"
                        ? "Projects"
                        : activeSubCategory === "tools"
                        ? "Tools"
                        : activeSubCategory === "tools-menu"
                        ? "Tools Menu"
                        : activeSubCategory === "notifications"
                        ? "Notifications"
                        : activeSubCategory === "it-modules"
                        ? "IT Modules"
                        : "Settings"}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMobileSubMenuOpen(false)
                      setMobileMenuOpen(false)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Submenu Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeSubCategory === "projects" && (
                  <div className="space-y-4">
                    {/* Recently Accessed */}
                    {recentlyAccessedProjects.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                          Recently Accessed
                        </h4>
                        <div className="space-y-1">
                          {recentlyAccessedProjects.map((project) => (
                            <Button
                              key={project.id}
                              variant={selectedProject === project.id ? "default" : "ghost"}
                              onClick={() => {
                                handleProjectSelect(project.id)
                                setMobileSubMenuOpen(false)
                                setMobileMenuOpen(false)
                              }}
                              className="w-full justify-start p-3 h-auto text-left"
                            >
                              <BriefcaseBusiness className="h-4 w-4 mr-3 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{project.name}</div>
                                <div className="text-xs text-muted-foreground">#{project.project_number}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
                      </div>
                    )}

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Project List */}
                    <div className="space-y-2">
                      {sortedStages.map(([stage, stageProjects]) => (
                        <div key={stage} className="space-y-1">
                          <Button
                            variant="ghost"
                            onClick={() => toggleStageExpansion(stage)}
                            className="w-full justify-start p-3 h-auto font-medium"
                          >
                            {expandedStages.has(stage) ? (
                              <ChevronDown className="h-4 w-4 mr-2" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2" />
                            )}
                            <span className="flex-1 text-left">{stage}</span>
                            <Badge variant="secondary" className="text-xs">
                              {stageProjects.length}
                            </Badge>
                          </Button>

                          {expandedStages.has(stage) && (
                            <div className="ml-6 space-y-1">
                              {stageProjects.map((project) => (
                                <Button
                                  key={project.id}
                                  variant={selectedProject === project.id ? "default" : "ghost"}
                                  onClick={() => {
                                    handleProjectSelect(project.id)
                                    setMobileSubMenuOpen(false)
                                    setMobileMenuOpen(false)
                                  }}
                                  className="w-full justify-start p-3 h-auto text-left"
                                >
                                  <BriefcaseBusiness className="h-4 w-4 mr-3 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{project.name}</div>
                                    <div className="text-xs text-muted-foreground">#{project.project_number}</div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubCategory === "tools" && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 p-4">
                      No tools available in this category.
                    </div>
                  </div>
                )}

                {activeSubCategory === "notifications" && (
                  <div className="space-y-2">
                    <div className="relative">
                      <ProductivityPopover
                        notifications={productivityNotifications}
                        className="w-full justify-start h-12 px-3"
                      />
                    </div>
                    <Button variant="ghost" className="w-full justify-start h-12">
                      <Bell className="h-5 w-5 mr-3" />
                      System Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-12">
                      <Bell className="h-5 w-5 mr-3" />
                      Project Alerts
                    </Button>
                  </div>
                )}

                {activeSubCategory === "it-modules" && (
                  <div className="space-y-2">
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                        IT Command Center
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Comprehensive IT infrastructure management and security monitoring
                      </p>
                    </div>
                    {IT_MODULES.map((module) => {
                      const ModuleIcon = module.icon
                      return (
                        <Button
                          key={module.id}
                          variant="ghost"
                          className="w-full justify-start px-3 py-3 h-auto text-left group hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => handleITModuleClick(module.id)}
                        >
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 mr-3">
                              <ModuleIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{module.label}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                {module.description}
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              <Badge variant={module.status === "active" ? "default" : "secondary"} className="text-xs">
                                {module.status}
                              </Badge>
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                )}

                {activeSubCategory === "hr-tools" && (
                  <div className="space-y-2">
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                        HR & Payroll Tools
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Comprehensive HR and payroll management tools
                      </p>
                    </div>
                    {HR_TOOLS.map((tool) => {
                      const ToolIcon = tool.icon
                      return (
                        <Button
                          key={tool.id}
                          variant="ghost"
                          className="w-full justify-start h-12 px-3"
                          onClick={() => {
                            handleHRModuleClick(tool.id)
                            setMobileSubMenuOpen(false)
                            setMobileMenuOpen(false)
                          }}
                        >
                          <ToolIcon className="h-5 w-5 mr-3" />
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm">{tool.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{tool.description}</div>
                          </div>
                          <Badge variant={tool.status === "active" ? "default" : "secondary"} className="ml-2 text-xs">
                            {tool.status}
                          </Badge>
                        </Button>
                      )
                    })}
                  </div>
                )}

                {activeSubCategory === "tools-menu" && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                        Advanced Tools Menu
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Comprehensive tools organized by category - tap categories to expand
                      </p>
                    </div>

                    {toolsByCategory.map(([category, tools]) => (
                      <div key={category} className="space-y-1">
                        <Button
                          variant="ghost"
                          onClick={() => toggleToolsCategoryExpansion(category)}
                          className="w-full justify-start p-3 h-auto font-medium text-gray-700 dark:text-gray-300"
                        >
                          {!collapsedToolsCategories.has(category) ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                          )}
                          <span className="flex-1 text-left">{category}</span>
                          <Badge variant="secondary" className="text-xs">
                            {tools.length}
                          </Badge>
                        </Button>

                        {!collapsedToolsCategories.has(category) && (
                          <div className="ml-6 space-y-1">
                            {tools.map((tool) => (
                              <Button
                                key={tool.name}
                                variant="ghost"
                                onClick={() => {
                                  // DISABLED: Quality Control & Warranty carousel trigger
                                  // // Check if Quality Control & Warranty is selected and trigger carousel
                                  // if (tool.name === "Quality Control & Warranty") {
                                  //   // Clear any existing timeout
                                  //   if (qualityCarouselTimeout) {
                                  //     clearTimeout(qualityCarouselTimeout)
                                  //   }

                                  //   // Set 3-second delay before showing carousel
                                  //   const timeout = setTimeout(() => {
                                  //     setShowQualityCarousel(true)
                                  //   }, 3000)
                                  //   setQualityCarouselTimeout(timeout)
                                  // }

                                  onToolSelect?.(tool.name)
                                  setActiveSubCategory(null) // Close the panel after selection
                                }}
                                className="w-full p-3 h-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <div className="w-full text-left">
                                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {tool.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                    {tool.description}
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeSubCategory === "settings" && (
                  <div className="space-y-2">
                    {/* Role Switching for Presentation Mode */}
                    {isPresentationMode && (
                      <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3">Switch Demo Role</p>
                        <div className="space-y-1">
                          <Button
                            variant={viewingAs === "executive" ? "default" : "ghost"}
                            className="w-full justify-start h-12"
                            onClick={() => switchRole("executive")}
                          >
                            Executive
                          </Button>
                          <Button
                            variant={viewingAs === "project-executive" ? "default" : "ghost"}
                            className="w-full justify-start h-12"
                            onClick={() => switchRole("project-executive")}
                          >
                            Project Executive
                          </Button>
                          <Button
                            variant={viewingAs === "project-manager" ? "default" : "ghost"}
                            className="w-full justify-start h-12"
                            onClick={() => switchRole("project-manager")}
                          >
                            Project Manager
                          </Button>
                          <Button
                            variant={viewingAs === "estimator" ? "default" : "ghost"}
                            className="w-full justify-start h-12"
                            onClick={() => switchRole("estimator")}
                          >
                            Estimator
                          </Button>
                          <Button
                            variant={viewingAs === "admin" ? "default" : "ghost"}
                            className="w-full justify-start h-12"
                            onClick={() => switchRole("admin")}
                          >
                            Admin
                          </Button>
                          {viewingAs && (
                            <Button
                              variant="outline"
                              className="w-full justify-start h-12 mt-2"
                              onClick={returnToPresentation}
                            >
                              Return to Presentation
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12"
                      onClick={() => router.push("/profile")}
                    >
                      <User className="h-5 w-5 mr-3" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12"
                      onClick={() => router.push("/settings")}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? <Sun className="h-5 w-5 mr-3" /> : <Moon className="h-5 w-5 mr-3" />}
                      Toggle Theme
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-12 text-red-600" onClick={handleLogout}>
                      <LogOut className="h-5 w-5 mr-3" />
                      Log out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  // Desktop/Tablet Layout
  if (!isMobile) {
    return (
      <div className="fixed top-0 left-0 z-[50] h-screen">
        {/* Sidebar Container - Dynamic width based on expanded state */}
        <div
          className={`
            bg-white 
            dark:bg-gray-900 
            border-r 
            border-gray-200 
            dark:border-gray-700 
            transition-all 
            duration-300 
            ease-in-out
            flex
            h-full
            shadow-lg
            ${activeCategory ? "w-[384px]" : "w-16"}
          `}
        >
          {/* Collapsed Sidebar - Always visible */}
          <aside
            id="collapsed-sidebar"
            className="w-16 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-[55]"
          >
            {/* Logo */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-full flex items-center justify-center">
                <div className="w-8 h-8 bg-[#FA4616] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HBI</span>
                </div>
              </div>
            </div>

            {/* Category Icons */}
            <div className="flex-1 p-3 space-y-2">
              {visibleCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <TooltipProvider key={category.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCategorySelect(category.id)}
                          className={`
                            w-full h-10 p-0 rounded-lg relative z-[60]
                            ${
                              activeCategory === category.id ||
                              (category.id === "dashboard" &&
                                selectedProject === null &&
                                selectedModule === null &&
                                selectedTool === null)
                                ? "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }
                          `}
                        >
                          <IconComponent className="h-4 w-4" />
                          {category.id === "notifications" && productivityNotifications > 0 && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#FA4616] rounded-full flex items-center justify-center z-[65]">
                              <span className="text-xs text-white font-bold">{productivityNotifications}</span>
                            </div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="z-[70]">
                        <p>{category.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>

            {/* Productivity Quick Access */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-10 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative z-[60]"
                        >
                          <GitCompareArrows className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" className="w-80 z-[80] max-h-96 overflow-y-auto">
                        <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100">
                          Presentation Options
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Why HB Intel? */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowSlideDefinitionsCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            <span>Why HB Intel?</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Welcome to HB Intel */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowIntelTourCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <span>Welcome to HB Intel</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Project Control Center */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowProjectPageCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-green-600" />
                            <span>Project Control Center</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Each Project's Core */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowCoreTabCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span>Each Project's Core</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Pre-Construction that Follows the Project */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowPreconCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-indigo-600" />
                            <span>Pre-Construction that Follows the Project</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Financial Management Centralized */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowFinancialCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span>Financial Management Centralized</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Everything from the Field */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowFieldManagementCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Drill className="h-4 w-4 text-yellow-600" />
                            <span>Everything from the Field</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Omnipresent Project Compliance */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowComplianceCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-red-600" />
                            <span>Omnipresent Project Compliance</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Modernized Staff Management */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowExecutiveStaffingCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-blue-600" />
                            <span>Modernized Staff Management</span>
                          </div>
                        </DropdownMenuItem>

                        {/* Safety, Quality Control, and Warranty in One Place */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowSafetyCarousel(true)
                            // Show quality carousel after safety completes
                            setTimeout(() => {
                              setShowQualityCarousel(true)
                            }, 100)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <span>Safety, Quality Control, and Warranty in One Place</span>
                          </div>
                        </DropdownMenuItem>

                        {/* IT Command Center */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowITCommandCenterCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4 text-cyan-600" />
                            <span>IT Command Center</span>
                          </div>
                        </DropdownMenuItem>

                        {/* HR & Payroll in Our Control */}
                        <DropdownMenuItem
                          onClick={() => {
                            setShowHRCarousel(true)
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-pink-600" />
                            <span>HR & Payroll in Our Control</span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-[70]">
                    <p>Presentation Options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Show Microsoft Teams integration slide-out panel
                        setShowTeamsPanel(true)
                      }}
                      className="w-full h-10 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative z-[60]"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {productivityNotifications > 0 && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#FA4616] rounded-full flex items-center justify-center z-[65]">
                          <span className="text-xs text-white font-bold">{productivityNotifications}</span>
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-[70]">
                    <p>Microsoft Teams & Productivity Tools</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* User Avatar */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="relative" ref={userMenuRef}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleUserAvatarClick}
                        className="w-full h-10 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-[60]"
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={user?.avatar} alt={user?.firstName || "User"} />
                          <AvatarFallback className="text-xs bg-[#FA4616] text-white">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-[70]">
                      <p>User Settings & Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute bottom-full left-16 mb-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[75]">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar} alt={user?.firstName || "User"} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/profile")
                          setShowUserMenu(false)
                        }}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          router.push("/settings")
                          setShowUserMenu(false)
                        }}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setTheme(theme === "dark" ? "light" : "dark")
                          setShowUserMenu(false)
                        }}
                      >
                        {theme === "dark" ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                        Toggle Theme
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          handleLogout()
                          setShowUserMenu(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Expandable Content Panel - Fixed positioned overlay */}
          {activeCategory && (
            <aside
              ref={expandedContentRef}
              className="w-80 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out shadow-xl z-[112]"
            >
              <div className="flex flex-col h-full">
                {/* Content Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {activeCategory === "projects"
                        ? "Projects"
                        : activeCategory === "tools-menu"
                        ? "Tools Menu"
                        : activeCategory === "notifications"
                        ? "Notifications"
                        : activeCategory === "it-modules"
                        ? "IT Modules"
                        : "Settings"}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto">
                  {activeCategory === "projects" && (
                    <div className="p-4 space-y-4">
                      {/* Recently Accessed */}
                      {recentlyAccessedProjects.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Recently Accessed
                          </h4>
                          <div className="space-y-1">
                            {recentlyAccessedProjects.map((project) => (
                              <Button
                                key={project.id}
                                variant={selectedProject === project.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleProjectSelect(project.id)}
                                className={`w-full justify-start px-3 py-2 h-auto text-left ${
                                  selectedProject === project.id
                                    ? "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
                                    : ""
                                }`}
                              >
                                <BriefcaseBusiness className="h-4 w-4 mr-3 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{project.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    #{project.project_number}
                                  </div>
                                </div>
                                <Badge variant="secondary" className={`text-xs ml-2 ${getProjectStatusColor(project)}`}>
                                  {project.project_stage_name}
                                </Badge>
                              </Button>
                            ))}
                          </div>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
                        </div>
                      )}

                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search projects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 h-8"
                        />
                      </div>

                      {/* Project Tree */}
                      <div className="space-y-0.5">
                        {sortedStages.map(([stage, stageProjects]) => (
                          <div key={stage}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleStageExpansion(stage)}
                              className="w-full justify-start px-2 py-1 h-auto font-medium text-gray-700 dark:text-gray-300"
                            >
                              {expandedStages.has(stage) ? (
                                <ChevronDown className="h-4 w-4 mr-2" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-2" />
                              )}
                              <span className="flex-1 text-left">{stage}</span>
                              <Badge variant="secondary" className="text-xs">
                                {stageProjects.length}
                              </Badge>
                            </Button>

                            {expandedStages.has(stage) && (
                              <div className="ml-4 space-y-0.5">
                                {stageProjects.map((project) => (
                                  <Button
                                    key={project.id}
                                    variant={selectedProject === project.id ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => handleProjectSelect(project.id)}
                                    className={`w-full justify-start px-3 py-1.5 h-auto text-left ${
                                      selectedProject === project.id
                                        ? "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
                                        : ""
                                    }`}
                                  >
                                    <BriefcaseBusiness className="h-4 w-4 mr-3 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate">{project.name}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        #{project.project_number}
                                      </div>
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className={`text-xs ml-2 ${getProjectStatusColor(project)}`}
                                    >
                                      {project.active ? "Active" : "Inactive"}
                                    </Badge>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCategory === "notifications" && (
                    <div className="p-4 space-y-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        You have {productivityNotifications} new messages & updates
                      </div>
                      <div className="relative">
                        <ProductivityPopover
                          notifications={productivityNotifications}
                          className="w-full justify-start h-auto py-2 px-3"
                        />
                      </div>
                      <Button variant="ghost" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-3" />
                        System Notifications
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-3" />
                        Project Alerts
                      </Button>
                    </div>
                  )}

                  {activeCategory === "it-modules" && (
                    <div className="p-4 space-y-4">
                      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          IT Command Center
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Comprehensive IT infrastructure management and security monitoring platform
                        </p>
                      </div>

                      <div className="space-y-2">
                        {IT_MODULES.map((module) => {
                          const ModuleIcon = module.icon
                          return (
                            <Button
                              key={module.id}
                              variant="ghost"
                              className="w-full justify-start px-3 py-3 h-auto text-left group hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => handleITModuleClick(module.id)}
                            >
                              <div className="flex items-center w-full">
                                <div className="flex-shrink-0 mr-3">
                                  <ModuleIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {module.label}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                    {module.description}
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                  <Badge
                                    variant={module.status === "active" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {module.status}
                                  </Badge>
                                </div>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeCategory === "hr-tools" && (
                    <div className="p-4 space-y-4">
                      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          HR & Payroll Tools
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Comprehensive HR and payroll management tools
                        </p>
                      </div>

                      <div className="space-y-2">
                        {HR_TOOLS.map((tool) => {
                          const ToolIcon = tool.icon
                          return (
                            <Button
                              key={tool.id}
                              variant="ghost"
                              className="w-full justify-start px-3 py-3 h-auto text-left group hover:bg-gray-100 dark:hover:bg-gray-800"
                              onClick={() => {
                                handleHRModuleClick(tool.id)
                                setActiveCategory(null)
                              }}
                            >
                              <div className="flex items-center w-full">
                                <div className="flex-shrink-0 mr-3">
                                  <ToolIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                    {tool.label}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                    {tool.description}
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ml-2">
                                  <Badge
                                    variant={tool.status === "active" ? "default" : "secondary"}
                                    className="text-xs"
                                  >
                                    {tool.status}
                                  </Badge>
                                </div>
                              </div>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {activeCategory === "tools-menu" && (
                    <div className="p-4 space-y-4">
                      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Advanced Tools Menu
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Comprehensive tools organized by category - click categories to expand
                        </p>
                      </div>

                      <div className="space-y-2">
                        {toolsByCategory.map(([category, tools]) => (
                          <div key={category} className="space-y-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleToolsCategoryExpansion(category)}
                              className="w-full justify-start px-2 py-1 h-auto font-medium text-gray-700 dark:text-gray-300"
                            >
                              {!collapsedToolsCategories.has(category) ? (
                                <ChevronDown className="h-4 w-4 mr-2" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-2" />
                              )}
                              <span className="flex-1 text-left">{category}</span>
                              <Badge variant="secondary" className="text-xs">
                                {tools.length}
                              </Badge>
                            </Button>

                            {!collapsedToolsCategories.has(category) && (
                              <div className="ml-4 space-y-1">
                                {tools.map((tool) => (
                                  <Button
                                    key={tool.name}
                                    variant="ghost"
                                    onClick={() => {
                                      // DISABLED: Quality Control & Warranty carousel trigger
                                      // // Check if Quality Control & Warranty is selected and trigger carousel
                                      // if (tool.name === "Quality Control & Warranty") {
                                      //   // Clear any existing timeout
                                      //   if (qualityCarouselTimeout) {
                                      //     clearTimeout(qualityCarouselTimeout)
                                      //   }

                                      //   // Set 3-second delay before showing carousel
                                      //   const timeout = setTimeout(() => {
                                      //     setShowQualityCarousel(true)
                                      //   }, 3000)
                                      //   setQualityCarouselTimeout(timeout)
                                      // }

                                      onToolSelect?.(tool.name)
                                      setActiveCategory(null) // Close the panel after selection
                                    }}
                                    className="w-full px-3 py-2 h-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <div className="w-full text-left">
                                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                                        {tool.name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                                        {tool.description}
                                      </div>
                                    </div>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Microsoft Teams Integration Slide-Out Panel */}
        <div className="z-[140]">
          <TeamsSlideOutPanel
            isOpen={showTeamsPanel}
            onClose={() => setShowTeamsPanel(false)}
            projectId={selectedProject || undefined}
            projectName={selectedProject ? projects.find((p) => p.id === selectedProject)?.name : undefined}
            userRole={userRole}
            currentUser={user}
          />
        </div>

        {/* Quality Control & Warranty Carousel */}
        {showQualityCarousel && <QualityWarrantyCarousel onComplete={handleQualityCarouselComplete} />}

        {/* Project Page Carousel */}
        {showProjectPageCarousel && <ProjectPageCarousel onComplete={handleProjectPageCarouselComplete} />}

        {/* Core Tab Carousel */}
        {showCoreTabCarousel && <CoreTabCarousel onComplete={handleCoreTabCarouselComplete} />}

        {/* HB Intel Pitch Carousel */}
        {showHBIntelPitchCarousel && <HBIntelPitchCarousel onComplete={handleHBIntelPitchCarouselComplete} />}

        {/* Additional Carousels for Comprehensive Presentation Menu */}
        {showSlideDefinitionsCarousel && (
          <div className="z-[9999]">
            {createPortal(
              <PresentationCarousel
                slides={slideDefinitions}
                onComplete={handleSlideDefinitionsCarouselComplete}
                ctaText="Return to HB Intel"
                ctaIcon={Building}
              />,
              document.body
            )}
          </div>
        )}

        {showIntelTourCarousel && (
          <div className="z-[9999]">
            {createPortal(
              <PresentationCarousel
                slides={intelTourSlides}
                onComplete={handleIntelTourCarouselComplete}
                ctaText="Return to HB Intel"
                ctaIcon={Brain}
              />,
              document.body
            )}
          </div>
        )}

        {showPreconCarousel && <PreconCarousel onComplete={handlePreconCarouselComplete} />}

        {showFinancialCarousel && <FinancialCarousel onComplete={handleFinancialCarouselComplete} />}

        {showFieldManagementCarousel && <FieldManagementCarousel onComplete={handleFieldManagementCarouselComplete} />}

        {showComplianceCarousel && <ComplianceCarousel onComplete={handleComplianceCarouselComplete} />}

        {showExecutiveStaffingCarousel && (
          <div className="z-[9999]">
            {createPortal(
              <PresentationCarousel
                slides={executiveStaffingSlides}
                onComplete={handleExecutiveStaffingCarouselComplete}
                ctaText="Return to Executive Staffing"
                ctaIcon={Users}
              />,
              document.body
            )}
          </div>
        )}

        {showSafetyCarousel && (
          <div className="z-[9999]">
            {createPortal(
              <PresentationCarousel
                slides={safetySlides}
                onComplete={handleSafetyCarouselComplete}
                ctaText="Return to Safety"
                ctaIcon={Shield}
              />,
              document.body
            )}
          </div>
        )}

        {showITCommandCenterCarousel && <ITCommandCenterCarousel onComplete={handleITCommandCenterCarouselComplete} />}

        {showHRCarousel && <HRCarousel onComplete={handleHRCarouselComplete} />}
      </div>
    )
  }
  return null
}
