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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  Home,
  Monitor,
  Activity,
  Wifi,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Globe,
  Network,
  HardDrive,
  Cpu,
  RefreshCw,
  Settings,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Router,
  Shield,
  Info,
  Database,
} from "lucide-react"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

// Import the Infrastructure Monitor Card
import InfrastructureMonitorCard from "@/components/cards/it/InfrastructureMonitorCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * Infrastructure Monitor Dashboard
 * --------------------------------
 * Real-time infrastructure oversight dashboard for monitoring:
 * - Server uptime and performance
 * - Network latency and connectivity
 * - SNMP device monitoring
 * - Jobsite network health
 * - Equipment status and alerts
 *
 * Future integration hooks for:
 * - Cisco Meraki Dashboard API
 * - PRTG Network Monitor
 * - VMware vSphere
 * - Windows Server Manager
 */
export default function InfrastructureMonitorPage() {
  const { user } = useAuth()
  const { startTour, isTourAvailable } = useTour()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Infrastructure-specific AI insights
  const infrastructureInsights = [
    {
      id: "infra-1",
      type: "risk",
      severity: "high",
      title: "Network Device Failure Risk",
      text: "Miami Office switch offline for 3+ hours. Secondary device showing degraded performance.",
      action: "Deploy replacement switch and investigate root cause of primary failure.",
      confidence: 94,
      relatedMetrics: ["Device Uptime", "Network Redundancy", "Office Connectivity"],
    },
    {
      id: "infra-2",
      type: "alert",
      severity: "medium",
      title: "Latency Threshold Exceeded",
      text: "Jacksonville office experiencing 45ms average latency, exceeding acceptable thresholds.",
      action: "Investigate ISP connection and consider bandwidth upgrade.",
      confidence: 87,
      relatedMetrics: ["Network Latency", "ISP Performance", "User Experience"],
    },
    {
      id: "infra-3",
      type: "forecast",
      severity: "medium",
      title: "Capacity Planning Alert",
      text: "Server CPU utilization trending upward. Capacity constraints predicted within 8 weeks.",
      action: "Plan server infrastructure expansion and load balancing optimization.",
      confidence: 89,
      relatedMetrics: ["Server Performance", "Resource Utilization", "Growth Planning"],
    },
    {
      id: "infra-4",
      type: "performance",
      severity: "low",
      title: "Uptime Achievement",
      text: "99.94% average uptime maintained across all infrastructure, exceeding SLA targets.",
      action: "Continue current monitoring practices and document successful procedures.",
      confidence: 98,
      relatedMetrics: ["System Uptime", "SLA Compliance", "Reliability"],
    },
    {
      id: "infra-5",
      type: "opportunity",
      severity: "low",
      title: "Network Optimization Potential",
      text: "SNMP analysis identifies 15% bandwidth efficiency gains through QoS optimization.",
      action: "Implement traffic shaping policies and optimize critical application prioritization.",
      confidence: 82,
      relatedMetrics: ["Bandwidth Utilization", "QoS", "Network Efficiency"],
    },
  ]

  // Mock data for infrastructure monitoring
  const infraMetrics = {
    totalServers: 25,
    onlineServers: 24,
    offlineServers: 1,
    networkDevices: 47,
    onlineDevices: 45,
    offlineDevices: 2,
    avgUptime: 99.94,
    avgLatency: 12.3,
    criticalAlerts: 2,
    warningAlerts: 5,
    infoAlerts: 12,
  }

  // Mock uptime data for the last 24 hours
  const uptimeData = useMemo(() => {
    const data = []
    const now = new Date()
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      data.push({
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        uptime: Math.random() > 0.05 ? 100 : 0, // 95% uptime simulation
        servers: Math.floor(Math.random() * 2) + 23, // 23-24 servers online
        latency: Math.floor(Math.random() * 20) + 5, // 5-25ms latency
      })
    }
    return data
  }, [])

  // Mock network latency data by location
  const latencyData = useMemo(
    () => [
      { location: "HQ - West Palm Beach", latency: 8.2, status: "good", devices: 12 },
      { location: "Remote - Tampa Office", latency: 15.6, status: "good", devices: 8 },
      { location: "Remote - Miami Office", latency: 22.4, status: "fair", devices: 6 },
      { location: "Remote - Jacksonville", latency: 45.3, status: "poor", devices: 4 },
      { location: "Jobsite - Palm Beach Estate", latency: 18.7, status: "good", devices: 5 },
      { location: "Jobsite - Downtown Tower", latency: 12.1, status: "good", devices: 7 },
      { location: "Jobsite - Waterfront Condos", latency: 28.9, status: "fair", devices: 5 },
    ],
    []
  )

  // Mock SNMP scan results
  const snmpDevices = useMemo(
    () => [
      {
        id: "SW-HQ-01",
        name: "HQ Main Switch",
        ip: "10.0.1.10",
        type: "Cisco Catalyst 2960",
        status: "online",
        uptime: "45d 12h 23m",
        location: "HQ Server Room",
        lastSeen: "2024-01-02T11:45:00Z",
        ports: { total: 48, used: 32, free: 16 },
        alerts: 0,
      },
      {
        id: "RT-HQ-01",
        name: "HQ Main Router",
        ip: "10.0.1.1",
        type: "Cisco ASA 5516-X",
        status: "online",
        uptime: "87d 8h 15m",
        location: "HQ Server Room",
        lastSeen: "2024-01-02T11:45:00Z",
        ports: { total: 8, used: 6, free: 2 },
        alerts: 1,
      },
      {
        id: "AP-HQ-01",
        name: "HQ Wireless AP",
        ip: "10.0.1.20",
        type: "Cisco Meraki MR46",
        status: "online",
        uptime: "23d 4h 56m",
        location: "HQ Conference Room",
        lastSeen: "2024-01-02T11:44:00Z",
        ports: { total: 2, used: 1, free: 1 },
        alerts: 0,
      },
      {
        id: "SW-TB-01",
        name: "Tampa Branch Switch",
        ip: "10.0.2.10",
        type: "Cisco Catalyst 2960",
        status: "online",
        uptime: "12d 18h 42m",
        location: "Tampa Office",
        lastSeen: "2024-01-02T11:43:00Z",
        ports: { total: 24, used: 18, free: 6 },
        alerts: 0,
      },
      {
        id: "RT-JB-01",
        name: "Jobsite Router",
        ip: "10.0.10.1",
        type: "Cisco RV340",
        status: "warning",
        uptime: "2d 6h 12m",
        location: "Palm Beach Estate",
        lastSeen: "2024-01-02T11:42:00Z",
        ports: { total: 4, used: 4, free: 0 },
        alerts: 2,
      },
      {
        id: "SW-MI-01",
        name: "Miami Office Switch",
        ip: "10.0.3.10",
        type: "Cisco Catalyst 2960",
        status: "offline",
        uptime: "0d 0h 0m",
        location: "Miami Office",
        lastSeen: "2024-01-02T08:30:00Z",
        ports: { total: 24, used: 0, free: 24 },
        alerts: 5,
      },
    ],
    []
  )

  // Mock server status data
  const serverStatus = useMemo(
    () => [
      {
        id: "SRV-DC-01",
        name: "Domain Controller Primary",
        ip: "10.0.1.100",
        os: "Windows Server 2022",
        status: "online",
        uptime: "127d 14h 32m",
        cpu: 15.2,
        memory: 62.3,
        disk: 78.5,
        location: "HQ Server Room",
        alerts: 0,
      },
      {
        id: "SRV-DC-02",
        name: "Domain Controller Secondary",
        ip: "10.0.1.101",
        os: "Windows Server 2022",
        status: "online",
        uptime: "98d 22h 18m",
        cpu: 12.8,
        memory: 58.7,
        disk: 82.1,
        location: "HQ Server Room",
        alerts: 1,
      },
      {
        id: "SRV-SQL-01",
        name: "SQL Server Primary",
        ip: "10.0.1.110",
        os: "Windows Server 2022",
        status: "online",
        uptime: "45d 8h 55m",
        cpu: 42.3,
        memory: 87.2,
        disk: 91.4,
        location: "HQ Server Room",
        alerts: 2,
      },
      {
        id: "SRV-FILE-01",
        name: "File Server",
        ip: "10.0.1.120",
        os: "Windows Server 2019",
        status: "online",
        uptime: "156d 11h 23m",
        cpu: 8.9,
        memory: 34.6,
        disk: 68.2,
        location: "HQ Server Room",
        alerts: 0,
      },
      {
        id: "SRV-APP-01",
        name: "Application Server",
        ip: "10.0.1.130",
        os: "Windows Server 2022",
        status: "warning",
        uptime: "12d 5h 44m",
        cpu: 78.5,
        memory: 92.1,
        disk: 95.8,
        location: "HQ Server Room",
        alerts: 3,
      },
      {
        id: "SRV-BACKUP-01",
        name: "Backup Server",
        ip: "10.0.1.140",
        os: "Windows Server 2019",
        status: "offline",
        uptime: "0d 0h 0m",
        cpu: 0,
        memory: 0,
        disk: 0,
        location: "HQ Server Room",
        alerts: 5,
      },
    ],
    []
  )

  // Mock recent alerts
  const recentAlerts = useMemo(
    () => [
      {
        id: "ALT-001",
        severity: "critical",
        message: "Server SRV-BACKUP-01 is offline",
        timestamp: "2024-01-02T11:30:00Z",
        source: "SNMP Monitor",
        acknowledged: false,
      },
      {
        id: "ALT-002",
        severity: "critical",
        message: "Miami Office Switch (SW-MI-01) not responding",
        timestamp: "2024-01-02T08:30:00Z",
        source: "Network Monitor",
        acknowledged: false,
      },
      {
        id: "ALT-003",
        severity: "warning",
        message: "SQL Server (SRV-SQL-01) disk usage at 91%",
        timestamp: "2024-01-02T10:15:00Z",
        source: "Performance Monitor",
        acknowledged: true,
      },
      {
        id: "ALT-004",
        severity: "warning",
        message: "High CPU usage on Application Server (SRV-APP-01)",
        timestamp: "2024-01-02T09:45:00Z",
        source: "Performance Monitor",
        acknowledged: false,
      },
      {
        id: "ALT-005",
        severity: "warning",
        message: "Jobsite Router (RT-JB-01) all ports utilized",
        timestamp: "2024-01-02T09:20:00Z",
        source: "SNMP Monitor",
        acknowledged: true,
      },
    ],
    []
  )

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // TODO: Implement actual data refresh
    console.log("Refreshing infrastructure data...")
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Online</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">Warning</Badge>
      case "offline":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Offline</Badge>
      case "good":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Good</Badge>
      case "fair":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">Fair</Badge>
      case "poor":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Poor</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Critical</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">Warning</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">Info</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const formatUptime = (uptime: string) => {
    return uptime.replace(/(\d+)([dhm])/g, "$1$2 ")
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading infrastructure data...</p>
          </div>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Removed AppHeader and all header elements */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Priority Cards - Show at top on small screens */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">System Uptime</h3>
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Last 30 days
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Servers Online</h3>
              <div className="text-2xl font-bold">24/25</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Server className="h-3 w-3 text-blue-500" />1 maintenance
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Network Health</h3>
              <div className="text-2xl font-bold text-green-600">Optimal</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Network className="h-3 w-3 text-green-500" />
                Avg latency: 15ms
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Active Alerts</h3>
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3 text-orange-500" />2 critical
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
                  <span className="text-muted-foreground">Total Servers</span>
                  <span className="font-medium">{infraMetrics.totalServers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Online Servers</span>
                  <span className="font-medium text-green-600">{infraMetrics.onlineServers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Devices</span>
                  <span className="font-medium">{infraMetrics.networkDevices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Online Devices</span>
                  <span className="font-medium text-green-600">{infraMetrics.onlineDevices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Uptime</span>
                  <span className="font-medium text-green-600">{infraMetrics.avgUptime}%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Monitor className="h-4 w-4 mr-2" />
                  Server Health
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Network className="h-4 w-4 mr-2" />
                  Network Status
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All
                </Button>
              </div>
            </div>

            {/* Alert Summary */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Alert Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Critical</span>
                  <span className="font-medium text-red-600">{infraMetrics.criticalAlerts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Warning</span>
                  <span className="font-medium text-yellow-600">{infraMetrics.warningAlerts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Information</span>
                  <span className="font-medium text-blue-600">{infraMetrics.infoAlerts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Latency</span>
                  <span className="font-medium">{infraMetrics.avgLatency}ms</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 dark:bg-red-900/20 p-1 rounded">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Server SRV-BACKUP-01 offline</p>
                    <p className="text-xs text-muted-foreground">Critical • 30 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900/20 p-1 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">High CPU usage detected</p>
                    <p className="text-xs text-muted-foreground">Warning • 1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">Network health restored</p>
                    <p className="text-xs text-muted-foreground">Info • 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HBI Infrastructure Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI Infrastructure Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={infrastructureInsights} cardId="infrastructure-insights" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-lg p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="servers">Servers</TabsTrigger>
                  <TabsTrigger value="network">Network</TabsTrigger>
                  <TabsTrigger value="devices">Devices</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Infrastructure Monitor Card */}
                    <div className="lg:col-span-2">
                      <InfrastructureMonitorCard />
                    </div>

                    {/* Uptime Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">System Uptime Trend</CardTitle>
                        <CardDescription>24-hour uptime monitoring</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={uptimeData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="uptime" stroke="#22c55e" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Latency Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Network Latency by Location</CardTitle>
                        <CardDescription>Average response times in milliseconds</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {latencyData.map((location, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium truncate">{location.location}</div>
                                <div className="text-xs text-muted-foreground">{location.devices} devices</div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-sm font-medium ${
                                    location.status === "good"
                                      ? "text-green-600"
                                      : location.status === "fair"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {location.latency}ms
                                </div>
                                <div className="text-xs text-muted-foreground">{location.status}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Integration Ready:</strong> This dashboard supports integration with VMware vSphere,
                      Windows Server Manager, and SNMP monitoring tools.
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="servers" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Server Status</h3>
                    <p className="text-sm text-muted-foreground">Monitor server health and performance metrics</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Server Health Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Server</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uptime</TableHead>
                            <TableHead>CPU</TableHead>
                            <TableHead>Memory</TableHead>
                            <TableHead>Disk</TableHead>
                            <TableHead>Alerts</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serverStatus.map((server) => (
                            <TableRow key={server.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{server.name}</div>
                                  <div className="text-xs text-muted-foreground">{server.id}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{server.os}</TableCell>
                              <TableCell>{getStatusBadge(server.status)}</TableCell>
                              <TableCell className="text-sm">{formatUptime(server.uptime)}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className={`h-2 rounded-full ${
                                        server.cpu > 80
                                          ? "bg-red-500"
                                          : server.cpu > 60
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${server.cpu}%` }}
                                    />
                                  </div>
                                  <span className="text-xs">{server.cpu}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className={`h-2 rounded-full ${
                                        server.memory > 80
                                          ? "bg-red-500"
                                          : server.memory > 60
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${server.memory}%` }}
                                    />
                                  </div>
                                  <span className="text-xs">{server.memory}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-2 bg-gray-200 rounded-full">
                                    <div
                                      className={`h-2 rounded-full ${
                                        server.disk > 90
                                          ? "bg-red-500"
                                          : server.disk > 80
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${server.disk}%` }}
                                    />
                                  </div>
                                  <span className="text-xs">{server.disk}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {server.alerts > 0 ? (
                                  <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                                    {server.alerts}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                                    0
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="network" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Network Topology</h3>
                    <p className="text-sm text-muted-foreground">Monitor network devices and connectivity</p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Meraki Integration:</strong> Ready for Cisco Meraki Dashboard API integration for enhanced
                      network monitoring and management.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Network Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={latencyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="latency" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="devices" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">SNMP Device Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Network devices discovered via SNMP scanning</p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>PRTG Integration:</strong> This dashboard supports PRTG Network Monitor integration for
                      comprehensive SNMP monitoring and alerting.
                    </AlertDescription>
                  </Alert>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Discovered Devices</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uptime</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Ports</TableHead>
                            <TableHead>Alerts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {snmpDevices.map((device) => (
                            <TableRow key={device.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{device.name}</div>
                                  <div className="text-xs text-muted-foreground">{device.id}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{device.type}</TableCell>
                              <TableCell className="text-sm font-mono">{device.ip}</TableCell>
                              <TableCell>{getStatusBadge(device.status)}</TableCell>
                              <TableCell className="text-sm">{formatUptime(device.uptime)}</TableCell>
                              <TableCell className="text-sm">{device.location}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="flex items-center gap-1">
                                    <span>
                                      {device.ports.used}/{device.ports.total}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">{device.ports.free} available</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {device.alerts > 0 ? (
                                  <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                                    {device.alerts}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                                    0
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">System Alerts</h3>
                    <p className="text-sm text-muted-foreground">Monitor and manage infrastructure alerts</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Severity</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                              <TableCell className="font-medium">{alert.message}</TableCell>
                              <TableCell className="text-sm">{alert.source}</TableCell>
                              <TableCell className="text-sm">{new Date(alert.timestamp).toLocaleString()}</TableCell>
                              <TableCell>
                                {alert.acknowledged ? (
                                  <Badge variant="outline" className="text-green-600">
                                    Acknowledged
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-red-600">
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Info */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Integration Capabilities</CardTitle>
            <CardDescription>Future network monitoring tool integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm">VMware vSphere</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-green-600" />
                <span className="text-sm">Windows Server Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-purple-600" />
                <span className="text-sm">SNMP Monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
