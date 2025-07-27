"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Building2, FileText, TestTube, Save, AlertTriangle } from "lucide-react"
import {
  ProtectedGrid,
  createProtectedColumn,
  createReadOnlyColumn,
  createLockedColumn,
} from "@/components/ui/protected-grid"
import type { ProtectedColDef, GridRow } from "@/components/ui/protected-grid"
import { useBidPursuits } from "@/hooks/useBidPursuits"

interface BidManagementBetaTablesProps {
  userRole: string
  className?: string
  onProjectSelect?: (projectId: string) => void
}

export default function BidManagementBetaTables({
  userRole,
  className,
  onProjectSelect,
}: BidManagementBetaTablesProps) {
  const [activeTab, setActiveTab] = useState("current-pursuits")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load pursuit data
  const { data: pursuitData, isLoading } = useBidPursuits()

  // Transform pursuit data for ProtectedGrid
  const createProtectedData = useMemo(() => {
    return pursuitData.map((item, index) => ({
      id: `project-${index}`,
      projectNumber: item.projectNumber,
      name: item.name,
      client: item.client,
      deliverable: item.deliverable,
      bidDueDate: item.bidDueDate,
      projectBudget: item.projectBudget,
      leadEstimator: item.leadEstimator || item.lead,
      status: item.status,
      priority: (item as any).priority || "Medium",
      costPerSqf: item.costPerSqf,
      estimatedCost: item.estimatedCost,
      awarded: item.awarded,
      awardedPrecon: item.awardedPrecon,
      // Assign phase based on project characteristics
      phase: item.awardedPrecon ? "precon" : item.awarded ? "estimate" : "pursuit",
    })) as GridRow[]
  }, [pursuitData])

  // Filter data for different tabs
  const currentPursuitsData = useMemo(() => {
    return createProtectedData.filter((item) => item.phase === "pursuit")
  }, [createProtectedData])

  const preconProjectsData = useMemo(() => {
    return createProtectedData.filter((item) => item.phase === "precon")
  }, [createProtectedData])

  const estimatesData = useMemo(() => {
    return createProtectedData.filter((item) => item.phase === "estimate")
  }, [createProtectedData])

  // Create column definitions for ProtectedGrid - using exact same pattern as BudgetAnalysis
  const createProtectedPursuitColumns = useMemo(() => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    return [
      createReadOnlyColumn("projectNumber", "Project Number", {
        pinned: "left",
        width: 150,
        cellRenderer: (params: any) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "12px", color: "#3b82f6" }}>🔷</div>
            <span style={{ fontWeight: "600" }}>{params.value}</span>
          </div>
        ),
      }),
      createReadOnlyColumn("name", "Project Name", {
        width: 250,
        cellRenderer: (params: any) => {
          const data = params.data
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontWeight: "600", fontSize: "14px" }}>{data.name}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>{data.client}</div>
            </div>
          )
        },
      }),
      createReadOnlyColumn("deliverable", "Deliverable", {
        width: 120,
        cellRenderer: (params: any) => {
          const status = params.value
          const getStatusColor = (status: string) => {
            switch (status) {
              case "Estimate":
                return { bg: "#dbeafe", color: "#1e40af" }
              case "Proposal":
                return { bg: "#d1fae5", color: "#047857" }
              case "Negotiation":
                return { bg: "#fef3c7", color: "#92400e" }
              case "Award":
                return { bg: "#e9d5ff", color: "#6b21a8" }
              default:
                return { bg: "#f3f4f6", color: "#374151" }
            }
          }
          const colors = getStatusColor(status)

          return (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: colors.bg,
                color: colors.color,
              }}
            >
              {status}
            </span>
          )
        },
      }),
      createReadOnlyColumn("bidDueDate", "Bid Due Date", {
        width: 120,
        cellRenderer: (params: any) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "12px", color: "#ef4444" }}>📅</div>
            <span>{params.value}</span>
          </div>
        ),
      }),
      createReadOnlyColumn("projectBudget", "Project Budget", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value || 0),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("leadEstimator", "Lead Estimator", {
        width: 130,
        cellRenderer: (params: any) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ fontSize: "12px", color: "#3b82f6" }}>👤</div>
            <span>{params.value || "Unassigned"}</span>
          </div>
        ),
      }),
      createReadOnlyColumn("status", "Status", {
        width: 120,
        cellRenderer: (params: any) => {
          const status = params.value
          const getStatusColor = (status: string) => {
            switch (status) {
              case "Active":
                return { bg: "#d1fae5", color: "#047857" }
              case "Pending":
                return { bg: "#fef3c7", color: "#92400e" }
              case "Won":
                return { bg: "#dbeafe", color: "#1e40af" }
              case "Lost":
                return { bg: "#fee2e2", color: "#dc2626" }
              case "On Hold":
                return { bg: "#f3f4f6", color: "#374151" }
              default:
                return { bg: "#f3f4f6", color: "#374151" }
            }
          }
          const colors = getStatusColor(status)

          return (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500",
                backgroundColor: colors.bg,
                color: colors.color,
              }}
            >
              {status}
            </span>
          )
        },
      }),
      createProtectedColumn(
        "priority",
        "Priority",
        { level: "none" },
        {
          width: 100,
          cellRenderer: (params: any) => {
            const priority = params.value
            const getPriorityColor = (priority: string) => {
              switch (priority) {
                case "High":
                  return { bg: "#fee2e2", color: "#dc2626" }
                case "Medium":
                  return { bg: "#fef3c7", color: "#92400e" }
                case "Low":
                  return { bg: "#d1fae5", color: "#047857" }
                default:
                  return { bg: "#f3f4f6", color: "#374151" }
              }
            }
            const colors = getPriorityColor(priority)

            return (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  backgroundColor: colors.bg,
                  color: colors.color,
                }}
              >
                {priority}
              </span>
            )
          },
        }
      ),
      createReadOnlyColumn("costPerSqf", "Cost per SqFt", {
        type: "numericColumn",
        valueFormatter: (params: any) => (params.value ? `$${parseFloat(params.value).toFixed(2)}` : "N/A"),
        width: 120,
        cellStyle: { fontFamily: "monospace" },
      }),
      createReadOnlyColumn("estimatedCost", "Estimated Cost", {
        type: "numericColumn",
        valueFormatter: (params: any) => formatCurrency(params.value || 0),
        width: 140,
        cellStyle: { fontFamily: "monospace" },
      }),
    ] as ProtectedColDef[]
  }, [])

  // Custom totals calculator for pursuit grid
  const pursuitTotalsCalculator = (data: GridRow[], columnField: string): number | string => {
    const numericFields = ["projectBudget", "costPerSqf", "estimatedCost"]

    if (numericFields.includes(columnField)) {
      const total = data.reduce((sum, row) => sum + (row[columnField] || 0), 0)
      return total
    }

    if (columnField === "projectNumber") {
      return "Total"
    }

    return ""
  }

  // Handle grid data changes
  const handleGridChange = (event: any) => {
    console.log("Bid management grid data changed:", event)
    setHasUnsavedChanges(true)
  }

  // Save grid changes
  const handleSaveChanges = () => {
    console.log("Saving bid management grid changes...")
    setHasUnsavedChanges(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current-pursuits" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Current Pursuits
          </TabsTrigger>
          <TabsTrigger value="precon-projects" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Pre-Construction Projects
          </TabsTrigger>
          <TabsTrigger value="estimates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Estimates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current-pursuits" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Current Pursuits
                  </CardTitle>
                  <CardDescription>
                    Active pursuit opportunities with {currentPursuitsData.length} projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Beta Grid Information Banner */}
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TestTube className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-800">Beta Grid Mode Active</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Experience our enhanced bid management grid with Excel-like functionality, including inline
                      editing, advanced sorting, and sticky columns. This new interface provides improved performance
                      and user experience.
                    </p>
                    {hasUnsavedChanges && (
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="destructive">Unsaved Changes</Badge>
                        <Button onClick={handleSaveChanges} size="sm" variant="outline">
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Beta Grid Content */}
              <div className="space-y-4">
                <ProtectedGrid
                  columnDefs={createProtectedPursuitColumns}
                  rowData={currentPursuitsData}
                  config={{
                    allowExport: true,
                    allowCellEditing: true,
                    allowSorting: true,
                    allowFiltering: true,
                    showToolbar: true,
                    showStatusBar: true,
                    theme: "quartz",
                    enableTotalsRow: true,
                    stickyColumnsCount: 1,
                    userRole: userRole,
                  }}
                  events={{
                    onCellValueChanged: handleGridChange,
                    onCellEditingStopped: handleGridChange,
                  }}
                  height="600px"
                  title="Current Pursuits Grid"
                  enableSearch={true}
                  totalsCalculator={pursuitTotalsCalculator}
                />
                <div className="text-sm text-muted-foreground">
                  <Badge variant="secondary" className="mr-2">
                    Total Items: {currentPursuitsData.length}
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    Totals Row: Enabled
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    Sticky Columns: 1
                  </Badge>
                  <Badge variant="secondary">Excel-like Features: Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precon-projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    Pre-Construction Projects
                  </CardTitle>
                  <CardDescription>
                    Projects in pre-construction phase with {preconProjectsData.length} projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Beta Grid Information Banner */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TestTube className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Beta Grid Mode Active</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Pre-construction projects with enhanced grid functionality for project management and
                      coordination. Track project progress, budgets, and key milestones with real-time updates.
                    </p>
                    {hasUnsavedChanges && (
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="destructive">Unsaved Changes</Badge>
                        <Button onClick={handleSaveChanges} size="sm" variant="outline">
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Beta Grid Content */}
              <div className="space-y-4">
                <ProtectedGrid
                  columnDefs={createProtectedPursuitColumns}
                  rowData={preconProjectsData}
                  config={{
                    allowExport: true,
                    allowCellEditing: true,
                    allowSorting: true,
                    allowFiltering: true,
                    showToolbar: true,
                    showStatusBar: true,
                    theme: "quartz",
                    enableTotalsRow: true,
                    stickyColumnsCount: 1,
                    userRole: userRole,
                  }}
                  events={{
                    onCellValueChanged: handleGridChange,
                    onCellEditingStopped: handleGridChange,
                  }}
                  height="600px"
                  title="Pre-Construction Projects Grid"
                  enableSearch={true}
                  totalsCalculator={pursuitTotalsCalculator}
                />
                <div className="text-sm text-muted-foreground">
                  <Badge variant="secondary" className="mr-2">
                    Total Items: {preconProjectsData.length}
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    Totals Row: Enabled
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    Sticky Columns: 1
                  </Badge>
                  <Badge variant="secondary">Excel-like Features: Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estimates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Estimates
                  </CardTitle>
                  <CardDescription>
                    Detailed project estimates and analysis with {estimatesData.length} projects
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Beta Grid Information Banner */}
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <TestTube className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-800">Beta Grid Mode Active</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Comprehensive estimates grid with detailed cost analysis, budget tracking, and financial insights.
                      Manage estimates with precision and track performance metrics.
                    </p>
                    {hasUnsavedChanges && (
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="destructive">Unsaved Changes</Badge>
                        <Button onClick={handleSaveChanges} size="sm" variant="outline">
                          <Save className="h-4 w-4 mr-1" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Beta Grid Content */}
              <div className="space-y-4">
                <ProtectedGrid
                  columnDefs={createProtectedPursuitColumns}
                  rowData={estimatesData}
                  config={{
                    allowExport: true,
                    allowCellEditing: true,
                    allowSorting: true,
                    allowFiltering: true,
                    showToolbar: true,
                    showStatusBar: true,
                    theme: "quartz",
                    enableTotalsRow: true,
                    stickyColumnsCount: 1,
                    userRole: userRole,
                  }}
                  events={{
                    onCellValueChanged: handleGridChange,
                    onCellEditingStopped: handleGridChange,
                  }}
                  height="600px"
                  title="Estimates Grid"
                  enableSearch={true}
                  totalsCalculator={pursuitTotalsCalculator}
                />
                <div className="text-sm text-muted-foreground">
                  <Badge variant="secondary" className="mr-2">
                    Total Items: {estimatesData.length}
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    Totals Row: Enabled
                  </Badge>
                  <Badge variant="secondary" className="mr-2">
                    Sticky Columns: 1
                  </Badge>
                  <Badge variant="secondary">Excel-like Features: Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
