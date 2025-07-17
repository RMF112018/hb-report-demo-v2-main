"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import { AgGridReact } from "ag-grid-react"
import {
  ColDef,
  GridApi,
  GridOptions,
  CellValueChangedEvent,
  CellEditingStoppedEvent,
  RowSelectedEvent,
  FilterChangedEvent,
  SortChangedEvent,
  GridReadyEvent,
  CellContextMenuEvent,
  CellEditingStartedEvent,
  ModuleRegistry,
  AllCommunityModule,
} from "ag-grid-community"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Badge } from "./badge"
import { Download, Upload, RefreshCw, Lock, Unlock, Eye, EyeOff, Filter, Search, Settings } from "lucide-react"

// Import ag-grid styles - using legacy CSS for compatibility
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import "ag-grid-community/styles/ag-theme-material.css"

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

/**
 * Protection levels for cells/columns
 */
export type ProtectionLevel = "none" | "read-only" | "locked" | "hidden"

/**
 * Cell protection configuration
 */
export interface CellProtection {
  level: ProtectionLevel
  message?: string
  allowedRoles?: string[]
  validator?: (value: any) => boolean | string
}

/**
 * Extended column definition with protection features
 */
export interface ProtectedColDef extends ColDef {
  protection?: CellProtection
  isProtected?: boolean
  isRequired?: boolean
  formula?: string
  dependsOn?: string[]
}

/**
 * Grid data row interface
 */
export interface GridRow {
  id: string | number
  [key: string]: any
  _protection?: {
    [columnId: string]: CellProtection
  }
}

/**
 * Grid configuration options
 */
export interface GridConfig {
  allowExport?: boolean
  allowImport?: boolean
  allowRowSelection?: boolean
  allowMultiSelection?: boolean
  allowColumnReordering?: boolean
  allowColumnResizing?: boolean
  allowSorting?: boolean
  allowFiltering?: boolean
  allowCellEditing?: boolean
  showToolbar?: boolean
  showStatusBar?: boolean
  enableRangeSelection?: boolean
  protectionEnabled?: boolean
  userRole?: string
  theme?: "alpine" | "balham" | "material" | "quartz"
  enableTotalsRow?: boolean
  stickyColumnsCount?: number
}

/**
 * Grid events interface
 */
export interface GridEvents {
  onCellValueChanged?: (event: CellValueChangedEvent) => void
  onCellEditingStopped?: (event: CellEditingStoppedEvent) => void
  onRowSelected?: (event: RowSelectedEvent) => void
  onFilterChanged?: (event: FilterChangedEvent) => void
  onSortChanged?: (event: SortChangedEvent) => void
  onGridReady?: (event: GridReadyEvent) => void
  onCellContextMenu?: (event: CellContextMenuEvent) => void
  onProtectionViolation?: (message: string, cell: any) => void
}

/**
 * Props for the ProtectedGrid component
 */
export interface ProtectedGridProps {
  /** Column definitions with protection settings */
  columnDefs: ProtectedColDef[]

  /** Row data */
  rowData: GridRow[]

  /** Grid configuration */
  config?: GridConfig

  /** Event handlers */
  events?: GridEvents

  /** Custom CSS classes */
  className?: string

  /** Grid height */
  height?: string | number

  /** Grid width */
  width?: string | number

  /** Loading state */
  loading?: boolean

  /** Error state */
  error?: string

  /** Grid title */
  title?: string

  /** Enable search functionality */
  enableSearch?: boolean

  /** Default search value */
  defaultSearch?: string

  /** Function to calculate totals for numeric columns */
  totalsCalculator?: (data: GridRow[], columnField: string) => number | string
}

/**
 * ProtectedGrid Component - Excel-like grid with protection features
 */
export function ProtectedGrid({
  columnDefs,
  rowData,
  config = {},
  events = {},
  className,
  height = "400px",
  width = "100%",
  loading = false,
  error,
  title,
  enableSearch = true,
  defaultSearch = "",
  totalsCalculator,
}: ProtectedGridProps) {
  const { theme } = useTheme()
  const gridRef = useRef<AgGridReact>(null)
  const [gridApi, setGridApi] = useState<GridApi | null>(null)
  const [searchValue, setSearchValue] = useState(defaultSearch)
  const [protectionMode, setProtectionMode] = useState(config.protectionEnabled ?? true)
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [showHiddenColumns, setShowHiddenColumns] = useState(false)

  // Get the appropriate AG Grid theme class based on current theme
  const getGridThemeClass = useCallback(() => {
    const isDark = theme === "dark"
    const configTheme = config.theme || "quartz"

    // Map theme combinations to AG Grid classes
    switch (configTheme) {
      case "alpine":
        return isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine"
      case "quartz":
        return isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz"
      case "balham":
        return isDark ? "ag-theme-balham-dark" : "ag-theme-balham"
      case "material":
        return isDark ? "ag-theme-material-dark" : "ag-theme-material"
      default:
        return isDark ? "ag-theme-quartz-dark" : "ag-theme-quartz"
    }
  }, [theme, config.theme])

  // Default grid configuration
  const defaultConfig: GridConfig = {
    allowExport: true,
    allowImport: false,
    allowRowSelection: true,
    allowMultiSelection: false,
    allowColumnReordering: true,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: true,
    showToolbar: true,
    showStatusBar: true,
    enableRangeSelection: false, // Disabled - requires enterprise CellSelectionModule
    protectionEnabled: true,
    userRole: "user",
    theme: "quartz", // Use quartz theme for better dark mode support
    enableTotalsRow: false,
    stickyColumnsCount: 6,
    ...config,
  }

  // Process column definitions with protection
  const processedColumnDefs = useMemo(() => {
    return columnDefs.map((colDef, index) => {
      const protection = colDef.protection
      const isProtected = protection?.level !== "none" && protectionMode

      // Handle sticky columns (pin first N columns to left)
      const isSticky = index < (defaultConfig.stickyColumnsCount || 0)
      const pinnedValue = isSticky ? ("left" as const) : undefined

      // Extract custom properties that AG Grid doesn't understand
      const {
        protection: _,
        isProtected: __,
        isRequired: ___,
        formula: ____,
        dependsOn: _____,
        ...agGridColDef
      } = colDef

      // Handle hidden columns
      if (protection?.level === "hidden" && !showHiddenColumns) {
        return {
          ...agGridColDef,
          hide: true,
          pinned: pinnedValue,
        }
      }

      // Handle read-only and locked columns
      if (protection?.level === "read-only" || protection?.level === "locked") {
        return {
          ...agGridColDef,
          editable: false,
          pinned: pinnedValue,
          cellStyle: (params: any) => {
            const baseStyle = typeof colDef.cellStyle === "function" ? colDef.cellStyle(params) : colDef.cellStyle || {}
            const isDark = theme === "dark"
            const rowType = params.data?.rowType

            const result: any = { ...baseStyle }

            // Section header styling
            if (rowType === "section") {
              result.backgroundColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
              result.fontWeight = "bold"
              // Make entire row non-editable for section headers
              params.node.setRowSelectable(false)
            }

            // Subtotal row styling
            if (rowType === "subtotal") {
              result.backgroundColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
              result.fontWeight = "bold"
              result.borderTop = isDark ? "1px solid #555" : "1px solid #ddd"
            }

            // Protection level styling
            if (protection.level === "locked") {
              result.backgroundColor =
                result.backgroundColor || (isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)")
              result.color = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
            } else if (protection.level === "read-only") {
              result.backgroundColor =
                result.backgroundColor || (isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)")
              result.color = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
            }

            result.cursor = protection.level === "locked" || rowType === "section" ? "not-allowed" : "default"

            return result
          },
          headerClass: `${colDef.headerClass || ""} ${
            protection.level === "locked" ? "locked-column" : "readonly-column"
          }`,
        }
      }

      // Handle editable columns with validation and rowType styling
      return {
        ...agGridColDef,
        pinned: pinnedValue,
        cellStyle: (params: any) => {
          const baseStyle = typeof colDef.cellStyle === "function" ? colDef.cellStyle(params) : colDef.cellStyle || {}
          const isDark = theme === "dark"
          const rowType = params.data?.rowType

          const result: any = { ...baseStyle }

          // Section header styling
          if (rowType === "section") {
            result.backgroundColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"
            result.fontWeight = "bold"
            // Make entire row non-editable for section headers
            params.node.setRowSelectable(false)
          }

          // Subtotal row styling
          if (rowType === "subtotal") {
            result.backgroundColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"
            result.fontWeight = "bold"
            result.borderTop = isDark ? "1px solid #555" : "1px solid #ddd"
          }

          result.cursor = rowType === "section" ? "not-allowed" : "default"

          return result
        },
        editable: (params: any): boolean => {
          // Make section headers non-editable
          if (params.data?.rowType === "section") {
            return false
          }
          return defaultConfig.allowCellEditing || false
        },
        cellEditor: protection?.validator ? "agTextCellEditor" : "agTextCellEditor",
        cellEditorParams: protection?.validator
          ? {
              validation: protection.validator,
            }
          : undefined,
      }
    })
  }, [
    columnDefs,
    protectionMode,
    showHiddenColumns,
    defaultConfig.allowCellEditing,
    defaultConfig.stickyColumnsCount,
    theme,
  ])

  // Calculate totals row data
  const totalsRowData = useMemo(() => {
    if (!defaultConfig.enableTotalsRow || !rowData.length) return []

    const totalsRow: any = {
      id: "totals-row",
      _isTotalsRow: true,
    }

    // Calculate totals for each column
    processedColumnDefs.forEach((colDef, index) => {
      const field = colDef.field
      if (!field) return

      // First column shows "Total" label
      if (index === 0) {
        totalsRow[field] = "Total"
        return
      }

      // Skip non-numeric columns or use custom calculator
      if (totalsCalculator) {
        const calculatedValue = totalsCalculator(rowData, field)
        totalsRow[field] = calculatedValue
      } else {
        // Default calculation for numeric columns
        const values = rowData
          .map((row) => {
            const value = row[field]
            return typeof value === "number" ? value : parseFloat(value)
          })
          .filter((val) => !isNaN(val))

        if (values.length > 0) {
          totalsRow[field] = values.reduce((sum, val) => sum + val, 0)
        } else {
          totalsRow[field] = ""
        }
      }
    })

    return [totalsRow]
  }, [defaultConfig.enableTotalsRow, rowData, processedColumnDefs, totalsCalculator])

  // Grid options
  const gridOptions: GridOptions = useMemo(
    () => ({
      columnDefs: processedColumnDefs,
      rowData,
      pinnedBottomRowData: totalsRowData,
      theme: "legacy", // Use legacy theme to avoid v33+ theming conflicts
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        // Remove maxWidth to allow columns to grow as needed for horizontal scrolling
        resizable: defaultConfig.allowColumnResizing,
        sortable: defaultConfig.allowSorting,
        filter: defaultConfig.allowFiltering,
        editable: defaultConfig.allowCellEditing,
        cellEditor: "agTextCellEditor",
        suppressSizeToFit: false, // Enable auto-sizing to fit container
      },
      rowSelection: defaultConfig.allowRowSelection
        ? {
            mode: defaultConfig.allowMultiSelection ? "multiRow" : "singleRow",
            checkboxes: false,
            headerCheckbox: false,
            enableClickSelection: true,
          }
        : undefined,
      cellSelection: defaultConfig.enableRangeSelection,
      suppressMovableColumns: !defaultConfig.allowColumnReordering,
      suppressHorizontalScroll: false, // Enable horizontal scrolling within the grid
      maintainColumnOrder: true, // Prevent column reordering that could affect width calculations
      getRowStyle: (params) => {
        const isDark = theme === "dark"

        // Special styling for totals row
        if (params.data?._isTotalsRow) {
          return {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
            fontWeight: "bold",
            borderTop: isDark ? "2px solid #555" : "2px solid #ddd",
          } as any
        }

        // Alternating row colors (zebra striping)
        if (params.node.rowIndex !== null && params.node.rowIndex % 2 === 1) {
          return {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
          } as any
        }

        return undefined
      },
      onGridReady: (event: GridReadyEvent) => {
        setGridApi(event.api)
        events.onGridReady?.(event)
      },
      onRowSelected: (event: RowSelectedEvent) => {
        const selectedNodes = event.api.getSelectedNodes()
        setSelectedRows(selectedNodes.map((node) => node.data))
        events.onRowSelected?.(event)
      },
      onCellValueChanged: (event: CellValueChangedEvent) => {
        const colDef = event.column.getColDef() as ProtectedColDef
        const protection = colDef.protection

        // Handle validation if validator exists
        if (protection?.validator) {
          const validation = protection.validator(event.newValue)
          if (validation !== true) {
            events.onProtectionViolation?.(typeof validation === "string" ? validation : "Invalid value", event)
            // Revert the change
            event.node.setDataValue(event.column.getId(), event.oldValue)
            return
          }
        }

        // Call the original event handler
        events.onCellValueChanged?.(event)
      },
      onCellEditingStopped: events.onCellEditingStopped,
      onFilterChanged: events.onFilterChanged,
      onSortChanged: events.onSortChanged,
      onCellContextMenu: events.onCellContextMenu,
      onCellEditingStarted: (event: CellEditingStartedEvent) => {
        const colDef = event.column.getColDef() as ProtectedColDef
        const protection = colDef.protection

        if (protection?.level === "read-only" || protection?.level === "locked") {
          event.api.stopEditing()
          events.onProtectionViolation?.(protection.message || "This cell is protected and cannot be edited", event)
        }
      },
    }),
    [processedColumnDefs, rowData, totalsRowData, defaultConfig, events]
  )

  // Handle search
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      if (gridApi) {
        gridApi.setGridOption("quickFilterText", value)
      }
    },
    [gridApi]
  )

  // Handle export
  const handleExport = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: `${title || "grid-data"}-${new Date().toISOString().split("T")[0]}.csv`,
      })
    }
  }, [gridApi, title])

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (gridApi) {
      gridApi.refreshCells({ force: true })
    }
  }, [gridApi])

  // Toggle protection mode
  const toggleProtection = useCallback(() => {
    setProtectionMode((prev) => !prev)
  }, [])

  // Toggle hidden columns
  const toggleHiddenColumns = useCallback(() => {
    setShowHiddenColumns((prev) => !prev)
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    if (gridApi) {
      gridApi.setFilterModel(null)
    }
  }, [gridApi])

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className={cn("w-full min-w-0 max-w-full overflow-hidden", className)}>
      {/* Grid Header */}
      {(title || defaultConfig.showToolbar) && (
        <div className="flex items-center justify-between p-4 border-b bg-background border-border">
          <div className="flex items-center gap-2">
            {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
            {protectionMode && (
              <Badge variant="outline" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Protected
              </Badge>
            )}
          </div>

          {defaultConfig.showToolbar && (
            <div className="flex items-center gap-2">
              {enableSearch && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={toggleProtection}
                title={protectionMode ? "Disable Protection" : "Enable Protection"}
              >
                {protectionMode ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleHiddenColumns}
                title={showHiddenColumns ? "Hide Protected Columns" : "Show Hidden Columns"}
              >
                {showHiddenColumns ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={clearFilters} title="Clear Filters">
                <Filter className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={handleRefresh} title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>

              {defaultConfig.allowExport && (
                <Button variant="outline" size="sm" onClick={handleExport} title="Export to CSV">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grid Container */}
      <div
        className={cn(
          getGridThemeClass(),
          "border-border", // Ensure borders match theme
          theme === "dark" ? "ag-grid-dark-theme" : "ag-grid-light-theme",
          "w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden" // Enable horizontal scrolling
        )}
        style={
          {
            height,
            width: "100%", // Force 100% width but constrained by parent
            minWidth: 0, // Allow shrinking below content width
            maxWidth: "100%", // Never exceed parent width
            "--ag-background-color": theme === "dark" ? "hsl(var(--background))" : "hsl(var(--background))",
            "--ag-foreground-color": theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))",
            "--ag-border-color": theme === "dark" ? "hsl(var(--border))" : "hsl(var(--border))",
            "--ag-header-background-color": theme === "dark" ? "hsl(var(--muted))" : "hsl(var(--muted))",
          } as React.CSSProperties
        }
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AgGridReact ref={gridRef} {...gridOptions} className="w-full h-full" />
        )}
      </div>

      {/* Status Bar */}
      {defaultConfig.showStatusBar && (
        <div className="flex items-center justify-between p-2 border-t border-border bg-muted/50 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Rows: {rowData.length}</span>
            <span>Columns: {columnDefs.length}</span>
            {selectedRows.length > 0 && <span>Selected: {selectedRows.length}</span>}
            {defaultConfig.enableTotalsRow && <span>Totals Row: Enabled</span>}
            {defaultConfig.stickyColumnsCount && <span>Sticky Columns: {defaultConfig.stickyColumnsCount}</span>}
          </div>
          <div className="flex items-center gap-2">
            {protectionMode && (
              <Badge variant="secondary" className="text-xs">
                Protection Active
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export helper functions for creating protected column definitions
export const createProtectedColumn = (
  field: string,
  headerName: string,
  protection: CellProtection = { level: "none" },
  options: Partial<ProtectedColDef> = {}
): ProtectedColDef => ({
  field,
  headerName,
  protection,
  ...options,
})

export const createReadOnlyColumn = (
  field: string,
  headerName: string,
  options: Partial<ProtectedColDef> = {}
): ProtectedColDef => createProtectedColumn(field, headerName, { level: "read-only" }, options)

export const createLockedColumn = (
  field: string,
  headerName: string,
  options: Partial<ProtectedColDef> = {}
): ProtectedColDef => createProtectedColumn(field, headerName, { level: "locked" }, options)

export const createHiddenColumn = (
  field: string,
  headerName: string,
  allowedRoles: string[] = [],
  options: Partial<ProtectedColDef> = {}
): ProtectedColDef => createProtectedColumn(field, headerName, { level: "hidden", allowedRoles }, options)

/**
 * Helper function to create a grid configuration with totals row and sticky columns
 */
export const createGridWithTotalsAndSticky = (
  stickyColumnsCount: number = 6,
  enableTotalsRow: boolean = true,
  additionalConfig: Partial<GridConfig> = {}
): GridConfig => ({
  enableTotalsRow,
  stickyColumnsCount,
  allowExport: true,
  allowRowSelection: true,
  allowColumnResizing: true,
  allowSorting: true,
  allowFiltering: true,
  allowCellEditing: true,
  showToolbar: true,
  showStatusBar: true,
  enableRangeSelection: false, // Disabled - requires enterprise license
  protectionEnabled: true,
  theme: "quartz", // Use quartz theme for better dark mode support
  ...additionalConfig,
})

/**
 * Default totals calculator function
 */
export const defaultTotalsCalculator = (data: GridRow[], columnField: string): number | string => {
  const values = data
    .map((row) => {
      const value = row[columnField]
      return typeof value === "number" ? value : parseFloat(value)
    })
    .filter((val) => !isNaN(val))

  if (values.length === 0) return ""
  return values.reduce((sum, val) => sum + val, 0)
}

export default ProtectedGrid
