"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { useProjectContext } from "@/context/project-context"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarDays,
  FileText,
  BarChart3,
  Download,
  Plus,
  Filter,
  Settings,
  Maximize,
  Minimize,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Building,
  RefreshCw,
  Home,
  Eye,
  Edit,
  XCircle,
  MoreHorizontal,
  ExternalLink,
  Calendar,
} from "lucide-react"
import { useTheme } from "next-themes"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import Permit Components
import { PermitAnalytics } from "@/components/permit-log/PermitAnalytics"
import { PermitFilters } from "@/components/permit-log/PermitFilters"
import { PermitForm } from "@/components/permit-log/PermitForm"
import { PermitExportModal } from "@/components/permit-log/PermitExportModal"
import { PermitTable } from "@/components/permit-log/PermitTable"
import { PermitCalendar } from "@/components/permit-log/PermitCalendar"
import { ProtectedGrid, ProtectedColDef, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"

// Import new components aligned with constraints log
import { PermitWidgets, type PermitStats } from "@/components/permit-log/PermitWidgets"
import { HbiPermitInsights } from "@/components/permit-log/HbiPermitInsights"
import { PermitExportUtils } from "@/components/permit-log/PermitExportUtils"
import { ExportModal } from "@/components/constraints/ExportModal"

import type { Permit, PermitFilters as PermitFiltersType } from "@/types/permit-log"

// Import mock data
import permitsData from "@/data/mock/logs/permits.json"

// Permits ProtectedGrid Component
const PermitsProtectedGrid = ({
  permits,
  onEdit,
  onView,
  onExport,
  userRole,
}: {
  permits: Permit[]
  onEdit?: (permit: Permit) => void
  onView?: (permit: Permit) => void
  onExport?: (permit: Permit) => void
  userRole?: string
}) => {
  const { theme } = useTheme()

  // Transform permits data for the grid
  const transformedPermits = useMemo(() => {
    return permits.map((permit) => ({
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
      _originalData: permit, // Keep reference to original data
    }))
  }, [permits])

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

  const statusColors = {
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    renewed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }

  // Permission checks
  const canEdit = useMemo(() => {
    return ["admin", "project-manager", "project-executive"].includes(userRole || "user")
  }, [userRole])

  const canExport = useMemo(() => {
    return ["admin", "executive", "project-executive", "project-manager"].includes(userRole || "user")
  }, [userRole])

  // Define column definitions
  const columnDefs: ProtectedColDef[] = useMemo(
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
      },
      {
        field: "applicationDate",
        headerName: "Application Date",
        width: 140,
        cellRenderer: (params: any) => <span>{format(new Date(params.value), "MMM d, yyyy")}</span>,
      },
      {
        field: "approvalDate",
        headerName: "Approval Date",
        width: 140,
        cellRenderer: (params: any) => (
          <span>{params.value ? format(new Date(params.value), "MMM d, yyyy") : "Pending"}</span>
        ),
      },
      {
        field: "expirationDate",
        headerName: "Expiration Date",
        width: 140,
        cellRenderer: (params: any) => <span>{format(new Date(params.value), "MMM d, yyyy")}</span>,
      },
      {
        field: "cost",
        headerName: "Cost",
        width: 120,
        cellRenderer: (params: any) => <span>{params.value ? `$${params.value.toLocaleString()}` : "N/A"}</span>,
      },
      {
        field: "priority",
        headerName: "Priority",
        width: 100,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            {getPriorityIcon(params.value)}
            <span className="capitalize">{params.value}</span>
          </div>
        ),
      },
      {
        field: "description",
        headerName: "Description",
        width: 200,
        cellRenderer: (params: any) => (
          <div className="truncate max-w-[180px]" title={params.value}>
            {params.value}
          </div>
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
    [getStatusIcon, getPriorityIcon, statusColors, canEdit, canExport, onView, onEdit, onExport]
  )

  // Grid configuration
  const gridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: canExport,
    allowRowSelection: false,
    allowMultiSelection: false,
    allowColumnReordering: true,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: false,
    showToolbar: true,
    showStatusBar: true,
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
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No permits found</h3>
          <p className="text-sm text-muted-foreground mt-2">No permits have been added yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedGrid
      columnDefs={columnDefs}
      rowData={transformedPermits}
      config={gridConfig}
      events={{
        onRowSelected: handleRowClick,
      }}
      height="500px"
      loading={false}
      enableSearch={true}
      title="Permits"
    />
  )
}

// Inspections ProtectedGrid Component
const InspectionsProtectedGrid = ({
  permits,
  onEdit,
  onView,
  onExport,
  userRole,
}: {
  permits: Permit[]
  onEdit?: (permit: Permit) => void
  onView?: (permit: Permit) => void
  onExport?: (permit: Permit) => void
  userRole?: string
}) => {
  const { theme } = useTheme()

  // Transform permits data to show inspections
  const transformedInspections = useMemo(() => {
    const inspections: any[] = []

    permits.forEach((permit) => {
      if (permit.inspections && permit.inspections.length > 0) {
        permit.inspections.forEach((inspection) => {
          inspections.push({
            id: `${permit.id}-${inspection.id}`,
            permitNumber: permit.number,
            permitType: permit.type,
            inspectionId: inspection.id,
            inspectionType: inspection.type,
            scheduledDate: inspection.scheduledDate,
            completedDate: inspection.completedDate,
            result: inspection.result,
            inspector: inspection.inspector,
            notes: inspection.notes,
            status: inspection.status,
            score: inspection.score,
            _originalData: { permit, inspection }, // Keep reference to original data
          })
        })
      }
    })

    return inspections
  }, [permits])

  // Helper functions
  const getResultIcon = useCallback((result: string) => {
    switch (result) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }, [])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }, [])

  const resultColors = {
    pass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    fail: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  }

  const statusColors = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  // Permission checks
  const canEdit = useMemo(() => {
    return ["admin", "project-manager", "project-executive"].includes(userRole || "user")
  }, [userRole])

  const canExport = useMemo(() => {
    return ["admin", "executive", "project-executive", "project-manager"].includes(userRole || "user")
  }, [userRole])

  // Define column definitions
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "permitNumber",
        headerName: "Permit #",
        width: 120,
        cellRenderer: (params: any) => {
          const { permit } = params.data._originalData
          return (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{permit.number}</span>
            </div>
          )
        },
        pinned: "left",
      },
      {
        field: "permitType",
        headerName: "Permit Type",
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            {params.value}
          </div>
        ),
      },
      {
        field: "inspectionId",
        headerName: "Inspection ID",
        width: 120,
        cellRenderer: (params: any) => <span className="font-mono text-sm">{params.value}</span>,
      },
      {
        field: "inspectionType",
        headerName: "Type",
        width: 150,
      },
      {
        field: "scheduledDate",
        headerName: "Scheduled Date",
        width: 140,
        cellRenderer: (params: any) => (
          <span>{params.value ? format(new Date(params.value), "MMM d, yyyy") : "Not scheduled"}</span>
        ),
      },
      {
        field: "completedDate",
        headerName: "Completed Date",
        width: 140,
        cellRenderer: (params: any) => (
          <span>{params.value ? format(new Date(params.value), "MMM d, yyyy") : "Not completed"}</span>
        ),
      },
      {
        field: "result",
        headerName: "Result",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            {getResultIcon(params.value)}
            <Badge variant="outline" className={resultColors[params.value as keyof typeof resultColors]}>
              {params.value}
            </Badge>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            {getStatusIcon(params.value)}
            <Badge variant="outline" className={statusColors[params.value as keyof typeof statusColors]}>
              {params.value}
            </Badge>
          </div>
        ),
      },
      {
        field: "inspector",
        headerName: "Inspector",
        width: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            {params.value}
          </div>
        ),
      },
      {
        field: "score",
        headerName: "Score",
        width: 100,
        cellRenderer: (params: any) => <span>{params.value ? `${params.value}%` : "N/A"}</span>,
      },
      {
        field: "notes",
        headerName: "Notes",
        width: 200,
        cellRenderer: (params: any) => (
          <div className="truncate max-w-[180px]" title={params.value}>
            {params.value || "No notes"}
          </div>
        ),
      },
      {
        field: "actions",
        headerName: "",
        width: 80,
        cellRenderer: (params: any) => {
          const { permit, inspection } = params.data._originalData
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
                  View Permit
                </DropdownMenuItem>
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit?.(permit)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Inspection
                  </DropdownMenuItem>
                )}
                {canExport && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onExport?.(permit)}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </DropdownMenuItem>
                  </>
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
    [getResultIcon, getStatusIcon, resultColors, statusColors, canEdit, canExport, onView, onEdit, onExport]
  )

  // Grid configuration
  const gridConfig = createGridWithTotalsAndSticky(1, false, {
    allowExport: canExport,
    allowRowSelection: false,
    allowMultiSelection: false,
    allowColumnReordering: true,
    allowColumnResizing: true,
    allowSorting: true,
    allowFiltering: true,
    allowCellEditing: false,
    showToolbar: true,
    showStatusBar: true,
    theme: "quartz",
  })

  // Handle row click
  const handleRowClick = (event: any) => {
    const { permit } = event.data._originalData
    if (onView) {
      onView(permit)
    }
  }

  if (transformedInspections.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No inspections found</h3>
          <p className="text-sm text-muted-foreground mt-2">No inspections have been scheduled yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedGrid
      columnDefs={columnDefs}
      rowData={transformedInspections}
      config={gridConfig}
      events={{
        onRowSelected: handleRowClick,
      }}
      height="500px"
      loading={false}
      enableSearch={true}
      title="Inspections"
    />
  )
}

export default function PermitLogPage() {
  const { user } = useAuth()
  const { projectId, getProjectById } = useProjectContext()
  const { toast } = useToast()

  // Get the current project object
  const selectedProject = getProjectById(projectId)

  // State management
  const [permits, setPermits] = useState<Permit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([])
  const [filters, setFilters] = useState<PermitFiltersType>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showPermitForm, setShowPermitForm] = useState(false)
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load permits data
  useEffect(() => {
    const loadPermits = async () => {
      try {
        setIsLoading(true)
        // Transform the imported data to match our interface
        const transformedPermits: Permit[] = permitsData.map((permit: any) => ({
          ...permit,
          inspections: permit.inspections || [],
          tags: permit.tags || [],
          conditions: permit.conditions || [],
          priority: permit.priority || "medium",
          authorityContact: permit.authorityContact || {},
        }))
        setPermits(transformedPermits)
      } catch (error) {
        console.error("Failed to load permits:", error)
        toast({
          title: "Error",
          description: "Failed to load permit data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPermits()
  }, [toast])

  // Role-based access control
  const hasCreateAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "project-manager", "project-executive"].includes(user.role)
  }, [user])

  const hasFullAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive"].includes(user.role)
  }, [user])

  const hasExportAccess = useMemo(() => {
    if (!user) return false
    return ["admin", "executive", "project-executive", "project-manager"].includes(user.role)
  }, [user])

  // Filter permits based on user role and permissions
  const accessiblePermits = useMemo(() => {
    if (!user) return []

    let filtered = permits

    // Apply project-based filtering if a specific project is selected
    if (selectedProject) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === selectedProject.id)
    } else if (!hasFullAccess) {
      // Apply role-based filtering when no specific project is selected
      if (user.role === "project-executive") {
        // Show permits from assigned projects (mock data shows various project IDs)
        const assignedProjects = ["2525840", "2525841", "2525842"]
        filtered = filtered.filter((permit) => assignedProjects.includes(permit.projectId.toString()))
      } else if (user.role === "project-manager") {
        // Show permits from active project only
        const activeProject = "2525840"
        filtered = filtered.filter((permit) => permit.projectId.toString() === activeProject)
      }
    }

    return filtered
  }, [permits, user, hasFullAccess, selectedProject])

  // Apply filters and search
  useEffect(() => {
    let filtered = accessiblePermits

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (permit) =>
          permit.number.toLowerCase().includes(searchLower) ||
          permit.type.toLowerCase().includes(searchLower) ||
          permit.authority.toLowerCase().includes(searchLower) ||
          permit.description.toLowerCase().includes(searchLower)
      )
    }

    if (filters.status) {
      filtered = filtered.filter((permit) => permit.status === filters.status)
    }

    if (filters.type) {
      filtered = filtered.filter((permit) => permit.type === filters.type)
    }

    if (filters.authority) {
      filtered = filtered.filter((permit) => permit.authority.toLowerCase().includes(filters.authority!.toLowerCase()))
    }

    if (filters.projectId) {
      filtered = filtered.filter((permit) => permit.projectId.toString() === filters.projectId)
    }

    if (filters.dateRange) {
      filtered = filtered.filter((permit) => {
        const permitDate = new Date(permit.applicationDate)
        const startDate = new Date(filters.dateRange!.start)
        const endDate = new Date(filters.dateRange!.end)
        return permitDate >= startDate && permitDate <= endDate
      })
    }

    if (filters.expiringWithin) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() + filters.expiringWithin)
      filtered = filtered.filter((permit) => {
        const expirationDate = new Date(permit.expirationDate)
        return expirationDate <= cutoffDate && (permit.status === "approved" || permit.status === "renewed")
      })
    }

    setFilteredPermits(filtered)
  }, [accessiblePermits, filters, searchTerm])

  // Calculate statistics
  const stats = useMemo((): PermitStats => {
    const totalPermits = filteredPermits.length
    const approvedPermits = filteredPermits.filter((p) => p.status === "approved" || p.status === "renewed").length
    const pendingPermits = filteredPermits.filter((p) => p.status === "pending").length
    const expiredPermits = filteredPermits.filter((p) => p.status === "expired").length
    const rejectedPermits = filteredPermits.filter((p) => p.status === "rejected").length

    const totalInspections = filteredPermits.reduce((sum, p) => sum + (p.inspections?.length || 0), 0)
    const passedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "passed").length || 0),
      0
    )
    const failedInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "failed").length || 0),
      0
    )
    const pendingInspections = filteredPermits.reduce(
      (sum, p) => sum + (p.inspections?.filter((i) => i.result === "pending").length || 0),
      0
    )

    const approvalRate = totalPermits > 0 ? (approvedPermits / totalPermits) * 100 : 0
    const inspectionPassRate = totalInspections > 0 ? (passedInspections / totalInspections) * 100 : 0

    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const expiringPermits = filteredPermits.filter((p) => {
      const expDate = new Date(p.expirationDate)
      return expDate <= thirtyDaysFromNow && expDate > new Date() && (p.status === "approved" || p.status === "renewed")
    }).length

    const byType = filteredPermits.reduce((acc, permit) => {
      acc[permit.type] = (acc[permit.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byAuthority = filteredPermits.reduce((acc, permit) => {
      acc[permit.authority] = (acc[permit.authority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStatus = filteredPermits.reduce((acc, permit) => {
      acc[permit.status] = (acc[permit.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPermits,
      approvedPermits,
      pendingPermits,
      expiredPermits,
      rejectedPermits,
      expiringPermits,
      totalInspections,
      passedInspections,
      failedInspections,
      pendingInspections,
      approvalRate,
      inspectionPassRate,
      byType,
      byAuthority,
      byStatus,
    }
  }, [filteredPermits])

  // Event handlers
  const handleCreatePermit = useCallback(() => {
    if (!hasCreateAccess) return
    setSelectedPermit(null)
    setShowPermitForm(true)
  }, [hasCreateAccess])

  const handleEditPermit = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    setShowPermitForm(true)
  }, [])

  const handleViewPermit = useCallback((permit: Permit) => {
    setSelectedPermit(permit)
    // For now, just log - could open a view-only modal in the future
    console.log("View permit:", permit)
  }, [])

  const handleExportPermit = useCallback(
    (permit: Permit) => {
      console.log("Export permit:", permit)
      toast({
        title: "Export Started",
        description: `Exporting permit ${permit.number}`,
      })
    },
    [toast]
  )

  const handleSavePermit = useCallback(
    (permitData: Partial<Permit>) => {
      if (selectedPermit) {
        // Update existing permit
        setPermits((prev) =>
          prev.map((p) =>
            p.id === selectedPermit.id ? { ...p, ...permitData, updatedAt: new Date().toISOString() } : p
          )
        )
        toast({
          title: "Success",
          description: "Permit updated successfully",
        })
      } else {
        // Create new permit
        const newPermit: Permit = {
          id: `perm-${Date.now()}`,
          projectId: selectedProject?.id || "2525840",
          createdBy: user?.id || "current-user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          inspections: [],
          tags: [],
          conditions: [],
          ...permitData,
        } as Permit
        setPermits((prev) => [...prev, newPermit])
        toast({
          title: "Success",
          description: "Permit created successfully",
        })
      }
      setShowPermitForm(false)
    },
    [selectedPermit, user, selectedProject, toast]
  )

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchTerm("")
  }, [])

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Permit data has been updated",
      })
    }, 1000)
  }

  // Handle export
  const handleExportSubmit = (options: { format: "pdf" | "excel" | "csv"; fileName: string; filePath: string }) => {
    try {
      const projectName = selectedProject?.name || "All Projects"

      switch (options.format) {
        case "pdf":
          PermitExportUtils.exportToPDF(filteredPermits, stats, projectName, options.fileName)
          break
        case "excel":
          PermitExportUtils.exportToExcel(filteredPermits, stats, projectName, options.fileName)
          break
        case "csv":
          PermitExportUtils.exportToCSV(filteredPermits, projectName, options.fileName)
          break
      }

      toast({
        title: "Export Started",
        description: `Permit data exported to ${options.format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  // Toggle fullscreen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isFullScreen])

  // Get role-specific project scope description
  const getProjectScopeDescription = () => {
    if (!user) return "All Projects"

    switch (user.role) {
      case "project-manager":
        return "Single Project View"
      case "project-executive":
        return "Portfolio View (6 Projects)"
      default:
        return "Enterprise View (All Projects)"
    }
  }

  const PermitContentCard = () => (
    <Card className={isFullScreen ? "fixed inset-0 z-[130] rounded-none" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#003087] dark:text-blue-400" />
          Permit Management
        </CardTitle>
        <Button variant="outline" size="sm" onClick={toggleFullScreen} className="flex items-center gap-2">
          {isFullScreen ? (
            <>
              <Minimize className="h-4 w-4" />
              Exit Full Screen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4" />
              Full Screen
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className={isFullScreen ? "h-[calc(100vh-80px)] overflow-y-auto" : ""}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-wrap gap-1 p-1 bg-muted rounded-lg mb-6" data-tour="permit-tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "overview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("permits")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "permits"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Permits</span>
            </button>
            <button
              onClick={() => setActiveTab("inspections")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "inspections"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Inspections</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "calendar"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "analytics"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "reports"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Reports</span>
            </button>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              <PermitTable
                permits={filteredPermits.slice(0, 10)}
                onEdit={handleEditPermit}
                onView={handleViewPermit}
                onExport={handleExportPermit}
                userRole={user?.role}
                compact={true}
              />
            </div>
          </TabsContent>

          {/* Permits Tab */}
          <TabsContent value="permits">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    View and manage all construction permits and their details
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {hasCreateAccess && (
                    <Button
                      size="sm"
                      onClick={handleCreatePermit}
                      className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Permit
                    </Button>
                  )}
                  {hasExportAccess && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExportModal(true)}
                      className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div data-tour="permits-table">
              <PermitsProtectedGrid
                permits={filteredPermits}
                onEdit={handleEditPermit}
                onView={handleViewPermit}
                onExport={handleExportPermit}
                userRole={user?.role}
              />
            </div>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Inspection Management</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track inspection schedules, results, and compliance scores
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {hasExportAccess && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExportModal(true)}
                      className="border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white dark:border-blue-400 dark:text-blue-400"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Inspections
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div data-tour="inspections-scheduling">
              <InspectionsProtectedGrid
                permits={filteredPermits}
                onEdit={handleEditPermit}
                onView={handleViewPermit}
                onExport={handleExportPermit}
                userRole={user?.role}
              />
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Permit & Inspection Calendar</h2>
              <p className="text-sm text-muted-foreground mt-1">Visual timeline of permits and inspections</p>
            </div>
            <div data-tour="calendar-events">
              <PermitCalendar
                permits={filteredPermits}
                onEditPermit={handleEditPermit}
                onViewPermit={handleViewPermit}
                onCreatePermit={handleCreatePermit}
                userRole={user?.role}
              />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div data-tour="analytics-charts">
              <PermitAnalytics permits={filteredPermits} detailed={true} />
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#003087] dark:text-blue-400">Export Reports</h2>
              <p className="text-sm text-muted-foreground mt-1">Generate comprehensive permit and inspection reports</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-tour="reports-templates">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowExportModal(true)}
              >
                <FileText className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                <span>Permit Summary</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowExportModal(true)}
              >
                <BarChart3 className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                <span>Analytics Report</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowExportModal(true)}
              >
                <CalendarDays className="h-8 w-8 text-[#003087] dark:text-blue-400" />
                <span>Inspection Log</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <>
      <AppHeader />
      <div className="space-y-6 p-6">
        {!isFullScreen && (
          <>
            {/* Sticky Header with Breadcrumbs */}
            <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-sm border-b pb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Permit Log</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Permit Log</h1>
                  <p className="text-muted-foreground mt-1">Track and manage construction permits and inspections</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={() => setShowExportModal(true)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  {hasCreateAccess && (
                    <Button className="bg-[#FF6B35] hover:bg-[#E55A2B]" onClick={handleCreatePermit}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Permit
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Layout with Sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="xl:col-span-3 space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Total Permits</span>
                      </div>
                      <span className="font-semibold">{stats.totalPermits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Approved</span>
                      </div>
                      <span className="font-semibold">{stats.approvedPermits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Pending</span>
                      </div>
                      <span className="font-semibold">{stats.pendingPermits}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">Expiring</span>
                      </div>
                      <span className="font-semibold">{stats.expiringPermits}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hasCreateAccess && (
                      <Button onClick={handleCreatePermit} className="w-full bg-[#FF6B35] hover:bg-[#E55A2B]">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Permit
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="w-full">
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh Data
                    </Button>
                    {hasExportAccess && (
                      <Button variant="outline" onClick={() => setShowExportModal(true)} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Project Scope */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Project Scope</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">View Type</span>
                      </div>
                      <Badge variant="outline">
                        {user?.role === "project-manager"
                          ? "single"
                          : user?.role === "project-executive"
                          ? "portfolio"
                          : "enterprise"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Access Level</span>
                      </div>
                      <span className="font-semibold">{user?.role || "viewer"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{getProjectScopeDescription()}</div>
                  </CardContent>
                </Card>

                {/* Inspection Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Inspections</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Passed</span>
                      </div>
                      <span className="font-semibold">{stats.passedInspections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">Failed</span>
                      </div>
                      <span className="font-semibold">{stats.failedInspections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Pending</span>
                      </div>
                      <span className="font-semibold">{stats.pendingInspections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Pass Rate</span>
                      </div>
                      <span className="font-semibold">{stats.inspectionPassRate.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-9">
                {/* HBI Insights Panel */}
                <div className="mb-6" data-tour="permit-log-hbi-insights">
                  <HbiPermitInsights permits={filteredPermits} stats={stats} />
                </div>

                {/* Main Content */}
                <PermitContentCard />
              </div>
            </div>
          </>
        )}

        {/* Fullscreen Content */}
        {isFullScreen && <PermitContentCard />}

        {/* Create/Edit Permit Modal */}
        <PermitForm
          permit={selectedPermit}
          open={showPermitForm}
          onClose={() => setShowPermitForm(false)}
          onSave={handleSavePermit}
          userRole={user?.role}
        />

        {/* Export Modal */}
        <div data-tour="permit-export">
          <ExportModal
            open={showExportModal}
            onOpenChange={setShowExportModal}
            onExport={handleExportSubmit}
            defaultFileName="PermitLogData"
          />
        </div>

        {/* Help & Support Section */}
        {!isFullScreen && (
          <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Permit Management Help</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Access comprehensive tools for managing construction permits, inspections, and compliance with
                    AI-powered insights.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600"
                    >
                      Permit Applications
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600"
                    >
                      Inspection Scheduling
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600"
                    >
                      Compliance Tracking
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600"
                    >
                      Authority Relations
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-300 dark:text-blue-300 dark:border-blue-600"
                    >
                      HBI Insights
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
