"use client"

import React, { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import type { Constraint, ConstraintFilters } from "@/types/constraint"

interface EnhancedConstraintTableProps {
  constraints: Constraint[]
  onEdit: (constraint: Constraint) => void
  onDelete: (constraint: Constraint) => void
  onBulkAction: (action: string, constraintIds: string[]) => void
  showClosed: boolean
  groupByCategory: boolean
  filters: ConstraintFilters
  onFiltersChange: (filters: ConstraintFilters) => void
  categories: string[]
  assignees: string[]
}

export function EnhancedConstraintTable({
  constraints,
  onEdit,
  onDelete,
  onBulkAction,
  showClosed,
  groupByCategory,
  filters,
  onFiltersChange,
  categories,
  assignees,
}: EnhancedConstraintTableProps) {
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>([])

  const getStatusBadge = (status: string) => {
    const variants = {
      Identified: "secondary",
      Pending: "outline",
      "In Progress": "default",
      Closed: "destructive",
    } as const

    const colors = {
      Identified: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Closed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || "secondary"}
        className={colors[status as keyof typeof colors]}
      >
        {status}
      </Badge>
    )
  }

  const isOverdue = (constraint: Constraint) => {
    if (constraint.completionStatus === "Closed" || !constraint.dueDate) return false
    return new Date(constraint.dueDate) < new Date()
  }

  // Transform constraints data for the grid
  const transformedConstraints = useMemo(() => {
    return constraints.map((constraint) => ({
      id: constraint.id,
      no: constraint.no,
      description: constraint.description,
      category: constraint.category,
      completionStatus: constraint.completionStatus,
      assigned: constraint.assigned,
      dateIdentified: constraint.dateIdentified,
      dueDate: constraint.dueDate,
      daysElapsed: constraint.daysElapsed,
      reference: constraint.reference,
      isOverdue: isOverdue(constraint),
      _originalData: constraint, // Keep reference to original data
    }))
  }, [constraints])

  // Define column definitions for the grid
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "no",
        headerName: "No.",
        width: 80,
        cellRenderer: (params: any) => <div className="font-medium">{params.value}</div>,
        pinned: "left",
      },
      {
        field: "description",
        headerName: "Description",
        width: 400,
        cellRenderer: (params: any) => {
          const constraint = params.data._originalData
          return (
            <div className="space-y-1">
              <p className="font-medium line-clamp-2">{constraint.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-3 w-3" />
                {constraint.reference}
              </div>
            </div>
          )
        },
      },
      {
        field: "category",
        headerName: "Category",
        width: 140,
        cellRenderer: (params: any) => (
          <Badge variant="outline" className="text-xs">
            {params.value.replace(/^\d+\.\s*/, "")}
          </Badge>
        ),
      },
      {
        field: "completionStatus",
        headerName: "Status",
        width: 120,
        cellRenderer: (params: any) => getStatusBadge(params.value),
      },
      {
        field: "assigned",
        headerName: "Assigned",
        width: 140,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{params.value}</span>
          </div>
        ),
      },
      {
        field: "dateIdentified",
        headerName: "Identified",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="text-sm">{params.value && format(new Date(params.value), "MMM dd, yyyy")}</div>
        ),
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        width: 140,
        cellRenderer: (params: any) => {
          const constraint = params.data._originalData
          return (
            <div className="flex items-center gap-2">
              {constraint.dueDate && (
                <>
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-sm ${isOverdue(constraint) ? "text-red-600 font-medium" : ""}`}>
                    {format(new Date(constraint.dueDate), "MMM dd, yyyy")}
                  </span>
                  {isOverdue(constraint) && <AlertTriangle className="h-3 w-3 text-red-600" />}
                </>
              )}
            </div>
          )
        },
      },
      {
        field: "daysElapsed",
        headerName: "Days Elapsed",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{params.value} days</span>
          </div>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 80,
        cellRenderer: (params: any) => {
          const constraint = params.data._originalData
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(constraint)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(constraint)} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        pinned: "right",
        sortable: false,
        filter: false,
      },
    ],
    [onEdit, onDelete]
  )

  // Grid configuration
  const gridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: true,
    allowRowSelection: true,
    allowMultiSelection: true,
    allowColumnReordering: false,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: false,
    showToolbar: false, // We have custom toolbar
    showStatusBar: true,
    theme: "quartz",
  })

  // Handle row selection
  const handleRowSelection = (event: any) => {
    const selectedNodes = event.api.getSelectedNodes()
    const selectedIds = selectedNodes.map((node: any) => node.data.id)
    setSelectedConstraints(selectedIds)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedConstraints(constraints.map((c) => c.id))
    } else {
      setSelectedConstraints([])
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedConstraints.length > 0) {
      onBulkAction(action, selectedConstraints)
      setSelectedConstraints([])
    }
  }

  const groupedConstraints = useMemo(() => {
    if (!groupByCategory) {
      return { All: transformedConstraints }
    }

    return transformedConstraints.reduce((acc, constraint) => {
      const category = constraint.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(constraint)
      return acc
    }, {} as Record<string, any[]>)
  }, [transformedConstraints, groupByCategory])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search constraints..."
                  value={filters.search}
                  onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Identified">Identified</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/^\d+\.\s*/, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Select
                value={filters.assigned}
                onValueChange={(value) => onFiltersChange({ ...filters, assigned: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedConstraints.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedConstraints.length} constraint(s) selected</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("close")}>
                  Mark Closed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constraints Grid */}
      <div className="space-y-6">
        {Object.entries(groupedConstraints).map(([category, categoryConstraints]) => (
          <Card key={category}>
            {groupByCategory && (
              <CardHeader>
                <CardTitle className="text-lg">
                  {category === "All" ? "All Constraints" : category.replace(/^\d+\.\s*/, "")}
                  <Badge variant="secondary" className="ml-2">
                    {categoryConstraints.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            )}
            <CardContent>
              <div className="min-w-0 max-w-full overflow-hidden">
                <ProtectedGrid
                  columnDefs={columnDefs}
                  rowData={categoryConstraints}
                  config={gridConfig}
                  events={{
                    onRowSelected: handleRowSelection,
                    onGridReady: (event) => {
                      // Grid ready event
                    },
                  }}
                  height="500px"
                  loading={false}
                  enableSearch={false} // We handle search externally
                  title=""
                />
              </div>
              {categoryConstraints.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">No constraints found</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
