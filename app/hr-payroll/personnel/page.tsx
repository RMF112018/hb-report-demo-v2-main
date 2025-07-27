"use client"

import React, { useState, useCallback, useMemo } from "react"
import HrPayrollLayout from "@/components/layouts/HrPayrollLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ProtectedGrid, ProtectedColDef, GridRow, createGridWithTotalsAndSticky } from "@/components/ui/protected-grid"
import { useSharePointDocs } from "@/hooks/useSharePointDocs"
import { microsoftGraphService } from "@/lib/msgraph"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  MoreHorizontal,
  Users,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileText,
  Link,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserPlus,
  Settings,
  Filter,
  RefreshCw,
  Share2,
} from "lucide-react"
import { format } from "date-fns"

// Employee data interface
interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  title: string
  location: string
  status: "Active" | "Inactive" | "Terminated" | "On Leave"
  hireDate: string
  supervisor: string
  salary?: number
  avatar?: string
  documents?: string[]
}

// Form data interface
interface EmployeeFormData {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  title: string
  location: string
  status: "Active" | "Inactive" | "Terminated" | "On Leave"
  hireDate: string
  supervisor: string
  salary?: number
  notes?: string
}

export default function PersonnelPage() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      employeeId: "EMP001",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@hb.com",
      phone: "(206) 555-0123",
      department: "Operations",
      title: "Senior Project Manager",
      location: "Seattle, WA",
      status: "Active",
      hireDate: "2022-03-15",
      supervisor: "Dana Nguyen",
      salary: 95000,
      avatar: "/avatars/sarah-johnson.png",
      documents: ["employment-contract.pdf", "benefits-enrollment.pdf"],
    },
    {
      id: "2",
      employeeId: "EMP002",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@hb.com",
      phone: "(503) 555-0456",
      department: "Pre-Construction",
      title: "Estimator",
      location: "Portland, OR",
      status: "Active",
      hireDate: "2021-08-22",
      supervisor: "Alex Singh",
      salary: 82000,
      avatar: "/avatars/michael-chen.png",
      documents: ["employment-contract.pdf", "safety-training.pdf"],
    },
    {
      id: "3",
      employeeId: "EMP003",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.rodriguez@hb.com",
      phone: "(415) 555-0789",
      department: "Field Operations",
      title: "Field Engineer",
      location: "San Francisco, CA",
      status: "Active",
      hireDate: "2023-01-10",
      supervisor: "Michael Lee",
      salary: 78000,
      avatar: "/avatars/emily-rodriguez.png",
      documents: ["employment-contract.pdf", "certifications.pdf"],
    },
    {
      id: "4",
      employeeId: "EMP004",
      firstName: "David",
      lastName: "Thompson",
      email: "david.thompson@hb.com",
      phone: "(720) 555-0321",
      department: "Safety",
      title: "Safety Manager",
      location: "Denver, CO",
      status: "Active",
      hireDate: "2020-11-05",
      supervisor: "Jordan Lee",
      salary: 88000,
      avatar: "/avatars/david-thompson.png",
      documents: ["employment-contract.pdf", "safety-certifications.pdf"],
    },
    {
      id: "5",
      employeeId: "EMP005",
      firstName: "Lisa",
      lastName: "Wang",
      email: "lisa.wang@hb.com",
      phone: "(213) 555-0654",
      department: "Operations",
      title: "Project Coordinator",
      location: "Los Angeles, CA",
      status: "Active",
      hireDate: "2022-09-18",
      supervisor: "Robin Brown",
      salary: 72000,
      avatar: "/avatars/lisa-wang.png",
      documents: ["employment-contract.pdf", "training-completion.pdf"],
    },
  ])

  // Modal state
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Form state
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    title: "",
    location: "",
    status: "Active",
    hireDate: "",
    supervisor: "",
    salary: undefined,
    notes: "",
  })

  // SharePoint integration
  const { documents, loading: docsLoading, downloadDocument, searchDocuments } = useSharePointDocs()

  // Departments for dropdown
  const departments = [
    "Operations",
    "Pre-Construction",
    "Field Operations",
    "Safety",
    "Finance",
    "Human Resources",
    "IT",
    "Marketing",
    "Legal",
  ]

  // Locations for dropdown
  const locations = [
    "Seattle, WA",
    "Portland, OR",
    "San Francisco, CA",
    "Denver, CO",
    "Los Angeles, CA",
    "Phoenix, AZ",
    "Las Vegas, NV",
    "Salt Lake City, UT",
  ]

  // Supervisors for dropdown
  const supervisors = [
    "Dana Nguyen",
    "Alex Singh",
    "Michael Lee",
    "Jordan Lee",
    "Robin Brown",
    "Sarah Wilson",
    "John Smith",
  ]

  // Generate next employee ID
  const generateEmployeeId = useCallback(() => {
    const maxId = Math.max(...employees.map((emp) => parseInt(emp.employeeId.replace("EMP", ""))))
    return `EMP${String(maxId + 1).padStart(3, "0")}`
  }, [employees])

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (editingEmployee) {
        // Update existing employee
        setEmployees((prev) => prev.map((emp) => (emp.id === editingEmployee.id ? { ...emp, ...formData } : emp)))
      } else {
        // Create new employee
        const newEmployee: Employee = {
          id: Date.now().toString(),
          ...formData,
          avatar: `/avatars/${formData.firstName.toLowerCase()}-${formData.lastName.toLowerCase()}.png`,
          documents: [],
        }
        setEmployees((prev) => [...prev, newEmployee])
      }

      setShowEmployeeModal(false)
      setEditingEmployee(null)
      setFormData({
        employeeId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        title: "",
        location: "",
        status: "Active",
        hireDate: "",
        supervisor: "",
        salary: undefined,
        notes: "",
      })
    },
    [editingEmployee, formData, employees]
  )

  // Handle edit employee
  const handleEditEmployee = useCallback((employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      title: employee.title,
      location: employee.location,
      status: employee.status,
      hireDate: employee.hireDate,
      supervisor: employee.supervisor,
      salary: employee.salary,
      notes: "",
    })
    setShowEmployeeModal(true)
  }, [])

  // Handle delete employee
  const handleDeleteEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
  }, [])

  // Handle add new employee
  const handleAddEmployee = useCallback(() => {
    setEditingEmployee(null)
    setFormData({
      employeeId: generateEmployeeId(),
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      title: "",
      location: "",
      status: "Active",
      hireDate: "",
      supervisor: "",
      salary: undefined,
      notes: "",
    })
    setShowEmployeeModal(true)
  }, [generateEmployeeId])

  // Handle view documents
  const handleViewDocuments = useCallback((employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDocumentsModal(true)
  }, [])

  // Grid column definitions
  const columnDefs: ProtectedColDef[] = useMemo(
    () => [
      {
        field: "employeeId",
        headerName: "Employee ID",
        width: 120,
        pinned: "left",
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{value}</span>
          </div>
        ),
        protection: { level: "read-only", message: "Employee ID is system-generated" },
      },
      {
        field: "name",
        headerName: "Name",
        width: 200,
        pinned: "left",
        cellRenderer: ({ data }: { data: Employee }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={data.avatar} alt={`${data.firstName} ${data.lastName}`} />
              <AvatarFallback>
                {data.firstName.charAt(0)}
                {data.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{`${data.firstName} ${data.lastName}`}</div>
              <div className="text-xs text-muted-foreground">{data.email}</div>
            </div>
          </div>
        ),
      },
      {
        field: "department",
        headerName: "Department",
        width: 150,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        field: "title",
        headerName: "Title",
        width: 180,
      },
      {
        field: "location",
        headerName: "Location",
        width: 140,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        width: 120,
        cellRenderer: ({ value }: { value: string }) => {
          const statusConfig = {
            Active: { variant: "outline", className: "bg-green-100 text-green-800" },
            Inactive: { variant: "outline", className: "bg-gray-100 text-gray-800" },
            Terminated: { variant: "outline", className: "bg-red-100 text-red-800" },
            "On Leave": { variant: "outline", className: "bg-yellow-100 text-yellow-800" },
          }
          const config = statusConfig[value as keyof typeof statusConfig]
          return (
            <Badge variant={config.variant as any} className={config.className}>
              {value}
            </Badge>
          )
        },
      },
      {
        field: "hireDate",
        headerName: "Hire Date",
        width: 120,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{format(new Date(value), "MMM dd, yyyy")}</span>
          </div>
        ),
      },
      {
        field: "supervisor",
        headerName: "Supervisor",
        width: 150,
        cellRenderer: ({ value }: { value: string }) => (
          <div className="flex items-center gap-2">
            <UserPlus className="h-3 w-3 text-muted-foreground" />
            <span>{value}</span>
          </div>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        cellRenderer: ({ data }: { data: Employee }) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => handleEditEmployee(data)} title="Edit Employee">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleViewDocuments(data)} title="View Documents">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(data.id)} title="Delete Employee">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
        protection: { level: "none" },
      },
    ],
    [handleEditEmployee, handleDeleteEmployee, handleViewDocuments]
  )

  // Transform employee data for grid
  const gridData: GridRow[] = useMemo(
    () =>
      employees.map((emp) => ({
        ...emp,
        name: `${emp.firstName} ${emp.lastName}`,
      })),
    [employees]
  )

  // Grid configuration
  const gridConfig = createGridWithTotalsAndSticky(2, false, {
    allowExport: true,
    allowRowSelection: true,
    allowMultiSelection: false,
    protectionEnabled: true,
    userRole: "hr-payroll",
    theme: "quartz",
  })

  // Grid events
  const gridEvents = {
    onRowSelected: (event: any) => {
      console.log("Row selected:", event.data)
    },
    onCellValueChanged: (event: any) => {
      console.log("Cell value changed:", event.column.getId(), event.newValue)
    },
  }

  return (
    <HrPayrollLayout>
      <div className="p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Badge variant="outline">{employees.length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {employees.filter((emp) => emp.status === "Active").length}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.filter((emp) => emp.status === "Active").length}</div>
                <p className="text-xs text-muted-foreground">96% active rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departments</CardTitle>
                <Badge variant="outline">{new Set(employees.map((emp) => emp.department)).size}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(employees.map((emp) => emp.department)).size}</div>
                <p className="text-xs text-muted-foreground">Across organization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locations</CardTitle>
                <Badge variant="outline">{new Set(employees.map((emp) => emp.location)).size}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Set(employees.map((emp) => emp.location)).size}</div>
                <p className="text-xs text-muted-foreground">Office locations</p>
              </CardContent>
            </Card>
          </div>

          {/* Employee Directory Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>Manage and view all employee records</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm" onClick={handleAddEmployee}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProtectedGrid
                columnDefs={columnDefs}
                rowData={gridData}
                config={gridConfig}
                events={gridEvents}
                height="600px"
                title="Employee Directory"
                enableSearch={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Employee Form Modal */}
        <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingEmployee ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="EMP001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Last name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="employee@hb.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 555-0123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Employment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Job title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => setFormData({ ...formData, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Select
                      value={formData.supervisor}
                      onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors.map((sup) => (
                          <SelectItem key={sup} value={sup}>
                            {sup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Employment Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "Active" | "Inactive" | "Terminated" | "On Leave") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Optional)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={formData.salary || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value ? parseFloat(e.target.value) : undefined })
                      }
                      placeholder="Annual salary"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about the employee..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEmployeeModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingEmployee ? "Update Employee" : "Add Employee"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Documents Modal */}
        <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Employee Documents - {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* SharePoint Integration Status */}
              <Alert>
                <Link className="h-4 w-4" />
                <AlertDescription>Connected to Microsoft Graph API for SharePoint document management</AlertDescription>
              </Alert>

              {/* Employee Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Employee Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">HR Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedEmployee?.documents?.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )) || <p className="text-sm text-muted-foreground">No documents uploaded</p>}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">SharePoint Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {docsLoading ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Loading documents...</span>
                        </div>
                      ) : documents.length > 0 ? (
                        documents.slice(0, 5).map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => downloadDocument(doc.id)}>
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No SharePoint documents found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Documents</h3>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDocumentsModal(false)}>
                  Close
                </Button>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Documents
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </HrPayrollLayout>
  )
}
