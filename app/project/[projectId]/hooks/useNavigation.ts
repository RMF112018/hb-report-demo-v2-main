/**
 * @fileoverview Navigation management hook
 * @module useNavigation
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive hook for managing project page navigation state,
 * including dual-state navigation, animations, and transitions.
 *
 * @example
 * ```typescript
 * import { useNavigation } from './useNavigation'
 *
 * const MyComponent = () => {
 *   const { state, actions, utils } = useNavigation()
 *
 *   return (
 *     <div onClick={() => actions.handleToolClick('Financial Hub')}>
 *       Navigate to Financial Hub
 *     </div>
 *   )
 * }
 * ```
 */

import { useCallback, useEffect, useReducer, useRef } from "react"
import {
  NavigationState,
  NavigationConfig,
  NavigationActions,
  NavigationHistoryEntry,
  NavigationPerformance,
  BreadcrumbItem,
  UseNavigationReturn,
  AnimationPhase,
} from "../types/navigation"
import {
  DEFAULT_NAVIGATION,
  ANIMATION_CONFIG,
  PERFORMANCE_CONFIG,
  CATEGORIES_CONFIG,
  TOOLS_CONFIG,
  CORE_TABS_CONFIG,
} from "../constants/config"

/**
 * Navigation action types for reducer
 */
type NavigationActionType =
  | "SET_EXPLORATION"
  | "COMMIT_NAVIGATION"
  | "START_ANIMATION"
  | "COMPLETE_ANIMATION"
  | "RESET_NAVIGATION"
  | "SET_ANIMATION_PHASE"
  | "ADD_HISTORY_ENTRY"
  | "UPDATE_PERFORMANCE"

/**
 * Navigation action interface
 */
interface NavigationAction {
  type: NavigationActionType
  payload?: any
}

/**
 * Initial navigation state
 */
const initialNavigationState: NavigationState = {
  committed: DEFAULT_NAVIGATION,
  exploration: DEFAULT_NAVIGATION,
  animation: {
    isNavigating: false,
    animationPhase: "idle",
    pendingCommit: null,
  },
  legacy: {
    expandedCategory: null,
    selectedTool: null,
    selectedSubTool: null,
    selectedCoreTab: null,
  },
}

/**
 * Navigation state reducer
 */
const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case "SET_EXPLORATION":
      return {
        ...state,
        exploration: { ...state.exploration, ...action.payload },
      }

    case "COMMIT_NAVIGATION":
      return {
        ...state,
        committed: action.payload,
        exploration: action.payload,
        animation: {
          ...state.animation,
          pendingCommit: null,
        },
        legacy: {
          expandedCategory: action.payload.category,
          selectedTool: action.payload.tool,
          selectedSubTool: action.payload.subTool,
          selectedCoreTab: action.payload.coreTab,
        },
      }

    case "START_ANIMATION":
      return {
        ...state,
        animation: {
          ...state.animation,
          isNavigating: true,
          animationPhase: "exploring",
          pendingCommit: action.payload,
        },
      }

    case "SET_ANIMATION_PHASE":
      return {
        ...state,
        animation: {
          ...state.animation,
          animationPhase: action.payload,
        },
      }

    case "COMPLETE_ANIMATION":
      return {
        ...state,
        animation: {
          ...state.animation,
          isNavigating: false,
          animationPhase: "idle",
          pendingCommit: null,
        },
      }

    case "RESET_NAVIGATION":
      return {
        ...state,
        committed: DEFAULT_NAVIGATION,
        exploration: DEFAULT_NAVIGATION,
        animation: {
          isNavigating: false,
          animationPhase: "idle",
          pendingCommit: null,
        },
        legacy: {
          expandedCategory: null,
          selectedTool: null,
          selectedSubTool: null,
          selectedCoreTab: null,
        },
      }

    default:
      return state
  }
}

/**
 * Navigation hook
 */
export const useNavigation = (initialNavigation?: Partial<NavigationConfig>): UseNavigationReturn => {
  // State management
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialNavigationState,
    committed: { ...DEFAULT_NAVIGATION, ...initialNavigation },
    exploration: { ...DEFAULT_NAVIGATION, ...initialNavigation },
  })

  // Performance tracking
  const performanceRef = useRef<NavigationPerformance>({
    averageTransitionTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    bundleSize: 0,
  })

  // History tracking
  const historyRef = useRef<NavigationHistoryEntry[]>([])

  // Animation timeout refs
  const animationTimeoutRef = useRef<NodeJS.Timeout>()
  const explorationTimeoutRef = useRef<NodeJS.Timeout>()

  /**
   * Add entry to navigation history
   */
  const addHistoryEntry = useCallback((navigation: NavigationConfig) => {
    const entry: NavigationHistoryEntry = {
      navigation,
      timestamp: Date.now(),
      title: generateNavigationTitle(navigation),
      url: generateNavigationUrl(navigation),
    }

    historyRef.current = [entry, ...historyRef.current].slice(0, 50) // Keep last 50 entries

    dispatch({
      type: "ADD_HISTORY_ENTRY",
      payload: entry,
    })
  }, [])

  /**
   * Handle category selection
   */
  const handleCategoryClick = useCallback(
    (category: string) => {
      const newNavigation: NavigationConfig = {
        category,
        tool: null,
        subTool: null,
        coreTab: null,
      }

      // Update exploration state immediately
      dispatch({
        type: "SET_EXPLORATION",
        payload: newNavigation,
      })

      // Start animation sequence
      if (ANIMATION_CONFIG.ENABLED) {
        dispatch({
          type: "START_ANIMATION",
          payload: newNavigation,
        })

        // Clear existing timeouts
        if (explorationTimeoutRef.current) {
          clearTimeout(explorationTimeoutRef.current)
        }

        // Commit after exploration delay
        explorationTimeoutRef.current = setTimeout(() => {
          dispatch({
            type: "SET_ANIMATION_PHASE",
            payload: "committing",
          })

          setTimeout(() => {
            dispatch({
              type: "COMMIT_NAVIGATION",
              payload: newNavigation,
            })

            dispatch({
              type: "SET_ANIMATION_PHASE",
              payload: "committed",
            })

            setTimeout(() => {
              dispatch({
                type: "COMPLETE_ANIMATION",
              })
            }, ANIMATION_CONFIG.TRANSITION_DURATION / 2)

            addHistoryEntry(newNavigation)
          }, ANIMATION_CONFIG.TRANSITION_DURATION / 2)
        }, ANIMATION_CONFIG.EXPLORATION_DELAY)
      } else {
        // No animation - commit immediately
        dispatch({
          type: "COMMIT_NAVIGATION",
          payload: newNavigation,
        })
        addHistoryEntry(newNavigation)
      }
    },
    [addHistoryEntry]
  )

  /**
   * Handle tool selection
   */
  const handleToolClick = useCallback(
    (tool: string) => {
      const toolConfig = TOOLS_CONFIG.find((t) => t.name === tool)
      if (!toolConfig) return

      const newNavigation: NavigationConfig = {
        category: toolConfig.category,
        tool,
        subTool: "overview", // Default to overview
        coreTab: null,
      }

      // Update exploration state immediately
      dispatch({
        type: "SET_EXPLORATION",
        payload: newNavigation,
      })

      // Start animation sequence
      if (ANIMATION_CONFIG.ENABLED) {
        dispatch({
          type: "START_ANIMATION",
          payload: newNavigation,
        })

        // Clear existing timeouts
        if (explorationTimeoutRef.current) {
          clearTimeout(explorationTimeoutRef.current)
        }

        // Commit after exploration delay
        explorationTimeoutRef.current = setTimeout(() => {
          dispatch({
            type: "COMMIT_NAVIGATION",
            payload: newNavigation,
          })

          dispatch({
            type: "COMPLETE_ANIMATION",
          })

          addHistoryEntry(newNavigation)
        }, ANIMATION_CONFIG.EXPLORATION_DELAY)
      } else {
        // No animation - commit immediately
        dispatch({
          type: "COMMIT_NAVIGATION",
          payload: newNavigation,
        })
        addHistoryEntry(newNavigation)
      }
    },
    [addHistoryEntry]
  )

  /**
   * Handle sub-tool selection
   */
  const handleSubToolClick = useCallback(
    (subTool: string) => {
      const newNavigation: NavigationConfig = {
        ...state.committed,
        subTool,
        coreTab: null,
      }

      dispatch({
        type: "COMMIT_NAVIGATION",
        payload: newNavigation,
      })

      addHistoryEntry(newNavigation)
    },
    [state.committed, addHistoryEntry]
  )

  /**
   * Handle core tab selection
   */
  const handleCoreTabClick = useCallback(
    (coreTab: string) => {
      const newNavigation: NavigationConfig = {
        category: null,
        tool: null,
        subTool: null,
        coreTab,
      }

      dispatch({
        type: "COMMIT_NAVIGATION",
        payload: newNavigation,
      })

      addHistoryEntry(newNavigation)
    },
    [addHistoryEntry]
  )

  /**
   * Handle navigation commit
   */
  const handleNavigationCommit = useCallback(
    (navigation: NavigationConfig) => {
      dispatch({
        type: "COMMIT_NAVIGATION",
        payload: navigation,
      })

      addHistoryEntry(navigation)
    },
    [addHistoryEntry]
  )

  /**
   * Reset navigation to overview
   */
  const resetNavigation = useCallback(() => {
    dispatch({
      type: "RESET_NAVIGATION",
    })

    addHistoryEntry(DEFAULT_NAVIGATION)
  }, [addHistoryEntry])

  /**
   * Generate breadcrumb items
   */
  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = []
    const nav = state.committed

    // Always include overview
    breadcrumbs.push({
      label: "Overview",
      navigation: DEFAULT_NAVIGATION,
      clickable: true,
    })

    // Add category
    if (nav.category) {
      breadcrumbs.push({
        label: nav.category,
        navigation: { category: nav.category, tool: null, subTool: null, coreTab: null },
        clickable: true,
      })
    }

    // Add tool
    if (nav.tool) {
      breadcrumbs.push({
        label: nav.tool,
        navigation: { ...nav, subTool: null },
        clickable: true,
      })
    }

    // Add sub-tool
    if (nav.subTool) {
      breadcrumbs.push({
        label: nav.subTool,
        navigation: nav,
        clickable: false, // Current page
      })
    }

    // Add core tab
    if (nav.coreTab) {
      breadcrumbs.push({
        label: nav.coreTab,
        navigation: nav,
        clickable: false, // Current page
      })
    }

    return breadcrumbs
  }, [state.committed])

  /**
   * Check if navigation is valid
   */
  const isValidNavigation = useCallback((nav: NavigationConfig): boolean => {
    // Check if category exists
    if (nav.category && !CATEGORIES_CONFIG.find((c) => c.name === nav.category)) {
      return false
    }

    // Check if tool exists
    if (nav.tool && !TOOLS_CONFIG.find((t) => t.name === nav.tool)) {
      return false
    }

    // Check if core tab exists
    if (nav.coreTab && !CORE_TABS_CONFIG.find((t) => t.id === nav.coreTab)) {
      return false
    }

    return true
  }, [])

  /**
   * Get navigation URL
   */
  const getNavigationUrl = useCallback((nav: NavigationConfig): string => {
    return generateNavigationUrl(nav)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      if (explorationTimeoutRef.current) {
        clearTimeout(explorationTimeoutRef.current)
      }
    }
  }, [])

  // Create actions object
  const actions: NavigationActions = {
    handleCategoryClick,
    handleToolClick,
    handleSubToolClick,
    handleCoreTabClick,
    handleNavigationCommit,
    resetNavigation,
  }

  // Create utils object
  const utils = {
    getBreadcrumbs,
    isValidNavigation,
    getNavigationUrl,
  }

  return {
    state,
    actions,
    history: historyRef.current,
    performance: performanceRef.current,
    utils,
  }
}

/**
 * Generate navigation title for display
 */
const generateNavigationTitle = (navigation: NavigationConfig): string => {
  const parts: string[] = []

  if (navigation.category) parts.push(navigation.category)
  if (navigation.tool) parts.push(navigation.tool)
  if (navigation.subTool) parts.push(navigation.subTool)
  if (navigation.coreTab) parts.push(navigation.coreTab)

  return parts.length > 0 ? parts.join(" > ") : "Overview"
}

/**
 * Generate navigation URL
 */
const generateNavigationUrl = (navigation: NavigationConfig): string => {
  const params = new URLSearchParams()

  if (navigation.category) params.set("category", navigation.category)
  if (navigation.tool) params.set("tool", navigation.tool)
  if (navigation.subTool) params.set("subTool", navigation.subTool)
  if (navigation.coreTab) params.set("coreTab", navigation.coreTab)

  return params.toString() ? `?${params.toString()}` : ""
}

export default useNavigation
