/**
 * @fileoverview Project Control Center Content Component
 * @module ProjectControlCenterContent
 * @version 3.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Enhanced project control center with:
 * - Core Project Tools implementation
 * - Tab-based navigation (Dashboard, Checklists, Reports, Responsibility Matrix, Productivity)
 * - Left sidebar content injection for main app
 * - Dynamic sidebar panels (Project Overview, Quick Actions, Recent Activity, Key Metrics, HBI Insights)
 * - Role-based access control
 * - Responsive layout integration
 */

"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronRight,
  RefreshCw,
  Upload,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  Calendar,
  Activity,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  BarChart3,
  Brain,
  Monitor,
  Target,
  Zap,
  GitBranch,
  Calculator,
  CreditCard,
  Receipt,
  Percent,
  Settings,
  Info,
  Plus,
  Download,
  Eye,
  CheckSquare,
  Send,
  History,
  FileX,
  Briefcase,
  ClipboardList,
  MessageSquare,
  Shield,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Bell,
  Phone,
  PieChart,
  CalendarDays,
  Building,
  Star,
  PlusCircle,
  Folder,
  MapPin,
  Mail,
  Filter,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

// Import content components from legacy page
import { ReportCreator } from "@/components/reports/ReportCreator"
import { ReportViewer } from "@/components/reports/ReportViewer"
import { ReportApprovalWorkflow } from "@/components/reports/ReportApprovalWorkflow"
import { ReportHistory } from "@/components/reports/ReportHistory"
import { ReportAnalytics } from "@/components/reports/ReportAnalytics"
import FinancialHubProjectContent from "./content/FinancialHubProjectContent"
import FieldManagementContent from "./content/FieldManagementContent"
import SharePointFilesTab from "@/components/sharepoint/SharePointFilesTab"
import SidebarPanelRenderer from "@/components/project/sidebar/SidebarPanelRenderer"
import { ReportsDashboard } from "@/components/reports/ReportsDashboard"
import { ProjectReports } from "@/components/reports/ProjectReports"
import EstimatingSuite from "@/components/estimating/EstimatingSuite"
import { EstimatingProvider } from "@/components/estimating/EstimatingProvider"

// Lazy load ProjectTabsShell for better performance
const ProjectTabsShell = React.lazy(() => import("@/components/project/ProjectTabsShell"))

interface ProjectControlCenterContentProps {
  projectId: string
  projectData: any
  userRole: string
  user: any
  activeTab?: string
  onTabChange?: (tabId: string) => void
  onSidebarContentChange?: (content: React.ReactNode) => void
}

interface NavigationState {
  category: string | null
  tool: string | null
  subTool: string | null
  coreTab?: string | null
  staffingSubTab?: string
  reportsSubTab?: string
}

// Expandable Description Component
const ExpandableDescription: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const maxLength = 100
  const shouldTruncate = description.length > maxLength
  const displayText = isExpanded || !shouldTruncate ? description : `${description.substring(0, maxLength)}...`

  return (
    <div>
      <p className="text-sm text-muted-foreground">{displayText}</p>
      {shouldTruncate && (
        <button onClick={toggleExpanded} className="text-xs text-blue-600 hover:underline mt-1">
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}

// Expandable HBI Insights Component
const ExpandableHBIInsights: React.FC<{ config: any[]; title: string }> = ({ config, title }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const itemsToShow = isExpanded ? config : config.slice(0, 3)
  const hasMore = config.length > 3

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {itemsToShow.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  item.type === "alert" ? "bg-red-500" : item.type === "warning" ? "bg-yellow-500" : "bg-green-500"
                }`}
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                {item.metric && <div className="text-xs text-blue-600 mt-1">{item.metric}</div>}
              </div>
            </div>
          ))}

          {hasMore && (
            <button onClick={toggleExpanded} className="text-xs text-blue-600 hover:underline">
              {isExpanded ? `Show less` : `Show ${config.length - 3} more insights`}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Pre-Construction Content Component
const PreConstructionContent: React.FC<{
  projectId: string
  projectData: any
  userRole: string
  user: any
}> = ({ projectId, projectData, userRole, user }) => {
  const [activePreconTab, setActivePreconTab] = useState<string>("estimating")

  const getBidPackageName = (packageId: string) => {
    const packages: { [key: string]: string } = {
      "MRC-001": "Concrete Work",
      "MRC-002": "Masonry Work",
      "MRC-003": "Metals",
      "MRC-004": "Wood, Plastics, and Composites",
      "MRC-005": "Thermal and Moisture Protection",
      "MRC-006": "Openings",
      "MRC-007": "Finishes",
      "MRC-008": "Specialties",
      "MRC-009": "Equipment",
      "MRC-010": "Furnishings",
      "MRC-011": "Special Construction",
      "MRC-012": "Conveying Equipment",
      "MRC-013": "Fire Suppression",
      "MRC-014": "Plumbing",
      "MRC-015": "HVAC",
      "MRC-016": "Electrical",
      "MRC-017": "Communications",
      "MRC-018": "Electronic Safety and Security",
      "MRC-019": "Instrumentation",
      "MRC-020": "Earthwork",
      "MRC-021": "Exterior Improvements",
      "MRC-022": "Utilities",
      "MRC-023": "Transportation",
      "MRC-024": "Hazardous Materials",
      "MRC-025": "Pollution Control",
      "MRC-026": "Process Equipment",
      "MRC-027": "Process Instrumentation",
      "MRC-028": "Process Electrical",
      "MRC-029": "Process Controls",
      "MRC-030": "General Requirements",
      "MRC-031": "Existing Conditions",
      "MRC-032": "Site Preparation",
      "MRC-033": "Concrete",
      "MRC-034": "Masonry",
      "MRC-035": "Metals",
      "MRC-036": "Wood and Plastics",
      "MRC-037": "Thermal and Moisture Protection",
      "MRC-038": "Doors and Windows",
      "MRC-039": "Finishes",
      "MRC-040": "Specialties",
      "MRC-041": "Equipment",
      "MRC-042": "Furnishings",
      "MRC-043": "Special Construction",
      "MRC-044": "Conveying Equipment",
      "MRC-045": "Fire Suppression",
      "MRC-046": "Plumbing",
      "MRC-047": "HVAC",
      "MRC-048": "Electrical",
      "MRC-049": "Communications",
      "MRC-050": "Electronic Safety and Security",
      "MRC-051": "Instrumentation",
      "MRC-052": "Earthwork",
      "MRC-053": "Exterior Improvements",
      "MRC-054": "Utilities",
      "MRC-055": "Transportation",
      "MRC-056": "Hazardous Materials",
      "MRC-057": "Pollution Control",
      "MRC-058": "Process Equipment",
      "MRC-059": "Process Instrumentation",
      "MRC-060": "Process Electrical",
      "MRC-061": "Process Controls",
      "MRC-062": "General Requirements",
      "MRC-063": "Existing Conditions",
      "MRC-064": "Site Preparation",
      "MRC-065": "Concrete",
      "MRC-066": "Masonry",
      "MRC-067": "Metals",
      "MRC-068": "Wood and Plastics",
      "MRC-069": "Thermal and Moisture Protection",
      "MRC-070": "Doors and Windows",
      "MRC-071": "Finishes",
      "MRC-072": "Specialties",
      "MRC-073": "Equipment",
      "MRC-074": "Furnishings",
      "MRC-075": "Special Construction",
      "MRC-076": "Conveying Equipment",
      "MRC-077": "Fire Suppression",
      "MRC-078": "Plumbing",
      "MRC-079": "HVAC",
      "MRC-080": "Electrical",
      "MRC-081": "Communications",
      "MRC-082": "Electronic Safety and Security",
    }
    return packages[packageId] || "Unknown Package"
  }

  const renderPreconTabContent = () => {
    switch (activePreconTab) {
      case "estimating":
        return (
          <EstimatingProvider>
            <EstimatingSuite projectId={projectId} projectData={projectData} user={user} userRole={userRole} />
          </EstimatingProvider>
        )

      case "pre-construction":
        return (
          <div className="space-y-6">
            {/* Pre-Construction Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Planning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        <Users className="h-4 w-4 mr-2" />
                        View Team Structure
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Team Member
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {projectData?.duration || "TBD"}
                      </div>
                      <p className="text-sm text-muted-foreground">Days Duration</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Schedule
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Milestone
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</div>
                      <p className="text-sm text-muted-foreground">Identified Risks</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        View Risk Register
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Risk Item
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pre-Construction Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Pre-Construction Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: "Contract Review", status: "completed", progress: 100 },
                    { task: "Site Survey", status: "in-progress", progress: 80 },
                    { task: "Permit Applications", status: "in-progress", progress: 45 },
                    { task: "Subcontractor Selection", status: "pending", progress: 25 },
                    { task: "Material Procurement", status: "pending", progress: 0 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === "completed"
                              ? "bg-green-500"
                              : item.status === "in-progress"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="font-medium">{item.task}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === "completed"
                                ? "bg-green-500"
                                : item.status === "in-progress"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{item.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "ids-bim-coordination":
        return (
          <div className="space-y-6">
            {/* IDS & BIM Coordination Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    BIM Models
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">7</div>
                      <p className="text-sm text-muted-foreground">Active Models</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        <Eye className="h-4 w-4 mr-2" />
                        Model Viewer
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Model
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Clash Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">15</div>
                      <p className="text-sm text-muted-foreground">Open Clashes</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        View Clashes
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Run Detection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Digital Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                      <p className="text-sm text-muted-foreground">Coordination</p>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        Model Reports
                      </Button>
                      <Button size="sm" variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Model
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* BIM Coordination Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  BIM Coordination Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { task: "Model Federation", status: "completed", progress: 100 },
                    { task: "Clash Detection Run", status: "in-progress", progress: 85 },
                    { task: "Trade Coordination", status: "in-progress", progress: 70 },
                    { task: "Model Updates", status: "pending", progress: 40 },
                    { task: "Final Coordination", status: "pending", progress: 0 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === "completed"
                              ? "bg-green-500"
                              : item.status === "in-progress"
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="font-medium">{item.task}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === "completed"
                                ? "bg-green-500"
                                : item.status === "in-progress"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">{item.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Card-based Tab Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div
          onClick={() => setActivePreconTab("estimating")}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            activePreconTab === "estimating"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-border hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Calculator className="h-6 w-6" />
            <span className="text-sm font-medium">Estimating</span>
            <span className="text-xs text-muted-foreground">Cost estimation and bidding tools</span>
          </div>
        </div>
        <div
          onClick={() => setActivePreconTab("pre-construction")}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            activePreconTab === "pre-construction"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-border hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Building2 className="h-6 w-6" />
            <span className="text-sm font-medium">Pre-Construction</span>
            <span className="text-xs text-muted-foreground">Planning and coordination activities</span>
          </div>
        </div>
        <div
          onClick={() => setActivePreconTab("ids-bim-coordination")}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            activePreconTab === "ids-bim-coordination"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-border hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Brain className="h-6 w-6" />
            <span className="text-sm font-medium">IDS & BIM Coordination</span>
            <span className="text-xs text-muted-foreground">Digital services and model coordination</span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">{renderPreconTabContent()}</div>
    </div>
  )
}

// Core tabs configuration matching the legacy page
const coreTabsConfig = [
  { id: "dashboard", label: "Dashboard", description: "Project overview and analytics", icon: BarChart3 },
  { id: "checklists", label: "Checklists", description: "Project startup and closeout checklists", icon: CheckSquare },
  {
    id: "productivity",
    label: "Productivity",
    description: "Threaded messaging and task management",
    icon: MessageSquare,
  },
  {
    id: "staffing",
    label: "Staffing",
    description: "Resource planning and scheduling",
    icon: Calendar,
  },
  {
    id: "responsibility-matrix",
    label: "Responsibility Matrix",
    description: "Role assignments and accountability",
    icon: Users,
  },
  {
    id: "reports",
    label: "Reports",
    description: "Comprehensive reporting dashboard with approval workflows",
    icon: FileText,
  },
]

// Staffing sub-tabs configuration
const staffingSubTabsConfig = [
  { id: "dashboard", label: "Dashboard", description: "Team overview and metrics", icon: BarChart3 },
  { id: "timeline", label: "Timeline", description: "Staffing timeline and scheduling", icon: Calendar },
  { id: "spcr", label: "SPCR", description: "Staffing plan change requests", icon: FileText },
]

// Warranty tabs configuration
const warrantyTabsConfig = [
  { id: "dashboard", label: "Dashboard", description: "Warranty overview and metrics", icon: BarChart3 },
  { id: "claim-center", label: "Claim Center", description: "Process and track warranty claims", icon: AlertTriangle },
  { id: "documents", label: "Documents", description: "Warranty documentation and certificates", icon: FileText },
  { id: "product-assistant", label: "Product Assistant", description: "AI-powered product information", icon: Brain },
  {
    id: "labor-warranty",
    label: "Labor Warranty Tracking",
    description: "Track labor warranties and service",
    icon: Users,
  },
]

// Warranty Management Content Component
const WarrantyManagementContent: React.FC<{
  projectId: string
  projectData: any
  userRole: string
  user: any
}> = ({ projectId, projectData, userRole, user }) => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isFocusMode, setIsFocusMode] = useState(false)

  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  const renderWarrantyTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 p-6 w-full max-w-full">
            {/* WarrantyDashboard - Quick View Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Open Claims</p>
                      <p className="text-2xl font-bold text-orange-600">8</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">2 urgent, 3 high priority</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Overdue Items</p>
                      <p className="text-2xl font-bold text-red-600">3</p>
                    </div>
                    <Clock className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Past resolution deadline</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Active Warranties</p>
                      <p className="text-2xl font-bold text-blue-600">24</p>
                    </div>
                    <Shield className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">12 labor, 12 manufacturer</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Resolution</p>
                      <p className="text-2xl font-bold text-green-600">4.2d</p>
                    </div>
                    <Target className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Within SLA target</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabbed Content Area */}
            <Tabs defaultValue="claims" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="warranty-types">Types</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="claims" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Warranty Claims</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "WC-001",
                          issue: "HVAC System Malfunction",
                          location: "Unit 4B",
                          status: "In Progress",
                          priority: "High",
                          assignee: "HVAC Subcontractor",
                          days: 5,
                        },
                        {
                          id: "WC-002",
                          issue: "Kitchen Faucet Leak",
                          location: "Unit 2A",
                          status: "Assigned",
                          priority: "Medium",
                          assignee: "Plumbing Team",
                          days: 2,
                        },
                        {
                          id: "WC-003",
                          issue: "Window Seal Failure",
                          location: "Unit 1C",
                          status: "Under Review",
                          priority: "Low",
                          assignee: "Quality Control",
                          days: 1,
                        },
                        {
                          id: "WC-004",
                          issue: "Electrical Outlet Issue",
                          location: "Unit 3B",
                          status: "Completed",
                          priority: "Medium",
                          assignee: "Electrical Sub",
                          days: 3,
                        },
                      ].map((claim) => (
                        <div
                          key={claim.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-sm">{claim.id}</span>
                              <Badge
                                variant={
                                  claim.priority === "High"
                                    ? "destructive"
                                    : claim.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {claim.priority}
                              </Badge>
                              <Badge variant={claim.status === "Completed" ? "default" : "outline"} className="text-xs">
                                {claim.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium mt-1">{claim.issue}</p>
                            <p className="text-xs text-muted-foreground">
                              {claim.location} • Assigned to {claim.assignee}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{claim.days} days ago</p>
                            <Button size="sm" variant="outline" className="mt-1">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="warranty-types" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Labor Warranties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">HVAC Installation</span>
                          <Badge variant="default">1 Year</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Electrical Work</span>
                          <Badge variant="default">2 Years</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Plumbing Systems</span>
                          <Badge variant="default">1 Year</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Manufacturer Warranties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Appliances</span>
                          <Badge variant="secondary">3-5 Years</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Windows</span>
                          <Badge variant="secondary">10 Years</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Roofing Materials</span>
                          <Badge variant="secondary">15 Years</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                {/* WarrantyReportingSuite */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Claims by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">HVAC</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Plumbing</span>
                          <span className="text-sm font-medium">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Electrical</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Other</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Resolution Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Resolution Time</span>
                          <span className="text-sm font-medium">4.2 days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Within Coverage</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Claims Rejected</span>
                          <span className="text-sm font-medium">8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Repeat Claims</span>
                          <span className="text-sm font-medium">12%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Export Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Claims Summary (PDF)
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Performance Report (Excel)
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Subcontractor Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )

      case "claim-center":
        return (
          <div className="space-y-6 p-6 w-full max-w-full">
            {/* WarrantyClaimCenter Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Warranty Claims Center</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive claim intake, assignment, and resolution management
                </p>
              </div>
              <Button className="h-8 px-3 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                New Claim
              </Button>
            </div>

            <Tabs defaultValue="intake" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="intake">Claim Intake</TabsTrigger>
                <TabsTrigger value="assignment">Assignment</TabsTrigger>
                <TabsTrigger value="resolution">Resolution Board</TabsTrigger>
                <TabsTrigger value="closure">Closure & Approval</TabsTrigger>
              </TabsList>

              {/* WarrantyClaimCenter - Claim Intake Form */}
              <TabsContent value="intake" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">New Warranty Claim</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Complete all required fields to submit a warranty claim
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Project/Unit *</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unit-4b">Unit 4B - Riverside Plaza</SelectItem>
                            <SelectItem value="unit-2a">Unit 2A - Riverside Plaza</SelectItem>
                            <SelectItem value="unit-1c">Unit 1C - Riverside Plaza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority *</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent (Safety/Security)</SelectItem>
                            <SelectItem value="high">High (Major System)</SelectItem>
                            <SelectItem value="medium">Medium (Standard)</SelectItem>
                            <SelectItem value="low">Low (Cosmetic)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Issue Category *</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hvac">HVAC Systems</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="appliances">Appliances</SelectItem>
                            <SelectItem value="windows">Windows & Doors</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Discovery *</label>
                        <input type="date" className="w-full px-3 py-2 border border-input rounded-md text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Issue Description *</label>
                      <textarea
                        className="w-full px-3 py-2 border border-input rounded-md text-sm min-h-[100px]"
                        placeholder="Provide detailed description of the issue, including symptoms and impact"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Supporting Files</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Drag & drop photos or documents, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">GPS location will be auto-tagged to photos</p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Submit Claim</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ClaimAssignmentPanel */}
              <TabsContent value="assignment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Claim Assignment Dashboard</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Assign claims to internal leads and external resolution teams
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          id: "WC-001",
                          issue: "HVAC System Malfunction",
                          location: "Unit 4B",
                          status: "New",
                          priority: "High",
                          submittedBy: "Property Manager",
                        },
                        {
                          id: "WC-005",
                          issue: "Garbage Disposal Issue",
                          location: "Unit 3A",
                          status: "Under Review",
                          priority: "Medium",
                          submittedBy: "Resident",
                        },
                        {
                          id: "WC-006",
                          issue: "Bathroom Fan Noise",
                          location: "Unit 1D",
                          status: "New",
                          priority: "Low",
                          submittedBy: "Warranty Manager",
                        },
                      ].map((claim) => (
                        <div key={claim.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{claim.id}</span>
                              <Badge
                                variant={
                                  claim.priority === "High"
                                    ? "destructive"
                                    : claim.priority === "Medium"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {claim.priority}
                              </Badge>
                              <Badge variant="outline">{claim.status}</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">Submitted by {claim.submittedBy}</span>
                          </div>

                          <div>
                            <p className="font-medium text-sm">{claim.issue}</p>
                            <p className="text-xs text-muted-foreground">{claim.location}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-medium">Internal Lead</label>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Assign lead" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="warranty-manager">Warranty Manager</SelectItem>
                                  <SelectItem value="trade-lead">Trade Lead</SelectItem>
                                  <SelectItem value="project-manager">Project Manager</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium">External Assignee</label>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Assign contractor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hvac-sub">HVAC Subcontractor</SelectItem>
                                  <SelectItem value="plumbing-sub">Plumbing Team</SelectItem>
                                  <SelectItem value="electrical-sub">Electrical Sub</SelectItem>
                                  <SelectItem value="general-sub">General Contractor</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium">Due Date</label>
                              <input type="date" className="w-full px-2 py-1 border border-input rounded text-xs h-8" />
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              Send Notification
                            </Button>
                            <Button size="sm">Assign Claim</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* IssueResolutionBoard - Kanban Style */}
              <TabsContent value="resolution" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resolution Workflow Board</CardTitle>
                    <p className="text-sm text-muted-foreground">Kanban-style tracking of warranty claim lifecycle</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* New Column */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">New</h4>
                          <Badge variant="secondary">2</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-card border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">WC-007</span>
                              <Badge variant="destructive" className="text-xs">
                                High
                              </Badge>
                            </div>
                            <p className="text-xs">Cabinet Door Alignment</p>
                            <p className="text-xs text-muted-foreground">Unit 2C</p>
                          </div>
                          <div className="bg-card border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">WC-008</span>
                              <Badge variant="secondary" className="text-xs">
                                Low
                              </Badge>
                            </div>
                            <p className="text-xs">Paint Touch-up Needed</p>
                            <p className="text-xs text-muted-foreground">Unit 1A</p>
                          </div>
                        </div>
                      </div>

                      {/* In Progress Column */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">In Progress</h4>
                          <Badge variant="secondary">3</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-card border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">WC-001</span>
                              <Badge variant="destructive" className="text-xs">
                                High
                              </Badge>
                            </div>
                            <p className="text-xs">HVAC System Malfunction</p>
                            <p className="text-xs text-muted-foreground">Unit 4B • HVAC Sub</p>
                            <div className="text-xs text-muted-foreground">Due: Tomorrow</div>
                          </div>
                          <div className="bg-card border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">WC-002</span>
                              <Badge variant="default" className="text-xs">
                                Medium
                              </Badge>
                            </div>
                            <p className="text-xs">Kitchen Faucet Leak</p>
                            <p className="text-xs text-muted-foreground">Unit 2A • Plumbing</p>
                          </div>
                        </div>
                      </div>

                      {/* Review Column */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Under Review</h4>
                          <Badge variant="secondary">1</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-card border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">WC-004</span>
                              <Badge variant="default" className="text-xs">
                                Medium
                              </Badge>
                            </div>
                            <p className="text-xs">Electrical Outlet Issue</p>
                            <p className="text-xs text-muted-foreground">Unit 3B • Completed</p>
                            <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                              Review Work
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Closed Column */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Closed</h4>
                          <Badge variant="secondary">12</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-card border rounded-lg p-3 space-y-2 opacity-75">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">WC-003</span>
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            </div>
                            <p className="text-xs">Window Seal Repair</p>
                            <p className="text-xs text-muted-foreground">Unit 1C • Approved</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ClosureApprovalFlow */}
              <TabsContent value="closure" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Closure & Approval Workflow</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Review completed work and manage client approval process
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          id: "WC-004",
                          issue: "Electrical Outlet Issue",
                          location: "Unit 3B",
                          contractor: "Electrical Sub",
                          completedDate: "2024-01-15",
                          workSummary: "Replaced faulty GFCI outlet and tested all circuits in unit",
                          photos: 3,
                          clientApproval: "pending",
                        },
                        {
                          id: "WC-009",
                          issue: "Dishwasher Installation",
                          location: "Unit 5A",
                          contractor: "Appliance Team",
                          completedDate: "2024-01-14",
                          workSummary: "Installed replacement dishwasher and verified all connections",
                          photos: 5,
                          clientApproval: "approved",
                        },
                      ].map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{item.id}</span>
                              <Badge variant={item.clientApproval === "approved" ? "default" : "outline"}>
                                {item.clientApproval === "approved" ? "Client Approved" : "Pending Approval"}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">Completed: {item.completedDate}</span>
                          </div>

                          <div>
                            <p className="font-medium text-sm">{item.issue}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.location} • {item.contractor}
                            </p>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-3">
                            <h5 className="text-xs font-medium mb-1">Work Summary:</h5>
                            <p className="text-xs">{item.workSummary}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.photos} photos attached</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View Photos
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Contact Client
                            </Button>
                            <Button size="sm" variant={item.clientApproval === "approved" ? "default" : "outline"}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {item.clientApproval === "approved" ? "Approved" : "Approve & Close"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )

      case "documents":
        return (
          <div className="space-y-6 p-6 w-full max-w-full">
            {/* WarrantyDocumentsRepository Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Warranty Documents Repository</h3>
                <p className="text-sm text-muted-foreground">
                  Centralized management of all warranty documentation and certificates
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="h-8 px-3 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Batch Export
                </Button>
                <Button className="h-8 px-3 text-xs">
                  <Upload className="h-3 w-3 mr-1" />
                  Upload Document
                </Button>
              </div>
            </div>

            <Tabs defaultValue="labor" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="labor">Labor Warranties</TabsTrigger>
                <TabsTrigger value="manufacturer">Manufacturer</TabsTrigger>
                <TabsTrigger value="completion">Completion Docs</TabsTrigger>
                <TabsTrigger value="monitoring">Expiration Monitor</TabsTrigger>
              </TabsList>

              {/* Labor Warranty Documents */}
              <TabsContent value="labor" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Labor Warranty Certificates</CardTitle>
                    <p className="text-sm text-muted-foreground">Organized by subcontractor and trade package</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          contractor: "ABC HVAC Systems",
                          trade: "HVAC",
                          csiCode: "23 00 00",
                          documents: 3,
                          expiration: "2025-06-15",
                          status: "Active",
                        },
                        {
                          contractor: "Pro Plumbing Co.",
                          trade: "Plumbing",
                          csiCode: "22 00 00",
                          documents: 2,
                          expiration: "2025-03-20",
                          status: "Active",
                        },
                        {
                          contractor: "Elite Electrical",
                          trade: "Electrical",
                          csiCode: "26 00 00",
                          documents: 4,
                          expiration: "2025-08-10",
                          status: "Active",
                        },
                        {
                          contractor: "Master Flooring",
                          trade: "Flooring",
                          csiCode: "09 60 00",
                          documents: 1,
                          expiration: "2025-01-30",
                          status: "Expiring Soon",
                        },
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{item.contractor}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.trade}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  CSI {item.csiCode}
                                </Badge>
                                <Badge
                                  variant={item.status === "Active" ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.documents} warranty documents • Expires: {item.expiration}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Manufacturer Warranty Documents */}
              <TabsContent value="manufacturer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manufacturer Warranties</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Product warranties organized by vendor and equipment type
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          vendor: "Carrier Corporation",
                          product: "HVAC Equipment",
                          model: "Model 42ABC",
                          serial: "SN123456789",
                          warranty: "5 Years",
                          expiration: "2029-04-15",
                          status: "Active",
                        },
                        {
                          vendor: "GE Appliances",
                          product: "Kitchen Appliances",
                          model: "Various Models",
                          serial: "Multiple",
                          warranty: "2 Years",
                          expiration: "2026-12-01",
                          status: "Active",
                        },
                        {
                          vendor: "Kohler Company",
                          product: "Plumbing Fixtures",
                          model: "K-Series",
                          serial: "Multiple",
                          warranty: "Limited Lifetime",
                          expiration: "Lifetime",
                          status: "Active",
                        },
                        {
                          vendor: "Pella Windows",
                          product: "Windows & Doors",
                          model: "Impervia Series",
                          serial: "Multiple",
                          warranty: "10 Years",
                          expiration: "2034-02-20",
                          status: "Active",
                        },
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{item.vendor}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.product}
                                </Badge>
                                <Badge variant="default" className="text-xs">
                                  {item.warranty}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.model} • Serial: {item.serial} • Expires: {item.expiration}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                Certificate
                              </Button>
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Completion Documents */}
              <TabsContent value="completion" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Completion & Acceptance Forms</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Project completion documentation and closeout packages
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "Certificate of Occupancy",
                          date: "2024-01-15",
                          status: "Approved",
                          fileType: "PDF",
                          size: "2.4 MB",
                        },
                        {
                          type: "Final Inspection Report",
                          date: "2024-01-12",
                          status: "Approved",
                          fileType: "PDF",
                          size: "1.8 MB",
                        },
                        {
                          type: "Punch List - Final",
                          date: "2024-01-10",
                          status: "Completed",
                          fileType: "PDF",
                          size: "945 KB",
                        },
                        {
                          type: "Closeout Package",
                          date: "2024-01-08",
                          status: "Submitted",
                          fileType: "ZIP",
                          size: "15.2 MB",
                        },
                        {
                          type: "As-Built Drawings",
                          date: "2024-01-05",
                          status: "Approved",
                          fileType: "DWG",
                          size: "8.7 MB",
                        },
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{item.type}</span>
                                <Badge
                                  variant={item.status === "Approved" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.date} • {item.fileType} • {item.size}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Expiration Monitoring */}
              <TabsContent value="monitoring" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Expiring Soon</p>
                          <p className="text-2xl font-bold text-orange-600">3</p>
                        </div>
                        <AlertTriangle className="h-8 w-8 text-orange-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Within 30 days</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Expired</p>
                          <p className="text-2xl font-bold text-red-600">1</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Renewal Alerts</p>
                          <p className="text-2xl font-bold text-blue-600">2</p>
                        </div>
                        <Bell className="h-8 w-8 text-blue-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Sent this month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Warranty Expiration Timeline</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Monitor warranty expiration dates and renewal requirements
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          item: "Master Flooring - Labor Warranty",
                          type: "Labor",
                          expiration: "2025-01-30",
                          daysUntil: 15,
                          status: "Expiring Soon",
                          action: "Contact contractor",
                        },
                        {
                          item: "Kitchen Appliances - GE Warranty",
                          type: "Manufacturer",
                          expiration: "2025-02-15",
                          daysUntil: 31,
                          status: "Expiring Soon",
                          action: "Review coverage",
                        },
                        {
                          item: "HVAC System - Carrier Warranty",
                          type: "Manufacturer",
                          expiration: "2025-06-15",
                          daysUntil: 152,
                          status: "Active",
                          action: "Monitor",
                        },
                        {
                          item: "Windows - Pella Warranty",
                          type: "Manufacturer",
                          expiration: "2034-02-20",
                          daysUntil: 3320,
                          status: "Active",
                          action: "Monitor",
                        },
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{item.item}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                                <Badge
                                  variant={item.status === "Active" ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Expires: {item.expiration} • {item.daysUntil} days remaining
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Bell className="h-3 w-3 mr-1" />
                                Set Alert
                              </Button>
                              <Button size="sm" variant="outline">
                                {item.action}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )

      case "product-assistant":
        return (
          <div className="space-y-6 p-6 w-full max-w-full">
            {/* ManufacturerWarrantyAssistant Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Manufacturer Warranty Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Connect clients with manufacturers and manage warranty handoffs
                </p>
              </div>
              <Button className="h-8 px-3 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                New Connection
              </Button>
            </div>

            <Tabs defaultValue="connections" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connections">Client Connections</TabsTrigger>
                <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
                <TabsTrigger value="handoff">Handoff Management</TabsTrigger>
              </TabsList>

              {/* Client Connections */}
              <TabsContent value="connections" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manufacturer Contact Directory</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Registered manufacturers and vendors with contact information
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          company: "Carrier Corporation",
                          category: "HVAC Equipment",
                          contact: "warranty@carrier.com",
                          phone: "1-800-CARRIER",
                          website: "www.carrier.com/warranty",
                          products: 5,
                          activeWarranties: 3,
                          status: "Active",
                        },
                        {
                          company: "GE Appliances",
                          category: "Kitchen Appliances",
                          contact: "support@geappliances.com",
                          phone: "1-800-GE-CARES",
                          website: "www.geappliances.com/support",
                          products: 12,
                          activeWarranties: 8,
                          status: "Active",
                        },
                        {
                          company: "Kohler Company",
                          category: "Plumbing Fixtures",
                          contact: "warranty@kohler.com",
                          phone: "1-800-KOHLER-1",
                          website: "www.kohler.com/warranty",
                          products: 7,
                          activeWarranties: 6,
                          status: "Active",
                        },
                        {
                          company: "Pella Windows",
                          category: "Windows & Doors",
                          contact: "warranty@pella.com",
                          phone: "1-877-473-5527",
                          website: "www.pella.com/warranty",
                          products: 3,
                          activeWarranties: 3,
                          status: "Active",
                        },
                      ].map((manufacturer, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">{manufacturer.company}</span>
                                <Badge variant="outline" className="text-xs">
                                  {manufacturer.category}
                                </Badge>
                                <Badge variant="default" className="text-xs">
                                  {manufacturer.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Contact Information</p>
                                  <p className="text-xs">{manufacturer.contact}</p>
                                  <p className="text-xs">{manufacturer.phone}</p>
                                  <p className="text-xs text-blue-600 hover:underline cursor-pointer">
                                    {manufacturer.website}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs text-muted-foreground">Coverage Statistics</p>
                                  <p className="text-xs">{manufacturer.products} products registered</p>
                                  <p className="text-xs">{manufacturer.activeWarranties} active warranties</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Connect Client
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Coverage Details */}
              <TabsContent value="coverage" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Coverage Database</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Detailed warranty coverage, serial numbers, and terms
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          product: "Carrier HVAC Unit",
                          model: "Model 42ABC-123",
                          serial: "SN123456789",
                          warranty: "5 Year Parts & Labor",
                          expiration: "2029-04-15",
                          coverage:
                            "Full system coverage including compressor, heat exchanger, and electrical components",
                          exclusions: "Filters, user maintenance items",
                          location: "Unit 4B - Main System",
                        },
                        {
                          product: "GE Dishwasher",
                          model: "GDF570SSJSS",
                          serial: "SN987654321",
                          warranty: "2 Year Limited",
                          expiration: "2026-12-01",
                          coverage: "Parts and labor for manufacturing defects",
                          exclusions: "Normal wear, user damage",
                          location: "Unit 2A - Kitchen",
                        },
                        {
                          product: "Kohler Kitchen Faucet",
                          model: "K-596-VS",
                          serial: "Multiple Units",
                          warranty: "Limited Lifetime",
                          expiration: "Lifetime",
                          coverage: "Finish and function under normal use",
                          exclusions: "Commercial use, abuse",
                          location: "Various Units",
                        },
                      ].map((item, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{item.product}</span>
                              <Badge variant="outline" className="text-xs">
                                {item.warranty}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Expires: {item.expiration}
                              </Badge>
                            </div>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View Certificate
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Model:</span> {item.model}
                              </div>
                              <div>
                                <span className="font-medium">Serial:</span> {item.serial}
                              </div>
                              <div>
                                <span className="font-medium">Location:</span> {item.location}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Coverage:</span> {item.coverage}
                              </div>
                              <div>
                                <span className="font-medium">Exclusions:</span> {item.exclusions}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Handoff Management */}
              <TabsContent value="handoff" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client-Manufacturer Handoff Management</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Manage warranty claim handoffs and communication tracking
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          claimId: "WH-001",
                          client: "Riverside Plaza - Unit 4B",
                          manufacturer: "Carrier Corporation",
                          product: "HVAC Unit Model 42ABC",
                          issue: "Cooling system not maintaining temperature",
                          status: "Handoff Complete",
                          handoffDate: "2024-01-10",
                          followUpDate: "2024-01-17",
                          correspondence: 3,
                        },
                        {
                          claimId: "WH-002",
                          client: "Riverside Plaza - Unit 2A",
                          manufacturer: "GE Appliances",
                          product: "Kitchen Dishwasher",
                          issue: "Not draining properly after wash cycles",
                          status: "Pending Handoff",
                          handoffDate: "Scheduled for 2024-01-20",
                          followUpDate: "Pending",
                          correspondence: 1,
                        },
                        {
                          claimId: "WH-003",
                          client: "Riverside Plaza - Unit 1C",
                          manufacturer: "Pella Windows",
                          product: "Sliding Patio Door",
                          issue: "Seal failure causing air leakage",
                          status: "In Progress",
                          handoffDate: "2024-01-05",
                          followUpDate: "2024-01-12",
                          correspondence: 5,
                        },
                      ].map((handoff, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{handoff.claimId}</span>
                              <Badge
                                variant={
                                  handoff.status === "Handoff Complete"
                                    ? "default"
                                    : handoff.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {handoff.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {handoff.correspondence} messages
                              </Badge>
                            </div>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              View Messages
                            </Button>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p>
                                  <span className="font-medium">Client:</span> {handoff.client}
                                </p>
                                <p>
                                  <span className="font-medium">Product:</span> {handoff.product}
                                </p>
                                <p>
                                  <span className="font-medium">Issue:</span> {handoff.issue}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Manufacturer:</span> {handoff.manufacturer}
                                </p>
                                <p>
                                  <span className="font-medium">Handoff Date:</span> {handoff.handoffDate}
                                </p>
                                <p>
                                  <span className="font-medium">Follow-up:</span> {handoff.followUpDate}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              Generate Cover Letter
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Export Package
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3 mr-1" />
                              Contact Manufacturer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )

      case "labor-warranty":
        return (
          <div className="space-y-6 p-6 w-full max-w-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Labor Warranty Tracking</h3>
                <p className="text-sm text-muted-foreground">Track labor warranties and service commitments</p>
              </div>
              <Button className="h-8 px-3 text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Add Labor Warranty
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Labor Warranty Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Labor Warranties</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Upcoming Expirations</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Service Calls</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coverage Value</span>
                      <span className="text-sm font-medium">$450K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Response Time</span>
                      <span className="text-sm font-medium">2.5 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Satisfaction Rate</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  const mainContent = (
    <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
      {/* Module Title with Focus Button */}
      <div className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Warranty Management Tools</h2>
            <p className="text-sm text-muted-foreground">Comprehensive warranty management and claim processing</p>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {warrantyTabsConfig.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
              activeTab === tab.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-border hover:border-gray-300 dark:hover:border-gray-600"
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
        <div className="w-full min-w-0 max-w-full h-full overflow-hidden">{renderWarrantyTabContent()}</div>
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

  return mainContent
}

// Enhanced Trade Partners Panel with Compass Integration
const TradePartnersPanel: React.FC<{
  projectId: string
  projectData: any
  userRole: string
}> = ({ projectId, projectData, userRole }) => {
  const [activeView, setActiveView] = useState<"directory" | "project" | "scorecard">("directory")
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [tradeFilter, setTradeFilter] = useState<string>("all")
  const [compassScoreRange, setCompassScoreRange] = useState([0, 100])
  const [internalScoreRange, setInternalScoreRange] = useState([0, 100])
  const [showScorecardModal, setShowScorecardModal] = useState(false)

  // Mock Compass API Data
  const mockCompassData = [
    {
      id: "comp-001",
      companyName: "Climate Control Systems",
      trade: "HVAC",
      region: "Southeast",
      unionStatus: "Non-Union",
      licenses: ["EPA 608", "NATE Certified"],
      compassQScore: 87,
      complianceStatus: "Compliant",
      dbeMbeWbe: ["MBE"],
      contactInfo: {
        primary: "John Smith",
        email: "john@climatecontrol.com",
        phone: "(555) 123-4567",
      },
      projectHistory: [
        { project: "Downtown Plaza", year: "2023", value: "$2.1M", performance: "Excellent" },
        { project: "Metro Office", year: "2022", value: "$1.8M", performance: "Good" },
      ],
      documentStatus: {
        insurance: "Current",
        bond: "Current",
        license: "Current",
        safety: "Current",
      },
    },
    {
      id: "comp-002",
      companyName: "PowerTech Solutions",
      trade: "Electrical",
      region: "Southeast",
      unionStatus: "Union",
      licenses: ["Master Electrician", "OSHA 30"],
      compassQScore: 92,
      complianceStatus: "Compliant",
      dbeMbeWbe: [],
      contactInfo: {
        primary: "Sarah Johnson",
        email: "sarah@powertech.com",
        phone: "(555) 234-5678",
      },
      projectHistory: [
        { project: "Tech Campus", year: "2023", value: "$3.2M", performance: "Excellent" },
        { project: "Retail Center", year: "2022", value: "$2.4M", performance: "Good" },
      ],
      documentStatus: {
        insurance: "Current",
        bond: "Current",
        license: "Current",
        safety: "Expires Soon",
      },
    },
    {
      id: "comp-003",
      companyName: "AquaFlow Plumbing",
      trade: "Plumbing",
      region: "Southeast",
      unionStatus: "Non-Union",
      licenses: ["Master Plumber", "Green Plumber"],
      compassQScore: 78,
      complianceStatus: "Minor Issues",
      dbeMbeWbe: ["WBE"],
      contactInfo: {
        primary: "Mike Wilson",
        email: "mike@aquaflow.com",
        phone: "(555) 345-6789",
      },
      projectHistory: [
        { project: "Hospital Wing", year: "2023", value: "$1.5M", performance: "Fair" },
        { project: "School Renovation", year: "2022", value: "$890K", performance: "Good" },
      ],
      documentStatus: {
        insurance: "Current",
        bond: "Current",
        license: "Current",
        safety: "Current",
      },
    },
  ]

  // Mock Internal HB Intel Scores
  const mockInternalScores = [
    {
      subcontractorId: "comp-001",
      hbIntelScore: 89,
      projectScores: {
        communication: 9,
        coordination: 8,
        quality: 9,
        responsiveness: 9,
      },
      tags: ["would-hire-again", "reliable"],
      comments: "Excellent communication and quality work. Always meets deadlines.",
      wouldHireAgain: true,
      needsSupervision: false,
      avoidCriticalPath: false,
      reviewedBy: "Alex Singh",
      reviewDate: "2024-01-15",
      attachments: ["safety_report.pdf", "quality_photos.jpg"],
    },
    {
      subcontractorId: "comp-002",
      hbIntelScore: 94,
      projectScores: {
        communication: 10,
        coordination: 9,
        quality: 9,
        responsiveness: 9,
      },
      tags: ["would-hire-again", "preferred-vendor"],
      comments: "Outstanding performance across all metrics. Highly recommended.",
      wouldHireAgain: true,
      needsSupervision: false,
      avoidCriticalPath: false,
      reviewedBy: "Dana Nguyen",
      reviewDate: "2024-02-20",
      attachments: ["project_completion_report.pdf"],
    },
    {
      subcontractorId: "comp-003",
      hbIntelScore: 72,
      projectScores: {
        communication: 7,
        coordination: 6,
        quality: 8,
        responsiveness: 7,
      },
      tags: ["needs-supervision"],
      comments: "Good quality work but requires close coordination on scheduling.",
      wouldHireAgain: true,
      needsSupervision: true,
      avoidCriticalPath: false,
      reviewedBy: "Michael Lee",
      reviewDate: "2024-03-10",
      attachments: [],
    },
  ]

  // Mock Project-Specific Data
  const mockProjectSubcontractors = [
    {
      ...mockCompassData[0],
      projectStatus: "Under Consideration",
      estimatingPhase: "Buyout",
      lastContact: "2024-01-20",
      bidStatus: "Pending",
      notes: "Competitive pricing, good reputation",
    },
    {
      ...mockCompassData[1],
      projectStatus: "Contracted",
      estimatingPhase: "Awarded",
      lastContact: "2024-02-01",
      bidStatus: "Awarded",
      notes: "Best value, excellent references",
    },
    {
      ...mockCompassData[2],
      projectStatus: "Qualified",
      estimatingPhase: "Prequalification",
      lastContact: "2024-01-15",
      bidStatus: "Invited",
      notes: "Local contractor, needs supervision",
    },
  ]

  const getInternalScore = (subcontractorId: string) => {
    return mockInternalScores.find((score) => score.subcontractorId === subcontractorId)
  }

  const getCompassStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "text-green-600 dark:text-green-500"
      case "Minor Issues":
        return "text-yellow-600 dark:text-yellow-500"
      case "Non-Compliant":
        return "text-red-600 dark:text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "Contracted":
        return "text-green-600 dark:text-green-500"
      case "Qualified":
        return "text-blue-600 dark:text-blue-500"
      case "Under Consideration":
        return "text-yellow-600 dark:text-yellow-500"
      case "Rejected":
        return "text-red-600 dark:text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const filteredData = mockCompassData.filter((sub) => {
    const matchesSearch =
      sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.trade.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTrade = !tradeFilter || tradeFilter === "all" || sub.trade === tradeFilter
    const matchesCompassScore = sub.compassQScore >= compassScoreRange[0] && sub.compassQScore <= compassScoreRange[1]
    const internalScore = getInternalScore(sub.id)
    const matchesInternalScore =
      !internalScore ||
      (internalScore.hbIntelScore >= internalScoreRange[0] && internalScore.hbIntelScore <= internalScoreRange[1])

    return matchesSearch && matchesTrade && matchesCompassScore && matchesInternalScore
  })

  const renderRegionalDirectoryView = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trade Partner Directory</CardTitle>
          <p className="text-sm text-muted-foreground">Complete regional directory powered by Compass API</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <input
                type="text"
                placeholder="Company name or trade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md text-sm bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trade</label>
              <Select value={tradeFilter} onValueChange={setTradeFilter}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="All trades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="HVAC">HVAC</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Concrete">Concrete</SelectItem>
                  <SelectItem value="Steel">Steel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Compass Score Range</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={compassScoreRange[0]}
                  onChange={(e) => setCompassScoreRange([parseInt(e.target.value), compassScoreRange[1]])}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-16">
                  {compassScoreRange[0]}-{compassScoreRange[1]}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Actions</label>
              <div className="flex space-x-2 mt-1">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Trade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Compass Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    HB Intel Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Certifications
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredData.map((sub) => {
                  const internalScore = getInternalScore(sub.id)
                  return (
                    <tr key={sub.id} className="hover:bg-muted/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-foreground">{sub.companyName}</div>
                          <div className="text-sm text-muted-foreground">{sub.contactInfo.primary}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs">
                          {sub.trade}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium">{sub.compassQScore}</div>
                          <div className="ml-2 text-xs text-muted-foreground">Compass</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {internalScore ? (
                          <div className="flex items-center">
                            <div className="text-sm font-medium">{internalScore.hbIntelScore}</div>
                            <div className="ml-2 text-xs text-muted-foreground">Internal</div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/70">Not Rated</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getCompassStatusColor(sub.complianceStatus)}`}>
                          {sub.complianceStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {sub.dbeMbeWbe.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedSubcontractor(sub)}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSubcontractor(sub)
                              setShowScorecardModal(true)
                            }}
                          >
                            Score
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderProjectView = () => (
    <div className="space-y-6">
      {/* Project Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Trade Partners</CardTitle>
          <p className="text-sm text-muted-foreground">
            Subcontractors under consideration or contracted for this project
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">8</div>
              <div className="text-sm text-muted-foreground">Under Consideration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-500">3</div>
              <div className="text-sm text-muted-foreground">Contracted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">5</div>
              <div className="text-sm text-muted-foreground">Qualified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-500">2</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Trade Partners Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compass Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HB Intel Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockProjectSubcontractors.map((sub) => {
                  const internalScore = getInternalScore(sub.id)
                  return (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{sub.companyName}</div>
                          <div className="text-sm text-gray-500">{sub.notes}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="text-xs">
                          {sub.trade}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{sub.compassQScore}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {internalScore ? (
                          <div className="text-sm font-medium">{internalScore.hbIntelScore}</div>
                        ) : (
                          <span className="text-xs text-gray-400">Not Rated</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm ${getProjectStatusColor(sub.projectStatus)}`}>
                          {sub.projectStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {sub.estimatingPhase}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedSubcontractor(sub)}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSubcontractor(sub)
                              setShowScorecardModal(true)
                            }}
                          >
                            Score
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderScorecardView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Internal Subcontractor Scorecards</CardTitle>
          <p className="text-sm text-muted-foreground">
            Internal performance reviews and ratings (not synced with Compass)
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInternalScores.map((score) => {
              const sub = mockCompassData.find((s) => s.id === score.subcontractorId)
              if (!sub) return null

              return (
                <div key={score.subcontractorId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{sub.companyName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {sub.trade} • Reviewed by {score.reviewedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600 dark:text-green-500">{score.hbIntelScore}</div>
                      <div className="text-sm text-muted-foreground">HB Intel Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Communication</div>
                      <div className="text-lg font-medium">{score.projectScores.communication}/10</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Coordination</div>
                      <div className="text-lg font-medium">{score.projectScores.coordination}/10</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Quality</div>
                      <div className="text-lg font-medium">{score.projectScores.quality}/10</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Responsiveness</div>
                      <div className="text-lg font-medium">{score.projectScores.responsiveness}/10</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {score.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Comments</div>
                    <p className="text-sm text-muted-foreground">{score.comments}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Last updated: {score.reviewDate}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSubcontractor(sub)
                        setShowScorecardModal(true)
                      }}
                    >
                      Update Score
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Card-based Tab Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div
          onClick={() => setActiveView("directory")}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            activeView === "directory"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-border hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Building className="h-6 w-6" />
            <span className="text-sm font-medium">Directory</span>
            <span className="text-xs text-muted-foreground">Complete regional directory</span>
          </div>
        </div>
        <div
          onClick={() => setActiveView("project")}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            activeView === "project"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-border hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Briefcase className="h-6 w-6" />
            <span className="text-sm font-medium">Project View</span>
            <span className="text-xs text-muted-foreground">Project-specific trade partners</span>
          </div>
        </div>
        <div
          onClick={() => setActiveView("scorecard")}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
            activeView === "scorecard"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
              : "border-border hover:border-gray-300 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <Star className="h-6 w-6" />
            <span className="text-sm font-medium">Scorecards</span>
            <span className="text-xs text-muted-foreground">Internal performance reviews</span>
          </div>
        </div>
      </div>

      {/* View Content */}
      {activeView === "directory" && renderRegionalDirectoryView()}
      {activeView === "project" && renderProjectView()}
      {activeView === "scorecard" && renderScorecardView()}
    </div>
  )
}

// Import the enhanced Contract Documents component
import { EnhancedContractDocuments } from "@/components/compliance/EnhancedContractDocuments"

// Compliance Management Content Component
const ComplianceContent: React.FC<{
  projectId: string
  projectData: any
  userRole: string
  user: any
}> = ({ projectId, projectData, userRole, user }) => {
  const [activeTab, setActiveTab] = useState("contract-documents")
  const [isFocusMode, setIsFocusMode] = useState(false)

  const handleFocusToggle = () => {
    setIsFocusMode(!isFocusMode)
  }

  // Tab configuration
  const complianceTabsConfig = [
    {
      id: "contract-documents",
      label: "Contract Documents",
      icon: FileText,
      description: "Contract management and documentation",
    },
    {
      id: "trade-partners",
      label: "Trade Partners",
      icon: Users,
      description: "Trade partner compliance and certifications",
    },
  ]

  const renderComplianceTabContent = () => {
    switch (activeTab) {
      case "contract-documents":
        return (
          <EnhancedContractDocuments projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
        )

      case "trade-partners":
        return <TradePartnersPanel projectId={projectId} projectData={projectData} userRole={userRole} />

      default:
        return null
    }
  }

  // Main content
  const mainContent = (
    <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
      {/* Module Title with Focus Button */}
      <div className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Compliance Tools</h2>
            <p className="text-sm text-muted-foreground">Contract management and trade partner compliance</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 flex-shrink-0">
        {complianceTabsConfig.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm ${
              activeTab === tab.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                : "border-border hover:border-gray-300 dark:hover:border-gray-600"
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
        <div className="w-full min-w-0 max-w-full h-full overflow-hidden">{renderComplianceTabContent()}</div>
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

  return mainContent
}

const ProjectControlCenterContent: React.FC<ProjectControlCenterContentProps> = ({
  projectId,
  projectData,
  userRole,
  user,
  activeTab = "core",
  onTabChange,
  onSidebarContentChange,
}) => {
  const [navigation, setNavigation] = useState<NavigationState>({
    category: null,
    tool: null,
    subTool: null,
  })
  const [mounted, setMounted] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Extract project name from project data
  const projectName = projectData?.name || `Project ${projectId}`

  // Project metrics (calculated or from data)
  const projectMetrics = {
    totalBudget: projectData?.contract_value || 75000000,
    spentToDate: projectData?.contract_value ? projectData.contract_value * 0.68 : 51000000,
    scheduleProgress: 72,
    budgetProgress: 68,
    activeTeamMembers: 24,
    completedMilestones: 8,
    totalMilestones: 12,
    activeRFIs: 5,
    changeOrders: 3,
    riskItems: 2,
  }

  // Get HBI Insights title based on active tab
  const getHBIInsightsTitle = () => {
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      return "HBI Financial Hub Insights"
    }
    return "HBI Core Tools Insights"
  }

  // Handle core tab changes
  const handleCoreTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      coreTab: tabId,
      staffingSubTab: "dashboard", // Reset staffing sub-tab when changing core tab
      reportsSubTab: "dashboard", // Reset reports sub-tab when changing core tab
    }))
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // Handle staffing sub-tab changes
  const handleStaffingSubTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      staffingSubTab: tabId,
    }))
  }

  // Handle reports sub-tab changes
  const handleReportsSubTabChange = (tabId: string) => {
    setNavigation((prev) => ({
      ...prev,
      reportsSubTab: tabId,
    }))
  }

  // Get sidebar content for main app injection
  const getSidebarContent = () => {
    return (
      <SidebarPanelRenderer
        activePanel="all"
        projectId={projectId}
        projectData={projectData}
        user={user}
        userRole={userRole}
        navigation={navigation}
        projectMetrics={projectMetrics}
        getHBIInsightsTitle={getHBIInsightsTitle}
        getHBIInsights={getHBIInsights}
        activeTab={activeTab}
      />
    )
  }

  // Update sidebar content when activeTab changes
  React.useEffect(() => {
    if (onSidebarContentChange) {
      onSidebarContentChange(getSidebarContent())
    }
  }, [
    activeTab,
    navigation.coreTab,
    navigation.tool,
    navigation.subTool,
    onSidebarContentChange,
    projectId,
    projectData,
    user,
    userRole,
    projectMetrics,
  ])

  // Get quick actions based on current core tab
  const getQuickActions = () => {
    if (navigation.coreTab === "reports") {
      return [
        { label: "Create Report", icon: Plus, onClick: () => {} },
        { label: "View Reports", icon: Eye, onClick: () => {} },
        { label: "Report Analytics", icon: BarChart3, onClick: () => {} },
        { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Checklist", icon: CheckSquare, onClick: () => {} },
        { label: "Closeout Checklist", icon: CheckCircle, onClick: () => {} },
        { label: "Export Checklist", icon: Download, onClick: () => {} },
        { label: "Update Progress", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "New Message", icon: MessageSquare, onClick: () => {} },
        { label: "Create Task", icon: Plus, onClick: () => {} },
        { label: "View Tasks", icon: CheckSquare, onClick: () => {} },
        { label: "Team Updates", icon: Users, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "View Timeline", icon: Calendar, onClick: () => {} },
        { label: "Create SPCR", icon: FileText, onClick: () => {} },
        { label: "Assign Staff", icon: Users, onClick: () => {} },
        { label: "Export Schedule", icon: Download, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "responsibility-matrix") {
      return [
        { label: "Update Matrix", icon: Users, onClick: () => {} },
        { label: "Assign Roles", icon: Shield, onClick: () => {} },
        { label: "Export Matrix", icon: Download, onClick: () => {} },
        { label: "View History", icon: History, onClick: () => {} },
      ]
    }

    // Default dashboard actions
    return [
      { label: "Schedule Review", icon: Calendar, onClick: () => {} },
      { label: "Budget Analysis", icon: DollarSign, onClick: () => {} },
      { label: "Team Management", icon: Users, onClick: () => {} },
      { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
    ]
  }

  // Get key metrics based on current core tab
  const getKeyMetrics = () => {
    if (navigation.coreTab === "reports") {
      return [
        { label: "Total Reports", value: "0", color: "blue" },
        { label: "Pending Approval", value: "0", color: "yellow" },
        { label: "Approved", value: "0", color: "green" },
        { label: "Approval Rate", value: "0%", color: "emerald" },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Items", value: "65", color: "blue" },
        { label: "StartUp Complete", value: "78%", color: "green" },
        { label: "Closeout Items", value: "35", color: "purple" },
        { label: "Closeout Complete", value: "12%", color: "orange" },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "Active Tasks", value: "12", color: "blue" },
        { label: "Completed Today", value: "8", color: "green" },
        { label: "Unread Messages", value: "4", color: "orange" },
        { label: "Team Activity", value: "92%", color: "purple" },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "Active Staff", value: "12", color: "blue" },
        { label: "Assignments", value: "18", color: "green" },
        { label: "Positions", value: "8", color: "purple" },
        { label: "Avg Duration", value: "45d", color: "orange" },
      ]
    } else if (navigation.coreTab === "responsibility-matrix") {
      return [
        { label: "Total Roles", value: "15", color: "blue" },
        { label: "Assigned", value: "13", color: "green" },
        { label: "Unassigned", value: "2", color: "orange" },
        { label: "Coverage", value: "87%", color: "purple" },
      ]
    }

    // Default project metrics
    return [
      {
        label: "Milestones",
        value: `${projectMetrics.completedMilestones}/${projectMetrics.totalMilestones}`,
        color: "green",
      },
      { label: "Active RFIs", value: projectMetrics.activeRFIs.toString(), color: "blue" },
      { label: "Change Orders", value: projectMetrics.changeOrders.toString(), color: "orange" },
      { label: "Risk Items", value: projectMetrics.riskItems.toString(), color: "red" },
    ]
  }

  const getHBIInsights = () => {
    // Financial Management tabs - comprehensive insights for all financial sub-tabs
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      // Get current financial sub-tab from navigation
      const currentFinancialTab = navigation.tool === "financial-management" ? navigation.subTool : "overview"

      // Budget Analysis insights
      if (currentFinancialTab === "budget-analysis") {
        return [
          {
            id: "budget-1",
            type: "warning",
            severity: "medium",
            title: "Budget Variance Alert",
            text: "Material costs are tracking 3.2% above budget. Steel and concrete prices have increased significantly.",
            action: "Review variance",
            timestamp: "2 hours ago",
          },
          {
            id: "budget-2",
            type: "success",
            severity: "low",
            title: "Labor Cost Efficiency",
            text: "Labor costs are running 5% under budget due to improved productivity and scheduling optimization.",
            action: "View details",
            timestamp: "4 hours ago",
          },
          {
            id: "budget-3",
            type: "alert",
            severity: "high",
            title: "Change Order Impact",
            text: "Pending change orders totaling $245K may impact current budget projections by Q3.",
            action: "Review COs",
            timestamp: "6 hours ago",
          },
          {
            id: "budget-4",
            type: "info",
            severity: "low",
            title: "Budget Milestone Achieved",
            text: "Project reached 68% budget completion, aligning with 72% schedule progress.",
            action: "View milestone",
            timestamp: "1 day ago",
          },
        ]
      }

      // JCHR insights
      if (currentFinancialTab === "jchr") {
        return [
          {
            id: "jchr-1",
            type: "warning",
            severity: "medium",
            title: "Cost Variance Detected",
            text: "Electrical work showing 8% cost overrun. Recommend immediate review of labor allocation.",
            action: "Review variance",
            timestamp: "3 hours ago",
          },
          {
            id: "jchr-2",
            type: "info",
            severity: "low",
            title: "Spend Velocity Analysis",
            text: "Current spend rate is 92% of forecasted velocity. Project financial health is stable.",
            action: "View analysis",
            timestamp: "5 hours ago",
          },
          {
            id: "jchr-3",
            type: "success",
            severity: "low",
            title: "Performance Tracking",
            text: "Concrete work completed 15% ahead of schedule with cost savings of $12K.",
            action: "View details",
            timestamp: "1 day ago",
          },
          {
            id: "jchr-4",
            type: "opportunity",
            severity: "medium",
            title: "Profitability Optimization",
            text: "Identified opportunity to improve margins by 2.1% through resource reallocation.",
            action: "Review opportunity",
            timestamp: "2 days ago",
          },
        ]
      }

      // AR Aging insights
      if (currentFinancialTab === "ar-aging") {
        return [
          {
            id: "ar-1",
            type: "alert",
            severity: "high",
            title: "Collection Priority Alert",
            text: "Invoice #INV-2024-156 ($47K) is 45 days overdue. Immediate collection action required.",
            action: "Initiate collection",
            timestamp: "1 hour ago",
          },
          {
            id: "ar-2",
            type: "warning",
            severity: "medium",
            title: "Cash Flow Impact",
            text: "Outstanding receivables over 30 days total $234K, affecting cash flow projections.",
            action: "Review aging",
            timestamp: "4 hours ago",
          },
          {
            id: "ar-3",
            type: "info",
            severity: "low",
            title: "Retainage Analysis",
            text: "Total retainage held: $89K. First release eligible in 14 days upon milestone completion.",
            action: "View retainage",
            timestamp: "6 hours ago",
          },
          {
            id: "ar-4",
            type: "success",
            severity: "low",
            title: "Collection Efficiency",
            text: "Payment collection rate improved to 94% this quarter, up from 87% last quarter.",
            action: "View metrics",
            timestamp: "1 day ago",
          },
        ]
      }

      // Cash Flow insights
      if (currentFinancialTab === "cash-flow") {
        return [
          {
            id: "cash-1",
            type: "warning",
            severity: "medium",
            title: "Liquidity Alert",
            text: "Projected cash flow dips below $50K threshold in 3 weeks. Plan accelerated collections.",
            action: "Review forecast",
            timestamp: "2 hours ago",
          },
          {
            id: "cash-2",
            type: "success",
            severity: "low",
            title: "Forecast Accuracy",
            text: "Cash flow projections were 96% accurate this month, exceeding 90% target.",
            action: "View analysis",
            timestamp: "5 hours ago",
          },
          {
            id: "cash-3",
            type: "info",
            severity: "low",
            title: "Seasonal Trends",
            text: "Historical data shows 15% cash flow improvement expected in Q4 due to project completions.",
            action: "View trends",
            timestamp: "1 day ago",
          },
          {
            id: "cash-4",
            type: "opportunity",
            severity: "medium",
            title: "Investment Opportunity",
            text: "Excess cash position of $125K available for short-term investment opportunities.",
            action: "Explore options",
            timestamp: "2 days ago",
          },
        ]
      }

      // Forecasting insights
      if (currentFinancialTab === "forecasting") {
        return [
          {
            id: "forecast-1",
            type: "success",
            severity: "low",
            title: "Accuracy Improvement",
            text: "Forecasting accuracy improved to 94% this quarter, up from 89% last quarter.",
            action: "View metrics",
            timestamp: "3 hours ago",
          },
          {
            id: "forecast-2",
            type: "info",
            severity: "low",
            title: "Revenue Projection",
            text: "Q4 revenue forecast updated to $2.1M based on current project pipeline and completion rates.",
            action: "Review projections",
            timestamp: "6 hours ago",
          },
          {
            id: "forecast-3",
            type: "warning",
            severity: "medium",
            title: "Cost Trend Analysis",
            text: "Material cost inflation trending 4.2% above forecast. Adjust pricing models accordingly.",
            action: "Review trends",
            timestamp: "1 day ago",
          },
          {
            id: "forecast-4",
            type: "opportunity",
            severity: "medium",
            title: "Schedule Impact",
            text: "Early project completion could improve Q4 margins by 3.5% through accelerated revenue recognition.",
            action: "Analyze impact",
            timestamp: "2 days ago",
          },
        ]
      }

      // Change Management insights
      if (currentFinancialTab === "change-management") {
        return [
          {
            id: "change-1",
            type: "alert",
            severity: "high",
            title: "Change Order Volume",
            text: "Change order volume increased 45% this month. Review change management processes.",
            action: "Review process",
            timestamp: "1 hour ago",
          },
          {
            id: "change-2",
            type: "warning",
            severity: "medium",
            title: "Approval Bottleneck",
            text: "Average change order approval time: 8.2 days. Target is 5 days for optimal cash flow.",
            action: "Review workflow",
            timestamp: "4 hours ago",
          },
          {
            id: "change-3",
            type: "info",
            severity: "low",
            title: "Cost Impact Analysis",
            text: "Approved change orders total $145K (3.2% of contract value). Within acceptable range.",
            action: "View analysis",
            timestamp: "6 hours ago",
          },
          {
            id: "change-4",
            type: "success",
            severity: "low",
            title: "Efficiency Improvement",
            text: "Change order processing time reduced by 25% through workflow optimization.",
            action: "View metrics",
            timestamp: "1 day ago",
          },
        ]
      }

      // Pay Authorization insights
      if (currentFinancialTab === "pay-authorization") {
        return [
          {
            id: "pay-1",
            type: "warning",
            severity: "medium",
            title: "Authorization Delay",
            text: "3 payment authorizations pending approval for over 48 hours. Review approval workflow.",
            action: "Review queue",
            timestamp: "2 hours ago",
          },
          {
            id: "pay-2",
            type: "success",
            severity: "low",
            title: "Processing Efficiency",
            text: "Payment processing time improved to 2.1 days average, down from 3.5 days last month.",
            action: "View metrics",
            timestamp: "5 hours ago",
          },
          {
            id: "pay-3",
            type: "info",
            severity: "low",
            title: "Compliance Monitoring",
            text: "All payment authorizations meet compliance requirements. No regulatory issues identified.",
            action: "View compliance",
            timestamp: "1 day ago",
          },
          {
            id: "pay-4",
            type: "opportunity",
            severity: "medium",
            title: "Automation Opportunity",
            text: "65% of payment authorizations are routine and could benefit from automated processing.",
            action: "Explore automation",
            timestamp: "2 days ago",
          },
        ]
      }

      // Pay Applications insights
      if (currentFinancialTab === "pay-applications") {
        return [
          {
            id: "payapp-1",
            type: "success",
            severity: "low",
            title: "Application Submitted",
            text: "Pay Application #08 submitted successfully. $234K requested for October progress.",
            action: "Track status",
            timestamp: "3 hours ago",
          },
          {
            id: "payapp-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Optimization",
            text: "Early submission of pay applications improved cash flow by 12% compared to last quarter.",
            action: "View analysis",
            timestamp: "6 hours ago",
          },
          {
            id: "payapp-3",
            type: "warning",
            severity: "medium",
            title: "Documentation Review",
            text: "Pay Application #07 requires additional documentation. Submit within 48 hours to avoid delays.",
            action: "Upload docs",
            timestamp: "1 day ago",
          },
          {
            id: "payapp-4",
            type: "opportunity",
            severity: "medium",
            title: "Retention Management",
            text: "Opportunity to negotiate reduced retention rate based on project performance history.",
            action: "Review options",
            timestamp: "2 days ago",
          },
        ]
      }

      // Retention insights
      if (currentFinancialTab === "retention") {
        return [
          {
            id: "retention-1",
            type: "alert",
            severity: "high",
            title: "Retention Release Due",
            text: "Retention release of $67K eligible for release upon completion of punch list items.",
            action: "Review release",
            timestamp: "1 hour ago",
          },
          {
            id: "retention-2",
            type: "success",
            severity: "low",
            title: "Retention Optimization",
            text: "Negotiated retention rate reduced to 8% (from 10%) based on excellent performance record.",
            action: "View details",
            timestamp: "4 hours ago",
          },
          {
            id: "retention-3",
            type: "info",
            severity: "low",
            title: "Release Schedule",
            text: "Planned retention releases: $45K in Q4, $67K in Q1 2025, subject to completion milestones.",
            action: "View schedule",
            timestamp: "1 day ago",
          },
          {
            id: "retention-4",
            type: "warning",
            severity: "medium",
            title: "Risk Assessment",
            text: "Total retention held: $234K. Monitor project completion closely to ensure timely release.",
            action: "Review risk",
            timestamp: "2 days ago",
          },
        ]
      }

      // Default financial insights
      return [
        {
          id: "financial-1",
          type: "success",
          severity: "low",
          title: "Financial Health Score",
          text: "Project financial health rated 'Excellent' with 94% budget efficiency and positive cash flow.",
          action: "View dashboard",
          timestamp: "2 hours ago",
        },
        {
          id: "financial-2",
          type: "info",
          severity: "low",
          title: "Budget Performance",
          text: "Current budget utilization: 68% with remaining budget of $1.2M for project completion.",
          action: "View budget",
          timestamp: "4 hours ago",
        },
        {
          id: "financial-3",
          type: "opportunity",
          severity: "medium",
          title: "Cash Flow Monitoring",
          text: "Optimize payment scheduling to maintain positive cash flow throughout project lifecycle.",
          action: "Review schedule",
          timestamp: "1 day ago",
        },
      ]
    }

    // Field Management tabs
    if (activeTab === "field-management") {
      // Get current field management sub-tab from navigation
      const currentFieldTab = navigation.tool === "field-management" ? navigation.subTool : "scheduler"

      // Scheduler insights
      if (currentFieldTab === "scheduler") {
        return [
          {
            id: "scheduler-1",
            type: "warning",
            severity: "medium",
            title: "Critical Path Delay Risk",
            text: "Weather delays may impact concrete pour schedule. Consider accelerating prep work.",
            action: "Review schedule",
            timestamp: "2 hours ago",
          },
          {
            id: "scheduler-2",
            type: "opportunity",
            severity: "medium",
            title: "Weather Window Opportunity",
            text: "Extended favorable weather forecast allows for advancing roofing activities by 5 days.",
            action: "Optimize schedule",
            timestamp: "4 hours ago",
          },
          {
            id: "scheduler-3",
            type: "success",
            severity: "low",
            title: "Resource Optimization",
            text: "Crew scheduling optimization improved productivity by 12% this week.",
            action: "View metrics",
            timestamp: "1 day ago",
          },
          {
            id: "scheduler-4",
            type: "alert",
            severity: "high",
            title: "Material Delivery Alert",
            text: "Steel delivery delayed by 3 days. Coordinate with supplier to minimize schedule impact.",
            action: "Contact supplier",
            timestamp: "6 hours ago",
          },
        ]
      }

      // Field Reports insights
      if (currentFieldTab === "field-reports") {
        return [
          {
            id: "field-1",
            type: "success",
            severity: "low",
            title: "Progress Trending",
            text: "Daily progress reports show 15% ahead of schedule for structural work completion.",
            action: "View progress",
            timestamp: "3 hours ago",
          },
          {
            id: "field-2",
            type: "warning",
            severity: "medium",
            title: "Weather Impact",
            text: "Rain delays accumulated 2.5 days this week. Adjust weekend crew schedule to compensate.",
            action: "Review schedule",
            timestamp: "5 hours ago",
          },
          {
            id: "field-3",
            type: "info",
            severity: "low",
            title: "Quality Milestone",
            text: "Structural inspections completed with zero defects. Excellent quality control maintained.",
            action: "View inspections",
            timestamp: "1 day ago",
          },
          {
            id: "field-4",
            type: "alert",
            severity: "high",
            title: "Safety Incident",
            text: "Near-miss incident reported in Area C. Immediate safety briefing scheduled for tomorrow.",
            action: "Review incident",
            timestamp: "4 hours ago",
          },
        ]
      }

      // Constraints insights
      if (currentFieldTab === "constraints") {
        return [
          {
            id: "constraints-1",
            type: "alert",
            severity: "high",
            title: "Critical Constraint Impact",
            text: "Utility relocation delay affecting foundation work. Estimated 5-day schedule impact.",
            action: "Review mitigation",
            timestamp: "1 hour ago",
          },
          {
            id: "constraints-2",
            type: "warning",
            severity: "medium",
            title: "Material Supply Risk",
            text: "Concrete supplier capacity constraints may affect pour schedule in November.",
            action: "Secure backup",
            timestamp: "3 hours ago",
          },
          {
            id: "constraints-3",
            type: "opportunity",
            severity: "medium",
            title: "Constraint Resolution",
            text: "Permit approval received early. Electrical work can begin 3 days ahead of schedule.",
            action: "Update schedule",
            timestamp: "6 hours ago",
          },
          {
            id: "constraints-4",
            type: "info",
            severity: "low",
            title: "Constraint Monitoring",
            text: "15 active constraints tracked. 3 resolved this week, 2 new constraints identified.",
            action: "View all",
            timestamp: "1 day ago",
          },
        ]
      }

      // Permit Log insights
      if (currentFieldTab === "permit-log") {
        return [
          {
            id: "permit-1",
            type: "warning",
            severity: "medium",
            title: "Permit Expiration Alert",
            text: "Building permit #BP-2024-789 expires in 14 days. Renewal required to continue work.",
            action: "Renew permit",
            timestamp: "2 hours ago",
          },
          {
            id: "permit-2",
            type: "success",
            severity: "low",
            title: "Inspection Passed",
            text: "Framing inspection completed successfully. Electrical rough-in can proceed as scheduled.",
            action: "View report",
            timestamp: "4 hours ago",
          },
          {
            id: "permit-3",
            type: "info",
            severity: "low",
            title: "Permit Application Status",
            text: "Plumbing permit application submitted. Expected approval within 5-7 business days.",
            action: "Track status",
            timestamp: "1 day ago",
          },
          {
            id: "permit-4",
            type: "alert",
            severity: "high",
            title: "Inspection Failure",
            text: "Electrical inspection failed due to code violations. Rework required before re-inspection.",
            action: "Review violations",
            timestamp: "6 hours ago",
          },
        ]
      }

      // Default field management insights
      return [
        {
          id: "field-default-1",
          type: "info",
          severity: "low",
          title: "Field Operations Update",
          text: "All field operations running smoothly with no critical issues reported.",
          action: "View summary",
          timestamp: "2 hours ago",
        },
        {
          id: "field-default-2",
          type: "success",
          severity: "low",
          title: "Progress Tracking",
          text: "Project progress maintains steady pace with 72% completion and on-schedule delivery.",
          action: "View progress",
          timestamp: "4 hours ago",
        },
      ]
    }

    // Core Project Tools tabs
    if (activeTab === "core" || !activeTab) {
      // Dashboard tab (default)
      if (!navigation.coreTab || navigation.coreTab === "dashboard") {
        return [
          {
            id: "dashboard-1",
            type: "success",
            severity: "low",
            title: "Project Health Score",
            text: "Project health rated 'Excellent' with 94% efficiency across all key performance indicators.",
            action: "View dashboard",
            timestamp: "2 hours ago",
          },
          {
            id: "dashboard-2",
            type: "info",
            severity: "low",
            title: "Milestone Achievement",
            text: "Structural milestone completed 3 days ahead of schedule. Team performance exceptional.",
            action: "View milestones",
            timestamp: "4 hours ago",
          },
          {
            id: "dashboard-3",
            type: "opportunity",
            severity: "medium",
            title: "Budget Variance Trending",
            text: "Budget variance trending positive. Opportunity to reallocate savings to value-add items.",
            action: "Review variance",
            timestamp: "1 day ago",
          },
        ]
      }

      // Tab-specific insights for core tools
      switch (navigation.coreTab) {
        case "checklists":
          return [
            {
              id: "checklist-1",
              type: "warning",
              severity: "medium",
              title: "StartUp Progress Alert",
              text: "StartUp checklist 78% complete. 5 critical items require attention before project handoff.",
              action: "Review items",
              timestamp: "2 hours ago",
            },
            {
              id: "checklist-2",
              type: "success",
              severity: "low",
              title: "Safety Compliance",
              text: "Safety checklist 100% complete. All regulatory requirements met for current phase.",
              action: "View compliance",
              timestamp: "4 hours ago",
            },
            {
              id: "checklist-3",
              type: "info",
              severity: "low",
              title: "Quality Review",
              text: "Quality checklist items trending well. 92% completion rate across all categories.",
              action: "View quality",
              timestamp: "1 day ago",
            },
            {
              id: "checklist-4",
              type: "alert",
              severity: "high",
              title: "Closeout Preparation",
              text: "Closeout checklist preparation should begin. Schedule owner training and documentation.",
              action: "Start closeout",
              timestamp: "6 hours ago",
            },
          ]

        case "productivity":
          return [
            {
              id: "productivity-1",
              type: "success",
              severity: "low",
              title: "Team Collaboration",
              text: "Team collaboration metrics improved 18% this month. Message response time down to 2.1 hours.",
              action: "View metrics",
              timestamp: "2 hours ago",
            },
            {
              id: "productivity-2",
              type: "info",
              severity: "low",
              title: "Task Completion Trends",
              text: "Task completion rate: 94% this week. Productivity tools driving efficiency gains.",
              action: "View tasks",
              timestamp: "4 hours ago",
            },
            {
              id: "productivity-3",
              type: "opportunity",
              severity: "medium",
              title: "Communication Efficiency",
              text: "Opportunity to further streamline communication workflows. Consider automation tools.",
              action: "Explore tools",
              timestamp: "1 day ago",
            },
            {
              id: "productivity-4",
              type: "warning",
              severity: "medium",
              title: "Overdue Tasks",
              text: "3 tasks overdue by more than 48 hours. Review task assignments and capacity.",
              action: "Review tasks",
              timestamp: "6 hours ago",
            },
          ]

        case "staffing":
          return [
            {
              id: "staffing-1",
              type: "success",
              severity: "low",
              title: "Resource Allocation",
              text: "Staffing efficiency at 96% with optimal resource allocation across all project phases.",
              action: "View allocation",
              timestamp: "2 hours ago",
            },
            {
              id: "staffing-2",
              type: "info",
              severity: "low",
              title: "Team Efficiency",
              text: "Team efficiency metrics show 15% improvement over baseline. Excellent performance.",
              action: "View metrics",
              timestamp: "4 hours ago",
            },
            {
              id: "staffing-3",
              type: "warning",
              severity: "medium",
              title: "Training Completion",
              text: "2 team members pending safety training completion. Schedule before next phase begins.",
              action: "Schedule training",
              timestamp: "1 day ago",
            },
            {
              id: "staffing-4",
              type: "opportunity",
              severity: "medium",
              title: "SPCR Review",
              text: "Opportunity to optimize SPCR assignments based on current project performance data.",
              action: "Review SPCR",
              timestamp: "2 days ago",
            },
          ]

        case "responsibility-matrix":
          return [
            {
              id: "matrix-1",
              type: "warning",
              severity: "medium",
              title: "Coverage Analysis",
              text: "2 responsibility areas lack clear assignment. Define ownership before critical path activities.",
              action: "Assign roles",
              timestamp: "2 hours ago",
            },
            {
              id: "matrix-2",
              type: "success",
              severity: "low",
              title: "Matrix Optimization",
              text: "Responsibility matrix updated with 97% coverage. Clear accountability established.",
              action: "View matrix",
              timestamp: "4 hours ago",
            },
            {
              id: "matrix-3",
              type: "info",
              severity: "low",
              title: "Role Clarity",
              text: "Team feedback indicates 94% satisfaction with role clarity and responsibility definition.",
              action: "View feedback",
              timestamp: "1 day ago",
            },
            {
              id: "matrix-4",
              type: "alert",
              severity: "high",
              title: "Conflict Resolution",
              text: "Overlapping responsibilities identified between trades. Resolve conflicts immediately.",
              action: "Resolve conflicts",
              timestamp: "6 hours ago",
            },
          ]

        case "reports":
          return [
            {
              id: "reports-1",
              type: "info",
              severity: "low",
              title: "Report Generation",
              text: "Weekly progress report generated successfully. Distribution scheduled for 2 PM today.",
              action: "View report",
              timestamp: "2 hours ago",
            },
            {
              id: "reports-2",
              type: "warning",
              severity: "medium",
              title: "Approval Delays",
              text: "2 reports pending approval for over 48 hours. Follow up with stakeholders needed.",
              action: "Follow up",
              timestamp: "4 hours ago",
            },
            {
              id: "reports-3",
              type: "success",
              severity: "low",
              title: "Data Quality",
              text: "Report data quality score: 98%. Automated validation catching errors effectively.",
              action: "View metrics",
              timestamp: "1 day ago",
            },
            {
              id: "reports-4",
              type: "opportunity",
              severity: "medium",
              title: "Reporting Efficiency",
              text: "Opportunity to automate 65% of routine reports. Could save 8 hours per week.",
              action: "Explore automation",
              timestamp: "2 days ago",
            },
          ]

        default:
          return [
            {
              id: "core-1",
              type: "success",
              severity: "low",
              title: "Project Health Score",
              text: "Project health rated 'Excellent' with 94% efficiency across all key performance indicators.",
              action: "View dashboard",
              timestamp: "2 hours ago",
            },
            {
              id: "core-2",
              type: "info",
              severity: "low",
              title: "Milestone Achievement",
              text: "Structural milestone completed 3 days ahead of schedule. Team performance exceptional.",
              action: "View milestones",
              timestamp: "4 hours ago",
            },
            {
              id: "core-3",
              type: "opportunity",
              severity: "medium",
              title: "Budget Variance Trending",
              text: "Budget variance trending positive. Opportunity to reallocate savings to value-add items.",
              action: "Review variance",
              timestamp: "1 day ago",
            },
          ]
      }
    }

    // Pre-Construction insights
    if (activeTab === "pre-construction") {
      return [
        {
          id: "precon-1",
          type: "success",
          severity: "low",
          title: "Estimate Accuracy",
          text: "Final estimate accuracy: 97.2%. Excellent alignment with actual costs and market conditions.",
          action: "View estimate",
          timestamp: "2 hours ago",
        },
        {
          id: "precon-2",
          type: "info",
          severity: "low",
          title: "BIM Coordination",
          text: "BIM model coordination 85% complete. Clash detection identified and resolved 23 conflicts.",
          action: "View model",
          timestamp: "4 hours ago",
        },
        {
          id: "precon-3",
          type: "warning",
          severity: "medium",
          title: "Permit Timeline",
          text: "Building permit application review may extend 2 weeks. Consider expedited processing option.",
          action: "Review options",
          timestamp: "1 day ago",
        },
        {
          id: "precon-4",
          type: "opportunity",
          severity: "medium",
          title: "Value Engineering",
          text: "Value engineering review identified $45K in potential savings without compromising quality.",
          action: "Review options",
          timestamp: "2 days ago",
        },
      ]
    }

    // Warranty Management insights
    if (activeTab === "warranty") {
      return [
        {
          id: "warranty-1",
          type: "alert",
          severity: "high",
          title: "Warranty Claim",
          text: "New warranty claim submitted for HVAC system. Response required within 24 hours.",
          action: "Review claim",
          timestamp: "1 hour ago",
        },
        {
          id: "warranty-2",
          type: "success",
          severity: "low",
          title: "Claim Resolution",
          text: "Roofing warranty claim resolved successfully. Customer satisfaction rating: 4.8/5.",
          action: "View details",
          timestamp: "3 hours ago",
        },
        {
          id: "warranty-3",
          type: "info",
          severity: "low",
          title: "Coverage Analysis",
          text: "Current warranty coverage: $1.2M across 15 active projects. No coverage gaps identified.",
          action: "View coverage",
          timestamp: "1 day ago",
        },
        {
          id: "warranty-4",
          type: "warning",
          severity: "medium",
          title: "Expiration Notice",
          text: "3 warranty periods expiring within 60 days. Schedule final inspections and documentation.",
          action: "Schedule inspections",
          timestamp: "2 days ago",
        },
      ]
    }

    // Compliance insights
    if (activeTab === "compliance") {
      return [
        {
          id: "compliance-1",
          type: "success",
          severity: "low",
          title: "Compliance Rating",
          text: "Current compliance rating: 98%. All regulatory requirements met or exceeded.",
          action: "View details",
          timestamp: "2 hours ago",
        },
        {
          id: "compliance-2",
          type: "info",
          severity: "low",
          title: "Contract Review",
          text: "Quarterly contract review completed. All trade partner agreements current and compliant.",
          action: "View contracts",
          timestamp: "4 hours ago",
        },
        {
          id: "compliance-3",
          type: "warning",
          severity: "medium",
          title: "Documentation Gap",
          text: "2 trade partners missing current insurance certificates. Obtain before work continuation.",
          action: "Request certificates",
          timestamp: "1 day ago",
        },
        {
          id: "compliance-4",
          type: "opportunity",
          severity: "medium",
          title: "Process Improvement",
          text: "Opportunity to streamline compliance workflow. Digital documentation could save 6 hours/week.",
          action: "Explore options",
          timestamp: "2 days ago",
        },
      ]
    }

    // Default insights for any other tabs
    return [
      {
        id: "default-1",
        type: "info",
        severity: "low",
        title: "Project Status Update",
        text: "Project is progressing well with all major milestones on track.",
        action: "View details",
        timestamp: "1 day ago",
      },
      {
        id: "default-2",
        type: "opportunity",
        severity: "medium",
        title: "Process Optimization",
        text: "Current workflow efficiency is 15% above baseline with room for further improvement.",
        action: "Review optimization recommendations",
        timestamp: "2 hours ago",
      },
    ]
  }

  // Render core tab content

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

  // Render content based on activeTab prop (controlled by page header)
  const renderContent = () => {
    // Handle different module tabs from main app navigation
    switch (activeTab) {
      case "financial-management":
      case "financial-hub":
        return (
          <FinancialHubProjectContent
            projectId={projectId}
            projectData={projectData}
            userRole={userRole}
            user={user}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        )

      case "pre-construction":
        return (
          <div className="flex flex-col h-full w-full min-w-0 max-w-full overflow-hidden">
            {/* Module Title with Focus Button */}
            <div className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">Pre-Construction Suite</h2>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive pre-construction management and estimating tools
                  </p>
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

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0 max-w-full min-h-0">
              <div className={cn("w-full min-w-0 max-w-full", isFocusMode ? "min-h-full" : "h-full overflow-hidden")}>
                <PreConstructionContent
                  projectId={projectId}
                  projectData={projectData}
                  userRole={userRole}
                  user={user}
                />
              </div>
            </div>
          </div>
        )

      case "warranty":
        return (
          <WarrantyManagementContent projectId={projectId} projectData={projectData} userRole={userRole} user={user} />
        )

      case "compliance":
        return <ComplianceContent projectId={projectId} projectData={projectData} userRole={userRole} user={user} />

      case "field-management":
        return getFieldManagementRightPanelContent(
          projectData,
          userRole,
          projectId,
          navigation.subTool || "scheduler",
          onSidebarContentChange
        )

      case "core":
      case undefined:
      case null:
      default:
        // Render Core Project Tools content with internal navigation
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Loading project tools...</span>
                </div>
              </div>
            }
          >
            <ProjectTabsShell
              projectId={projectId}
              user={user}
              userRole={userRole}
              projectData={projectData}
              onTabChange={onTabChange}
            />
          </Suspense>
        )
    }
  }

  // Main content without module tab selector (controlled by page header)
  const mainContent = renderContent()

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

  // Return the main content with proper JSX structure
  return mainContent
}

// Export the left sidebar content as a separate function
export const getProjectSidebarContent = (
  projectData: any,
  navigation: NavigationState,
  projectMetrics: any,
  activeTab?: string
) => {
  const getQuickActions = () => {
    if (activeTab === "pre-construction") {
      return [
        { label: "Create Estimate", icon: Calculator, onClick: () => {} },
        { label: "BIM Coordination", icon: Brain, onClick: () => {} },
        { label: "Schedule Planning", icon: Calendar, onClick: () => {} },
        { label: "Team Setup", icon: Users, onClick: () => {} },
      ]
    } else if (activeTab === "warranty") {
      return [
        { label: "New Warranty Claim", icon: Plus, onClick: () => {} },
        { label: "Upload Documents", icon: Upload, onClick: () => {} },
        { label: "AI Product Assistant", icon: Brain, onClick: () => {} },
        { label: "Labor Warranty", icon: Users, onClick: () => {} },
      ]
    } else if (activeTab === "compliance") {
      return [
        { label: "New Contract", icon: Plus, onClick: () => {} },
        { label: "Upload Documents", icon: Upload, onClick: () => {} },
        { label: "Trade Partner Review", icon: Users, onClick: () => {} },
        { label: "Compliance Report", icon: FileText, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "reports") {
      return [
        { label: "Create Report", icon: Plus, onClick: () => {} },
        { label: "View Reports", icon: Eye, onClick: () => {} },
        { label: "Report Analytics", icon: BarChart3, onClick: () => {} },
        { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Checklist", icon: CheckSquare, onClick: () => {} },
        { label: "Closeout Checklist", icon: CheckCircle, onClick: () => {} },
        { label: "Export Checklist", icon: Download, onClick: () => {} },
        { label: "Update Progress", icon: RefreshCw, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "View Timeline", icon: Calendar, onClick: () => {} },
        { label: "Create SPCR", icon: FileText, onClick: () => {} },
        { label: "Assign Staff", icon: Users, onClick: () => {} },
        { label: "Export Schedule", icon: Download, onClick: () => {} },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "New Message", icon: MessageSquare, onClick: () => {} },
        { label: "Create Task", icon: CheckSquare, onClick: () => {} },
        { label: "Team Updates", icon: Users, onClick: () => {} },
        { label: "Export Activity", icon: Download, onClick: () => {} },
      ]
    }

    // Default actions
    return [
      { label: "Schedule Review", icon: Calendar, onClick: () => {} },
      { label: "Budget Analysis", icon: DollarSign, onClick: () => {} },
      { label: "Team Management", icon: Users, onClick: () => {} },
      { label: "Refresh Data", icon: RefreshCw, onClick: () => {} },
    ]
  }

  const getKeyMetrics = () => {
    if (activeTab === "pre-construction") {
      return [
        { label: "Estimate Accuracy", value: "92%", color: "green" },
        { label: "BIM Progress", value: "75%", color: "blue" },
        { label: "Permits Submitted", value: "8/12", color: "orange" },
        { label: "Team Readiness", value: "85%", color: "purple" },
      ]
    } else if (activeTab === "warranty") {
      return [
        { label: "Active Warranties", value: "12", color: "blue" },
        { label: "Open Claims", value: "3", color: "orange" },
        { label: "Resolved Claims", value: "45", color: "green" },
        { label: "Coverage Value", value: "$1.2M", color: "purple" },
      ]
    } else if (activeTab === "compliance") {
      return [
        { label: "Active Contracts", value: "12", color: "blue" },
        { label: "Trade Partners", value: "18", color: "green" },
        { label: "Compliance Rate", value: "94%", color: "green" },
        { label: "Expiring Soon", value: "3", color: "orange" },
      ]
    } else if (navigation.coreTab === "reports") {
      return [
        { label: "Total Reports", value: "0", color: "blue" },
        { label: "Pending Approval", value: "0", color: "yellow" },
        { label: "Approved", value: "0", color: "green" },
        { label: "Approval Rate", value: "0%", color: "emerald" },
      ]
    } else if (navigation.coreTab === "checklists") {
      return [
        { label: "StartUp Items", value: "65", color: "blue" },
        { label: "StartUp Complete", value: "78%", color: "green" },
        { label: "Closeout Items", value: "35", color: "purple" },
        { label: "Closeout Complete", value: "12%", color: "orange" },
      ]
    } else if (navigation.coreTab === "staffing") {
      return [
        { label: "Active Staff", value: "12", color: "blue" },
        { label: "Assignments", value: "18", color: "green" },
        { label: "Positions", value: "8", color: "purple" },
        { label: "Avg Duration", value: "45d", color: "orange" },
      ]
    } else if (navigation.coreTab === "productivity") {
      return [
        { label: "Active Threads", value: "5", color: "blue" },
        { label: "Tasks in Progress", value: "8", color: "orange" },
        { label: "Completed Tasks", value: "12", color: "green" },
        { label: "Team Messages", value: "24", color: "purple" },
      ]
    }

    // Add null safety for projectMetrics
    if (!projectMetrics) {
      return [
        { label: "Milestones", value: "0/0", color: "green" },
        { label: "Active RFIs", value: "0", color: "blue" },
        { label: "Change Orders", value: "0", color: "orange" },
        { label: "Risk Items", value: "0", color: "red" },
      ]
    }

    return [
      {
        label: "Milestones",
        value: `${projectMetrics.completedMilestones || 0}/${projectMetrics.totalMilestones || 0}`,
        color: "green",
      },
      { label: "Active RFIs", value: (projectMetrics.activeRFIs || 0).toString(), color: "blue" },
      { label: "Change Orders", value: (projectMetrics.changeOrders || 0).toString(), color: "orange" },
      { label: "Risk Items", value: (projectMetrics.riskItems || 0).toString(), color: "red" },
    ]
  }

  const getHBIInsights = () => {
    // Financial Management tabs - comprehensive insights for all financial sub-tabs
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      // Get current financial sub-tab from navigation
      const currentFinancialTab = navigation.tool === "financial-management" ? navigation.subTool : "overview"

      // Budget Analysis insights
      if (currentFinancialTab === "budget-analysis") {
        return [
          {
            id: "budget-1",
            type: "warning",
            severity: "medium",
            title: "Budget Variance Alert",
            text: "Material costs are tracking 3.2% above budget. Steel and concrete prices have increased significantly.",
            action: "Review variance",
            timestamp: "2 hours ago",
          },
          {
            id: "budget-2",
            type: "success",
            severity: "low",
            title: "Labor Cost Efficiency",
            text: "Labor costs are running 5% under budget due to improved productivity and scheduling optimization.",
            action: "View details",
            timestamp: "4 hours ago",
          },
          {
            id: "budget-3",
            type: "alert",
            severity: "high",
            title: "Change Order Impact",
            text: "Pending change orders totaling $245K may impact current budget projections by Q3.",
            action: "Review COs",
            timestamp: "6 hours ago",
          },
          {
            id: "budget-4",
            type: "info",
            severity: "low",
            title: "Budget Milestone Achieved",
            text: "Project reached 68% budget completion, aligning with 72% schedule progress.",
            action: "View milestone",
            timestamp: "1 day ago",
          },
        ]
      }

      // JCHR insights
      if (currentFinancialTab === "jchr") {
        return [
          {
            id: "jchr-1",
            type: "warning",
            severity: "medium",
            title: "Cost Variance Alert",
            text: "Division 03 showing highest variance. HBI recommends immediate cost review and mitigation planning.",
            action: "Review division",
            timestamp: "1 hour ago",
          },
          {
            id: "jchr-2",
            type: "info",
            severity: "low",
            title: "Spend Velocity",
            text: "Current burn rate at 78.1% of budget. Projected completion tracking on schedule.",
            action: "View metrics",
            timestamp: "3 hours ago",
          },
          {
            id: "jchr-3",
            type: "success",
            severity: "low",
            title: "Cost Performance Tracking",
            text: "HBI identified minor cost variance across divisions with 78.1% budget utilization.",
            action: "View performance",
            timestamp: "6 hours ago",
          },
          {
            id: "jchr-4",
            type: "info",
            severity: "low",
            title: "Profitability Analysis",
            text: "Current profit margin at 6.8% with financial health score of 88%. Strong profitability outlook.",
            action: "View analysis",
            timestamp: "1 day ago",
          },
        ]
      }

      // AR Aging insights
      if (currentFinancialTab === "ar-aging") {
        return [
          {
            id: "ar-1",
            type: "warning",
            severity: "medium",
            title: "Collection Priority Alert",
            text: "$850K in 60+ day aging. HBI recommends immediate collection action and client communication strategy.",
            action: "Review collections",
            timestamp: "2 hours ago",
          },
          {
            id: "ar-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Impact",
            text: "Total AR at $8.5M with 75.3% current. Healthy aging profile maintained.",
            action: "View details",
            timestamp: "4 hours ago",
          },
          {
            id: "ar-3",
            type: "success",
            severity: "low",
            title: "Retainage Analysis",
            text: "$2.1M in retainage held. Retainage levels within normal range for improved cash flow.",
            action: "View retainage",
            timestamp: "1 day ago",
          },
          {
            id: "ar-4",
            type: "info",
            severity: "medium",
            title: "Collection Efficiency",
            text: "Average collection period of 42 days shows strong receivables management performance.",
            action: "View efficiency",
            timestamp: "2 days ago",
          },
        ]
      }

      // Cash Flow insights
      if (currentFinancialTab === "cash-flow") {
        return [
          {
            id: "cash-1",
            type: "warning",
            severity: "medium",
            title: "Liquidity Alert",
            text: "Current burn rate of $1.2M/month with 65 days cash on hand. Monitor closely for working capital optimization.",
            action: "Review liquidity",
            timestamp: "1 hour ago",
          },
          {
            id: "cash-2",
            type: "info",
            severity: "low",
            title: "Forecast Performance",
            text: "94.1% accuracy with improving trend. Excellent predictive reliability maintained.",
            action: "View forecast",
            timestamp: "3 hours ago",
          },
          {
            id: "cash-3",
            type: "success",
            severity: "low",
            title: "Liquidity Position",
            text: "Strong liquidity ratio of 3.2 indicates healthy cash position. Excellent financial stability.",
            action: "View position",
            timestamp: "6 hours ago",
          },
          {
            id: "cash-4",
            type: "info",
            severity: "medium",
            title: "Risk Assessment",
            text: "2 high-impact risks identified. Payment delays showing 15% probability impact.",
            action: "View risks",
            timestamp: "1 day ago",
          },
        ]
      }

      // Forecasting insights
      if (currentFinancialTab === "forecasting") {
        return [
          {
            id: "forecast-1",
            type: "info",
            severity: "low",
            title: "Forecast Accuracy",
            text: "HBI forecasting model achieving 94.2% accuracy with strong predictive confidence intervals.",
            action: "View accuracy",
            timestamp: "2 hours ago",
          },
          {
            id: "forecast-2",
            type: "success",
            severity: "low",
            title: "Revenue Projection",
            text: "Project revenue forecast tracking within 2% of original projections with positive momentum.",
            action: "View projections",
            timestamp: "4 hours ago",
          },
          {
            id: "forecast-3",
            type: "warning",
            severity: "medium",
            title: "Cost Trend Analysis",
            text: "Material cost escalation trends suggest 3-5% increase in Q3. Consider procurement acceleration.",
            action: "Review trends",
            timestamp: "1 day ago",
          },
          {
            id: "forecast-4",
            type: "info",
            severity: "medium",
            title: "Schedule Impact",
            text: "Weather delays may impact Q2 forecasts by 8-12 days. Mitigation strategies available.",
            action: "View mitigation",
            timestamp: "2 days ago",
          },
        ]
      }

      // Change Management insights
      if (currentFinancialTab === "change-management") {
        return [
          {
            id: "change-1",
            type: "warning",
            severity: "medium",
            title: "Change Order Volume",
            text: "Current change order rate at 8.5% of contract value. Monitor scope creep trends carefully.",
            action: "Review volume",
            timestamp: "1 hour ago",
          },
          {
            id: "change-2",
            type: "alert",
            severity: "high",
            title: "Approval Bottleneck",
            text: "3 change orders pending approval for 10+ days. Risk of schedule impact if not resolved.",
            action: "Expedite approvals",
            timestamp: "2 hours ago",
          },
          {
            id: "change-3",
            type: "info",
            severity: "low",
            title: "Cost Impact Analysis",
            text: "Average change order processing time reduced to 5.2 days through workflow optimization.",
            action: "View optimization",
            timestamp: "1 day ago",
          },
          {
            id: "change-4",
            type: "success",
            severity: "low",
            title: "Profit Margin Protection",
            text: "98% of change orders maintained target profit margins through effective pricing strategies.",
            action: "View margins",
            timestamp: "2 days ago",
          },
        ]
      }

      // Pay Authorization insights
      if (currentFinancialTab === "pay-authorization") {
        return [
          {
            id: "pay-auth-1",
            type: "warning",
            severity: "medium",
            title: "Approval Workflow Alert",
            text: "3 payment authorizations pending with potential 2.5-day processing delay if not addressed.",
            action: "Review workflow",
            timestamp: "1 hour ago",
          },
          {
            id: "pay-auth-2",
            type: "info",
            severity: "low",
            title: "Processing Efficiency",
            text: "HBI identified 35% faster approval cycles through automated validation workflows.",
            action: "View efficiency",
            timestamp: "3 hours ago",
          },
          {
            id: "pay-auth-3",
            type: "success",
            severity: "low",
            title: "Compliance Monitoring",
            text: "97% accuracy in detecting billing discrepancies and ensuring standard compliance.",
            action: "View compliance",
            timestamp: "6 hours ago",
          },
          {
            id: "pay-auth-4",
            type: "info",
            severity: "medium",
            title: "Cash Flow Optimization",
            text: "Streamlined authorization process improving cash flow velocity by 18%.",
            action: "View optimization",
            timestamp: "1 day ago",
          },
        ]
      }

      // Pay Applications insights
      if (currentFinancialTab === "pay-application") {
        return [
          {
            id: "pay-app-1",
            type: "warning",
            severity: "medium",
            title: "Approval Workflow Alert",
            text: "3 applications pending approval with potential 2.5-day processing delay if not addressed.",
            action: "Review applications",
            timestamp: "1 hour ago",
          },
          {
            id: "pay-app-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Impact",
            text: "$2.28M in total applications can accelerate project cash flow by 18% if processed efficiently.",
            action: "View impact",
            timestamp: "2 hours ago",
          },
          {
            id: "pay-app-3",
            type: "success",
            severity: "low",
            title: "Retention Optimization",
            text: "$285K in retention showing 92% compliance rate with potential early release opportunities.",
            action: "View retention",
            timestamp: "4 hours ago",
          },
          {
            id: "pay-app-4",
            type: "info",
            severity: "medium",
            title: "Processing Efficiency",
            text: "HBI identified 35% faster approval cycles through automated G702/G703 validation.",
            action: "View efficiency",
            timestamp: "1 day ago",
          },
        ]
      }

      // Retention insights
      if (currentFinancialTab === "retention") {
        return [
          {
            id: "retention-1",
            type: "warning",
            severity: "medium",
            title: "Release Timing Alert",
            text: "$44.5K in retention pending release within 90 days. HBI recommends proactive documentation review.",
            action: "Review timing",
            timestamp: "2 hours ago",
          },
          {
            id: "retention-2",
            type: "info",
            severity: "low",
            title: "Cash Flow Optimization",
            text: "Current retention balance represents 15.2% of total retention. Optimal release timing could improve cash flow by 12%.",
            action: "View optimization",
            timestamp: "4 hours ago",
          },
          {
            id: "retention-3",
            type: "success",
            severity: "low",
            title: "Risk Assessment",
            text: "Low retention risk across all active contracts. Average contractor performance rating of 94.2%.",
            action: "View assessment",
            timestamp: "1 day ago",
          },
          {
            id: "retention-4",
            type: "info",
            severity: "medium",
            title: "Release Optimization",
            text: "Predictive analysis indicates optimal release timing could accelerate cash flow by $86K over next quarter.",
            action: "View analysis",
            timestamp: "2 days ago",
          },
        ]
      }

      // Default Financial Overview insights
      return [
        {
          id: "financial-1",
          type: "info",
          severity: "low",
          title: "Financial Health Score",
          text: "Project financial health score of 88% indicates strong performance across all metrics.",
          action: "View details",
          timestamp: "1 hour ago",
        },
        {
          id: "financial-2",
          type: "success",
          severity: "low",
          title: "Budget Performance",
          text: "Project tracking within 2% of original budget with healthy profit margins maintained.",
          action: "View budget",
          timestamp: "3 hours ago",
        },
        {
          id: "financial-3",
          type: "warning",
          severity: "medium",
          title: "Cash Flow Monitoring",
          text: "Net cash flow at $8.2M with 65 days cash on hand. Monitor for working capital optimization.",
          action: "Review cash flow",
          timestamp: "1 day ago",
        },
        {
          id: "financial-4",
          type: "info",
          severity: "low",
          title: "Cost Control Insights",
          text: "Material costs 8.3% over budget. Consider renegotiating supplier contracts or sourcing alternatives.",
          action: "Review costs",
          timestamp: "2 days ago",
        },
      ]
    }

    // Field Management tabs - unique insights for each field management sub-tool
    if (activeTab === "field-management") {
      const fieldSubTool = navigation.subTool || "scheduler"

      // Scheduler insights
      if (fieldSubTool === "scheduler") {
        return [
          {
            id: "scheduler-1",
            type: "warning",
            severity: "medium",
            title: "Critical Path Delay Risk",
            text: "Foundation work is 3 days behind schedule. HBI recommends immediate mitigation to prevent cascade delays.",
            action: "Review schedule",
            timestamp: "1 hour ago",
          },
          {
            id: "scheduler-2",
            type: "success",
            severity: "low",
            title: "Weather Window Opportunity",
            text: "7-day clear weather forecast allows acceleration of exterior work. Consider overtime to gain schedule.",
            action: "Optimize schedule",
            timestamp: "3 hours ago",
          },
          {
            id: "scheduler-3",
            type: "info",
            severity: "medium",
            title: "Resource Optimization",
            text: "MEP trade coordination shows 95% efficiency. Excellent collaboration reducing typical conflicts.",
            action: "View metrics",
            timestamp: "1 day ago",
          },
          {
            id: "scheduler-4",
            type: "alert",
            severity: "high",
            title: "Material Delivery Alert",
            text: "Steel delivery delayed 5 days due to supplier issues. Critical path impact imminent without action.",
            action: "Contact supplier",
            timestamp: "2 hours ago",
          },
        ]
      }

      // Field Reports insights
      if (fieldSubTool === "field-reports") {
        return [
          {
            id: "field-reports-1",
            type: "info",
            severity: "low",
            title: "Daily Progress Trending",
            text: "Daily log completion rate at 98%. Excellent field documentation consistency maintained.",
            action: "View reports",
            timestamp: "30 minutes ago",
          },
          {
            id: "field-reports-2",
            type: "warning",
            severity: "medium",
            title: "Weather Impact Analysis",
            text: "3 weather delays this week affecting masonry work. Total schedule impact: 1.5 days.",
            action: "Review impacts",
            timestamp: "2 hours ago",
          },
          {
            id: "field-reports-3",
            type: "success",
            severity: "low",
            title: "Quality Milestone Achieved",
            text: "Zero quality defects reported in past 7 days. Strong craftwork and supervision performance.",
            action: "View quality data",
            timestamp: "1 day ago",
          },
          {
            id: "field-reports-4",
            type: "alert",
            severity: "high",
            title: "Safety Incident Reported",
            text: "Minor safety incident in Zone B requires immediate corrective action and crew briefing.",
            action: "Review incident",
            timestamp: "45 minutes ago",
          },
        ]
      }

      // Constraints insights
      if (fieldSubTool === "constraints") {
        return [
          {
            id: "constraints-1",
            type: "alert",
            severity: "high",
            title: "Critical Constraint Impact",
            text: "Electrical permit delay creating 7-day constraint on MEP rough-in. Immediate escalation required.",
            action: "Escalate constraint",
            timestamp: "1 hour ago",
          },
          {
            id: "constraints-2",
            type: "warning",
            severity: "medium",
            title: "Material Constraint Risk",
            text: "Structural steel delivery showing high-risk indicators. Potential 5-day schedule impact.",
            action: "Review delivery",
            timestamp: "3 hours ago",
          },
          {
            id: "constraints-3",
            type: "success",
            severity: "low",
            title: "Constraint Resolution",
            text: "Crane availability constraint resolved 2 days early. Schedule acceleration opportunity identified.",
            action: "Optimize schedule",
            timestamp: "6 hours ago",
          },
          {
            id: "constraints-4",
            type: "info",
            severity: "medium",
            title: "Constraint Trending",
            text: "12 active constraints down from 18 last week. Strong constraint management performance.",
            action: "View trends",
            timestamp: "1 day ago",
          },
        ]
      }

      // Permit Log insights
      if (fieldSubTool === "permit-log") {
        return [
          {
            id: "permit-1",
            type: "warning",
            severity: "medium",
            title: "Permit Expiration Alert",
            text: "Building permit expires in 15 days. Renewal process should begin immediately to avoid delays.",
            action: "Begin renewal",
            timestamp: "2 hours ago",
          },
          {
            id: "permit-2",
            type: "success",
            severity: "low",
            title: "Inspection Passed",
            text: "Electrical rough-in inspection passed with zero defects. Work can proceed to next phase.",
            action: "View inspection",
            timestamp: "4 hours ago",
          },
          {
            id: "permit-3",
            type: "alert",
            severity: "high",
            title: "Failed Inspection",
            text: "Plumbing inspection failed due to code violations. Immediate remediation required.",
            action: "Review violations",
            timestamp: "1 day ago",
          },
          {
            id: "permit-4",
            type: "info",
            severity: "low",
            title: "Permit Application Status",
            text: "3 new permit applications submitted and under review. Expected approval within 5-7 business days.",
            action: "Track applications",
            timestamp: "2 days ago",
          },
        ]
      }
    }

    // Pre-Construction tab insights
    if (activeTab === "pre-construction") {
      return [
        {
          id: "precon-1",
          type: "success",
          severity: "low",
          title: "Estimate Validation Complete",
          text: "Final estimate has been validated and approved by all stakeholders.",
          action: "View estimate",
          timestamp: "1 day ago",
        },
        {
          id: "precon-2",
          type: "warning",
          severity: "medium",
          title: "BIM Coordination Required",
          text: "MEP trades require coordination meeting before finalizing installation sequence.",
          action: "Schedule meeting",
          timestamp: "2 days ago",
        },
        {
          id: "precon-3",
          type: "info",
          severity: "low",
          title: "Permit Status Update",
          text: "8 of 12 permits have been submitted and are under review by local authorities.",
          action: "Check status",
          timestamp: "3 days ago",
        },
        {
          id: "precon-4",
          type: "alert",
          severity: "high",
          title: "Subcontractor Selection",
          text: "Electrical subcontractor selection deadline is approaching. 3 bids received.",
          action: "Review bids",
          timestamp: "4 days ago",
        },
      ]
    }

    // Warranty Management tab insights
    if (activeTab === "warranty") {
      return [
        {
          id: "warranty-1",
          type: "warning",
          severity: "medium",
          title: "HVAC Warranty Claim",
          text: "Air conditioning unit not maintaining temperature. Technician scheduled for tomorrow.",
          action: "View claim",
          timestamp: "2 hours ago",
        },
        {
          id: "warranty-2",
          type: "success",
          severity: "low",
          title: "Roofing Warranty Complete",
          text: "Roofing warranty claim #245 has been resolved. Replacement materials installed.",
          action: "View details",
          timestamp: "1 day ago",
        },
        {
          id: "warranty-3",
          type: "info",
          severity: "low",
          title: "Labor Warranty Coverage",
          text: "8 active labor warranties providing $450K coverage. Next expiration in 3 months.",
          action: "Review coverage",
          timestamp: "3 days ago",
        },
        {
          id: "warranty-4",
          type: "alert",
          severity: "high",
          title: "Warranty Document Upload",
          text: "Missing warranty documentation for electrical work. Upload required for compliance.",
          action: "Upload docs",
          timestamp: "5 hours ago",
        },
      ]
    }

    // Compliance tab insights
    if (activeTab === "compliance") {
      return [
        {
          id: "compliance-1",
          type: "warning",
          severity: "medium",
          title: "Contract Review Required",
          text: "3 trade partner contracts require compliance review before execution. Legal review needed.",
          action: "Schedule review",
          timestamp: "1 hour ago",
        },
        {
          id: "compliance-2",
          type: "success",
          severity: "low",
          title: "Insurance Verification Complete",
          text: "All subcontractor insurance certificates verified and current. 100% compliance achieved.",
          action: "View certificates",
          timestamp: "3 hours ago",
        },
        {
          id: "compliance-3",
          type: "alert",
          severity: "high",
          title: "License Expiration Alert",
          text: "Electrical contractor license expires in 30 days. Renewal documentation required.",
          action: "Request renewal",
          timestamp: "1 day ago",
        },
        {
          id: "compliance-4",
          type: "info",
          severity: "low",
          title: "Trade Partner Scorecard",
          text: "Overall trade partner compliance score: 94%. Strong performance across all metrics.",
          action: "View scorecard",
          timestamp: "2 days ago",
        },
      ]
    }

    // Core Project Tools tabs - unique insights for each core tab
    if (activeTab === "core" || !activeTab) {
      // Dashboard tab (default)
      if (!navigation.coreTab || navigation.coreTab === "dashboard") {
        return [
          {
            id: "dashboard-1",
            type: "info",
            severity: "low",
            title: "Project Health Score",
            text: "Overall project health score of 87% indicates strong performance across all KPIs.",
            action: "View details",
            timestamp: "1 hour ago",
          },
          {
            id: "dashboard-2",
            type: "success",
            severity: "low",
            title: "Milestone Achievement",
            text: "Foundation milestone completed 2 days ahead of schedule. Excellent progress momentum.",
            action: "View milestone",
            timestamp: "3 hours ago",
          },
          {
            id: "dashboard-3",
            type: "warning",
            severity: "medium",
            title: "Budget Variance Trending",
            text: "Material costs trending 2.1% above baseline. Monitor for potential budget impact.",
            action: "Review budget",
            timestamp: "1 day ago",
          },
          {
            id: "dashboard-4",
            type: "info",
            severity: "medium",
            title: "Team Performance",
            text: "Project team productivity up 15% this month. Strong collaboration and efficiency.",
            action: "View metrics",
            timestamp: "2 days ago",
          },
        ]
      }

      // Checklists tab
      if (navigation.coreTab === "checklists") {
        return [
          {
            id: "checklist-1",
            type: "success",
            severity: "low",
            title: "StartUp Checklist Progress",
            text: "78% of startup checklist items completed. On track for project launch milestone.",
            action: "View checklist",
            timestamp: "2 hours ago",
          },
          {
            id: "checklist-2",
            type: "warning",
            severity: "medium",
            title: "Safety Checklist Gap",
            text: "5 safety checklist items require immediate attention before next phase can begin.",
            action: "Complete items",
            timestamp: "4 hours ago",
          },
          {
            id: "checklist-3",
            type: "info",
            severity: "low",
            title: "Quality Checklist Review",
            text: "Quality control checklist shows 95% completion rate. Excellent quality management.",
            action: "View quality data",
            timestamp: "1 day ago",
          },
          {
            id: "checklist-4",
            type: "alert",
            severity: "high",
            title: "Closeout Preparation",
            text: "Closeout checklist preparation needed for upcoming substantial completion milestone.",
            action: "Start closeout prep",
            timestamp: "3 days ago",
          },
        ]
      }

      // Productivity tab
      if (navigation.coreTab === "productivity") {
        return [
          {
            id: "prod-1",
            type: "success",
            severity: "low",
            title: "Team Collaboration Active",
            text: "Team communication frequency has increased 25% this week, indicating good engagement.",
            action: "View activity",
            timestamp: "1 hour ago",
          },
          {
            id: "prod-2",
            type: "warning",
            severity: "medium",
            title: "Task Completion Trend",
            text: "Task completion rate has dropped 15% from last week. Consider workload redistribution.",
            action: "Review tasks",
            timestamp: "4 hours ago",
          },
          {
            id: "prod-3",
            type: "info",
            severity: "low",
            title: "Communication Efficiency",
            text: "Average response time to messages has improved to 2.3 hours.",
            action: "View metrics",
            timestamp: "1 day ago",
          },
          {
            id: "prod-4",
            type: "alert",
            severity: "high",
            title: "Overdue Tasks Alert",
            text: "3 tasks are approaching their due dates. Immediate attention required.",
            action: "Review overdue",
            timestamp: "2 days ago",
          },
        ]
      }

      // Staffing tab
      if (navigation.coreTab === "staffing") {
        return [
          {
            id: "staffing-1",
            type: "warning",
            severity: "medium",
            title: "Resource Allocation Gap",
            text: "Electrical crew understaffed by 2 members for next phase. Consider reallocating resources.",
            action: "Review staffing",
            timestamp: "1 hour ago",
          },
          {
            id: "staffing-2",
            type: "success",
            severity: "low",
            title: "Team Efficiency High",
            text: "Current team showing 112% productivity versus baseline. Excellent performance metrics.",
            action: "View performance",
            timestamp: "3 hours ago",
          },
          {
            id: "staffing-3",
            type: "info",
            severity: "medium",
            title: "Training Completion",
            text: "Safety training completion rate at 95%. All team members current on certifications.",
            action: "View training",
            timestamp: "1 day ago",
          },
          {
            id: "staffing-4",
            type: "alert",
            severity: "high",
            title: "SPCR Review Required",
            text: "3 Staffing Plan Change Requests require approval before implementation.",
            action: "Review SPCRs",
            timestamp: "2 days ago",
          },
        ]
      }

      // Responsibility Matrix tab
      if (navigation.coreTab === "responsibility-matrix") {
        return [
          {
            id: "responsibility-1",
            type: "info",
            severity: "low",
            title: "Matrix Coverage Analysis",
            text: "Responsibility matrix shows 87% role assignment coverage. Strong accountability structure.",
            action: "View matrix",
            timestamp: "2 hours ago",
          },
          {
            id: "responsibility-2",
            type: "warning",
            severity: "medium",
            title: "Unassigned Responsibilities",
            text: "5 critical responsibilities lack clear ownership. Assign accountable parties immediately.",
            action: "Assign roles",
            timestamp: "4 hours ago",
          },
          {
            id: "responsibility-3",
            type: "success",
            severity: "low",
            title: "Decision Authority Clear",
            text: "Decision-making authority clearly defined for 95% of project activities.",
            action: "View decisions",
            timestamp: "1 day ago",
          },
          {
            id: "responsibility-4",
            type: "alert",
            severity: "high",
            title: "Role Conflict Identified",
            text: "Overlapping responsibilities between trades creating coordination issues.",
            action: "Resolve conflict",
            timestamp: "3 days ago",
          },
        ]
      }

      // Reports tab
      if (navigation.coreTab === "reports") {
        return [
          {
            id: "reports-1",
            type: "info",
            severity: "low",
            title: "Report Generation Status",
            text: "Weekly project report generated automatically. 15 stakeholders notified via email distribution.",
            action: "View report",
            timestamp: "1 hour ago",
          },
          {
            id: "reports-2",
            type: "warning",
            severity: "medium",
            title: "Approval Workflow Delay",
            text: "2 reports pending executive approval for 5+ days. Consider expediting review process.",
            action: "Expedite approval",
            timestamp: "2 hours ago",
          },
          {
            id: "reports-3",
            type: "success",
            severity: "low",
            title: "Data Quality Excellent",
            text: "Report data accuracy at 98.5%. High-quality information driving decision making.",
            action: "View analytics",
            timestamp: "1 day ago",
          },
          {
            id: "reports-4",
            type: "alert",
            severity: "high",
            title: "Critical Report Due",
            text: "Monthly executive dashboard due in 24 hours. Finalize data validation immediately.",
            action: "Complete report",
            timestamp: "4 hours ago",
          },
        ]
      }
    }

    // Default fallback insights
    return [
      {
        id: "default-1",
        type: "info",
        severity: "low",
        title: "Project Status Update",
        text: "Project is progressing well with all major milestones on track.",
        action: "View details",
        timestamp: "1 day ago",
      },
      {
        id: "default-2",
        type: "warning",
        severity: "medium",
        title: "Budget Variance Alert",
        text: "Material costs are trending 3% above budget. Consider cost optimization measures.",
        action: "Review budget",
        timestamp: "2 days ago",
      },
      {
        id: "default-3",
        type: "success",
        severity: "low",
        title: "Safety Milestone",
        text: "Project achieved 90 consecutive days without safety incidents.",
        action: "View safety report",
        timestamp: "3 days ago",
      },
      {
        id: "default-4",
        type: "info",
        severity: "medium",
        title: "Schedule Optimization",
        text: "Weather conditions favorable for accelerated concrete pours this week.",
        action: "Update schedule",
        timestamp: "4 days ago",
      },
    ]
  }

  // Get HBI Insights title based on active tab
  const getHBIInsightsTitle = () => {
    // Financial Management tabs
    if (activeTab === "financial-management" || activeTab === "financial-hub") {
      const currentFinancialTab = navigation.tool === "financial-management" ? navigation.subTool : "overview"

      switch (currentFinancialTab) {
        case "budget-analysis":
          return "HBI Budget Analysis Insights"
        case "jchr":
          return "HBI Job Cost History Insights"
        case "ar-aging":
          return "HBI AR Aging Insights"
        case "cash-flow":
          return "HBI Cash Flow Insights"
        case "forecasting":
          return "HBI Forecasting Insights"
        case "change-management":
          return "HBI Change Management Insights"
        case "pay-authorization":
          return "HBI Pay Authorization Insights"
        case "pay-application":
          return "HBI Pay Application Insights"
        case "retention":
          return "HBI Retention Management Insights"
        default:
          return "HBI Financial Hub Insights"
      }
    }

    // Field Management tabs
    if (activeTab === "field-management") {
      const fieldSubTool = navigation.subTool || "scheduler"

      switch (fieldSubTool) {
        case "scheduler":
          return "HBI Scheduler Insights"
        case "field-reports":
          return "HBI Field Reports Insights"
        case "constraints":
          return "HBI Constraints Management Insights"
        case "permit-log":
          return "HBI Permit Log Insights"
        default:
          return "HBI Field Management Insights"
      }
    }

    // Pre-Construction tab
    if (activeTab === "pre-construction") {
      return "HBI Pre-Construction Insights"
    }

    // Warranty Management tab
    if (activeTab === "warranty") {
      return "HBI Warranty Management Insights"
    }

    // Compliance tab
    if (activeTab === "compliance") {
      return "HBI Compliance Insights"
    }

    // Core Project Tools tabs
    if (activeTab === "core" || !activeTab) {
      if (!navigation.coreTab || navigation.coreTab === "dashboard") {
        return "HBI Project Dashboard Insights"
      }

      switch (navigation.coreTab) {
        case "checklists":
          return "HBI Checklists Insights"
        case "productivity":
          return "HBI Productivity Insights"
        case "staffing":
          return "HBI Staffing Insights"
        case "responsibility-matrix":
          return "HBI Responsibility Matrix Insights"
        case "reports":
          return "HBI Reports Insights"
        default:
          return "HBI Core Tools Insights"
      }
    }

    return "HBI Project Insights"
  }

  // Check project stage
  const isBiddingStage = projectData?.project_stage_name === "Bidding"
  const isConstructionStage = projectData?.project_stage_name === "Construction"

  // Calculate bidding-specific metrics
  const getBiddingMetrics = () => {
    const today = new Date()
    const clientBidDueDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    const subBidDueDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    const deliverablesToMarketing = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
    const preSubmissionReview = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
    const winStrategy = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now

    // Calculate coverage score (mock calculation based on project stage timing)
    const daysUntilClientDue = Math.ceil((clientBidDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const baseCoverage = 3.25 // Base coverage score
    const timeFactorAdjustment = daysUntilClientDue > 10 ? 0.75 : daysUntilClientDue > 5 ? 0.25 : -0.25
    const coverageScore = Math.max(1.0, Math.min(5.0, baseCoverage + timeFactorAdjustment))

    return {
      clientBidDueDate: clientBidDueDate.toLocaleDateString(),
      subBidDueDate: subBidDueDate.toLocaleDateString(),
      coverageScore: coverageScore.toFixed(2),
      deliverablesToMarketing: deliverablesToMarketing.toLocaleDateString(),
      preSubmissionReview: `${preSubmissionReview.toLocaleDateString()} 10:00`,
      winStrategy: `${winStrategy.toLocaleDateString()} 14:30`,
    }
  }

  // Calculate construction-specific metrics
  const getConstructionMetrics = () => {
    // Mock data for PCCOs and PCOs
    const totalPCCOsApproved = 8
    const pcosPendingPCCO = 3

    // Get dates from projectData and format as mm/dd/yyyy
    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A"
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US")
    }

    return {
      totalPCCOsApproved,
      pcosPendingPCCO,
      approvedExtensions: projectData?.approved_extensions || 0,
      contractCompletionDate: formatDate(projectData?.original_completion_date),
      projectedCompletionDate: formatDate(projectData?.projected_finish_date),
    }
  }

  const biddingMetrics = getBiddingMetrics()
  const constructionMetrics = getConstructionMetrics()

  return (
    <div className="space-y-4">
      {/* Project Overview Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="pb-3 border-b border-border">
            <p className="text-xs text-muted-foreground mb-2">Description</p>
            <ExpandableDescription description={projectData?.description || "No description available"} />
          </div>
          {/* Project Metrics - Conditional based on project stage */}
          <div className="space-y-2">
            {isBiddingStage ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client Bid Due Date</span>
                  <span className="font-medium">{biddingMetrics.clientBidDueDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sub Bid Due Date</span>
                  <span className="font-medium">{biddingMetrics.subBidDueDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Coverage Score</span>
                  <span
                    className={`font-medium ${
                      parseFloat(biddingMetrics.coverageScore) >= 4.0
                        ? "text-green-600"
                        : parseFloat(biddingMetrics.coverageScore) >= 3.0
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {biddingMetrics.coverageScore}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deliverables to Marketing</span>
                  <span className="font-medium">{biddingMetrics.deliverablesToMarketing}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pre-Submission Review</span>
                  <span className="font-medium">{biddingMetrics.preSubmissionReview}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Win Strategy</span>
                  <span className="font-medium">{biddingMetrics.winStrategy}</span>
                </div>
              </>
            ) : isConstructionStage ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Value</span>
                  <span className="font-medium">${(projectMetrics?.totalBudget || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Job Cost to Date</span>
                  <span className="font-medium">${(projectMetrics?.spentToDate || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total PCCOs Approved</span>
                  <span className="font-medium">{constructionMetrics.totalPCCOsApproved}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PCOs Pending PCCO</span>
                  <span className="font-medium">{constructionMetrics.pcosPendingPCCO}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Approved Extensions</span>
                  <span className="font-medium">{constructionMetrics.approvedExtensions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Completion Date</span>
                  <span className="font-medium">{constructionMetrics.contractCompletionDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Projected Completion Date</span>
                  <span className="font-medium">{constructionMetrics.projectedCompletionDate}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contract Value</span>
                  <span className="font-medium">${(projectMetrics?.totalBudget || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent to Date</span>
                  <span className="font-medium">${(projectMetrics?.spentToDate || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Schedule Progress</span>
                  <span className="font-medium text-blue-600">{projectMetrics?.scheduleProgress || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget Progress</span>
                  <span className="font-medium text-green-600">{projectMetrics?.budgetProgress || 0}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Team Members</span>
                  <span className="font-medium">{projectMetrics?.activeTeamMembers || 0}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bid Management Navigation - Conditional for Pre-Construction Estimating */}
      {activeTab === "pre-construction" && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Bid Management</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1 p-4">
              {[
                { id: "packages", label: "Bid Packages", icon: Package, count: 3 },
                { id: "messages", label: "Messages", icon: MessageSquare, count: 3 },
                { id: "files", label: "Files", icon: FileText, count: 12 },
                { id: "forms", label: "Forms", icon: Settings, count: 1 },
                { id: "team", label: "Team", icon: Users, count: 4 },
                { id: "reports", label: "Reports", icon: BarChart3, count: 1 },
                { id: "details", label: "Project Details", icon: Building2 },
                { id: "bid-tabs", label: "Bid Tabs", icon: PieChart },
              ].map((item) => {
                const IconComponent = item.icon
                return (
                  <button
                    key={item.id}
                    className="flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
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
      )}

      {/* HBI Insights Panel */}
      <ExpandableHBIInsights config={getHBIInsights()} title={getHBIInsightsTitle()} />

      {/* Quick Actions Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {getQuickActions().map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={action.onClick}
            >
              <action.icon className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Key Metrics Panel */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {getKeyMetrics().map((metric, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className={`font-medium text-${metric.color}-600`}>{metric.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get bid package name
function getBidPackageName(packageId: string): string {
  const packageNames: { [key: string]: string } = {
    "01-00": "Materials Testing",
    "02-21": "Surveying",
    "03-33": "Concrete",
    "03-35": "Hollow Core Concrete",
    "04-22": "Masonry",
    "05-70": "Decorative Metals",
    "06-11": "Wood Framing",
    "06-17": "Wood Trusses",
  }
  return packageNames[packageId] || packageId
}

export default ProjectControlCenterContent
// Export the Field Management content for right panel injection
export const getFieldManagementRightPanelContent = (
  projectData: any,
  userRole: string,
  projectId: string,
  selectedSubTool: string = "overview",
  onSidebarContentChange?: (content: React.ReactNode) => void
) => {
  return (
    <div className="h-full w-full overflow-hidden">
      <FieldManagementContent
        selectedSubTool={selectedSubTool}
        projectData={projectData}
        userRole={userRole}
        projectId={projectId}
        onSidebarContentChange={onSidebarContentChange}
        className="w-full h-full"
      />
    </div>
  )
}
