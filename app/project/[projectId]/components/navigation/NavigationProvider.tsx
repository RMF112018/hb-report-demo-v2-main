/**
 * @fileoverview Navigation Provider Component
 * @module NavigationProvider
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Provides navigation context and state management for the entire project page.
 * Handles dual-state navigation, animations, and deep linking.
 *
 * @example
 * ```typescript
 * import { NavigationProvider } from './NavigationProvider'
 *
 * const ProjectPage = () => {
 *   return (
 *     <NavigationProvider userRole="project-manager">
 *       <ProjectContent />
 *     </NavigationProvider>
 *   )
 * }
 * ```
 */

"use client"

import React, { createContext, useContext, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  NavigationContextType,
  NavigationProviderProps,
  NavigationConfig,
  ToolConfig,
  CategoryConfig,
  UserRole,
} from "../../types/navigation"
import { useNavigation } from "../../hooks/useNavigation"
import {
  TOOLS_CONFIG,
  CATEGORIES_CONFIG,
  CORE_TABS_CONFIG,
  ROLE_CATEGORY_ACCESS,
  SYSTEM_CONFIG,
} from "../../constants/config"

// Extend window interface for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    analytics?: {
      track: (event: string, properties: any) => void
    }
  }
}

/**
 * Navigation Context
 */
const NavigationContext = createContext<NavigationContextType | null>(null)

/**
 * Navigation Provider Component
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialNavigation,
  tools,
  userRole = "project-manager",
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize navigation from URL params
  const urlNavigation = useMemo(() => {
    const urlNav: Partial<NavigationConfig> = {}

    const category = searchParams.get("category")
    const tool = searchParams.get("tool")
    const subTool = searchParams.get("subTool")
    const coreTab = searchParams.get("coreTab")

    if (category) urlNav.category = category
    if (tool) urlNav.tool = tool
    if (subTool) urlNav.subTool = subTool
    if (coreTab) urlNav.coreTab = coreTab

    return urlNav
  }, [searchParams])

  // Combine initial navigation with URL navigation
  const combinedInitialNavigation = useMemo(
    () => ({
      ...initialNavigation,
      ...urlNavigation,
    }),
    [initialNavigation, urlNavigation]
  )

  // Use navigation hook
  const navigation = useNavigation(combinedInitialNavigation)

  // Filter tools based on user role
  const filteredTools = useMemo(() => {
    const roleTools = tools || TOOLS_CONFIG
    return roleTools.filter((tool) => tool.visibleRoles.includes(userRole) && isToolAccessible(tool, userRole))
  }, [tools, userRole])

  // Filter categories based on user role
  const filteredCategories = useMemo(() => {
    const allowedCategories = ROLE_CATEGORY_ACCESS[userRole as UserRole] || []
    return CATEGORIES_CONFIG.filter(
      (category) => allowedCategories.includes(category.name) || category.name === "overview"
    ).map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => filteredTools.some((ft) => ft.name === tool.name)),
    }))
  }, [userRole, filteredTools])

  // Update URL when navigation changes
  useEffect(() => {
    if (SYSTEM_CONFIG.FEATURES.ENABLE_DEEP_LINKING) {
      const params = new URLSearchParams()
      const nav = navigation.state.committed

      if (nav.category) params.set("category", nav.category)
      if (nav.tool) params.set("tool", nav.tool)
      if (nav.subTool) params.set("subTool", nav.subTool)
      if (nav.coreTab) params.set("coreTab", nav.coreTab)

      const newUrl = params.toString() ? `?${params.toString()}` : ""
      const currentUrl = window.location.search

      if (newUrl !== currentUrl) {
        router.replace(newUrl, { scroll: false })
      }
    }
  }, [navigation.state.committed, router])

  // Analytics tracking
  useEffect(() => {
    if (SYSTEM_CONFIG.FEATURES.ENABLE_ANALYTICS) {
      const nav = navigation.state.committed
      const title = `${nav.category || "Overview"} - ${nav.tool || "Dashboard"}`

      // Track page view with gtag
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", "GA_TRACKING_ID", {
          page_title: title,
          page_location: window.location.href,
        })
      }

      // Track custom event with analytics
      if (typeof window !== "undefined" && window.analytics) {
        window.analytics.track("Navigation", {
          category: nav.category,
          tool: nav.tool,
          subTool: nav.subTool,
          coreTab: nav.coreTab,
          userRole,
          timestamp: Date.now(),
        })
      }
    }
  }, [navigation.state.committed, userRole])

  // Context value
  const contextValue = useMemo(
    (): NavigationContextType => ({
      state: navigation.state,
      actions: navigation.actions,
      tools: filteredTools,
      categories: filteredCategories,
      coreTabs: CORE_TABS_CONFIG,
    }),
    [navigation.state, navigation.actions, filteredTools, filteredCategories]
  )

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}

/**
 * Hook to use navigation context
 */
export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext)

  if (!context) {
    throw new Error("useNavigationContext must be used within a NavigationProvider")
  }

  return context
}

/**
 * Hook to get current navigation state
 */
export const useNavigationState = () => {
  const { state } = useNavigationContext()
  return state
}

/**
 * Hook to get navigation actions
 */
export const useNavigationActions = () => {
  const { actions } = useNavigationContext()
  return actions
}

/**
 * Hook to get filtered tools
 */
export const useNavigationTools = () => {
  const { tools } = useNavigationContext()
  return tools
}

/**
 * Hook to get filtered categories
 */
export const useNavigationCategories = () => {
  const { categories } = useNavigationContext()
  return categories
}

/**
 * Hook to get core tabs
 */
export const useNavigationCoreTabs = () => {
  const { coreTabs } = useNavigationContext()
  return coreTabs
}

/**
 * Hook to check if user can access a specific tool
 */
export const useCanAccessTool = (toolName: string) => {
  const { tools } = useNavigationContext()
  return tools.some((tool) => tool.name === toolName)
}

/**
 * Hook to check if user can access a specific category
 */
export const useCanAccessCategory = (categoryName: string) => {
  const { categories } = useNavigationContext()
  return categories.some((category) => category.name === categoryName)
}

/**
 * Hook to get current breadcrumbs
 */
export const useNavigationBreadcrumbs = () => {
  const navigation = useNavigation()
  return navigation.utils.getBreadcrumbs()
}

/**
 * Hook to check if navigation is currently animating
 */
export const useNavigationIsAnimating = () => {
  const { state } = useNavigationContext()
  return state.animation.isNavigating
}

/**
 * Hook to get current animation phase
 */
export const useNavigationAnimationPhase = () => {
  const { state } = useNavigationContext()
  return state.animation.animationPhase
}

/**
 * Check if a tool is accessible to the user role
 */
const isToolAccessible = (tool: ToolConfig, userRole: string): boolean => {
  // Check if user role is in visible roles
  if (!tool.visibleRoles.includes(userRole)) {
    return false
  }

  // Check category access
  const allowedCategories = ROLE_CATEGORY_ACCESS[userRole as UserRole] || []
  if (!allowedCategories.includes(tool.category)) {
    return false
  }

  return true
}

/**
 * Higher-order component to wrap components with navigation context
 */
export const withNavigation = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & { userRole?: string }> => {
  const WrappedComponent = (props: P & { userRole?: string }) => {
    const { userRole, ...restProps } = props

    return (
      <NavigationProvider userRole={userRole} tools={TOOLS_CONFIG}>
        <Component {...(restProps as P)} />
      </NavigationProvider>
    )
  }

  WrappedComponent.displayName = `withNavigation(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Export the navigation context for advanced usage
 */
export { NavigationContext }

/**
 * Export default
 */
export default NavigationProvider
