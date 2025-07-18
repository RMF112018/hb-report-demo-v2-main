"use client"

import { useState, useMemo } from "react"
import {
  CreditCard,
  AlertCircle,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Bot,
  Target,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedGrid, createReadOnlyColumn, GridRow, ProtectedColDef } from "@/components/ui/protected-grid"

// Import AR aging data
import arAgingData from "@/data/mock/financial/ar-aging.json"

interface ARAgingProps {
  userRole: string
  projectData: any
}

// AR Aging item interface
interface ARAgingItem {
  project_id: number
  project_name: string
  project_manager: string
  percent_complete: number
  balance_to_finish: number
  retainage: number
  total_ar: number
  current: number
  days_1_30: number
  days_31_60: number
  days_60_plus: number
  comments: string
}

export default function ARAgingCard({ userRole, projectData }: ARAgingProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter AR aging data to single project (2525840 - Palm Beach Luxury Estate)
  const filteredARData = useMemo(() => {
    return (arAgingData as ARAgingItem[]).filter((item) => item.project_id === 2525840)
  }, [])

  // Apply search filter
  const processedARData = useMemo(() => {
    let data = [...filteredARData]

    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.project_manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.comments.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return data
  }, [filteredARData, searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (value: number | null | undefined) => {
    if (typeof value === "number" && !isNaN(value)) {
      return `${value.toFixed(1)}%`
    }
    return "0.0%"
  }

  // Convert AR aging data to GridRow format
  const gridData: GridRow[] = useMemo(() => {
    return processedARData.map((item) => ({
      id: item.project_id.toString(),
      projectName: item.project_name || "",
      projectManager: item.project_manager || "",
      percentComplete: typeof item.percent_complete === "number" ? item.percent_complete : 0,
      balanceToFinish: typeof item.balance_to_finish === "number" ? item.balance_to_finish : 0,
      retainage: typeof item.retainage === "number" ? item.retainage : 0,
      totalAR: typeof item.total_ar === "number" ? item.total_ar : 0,
      current: typeof item.current === "number" ? item.current : 0,
      days1To30: typeof item.days_1_30 === "number" ? item.days_1_30 : 0,
      days31To60: typeof item.days_31_60 === "number" ? item.days_31_60 : 0,
      days60Plus: typeof item.days_60_plus === "number" ? item.days_60_plus : 0,
      comments: item.comments || "",
      // Add custom properties for styling
      _hasOverdue: (typeof item.days_60_plus === "number" ? item.days_60_plus : 0) > 0,
      _hasAging:
        (typeof item.days_1_30 === "number" ? item.days_1_30 : 0) > 0 ||
        (typeof item.days_31_60 === "number" ? item.days_31_60 : 0) > 0,
    }))
  }, [processedARData])

  // Create column definitions for ProtectedGrid
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      createReadOnlyColumn("projectName", "Project Details", {
        width: 200,
        pinned: "left",
        cellRenderer: (params: any) => {
          return (
            <div className="space-y-1">
              <div className="font-medium text-sm" style={{ fontSize: "11px" }}>
                {params.data.projectName}
              </div>
              <div className="text-xs text-muted-foreground" style={{ fontSize: "10px" }}>
                PM: {params.data.projectManager}
              </div>
            </div>
          )
        },
      }),
      createReadOnlyColumn("percentComplete", "% Complete", {
        width: 120,
        type: "numericColumn",
        cellRenderer: (params: any) => {
          const value = params.value
          return (
            <Badge variant="outline" className="text-xs" style={{ fontSize: "10px" }}>
              {formatPercentage(value)}
            </Badge>
          )
        },
      }),
      createReadOnlyColumn("balanceToFinish", "Balance to Finish", {
        width: 140,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace", fontSize: "10px" },
      }),
      createReadOnlyColumn("retainage", "Retainage", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace", fontSize: "10px" },
      }),
      createReadOnlyColumn("totalAR", "Total AR", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace", fontWeight: "500", fontSize: "10px" },
      }),
      createReadOnlyColumn("current", "Current", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: { fontFamily: "monospace", fontSize: "10px" },
      }),
      createReadOnlyColumn("days1To30", "1-30 Days", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: (params: any) => {
          const value = params.value
          const style: any = { fontFamily: "monospace", fontSize: "10px" }
          if (typeof value === "number" && value > 0) {
            style.color = "#d97706"
            style.fontWeight = "500"
          }
          return style
        },
      }),
      createReadOnlyColumn("days31To60", "31-60 Days", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: (params: any) => {
          const value = params.value
          const style: any = { fontFamily: "monospace", fontSize: "10px" }
          if (typeof value === "number" && value > 0) {
            style.color = "#d97706"
            style.fontWeight = "500"
          }
          return style
        },
      }),
      createReadOnlyColumn("days60Plus", "60+ Days", {
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: any) => {
          const value = params.value
          return typeof value === "number" && !isNaN(value) ? formatCurrency(value) : "$0.00"
        },
        cellStyle: (params: any) => {
          const value = params.value
          const style: any = { fontFamily: "monospace", fontSize: "10px" }
          if (typeof value === "number" && value > 0) {
            style.color = "#dc2626"
            style.fontWeight = "bold"
          }
          return style
        },
      }),
      createReadOnlyColumn("comments", "Comments", {
        width: 150,
        cellRenderer: (params: any) => {
          return (
            <div className="text-sm max-w-[150px] truncate" style={{ fontSize: "10px" }}>
              {params.value || "-"}
            </div>
          )
        },
      }),
    ],
    []
  )

  // Custom totals calculator
  const totalsCalculator = (data: GridRow[], columnField: string): number | string => {
    if (columnField === "projectName") return "Totals"
    if (columnField === "percentComplete" || columnField === "comments") return ""

    const values = data
      .map((row) => {
        const value = row[columnField]
        return typeof value === "number" && !isNaN(value) ? value : 0
      })
      .filter((val) => typeof val === "number" && !isNaN(val))

    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0)
  }

  const exportToCSV = () => {
    const headers = [
      "Project Name",
      "Project Manager",
      "% Complete",
      "Balance to Finish",
      "Retainage",
      "Total AR",
      "Current",
      "1-30 Days",
      "31-60 Days",
      "60+ Days",
      "Comments",
    ]

    const csvContent = [
      headers.join(","),
      ...processedARData.map((item) =>
        [
          `"${item.project_name}"`,
          `"${item.project_manager}"`,
          item.percent_complete,
          item.balance_to_finish,
          item.retainage,
          item.total_ar,
          item.current,
          item.days_1_30,
          item.days_31_60,
          item.days_60_plus,
          `"${item.comments}"`,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "ar_aging_analysis.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Controls and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search project, manager, or comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              {processedARData.length} Record{processedARData.length !== 1 ? "s" : ""}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              DEMO
            </Badge>
          </div>
        </div>
        <Button variant="outline" onClick={exportToCSV} size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* AR Aging Grid */}
      <Card>
        <CardContent className="p-6">
          <ProtectedGrid
            title="AR Aging Analysis"
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
              stickyColumnsCount: 1, // Pin first column (Project Details)
              rowHeight: 32, // Reduced row height for compact display
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

          {/* Data Quality Notice */}
          {processedARData.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No AR aging records found{searchTerm ? " matching your search" : " for this project"}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
