/**
 * @fileoverview Consistent Page Header Component
 * @module PageHeader
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Provides consistent page header across all modules with:
 * - Enhanced interactive breadcrumb navigation
 * - Left: Dynamic Breadcrumb, Module Title, Sub-head
 * - Right: HB Logo, Dynamic badges and buttons
 * - Full width: Tab navigation
 * - Sticky positioning for constant visibility
 */

"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, Home, ChevronDown, Play } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface PageHeaderTab {
  id: string
  label: string
  disabled?: boolean
}

export interface BreadcrumbItem {
  id: string
  label: string
  onClick?: () => void
  disabled?: boolean
}

export interface NavigationState {
  selectedProject?: string | null
  selectedProjectName?: string
  selectedModule?: string | null
  selectedTool?: string | null
  activeTab?: string
  activeTabLabel?: string
  projectStage?: string
  fieldManagementTool?: string
  currentViewType?: string
  isProjectView?: boolean
  isToolView?: boolean
  isModuleView?: boolean
  isDashboardView?: boolean
}

export interface PageHeaderProps {
  // User information
  userName: string

  // Module information
  moduleTitle: string
  subHead?: string

  // Enhanced navigation state for breadcrumbs
  navigationState?: NavigationState

  // Navigation callbacks
  onNavigateToHome?: () => void
  onNavigateToProject?: (projectId: string) => void
  onNavigateToModule?: (moduleId: string) => void
  onNavigateToTool?: (toolName: string) => void
  onNavigateToTab?: (tabId: string) => void

  // Navigation tabs
  tabs?: PageHeaderTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void

  // Presentation mode
  isPresentationMode?: boolean
  viewingAs?: string | null
  onRoleSwitch?: (
    role: "executive" | "project-executive" | "project-manager" | "estimator" | "admin" | "hr-payroll"
  ) => void
  onReturnToPresentation?: () => void

  // Carousel controls
  onLaunchCarousel?: (carouselType: string) => void

  // Additional props
  className?: string
  isSticky?: boolean
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  userName,
  moduleTitle,
  subHead,
  navigationState,
  onNavigateToHome,
  onNavigateToProject,
  onNavigateToModule,
  onNavigateToTool,
  onNavigateToTab,
  tabs = [],
  activeTab,
  onTabChange,
  isPresentationMode = false,
  viewingAs = null,
  onRoleSwitch,
  onReturnToPresentation,
  onLaunchCarousel,
  className = "",
  isSticky = true,
}) => {
  const [roleSwitchPopoverOpen, setRoleSwitchPopoverOpen] = useState(false)
  const [carouselPopoverOpen, setCarouselPopoverOpen] = useState(false)
  const [hasTriggeredITCarousel, setHasTriggeredITCarousel] = useState(false)

  // Capitalize first letter of each word
  const capitalizeTitle = (title: string) => {
    return title.replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Format user name properly
  const formatUserName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Handle demo role selection
  const handleRoleSelection = (role: string) => {
    onRoleSwitch?.(role as "executive" | "project-executive" | "project-manager" | "estimator" | "admin" | "hr-payroll")
    setRoleSwitchPopoverOpen(false)

    // Trigger IT Command Center carousel for admin role with 2-second delay
    if (role === "admin" && isPresentationMode && !hasTriggeredITCarousel) {
      setHasTriggeredITCarousel(true)
      setTimeout(() => {
        onLaunchCarousel?.("it-command-center")
      }, 2000)
    }
  }

  // Handle carousel selection
  const handleCarouselSelection = (carouselType: string) => {
    onLaunchCarousel?.(carouselType)
    setCarouselPopoverOpen(false)
  }

  // Demo roles configuration
  const demoRoles = [
    { id: "executive", label: "Executive" },
    { id: "project-executive", label: "Project Executive" },
    { id: "project-manager", label: "Project Manager" },
    { id: "estimator", label: "Estimator" },
    { id: "admin", label: "Admin" },
    { id: "hr-payroll", label: "HR & Payroll Manager" },
  ]

  // Available carousels based on user role/presentation mode
  const getAvailableCarousels = () => {
    const carousels = []

    // Login Presentation (intro) - available for presentation users, shown first
    if (isPresentationMode) {
      carousels.push({
        id: "login-presentation",
        label: "Login Presentation",
        description: "Welcome presentation carousel from login experience",
      })
    }

    // HBI Intel Tour - available for presentation users, shown second
    if (isPresentationMode) {
      carousels.push({
        id: "hbi-intel-tour",
        label: "HBI Intel Tour",
        description: "15-slide comprehensive tour of AI-powered construction intelligence",
      })
    }

    // Executive Staffing Tour - available for presentation users, shown third
    if (isPresentationMode) {
      carousels.push({
        id: "executive-staffing-tour",
        label: "Executive Staffing Tour",
        description: "6-slide workforce management transformation from spreadsheets to strategic intelligence",
      })
    }

    // IT Command Center Tour - available for presentation users, shown fourth
    if (isPresentationMode) {
      carousels.push({
        id: "it-command-center",
        label: "IT Command Center Tour",
        description: "Comprehensive tour of centralized IT management and operations",
      })
    }

    return carousels
  }

  const availableCarousels = getAvailableCarousels()

  // Build dynamic breadcrumb based on navigation state
  const buildBreadcrumb = (): BreadcrumbItem[] => {
    const breadcrumb: BreadcrumbItem[] = []

    // Always start with Dashboard/Home
    breadcrumb.push({
      id: "dashboard",
      label: "Dashboard",
      onClick: onNavigateToHome,
    })

    // Add project if selected
    if (navigationState?.selectedProject && navigationState?.selectedProjectName) {
      breadcrumb.push({
        id: "project",
        label: navigationState.selectedProjectName,
        onClick: () => onNavigateToProject?.(navigationState.selectedProject!),
      })

      // Add project tabs/modules based on current view
      if (navigationState?.activeTab && navigationState?.activeTabLabel) {
        const tabId = navigationState.activeTab

        // Handle project-specific navigation
        if (tabId === "field-management") {
          breadcrumb.push({
            id: "field-management",
            label: "Field Management",
            onClick: () => onNavigateToTab?.("field-management"),
          })

          // Add specific field management tools
          if (navigationState?.fieldManagementTool) {
            const toolName = navigationState.fieldManagementTool
            breadcrumb.push({
              id: `field-${toolName}`,
              label: getFieldToolLabel(toolName),
              onClick: () => onNavigateToTool?.(toolName),
            })

            // Add sub-navigation for specific tools
            if (toolName === "scheduler") {
              // Check if we're in a specific scheduler sub-view
              if (moduleTitle.toLowerCase().includes("project schedule")) {
                breadcrumb.push({
                  id: "project-schedule",
                  label: "Project Schedule",
                  onClick: () => onNavigateToTab?.("project-schedule"),
                })
              } else if (moduleTitle.toLowerCase().includes("look ahead")) {
                breadcrumb.push({
                  id: "look-ahead",
                  label: "Look Ahead",
                  onClick: () => onNavigateToTab?.("look-ahead"),
                })
              } else if (moduleTitle.toLowerCase().includes("update")) {
                breadcrumb.push({
                  id: "update",
                  label: "Update",
                  onClick: () => onNavigateToTab?.("update"),
                })
              }
            }
          }
        } else if (tabId === "financial-management") {
          breadcrumb.push({
            id: "financial-management",
            label: "Financial Management",
            onClick: () => onNavigateToTab?.("financial-management"),
          })

          // Add financial sub-tools based on module title
          if (moduleTitle.toLowerCase().includes("procurement")) {
            breadcrumb.push({
              id: "procurement",
              label: "Procurement",
              onClick: () => onNavigateToTool?.("procurement"),
            })
          } else if (moduleTitle.toLowerCase().includes("financial hub")) {
            breadcrumb.push({
              id: "financial-hub",
              label: "Financial Hub",
              onClick: () => onNavigateToTool?.("financial-hub"),
            })
          }
        } else if (tabId === "pre-construction") {
          breadcrumb.push({
            id: "pre-construction",
            label: "Pre-Construction",
            onClick: () => onNavigateToTab?.("pre-construction"),
          })
        } else if (tabId === "compliance") {
          breadcrumb.push({
            id: "compliance",
            label: "Compliance",
            onClick: () => onNavigateToTab?.("compliance"),
          })
        } else if (tabId === "warranty") {
          breadcrumb.push({
            id: "warranty",
            label: "Warranty",
            onClick: () => onNavigateToTab?.("warranty"),
          })
        } else if (tabId !== "core") {
          // Add other tabs
          breadcrumb.push({
            id: tabId,
            label: navigationState.activeTabLabel,
            onClick: () => onNavigateToTab?.(tabId),
          })
        }
      }
    }
    // Handle pre-construction specific pages (when not in project context)
    else if (
      navigationState?.currentViewType?.startsWith("pre-construction") ||
      navigationState?.currentViewType?.includes("strategic") ||
      navigationState?.currentViewType?.includes("bd-toolkit") ||
      navigationState?.currentViewType?.includes("client-relations") ||
      navigationState?.currentViewType?.includes("market-expansion") ||
      navigationState?.currentViewType?.includes("collaboration")
    ) {
      // Add Pre-Construction as the parent breadcrumb
      breadcrumb.push({
        id: "pre-construction",
        label: "Pre-Construction",
        onClick: () => {
          // Navigate back to pre-construction main page
          if (typeof window !== "undefined") {
            window.location.href = "/preconstruction"
          }
        },
      })

      // Add specific pre-construction sub-pages
      if (navigationState?.currentViewType === "strategic-opportunity-intel") {
        breadcrumb.push({
          id: "strategic-opportunity-intel",
          label: "Strategic Opportunity Intel",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/preconstruction/strategic-opportunity-intel"
            }
          },
        })
      } else if (navigationState?.currentViewType === "bd-toolkit") {
        breadcrumb.push({
          id: "bd-toolkit",
          label: "BD Toolkit",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/preconstruction/bd-toolkit"
            }
          },
        })
      } else if (navigationState?.currentViewType === "client-relations-intel") {
        breadcrumb.push({
          id: "client-relations-intel",
          label: "Client Relations Intel",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/preconstruction/client-relations-intel"
            }
          },
        })
      } else if (navigationState?.currentViewType === "market-expansion-support") {
        breadcrumb.push({
          id: "market-expansion-support",
          label: "Market Expansion Support",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/preconstruction/market-expansion-support"
            }
          },
        })
      } else if (navigationState?.currentViewType === "collaboration-coaching") {
        breadcrumb.push({
          id: "collaboration-coaching",
          label: "Collaboration & Coaching",
          onClick: () => {
            if (typeof window !== "undefined") {
              window.location.href = "/preconstruction/collaboration-coaching"
            }
          },
        })
      }

      // Add active tab if it exists and is not overview
      if (navigationState?.activeTab && navigationState?.activeTabLabel && navigationState.activeTab !== "overview") {
        breadcrumb.push({
          id: `pre-con-${navigationState.activeTab}`,
          label: navigationState.activeTabLabel,
          onClick: () => onNavigateToTab?.(navigationState.activeTab!),
        })
      }
    }
    // Add IT module if selected
    else if (navigationState?.selectedModule) {
      breadcrumb.push({
        id: "it-module",
        label: capitalizeTitle(navigationState.selectedModule.replace(/-/g, " ")),
        onClick: () => onNavigateToModule?.(navigationState.selectedModule!),
      })
    }
    // Add tool if selected
    else if (navigationState?.selectedTool) {
      breadcrumb.push({
        id: "tool",
        label: capitalizeTitle(navigationState.selectedTool),
        onClick: () => onNavigateToTool?.(navigationState.selectedTool!),
      })

      // Add tool-specific tabs
      if (navigationState?.activeTab && navigationState?.activeTabLabel && navigationState.activeTab !== "overview") {
        breadcrumb.push({
          id: "tool-tab",
          label: navigationState.activeTabLabel,
          onClick: () => onNavigateToTab?.(navigationState.activeTab!),
        })
      }
    }
    // Handle dashboard-specific navigation (when no project, module, or tool is selected)
    else if (navigationState?.currentViewType === "dashboard" || navigationState?.isDashboardView) {
      // Add dashboard category based on active tab
      if (navigationState?.activeTab && navigationState?.activeTabLabel) {
        const tabId = navigationState.activeTab

        // Map dashboard tabs to proper breadcrumb labels
        const tabLabel = getDashboardTabLabel(tabId)
        if (tabLabel) {
          breadcrumb.push({
            id: `dashboard-${tabId}`,
            label: tabLabel,
            onClick: () => onNavigateToTab?.(tabId),
          })
        }
      }
    }

    return breadcrumb
  }

  // Helper function to get proper field tool labels
  const getFieldToolLabel = (toolName: string): string => {
    switch (toolName) {
      case "scheduler":
        return "Scheduler"
      case "constraints":
        return "Constraints Log"
      case "permit-log":
        return "Permit Log"
      case "field-reports":
        return "Field Reports"
      default:
        return capitalizeTitle(toolName)
    }
  }

  // Helper function to get proper dashboard tab labels
  const getDashboardTabLabel = (tabId: string): string | null => {
    switch (tabId) {
      case "overview":
        return "Overview"
      case "pre-con-overview":
        return "Pre-Con Overview"
      case "ops-overview":
        return "Ops Overview"
      case "activity-feed":
        return "Activity Feed"
      case "staffing":
        return "Staffing"
      case "financial":
        return "Financial"
      case "quality":
        return "Quality"
      case "safety":
        return "Safety"
      case "compliance":
        return "Compliance"
      case "warranty":
        return "Warranty"
      case "tools":
        return "Tools"
      case "settings":
        return "Settings"
      default:
        return null
    }
  }

  const breadcrumbItems = buildBreadcrumb()

  return (
    <div className={`bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Header Content */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          {/* Left Section */}
          <div className="flex flex-col space-y-1">
            {/* Row 1: Enhanced Interactive Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
                {breadcrumbItems.map((item, index) => (
                  <li key={item.id} className="flex items-center">
                    {index > 0 && <ChevronRight className="h-4 w-4 mx-1.5 text-gray-400" />}
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        disabled={item.disabled}
                        className={`font-medium transition-colors hover:text-foreground focus:text-foreground focus:outline-none ${
                          index === breadcrumbItems.length - 1
                            ? "text-foreground cursor-default"
                            : "text-primary hover:text-primary/80"
                        } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}
                      >
                        {index === 0 && <Home className="h-3 w-3 mr-1 inline" />}
                        {item.label}
                      </button>
                    ) : (
                      <span
                        className={`font-medium ${index === breadcrumbItems.length - 1 ? "text-foreground" : ""}`}
                        aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}
                      >
                        {index === 0 && <Home className="h-3 w-3 mr-1 inline" />}
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Row 2: Module Title */}
            <h1
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
              {...(moduleTitle.toLowerCase().includes("executive dashboard") && {
                "data-tour-highlight": "executive-dashboard",
              })}
            >
              {capitalizeTitle(moduleTitle)}
            </h1>

            {/* Row 3: Sub-head */}
            {subHead && <p className="text-sm text-gray-600 dark:text-gray-400">{subHead}</p>}
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end space-y-2">
            {/* Row 1: HB Logo */}
            <div className="flex items-center">
              <Image
                src="/images/HB_Logo_Large.png"
                alt="Hedrick Brothers Construction"
                width={203}
                height={68}
                style={{ width: "auto", height: "auto" }}
                className="object-contain"
                priority
              />
            </div>

            {/* Row 2: Role Badge with Popover */}
            {isPresentationMode && viewingAs && (
              <Popover open={roleSwitchPopoverOpen} onOpenChange={setRoleSwitchPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-auto px-3 py-1 text-xs bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                  >
                    Viewing {viewingAs.charAt(0).toUpperCase() + viewingAs.slice(1).replace("-", " ")} Demo
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="space-y-1">
                    <div className="px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Switch Demo Role
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    {demoRoles.map((role) => (
                      <Button
                        key={role.id}
                        variant={viewingAs === role.id ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => handleRoleSelection(role.id)}
                      >
                        {role.label}
                      </Button>
                    ))}
                    {viewingAs && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-sm h-8"
                          onClick={() => {
                            onReturnToPresentation?.()
                            setRoleSwitchPopoverOpen(false)
                          }}
                        >
                          Return to Presentation
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Row 3: Tour Carousel Badge - Hidden */}
            {/* Tour Carousel Badge and Menu functionality commented out */}
            {false && isPresentationMode && availableCarousels.length > 0 && (
              <Popover open={carouselPopoverOpen} onOpenChange={setCarouselPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto px-3 py-1 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <Play className="mr-1 h-3 w-3" />
                    Tour Carousel
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="end">
                  <div className="space-y-2">
                    <div className="px-1 py-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Launch Tour Carousel
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <div className="space-y-1">
                      {availableCarousels.map((carousel) => (
                        <Button
                          key={carousel.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleCarouselSelection(carousel.id)}
                        >
                          <div className="flex items-start space-x-3 w-full">
                            <Play className="mt-0.5 h-4 w-4 text-blue-600 flex-shrink-0" />
                            <div className="flex flex-col items-start text-left min-w-0 flex-1">
                              <span className="font-medium text-gray-900 dark:text-gray-100">{carousel.label}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                {carousel.description}
                              </span>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation - Full Width - Executive Dashboard Style */}
      {tabs.length > 0 && (
        <div className="px-6">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                disabled={tab.disabled}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground/50"
                } ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
