/**
 * @fileoverview Bid Management Container Component
 * @version 3.0.0
 * @description Main orchestrator component that brings together all bid management functionality
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"
import { Alert, AlertDescription } from "../../../ui/alert"
import { ScrollArea } from "../../../ui/scroll-area"
import { useToast } from "../../../ui/use-toast"
import {
  Package,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Settings,
  Plus,
  Info,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Building,
  User,
  PieChart,
  TrendingUp,
  Activity,
} from "lucide-react"

// Import all bid management components
import BidPackageList from "./BidPackageList"
import BidMessagePanel from "./BidMessagePanel"
import BidFileManager from "./BidFileManager"
import BidFormPanel from "./BidFormPanel"
import BidTeamManager from "./BidTeamManager"
import BidReportsPanel from "./BidReportsPanel"
import BidProjectDetails from "./BidProjectDetails"
import BidTabPanel from "./BidTabPanel"

// Import types
import { BidProject, BidPackage, BidForm, BidReport, TeamMember } from "../types/bid-management"

// Mock data imports (this would come from API in production)
import mockBidProjects from "../mock-data/bid-projects.json"
import mockBidPackages from "../mock-data/bid-packages.json"

interface BidManagementContainerProps {
  projectId: string
  userRole: string
  className?: string
}

// Mock forms and reports data
const mockBidForms: BidForm[] = [
  {
    id: "form-001",
    packageId: "pkg-001",
    templateId: "template-001",
    name: "Subcontractor Qualification Form",
    description: "Standard qualification form for subcontractors",
    fields: [
      {
        id: "field-001",
        name: "company_name",
        type: "text",
        label: "Company Name",
        required: true,
      },
      {
        id: "field-002",
        name: "license_number",
        type: "text",
        label: "License Number",
        required: true,
      },
      {
        id: "field-003",
        name: "bid_amount",
        type: "currency",
        label: "Bid Amount",
        required: true,
      },
    ],
    status: "active",
    responses: [],
    dueDate: "2025-03-01T17:00:00Z",
    created_date: "2025-01-20T10:00:00Z",
  },
]

const mockBidReports: BidReport[] = [
  {
    id: "report-001",
    type: "invited-vs-responded",
    projectId: "2525841",
    name: "Invitation Response Summary",
    description: "Summary of invited vs responded subcontractors",
    parameters: {},
    generatedDate: "2025-01-30T10:00:00Z",
    generatedBy: "Sarah Chen",
    format: "pdf",
  },
]

const mockTeamMembers: TeamMember[] = [
  {
    id: "team-001",
    name: "Sarah Chen",
    email: "s.chen@hedrickbrothers.com",
    role: "Lead Estimator",
    phone: "(555) 234-5678",
    department: "Estimating",
    isActive: true,
  },
  {
    id: "team-002",
    name: "Michael Rodriguez",
    email: "m.rodriguez@hedrickbrothers.com",
    role: "Coordinator",
    phone: "(555) 345-6789",
    department: "Project Management",
    isActive: true,
  },
  {
    id: "team-003",
    name: "Robert Johnson",
    email: "r.johnson@hedrickbrothers.com",
    role: "Executive Oversight",
    phone: "(555) 123-4567",
    department: "Executive",
    isActive: true,
  },
]

const BidManagementContainer: React.FC<BidManagementContainerProps> = ({ projectId, userRole, className = "" }) => {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("packages")
  const [selectedProject, setSelectedProject] = useState<BidProject | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<BidPackage | null>(null)
  const [bidPackages, setBidPackages] = useState<BidPackage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        setIsLoading(true)

        // Find the project
        const project = mockBidProjects.find((p) => p.id === projectId) as BidProject
        if (project) {
          setSelectedProject(project)

          // Load packages for this project
          const projectPackages = mockBidPackages.filter((pkg) => pkg.projectId === projectId) as BidPackage[]
          setBidPackages(projectPackages)

          // Set first package as selected if available
          if (projectPackages.length > 0) {
            setSelectedPackage(projectPackages[0])
          }
        }
      } catch (error) {
        console.error("Error loading project data:", error)
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProjectData()
  }, [projectId, toast])

  // Handle package selection
  const handlePackageSelect = (pkg: BidPackage) => {
    setSelectedPackage(pkg)
    setActiveTab("packages") // Ensure we're on the packages tab
  }

  // Handle package creation
  const handlePackageCreate = () => {
    toast({
      title: "Create Package",
      description: "Package creation dialog would open here.",
    })
  }

  // Handle package edit
  const handlePackageEdit = (pkg: BidPackage) => {
    toast({
      title: "Edit Package",
      description: `Editing package: ${pkg.name}`,
    })
  }

  // Handle package delete
  const handlePackageDelete = (packageId: string) => {
    setBidPackages((prev) => prev.filter((pkg) => pkg.id !== packageId))
    if (selectedPackage?.id === packageId) {
      setSelectedPackage(null)
    }
    toast({
      title: "Package Deleted",
      description: "Package has been successfully deleted.",
    })
  }

  // Handle project update
  const handleProjectUpdate = (updates: Partial<BidProject>) => {
    if (selectedProject) {
      setSelectedProject({ ...selectedProject, ...updates })
      toast({
        title: "Project Updated",
        description: "Project details have been updated successfully.",
      })
    }
  }

  // Handle team update
  const handleTeamUpdate = (team: TeamMember[]) => {
    if (selectedProject) {
      setSelectedProject({ ...selectedProject, team })
      toast({
        title: "Team Updated",
        description: "Team assignments have been updated successfully.",
      })
    }
  }

  // Handle form creation
  const handleFormCreate = () => {
    toast({
      title: "Create Form",
      description: "Form creation dialog would open here.",
    })
  }

  // Handle form edit
  const handleFormEdit = (form: BidForm) => {
    toast({
      title: "Edit Form",
      description: `Editing form: ${form.name}`,
    })
  }

  // Handle report generation
  const handleReportGenerate = (type: string, params: Record<string, any>) => {
    toast({
      title: "Generating Report",
      description: `Generating ${type} report...`,
    })
  }

  // Check if user has access to bid management - Allow access to relevant project roles
  const hasAccess = [
    "executive",
    "project-executive",
    "project-manager",
    "estimator",
    "admin",
    "presentation",
  ].includes(userRole)

  if (!hasAccess) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access the bid management module. Contact your administrator.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-muted-foreground">Loading bid management...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedProject) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Project not found or not in bidding stage. Please select a valid bidding project.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bid Management</h1>
          <p className="text-muted-foreground">
            {selectedProject.display_name} • {selectedProject.project_number}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Viewing {userRole} Demo
          </Badge>
          <Badge variant="secondary">
            {bidPackages.length} Package{bidPackages.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Project Value</p>
                <p className="text-2xl font-bold">${(selectedProject.estimated_value / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bid Due</p>
                <p className="text-2xl font-bold">{new Date(selectedProject.key_dates.bid_due).toLocaleDateString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                <p className="text-2xl font-bold">{selectedProject.team.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold capitalize">{selectedProject.status}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bid Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1 p-4">
                {[
                  { id: "packages", label: "Bid Packages", icon: Package, count: bidPackages.length },
                  { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
                  { id: "files", label: "Files", icon: FileText, count: 12 },
                  { id: "forms", label: "Forms", icon: Settings, count: mockBidForms.length },
                  { id: "team", label: "Team", icon: Users, count: selectedProject.team.length },
                  { id: "reports", label: "Reports", icon: BarChart3, count: mockBidReports.length },
                  { id: "details", label: "Project Details", icon: Building },
                  { id: "bid-tabs", label: "Bid Tabs", icon: PieChart },
                ].map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <IconComponent className="h-4 w-4 mr-3" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="col-span-9">
          <div className="space-y-4">
            {activeTab === "packages" && (
              <BidPackageList
                projectId={projectId}
                packages={bidPackages}
                selectedPackage={selectedPackage}
                onPackageSelect={handlePackageSelect}
                onPackageCreate={handlePackageCreate}
                onPackageEdit={handlePackageEdit}
                onPackageDelete={handlePackageDelete}
              />
            )}

            {activeTab === "messages" && <BidMessagePanel projectId={projectId} packageId={selectedPackage?.id} />}

            {activeTab === "files" && <BidFileManager projectId={projectId} packageId={selectedPackage?.id} />}

            {activeTab === "forms" && (
              <BidFormPanel
                packageId={selectedPackage?.id || ""}
                forms={mockBidForms}
                onFormCreate={handleFormCreate}
                onFormEdit={handleFormEdit}
              />
            )}

            {activeTab === "team" && (
              <BidTeamManager
                projectId={projectId}
                team={selectedProject.team}
                onTeamUpdate={handleTeamUpdate}
                availableMembers={mockTeamMembers}
              />
            )}

            {activeTab === "reports" && (
              <BidReportsPanel
                projectId={projectId}
                packageId={selectedPackage?.id}
                reports={mockBidReports}
                onReportGenerate={handleReportGenerate}
              />
            )}

            {activeTab === "details" && (
              <BidProjectDetails project={selectedProject} onProjectUpdate={handleProjectUpdate} isEditable={true} />
            )}

            {activeTab === "bid-tabs" && selectedPackage && (
              <BidTabPanel packageId={selectedPackage.id} bidPackage={selectedPackage} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BidManagementContainer
