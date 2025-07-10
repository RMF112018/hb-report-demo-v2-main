/**
 * @fileoverview Layout system configuration constants
 * @module LayoutConstants
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Centralized configuration constants for the layout system,
 * including responsive breakpoints, default configurations, and themes.
 *
 * @example
 * ```typescript
 * import { DEFAULT_LAYOUT_CONFIG, RESPONSIVE_BREAKPOINTS } from './layout'
 *
 * const isMobile = window.innerWidth < RESPONSIVE_BREAKPOINTS.md
 * ```
 */

import { LayoutConfig, LayoutTheme, ResponsiveBreakpoint, HeaderAction, QuickAction, FooterLink } from "../types/layout"
import {
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Filter,
  Calendar,
  FileText,
  BarChart3,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  ExternalLink,
} from "lucide-react"

/**
 * Responsive breakpoint values in pixels
 */
export const RESPONSIVE_BREAKPOINTS: Record<ResponsiveBreakpoint, number> = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

/**
 * Default header configuration
 */
export const DEFAULT_HEADER_CONFIG = {
  fixed: true,
  height: 64,
  showBreadcrumbs: true,
  showUserMenu: true,
  showNotifications: true,
  showSearch: true,
  customActions: [],
}

/**
 * Default sidebar configuration
 */
export const DEFAULT_SIDEBAR_CONFIG = {
  visible: true,
  width: 280,
  state: "expanded" as const,
  resizable: true,
  minWidth: 240,
  maxWidth: 400,
  showQuickActions: true,
  showRecentActivity: true,
}

/**
 * Default content configuration
 */
export const DEFAULT_CONTENT_CONFIG = {
  padding: 24,
  maxWidth: undefined,
  scrollable: true,
  showLoading: true,
  backgroundColor: undefined,
}

/**
 * Default footer configuration
 */
export const DEFAULT_FOOTER_CONFIG = {
  visible: true,
  height: 48,
  sticky: false,
  content: "HB Intel © 2024 - Project Management Platform",
  links: [],
}

/**
 * Default layout configuration
 */
export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  header: DEFAULT_HEADER_CONFIG,
  sidebar: DEFAULT_SIDEBAR_CONFIG,
  content: DEFAULT_CONTENT_CONFIG,
  footer: DEFAULT_FOOTER_CONFIG,
  viewMode: "standard",
  breakpoint: "lg",
  isAnimating: false,
}

/**
 * Mobile layout configuration
 */
export const MOBILE_LAYOUT_CONFIG: Partial<LayoutConfig> = {
  sidebar: {
    ...DEFAULT_SIDEBAR_CONFIG,
    state: "overlay",
    width: 260,
    visible: false,
  },
  header: {
    ...DEFAULT_HEADER_CONFIG,
    showBreadcrumbs: false,
    showSearch: false,
  },
  content: {
    ...DEFAULT_CONTENT_CONFIG,
    padding: 16,
  },
  viewMode: "mobile",
}

/**
 * Tablet layout configuration
 */
export const TABLET_LAYOUT_CONFIG: Partial<LayoutConfig> = {
  sidebar: {
    ...DEFAULT_SIDEBAR_CONFIG,
    state: "collapsed",
    width: 240,
  },
  header: {
    ...DEFAULT_HEADER_CONFIG,
    showBreadcrumbs: true,
    showSearch: false,
  },
  content: {
    ...DEFAULT_CONTENT_CONFIG,
    padding: 20,
  },
  viewMode: "tablet",
}

/**
 * Compact layout configuration
 */
export const COMPACT_LAYOUT_CONFIG: Partial<LayoutConfig> = {
  sidebar: {
    ...DEFAULT_SIDEBAR_CONFIG,
    state: "collapsed",
    width: 240,
  },
  header: {
    ...DEFAULT_HEADER_CONFIG,
    height: 56,
    showBreadcrumbs: true,
  },
  content: {
    ...DEFAULT_CONTENT_CONFIG,
    padding: 16,
  },
  footer: {
    ...DEFAULT_FOOTER_CONFIG,
    height: 40,
  },
  viewMode: "compact",
}

/**
 * Layout animation configuration
 */
export const LAYOUT_ANIMATION_CONFIG = {
  /** Default animation duration in milliseconds */
  DURATION: 250,
  /** Sidebar animation duration */
  SIDEBAR_DURATION: 300,
  /** View mode transition duration */
  VIEW_MODE_DURATION: 200,
  /** Animation easing function */
  EASING: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  /** Whether animations are enabled by default */
  ENABLED: true,
  /** Respect reduced motion preference */
  RESPECT_REDUCED_MOTION: true,
}

/**
 * Default layout theme
 */
export const DEFAULT_LAYOUT_THEME: LayoutTheme = {
  name: "default",
  colors: {
    background: "#ffffff",
    surface: "#f8fafc",
    primary: "#3b82f6",
    secondary: "#6b7280",
    accent: "#10b981",
    text: "#111827",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
}

/**
 * Dark theme configuration
 */
export const DARK_LAYOUT_THEME: LayoutTheme = {
  ...DEFAULT_LAYOUT_THEME,
  name: "dark",
  colors: {
    background: "#0f172a",
    surface: "#1e293b",
    primary: "#3b82f6",
    secondary: "#64748b",
    accent: "#10b981",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    border: "#334155",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
}

/**
 * Default header actions
 */
export const DEFAULT_HEADER_ACTIONS: HeaderAction[] = [
  {
    id: "refresh",
    label: "Refresh",
    icon: RefreshCw,
    onClick: () => window.location.reload(),
    visible: true,
    tooltip: "Refresh page",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    onClick: () => console.log("Settings clicked"),
    visible: true,
    tooltip: "Open settings",
  },
]

/**
 * Default quick actions for sidebar
 */
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  {
    id: "new-report",
    label: "New Report",
    icon: FileText,
    description: "Create a new project report",
    onClick: () => console.log("New report"),
    enabled: true,
    category: "reports",
    shortcut: "Ctrl+N",
  },
  {
    id: "schedule-meeting",
    label: "Schedule Meeting",
    icon: Calendar,
    description: "Schedule a team meeting",
    onClick: () => console.log("Schedule meeting"),
    enabled: true,
    category: "collaboration",
  },
  {
    id: "financial-review",
    label: "Financial Review",
    icon: DollarSign,
    description: "Open financial dashboard",
    onClick: () => console.log("Financial review"),
    enabled: true,
    category: "finance",
  },
  {
    id: "export-data",
    label: "Export Data",
    icon: Download,
    description: "Export project data",
    onClick: () => console.log("Export data"),
    enabled: true,
    category: "tools",
  },
]

/**
 * Default footer links
 */
export const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  {
    id: "help",
    label: "Help",
    href: "/help",
    icon: MessageSquare,
  },
  {
    id: "support",
    label: "Support",
    href: "/support",
    icon: MessageSquare,
  },
  {
    id: "docs",
    label: "Documentation",
    href: "/docs",
    external: true,
    icon: ExternalLink,
  },
]

/**
 * Responsive layout configurations
 */
export const RESPONSIVE_LAYOUT_CONFIGS: Record<ResponsiveBreakpoint, Partial<LayoutConfig>> = {
  xs: {
    ...MOBILE_LAYOUT_CONFIG,
    sidebar: {
      ...DEFAULT_SIDEBAR_CONFIG,
      ...MOBILE_LAYOUT_CONFIG.sidebar,
      width: 240,
    },
    content: {
      ...DEFAULT_CONTENT_CONFIG,
      ...MOBILE_LAYOUT_CONFIG.content,
      padding: 12,
    },
  },
  sm: MOBILE_LAYOUT_CONFIG,
  md: TABLET_LAYOUT_CONFIG,
  lg: {},
  xl: {
    sidebar: {
      ...DEFAULT_SIDEBAR_CONFIG,
      width: 320,
    },
  },
  "2xl": {
    sidebar: {
      ...DEFAULT_SIDEBAR_CONFIG,
      width: 360,
    },
    content: {
      ...DEFAULT_CONTENT_CONFIG,
      maxWidth: 1400,
    },
  },
}

/**
 * Layout performance configuration
 */
export const LAYOUT_PERFORMANCE_CONFIG = {
  /** Debounce delay for resize events */
  RESIZE_DEBOUNCE: 100,
  /** Throttle delay for scroll events */
  SCROLL_THROTTLE: 16,
  /** Maximum sidebar width before performance impact */
  MAX_SIDEBAR_WIDTH: 500,
  /** Virtual scrolling threshold */
  VIRTUAL_SCROLL_THRESHOLD: 1000,
  /** Layout calculation cache TTL */
  CACHE_TTL: 60000, // 1 minute
}

/**
 * Accessibility configuration
 */
export const ACCESSIBILITY_CONFIG = {
  /** Focus trap configuration */
  FOCUS_TRAP: {
    enabled: true,
    returnFocus: true,
    escapeDeactivates: true,
  },
  /** Keyboard navigation */
  KEYBOARD_NAV: {
    enabled: true,
    tabIndex: 0,
    arrowKeys: true,
  },
  /** Screen reader configuration */
  SCREEN_READER: {
    announcements: true,
    landmarks: true,
    skipLinks: true,
  },
  /** Reduced motion */
  REDUCED_MOTION: {
    respectPreference: true,
    fallbackDuration: 0,
  },
}

/**
 * Layout validation rules
 */
export const LAYOUT_VALIDATION_RULES = {
  /** Minimum header height */
  MIN_HEADER_HEIGHT: 48,
  /** Maximum header height */
  MAX_HEADER_HEIGHT: 100,
  /** Minimum sidebar width */
  MIN_SIDEBAR_WIDTH: 200,
  /** Maximum sidebar width */
  MAX_SIDEBAR_WIDTH: 500,
  /** Minimum content padding */
  MIN_CONTENT_PADDING: 8,
  /** Maximum content padding */
  MAX_CONTENT_PADDING: 48,
  /** Minimum footer height */
  MIN_FOOTER_HEIGHT: 32,
  /** Maximum footer height */
  MAX_FOOTER_HEIGHT: 80,
}

/**
 * Layout storage keys for persisting preferences
 */
export const LAYOUT_STORAGE_KEYS = {
  /** Layout preferences */
  PREFERENCES: "hb-intel-layout-preferences",
  /** Sidebar state */
  SIDEBAR_STATE: "hb-intel-sidebar-state",
  /** Theme selection */
  THEME: "hb-intel-theme",
  /** View mode */
  VIEW_MODE: "hb-intel-view-mode",
}

/**
 * Layout CSS variables
 */
export const LAYOUT_CSS_VARIABLES = {
  /** Header height variable */
  HEADER_HEIGHT: "--header-height",
  /** Sidebar width variable */
  SIDEBAR_WIDTH: "--sidebar-width",
  /** Content padding variable */
  CONTENT_PADDING: "--content-padding",
  /** Footer height variable */
  FOOTER_HEIGHT: "--footer-height",
  /** Animation duration variable */
  ANIMATION_DURATION: "--animation-duration",
}

/**
 * Z-index scale for layout components
 */
export const Z_INDEX_SCALE = {
  /** Content area */
  CONTENT: 1,
  /** Sidebar */
  SIDEBAR: 10,
  /** Header */
  HEADER: 20,
  /** Mobile overlay */
  OVERLAY: 30,
  /** Dropdowns and popovers */
  DROPDOWN: 40,
  /** Modals */
  MODAL: 50,
  /** Tooltips */
  TOOLTIP: 60,
  /** Notifications */
  NOTIFICATION: 70,
}

/**
 * Layout media queries
 */
export const MEDIA_QUERIES = {
  xs: `(max-width: ${RESPONSIVE_BREAKPOINTS.xs - 1}px)`,
  sm: `(min-width: ${RESPONSIVE_BREAKPOINTS.xs}px)`,
  md: `(min-width: ${RESPONSIVE_BREAKPOINTS.sm}px)`,
  lg: `(min-width: ${RESPONSIVE_BREAKPOINTS.md}px)`,
  xl: `(min-width: ${RESPONSIVE_BREAKPOINTS.lg}px)`,
  "2xl": `(min-width: ${RESPONSIVE_BREAKPOINTS.xl}px)`,
  mobile: `(max-width: ${RESPONSIVE_BREAKPOINTS.md - 1}px)`,
  tablet: `(min-width: ${RESPONSIVE_BREAKPOINTS.md}px) and (max-width: ${RESPONSIVE_BREAKPOINTS.lg - 1}px)`,
  desktop: `(min-width: ${RESPONSIVE_BREAKPOINTS.lg}px)`,
  touch: "(hover: none) and (pointer: coarse)",
  mouse: "(hover: hover) and (pointer: fine)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  darkMode: "(prefers-color-scheme: dark)",
}

export default {
  RESPONSIVE_BREAKPOINTS,
  DEFAULT_LAYOUT_CONFIG,
  MOBILE_LAYOUT_CONFIG,
  TABLET_LAYOUT_CONFIG,
  COMPACT_LAYOUT_CONFIG,
  LAYOUT_ANIMATION_CONFIG,
  DEFAULT_LAYOUT_THEME,
  DARK_LAYOUT_THEME,
  DEFAULT_HEADER_ACTIONS,
  DEFAULT_QUICK_ACTIONS,
  DEFAULT_FOOTER_LINKS,
  RESPONSIVE_LAYOUT_CONFIGS,
  LAYOUT_PERFORMANCE_CONFIG,
  ACCESSIBILITY_CONFIG,
  LAYOUT_VALIDATION_RULES,
  LAYOUT_STORAGE_KEYS,
  LAYOUT_CSS_VARIABLES,
  Z_INDEX_SCALE,
  MEDIA_QUERIES,
}
