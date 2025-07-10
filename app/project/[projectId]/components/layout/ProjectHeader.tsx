/**
 * @fileoverview Project Header component
 * @module ProjectHeader
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Header component for the project control center with navigation,
 * search functionality, user menu, and responsive design.
 *
 * @example
 * ```tsx
 * <ProjectHeader
 *   config={headerConfig}
 *   navigation={navigation}
 *   user={{ name: 'John Doe', role: 'project-manager' }}
 *   project={{ name: 'Project Alpha', id: '123', stage: 'execution' }}
 *   onAction={(actionId) => console.log('Action:', actionId)}
 *   onSearch={(query) => console.log('Search:', query)}
 * />
 * ```
 */

"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ProjectHeaderProps } from "../../types/layout"
import { useLayout } from "../../hooks/useLayout"
import { useNavigation } from "../../hooks/useNavigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  X,
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  Home,
  Breadcrumb,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  HelpCircle,
  LogOut,
} from "lucide-react"

/**
 * Project Header component
 */
export function ProjectHeader({
  config,
  navigation,
  user,
  project,
  actions = [],
  onAction,
  onSearch,
  className,
}: ProjectHeaderProps) {
  const { state: layoutState, actions: layoutActions, responsive } = useLayout()
  const navigationHook = useNavigation?.() || null
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  // Handle search toggle
  const handleSearchToggle = () => {
    setShowSearch(!showSearch)
    if (!showSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle search with Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault()
        handleSearchToggle()
      }

      // Close search with Escape
      if (event.key === "Escape" && showSearch) {
        setShowSearch(false)
        setSearchQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSearch])

  // Get breadcrumb path
  const getBreadcrumbs = () => {
    if (!navigationHook?.state) return []

    const breadcrumbs = []

    // Add home
    breadcrumbs.push({ label: "Home", href: "/dashboard" })

    // Add project
    if (project) {
      breadcrumbs.push({ label: project.name, href: `/project/${project.id}` })
    }

    // Add current navigation
    if (navigationHook.state.committed.category) {
      breadcrumbs.push({
        label: navigationHook.state.committed.category,
        href: `#${navigationHook.state.committed.category}`,
      })
    }

    if (navigationHook.state.committed.tool) {
      breadcrumbs.push({
        label: navigationHook.state.committed.tool,
        href: `#${navigationHook.state.committed.tool}`,
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Header classes
  const headerClasses = cn(
    "hb-project-header",
    "flex",
    "items-center",
    "justify-between",
    "bg-background",
    "border-b",
    "border-border",
    "px-4",
    "transition-all",
    "duration-300",
    "ease-in-out",
    {
      "fixed top-0 left-0 right-0 z-30": config?.fixed,
      relative: !config?.fixed,
      "shadow-sm": config?.fixed,
    },
    className
  )

  const headerHeight = config?.height || 64

  return (
    <header className={headerClasses} style={{ height: headerHeight }}>
      {/* Left section - Menu and breadcrumbs */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => layoutActions.toggleSidebar()}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {layoutState.config.sidebar.visible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Sidebar toggle for desktop */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => layoutActions.toggleSidebar()}
          className="hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          {layoutState.config.sidebar.visible ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        {/* Breadcrumbs */}
        {config?.showBreadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-3 w-3 mx-2" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-foreground truncate max-w-[200px]">{crumb.label}</span>
                  ) : (
                    <a href={crumb.href} className="hover:text-foreground truncate max-w-[150px] transition-colors">
                      {crumb.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Project info for mobile */}
        {project && (
          <div className="sm:hidden flex items-center gap-2 min-w-0">
            <div className="truncate">
              <div className="font-medium text-sm truncate">{project.name}</div>
              <Badge variant="secondary" className="text-xs">
                {project.stage}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Center section - Search */}
      <div className="flex items-center justify-center flex-1 max-w-md mx-4">
        {config?.showSearch && (
          <div className="relative w-full">
            {showSearch || !responsive.is("mobile") ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search projects, reports, documents..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(searchQuery)
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchToggle}
                className="w-full justify-start text-muted-foreground"
              >
                <Search className="h-4 w-4 mr-2" />
                Search...
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right section - Actions and user menu */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Custom actions */}
        {actions.map(
          (action) =>
            action.visible && (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                disabled={action.disabled}
                className="hidden sm:flex"
                title={action.tooltip}
              >
                <action.icon className="h-4 w-4" />
                <span className="sr-only">{action.label}</span>
              </Button>
            )
        )}

        {/* Refresh button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction?.("refresh")}
          className="hidden md:flex"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>

        {/* Notifications */}
        {config?.showNotifications && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction?.("notifications")}
            className="relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>
        )}

        {/* User menu */}
        {config?.showUserMenu && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.("profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction?.("help")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction?.("logout")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction?.("settings")}
          className="hidden lg:flex"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}

export default ProjectHeader
