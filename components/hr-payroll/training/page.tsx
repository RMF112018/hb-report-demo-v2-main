"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  GraduationCap,
  Award,
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
  Clock,
  FileText,
  Plus,
  BookOpen,
} from "lucide-react"
import AskHBIChat from "../AskHBIChat"

interface TrainingProgram {
  id: string
  name: string
  type: "safety" | "technical" | "leadership" | "compliance" | "certification"
  enrolledCount: number
  completedCount: number
  duration: string
  instructor: string
  status: "active" | "inactive" | "upcoming"
  startDate: string
  endDate: string
  cost: number
}

interface Certification {
  id: string
  employeeName: string
  employeeId: string
  certificationName: string
  issuingBody: string
  issueDate: string
  expiryDate: string
  status: "active" | "expired" | "pending" | "renewal"
  department: string
  score?: number
}

interface TrainingAssignment {
  id: string
  trainingId: string
  trainingName: string
  assignedTo: { type: "user" | "role"; value: string }
  department: string
  role: string
  employeeName?: string
  dueDate: string
  completionDate?: string
  status: "assigned" | "in-progress" | "completed" | "overdue"
  certificationUrl?: string
}

// Mock users, roles, departments
const users = [
  { id: "EMP001", name: "Sarah Johnson", department: "Project Management", role: "Project Manager" },
  { id: "EMP002", name: "Michael Chen", department: "Estimating", role: "Estimator" },
  { id: "EMP003", name: "Emily Davis", department: "Safety", role: "Safety Officer" },
  { id: "EMP004", name: "James Thompson", department: "Field Operations", role: "Field Engineer" },
]
const roles = ["Project Manager", "Estimator", "Safety Officer", "Field Engineer"]
const departments = ["Project Management", "Estimating", "Safety", "Field Operations"]

// Assignment state
const [assignments, setAssignments] = useState<TrainingAssignment[]>([
  {
    id: "A1",
    trainingId: "1",
    trainingName: "OSHA Safety Training",
    assignedTo: { type: "role", value: "Safety Officer" },
    department: "Safety",
    role: "Safety Officer",
    dueDate: "2024-07-15",
    status: "in-progress",
  },
  {
    id: "A2",
    trainingId: "2",
    trainingName: "PMP",
    assignedTo: { type: "user", value: "EMP001" },
    department: "Project Management",
    role: "Project Manager",
    employeeName: "Sarah Johnson",
    dueDate: "2024-08-01",
    completionDate: "2024-06-20",
    status: "completed",
    certificationUrl: "",
  },
])
const [showAssignModal, setShowAssignModal] = useState(false)
const [assignForm, setAssignForm] = useState({
  trainingId: "",
  assignType: "user",
  userId: "",
  role: "",
  dueDate: "",
})

const TrainingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"programs" | "certifications" | "progress">("programs")

  const trainingPrograms: TrainingProgram[] = [
    {
      id: "1",
      name: "OSHA Safety Training",
      type: "safety",
      enrolledCount: 1247,
      completedCount: 1189,
      duration: "8 hours",
      instructor: "Safety Department",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
      cost: 0,
    },
    {
      id: "2",
      name: "Project Management Professional (PMP)",
      type: "certification",
      enrolledCount: 45,
      completedCount: 23,
      duration: "35 hours",
      instructor: "External Provider",
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      cost: 2500,
    },
    {
      id: "3",
      name: "Leadership Development Program",
      type: "leadership",
      enrolledCount: 23,
      completedCount: 18,
      duration: "12 weeks",
      instructor: "HR Department",
      status: "active",
      startDate: "2024-02-01",
      endDate: "2024-04-30",
      cost: 1500,
    },
    {
      id: "4",
      name: "Construction Technology Update",
      type: "technical",
      enrolledCount: 89,
      completedCount: 67,
      duration: "4 hours",
      instructor: "Technical Team",
      status: "upcoming",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      cost: 200,
    },
  ]

  // Assignment handlers
  const handleAssign = () => {
    const training = trainingPrograms.find((t: TrainingProgram) => t.id === assignForm.trainingId)
    if (!training) return
    const newAssignment: TrainingAssignment = {
      id: `A${assignments.length + 1}`,
      trainingId: training.id,
      trainingName: training.name,
      assignedTo:
        assignForm.assignType === "user"
          ? { type: "user", value: assignForm.userId }
          : { type: "role", value: assignForm.role },
      department:
        assignForm.assignType === "user" ? users.find((u) => u.id === assignForm.userId)?.department || "" : "",
      role:
        assignForm.assignType === "user" ? users.find((u) => u.id === assignForm.userId)?.role || "" : assignForm.role,
      employeeName: assignForm.assignType === "user" ? users.find((u) => u.id === assignForm.userId)?.name : undefined,
      dueDate: assignForm.dueDate,
      status: "assigned",
    }
    setAssignments([...assignments, newAssignment])
    setShowAssignModal(false)
    setAssignForm({ trainingId: "", assignType: "user", userId: "", role: "", dueDate: "" })
  }

  // Assignment summary by department/role
  const summaryByDepartment = departments.map((dep) => ({
    department: dep,
    total: assignments.filter((a) => a.department === dep).length,
    completed: assignments.filter((a) => a.department === dep && a.status === "completed").length,
  }))
  const summaryByRole = roles.map((role) => ({
    role,
    total: assignments.filter((a) => a.role === role).length,
    completed: assignments.filter((a) => a.role === role && a.status === "completed").length,
  }))

  const certifications: Certification[] = [
    {
      id: "1",
      employeeName: "Sarah Johnson",
      employeeId: "EMP001",
      certificationName: "PMP - Project Management Professional",
      issuingBody: "PMI",
      issueDate: "2023-06-15",
      expiryDate: "2026-06-15",
      status: "active",
      department: "Project Management",
      score: 95,
    },
    {
      id: "2",
      employeeName: "Michael Chen",
      employeeId: "EMP002",
      certificationName: "OSHA 30-Hour Construction Safety",
      issuingBody: "OSHA",
      issueDate: "2023-08-20",
      expiryDate: "2025-08-20",
      status: "active",
      department: "Estimating",
      score: 88,
    },
    {
      id: "3",
      employeeName: "Emily Davis",
      employeeId: "EMP003",
      certificationName: "First Aid & CPR",
      issuingBody: "American Red Cross",
      issueDate: "2023-12-10",
      expiryDate: "2024-12-10",
      status: "expired",
      department: "Safety",
      score: 92,
    },
    {
      id: "4",
      employeeName: "James Thompson",
      employeeId: "EMP004",
      certificationName: "LEED Green Associate",
      issuingBody: "USGBC",
      issueDate: "2023-03-05",
      expiryDate: "2025-03-05",
      status: "active",
      department: "Field Operations",
      score: 87,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "renewal":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "inactive":
        return <XCircle className="h-4 w-4" />
      case "upcoming":
        return <Calendar className="h-4 w-4" />
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "renewal":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <GraduationCap className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "safety":
        return "bg-red-500"
      case "technical":
        return "bg-blue-500"
      case "leadership":
        return "bg-purple-500"
      case "compliance":
        return "bg-orange-500"
      case "certification":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const stats = {
    totalPrograms: 12,
    activeCertifications: 892,
    completionRate: 76,
    totalInvestment: 125000.0,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training</h1>
          <p className="text-gray-600 mt-1">Track certifications, manage training programs, and employee development</p>
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrograms}</div>
            <p className="text-xs text-green-600">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCertifications}</div>
            <p className="text-xs text-blue-600">Valid certifications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-green-600">Training completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalInvestment / 1000).toFixed(0)}K</div>
            <p className="text-xs text-gray-600">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("programs")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "programs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Training Programs
        </button>
        <button
          onClick={() => setActiveTab("certifications")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "certifications" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Certifications
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "progress" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Progress Tracking
        </button>
      </div>

      {/* Training Programs Tab */}
      {activeTab === "programs" && (
        <Card>
          <CardHeader>
            <CardTitle>Training Programs</CardTitle>
            <CardDescription>Manage employee training programs and development initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(
                        program.type
                      )}`}
                    >
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{program.name}</h3>
                      <p className="text-sm text-gray-600">{program.instructor}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{program.enrolledCount} enrolled</span>
                        <span className="text-xs text-gray-500">{program.completedCount} completed</span>
                        <span className="text-xs text-gray-500">{program.duration}</span>
                        <span className="text-xs text-gray-500">${program.cost}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(program.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(program.status)}
                        <span>{program.status}</span>
                      </div>
                    </Badge>
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications Tab */}
      {activeTab === "certifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Employee Certifications</CardTitle>
            <CardDescription>Track employee certifications and professional development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cert.employeeName}</h3>
                      <p className="text-sm text-gray-600">{cert.certificationName}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{cert.issuingBody}</span>
                        <span className="text-xs text-gray-500">Expires: {cert.expiryDate}</span>
                        <span className="text-xs text-gray-500">{cert.department}</span>
                        {cert.score && <span className="text-xs text-gray-500">Score: {cert.score}%</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(cert.status)}>{cert.status}</Badge>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Tracking Tab */}
      {activeTab === "progress" && (
        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>Track individual and team training progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Dashboard</h3>
              <p className="text-gray-600 mb-4">Comprehensive training progress tracking and analytics</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <div className="text-sm text-gray-600">Average Completion Rate</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">234</div>
                  <div className="text-sm text-gray-600">Certifications Earned</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">45</div>
                  <div className="text-sm text-gray-600">Due for Renewal</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Management</CardTitle>
            <CardDescription>Schedule and manage training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Training
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Assign Programs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Training Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Development Planning</CardTitle>
            <CardDescription>Create individual development plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="h-4 w-4 mr-2" />
                Create Development Plan
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Skills Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="h-4 w-4 mr-2" />
                Certification Tracking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assign Training Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Assign Training</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Training Program</label>
                <select
                  className="w-full border rounded p-2"
                  value={assignForm.trainingId}
                  onChange={(e) => setAssignForm((f) => ({ ...f, trainingId: e.target.value }))}
                >
                  <option value="">Select...</option>
                  {trainingPrograms.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select
                  className="w-full border rounded p-2"
                  value={assignForm.assignType}
                  onChange={(e) => setAssignForm((f) => ({ ...f, assignType: e.target.value }))}
                >
                  <option value="user">Individual</option>
                  <option value="role">Role</option>
                </select>
              </div>
              {assignForm.assignType === "user" ? (
                <div>
                  <label className="block text-sm font-medium mb-1">Employee</label>
                  <select
                    className="w-full border rounded p-2"
                    value={assignForm.userId}
                    onChange={(e) => setAssignForm((f) => ({ ...f, userId: e.target.value }))}
                  >
                    <option value="">Select...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.department})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    className="w-full border rounded p-2"
                    value={assignForm.role}
                    onChange={(e) => setAssignForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    <option value="">Select...</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <Input
                  type="date"
                  value={assignForm.dueDate}
                  onChange={(e) => setAssignForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAssign}
                disabled={
                  !assignForm.trainingId ||
                  (!assignForm.userId && assignForm.assignType === "user") ||
                  (!assignForm.role && assignForm.assignType === "role") ||
                  !assignForm.dueDate
                }
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Training Modal */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Training Assignments</CardTitle>
            <Button onClick={() => setShowAssignModal(true)}>
              <Plus className="h-4 w-4 mr-2" /> Assign Training
            </Button>
          </div>
          <CardDescription>
            Track all training assignments, due dates, completion, and certification uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Training</th>
                  <th className="p-2 text-left">Assigned To</th>
                  <th className="p-2 text-left">Department</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Completion</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Certification</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-2">{a.trainingName}</td>
                    <td className="p-2">{a.assignedTo.type === "user" ? a.employeeName : a.role}</td>
                    <td className="p-2">{a.department}</td>
                    <td className="p-2">{a.role}</td>
                    <td className="p-2">{a.dueDate}</td>
                    <td className="p-2">{a.completionDate || "-"}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(a.status)}>{a.status}</Badge>
                    </td>
                    <td className="p-2">
                      {a.status === "completed" ? (
                        a.certificationUrl ? (
                          <a
                            href={a.certificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            View
                          </a>
                        ) : (
                          <Button variant="outline" size="sm">
                            Upload
                          </Button>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ask HBI Chat */}
      <AskHBIChat />
    </div>
  )
}

export default TrainingPage
