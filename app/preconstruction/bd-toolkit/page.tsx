"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useAuth } from "../../../context/auth-context"
import { ProjectSidebar } from "../../main-app/components/ProjectSidebar"
import { PageHeader } from "../../main-app/components/PageHeader"
import type { PageHeaderTab } from "../../main-app/components/PageHeader"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  Wrench,
  FileText,
  Calculator,
  Presentation,
  Target,
  CheckSquare,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Star,
  Building2,
  DollarSign,
  BarChart3,
  Zap,
  BookOpen,
  Settings,
  ExternalLink,
  Award,
  Briefcase,
  Download,
  File,
  FolderOpen,
  Search,
  Filter,
  Percent,
  Clock3,
  UserCheck,
  FileSpreadsheet,
  Palette,
  Trophy,
  Eye,
  CalendarDays,
} from "lucide-react"

// Mock data imports
import projectsData from "../../../data/mock/projects.json"
import resourcesData from "../../../data/mock/resources.json"
import { filterProjectsByRole } from "../../../lib/project-access-utils"
import type { UserRole } from "../../project/[projectId]/types/project"

// Mock BD Toolkit Data
const mockPursuitData = {
  activeTargets: 12,
  completedThisMonth: 8,
  totalValue: 45000000,
  winRate: 68,
  recentWins: [
    { name: "Miami-Dade Courthouse", value: 8500000, date: "2024-01-15" },
    { name: "Tampa Medical Center", value: 12000000, date: "2024-01-10" },
    { name: "Orlando Airport Terminal", value: 25000000, date: "2024-01-05" },
  ],
}

const mockBDTasks = [
  { id: 1, title: "Follow up with Palm Beach County", priority: "high", dueDate: "2024-01-20", status: "overdue" },
  { id: 2, title: "Prepare proposal for Tampa project", priority: "medium", dueDate: "2024-01-25", status: "pending" },
  { id: 3, title: "Schedule client meeting - Orlando", priority: "low", dueDate: "2024-01-30", status: "pending" },
  { id: 4, title: "Review bid documents - Miami", priority: "high", dueDate: "2024-01-18", status: "overdue" },
  { id: 5, title: "Update CRM with new leads", priority: "medium", dueDate: "2024-01-22", status: "pending" },
]

const mockTeamActivity = [
  { name: "Sarah Johnson", activity: "Proposal submitted", time: "2 hours ago", type: "proposal" },
  { name: "Mike Chen", activity: "Client meeting scheduled", time: "4 hours ago", type: "meeting" },
  { name: "Lisa Rodriguez", activity: "Bid documents reviewed", time: "6 hours ago", type: "review" },
  { name: "David Kim", activity: "Site visit completed", time: "1 day ago", type: "site-visit" },
]

const mockWinLossData = {
  totalPursuits: 45,
  wins: 31,
  losses: 14,
  pending: 8,
  totalValue: 125000000,
  averageDealSize: 2800000,
}

const mockShortcuts = [
  { name: "ROI Calculator", icon: Calculator, color: "blue", link: "#" },
  { name: "Proposal Templates", icon: FileText, color: "green", link: "#" },
  { name: "Client Database", icon: Users, color: "purple", link: "#" },
  { name: "Market Research", icon: BarChart3, color: "orange", link: "#" },
  { name: "Bid Calculator", icon: DollarSign, color: "red", link: "#" },
  { name: "Presentation Tools", icon: Presentation, color: "indigo", link: "#" },
]

// Template utility functions
const formatFileSize = (size: string) => {
  return size
}

const formatLastModified = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "FileText":
      return FileText
    case "Presentation":
      return Presentation
    case "Award":
      return Award
    case "Briefcase":
      return Briefcase
    default:
      return File
  }
}

const getCategoryColor = (color: string) => {
  switch (color) {
    case "blue":
      return "text-blue-600 dark:text-blue-400"
    case "purple":
      return "text-purple-600 dark:text-purple-400"
    case "green":
      return "text-green-600 dark:text-green-400"
    case "orange":
      return "text-orange-600 dark:text-orange-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

// Calculator utility functions
const calculateROI = (cost: number, returnValue: number) => {
  if (cost === 0) return 0
  return ((returnValue - cost) / cost) * 100
}

const calculateBudgetAllocation = (totalBudget: number) => {
  return {
    staffing: totalBudget * 0.6, // 60% for staffing
    printing: totalBudget * 0.15, // 15% for printing
    consultants: totalBudget * 0.2, // 20% for consultants
    other: totalBudget * 0.05, // 5% for other
  }
}

const calculateTotalHours = (research: number, writing: number, review: number) => {
  return research + writing + review
}

const getProjectTypeMultiplier = (projectType: string) => {
  switch (projectType) {
    case "proposal":
      return 1.0
    case "presentation":
      return 0.7
    case "qualification":
      return 0.5
    case "capability":
      return 0.3
    default:
      return 1.0
  }
}

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400"
    case "medium":
      return "text-yellow-600 dark:text-yellow-400"
    case "low":
      return "text-green-600 dark:text-green-400"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "overdue":
      return (
        <Badge variant="destructive" className="text-xs">
          Overdue
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="text-xs">
          Pending
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status}
        </Badge>
      )
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "proposal":
      return <FileText className="h-4 w-4 text-blue-600" />
    case "meeting":
      return <Calendar className="h-4 w-4 text-green-600" />
    case "review":
      return <CheckSquare className="h-4 w-4 text-purple-600" />
    case "site-visit":
      return <Building2 className="h-4 w-4 text-orange-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

// Resource helper functions
const getResourceIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Target: Target,
    Palette: Palette,
    Trophy: Trophy,
    Building2: Building2,
  }
  return iconMap[iconName] || FileText
}

const getResourceTypeIcon = (type: string) => {
  const iconMap: { [key: string]: any } = {
    pdf: FileText,
    docx: FileText,
    pptx: Presentation,
    zip: FolderOpen,
  }
  return iconMap[type] || File
}

const getResourceTypeColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    pdf: "text-red-600",
    docx: "text-blue-600",
    pptx: "text-orange-600",
    zip: "text-purple-600",
  }
  return colorMap[type] || "text-gray-600"
}

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
 * BD Toolkit Page Component
 */
export default function BDToolkitPage() {
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

  // Template data state
  const [templatesData, setTemplatesData] = useState<any>(null)
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [templateSearchTerm, setTemplateSearchTerm] = useState("")
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("all")

  // Calculator state
  const [roiData, setRoiData] = useState({
    estimatedCost: 0,
    expectedReturn: 0,
    roi: 0,
  })
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    staffing: 0,
    printing: 0,
    consultants: 0,
    other: 0,
  })
  const [timeAllocationData, setTimeAllocationData] = useState({
    projectType: "proposal",
    researchHours: 0,
    writingHours: 0,
    reviewHours: 0,
    totalHours: 0,
  })

  // Resources state
  const [selectedResourceCategory, setSelectedResourceCategory] = useState("all")

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

  // Load templates data
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch("/data/mock/templates.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTemplatesData(data)
      } catch (error) {
        console.error("Failed to load templates:", error)
        // Use fallback mock data if fetch fails
        setTemplatesData({
          categories: [
            {
              id: "proposals",
              name: "Proposals",
              description: "Standard proposal templates for different project types",
              icon: "FileText",
              color: "blue",
              files: [
                {
                  id: "prop-001",
                  filename: "General_Proposal_Template_v3.2.docx",
                  description:
                    "Comprehensive proposal template with executive summary, technical approach, and pricing sections",
                  size: "2.4 MB",
                  lastModified: "2024-01-15T10:30:00Z",
                  version: "3.2",
                  tags: ["general", "comprehensive", "pricing"],
                },
              ],
            },
          ],
        })
      } finally {
        setTemplatesLoading(false)
      }
    }

    loadTemplates()
  }, [])

  // Get tabs for BD toolkit content
  const getTabsForContent = (): PageHeaderTab[] => {
    return [
      { id: "overview", label: "Overview" },
      { id: "templates", label: "Templates" },
      { id: "calculators", label: "Calculators" },
      { id: "resources", label: "Resources" },
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
      moduleTitle: "BD Toolkit",
      subHead: "Comprehensive tools and resources for business development",
      tabs: getTabsForContent(),
      navigationState: {
        selectedProject,
        selectedProjectName: projects.find((p) => p.id === selectedProject)?.name,
        selectedModule: null,
        selectedTool: null,
        activeTab,
        activeTabLabel: getTabsForContent().find((tab) => tab.id === activeTab)?.label,
        currentViewType: "bd-toolkit",
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
              {/* BD Toolkit Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pursuit Tracker Summary */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Pursuit Tracker
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Active Targets</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {mockPursuitData.activeTargets}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Completed This Month</span>
                        <span className="text-sm font-semibold text-green-600">
                          {mockPursuitData.completedThisMonth}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Total Value</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrency(mockPursuitData.totalValue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Win Rate</span>
                        <span className="text-sm font-semibold text-purple-600">{mockPursuitData.winRate}%</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recent Wins</div>
                        {mockPursuitData.recentWins.slice(0, 2).map((win, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-gray-700 dark:text-gray-300 truncate">{win.name}</span>
                            <span className="text-green-600 font-medium">{formatCurrency(win.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* BD Task List */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-green-600" />
                        BD Task List
                      </CardTitle>
                      <Badge variant="destructive" className="text-xs">
                        2 Overdue
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {mockBDTasks.slice(0, 4).map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              {getStatusBadge(task.status)}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-gray-300 truncate mt-1">{task.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Due: {formatDate(task.dueDate)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      View All Tasks
                    </Button>
                  </CardContent>
                </Card>

                {/* Client Meeting Scheduler */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        Meeting Scheduler
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-center py-4">
                        <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Schedule Client Meeting
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                          Integrate with Microsoft Graph API
                        </div>
                        <Button size="sm" className="w-full">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule Meeting
                        </Button>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Upcoming Meetings</div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-700 dark:text-gray-300">Palm Beach County</span>
                            <span className="text-purple-600">Today 2:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-700 dark:text-gray-300">Tampa Medical Center</span>
                            <span className="text-purple-600">Tomorrow 10:00 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Activity Log */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        Team Activity
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {mockTeamActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                          <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-white">{activity.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{activity.activity}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      View All Activity
                    </Button>
                  </CardContent>
                </Card>

                {/* Win/Loss Snapshot */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-red-600" />
                        Win/Loss Snapshot
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        YTD
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <div className="text-lg font-bold text-green-600">{mockWinLossData.wins}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Wins</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                          <div className="text-lg font-bold text-red-600">{mockWinLossData.losses}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Losses</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Total Pursuits</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {mockWinLossData.totalPursuits}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Pending</span>
                          <span className="font-medium text-yellow-600">{mockWinLossData.pending}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Total Value</span>
                          <span className="font-medium text-blue-600">
                            {formatCurrency(mockWinLossData.totalValue)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Avg Deal Size</span>
                          <span className="font-medium text-purple-600">
                            {formatCurrency(mockWinLossData.averageDealSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shortcut Tiles */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap className="h-4 w-4 text-indigo-600" />
                        Quick Access
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Tools
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {mockShortcuts.map((shortcut, index) => {
                        const IconComponent = shortcut.icon
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-auto p-3 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                          >
                            <IconComponent className={`h-4 w-4 text-${shortcut.color}-600`} />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {shortcut.name}
                            </span>
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="space-y-6">
              {/* Templates Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h2>
                  <p className="text-gray-600 dark:text-gray-400">Professional templates for business development</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={templateSearchTerm}
                      onChange={(e) => setTemplateSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <Select value={selectedTemplateCategory} onValueChange={setSelectedTemplateCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {templatesData?.categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Templates Grid */}
              {templatesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading templates...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {templatesData?.categories
                    ?.filter(
                      (category: any) => selectedTemplateCategory === "all" || category.id === selectedTemplateCategory
                    )
                    ?.filter(
                      (category: any) =>
                        category.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                        category.description.toLowerCase().includes(templateSearchTerm.toLowerCase())
                    )
                    ?.map((category: any) => {
                      const IconComponent = getCategoryIcon(category.icon)
                      return (
                        <Card key={category.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                                  <IconComponent className={`h-5 w-5 ${getCategoryColor(category.color)}`} />
                                </div>
                                <div>
                                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {category.name}
                                  </CardTitle>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {category.files.length} files
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {category.files
                                ?.filter(
                                  (file: any) =>
                                    file.filename.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
                                    file.description.toLowerCase().includes(templateSearchTerm.toLowerCase())
                                )
                                ?.map((file: any) => (
                                  <div
                                    key={file.id}
                                    className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <File className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                          {file.filename}
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                          v{file.version}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                        {file.description}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span>Modified: {formatLastModified(file.lastModified)}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <Button size="sm" variant="outline" asChild>
                                        <a href="#" download>
                                          <Download className="h-3 w-3 mr-1" />
                                          Download
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              )}

              {/* Empty State */}
              {!templatesLoading && templatesData?.categories?.length === 0 && (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No templates found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "calculators" && (
            <div className="space-y-6">
              {/* Calculators Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calculators</h2>
                <p className="text-gray-600 dark:text-gray-400">Interactive tools for business development planning</p>
              </div>

              {/* Calculator Masonry Grid */}
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {/* ROI Calculator */}
                <Card
                  variant="elevated"
                  elevation="md"
                  className="break-inside-avoid mb-6 border-l-4 border-l-green-500"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center justify-between">
                      <CardTitle size="md" className="flex items-center gap-2">
                        <Percent className="h-5 w-5 text-green-600" />
                        ROI Calculator
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Financial
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent padding="md" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Estimated Cost
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            value={roiData.estimatedCost || ""}
                            onChange={(e) => {
                              const cost = parseFloat(e.target.value) || 0
                              const returnValue = roiData.expectedReturn
                              setRoiData({
                                estimatedCost: cost,
                                expectedReturn: returnValue,
                                roi: calculateROI(cost, returnValue),
                              })
                            }}
                            placeholder="0"
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Expected Return
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            value={roiData.expectedReturn || ""}
                            onChange={(e) => {
                              const returnValue = parseFloat(e.target.value) || 0
                              const cost = roiData.estimatedCost
                              setRoiData({
                                estimatedCost: cost,
                                expectedReturn: returnValue,
                                roi: calculateROI(cost, returnValue),
                              })
                            }}
                            placeholder="0"
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ROI Result */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{roiData.roi.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">ROI</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Proposal Budget Allocator */}
                <Card
                  variant="elevated"
                  elevation="md"
                  className="break-inside-avoid mb-6 border-l-4 border-l-blue-500"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center justify-between">
                      <CardTitle size="md" className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                        Budget Allocator
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Planning
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent padding="md" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                        Total Budget
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          value={budgetData.totalBudget || ""}
                          onChange={(e) => {
                            const totalBudget = parseFloat(e.target.value) || 0
                            const allocation = calculateBudgetAllocation(totalBudget)
                            setBudgetData({
                              totalBudget,
                              ...allocation,
                            })
                          }}
                          placeholder="0"
                          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                        />
                      </div>
                    </div>

                    {/* Budget Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Staffing (60%)</span>
                        <span className="font-medium">{formatCurrency(budgetData.staffing)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Consultants (20%)</span>
                        <span className="font-medium">{formatCurrency(budgetData.consultants)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Printing (15%)</span>
                        <span className="font-medium">{formatCurrency(budgetData.printing)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Other (5%)</span>
                        <span className="font-medium">{formatCurrency(budgetData.other)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* BD Time Allocation */}
                <Card
                  variant="elevated"
                  elevation="lg"
                  className="break-inside-avoid mb-6 border-l-4 border-l-purple-500 md:col-span-2 lg:col-span-2"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center justify-between">
                      <CardTitle size="lg" className="flex items-center gap-2">
                        <Clock3 className="h-5 w-5 text-purple-600" />
                        Time Allocation Calculator
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Planning
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent padding="lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Input Section */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                            Project Type
                          </label>
                          <Select
                            value={timeAllocationData.projectType}
                            onValueChange={(value) =>
                              setTimeAllocationData({
                                ...timeAllocationData,
                                projectType: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="proposal">Proposal</SelectItem>
                              <SelectItem value="presentation">Presentation</SelectItem>
                              <SelectItem value="qualification">Qualification Statement</SelectItem>
                              <SelectItem value="capability">Capability Statement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              Research Hours
                            </label>
                            <input
                              type="number"
                              value={timeAllocationData.researchHours || ""}
                              onChange={(e) => {
                                const researchHours = parseFloat(e.target.value) || 0
                                const writingHours = timeAllocationData.writingHours
                                const reviewHours = timeAllocationData.reviewHours
                                setTimeAllocationData({
                                  ...timeAllocationData,
                                  researchHours,
                                  totalHours: calculateTotalHours(researchHours, writingHours, reviewHours),
                                })
                              }}
                              placeholder="0"
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              Writing Hours
                            </label>
                            <input
                              type="number"
                              value={timeAllocationData.writingHours || ""}
                              onChange={(e) => {
                                const writingHours = parseFloat(e.target.value) || 0
                                const researchHours = timeAllocationData.researchHours
                                const reviewHours = timeAllocationData.reviewHours
                                setTimeAllocationData({
                                  ...timeAllocationData,
                                  writingHours,
                                  totalHours: calculateTotalHours(researchHours, writingHours, reviewHours),
                                })
                              }}
                              placeholder="0"
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                              Review Hours
                            </label>
                            <input
                              type="number"
                              value={timeAllocationData.reviewHours || ""}
                              onChange={(e) => {
                                const reviewHours = parseFloat(e.target.value) || 0
                                const researchHours = timeAllocationData.researchHours
                                const writingHours = timeAllocationData.writingHours
                                setTimeAllocationData({
                                  ...timeAllocationData,
                                  reviewHours,
                                  totalHours: calculateTotalHours(researchHours, writingHours, reviewHours),
                                })
                              }}
                              placeholder="0"
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Summary Section */}
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-center mb-4">
                            <div className="text-2xl font-bold text-purple-600">{timeAllocationData.totalHours}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Hours</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Research</span>
                              <span className="font-medium">{timeAllocationData.researchHours}h</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Writing</span>
                              <span className="font-medium">{timeAllocationData.writingHours}h</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Review</span>
                              <span className="font-medium">{timeAllocationData.reviewHours}h</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1 mb-1">
                            <UserCheck className="h-3 w-3" />
                            <span>Multiplier: {getProjectTypeMultiplier(timeAllocationData.projectType)}x</span>
                          </div>
                          <p>Time estimates are based on project type complexity</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Calculator Cards for Masonry Layout */}
                {/* Win Rate Calculator */}
                <Card
                  variant="elevated"
                  elevation="md"
                  className="break-inside-avoid mb-6 border-l-4 border-l-orange-500"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center justify-between">
                      <CardTitle size="md" className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        Win Rate Calculator
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Analytics
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent padding="md" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Total Bids
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Wins</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">0.0%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Proposal Cost Calculator */}
                <Card
                  variant="elevated"
                  elevation="md"
                  className="break-inside-avoid mb-6 border-l-4 border-l-indigo-500"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center justify-between">
                      <CardTitle size="md" className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-indigo-600" />
                        Proposal Cost Calculator
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Financial
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent padding="md" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Proposal Type
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small Project</SelectItem>
                            <SelectItem value="medium">Medium Project</SelectItem>
                            <SelectItem value="large">Large Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Complexity Factor
                        </label>
                        <input
                          type="number"
                          placeholder="1.0"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">$0</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Analysis Calculator */}
                <Card
                  variant="elevated"
                  elevation="md"
                  className="break-inside-avoid mb-6 border-l-4 border-l-teal-500"
                >
                  <CardHeader variant="gradient">
                    <div className="flex items-center justify-between">
                      <CardTitle size="md" className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-teal-600" />
                        Market Analysis
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        Intelligence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent padding="md" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Market Size
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                          Market Share %
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-full"
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-600">$0</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Potential</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "resources" && (
            <div className="space-y-6">
              {/* Resources Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resources</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Comprehensive business development resources and tools
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedResourceCategory("all")}
                >
                  All Categories
                </Button>
                {resourcesData.categories.map((category) => {
                  const IconComponent = getResourceIcon(category.icon)
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => setSelectedResourceCategory(category.id)}
                    >
                      <IconComponent className="h-3 w-3" />
                      {category.name}
                    </Button>
                  )
                })}
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resourcesData.resources
                  .filter(
                    (resource) => selectedResourceCategory === "all" || resource.categoryId === selectedResourceCategory
                  )
                  .map((resource) => {
                    const category = resourcesData.categories.find((cat) => cat.id === resource.categoryId)
                    const IconComponent = getResourceIcon(category?.icon || "FileText")
                    const TypeIcon = getResourceTypeIcon(resource.type)
                    const typeColor = getResourceTypeColor(resource.type)

                    return (
                      <Card
                        key={resource.id}
                        variant="elevated"
                        elevation="md"
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader variant="gradient" className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4 text-gray-600" />
                              <Badge variant="outline" className="text-xs">
                                {category?.name}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <TypeIcon className={`h-3 w-3 ${typeColor}`} />
                              <span className="text-xs text-gray-500">{resource.type.toUpperCase()}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent padding="md" className="space-y-3">
                          <div>
                            <CardTitle size="sm" className="mb-2 line-clamp-2">
                              {resource.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{resource.summary}</p>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{resource.fileSize}</span>
                            <span>{formatDate(resource.lastUpdated)}</span>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
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
          <p className="text-muted-foreground">Loading BD toolkit...</p>
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
