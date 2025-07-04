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
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Download,
  ExternalLink,
  Activity,
  TrendingUp,
  Home,
  Globe,
  Database,
  Users,
  Clock,
  Info,
} from "lucide-react"

// Mock data and components
import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import EmailSecurityHealthCard from "@/components/cards/it/EmailSecurityHealthCard"

/**
 * Email Security Health Page
 * -------------------------
 * Email authentication and threat filtering performance monitoring
 * Features:
 * - Real-time email security monitoring
 * - SPF/DKIM/DMARC status tracking
 * - Spoofing attempt analysis
 * - Microsoft Graph API integration points
 * - Mobile-responsive layout following project page structure
 */
export default function EmailSecurityPage() {
  const { user } = useAuth()
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [selectedThreatType, setSelectedThreatType] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

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

  const emailData = commandCenterMock.email

  // Mock SPF/DKIM/DMARC data for major domains
  const domainAuthStatus = [
    {
      domain: "hedrickbrothers.com",
      spf: { status: "Pass", record: "v=spf1 include:_spf.google.com ~all" },
      dkim: { status: "Pass", selector: "google", key: "Valid" },
      dmarc: { status: "Pass", policy: "quarantine", alignment: "relaxed" },
    },
    {
      domain: "procore.com",
      spf: { status: "Pass", record: "v=spf1 include:_spf.procore.com ~all" },
      dkim: { status: "Pass", selector: "procore", key: "Valid" },
      dmarc: { status: "Pass", policy: "reject", alignment: "strict" },
    },
    {
      domain: "autodesk.com",
      spf: { status: "Pass", record: "v=spf1 include:_spf.autodesk.com ~all" },
      dkim: { status: "Pass", selector: "autodesk", key: "Valid" },
      dmarc: { status: "Pass", policy: "reject", alignment: "strict" },
    },
    {
      domain: "microsoft.com",
      spf: { status: "Pass", record: "v=spf1 include:_spf.microsoft.com ~all" },
      dkim: { status: "Pass", selector: "selector1", key: "Valid" },
      dmarc: { status: "Pass", policy: "reject", alignment: "strict" },
    },
  ]

  // Mock recent spoofing attempts
  const spoofingAttempts = [
    {
      id: "SA-2024-001",
      timestamp: "2024-12-26T14:35:22Z",
      fromAddress: "noreply@fake-microsoft.com",
      targetDomain: "hedrickbrothers.com",
      spfResult: "Fail",
      dkimResult: "Fail",
      dmarcResult: "Fail",
      action: "Blocked",
      confidence: 95,
      recipientCount: 1,
      subject: "Urgent: Verify your Microsoft 365 account",
    },
    {
      id: "SA-2024-002",
      timestamp: "2024-12-26T13:42:11Z",
      fromAddress: "invoice@suspicious-domain.net",
      targetDomain: "hedrickbrothers.com",
      spfResult: "Fail",
      dkimResult: "None",
      dmarcResult: "Fail",
      action: "Quarantined",
      confidence: 98,
      recipientCount: 3,
      subject: "Invoice #2024-1156.exe",
    },
    {
      id: "SA-2024-003",
      timestamp: "2024-12-26T12:15:33Z",
      fromAddress: "admin@fake-procore.com",
      targetDomain: "hedrickbrothers.com",
      spfResult: "Fail",
      dkimResult: "Fail",
      dmarcResult: "Fail",
      action: "Blocked",
      confidence: 92,
      recipientCount: 2,
      subject: "Project Update Required",
    },
  ]

  // Filter spoofing attempts
  const filteredAttempts = useMemo(() => {
    let attempts = spoofingAttempts

    if (selectedDomain !== "all") {
      attempts = attempts.filter((attempt) => attempt.targetDomain === selectedDomain)
    }

    return attempts
  }, [selectedDomain])

  function getAuthStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case "pass":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "fail":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      case "none":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30"
      default:
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
    }
  }

  function getAuthStatusIcon(status: string) {
    switch (status.toLowerCase()) {
      case "pass":
        return CheckCircle
      case "fail":
        return XCircle
      default:
        return AlertTriangle
    }
  }

  function getActionColor(action: string) {
    switch (action.toLowerCase()) {
      case "blocked":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      case "quarantined":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30"
      case "delivered":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
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
                  <BreadcrumbPage>Email Security Health</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Title and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Email Security Health</h1>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {emailData.spamDetection}% Detection Rate
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
        {/* Mobile Priority Cards */}
        <div className="block xl:hidden mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Messages Overview - Mobile */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Messages Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{emailData.totalMessages?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-medium text-green-600">{emailData.deliveredMessages?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blocked</span>
                  <span className="font-medium text-red-600">{emailData.blockedMessages}</span>
                </div>
              </div>
            </div>

            {/* Threat Protection - Mobile */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Threat Protection</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spam Detection</span>
                  <span className="font-medium text-green-600">{emailData.spamDetection}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phishing Blocked</span>
                  <span className="font-medium text-red-600">{emailData.phishingBlocked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Malware Blocked</span>
                  <span className="font-medium text-red-600">{emailData.malwareBlocked}</span>
                </div>
              </div>
            </div>

            {/* Authentication Status - Mobile */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Authentication Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SPF Pass</span>
                  <span className="font-medium text-green-600">4/4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">DKIM Pass</span>
                  <span className="font-medium text-green-600">4/4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">DMARC Pass</span>
                  <span className="font-medium text-green-600">4/4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Responsive Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Sidebar - Hidden on mobile, shown on xl+ */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            {/* Email Overview */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Email Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Messages</span>
                  <span className="font-medium">{emailData.totalMessages?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivered</span>
                  <span className="font-medium text-green-600">{emailData.deliveredMessages?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blocked</span>
                  <span className="font-medium text-red-600">{emailData.blockedMessages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quarantined</span>
                  <span className="font-medium text-orange-600">{emailData.quarantinedMessages}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Messages
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Policy Management
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
              </div>
            </div>

            {/* Threat Statistics */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Threat Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spam Detection</span>
                  <span className="font-medium text-green-600">{emailData.spamDetection}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phishing Blocked</span>
                  <span className="font-medium text-red-600">{emailData.phishingBlocked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Malware Blocked</span>
                  <span className="font-medium text-red-600">{emailData.malwareBlocked}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Threats Caught</span>
                  <span className="font-medium text-orange-600">{emailData.securityMetrics.threatsCaught}</span>
                </div>
              </div>
            </div>

            {/* Microsoft Graph API Status */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">API Integration</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Graph API</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Connected
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Email Messages</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Threat Submissions</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                {emailData.recentThreats?.slice(0, 3).map((threat, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-red-100 dark:bg-red-900/20 rounded">
                      <Ban className="h-3 w-3 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium line-clamp-2">{threat.type} blocked</p>
                      <p className="text-xs text-muted-foreground">
                        {threat.sender} • {new Date(threat.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-9 space-y-4 lg:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                    <p className="text-2xl font-bold text-foreground">{emailData.totalMessages?.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Spam Detection</p>
                    <p className="text-2xl font-bold text-green-600">{emailData.spamDetection}%</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Phishing Blocked</p>
                    <p className="text-2xl font-bold text-red-600">{emailData.phishingBlocked}</p>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Ban className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Threats Caught</p>
                    <p className="text-2xl font-bold text-orange-600">{emailData.securityMetrics.threatsCaught}</p>
                  </div>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Security Health Card */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <EmailSecurityHealthCard />
            </div>

            {/* Main Email Security Dashboard */}
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Security Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="authentication">Authentication</TabsTrigger>
                    <TabsTrigger value="spoofing">Spoofing Attempts</TabsTrigger>
                    <TabsTrigger value="api">API Integration</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Message Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Total Messages</span>
                              <span className="font-medium">{emailData.totalMessages?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Delivered</span>
                              <span className="font-medium text-green-600">
                                {emailData.deliveredMessages?.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Blocked</span>
                              <span className="font-medium text-red-600">{emailData.blockedMessages}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Quarantined</span>
                              <span className="font-medium text-orange-600">{emailData.quarantinedMessages}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Security Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Spam Detection Rate</span>
                              <span className="font-medium text-green-600">{emailData.spamDetection}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Phishing Blocked</span>
                              <span className="font-medium text-red-600">{emailData.phishingBlocked}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Malware Blocked</span>
                              <span className="font-medium text-red-600">{emailData.malwareBlocked}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Avg Processing Time</span>
                              <span className="font-medium">{emailData.securityMetrics.avgProcessingTime}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="authentication" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Domain Authentication Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {domainAuthStatus.map((domain) => (
                            <div key={domain.domain} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold">{domain.domain}</h4>
                                <Badge variant="outline" className="text-green-600">
                                  All Pass
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">SPF</span>
                                    <Badge variant="outline" className={getAuthStatusColor(domain.spf.status)}>
                                      {domain.spf.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{domain.spf.record}</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">DKIM</span>
                                    <Badge variant="outline" className={getAuthStatusColor(domain.dkim.status)}>
                                      {domain.dkim.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Selector: {domain.dkim.selector}</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium">DMARC</span>
                                    <Badge variant="outline" className={getAuthStatusColor(domain.dmarc.status)}>
                                      {domain.dmarc.status}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Policy: {domain.dmarc.policy}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="spoofing" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filters:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select domain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            <SelectItem value="hedrickbrothers.com">hedrickbrothers.com</SelectItem>
                            <SelectItem value="procore.com">procore.com</SelectItem>
                            <SelectItem value="autodesk.com">autodesk.com</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Spoofing Attempts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Timestamp</TableHead>
                              <TableHead>From Address</TableHead>
                              <TableHead>Target Domain</TableHead>
                              <TableHead>SPF</TableHead>
                              <TableHead>DKIM</TableHead>
                              <TableHead>DMARC</TableHead>
                              <TableHead>Action</TableHead>
                              <TableHead>Recipients</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredAttempts.map((attempt) => (
                              <TableRow key={attempt.id}>
                                <TableCell className="text-sm">
                                  {new Date(attempt.timestamp).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm max-w-xs truncate">{attempt.fromAddress}</TableCell>
                                <TableCell className="text-sm">{attempt.targetDomain}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getAuthStatusColor(attempt.spfResult)}>
                                    {attempt.spfResult}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getAuthStatusColor(attempt.dkimResult)}>
                                    {attempt.dkimResult}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getAuthStatusColor(attempt.dmarcResult)}>
                                    {attempt.dmarcResult}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getActionColor(attempt.action)}>
                                    {attempt.action}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{attempt.recipientCount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="api" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Microsoft Graph Email API</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Connected</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Microsoft Graph emailMessage API is connected for real-time email monitoring.</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>API Endpoint:</span>
                                <span className="font-mono text-xs">/me/messages</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Last Sync:</span>
                                <span>30 seconds ago</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Messages Today:</span>
                                <span>{emailData.totalMessages?.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                <strong>Integration Point:</strong> Microsoft Graph API emailMessage endpoint provides
                                real-time access to email metadata, headers, and content for security analysis.
                              </p>
                            </div>
                            <Button size="sm" className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View API Documentation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Threat Submission API</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Connected</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Microsoft Graph threatSubmission API is configured for automated threat reporting.</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>API Endpoint:</span>
                                <span className="font-mono text-xs">/security/threatSubmission</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Submissions Today:</span>
                                <span>{emailData.securityMetrics.threatsCaught}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>False Positives:</span>
                                <span>{emailData.securityMetrics.falsePositives}</span>
                              </div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-lg">
                              <p className="text-xs text-orange-800 dark:text-orange-200">
                                <strong>Integration Point:</strong> Microsoft Graph threatSubmission API enables
                                automated submission of suspicious emails to Microsoft Defender for analysis and threat
                                intelligence.
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="w-full">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure Submissions
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">API Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">99.8%</div>
                            <div className="text-sm text-muted-foreground">API Uptime</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {emailData.securityMetrics.avgProcessingTime}
                            </div>
                            <div className="text-sm text-muted-foreground">Avg Response</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {emailData.securityMetrics.perceptionPointScans?.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">API Calls/Day</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {emailData.securityMetrics.falsePositives}
                            </div>
                            <div className="text-sm text-muted-foreground">False Positives</div>
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
