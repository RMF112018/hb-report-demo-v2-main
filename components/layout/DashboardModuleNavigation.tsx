"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Users,
  FileText,
  Calendar,
  ShoppingCart,
  BarChart3,
  Settings,
  Briefcase,
  TrendingUp,
  Menu,
  ChevronDown,
  Wrench,
  AlertTriangle,
  FolderOpen,
} from "lucide-react"

/**
 * Dashboard Module Navigation Component
 * ------------------------------------
 * Persistent tab navigation for all dashboard modules
 */

export function DashboardModuleNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  // Dashboard Module Configuration
  const dashboardModules = [
    {
      id: "dashboard",
      name: "Dashboard",
      fullName: "Analytics Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      description: "Main dashboard with project overview and key metrics",
    },
    {
      id: "projects",
      name: "Projects",
      fullName: "Project Management",
      icon: Building2,
      path: "/projects",
      description: "Project portfolio and management tools",
    },
    {
      id: "financial-hub",
      name: "Financial Hub",
      fullName: "Financial Hub",
      icon: DollarSign,
      path: "/dashboard/financial-hub",
      description: "Financial tracking, budgets, and cash flow management",
    },
    {
      id: "staff-planning",
      name: "Staff Planning",
      fullName: "Staff Planning & Resource Management",
      icon: Users,
      path: "/dashboard/staff-planning",
      description: "Resource allocation and workforce planning",
    },
    {
      id: "field-reports",
      name: "Field Reports",
      fullName: "Field Reports & Daily Logs",
      icon: FileText,
      path: "/dashboard/field-reports",
      description: "Daily field reporting and progress tracking",
    },
    {
      id: "scheduler",
      name: "Scheduler",
      fullName: "Project Scheduler",
      icon: Calendar,
      path: "/dashboard/scheduler",
      description: "Project scheduling and timeline management",
    },
    {
      id: "procurement",
      name: "Procurement",
      fullName: "Procurement & Buyout Management",
      icon: ShoppingCart,
      path: "/dashboard/procurement",
      description: "Vendor management and procurement tracking",
    },
    {
      id: "reports",
      name: "Reports",
      fullName: "Reports & Analytics",
      icon: BarChart3,
      path: "/dashboard/reports",
      description: "Custom reports and business intelligence",
    },
    {
      id: "constraints-log",
      name: "Constraints",
      fullName: "Constraints Log",
      icon: AlertTriangle,
      path: "/dashboard/constraints-log",
      description: "Project constraints and risk management",
    },
    {
      id: "permit-log",
      name: "Permits",
      fullName: "Permit Log",
      icon: FolderOpen,
      path: "/dashboard/permit-log",
      description: "Permit tracking and compliance management",
    },
  ]

  // Get current module based on pathname
  const currentModule = dashboardModules.find((module) => module.path === pathname) || dashboardModules[0]

  // Responsive tabs behavior
  useEffect(() => {
    const checkTabOverflow = () => {
      if (!tabsContainerRef.current) return

      const container = tabsContainerRef.current
      const tabs = container.querySelectorAll("[data-tab]")

      if (tabs.length === 0) return

      // Check if tabs overflow container
      const containerRect = container.getBoundingClientRect()
      const lastTab = tabs[tabs.length - 1]
      const lastTabRect = lastTab.getBoundingClientRect()

      // More conservative overflow detection - only switch to mobile when tabs actually overflow
      const shouldShowMobileMenu = window.innerWidth < 768 || lastTabRect.right > containerRect.right + 20
      setShowMobileMenu(shouldShowMobileMenu)
    }

    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(checkTabOverflow, 100)
    window.addEventListener("resize", checkTabOverflow)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", checkTabOverflow)
    }
  }, [])

  // Module navigation handlers
  const handleModuleSelect = (module: (typeof dashboardModules)[0]) => {
    router.push(module.path)
    setModuleMenuOpen(false)
  }

  return (
    <div className="flex items-center justify-between gap-3" data-tour="dashboard-module-navigation">
      <div className="flex items-center gap-1 flex-1 min-w-0" ref={tabsContainerRef}>
        {!showMobileMenu ? (
          // Desktop Tab Navigation
          dashboardModules.map((module) => {
            const IconComponent = module.icon
            return (
              <button
                key={module.id}
                data-tab={module.id}
                onClick={() => handleModuleSelect(module)}
                className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  currentModule.id === module.id
                    ? "text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {module.name}
              </button>
            )
          })
        ) : (
          // Mobile/Overflow Menu
          <Popover open={moduleMenuOpen} onOpenChange={setModuleMenuOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Menu className="h-4 w-4" />
                <span className="flex items-center gap-2">
                  <currentModule.icon className="h-4 w-4" />
                  {currentModule.name}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4 border-b border-border">
                <h4 className="font-semibold text-sm text-foreground mb-1">Dashboard Modules</h4>
                <p className="text-xs text-muted-foreground">Navigate between different dashboard sections</p>
              </div>
              <div className="p-2 max-h-96 overflow-y-auto">
                {dashboardModules.map((module) => {
                  const IconComponent = module.icon
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleSelect(module)}
                      className={`w-full text-left p-3 rounded-md transition-colors flex items-start gap-3 ${
                        currentModule.id === module.id
                          ? "bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-600"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <IconComponent
                        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                          currentModule.id === module.id ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className={`text-sm font-medium ${
                              currentModule.id === module.id ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                            }`}
                          >
                            {module.fullName}
                          </p>
                          {currentModule.id === module.id && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{module.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
