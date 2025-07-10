"use client"

import React, { useState, useMemo } from "react"
import { useAuth } from "@/context/auth-context"
import { ITModuleNavigation } from "@/components/layout/ITModuleNavigation"
import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  Settings,
  RefreshCw,
  Filter,
  Search,
  TrendingUp,
  Monitor,
  Database,
  Globe,
  Mail,
  Wifi,
  Usb,
  Home,
  ChevronRight,
  ExternalLink,
  Download,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react"

// Mock data
import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import SiemLogOverviewCard from "@/components/cards/it/SiemLogOverviewCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

/**
 * SIEM & Event Monitor Page
 * -------------------------
 * Security Information and Event Management interface
 * Features:
 * - Real-time security event monitoring
 * - Event filtering by source and severity
 * - Critical alert timeline
 * - SIEM integration placeholders for Azure Sentinel/Splunk
 * - Mobile-responsive layout following project page structure
 */
export default function SIEMEventMonitorPage() {
  const { user } = useAuth()
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  // SIEM-specific AI insights
  const siemInsights = [
    {
      id: "siem-1",
      type: "alert",
      severity: "high",
      title: "Coordinated Attack Pattern Detected",
      text: "Security event volume increased 340% in last 4 hours, indicating potential coordinated attack.",
      action: "Activate incident response team and initiate comprehensive threat hunting procedures.",
      confidence: 94,
      relatedMetrics: ["Event Volume", "Threat Correlation", "Attack Patterns"],
    },
    {
      id: "siem-2",
      type: "risk",
      severity: "high",
      title: "Anomalous User Behavior",
      text: "3 user accounts showing unusual access patterns and privilege escalation attempts.",
      action: "Immediately review account activities and implement enhanced monitoring.",
      confidence: 91,
      relatedMetrics: ["User Behavior", "Access Patterns", "Privilege Escalation"],
    },
    {
      id: "siem-3",
      type: "performance",
      severity: "low",
      title: "Threat Detection Efficiency",
      text: "SIEM correlations blocked 847 potential threats this week, maintaining 98.7% detection rate.",
      action: "Continue current detection rules and optimize correlation algorithms.",
      confidence: 96,
      relatedMetrics: ["Detection Rate", "Threat Blocking", "Security Posture"],
    },
    {
      id: "siem-4",
      type: "forecast",
      severity: "medium",
      title: "Log Storage Capacity Planning",
      text: "Security log growth trending 25% monthly, requiring storage expansion planning.",
      action: "Implement log archiving strategy and plan storage infrastructure expansion.",
      confidence: 88,
      relatedMetrics: ["Log Volume", "Storage Capacity", "Data Retention"],
    },
    {
      id: "siem-5",
      type: "opportunity",
      severity: "medium",
      title: "Correlation Rule Optimization",
      text: "AI analysis suggests 18% improvement in threat detection through rule optimization.",
      action: "Review and optimize SIEM correlation rules based on recent attack patterns.",
      confidence: 85,
      relatedMetrics: ["Rule Optimization", "Detection Accuracy", "False Positives"],
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

  const siemData = commandCenterMock.siem

  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    let events = siemData.recentEvents || []

    if (selectedSource !== "all") {
      events = events.filter((event) => event.source.toLowerCase().includes(selectedSource.toLowerCase()))
    }

    if (selectedSeverity !== "all") {
      events = events.filter((event) => event.severity.toLowerCase() === selectedSeverity.toLowerCase())
    }

    return events
  }, [siemData.recentEvents, selectedSource, selectedSeverity])

  // Mock timeline data for critical alerts
  const criticalAlerts = useMemo(() => {
    const alerts = siemData.recentEvents?.filter((event) => event.severity === "High") || []
    return alerts.map((alert, index) => ({
      ...alert,
      id: `alert-${index}`,
      resolvedAt: index % 2 === 0 ? new Date(Date.now() - Math.random() * 3600000).toISOString() : null,
    }))
  }, [siemData.recentEvents])

  const threatSourcesData = Object.entries(siemData.threatSources || {}).map(([source, count]) => ({
    source,
    count: count as number,
    icon: getSourceIcon(source),
  }))

  function getSourceIcon(source: string) {
    switch (source.toLowerCase()) {
      case "email":
        return Mail
      case "web browsing":
        return Globe
      case "usb devices":
        return Usb
      case "network":
        return Wifi
      default:
        return Monitor
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity.toLowerCase()) {
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

  function getStatusIcon(status: string) {
    switch (status.toLowerCase()) {
      case "contained":
        return CheckCircle
      case "resolved":
        return CheckCircle
      case "monitoring":
        return Eye
      case "blocked":
        return Ban
      default:
        return AlertCircle
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
                  <BreadcrumbPage>SIEM & Event Monitor</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Title and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">SIEM & Event Monitor</h1>
                <Badge variant="destructive" className="text-xs whitespace-nowrap">
                  {siemData.activeThreats} Active Threats
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
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
        {/* Mobile Priority Cards - Show at top on small screens */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Total Events Card - Mobile */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Total Events</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-medium">{siemData.totalEvents?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">High Priority</span>
                  <span className="font-medium text-red-600">{siemData.highPriorityEvents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Medium Priority</span>
                  <span className="font-medium text-orange-600">{siemData.mediumPriorityEvents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Resolved</span>
                  <span className="font-medium text-green-600">{siemData.resolvedEvents?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Active Threats Card - Mobile */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Active Threats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-medium text-red-600">{siemData.activeThreats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Contained</span>
                  <span className="font-medium text-green-600">
                    {siemData.recentEvents?.filter((e) => e.status === "Contained").length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Under Investigation</span>
                  <span className="font-medium text-orange-600">
                    {siemData.recentEvents?.filter((e) => e.status === "Monitoring").length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Threat Sources Card - Mobile */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Threat Sources</h3>
              <div className="space-y-3">
                {threatSourcesData.slice(0, 3).map(({ source, count, icon: Icon }) => (
                  <div key={source} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{source}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Security Overview */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Security Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Events</span>
                  <span className="font-medium">{siemData.totalEvents?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">High Priority</span>
                  <span className="font-medium text-red-600">{siemData.highPriorityEvents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Threats</span>
                  <span className="font-medium text-red-600">{siemData.activeThreats}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Resolved</span>
                  <span className="font-medium text-green-600">{siemData.resolvedEvents?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Events
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  SIEM Settings
                </Button>
              </div>
            </div>

            {/* Threat Sources */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Threat Sources</h3>
              <div className="space-y-3">
                {threatSourcesData.map(({ source, count, icon: Icon }) => (
                  <div key={source} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{source}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Status */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Integration Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Azure Sentinel</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Splunk</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Configuring
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Carbon Black</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Cisco Umbrella</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Connected
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-2">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                {siemData.recentEvents?.slice(0, 4).map((event, index) => {
                  const StatusIcon = getStatusIcon(event.status)
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-1 rounded ${getSeverityColor(event.severity)}`}>
                        <StatusIcon className="h-3 w-3" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium line-clamp-2">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.source} • {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* HBI SIEM Insights */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">HBI SIEM Insights</h3>
              </div>
              <div className="p-0 h-80">
                <EnhancedHBIInsights config={siemInsights} cardId="siem-insights" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-card border border-border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold text-foreground">{siemData.totalEvents?.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold text-red-600">{siemData.highPriorityEvents}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Threats</p>
                    <p className="text-2xl font-bold text-red-600">{siemData.activeThreats}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{siemData.resolvedEvents?.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* SIEM Log Overview Card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <SiemLogOverviewCard />
            </div>

            {/* Main SIEM Dashboard */}
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Event Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Threat Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {threatSourcesData.map(({ source, count, icon: Icon }) => (
                              <div key={source} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{source}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="bg-muted rounded-full h-2 w-20">
                                    <div
                                      className="bg-red-500 rounded-full h-2 transition-all duration-300"
                                      style={{
                                        width: `${(count / Math.max(...threatSourcesData.map((t) => t.count))) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium w-8">{count}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Recent Critical Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {siemData.recentEvents?.slice(0, 4).map((event, index) => {
                              const StatusIcon = getStatusIcon(event.status)
                              return (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                                  <div className={`p-1 rounded ${getSeverityColor(event.severity)}`}>
                                    <StatusIcon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium">{event.type}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {event.severity}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {event.source} • {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="events" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedSource} onValueChange={setSelectedSource}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="carbon">Carbon Black</SelectItem>
                            <SelectItem value="azure">Azure AD</SelectItem>
                            <SelectItem value="cisco">Cisco Umbrella</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Severities</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Security Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Severity</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredEvents.map((event, index) => {
                              const StatusIcon = getStatusIcon(event.status)
                              return (
                                <TableRow key={index}>
                                  <TableCell className="text-sm">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-sm">{event.type}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={getSeverityColor(event.severity)}>
                                      {event.severity}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm">{event.source}</TableCell>
                                  <TableCell className="text-sm max-w-xs truncate">{event.description}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <StatusIcon className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{event.status}</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Critical Alert Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {criticalAlerts.map((alert, index) => (
                            <div key={alert.id} className="relative">
                              {index < criticalAlerts.length - 1 && (
                                <div className="absolute left-4 top-8 w-0.5 h-16 bg-border"></div>
                              )}
                              <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)} flex-shrink-0`}>
                                  <AlertTriangle className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{alert.type}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {alert.severity}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(alert.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-muted-foreground">Source: {alert.source}</span>
                                    <span className="text-xs text-muted-foreground">Status: {alert.status}</span>
                                    {alert.resolvedAt && (
                                      <span className="text-xs text-green-600">
                                        Resolved: {new Date(alert.resolvedAt).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="integrations" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Azure Sentinel Integration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Connected</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Azure Sentinel workspace is connected and actively collecting security events.</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Last Sync:</span>
                                <span>2 minutes ago</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Events Today:</span>
                                <span>15,420</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Analytics Rules:</span>
                                <span>34 active</span>
                              </div>
                            </div>
                            <Button size="sm" className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Azure Sentinel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Splunk Integration</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <span className="text-sm">Configuration in Progress</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Splunk Enterprise configuration is being finalized for log aggregation.</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Setup Progress:</span>
                                <span>75%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Data Sources:</span>
                                <span>12 configured</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Expected Completion:</span>
                                <span>Dec 30, 2024</span>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" className="w-full">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure Splunk
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Integration Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">98.7%</div>
                              <div className="text-sm text-muted-foreground">Uptime</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">2.3s</div>
                              <div className="text-sm text-muted-foreground">Avg Response</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">156</div>
                              <div className="text-sm text-muted-foreground">Alerts/Day</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">4</div>
                              <div className="text-sm text-muted-foreground">Data Sources</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
