"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Users,
  Settings,
  Brain,
  Building2,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Download,
  Home,
  Globe,
  Activity,
  CheckCircle,
  ExternalLink,
  Info,
  UserPlus,
  DollarSign,
  Zap,
  XCircle,
  AlertTriangle,
  Clock,
  Database,
  Key,
  FileText,
  Monitor,
  Smartphone,
} from "lucide-react"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import HbIntelManagementCard from "@/components/cards/it/HbIntelManagementCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * HB Intel Management Command Center
 * ----------------------------------
 * Centralized command console for managing HB Intel operations including:
 * - User & role administration
 * - SSO/MFA/session/security policy management
 * - New project creation wizard
 * - AI/ML system settings
 * - Application metadata and deployment info
 * - Microsoft Graph integration points
 */
export default function HBIntelManagementPage() {
  const { user } = useAuth()
  const { startTour, isTourAvailable } = useTour()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false)
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false)

  // Management-specific AI insights
  const managementInsights = [
    {
      id: "mgmt-1",
      type: "performance",
      severity: "low",
      title: "System Performance Excellence",
      text: "99.94% uptime maintained with AI models processing 2,295 requests daily across all projects.",
      action: "Continue current monitoring practices and optimize resource allocation during peak hours.",
      confidence: 97,
      relatedMetrics: ["System Uptime", "AI Performance", "Request Processing"],
    },
    {
      id: "mgmt-2",
      type: "alert",
      severity: "medium",
      title: "User Onboarding Backlog",
      text: "24 pending user accounts requiring MFA setup and role assignment, delaying project access.",
      action: "Implement automated onboarding workflow and schedule bulk MFA enrollment session.",
      confidence: 93,
      relatedMetrics: ["User Management", "MFA Adoption", "Access Control"],
    },
    {
      id: "mgmt-3",
      type: "opportunity",
      severity: "medium",
      title: "AI Cost Optimization",
      text: "15% reduction in AI processing costs possible through intelligent job batching and model optimization.",
      action: "Implement request queuing system and optimize AI model selection algorithms.",
      confidence: 88,
      relatedMetrics: ["AI Costs", "Resource Optimization", "Operational Efficiency"],
    },
    {
      id: "mgmt-4",
      type: "forecast",
      severity: "low",
      title: "User Growth Projection",
      text: "User base growing 12% quarterly, requiring infrastructure scaling within 6 months.",
      action: "Plan license procurement and infrastructure expansion for projected 300+ users.",
      confidence: 86,
      relatedMetrics: ["User Growth", "License Management", "Infrastructure Planning"],
    },
    {
      id: "mgmt-5",
      type: "risk",
      severity: "low",
      title: "Microsoft Graph API Dependency",
      text: "3 critical integrations rely on single Graph API connection, creating potential single point of failure.",
      action: "Implement redundant authentication methods and connection pooling strategies.",
      confidence: 84,
      relatedMetrics: ["API Reliability", "Integration Health", "System Resilience"],
    },
  ]

  // Mock data for demonstration
  const systemMetrics = {
    totalUsers: 267,
    activeUsers: 243,
    mfaEnabled: 234,
    ssoEnabled: true,
    buildVersion: "2.1.4",
    deploymentEnv: "Production",
    uptime: "99.94%",
    lastDeployment: "2024-01-01T14:22:00Z",
    apiHealth: "Operational",
    databaseHealth: "Optimal",
    aiModelsActive: 4,
    aiProcessingJobs: 12,
    monthlyAiCost: 1245.67,
  }

  const recentProjects = [
    {
      id: "2525843",
      name: "Palm Beach Luxury Estate",
      owner: "Sarah Wilson",
      created: "2024-01-02",
      status: "Active",
      type: "Residential",
      budget: 4200000,
    },
    {
      id: "2525844",
      name: "Downtown Corporate Tower",
      owner: "Michael Chen",
      created: "2023-12-28",
      status: "Planning",
      type: "Commercial",
      budget: 8500000,
    },
    {
      id: "2525845",
      name: "Waterfront Condominiums",
      owner: "Lisa Garcia",
      created: "2023-12-15",
      status: "Active",
      type: "Multi-Family",
      budget: 12000000,
    },
  ]

  const microsoftGraphEndpoints = [
    {
      endpoint: "graph.microsoft.com/v1.0/users",
      description: "User management and profile information",
      status: "Connected",
      lastSync: "2024-01-02T11:15:00Z",
      permissions: ["User.Read.All", "User.ReadWrite.All"],
    },
    {
      endpoint: "graph.microsoft.com/v1.0/security",
      description: "Security alerts and compliance data",
      status: "Connected",
      lastSync: "2024-01-02T11:10:00Z",
      permissions: ["SecurityEvents.Read.All", "SecurityActions.Read.All"],
    },
    {
      endpoint: "graph.microsoft.com/v1.0/deviceManagement",
      description: "Device management and compliance policies",
      status: "Connected",
      lastSync: "2024-01-02T11:05:00Z",
      permissions: ["DeviceManagementManagedDevices.Read.All"],
    },
  ]

  const recentUsers = [
    {
      id: "u1",
      name: "Emma Rodriguez",
      email: "emma.rodriguez@hedrickbrothers.com",
      role: "Project Manager",
      status: "Active",
      lastLogin: "2024-01-02T09:30:00Z",
      mfaEnabled: true,
    },
    {
      id: "u2",
      name: "James Thompson",
      email: "james.thompson@hedrickbrothers.com",
      role: "Field Supervisor",
      status: "Active",
      lastLogin: "2024-01-02T08:15:00Z",
      mfaEnabled: true,
    },
    {
      id: "u3",
      name: "Maria Santos",
      email: "maria.santos@hedrickbrothers.com",
      role: "Estimator",
      status: "Pending",
      lastLogin: null,
      mfaEnabled: false,
    },
  ]

  const aiModels = [
    {
      name: "GPT-4 Document Analysis",
      status: "Active",
      uptime: "99.8%",
      requestsToday: 1247,
      cost: 324.56,
    },
    {
      name: "Claude Cost Estimation",
      status: "Active",
      uptime: "99.2%",
      requestsToday: 892,
      cost: 156.78,
    },
    {
      name: "Otter AI Transcription",
      status: "Active",
      uptime: "100%",
      requestsToday: 156,
      cost: 89.23,
    },
    {
      name: "Computer Vision QC",
      status: "Maintenance",
      uptime: "0%",
      requestsToday: 0,
      cost: 0,
    },
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Access control
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access the IT Command Center.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Event handlers
  const handleNewProject = () => {
    setNewProjectDialogOpen(true)
  }

  const handleNewUser = () => {
    setNewUserDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Active</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">Pending</Badge>
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading HB Intel Management...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Removed AppHeader and all header elements */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Priority Cards - Show at top on small screens */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Total Users</h3>
              <div className="text-2xl font-bold">{systemMetrics.totalUsers}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {systemMetrics.activeUsers} active
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">MFA Coverage</h3>
              <div className="text-2xl font-bold">
                {Math.round((systemMetrics.mfaEnabled / systemMetrics.totalUsers) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3 text-blue-500" />
                {systemMetrics.mfaEnabled}/{systemMetrics.totalUsers} users
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">System Uptime</h3>
              <div className="text-2xl font-bold">{systemMetrics.uptime}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Monitor className="h-3 w-3 text-green-500" />
                Last 30 days
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">AI Models</h3>
              <div className="text-2xl font-bold">{systemMetrics.aiModelsActive}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Brain className="h-3 w-3 text-purple-500" />
                Active models
              </div>
            </div>
          </div>
        </div>

        {/* Main Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ screens */}
          <div className="hidden xl:block xl:col-span-3 space-y-4 2xl:space-y-6">
            {/* System Overview Cards - Desktop */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">System Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Users</span>
                  <span className="font-medium">{systemMetrics.totalUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium text-green-600">{systemMetrics.activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">MFA Enabled</span>
                  <span className="font-medium">{systemMetrics.mfaEnabled}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">System Uptime</span>
                  <span className="font-medium text-green-600">{systemMetrics.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">AI Models</span>
                  <span className="font-medium">{systemMetrics.aiModelsActive}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={handleNewUser}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={handleNewProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">System Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Status</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                    {systemMetrics.apiHealth}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Database Health</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                    {systemMetrics.databaseHealth}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active AI Jobs</span>
                  <span className="font-medium">{systemMetrics.aiProcessingJobs}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly AI Cost</span>
                  <span className="font-medium">${systemMetrics.monthlyAiCost}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">
                    <UserPlus className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">New user added to system</p>
                    <p className="text-xs text-muted-foreground">by Admin • 15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-1 rounded">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Security policy updated</p>
                    <p className="text-xs text-muted-foreground">by System • 1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-1 rounded">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">AI model deployment completed</p>
                    <p className="text-xs text-muted-foreground">by System • 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HBI Management Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI Management Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={managementInsights} cardId="management-insights" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-lg p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="ai">AI/ML</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                      <HbIntelManagementCard />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">User Administration</h3>
                      <p className="text-sm text-muted-foreground">Manage user accounts and role assignments</p>
                    </div>
                    <Button onClick={handleNewUser} className="bg-[#FA4616] hover:bg-[#FA4616]/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Microsoft Graph Integration:</strong> User data synchronized from{" "}
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">graph.microsoft.com/v1.0/users</code>
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>MFA</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell>
                                {user.mfaEnabled ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell>{user.lastLogin ? formatDateTime(user.lastLogin) : "Never"}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-3 w-3" />
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

                <TabsContent value="security" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Security & Compliance</h3>
                    <p className="text-sm text-muted-foreground">Manage security policies and compliance settings</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Shield className="h-4 w-4" />
                          Microsoft Graph Endpoints
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {microsoftGraphEndpoints.map((endpoint, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.endpoint}</code>
                                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                                      {endpoint.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2">{endpoint.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Last sync: {formatDateTime(endpoint.lastSync)}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Key className="h-4 w-4" />
                          Security Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Single Sign-On (SSO)</p>
                            <p className="text-xs text-muted-foreground">Enable Azure AD integration</p>
                          </div>
                          <Switch checked={systemMetrics.ssoEnabled} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Multi-Factor Authentication</p>
                            <p className="text-xs text-muted-foreground">Require MFA for all users</p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Session Timeout</p>
                            <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                          </div>
                          <Select defaultValue="8">
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2h</SelectItem>
                              <SelectItem value="4">4h</SelectItem>
                              <SelectItem value="8">8h</SelectItem>
                              <SelectItem value="24">24h</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">AI/ML System Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor and configure AI models and processing pipelines
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Brain className="h-4 w-4" />
                          AI Model Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {aiModels.map((model, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium">{model.name}</p>
                                    <Badge
                                      className={
                                        model.status === "Active"
                                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                                      }
                                    >
                                      {model.status}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                    <div>Uptime: {model.uptime}</div>
                                    <div>Cost: ${model.cost}</div>
                                    <div>Requests: {model.requestsToday}</div>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <DollarSign className="h-4 w-4" />
                          Cost & Usage Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${systemMetrics.monthlyAiCost}</div>
                          <div className="text-xs text-muted-foreground">Monthly AI costs</div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing Jobs</span>
                            <span className="font-medium">{systemMetrics.aiProcessingJobs}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Active Models</span>
                            <span className="font-medium">{systemMetrics.aiModelsActive}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Requests Today</span>
                            <span className="font-medium">
                              {aiModels.reduce((sum, model) => sum + model.requestsToday, 0)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Project Management</h3>
                      <p className="text-sm text-muted-foreground">Create and manage construction projects</p>
                    </div>
                    <Button onClick={handleNewProject} className="bg-[#FA4616] hover:bg-[#FA4616]/90">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentProjects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">{project.id}</TableCell>
                              <TableCell>{project.name}</TableCell>
                              <TableCell>{project.owner}</TableCell>
                              <TableCell>{project.type}</TableCell>
                              <TableCell>${(project.budget / 1000000).toFixed(1)}M</TableCell>
                              <TableCell>{getStatusBadge(project.status)}</TableCell>
                              <TableCell>{formatDate(project.created)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-3 w-3" />
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

                <TabsContent value="system" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">System Information</h3>
                    <p className="text-sm text-muted-foreground">Application metadata and deployment information</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <FileText className="h-4 w-4" />
                          Application Metadata
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Build Version</span>
                          <Badge variant="outline">v{systemMetrics.buildVersion}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Environment</span>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                            {systemMetrics.deploymentEnv}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Last Deployment</span>
                          <span className="text-sm">{formatDateTime(systemMetrics.lastDeployment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Database Health</span>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                            {systemMetrics.databaseHealth}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Activity className="h-4 w-4" />
                          System Health
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">API Status</span>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                            {systemMetrics.apiHealth}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Uptime</span>
                          <span className="text-sm font-medium">{systemMetrics.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active AI Jobs</span>
                          <span className="text-sm font-medium">{systemMetrics.aiProcessingJobs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Users</span>
                          <span className="text-sm font-medium">{systemMetrics.activeUsers}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Device Management:</strong> Integration with{" "}
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">
                        graph.microsoft.com/v1.0/deviceManagement
                      </code>{" "}
                      for compliance monitoring and device policies.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="Enter project name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-owner">Project Owner</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah.wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="michael.chen">Michael Chen</SelectItem>
                    <SelectItem value="lisa.garcia">Lisa Garcia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-budget">Budget</Label>
                <Input id="project-budget" type="number" placeholder="0" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#FA4616] hover:bg-[#FA4616]/90">Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={newUserDialogOpen} onOpenChange={setNewUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-first-name">First Name</Label>
                <Input id="user-first-name" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-last-name">Last Name</Label>
                <Input id="user-last-name" placeholder="Enter last name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input id="user-email" type="email" placeholder="user@hedrickbrothers.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="project-manager">Project Manager</SelectItem>
                  <SelectItem value="field-supervisor">Field Supervisor</SelectItem>
                  <SelectItem value="estimator">Estimator</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="require-mfa" className="rounded" />
              <Label htmlFor="require-mfa">Require multi-factor authentication</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-[#FA4616] hover:bg-[#FA4616]/90">Send Invitation</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
