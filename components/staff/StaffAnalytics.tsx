import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, DollarSign, Calendar, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react"

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

export interface SPCR {
  id: string
  projectId: string
  projectName: string
  type: string
  status: string
  requestedBy: string
  requestedDate: string
  position: string
  budget: number
  justification: string
  urgency: string
}

interface StaffAnalyticsProps {
  employees: Employee[]
  projects: Project[]
  spcrs: SPCR[]
}

export function StaffAnalytics({ employees, projects, spcrs }: StaffAnalyticsProps) {
  // Calculate key metrics
  const totalEmployees = employees.length
  const allocatedEmployees = employees.filter((emp) => emp.currentProject).length
  const availableEmployees = employees.filter((emp) => !emp.currentProject).length
  const averageUtilization = employees.reduce((sum, emp) => sum + emp.availability, 0) / totalEmployees
  const totalLaborCost = employees.reduce((sum, emp) => sum + (emp.laborRate * emp.availability) / 100, 0)

  // SPCR metrics
  const pendingSpcrs = spcrs.filter((spcr) => spcr.status === "submitted").length
  const approvedSpcrs = spcrs.filter((spcr) => spcr.status === "approved").length
  const highUrgencySpcrs = spcrs.filter((spcr) => spcr.urgency === "high").length

  // Project metrics
  const activeProjects = projects.filter((proj) => proj.status === "active").length
  const completedProjects = projects.filter((proj) => proj.status === "completed").length

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return "text-green-600"
    if (utilization >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 80) return "Optimal"
    if (utilization >= 60) return "Good"
    return "Low"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff Analytics</h2>
          <p className="text-muted-foreground">Comprehensive workforce analytics and insights</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          Real-time Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {allocatedEmployees} allocated, {availableEmployees} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageUtilization)}%</div>
            <p className={`text-xs ${getUtilizationColor(averageUtilization)}`}>
              {getUtilizationStatus(averageUtilization)} utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Labor Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(totalLaborCost).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on current allocations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">{completedProjects} completed</p>
          </CardContent>
        </Card>
      </div>

      {/* SPCR Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            SPCR Status
          </CardTitle>
          <CardDescription>Current staffing plan change request status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-800">{pendingSpcrs}</div>
                  <div className="text-sm text-yellow-600">Pending Approval</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">{approvedSpcrs}</div>
                  <div className="text-sm text-green-600">Approved</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-800">{highUrgencySpcrs}</div>
                  <div className="text-sm text-red-600">High Priority</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
          <CardDescription>Employee allocation across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(employees.map((emp) => emp.department))).map((dept) => {
              const deptEmployees = employees.filter((emp) => emp.department === dept)
              const deptUtilization =
                deptEmployees.reduce((sum, emp) => sum + emp.availability, 0) / deptEmployees.length

              return (
                <div key={dept} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-medium">{dept}</span>
                    <Badge variant="outline">{deptEmployees.length} employees</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={deptUtilization} className="w-24" />
                    <span className="text-sm text-muted-foreground">{Math.round(deptUtilization)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Utilization Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilization by Position</CardTitle>
            <CardDescription>Average utilization rates by job position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(new Set(employees.map((emp) => emp.position)))
                .slice(0, 5)
                .map((position) => {
                  const positionEmployees = employees.filter((emp) => emp.position === position)
                  const avgUtilization =
                    positionEmployees.reduce((sum, emp) => sum + emp.availability, 0) / positionEmployees.length

                  return (
                    <div key={position} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{position}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={avgUtilization} className="w-20" />
                        <span className="text-sm text-muted-foreground">{Math.round(avgUtilization)}%</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Allocation</CardTitle>
            <CardDescription>Employee distribution across active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects
                .filter((proj) => proj.status === "active")
                .slice(0, 5)
                .map((project) => {
                  const projectEmployees = employees.filter((emp) => emp.currentProject === project.id)

                  return (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">{project.name}</span>
                      </div>
                      <Badge variant="outline">{projectEmployees.length} assigned</Badge>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Labor Cost Analysis</CardTitle>
          <CardDescription>Monthly labor costs by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(employees.map((emp) => emp.department))).map((dept) => {
              const deptEmployees = employees.filter((emp) => emp.department === dept)
              const deptCost = deptEmployees.reduce((sum, emp) => sum + (emp.laborRate * emp.availability) / 100, 0)

              return (
                <div key={dept} className="flex items-center justify-between">
                  <span className="font-medium">{dept}</span>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">${Math.round(deptCost).toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
