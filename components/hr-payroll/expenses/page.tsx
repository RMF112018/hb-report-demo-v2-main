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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Search,
  Filter,
  Users,
  FileText,
  Receipt,
  CreditCard,
  Building2,
  Plus,
  Save,
  Eye,
  EyeOff,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Settings,
  FileImage,
  Paperclip,
  Trash2,
  Edit,
  Clock,
  UserCheck,
  UserX,
  Zap,
  Lightbulb,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"
import { format, addDays, startOfMonth, endOfMonth } from "date-fns"

interface Expense {
  id: string
  employeeId: string
  employeeName: string
  date: string
  category: string
  amount: number
  projectCode: string
  projectName: string
  description: string
  receiptUrl?: string
  status: "draft" | "submitted" | "reviewed" | "approved" | "rejected" | "paid"
  submittedDate?: string
  reviewedBy?: string
  reviewedDate?: string
  approvedBy?: string
  approvedDate?: string
  paidDate?: string
  department: string
  notes?: string
  hbiSuggestions?: string[]
}

interface ExpenseCategory {
  code: string
  name: string
  description: string
  typicalAmount: number
  approvalRequired: boolean
  hbiKeywords: string[]
}

interface ExpenseReport {
  id: string
  employeeId: string
  employeeName: string
  projectCode: string
  projectName: string
  totalAmount: number
  expenseCount: number
  averageAmount: number
  department: string
  status: string
}

const ExpensesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"entry" | "approval" | "reports" | "summary">("entry")
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showBatchApprovalModal, setShowBatchApprovalModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [isManagerView, setIsManagerView] = useState(false)
  const [showHbiSuggestions, setShowHbiSuggestions] = useState(false)
  const [currentDescription, setCurrentDescription] = useState("")

  // Mock data
  const expenses: Expense[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      date: "2024-12-01",
      category: "Travel",
      amount: 125.5,
      projectCode: "HBC-2024-001",
      projectName: "Downtown Office Complex",
      description: "Client meeting travel expenses - parking and lunch",
      receiptUrl: "/receipts/expense-1.pdf",
      status: "submitted",
      submittedDate: "2024-12-02",
      department: "Project Management",
      hbiSuggestions: ["Travel", "Meals", "Transportation"],
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      date: "2024-12-01",
      category: "Office Supplies",
      amount: 89.99,
      projectCode: "HBC-2024-002",
      projectName: "Residential Tower",
      description: "Blueprints and construction documents printing",
      receiptUrl: "/receipts/expense-2.pdf",
      status: "approved",
      submittedDate: "2024-12-02",
      approvedBy: "Alex Singh",
      approvedDate: "2024-12-03",
      department: "Estimating",
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Emily Davis",
      date: "2024-12-01",
      category: "Equipment",
      amount: 450.0,
      projectCode: "HBC-2024-003",
      projectName: "Hospital Renovation",
      description: "Safety equipment and PPE for site inspection",
      receiptUrl: "/receipts/expense-3.pdf",
      status: "reviewed",
      submittedDate: "2024-12-02",
      reviewedBy: "Jordan Lee",
      reviewedDate: "2024-12-04",
      department: "Safety",
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "James Thompson",
      date: "2024-12-01",
      category: "Software",
      amount: 299.99,
      projectCode: "HBC-2024-004",
      projectName: "Shopping Center",
      description: "Project management software license renewal",
      receiptUrl: "/receipts/expense-4.pdf",
      status: "paid",
      submittedDate: "2024-12-02",
      approvedBy: "Alex Singh",
      approvedDate: "2024-12-03",
      paidDate: "2024-12-05",
      department: "Field Operations",
    },
  ]

  const expenseCategories: ExpenseCategory[] = [
    {
      code: "TRAVEL",
      name: "Travel",
      description: "Business travel expenses including transportation, meals, and lodging",
      typicalAmount: 150,
      approvalRequired: true,
      hbiKeywords: ["travel", "trip", "flight", "hotel", "car", "parking", "uber", "lyft"],
    },
    {
      code: "MEALS",
      name: "Meals",
      description: "Business meals and entertainment expenses",
      typicalAmount: 75,
      approvalRequired: false,
      hbiKeywords: ["lunch", "dinner", "breakfast", "meal", "food", "restaurant", "catering"],
    },
    {
      code: "OFFICE_SUPPLIES",
      name: "Office Supplies",
      description: "Office supplies and equipment",
      typicalAmount: 100,
      approvalRequired: false,
      hbiKeywords: ["supplies", "paper", "ink", "printer", "office", "stationery", "blueprint"],
    },
    {
      code: "EQUIPMENT",
      name: "Equipment",
      description: "Tools, equipment, and safety gear",
      typicalAmount: 500,
      approvalRequired: true,
      hbiKeywords: ["equipment", "tools", "safety", "ppe", "hard hat", "vest", "gloves"],
    },
    {
      code: "SOFTWARE",
      name: "Software",
      description: "Software licenses and subscriptions",
      typicalAmount: 300,
      approvalRequired: true,
      hbiKeywords: ["software", "license", "subscription", "app", "program", "renewal"],
    },
    {
      code: "COMMUNICATIONS",
      name: "Communications",
      description: "Phone, internet, and communication expenses",
      typicalAmount: 100,
      approvalRequired: false,
      hbiKeywords: ["phone", "internet", "communication", "data", "mobile", "service"],
    },
    {
      code: "MARKETING",
      name: "Marketing",
      description: "Marketing and promotional expenses",
      typicalAmount: 200,
      approvalRequired: true,
      hbiKeywords: ["marketing", "promotion", "advertising", "brochure", "flyer", "event"],
    },
    {
      code: "TRAINING",
      name: "Training",
      description: "Training and professional development",
      typicalAmount: 500,
      approvalRequired: true,
      hbiKeywords: ["training", "course", "certification", "education", "workshop", "seminar"],
    },
  ]

  const expenseReports: ExpenseReport[] = [
    {
      id: "report-1",
      employeeId: "EMP001",
      employeeName: "Sarah Johnson",
      projectCode: "HBC-2024-001",
      projectName: "Downtown Office Complex",
      totalAmount: 125.5,
      expenseCount: 1,
      averageAmount: 125.5,
      department: "Project Management",
      status: "submitted",
    },
    {
      id: "report-2",
      employeeId: "EMP002",
      employeeName: "Michael Chen",
      projectCode: "HBC-2024-002",
      projectName: "Residential Tower",
      totalAmount: 89.99,
      expenseCount: 1,
      averageAmount: 89.99,
      department: "Estimating",
      status: "approved",
    },
  ]

  const projectCodes = [
    { code: "HBC-2024-001", name: "Downtown Office Complex" },
    { code: "HBC-2024-002", name: "Residential Tower" },
    { code: "HBC-2024-003", name: "Hospital Renovation" },
    { code: "HBC-2024-004", name: "Shopping Center" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />
      case "submitted":
        return <Clock className="h-4 w-4" />
      case "reviewed":
        return <Eye className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "paid":
        return <CreditCard className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const stats = {
    pending: 15,
    approved: 89,
    rejected: 3,
    totalAmount: 45678.5,
    averageAmount: 234.5,
    totalExpenses: 195,
  }

  // HBI Auto-suggestion function
  const getHbiSuggestions = (description: string): ExpenseCategory[] => {
    if (!description || description.length < 3) return []

    const lowerDescription = description.toLowerCase()
    return expenseCategories
      .filter((category) => category.hbiKeywords.some((keyword) => lowerDescription.includes(keyword)))
      .slice(0, 3)
  }

  // Grid column definitions for expenses
  const expenseColumns: ProtectedColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => format(new Date(value), "MMM d, yyyy"),
      protection: { level: "read-only" },
    },
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
      field: "category",
      headerName: "Category",
      width: 120,
      cellRenderer: ({ value }: { value: string }) => (
        <Badge variant="outline" className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: number }) => (
        <div className="text-right font-medium text-green-600">${value.toFixed(2)}</div>
      ),
      protection: {
        level: "none",
        validator: (value) => {
          const num = parseFloat(value)
          if (isNaN(num) || num < 0) return "Amount must be a positive number"
          if (num > 10000) return "Amount cannot exceed $10,000"
          return true
        },
      },
    },
    {
      field: "projectCode",
      headerName: "Project",
      width: 150,
      cellRenderer: ({ value }: { value: string }) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">{value}</span>
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
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

  // Grid column definitions for expense reports
  const expenseReportColumns: ProtectedColDef[] = [
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
      field: "projectName",
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
      field: "expenseCount",
      headerName: "Count",
      width: 100,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: number }) => <div className="text-right font-medium">{value}</div>,
      protection: { level: "read-only" },
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      width: 140,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: number }) => (
        <div className="text-right font-medium text-green-600">${value.toFixed(2)}</div>
      ),
      protection: { level: "read-only" },
    },
    {
      field: "averageAmount",
      headerName: "Average",
      width: 120,
      type: "numericColumn",
      cellRenderer: ({ value }: { value: number }) => <div className="text-right">${value.toFixed(2)}</div>,
      protection: { level: "read-only" },
    },
  ]

  // Transform expenseReports data to include required 'id' field
  const expenseReportGridData: GridRow[] = useMemo(
    () =>
      expenseReports.map((report, index) => ({
        ...report,
        id: `report-${index}`,
      })),
    [expenseReports]
  )

  const handleExpenseSubmit = () => {
    // Implementation for submitting expense
    console.log("Submitting expense...")
  }

  const handleExpenseApproval = (expenseId: string, approved: boolean) => {
    // Implementation for approving/rejecting expense
    console.log(`${approved ? "Approving" : "Rejecting"} expense ${expenseId}`)
  }

  const handleBatchApproval = () => {
    setShowBatchApprovalModal(true)
  }

  const handleDescriptionChange = (description: string) => {
    setCurrentDescription(description)
    const suggestions = getHbiSuggestions(description)
    if (suggestions.length > 0) {
      setShowHbiSuggestions(true)
    } else {
      setShowHbiSuggestions(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track, approve, and manage business expenses</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowExpenseModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-yellow-600">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-green-600">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalAmount / 1000).toFixed(1)}k</div>
            <p className="text-xs text-blue-600">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Expense</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageAmount}</div>
            <p className="text-xs text-gray-600">Per expense</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="entry">Expense Entry</TabsTrigger>
          <TabsTrigger value="approval">Approval Queue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="summary">Expense Summary</TabsTrigger>
        </TabsList>

        {/* Expense Entry Tab */}
        <TabsContent value="entry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Expense Entry</CardTitle>
              <CardDescription>Submit a new expense for approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input id="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.code} value={category.code}>
                            <div className="flex items-center justify-between w-full">
                              <span>{category.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">${category.typicalAmount}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input id="amount" type="number" step="0.01" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">Project Code *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCodes.map((project) => (
                          <SelectItem key={project.code} value={project.code}>
                            <div className="flex items-center justify-between w-full">
                              <span>{project.code}</span>
                              <span className="text-xs text-muted-foreground ml-2">{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      placeholder="Describe the expense..."
                      value={currentDescription}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      rows={3}
                    />
                    {showHbiSuggestions && (
                      <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-10 mt-1">
                        <div className="p-3 border-b">
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                            <Lightbulb className="h-4 w-4" />
                            HBI Suggestions
                          </div>
                        </div>
                        <ScrollArea className="max-h-48">
                          {getHbiSuggestions(currentDescription).map((category) => (
                            <div
                              key={category.code}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                              onClick={() => {
                                console.log("Selected category:", category.name)
                                setShowHbiSuggestions(false)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-sm text-gray-600">{category.description}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  ${category.typicalAmount}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt">Receipt Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileImage className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      Drag and drop your receipt here, or click to browse
                    </div>
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Save Draft</Button>
                  <Button onClick={handleExpenseSubmit}>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Expense
                  </Button>
                </div>
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
                  <CardTitle>Expense Approval Queue</CardTitle>
                  <CardDescription>Review and approve employee expenses</CardDescription>
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
              <ProtectedGrid
                columnDefs={expenseColumns}
                rowData={expenses.filter((expense) => {
                  if (isManagerView) return expense.status === "submitted" || expense.status === "reviewed"
                  return expense.status === "draft" || expense.status === "submitted"
                })}
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
                height="400px"
                title="Expense Queue"
                enableSearch={true}
                events={{
                  onRowSelected: (event) => {
                    console.log("Selected expense:", event.data)
                  },
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reports</CardTitle>
              <CardDescription>Generate and view expense reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>By Project</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span>By Employee</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>By Category</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  <span>Cost Analysis</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Monthly Summary</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Custom Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Summary</CardTitle>
              <CardDescription>Summarize expenses by employee and project</CardDescription>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={expenseReportColumns}
                rowData={expenseReportGridData}
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
                title="Expense Summary"
                enableSearch={true}
                totalsCalculator={(data, field) => {
                  if (field === "expenseCount") {
                    return data.reduce((sum, row) => sum + (row.expenseCount || 0), 0).toString()
                  }
                  if (field === "totalAmount") {
                    return `$${data.reduce((sum, row) => sum + (row.totalAmount || 0), 0).toFixed(2)}`
                  }
                  return ""
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Batch Approval Modal */}
      <Dialog open={showBatchApprovalModal} onOpenChange={setShowBatchApprovalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Batch Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select expenses to approve or reject in batch.</p>
            <div className="space-y-2">
              {expenses
                .filter((expense) => expense.status === "submitted" || expense.status === "reviewed")
                .map((expense) => (
                  <div key={expense.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={expense.id}
                      checked={selectedExpenses.includes(expense.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedExpenses([...selectedExpenses, expense.id])
                        } else {
                          setSelectedExpenses(selectedExpenses.filter((id) => id !== expense.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{expense.employeeName}</div>
                      <div className="text-sm text-gray-600">
                        {expense.category} • ${expense.amount.toFixed(2)} • {expense.projectCode}
                      </div>
                    </div>
                    <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
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
                console.log("Rejecting selected expenses...")
                setShowBatchApprovalModal(false)
                setSelectedExpenses([])
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Selected
            </Button>
            <Button
              onClick={() => {
                console.log("Approving selected expenses...")
                setShowBatchApprovalModal(false)
                setSelectedExpenses([])
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

export default ExpensesPage
