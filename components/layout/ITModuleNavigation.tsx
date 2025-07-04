"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Shield,
  Users,
  Monitor,
  Laptop,
  AlertTriangle,
  Mail,
  Package,
  Settings,
  Database,
  Brain,
  UserCheck,
  Menu,
  ChevronDown,
} from "lucide-react"

/**
 * IT Module Navigation Component
 * ------------------------------
 * Persistent tab navigation for all IT Command Center modules
 */

export function ITModuleNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  // IT Module Configuration
  const itModules = [
    {
      id: "it-command-center",
      name: "IT Command Center",
      fullName: "IT Command Center Dashboard",
      icon: Shield,
      path: "/it-command-center",
      description: "IT system overview and monitoring dashboard",
    },
    {
      id: "hb-intel",
      name: "HB Intel",
      fullName: "HB Intel Management Module",
      icon: Users,
      path: "/it/command-center/management",
      description: "Centralized admin hub for application-wide controls",
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      fullName: "Infrastructure Monitor Module",
      icon: Monitor,
      path: "/it/command-center/infrastructure",
      description: "Server and network infrastructure monitoring",
    },
    {
      id: "endpoints",
      name: "Endpoints",
      fullName: "Endpoint & Patch Management Module",
      icon: Laptop,
      path: "/it/command-center/endpoints",
      description: "Device management and patch deployment",
    },
    {
      id: "siem",
      name: "SIEM",
      fullName: "SIEM & Event Monitor Module",
      icon: AlertTriangle,
      path: "/it/command-center/siem",
      description: "Security event monitoring and analysis",
    },
    {
      id: "email-security",
      name: "Email Security",
      fullName: "Email Security Health Module",
      icon: Mail,
      path: "/it/command-center/email",
      description: "Email security and threat protection",
    },
    {
      id: "assets",
      name: "Assets",
      fullName: "Asset Tracker Module",
      icon: Package,
      path: "/it/command-center/assets",
      description: "Asset and license lifecycle management",
    },
    {
      id: "governance",
      name: "Governance",
      fullName: "Change Management & Governance Module",
      icon: Settings,
      path: "/it/command-center/governance",
      description: "Change management and compliance tracking",
    },
    {
      id: "backup",
      name: "Backup/DR",
      fullName: "Backup & DR Status Module",
      icon: Database,
      path: "/it/command-center/backup",
      description: "Backup and disaster recovery management",
    },
    {
      id: "ai-pipelines",
      name: "AI Pipelines",
      fullName: "AI Pipelines Module",
      icon: Brain,
      path: "/it/command-center/ai-pipelines",
      description: "AI and analytics pipeline control",
    },
    {
      id: "consultants",
      name: "Consultants",
      fullName: "Consultant Dashboard",
      icon: UserCheck,
      path: "/it/command-center/consultants",
      description: "SOC, server, compliance, and networking vendors",
    },
  ]

  // Get current module based on pathname
  const currentModule = itModules.find((module) => module.path === pathname) || itModules[0]

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
  const handleModuleSelect = (module: (typeof itModules)[0]) => {
    router.push(module.path)
    setModuleMenuOpen(false)
  }

  return (
    <div className="flex items-center justify-between gap-3" data-tour="it-module-navigation">
      <div className="flex items-center gap-1 flex-1 min-w-0" ref={tabsContainerRef}>
        {!showMobileMenu ? (
          // Desktop Tab Navigation
          itModules.map((module) => {
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
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2 mb-2">
                  IT Command Center Modules
                </div>
                {itModules.map((module) => {
                  const IconComponent = module.icon
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleSelect(module)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-3 ${
                        currentModule.id === module.id
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-xs text-muted-foreground">{module.description}</div>
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
