"use client"

import React, { useState, useMemo, useCallback } from "react"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Edit,
  Eye,
  Download,
  Calendar,
  Clock,
  Building,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  ChevronDown,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react"
import { format, differenceInDays, isAfter, isBefore } from "date-fns"
import type { Permit, Inspection, PermitTableProps } from "@/types/permit-log"

type SortField =
  | "number"
  | "type"
  | "status"
  | "authority"
  | "applicationDate"
  | "approvalDate"
  | "expirationDate"
  | "cost"
  | "priority"
type SortDirection = "asc" | "desc"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  renewed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

const priorityColors = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const inspectionResultColors = {
  passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  conditional: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export function PermitTable({
  permits,
  onEdit,
  onView,
  onExport,
  onDrillDown,
  compact = false,
  showInspections = false,
  userRole = "user",
  className = "",
}: PermitTableProps) {
  const [sortField, setSortField] = useState<SortField>("applicationDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [pageSize, setPageSize] = useState(compact ? 5 : 25)
  const [currentPage, setCurrentPage] = useState(1)
  const [quickSearch, setQuickSearch] = useState("")

  // Permission checks
  const canEdit = useMemo(() => {
    return ["admin", "project-manager", "project-executive"].includes(userRole)
  }, [userRole])

  const canExport = useMemo(() => {
    return ["admin", "executive", "project-executive", "project-manager"].includes(userRole)
  }, [userRole])

  // Filter permits based on quick search
  const filteredPermits = useMemo(() => {
    if (!quickSearch) return permits

    const searchLower = quickSearch.toLowerCase()
    return permits.filter(
      (permit) =>
        permit.number.toLowerCase().includes(searchLower) ||
        permit.type.toLowerCase().includes(searchLower) ||
        permit.authority.toLowerCase().includes(searchLower) ||
        permit.description.toLowerCase().includes(searchLower) ||
        permit.status.toLowerCase().includes(searchLower)
    )
  }, [permits, quickSearch])

  // Sort permits
  const sortedPermits = useMemo(() => {
    return [...filteredPermits].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "number":
          aValue = a.number
          bValue = b.number
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "authority":
          aValue = a.authority
          bValue = b.authority
          break
        case "applicationDate":
          aValue = new Date(a.applicationDate)
          bValue = new Date(b.applicationDate)
          break
        case "approvalDate":
          aValue = a.approvalDate ? new Date(a.approvalDate) : new Date(0)
          bValue = b.approvalDate ? new Date(b.approvalDate) : new Date(0)
          break
        case "expirationDate":
          aValue = new Date(a.expirationDate)
          bValue = new Date(b.expirationDate)
          break
        case "cost":
          aValue = a.cost || 0
          bValue = b.cost || 0
          break
        case "priority":
          const priorityOrder = { low: 1, medium: 2, high: 3, urgent: 4, critical: 5 }
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
          break
        default:
          aValue = a.number
          bValue = b.number
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredPermits, sortField, sortDirection])

  // Paginate permits
  const paginatedPermits = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedPermits.slice(startIndex, startIndex + pageSize)
  }, [sortedPermits, currentPage, pageSize])

  const totalPages = Math.ceil(sortedPermits.length / pageSize)

  // Transform permits data for the grid
  const transformedPermits = useMemo(() => {
    return paginatedPermits.map((permit) => ({
      id: permit.id,
      number: permit.number,
      type: permit.type,
      status: permit.status,
      authority: permit.authority,
      applicationDate: permit.applicationDate,
      approvalDate: permit.approvalDate,
      expirationDate: permit.expirationDate,
      cost: permit.cost,
      priority: permit.priority,
      description: permit.description,
      authorityContact: permit.authorityContact,
      inspections: permit.inspections || [],
      _originalData: permit, // Keep reference to original data
    }))
  }, [paginatedPermits])

  // Helper functions
  const getStatusIcon = useCallback((status: Permit["status"]) => {
    switch (status) {
      case "approved":
      case "renewed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "expired":
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }, [])

  const getPriorityIcon = useCallback((priority?: Permit["priority"]) => {
    if (!priority) return null

    switch (priority) {
      case "critical":
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-green-600" />
      default:
        return null
    }
  }, [])

  const isExpiringSoon = useCallback((expirationDate: string) => {
    const expDate = new Date(expirationDate)
    const today = new Date()
    const daysUntilExpiration = differenceInDays(expDate, today)
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0
  }, [])

  // Define column definitions for compact view
  const compactColumnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "number",
        headerName: "Permit #",
        width: 120,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return (
            <div className="flex items-center gap-2">
              {getStatusIcon(permit.status)}
              <span className="font-medium">{permit.number}</span>
              {permit.priority && getPriorityIcon(permit.priority)}
            </div>
          )
        },
        pinned: "left",
      },
      {
        field: "type",
        headerName: "Type",
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            {params.value}
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: (params: any) => (
          <Badge variant="outline" className={statusColors[params.value as keyof typeof statusColors]}>
            {params.value}
          </Badge>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 80,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView?.(permit)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit?.(permit)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Permit
                  </DropdownMenuItem>
                )}
                {canExport && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onExport?.(permit)}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Permit
                    </DropdownMenuItem>
                  </>
                )}
                {permit.authorityContact?.email && (
                  <DropdownMenuItem asChild>
                    <a href={`mailto:${permit.authorityContact.email}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Contact Authority
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        pinned: "right",
        sortable: false,
        filter: false,
      },
    ],
    [canEdit, canExport, onView, onEdit, onExport, getStatusIcon, getPriorityIcon]
  )

  // Define column definitions for full view
  const fullColumnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "number",
        headerName: "Permit #",
        width: 120,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return (
            <div className="flex items-center gap-2">
              {getStatusIcon(permit.status)}
              <span className="font-medium">{permit.number}</span>
              {permit.priority && getPriorityIcon(permit.priority)}
            </div>
          )
        },
        pinned: "left",
      },
      {
        field: "type",
        headerName: "Type",
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            {params.value}
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: (params: any) => (
          <Badge variant="outline" className={statusColors[params.value as keyof typeof statusColors]}>
            {params.value}
          </Badge>
        ),
      },
      {
        field: "authority",
        headerName: "Authority",
        width: 150,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="truncate max-w-32">{permit.authority}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{permit.authority}</p>
                  {permit.authorityContact?.name && <p className="text-xs">Contact: {permit.authorityContact.name}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        field: "applicationDate",
        headerName: "Applied",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {format(new Date(params.value), "MMM dd, yyyy")}
          </div>
        ),
      },
      {
        field: "expirationDate",
        headerName: "Expires",
        width: 120,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className={isExpiringSoon(permit.expirationDate) ? "text-orange-600 font-medium" : ""}>
                {format(new Date(params.value), "MMM dd, yyyy")}
              </span>
              {isExpiringSoon(permit.expirationDate) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expires within 30 days</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )
        },
      },
      {
        field: "cost",
        headerName: "Cost",
        width: 100,
        cellRenderer: (params: any) => {
          return params.value ? (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />${params.value.toLocaleString()}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )
        },
      },
      {
        field: "inspections",
        headerName: "Inspections",
        width: 150,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return permit.inspections && permit.inspections.length > 0 ? (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{permit.inspections.length}</span>
              <div className="flex gap-1">
                {permit.inspections.slice(0, 3).map((inspection: Inspection, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`text-xs ${
                      inspectionResultColors[inspection.result as keyof typeof inspectionResultColors]
                    }`}
                  >
                    {inspection.result.charAt(0).toUpperCase()}
                  </Badge>
                ))}
                {permit.inspections.length > 3 && (
                  <span className="text-xs text-muted-foreground">+{permit.inspections.length - 3}</span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">No inspections</span>
          )
        },
      },
      {
        field: "actions",
        headerName: "",
        width: 80,
        cellRenderer: (params: any) => {
          const permit = params.data._originalData
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView?.(permit)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit?.(permit)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Permit
                  </DropdownMenuItem>
                )}
                {canExport && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onExport?.(permit)}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Permit
                    </DropdownMenuItem>
                  </>
                )}
                {permit.authorityContact?.email && (
                  <DropdownMenuItem asChild>
                    <a href={`mailto:${permit.authorityContact.email}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Contact Authority
                    </a>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        pinned: "right",
        sortable: false,
        filter: false,
      },
    ],
    [canEdit, canExport, onView, onEdit, onExport, getStatusIcon, getPriorityIcon, isExpiringSoon]
  )

  // Grid configuration
  const gridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: canExport,
    allowRowSelection: false,
    allowMultiSelection: false,
    allowColumnReordering: false,
    allowColumnResizing: true,
    allowSorting: false, // We handle sorting externally
    allowFiltering: false, // We handle filtering externally
    allowCellEditing: false,
    showToolbar: false, // We have custom toolbar
    showStatusBar: false,
    theme: "quartz",
  })

  // Handle row click
  const handleRowClick = (event: any) => {
    const permit = event.data._originalData
    if (onView) {
      onView(permit)
    }
  }

  if (permits.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No permits found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {quickSearch ? "No permits match your search criteria." : "No permits have been added yet."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Controls */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Quick search..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedPermits.length)} of{" "}
              {sortedPermits.length} permits
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
        </div>
      )}

      {/* Grid */}
      <Card>
        <div className="min-w-0 max-w-full overflow-hidden">
          <ProtectedGrid
            columnDefs={
              compact
                ? compactColumnDefs
                : showInspections
                ? fullColumnDefs
                : fullColumnDefs.filter((col) => col.field !== "inspections")
            }
            rowData={transformedPermits}
            config={gridConfig}
            events={{
              onRowSelected: handleRowClick,
              onGridReady: (event) => {
                // Grid ready event
              },
            }}
            height="400px"
            loading={false}
            enableSearch={false} // We handle search externally
            title=""
          />
        </div>
      </Card>

      {/* Pagination */}
      {!compact && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
