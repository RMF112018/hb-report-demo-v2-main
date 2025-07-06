"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Download,
  Plus,
  Edit,
  Eye,
  Users,
  Calendar,
  Activity,
  Home,
  Building,
  Zap,
  Lock,
  FileCheck,
  AlertCircle,
  TrendingUp,
  BarChart3,
  History,
  FileSearch,
  UserCheck,
  Clipboard,
  Database,
  GitBranch,
  CheckSquare,
  XCircle,
  Info,
} from "lucide-react"

import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import ChangeGovernancePanelCard from "@/components/cards/it/ChangeGovernancePanelCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * IT Command Center - Governance Page
 * -----------------------------------
 * Policy enforcement, system change logs, and compliance readiness management
 * Features:
 * - Change management workflow
 * - Policy compliance monitoring
 * - Audit trail management
 * - Compliance automation integration preparation
 * - Mobile-responsive layout following project page structure
 */
export default function GovernancePage() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  // Governance-specific AI insights
  const governanceInsights = [
    {
      id: "governance-1",
      type: "risk",
      severity: "medium",
      title: "Policy Compliance Gap",
      text: "8 pending change requests exceed standard approval timeframes, risking compliance violations.",
      action: "Review approval workflows and implement escalation procedures for delayed requests.",
      confidence: 91,
      relatedMetrics: ["Change Management", "Policy Compliance", "Approval Workflows"],
    },
    {
      id: "governance-2",
      type: "alert",
      severity: "high",
      title: "Security Policy Deviation",
      text: "3 audit findings related to access control policies require immediate attention.",
      action: "Address access control violations and implement enhanced monitoring procedures.",
      confidence: 94,
      relatedMetrics: ["Access Control", "Audit Findings", "Security Policies"],
    },
    {
      id: "governance-3",
      type: "performance",
      severity: "low",
      title: "Governance Effectiveness",
      text: "94.2% compliance score maintained across all governance policies, exceeding targets.",
      action: "Continue current governance practices and share best practices across teams.",
      confidence: 96,
      relatedMetrics: ["Compliance Score", "Governance Effectiveness", "Policy Adherence"],
    },
    {
      id: "governance-4",
      type: "opportunity",
      severity: "medium",
      title: "Process Automation Potential",
      text: "35% of change requests could be automated, reducing approval times by 2.5 days average.",
      action: "Implement automated workflows for low-risk change categories.",
      confidence: 87,
      relatedMetrics: ["Process Automation", "Change Request", "Approval Efficiency"],
    },
    {
      id: "governance-5",
      type: "forecast",
      severity: "low",
      title: "Audit Readiness Planning",
      text: "Next compliance audit scheduled in 7 weeks, current readiness at 96.8%.",
      action: "Complete remaining audit preparation tasks and schedule pre-audit review.",
      confidence: 92,
      relatedMetrics: ["Audit Readiness", "Compliance Preparation", "Risk Assessment"],
    },
  ]

  // Restrict access to admin users only
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the IT Command Center.</p>
        </div>
      </div>
    )
  }

  // Mock governance data
  const governanceData = {
    totalChanges: 127,
    pendingApprovals: 8,
    complianceScore: 94.2,
    auditFindings: 3,
    policiesCount: 24,
    lastAuditDate: "2024-11-15",
    nextAuditDate: "2025-02-15",
    riskLevel: "Low",
  }

  // Mock change requests
  const changeRequests = [
    {
      id: "CR-2024-089",
      title: "Azure AD Security Policy Update",
      category: "Security",
      status: "Pending Approval",
      priority: "High",
      requestedBy: "Sarah Johnson",
      requestDate: "2024-12-20",
      approver: "Michael Chen",
      description: "Update MFA requirements for all users",
      riskLevel: "Medium",
      implementationDate: "2024-12-30",
    },
    {
      id: "CR-2024-088",
      title: "Network Firewall Configuration",
      category: "Infrastructure",
      status: "Approved",
      priority: "Critical",
      requestedBy: "David Martinez",
      requestDate: "2024-12-18",
      approver: "Michael Chen",
      description: "Block additional malicious IP ranges",
      riskLevel: "Low",
      implementationDate: "2024-12-22",
    },
    {
      id: "CR-2024-087",
      title: "Employee Onboarding Process",
      category: "HR Policy",
      status: "Implemented",
      priority: "Medium",
      requestedBy: "Lisa Garcia",
      requestDate: "2024-12-15",
      approver: "Michael Chen",
      description: "Streamline new employee IT setup",
      riskLevel: "Low",
      implementationDate: "2024-12-20",
    },
    {
      id: "CR-2024-086",
      title: "Data Retention Policy",
      category: "Compliance",
      status: "Under Review",
      priority: "High",
      requestedBy: "Jennifer White",
      requestDate: "2024-12-10",
      approver: "Michael Chen",
      description: "Update retention periods for project data",
      riskLevel: "Medium",
      implementationDate: "2025-01-05",
    },
  ]

  // Mock audit log entries
  const auditLogEntries = [
    {
      id: "AL-2024-1234",
      timestamp: "2024-12-26 14:30:00",
      action: "Policy Updated",
      user: "Sarah Johnson",
      resource: "Password Policy",
      details: "Minimum length changed from 8 to 12 characters",
      outcome: "Success",
      riskLevel: "Low",
    },
    {
      id: "AL-2024-1233",
      timestamp: "2024-12-26 09:15:00",
      action: "User Access Granted",
      user: "Michael Chen",
      resource: "Azure AD - Finance Group",
      details: "Added user john.doe@hedrickbrothers.com",
      outcome: "Success",
      riskLevel: "Low",
    },
    {
      id: "AL-2024-1232",
      timestamp: "2024-12-25 16:45:00",
      action: "Configuration Change",
      user: "David Martinez",
      resource: "Firewall Rules",
      details: "Blocked IP range 192.168.100.0/24",
      outcome: "Success",
      riskLevel: "Medium",
    },
    {
      id: "AL-2024-1231",
      timestamp: "2024-12-25 11:20:00",
      action: "Failed Login Attempt",
      user: "Unknown",
      resource: "Admin Panel",
      details: "Multiple failed login attempts from IP 203.0.113.45",
      outcome: "Blocked",
      riskLevel: "High",
    },
  ]

  // Mock compliance frameworks
  const complianceFrameworks = [
    {
      name: "SOC 2 Type II",
      status: "Compliant",
      lastAssessment: "2024-11-15",
      nextAssessment: "2025-11-15",
      score: 98.5,
      findings: 1,
    },
    {
      name: "ISO 27001",
      status: "In Progress",
      lastAssessment: "2024-10-01",
      nextAssessment: "2025-01-15",
      score: 89.2,
      findings: 5,
    },
    {
      name: "GDPR",
      status: "Compliant",
      lastAssessment: "2024-12-01",
      nextAssessment: "2025-06-01",
      score: 95.7,
      findings: 2,
    },
  ]

  // Filter change requests
  const filteredChanges = useMemo(() => {
    let changes = changeRequests

    if (selectedStatus !== "all") {
      changes = changes.filter((change) => change.status.toLowerCase().includes(selectedStatus.toLowerCase()))
    }

    if (selectedCategory !== "all") {
      changes = changes.filter((change) => change.category.toLowerCase().includes(selectedCategory.toLowerCase()))
    }

    return changes
  }, [selectedStatus, selectedCategory])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending approval":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "approved":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "implemented":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
      case "under review":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      case "high":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
      case "low":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      case "medium":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "low":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome.toLowerCase()) {
      case "success":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "blocked":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Sticky Header - Following project page structure */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/it-command-center" className="text-muted-foreground hover:text-foreground">
                    IT Command Center
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Governance & Compliance</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Title and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                  Governance & Compliance
                </h1>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {governanceData.complianceScore}% Compliant
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Plus className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">New Policy</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <RefreshCw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  <Settings className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </div>
            </div>

            {/* IT Module Navigation */}
            <div className="mt-3">
              <ITModuleNavigation />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout - Following project page structure */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Priority Cards */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Compliance Score - Mobile */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Compliance Score</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Score</span>
                  <span className="font-medium text-green-600">{governanceData.complianceScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="font-medium text-green-600">{governanceData.riskLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Open Findings</span>
                  <span className="font-medium text-orange-600">{governanceData.auditFindings}</span>
                </div>
              </div>
            </div>

            {/* Change Requests - Mobile */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Change Requests</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Changes</span>
                  <span className="font-medium">{governanceData.totalChanges}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Approval</span>
                  <span className="font-medium text-orange-600">{governanceData.pendingApprovals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Policies</span>
                  <span className="font-medium">{governanceData.policiesCount}</span>
                </div>
              </div>
            </div>

            {/* Audit Schedule - Mobile */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Audit Schedule</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Audit</span>
                  <span className="font-medium">{new Date(governanceData.lastAuditDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Next Audit</span>
                  <span className="font-medium">{new Date(governanceData.nextAuditDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days Until</span>
                  <span className="font-medium text-blue-600">
                    {Math.ceil(
                      (new Date(governanceData.nextAuditDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Governance Overview */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Governance Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Compliance Score</span>
                  <span className="font-medium text-green-600">{governanceData.complianceScore}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Changes</span>
                  <span className="font-medium">{governanceData.totalChanges}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Approvals</span>
                  <span className="font-medium text-orange-600">{governanceData.pendingApprovals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="font-medium text-green-600">{governanceData.riskLevel}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Change Request
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Policies
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Compliance Frameworks */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Compliance Frameworks</h3>
              <div className="space-y-3">
                {complianceFrameworks.map((framework) => (
                  <div key={framework.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{framework.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          framework.status === "Compliant"
                            ? "text-green-600 bg-green-100"
                            : "text-orange-600 bg-orange-100"
                        }
                      >
                        {framework.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Score: {framework.score}% • {framework.findings} findings
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Integration Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Vanta</span>
                  </div>
                  <Badge variant="outline" className="text-orange-600 bg-orange-100">
                    Planned
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Drata</span>
                  </div>
                  <Badge variant="outline" className="text-orange-600 bg-orange-100">
                    Evaluation
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ServiceNow</span>
                  </div>
                  <Badge variant="outline" className="text-blue-600 bg-blue-100">
                    Integrated
                  </Badge>
                </div>
              </div>
            </div>

            {/* HBI Governance Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI Governance Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={governanceInsights} cardId="governance-insights" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-9">
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">Governance & Compliance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="changes">Changes</TabsTrigger>
                    <TabsTrigger value="audit">Audit Logs</TabsTrigger>
                    <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Change Governance Panel Card */}
                      <div className="md:col-span-2 lg:col-span-3">
                        <ChangeGovernancePanelCard />
                      </div>

                      {/* Recent Changes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Changes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {changeRequests.slice(0, 3).map((change) => (
                              <div key={change.id} className="flex items-start gap-3">
                                <div className={`p-1 rounded ${getPriorityColor(change.priority)}`}>
                                  <GitBranch className="h-3 w-3" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{change.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {change.id} • {change.requestedBy}
                                  </p>
                                  <Badge variant="outline" className={getStatusColor(change.status)}>
                                    {change.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Compliance Score */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Compliance Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              {governanceData.complianceScore}%
                            </div>
                            <div className="text-sm text-muted-foreground mb-4">Overall Compliance Rating</div>
                            <div className="bg-muted rounded-full h-2">
                              <div
                                className="bg-green-500 rounded-full h-2 transition-all duration-300"
                                style={{ width: `${governanceData.complianceScore}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Risk Assessment */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Security Risk</span>
                              <Badge variant="outline" className="text-green-600 bg-green-100">
                                Low
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Compliance Risk</span>
                              <Badge variant="outline" className="text-yellow-600 bg-yellow-100">
                                Medium
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Operational Risk</span>
                              <Badge variant="outline" className="text-green-600 bg-green-100">
                                Low
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Overall Risk</span>
                              <Badge variant="outline" className="text-green-600 bg-green-100">
                                {governanceData.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="changes" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending Approval</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="implemented">Implemented</SelectItem>
                            <SelectItem value="review">Under Review</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                            <SelectItem value="policy">HR Policy</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Change Requests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Requested By</TableHead>
                              <TableHead>Risk Level</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredChanges.map((change) => (
                              <TableRow key={change.id}>
                                <TableCell className="font-medium">{change.id}</TableCell>
                                <TableCell>
                                  <div>
                                    <span className="text-sm font-medium">{change.title}</span>
                                    <div className="text-xs text-muted-foreground">{change.description}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{change.category}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getPriorityColor(change.priority)}>
                                    {change.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(change.status)}>
                                    {change.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{change.requestedBy}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getRiskLevelColor(change.riskLevel)}>
                                    {change.riskLevel}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="audit" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Audit Trail</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>User</TableHead>
                              <TableHead>Resource</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead>Outcome</TableHead>
                              <TableHead>Risk Level</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {auditLogEntries.map((entry) => (
                              <TableRow key={entry.id}>
                                <TableCell className="text-sm">{entry.timestamp}</TableCell>
                                <TableCell className="font-medium">{entry.action}</TableCell>
                                <TableCell className="text-sm">{entry.user}</TableCell>
                                <TableCell className="text-sm">{entry.resource}</TableCell>
                                <TableCell className="text-sm">{entry.details}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getOutcomeColor(entry.outcome)}>
                                    {entry.outcome}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getRiskLevelColor(entry.riskLevel)}>
                                    {entry.riskLevel}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="compliance" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Compliance Frameworks */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Compliance Frameworks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {complianceFrameworks.map((framework) => (
                              <div key={framework.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{framework.name}</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      framework.status === "Compliant"
                                        ? "text-green-600 bg-green-100"
                                        : "text-orange-600 bg-orange-100"
                                    }
                                  >
                                    {framework.status}
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>Score: {framework.score}%</span>
                                  <span>{framework.findings} findings</span>
                                </div>
                                <div className="bg-muted rounded-full h-2">
                                  <div
                                    className={`rounded-full h-2 ${
                                      framework.score > 95
                                        ? "bg-green-500"
                                        : framework.score > 85
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                    style={{ width: `${framework.score}%` }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Last: {new Date(framework.lastAssessment).toLocaleDateString()} • Next:{" "}
                                  {new Date(framework.nextAssessment).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Integration Roadmap */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Integration Roadmap</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Shield className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">Vanta Integration</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Automated compliance monitoring and SOC 2 preparation
                                </p>
                                <Badge variant="outline" className="text-orange-600 bg-orange-100">
                                  Q1 2025
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <FileCheck className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">Drata Platform</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Continuous compliance monitoring and evidence collection
                                </p>
                                <Badge variant="outline" className="text-yellow-600 bg-yellow-100">
                                  Evaluation
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Database className="h-4 w-4 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">ServiceNow GRC</h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  Governance, risk, and compliance workflow automation
                                </p>
                                <Badge variant="outline" className="text-green-600 bg-green-100">
                                  Active
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
