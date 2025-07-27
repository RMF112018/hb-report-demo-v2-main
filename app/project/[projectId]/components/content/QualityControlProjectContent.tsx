/**
 * @fileoverview Quality Control Project Content Component
 * @module QualityControlProjectContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Quality Control implementation for project page following Core Project Tools pattern:
 * - Tab-based navigation (Overview, QC Programs, Inspections, Testing, Checklists, Non-Conformance, Corrective Actions, Reports)
 * - Role-based access control
 * - Responsive layout integration
 * - Focus mode support
 * - Integration with existing QC Program Generator and quality tools
 */

"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  CheckCircle,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Target,
  Shield,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2,
  Bot,
  Microscope,
  AlertCircle,
  CheckSquare,
  BarChart3,
  Users,
  Clock,
  Zap,
} from "lucide-react"

// Import Quality Control Components
import QualityProjectContent from "./QualityProjectContent"
import { QCProgramGenerator } from "@/components/quality/QCProgramGenerator"
import { QCMilestoneLinker } from "@/components/quality/QCMilestoneLinker"
import { QCReviewWorkflow } from "@/components/quality/QCReviewWorkflow"

interface QualityControlProjectContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

interface QualityNavigationState {
  qualityTab: string | null
}

// Quality Control tabs configuration
const qualityTabsConfig = [
  { id: "overview", label: "Overview", description: "Quality dashboard and key metrics", icon: BarChart3 },
  {
    id: "qc-programs",
    label: "QC Programs",
    description: "AI-generated quality control programs",
    icon: Bot,
  },
  {
    id: "inspections",
    label: "Inspections",
    description: "Quality inspections and schedules",
    icon: Search,
  },
  {
    id: "testing",
    label: "Testing",
    description: "Material testing and lab results",
    icon: Microscope,
  },
  {
    id: "checklists",
    label: "Checklists",
    description: "Quality control checklists and procedures",
    icon: CheckSquare,
  },
  {
    id: "non-conformance",
    label: "Non-Conformance",
    description: "Non-conformance tracking and resolution",
    icon: AlertTriangle,
  },
  {
    id: "corrective-actions",
    label: "Corrective Actions",
    description: "Corrective action management",
    icon: Zap,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Quality reports and analytics",
    icon: FileText,
  },
]

const QualityControlProjectContent: React.FC<QualityControlProjectContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  activeTab = "quality-control",
  onTabChange,
}) => {
  const [navigation, setNavigation] = useState<QualityNavigationState>({
    qualityTab: "overview", // Default to overview tab
  })
  const [mounted, setMounted] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Get role-based quality data
  const getQualityData = () => {
    const baseData = {
      totalInspections: 156,
      passedInspections: 142,
      failedInspections: 8,
      pendingInspections: 6,
      qualityScore: 91.2,
      activeQCPrograms: 12,
      nonConformanceReports: 3,
      correctiveActions: 2,
      completedChecklists: 89,
      totalChecklists: 95,
      materialTestsCompleted: 67,
      materialTestsPending: 4,
    }

    return baseData
  }

  const qualityData = getQualityData()

  // Get tabs for role - all roles see all tabs for project-level access
  const getTabsForRole = () => {
    return [...qualityTabsConfig]
  }

  const availableTabs = getTabsForRole()

  // Handle quality tab changes
  const handleQualityTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      qualityTab: tabId,
    }))
  }

  // Mock components for different quality tabs
  const QualityOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{qualityData.qualityScore}%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active QC Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityData.activeQCPrograms}</div>
            <p className="text-xs text-muted-foreground">Across all project phases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qualityData.passedInspections}/{qualityData.totalInspections}
            </div>
            <p className="text-xs text-muted-foreground">Passed/Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Non-Conformance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{qualityData.nonConformanceReports}</div>
            <p className="text-xs text-muted-foreground">Open reports</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Quality Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Concrete Pour Inspection - Level 3</p>
                  <p className="text-xs text-muted-foreground">Completed 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Steel Welding Non-Conformance</p>
                  <p className="text-xs text-muted-foreground">Reported 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">QC Program Generated - MEP Phase</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Inspection Pass Rate</span>
                  <span>91.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "91.2%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Checklist Completion</span>
                  <span>93.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "93.7%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Material Test Results</span>
                  <span>94.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "94.4%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const QualityInspections = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quality Inspections</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Schedule Inspection
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Today's Inspections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityData.pendingInspections}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Total scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">91.2%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Concrete Pour - Level 4", time: "9:00 AM", status: "Scheduled", type: "Structural" },
              { name: "MEP Rough-in Inspection", time: "11:30 AM", status: "In Progress", type: "MEP" },
              { name: "Fireproofing Application", time: "2:00 PM", status: "Scheduled", type: "Safety" },
              { name: "Curtain Wall Installation", time: "4:00 PM", status: "Scheduled", type: "Envelope" },
            ].map((inspection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">{inspection.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {inspection.type} • {inspection.time}
                    </p>
                  </div>
                </div>
                <Badge variant={inspection.status === "In Progress" ? "default" : "secondary"}>
                  {inspection.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const QualityTesting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Material Testing</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Results
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityData.materialTestsCompleted}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityData.materialTestsPending}</div>
            <p className="text-xs text-muted-foreground">In lab</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.4%</div>
            <p className="text-xs text-muted-foreground">All tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Avg. Turnaround</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { test: "Concrete Compressive Strength", result: "4,200 PSI", status: "Pass", date: "2 hours ago" },
              { test: "Steel Tensile Test", result: "65,000 PSI", status: "Pass", date: "4 hours ago" },
              { test: "Rebar Bend Test", result: "No Cracks", status: "Pass", date: "1 day ago" },
              { test: "Concrete Slump Test", result: "4.5 inches", status: "Pass", date: "1 day ago" },
              { test: "Aggregate Gradation", result: "Within Spec", status: "Pass", date: "2 days ago" },
            ].map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Microscope className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{test.test}</p>
                    <p className="text-sm text-muted-foreground">
                      {test.result} • {test.date}
                    </p>
                  </div>
                </div>
                <Badge variant={test.status === "Pass" ? "default" : "destructive"}>{test.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render content based on selected tab
  const renderQualityTabContent = () => {
    const projectScope = {
      scope: "single",
      projectCount: 1,
      description: `Project View: ${projectName}`,
      projects: [projectName],
      projectId,
    }

    switch (navigation.qualityTab) {
      case "overview":
        return <QualityOverview />

      case "qc-programs":
        return (
          <div className="space-y-6">
            <QCProgramGenerator />
          </div>
        )

      case "inspections":
        return <QualityInspections />

      case "testing":
        return <QualityTesting />

      case "checklists":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Quality Checklists</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Checklist
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Concrete Pour Checklist", completed: 12, total: 15, progress: 80 },
                { name: "Steel Erection Checklist", completed: 8, total: 10, progress: 80 },
                { name: "MEP Installation Checklist", completed: 25, total: 30, progress: 83 },
                { name: "Fire Safety Checklist", completed: 18, total: 20, progress: 90 },
              ].map((checklist, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-sm">{checklist.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {checklist.completed}/{checklist.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${checklist.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "non-conformance":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Non-Conformance Reports</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Report
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: "NCR-001",
                  title: "Steel Welding Quality Issue",
                  priority: "High",
                  status: "Open",
                  date: "2 days ago",
                },
                {
                  id: "NCR-002",
                  title: "Concrete Surface Finish",
                  priority: "Medium",
                  status: "In Review",
                  date: "1 week ago",
                },
                {
                  id: "NCR-003",
                  title: "MEP Penetration Sealing",
                  priority: "Low",
                  status: "Closed",
                  date: "2 weeks ago",
                },
              ].map((report, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="font-medium">
                            {report.id}: {report.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{report.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            report.priority === "High"
                              ? "destructive"
                              : report.priority === "Medium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {report.priority}
                        </Badge>
                        <Badge
                          variant={
                            report.status === "Open"
                              ? "destructive"
                              : report.status === "In Review"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "corrective-actions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Corrective Actions</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Action
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: "CA-001",
                  title: "Implement additional weld inspection",
                  dueDate: "Dec 15, 2024",
                  status: "In Progress",
                  assignee: "John Smith",
                },
                {
                  id: "CA-002",
                  title: "Retrain concrete finishing crew",
                  dueDate: "Dec 20, 2024",
                  status: "Planned",
                  assignee: "Sarah Johnson",
                },
              ].map((action, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="font-medium">
                            {action.id}: {action.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Due: {action.dueDate} • Assigned: {action.assignee}
                          </p>
                        </div>
                      </div>
                      <Badge variant={action.status === "In Progress" ? "default" : "secondary"}>{action.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Quality Reports</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Generate Report
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Monthly Quality Report", type: "Monthly", date: "Dec 1, 2024", status: "Published" },
                { name: "Inspection Summary", type: "Weekly", date: "Dec 8, 2024", status: "Draft" },
                { name: "Non-Conformance Analysis", type: "Ad-hoc", date: "Dec 5, 2024", status: "In Review" },
                { name: "Material Test Summary", type: "Monthly", date: "Nov 30, 2024", status: "Published" },
              ].map((report, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-sm">{report.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{report.type}</p>
                        <p className="text-sm text-muted-foreground">{report.date}</p>
                      </div>
                      <Badge variant={report.status === "Published" ? "default" : "secondary"}>{report.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return <QualityOverview />
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Handle focus mode toggle
  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Quality Control content
  const qualityControlContent = (
    <div className="h-full w-full">
      {/* Quality Tabs - Mobile dropdown, Desktop horizontal */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Quality Control</h1>
            <p className="text-muted-foreground">Comprehensive quality management and control for {projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFocusToggle}
              className={`${
                isFocusMode
                  ? "bg-[#FA4616] text-white border-[#FA4616] hover:bg-[#FA4616]/90"
                  : "text-[#FA4616] border-[#FA4616] hover:bg-[#FA4616]/10"
              }`}
            >
              {isFocusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFocusMode ? "Exit Focus" : "Focus Mode"}
            </Button>
          </div>
        </div>

        {/* Quality Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {availableTabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = navigation.qualityTab === tab.id
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleQualityTabChange(tab.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#FA4616] text-white hover:bg-[#FA4616]/90 border-[#FA4616]"
                      : "hover:bg-[#FA4616]/10 hover:text-[#FA4616] hover:border-[#FA4616]/30"
                  }
                `}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
                {tab.id === "qc-programs" && (
                  <Badge variant="secondary" className="bg-[#0021A5] text-white text-xs ml-1 border-[#0021A5]">
                    AI
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-96 w-full max-w-full overflow-hidden" style={{ maxWidth: "100%", width: "100%" }}>
        {renderQualityTabContent()}
      </div>
    </div>
  )

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-auto">
          <div className="p-6 h-full w-full max-w-full">{qualityControlContent}</div>
        </div>
      </div>
    )
  }

  // Return the main content
  return (
    <div className="flex-1 p-6 overflow-auto" style={{ maxWidth: "100%", width: "100%" }}>
      <div style={{ maxWidth: "100%", width: "100%" }}>{qualityControlContent}</div>
    </div>
  )
}

export default QualityControlProjectContent
