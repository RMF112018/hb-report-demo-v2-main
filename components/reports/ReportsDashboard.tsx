"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Plus,
  BarChart3,
  Download,
  Eye,
  Target,
  Brain,
  Zap,
  Send,
  History,
  DollarSign,
  Building,
  Timer,
  RefreshCw,
  XCircle,
  Activity,
} from "lucide-react"

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
}

interface ReportsDashboardProps {
  projectId?: string
  projectData?: any
  userRole: string
  user: any
  onTabChange?: (tabId: string) => void
  renderMode?: "leftContent" | "rightContent"
}

interface DashboardStats {
  totalReports: number
  pendingApproval: number
  approved: number
  rejected: number
  thisMonth: number
  approvalRate: number
  avgProcessingTime: number
  timeSaved: number
  overdue: number
}

export function ReportsDashboard({
  projectId,
  projectData,
  userRole,
  user,
  onTabChange,
  renderMode = "rightContent",
}: ReportsDashboardProps) {
  const { toast } = useToast()

  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Mock data - in production this would come from API
  const mockReports: Report[] = [
    {
      id: "rpt-001",
      name: "Monthly Financial Review - December 2024",
      type: "financial-review",
      projectId: projectId || "project-001",
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
    },
    {
      id: "rpt-002",
      name: "Monthly Progress Report - November 2024",
      type: "monthly-progress",
      projectId: projectId || "project-001",
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
    },
    {
      id: "rpt-003",
      name: "Owner Report - Q4 2024",
      type: "monthly-owner",
      projectId: projectId || "project-001",
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

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadReports()
    setRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Reports data has been updated",
    })
  }

  // Calculate dashboard statistics
  const stats = useMemo((): DashboardStats => {
    const total = reports.length
    const pending = reports.filter((r) => r.status === "submitted").length
    const approved = reports.filter((r) => r.status === "approved" || r.status === "published").length
    const rejected = reports.filter((r) => r.status === "rejected").length

    const thisMonth = reports.filter((r) => {
      const reportDate = new Date(r.createdAt)
      const now = new Date()
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
    }).length

    const processedReports = approved + rejected
    const approvalRate = processedReports > 0 ? Math.round((approved / processedReports) * 100) : 0

    const overdue = reports.filter((r) => {
      if (!r.dueDate || r.status === "approved" || r.status === "published") return false
      return new Date(r.dueDate) < new Date()
    }).length

    return {
      totalReports: total,
      pendingApproval: pending,
      approved,
      rejected,
      thisMonth,
      approvalRate,
      avgProcessingTime: 2.5,
      timeSaved: total * 4,
      overdue,
    }
  }, [reports])

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
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
        return <Building className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
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

  const recentActivity = [
    {
      id: "activity-1",
      title: "Monthly Progress Report Created",
      description: "December progress report created and submitted for approval",
      icon: FileText,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "created",
    },
    {
      id: "activity-2",
      title: "Financial Review Approved",
      description: "November financial review report approved by executive team",
      icon: CheckCircle,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: "approved",
    },
    {
      id: "activity-3",
      title: "Owner Report Distributed",
      description: "Monthly owner report sent to client and stakeholders",
      icon: Send,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      type: "distributed",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports dashboard...</p>
        </div>
      </div>
    )
  }

  // Render different content based on renderMode
  if (renderMode === "leftContent") {
    return (
      <div className="space-y-4">
        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => onTabChange?.("project-reports")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{report.name}</div>
                    <div className="text-xs text-muted-foreground">{formatTimeAgo(report.updatedAt)}</div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Reports</span>
              <span className="font-semibold">{stats.totalReports}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="font-semibold text-yellow-600">{stats.pendingApproval}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Approved</span>
              <span className="font-semibold text-green-600">{stats.approved}</span>
            </div>
            {stats.overdue > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <span className="font-semibold text-red-600">{stats.overdue}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main content (rightContent)
  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports Dashboard</h2>
          <p className="text-muted-foreground">Overview of project reporting activities and metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => onTabChange?.("project-reports")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">+{stats.thisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingApproval}</div>
            <p className="text-xs text-muted-foreground">Avg {stats.avgProcessingTime} days to process</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.timeSaved}h</div>
            <p className="text-xs text-muted-foreground">Through automation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{report.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(report.updatedAt)} • {report.pageCount} pages
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(report.status)}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-muted-foreground">{activity.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(activity.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Report Completion Rate</span>
                <span className="font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-muted-foreground">Reports completed on time this month</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Quality Score</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <p className="text-xs text-muted-foreground">Average report quality rating</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Stakeholder Satisfaction</span>
                <span className="font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-muted-foreground">Client satisfaction with reports</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
