"use client"

import React, { useState, useCallback, useMemo } from "react"
import {
  ProtectedGrid,
  createReadOnlyColumn,
  createProtectedColumn,
  createGridWithTotalsAndSticky,
} from "@/components/ui/protected-grid"
import { StrategicOpportunityDetailsDrawer } from "./StrategicOpportunityDetailsDrawer"
import type { GridRow } from "@/components/ui/protected-grid"

/**
 * Strategic Opportunity data interface
 */
export interface StrategicOpportunity {
  id: string
  projectName: string
  clientOrg: string
  regionCity: string
  marketSector: string
  stage: string
  estimatedValue: number
  probabilityPercent: number
  forecastCloseDate: string
  assignedRep: string
  tags: string[]
}

/**
 * StrategicOpportunityGrid component props
 */
export interface StrategicOpportunityGridProps {
  opportunities?: StrategicOpportunity[]
  loading?: boolean
  error?: string
}

/**
 * StrategicOpportunityGrid Component
 * Displays a grid of active pursuits with CRM-synced behavior
 */
export function StrategicOpportunityGrid({
  opportunities = [],
  loading = false,
  error,
}: StrategicOpportunityGridProps) {
  const [selectedOpportunity, setSelectedOpportunity] = useState<StrategicOpportunity | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Transform opportunities to grid data
  const gridData: GridRow[] = useMemo(() => {
    return opportunities.map((opp) => ({
      id: opp.id,
      projectName: opp.projectName,
      clientOrg: opp.clientOrg,
      regionCity: opp.regionCity,
      marketSector: opp.marketSector,
      stage: opp.stage,
      estimatedValue: opp.estimatedValue,
      probabilityPercent: opp.probabilityPercent,
      forecastCloseDate: opp.forecastCloseDate,
      assignedRep: opp.assignedRep,
      tags: opp.tags.join(", "),
      _originalData: opp, // Store original data for drawer
    }))
  }, [opportunities])

  // Column definitions with protection levels
  const columnDefs = useMemo(
    () => [
      // Read-only columns (CRM-synced)
      createReadOnlyColumn("projectName", "Project Name", {
        width: 200,
        pinned: "left",
        sortable: true,
        filter: true,
      }),
      createReadOnlyColumn("clientOrg", "Client Org", {
        width: 180,
        pinned: "left",
        sortable: true,
        filter: true,
      }),
      createReadOnlyColumn("regionCity", "Region/City", {
        width: 150,
        pinned: "left",
        sortable: true,
        filter: true,
      }),
      createReadOnlyColumn("marketSector", "Market Sector", {
        width: 150,
        pinned: "left",
        sortable: true,
        filter: true,
      }),
      createReadOnlyColumn("stage", "Stage", {
        width: 120,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const stage = params.value
          const getStageColor = (stage: string) => {
            switch (stage.toLowerCase()) {
              case "prospecting":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              case "qualification":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              case "proposal":
                return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              case "negotiation":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              case "closed won":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              case "closed lost":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }
          }
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${getStageColor(stage)}">${stage}</span>`
        },
      }),
      createReadOnlyColumn("estimatedValue", "Est. Value", {
        width: 130,
        sortable: true,
        filter: true,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(params.value)
        },
      }),
      createReadOnlyColumn("probabilityPercent", "Probability %", {
        width: 120,
        sortable: true,
        filter: true,
        type: "numericColumn",
        valueFormatter: (params: any) => `${params.value}%`,
        cellRenderer: (params: any) => {
          const value = params.value
          const getProbabilityColor = (prob: number) => {
            if (prob >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            if (prob >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            if (prob >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }
          return `<span class="px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(
            value
          )}">${value}%</span>`
        },
      }),
      createReadOnlyColumn("forecastCloseDate", "Forecast Close Date", {
        width: 150,
        sortable: true,
        filter: true,
        valueFormatter: (params: any) => {
          return new Date(params.value).toLocaleDateString()
        },
      }),
      // Editable columns
      createProtectedColumn(
        "assignedRep",
        "Assigned Rep",
        {
          level: "none", // Editable
        },
        {
          width: 150,
          sortable: true,
          filter: true,
          editable: true,
        }
      ),
      createProtectedColumn(
        "tags",
        "Tags",
        {
          level: "none", // Editable
        },
        {
          width: 200,
          sortable: true,
          filter: true,
          editable: true,
        }
      ),
    ],
    []
  )

  // Grid configuration
  const gridConfig = useMemo(
    () =>
      createGridWithTotalsAndSticky(4, true, {
        allowRowSelection: true,
        allowMultiSelection: false,
        allowColumnReordering: true,
        allowColumnResizing: true,
        allowSorting: true,
        allowFiltering: true,
        allowCellEditing: true,
        showToolbar: true,
        showStatusBar: true,
        enableRangeSelection: false,
        protectionEnabled: true,
        userRole: "user", // This would come from auth context
        theme: "alpine",
        rowHeight: 50,
      }),
    []
  )

  // Event handlers
  const handleRowSelected = useCallback((event: any) => {
    const selectedRow = event.data
    if (selectedRow && selectedRow._originalData) {
      setSelectedOpportunity(selectedRow._originalData)
      setIsDrawerOpen(true)
    }
  }, [])

  const handleCellValueChanged = useCallback((event: any) => {
    // Handle cell value changes for editable fields
    console.log("Cell value changed:", event)
    // Here you would typically update the data source or make an API call
  }, [])

  // Totals calculator for numeric columns
  const totalsCalculator = useCallback((data: GridRow[], columnField: string) => {
    if (columnField === "estimatedValue") {
      const total = data.reduce((sum, row) => sum + (row[columnField] || 0), 0)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(total)
    }
    if (columnField === "probabilityPercent") {
      const avg = data.reduce((sum, row) => sum + (row[columnField] || 0), 0) / data.length
      return `${Math.round(avg)}%`
    }
    return ""
  }, [])

  // Mock data for demonstration
  const mockOpportunities: StrategicOpportunity[] = useMemo(
    () => [
      {
        id: "1",
        projectName: "Downtown Office Complex",
        clientOrg: "Metro Development Corp",
        regionCity: "Austin, TX",
        marketSector: "Commercial",
        stage: "Proposal",
        estimatedValue: 25000000,
        probabilityPercent: 75,
        forecastCloseDate: "2024-12-15",
        assignedRep: "Sarah Johnson",
        tags: ["High Priority", "Strategic"],
      },
      {
        id: "2",
        projectName: "Healthcare Center Expansion",
        clientOrg: "Regional Medical Group",
        regionCity: "Dallas, TX",
        marketSector: "Healthcare",
        stage: "Negotiation",
        estimatedValue: 18000000,
        probabilityPercent: 85,
        forecastCloseDate: "2024-11-30",
        assignedRep: "Mike Chen",
        tags: ["Healthcare", "Expansion"],
      },
      {
        id: "3",
        projectName: "Mixed-Use Residential",
        clientOrg: "Urban Living Partners",
        regionCity: "Houston, TX",
        marketSector: "Residential",
        stage: "Qualification",
        estimatedValue: 32000000,
        probabilityPercent: 45,
        forecastCloseDate: "2025-02-15",
        assignedRep: "Lisa Rodriguez",
        tags: ["Residential", "Mixed-Use"],
      },
      {
        id: "4",
        projectName: "Industrial Warehouse",
        clientOrg: "Logistics Solutions Inc",
        regionCity: "San Antonio, TX",
        marketSector: "Industrial",
        stage: "Prospecting",
        estimatedValue: 12000000,
        probabilityPercent: 25,
        forecastCloseDate: "2025-03-30",
        assignedRep: "David Thompson",
        tags: ["Industrial", "Logistics"],
      },
      {
        id: "5",
        projectName: "Educational Campus",
        clientOrg: "State University System",
        regionCity: "College Station, TX",
        marketSector: "Education",
        stage: "Closed Won",
        estimatedValue: 45000000,
        probabilityPercent: 100,
        forecastCloseDate: "2024-10-15",
        assignedRep: "Jennifer Lee",
        tags: ["Education", "Campus"],
      },
    ],
    []
  )

  // Use mock data if no opportunities provided
  const displayData =
    opportunities.length > 0
      ? gridData
      : mockOpportunities.map((opp) => ({
          id: opp.id,
          projectName: opp.projectName,
          clientOrg: opp.clientOrg,
          regionCity: opp.regionCity,
          marketSector: opp.marketSector,
          stage: opp.stage,
          estimatedValue: opp.estimatedValue,
          probabilityPercent: opp.probabilityPercent,
          forecastCloseDate: opp.forecastCloseDate,
          assignedRep: opp.assignedRep,
          tags: opp.tags.join(", "),
          _originalData: opp,
        }))

  return (
    <div className="space-y-4">
      <ProtectedGrid
        columnDefs={columnDefs}
        rowData={displayData}
        config={gridConfig}
        events={{
          onRowSelected: handleRowSelected,
          onCellValueChanged: handleCellValueChanged,
        }}
        height="600px"
        loading={loading}
        error={error}
        enableSearch={true}
        totalsCalculator={totalsCalculator}
        className="border border-gray-200 dark:border-gray-700 rounded-lg"
      />

      {/* Strategic Opportunity Details Drawer */}
      {selectedOpportunity && (
        <StrategicOpportunityDetailsDrawer
          opportunity={selectedOpportunity}
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
        />
      )}
    </div>
  )
}
