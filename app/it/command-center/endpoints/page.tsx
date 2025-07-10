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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Monitor,
  Smartphone,
  Laptop,
  Settings,
  RefreshCw,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Info,
  Users,
  MapPin,
  Wifi,
  Battery,
  HardDrive,
  Cpu,
  Eye,
  ExternalLink,
} from "lucide-react"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import EndpointHealthCard from "@/components/cards/it/EndpointHealthCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * Endpoint Management Dashboard
 * -----------------------------
 * Centralized endpoint monitoring and management for:
 * - Device health and patch compliance monitoring
 * - Microsoft Intune device inventory
 * - Geographic device grouping (HQ, jobsites, remote)
 * - Real-time endpoint security status
 *
 * Microsoft Graph DeviceManagement API Integration Points:
 * - graph.microsoft.com/v1.0/deviceManagement/managedDevices
 * - graph.microsoft.com/v1.0/deviceManagement/deviceCompliancePolicies
 * - graph.microsoft.com/v1.0/deviceManagement/windowsUpdateForBusinessConfigurations
 * - graph.microsoft.com/v1.0/deviceManagement/deviceHealthScripts
 */
export default function EndpointManagementPage() {
  const { user } = useAuth()
  const { startTour, isTourAvailable } = useTour()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Endpoints-specific AI insights
  const endpointsInsights = [
    {
      id: "endpoint-1",
      type: "risk",
      severity: "high",
      title: "Critical Patch Vulnerabilities",
      text: "15 endpoints remain unpatched with critical security vulnerabilities, exposing network risks.",
      action: "Initiate emergency patching protocol and implement endpoint isolation procedures.",
      confidence: 96,
      relatedMetrics: ["Patch Compliance", "Security Vulnerabilities", "Network Security"],
    },
    {
      id: "endpoint-2",
      type: "alert",
      severity: "medium",
      title: "Compliance Drift Detected",
      text: "13 devices fallen out of compliance, violating organizational security policies.",
      action: "Review non-compliant devices and implement automated compliance enforcement.",
      confidence: 92,
      relatedMetrics: ["Device Compliance", "Policy Enforcement", "Security Posture"],
    },
    {
      id: "endpoint-3",
      type: "performance",
      severity: "low",
      title: "Endpoint Management Efficiency",
      text: "91.2% of endpoints maintained in compliant state, exceeding industry standards.",
      action: "Continue current endpoint management practices and document successful procedures.",
      confidence: 94,
      relatedMetrics: ["Compliance Rate", "Management Efficiency", "Security Standards"],
    },
    {
      id: "endpoint-4",
      type: "forecast",
      severity: "medium",
      title: "Device Lifecycle Planning",
      text: "28 devices approaching end-of-life within 6 months, requiring replacement planning.",
      action: "Develop device refresh strategy and coordinate procurement for aging endpoints.",
      confidence: 89,
      relatedMetrics: ["Device Lifecycle", "Replacement Planning", "Hardware Management"],
    },
    {
      id: "endpoint-5",
      type: "opportunity",
      severity: "low",
      title: "Automation Enhancement",
      text: "Automated patch deployment could increase efficiency by 23% based on current patterns.",
      action: "Implement automated patch management and optimize deployment schedules.",
      confidence: 87,
      relatedMetrics: ["Automation", "Patch Management", "Operational Efficiency"],
    },
  ]

  // Mock data for endpoint management
  const endpointMetrics = {
    totalDevices: 145,
    compliantDevices: 132,
    nonCompliantDevices: 13,
    offlineDevices: 8,
    upToDateDevices: 127,
    pendingUpdates: 18,
    avgPatchLevel: 94.2,
    lastScanTime: "2024-01-02T11:30:00Z",
  }

  // Device group filters
  const deviceGroups = [
    { value: "all", label: "All Locations", count: endpointMetrics.totalDevices },
    { value: "hq", label: "HQ - West Palm Beach", count: 89 },
    { value: "jobsites", label: "Active Jobsites", count: 32 },
    { value: "remote", label: "Remote Workers", count: 24 },
  ]

  // Mock device inventory data (simulating Microsoft Intune data structure)
  const deviceInventory = useMemo(
    () => [
      {
        id: "dev-001",
        deviceName: "LAPTOP-SARAH-01",
        userPrincipalName: "sarah.wilson@hedrickbrothers.com",
        deviceType: "Windows",
        osVersion: "Windows 11 Pro 22H2",
        lastSync: "2024-01-02T10:15:00Z",
        complianceStatus: "Compliant",
        location: "HQ",
        enrollmentType: "Azure AD Joined",
        managedBy: "Microsoft Intune",
        isEncrypted: true,
        patchLevel: 98.5,
        batteryLevel: 87,
        diskSpace: 72.3,
        memoryUsage: 45.2,
        antimalwareStatus: "Protected",
        firewallStatus: "Enabled",
        threats: 0,
      },
      {
        id: "dev-002",
        deviceName: "TABLET-FIELD-03",
        userPrincipalName: "mark.davis@hedrickbrothers.com",
        deviceType: "Android",
        osVersion: "Android 13",
        lastSync: "2024-01-02T09:45:00Z",
        complianceStatus: "Non-Compliant",
        location: "Jobsite",
        enrollmentType: "Android Enterprise",
        managedBy: "Microsoft Intune",
        isEncrypted: true,
        patchLevel: 82.1,
        batteryLevel: 45,
        diskSpace: 89.7,
        memoryUsage: 62.1,
        antimalwareStatus: "Warning",
        firewallStatus: "N/A",
        threats: 1,
      },
      {
        id: "dev-003",
        deviceName: "IPHONE-LISA-01",
        userPrincipalName: "lisa.garcia@hedrickbrothers.com",
        deviceType: "iOS",
        osVersion: "iOS 17.2.1",
        lastSync: "2024-01-02T11:20:00Z",
        complianceStatus: "Compliant",
        location: "Remote",
        enrollmentType: "User Enrollment",
        managedBy: "Microsoft Intune",
        isEncrypted: true,
        patchLevel: 100,
        batteryLevel: 92,
        diskSpace: 34.8,
        memoryUsage: 58.9,
        antimalwareStatus: "Protected",
        firewallStatus: "Enabled",
        threats: 0,
      },
      {
        id: "dev-004",
        deviceName: "DESKTOP-ENG-05",
        userPrincipalName: "john.smith@hedrickbrothers.com",
        deviceType: "Windows",
        osVersion: "Windows 10 Pro 21H2",
        lastSync: "2024-01-01T16:30:00Z",
        complianceStatus: "Non-Compliant",
        location: "HQ",
        enrollmentType: "Hybrid Azure AD Joined",
        managedBy: "Microsoft Intune",
        isEncrypted: false,
        patchLevel: 76.3,
        batteryLevel: null,
        diskSpace: 91.2,
        memoryUsage: 78.4,
        antimalwareStatus: "At Risk",
        firewallStatus: "Disabled",
        threats: 3,
      },
      {
        id: "dev-005",
        deviceName: "MACBOOK-DESIGN-02",
        userPrincipalName: "emily.chen@hedrickbrothers.com",
        deviceType: "macOS",
        osVersion: "macOS Sonoma 14.2.1",
        lastSync: "2024-01-02T08:30:00Z",
        complianceStatus: "Compliant",
        location: "Remote",
        enrollmentType: "User Approved",
        managedBy: "Microsoft Intune",
        isEncrypted: true,
        patchLevel: 95.7,
        batteryLevel: 68,
        diskSpace: 56.9,
        memoryUsage: 67.2,
        antimalwareStatus: "Protected",
        firewallStatus: "Enabled",
        threats: 0,
      },
      {
        id: "dev-006",
        deviceName: "SURFACE-PM-01",
        userPrincipalName: "michael.rodriguez@hedrickbrothers.com",
        deviceType: "Windows",
        osVersion: "Windows 11 Pro 23H2",
        lastSync: "2024-01-02T11:45:00Z",
        complianceStatus: "Compliant",
        location: "Jobsite",
        enrollmentType: "Azure AD Joined",
        managedBy: "Microsoft Intune",
        isEncrypted: true,
        patchLevel: 97.2,
        batteryLevel: 34,
        diskSpace: 43.1,
        memoryUsage: 52.8,
        antimalwareStatus: "Protected",
        firewallStatus: "Enabled",
        threats: 0,
      },
    ],
    []
  )

  // Filter devices based on selected group
  const filteredDevices = useMemo(() => {
    if (selectedFilter === "all") return deviceInventory

    const locationMap: { [key: string]: string } = {
      hq: "HQ",
      jobsites: "Jobsite",
      remote: "Remote",
    }

    return deviceInventory.filter((device) => device.location === locationMap[selectedFilter])
  }, [deviceInventory, selectedFilter])

  // Compliance summary by location
  const complianceSummary = useMemo(() => {
    const summary = deviceGroups.map((group) => {
      const devices = group.value === "all" ? deviceInventory : filteredDevices
      const groupDevices =
        group.value === "all"
          ? deviceInventory
          : deviceInventory.filter(
              (d) => d.location === (group.value === "hq" ? "HQ" : group.value === "jobsites" ? "Jobsite" : "Remote")
            )

      const compliant = groupDevices.filter((d) => d.complianceStatus === "Compliant").length
      const nonCompliant = groupDevices.filter((d) => d.complianceStatus === "Non-Compliant").length

      return {
        ...group,
        compliant,
        nonCompliant,
        complianceRate: Math.round((compliant / groupDevices.length) * 100),
      }
    })

    return summary
  }, [deviceInventory, filteredDevices])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // TODO: Implement Microsoft Graph DeviceManagement API refresh
    console.log("Refreshing endpoint data from Microsoft Graph...")
  }

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case "Compliant":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Compliant</Badge>
      case "Non-Compliant":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Non-Compliant</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "Windows":
        return <Monitor className="h-4 w-4" />
      case "iOS":
      case "Android":
        return <Smartphone className="h-4 w-4" />
      case "macOS":
        return <Laptop className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading endpoint data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Restrict access to admin users only
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Header Section - Sticky, following project page pattern */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/it-command-center"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    IT Command Center
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="font-medium text-sm">Endpoint Management</BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Site Title and Actions - Responsive */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground truncate">
                  Endpoint Management
                </h1>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  Device Health
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {endpointMetrics.compliantDevices}/{endpointMetrics.totalDevices} Compliant
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Last: {lastRefresh.toLocaleTimeString()}
                </Badge>
                <Button variant="outline" size="sm" className="text-sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Module Navigation Row */}
            <div className="mt-3 pt-3 border-t border-border/40" data-tour="it-module-navigation">
              <ITModuleNavigation />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout - Following project page pattern */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Priority Cards - Show at top on small screens */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Total Devices</h3>
              <div className="text-2xl font-bold">{endpointMetrics.totalDevices}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Monitor className="h-3 w-3 text-blue-500" />
                Managed endpoints
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Compliance Rate</h3>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((endpointMetrics.compliantDevices / endpointMetrics.totalDevices) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {endpointMetrics.compliantDevices} compliant
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Patch Level</h3>
              <div className="text-2xl font-bold text-blue-600">{endpointMetrics.avgPatchLevel}%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Download className="h-3 w-3 text-blue-500" />
                Average across fleet
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-2 text-foreground">Pending Updates</h3>
              <div className="text-2xl font-bold text-orange-600">{endpointMetrics.pendingUpdates}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                Require attention
              </div>
            </div>
          </div>
        </div>

        {/* Main Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ screens */}
          <div className="hidden xl:block xl:col-span-3 space-y-4 2xl:space-y-6">
            {/* Device Overview - Desktop */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Device Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Devices</span>
                  <span className="font-medium">{endpointMetrics.totalDevices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Compliant</span>
                  <span className="font-medium text-green-600">{endpointMetrics.compliantDevices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Non-Compliant</span>
                  <span className="font-medium text-red-600">{endpointMetrics.nonCompliantDevices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Offline</span>
                  <span className="font-medium text-gray-600">{endpointMetrics.offlineDevices}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Patch Level</span>
                  <span className="font-medium">{endpointMetrics.avgPatchLevel}%</span>
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Filter by Location</h3>
              <div className="space-y-2">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceGroups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label} ({group.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 space-y-2">
                {complianceSummary.map((summary) => (
                  <div key={summary.value} className="text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{summary.label}</span>
                      <span className="font-medium">{summary.complianceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${summary.complianceRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Force Updates
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Policy Deploy
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All
                </Button>
              </div>
            </div>

            {/* Microsoft Graph Status */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Integration Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intune Connection</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Connected</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Graph API</span>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Active</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Sync</span>
                  <span className="font-medium text-xs">{formatLastSync(endpointMetrics.lastScanTime)}</span>
                </div>
              </div>
            </div>

            {/* HBI Endpoints Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI Endpoints Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={endpointsInsights} cardId="endpoints-insights" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-lg p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="inventory">Device Inventory</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="patches">Patch Management</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Endpoint Health Card */}
                    <div className="lg:col-span-2">
                      <EndpointHealthCard />
                    </div>

                    {/* Device Distribution Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Device Distribution</CardTitle>
                        <CardDescription>Devices by location and type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {deviceGroups.slice(1).map((group, index) => (
                            <div key={group.value} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{group.label}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{group.count} devices</div>
                                <div className="text-xs text-muted-foreground">
                                  {Math.round((group.count / endpointMetrics.totalDevices) * 100)}% of fleet
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Security Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Security Overview</CardTitle>
                        <CardDescription>Threat protection status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Protected Devices</span>
                            <span className="font-medium text-green-600">
                              {deviceInventory.filter((d) => d.antimalwareStatus === "Protected").length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">At Risk</span>
                            <span className="font-medium text-red-600">
                              {deviceInventory.filter((d) => d.antimalwareStatus === "At Risk").length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Warnings</span>
                            <span className="font-medium text-yellow-600">
                              {deviceInventory.filter((d) => d.antimalwareStatus === "Warning").length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Active Threats</span>
                            <span className="font-medium text-red-600">
                              {deviceInventory.reduce((sum, d) => sum + d.threats, 0)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Microsoft Graph Integration:</strong> Device data synchronized from Microsoft Intune via{" "}
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">
                        graph.microsoft.com/v1.0/deviceManagement/managedDevices
                      </code>
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Device Inventory</h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredDevices.length} devices in{" "}
                        {deviceGroups.find((g) => g.value === selectedFilter)?.label}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-48">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceGroups.map((group) => (
                            <SelectItem key={group.value} value={group.value}>
                              {group.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>OS Version</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Compliance</TableHead>
                            <TableHead>Last Sync</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDevices.map((device) => (
                            <TableRow key={device.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getDeviceIcon(device.deviceType)}
                                  <div>
                                    <div className="font-medium">{device.deviceName}</div>
                                    <div className="text-xs text-muted-foreground">{device.deviceType}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">{device.userPrincipalName}</TableCell>
                              <TableCell className="text-sm">{device.osVersion}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {device.location}
                                </Badge>
                              </TableCell>
                              <TableCell>{getComplianceStatusBadge(device.complianceStatus)}</TableCell>
                              <TableCell className="text-sm">{formatLastSync(device.lastSync)}</TableCell>
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

                <TabsContent value="compliance" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Compliance Monitoring</h3>
                    <p className="text-sm text-muted-foreground">Device compliance policies and status</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Compliance Policies</CardTitle>
                        <CardDescription>Active device compliance rules</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Device Encryption Required</div>
                              <div className="text-xs text-muted-foreground">BitLocker/FileVault encryption</div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Minimum OS Version</div>
                              <div className="text-xs text-muted-foreground">Windows 10/iOS 15/Android 11</div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Antimalware Protection</div>
                              <div className="text-xs text-muted-foreground">Real-time protection required</div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Non-Compliant Devices</CardTitle>
                        <CardDescription>Devices requiring attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {filteredDevices
                            .filter((d) => d.complianceStatus === "Non-Compliant")
                            .map((device) => (
                              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2">
                                  {getDeviceIcon(device.deviceType)}
                                  <div>
                                    <div className="font-medium text-sm">{device.deviceName}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {!device.isEncrypted && "Encryption disabled"}
                                      {device.patchLevel < 90 && ", Updates needed"}
                                      {device.antimalwareStatus === "At Risk" && ", Security risk"}
                                    </div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Settings className="h-3 w-3 mr-1" />
                                  Fix
                                </Button>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Compliance Policies:</strong> Managed through{" "}
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">
                        graph.microsoft.com/v1.0/deviceManagement/deviceCompliancePolicies
                      </code>
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="patches" className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">Patch Management</h3>
                    <p className="text-sm text-muted-foreground">Windows Update for Business and mobile OS updates</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Update Status</CardTitle>
                        <CardDescription>Current patch deployment status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Up to Date</span>
                            <span className="font-medium text-green-600">
                              {endpointMetrics.upToDateDevices} devices
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Pending Updates</span>
                            <span className="font-medium text-orange-600">
                              {endpointMetrics.pendingUpdates} devices
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Average Patch Level</span>
                            <span className="font-medium">{endpointMetrics.avgPatchLevel}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${endpointMetrics.avgPatchLevel}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Update Rings</CardTitle>
                        <CardDescription>Windows Update for Business deployment rings</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Pilot Ring</div>
                              <div className="text-xs text-muted-foreground">IT team devices</div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                              5 devices
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Broad Ring</div>
                              <div className="text-xs text-muted-foreground">General deployment</div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                              128 devices
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">Critical Ring</div>
                              <div className="text-xs text-muted-foreground">Critical systems</div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
                              12 devices
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Update Management:</strong> Configured through{" "}
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">
                        graph.microsoft.com/v1.0/deviceManagement/windowsUpdateForBusinessConfigurations
                      </code>
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Microsoft Graph Integration Info */}
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Microsoft Graph DeviceManagement API Integration</CardTitle>
            <CardDescription>Ready for enhanced device management capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Managed Devices API</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm">Compliance Policies</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Update Configurations</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Health Scripts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
