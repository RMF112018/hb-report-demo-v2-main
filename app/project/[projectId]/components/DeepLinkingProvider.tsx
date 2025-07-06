/**
 * @fileoverview Deep Linking Provider for URL Synchronization
 * @module DeepLinkingProvider
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Advanced deep linking system with URL synchronization, navigation state
 * management, history tracking, and shareable URLs.
 */

"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useNavigation } from "../hooks/useNavigation"
import type { NavigationState, NavigationConfig } from "../types/navigation"

/**
 * URL parameters interface
 */
interface URLParams {
  /** Current tool */
  tool?: string
  /** Current category */
  category?: string
  /** Current sub-tool */
  subTool?: string
  /** Current view mode */
  view?: string
  /** Current filters */
  filters?: Record<string, string>
  /** Current page */
  page?: number
  /** Current sort */
  sort?: string
  /** Current search */
  search?: string
  /** Custom parameters */
  custom?: Record<string, string>
}

/**
 * Deep link configuration
 */
interface DeepLinkConfig {
  /** Enable URL synchronization */
  enableSync: boolean
  /** Enable history tracking */
  enableHistory: boolean
  /** Enable shareable URLs */
  enableSharing: boolean
  /** Debounce delay for URL updates */
  debounceDelay: number
  /** Maximum history entries */
  maxHistoryEntries: number
  /** URL parameter prefix */
  paramPrefix: string
}

/**
 * History entry interface
 */
interface HistoryEntry {
  /** Entry ID */
  id: string
  /** URL */
  url: string
  /** Navigation state */
  state: NavigationState
  /** Timestamp */
  timestamp: Date
  /** Title */
  title: string
  /** Description */
  description?: string
}

/**
 * Deep linking context value
 */
interface DeepLinkingContextValue {
  /** Current URL parameters */
  urlParams: URLParams
  /** Update URL parameters */
  updateURLParams: (params: Partial<URLParams>) => void
  /** Navigate to URL */
  navigateToURL: (url: string) => void
  /** Generate shareable URL */
  generateShareableURL: (state?: Partial<NavigationState>) => string
  /** History entries */
  history: HistoryEntry[]
  /** Navigate to history entry */
  navigateToHistory: (entryId: string) => void
  /** Clear history */
  clearHistory: () => void
  /** Loading state */
  loading: boolean
  /** Error state */
  error: string | null
}

/**
 * Default deep link configuration
 */
const DEFAULT_CONFIG: DeepLinkConfig = {
  enableSync: true,
  enableHistory: true,
  enableSharing: true,
  debounceDelay: 500,
  maxHistoryEntries: 50,
  paramPrefix: "hb",
}

/**
 * Deep linking context
 */
const DeepLinkingContext = createContext<DeepLinkingContextValue | null>(null)

/**
 * Storage key for history
 */
const HISTORY_STORAGE_KEY = "hb-navigation-history"

/**
 * Props for DeepLinkingProvider
 */
export interface DeepLinkingProviderProps {
  children: React.ReactNode
  projectId: string
  config?: Partial<DeepLinkConfig>
}

/**
 * DeepLinkingProvider component - Advanced URL synchronization
 */
export function DeepLinkingProvider({ children, projectId, config = {} }: DeepLinkingProviderProps) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { state, actions } = useNavigation()

  const [urlParams, setUrlParams] = useState<URLParams>({})
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [syncTimeout, setSyncTimeout] = useState<NodeJS.Timeout | null>(null)

  // Parse URL parameters
  const parseURLParams = useCallback((): URLParams => {
    const params: URLParams = {}

    // Parse search parameters
    const tool = searchParams.get(`${finalConfig.paramPrefix}_tool`)
    const category = searchParams.get(`${finalConfig.paramPrefix}_category`)
    const subTool = searchParams.get(`${finalConfig.paramPrefix}_sub`)
    const view = searchParams.get(`${finalConfig.paramPrefix}_view`)
    const page = searchParams.get(`${finalConfig.paramPrefix}_page`)
    const sort = searchParams.get(`${finalConfig.paramPrefix}_sort`)
    const search = searchParams.get(`${finalConfig.paramPrefix}_search`)

    if (tool) params.tool = tool
    if (category) params.category = category
    if (subTool) params.subTool = subTool
    if (view) params.view = view
    if (page) params.page = parseInt(page, 10)
    if (sort) params.sort = sort
    if (search) params.search = search

    // Parse filters
    const filters: Record<string, string> = {}
    const customParams: Record<string, string> = {}

    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith(`${finalConfig.paramPrefix}_filter_`)) {
        const filterKey = key.replace(`${finalConfig.paramPrefix}_filter_`, "")
        filters[filterKey] = value
      } else if (key.startsWith(`${finalConfig.paramPrefix}_custom_`)) {
        const customKey = key.replace(`${finalConfig.paramPrefix}_custom_`, "")
        customParams[customKey] = value
      }
    }

    if (Object.keys(filters).length > 0) params.filters = filters
    if (Object.keys(customParams).length > 0) params.custom = customParams

    return params
  }, [searchParams, finalConfig.paramPrefix])

  // Generate URL from parameters
  const generateURL = useCallback(
    (params: URLParams): string => {
      const url = new URL(window.location.href)

      // Clear existing parameters
      for (const key of Array.from(url.searchParams.keys())) {
        if (key.startsWith(finalConfig.paramPrefix)) {
          url.searchParams.delete(key)
        }
      }

      // Set new parameters
      if (params.tool) url.searchParams.set(`${finalConfig.paramPrefix}_tool`, params.tool)
      if (params.category) url.searchParams.set(`${finalConfig.paramPrefix}_category`, params.category)
      if (params.subTool) url.searchParams.set(`${finalConfig.paramPrefix}_sub`, params.subTool)
      if (params.view) url.searchParams.set(`${finalConfig.paramPrefix}_view`, params.view)
      if (params.page) url.searchParams.set(`${finalConfig.paramPrefix}_page`, params.page.toString())
      if (params.sort) url.searchParams.set(`${finalConfig.paramPrefix}_sort`, params.sort)
      if (params.search) url.searchParams.set(`${finalConfig.paramPrefix}_search`, params.search)

      // Set filters
      if (params.filters) {
        for (const [key, value] of Object.entries(params.filters)) {
          url.searchParams.set(`${finalConfig.paramPrefix}_filter_${key}`, value)
        }
      }

      // Set custom parameters
      if (params.custom) {
        for (const [key, value] of Object.entries(params.custom)) {
          url.searchParams.set(`${finalConfig.paramPrefix}_custom_${key}`, value)
        }
      }

      return url.toString()
    },
    [finalConfig.paramPrefix]
  )

  // Load history from localStorage
  useEffect(() => {
    if (!finalConfig.enableHistory) return

    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryEntry[]
        setHistory(
          parsed.map((entry) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          }))
        )
      }
    } catch (error) {
      console.error("Failed to load navigation history:", error)
    }
  }, [finalConfig.enableHistory])

  // Save history to localStorage
  const saveHistory = useCallback(
    (entries: HistoryEntry[]) => {
      if (!finalConfig.enableHistory) return

      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries))
      } catch (error) {
        console.error("Failed to save navigation history:", error)
      }
    },
    [finalConfig.enableHistory]
  )

  // Add history entry
  const addHistoryEntry = useCallback(
    (state: NavigationState, url: string) => {
      if (!finalConfig.enableHistory) return

      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        state,
        timestamp: new Date(),
        title: `${state.committed.tool || "Dashboard"} - ${state.committed.category || "Overview"}`,
        description: state.committed.subTool ? `Sub-tool: ${state.committed.subTool}` : undefined,
      }

      setHistory((prev) => {
        const newHistory = [entry, ...prev.slice(0, finalConfig.maxHistoryEntries - 1)]
        saveHistory(newHistory)
        return newHistory
      })
    },
    [finalConfig.enableHistory, finalConfig.maxHistoryEntries, saveHistory]
  )

  // Parse URL on load
  useEffect(() => {
    const params = parseURLParams()
    setUrlParams(params)

    // Sync with navigation state if URL has parameters
    if (finalConfig.enableSync && (params.tool || params.category)) {
      const newNavigation: NavigationConfig = {
        tool: params.tool || null,
        category: params.category || null,
        subTool: params.subTool || null,
        coreTab: null,
      }
      actions.handleNavigationCommit(newNavigation)
    }
  }, [parseURLParams, finalConfig.enableSync, actions])

  // Sync navigation state to URL
  useEffect(() => {
    if (!finalConfig.enableSync) return

    const newParams: URLParams = {
      tool: state.committed.tool || undefined,
      category: state.committed.category || undefined,
      subTool: state.committed.subTool || undefined,
    }

    // Clear existing timeout
    if (syncTimeout) {
      clearTimeout(syncTimeout)
    }

    // Debounce URL updates
    const timeout = setTimeout(() => {
      const newURL = generateURL(newParams)

      // Only update if URL actually changed
      if (newURL !== window.location.href) {
        router.push(newURL, { scroll: false })
        addHistoryEntry(state, newURL)
      }

      setUrlParams(newParams)
    }, finalConfig.debounceDelay)

    setSyncTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [state, finalConfig.enableSync, finalConfig.debounceDelay, generateURL, router, addHistoryEntry, syncTimeout])

  // Update URL parameters
  const updateURLParams = useCallback(
    (params: Partial<URLParams>) => {
      const newParams = { ...urlParams, ...params }
      setUrlParams(newParams)

      if (finalConfig.enableSync) {
        const newURL = generateURL(newParams)
        router.push(newURL, { scroll: false })
      }
    },
    [urlParams, finalConfig.enableSync, generateURL, router]
  )

  // Navigate to URL
  const navigateToURL = useCallback(
    (url: string) => {
      setLoading(true)
      setError(null)

      try {
        router.push(url)
      } catch (error) {
        console.error("Failed to navigate to URL:", error)
        setError("Failed to navigate to URL")
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  // Generate shareable URL
  const generateShareableURL = useCallback(
    (navState?: Partial<NavigationState>): string => {
      if (!finalConfig.enableSharing) return window.location.href

      const targetState = navState || state
      const params: URLParams = {
        tool: targetState.committed?.tool || undefined,
        category: targetState.committed?.category || undefined,
        subTool: targetState.committed?.subTool || undefined,
      }

      return generateURL(params)
    },
    [finalConfig.enableSharing, state, generateURL]
  )

  // Navigate to history entry
  const navigateToHistory = useCallback(
    (entryId: string) => {
      const entry = history.find((h) => h.id === entryId)
      if (!entry) return

      actions.handleNavigationCommit(entry.state.committed)
      navigateToURL(entry.url)
    },
    [history, actions, navigateToURL]
  )

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    if (finalConfig.enableHistory) {
      localStorage.removeItem(HISTORY_STORAGE_KEY)
    }
  }, [finalConfig.enableHistory])

  // Context value
  const contextValue = useMemo<DeepLinkingContextValue>(
    () => ({
      urlParams,
      updateURLParams,
      navigateToURL,
      generateShareableURL,
      history,
      navigateToHistory,
      clearHistory,
      loading,
      error,
    }),
    [
      urlParams,
      updateURLParams,
      navigateToURL,
      generateShareableURL,
      history,
      navigateToHistory,
      clearHistory,
      loading,
      error,
    ]
  )

  return <DeepLinkingContext.Provider value={contextValue}>{children}</DeepLinkingContext.Provider>
}

/**
 * Hook to use deep linking
 */
export function useDeepLinking() {
  const context = useContext(DeepLinkingContext)
  if (!context) {
    throw new Error("useDeepLinking must be used within a DeepLinkingProvider")
  }
  return context
}

/**
 * Hook to use URL parameters
 */
export function useURLParams() {
  const { urlParams, updateURLParams } = useDeepLinking()
  return { urlParams, updateURLParams }
}

/**
 * Hook to use navigation history
 */
export function useNavigationHistory() {
  const { history, navigateToHistory, clearHistory } = useDeepLinking()
  return { history, navigateToHistory, clearHistory }
}

/**
 * Hook to use shareable URLs
 */
export function useShareableURL() {
  const { generateShareableURL } = useDeepLinking()

  const shareCurrentPage = useCallback(() => {
    const url = generateShareableURL()

    if (navigator.share) {
      navigator.share({
        title: "HB Project Page",
        url,
      })
    } else {
      navigator.clipboard.writeText(url)
    }
  }, [generateShareableURL])

  return { generateShareableURL, shareCurrentPage }
}

export default DeepLinkingProvider
