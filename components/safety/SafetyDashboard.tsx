/**
 * @fileoverview Safety Dashboard Component
 * @module SafetyDashboard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2025-01-15
 *
 * Main safety dashboard with section cards for:
 * - Certifications
 * - Forms
 * - Programs
 * - Notices
 * - Emergency Info
 * - Toolbox Talks
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
  Shield,
  FileText,
  BookOpen,
  Bell,
  AlertTriangle,
  Users,
  Calendar,
  Download,
  Upload,
  Eye,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Settings,
  ChevronRight,
  Award,
  AlertCircle,
  MapPin,
  Phone,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Maximize2,
  Minimize2,
  HardHat,
  Building2,
} from "lucide-react"

// Import safety components
import { CertificationTracker } from "./CertificationTracker"
import ToolboxTalkPanel from "../project/safety/ToolboxTalkPanel"

// Import placeholder components
import { CertificationsGrid } from "./CertificationsGrid"
import { SafetyFormsPanel } from "./SafetyFormsPanel"
import { SafetyProgramsLibrary } from "./SafetyProgramsLibrary"
import { SafetyAnnouncements } from "./SafetyAnnouncements"
import { EmergencyLocator } from "./EmergencyLocator"

interface SafetyDashboardProps {
  user: any
  projectId?: string
  projectData?: any
  userRole?: string
}

interface SafetyMetrics {
  activeCertifications: number
  expiringSoon: number
  totalForms: number
  completedForms: number
  activePrograms: number
  recentIncidents: number
  safetyScore: number
  lastAuditDate: string
  nextAuditDate: string
  complianceRate: number
}

// Mock projects data for project selector
const mockProjects = [
  { id: "prj_001", name: "Downtown Office Complex", status: "active" },
  { id: "prj_002", name: "Residential Towers Phase 1", status: "active" },
  { id: "prj_003", name: "Industrial Warehouse", status: "active" },
  { id: "prj_004", name: "Shopping Center Renovation", status: "active" },
  { id: "prj_005", name: "Medical Center Expansion", status: "active" },
]

export const SafetyDashboard: React.FC<SafetyDashboardProps> = ({
  user,
  projectId,
  projectData,
  userRole = "user",
}) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projectId || null)
  const [selectedProjectData, setSelectedProjectData] = useState<any>(projectData || null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock safety metrics data
  const safetyMetrics: SafetyMetrics = {
    activeCertifications: 45,
    expiringSoon: 3,
    totalForms: 28,
    completedForms: 24,
    activePrograms: 8,
    recentIncidents: 2,
    safetyScore: 94,
    lastAuditDate: "2024-11-15",
    nextAuditDate: "2025-02-15",
    complianceRate: 97,
  }

  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleProjectSelect = (projectId: string) => {
    const project = mockProjects.find((p) => p.id === projectId)
    setSelectedProjectId(projectId)
    setSelectedProjectData(project)
  }

  // Tab configuration
  const safetyTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Shield,
      description: "Safety dashboard overview and key metrics",
    },
    {
      id: "toolbox-talks",
      label: "Toolbox Talks",
      icon: HardHat,
      description: "AI-powered toolbox talk generation",
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      description: "Employee certifications and training records",
    },
    {
      id: "forms",
      label: "Forms",
      icon: FileText,
      description: "Safety forms and documentation",
    },
    {
      id: "programs",
      label: "Programs",
      icon: BookOpen,
      description: "Safety programs and training library",
    },
    {
      id: "notices",
      label: "Notices",
      icon: Bell,
      description: "Safety announcements and alerts",
    },
    {
      id: "emergency",
      label: "Emergency Info",
      icon: AlertTriangle,
      description: "Emergency contacts and procedures",
    },
  ]

  const renderProjectSelector = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Project for Toolbox Talks
          </CardTitle>
          <CardDescription>
            Choose a project to generate AI-powered toolbox talk content based on schedule activities, safety bulletins,
            and regional conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={handleProjectSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project..." />
              </SelectTrigger>
              <SelectContent>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{project.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {project.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProjectId && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Selected Project:</p>
                <p className="text-sm text-muted-foreground">{selectedProjectData?.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Safety Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Safety Score</p>
                <p className="text-2xl font-bold text-green-600">{safetyMetrics.safetyScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Above industry average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Compliance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{safetyMetrics.complianceRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">All critical areas compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{safetyMetrics.expiringSoon}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Certifications need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Recent Incidents</p>
                <p className="text-2xl font-bold text-red-600">{safetyMetrics.recentIncidents}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Minor incidents this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Form
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Safety form completed</p>
                  <p className="text-xs text-muted-foreground">Fall protection inspection - Project A</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Certification expiring</p>
                  <p className="text-xs text-muted-foreground">OSHA 30 certification expires in 5 days</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">New safety bulletin</p>
                  <p className="text-xs text-muted-foreground">Winter weather safety protocols</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Audit Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Last Audit</p>
              <p className="text-lg font-semibold">{safetyMetrics.lastAuditDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Audit</p>
              <p className="text-lg font-semibold">{safetyMetrics.nextAuditDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewContent()
      case "toolbox-talks":
        return selectedProjectId ? (
          <ToolboxTalkPanel
            projectId={selectedProjectId}
            projectData={selectedProjectData}
            userRole={userRole}
            user={user}
          />
        ) : (
          renderProjectSelector()
        )
      case "certifications":
        return <CertificationTracker userRole={userRole} />
      case "forms":
        return <SafetyFormsPanel />
      case "programs":
        return <SafetyProgramsLibrary />
      case "notices":
        return <SafetyAnnouncements />
      case "emergency":
        return (
          <EmergencyLocator
            projectId={projectId || selectedProjectId || undefined}
            projectData={projectData || selectedProjectData || undefined}
            userRole={userRole}
            user={user}
          />
        )
      default:
        return renderOverviewContent()
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Main content
  const mainContent = (
    <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
      {/* Module Title with Focus Button */}
      <div className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Safety Control Center</h2>
            <p className="text-sm text-muted-foreground">Comprehensive safety management and compliance monitoring</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleFocusToggle} className="h-8 px-3 text-xs">
            {isFocusMode ? (
              <>
                <Minimize2 className="h-3 w-3 mr-1" />
                Exit Focus
              </>
            ) : (
              <>
                <Maximize2 className="h-3 w-3 mr-1" />
                Focus
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Card-based Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6 flex-shrink-0">
        {safetyTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
              activeTab === tab.id
                ? "border-[#FA4616] bg-[#FA4616]/10 text-[#FA4616]"
                : "border-border hover:border-[#FA4616]/30"
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <tab.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{tab.label}</span>
              <span className="text-xs text-muted-foreground">{tab.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full min-w-0 max-w-full min-h-0">
        <div className="w-full min-w-0 max-w-full h-full overflow-auto">{renderTabContent()}</div>
      </div>
    </div>
  )

  // Return focus mode if active
  if (isFocusMode) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col z-50">
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <div className="p-6 min-h-full w-full max-w-full">{mainContent}</div>
      </div>
    </div>
  )
}
