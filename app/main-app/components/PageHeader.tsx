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

import React from "react"
import { ChevronRight, Home } from "lucide-react"
import Image from "next/image"

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
  className = "",
  isSticky = true,
}) => {
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

  const breadcrumbItems = buildBreadcrumb()

  const stickyClasses = isSticky ? "sticky top-0 z-50" : ""

  return (
    <div
      className={`bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 ${stickyClasses} ${className}`}
    >
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{capitalizeTitle(moduleTitle)}</h1>

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
                width={270}
                height={90}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Full Width - Executive Dashboard Style */}
      {tabs.length > 0 && (
        <div className="px-6 pb-0">
          <div className="flex items-center gap-1 mb-6">
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
