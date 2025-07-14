"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ProtectedGrid,
  createReadOnlyColumn,
  createProtectedColumn,
  GridRow,
  ProtectedColDef,
} from "@/components/ui/protected-grid"
// Icons removed as they are not used in this component

// Import mock data
import jchrData from "@/data/mock/financial/jchr.json"

interface JCHRCardProps {
  userRole: string
  projectData: any
}

interface JobCostItem {
  costCode: string
  description: string
  budgetAmount: number
  actualCost: number
  commitments: number
  variance: number
  percentComplete: number
  lastUpdated: string
}

interface ProjectData {
  project_id: number
  project_name: string
  jobCostItems: JobCostItem[]
}

interface GroupedData {
  division: string
  items: JobCostItem[]
  totals: {
    budget: number
    actual: number
    commitments: number
    variance: number
  }
}

export default function JCHRCard({ userRole, projectData }: JCHRCardProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Get project data - using project_id 2525804 as specified in requirements
  const currentProject = useMemo(() => {
    const targetProjectId = 2525804
    return (jchrData as ProjectData[]).find((p) => p.project_id === targetProjectId) || (jchrData as ProjectData[])[0]
  }, [])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  }

  // Parse cost code to extract division and category
  const parseCostCode = (costCode: string) => {
    const parts = costCode.split(".")
    const division = parts[0] || "Unknown"
    const category = costCode.includes(".MAT")
      ? "Material"
      : costCode.includes(".LAB")
      ? "Labor"
      : costCode.includes(".LBN")
      ? "Labor Burden"
      : costCode.includes(".SUB")
      ? "Subcontract"
      : costCode.includes(".OVH")
      ? "Overhead"
      : "Other"
    return { division, category }
  }

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    if (!currentProject) return null

    const totalBudget = currentProject.jobCostItems.reduce((sum, item) => sum + item.budgetAmount, 0)
    const totalActual = currentProject.jobCostItems.reduce((sum, item) => sum + item.actualCost, 0)
    const totalCommitments = currentProject.jobCostItems.reduce((sum, item) => sum + item.commitments, 0)
    const totalVariance = currentProject.jobCostItems.reduce((sum, item) => sum + item.variance, 0)
    const percentSpent = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0

    // Calculate current period spend (mock data - would be filtered by date in real implementation)
    const currentPeriodSpend = totalActual * 0.12 // Assuming 12% of total costs are current period

    return {
      totalBudget,
      totalActual,
      totalCommitments,
      totalVariance,
      percentSpent,
      currentPeriodSpend,
      contractValue: totalBudget * 1.15, // Assuming 15% markup
      profitMargin: ((totalBudget * 1.15 - totalActual) / (totalBudget * 1.15)) * 100,
      financialHealth: Math.max(0, Math.min(100, 100 - (Math.abs(totalVariance) / totalBudget) * 100)),
    }
  }, [currentProject])

  // Create flattened data structure for ProtectedGrid
  const gridData = useMemo(() => {
    if (!currentProject) return []

    const filteredItems = currentProject.jobCostItems.filter((item) => {
      const { category } = parseCostCode(item.costCode)
      const matchesCategory = filterCategory === "all" || category.toLowerCase() === filterCategory.toLowerCase()
      const matchesSearch =
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.costCode.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })

    // Group by division
    const divisions: { [key: string]: JobCostItem[] } = {}
    filteredItems.forEach((item) => {
      const { division } = parseCostCode(item.costCode)
      if (!divisions[division]) {
        divisions[division] = []
      }
      divisions[division].push(item)
    })

    // Create flattened structure with division totals and items
    const flatRows: GridRow[] = []

    Object.entries(divisions).forEach(([divisionKey, items]) => {
      // Calculate division totals
      const divisionTotals = {
        budget: items.reduce((sum, item) => sum + (item.budgetAmount || 0), 0),
        actual: items.reduce((sum, item) => sum + (item.actualCost || 0), 0),
        commitments: items.reduce((sum, item) => sum + (item.commitments || 0), 0),
        variance: items.reduce((sum, item) => sum + (item.variance || 0), 0),
      }

      // Division parent row
      const divisionRow: GridRow = {
        id: `division-${divisionKey}`,
        costCode: `Division ${divisionKey}`,
        description: `Division ${divisionKey} Total`,
        category: "",
        budgetAmount: divisionTotals.budget || 0,
        actualCost: divisionTotals.actual || 0,
        commitments: divisionTotals.commitments || 0,
        variance: divisionTotals.variance || 0,
        percentComplete: divisionTotals.budget > 0 ? (divisionTotals.actual / divisionTotals.budget) * 100 : 0,
        lastUpdated: "",
        _isDivisionRow: true,
      }
      flatRows.push(divisionRow)

      // Add child items
      items.forEach((item) => {
        const { category } = parseCostCode(item.costCode)
        const childRow: GridRow = {
          id: `${divisionKey}-${item.costCode}`,
          costCode: item.costCode,
          description: item.description,
          category,
          budgetAmount: item.budgetAmount || 0,
          actualCost: item.actualCost || 0,
          commitments: item.commitments || 0,
          variance: item.variance || 0,
          percentComplete: item.percentComplete || 0,
          lastUpdated: item.lastUpdated || "",
          _isChildRow: true,
        }
        flatRows.push(childRow)
      })
    })

    return flatRows
  }, [currentProject, filterCategory, searchTerm])

  // Create column definitions for ProtectedGrid
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      createReadOnlyColumn("costCode", "Cost Code", {
        width: 150,
        pinned: "left",
        cellRenderer: (params: any) => {
          const isParent = params.data._isDivisionRow
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

          return (
            <div
              style={{
                fontWeight: isParent ? "600" : "400",
                color: !isParent ? (isDark ? "#e2e8f0" : "#334155") : isDark ? "#f8fafc" : "#0f172a",
                fontFamily: !isParent ? "monospace" : undefined,
                fontSize: !isParent ? "12px" : undefined,
              }}
            >
              {params.value}
            </div>
          )
        },
      }),
      createReadOnlyColumn("description", "Description", {
        flex: 1,
        pinned: "left",
        cellRenderer: (params: any) => {
          const isParent = params.data._isDivisionRow
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

          return (
            <div
              style={{
                fontWeight: isParent ? "600" : "400",
                color: isDark ? "#f1f5f9" : "#1e293b",
              }}
            >
              {params.value}
            </div>
          )
        },
      }),
      createReadOnlyColumn("category", "Category", {
        width: 120,
        pinned: "left",
        cellRenderer: (params: any) => {
          if (params.data._isDivisionRow) return ""

          const category = params.value
          const colors = {
            Material: { border: "#dbeafe", text: "#1d4ed8", bg: "#eff6ff" },
            Labor: { border: "#dcfce7", text: "#16a34a", bg: "#f0fdf4" },
            "Labor Burden": { border: "#fef3c7", text: "#d97706", bg: "#fffbeb" },
            Subcontract: { border: "#e9d5ff", text: "#9333ea", bg: "#faf5ff" },
            Other: { border: "#e5e7eb", text: "#374151", bg: "#f9fafb" },
          }

          const colorConfig = colors[category as keyof typeof colors] || colors.Other

          return (
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              style={{
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: colorConfig.border,
                color: colorConfig.text,
                backgroundColor: colorConfig.bg,
              }}
            >
              {category}
            </span>
          )
        },
      }),
      createReadOnlyColumn("budgetAmount", "Budget", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("actualCost", "Actual Cost", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("commitments", "Commitments", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("variance", "Variance", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: (params: any) => {
          const value = params.value
          const numericValue = typeof value === "number" ? value : 0
          return {
            fontFamily: "monospace",
            color: numericValue >= 0 ? "#dc2626" : "#16a34a",
            fontWeight: "500",
          }
        },
      }),
      createReadOnlyColumn("percentComplete", "% Complete", {
        type: "numericColumn",
        width: 110,
        valueFormatter: (params: any) => {
          const value = params.value
          if (typeof value === "number" && !isNaN(value)) {
            return `${value.toFixed(1)}%`
          }
          return "0.0%"
        },
        cellStyle: { fontFamily: "monospace" },
      }),
    ],
    []
  )

  // Custom totals calculator
  const totalsCalculator = (data: GridRow[], columnField: string): number | string => {
    // Only calculate totals for non-child rows (divisions and items, not sub-items)
    const parentRows = data.filter((row) => row._isDivisionRow)

    if (parentRows.length === 0) return ""

    const values = parentRows
      .map((row) => {
        const value = row[columnField]
        if (typeof value === "number" && !isNaN(value)) {
          return value
        }
        const parsed = parseFloat(value)
        return !isNaN(parsed) ? parsed : 0
      })
      .filter((val) => typeof val === "number" && !isNaN(val))

    if (values.length === 0) return ""

    if (columnField === "percentComplete") {
      const totalBudget = parentRows.reduce((sum, row) => {
        const budget = row.budgetAmount
        return sum + (typeof budget === "number" && !isNaN(budget) ? budget : 0)
      }, 0)
      const totalActual = parentRows.reduce((sum, row) => {
        const actual = row.actualCost
        return sum + (typeof actual === "number" && !isNaN(actual) ? actual : 0)
      }, 0)
      return totalBudget > 0 ? ((totalActual / totalBudget) * 100).toFixed(1) + "%" : "0.0%"
    }

    return values.reduce((sum, val) => sum + val, 0)
  }

  if (!currentProject || !summaryMetrics) {
    return <div>Loading JCHR data...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          {/* Job Cost Protected Grid */}
          <div className="space-y-4">
            {/* Category Filter inline with grid */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Filter:</span>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="labor">Labor</SelectItem>
                    <SelectItem value="labor burden">Labor Burden</SelectItem>
                    <SelectItem value="subcontract">Subcontract</SelectItem>
                    <SelectItem value="overhead">Overhead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ProtectedGrid
              title="Job Cost History Report"
              columnDefs={columnDefs}
              rowData={gridData}
              height="600px"
              config={{
                allowExport: true,
                allowImport: false,
                allowRowSelection: false,
                allowMultiSelection: false,
                allowColumnReordering: false,
                allowColumnResizing: true,
                allowSorting: true,
                allowFiltering: true,
                allowCellEditing: false,
                showToolbar: true,
                showStatusBar: true,
                enableRangeSelection: false,
                protectionEnabled: true,
                userRole: userRole,
                theme: "quartz",
                enableTotalsRow: true,
                stickyColumnsCount: 0, // Using manual pinning instead
              }}
              events={{
                onGridReady: (event) => {
                  // Auto-size all columns to fit their content
                  event.api.autoSizeAllColumns()
                },
              }}
              enableSearch={true}
              defaultSearch={searchTerm}
              totalsCalculator={totalsCalculator}
              className="border rounded-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
