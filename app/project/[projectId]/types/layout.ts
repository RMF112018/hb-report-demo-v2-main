/**
 * @fileoverview Layout system type definitions
 * @module LayoutTypes
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive type definitions for the project page layout system,
 * including responsive design, layout configuration, and component interfaces.
 *
 * @example
 * ```typescript
 * import { LayoutConfig, ResponsiveBreakpoint } from './layout'
 *
 * const layout: LayoutConfig = {
 *   sidebar: { visible: true, width: 280 },
 *   header: { fixed: true, height: 64 }
 * }
 * ```
 */

import { NavigationConfig } from "./navigation"
import { ProjectData, UserRole } from "./project"

/**
 * Responsive breakpoint types
 */
export type ResponsiveBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

/**
 * Layout view modes
 */
export type LayoutViewMode = "standard" | "compact" | "mobile" | "tablet"

/**
 * Sidebar states
 */
export type SidebarState = "expanded" | "collapsed" | "hidden" | "overlay"

/**
 * Header configuration
 */
export interface HeaderConfig {
  /** Whether header is fixed to top */
  fixed: boolean
  /** Header height in pixels */
  height: number
  /** Whether to show breadcrumbs */
  showBreadcrumbs: boolean
  /** Whether to show user menu */
  showUserMenu: boolean
  /** Whether to show notifications */
  showNotifications: boolean
  /** Whether to show search */
  showSearch: boolean
  /** Custom header actions */
  customActions?: HeaderAction[]
}

/**
 * Sidebar configuration
 */
export interface SidebarConfig {
  /** Whether sidebar is visible */
  visible: boolean
  /** Sidebar width in pixels */
  width: number
  /** Current sidebar state */
  state: SidebarState
  /** Whether sidebar can be resized */
  resizable: boolean
  /** Minimum width when resizing */
  minWidth: number
  /** Maximum width when resizing */
  maxWidth: number
  /** Whether to show quick actions */
  showQuickActions: boolean
  /** Whether to show recent activity */
  showRecentActivity: boolean
}

/**
 * Content area configuration
 */
export interface ContentConfig {
  /** Content padding in pixels */
  padding: number
  /** Maximum content width */
  maxWidth?: number
  /** Whether content is scrollable */
  scrollable: boolean
  /** Whether to show loading states */
  showLoading: boolean
  /** Content background color */
  backgroundColor?: string
}

/**
 * Footer configuration
 */
export interface FooterConfig {
  /** Whether footer is visible */
  visible: boolean
  /** Footer height in pixels */
  height: number
  /** Whether footer is sticky */
  sticky: boolean
  /** Footer content */
  content?: string
  /** Footer links */
  links?: FooterLink[]
}

/**
 * Complete layout configuration
 */
export interface LayoutConfig {
  /** Header configuration */
  header: HeaderConfig
  /** Sidebar configuration */
  sidebar: SidebarConfig
  /** Content area configuration */
  content: ContentConfig
  /** Footer configuration */
  footer: FooterConfig
  /** Current view mode */
  viewMode: LayoutViewMode
  /** Current responsive breakpoint */
  breakpoint: ResponsiveBreakpoint
  /** Whether layout is animating */
  isAnimating: boolean
}

/**
 * Layout state management
 */
export interface LayoutState {
  /** Current layout configuration */
  config: LayoutConfig
  /** Layout preferences saved by user */
  preferences: LayoutPreferences
  /** Responsive state */
  responsive: ResponsiveState
  /** Animation state */
  animation: LayoutAnimationState
}

/**
 * Layout preferences that persist
 */
export interface LayoutPreferences {
  /** Preferred sidebar width */
  sidebarWidth: number
  /** Preferred sidebar state */
  sidebarState: SidebarState
  /** Preferred view mode */
  viewMode: LayoutViewMode
  /** Header preferences */
  headerPrefs: {
    showBreadcrumbs: boolean
    showSearch: boolean
  }
  /** Content preferences */
  contentPrefs: {
    padding: number
    maxWidth?: number
  }
}

/**
 * Responsive state information
 */
export interface ResponsiveState {
  /** Current breakpoint */
  breakpoint: ResponsiveBreakpoint
  /** Window width */
  width: number
  /** Window height */
  height: number
  /** Whether device supports touch */
  isTouchDevice: boolean
  /** Whether in mobile view */
  isMobile: boolean
  /** Whether in tablet view */
  isTablet: boolean
  /** Whether in desktop view */
  isDesktop: boolean
  /** Device pixel ratio */
  devicePixelRatio: number
}

/**
 * Layout animation state
 */
export interface LayoutAnimationState {
  /** Whether any animation is in progress */
  isAnimating: boolean
  /** Current animation type */
  animationType: LayoutAnimationType | null
  /** Animation duration in milliseconds */
  duration: number
  /** Animation easing function */
  easing: string
}

/**
 * Layout animation types
 */
export type LayoutAnimationType =
  | "sidebar-toggle"
  | "sidebar-resize"
  | "view-mode-change"
  | "content-transition"
  | "header-collapse"

/**
 * Layout action handlers
 */
export interface LayoutActions {
  /** Toggle sidebar visibility */
  toggleSidebar: () => void
  /** Set sidebar state */
  setSidebarState: (state: SidebarState) => void
  /** Resize sidebar */
  resizeSidebar: (width: number) => void
  /** Change view mode */
  setViewMode: (mode: LayoutViewMode) => void
  /** Update header config */
  updateHeaderConfig: (config: Partial<HeaderConfig>) => void
  /** Update content config */
  updateContentConfig: (config: Partial<ContentConfig>) => void
  /** Reset layout to defaults */
  resetLayout: () => void
  /** Save current layout as preference */
  savePreferences: () => void
  /** Load saved preferences */
  loadPreferences: () => void
}

/**
 * Header action configuration
 */
export interface HeaderAction {
  /** Action identifier */
  id: string
  /** Action label */
  label: string
  /** Action icon */
  icon: React.ComponentType<{ className?: string }>
  /** Action handler */
  onClick: () => void
  /** Whether action is visible */
  visible: boolean
  /** Whether action is disabled */
  disabled?: boolean
  /** Action tooltip */
  tooltip?: string
  /** Required permissions */
  requiredPermissions?: string[]
}

/**
 * Footer link configuration
 */
export interface FooterLink {
  /** Link identifier */
  id: string
  /** Link label */
  label: string
  /** Link URL */
  href: string
  /** Whether link opens in new tab */
  external?: boolean
  /** Link icon */
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Layout context type
 */
export interface LayoutContextType {
  /** Current layout state */
  state: LayoutState
  /** Layout action handlers */
  actions: LayoutActions
  /** Responsive utilities */
  responsive: ResponsiveUtilities
  /** Layout utilities */
  utils: LayoutUtilities
}

/**
 * Layout provider props
 */
export interface LayoutProviderProps {
  /** Child components */
  children: React.ReactNode
  /** Initial layout configuration */
  initialConfig?: Partial<LayoutConfig>
  /** User role for layout customization */
  userRole?: UserRole
  /** Project data for context */
  projectData?: ProjectData
  /** Whether to enable responsive behavior */
  responsive?: boolean
  /** Whether to enable animations */
  enableAnimations?: boolean
}

/**
 * Responsive utilities
 */
export interface ResponsiveUtilities {
  /** Check if current breakpoint matches */
  is: (breakpoint: ResponsiveBreakpoint) => boolean
  /** Check if current breakpoint is at least */
  isAtLeast: (breakpoint: ResponsiveBreakpoint) => boolean
  /** Check if current breakpoint is at most */
  isAtMost: (breakpoint: ResponsiveBreakpoint) => boolean
  /** Get responsive value based on breakpoint */
  getValue: <T>(values: Partial<Record<ResponsiveBreakpoint, T>>) => T | undefined
  /** Convert pixels to rem units */
  pxToRem: (px: number) => string
  /** Get optimal layout for current screen */
  getOptimalLayout: () => Partial<LayoutConfig>
}

/**
 * Layout utilities
 */
export interface LayoutUtilities {
  /** Calculate content area dimensions */
  getContentDimensions: () => { width: number; height: number }
  /** Calculate available space */
  getAvailableSpace: () => { width: number; height: number }
  /** Check if layout change would cause overflow */
  wouldOverflow: (config: Partial<LayoutConfig>) => boolean
  /** Get optimal sidebar width for content */
  getOptimalSidebarWidth: () => number
  /** Validate layout configuration */
  validateConfig: (config: LayoutConfig) => boolean
  /** Apply layout theme */
  applyTheme: (theme: LayoutTheme) => void
}

/**
 * Layout theme configuration
 */
export interface LayoutTheme {
  /** Theme name */
  name: string
  /** Color scheme */
  colors: {
    background: string
    surface: string
    primary: string
    secondary: string
    accent: string
    text: string
    textSecondary: string
    border: string
    shadow: string
  }
  /** Spacing scale */
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  /** Border radius scale */
  borderRadius: {
    sm: number
    md: number
    lg: number
    full: number
  }
  /** Typography scale */
  typography: {
    fontFamily: string
    fontSize: Record<string, number>
    fontWeight: Record<string, number>
    lineHeight: Record<string, number>
  }
  /** Shadow definitions */
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

/**
 * Layout component props
 */
export interface ProjectLayoutProps {
  /** Child components */
  children: React.ReactNode
  /** Navigation configuration */
  navigation?: NavigationConfig
  /** User role */
  userRole?: UserRole
  /** Project data */
  projectData?: ProjectData
  /** Custom layout configuration */
  layoutConfig?: Partial<LayoutConfig>
  /** Custom CSS classes */
  className?: string
  /** Custom inline styles */
  style?: React.CSSProperties
}

/**
 * Header component props
 */
export interface ProjectHeaderProps {
  /** Header configuration */
  config?: Partial<HeaderConfig>
  /** Navigation state */
  navigation?: NavigationConfig
  /** User data */
  user?: {
    name: string
    role: UserRole
    avatar?: string
  }
  /** Project information */
  project?: {
    name: string
    id: string
    stage: string
  }
  /** Custom actions */
  actions?: HeaderAction[]
  /** Header event handlers */
  onAction?: (actionId: string) => void
  /** Search handler */
  onSearch?: (query: string) => void
  /** Custom CSS classes */
  className?: string
}

/**
 * Sidebar component props
 */
export interface ProjectSidebarProps {
  /** Sidebar configuration */
  config?: Partial<SidebarConfig>
  /** Navigation state */
  navigation?: NavigationConfig
  /** User role for filtering content */
  userRole?: UserRole
  /** Quick actions */
  quickActions?: QuickAction[]
  /** Recent activity items */
  recentActivity?: ActivityItem[]
  /** Sidebar event handlers */
  onStateChange?: (state: SidebarState) => void
  /** Action handlers */
  onQuickAction?: (actionId: string) => void
  /** Custom CSS classes */
  className?: string
}

/**
 * Content area component props
 */
export interface ProjectContentProps {
  /** Content configuration */
  config?: Partial<ContentConfig>
  /** Navigation state for content routing */
  navigation?: NavigationConfig
  /** User role for content filtering */
  userRole?: UserRole
  /** Project data */
  projectData?: ProjectData
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string | null
  /** Custom CSS classes */
  className?: string
  /** Child components */
  children?: React.ReactNode
}

/**
 * Quick action configuration
 */
export interface QuickAction {
  /** Action identifier */
  id: string
  /** Action label */
  label: string
  /** Action icon */
  icon: React.ComponentType<{ className?: string }>
  /** Action description */
  description?: string
  /** Action handler */
  onClick: () => void
  /** Whether action is enabled */
  enabled?: boolean
  /** Required permissions */
  requiredPermissions?: string[]
  /** Action category */
  category?: string
  /** Keyboard shortcut */
  shortcut?: string
}

/**
 * Activity item for sidebar
 */
export interface ActivityItem {
  /** Activity identifier */
  id: string
  /** Activity type */
  type: "update" | "approval" | "milestone" | "alert" | "completion"
  /** Activity title */
  title: string
  /** Activity description */
  description: string
  /** Activity timestamp */
  timestamp: string
  /** Related user */
  user?: string
  /** Related project */
  project?: string
  /** Activity icon */
  icon: React.ComponentType<{ className?: string }>
  /** Activity color theme */
  color: string
  /** Whether activity is read */
  read?: boolean
  /** Action handler */
  onClick?: () => void
}

/**
 * Layout hook return type
 */
export interface UseLayoutReturn {
  /** Current layout state */
  state: LayoutState
  /** Layout actions */
  actions: LayoutActions
  /** Responsive utilities */
  responsive: ResponsiveUtilities
  /** Layout utilities */
  utils: LayoutUtilities
  /** Whether layout is currently animating */
  isAnimating: boolean
}

/**
 * Responsive hook return type
 */
export interface UseResponsiveReturn {
  /** Current responsive state */
  state: ResponsiveState
  /** Responsive utilities */
  utils: ResponsiveUtilities
  /** Breakpoint checks */
  is: ResponsiveUtilities["is"]
  /** Range checks */
  isAtLeast: ResponsiveUtilities["isAtLeast"]
  /** Range checks */
  isAtMost: ResponsiveUtilities["isAtMost"]
}

/**
 * Layout animation hook return type
 */
export interface UseLayoutAnimationReturn {
  /** Current animation state */
  state: LayoutAnimationState
  /** Start animation */
  startAnimation: (type: LayoutAnimationType, duration?: number) => void
  /** Stop animation */
  stopAnimation: () => void
  /** Whether specific animation is running */
  isAnimating: (type?: LayoutAnimationType) => boolean
}

export default LayoutConfig
