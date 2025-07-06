/**
 * @fileoverview Navigation system type definitions
 * @module NavigationTypes
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Comprehensive type definitions for the project page navigation system,
 * including dual-state navigation, animations, and configuration.
 *
 * @example
 * ```typescript
 * import { NavigationConfig, AnimationState } from './navigation'
 *
 * const navigation: NavigationConfig = {
 *   category: 'Financial Management',
 *   tool: 'Financial Hub',
 *   subTool: 'overview',
 *   coreTab: null
 * }
 * ```
 */

/**
 * User role types
 */
export type UserRole =
  | "executive"
  | "project-executive"
  | "project-manager"
  | "superintendent"
  | "estimator"
  | "team-member"
  | "admin"
  | "viewer"

/**
 * Project stage types
 */
export type ProjectStage =
  | "BIM Coordination"
  | "Bidding"
  | "Pre-Construction"
  | "Construction"
  | "Closeout"
  | "Warranty"
  | "Closed"

/**
 * Core navigation configuration
 * Represents a specific navigation state with category, tool, and sub-tool selection
 */
export interface NavigationConfig {
  /** High-level category (e.g., 'Financial Management', 'Field Management') */
  category: string | null
  /** Specific tool within category (e.g., 'Financial Hub', 'Scheduler') */
  tool: string | null
  /** Sub-tool within tool (e.g., 'overview', 'budget-analysis') */
  subTool: string | null
  /** Core tab selection (e.g., 'reports', 'checklists') */
  coreTab: string | null
}

/**
 * Animation phases for navigation transitions
 */
export type AnimationPhase = "idle" | "exploring" | "committing" | "committed"

/**
 * Animation state management
 */
export interface AnimationState {
  /** Whether navigation transition is in progress */
  isNavigating: boolean
  /** Current animation phase */
  animationPhase: AnimationPhase
  /** Navigation state pending commit */
  pendingCommit: NavigationConfig | null
}

/**
 * Complete navigation state including dual-state system
 */
export interface NavigationState {
  /** Currently displayed content navigation */
  committed: NavigationConfig
  /** User's browsing/exploration navigation */
  exploration: NavigationConfig
  /** Animation and transition state */
  animation: AnimationState
  /** Legacy state for backward compatibility */
  legacy: LegacyNavigationState
}

/**
 * Legacy navigation state for backward compatibility
 * Will be removed in future versions
 */
export interface LegacyNavigationState {
  expandedCategory: string | null
  selectedTool: string | null
  selectedSubTool: string | null
  selectedCoreTab: string | null
}

/**
 * Stage configuration
 */
export interface StageConfig {
  /** Stage name */
  stageName: ProjectStage
  /** Stage display color */
  stageColor: string
  /** Available tools for this stage */
  availableTools: string[]
  /** Required permissions */
  requiredPermissions: string[]
  /** Stage-specific features */
  features: {
    showFinancials: boolean
    showScheduler: boolean
    showFieldReports: boolean
    showPermits: boolean
    showConstraints: boolean
  }
}

/**
 * Navigation action handlers
 */
export interface NavigationActions {
  /** Handle category selection */
  handleCategoryClick: (category: string) => void
  /** Handle tool selection */
  handleToolClick: (tool: string) => void
  /** Handle sub-tool selection */
  handleSubToolClick: (subTool: string) => void
  /** Handle core tab selection */
  handleCoreTabClick: (coreTab: string) => void
  /** Commit navigation state */
  handleNavigationCommit: (navigation: NavigationConfig) => void
  /** Reset navigation to overview */
  resetNavigation: () => void
}

/**
 * Tool configuration
 */
export interface ToolConfig {
  /** Tool name */
  name: string
  /** Navigation href */
  href: string
  /** Category assignment */
  category: string
  /** Tool description */
  description: string
  /** Roles that can access this tool */
  visibleRoles: string[]
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Sub-tool configuration
 */
export interface SubToolConfig {
  /** Sub-tool identifier */
  id: string
  /** Display label */
  label: string
  /** Icon for sub-tool */
  icon?: string
  /** Description */
  description?: string
}

/**
 * Core tab configuration
 */
export interface CoreTabConfig {
  /** Tab identifier */
  id: string
  /** Display label */
  label: string
  /** Tab description */
  description: string
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Category configuration
 */
export interface CategoryConfig {
  /** Category name */
  name: string
  /** Display label */
  label?: string
  /** Category color */
  color: string
  /** Category icon */
  icon: string
  /** Tools in this category */
  tools: ToolConfig[]
}

/**
 * Navigation context type
 */
export interface NavigationContextType {
  /** Current navigation state */
  state: NavigationState
  /** Navigation action handlers */
  actions: NavigationActions
  /** Available tools */
  tools: ToolConfig[]
  /** Available categories */
  categories: CategoryConfig[]
  /** Core tabs */
  coreTabs: CoreTabConfig[]
}

/**
 * Navigation provider props
 */
export interface NavigationProviderProps {
  /** Child components */
  children: React.ReactNode
  /** Initial navigation state */
  initialNavigation?: Partial<NavigationConfig>
  /** Available tools - optional, defaults to system tools */
  tools?: ToolConfig[]
  /** User role for permission filtering */
  userRole?: string
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Item label */
  label: string
  /** Navigation config for this item */
  navigation: Partial<NavigationConfig>
  /** Whether item is clickable */
  clickable: boolean
}

/**
 * Navigation transition options
 */
export interface TransitionOptions {
  /** Animation duration in milliseconds */
  duration?: number
  /** Easing function */
  easing?: string
  /** Whether to skip animation */
  skipAnimation?: boolean
}

/**
 * Navigation event types
 */
export type NavigationEventType =
  | "category-click"
  | "tool-click"
  | "subtool-click"
  | "coretab-click"
  | "breadcrumb-click"
  | "navigation-commit"
  | "navigation-reset"

/**
 * Navigation event data
 */
export interface NavigationEvent {
  /** Event type */
  type: NavigationEventType
  /** Navigation config */
  navigation: NavigationConfig
  /** Event timestamp */
  timestamp: number
  /** User interaction data */
  interaction?: {
    target: string
    position: { x: number; y: number }
  }
}

/**
 * Navigation history entry
 */
export interface NavigationHistoryEntry {
  /** Navigation configuration */
  navigation: NavigationConfig
  /** Entry timestamp */
  timestamp: number
  /** Entry title */
  title: string
  /** URL for this navigation state */
  url?: string
}

/**
 * Navigation analytics data
 */
export interface NavigationAnalytics {
  /** Page views by navigation state */
  pageViews: Record<string, number>
  /** Time spent in each state */
  timeSpent: Record<string, number>
  /** Navigation path analysis */
  navigationPaths: Array<{
    from: NavigationConfig
    to: NavigationConfig
    count: number
  }>
  /** Most accessed tools */
  popularTools: Array<{
    tool: string
    views: number
  }>
}

/**
 * Navigation performance metrics
 */
export interface NavigationPerformance {
  /** Average transition time */
  averageTransitionTime: number
  /** Cache hit rate */
  cacheHitRate: number
  /** Memory usage */
  memoryUsage: number
  /** Bundle size impact */
  bundleSize: number
}

/**
 * Navigation configuration options
 */
export interface NavigationOptions {
  /** Enable animation system */
  enableAnimations: boolean
  /** Enable deep linking */
  enableDeepLinking: boolean
  /** Enable navigation analytics */
  enableAnalytics: boolean
  /** Cache strategy */
  cacheStrategy: "memory" | "localStorage" | "sessionStorage" | "none"
  /** Debug mode */
  debug: boolean
}

/**
 * Navigation hook return type
 */
export interface UseNavigationReturn {
  /** Current navigation state */
  state: NavigationState
  /** Navigation actions */
  actions: NavigationActions
  /** Navigation history */
  history: NavigationHistoryEntry[]
  /** Performance metrics */
  performance: NavigationPerformance
  /** Utility functions */
  utils: {
    /** Get breadcrumb items */
    getBreadcrumbs: () => BreadcrumbItem[]
    /** Check if navigation is valid */
    isValidNavigation: (nav: NavigationConfig) => boolean
    /** Get navigation URL */
    getNavigationUrl: (nav: NavigationConfig) => string
  }
}

export default NavigationConfig
