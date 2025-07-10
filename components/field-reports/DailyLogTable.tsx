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
  MoreHorizontal,
  Edit,
  Eye,
  Download,
  Calendar,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CloudSun,
  User,
  Building,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from "lucide-react"
import { format, differenceInDays, isToday, isYesterday } from "date-fns"
import type { DailyLog, ManpowerEntry, Activity } from "@/types/field-reports"

interface DailyLogTableProps {
  logs: DailyLog[]
  onEdit?: (log: DailyLog) => void
  onView?: (log: DailyLog) => void
  onExport?: (log: DailyLog) => void
  compact?: boolean
  userRole?: string
  className?: string
}

type SortField = "date" | "submittedBy" | "status" | "totalWorkers" | "totalHours" | "projectName"
type SortDirection = "asc" | "desc"

const statusColors = {
  submitted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

export function DailyLogTable({
  logs,
  onEdit,
  onView,
  onExport,
  compact = false,
  userRole = "user",
  className = "",
}: DailyLogTableProps) {
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
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

  // Filter logs based on quick search
  const filteredLogs = useMemo(() => {
    if (!quickSearch) return logs

    const searchLower = quickSearch.toLowerCase()
    return logs.filter(
      (log) =>
        log.projectName.toLowerCase().includes(searchLower) ||
        log.submittedBy.toLowerCase().includes(searchLower) ||
        log.status.toLowerCase().includes(searchLower) ||
        log.comments.toLowerCase().includes(searchLower) ||
        log.activities.some((activity) => activity.description.toLowerCase().includes(searchLower))
    )
  }, [logs, quickSearch])

  // Sort logs
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "submittedBy":
          aValue = a.submittedBy
          bValue = b.submittedBy
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        case "totalWorkers":
          aValue = a.totalWorkers
          bValue = b.totalWorkers
          break
        case "totalHours":
          aValue = a.totalHours
          bValue = b.totalHours
          break
        case "projectName":
          aValue = a.projectName
          bValue = b.projectName
          break
        default:
          aValue = new Date(a.date)
          bValue = new Date(b.date)
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredLogs, sortField, sortDirection])

  // Paginate logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedLogs.slice(startIndex, startIndex + pageSize)
  }, [sortedLogs, currentPage, pageSize])

  const totalPages = Math.ceil(sortedLogs.length / pageSize)

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

  // Get status icon
  const getStatusIcon = useCallback((status: DailyLog["status"]) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "draft":
        return <FileText className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }, [])

  // Get date display
  const getDateDisplay = useCallback((date: string) => {
    const logDate = new Date(date)
    if (isToday(logDate)) return "Today"
    if (isYesterday(logDate)) return "Yesterday"
    return format(logDate, "MMM dd, yyyy")
  }, [])

  // Get efficiency trend
  const getEfficiencyTrend = useCallback((log: DailyLog) => {
    if (!log.manpowerEntries.length) return { icon: TrendingUp, color: "text-gray-600" }

    // Calculate efficiency based on expected hours vs actual hours
    const avgEfficiency =
      log.manpowerEntries.reduce((sum, entry) => {
        const expectedHours = entry.workers * 8 // Assuming 8 hours per worker
        const actualHours = entry.totalHours || entry.hours
        const efficiency = expectedHours > 0 ? Math.min(100, (actualHours / expectedHours) * 100) : 75
        return sum + efficiency
      }, 0) / log.manpowerEntries.length

    if (avgEfficiency >= 85) return { icon: TrendingUp, color: "text-green-600" }
    if (avgEfficiency >= 75) return { icon: TrendingUp, color: "text-yellow-600" }
    return { icon: TrendingDown, color: "text-red-600" }
  }, [])

  // Get sort icon
  const getSortIcon = useCallback(
    (field: SortField) => {
      if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
      return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
    },
    [sortField, sortDirection]
  )

  // Get weather icon
  const getWeatherIcon = useCallback((conditions?: string) => {
    if (!conditions) return <CloudSun className="h-4 w-4 text-gray-400" />
    const condition = conditions.toLowerCase()
    if (condition.includes("rain")) return <CloudSun className="h-4 w-4 text-blue-400" />
    if (condition.includes("sun")) return <CloudSun className="h-4 w-4 text-yellow-400" />
    return <CloudSun className="h-4 w-4 text-gray-400" />
  }, [])

  if (logs.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No daily logs found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {quickSearch ? "No daily logs match your search criteria." : "No daily logs have been submitted yet."}
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
                placeholder="Search logs..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedLogs.length)} of{" "}
              {sortedLogs.length} logs
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
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-2">
                  Date
                  {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon("status")}
                </div>
              </TableHead>
              {!compact && (
                <>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("submittedBy")}>
                    <div className="flex items-center gap-2">
                      Submitted By
                      {getSortIcon("submittedBy")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("totalWorkers")}>
                    <div className="flex items-center gap-2">
                      Workers
                      {getSortIcon("totalWorkers")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("totalHours")}>
                    <div className="flex items-center gap-2">
                      Hours
                      {getSortIcon("totalHours")}
                    </div>
                  </TableHead>
                  <TableHead>Weather</TableHead>
                  <TableHead>Activities</TableHead>
                </>
              )}
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log) => {
              const efficiencyTrend = getEfficiencyTrend(log)
              const TrendIcon = efficiencyTrend.icon

              return (
                <TableRow key={log.id} className="group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-medium">{getDateDisplay(log.date)}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(log.date), "EEE")}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[log.status]}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  {!compact && (
                    <>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-32">{log.submittedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{log.totalWorkers}</span>
                          <TrendIcon className={`h-4 w-4 ${efficiencyTrend.color}`} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{log.totalHours}</span>
                          <span className="text-xs text-muted-foreground">hrs</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                {getWeatherIcon(log.weatherConditions?.conditions)}
                                <span className="text-sm">
                                  {log.weatherConditions?.temperature ? `${log.weatherConditions.temperature}°` : "N/A"}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{log.weatherConditions?.conditions || "Weather not recorded"}</p>
                              {log.weatherConditions?.windSpeed && <p>Wind: {log.weatherConditions.windSpeed} mph</p>}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {log.activities.slice(0, 2).map((activity, index) => (
                            <div key={index} className="text-sm truncate max-w-48">
                              {activity.description}
                            </div>
                          ))}
                          {log.activities.length > 2 && (
                            <div className="text-xs text-muted-foreground">+{log.activities.length - 2} more</div>
                          )}
                        </div>
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
                        <DropdownMenuItem onClick={() => onView?.(log)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onEdit?.(log)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Log
                          </DropdownMenuItem>
                        )}
                        {canExport && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onExport?.(log)}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Log
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
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
