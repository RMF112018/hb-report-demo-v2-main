import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Eye, Calendar, Search, Filter, TrendingUp, BarChart3 } from "lucide-react"

export interface Report {
  id: string
  name: string
  type: string
  projectId: string
  projectName: string
  createdBy: string
  approverId: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  approvedAt?: string
  version: string
  fileSize: string
  downloadCount: number
}

interface ReportHistoryProps {
  projectId?: string
  reports: Report[]
  timeRange?: "7d" | "30d" | "90d" | "1y" | "all"
  reportTypeFilter?: string
  searchQuery?: string
  showAnalytics?: boolean
  showTrends?: boolean
}

export function ReportHistory({
  projectId,
  reports,
  timeRange = "30d",
  reportTypeFilter,
  searchQuery,
  showAnalytics = false,
  showTrends = false,
}: ReportHistoryProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const filteredReports = useMemo(() => {
    let filtered = reports

    // Filter by time range
    if (timeRange !== "all") {
      const now = new Date()
      const daysAgo =
        {
          "7d": 7,
          "30d": 30,
          "90d": 90,
          "1y": 365,
        }[timeRange] || 30

      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((report) => new Date(report.createdAt) >= cutoffDate)
    }

    // Filter by report type
    if (reportTypeFilter) {
      filtered = filtered.filter((report) => report.type === reportTypeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) => report.name.toLowerCase().includes(query) || report.projectName.toLowerCase().includes(query)
      )
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reports, timeRange, reportTypeFilter, searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "monthly-owner":
        return "bg-blue-100 text-blue-800"
      case "weekly-progress":
        return "bg-purple-100 text-purple-800"
      case "safety-report":
        return "bg-orange-100 text-orange-800"
      case "financial-summary":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewReport = (report: Report) => {
    setSelectedReport(report)
    setIsViewDialogOpen(true)
  }

  const handleDownloadReport = (report: Report) => {
    // Mock download functionality
    console.log(`Downloading report: ${report.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Report History</h1>
          <p className="text-gray-600">
            {filteredReports.length} reports found
            {projectId && ` for project ${projectId}`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {showAnalytics && (
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          )}
          {showTrends && (
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportTypeFilter || ""} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="monthly-owner">Monthly Owner</SelectItem>
                  <SelectItem value="weekly-progress">Weekly Progress</SelectItem>
                  <SelectItem value="safety-report">Safety Report</SelectItem>
                  <SelectItem value="financial-summary">Financial Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search reports..." value={searchQuery || ""} className="pl-10" disabled />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.projectName}</TableCell>
                  <TableCell>
                    <Badge className={getReportTypeColor(report.type)}>{report.type.replace("-", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>{report.fileSize}</TableCell>
                  <TableCell>{report.downloadCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Report Name</label>
                  <p className="text-sm">{selectedReport.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Project</label>
                  <p className="text-sm">{selectedReport.projectName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm">{selectedReport.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm">{formatDate(selectedReport.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Version</label>
                  <p className="text-sm">{selectedReport.version}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Size</label>
                  <p className="text-sm">{selectedReport.fileSize}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Downloads</label>
                  <p className="text-sm">{selectedReport.downloadCount}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDownloadReport(selectedReport)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
