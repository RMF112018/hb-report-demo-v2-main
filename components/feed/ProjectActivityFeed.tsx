"use client"

import React, { useState, useMemo } from "react"
import { format } from "date-fns"
import {
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Download,
  FileText,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import { cn } from "@/lib/utils"
import {
  ActivityFeedItem,
  ActivityFeedConfig,
  ActivityFeedFilters,
  ActivityType,
  ActivitySource,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_SOURCE_LABELS,
} from "@/types/activity-feed"
import activityFeedData from "@/data/mock/activity-feed.json"

interface ProjectActivityFeedProps {
  config: ActivityFeedConfig
  className?: string
}

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
]

export function ProjectActivityFeed({ config, className }: ProjectActivityFeedProps) {
  const [filters, setFilters] = useState<ActivityFeedFilters>({})
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortBy, setSortBy] = useState<"date" | "type">("date")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([])
  const [selectedSources, setSelectedSources] = useState<ActivitySource[]>([])

  // Get raw data based on user role
  const getRawData = (): ActivityFeedItem[] => {
    const data = activityFeedData as Record<string, ActivityFeedItem[]>
    // Map hyphenated role names to underscored JSON keys
    const roleMapping: Record<string, string> = {
      "project-executive": "project_executive",
      "project-manager": "project_manager",
      executive: "executive",
      estimator: "estimator",
    }
    const jsonKey = roleMapping[config.userRole] || config.userRole
    return data[jsonKey] || []
  }

  // Apply filters and sorting
  const filteredAndSortedData = useMemo(() => {
    let data = getRawData()

    // Apply project filter if specified
    if (config.projectId) {
      data = data.filter((item) => item.project_id === config.projectId)
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ACTIVITY_TYPE_LABELS[item.type].toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      data = data.filter((item) => selectedTypes.includes(item.type))
    }

    // Apply source filter
    if (selectedSources.length > 0) {
      data = data.filter((item) => selectedSources.includes(item.source))
    }

    // Apply date range filter
    if (filters.dateRange) {
      const { from, to } = filters.dateRange
      data = data.filter((item) => {
        const itemDate = new Date(item.timestamp)
        return itemDate >= from && itemDate <= to
      })
    }

    // Apply sorting
    data.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.timestamp)
        const dateB = new Date(b.timestamp)
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      } else {
        const typeA = ACTIVITY_TYPE_LABELS[a.type]
        const typeB = ACTIVITY_TYPE_LABELS[b.type]
        return sortOrder === "asc" ? typeA.localeCompare(typeB) : typeB.localeCompare(typeA)
      }
    })

    return data
  }, [getRawData, searchTerm, selectedTypes, selectedSources, filters, sortBy, sortOrder, config.projectId])

  // Transform data for ProtectedGrid
  const transformedData = useMemo(() => {
    return filteredAndSortedData.map((activity) => ({
      id: activity.id,
      project_name: activity.project_name,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
      user: activity.user,
      _originalData: activity,
    }))
  }, [filteredAndSortedData])

  // Column definitions for ProtectedGrid
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        headerName: "Project",
        field: "project_name",
        width: 200,
        pinned: "left",
        cellRenderer: (params: any) => (
          <div className="truncate" title={params.value}>
            {params.value}
          </div>
        ),
      },
      {
        headerName: "Type",
        field: "type",
        width: 120,
        cellRenderer: (params: any) => (
          <Badge variant="secondary" className={cn("text-xs", getActivityBadgeColor(params.value as ActivityType))}>
            {ACTIVITY_TYPE_LABELS[params.value as ActivityType]}
          </Badge>
        ),
      },
      {
        headerName: "Description",
        field: "description",
        minWidth: 300,
        flex: 1,
        cellRenderer: (params: any) => (
          <div className="max-w-md">
            <div className="truncate" title={params.value}>
              {params.value}
            </div>
            {params.data.user && <div className="text-xs text-muted-foreground mt-1">by {params.data.user}</div>}
          </div>
        ),
      },
      {
        headerName: "Time & Date",
        field: "timestamp",
        width: 150,
        cellRenderer: (params: any) => (
          <div className="text-sm text-muted-foreground">{formatTimestamp(params.value)}</div>
        ),
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 80,
        cellRenderer: (params: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  )

  // Pagination is handled internally by ProtectedGrid
  const itemsPerPage = config.itemsPerPage || 10

  // Handle type selection
  const handleTypeToggle = (type: ActivityType) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  // Handle source selection
  const handleSourceToggle = (source: ActivitySource) => {
    setSelectedSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), "MM/dd/yy - HH:mm")
  }

  // Get activity type badge color
  const getActivityBadgeColor = (type: ActivityType) => {
    const colorMap: Record<ActivityType, string> = {
      submittal: "bg-blue-100 text-blue-700",
      rfi: "bg-orange-100 text-orange-700",
      change_order: "bg-red-100 text-red-700",
      change_event: "bg-purple-100 text-purple-700",
      commitment: "bg-green-100 text-green-700",
      drawing: "bg-cyan-100 text-cyan-700",
      daily_log: "bg-gray-100 text-gray-700",
      inspection: "bg-yellow-100 text-yellow-700",
      bid_package: "bg-indigo-100 text-indigo-700",
      bid_invitation: "bg-pink-100 text-pink-700",
      proposal: "bg-teal-100 text-teal-700",
      correspondence: "bg-slate-100 text-slate-700",
      compliance: "bg-emerald-100 text-emerald-700",
      pay_app: "bg-lime-100 text-lime-700",
      contract: "bg-violet-100 text-violet-700",
      budget: "bg-amber-100 text-amber-700",
      quality_inspection: "bg-rose-100 text-rose-700",
      deficiency: "bg-red-100 text-red-700",
      resolution: "bg-green-100 text-green-700",
      spcr: "bg-blue-100 text-blue-700",
      forecast: "bg-purple-100 text-purple-700",
      assignment: "bg-indigo-100 text-indigo-700",
      note: "bg-gray-100 text-gray-700",
    }
    return colorMap[type] || "bg-gray-100 text-gray-700"
  }

  // Get unique types and sources from data
  const availableTypes = useMemo(() => {
    const types = new Set(getRawData().map((item) => item.type))
    return Array.from(types)
  }, [getRawData])

  const availableSources = useMemo(() => {
    const sources = new Set(getRawData().map((item) => item.source))
    return Array.from(sources)
  }, [getRawData])

  // Handle empty state for estimator
  if (config.userRole === "estimator") {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activity Found</h3>
            <p className="text-muted-foreground max-w-md">
              There are no activities to display at this time. Activities will appear here as project work progresses.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Activity Feed
            <Badge variant="secondary" className="ml-2">
              {filteredAndSortedData.length} activities
            </Badge>
          </CardTitle>

          {config.allowExport && (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: "date" | "type") => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3"
              >
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Activity Types</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => handleTypeToggle(type)}
                        />
                        <Label htmlFor={type} className="text-sm">
                          {ACTIVITY_TYPE_LABELS[type]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Source Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Sources</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableSources.map((source) => (
                      <div key={source} className="flex items-center space-x-2">
                        <Checkbox
                          id={source}
                          checked={selectedSources.includes(source)}
                          onCheckedChange={() => handleSourceToggle(source)}
                        />
                        <Label htmlFor={source} className="text-sm">
                          {ACTIVITY_SOURCE_LABELS[source]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTypes([])
                    setSelectedSources([])
                    setSearchTerm("")
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Activity Table */}
        <div className="rounded-md border">
          <ProtectedGrid
            columnDefs={columnDefs}
            rowData={transformedData}
            config={createGridWithTotalsAndSticky(1, false, {
              allowExport: config.allowExport,
              allowRowSelection: true,
              allowColumnResizing: true,
              allowSorting: true,
              allowFiltering: true,
              allowCellEditing: false,
              showToolbar: true,
              showStatusBar: true,
              enableTotalsRow: false,
              stickyColumnsCount: 1,
            })}
            height="500px"
            enableSearch={true}
            defaultSearch={searchTerm}
            title=""
            className="border-none"
          />
        </div>

        {/* Pagination is handled internally by ProtectedGrid */}
      </CardContent>
    </Card>
  )
}
