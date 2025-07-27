"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Brain,
  Award,
  Users2,
  FileText,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AskHBIChat from "../AskHBIChat"
import BehavioralInsights from "../BehavioralInsights"

interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  location: string
  hireDate: string
  status: "active" | "inactive" | "terminated"
  manager: string
  avatar: string
}

const PersonnelPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock behavioral assessment data
  const behavioralAssessments = [
    {
      employeeId: "1",
      employeeName: "Sarah Johnson",
      department: "Project Management",
      position: "Senior Project Manager",
      discProfile: {
        type: "DC",
        primaryStyle: "Dominance",
        secondaryStyle: "Conscientiousness",
        summary:
          "Sarah is a results-driven leader who combines assertiveness with attention to detail. She excels at setting clear goals and ensuring high-quality outcomes through systematic approaches.",
        strengths: [
          "Direct and decisive communication",
          "Strong goal orientation",
          "High standards for quality",
          "Analytical problem-solving",
        ],
        growthAreas: [
          "Building rapport with team members",
          "Showing more patience with process",
          "Balancing task focus with relationship building",
        ],
        communicationTips: [
          "Be direct and concise in communication",
          "Provide clear expectations and deadlines",
          "Use data and facts to support decisions",
          "Allow time for questions and clarification",
        ],
        stressResponse:
          "Under stress, Sarah becomes more task-focused and may appear impatient. She prefers to solve problems quickly and may need reminders to consider team input.",
        motivators: [
          "Achieving measurable results",
          "Leading challenging projects",
          "Improving processes and efficiency",
          "Recognition for accomplishments",
        ],
        deMotivators: [
          "Unclear expectations",
          "Lack of progress or results",
          "Excessive bureaucracy",
          "Being micromanaged",
        ],
      },
      integrus360: {
        leadershipType: "Driver",
        color: "Red",
        profile: {
          type: "Driver",
          description:
            "Sarah is a natural leader who thrives on challenges and drives results through direct action and clear direction.",
          leadershipStrengths: [
            "Goal-oriented and results-driven",
            "Decisive decision-making",
            "Strong project management skills",
            "Ability to motivate through achievement",
          ],
          developmentAreas: [
            "Building deeper team relationships",
            "Developing coaching skills",
            "Enhancing emotional intelligence",
            "Balancing drive with team needs",
          ],
          communicationStyle: "Direct and action-oriented",
          conflictResolution: "Prefers to address issues head-on and find quick solutions",
          teamMotivation: "Motivates through clear goals, recognition, and visible progress",
          stressManagement: "Uses action and problem-solving to manage stress",
          pdfUrl: "/assessments/sarah-johnson-integrus360.pdf",
          lastUpdated: "2024-11-15",
        },
      },
      teamCompatibility: {
        overallScore: 85,
        compatibilityMatrix: {
          "2": { score: 78, notes: "Good collaboration, different but complementary styles" },
          "3": { score: 92, notes: "Excellent partnership, shared values and communication" },
          "4": { score: 65, notes: "Some friction due to different work paces" },
          "5": { score: 88, notes: "Strong working relationship, clear roles" },
        },
        teamDynamics: [
          "Works best with detail-oriented team members",
          "May need support with relationship-focused colleagues",
          "Excels in structured, goal-driven environments",
          "Benefits from team members who can provide emotional support",
        ],
        recommendations: [
          "Pair with relationship-focused team members for balance",
          "Provide opportunities to mentor detail-oriented staff",
          "Consider team building activities to strengthen relationships",
        ],
      },
    },
    {
      employeeId: "2",
      employeeName: "Michael Chen",
      department: "Estimating",
      position: "Senior Estimator",
      discProfile: {
        type: "CS",
        primaryStyle: "Conscientiousness",
        secondaryStyle: "Steadiness",
        summary:
          "Michael is a methodical and reliable professional who values accuracy and consistency. He excels at detailed analysis and maintaining high standards in his work.",
        strengths: [
          "Attention to detail and accuracy",
          "Reliable and consistent performance",
          "Analytical thinking",
          "Quality-focused approach",
        ],
        growthAreas: [
          "Taking more initiative in decision-making",
          "Being more flexible with changes",
          "Building confidence in presenting ideas",
        ],
        communicationTips: [
          "Provide detailed information and context",
          "Allow time for thorough analysis",
          "Be patient with questions and clarifications",
          "Recognize and appreciate accuracy and quality",
        ],
        stressResponse:
          "Under stress, Michael becomes more cautious and may need reassurance. He prefers to have all information before making decisions.",
        motivators: [
          "Producing high-quality, accurate work",
          "Having clear processes and expectations",
          "Recognition for attention to detail",
          "Stable and predictable work environment",
        ],
        deMotivators: [
          "Rushed deadlines without proper planning",
          "Frequent changes without notice",
          "Lack of clear expectations",
          "Being pressured to compromise quality",
        ],
      },
      integrus360: {
        leadershipType: "Refiner",
        color: "Green",
        profile: {
          type: "Refiner",
          description:
            "Michael is a detail-oriented leader who excels at improving processes and ensuring quality through systematic approaches.",
          leadershipStrengths: [
            "Process improvement and optimization",
            "Quality control and standards",
            "Analytical problem-solving",
            "Reliable and consistent performance",
          ],
          developmentAreas: [
            "Taking more initiative in leadership",
            "Building confidence in decision-making",
            "Developing strategic thinking",
            "Enhancing communication skills",
          ],
          communicationStyle: "Thorough and detail-oriented",
          conflictResolution: "Prefers to analyze situations thoroughly before addressing conflicts",
          teamMotivation: "Motivates through quality standards and process improvement",
          stressManagement: "Uses systematic analysis and planning to manage stress",
          pdfUrl: "/assessments/michael-chen-integrus360.pdf",
          lastUpdated: "2024-10-20",
        },
      },
      teamCompatibility: {
        overallScore: 82,
        compatibilityMatrix: {
          "1": { score: 78, notes: "Good collaboration, different but complementary styles" },
          "3": { score: 75, notes: "Respectful working relationship, different approaches" },
          "4": { score: 88, notes: "Excellent partnership, shared focus on quality" },
          "5": { score: 85, notes: "Strong collaboration, complementary skills" },
        },
        teamDynamics: [
          "Works well with detail-oriented team members",
          "Provides stability and reliability to teams",
          "May need support with fast-paced environments",
          "Excels in structured, process-driven teams",
        ],
        recommendations: [
          "Pair with action-oriented team members for balance",
          "Provide opportunities to lead process improvements",
          "Consider mentoring roles for junior staff",
        ],
      },
    },
  ]

  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      position: "Project Manager II",
      department: "Project Management",
      email: "sarah.johnson@hb.com",
      phone: "(555) 123-4567",
      location: "Seattle, WA",
      hireDate: "2022-03-15",
      status: "active",
      manager: "Alex Singh",
      avatar: "/avatars/sarah-johnson.png",
    },
    {
      id: "2",
      name: "Michael Chen",
      position: "Senior Estimator",
      department: "Estimating",
      email: "michael.chen@hb.com",
      phone: "(555) 234-5678",
      location: "Portland, OR",
      hireDate: "2021-08-22",
      status: "active",
      manager: "Lisa Rodriguez",
      avatar: "/avatars/michael-chen.png",
    },
    {
      id: "3",
      name: "Emily Davis",
      position: "Safety Coordinator",
      department: "Safety",
      email: "emily.davis@hb.com",
      phone: "(555) 345-6789",
      location: "Denver, CO",
      hireDate: "2023-01-10",
      status: "active",
      manager: "David Wilson",
      avatar: "/avatars/emily-davis.png",
    },
    {
      id: "4",
      name: "James Thompson",
      position: "Field Superintendent",
      department: "Field Operations",
      email: "james.thompson@hb.com",
      phone: "(555) 456-7890",
      location: "Phoenix, AZ",
      hireDate: "2020-11-05",
      status: "active",
      manager: "Robert Martinez",
      avatar: "/avatars/james-thompson.png",
    },
    {
      id: "5",
      name: "Jennifer Lee",
      position: "HR Specialist",
      department: "Human Resources",
      email: "jennifer.lee@hb.com",
      phone: "(555) 567-8901",
      location: "Corporate HQ",
      hireDate: "2022-06-20",
      status: "active",
      manager: "HR Director",
      avatar: "/avatars/jennifer-lee.png",
    },
  ]

  const departments = [
    "All Departments",
    "Project Management",
    "Estimating",
    "Safety",
    "Field Operations",
    "Human Resources",
    "Finance",
    "IT",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "terminated":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Personnel Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee records, organizational structure, and personnel data
          </p>
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
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-xs text-green-600 dark:text-green-400">+12 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,198</div>
            <p className="text-xs text-green-600 dark:text-green-400">96% active rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Hires</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">23</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Employee Directory</CardTitle>
          <CardDescription>Search and filter employee records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept === "All Departments" ? "all" : dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Employee List */}
          <div className="space-y-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{employee.name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {employee.email}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {employee.department}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {employee.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedEmployee(employee)
                      setShowEmployeeModal(true)
                      setActiveTab("overview")
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Organizational Chart Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Organizational Structure</CardTitle>
          <CardDescription>View and manage reporting relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Organizational Chart</h3>
            <p className="text-muted-foreground mb-4">
              Interactive organizational chart showing reporting relationships
            </p>
            <Button variant="outline">View Full Chart</Button>
          </div>
        </CardContent>
      </Card>

      {/* Ask HBI Chat */}
      <AskHBIChat />

      {/* Employee Profile Modal */}
      <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedEmployee?.name} - Employee Profile
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="behavioral" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Behavioral Insights
                  </TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <p className="text-sm">{selectedEmployee.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Position</label>
                            <p className="text-sm">{selectedEmployee.position}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Department</label>
                            <p className="text-sm">{selectedEmployee.department}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Manager</label>
                            <p className="text-sm">{selectedEmployee.manager}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <p className="text-sm">{selectedEmployee.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phone</label>
                            <p className="text-sm">{selectedEmployee.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <p className="text-sm">{selectedEmployee.location}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Hire Date</label>
                            <p className="text-sm">{selectedEmployee.hireDate}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">85%</div>
                            <div className="text-sm text-muted-foreground">Performance Rating</div>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-green-600">92%</div>
                            <div className="text-sm text-muted-foreground">Team Compatibility</div>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">DC</div>
                            <div className="text-sm text-muted-foreground">DiSC Profile</div>
                          </div>
                          <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-red-600">Driver</div>
                            <div className="text-sm text-muted-foreground">Leadership Type</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="behavioral" className="space-y-6">
                  {(() => {
                    const assessment = behavioralAssessments.find((a) => a.employeeId === selectedEmployee.id)
                    if (assessment) {
                      return (
                        <BehavioralInsights
                          assessment={assessment as any}
                          allAssessments={behavioralAssessments as any}
                        />
                      )
                    }
                    return (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center py-8">
                            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Behavioral Assessment</h3>
                            <p className="text-muted-foreground mb-4">
                              No behavioral assessment data available for this employee.
                            </p>
                            <Button>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Assessment
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })()}
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Performance Data</h3>
                        <p className="text-muted-foreground">Performance metrics and reviews will be displayed here.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Employee Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Documents</h3>
                        <p className="text-muted-foreground">Employee documents and forms will be displayed here.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PersonnelPage
