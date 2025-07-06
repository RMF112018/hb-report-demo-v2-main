/**
 * @fileoverview Layout state management hook
 * @module useLayout
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Custom hook for managing layout state, responsive behavior, and layout utilities.
 * Provides comprehensive layout management for the project control center.
 *
 * @example
 * ```tsx
 * const { state, actions, responsive, utils } = useLayout()
 *
 * // Toggle sidebar
 * actions.toggleSidebar()
 *
 * // Check if mobile
 * if (responsive.is('mobile')) {
 *   // Mobile specific behavior
 * }
 * ```
 */

import { useContext } from "react"
import { LayoutContext } from "../components/layout/LayoutProvider"
import {
  UseLayoutReturn,
  LayoutState,
  LayoutActions,
  ResponsiveUtilities,
  LayoutUtilities,
  LayoutConfig,
  ResponsiveBreakpoint,
} from "../types/layout"

/**
 * Custom hook for accessing layout state and actions
 *
 * @returns {UseLayoutReturn} Layout state, actions, and utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, actions, responsive, utils } = useLayout()
 *
 *   const handleToggleSidebar = () => {
 *     actions.toggleSidebar()
 *   }
 *
 *   return (
 *     <div>
 *       <button onClick={handleToggleSidebar}>
 *         {state.config.sidebar.visible ? 'Hide' : 'Show'} Sidebar
 *       </button>
 *       {responsive.is('mobile') && (
 *         <div>Mobile view</div>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayout(): UseLayoutReturn {
  const context = useContext(LayoutContext)

  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }

  const { state, actions, responsive, utils } = context

  return {
    state,
    actions,
    responsive,
    utils,
    isAnimating: state.animation.isAnimating,
  }
}

/**
 * Hook for accessing layout state only (read-only)
 *
 * @returns {LayoutState} Current layout state
 *
 * @example
 * ```tsx
 * function StatusBar() {
 *   const state = useLayoutState()
 *
 *   return (
 *     <div>
 *       Current view: {state.config.viewMode}
 *       Sidebar: {state.config.sidebar.visible ? 'visible' : 'hidden'}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutState(): LayoutState {
  const { state } = useLayout()
  return state
}

/**
 * Hook for accessing layout actions only
 *
 * @returns {LayoutActions} Layout action handlers
 *
 * @example
 * ```tsx
 * function LayoutControls() {
 *   const actions = useLayoutActions()
 *
 *   return (
 *     <div>
 *       <button onClick={actions.toggleSidebar}>Toggle Sidebar</button>
 *       <button onClick={() => actions.setViewMode('compact')}>
 *         Compact View
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutActions(): LayoutActions {
  const { actions } = useLayout()
  return actions
}

/**
 * Hook for accessing responsive utilities
 *
 * @returns {ResponsiveUtilities} Responsive utilities and helpers
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const responsive = useResponsive()
 *
 *   const columns = responsive.getValue({
 *     xs: 1,
 *     sm: 2,
 *     md: 3,
 *     lg: 4
 *   })
 *
 *   return (
 *     <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
 *       {responsive.is('mobile') ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useResponsive(): ResponsiveUtilities {
  const { responsive } = useLayout()
  return responsive
}

/**
 * Hook for accessing layout utilities
 *
 * @returns {LayoutUtilities} Layout calculation and utility functions
 *
 * @example
 * ```tsx
 * function ContentArea() {
 *   const utils = useLayoutUtils()
 *
 *   const dimensions = utils.getContentDimensions()
 *   const optimalWidth = utils.getOptimalSidebarWidth()
 *
 *   return (
 *     <div style={{ width: dimensions.width, height: dimensions.height }}>
 *       Content area
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutUtils(): LayoutUtilities {
  const { utils } = useLayout()
  return utils
}

/**
 * Hook for layout configuration with validation
 *
 * @param {Partial<LayoutConfig>} config - Layout configuration to validate
 * @returns {boolean} Whether the configuration is valid
 *
 * @example
 * ```tsx
 * function LayoutSettings() {
 *   const isValid = useLayoutConfig({
 *     sidebar: { width: 350 },
 *     header: { height: 80 }
 *   })
 *
 *   return (
 *     <div>
 *       Configuration is {isValid ? 'valid' : 'invalid'}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutConfig(config: Partial<LayoutConfig>): boolean {
  const { utils } = useLayout()

  // Create a full config by merging with current state
  const { state } = useLayout()
  const fullConfig = { ...state.config, ...config }

  return utils.validateConfig(fullConfig)
}

/**
 * Hook for layout preferences management
 *
 * @returns {Object} Preferences management functions
 *
 * @example
 * ```tsx
 * function PreferencesPanel() {
 *   const { save, load, reset } = useLayoutPreferences()
 *
 *   return (
 *     <div>
 *       <button onClick={save}>Save Preferences</button>
 *       <button onClick={load}>Load Preferences</button>
 *       <button onClick={reset}>Reset to Default</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutPreferences() {
  const { actions } = useLayout()

  return {
    save: actions.savePreferences,
    load: actions.loadPreferences,
    reset: actions.resetLayout,
  }
}

/**
 * Hook for layout animation state
 *
 * @returns {Object} Animation state and controls
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const { isAnimating, isSidebarAnimating } = useLayoutAnimation()
 *
 *   return (
 *     <div className={isAnimating ? 'animate-pulse' : ''}>
 *       {isSidebarAnimating && <div>Sidebar is animating...</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLayoutAnimation() {
  const { state } = useLayout()
  const { animation } = state

  return {
    isAnimating: animation.isAnimating,
    isSidebarAnimating: animation.animationType === "sidebar-toggle" || animation.animationType === "sidebar-resize",
    isViewModeAnimating: animation.animationType === "view-mode-change",
    isContentAnimating: animation.animationType === "content-transition",
    isHeaderAnimating: animation.animationType === "header-collapse",
    animationType: animation.animationType,
    duration: animation.duration,
    easing: animation.easing,
  }
}

/**
 * Hook for breakpoint-specific values
 *
 * @param {Record<ResponsiveBreakpoint, T>} values - Values for each breakpoint
 * @returns {T | undefined} Current value for active breakpoint
 *
 * @example
 * ```tsx
 * function ResponsiveGrid() {
 *   const columns = useBreakpointValue({
 *     xs: 1,
 *     sm: 2,
 *     md: 3,
 *     lg: 4,
 *     xl: 5,
 *     '2xl': 6
 *   })
 *
 *   return (
 *     <div style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
 *       Grid content
 *     </div>
 *   )
 * }
 * ```
 */
export function useBreakpointValue<T>(values: Partial<Record<ResponsiveBreakpoint, T>>): T | undefined {
  const { responsive } = useLayout()
  return responsive.getValue(values)
}

/**
 * Hook for checking specific breakpoints
 *
 * @param {ResponsiveBreakpoint} breakpoint - Breakpoint to check
 * @returns {boolean} Whether current breakpoint matches
 *
 * @example
 * ```tsx
 * function MobileOnlyComponent() {
 *   const isMobile = useBreakpoint('sm')
 *
 *   if (!isMobile) {
 *     return null
 *   }
 *
 *   return <div>Mobile only content</div>
 * }
 * ```
 */
export function useBreakpoint(breakpoint: ResponsiveBreakpoint): boolean {
  const { responsive } = useLayout()
  return responsive.is(breakpoint)
}

/**
 * Hook for media query matching
 *
 * @param {ResponsiveBreakpoint} breakpoint - Minimum breakpoint
 * @returns {boolean} Whether current breakpoint is at least the specified one
 *
 * @example
 * ```tsx
 * function DesktopFeature() {
 *   const isDesktop = useMediaQuery('lg')
 *
 *   return (
 *     <div>
 *       {isDesktop && <AdvancedFeature />}
 *       <BasicFeature />
 *     </div>
 *   )
 * }
 * ```
 */
export function useMediaQuery(breakpoint: ResponsiveBreakpoint): boolean {
  const { responsive } = useLayout()
  return responsive.isAtLeast(breakpoint)
}

/**
 * Hook for sidebar state management
 *
 * @returns {Object} Sidebar state and actions
 *
 * @example
 * ```tsx
 * function SidebarToggle() {
 *   const { isVisible, isExpanded, toggle, expand, collapse } = useSidebar()
 *
 *   return (
 *     <button onClick={toggle}>
 *       {isVisible ? 'Hide' : 'Show'} Sidebar
 *     </button>
 *   )
 * }
 * ```
 */
export function useSidebar() {
  const { state, actions } = useLayout()
  const { sidebar } = state.config

  return {
    isVisible: sidebar.visible,
    isExpanded: sidebar.state === "expanded",
    isCollapsed: sidebar.state === "collapsed",
    isHidden: sidebar.state === "hidden",
    isOverlay: sidebar.state === "overlay",
    width: sidebar.width,
    state: sidebar.state,
    toggle: actions.toggleSidebar,
    expand: () => actions.setSidebarState("expanded"),
    collapse: () => actions.setSidebarState("collapsed"),
    hide: () => actions.setSidebarState("hidden"),
    overlay: () => actions.setSidebarState("overlay"),
    resize: actions.resizeSidebar,
  }
}

/**
 * Hook for header state management
 *
 * @returns {Object} Header state and configuration
 *
 * @example
 * ```tsx
 * function HeaderComponent() {
 *   const { config, updateConfig } = useHeader()
 *
 *   return (
 *     <header style={{ height: config.height }}>
 *       {config.showBreadcrumbs && <Breadcrumbs />}
 *       {config.showSearch && <SearchBar />}
 *     </header>
 *   )
 * }
 * ```
 */
export function useHeader() {
  const { state, actions } = useLayout()
  const { header } = state.config

  return {
    config: header,
    updateConfig: actions.updateHeaderConfig,
    isFixed: header.fixed,
    height: header.height,
    showBreadcrumbs: header.showBreadcrumbs,
    showUserMenu: header.showUserMenu,
    showNotifications: header.showNotifications,
    showSearch: header.showSearch,
  }
}

/**
 * Hook for content area management
 *
 * @returns {Object} Content area state and utilities
 *
 * @example
 * ```tsx
 * function ContentWrapper() {
 *   const { config, dimensions, updateConfig } = useContent()
 *
 *   return (
 *     <main
 *       style={{
 *         padding: config.padding,
 *         maxWidth: config.maxWidth,
 *         width: dimensions.width,
 *         height: dimensions.height
 *       }}
 *     >
 *       Content
 *     </main>
 *   )
 * }
 * ```
 */
export function useContent() {
  const { state, actions, utils } = useLayout()
  const { content } = state.config

  return {
    config: content,
    dimensions: utils.getContentDimensions(),
    availableSpace: utils.getAvailableSpace(),
    updateConfig: actions.updateContentConfig,
    padding: content.padding,
    maxWidth: content.maxWidth,
    scrollable: content.scrollable,
    showLoading: content.showLoading,
  }
}

/**
 * Hook for view mode management
 *
 * @returns {Object} View mode state and actions
 *
 * @example
 * ```tsx
 * function ViewModeSelector() {
 *   const { current, set, isStandard, isMobile, isTablet, isCompact } = useViewMode()
 *
 *   return (
 *     <div>
 *       <button onClick={() => set('standard')}>Standard</button>
 *       <button onClick={() => set('compact')}>Compact</button>
 *       <button onClick={() => set('mobile')}>Mobile</button>
 *       <button onClick={() => set('tablet')}>Tablet</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useViewMode() {
  const { state, actions } = useLayout()
  const { viewMode } = state.config

  return {
    current: viewMode,
    set: actions.setViewMode,
    isStandard: viewMode === "standard",
    isMobile: viewMode === "mobile",
    isTablet: viewMode === "tablet",
    isCompact: viewMode === "compact",
  }
}

export default useLayout
