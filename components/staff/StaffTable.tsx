import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  User,
  Building,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

export interface Employee {
  id: string
  name: string
  position: string
  department: string
  availability: number
  currentProject?: string | null
  laborRate: number
}

export interface Project {
  id: string
  name: string
  status: string
  startDate: string
  endDate: string
  manager: string
}

interface StaffTableProps {
  employees: Employee[]
  projects: Project[]
  onEdit?: (employee: Employee) => void
  onView?: (employee: Employee) => void
  onAssign?: (employee: Employee, projectId: string) => void
  onUnassign?: (employee: Employee) => void
}

export function StaffTable({ employees, projects, onEdit, onView, onAssign, onUnassign }: StaffTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter
    const matchesProject = projectFilter === "all" || emp.currentProject === projectFilter

    let matchesAvailability = true
    if (availabilityFilter === "high") {
      matchesAvailability = emp.availability >= 80
    } else if (availabilityFilter === "medium") {
      matchesAvailability = emp.availability >= 60 && emp.availability < 80
    } else if (availabilityFilter === "low") {
      matchesAvailability = emp.availability < 60
    }

    return matchesSearch && matchesDepartment && matchesProject && matchesAvailability
  })

  const getAvailabilityColor = (availability: number) => {
    if (availability >= 80) return "bg-green-100 text-green-800"
    if (availability >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getAvailabilityStatus = (availability: number) => {
    if (availability >= 80) return "High"
    if (availability >= 60) return "Medium"
    return "Low"
  }

  const getProjectName = (projectId?: string | null) => {
    if (!projectId) return "Unassigned"
    const project = projects.find((p) => p.id === projectId)
    return project?.name || "Unknown Project"
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      "Project Management": "bg-blue-100 text-blue-800",
      "Field Operations": "bg-green-100 text-green-800",
      Engineering: "bg-purple-100 text-purple-800",
      Safety: "bg-red-100 text-red-800",
      Quality: "bg-orange-100 text-orange-800",
    }
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Directory</h2>
          <p className="text-muted-foreground">Manage and view all employees</p>
        </div>
        <Button>
          <User className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {Array.from(new Set(employees.map((emp) => emp.department))).map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="">Unassigned</SelectItem>
                {projects
                  .filter((proj) => proj.status === "active")
                  .map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="high">High (80%+)</SelectItem>
                <SelectItem value="medium">Medium (60-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{employees.filter((emp) => !emp.currentProject).length} available</Badge>
          <Badge variant="outline">{employees.filter((emp) => emp.currentProject).length} assigned</Badge>
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Labor Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">#{employee.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{employee.position}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDepartmentColor(employee.department)}>{employee.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className={employee.currentProject ? "font-medium" : "text-muted-foreground"}>
                        {getProjectName(employee.currentProject)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {employee.availability >= 80 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : employee.availability >= 60 ? (
                        <TrendingUp className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge className={getAvailabilityColor(employee.availability)}>
                        {employee.availability}% ({getAvailabilityStatus(employee.availability)})
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${employee.laborRate}/hr</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(employee)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(employee)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {!employee.currentProject && onAssign && (
                          <DropdownMenuItem>
                            <Building className="h-4 w-4 mr-2" />
                            Assign to Project
                          </DropdownMenuItem>
                        )}
                        {employee.currentProject && onUnassign && (
                          <DropdownMenuItem onClick={() => onUnassign(employee)}>
                            <Building className="h-4 w-4 mr-2" />
                            Unassign from Project
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
            <p className="text-muted-foreground text-center">No employees match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
