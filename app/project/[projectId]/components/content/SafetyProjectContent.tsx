/**
 * @fileoverview Safety Project Content Component
 * @module SafetyProjectContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Safety implementation for project page following Core Project Tools pattern:
 * - Tab-based navigation (Overview, Safety Programs, Inspections, Training, Incidents, Hazards, PPE, Reports)
 * - Role-based access control
 * - Responsive layout integration
 * - Focus mode support
 * - Integration with existing safety tools and forms
 */

"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  Shield,
  AlertTriangle,
  HardHat,
  FileText,
  Users,
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
  Eye,
  BookOpen,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Clock,
  Target,
  Zap,
  Activity,
} from "lucide-react"

// Import Safety Components
import ProjectSafetyForms from "@/components/project/safety/ProjectSafetyForms"

interface SafetyProjectContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

interface SafetyNavigationState {
  safetyTab: string | null
}

// Safety tabs configuration
const safetyTabsConfig = [
  { id: "overview", label: "Overview", description: "Safety dashboard and key metrics", icon: BarChart3 },
  {
    id: "safety-programs",
    label: "Safety Programs",
    description: "Safety management programs and procedures",
    icon: Shield,
  },
  {
    id: "inspections",
    label: "Inspections",
    description: "Safety inspections and audits",
    icon: Eye,
  },
  {
    id: "training",
    label: "Training",
    description: "Safety training and certifications",
    icon: BookOpen,
  },
  {
    id: "incidents",
    label: "Incidents",
    description: "Incident reporting and management",
    icon: AlertTriangle,
  },
  {
    id: "hazards",
    label: "Hazards",
    description: "Hazard identification and mitigation",
    icon: AlertCircle,
  },
  {
    id: "ppe",
    label: "PPE",
    description: "Personal protective equipment management",
    icon: HardHat,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Safety reports and analytics",
    icon: FileText,
  },
]

const SafetyProjectContent: React.FC<SafetyProjectContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  activeTab = "safety",
  onTabChange,
}) => {
  const [navigation, setNavigation] = useState<SafetyNavigationState>({
    safetyTab: "overview", // Default to overview tab
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

  // Get role-based safety data
  const getSafetyData = () => {
    const baseData = {
      daysWithoutIncident: 47,
      totalIncidents: 2,
      nearMisses: 8,
      safetyScore: 94.5,
      completedInspections: 128,
      pendingInspections: 3,
      trainedPersonnel: 156,
      totalPersonnel: 165,
      trainingCompliance: 94.5,
      activePPE: 245,
      ppeCompliance: 98.2,
      openHazards: 4,
      resolvedHazards: 23,
    }

    return baseData
  }

  const safetyData = getSafetyData()

  // Get tabs for role - all roles see all tabs for project-level access
  const getTabsForRole = () => {
    return [...safetyTabsConfig]
  }

  const availableTabs = getTabsForRole()

  // Handle safety tab changes
  const handleSafetyTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      safetyTab: tabId,
    }))
  }

  // Mock components for different safety tabs
  const SafetyOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Days Without Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{safetyData.daysWithoutIncident}</div>
            <p className="text-xs text-muted-foreground">Current streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{safetyData.safetyScore}%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safetyData.trainingCompliance}%</div>
            <p className="text-xs text-muted-foreground">
              {safetyData.trainedPersonnel}/{safetyData.totalPersonnel} personnel
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PPE Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{safetyData.ppeCompliance}%</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Safety Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Weekly Safety Inspection - Level 3</p>
                  <p className="text-xs text-muted-foreground">Completed 3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Near Miss Report - Fall Protection</p>
                  <p className="text-xs text-muted-foreground">Reported 6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Safety Training - New Hires</p>
                  <p className="text-xs text-muted-foreground">Scheduled for tomorrow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety Metrics Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Safety Score</span>
                  <span>94.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "94.5%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Training Compliance</span>
                  <span>94.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "94.5%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>PPE Compliance</span>
                  <span>98.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "98.2%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const SafetyInspections = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Safety Inspections</h3>
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
            <div className="text-2xl font-bold">{safetyData.pendingInspections}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safetyData.completedInspections}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96.8%</div>
            <p className="text-xs text-muted-foreground">Pass rate</p>
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
              { name: "Weekly Site Safety Inspection", time: "8:00 AM", status: "In Progress", type: "General" },
              { name: "Fall Protection Audit", time: "10:30 AM", status: "Scheduled", type: "Specialized" },
              { name: "Equipment Safety Check", time: "1:00 PM", status: "Scheduled", type: "Equipment" },
              { name: "PPE Compliance Review", time: "3:30 PM", status: "Scheduled", type: "PPE" },
            ].map((inspection, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
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

  const SafetyTraining = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Safety Training</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export Records
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Schedule Training
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Trained Personnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safetyData.trainedPersonnel}</div>
            <p className="text-xs text-muted-foreground">Out of {safetyData.totalPersonnel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{safetyData.trainingCompliance}%</div>
            <p className="text-xs text-muted-foreground">Current rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Upcoming Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Programs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "OSHA 10-Hour Construction", participants: 45, completion: 93, nextDate: "Dec 15, 2024" },
              { name: "Fall Protection Training", participants: 32, completion: 100, nextDate: "Dec 20, 2024" },
              { name: "Hazard Communication", participants: 67, completion: 89, nextDate: "Dec 18, 2024" },
              { name: "First Aid/CPR", participants: 28, completion: 96, nextDate: "Dec 22, 2024" },
            ].map((program, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium">{program.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {program.participants} participants • {program.completion}% completion
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Next: {program.nextDate}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render content based on selected tab
  const renderSafetyTabContent = () => {
    const projectScope = {
      scope: "single",
      projectCount: 1,
      description: `Project View: ${projectName}`,
      projects: [projectName],
      projectId,
    }

    switch (navigation.safetyTab) {
      case "overview":
        return <SafetyOverview />

      case "safety-programs":
        return (
          <div className="space-y-6">
            <ProjectSafetyForms projectId={projectId} userRole={userRole} />
          </div>
        )

      case "inspections":
        return <SafetyInspections />

      case "training":
        return <SafetyTraining />

      case "incidents":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Incident Reports</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Report Incident
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{safetyData.totalIncidents}</div>
                  <p className="text-xs text-muted-foreground">This year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Near Misses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{safetyData.nearMisses}</div>
                  <p className="text-xs text-muted-foreground">Reported</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Days Without Incident</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{safetyData.daysWithoutIncident}</div>
                  <p className="text-xs text-muted-foreground">Current streak</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "hazards":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Hazard Management</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Report Hazard
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Open Hazards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{safetyData.openHazards}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Resolved This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{safetyData.resolvedHazards}</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Resolution Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.2%</div>
                  <p className="text-xs text-muted-foreground">Average</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "ppe":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">PPE Management</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add PPE
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Active PPE</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{safetyData.activePPE}</div>
                  <p className="text-xs text-muted-foreground">Items tracked</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{safetyData.ppeCompliance}%</div>
                  <p className="text-xs text-muted-foreground">Current</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Expiring Soon</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <p className="text-xs text-muted-foreground">Next 30 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Damaged/Lost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "reports":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Safety Reports</h3>
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
                { name: "Monthly Safety Report", type: "Monthly", date: "Dec 1, 2024", status: "Published" },
                { name: "Incident Analysis", type: "Quarterly", date: "Dec 5, 2024", status: "Draft" },
                { name: "Training Compliance Report", type: "Weekly", date: "Dec 8, 2024", status: "In Review" },
                { name: "PPE Audit Report", type: "Monthly", date: "Nov 30, 2024", status: "Published" },
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
        return <SafetyOverview />
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

  // Safety content
  const safetyContent = (
    <div className="h-full w-full">
      {/* Safety Tabs - Mobile dropdown, Desktop horizontal */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Safety Management</h1>
            <p className="text-muted-foreground">Comprehensive safety management and compliance for {projectName}</p>
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

        {/* Safety Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {availableTabs.map((tab) => {
            const IconComponent = tab.icon
            const isActive = navigation.safetyTab === tab.id
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSafetyTabChange(tab.id)}
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
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-96 w-full max-w-full overflow-hidden" style={{ maxWidth: "100%", width: "100%" }}>
        {renderSafetyTabContent()}
      </div>
    </div>
  )

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-auto">
          <div className="p-6 h-full w-full max-w-full">{safetyContent}</div>
        </div>
      </div>
    )
  }

  // Return the main content
  return (
    <div className="flex-1 p-6 overflow-auto" style={{ maxWidth: "100%", width: "100%" }}>
      <div style={{ maxWidth: "100%", width: "100%" }}>{safetyContent}</div>
    </div>
  )
}

export default SafetyProjectContent
