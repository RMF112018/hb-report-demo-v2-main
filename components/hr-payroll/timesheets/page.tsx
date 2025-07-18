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
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Search,
  Filter,
  Users,
  Timer,
  TrendingUp,
  CalendarDays,
  Clock3,
  UserCheck,
  UserX,
  Copy,
  Plus,
  Save,
  Eye,
  EyeOff,
  DollarSign,
  Building2,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart3,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"

interface TimeEntry {
  id: string
  employeeId: string
  employeeName: string
  date: string
  jobCode: string
  costCode: string
  hours: number
  notes: string
  status: "draft" | "submitted" | "approved" | "rejected"
  submittedDate?: string
  approvedBy?: string
  approvedDate?: string
  project: string
  department: string
  hourlyRate: number
}

interface WeeklyTimesheet {
  id: string
  employeeId: string
  employeeName: string
  weekEnding: string
  totalHours: number
  status: "draft" | "submitted" | "approved" | "rejected"
  submittedDate?: string
  approvedBy?: string
  approvedDate?: string
  department: string
  project: string
  entries: TimeEntry[]
}

interface LaborCostSummary {
  id: string
  employeeId: string
  employeeName: string
  project: string
  totalHours: number
  totalCost: number
  hourlyRate: number
  department: string
}

const TimesheetsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"entry" | "approval" | "reports" | "summary">("entry")
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [showTimesheetModal, setShowTimesheetModal] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showBatchApprovalModal, setShowBatchApprovalModal] = useState(false)
  const [selectedTimesheet, setSelectedTimesheet] = useState<WeeklyTimesheet | null>(null)
  const [selectedEntries, setSelectedEntries] = useState<string[]>([])
  const [isManagerView, setIsManagerView] = useState(false)

  // Mock data
  const weeklyTimesheets: WeeklyTimesheet[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      weekEnding: "2024-12-01",
      totalHours: 40.5,
      status: "submitted",
      submittedDate: "2024-12-02",
      department: "Project Management",
      project: "Downtown Office Complex",
      entries: [
        {
          id: "1-1",
          employeeId: "EMP001",
          employeeName: "Sarah Johnson",
          date: "2024-11-25",
          jobCode: "HBC-2024-001",
          costCode: "01-10-00",
          hours: 8.0,
          notes: "Project planning and coordination",
          status: "submitted",
          project: "Downtown Office Complex",
          department: "Project Management",
          hourlyRate: 45.0,
        },
        {
          id: "1-2",
          employeeId: "EMP001",
          employeeName: "Sarah Johnson",
          date: "2024-11-26",
          jobCode: "HBC-2024-001",
          costCode: "01-10-00",
          hours: 8.0,
          notes: "Client meetings and documentation",
          status: "submitted",
          project: "Downtown Office Complex",
          department: "Project Management",
          hourlyRate: 45.0,
        },
      ],
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      weekEnding: "2024-12-01",
      totalHours: 38.0,
      status: "approved",
      submittedDate: "2024-12-02",
      approvedBy: "Alex Singh",
      approvedDate: "2024-12-03",
      department: "Estimating",
      project: "Residential Tower",
      entries: [
        {
          id: "2-1",
          employeeId: "EMP002",
          employeeName: "Michael Chen",
          date: "2024-11-25",
          jobCode: "HBC-2024-002",
          costCode: "02-20-00",
          hours: 7.5,
          notes: "Cost estimation and analysis",
          status: "approved",
          project: "Residential Tower",
          department: "Estimating",
          hourlyRate: 42.0,
        },
      ],
    },
  ]

  const laborCostSummaries: LaborCostSummary[] = [
    {
      id: "summary-0",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      project: "Downtown Office Complex",
      totalHours: 40.5,
      totalCost: 1822.5,
      hourlyRate: 45.0,
      department: "Project Management",
    },
    {
      id: "summary-1",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      project: "Residential Tower",
      totalHours: 38.0,
      totalCost: 1596.0,
      hourlyRate: 42.0,
      department: "Estimating",
    },
  ]

  const jobCodes = [
    { code: "HBC-2024-001", name: "Downtown Office Complex" },
    { code: "HBC-2024-002", name: "Residential Tower" },
    { code: "HBC-2024-003", name: "Hospital Renovation" },
    { code: "HBC-2024-004", name: "Shopping Center" },
  ]

  const costCodes = [
    { code: "01-10-00", name: "General Conditions" },
    { code: "02-20-00", name: "Site Work" },
    { code: "03-30-00", name: "Concrete" },
    { code: "04-40-00", name: "Masonry" },
    { code: "05-50-00", name: "Metals" },
    { code: "06-60-00", name: "Wood and Plastics" },
    { code: "07-70-00", name: "Thermal and Moisture Protection" },
    { code: "08-80-00", name: "Doors and Windows" },
    { code: "09-90-00", name: "Finishes" },
    { code: "10-10-00", name: "Specialties" },
  ]

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 1 }) // Monday start
    const end = endOfWeek(selectedWeek, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [selectedWeek])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      case "submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Clock className="h-4 w-4" />
      case "submitted":
        return <Clock3 className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const stats = {
    pending: 23,
    approved: 156,
    rejected: 8,
    totalHours: 6240,
    averageHours: 40.2,
    totalCost: 285000,
  }

  // Grid column definitions for timesheet entries
  const timesheetEntryColumns: ProtectedColDef[] = [
    {
      field: "date",
      headerName: "Day",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => {
        if (!value) return <span className="text-muted-foreground">No date</span>
        try {
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            return <span className="text-muted-foreground">Invalid date</span>
          }
          return format(date, "EEE, MMM d")
        } catch (error) {
          return <span className="text-muted-foreground">Invalid date</span>
        }
      },
      protection: { level: "read-only" },
    },
    {
      field: "jobCode",
      headerName: "Job Code",
      width: 150,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">{value}</span>
        </div>
      ),
    },
    {
      field: "costCode",
      headerName: "Cost Code",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => <span className="font-mono text-sm">{value}</span>,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 100,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: any }) => {
        if (value === null || value === undefined || typeof value !== "number" || isNaN(value)) {
          return <div className="text-right font-medium text-muted-foreground">-</div>
        }
        return <div className="text-right font-medium">{value.toFixed(1)}</div>
      },
      protection: {
        level: "none",
        validator: (value) => {
          const num = parseFloat(value)
          if (isNaN(num) || num < 0) return "Hours must be a positive number"
          if (num > 24) return "Hours cannot exceed 24"
          return true
        },
      },
    },
    {
      field: "notes",
      headerName: "Notes",
      width: 200,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => (
        <Badge className={getStatusColor(value)}>
          {getStatusIcon(value)}
          <span className="ml-1 capitalize">{value}</span>
        </Badge>
      ),
      protection: { level: "read-only" },
    },
  ]

  // Grid column definitions for labor cost summary
  const laborCostColumns: ProtectedColDef[] = [
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
      field: "project",
      headerName: "Project",
      width: 200,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <span>{value}</span>
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
      field: "totalHours",
      headerName: "Total Hours",
      width: 120,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: any }) => {
        if (value === null || value === undefined || typeof value !== "number" || isNaN(value)) {
          return <div className="text-right font-medium text-muted-foreground">-</div>
        }
        return <div className="text-right font-medium">{value.toFixed(1)}</div>
      },
      protection: { level: "read-only" },
    },
    {
      field: "hourlyRate",
      headerName: "Hourly Rate",
      width: 120,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: any }) => {
        if (value === null || value === undefined || typeof value !== "number" || isNaN(value)) {
          return <div className="text-right text-muted-foreground">-</div>
        }
        return <div className="text-right">${value.toFixed(2)}</div>
      },
      protection: { level: "read-only" },
    },
    {
      field: "totalCost",
      headerName: "Total Cost",
      width: 140,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: any }) => {
        if (value === null || value === undefined || typeof value !== "number" || isNaN(value)) {
          return <div className="text-right font-medium text-muted-foreground">-</div>
        }
        return <div className="text-right font-medium text-green-600 dark:text-green-400">${value.toFixed(2)}</div>
      },
      protection: { level: "read-only" },
    },
  ]

  // Transform laborCostSummaries data to include required 'id' field
  const laborCostGridData: GridRow[] = useMemo(
    () =>
      laborCostSummaries.map((summary, index) => ({
        ...summary,
        id: `summary-${index}`,
      })),
    [laborCostSummaries]
  )

  const handleCopyPreviousWeek = () => {
    setShowCopyModal(true)
  }

  const handleBatchApproval = () => {
    setShowBatchApprovalModal(true)
  }

  const handleTimesheetSubmit = () => {
    // Implementation for submitting timesheet
    console.log("Submitting timesheet...")
  }

  const handleTimesheetApproval = (timesheetId: string, approved: boolean) => {
    // Implementation for approving/rejecting timesheet
    console.log(`${approved ? "Approving" : "Rejecting"} timesheet ${timesheetId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timesheets</h1>
          <p className="text-muted-foreground mt-1">Manage time tracking, schedules, and approval workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleCopyPreviousWeek}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Previous Week
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowTimesheetModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-green-600 dark:text-green-400">+12 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">This pay period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Labor Costs</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalCost / 1000).toFixed(1)}k</div>
            <p className="text-xs text-green-600 dark:text-green-400">This pay period</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry">Weekly Entry</TabsTrigger>
          <TabsTrigger value="approval">Approval Queue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="summary">Labor Summary</TabsTrigger>
        </TabsList>

        {/* Weekly Entry Tab */}
        <TabsContent value="entry" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Timesheet Entry</CardTitle>
                  <CardDescription>
                    Enter your time for the week ending{" "}
                    {format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedWeek(addDays(selectedWeek, -7))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Week of {format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), "MMM d")} -{" "}
                    {format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "MMM d, yyyy")}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setSelectedWeek(addDays(selectedWeek, 7))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={timesheetEntryColumns}
                rowData={weekDays.map((day, index) => ({
                  id: `day-${index}`,
                  date: day.toISOString(),
                  jobCode: "",
                  costCode: "",
                  hours: 0,
                  notes: "",
                  status: "draft",
                  employeeName: "Sarah Johnson",
                  employeeId: "EMP001",
                  project: "Downtown Office Complex",
                  department: "Project Management",
                  hourlyRate: 45.0,
                }))}
                config={createGridWithTotalsAndSticky(1, true, {
                  allowExport: true,
                  allowRowSelection: true,
                  allowColumnResizing: true,
                  allowSorting: true,
                  allowFiltering: true,
                  allowCellEditing: true,
                  showToolbar: true,
                  showStatusBar: true,
                  protectionEnabled: true,
                  userRole: "employee",
                  theme: "quartz",
                  enableTotalsRow: true,
                  stickyColumnsCount: 1,
                })}
                height="400px"
                title="Weekly Timesheet"
                enableSearch={false}
                events={{
                  onCellValueChanged: (event) => {
                    console.log("Cell changed:", event.column.getId(), event.newValue)
                  },
                }}
              />

              <div className="flex justify-end mt-4 space-x-3">
                <Button variant="outline" onClick={handleCopyPreviousWeek}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Previous Week
                </Button>
                <Button onClick={handleTimesheetSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Timesheet
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Queue Tab */}
        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Timesheet Approval Queue</CardTitle>
                  <CardDescription>Review and approve employee timesheets</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsManagerView(!isManagerView)}>
                    {isManagerView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {isManagerView ? "Employee View" : "Manager View"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBatchApproval}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Batch Approval
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyTimesheets
                  .filter((timesheet) => {
                    if (isManagerView) return timesheet.status === "submitted"
                    return timesheet.status === "draft" || timesheet.status === "submitted"
                  })
                  .map((timesheet) => (
                    <div
                      key={timesheet.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{timesheet.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {timesheet.employeeId}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">Week ending: {timesheet.weekEnding}</span>
                            <span className="text-xs text-muted-foreground">{timesheet.totalHours} hours</span>
                            <span className="text-xs text-muted-foreground">{timesheet.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(timesheet.status)}>
                          {getStatusIcon(timesheet.status)}
                          <span className="ml-1 capitalize">{timesheet.status}</span>
                        </Badge>
                        {isManagerView && timesheet.status === "submitted" && (
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleTimesheetApproval(timesheet.id, true)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTimesheetApproval(timesheet.id, false)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          View
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
              <CardTitle>Timesheet Reports</CardTitle>
              <CardDescription>Generate and view timesheet reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Overtime Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Productivity Analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Labor Cost Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Department Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Building2 className="h-6 w-6 mb-2" />
                  <span>Project Hours</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Custom Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labor Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Labor Cost Summary</CardTitle>
              <CardDescription>Summarize labor costs by employee and project</CardDescription>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={laborCostColumns}
                rowData={laborCostGridData}
                config={createGridWithTotalsAndSticky(2, true, {
                  allowExport: true,
                  allowRowSelection: false,
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
                height="400px"
                title="Labor Cost Summary"
                enableSearch={true}
                totalsCalculator={(data, field) => {
                  if (field === "totalHours") {
                    const total = data.reduce((sum, row) => {
                      const hours = row.totalHours
                      return sum + (typeof hours === "number" && !isNaN(hours) ? hours : 0)
                    }, 0)
                    return total.toFixed(1)
                  }
                  if (field === "totalCost") {
                    const total = data.reduce((sum, row) => {
                      const cost = row.totalCost
                      return sum + (typeof cost === "number" && !isNaN(cost) ? cost : 0)
                    }, 0)
                    return `$${total.toFixed(2)}`
                  }
                  return ""
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Copy Previous Week Modal */}
      <Dialog open={showCopyModal} onOpenChange={setShowCopyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Copy Previous Week</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will copy all time entries from the previous week to the current week. You can then modify the
              entries as needed.
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>This action will overwrite any existing entries for the current week.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Copying previous week...")
                setShowCopyModal(false)
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Previous Week
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Approval Modal */}
      <Dialog open={showBatchApprovalModal} onOpenChange={setShowBatchApprovalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Batch Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select timesheets to approve or reject in batch.</p>
            <div className="space-y-2">
              {weeklyTimesheets
                .filter((timesheet) => timesheet.status === "submitted")
                .map((timesheet) => (
                  <div key={timesheet.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id={timesheet.id}
                      checked={selectedEntries.includes(timesheet.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedEntries([...selectedEntries, timesheet.id])
                        } else {
                          setSelectedEntries(selectedEntries.filter((id) => id !== timesheet.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{timesheet.employeeName}</div>
                      <div className="text-sm text-muted-foreground">
                        Week ending {timesheet.weekEnding} • {timesheet.totalHours} hours
                      </div>
                    </div>
                    <Badge className={getStatusColor(timesheet.status)}>{timesheet.status}</Badge>
                  </div>
                ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBatchApprovalModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                console.log("Rejecting selected timesheets...")
                setShowBatchApprovalModal(false)
                setSelectedEntries([])
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Selected
            </Button>
            <Button
              onClick={() => {
                console.log("Approving selected timesheets...")
                setShowBatchApprovalModal(false)
                setSelectedEntries([])
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}

export default TimesheetsPage
