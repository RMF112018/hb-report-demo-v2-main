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
  Database,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  RefreshCw,
  Filter,
  Search,
  Download,
  Plus,
  Play,
  Eye,
  RotateCcw,
  HardDrive,
  Cloud,
  Server,
  Home,
  Calendar,
  Activity,
  BarChart3,
  Zap,
  FileArchive,
  History,
  AlertCircle,
  TrendingUp,
  Layers,
  Archive,
  Info,
} from "lucide-react"

import commandCenterMock from "@/data/mock/it/commandCenterMock.json"
import BackupRestoreStatusCard from "@/components/cards/it/BackupRestoreStatusCard"
import { EnhancedHBIInsights } from "@/components/cards/EnhancedHBIInsights"

export default function BackupPage() {
  const { user } = useAuth()
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

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

  const backupData = {
    totalJobs: 45,
    successfulJobs: 42,
    failedJobs: 2,
    runningJobs: 1,
    totalDataProtected: "12.7TB",
    lastBackupTime: "2024-12-26 02:30:00",
    recoveryTests: 8,
    systemCoverage: 93.3,
    platformCount: 3,
    monthlyGrowth: 12.5,
    averageBackupTime: "18m 45s",
    compressionRatio: 2.3,
    deduplicationSavings: "3.2TB",
    retentionCompliance: 98.7,
    rpoAchievement: 95.2,
    rtoAchievement: 92.8,
    storageUtilization: 78.4,
    networkUtilization: 32.1,
    upcomingRetentionExpirations: 15,
    criticalSystemsProtected: 18,
    offSiteBackups: 38,
    encryptionCompliance: 100,
    automationLevel: 89.3,
    alertsLast24h: 3,
    recoveryPointsAvailable: 1247,
    healthScore: 94.2,
  }

  // Backup-specific AI insights
  const backupInsights = [
    {
      id: "backup-1",
      type: "risk",
      severity: "high",
      title: "Storage Capacity Warning",
      text: "CommVault platform approaching 75% capacity threshold. Risk of backup failures within 2 weeks.",
      action: "Implement automated storage tiering and expand capacity by 2TB.",
      confidence: 94,
      relatedMetrics: ["Storage Capacity", "Backup Success Rate", "Platform Health"],
    },
    {
      id: "backup-2",
      type: "opportunity",
      severity: "medium",
      title: "Deduplication Optimization",
      text: "HBI Analysis identifies 15% additional storage savings through enhanced deduplication policies.",
      action: "Update deduplication rules for Project Files and Exchange databases.",
      confidence: 87,
      relatedMetrics: ["Storage Efficiency", "Cost Optimization", "Deduplication"],
    },
    {
      id: "backup-3",
      type: "alert",
      severity: "high",
      title: "Recovery Test Compliance Gap",
      text: "3 critical systems haven't undergone recovery testing in 90+ days, violating policy.",
      action: "Schedule immediate recovery tests for SQL Finance, Exchange, and SharePoint.",
      confidence: 100,
      relatedMetrics: ["Compliance", "Recovery Testing", "Risk Management"],
    },
    {
      id: "backup-4",
      type: "forecast",
      severity: "medium",
      title: "Performance Degradation Trend",
      text: "Backup job completion times increasing by 8% month-over-month due to data growth.",
      action: "Implement incremental backup scheduling and consider network optimization.",
      confidence: 91,
      relatedMetrics: ["Performance", "Backup Duration", "Network Utilization"],
    },
    {
      id: "backup-5",
      type: "performance",
      severity: "low",
      title: "Automation Success Rate",
      text: "Automated backup scheduling achieving 96.8% success rate, exceeding industry average.",
      action: "Document best practices and apply automation model to disaster recovery.",
      confidence: 98,
      relatedMetrics: ["Automation", "Reliability", "Best Practices"],
    },
    {
      id: "backup-6",
      type: "risk",
      severity: "medium",
      title: "Retention Policy Violations",
      text: "15 backup sets approaching retention expiration without proper archival verification.",
      action: "Initiate archival validation process and update retention policies.",
      confidence: 89,
      relatedMetrics: ["Retention Management", "Compliance", "Data Governance"],
    },
  ]

  const backupJobs = [
    {
      id: "BJ-2024-1456",
      source: "SQL Server - Finance DB",
      platform: "CommVault",
      size: "2.4GB",
      duration: "14m 32s",
      status: "Success",
      startTime: "2024-12-26 02:00:00",
      endTime: "2024-12-26 02:14:32",
      backupType: "Incremental",
    },
    {
      id: "BJ-2024-1455",
      source: "Exchange Server 2019",
      platform: "Acronis",
      size: "1.8GB",
      duration: "22m 45s",
      status: "Success",
      startTime: "2024-12-26 01:30:00",
      endTime: "2024-12-26 01:52:45",
      backupType: "Full",
    },
    {
      id: "BJ-2024-1454",
      source: "File Server - Projects",
      platform: "Serverio",
      size: "4.7GB",
      duration: "18m 15s",
      status: "Success",
      startTime: "2024-12-26 01:00:00",
      endTime: "2024-12-26 01:18:15",
      backupType: "Incremental",
    },
    {
      id: "BJ-2024-1453",
      source: "Domain Controller",
      platform: "CommVault",
      size: "856MB",
      duration: "Running",
      status: "Running",
      startTime: "2024-12-26 02:45:00",
      endTime: null,
      backupType: "Full",
    },
    {
      id: "BJ-2024-1452",
      source: "SharePoint Server",
      platform: "Acronis",
      size: "3.2GB",
      duration: "Failed",
      status: "Failed",
      startTime: "2024-12-26 00:30:00",
      endTime: "2024-12-26 00:35:12",
      backupType: "Incremental",
    },
  ]

  const recoveryTests = [
    {
      id: "RT-2024-089",
      system: "SQL Server - Finance DB",
      testDate: "2024-12-20",
      testType: "Full Recovery",
      duration: "45m 30s",
      status: "Success",
      dataIntegrity: "100%",
      rto: "12 minutes",
      rpo: "15 minutes",
      notes: "All data recovered successfully, application functional",
    },
    {
      id: "RT-2024-088",
      system: "Exchange Server 2019",
      testDate: "2024-12-18",
      testType: "Mailbox Recovery",
      duration: "28m 15s",
      status: "Success",
      dataIntegrity: "100%",
      rto: "8 minutes",
      rpo: "5 minutes",
      notes: "All mailboxes restored, no data loss detected",
    },
    {
      id: "RT-2024-087",
      system: "File Server - Projects",
      testDate: "2024-12-15",
      testType: "File Recovery",
      duration: "15m 42s",
      status: "Partial",
      dataIntegrity: "98.5%",
      rto: "15 minutes",
      rpo: "1 hour",
      notes: "Minor file corruption in archived projects folder",
    },
  ]

  const backupPlatforms = [
    {
      name: "CommVault",
      status: "Active",
      version: "11.24.85",
      systemsProtected: 18,
      storageUsed: "4.2TB",
      storageCapacity: "8TB",
    },
    {
      name: "Acronis Cyber Backup",
      status: "Active",
      version: "12.5.16342",
      systemsProtected: 15,
      storageUsed: "3.8TB",
      storageCapacity: "6TB",
    },
    {
      name: "Serverio",
      status: "Recently Installed",
      version: "2.1.4",
      systemsProtected: 12,
      storageUsed: "4.7TB",
      storageCapacity: "10TB",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-600 bg-green-100"
      case "failed":
        return "text-red-600 bg-red-100"
      case "running":
        return "text-blue-600 bg-blue-100"
      case "partial":
        return "text-orange-600 bg-orange-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "commvault":
        return Database
      case "acronis":
        return Shield
      case "serverio":
        return Server
      default:
        return HardDrive
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="max-w-[1920px] mx-auto">
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
                  <BreadcrumbPage>Backup & Recovery</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Backup & Recovery</h1>
                <Badge variant="outline" className="text-xs whitespace-nowrap">
                  {backupData.systemCoverage}% Coverage
                </Badge>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="text-sm">
                  <Play className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Run Test</span>
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

            <div className="mt-3">
              <ITModuleNavigation />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Sidebar - Quick Stats and Actions */}
          <div className="xl:col-span-4">
            <div className="space-y-4">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Jobs</span>
                      <span className="font-bold text-lg">{backupData.totalJobs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Success Rate</span>
                      <span className="font-bold text-green-600">
                        {Math.round((backupData.successfulJobs / backupData.totalJobs) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Protected</span>
                      <span className="font-bold text-blue-600">{backupData.totalDataProtected}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Health Score</span>
                      <span className="font-bold text-emerald-600">{backupData.healthScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Run Backup Test
                    </Button>
                    <Button className="w-full" variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Test Recovery
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Schedule
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Storage Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{backupData.compressionRatio}:1</div>
                      <p className="text-sm text-muted-foreground">Compression Ratio</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage Utilization</span>
                        <span className="font-medium">{backupData.storageUtilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${backupData.storageUtilization}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Deduplication Savings</span>
                        <span className="font-medium text-green-600">{backupData.deduplicationSavings}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {backupPlatforms.map((platform) => {
                      const Icon = getPlatformIcon(platform.name)
                      return (
                        <div key={platform.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{platform.name.split(" ")[0]}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              platform.status === "Active" ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
                            }
                          >
                            {platform.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Backup Intelligence</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80">
                    <EnhancedHBIInsights config={backupInsights} cardId="backup-ai-insights" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="xl:col-span-8">
            <div className="bg-card border border-border rounded-lg">
              <CardHeader>
                <CardTitle className="text-xl">Backup & Disaster Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Backup Jobs</TabsTrigger>
                    <TabsTrigger value="recovery">Recovery Tests</TabsTrigger>
                    <TabsTrigger value="coverage">Coverage</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <BackupRestoreStatusCard />

                    {/* Enhanced Performance Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Recovery Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">{backupData.rpoAchievement}%</div>
                          <p className="text-xs text-muted-foreground">RPO Achievement</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">{backupData.rtoAchievement}%</span> RTO
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Automation Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">{backupData.automationLevel}%</div>
                          <p className="text-xs text-muted-foreground">Automated Processes</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">{backupData.alertsLast24h}</span> alerts today
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Network Utilization</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-indigo-600">{backupData.networkUtilization}%</div>
                          <p className="text-xs text-muted-foreground">Network Usage</p>
                          <div className="text-sm mt-1">
                            <span className="font-medium">{backupData.averageBackupTime}</span> avg time
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Compliance & Risk Matrix */}
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Compliance & Risk Matrix</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Retention Compliance</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${backupData.retentionCompliance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{backupData.retentionCompliance}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Encryption Compliance</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ width: `${backupData.encryptionCompliance}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{backupData.encryptionCompliance}%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Network Utilization</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${backupData.networkUtilization}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-bold">{backupData.networkUtilization}%</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground space-y-2">
                            <div className="flex justify-between">
                              <span>Recovery Points Available:</span>
                              <span className="font-medium">{backupData.recoveryPointsAvailable}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Off-site Backups:</span>
                              <span className="font-medium">{backupData.offSiteBackups}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Upcoming Expirations:</span>
                              <span className="font-medium text-yellow-600">
                                {backupData.upcomingRetentionExpirations}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Critical Systems Protected:</span>
                              <span className="font-medium">{backupData.criticalSystemsProtected}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="jobs" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Latest Backup Jobs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Source</TableHead>
                              <TableHead>Platform</TableHead>
                              <TableHead>Size</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Type</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {backupJobs.map((job) => (
                              <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.source}</TableCell>
                                <TableCell className="text-sm">{job.platform}</TableCell>
                                <TableCell className="text-sm">{job.size}</TableCell>
                                <TableCell className="text-sm">{job.duration}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(job.status)}>
                                    {job.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{job.backupType}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="recovery" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recovery Test Reports</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>System</TableHead>
                              <TableHead>Test Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Duration</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Data Integrity</TableHead>
                              <TableHead>RTO</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recoveryTests.map((test) => (
                              <TableRow key={test.id}>
                                <TableCell className="font-medium">{test.system}</TableCell>
                                <TableCell className="text-sm">{test.testType}</TableCell>
                                <TableCell className="text-sm">{test.testDate}</TableCell>
                                <TableCell className="text-sm">{test.duration}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(test.status)}>
                                    {test.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">{test.dataIntegrity}</TableCell>
                                <TableCell className="text-sm">{test.rto}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="coverage" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Backup Platform Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {backupPlatforms.map((platform) => {
                            const Icon = getPlatformIcon(platform.name)
                            return (
                              <div key={platform.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">{platform.name}</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={
                                      platform.status === "Active"
                                        ? "text-green-600 bg-green-100"
                                        : "text-blue-600 bg-blue-100"
                                    }
                                  >
                                    {platform.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                  <div>Version: {platform.version}</div>
                                  <div>Systems: {platform.systemsProtected}</div>
                                  <div>Storage: {platform.storageUsed}</div>
                                  <div>Capacity: {platform.storageCapacity}</div>
                                </div>
                              </div>
                            )
                          })}
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
