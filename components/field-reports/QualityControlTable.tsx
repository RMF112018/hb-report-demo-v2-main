"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Calendar,
  Search,
  Filter,
  Download,
  FileText,
  Eye,
  Edit,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Target,
  Activity,
  Star,
  XCircle,
} from "lucide-react"
import { format, differenceInDays, isToday, isYesterday } from "date-fns"
import type { QualityInspection } from "@/types/field-reports"

interface QualityControlTableProps {
  qualityInspections: QualityInspection[]
  compact?: boolean
  userRole?: string
  onInspectionSelect?: (inspection: QualityInspection) => void
  onExport?: () => void
}

type SortField = "date" | "type" | "location" | "status" | "defects" | "trade"
type SortDirection = "asc" | "desc"

export const QualityControlTable: React.FC<QualityControlTableProps> = ({
  qualityInspections,
  compact = false,
  userRole = "project_manager",
  onInspectionSelect,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = compact ? 5 : 10

  // Get status badge properties
  const getStatusBadge = useCallback((inspection: QualityInspection) => {
    switch (inspection.status) {
      case "pass":
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
          text: "Pass",
        }
      case "fail":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
          text: "Fail",
        }
      case "pending":
        return {
          variant: "secondary" as const,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
          text: "Pending",
        }
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100",
          text: "Unknown",
        }
    }
  }, [])

  // Get quality score trend
  const getQualityTrend = useCallback((inspection: QualityInspection) => {
    const defects = inspection.defects || 0
    if (defects === 0) return { icon: TrendingUp, color: "text-green-600" }
    if (defects <= 2) return { icon: TrendingUp, color: "text-blue-600" }
    if (defects <= 5) return { icon: TrendingDown, color: "text-yellow-600" }
    return { icon: TrendingDown, color: "text-red-600" }
  }, [])

  // Get date display
  const getDateDisplay = useCallback((dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    return format(date, "MMM d, yyyy")
  }, [])

  // Filter and sort quality inspections
  const filteredAndSortedInspections = useMemo(() => {
    let filtered = qualityInspections

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (inspection) =>
          inspection.projectName.toLowerCase().includes(search) ||
          inspection.type.toLowerCase().includes(search) ||
          inspection.location.toLowerCase().includes(search) ||
          inspection.trade.toLowerCase().includes(search) ||
          inspection.description.toLowerCase().includes(search)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((inspection) => inspection.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((inspection) => inspection.type === typeFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "date") {
        aValue = new Date(a.date).getTime()
        bValue = new Date(b.date).getTime()
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [qualityInspections, searchTerm, statusFilter, typeFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedInspections.length / itemsPerPage)
  const paginatedInspections = filteredAndSortedInspections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  // Get unique types for filter
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(qualityInspections.map((inspection) => inspection.type))]
    return types.sort()
  }, [qualityInspections])

  // Handle inspection actions
  const handleViewInspection = (inspection: QualityInspection) => {
    if (onInspectionSelect) {
      onInspectionSelect(inspection)
    }
  }

  const handleEditInspection = (inspection: QualityInspection) => {
    // Handle edit logic
    console.log("Edit inspection:", inspection.id)
  }

  const handleExportInspection = (inspection: QualityInspection) => {
    // Handle individual inspection export
    console.log("Export inspection:", inspection.id)
  }

  // Check permissions
  const canEdit = userRole === "project_manager" || userRole === "quality_inspector"
  const canExport = true

  if (qualityInspections.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quality Inspections Found</h3>
            <p className="text-muted-foreground">No quality control records match your current filters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inspections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                      {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("type")}>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Type
                      {getSortIcon("type")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("location")}>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Location
                      {getSortIcon("location")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("defects")}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Defects
                      {getSortIcon("defects")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("trade")}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Trade
                      {getSortIcon("trade")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInspections.map((inspection) => {
                  const statusBadge = getStatusBadge(inspection)
                  const qualityTrend = getQualityTrend(inspection)
                  const TrendIcon = qualityTrend.icon

                  return (
                    <TableRow
                      key={inspection.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewInspection(inspection)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{getDateDisplay(inspection.date)}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(inspection.date), "HH:mm")}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{inspection.type}</div>
                          <div className="text-xs text-muted-foreground">{inspection.createdBy}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{inspection.location}</div>
                          {!compact && <div className="text-xs text-muted-foreground">{inspection.projectName}</div>}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={statusBadge.className}>{statusBadge.text}</Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1">
                                  <TrendIcon className={`h-4 w-4 ${qualityTrend.color}`} />
                                  {inspection.defects > 0 ? (
                                    <Badge variant="destructive" className="text-xs">
                                      {inspection.defects}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                      None
                                    </Badge>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Quality defects found</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{inspection.trade}</span>
                          {inspection.issues && inspection.issues.length > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{inspection.issues.length} issues identified</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewInspection(inspection)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {canEdit && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditInspection(inspection)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Inspection
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {canExport && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleExportInspection(inspection)
                                }}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Export
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!compact && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedInspections.length)} of{" "}
            {filteredAndSortedInspections.length} results
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>
      )}
    </div>
  )
}
