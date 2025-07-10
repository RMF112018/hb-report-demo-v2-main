"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Plus,
  Eye,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Building2,
  Timer,
  TrendingUp,
  Settings,
  Filter,
  Search,
  Download,
  Share2,
  Edit3,
  Calendar,
  User,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react"

// Import existing report components
import { ReportCreator } from "@/components/reports/ReportCreator"
import { ReportViewer } from "@/components/reports/ReportViewer"

interface Report {
  id: string
  name: string
  type: "financial-review" | "monthly-progress" | "monthly-owner"
  projectId: string
  projectName: string
  status: "draft" | "submitted" | "approved" | "rejected" | "published"
  creatorId: string
  creatorName: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  distributedAt?: string
  sectionCount: number
  pageCount: number
  size: string
  version: number
  tags: string[]
  priority: "low" | "medium" | "high"
}

interface ProjectReportsProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function ProjectReports({
  projectId,
  projectData,
  userRole,
  user,
  activeTab = "overview",
  onTabChange,
}: ProjectReportsProps) {
  const { toast } = useToast()

  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "type" | "status" | "createdAt" | "dueDate" | "updatedAt">("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showReportCreator, setShowReportCreator] = useState(false)
  const [showReportViewer, setShowReportViewer] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Mock data - in production this would come from API
  const mockReports: Report[] = [
    {
      id: "rpt-001",
      name: "Monthly Financial Review - December 2024",
      type: "financial-review",
      projectId: projectId,
      projectName: projectData?.name || "Current Project",
      status: "approved",
      creatorId: "user-001",
      creatorName: "John Smith",
      createdAt: "2024-12-01T08:00:00Z",
      updatedAt: "2024-12-03T14:30:00Z",
      dueDate: "2024-12-05T17:00:00Z",
      approvedBy: "Jane Doe",
      approvedAt: "2024-12-03T14:30:00Z",
      sectionCount: 4,
      pageCount: 12,
      size: "2.4 MB",
      version: 1,
      tags: ["financial", "monthly"],
      priority: "high",
    },
    {
      id: "rpt-002",
      name: "Monthly Progress Report - November 2024",
      type: "monthly-progress",
      projectId: projectId,
      projectName: projectData?.name || "Current Project",
      status: "submitted",
      creatorId: "user-001",
      creatorName: "John Smith",
      createdAt: "2024-11-28T10:15:00Z",
      updatedAt: "2024-11-28T10:15:00Z",
      dueDate: "2024-12-01T17:00:00Z",
      sectionCount: 6,
      pageCount: 18,
      size: "3.2 MB",
      version: 1,
      tags: ["progress", "monthly"],
      priority: "medium",
    },
    {
      id: "rpt-003",
      name: "Owner Report - Q4 2024",
      type: "monthly-owner",
      projectId: projectId,
      projectName: projectData?.name || "Current Project",
      status: "draft",
      creatorId: "user-001",
      creatorName: "John Smith",
      createdAt: "2024-11-25T09:00:00Z",
      updatedAt: "2024-11-26T16:45:00Z",
      dueDate: "2024-12-10T17:00:00Z",
      sectionCount: 3,
      pageCount: 8,
      size: "1.8 MB",
      version: 1,
      tags: ["owner", "quarterly"],
      priority: "high",
    },
    {
      id: "rpt-004",
      name: "Monthly Progress Report - October 2024",
      type: "monthly-progress",
      projectId: projectId,
      projectName: projectData?.name || "Current Project",
      status: "published",
      creatorId: "user-001",
      creatorName: "John Smith",
      createdAt: "2024-10-28T10:15:00Z",
      updatedAt: "2024-10-30T15:20:00Z",
      dueDate: "2024-11-01T17:00:00Z",
      distributedAt: "2024-10-30T15:20:00Z",
      sectionCount: 6,
      pageCount: 16,
      size: "2.8 MB",
      version: 1,
      tags: ["progress", "monthly"],
      priority: "medium",
    },
    {
      id: "rpt-005",
      name: "Monthly Financial Review - November 2024",
      type: "financial-review",
      projectId: projectId,
      projectName: projectData?.name || "Current Project",
      status: "rejected",
      creatorId: "user-001",
      creatorName: "John Smith",
      createdAt: "2024-11-01T08:00:00Z",
      updatedAt: "2024-11-02T11:30:00Z",
      dueDate: "2024-11-05T17:00:00Z",
      rejectedBy: "Jane Doe",
      rejectedAt: "2024-11-02T11:30:00Z",
      rejectionReason: "Missing budget variance analysis section",
      sectionCount: 3,
      pageCount: 9,
      size: "1.9 MB",
      version: 1,
      tags: ["financial", "monthly"],
      priority: "high",
    },
  ]

  // Load reports data
  useEffect(() => {
    loadReports()
  }, [projectId, userRole])

  const loadReports = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Filter reports based on user role
      let filteredReports = mockReports
      if (userRole === "project-manager") {
        filteredReports = mockReports.filter((r) => r.creatorId === user?.id)
      }

      setReports(filteredReports)
      setFilteredReports(filteredReports)
    } catch (error) {
      console.error("Failed to load reports:", error)
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    let filtered = reports

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === "createdAt" || sortBy === "updatedAt" || sortBy === "dueDate") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      } else {
        aValue = aValue || ""
        bValue = bValue || ""
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredReports(filtered)
  }, [reports, statusFilter, searchTerm, sortBy, sortOrder])

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: reports.length,
      draft: reports.filter((r) => r.status === "draft").length,
      submitted: reports.filter((r) => r.status === "submitted").length,
      approved: reports.filter((r) => r.status === "approved" || r.status === "published").length,
      rejected: reports.filter((r) => r.status === "rejected").length,
      needsAction: reports.filter((r) => {
        if (userRole === "project-executive" && r.status === "submitted") return true
        if (userRole === "executive" && r.status === "submitted") return true
        return false
      }).length,
    }
  }, [reports, userRole])

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "submitted":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>
      case "published":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Published</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: Report["type"]) => {
    switch (type) {
      case "financial-review":
        return <DollarSign className="h-4 w-4" />
      case "monthly-progress":
        return <BarChart3 className="h-4 w-4" />
      case "monthly-owner":
        return <Building2 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: Report["type"]) => {
    switch (type) {
      case "financial-review":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Financial
          </Badge>
        )
      case "monthly-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Progress
          </Badge>
        )
      case "monthly-owner":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Owner
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getPriorityBadge = (priority: Report["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return time.toLocaleDateString()
  }

  const isOverdue = (report: Report) => {
    if (!report.dueDate || report.status === "approved" || report.status === "published") return false
    return new Date(report.dueDate) < new Date()
  }

  const handleCreateReport = (templateId?: string) => {
    setSelectedTemplate(templateId || "")
    setSelectedReport(null)
    setShowReportCreator(true)
  }

  const handleEditReport = (report: Report) => {
    setSelectedReport(report)
    setSelectedTemplate("")
    setShowReportCreator(true)
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setShowReportViewer(true)
  }

  const handleCloseReportCreator = () => {
    setShowReportCreator(false)
    setSelectedTemplate("")
    setSelectedReport(null)
  }

  const handleCloseReportViewer = () => {
    setShowReportViewer(false)
    setSelectedReport(null)
  }

  const handleReportSave = (report: any) => {
    // Handle report save
    loadReports()
    setShowReportCreator(false)
    toast({
      title: "Report Saved",
      description: "Report has been saved successfully",
    })
  }

  const canApprove = (report: Report) => {
    if (userRole === "project-executive" && report.status === "submitted") return true
    if (userRole === "executive" && report.status === "submitted") return true
    return false
  }

  const canEdit = (report: Report) => {
    if (userRole === "project-manager" && report.creatorId === user?.id) return true
    if (userRole === "project-executive" && report.status === "draft") return true
    return false
  }

  const getFilterOptions = () => {
    const baseOptions = [{ value: "all", label: "All Status" }]

    if (userRole === "project-manager") {
      return [
        ...baseOptions,
        { value: "draft", label: "Draft" },
        { value: "submitted", label: "Submitted" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "published", label: "Published" },
      ]
    } else if (userRole === "project-executive") {
      return [
        ...baseOptions,
        { value: "submitted", label: "Awaiting Review" },
        { value: "approved", label: "Approved by Me" },
        { value: "rejected", label: "Rejected by Me" },
        { value: "published", label: "Published" },
      ]
    } else {
      return [
        ...baseOptions,
        { value: "submitted", label: "Awaiting Review" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "published", label: "Published" },
      ]
    }
  }

  const getTitle = () => {
    switch (userRole) {
      case "executive":
        return "Executive Report Review"
      case "project-executive":
        return "Project Report Management"
      case "project-manager":
        return "Project Reports"
      default:
        return "Report Management"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project reports...</p>
        </div>
      </div>
    )
  }

  // Show report creator
  if (showReportCreator) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <ReportCreator
          reportId={selectedReport?.id}
          templateId={selectedTemplate}
          onSave={handleReportSave}
          onCancel={handleCloseReportCreator}
        />
      </div>
    )
  }

  // Show report viewer
  if (showReportViewer) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <ReportViewer report={selectedReport} onClose={handleCloseReportViewer} userRole={userRole} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {getTitle()}
          </CardTitle>
          <Button size="sm" onClick={() => handleCreateReport()}>
            <Plus className="h-4 w-4 mr-1" />
            Create Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.submitted}</div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Pending Review</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
            <div className="text-xs text-green-600 dark:text-green-400">Approved</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="text-xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
            <div className="text-xs text-red-600 dark:text-red-400">Rejected</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.needsAction}</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">Needs Action</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getFilterOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Updated</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{report.name}</span>
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                    {isOverdue(report) && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Overdue
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    {canEdit(report) && (
                      <Button variant="ghost" size="sm" onClick={() => handleEditReport(report)}>
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    )}
                    {canApprove(report) && (
                      <>
                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                          <CheckCircle2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {getTypeIcon(report.type)}
                    {getTypeBadge(report.type)}
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">Created by {report.creatorName}</span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimeAgo(report.updatedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {report.pageCount} pages
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {report.size}
                  </span>
                  {report.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Due {new Date(report.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">No reports found</div>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => handleCreateReport()}>
                Create First Report
              </Button>
            </div>
          )}
        </div>

        {filteredReports.length > 10 && (
          <div className="mt-3 text-center">
            <Button variant="outline" size="sm">
              Load More ({filteredReports.length - 10} remaining)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
