/**
 * @fileoverview Employee Safety Certifications Tracker Component
 * @module CertificationTracker
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Features:
 * - Employee certification tracking with protected-grid
 * - Color-coded status badges (Valid, Expiring, Expired)
 * - Inline editing for certification dates
 * - Column filters for status and position
 * - Document upload tracking
 * - Renewal reminders
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import {
  ProtectedGrid,
  createProtectedColumn,
  createReadOnlyColumn,
  createGridWithTotalsAndSticky,
  type ProtectedColDef,
  type GridRow,
  type GridConfig,
  type GridEvents,
} from "../ui/protected-grid"
import {
  Shield,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  Download,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Award,
  Building,
  Users,
  DollarSign,
  Mail,
  Phone,
  FileUp,
  ExternalLink,
  Settings,
  MoreVertical,
  Trash2,
  UserCheck,
  Calendar as CalendarIcon,
} from "lucide-react"

// Import mock data
import certificationsData from "../../data/mock/certifications.json"
import { useToast } from "../../hooks/use-toast"

interface CertificationRecord {
  id: string
  employeeId: string
  employeeName: string
  position: string
  department: string
  certificationName: string
  certificationCode: string
  issuer: string
  issueDate: string
  expirationDate: string
  renewalStatus: "Valid" | "Expiring Soon" | "Expired"
  proofUploaded: boolean
  documentUrl: string | null
  reminderSent: boolean
  notes: string
  category: string
  priority: "Low" | "Medium" | "High" | "Critical"
  autoRenewal: boolean
  cost: number
  vendorContact: string
  lastUpdated: string
}

interface CertificationTrackerProps {
  userRole: string
  onCertificationUpdate?: (certification: CertificationRecord) => void
}

// Helper function to determine status color
const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Valid":
      return "default"
    case "Expiring Soon":
      return "secondary"
    case "Expired":
      return "destructive"
    default:
      return "outline"
  }
}

// Helper function to determine priority color
const getPriorityColor = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (priority) {
    case "Critical":
      return "destructive"
    case "High":
      return "secondary"
    case "Medium":
      return "default"
    case "Low":
      return "outline"
    default:
      return "outline"
  }
}

// Helper function to calculate days until expiration
const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date()
  const expiration = new Date(expirationDate)
  const timeDiff = expiration.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

// Helper function to format date for display
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export const CertificationTracker: React.FC<CertificationTrackerProps> = ({ userRole, onCertificationUpdate }) => {
  const { toast } = useToast()
  const [certifications, setCertifications] = useState<CertificationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddCertification, setShowAddCertification] = useState(false)

  // Load certification data
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Load from mock data
        const data = certificationsData.certifications as CertificationRecord[]
        setCertifications(data)
      } catch (error) {
        console.error("Error loading certifications:", error)
        toast({
          title: "Error Loading Certifications",
          description: "Failed to load certification data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadCertifications()
  }, [toast])

  // Filter certifications based on selected filters
  const filteredCertifications = useMemo(() => {
    let filtered = [...certifications]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (cert) =>
          cert.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.certificationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.certificationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.issuer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply employee filter
    if (selectedEmployee !== "all") {
      filtered = filtered.filter((cert) => cert.employeeId === selectedEmployee)
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((cert) => cert.renewalStatus === selectedStatus)
    }

    // Apply position filter
    if (selectedPosition !== "all") {
      filtered = filtered.filter((cert) => cert.position === selectedPosition)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((cert) => cert.category === selectedCategory)
    }

    return filtered
  }, [certifications, searchQuery, selectedEmployee, selectedStatus, selectedPosition, selectedCategory])

  // Get unique values for filters
  const employees = useMemo(() => {
    const unique = Array.from(new Set(certifications.map((cert) => cert.employeeName)))
    return unique.sort()
  }, [certifications])

  const positions = useMemo(() => {
    const unique = Array.from(new Set(certifications.map((cert) => cert.position)))
    return unique.sort()
  }, [certifications])

  const categories = useMemo(() => {
    const unique = Array.from(new Set(certifications.map((cert) => cert.category)))
    return unique.sort()
  }, [certifications])

  // Convert certifications to grid rows
  const gridRows: GridRow[] = useMemo(() => {
    return filteredCertifications.map((cert) => ({
      id: cert.id,
      employeeId: cert.employeeId,
      employeeName: cert.employeeName,
      position: cert.position,
      department: cert.department,
      certificationName: cert.certificationName,
      certificationCode: cert.certificationCode,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expirationDate: cert.expirationDate,
      renewalStatus: cert.renewalStatus,
      proofUploaded: cert.proofUploaded,
      documentUrl: cert.documentUrl,
      reminderSent: cert.reminderSent,
      notes: cert.notes,
      category: cert.category,
      priority: cert.priority,
      autoRenewal: cert.autoRenewal,
      cost: cert.cost,
      vendorContact: cert.vendorContact,
      lastUpdated: cert.lastUpdated,
      // Calculated fields
      daysUntilExpiration: getDaysUntilExpiration(cert.expirationDate),
      formattedIssueDate: formatDate(cert.issueDate),
      formattedExpirationDate: formatDate(cert.expirationDate),
      formattedCost: formatCurrency(cert.cost),
    }))
  }, [filteredCertifications])

  // Column definitions for the protected grid
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      // Fixed/Sticky columns (first 6)
      createReadOnlyColumn("employeeName", "Employee", {
        minWidth: 150,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      }),

      createReadOnlyColumn("position", "Position", {
        minWidth: 120,
        cellRenderer: (params: any) => (
          <Badge variant="outline" className="text-xs">
            {params.value}
          </Badge>
        ),
      }),

      createReadOnlyColumn("certificationName", "Certification", {
        minWidth: 200,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-green-500" />
            <span className="font-medium">{params.value}</span>
          </div>
        ),
      }),

      createReadOnlyColumn("renewalStatus", "Status", {
        minWidth: 120,
        cellRenderer: (params: any) => {
          const status = params.value as string
          const daysLeft = params.data.daysUntilExpiration

          return (
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(status)} className="text-xs">
                {status === "Valid" && <CheckCircle className="h-3 w-3 mr-1" />}
                {status === "Expiring Soon" && <Clock className="h-3 w-3 mr-1" />}
                {status === "Expired" && <XCircle className="h-3 w-3 mr-1" />}
                {status}
              </Badge>
              {status === "Expiring Soon" && daysLeft > 0 && (
                <span className="text-xs text-amber-600">{daysLeft} days</span>
              )}
            </div>
          )
        },
      }),

      createProtectedColumn(
        "formattedExpirationDate",
        "Expires",
        {
          level: editMode ? "none" : "read-only",
        },
        {
          minWidth: 120,
          cellRenderer: (params: any) => {
            const daysLeft = params.data.daysUntilExpiration
            const isExpiring = daysLeft <= 30 && daysLeft > 0
            const isExpired = daysLeft <= 0

            return (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span
                  className={`
              ${isExpired ? "text-red-600 font-medium" : ""}
              ${isExpiring ? "text-amber-600 font-medium" : ""}
            `}
                >
                  {params.value}
                </span>
              </div>
            )
          },
        }
      ),

      createReadOnlyColumn("proofUploaded", "Proof", {
        minWidth: 100,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            {params.value ? (
              <Badge variant="default" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Uploaded
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Missing
              </Badge>
            )}
          </div>
        ),
      }),

      // Scrollable columns
      createReadOnlyColumn("certificationCode", "Code", {
        minWidth: 100,
      }),

      createReadOnlyColumn("category", "Category", {
        minWidth: 120,
        cellRenderer: (params: any) => (
          <Badge variant="secondary" className="text-xs">
            {params.value}
          </Badge>
        ),
      }),

      createReadOnlyColumn("priority", "Priority", {
        minWidth: 100,
        cellRenderer: (params: any) => (
          <Badge variant={getPriorityColor(params.value)} className="text-xs">
            {params.value}
          </Badge>
        ),
      }),

      createReadOnlyColumn("issuer", "Issuer", {
        minWidth: 180,
      }),

      createProtectedColumn(
        "formattedIssueDate",
        "Issue Date",
        {
          level: editMode ? "none" : "read-only",
        },
        {
          minWidth: 120,
        }
      ),

      createReadOnlyColumn("formattedCost", "Cost", {
        minWidth: 100,
        cellRenderer: (params: any) => <span className="font-mono text-sm">{params.value}</span>,
      }),

      createReadOnlyColumn("autoRenewal", "Auto Renew", {
        minWidth: 100,
        cellRenderer: (params: any) => (
          <Badge variant={params.value ? "default" : "outline"} className="text-xs">
            {params.value ? "Yes" : "No"}
          </Badge>
        ),
      }),

      createReadOnlyColumn("reminderSent", "Reminder", {
        minWidth: 100,
        cellRenderer: (params: any) => (
          <Badge variant={params.value ? "secondary" : "outline"} className="text-xs">
            {params.value ? "Sent" : "Pending"}
          </Badge>
        ),
      }),

      createReadOnlyColumn("vendorContact", "Vendor Contact", {
        minWidth: 180,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{params.value}</span>
          </div>
        ),
      }),

      createReadOnlyColumn("notes", "Notes", {
        minWidth: 200,
        cellRenderer: (params: any) => (
          <div className="text-sm text-gray-600 truncate" title={params.value}>
            {params.value}
          </div>
        ),
      }),
    ],
    [editMode]
  )

  // Grid configuration
  const gridConfig: GridConfig = useMemo(
    () =>
      createGridWithTotalsAndSticky(6, false, {
        allowCellEditing: editMode,
        protectionEnabled: true,
        userRole,
        theme: "quartz",
        allowExport: true,
        allowRowSelection: true,
        allowColumnResizing: true,
        allowSorting: true,
        allowFiltering: true,
        showToolbar: true,
        showStatusBar: true,
      }),
    [editMode, userRole]
  )

  // Grid event handlers
  const gridEvents: GridEvents = {
    onCellValueChanged: (event) => {
      const updatedCert = { ...event.data }

      // Update the certification in state
      setCertifications((prev) => prev.map((cert) => (cert.id === updatedCert.id ? { ...cert, ...updatedCert } : cert)))

      // Call callback if provided
      onCertificationUpdate?.(updatedCert)

      toast({
        title: "Certification Updated",
        description: `${updatedCert.employeeName}'s ${updatedCert.certificationName} has been updated.`,
        variant: "default",
      })
    },

    onProtectionViolation: (message) => {
      toast({
        title: "Edit Restricted",
        description: message,
        variant: "destructive",
      })
    },
  }

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true)
    // Simulate refresh
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Data Refreshed",
        description: "Certification data has been refreshed.",
        variant: "default",
      })
    }, 1000)
  }

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Certification data is being exported to CSV.",
      variant: "default",
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSelectedEmployee("all")
    setSelectedStatus("all")
    setSelectedPosition("all")
    setSelectedCategory("all")
    setSearchQuery("")
  }

  // Get summary statistics
  const stats = useMemo(() => {
    const total = certifications.length
    const valid = certifications.filter((cert) => cert.renewalStatus === "Valid").length
    const expiring = certifications.filter((cert) => cert.renewalStatus === "Expiring Soon").length
    const expired = certifications.filter((cert) => cert.renewalStatus === "Expired").length
    const missingProof = certifications.filter((cert) => !cert.proofUploaded).length

    return { total, valid, expiring, expired, missingProof }
  }, [certifications])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employee Safety Certifications</h2>
          <p className="text-muted-foreground">
            Track and manage employee safety certifications, renewals, and compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
            <Edit className="h-4 w-4 mr-2" />
            {editMode ? "View Mode" : "Edit Mode"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="default" size="sm" onClick={() => setShowAddCertification(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Certifications</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Valid</p>
                <p className="text-2xl font-bold text-green-600">{stats.valid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Missing Proof</p>
                <p className="text-2xl font-bold text-orange-600">{stats.missingProof}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp} value={emp}>
                      {emp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Valid">Valid</SelectItem>
                  <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certification Grid */}
      <Card>
        <CardContent className="p-0">
          <ProtectedGrid
            columnDefs={columnDefs}
            rowData={gridRows}
            config={gridConfig}
            events={gridEvents}
            loading={loading}
            title="Employee Safety Certifications"
            height="600px"
            enableSearch={false} // Using custom search above
          />
        </CardContent>
      </Card>

      {/* Add Certification Modal */}
      <Dialog open={showAddCertification} onOpenChange={setShowAddCertification}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Certification</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-muted-foreground">Add new certification form would go here...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CertificationTracker
