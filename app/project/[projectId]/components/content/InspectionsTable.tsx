"use client"

import React, { useState, useMemo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Edit,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import type { Permit, Inspection } from "@/types/permit-log"

interface InspectionsTableProps {
  permits: Permit[]
  onEditInspection?: (inspection: Inspection, permit: Permit) => void
  onViewInspection?: (inspection: Inspection, permit: Permit) => void
  userRole?: string
  compact?: boolean
  className?: string
}

type SortField = "type" | "inspector" | "result" | "scheduledDate" | "completedDate" | "complianceScore"
type SortDirection = "asc" | "desc"

const resultColors = {
  passed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  conditional: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export function InspectionsTable({
  permits,
  onEditInspection,
  onViewInspection,
  userRole = "user",
  compact = false,
  className = "",
}: InspectionsTableProps) {
  const [sortField, setSortField] = useState<SortField>("scheduledDate")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [pageSize, setPageSize] = useState(compact ? 5 : 25)
  const [currentPage, setCurrentPage] = useState(1)
  const [quickSearch, setQuickSearch] = useState("")

  // Permission checks
  const canEdit = useMemo(() => {
    return ["admin", "project-manager", "project-executive"].includes(userRole)
  }, [userRole])

  // Flatten all inspections with permit context
  const allInspections = useMemo(() => {
    const inspections: Array<Inspection & { permit: Permit }> = []

    permits.forEach((permit) => {
      if (permit.inspections && permit.inspections.length > 0) {
        permit.inspections.forEach((inspection) => {
          inspections.push({ ...inspection, permit })
        })
      }
    })

    return inspections
  }, [permits])

  // Filter inspections based on quick search
  const filteredInspections = useMemo(() => {
    if (!quickSearch) return allInspections

    const searchLower = quickSearch.toLowerCase()
    return allInspections.filter(
      (inspection) =>
        inspection.type.toLowerCase().includes(searchLower) ||
        inspection.inspector.toLowerCase().includes(searchLower) ||
        inspection.result.toLowerCase().includes(searchLower) ||
        inspection.permit.number.toLowerCase().includes(searchLower) ||
        (inspection.comments && inspection.comments.toLowerCase().includes(searchLower))
    )
  }, [allInspections, quickSearch])

  // Sort inspections
  const sortedInspections = useMemo(() => {
    return [...filteredInspections].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "inspector":
          aValue = a.inspector
          bValue = b.inspector
          break
        case "result":
          aValue = a.result
          bValue = b.result
          break
        case "scheduledDate":
          aValue = a.scheduledDate ? new Date(a.scheduledDate) : new Date(0)
          bValue = b.scheduledDate ? new Date(b.scheduledDate) : new Date(0)
          break
        case "completedDate":
          aValue = a.completedDate ? new Date(a.completedDate) : new Date(0)
          bValue = b.completedDate ? new Date(b.completedDate) : new Date(0)
          break
        case "complianceScore":
          aValue = a.complianceScore || 0
          bValue = b.complianceScore || 0
          break
        default:
          aValue = a.type
          bValue = b.type
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredInspections, sortField, sortDirection])

  // Paginate inspections
  const paginatedInspections = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedInspections.slice(startIndex, startIndex + pageSize)
  }, [sortedInspections, currentPage, pageSize])

  const totalPages = Math.ceil(sortedInspections.length / pageSize)

  // Handle sorting
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField]
  )

  // Get result icon
  const getResultIcon = useCallback((result: Inspection["result"]) => {
    switch (result) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "conditional":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }, [])

  // Get sort icon
  const getSortIcon = useCallback(
    (field: SortField) => {
      if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
      return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    },
    [sortField, sortDirection]
  )

  if (allInspections.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No inspections found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {quickSearch ? "No inspections match your search criteria." : "No inspections have been scheduled yet."}
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
                placeholder="Search inspections..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedInspections.length)} of{" "}
              {sortedInspections.length} inspections
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

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("type")}>
                <div className="flex items-center gap-2">
                  Inspection Type
                  {getSortIcon("type")}
                </div>
              </TableHead>
              <TableHead>Permit #</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("result")}>
                <div className="flex items-center gap-2">
                  Result
                  {getSortIcon("result")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("inspector")}>
                <div className="flex items-center gap-2">
                  Inspector
                  {getSortIcon("inspector")}
                </div>
              </TableHead>
              {!compact && (
                <>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("scheduledDate")}>
                    <div className="flex items-center gap-2">
                      Scheduled
                      {getSortIcon("scheduledDate")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("completedDate")}>
                    <div className="flex items-center gap-2">
                      Completed
                      {getSortIcon("completedDate")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("complianceScore")}>
                    <div className="flex items-center gap-2">
                      Score
                      {getSortIcon("complianceScore")}
                    </div>
                  </TableHead>
                </>
              )}
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInspections.map((inspection) => (
              <TableRow key={inspection.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getResultIcon(inspection.result)}
                    <span>{inspection.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {inspection.permit.number}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={resultColors[inspection.result as keyof typeof resultColors]}>
                    {inspection.result}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {inspection.inspector}
                  </div>
                </TableCell>
                {!compact && (
                  <>
                    <TableCell>
                      {inspection.scheduledDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(inspection.scheduledDate), "MMM dd, yyyy")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {inspection.completedDate ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(inspection.completedDate), "MMM dd, yyyy")}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {inspection.complianceScore ? (
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">{inspection.complianceScore}%</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewInspection?.(inspection, inspection.permit)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {canEdit && (
                        <DropdownMenuItem onClick={() => onEditInspection?.(inspection, inspection.permit)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Inspection
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
