"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ProtectedGrid,
  createReadOnlyColumn,
  createProtectedColumn,
  GridRow,
  ProtectedColDef,
} from "@/components/ui/protected-grid"
import { Filter, Download, DollarSign, TrendingUp, Calculator, Percent, Building2, Activity } from "lucide-react"

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

  // Create tree data structure for ProtectedGrid
  const treeData = useMemo(() => {
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

    // Create tree structure
    const treeRows: GridRow[] = []

    Object.entries(divisions).forEach(([divisionKey, items]) => {
      // Calculate division totals
      const divisionTotals = {
        budget: items.reduce((sum, item) => sum + item.budgetAmount, 0),
        actual: items.reduce((sum, item) => sum + item.actualCost, 0),
        commitments: items.reduce((sum, item) => sum + item.commitments, 0),
        variance: items.reduce((sum, item) => sum + item.variance, 0),
      }

      // Division parent row
      const divisionRow: GridRow = {
        id: `division-${divisionKey}`,
        costCode: `Division ${divisionKey}`,
        description: `Division ${divisionKey} Total`,
        category: "",
        budgetAmount: divisionTotals.budget,
        actualCost: divisionTotals.actual,
        commitments: divisionTotals.commitments,
        variance: divisionTotals.variance,
        percentComplete: divisionTotals.budget > 0 ? (divisionTotals.actual / divisionTotals.budget) * 100 : 0,
        lastUpdated: "",
        orgHierarchy: [divisionKey],
        _isDivisionRow: true,
      }
      treeRows.push(divisionRow)

      // Add child items
      items.forEach((item) => {
        const { category } = parseCostCode(item.costCode)
        const childRow: GridRow = {
          id: `${divisionKey}-${item.costCode}`,
          costCode: item.costCode,
          description: item.description,
          category,
          budgetAmount: item.budgetAmount,
          actualCost: item.actualCost,
          commitments: item.commitments,
          variance: item.variance,
          percentComplete: item.percentComplete,
          lastUpdated: item.lastUpdated,
          orgHierarchy: [divisionKey, item.costCode],
          _isChildRow: true,
        }
        treeRows.push(childRow)
      })
    })

    return treeRows
  }, [currentProject, filterCategory, searchTerm])

  // Create column definitions for ProtectedGrid
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      createReadOnlyColumn("costCode", "Cost Code", {
        width: 150,
        cellRenderer: (params: any) => {
          const isParent = params.data._isDivisionRow
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

          if (isParent) {
            return `
            <div style="font-weight: 600; color: ${isDark ? "#f8fafc" : "#0f172a"};">
              ${params.value}
            </div>
          `
          }

          return `
          <div style="font-family: monospace; font-size: 12px; color: ${isDark ? "#e2e8f0" : "#334155"};">
            ${params.value}
          </div>
        `
        },
      }),
      createReadOnlyColumn("description", "Description", {
        flex: 1,
        cellRenderer: (params: any) => {
          const isParent = params.data._isDivisionRow
          const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

          return `
          <div style="font-weight: ${isParent ? "600" : "400"}; color: ${isDark ? "#f1f5f9" : "#1e293b"};">
            ${params.value}
          </div>
        `
        },
      }),
      createReadOnlyColumn("category", "Category", {
        width: 120,
        cellRenderer: (params: any) => {
          if (params.data._isDivisionRow) return ""

          const category = params.value
          const colors = {
            Material: "border-blue-200 text-blue-700 bg-blue-50",
            Labor: "border-green-200 text-green-700 bg-green-50",
            "Labor Burden": "border-yellow-200 text-yellow-700 bg-yellow-50",
            Subcontract: "border-purple-200 text-purple-700 bg-purple-50",
            Other: "border-gray-200 text-gray-700 bg-gray-50",
          }

          const colorClass = colors[category as keyof typeof colors] || colors.Other

          return `
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}">
            ${category}
          </span>
        `
        },
      }),
      createReadOnlyColumn("budgetAmount", "Budget", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => formatCurrency(params.value),
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("actualCost", "Actual Cost", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => formatCurrency(params.value),
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("commitments", "Commitments", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => formatCurrency(params.value),
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("variance", "Variance", {
        type: "numericColumn",
        width: 130,
        valueFormatter: (params: any) => formatCurrency(params.value),
        cellStyle: (params: any) => ({
          fontFamily: "monospace",
          color: params.value >= 0 ? "#dc2626" : "#16a34a",
          fontWeight: "500",
        }),
      }),
      createReadOnlyColumn("percentComplete", "% Complete", {
        type: "numericColumn",
        width: 110,
        valueFormatter: (params: any) => `${params.value.toFixed(1)}%`,
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
        return typeof value === "number" ? value : parseFloat(value)
      })
      .filter((val) => !isNaN(val))

    if (values.length === 0) return ""

    if (columnField === "percentComplete") {
      const totalBudget = parentRows.reduce((sum, row) => sum + (row.budgetAmount || 0), 0)
      const totalActual = parentRows.reduce((sum, row) => sum + (row.actualCost || 0), 0)
      return totalBudget > 0 ? ((totalActual / totalBudget) * 100).toFixed(1) + "%" : "0.0%"
    }

    return values.reduce((sum, val) => sum + val, 0)
  }

  if (!currentProject || !summaryMetrics) {
    return <div>Loading JCHR data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Job Cost History Report</span>
              <Badge variant="outline">{currentProject.project_name}</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by description or cost code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
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

          {/* Job Cost Protected Grid */}
          <ProtectedGrid
            title="Job Cost History Report"
            columnDefs={columnDefs}
            rowData={treeData}
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
              stickyColumnsCount: 2,
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
        </CardContent>
      </Card>
    </div>
  )
}
