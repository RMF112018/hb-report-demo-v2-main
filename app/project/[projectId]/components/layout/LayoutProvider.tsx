/**
 * @fileoverview Layout Provider component for managing layout state
 * @module LayoutProvider
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * React context provider for managing layout state, responsive behavior,
 * and layout utilities across the project control center.
 *
 * @example
 * ```tsx
 * <LayoutProvider userRole="project-manager" projectData={projectData}>
 *   <ProjectLayout>
 *     <YourContent />
 *   </ProjectLayout>
 * </LayoutProvider>
 * ```
 */

"use client"

import React, { createContext, useReducer, useEffect, useMemo, useCallback } from "react"
import {
  LayoutContextType,
  LayoutProviderProps,
  LayoutState,
  LayoutActions,
  ResponsiveUtilities,
  LayoutUtilities,
  LayoutConfig,
  ResponsiveBreakpoint,
  ResponsiveState,
  LayoutAnimationState,
  LayoutAnimationType,
  LayoutPreferences,
  SidebarState,
  LayoutViewMode,
  HeaderConfig,
  ContentConfig,
  LayoutTheme,
} from "../../types/layout"

import {
  DEFAULT_LAYOUT_CONFIG,
  RESPONSIVE_BREAKPOINTS,
  RESPONSIVE_LAYOUT_CONFIGS,
  LAYOUT_ANIMATION_CONFIG,
  LAYOUT_STORAGE_KEYS,
  LAYOUT_VALIDATION_RULES,
  LAYOUT_PERFORMANCE_CONFIG,
  ACCESSIBILITY_CONFIG,
  MEDIA_QUERIES,
  DEFAULT_LAYOUT_THEME,
} from "../../constants/layout"

/**
 * Layout context
 */
export const LayoutContext = createContext<LayoutContextType | null>(null)

/**
 * Layout reducer action types
 */
type LayoutAction =
  | { type: "SET_CONFIG"; payload: Partial<LayoutConfig> }
  | { type: "SET_SIDEBAR_STATE"; payload: SidebarState }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "RESIZE_SIDEBAR"; payload: number }
  | { type: "SET_VIEW_MODE"; payload: LayoutViewMode }
  | { type: "UPDATE_HEADER_CONFIG"; payload: Partial<HeaderConfig> }
  | { type: "UPDATE_CONTENT_CONFIG"; payload: Partial<ContentConfig> }
  | { type: "UPDATE_RESPONSIVE_STATE"; payload: ResponsiveState }
  | { type: "START_ANIMATION"; payload: { type: LayoutAnimationType; duration?: number } }
  | { type: "STOP_ANIMATION" }
  | { type: "SAVE_PREFERENCES"; payload: LayoutPreferences }
  | { type: "LOAD_PREFERENCES"; payload: LayoutPreferences }
  | { type: "RESET_LAYOUT" }

/**
 * Layout reducer
 */
function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      }

    case "SET_SIDEBAR_STATE":
      return {
        ...state,
        config: {
          ...state.config,
          sidebar: { ...state.config.sidebar, state: action.payload },
        },
      }

    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        config: {
          ...state.config,
          sidebar: {
            ...state.config.sidebar,
            visible: !state.config.sidebar.visible,
          },
        },
      }

    case "RESIZE_SIDEBAR":
      return {
        ...state,
        config: {
          ...state.config,
          sidebar: {
            ...state.config.sidebar,
            width: Math.max(
              LAYOUT_VALIDATION_RULES.MIN_SIDEBAR_WIDTH,
              Math.min(LAYOUT_VALIDATION_RULES.MAX_SIDEBAR_WIDTH, action.payload)
            ),
          },
        },
      }

    case "SET_VIEW_MODE":
      return {
        ...state,
        config: {
          ...state.config,
          viewMode: action.payload,
        },
      }

    case "UPDATE_HEADER_CONFIG":
      return {
        ...state,
        config: {
          ...state.config,
          header: { ...state.config.header, ...action.payload },
        },
      }

    case "UPDATE_CONTENT_CONFIG":
      return {
        ...state,
        config: {
          ...state.config,
          content: { ...state.config.content, ...action.payload },
        },
      }

    case "UPDATE_RESPONSIVE_STATE":
      return {
        ...state,
        responsive: action.payload,
        config: {
          ...state.config,
          breakpoint: action.payload.breakpoint,
        },
      }

    case "START_ANIMATION":
      return {
        ...state,
        animation: {
          isAnimating: true,
          animationType: action.payload.type,
          duration: action.payload.duration || LAYOUT_ANIMATION_CONFIG.DURATION,
          easing: LAYOUT_ANIMATION_CONFIG.EASING,
        },
        config: {
          ...state.config,
          isAnimating: true,
        },
      }

    case "STOP_ANIMATION":
      return {
        ...state,
        animation: {
          isAnimating: false,
          animationType: null,
          duration: 0,
          easing: LAYOUT_ANIMATION_CONFIG.EASING,
        },
        config: {
          ...state.config,
          isAnimating: false,
        },
      }

    case "SAVE_PREFERENCES":
      return {
        ...state,
        preferences: action.payload,
      }

    case "LOAD_PREFERENCES":
      return {
        ...state,
        preferences: action.payload,
        config: {
          ...state.config,
          sidebar: {
            ...state.config.sidebar,
            width: action.payload.sidebarWidth,
            state: action.payload.sidebarState,
          },
          viewMode: action.payload.viewMode,
          header: {
            ...state.config.header,
            ...action.payload.headerPrefs,
          },
          content: {
            ...state.config.content,
            ...action.payload.contentPrefs,
          },
        },
      }

    case "RESET_LAYOUT":
      return {
        ...state,
        config: DEFAULT_LAYOUT_CONFIG,
        animation: {
          isAnimating: false,
          animationType: null,
          duration: 0,
          easing: LAYOUT_ANIMATION_CONFIG.EASING,
        },
      }

    default:
      return state
  }
}

/**
 * Get current responsive state
 */
function getResponsiveState(): ResponsiveState {
  if (typeof window === "undefined") {
    return {
      breakpoint: "lg",
      width: 1024,
      height: 768,
      isTouchDevice: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      devicePixelRatio: 1,
    }
  }

  const width = window.innerWidth
  const height = window.innerHeight
  let breakpoint: ResponsiveBreakpoint = "lg"

  if (width < RESPONSIVE_BREAKPOINTS.xs) {
    breakpoint = "xs"
  } else if (width < RESPONSIVE_BREAKPOINTS.sm) {
    breakpoint = "sm"
  } else if (width < RESPONSIVE_BREAKPOINTS.md) {
    breakpoint = "md"
  } else if (width < RESPONSIVE_BREAKPOINTS.lg) {
    breakpoint = "lg"
  } else if (width < RESPONSIVE_BREAKPOINTS.xl) {
    breakpoint = "xl"
  } else {
    breakpoint = "2xl"
  }

  return {
    breakpoint,
    width,
    height,
    isTouchDevice: "ontouchstart" in window,
    isMobile: width < RESPONSIVE_BREAKPOINTS.md,
    isTablet: width >= RESPONSIVE_BREAKPOINTS.md && width < RESPONSIVE_BREAKPOINTS.lg,
    isDesktop: width >= RESPONSIVE_BREAKPOINTS.lg,
    devicePixelRatio: window.devicePixelRatio || 1,
  }
}

/**
 * Layout Provider component
 */
export function LayoutProvider({
  children,
  initialConfig,
  userRole,
  projectData,
  responsive = true,
  enableAnimations = true,
}: LayoutProviderProps) {
  // Initialize state
  const [state, dispatch] = useReducer(layoutReducer, {
    config: { ...DEFAULT_LAYOUT_CONFIG, ...initialConfig },
    preferences: {
      sidebarWidth: DEFAULT_LAYOUT_CONFIG.sidebar.width,
      sidebarState: DEFAULT_LAYOUT_CONFIG.sidebar.state,
      viewMode: DEFAULT_LAYOUT_CONFIG.viewMode,
      headerPrefs: {
        showBreadcrumbs: DEFAULT_LAYOUT_CONFIG.header.showBreadcrumbs,
        showSearch: DEFAULT_LAYOUT_CONFIG.header.showSearch,
      },
      contentPrefs: {
        padding: DEFAULT_LAYOUT_CONFIG.content.padding,
        maxWidth: DEFAULT_LAYOUT_CONFIG.content.maxWidth,
      },
    },
    responsive: getResponsiveState(),
    animation: {
      isAnimating: false,
      animationType: null,
      duration: 0,
      easing: LAYOUT_ANIMATION_CONFIG.EASING,
    },
  })

  // Layout actions
  const actions: LayoutActions = useMemo(
    () => ({
      toggleSidebar: () => dispatch({ type: "TOGGLE_SIDEBAR" }),
      setSidebarState: (state: SidebarState) => dispatch({ type: "SET_SIDEBAR_STATE", payload: state }),
      resizeSidebar: (width: number) => dispatch({ type: "RESIZE_SIDEBAR", payload: width }),
      setViewMode: (mode: LayoutViewMode) => dispatch({ type: "SET_VIEW_MODE", payload: mode }),
      updateHeaderConfig: (config: Partial<HeaderConfig>) =>
        dispatch({ type: "UPDATE_HEADER_CONFIG", payload: config }),
      updateContentConfig: (config: Partial<ContentConfig>) =>
        dispatch({ type: "UPDATE_CONTENT_CONFIG", payload: config }),
      resetLayout: () => dispatch({ type: "RESET_LAYOUT" }),
      savePreferences: () => {
        const preferences: LayoutPreferences = {
          sidebarWidth: state.config.sidebar.width,
          sidebarState: state.config.sidebar.state,
          viewMode: state.config.viewMode,
          headerPrefs: {
            showBreadcrumbs: state.config.header.showBreadcrumbs,
            showSearch: state.config.header.showSearch,
          },
          contentPrefs: {
            padding: state.config.content.padding,
            maxWidth: state.config.content.maxWidth,
          },
        }
        localStorage.setItem(LAYOUT_STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
        dispatch({ type: "SAVE_PREFERENCES", payload: preferences })
      },
      loadPreferences: () => {
        try {
          const saved = localStorage.getItem(LAYOUT_STORAGE_KEYS.PREFERENCES)
          if (saved) {
            const preferences = JSON.parse(saved)
            dispatch({ type: "LOAD_PREFERENCES", payload: preferences })
          }
        } catch (error) {
          console.warn("Failed to load layout preferences:", error)
        }
      },
    }),
    [state.config]
  )

  // Responsive utilities
  const responsiveUtilities: ResponsiveUtilities = useMemo(
    () => ({
      is: (breakpoint: ResponsiveBreakpoint) => state.responsive.breakpoint === breakpoint,
      isAtLeast: (breakpoint: ResponsiveBreakpoint) => {
        const breakpoints = Object.keys(RESPONSIVE_BREAKPOINTS) as ResponsiveBreakpoint[]
        const currentIndex = breakpoints.indexOf(state.responsive.breakpoint)
        const targetIndex = breakpoints.indexOf(breakpoint)
        return currentIndex >= targetIndex
      },
      isAtMost: (breakpoint: ResponsiveBreakpoint) => {
        const breakpoints = Object.keys(RESPONSIVE_BREAKPOINTS) as ResponsiveBreakpoint[]
        const currentIndex = breakpoints.indexOf(state.responsive.breakpoint)
        const targetIndex = breakpoints.indexOf(breakpoint)
        return currentIndex <= targetIndex
      },
      getValue: (values: Partial<Record<ResponsiveBreakpoint, any>>) => {
        return values[state.responsive.breakpoint]
      },
      pxToRem: (px: number) => `${px / 16}rem`,
      getOptimalLayout: () => {
        return RESPONSIVE_LAYOUT_CONFIGS[state.responsive.breakpoint] || {}
      },
    }),
    [state.responsive.breakpoint]
  )

  // Layout utilities
  const layoutUtilities: LayoutUtilities = useMemo(
    () => ({
      getContentDimensions: () => {
        const { sidebar, header, footer } = state.config
        const { width, height } = state.responsive

        const contentWidth = sidebar.visible ? width - sidebar.width : width
        const contentHeight = height - header.height - (footer.visible ? footer.height : 0)

        return { width: contentWidth, height: contentHeight }
      },
      getAvailableSpace: () => {
        const { width, height } = state.responsive
        return { width, height }
      },
      wouldOverflow: (config: Partial<LayoutConfig>) => {
        const testConfig = { ...state.config, ...config }
        const { width } = state.responsive

        if (testConfig.sidebar.visible && testConfig.sidebar.width > width * 0.8) {
          return true
        }

        return false
      },
      getOptimalSidebarWidth: () => {
        const { width } = state.responsive
        if (width < RESPONSIVE_BREAKPOINTS.md) {
          return 240
        } else if (width < RESPONSIVE_BREAKPOINTS.lg) {
          return 260
        } else if (width < RESPONSIVE_BREAKPOINTS.xl) {
          return 280
        } else {
          return 320
        }
      },
      validateConfig: (config: LayoutConfig) => {
        const { header, sidebar, content, footer } = config

        // Validate header
        if (
          header.height < LAYOUT_VALIDATION_RULES.MIN_HEADER_HEIGHT ||
          header.height > LAYOUT_VALIDATION_RULES.MAX_HEADER_HEIGHT
        ) {
          return false
        }

        // Validate sidebar
        if (
          sidebar.width < LAYOUT_VALIDATION_RULES.MIN_SIDEBAR_WIDTH ||
          sidebar.width > LAYOUT_VALIDATION_RULES.MAX_SIDEBAR_WIDTH
        ) {
          return false
        }

        // Validate content
        if (
          content.padding < LAYOUT_VALIDATION_RULES.MIN_CONTENT_PADDING ||
          content.padding > LAYOUT_VALIDATION_RULES.MAX_CONTENT_PADDING
        ) {
          return false
        }

        // Validate footer
        if (
          footer.height < LAYOUT_VALIDATION_RULES.MIN_FOOTER_HEIGHT ||
          footer.height > LAYOUT_VALIDATION_RULES.MAX_FOOTER_HEIGHT
        ) {
          return false
        }

        return true
      },
      applyTheme: (theme: LayoutTheme) => {
        const root = document.documentElement

        // Apply CSS custom properties
        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value)
        })

        Object.entries(theme.spacing).forEach(([key, value]) => {
          root.style.setProperty(`--spacing-${key}`, `${value}px`)
        })

        Object.entries(theme.borderRadius).forEach(([key, value]) => {
          root.style.setProperty(`--radius-${key}`, `${value}px`)
        })

        Object.entries(theme.shadows).forEach(([key, value]) => {
          root.style.setProperty(`--shadow-${key}`, value)
        })
      },
    }),
    [state.config, state.responsive]
  )

  // Handle resize events
  useEffect(() => {
    if (!responsive) return

    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const newResponsiveState = getResponsiveState()
        dispatch({ type: "UPDATE_RESPONSIVE_STATE", payload: newResponsiveState })

        // Apply responsive layout changes
        const responsiveConfig = RESPONSIVE_LAYOUT_CONFIGS[newResponsiveState.breakpoint]
        if (responsiveConfig) {
          dispatch({ type: "SET_CONFIG", payload: responsiveConfig })
        }
      }, LAYOUT_PERFORMANCE_CONFIG.RESIZE_DEBOUNCE)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [responsive])

  // Load preferences on mount
  useEffect(() => {
    actions.loadPreferences()
  }, [actions])

  // Apply default theme
  useEffect(() => {
    layoutUtilities.applyTheme(DEFAULT_LAYOUT_THEME)
  }, [layoutUtilities])

  // Context value
  const contextValue: LayoutContextType = {
    state,
    actions,
    responsive: responsiveUtilities,
    utils: layoutUtilities,
  }

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>
}

export default LayoutProvider
