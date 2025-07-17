"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useTour } from "@/context/tour-context"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { DashboardProvider, useDashboardContext } from "@/context/dashboard-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

// Import comprehensive IT module components
import AiPipelinesPage from "@/app/it/command-center/ai-pipelines/page"
import AssetTrackerPage from "@/app/it/command-center/assets/page"
import BackupPage from "@/app/it/command-center/backup/page"
import ConsultantsPage from "@/app/it/command-center/consultants/page"
import EmailSecurityPage from "@/app/it/command-center/email/page"
import EndpointManagementPage from "@/app/it/command-center/endpoints/page"
import GovernancePage from "@/app/it/command-center/governance/page"
import InfrastructureMonitorPage from "@/app/it/command-center/infrastructure/page"
import HBIntelManagementPage from "@/app/it/command-center/management/page"
import SIEMEventMonitorPage from "@/app/it/command-center/siem/page"

import {
  Shield,
  Activity,
  Users,
  AlertTriangle,
  Database,
  Monitor,
  Brain,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  ArrowRight,
  Headphones,
  Star,
  MessageSquare,
  Timer,
  Target,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Package,
  Mail,
  Smartphone,
  Printer,
  Globe,
  FileText,
  Eye,
  Play,
  Pause,
  Calendar,
  Building,
  Lock,
  Key,
  FileCheck,
  UserCheck,
  Download,
  Plus,
  Edit,
  Filter,
  Search,
  RotateCcw,
  Info,
} from "lucide-react"
import type { DashboardCard } from "@/types/dashboard"

/**
 * IT Command Center Content Component
 * ----------------------------------
 * Central hub for IT operations and system monitoring
 * Features:
 * - Professional v3.0 styling with blue-gray color scheme
 * - Compact layouts with reduced spacing
 * - Real-time system health monitoring
 * - Modular dashboard cards with lazy loading
 * - Mobile-responsive design
 * - Comprehensive module integration from individual IT pages
 */

interface ITCommandCenterContentProps {
  user: any
  selectedModule?: string | null
  onModuleSelect?: (moduleId: string | null) => void
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

function ITCommandCenterMainContent({ user, selectedModule, onModuleSelect }: ITCommandCenterContentProps) {
  const { dashboards, currentDashboardId, updateDashboard, loading } = useDashboardContext()
  const { startTour, isTourAvailable } = useTour()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [layoutDensity, setLayoutDensity] = useState<"compact" | "normal" | "spacious">("compact")

  const currentDashboard = dashboards.find((d) => d.id === currentDashboardId)

  // Mock IT system metrics - following v3.0 professional standards
  const itSystemMetrics = {
    totalUsers: 267,
    activeUsers: 243,
    mfaEnabled: 234,
    systemUptime: "99.94%",
    apiHealth: "Operational",
    databaseHealth: "Optimal",
    securityAlerts: 3,
    activeThreats: 0,
    aiModelsActive: 4,
    totalDevices: 145,
    managedDevices: 132,
    complianceScore: 96,
    backupStatus: "Healthy",
    lastBackup: "2024-01-02T03:00:00Z",
    storageUsed: 68,
    networkLatency: "12ms",
    cpuUsage: 23,
    memoryUsage: 45,
    monthlyItCost: 8945.67,
  }

  // Help Desk support metrics - comprehensive IT support tracking
  const helpDeskMetrics = {
    todayTickets: {
      open: 12,
      total: 47,
      resolved: 35,
      pending: 8,
      escalated: 4,
    },
    averageResolutionTime: "4.2 hours",
    firstResponseTime: "18 minutes",
    slaCompliance: 94.7,
    customerSatisfaction: 4.6,
    ticketsByPriority: {
      critical: 2,
      high: 8,
      medium: 15,
      low: 22,
    },
    topIssueCategories: [
      { category: "Network Connectivity", count: 12, trend: "up" },
      { category: "Software Installation", count: 8, trend: "down" },
      { category: "Email Issues", count: 7, trend: "stable" },
      { category: "Hardware Problems", count: 6, trend: "up" },
      { category: "Access & Permissions", count: 5, trend: "stable" },
    ],
    agentMetrics: {
      totalAgents: 6,
      activeAgents: 4,
      avgTicketsPerAgent: 7.8,
      topPerformer: "Sarah Chen",
    },
    weeklyTrends: {
      ticketVolume: "+12%",
      resolutionTime: "-8%",
      satisfaction: "+3%",
      slaCompliance: "+2%",
    },
  }

  // Recent IT activities with professional color scheme
  const recentItActivities = [
    {
      id: "1",
      type: "security",
      title: "Security patch deployed",
      description: "Windows updates applied to 45 devices",
      time: "15 minutes ago",
      icon: Shield,
      color: "green",
    },
    {
      id: "2",
      type: "backup",
      title: "Backup completed successfully",
      description: "Daily backup of all systems",
      time: "2 hours ago",
      icon: Database,
      color: "blue",
    },
    {
      id: "3",
      type: "user",
      title: "New user onboarded",
      description: "MFA setup completed for Emma Rodriguez",
      time: "4 hours ago",
      icon: Users,
      color: "purple",
    },
    {
      id: "4",
      type: "alert",
      title: "High CPU usage detected",
      description: "Server ITX-001 reached 89% CPU usage",
      time: "6 hours ago",
      icon: AlertTriangle,
      color: "yellow",
    },
  ]

  // Critical IT metrics for professional overview
  const criticalMetrics = [
    {
      label: "Security Score",
      value: "96%",
      status: "excellent",
      icon: Shield,
      color: "green",
    },
    {
      label: "System Health",
      value: itSystemMetrics.apiHealth,
      status: "operational",
      icon: Activity,
      color: "green",
    },
    {
      label: "Active Threats",
      value: itSystemMetrics.activeThreats,
      status: "none",
      icon: AlertTriangle,
      color: itSystemMetrics.activeThreats > 0 ? "red" : "green",
    },
    {
      label: "Compliance",
      value: `${itSystemMetrics.complianceScore}%`,
      status: "compliant",
      icon: CheckCircle,
      color: "green",
    },
  ]

  // Auto-start IT Command Center tour for new visitors
  useEffect(() => {
    if (typeof window !== "undefined" && user && isTourAvailable) {
      const hasDisabledTours = localStorage.getItem("hb-tour-available") === "false"
      if (hasDisabledTours) return

      const hasShownITTour = sessionStorage.getItem("hb-tour-shown-it-command-center")
      if (!hasShownITTour) {
        setTimeout(() => {
          startTour("it-command-center", true)
        }, 3000)
      }
    }
  }, [isTourAvailable, startTour, user])

  // Dashboard handlers following v3.0 modular patterns
  const handleLayoutChange = (newLayout: any[]) => {
    if (!currentDashboard) return
    const newCards = newLayout
      .map((layoutItem) => {
        const card = currentDashboard.cards.find((c) => c.id === layoutItem.i)
        return card ? { ...card } : null
      })
      .filter(Boolean) as DashboardCard[]

    updateDashboard({
      ...currentDashboard,
      cards: newCards,
    })
  }

  const handleCardRemove = (cardId: string) => {
    if (!currentDashboard) return
    const updatedCards = currentDashboard.cards.filter((card) => card.id !== cardId)
    updateDashboard({
      ...currentDashboard,
      cards: updatedCards,
    })
  }

  const handleCardConfigure = (cardId: string, configUpdate?: Partial<DashboardCard>) => {
    if (!currentDashboard) return
    if (configUpdate) {
      const updatedCards = currentDashboard.cards.map((card) =>
        card.id === cardId ? { ...card, ...configUpdate } : card
      )
      updateDashboard({
        ...currentDashboard,
        cards: updatedCards,
      })
    }
  }

  const handleCardSizeChange = (cardId: string, size: string) => {
    if (!currentDashboard) return
    const updatedCards = currentDashboard.cards.map((card) => (card.id === cardId ? { ...card, size } : card))
    updateDashboard({
      ...currentDashboard,
      cards: updatedCards,
    })
  }

  const handleCardAdd = () => {
    if (!currentDashboard) return

    const findNextPosition = () => {
      const positions = currentDashboard.cards.map((card) => card.position || { x: 0, y: 0 })
      const maxY = Math.max(...positions.map((p) => p.y), 0)
      return { x: 0, y: maxY + 1 }
    }

    const newCard: DashboardCard = {
      id: `card-${Date.now()}`,
      title: "New Card",
      type: "metric",
      size: "medium",
      position: findNextPosition(),
      span: { cols: 4, rows: 3 },
      visible: true,
    }

    updateDashboard({
      ...currentDashboard,
      cards: [...currentDashboard.cards, newCard],
    })
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleReset = () => {
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
      case "operational":
      case "compliant":
        return "text-green-600 dark:text-green-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "critical":
      case "error":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getActivityColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
      case "blue":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
      case "purple":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
      case "yellow":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ChevronUp className="h-3 w-3 text-red-500" />
      case "down":
        return <ChevronDown className="h-3 w-3 text-green-500" />
      case "stable":
        return <Minus className="h-3 w-3 text-gray-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-red-500"
      case "high":
        return "bg-orange-500 text-orange-500"
      case "medium":
        return "bg-yellow-500 text-yellow-500"
      case "low":
        return "bg-green-500 text-green-500"
      default:
        return "bg-gray-500 text-gray-500"
    }
  }

  // IT Modules Configuration
  const IT_MODULES = [
    {
      id: "dashboard",
      label: "IT Command Center",
      description: "System monitoring, security oversight, and infrastructure management",
    },
    {
      id: "ai-pipelines",
      label: "AI Pipelines",
      description: "AI model management and analytics pipeline monitoring",
    },
    {
      id: "assets",
      label: "Asset & License Tracker",
      description: "Hardware inventory and software license management",
    },
    {
      id: "backup",
      label: "Backup & Recovery",
      description: "Backup systems monitoring and disaster recovery",
    },
    {
      id: "consultants",
      label: "Consultants",
      description: "External vendor and consultant management",
    },
    {
      id: "email",
      label: "Email Security",
      description: "Email security monitoring and threat detection",
    },
    {
      id: "endpoints",
      label: "Endpoint Management",
      description: "Device security and endpoint protection",
    },
    {
      id: "governance",
      label: "Governance",
      description: "Change management and IT governance processes",
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      description: "Network and server infrastructure monitoring",
    },
    {
      id: "management",
      label: "HB Intel Management",
      description: "User and project management for HB Intel platform",
    },
    {
      id: "siem",
      label: "SIEM & Security",
      description: "Security event monitoring and incident response",
    },
  ]

  // Get current module information
  const getCurrentModule = () => {
    if (!selectedModule) return IT_MODULES[0] // Default to dashboard
    return IT_MODULES.find((module) => module.id === selectedModule) || IT_MODULES[0]
  }

  const currentModule = getCurrentModule()

  // Render module-specific content using comprehensive IT module components
  const renderModuleContent = () => {
    // For IT modules, render the comprehensive module pages directly
    switch (selectedModule) {
      case "ai-pipelines":
        return <AiPipelinesPage />

      case "assets":
        return <AssetTrackerPage />

      case "backup":
        return <BackupPage />

      case "consultants":
        return <ConsultantsPage />

      case "email":
        return <EmailSecurityPage />

      case "endpoints":
        return <EndpointManagementPage />

      case "governance":
        return <GovernancePage />

      case "infrastructure":
        return <InfrastructureMonitorPage />

      case "management":
        return <HBIntelManagementPage />

      case "siem":
        return <SIEMEventMonitorPage />

      default:
        // Default dashboard content
        return (
          <div className="space-y-4">
            {/* IT Operations Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* System Health Chart */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                    System Health Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last 24 Hours</span>
                    <span className="font-medium text-green-600">99.2% Uptime</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Performance Score</span>
                    <span className="font-medium text-blue-600">94/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Index</span>
                    <span className="font-medium text-green-600">98.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Status</span>
                    <span className="font-medium text-green-600">Compliant</span>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Utilization */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Resource Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Server Load</span>
                    <span className="font-medium text-yellow-600">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database Usage</span>
                    <span className="font-medium text-green-600">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bandwidth Usage</span>
                    <span className="font-medium text-blue-600">156 Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Sessions</span>
                    <span className="font-medium">247</span>
                  </div>
                </CardContent>
              </Card>

              {/* Network Health */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4 text-green-600" />
                    Network Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Excellent</div>
                  <p className="text-xs text-muted-foreground">99.9% Uptime</p>
                </CardContent>
              </Card>

              {/* Security Overview */}
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Threats</span>
                    <span className="font-medium text-red-600">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blocked Attempts</span>
                    <span className="font-medium text-yellow-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Firewall Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Security Scan</span>
                    <span className="font-medium">5 min ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-center p-6 bg-background/95 rounded-lg shadow-sm border border-border">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-foreground font-medium text-sm">Loading IT Command Center...</p>
          <p className="text-muted-foreground text-xs mt-1">Preparing your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Dashboard Header - Mirroring other dashboard headers */}
      <div className="mb-4 space-y-3">
        {/* System Status and Edit Mode Controls */}
        <div className="flex items-center justify-between">
          {/* System Status */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">All Systems Operational</span>
          </div>

          {/* Edit Mode Controls */}
          {isEditing && (
            <div className="flex items-center gap-2" data-tour="it-edit-controls">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="text-xs text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-950"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950"
              >
                Reset Layout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCardAdd}
                className="text-xs text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Add Widget
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Full width with conditional rendering based on module selection */}
      <div data-tour="it-dashboard-content">
        {selectedModule && selectedModule !== "dashboard" ? (
          // Module-specific content replaces entire dashboard
          <div className="space-y-4">{renderModuleContent()}</div>
        ) : // Default IT Command Center Dashboard
        currentDashboard ? (
          <div className="space-y-6">
            {/* KPI Dashboard Cards - Full Width */}
            <DashboardLayout
              cards={currentDashboard.cards}
              onLayoutChange={handleLayoutChange}
              onCardRemove={handleCardRemove}
              onCardConfigure={handleCardConfigure}
              onCardSizeChange={handleCardSizeChange}
              onCardAdd={handleCardAdd}
              onSave={handleSave}
              onReset={handleReset}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
              layoutDensity={layoutDensity}
              userRole={user.role}
            />

            {/* Two-Column Layout - Panels Left, Dashboard Grid Right */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column - Monitoring Panels */}
              <div className="xl:col-span-4 space-y-4">
                {/* System Overview */}
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      System Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Users</span>
                      <span className="font-medium">{itSystemMetrics.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Users</span>
                      <span className="font-medium text-green-600">{itSystemMetrics.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">System Uptime</span>
                      <span className="font-medium text-green-600">{itSystemMetrics.systemUptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Managed Devices</span>
                      <span className="font-medium">
                        {itSystemMetrics.managedDevices}/{itSystemMetrics.totalDevices}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Help Desk Panel */}
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Headphones className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Help Desk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open/Total Today</span>
                      <span className="font-medium">
                        {helpDeskMetrics.todayTickets.open}/{helpDeskMetrics.todayTickets.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Resolution</span>
                      <span className="font-medium text-blue-600">{helpDeskMetrics.averageResolutionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SLA Compliance</span>
                      <span className="font-medium text-green-600">{helpDeskMetrics.slaCompliance}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentItActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-2">
                        <div className={`p-1 rounded ${getActivityColor(activity.color)}`}>
                          <activity.icon className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Module Dashboard */}
              <div className="xl:col-span-8">{renderModuleContent()}</div>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">IT Command Center</h2>
              <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
                No IT dashboard layout found. Please contact your administrator to configure the IT Command Center
                dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ITCommandCenterContent({
  user,
  selectedModule,
  onModuleSelect,
  activeTab = "overview",
  onTabChange,
}: ITCommandCenterContentProps) {
  return (
    <DashboardProvider userId={user.id} role={user.role}>
      <ITCommandCenterMainContent user={user} selectedModule={selectedModule} onModuleSelect={onModuleSelect} />
    </DashboardProvider>
  )
}
