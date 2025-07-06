/**
 * @fileoverview User Preferences Provider with Layout Customization
 * @module UserPreferencesProvider
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Advanced user preferences system with layout customization, persistence,
 * synchronization, and real-time updates.
 */

"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

/**
 * Theme preferences
 */
export type Theme = "light" | "dark" | "system"

/**
 * Layout density options
 */
export type LayoutDensity = "compact" | "comfortable" | "spacious"

/**
 * View mode options
 */
export type ViewMode = "cards" | "table" | "kanban" | "timeline"

/**
 * Sidebar position options
 */
export type SidebarPosition = "left" | "right" | "hidden"

/**
 * Content layout options
 */
export type ContentLayout = "full-width" | "centered" | "sidebar-fixed"

/**
 * Widget size options
 */
export type WidgetSize = "small" | "medium" | "large"

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  /** Widget arrangement */
  widgets: {
    id: string
    position: { x: number; y: number }
    size: { width: number; height: number }
    visible: boolean
    collapsed: boolean
  }[]
  /** Column count */
  columns: number
  /** Row height */
  rowHeight: number
  /** Compact mode */
  compact: boolean
}

/**
 * Navigation preferences
 */
export interface NavigationPreferences {
  /** Default expanded tools */
  expandedTools: string[]
  /** Favorite tools */
  favoriteTools: string[]
  /** Recent tools */
  recentTools: string[]
  /** Max recent tools */
  maxRecentTools: number
  /** Show tool descriptions */
  showDescriptions: boolean
  /** Compact navigation */
  compactNavigation: boolean
}

/**
 * Content preferences
 */
export interface ContentPreferences {
  /** Default view mode */
  defaultViewMode: ViewMode
  /** Items per page */
  itemsPerPage: number
  /** Auto-refresh interval */
  autoRefreshInterval: number
  /** Show advanced filters */
  showAdvancedFilters: boolean
  /** Show performance metrics */
  showPerformanceMetrics: boolean
  /** Enable animations */
  enableAnimations: boolean
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  /** Enable push notifications */
  enablePushNotifications: boolean
  /** Enable email notifications */
  enableEmailNotifications: boolean
  /** Enable desktop notifications */
  enableDesktopNotifications: boolean
  /** Notification sound */
  notificationSound: boolean
  /** Notification types */
  notificationTypes: {
    projectUpdates: boolean
    financialAlerts: boolean
    scheduleChanges: boolean
    approvalRequests: boolean
  }
}

/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  /** High contrast mode */
  highContrast: boolean
  /** Reduced motion */
  reducedMotion: boolean
  /** Large text */
  largeText: boolean
  /** Screen reader support */
  screenReaderSupport: boolean
  /** Keyboard navigation */
  keyboardNavigation: boolean
  /** Focus indicators */
  focusIndicators: boolean
}

/**
 * Complete user preferences interface
 */
export interface UserPreferences {
  /** Theme preferences */
  theme: Theme
  /** Layout density */
  layoutDensity: LayoutDensity
  /** Sidebar position */
  sidebarPosition: SidebarPosition
  /** Content layout */
  contentLayout: ContentLayout
  /** Dashboard layout */
  dashboardLayout: DashboardLayout
  /** Navigation preferences */
  navigation: NavigationPreferences
  /** Content preferences */
  content: ContentPreferences
  /** Notification preferences */
  notifications: NotificationPreferences
  /** Accessibility preferences */
  accessibility: AccessibilityPreferences
  /** User ID */
  userId: string
  /** Last updated */
  lastUpdated: Date
  /** Version */
  version: string
}

/**
 * Preferences context value
 */
interface PreferencesContextValue {
  /** Current preferences */
  preferences: UserPreferences
  /** Update preferences */
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>
  /** Reset preferences */
  resetPreferences: () => Promise<void>
  /** Export preferences */
  exportPreferences: () => string
  /** Import preferences */
  importPreferences: (preferences: string) => Promise<void>
  /** Loading state */
  loading: boolean
  /** Error state */
  error: string | null
  /** Sync status */
  syncStatus: "idle" | "syncing" | "error" | "success"
}

/**
 * Default preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  layoutDensity: "comfortable",
  sidebarPosition: "left",
  contentLayout: "full-width",
  dashboardLayout: {
    widgets: [],
    columns: 4,
    rowHeight: 100,
    compact: false,
  },
  navigation: {
    expandedTools: ["Financial Hub", "Scheduler"],
    favoriteTools: ["Financial Hub", "Procurement", "Scheduler"],
    recentTools: [],
    maxRecentTools: 5,
    showDescriptions: true,
    compactNavigation: false,
  },
  content: {
    defaultViewMode: "cards",
    itemsPerPage: 25,
    autoRefreshInterval: 300000, // 5 minutes
    showAdvancedFilters: false,
    showPerformanceMetrics: false,
    enableAnimations: true,
  },
  notifications: {
    enablePushNotifications: true,
    enableEmailNotifications: true,
    enableDesktopNotifications: false,
    notificationSound: true,
    notificationTypes: {
      projectUpdates: true,
      financialAlerts: true,
      scheduleChanges: true,
      approvalRequests: true,
    },
  },
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReaderSupport: false,
    keyboardNavigation: true,
    focusIndicators: true,
  },
  userId: "",
  lastUpdated: new Date(),
  version: "1.0.0",
}

/**
 * Preferences context
 */
const PreferencesContext = createContext<PreferencesContextValue | null>(null)

/**
 * Storage key for preferences
 */
const PREFERENCES_STORAGE_KEY = "hb-project-preferences"

/**
 * Props for UserPreferencesProvider
 */
export interface UserPreferencesProviderProps {
  children: React.ReactNode
  userId: string
  enableSync?: boolean
  syncEndpoint?: string
}

/**
 * UserPreferencesProvider component - Comprehensive user preferences management
 */
export function UserPreferencesProvider({
  children,
  userId,
  enableSync = true,
  syncEndpoint = "/api/preferences",
}: UserPreferencesProviderProps) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error" | "success">("idle")

  const router = useRouter()

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as UserPreferences
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...parsed,
            userId,
            lastUpdated: new Date(parsed.lastUpdated),
          })
        } else {
          setPreferences((prev) => ({ ...prev, userId }))
        }
      } catch (error) {
        console.error("Failed to load preferences:", error)
        setError("Failed to load preferences")
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [userId])

  // Sync preferences with server
  const syncPreferences = useCallback(
    async (prefs: UserPreferences) => {
      if (!enableSync) return

      setSyncStatus("syncing")
      try {
        const response = await fetch(syncEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prefs),
        })

        if (!response.ok) {
          throw new Error("Failed to sync preferences")
        }

        setSyncStatus("success")
        setTimeout(() => setSyncStatus("idle"), 2000)
      } catch (error) {
        console.error("Failed to sync preferences:", error)
        setSyncStatus("error")
        setTimeout(() => setSyncStatus("idle"), 5000)
      }
    },
    [enableSync, syncEndpoint]
  )

  // Update preferences
  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      try {
        const updatedPreferences = {
          ...preferences,
          ...updates,
          lastUpdated: new Date(),
        }

        setPreferences(updatedPreferences)
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updatedPreferences))

        // Sync with server
        await syncPreferences(updatedPreferences)

        setError(null)
      } catch (error) {
        console.error("Failed to update preferences:", error)
        setError("Failed to update preferences")
      }
    },
    [preferences, syncPreferences]
  )

  // Reset preferences
  const resetPreferences = useCallback(async () => {
    try {
      const resetPrefs = { ...DEFAULT_PREFERENCES, userId }
      setPreferences(resetPrefs)
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(resetPrefs))

      // Sync with server
      await syncPreferences(resetPrefs)

      setError(null)
    } catch (error) {
      console.error("Failed to reset preferences:", error)
      setError("Failed to reset preferences")
    }
  }, [userId, syncPreferences])

  // Export preferences
  const exportPreferences = useCallback(() => {
    return JSON.stringify(preferences, null, 2)
  }, [preferences])

  // Import preferences
  const importPreferences = useCallback(
    async (preferencesString: string) => {
      try {
        const imported = JSON.parse(preferencesString) as UserPreferences
        await updatePreferences(imported)
      } catch (error) {
        console.error("Failed to import preferences:", error)
        setError("Failed to import preferences")
      }
    },
    [updatePreferences]
  )

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement

      if (preferences.theme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        root.classList.toggle("dark", isDark)
      } else {
        root.classList.toggle("dark", preferences.theme === "dark")
      }
    }

    applyTheme()

    // Listen for system theme changes
    if (preferences.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", applyTheme)

      return () => mediaQuery.removeEventListener("change", applyTheme)
    }
  }, [preferences.theme])

  // Apply accessibility preferences
  useEffect(() => {
    const root = document.documentElement

    // High contrast
    root.classList.toggle("high-contrast", preferences.accessibility.highContrast)

    // Reduced motion
    root.classList.toggle("reduced-motion", preferences.accessibility.reducedMotion)

    // Large text
    root.classList.toggle("large-text", preferences.accessibility.largeText)

    // Focus indicators
    root.classList.toggle("focus-indicators", preferences.accessibility.focusIndicators)
  }, [preferences.accessibility])

  // Apply layout density
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-layout-density", preferences.layoutDensity)
  }, [preferences.layoutDensity])

  // Context value
  const contextValue = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      updatePreferences,
      resetPreferences,
      exportPreferences,
      importPreferences,
      loading,
      error,
      syncStatus,
    }),
    [preferences, updatePreferences, resetPreferences, exportPreferences, importPreferences, loading, error, syncStatus]
  )

  return <PreferencesContext.Provider value={contextValue}>{children}</PreferencesContext.Provider>
}

/**
 * Hook to use preferences
 */
export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error("usePreferences must be used within a UserPreferencesProvider")
  }
  return context
}

/**
 * Hook to use theme preferences
 */
export function useTheme() {
  const { preferences, updatePreferences } = usePreferences()

  const setTheme = useCallback(
    (theme: Theme) => {
      updatePreferences({ theme })
    },
    [updatePreferences]
  )

  return { theme: preferences.theme, setTheme }
}

/**
 * Hook to use layout preferences
 */
export function useLayout() {
  const { preferences, updatePreferences } = usePreferences()

  const updateLayout = useCallback(
    (layoutUpdates: Partial<Pick<UserPreferences, "layoutDensity" | "sidebarPosition" | "contentLayout">>) => {
      updatePreferences(layoutUpdates)
    },
    [updatePreferences]
  )

  return {
    layoutDensity: preferences.layoutDensity,
    sidebarPosition: preferences.sidebarPosition,
    contentLayout: preferences.contentLayout,
    updateLayout,
  }
}

/**
 * Hook to use navigation preferences
 */
export function useNavigationPreferences() {
  const { preferences, updatePreferences } = usePreferences()

  const updateNavigation = useCallback(
    (navigationUpdates: Partial<NavigationPreferences>) => {
      updatePreferences({
        navigation: { ...preferences.navigation, ...navigationUpdates },
      })
    },
    [preferences.navigation, updatePreferences]
  )

  return {
    ...preferences.navigation,
    updateNavigation,
  }
}

/**
 * Hook to use content preferences
 */
export function useContentPreferences() {
  const { preferences, updatePreferences } = usePreferences()

  const updateContent = useCallback(
    (contentUpdates: Partial<ContentPreferences>) => {
      updatePreferences({
        content: { ...preferences.content, ...contentUpdates },
      })
    },
    [preferences.content, updatePreferences]
  )

  return {
    ...preferences.content,
    updateContent,
  }
}

export default UserPreferencesProvider
