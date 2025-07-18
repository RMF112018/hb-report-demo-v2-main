/**
 * @fileoverview Dashboard Layout Hook
 * @module useDashboardLayout
 * @version 2.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Hook for managing dashboard layouts based on user role with multi-tab support
 */

import { useState, useEffect, useCallback, useMemo } from "react"
import type { DashboardCard } from "@/types/dashboard"
import type { UserRole } from "@/app/project/[projectId]/types/project"

interface DashboardLayoutConfig {
  id: string
  name: string
  description: string
  role: string
  cards: DashboardCard[]
}

interface DashboardLayoutState {
  layouts: DashboardLayoutConfig[]
  currentLayout: DashboardLayoutConfig | null
  cards: DashboardCard[]
  isLoading: boolean
  error: string | null
  isEditing: boolean
  layoutDensity: "compact" | "normal" | "spacious"
}

interface DashboardLayoutActions {
  onLayoutChange: (layout: DashboardCard[]) => void
  onCardRemove: (cardId: string) => void
  onCardConfigure: (cardId: string, configUpdate?: Partial<DashboardCard>) => void
  onCardSizeChange: (cardId: string, size: string) => void
  onCardAdd: () => void
  onSave: () => void
  onReset: () => void
  onToggleEdit: () => void
  onDensityChange: (density: "compact" | "normal" | "spacious") => void
}

export interface DashboardLayoutHookReturn extends DashboardLayoutState, DashboardLayoutActions {
  layout: DashboardLayoutConfig | null
  dashboards: Array<{ id: string; name: string }>
  currentDashboardId: string | null
  onDashboardSelect: (dashboardId: string) => void
}

/**
 * Hook for managing dashboard layouts based on user role with multi-tab support
 */
export const useDashboardLayout = (userRole: UserRole): DashboardLayoutHookReturn => {
  const [state, setState] = useState<DashboardLayoutState>({
    layouts: [],
    currentLayout: null,
    cards: [],
    isLoading: true,
    error: null,
    isEditing: false,
    layoutDensity: "normal",
  })

  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null)

  // Load dashboard layouts based on user role
  const loadDashboardLayouts = useCallback(async (role: UserRole) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Get layout files for the role
      const layoutFiles = getLayoutFilesForRole(role)

      // Load all layout configurations
      const layoutPromises = layoutFiles.map(async (file) => {
        const response = await fetch(`/data/mock/layouts/${file.filename}`)
        if (!response.ok) {
          throw new Error(`Failed to load layout: ${file.filename} (${response.status})`)
        }
        const layout: DashboardLayoutConfig = await response.json()
        return { ...layout, name: file.displayName || layout.name }
      })

      const layouts = await Promise.all(layoutPromises)

      // Set the first layout as current by default
      const currentLayout = layouts[0] || null

      setState((prev) => ({
        ...prev,
        layouts,
        currentLayout,
        cards: currentLayout?.cards || [],
        isLoading: false,
        error: null,
      }))

      setCurrentDashboardId(currentLayout?.id || null)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load dashboard layouts",
      }))
    }
  }, [])

  // Initialize dashboard layouts on role change
  useEffect(() => {
    loadDashboardLayouts(userRole)
  }, [userRole, loadDashboardLayouts])

  // Get layout files for user role
  const getLayoutFilesForRole = (role: UserRole): Array<{ filename: string; displayName?: string }> => {
    switch (role) {
      case "executive":
        return [
          { filename: "executive-layout.json", displayName: "Overview" },
          { filename: "executive-precon-layout.json", displayName: "Pre-Con Overview" },
          { filename: "executive-financial-layout.json", displayName: "Financial Review" },
        ]
      case "project-executive":
        return [
          { filename: "project-executive-layout.json", displayName: "Portfolio" },
          { filename: "project-executive-financial-layout.json", displayName: "Financial Review" },
        ]
      case "project-manager":
        return [
          { filename: "project-manager-layout.json", displayName: "Projects" },
          { filename: "project-manager-financial-layout.json", displayName: "Financial Review" },
        ]
      case "estimator":
        return [{ filename: "estimator-layout.json", displayName: "Dashboard" }]
      case "hr-payroll":
        return [{ filename: "hr-payroll-layout.json", displayName: "HR Overview" }]
      case "admin":
        return [{ filename: "it-layout.json", displayName: "IT Command Center" }]
      default:
        return [{ filename: "executive-layout.json", displayName: "Dashboard" }]
    }
  }

  // Dashboard actions
  const onLayoutChange = useCallback((layout: DashboardCard[]) => {
    setState((prev) => ({ ...prev, cards: layout }))
  }, [])

  const onCardRemove = useCallback((cardId: string) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }))
  }, [])

  const onCardConfigure = useCallback((cardId: string, configUpdate?: Partial<DashboardCard>) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((card) => (card.id === cardId ? { ...card, ...configUpdate } : card)),
    }))
  }, [])

  const onCardSizeChange = useCallback((cardId: string, size: string) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((card) => {
        if (card.id !== cardId) return card

        // Parse size string and update card span
        const span = parseSizeString(size)
        return { ...card, span, size }
      }),
    }))
  }, [])

  const onCardAdd = useCallback(() => {
    // TODO: Implement card addition modal/dialog
    console.log("Add card functionality to be implemented")
  }, [])

  const onSave = useCallback(() => {
    // TODO: Implement save functionality
    console.log("Save dashboard layout")
  }, [])

  const onReset = useCallback(() => {
    if (state.currentLayout) {
      setState((prev) => ({
        ...prev,
        cards: state.currentLayout?.cards || [],
      }))
    }
  }, [state.currentLayout])

  const onToggleEdit = useCallback(() => {
    setState((prev) => ({ ...prev, isEditing: !prev.isEditing }))
  }, [])

  const onDensityChange = useCallback((density: "compact" | "normal" | "spacious") => {
    setState((prev) => ({ ...prev, layoutDensity: density }))
  }, [])

  // Get available dashboards for the current user
  const dashboards = useMemo(() => {
    return state.layouts.map((layout) => ({
      id: layout.id,
      name: layout.name,
    }))
  }, [state.layouts])

  const onDashboardSelect = useCallback(
    (dashboardId: string) => {
      const selectedLayout = state.layouts.find((layout) => layout.id === dashboardId)
      if (selectedLayout) {
        setState((prev) => ({
          ...prev,
          currentLayout: selectedLayout,
          cards: selectedLayout.cards,
        }))
        setCurrentDashboardId(dashboardId)
      }
    },
    [state.layouts]
  )

  return {
    ...state,
    layout: state.currentLayout,
    dashboards,
    currentDashboardId,
    onDashboardSelect,
    onLayoutChange,
    onCardRemove,
    onCardConfigure,
    onCardSizeChange,
    onCardAdd,
    onSave,
    onReset,
    onToggleEdit,
    onDensityChange,
  }
}

/**
 * Parse size string into span dimensions
 */
const parseSizeString = (size: string): { cols: number; rows: number } => {
  // Handle custom size format: "custom-8x4"
  if (size.startsWith("custom-")) {
    const dimensions = size.replace("custom-", "").split("x")
    if (dimensions.length === 2) {
      return {
        cols: parseInt(dimensions[0], 10) || 6,
        rows: parseInt(dimensions[1], 10) || 4,
      }
    }
  }

  // Handle preset sizes
  switch (size) {
    case "compact":
      return { cols: 3, rows: 3 }
    case "standard":
      return { cols: 4, rows: 4 }
    case "wide":
      return { cols: 8, rows: 4 }
    case "tall":
      return { cols: 4, rows: 8 }
    case "large":
      return { cols: 6, rows: 6 }
    case "extra-wide":
      return { cols: 12, rows: 4 }
    case "full-width":
      return { cols: 16, rows: 6 }
    case "optimal":
    default:
      return { cols: 6, rows: 4 }
  }
}
