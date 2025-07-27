"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Search,
  Filter,
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
  Settings,
  Eye,
  Clock,
  UserCheck,
  UserX,
  Building2,
  MapPin,
  Bell,
  FileCheck,
  FileX,
  CalendarDays,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"
import { format, addDays, isAfter, isBefore, parseISO, differenceInDays } from "date-fns"

interface ComplianceDocument {
  id: string
  name: string
  type:
    | "I-9"
    | "W-4"
    | "OSHA"
    | "EEO"
    | "Safety Training"
    | "Background Check"
    | "Drug Test"
    | "License"
    | "Certification"
    | "Other"
  category: "employment" | "safety" | "tax" | "benefits" | "training" | "licensing"
  status: "valid" | "expired" | "pending" | "missing" | "expiring_soon"
  employeeId: string
  employeeName: string
  department: string
  location: string
  issueDate: string
  expirationDate: string
  uploadedBy: string
  uploadedDate: string
  fileUrl?: string
  notes?: string
  priority: "high" | "medium" | "low"
}

interface ComplianceAlert {
  id: string
  type: "expiration" | "missing" | "overdue" | "compliance"
  title: string
  message: string
  employeeId: string
  employeeName: string
  documentType: string
  dueDate: string
  priority: "high" | "medium" | "low"
  isRead: boolean
  createdAt: string
}

interface ComplianceSummary {
  location: string
  department: string
  totalEmployees: number
  compliantEmployees: number
  nonCompliantEmployees: number
  expiringDocuments: number
  missingDocuments: number
  complianceRate: number
}

const CompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"documents" | "alerts" | "reports" | "upload">("documents")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<ComplianceDocument | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("expirationDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Mock data for compliance documents
  const complianceDocuments: ComplianceDocument[] = [
    {
      id: "1",
      name: "I-9 Employment Eligibility Verification",
      type: "I-9",
      category: "employment",
      status: "valid",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      department: "Project Management",
      location: "Downtown Office",
      issueDate: "2024-01-15",
      expirationDate: "2025-01-15",
      uploadedBy: "HR Manager",
      uploadedDate: "2024-01-15",
      fileUrl: "/documents/i9-sarah-johnson.pdf",
      notes: "Complete I-9 form with supporting documents",
      priority: "high",
    },
    {
      id: "2",
      name: "W-4 Tax Withholding Certificate",
      type: "W-4",
      category: "tax",
      status: "valid",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      department: "Project Management",
      location: "Downtown Office",
      issueDate: "2024-01-15",
      expirationDate: "2025-01-15",
      uploadedBy: "HR Manager",
      uploadedDate: "2024-01-15",
      fileUrl: "/documents/w4-sarah-johnson.pdf",
      notes: "Updated W-4 for 2024 tax year",
      priority: "high",
    },
    {
      id: "3",
      name: "OSHA Safety Training Certificate",
      type: "OSHA",
      category: "safety",
      status: "expiring_soon",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      department: "Field Operations",
      location: "Construction Site A",
      issueDate: "2023-06-15",
      expirationDate: "2024-12-20",
      uploadedBy: "Safety Manager",
      uploadedDate: "2023-06-15",
      fileUrl: "/documents/osha-michael-chen.pdf",
      notes: "OSHA 30-hour construction safety training",
      priority: "high",
    },
    {
      id: "4",
      name: "EEO-1 Report",
      type: "EEO",
      category: "employment",
      status: "expired",
      employeeId: "EMP003",
      employeeName: "Emily Davis",
      department: "Human Resources",
      location: "Downtown Office",
      issueDate: "2023-01-01",
      expirationDate: "2024-01-01",
      uploadedBy: "HR Director",
      uploadedDate: "2023-01-01",
      fileUrl: "/documents/eeo1-2023.pdf",
      notes: "Annual EEO-1 report submission",
      priority: "medium",
    },
    {
      id: "5",
      name: "Background Check Report",
      type: "Background Check",
      category: "employment",
      status: "missing",
      employeeId: "EMP004",
      employeeName: "James Thompson",
      department: "Field Operations",
      location: "Construction Site B",
      issueDate: "",
      expirationDate: "2024-12-31",
      uploadedBy: "",
      uploadedDate: "",
      notes: "Background check required for site access",
      priority: "high",
    },
    {
      id: "6",
      name: "Commercial Driver License",
      type: "License",
      category: "licensing",
      status: "valid",
      employeeId: "EMP005",
      employeeName: "Robert Wilson",
      department: "Logistics",
      location: "Warehouse",
      issueDate: "2023-03-15",
      expirationDate: "2026-03-15",
      uploadedBy: "Logistics Manager",
      uploadedDate: "2023-03-15",
      fileUrl: "/documents/cdl-robert-wilson.pdf",
      notes: "CDL Class A with hazmat endorsement",
      priority: "high",
    },
  ]

  // Mock data for compliance alerts
  const complianceAlerts: ComplianceAlert[] = [
    {
      id: "1",
      type: "expiration",
      title: "OSHA Certificate Expiring Soon",
      message: "Michael Chen's OSHA safety training certificate expires in 5 days",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      documentType: "OSHA",
      dueDate: "2024-12-20",
      priority: "high",
      isRead: false,
      createdAt: "2024-12-15",
    },
    {
      id: "2",
      type: "missing",
      title: "Background Check Missing",
      message: "James Thompson's background check is required for site access",
      employeeId: "EMP004",
      employeeName: "James Thompson",
      documentType: "Background Check",
      dueDate: "2024-12-31",
      priority: "high",
      isRead: false,
      createdAt: "2024-12-14",
    },
    {
      id: "3",
      type: "expiration",
      title: "EEO-1 Report Expired",
      message: "Emily Davis's EEO-1 report has expired and needs renewal",
      employeeId: "EMP003",
      employeeName: "Emily Davis",
      documentType: "EEO",
      dueDate: "2024-01-01",
      priority: "medium",
      isRead: true,
      createdAt: "2024-12-10",
    },
  ]

  // Mock data for compliance summary
  const complianceSummary: ComplianceSummary[] = [
    {
      location: "Downtown Office",
      department: "Project Management",
      totalEmployees: 45,
      compliantEmployees: 42,
      nonCompliantEmployees: 3,
      expiringDocuments: 2,
      missingDocuments: 1,
      complianceRate: 93.3,
    },
    {
      location: "Construction Site A",
      department: "Field Operations",
      totalEmployees: 28,
      compliantEmployees: 25,
      nonCompliantEmployees: 3,
      expiringDocuments: 1,
      missingDocuments: 2,
      complianceRate: 89.3,
    },
    {
      location: "Construction Site B",
      department: "Field Operations",
      totalEmployees: 32,
      compliantEmployees: 30,
      nonCompliantEmployees: 2,
      expiringDocuments: 0,
      missingDocuments: 2,
      complianceRate: 93.8,
    },
    {
      location: "Warehouse",
      department: "Logistics",
      totalEmployees: 15,
      compliantEmployees: 15,
      nonCompliantEmployees: 0,
      expiringDocuments: 0,
      missingDocuments: 0,
      complianceRate: 100.0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "expiring_soon":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "missing":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4" />
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "expiring_soon":
        return <AlertTriangle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "missing":
        return <FileX className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "expiration":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "missing":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "compliance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "expiration":
        return <Clock className="h-4 w-4" />
      case "missing":
        return <FileX className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "compliance":
        return <Shield className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = complianceDocuments

    if (searchTerm) {
      filtered = filtered.filter(
        (doc) =>
          doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((doc) => doc.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((doc) => doc.type === typeFilter)
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((doc) => doc.location === locationFilter)
    }

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ComplianceDocument]
      let bValue: any = b[sortBy as keyof ComplianceDocument]

      if (sortBy === "expirationDate") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [complianceDocuments, searchTerm, statusFilter, typeFilter, locationFilter, sortBy, sortOrder])

  // Calculate stats
  const stats = useMemo(() => {
    const total = complianceDocuments.length
    const valid = complianceDocuments.filter((doc) => doc.status === "valid").length
    const expired = complianceDocuments.filter((doc) => doc.status === "expired").length
    const expiringSoon = complianceDocuments.filter((doc) => doc.status === "expiring_soon").length
    const missing = complianceDocuments.filter((doc) => doc.status === "missing").length
    const unreadAlerts = complianceAlerts.filter((alert) => !alert.isRead).length

    return {
      total,
      valid,
      expired,
      expiringSoon,
      missing,
      unreadAlerts,
      complianceRate: total > 0 ? Math.round((valid / total) * 100) : 0,
    }
  }, [complianceDocuments, complianceAlerts])

  // Grid column definitions for compliance documents
  const complianceDocumentColumns: ProtectedColDef[] = [
    {
      field: "employeeName",
      headerName: "Employee",
      width: 150,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{value}</span>
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "name",
      headerName: "Document",
      width: 200,
      cellRenderer: ({ value, data }: { value: string; data: ComplianceDocument }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3 text-muted-foreground" />
          <span className="font-medium">{value}</span>
          <Badge variant="outline" className="text-xs">
            {data.type}
          </Badge>
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
      protection: { level: "read-only" },
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "expirationDate",
      headerName: "Expiration Date",
      width: 140,
      cellRenderer: ({ value, data }: { value: string; data: ComplianceDocument }) => {
        if (!value) return <span className="text-muted-foreground">No expiration</span>

        const expirationDate = new Date(value)
        const today = new Date()
        const daysUntilExpiration = differenceInDays(expirationDate, today)

        let className = "text-foreground"
        if (daysUntilExpiration < 0) {
          className = "text-red-600 dark:text-red-400"
        } else if (daysUntilExpiration <= 30) {
          className = "text-yellow-600 dark:text-yellow-400"
        }

        return (
          <div className={className}>
            {format(expirationDate, "MMM d, yyyy")}
            {daysUntilExpiration >= 0 && (
              <div className="text-xs text-muted-foreground">
                {daysUntilExpiration === 0 ? "Today" : `${daysUntilExpiration} days`}
              </div>
            )}
          </div>
        )
      },
      protection: { level: "read-only" },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => (
        <Badge className={getStatusColor(value)}>
          {getStatusIcon(value)}
          <span className="ml-1 capitalize">{value.replace("_", " ")}</span>
        </Badge>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getPriorityColor(value)}`} />
          <span className="capitalize">{value}</span>
        </div>
      ),
      protection: { level: "read-only" },
    },
  ]

  const handleUploadDocument = () => {
    setShowUploadModal(true)
  }

  const handleViewDocument = (document: ComplianceDocument) => {
    setSelectedDocument(document)
    setShowDocumentModal(true)
  }

  const handleExportComplianceReport = () => {
    // Implementation for exporting compliance report
    console.log("Exporting compliance report...")
  }

  const handleMarkAlertRead = (alertId: string) => {
    // Implementation for marking alert as read
    console.log("Marking alert as read:", alertId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Manage compliance documents, track expiration dates, and monitor regulatory requirements
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button onClick={handleUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">Active documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complianceRate}%</div>
            <p className="text-xs text-green-600 dark:text-green-400">Valid documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoon}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadAlerts}</div>
            <p className="text-xs text-red-600 dark:text-red-400">Unread alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Documents</CardTitle>
                  <CardDescription>Track employee compliance documents and expiration dates</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="valid">Valid</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="I-9">I-9</SelectItem>
                      <SelectItem value="W-4">W-4</SelectItem>
                      <SelectItem value="OSHA">OSHA</SelectItem>
                      <SelectItem value="EEO">EEO</SelectItem>
                      <SelectItem value="Background Check">Background Check</SelectItem>
                      <SelectItem value="License">License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={complianceDocumentColumns}
                rowData={filteredDocuments}
                config={createGridWithTotalsAndSticky(2, true, {
                  allowExport: true,
                  allowRowSelection: true,
                  allowColumnResizing: true,
                  allowSorting: true,
                  allowFiltering: true,
                  allowCellEditing: false,
                  showToolbar: true,
                  showStatusBar: true,
                  protectionEnabled: true,
                  userRole: "manager",
                  theme: "quartz",
                  enableTotalsRow: true,
                  stickyColumnsCount: 2,
                })}
                height="500px"
                title="Compliance Documents"
                enableSearch={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
              <CardDescription>Monitor expiration dates and missing documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      alert.isRead ? "bg-muted/30" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getAlertTypeColor(
                          alert.type
                        )}`}
                      >
                        {getAlertTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-foreground">{alert.title}</h3>
                          {!alert.isRead && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-muted-foreground">{alert.employeeName}</span>
                          <span className="text-xs text-muted-foreground">{alert.documentType}</span>
                          <span className="text-xs text-muted-foreground">
                            Due: {format(new Date(alert.dueDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleMarkAlertRead(alert.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Summary Reports</CardTitle>
                  <CardDescription>Export compliance summaries by team and location</CardDescription>
                </div>
                <Button onClick={handleExportComplianceReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {complianceSummary.map((summary) => (
                  <Card key={`${summary.location}-${summary.department}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{summary.location}</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <CardDescription className="text-xs">{summary.department}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Employees:</span>
                          <span className="font-medium">{summary.totalEmployees}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Compliant:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {summary.compliantEmployees}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Non-Compliant:</span>
                          <span className="font-medium text-red-600 dark:text-red-400">
                            {summary.nonCompliantEmployees}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Compliance Rate:</span>
                          <span className="font-medium">{summary.complianceRate}%</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Expiring: {summary.expiringDocuments}</span>
                            <span>Missing: {summary.missingDocuments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Compliance Document</CardTitle>
              <CardDescription>Upload and attach compliance documents to employee records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp001">Sarah Johnson</SelectItem>
                        <SelectItem value="emp002">Michael Chen</SelectItem>
                        <SelectItem value="emp003">Emily Davis</SelectItem>
                        <SelectItem value="emp004">James Thompson</SelectItem>
                        <SelectItem value="emp005">Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="i9">I-9 Employment Eligibility</SelectItem>
                        <SelectItem value="w4">W-4 Tax Withholding</SelectItem>
                        <SelectItem value="osha">OSHA Safety Training</SelectItem>
                        <SelectItem value="eeo">EEO-1 Report</SelectItem>
                        <SelectItem value="background">Background Check</SelectItem>
                        <SelectItem value="license">License/Certification</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input type="date" id="issueDate" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirationDate">Expiration Date</Label>
                    <Input type="date" id="expirationDate" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload Document</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea placeholder="Add any additional notes about this document..." />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Upload Document</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document View Modal */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Employee</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.employeeName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Document Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedDocument.status)}>
                    {getStatusIcon(selectedDocument.status)}
                    <span className="ml-1 capitalize">{selectedDocument.status.replace("_", " ")}</span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedDocument.priority)}`} />
                    <span className="text-sm capitalize">{selectedDocument.priority}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Issue Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.issueDate
                      ? format(new Date(selectedDocument.issueDate), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expiration Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.expirationDate
                      ? format(new Date(selectedDocument.expirationDate), "MMM d, yyyy")
                      : "No expiration"}
                  </p>
                </div>
              </div>
              {selectedDocument.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.notes}</p>
                </div>
              )}
              {selectedDocument.fileUrl && (
                <div>
                  <Label className="text-sm font-medium">Document</Label>
                  <Button variant="outline" className="mt-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Compliance Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload compliance documents and attach them to employee records. Supported formats: PDF, JPG, PNG, DOC,
              DOCX
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Ensure all documents are properly signed and dated before uploading.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadModal(false)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}

export default CompliancePage
