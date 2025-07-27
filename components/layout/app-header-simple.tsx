/**
 * @fileoverview Simplified App Header Component
 * @module AppHeaderSimple
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Simplified header for the main app layout without project navigation
 */

"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Search, Moon, Sun, ChevronDown, Wrench, Archive, Menu } from "lucide-react"
import { ProductivityPopover } from "./ProductivityPopover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Simplified AppHeader Component
 *
 * Features:
 * - Logo and branding
 * - Tool navigation (role-based)
 * - Search functionality
 * - Theme toggle
 * - User menu
 * - Mobile-responsive
 */
export const AppHeaderSimple = () => {
  const { user, logout, hasAutoInsightsMode } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  // State management
  const [notifications] = useState(3)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showToolMenu, setShowToolMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  // IT Admin menu states
  const [showITToolsMenu, setShowITToolsMenu] = useState(false)

  // Mobile menu states
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [mobileMenuView, setMobileMenuView] = useState<"main" | "tools" | "ittools">("main")
  const [autoInsightsEnabled, setAutoInsightsEnabled] = useState(false)

  // Auto insights mode toggle handler
  const handleAutoInsightsToggle = (enabled: boolean) => {
    setAutoInsightsEnabled(enabled)
    localStorage.setItem("autoInsightsEnabled", enabled.toString())

    if (enabled) {
      toast({
        title: "Auto Insights Mode Enabled",
        description: "Market intelligence will auto-refresh every 12-24 hours",
      })
    } else {
      toast({
        title: "Auto Insights Mode Disabled",
        description: "Market intelligence will only refresh manually",
      })
    }
  }

  // Refs for click outside detection
  const headerRef = useRef<HTMLElement>(null)
  const toolMenuRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const toolMenuContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load auto insights preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("autoInsightsEnabled")
      if (saved) {
        setAutoInsightsEnabled(saved === "true")
      }
    }
  }, [])

  // Helper function to determine the dashboard path based on user role
  const getDashboardPath = useCallback(() => {
    // All users go to the main app now
    return "/main-app"
  }, [])

  /**
   * Tool categorization for navigation
   */
  const tools = useMemo(
    () => [
      // Core Tools
      {
        name: "Dashboard",
        href: getDashboardPath(),
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
      {
        name: "Productivity",
        href: "/tools/productivity",
        category: "Core Tools",
        description: "Threaded messaging and task management",
      },
      {
        name: "Market Intelligence",
        href: "/dashboard/market-intel",
        category: "Core Tools",
        description: "AI-powered market analysis, competitive positioning, and predictive insights",
        visibleRoles: ["executive", "project-executive", "project-manager", "estimator"],
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
    ],
    [getDashboardPath]
  )

  // IT Tools for IT Administrator role
  const itTools = useMemo(
    () => [
      {
        name: "IT Command Center",
        href: "/it-command-center",
        category: "IT Management",
        description: "IT system overview and monitoring dashboard",
      },
      {
        name: "HB Intel Management",
        href: "/it/command-center/management",
        category: "IT Management",
        description: "Centralized admin hub for application-wide controls",
      },
      {
        name: "Infrastructure Monitor",
        href: "/it/command-center/infrastructure",
        category: "IT Management",
        description: "Server and network infrastructure monitoring",
      },
      {
        name: "SIEM & Events",
        href: "/it/command-center/siem",
        category: "IT Management",
        description: "Security event monitoring and analysis",
      },
    ],
    []
  )

  // Utility functions
  const getUserInitials = useCallback(() => {
    if (!user) return "U"
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
  }, [user])

  // Role-based category visibility
  const getVisibleCategories = useCallback(() => {
    const userRole = user?.role?.toLowerCase?.() || user?.role

    switch (userRole) {
      case "executive":
      case "project-executive":
      case "admin":
        return ["Core Tools", "Pre-Construction", "Financial Management", "Field Management", "Compliance"]
      case "project-manager":
        return ["Core Tools", "Financial Management", "Field Management", "Compliance"]
      case "estimator":
        return ["Pre-Construction", "Compliance"]
      default:
        return ["Core Tools", "Financial Management", "Field Management", "Compliance"]
    }
  }, [user])

  // Enhanced filtered tools with role-based filtering
  const filteredTools = useMemo(() => {
    const userRole = user?.role
    const visibleCategories = getVisibleCategories()

    return tools.filter((tool) => {
      const isDepartmentMatch = visibleCategories.includes(tool.category)
      const isRoleVisible = !tool.visibleRoles || (userRole && tool.visibleRoles.includes(userRole))
      return isDepartmentMatch && isRoleVisible
    })
  }, [tools, user, getVisibleCategories])

  // Event handlers
  const handleToolNavigation = useCallback(
    (href: string) => {
      setShowToolMenu(false)
      setShowUserMenu(false)
      setTimeout(() => {
        router.push(href)
      }, 100)
    },
    [router]
  )

  const handleLogout = useCallback(() => {
    logout()
    router.push("/login")
  }, [logout, router])

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setShowToolMenu(false)
    setShowUserMenu(false)
    setShowITToolsMenu(false)
    setShowMobileMenu(false)
    setMobileMenuView("main")
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        showToolMenu &&
        toolMenuContentRef.current &&
        !toolMenuContentRef.current.contains(target) &&
        !headerRef.current?.contains(target)
      ) {
        setShowToolMenu(false)
      }

      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false)
      }

      if (showITToolsMenu && !headerRef.current?.contains(target)) {
        setShowITToolsMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showToolMenu, showUserMenu, showITToolsMenu])

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-[100] flex h-14 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#1e3a8a] to-[#2a5298] px-6 shadow-lg backdrop-blur-sm"
        data-tour="app-header"
      >
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center space-x-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  onClick={() => router.push(getDashboardPath())}
                >
                  <img src="/images/hb_logo_white.png" alt="HB Logo" className="h-10 w-auto object-contain" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white leading-tight">HB Intel</span>
                    <span className="text-xs text-blue-100 font-medium">Construction Intelligence</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Navigation Pills - Role-based */}
          {user?.role === "admin" ? (
            // IT Administrator Navigation
            <nav className="hidden lg:flex items-center space-x-2">
              {/* IT Tools Menu */}
              <Button
                variant="ghost"
                size="default"
                className={`gap-3 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                  showITToolsMenu ? "bg-white/20 shadow-md" : ""
                } rounded-lg font-medium`}
                onClick={() => {
                  setShowITToolsMenu(!showITToolsMenu)
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
              {/* Tool Picker */}
              <Button
                variant="ghost"
                size="default"
                className={`gap-3 px-5 py-2.5 text-white transition-all duration-200 hover:bg-white/20 hover:shadow-md ${
                  showToolMenu ? "bg-white/20 shadow-md" : ""
                } rounded-lg font-medium`}
                onClick={() => {
                  setShowToolMenu(!showToolMenu)
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
          <div className="flex items-center">
            <span className="text-lg font-bold text-white">HBI</span>
          </div>

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

            {/* Auto Insights Mode Toggle */}
            {hasAutoInsightsMode && mounted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                      <span className="text-xs font-medium text-white">Auto Insights</span>
                      <Switch
                        checked={autoInsightsEnabled}
                        onCheckedChange={handleAutoInsightsToggle}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {autoInsightsEnabled
                        ? "Auto-refresh market intelligence every 12-24 hours"
                        : "Enable auto-refresh for market intelligence"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                  setShowToolMenu(false)
                  setShowITToolsMenu(false)
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
      {(showToolMenu || showITToolsMenu) && (
        <div className="fixed inset-0 top-20 z-[104] bg-black/20 backdrop-blur-sm" onClick={closeAllMenus} />
      )}

      {/* Tools Mega Menu */}
      {showToolMenu && (
        <div
          ref={toolMenuContentRef}
          className="fixed left-0 right-0 top-20 z-[105] border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-2xl backdrop-blur-lg animate-in slide-in-from-top-2 duration-300"
        >
          <div className="px-8 py-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tools</h2>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Access your project management suite</p>
              </div>
            </div>

            {/* Tools organized by category */}
            {(() => {
              const visibleCategories = getVisibleCategories()
              const categoryConfig = [
                {
                  name: "Core Tools",
                  color: "bg-blue-500",
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
                  color: "bg-orange-500",
                  tools: filteredTools.filter((tool) => tool.category === "Field Management"),
                },
                {
                  name: "Compliance",
                  color: "bg-purple-500",
                  tools: filteredTools.filter((tool) => tool.category === "Compliance"),
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
                                return
                              }
                              handleToolNavigation(tool.href)
                            }}
                            className="w-full text-left rounded-md border border-transparent p-2.5 transition-all duration-200 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm group"
                          >
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-blue-600 transition-colors">
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
            })()}
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
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Access IT management modules</p>
              </div>
              <Badge
                variant="secondary"
                className="text-xs text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-950/30 px-2 py-1"
              >
                IT Administrator
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                    IT Management
                  </h3>
                </div>
                <div className="space-y-1">
                  {itTools.map((tool) => (
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
              {mobileMenuView === "main" && (
                <div className="p-4">
                  <div className="space-y-2">
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

                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 mt-4">
                    <div className="flex items-center justify-center space-x-4">
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

              {/* Mobile Tools View */}
              {mobileMenuView === "tools" && (
                <div className="p-6">
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

                  <div className="space-y-6">
                    {(() => {
                      const visibleCategories = getVisibleCategories()
                      const categoryConfig = [
                        {
                          name: "Core Tools",
                          tools: filteredTools.filter((tool) => tool.category === "Core Tools"),
                        },
                        {
                          name: "Pre-Construction",
                          tools: filteredTools.filter((tool) => tool.category === "Pre-Construction"),
                        },
                        {
                          name: "Financial Management",
                          tools: filteredTools.filter((tool) => tool.category === "Financial Management"),
                        },
                        {
                          name: "Field Management",
                          tools: filteredTools.filter((tool) => tool.category === "Field Management"),
                        },
                        {
                          name: "Compliance",
                          tools: filteredTools.filter((tool) => tool.category === "Compliance"),
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
                            {category.tools.map((tool) => (
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

              {/* Mobile IT Tools View */}
              {mobileMenuView === "ittools" && (
                <div className="p-6">
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

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        IT Management
                      </h3>
                      <div className="space-y-2">
                        {itTools.map((tool) => (
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
            </div>
          </div>
        </>
      )}
    </>
  )
}
