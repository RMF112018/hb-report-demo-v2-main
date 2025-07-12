/**
 * @fileoverview Power BI Enterprise Dashboard Component
 * @module PowerBIDashboard
 * @version 1.0.0
 * @author HB Development Team
 * @since 2024-01-15
 *
 * Demonstrates Power BI enterprise integration with:
 * - Embedded Power BI reports
 * - Real-time data streaming
 * - Row-level security
 * - Enterprise governance features
 */

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Alert, AlertDescription } from "../ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Progress } from "../ui/progress"
import { Switch } from "../ui/switch"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  Activity,
  BarChart3,
  Database,
  Eye,
  Filter,
  Globe,
  Lock,
  MonitorPlay,
  RefreshCw,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Info,
  Play,
  Share2,
  Sparkles,
} from "lucide-react"

interface PowerBIDashboardProps {
  userRole: string
  isCompact?: boolean
  className?: string
}

interface PowerBIReport {
  id: string
  name: string
  workspace: string
  type: "report" | "dashboard" | "dataset"
  status: "online" | "refreshing" | "error" | "offline"
  lastRefresh: string
  viewCount: number
  dataSize: string
  refreshFrequency: string
  security: "public" | "internal" | "restricted"
  embedUrl: string
  thumbnail: string
}

interface PowerBIMetrics {
  totalReports: number
  activeUsers: number
  dataRefreshed: number
  storageUsed: number
  avgLoadTime: number
  errorRate: number
  securityIncidents: number
  complianceScore: number
}

interface PowerBIWorkspace {
  id: string
  name: string
  type: "premium" | "pro" | "free"
  reports: number
  users: number
  lastActivity: string
  capacity: number
  usedCapacity: number
}

export function PowerBIDashboard({ userRole, isCompact = false, className = "" }: PowerBIDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<PowerBIReport | null>(null)
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [metrics, setMetrics] = useState<PowerBIMetrics | null>(null)
  const [reports, setReports] = useState<PowerBIReport[]>([])
  const [workspaces, setWorkspaces] = useState<PowerBIWorkspace[]>([])

  // Mock data generation based on user role
  const generateMockData = () => {
    const mockMetrics: PowerBIMetrics = {
      totalReports: userRole === "executive" ? 45 : userRole === "project-executive" ? 28 : 15,
      activeUsers: userRole === "executive" ? 125 : userRole === "project-executive" ? 75 : 35,
      dataRefreshed: userRole === "executive" ? 98 : userRole === "project-executive" ? 94 : 89,
      storageUsed: userRole === "executive" ? 85 : userRole === "project-executive" ? 65 : 45,
      avgLoadTime: 2.3,
      errorRate: 0.5,
      securityIncidents: 0,
      complianceScore: 96,
    }

    const mockReports: PowerBIReport[] = [
      {
        id: "1",
        name: "Executive Financial Dashboard",
        workspace: "Finance Premium",
        type: "dashboard",
        status: "online",
        lastRefresh: "2 minutes ago",
        viewCount: 156,
        dataSize: "2.3 GB",
        refreshFrequency: "Every 15 minutes",
        security: "restricted",
        embedUrl: "https://app.powerbi.com/embed/...",
        thumbnail: "/api/placeholder/300/200",
      },
      {
        id: "2",
        name: "Project Performance Analytics",
        workspace: "Operations Pro",
        type: "report",
        status: "online",
        lastRefresh: "5 minutes ago",
        viewCount: 89,
        dataSize: "1.8 GB",
        refreshFrequency: "Every 30 minutes",
        security: "internal",
        embedUrl: "https://app.powerbi.com/embed/...",
        thumbnail: "/api/placeholder/300/200",
      },
      {
        id: "3",
        name: "Real-time Construction Metrics",
        workspace: "Field Operations",
        type: "dashboard",
        status: "refreshing",
        lastRefresh: "Just now",
        viewCount: 234,
        dataSize: "3.1 GB",
        refreshFrequency: "Real-time",
        security: "restricted",
        embedUrl: "https://app.powerbi.com/embed/...",
        thumbnail: "/api/placeholder/300/200",
      },
      {
        id: "4",
        name: "Risk Management Dashboard",
        workspace: "Risk & Compliance",
        type: "dashboard",
        status: "online",
        lastRefresh: "1 hour ago",
        viewCount: 67,
        dataSize: "1.2 GB",
        refreshFrequency: "Every 4 hours",
        security: "restricted",
        embedUrl: "https://app.powerbi.com/embed/...",
        thumbnail: "/api/placeholder/300/200",
      },
    ]

    const mockWorkspaces: PowerBIWorkspace[] = [
      {
        id: "1",
        name: "Finance Premium",
        type: "premium",
        reports: 12,
        users: 25,
        lastActivity: "2 minutes ago",
        capacity: 100,
        usedCapacity: 78,
      },
      {
        id: "2",
        name: "Operations Pro",
        type: "pro",
        reports: 8,
        users: 15,
        lastActivity: "15 minutes ago",
        capacity: 50,
        usedCapacity: 32,
      },
      {
        id: "3",
        name: "Field Operations",
        type: "premium",
        reports: 15,
        users: 45,
        lastActivity: "Just now",
        capacity: 200,
        usedCapacity: 156,
      },
    ]

    return { mockMetrics, mockReports, mockWorkspaces }
  }

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { mockMetrics, mockReports, mockWorkspaces } = generateMockData()
      setMetrics(mockMetrics)
      setReports(mockReports)
      setWorkspaces(mockWorkspaces)

      setIsLoading(false)
    }

    loadData()
  }, [userRole])

  // Real-time data simulation
  useEffect(() => {
    if (!realtimeEnabled) return

    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev
          ? {
              ...prev,
              activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
              avgLoadTime: Math.max(1.5, prev.avgLoadTime + Math.random() * 0.4 - 0.2),
            }
          : null
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [realtimeEnabled])

  // Chart data
  const usageData = useMemo(
    () => [
      { name: "Mon", reports: 45, users: 120 },
      { name: "Tue", reports: 52, users: 135 },
      { name: "Wed", reports: 49, users: 128 },
      { name: "Thu", reports: 67, users: 158 },
      { name: "Fri", reports: 71, users: 165 },
      { name: "Sat", reports: 23, users: 45 },
      { name: "Sun", reports: 18, users: 38 },
    ],
    []
  )

  const performanceData = useMemo(
    () => [
      { name: "Load Time", value: metrics?.avgLoadTime || 0, target: 3 },
      { name: "Error Rate", value: metrics?.errorRate || 0, target: 1 },
      { name: "Uptime", value: 99.8, target: 99.5 },
      { name: "Compliance", value: metrics?.complianceScore || 0, target: 95 },
    ],
    [metrics]
  )

  const workspaceData = useMemo(
    () =>
      workspaces.map((ws) => ({
        name: ws.name,
        value: ws.usedCapacity,
        capacity: ws.capacity,
      })),
    [workspaces]
  )

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-50"
      case "refreshing":
        return "text-blue-600 bg-blue-50"
      case "error":
        return "text-red-600 bg-red-50"
      case "offline":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "refreshing":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "offline":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "internal":
        return <Users className="h-4 w-4" />
      case "restricted":
        return <Lock className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getWorkspaceTypeColor = (type: string) => {
    switch (type) {
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "pro":
        return "bg-blue-100 text-blue-800"
      case "free":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center h-96`}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Power BI Dashboard</h3>
            <p className="text-sm text-gray-600">Connecting to Power BI service...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Power BI Enterprise Dashboard</h2>
          </div>
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
            <Sparkles className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={realtimeEnabled}
              onCheckedChange={setRealtimeEnabled}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm text-gray-600">Real-time</span>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enterprise Features Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This dashboard demonstrates Power BI Premium enterprise features including embedded analytics, real-time data
          streaming, and advanced security controls.
        </AlertDescription>
      </Alert>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">{metrics?.totalReports}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">{metrics?.activeUsers}</p>
                {realtimeEnabled && (
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </div>
                )}
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Data Refreshed</p>
                <p className="text-2xl font-bold">{metrics?.dataRefreshed}%</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold">{metrics?.storageUsed}%</p>
              </div>
              <Database className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Usage Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="reports"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span>{item.name === "Load Time" ? `${item.value.toFixed(1)}s` : `${item.value}%`}</span>
                    </div>
                    <Progress
                      value={item.name === "Load Time" ? (item.value / 5) * 100 : item.value}
                      className={`h-2 ${item.value >= item.target ? "bg-green-200" : "bg-red-200"}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Workspace Capacity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workspace Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workspaceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                  <Bar dataKey="capacity" fill="#82ca9d" fillOpacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <p className="text-sm text-gray-600">{report.workspace}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <MonitorPlay className="h-8 w-8 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Views</p>
                      <p className="font-medium">{report.viewCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Data Size</p>
                      <p className="font-medium">{report.dataSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      {getSecurityIcon(report.security)}
                      <span className="text-gray-600 capitalize">{report.security}</span>
                    </div>
                    <span className="text-gray-600">{report.lastRefresh}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{workspace.name}</CardTitle>
                      <Badge className={getWorkspaceTypeColor(workspace.type)}>{workspace.type.toUpperCase()}</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Reports</p>
                      <p className="text-lg font-semibold">{workspace.reports}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Users</p>
                      <p className="text-lg font-semibold">{workspace.users}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity Used</span>
                      <span>
                        {workspace.usedCapacity}GB / {workspace.capacity}GB
                      </span>
                    </div>
                    <Progress value={(workspace.usedCapacity / workspace.capacity) * 100} className="h-2" />
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Last activity: {workspace.lastActivity}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{metrics?.complianceScore}%</p>
                    <p className="text-sm text-gray-600">Compliance Score</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{metrics?.securityIncidents}</p>
                    <p className="text-sm text-gray-600">Security Incidents</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Row Level Security</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Data Encryption</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Access Controls</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Configured
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Access Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Executive Access</p>
                      <p className="text-sm text-gray-600">Full dashboard access</p>
                    </div>
                    <Badge variant="outline" className="text-purple-600">
                      Premium
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Project Manager Access</p>
                      <p className="text-sm text-gray-600">Project-specific data</p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      Standard
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Team Member Access</p>
                      <p className="text-sm text-gray-600">Limited read-only</p>
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      Basic
                    </Badge>
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Permissions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
