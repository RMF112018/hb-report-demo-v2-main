/**
 * @fileoverview Enhanced Project Sidebar Component
 * @module ProjectSidebar
 * @version 2.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Enhanced sidebar navigation integrating header functionality with project tree menu
 */

"use client"

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { useAuth } from "../../../context/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "../../../components/ui/use-toast"
import { ProductivityPopover } from "../../../components/layout/ProductivityPopover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
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
  Folder,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react"
import type { UserRole } from "../../project/[projectId]/types/project"

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
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  collapsed,
  onToggleCollapsed,
  userRole,
}) => {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set(["Construction", "Pre-Construction"]))
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [notifications] = useState(3)

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Helper function to determine the dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    // All users go to the main app now
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
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

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

  // Sort stages by logical order (projects are already filtered by role at parent level)
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

  const toggleStageExpansion = (stage: string) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stage)) {
      newExpanded.delete(stage)
    } else {
      newExpanded.add(stage)
    }
    setExpandedStages(newExpanded)
  }

  if (collapsed) {
    return (
      <aside className="fixed left-0 top-0 h-screen w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-20 transition-all duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo Section - Collapsed */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(getDashboardPath())}
                    className="w-full h-10 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    title="HB Intel Dashboard"
                  >
                    <div className="flex items-center w-full">
                      {/* Left: HBI Icon */}
                      <div className="flex justify-start" style={{ width: "2rem" }}>
                        <div
                          className="text-white rounded-md flex items-center justify-center text-xs font-bold"
                          style={{ width: "2rem", height: "2rem", backgroundColor: "rgba(250, 70, 22, 1)" }}
                        >
                          HBI
                        </div>
                      </div>
                      {/* Center: Logo (centered between HBI icon and right edge) */}
                      <div className="flex-1 flex justify-center">
                        <img
                          src="/images/HB_Logo_Large.png"
                          alt="HB Logo"
                          className="h-8 object-contain bg-transparent"
                          style={{ maxWidth: "90%" }}
                        />
                      </div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>HB Intel Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Navigation Controls - Collapsed */}
          <div className="p-2 space-y-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleCollapsed}
                    className="w-full h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    title="Expand sidebar"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedProject === null ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onProjectSelect(null)}
                    className="w-full h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    title="Dashboard"
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Theme Toggle - Collapsed */}
            {mounted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-full h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Productivity Popover - Collapsed */}
            <div className="relative">
              <ProductivityPopover
                notifications={notifications}
                className="w-full h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Project Folders - Collapsed */}
          <div className="px-2 space-y-1">
            {sortedStages.slice(0, 3).map(([stage, stageProjects]) => (
              <TooltipProvider key={stage}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                      title={`${stage} (${stageProjects.length} projects)`}
                      onClick={() => {
                        onToggleCollapsed()
                        toggleStageExpansion(stage)
                      }}
                    >
                      <Folder className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>
                      {stage} ({stageProjects.length} projects)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* User Avatar - Collapsed */}
          <div className="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleCollapsed}
                    className="w-full h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    title="Expand for user menu"
                  >
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={user?.avatar} alt={user?.firstName || "User"} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>User menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-20 transition-all duration-300 ease-in-out shadow-lg md:shadow-none">
      <div className="flex flex-col h-full">
        {/* Header with Logo, Title, and Controls */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            {/* Logo and HBI Icon */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center w-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    onClick={() => router.push(getDashboardPath())}
                  >
                    {/* Left: HBI Icon */}
                    <div className="flex justify-start" style={{ width: "3rem" }}>
                      <div
                        className="text-white rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ width: "3rem", height: "3rem", backgroundColor: "rgba(250, 70, 22, 1)" }}
                      >
                        HBI
                      </div>
                    </div>
                    {/* Center: Logo (centered between HBI icon and right edge) */}
                    <div className="flex-1 flex justify-center">
                      <img
                        src="/images/HB_Logo_Large.png"
                        alt="HB Logo"
                        className="object-contain bg-transparent"
                        style={{ height: "3rem", maxWidth: "90%" }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Action Icons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}

              {/* Productivity Popover */}
              <ProductivityPopover
                notifications={notifications}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* User Menu */}
            <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user?.avatar} alt={user?.firstName || "User"} />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <Button
            variant={selectedProject === null ? "default" : "ghost"}
            size="sm"
            onClick={() => onProjectSelect(null)}
            className="w-full justify-start h-8"
          >
            <Home className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>

        {/* Projects Header */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
        </div>

        {/* Project Tree */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
            {sortedStages.map(([stage, stageProjects]) => (
              <div key={stage}>
                {/* Stage Header */}
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
                  {expandedStages.has(stage) ? (
                    <FolderOpen className="h-4 w-4 mr-2" />
                  ) : (
                    <Folder className="h-4 w-4 mr-2" />
                  )}
                  <span className="flex-1 text-left">{stage}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stageProjects.length}
                  </Badge>
                </Button>

                {/* Stage Projects */}
                {expandedStages.has(stage) && (
                  <div className="ml-4 space-y-0.5">
                    {stageProjects.map((project) => (
                      <Button
                        key={project.id}
                        variant={selectedProject === project.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onProjectSelect(project.id)}
                        className="w-full justify-start px-3 py-1.5 h-auto text-left"
                      >
                        <Building className="h-4 w-4 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{project.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">#{project.project_number}</div>
                        </div>
                        <Badge variant="secondary" className={`text-xs ml-2 ${getProjectStatusColor(project)}`}>
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

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {sortedStages.reduce((acc, [, projects]) => acc + projects.length, 0)} projects
              {searchQuery && " (filtered)"}
            </div>
            {/* Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapsed}
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
