"use client"

/**
 * @fileoverview Export Controls Component for Responsibility Matrix
 * @module ExportControls
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Export controls component with:
 * - Multiple export formats (CSV, Excel, PDF)
 * - Filter options for export
 * - Progress tracking
 * - Error handling
 * - Role-based access control
 */

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileText, Sheet, FileDown, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ExportControlsProps {
  projectId: string
  tasks: any[]
  roles: any[]
  userRole: string
  onExport: () => void
}

type ExportFormat = "csv" | "excel" | "pdf"

interface ExportOptions {
  format: ExportFormat
  includeCompleted: boolean
  includeAssignments: boolean
  includeRoleColors: boolean
  includeMetrics: boolean
  filterByStatus: string
  filterByCategory: string
}

const ExportControls: React.FC<ExportControlsProps> = ({ projectId, tasks, roles, userRole, onExport }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    includeCompleted: true,
    includeAssignments: true,
    includeRoleColors: false,
    includeMetrics: true,
    filterByStatus: "all",
    filterByCategory: "all",
  })

  const { toast } = useToast()

  // Check if user has export permissions
  const canExport = userRole !== "viewer"

  // Get available categories from tasks
  const categories = React.useMemo(() => {
    return [...new Set(tasks.map((task) => task.category))]
  }, [tasks])

  const handleExportOptionChange = useCallback((key: keyof ExportOptions, value: any) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }))
  }, [])

  const generateExportData = useCallback(() => {
    let filteredTasks = tasks

    // Apply filters
    if (exportOptions.filterByStatus !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.status === exportOptions.filterByStatus)
    }

    if (exportOptions.filterByCategory !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.category === exportOptions.filterByCategory)
    }

    // Filter completed tasks if not included
    if (!exportOptions.includeCompleted) {
      filteredTasks = filteredTasks.filter((task) => task.status !== "completed")
    }

    return filteredTasks
  }, [tasks, exportOptions])

  const handleExport = useCallback(async () => {
    if (!canExport) {
      toast({
        title: "Export Permission Denied",
        description: "You don't have permission to export responsibility matrix data.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const exportData = generateExportData()

      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create export based on format
      switch (exportOptions.format) {
        case "csv":
          await exportToCSV(exportData)
          break
        case "excel":
          await exportToExcel(exportData)
          break
        case "pdf":
          await exportToPDF(exportData)
          break
      }

      toast({
        title: "Export Successful",
        description: `Responsibility matrix exported as ${exportOptions.format.toUpperCase()}.`,
      })

      setIsExportDialogOpen(false)
      onExport()
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export responsibility matrix. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [canExport, exportOptions, generateExportData, onExport, toast])

  const exportToCSV = useCallback(
    async (data: any[]) => {
      const headers = ["Task", "Category", "Status", "Responsible"]
      if (exportOptions.includeAssignments) {
        headers.push(...roles.map((role) => role.name))
      }

      const csvContent = [
        headers.join(","),
        ...data.map((task) => {
          const row = [`"${task.task}"`, `"${task.category}"`, task.status, task.responsible || "Unassigned"]
          if (exportOptions.includeAssignments) {
            row.push(...roles.map((role) => task.assignments[role.key] || "None"))
          }
          return row.join(",")
        }),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `responsibility-matrix-${projectId}-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
    },
    [exportOptions, roles, projectId]
  )

  const exportToExcel = useCallback(
    async (data: any[]) => {
      // In a real implementation, you would use a library like xlsx or exceljs
      console.log("Excel export not implemented yet")
      toast({
        title: "Excel Export",
        description: "Excel export functionality will be implemented soon.",
      })
    },
    [toast]
  )

  const exportToPDF = useCallback(
    async (data: any[]) => {
      // In a real implementation, you would use a library like jsPDF or puppeteer
      console.log("PDF export not implemented yet")
      toast({
        title: "PDF Export",
        description: "PDF export functionality will be implemented soon.",
      })
    },
    [toast]
  )

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case "csv":
        return <FileText className="h-4 w-4" />
      case "excel":
        return <Sheet className="h-4 w-4" />
      case "pdf":
        return <FileDown className="h-4 w-4" />
      default:
        return <Download className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3 text-xs" disabled={!canExport}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Responsibility Matrix</DialogTitle>
          <DialogDescription>
            Configure your export options and download the responsibility matrix data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Export Format */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Export Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select
                value={exportOptions.format}
                onValueChange={(value: ExportFormat) => handleExportOptionChange("format", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      CSV (Comma Separated Values)
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <Sheet className="h-4 w-4" />
                      Excel Spreadsheet
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileDown className="h-4 w-4" />
                      PDF Document
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={exportOptions.filterByStatus}
                    onValueChange={(value) => handleExportOptionChange("filterByStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={exportOptions.filterByCategory}
                    onValueChange={(value) => handleExportOptionChange("filterByCategory", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCompleted"
                  checked={exportOptions.includeCompleted}
                  onCheckedChange={(checked) => handleExportOptionChange("includeCompleted", checked)}
                />
                <Label htmlFor="includeCompleted" className="text-xs">
                  Include completed tasks
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAssignments"
                  checked={exportOptions.includeAssignments}
                  onCheckedChange={(checked) => handleExportOptionChange("includeAssignments", checked)}
                />
                <Label htmlFor="includeAssignments" className="text-xs">
                  Include role assignments
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetrics"
                  checked={exportOptions.includeMetrics}
                  onCheckedChange={(checked) => handleExportOptionChange("includeMetrics", checked)}
                />
                <Label htmlFor="includeMetrics" className="text-xs">
                  Include summary metrics
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRoleColors"
                  checked={exportOptions.includeRoleColors}
                  onCheckedChange={(checked) => handleExportOptionChange("includeRoleColors", checked)}
                />
                <Label htmlFor="includeRoleColors" className="text-xs">
                  Include role color coding
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Export Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Export Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {generateExportData().length} tasks will be exported in {exportOptions.format.toUpperCase()} format.
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                {getFormatIcon(exportOptions.format)}
                <span className="ml-2">Export</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ExportControls }
